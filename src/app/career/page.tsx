import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import CareerView from "@/components/pages/Career";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/career");
  return buildMetadata(seo);
}

export default async function Page() {
  const seo = await fetchPageSeo("/career");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <CareerView />
    </>
  );
}
