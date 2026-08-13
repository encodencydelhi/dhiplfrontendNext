import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import MobileBoothView from "@/components/pages/services/MobileBooth";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/mobile-booth"),
    fetchServiceDetail("Mobile Booth"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/mobile-booth");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/mobile-booth"),
    fetchServiceDetail("Mobile Booth"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <MobileBoothView />
    </>
  );
}
