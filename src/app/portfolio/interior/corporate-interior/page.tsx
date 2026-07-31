import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import CorporateInteriorView from "@/components/pages/portfolio/interior-portfolio/CorporateInterior";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Interiors");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Interiors");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <CorporateInteriorView />
    </>
  );
}
