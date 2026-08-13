import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import AssociatesView from "@/components/pages/about/Associates";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/about/associates");
  return buildMetadata(seo, undefined, "/about/associates");
}

export default async function Page() {
  const seo = await fetchPageSeo("/about/associates");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <AssociatesView />
    </>
  );
}
