import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, mergePageSeo, fetchServiceDetail, AdvancedSeoTags } from "@/lib/seo";
import RestaurantView from "@/components/pages/portfolio/interior-portfolio/Restaurant";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/interior/restaurant-interior"),
    fetchServiceDetail("Interiors"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/portfolio/interior/restaurant-interior");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/interior/restaurant-interior"),
    fetchServiceDetail("Interiors"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <RestaurantView />
    </>
  );
}
