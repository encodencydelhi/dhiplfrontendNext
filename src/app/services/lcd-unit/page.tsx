import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import LCDUnitView from "@/components/pages/services/LCDUnit";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/lcd-unit"),
    fetchServiceDetail("Modular LCD Unit"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/lcd-unit");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/lcd-unit"),
    fetchServiceDetail("Modular LCD Unit"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <LCDUnitView />
    </>
  );
}
