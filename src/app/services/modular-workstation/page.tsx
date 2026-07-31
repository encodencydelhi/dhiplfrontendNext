import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import ModularWorkstationView from "@/components/pages/services/ModularWorkstation";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Modular Work Station");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Modular Work Station");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <ModularWorkstationView />
    </>
  );
}
