import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import MobileBoothView from "@/components/pages/services/MobileBooth";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Mobile Booth");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Mobile Booth");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <MobileBoothView />
    </>
  );
}
