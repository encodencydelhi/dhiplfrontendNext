import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import GondolasView from "@/components/pages/services/Gondolas";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Gondolas");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Gondolas");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <GondolasView />
    </>
  );
}
