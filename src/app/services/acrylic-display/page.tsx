import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import AcrylicDisplayView from "@/components/pages/services/AcrylicDisplay";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/acrylic-display"),
    fetchServiceDetail("Acrylic Displays"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/acrylic-display");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/acrylic-display"),
    fetchServiceDetail("Acrylic Displays"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <AcrylicDisplayView />
    </>
  );
}
