import type { Metadata } from "next";
import { fetchBlogBySlug, buildBlogMetadata, AdvancedSeoTags } from "@/lib/seo";
import BlogDetailView from "@/components/pages/BlogDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchBlogBySlug(id);
  return buildBlogMetadata(post);
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await fetchBlogBySlug(id);
  return (
    <>
      <AdvancedSeoTags seo={post} />
      <BlogDetailView />
    </>
  );
}
