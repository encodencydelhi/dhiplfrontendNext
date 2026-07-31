import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import ModularLcdUnitView from "@/components/pages/portfolio/furniture-portfolio/ModularLcdUnit";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Furniture");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Furniture");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <ModularLcdUnitView />
    </>
  );
}
