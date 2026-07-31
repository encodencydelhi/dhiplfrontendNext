import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import ImagesGalleryView from "@/components/pages/portfolio/ImagesGallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = await fetchPageSeo(`/gallery/${slug}`);
  return buildMetadata(seo);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seo = await fetchPageSeo(`/gallery/${slug}`);
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <ImagesGalleryView />
    </>
  );
}
