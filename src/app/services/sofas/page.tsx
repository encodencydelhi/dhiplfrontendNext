import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import SofasView from "@/components/pages/services/Sofas";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Sofas");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Sofas");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <SofasView />
    </>
  );
}
