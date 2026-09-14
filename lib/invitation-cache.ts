import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

interface CachedInvitationMeta {
  id: string;
  isActive: boolean;
  expiresAt: number;
}

const globalForInvitationCache = globalThis as unknown as {
  invitationMetaCache: Map<string, CachedInvitationMeta> | undefined;
};

const metaCache =
  globalForInvitationCache.invitationMetaCache ??
  (globalForInvitationCache.invitationMetaCache = new Map<string, CachedInvitationMeta>());

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export async function getInvitationMeta(
  identifier: string
): Promise<{ id: string; isActive: boolean } | null> {
  const now = Date.now();
  const cached = metaCache.get(identifier);

  if (cached && cached.expiresAt > now) {
    return { id: cached.id, isActive: cached.isActive };
  }

  const cleanSlug = identifier.replace(/^demo-/, "");
  const isCuid = identifier.startsWith("c") && identifier.length > 20;

  let invitation: { id: string; isActive: boolean } | null = null;

  try {
    if (isCuid) {
      invitation = await prisma.invitation.findUnique({
        where: { id: identifier },
        select: { id: true, isActive: true },
      });
    } else {
      invitation = await prisma.invitation.findUnique({
        where: { slug: cleanSlug },
        select: { id: true, isActive: true },
      });

      if (!invitation && cleanSlug !== identifier) {
        invitation = await prisma.invitation.findUnique({
          where: { slug: identifier },
          select: { id: true, isActive: true },
        });
      }
    }
  } catch {
    return null;
  }

  if (invitation) {
    const entry: CachedInvitationMeta = {
      id: invitation.id,
      isActive: invitation.isActive,
      expiresAt: now + CACHE_TTL_MS,
    };
    metaCache.set(identifier, entry);
    metaCache.set(invitation.id, entry);
    metaCache.set(cleanSlug, entry);
    return { id: invitation.id, isActive: invitation.isActive };
  }

  return null;
}

/**
 * Next.js native Data Cache query for public invitation page.
 * Uses Next.js unstable_cache with tag-based on-demand revalidation.
 */
export async function getCachedPublicInvitation(slug: string) {
  const fetcher = unstable_cache(
    async (s: string) => {
      return prisma.invitation.findFirst({
        where: {
          slug: s,
          isActive: true,
        },
        select: {
          id: true,
          slug: true,
          title: true,
          themeId: true,
          coupleInfo: true,
          createdAt: true,
          eventSchedules: {
            select: {
              id: true,
              eventName: true,
              date: true,
              startTime: true,
              endTime: true,
              venueName: true,
              address: true,
              mapsUrl: true,
              latitude: true,
              longitude: true,
            },
            orderBy: { date: "asc" },
          },
          galleries: {
            select: {
              id: true,
              imageUrl: true,
              caption: true,
              sortOrder: true,
            },
            orderBy: { sortOrder: "asc" },
          },
          bankAccounts: {
            select: {
              id: true,
              bankName: true,
              accountNumber: true,
              accountHolder: true,
              qrisImageUrl: true,
            },
          },
        },
      });
    },
    [`public-invitation-${slug}`],
    {
      revalidate: 300,
      tags: [`invitation-${slug}`],
    }
  );

  return fetcher(slug);
}

/**
 * Revalidates Next.js tag-based cache and ISR path for an invitation.
 */
export function revalidateInvitationCache(slug: string, id?: string): void {
  try {
    revalidateTag(`invitation-${slug}`, "max");
    revalidatePath(`/invitation/${slug}`);
  } catch {
    // Next.js cache revalidation error fallback
  }

  metaCache.delete(slug);
  if (id) {
    metaCache.delete(id);
  }
}
