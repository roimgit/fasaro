import { notFound } from "next/navigation";
import PublicInvitationPage, { generateMetadata as baseGenerateMetadata } from "../invitation/[slug]/page";
import type { Metadata } from "next";

export const revalidate = 60;

const RESERVED_SLUGS = new Set(["login", "invitation", "api", "dashboard", "admin", "favicon.ico"]);

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  if (RESERVED_SLUGS.has(slug)) {
    return { title: "Fasaro" };
  }
  return baseGenerateMetadata(props);
}

export default async function RootSlugPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string; theme?: string }>;
}) {
  const { slug } = await props.params;
  if (RESERVED_SLUGS.has(slug)) {
    notFound();
  }
  return PublicInvitationPage(props);
}
