import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import WardrobeView from "@/components/pages/services/Wardrobe";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/wardrobe"),
    fetchServiceDetail("Modular Wardrobe"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/wardrobe");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/wardrobe"),
    fetchServiceDetail("Modular Wardrobe"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <WardrobeView />
    </>
  );
}
