import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import RetailDisplayView from "@/components/pages/services/RetailDisplay";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Retail Display Merchandising");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Retail Display Merchandising");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <RetailDisplayView />
    </>
  );
}
