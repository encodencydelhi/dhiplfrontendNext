import type { Metadata } from "next";

import LegalPage, { COMPANY, type LegalSection } from "@/components/pages/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Design House India",
  description: `How ${COMPANY.name} collects, uses and protects your personal information.`,
};

// Draft content — to be reviewed by Design House before going live
const SECTIONS: LegalSection[] = [
  {
    heading: "Information We Collect",
    body: [
      "We collect information that you choose to share with us when you use our website, including:",
      [
        "Contact details such as your name, email address, phone number and company name when you submit an enquiry, book a consultation or contact us.",
        "Application details such as your CV, qualifications and work experience when you apply for a position through our Careers section.",
        "Basic technical information such as your browser type, device and pages visited, collected through cookies and similar technologies.",
      ],
    ],
  },
  {
    heading: "How We Use Your Information",
    body: [
      [
        "To respond to your enquiries and provide the services you request.",
        "To schedule consultations, share quotations and keep you updated on your project.",
        "To review job applications and contact shortlisted candidates.",
        "To improve our website, services and user experience.",
        "To meet legal and regulatory obligations.",
      ],
    ],
  },
  {
    heading: "CV Eligibility Check",
    body: [
      "When you use the eligibility check on our Careers pages, your CV is read and analysed within your own browser to show a match score. It is not uploaded to our servers as part of this check. Your CV is only shared with us if you choose to submit an application.",
    ],
  },
  {
    heading: "Sharing of Information",
    body: [
      "We do not sell or rent your personal information. We may share it only with trusted service providers who help us operate our website and business (for example, hosting or email providers), under confidentiality obligations, or where required by law.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "Our website uses cookies to remember your preferences and understand how visitors use the site. You can disable cookies in your browser settings, although some parts of the website may not work as intended.",
    ],
  },
  {
    heading: "Data Security and Retention",
    body: [
      "We use reasonable technical and organisational measures to protect your information against unauthorised access, loss or misuse. We keep personal information only for as long as needed for the purposes described in this policy or as required by law.",
    ],
  },
  {
    heading: "Your Rights",
    body: [
      "You may request access to, correction of, or deletion of the personal information we hold about you, or withdraw your consent to communications at any time, by contacting us using the details below.",
    ],
  },
  {
    heading: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.",
    ],
  },
  {
    heading: "Contact Us",
    body: [
      `If you have any questions about this Privacy Policy, please contact ${COMPANY.name}:`,
      [`Email: ${COMPANY.email}`, `Address: ${COMPANY.address}`],
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Privacy"
      highlight="Policy"
      intro={`This Privacy Policy explains how ${COMPANY.name} collects, uses and protects the information you share with us through this website.`}
      updated="October 2026"
      sections={SECTIONS}
    />
  );
}
