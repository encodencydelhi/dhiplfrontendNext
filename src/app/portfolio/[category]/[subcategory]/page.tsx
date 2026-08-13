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
  params: Promise<{ category: string; subcategory: string }>;
}): Promise<Metadata> {
  const { category, subcategory } = await params;
  const cat = canonicalizeSlug(category);
  const sub = canonicalizeSlug(subcategory);
  if (cat !== category || sub !== subcategory) {
    permanentRedirect(`/portfolio/${cat}/${sub}`);
  }
  const seo = await fetchPageSeo(`/portfolio/${cat}/${sub}`);
  return buildMetadata(seo, undefined, `/portfolio/${cat}/${sub}`);
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;
  const cat = canonicalizeSlug(category);
  const sub = canonicalizeSlug(subcategory);
  if (cat !== category || sub !== subcategory) {
    permanentRedirect(`/portfolio/${cat}/${sub}`);
  }
  const seo = await fetchPageSeo(`/portfolio/${cat}/${sub}`);
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <PortfolioView />
    </>
  );
}