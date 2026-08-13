import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import WindowDisplayView from "@/components/pages/services/WindowDisplay";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/window-display"),
    fetchServiceDetail("Window Display"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/window-display");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/window-display"),
    fetchServiceDetail("Window Display"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <WindowDisplayView />
    </>
  );
}
