import type { Metadata } from "next";

import LegalPage, { COMPANY, type LegalSection } from "@/components/pages/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer | Design House India",
  description: `Disclaimer for the information, images and project details shown on the ${COMPANY.name} website.`,
};

// Draft content — to be reviewed by Design House before going live
const SECTIONS: LegalSection[] = [
  {
    heading: "General Information",
    body: [
      `The content on this website is provided by ${COMPANY.name} for general information about our interior design, retail display, exhibition and fit-out services. While we make every effort to keep it accurate and up to date, we make no warranties about its completeness, accuracy or suitability for any particular purpose.`,
    ],
  },
  {
    heading: "Projects, Images and Designs",
    body: [
      "Photographs, renders and descriptions of projects are shown for illustration only. Final designs, materials, finishes, dimensions and colours may vary depending on site conditions, availability and the requirements agreed for each project.",
      "Brand names, logos and trademarks of clients that appear in our project images belong to their respective owners and are shown only to present our work.",
    ],
  },
  {
    heading: "No Offer or Commitment",
    body: [
      "Nothing on this website is a binding offer, quotation or contract. Scope, pricing and timelines for any project are confirmed only through a written proposal or agreement with us.",
    ],
  },
  {
    heading: "External Links",
    body: [
      "This website may link to other websites that are not under our control. We are not responsible for their content, availability or privacy practices, and a link does not imply that we endorse them.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      `${COMPANY.name} will not be liable for any loss or damage arising from the use of, or reliance on, information on this website. Please contact us before making decisions based on it.`,
    ],
  },
  {
    heading: "Contact Us",
    body: [
      `If you have any questions about this Disclaimer, please contact ${COMPANY.name}:`,
      [`Email: ${COMPANY.email}`, `Address: ${COMPANY.address}`],
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Website"
      highlight="Disclaimer"
      intro={`Please read this Disclaimer before using the information on the ${COMPANY.name} website.`}
      updated="October 2026"
      sections={SECTIONS}
    />
  );
}
