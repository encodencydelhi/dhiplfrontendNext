import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import OfficeChairsView from "@/components/pages/services/OfficeChairs";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/office-chairs"),
    fetchServiceDetail("Chairs"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/office-chairs");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/office-chairs"),
    fetchServiceDetail("Chairs"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <OfficeChairsView />
    </>
  );
}
