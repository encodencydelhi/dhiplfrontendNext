import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import RetailInteriorView from "@/components/pages/services/RetailInterior";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/retail-interior"),
    fetchServiceDetail("Retail Interior"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/retail-interior");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/retail-interior"),
    fetchServiceDetail("Retail Interior"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <RetailInteriorView />
    </>
  );
}
