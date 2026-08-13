import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, mergePageSeo, fetchServiceDetail, AdvancedSeoTags } from "@/lib/seo";
import ShopPageView from "@/components/pages/portfolio/interior-portfolio/ShopPage";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/interior/shops-in-shops"),
    fetchServiceDetail("Interiors"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/portfolio/interior/shops-in-shops");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/interior/shops-in-shops"),
    fetchServiceDetail("Interiors"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <ShopPageView />
    </>
  );
}
