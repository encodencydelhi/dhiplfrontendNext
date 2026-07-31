import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import BlogsView from "@/components/pages/Blogs";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/blogs");
  return buildMetadata(seo);
}

export default async function Page() {
  const seo = await fetchPageSeo("/blogs");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <BlogsView />
    </>
  );
}
