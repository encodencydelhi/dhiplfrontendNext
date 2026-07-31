import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import RetailKioskView from "@/components/pages/services/RetailKiosk";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Retail Kiosk");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Retail Kiosk");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <RetailKioskView />
    </>
  );
}
