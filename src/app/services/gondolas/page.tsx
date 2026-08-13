import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import GondolasView from "@/components/pages/services/Gondolas";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/gondolas"),
    fetchServiceDetail("Gondolas"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/gondolas");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/gondolas"),
    fetchServiceDetail("Gondolas"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <GondolasView />
    </>
  );
}
