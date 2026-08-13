import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import RetailKioskView from "@/components/pages/services/RetailKiosk";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/retail-kiosk"),
    fetchServiceDetail("Retail Kiosk"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/retail-kiosk");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/retail-kiosk"),
    fetchServiceDetail("Retail Kiosk"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <RetailKioskView />
    </>
  );
}
