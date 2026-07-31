import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import RetailInteriorView from "@/components/pages/services/RetailInterior";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Retail Interior");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Retail Interior");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <RetailInteriorView />
    </>
  );
}
