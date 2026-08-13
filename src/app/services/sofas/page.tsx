import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import SofasView from "@/components/pages/services/Sofas";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/sofas"),
    fetchServiceDetail("Sofas"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/sofas");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/sofas"),
    fetchServiceDetail("Sofas"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <SofasView />
    </>
  );
}
