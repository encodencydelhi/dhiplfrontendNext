import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import DressingTableView from "@/components/pages/services/DressingTable";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/dressing-table"),
    fetchServiceDetail("Dressing Table"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/dressing-table");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/dressing-table"),
    fetchServiceDetail("Dressing Table"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <DressingTableView />
    </>
  );
}
