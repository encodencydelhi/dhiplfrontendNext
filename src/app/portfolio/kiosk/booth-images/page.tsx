import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, mergePageSeo, fetchServiceDetail, AdvancedSeoTags } from "@/lib/seo";
import MobileBoothImagesView from "@/components/pages/portfolio/kiosko/MobileBoothImages";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/kiosk/booth-images"),
    fetchServiceDetail("Kiosk"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/portfolio/kiosk/booth-images");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/kiosk/booth-images"),
    fetchServiceDetail("Kiosk"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <MobileBoothImagesView />
    </>
  );
}
