import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import RestaurantInteriorView from "@/components/pages/services/RestaurantInterior";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/restaurant-interior"),
    fetchServiceDetail("Restaurant Interior"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/restaurant-interior");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/restaurant-interior"),
    fetchServiceDetail("Restaurant Interior"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <RestaurantInteriorView />
    </>
  );
}
