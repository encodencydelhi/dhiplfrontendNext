import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import ExhibitionsView from "@/components/pages/services/Exhibitions";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/exhibitions"),
    fetchServiceDetail("Exhibition & Events"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/exhibitions");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/exhibitions"),
    fetchServiceDetail("Exhibition & Events"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <ExhibitionsView />
    </>
  );
}
