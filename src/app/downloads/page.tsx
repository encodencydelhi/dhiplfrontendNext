import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import DownloadsPageView from "@/components/pages/downloads/DownloadsPage";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/downloads");
  return buildMetadata(seo);
}

export default async function Page() {
  const seo = await fetchPageSeo("/downloads");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <DownloadsPageView />
    </>
  );
}
