import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import MDCabinView from "@/components/pages/services/MDCabin";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/md-cabin"),
    fetchServiceDetail("MD Cabin"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/md-cabin");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/md-cabin"),
    fetchServiceDetail("MD Cabin"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <MDCabinView />
    </>
  );
}
