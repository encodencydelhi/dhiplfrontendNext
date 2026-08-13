import type { Metadata } from "next";
import { permanentRedirect, notFound } from "next/navigation";
import { fetchBlogBySlug, fetchPageSeo, mergePageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import BlogDetailView from "@/components/pages/BlogDetail";

const canonicalizeSlug = (slug: string) => {
  let s = slug;
  try { s = decodeURIComponent(slug); } catch {}
  return s.trim().toLowerCase().replace(/\s+/g, "-");
};

async function loadBlogSeo(normalized: string) {
  const [pageSeo, post] = await Promise.all([
    fetchPageSeo(`/blogs/${normalized}`),
    fetchBlogBySlug(normalized),
  ]);
  if (!post) notFound();
  // The Blog model carries metaTitle/metaDescription/ogImage/canonicalTag/
  // schemaMarkup directly on the post — wrap them as the fallback `seo` so an
  // Admin → Add Meta record for the blog path can override per field.
  return mergePageSeo(pageSeo, { seo: { ...post, title: post.title }, title: post.title });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const normalized = canonicalizeSlug(id);
  if (normalized !== id) permanentRedirect(`/blogs/${normalized}`);
  const seo = await loadBlogSeo(normalized);
  return buildMetadata(seo, undefined, `/blogs/${normalized}`);
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const normalized = canonicalizeSlug(id);
  if (normalized !== id) permanentRedirect(`/blogs/${normalized}`);
  const seo = await loadBlogSeo(normalized);
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <BlogDetailView />
    </>
  );
}
