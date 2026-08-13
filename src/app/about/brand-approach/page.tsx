import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import BrandApproachView from "@/components/pages/about/BrandApproach";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/about/brand-approach");
  return buildMetadata(seo, undefined, "/about/brand-approach");
}

export default async function Page() {
  const seo = await fetchPageSeo("/about/brand-approach");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <BrandApproachView />
    </>
  );
}
