import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import CorporateInteriorView from "@/components/pages/services/CorporateInterior";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Corporate Interior");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Corporate Interior");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <CorporateInteriorView />
    </>
  );
}
