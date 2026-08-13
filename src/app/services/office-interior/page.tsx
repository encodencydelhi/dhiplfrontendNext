import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import OfficeInteriorView from "@/components/pages/services/OfficeInterior";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/office-interior"),
    fetchServiceDetail("Office Interior"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/office-interior");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/office-interior"),
    fetchServiceDetail("Office Interior"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <OfficeInteriorView />
    </>
  );
}
