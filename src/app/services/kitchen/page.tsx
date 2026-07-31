import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import KitchenView from "@/components/pages/services/Kitchen";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Modular Kitchen");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Modular Kitchen");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <KitchenView />
    </>
  );
}
