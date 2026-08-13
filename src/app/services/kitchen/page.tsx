import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import KitchenView from "@/components/pages/services/Kitchen";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/kitchen"),
    fetchServiceDetail("Modular Kitchen"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/kitchen");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/kitchen"),
    fetchServiceDetail("Modular Kitchen"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <KitchenView />
    </>
  );
}
