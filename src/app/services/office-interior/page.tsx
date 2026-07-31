import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import OfficeInteriorView from "@/components/pages/services/OfficeInterior";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Office Interior");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Office Interior");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <OfficeInteriorView />
    </>
  );
}
