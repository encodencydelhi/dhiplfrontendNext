import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import AcrylicDisplayView from "@/components/pages/services/AcrylicDisplay";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Acrylic Displays");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Acrylic Displays");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <AcrylicDisplayView />
    </>
  );
}
