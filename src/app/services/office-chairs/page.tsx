import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import OfficeChairsView from "@/components/pages/services/OfficeChairs";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Chairs");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Chairs");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <OfficeChairsView />
    </>
  );
}
