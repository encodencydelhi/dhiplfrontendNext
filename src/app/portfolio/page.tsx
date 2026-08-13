import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import PortfolioView from "@/components/pages/Portfolio";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/portfolio");
  return buildMetadata(seo, undefined, "/portfolio");
}

export default async function Page() {
  const seo = await fetchPageSeo("/portfolio");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <PortfolioView />
    </>
  );
}
