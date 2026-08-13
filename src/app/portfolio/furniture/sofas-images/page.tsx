import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, mergePageSeo, fetchServiceDetail, AdvancedSeoTags } from "@/lib/seo";
import SofasImagesView from "@/components/pages/portfolio/furniture-portfolio/SofasImages";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/furniture/sofas-images"),
    fetchServiceDetail("Furniture"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/portfolio/furniture/sofas-images");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/furniture/sofas-images"),
    fetchServiceDetail("Furniture"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <SofasImagesView />
    </>
  );
}
