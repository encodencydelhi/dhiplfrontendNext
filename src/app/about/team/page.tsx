import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import TeamView from "@/components/pages/about/Team";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/about/team");
  return buildMetadata(seo, undefined, "/about/team");
}

export default async function Page() {
  const seo = await fetchPageSeo("/about/team");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <TeamView />
    </>
  );
}
