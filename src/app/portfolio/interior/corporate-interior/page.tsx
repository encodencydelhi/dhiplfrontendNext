import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, mergePageSeo, fetchServiceDetail, AdvancedSeoTags } from "@/lib/seo";
import CorporateInteriorView from "@/components/pages/portfolio/interior-portfolio/CorporateInterior";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/interior/corporate-interior"),
    fetchServiceDetail("Interiors"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/portfolio/interior/corporate-interior");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/interior/corporate-interior"),
    fetchServiceDetail("Interiors"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <CorporateInteriorView />
    </>
  );
}
