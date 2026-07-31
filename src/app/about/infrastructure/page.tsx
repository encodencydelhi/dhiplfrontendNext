import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import InfrastructureView from "@/components/pages/about/Infrastructure";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/about/infrastructure");
  return buildMetadata(seo);
}

export default async function Page() {
  const seo = await fetchPageSeo("/about/infrastructure");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <InfrastructureView />
    </>
  );
}
