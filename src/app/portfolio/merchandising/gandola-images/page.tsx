import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import GondolaImagesView from "@/components/pages/portfolio/merchnadising/GondolaImages";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Merchandising");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Merchandising");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <GondolaImagesView />
    </>
  );
}
