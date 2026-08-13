import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, mergePageSeo, fetchServiceDetail, AdvancedSeoTags } from "@/lib/seo";
import SignageImagesView from "@/components/pages/portfolio/signage/SignageImages";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/signage/signage-portfolio"),
    fetchServiceDetail("Signage"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/portfolio/signage/signage-portfolio");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/signage/signage-portfolio"),
    fetchServiceDetail("Signage"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <SignageImagesView />
    </>
  );
}
