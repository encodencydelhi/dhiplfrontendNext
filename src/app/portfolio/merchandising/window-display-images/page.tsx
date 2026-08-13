import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, mergePageSeo, fetchServiceDetail, AdvancedSeoTags } from "@/lib/seo";
import WindowImagesView from "@/components/pages/portfolio/merchnadising/WindowImages";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/merchandising/window-display-images"),
    fetchServiceDetail("Merchandising"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/portfolio/merchandising/window-display-images");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/merchandising/window-display-images"),
    fetchServiceDetail("Merchandising"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <WindowImagesView />
    </>
  );
}
