import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import ClientsView from "@/components/pages/Clients";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/clients");
  return buildMetadata(seo);
}

export default async function Page() {
  const seo = await fetchPageSeo("/clients");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <ClientsView />
    </>
  );
}
