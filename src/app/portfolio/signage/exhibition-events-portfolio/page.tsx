import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, mergePageSeo, fetchServiceDetail, AdvancedSeoTags } from "@/lib/seo";
import EventsExhibitionView from "@/components/pages/portfolio/signage/EventsExhibition";

// PageTemplate fetches useServiceDetail(category) — the SEO lookup key is the
// category, not the more specific subCategory.
export async function generateMetadata(): Promise<Metadata> {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/signage/exhibition-events-portfolio"),
    fetchServiceDetail("Exhibition & Events"),
  ]);
  return buildMetadata(mergePageSeo(pageSeo, data), undefined, "/portfolio/signage/exhibition-events-portfolio");
}

export default async function Page() {
  const [pageSeo, data] = await Promise.all([
    fetchPageSeo("/portfolio/signage/exhibition-events-portfolio"),
    fetchServiceDetail("Exhibition & Events"),
  ]);
  return (
    <>
      <AdvancedSeoTags seo={mergePageSeo(pageSeo, data)} />
      <EventsExhibitionView />
    </>
  );
}
