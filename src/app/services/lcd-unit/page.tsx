import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import LCDUnitView from "@/components/pages/services/LCDUnit";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Modular LCD Unit");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Modular LCD Unit");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <LCDUnitView />
    </>
  );
}
