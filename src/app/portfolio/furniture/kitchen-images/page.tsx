import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, mergePageSeo, fetchServiceDetail, AdvancedSeoTags } from "@/lib/seo";
import ModularKitchenView from "@/components/pages/portfolio/furniture-portfolio/ModularKitchen";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/furniture/kitchen-images"),
    fetchServiceDetail("Furniture"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/portfolio/furniture/kitchen-images");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/furniture/kitchen-images"),
    fetchServiceDetail("Furniture"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <ModularKitchenView />
    </>
  );
}
