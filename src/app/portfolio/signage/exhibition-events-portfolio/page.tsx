import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import EventsExhibitionView from "@/components/pages/portfolio/signage/EventsExhibition";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("Exhibition & Events");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("Exhibition & Events");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <EventsExhibitionView />
    </>
  );
}
