import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import RestaurantInteriorView from "@/components/pages/services/RestaurantInterior";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Restaurant Interior");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Restaurant Interior");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <RestaurantInteriorView />
    </>
  );
}
