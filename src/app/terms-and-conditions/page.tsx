import type { Metadata } from "next";

import LegalPage, { COMPANY, type LegalSection } from "@/components/pages/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | Design House India",
  description: `Terms and conditions for using the ${COMPANY.name} website.`,
};

// Draft content — to be reviewed by Design House before going live
const SECTIONS: LegalSection[] = [
  {
    heading: "Acceptance of Terms",
    body: [
      `By accessing or using this website, you agree to these Terms & Conditions. If you do not agree, please do not use the website. The website is operated by ${COMPANY.name}.`,
    ],
  },
  {
    heading: "Use of the Website",
    body: [
      "You agree to use this website only for lawful purposes. You must not:",
      [
        "Use the website in any way that could damage, disable or impair it.",
        "Attempt to gain unauthorised access to any part of the website or its systems.",
        "Submit false, misleading or harmful information through our forms.",
      ],
    ],
  },
  {
    heading: "Intellectual Property",
    body: [
      `All content on this website, including text, images, project photographs, designs, logos and graphics, is the property of ${COMPANY.name} or its licensors. It may not be copied, reproduced or used without our prior written permission.`,
    ],
  },
  {
    heading: "Project Information and Quotations",
    body: [
      "Project images, descriptions and information on this website are for general reference only. Any quotation, timeline or scope of work is binding only when confirmed in a written agreement between you and Design House.",
    ],
  },
  {
    heading: "Careers and Eligibility Check",
    body: [
      "The match score shown by the CV eligibility check is an automated indication based on your CV and the job requirements. It is not a hiring decision or an offer of employment. All applications are reviewed by our HR team.",
    ],
  },
  {
    heading: "Third-Party Links",
    body: [
      "Our website may contain links to third-party websites. We are not responsible for the content, policies or practices of those websites.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      "While we make every effort to keep the information on this website accurate and up to date, we do not guarantee its completeness or accuracy. Design House shall not be liable for any loss or damage arising from the use of this website.",
    ],
  },
  {
    heading: "Changes to These Terms",
    body: [
      "We may update these Terms & Conditions from time to time. Continued use of the website after changes are posted means you accept the updated terms.",
    ],
  },
  {
    heading: "Governing Law",
    body: ["These Terms & Conditions are governed by the laws of India."],
  },
  {
    heading: "Contact Us",
    body: [
      `For any questions about these Terms & Conditions, please contact ${COMPANY.name}:`,
      [`Email: ${COMPANY.email}`, `Address: ${COMPANY.address}`],
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Terms &"
      highlight="Conditions"
      intro={`These Terms & Conditions govern your use of the ${COMPANY.name} website. Please read them carefully.`}
      updated="October 2026"
      sections={SECTIONS}
    />
  );
}
