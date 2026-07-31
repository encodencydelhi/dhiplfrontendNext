import type { Metadata } from "next";
import { fetchServiceDetail, buildServiceMetadata, serviceDetailSeo, AdvancedSeoTags } from "@/lib/seo";
import MDCabinView from "@/components/pages/services/MDCabin";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceDetail("MD Cabin");
  return buildServiceMetadata(data);
}

export default async function Page() {
  const data = await fetchServiceDetail("MD Cabin");
  return (
    <>
      <AdvancedSeoTags seo={serviceDetailSeo(data)} />
      <MDCabinView />
    </>
  );
}
