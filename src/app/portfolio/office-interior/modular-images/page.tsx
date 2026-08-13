import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, mergePageSeo, fetchServiceDetail, AdvancedSeoTags } from "@/lib/seo";
import ModularWorkView from "@/components/pages/portfolio/office-interior/ModularWork";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/office-interior/modular-images"),
    fetchServiceDetail("Office Interior"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/portfolio/office-interior/modular-images");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/office-interior/modular-images"),
    fetchServiceDetail("Office Interior"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <ModularWorkView />
    </>
  );
}
