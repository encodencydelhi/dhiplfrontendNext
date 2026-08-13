import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, mergePageSeo, fetchServiceDetail, AdvancedSeoTags } from "@/lib/seo";
import ModularLcdUnitView from "@/components/pages/portfolio/furniture-portfolio/ModularLcdUnit";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/furniture/lcd-unit-images"),
    fetchServiceDetail("Furniture"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/portfolio/furniture/lcd-unit-images");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/furniture/lcd-unit-images"),
    fetchServiceDetail("Furniture"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <ModularLcdUnitView />
    </>
  );
}
