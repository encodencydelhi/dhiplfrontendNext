import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import ImagesGalleryView from "@/components/pages/portfolio/ImagesGallery";

const canonicalizeSlug = (slug: string) => slug.trim().toLowerCase().replace(/\s+/g, "-");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalized = canonicalizeSlug(slug);
  if (normalized !== slug) permanentRedirect(`/gallery/${normalized}`);
  const seo = await fetchPageSeo(`/gallery/${normalized}`);
  return buildMetadata(seo);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalized = canonicalizeSlug(slug);
  if (normalized !== slug) permanentRedirect(`/gallery/${normalized}`);
  const seo = await fetchPageSeo(`/gallery/${normalized}`);
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <ImagesGalleryView />
    </>
  );
}