import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import MdCabinView from "@/components/pages/portfolio/office-interior/MdCabin";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Office Interior");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Office Interior");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <MdCabinView />
    </>
  );
}
