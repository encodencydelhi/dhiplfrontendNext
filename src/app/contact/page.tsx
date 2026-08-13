import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import ContactView from "@/components/pages/Contact";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/contact");
  return buildMetadata(seo, undefined, "/contact");
}

export default async function Page() {
  const seo = await fetchPageSeo("/contact");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <ContactView />
    </>
  );
}
