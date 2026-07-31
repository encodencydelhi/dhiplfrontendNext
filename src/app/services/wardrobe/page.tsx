import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import WardrobeView from "@/components/pages/services/Wardrobe";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Modular Wardrobe");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Modular Wardrobe");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <WardrobeView />
    </>
  );
}
