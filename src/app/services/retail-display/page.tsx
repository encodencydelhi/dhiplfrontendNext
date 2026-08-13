import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import RetailDisplayView from "@/components/pages/services/RetailDisplay";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/retail-display"),
    fetchServiceDetail("Retail Display Merchandising"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/retail-display");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/retail-display"),
    fetchServiceDetail("Retail Display Merchandising"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <RetailDisplayView />
    </>
  );
}
