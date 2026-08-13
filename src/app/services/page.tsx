import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import ServicesView from "@/components/pages/Services";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/services");
  return buildMetadata(seo, undefined, "/services");
}

export default async function Page() {
  const seo = await fetchPageSeo("/services");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <ServicesView />
    </>
  );
}
