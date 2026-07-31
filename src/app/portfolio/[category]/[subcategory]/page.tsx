import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import PortfolioView from "@/components/pages/Portfolio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}): Promise<Metadata> {
  const { category, subcategory } = await params;
  const seo = await fetchPageSeo(`/portfolio/${category}/${subcategory}`);
  return buildMetadata(seo);
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;
  const seo = await fetchPageSeo(`/portfolio/${category}/${subcategory}`);
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <PortfolioView />
    </>
  );
}
