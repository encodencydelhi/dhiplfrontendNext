import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import AboutView from "@/components/pages/About";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/about");
  return buildMetadata(seo);
}

export default async function Page() {
  const seo = await fetchPageSeo("/about");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <AboutView />
    </>
  );
}
