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
