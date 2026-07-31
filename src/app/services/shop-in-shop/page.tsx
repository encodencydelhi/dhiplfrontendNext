import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import ShopInShopView from "@/components/pages/services/ShopInShop";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Shop In Shops");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Shop In Shops");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <ShopInShopView />
    </>
  );
}
