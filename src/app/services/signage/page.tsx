import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import SignageView from "@/components/pages/services/Signage";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/signage"),
    fetchServiceDetail("Signage"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/signage");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/signage"),
    fetchServiceDetail("Signage"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <SignageView />
    </>
  );
}
