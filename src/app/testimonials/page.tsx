import type { Metadata } from "next";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import TestimonialsPageView from "@/components/pages/TestimonialsPage";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/testimonials");
  return buildMetadata(seo);
}

export default async function Page() {
  const seo = await fetchPageSeo("/testimonials");
  return (
    <>
      <AdvancedSeoTags seo={seo} />
      <TestimonialsPageView />
    </>
  );
}
