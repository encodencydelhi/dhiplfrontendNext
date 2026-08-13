import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import VideoView from "@/components/pages/portfolio/videos/Video";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/portfolio/videos");
  return buildMetadata(seo, undefined, "/portfolio/videos");
}

export default async function Page() {
  const seo = await fetchPageSeo("/portfolio/videos");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <VideoView />
    </>
  );
}
