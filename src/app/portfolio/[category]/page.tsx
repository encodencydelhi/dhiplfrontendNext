import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import PortfolioView from "@/components/pages/Portfolio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const seo = await fetchPageSeo(`/portfolio/${category}`);
  return buildMetadata(seo);
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const seo = await fetchPageSeo(`/portfolio/${category}`);
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <PortfolioView />
    </>
  );
}
