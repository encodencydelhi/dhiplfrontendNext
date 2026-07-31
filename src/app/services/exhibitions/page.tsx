import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import ExhibitionsView from "@/components/pages/services/Exhibitions";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Exhibition & Events");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Exhibition & Events");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <ExhibitionsView />
    </>
  );
}
