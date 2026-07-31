import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import SignageView from "@/components/pages/services/Signage";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Signage");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Signage");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <SignageView />
    </>
  );
}
