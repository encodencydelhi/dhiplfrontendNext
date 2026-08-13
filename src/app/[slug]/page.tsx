import type { Metadata } from "next";
import { permanentRedirect, notFound } from "next/navigation";
import { fetchCustomPageBySlug, fetchPageSeo, mergePageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import DynamicLocationPageView from "@/components/pages/DynamicLocationPage";

// This only matches paths not already claimed by a more specific static route
// above it (about/, services/, portfolio/, blogs/, etc.) — Next.js prefers
// static segments over a dynamic sibling at the same depth, exactly mirroring
// the original React Router setup where "/:slug" was registered last.
const canonicalizeSlug = (slug: string) => {
  let s = slug;
  try { s = decodeURIComponent(slug); } catch {}
  return s.trim().toLowerCase().replace(/\s+/g, "-");
};

async function loadPageData(normalized: string) {
  const [pageSeo, pageData] = await Promise.all([
    fetchPageSeo(`/${normalized}`),
    fetchCustomPageBySlug(normalized),
  ]);
  if (!pageData) notFound();
  // Admin → Add Meta record (page-path keyed) wins per field; the custom
  // page's own `seo` object is the fallback so both editors keep working.
  return mergePageSeo(pageSeo, pageData);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalized = canonicalizeSlug(slug);
  if (normalized !== slug) permanentRedirect(`/${normalized}`);
  const seo = await loadPageData(normalized);
  return buildMetadata(seo, undefined, `/${normalized}`);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalized = canonicalizeSlug(slug);
  if (normalized !== slug) permanentRedirect(`/${normalized}`);
  const seo = await loadPageData(normalized);
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <DynamicLocationPageView />
    </>
  );
}
