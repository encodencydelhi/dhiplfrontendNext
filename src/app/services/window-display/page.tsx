import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import WindowDisplayView from "@/components/pages/services/WindowDisplay";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Window Display");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Window Display");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <WindowDisplayView />
    </>
  );
}
