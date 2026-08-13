import type { Metadata } from "next";
import { permanentRedirect, notFound } from "next/navigation";
import { fetchCustomPageBySlug, buildCustomPageMetadata, AdvancedSeoTags } from "@/lib/seo";
import DynamicLocationPageView from "@/components/pages/DynamicLocationPage";

// This only matches paths not already claimed by a more specific static route
// above it (about/, services/, portfolio/, blogs/, etc.) — Next.js prefers
// static segments over a dynamic sibling at the same depth, exactly mirroring
// the original React Router setup where "/:slug" was registered last.
const canonicalizeSlug = (slug: string) => slug.trim().toLowerCase().replace(/\s+/g, "-");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalized = canonicalizeSlug(slug);
  if (normalized !== slug) permanentRedirect(`/${normalized}`);
  const pageData = await fetchCustomPageBySlug(normalized);
  if (!pageData) notFound();
  return buildCustomPageMetadata(pageData);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalized = canonicalizeSlug(slug);
  if (normalized !== slug) permanentRedirect(`/${normalized}`);
  const pageData = await fetchCustomPageBySlug(normalized);
  if (!pageData) notFound();
  return (
    <>
      <AdvancedSeoTags seo={pageData?.seo} />
      <DynamicLocationPageView />
    </>
  );
}