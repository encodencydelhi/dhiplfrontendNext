import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, mergePageSeo, fetchServiceDetail, AdvancedSeoTags } from "@/lib/seo";
import AcrylicTableTopsView from "@/components/pages/portfolio/merchnadising/AcrylicTableTops";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/merchandising/acrylic-images"),
    fetchServiceDetail("Merchandising"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/portfolio/merchandising/acrylic-images");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/merchandising/acrylic-images"),
    fetchServiceDetail("Merchandising"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <AcrylicTableTopsView />
    </>
  );
}
