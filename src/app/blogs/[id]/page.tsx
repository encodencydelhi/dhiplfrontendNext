import type { Metadata } from "next";
import { permanentRedirect, notFound } from "next/navigation";
import { fetchBlogBySlug, buildBlogMetadata, AdvancedSeoTags } from "@/lib/seo";
import BlogDetailView from "@/components/pages/BlogDetail";

const canonicalizeSlug = (slug: string) => slug.trim().toLowerCase().replace(/\s+/g, "-");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const normalized = canonicalizeSlug(id);
  if (normalized !== id) permanentRedirect(`/blogs/${normalized}`);
  const post = await fetchBlogBySlug(normalized);
  if (!post) notFound();
  return buildBlogMetadata(post);
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const normalized = canonicalizeSlug(id);
  if (normalized !== id) permanentRedirect(`/blogs/${normalized}`);
  const post = await fetchBlogBySlug(normalized);
  if (!post) notFound();
  return (
    <>
      <AdvancedSeoTags seo={post} />
      <BlogDetailView />
    </>
  );
}