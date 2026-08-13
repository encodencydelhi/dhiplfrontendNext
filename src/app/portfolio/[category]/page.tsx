import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import PortfolioView from "@/components/pages/Portfolio";

const canonicalizeSlug = (slug: string) => {
  let s = slug;
  try { s = decodeURIComponent(slug); } catch {}
  return s.trim().toLowerCase().replace(/\s+/g, "-");
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = canonicalizeSlug(category);
  if (cat !== category) permanentRedirect(`/portfolio/${cat}`);
  const seo = await fetchPageSeo(`/portfolio/${cat}`);
  return buildMetadata(seo, undefined, `/portfolio/${cat}`);
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = canonicalizeSlug(category);
  if (cat !== category) permanentRedirect(`/portfolio/${cat}`);
  const seo = await fetchPageSeo(`/portfolio/${cat}`);
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <PortfolioView />
    </>
  );
}