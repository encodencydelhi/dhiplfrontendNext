import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import ModularWorkstationView from "@/components/pages/services/ModularWorkstation";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/modular-workstation"),
    fetchServiceDetail("Modular Work Station"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/modular-workstation");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/modular-workstation"),
    fetchServiceDetail("Modular Work Station"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <ModularWorkstationView />
    </>
  );
}
