import type { Metadata } from "next";

import DisclaimerView from "@/components/pages/Disclaimer";
import { COMPANY } from "@/components/pages/LegalLayout";

export const metadata: Metadata = {
  title: "Disclaimer | Design House India",
  description: `Important information about the use of the ${COMPANY.name} website, its content, project images and external links.`,
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.designhouse.co.in"}/disclaimer` },
};

export default function Page() {
  return <DisclaimerView />;
}
