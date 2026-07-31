import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import DressingTableView from "@/components/pages/services/DressingTable";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Dressing Table");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Dressing Table");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <DressingTableView />
    </>
  );
}
