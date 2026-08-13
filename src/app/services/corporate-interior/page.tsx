import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import CorporateInteriorView from "@/components/pages/services/CorporateInterior";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/corporate-interior"),
    fetchServiceDetail("Corporate Interior"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/corporate-interior");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/corporate-interior"),
    fetchServiceDetail("Corporate Interior"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <CorporateInteriorView />
    </>
  );
}
