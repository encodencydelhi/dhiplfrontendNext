import type { Metadata } from "next";
import { fetchCustomPageBySlug, buildCustomPageMetadata, AdvancedSeoTags } from "@/lib/seo";
import DynamicLocationPageView from "@/components/pages/DynamicLocationPage";

// This only matches paths not already claimed by a more specific static route
// above it (about/, services/, portfolio/, blogs/, etc.) — Next.js prefers
// static segments over a dynamic sibling at the same depth, exactly mirroring
// the original React Router setup where "/:slug" was registered last.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await fetchCustomPageBySlug(slug);
  return buildCustomPageMetadata(pageData);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageData = await fetchCustomPageBySlug(slug);
  return (
    <>
      <AdvancedSeoTags seo={pageData?.seo} />
      <DynamicLocationPageView />
    </>
  );
}
