import type { Metadata } from "next";
import { fetchServiceDetail, fetchPageSeo, buildMetadata, mergePageSeo, AdvancedSeoTags } from "@/lib/seo";
import ShopInShopView from "@/components/pages/services/ShopInShop";

export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/shop-in-shop"),
    fetchServiceDetail("Shop In Shops"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/services/shop-in-shop");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/services/shop-in-shop"),
    fetchServiceDetail("Shop In Shops"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <ShopInShopView />
    </>
  );
}
