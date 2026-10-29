import type { Metadata } from "next";
import {
  CalendarDays,
  FileText,
  IndianRupee,
  Link2,
  Mail,
  Monitor,
  RefreshCcw,
  Settings,
  ShieldCheck,
  User,
  Users,
  FileBadge,
} from "lucide-react";

import LegalLayout, { COMPANY, type LegalSection } from "@/components/pages/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions | Design House India",
  description: `Terms and conditions for using the ${COMPANY.name} website and services.`,
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.designhouse.co.in"}/terms-and-conditions` },
};

const SECTIONS: LegalSection[] = [
  {
    icon: FileText,
    heading: "Acceptance of Terms",
    body: "By accessing or using our website (www.designhouse.co.in) or engaging our services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website or services.",
  },
  {
    icon: User,
    heading: "About Us",
    body: `${COMPANY.name} provides turnkey interior design, retail display, merchandising and exhibition solutions. The information on this website is for general information and showcase purposes only and does not constitute a binding offer.`,
  },
  {
    icon: Settings,
    heading: "Use of Website",
    body: "You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website. Unauthorized use, data mining, or any activity that disrupts the website is prohibited.",
  },
  {
    icon: Monitor,
    heading: "Services & Enquiries",
    body: "Enquiries submitted through our website are non-binding and do not automatically create a contract. Project scope, specifications, pricing, timelines and all commercial terms will be confirmed in a separate written agreement.",
  },
  {
    icon: FileBadge,
    heading: "Intellectual Property",
    body: `All content on this website, including text, images, designs, layouts, graphics, logos and project photographs, is the property of ${COMPANY.name} or its respective owners. Unauthorized use, reproduction or distribution is strictly prohibited.`,
  },
  {
    icon: Users,
    heading: "Client Responsibilities",
    body: "Clients are responsible for providing accurate information, approvals, and timely feedback required for project execution. Any delays due to incomplete information or late approvals may impact project timelines and costs.",
  },
  {
    icon: IndianRupee,
    heading: "Quotes, Pricing & Payments",
    body: "All quotations are valid for a limited period as specified. Prices are exclusive of applicable taxes unless stated otherwise. Payment terms, milestones and other commercial conditions will be as per the project agreement.",
  },
  {
    icon: CalendarDays,
    heading: "Project Execution",
    body: "Project timelines are estimates and may vary due to factors beyond our control, such as site conditions, approvals, material availability or changes requested by the client. We will make reasonable efforts to meet agreed timelines.",
  },
  {
    icon: ShieldCheck,
    heading: "Limitation of Liability",
    body: `To the maximum extent permitted by law, ${COMPANY.name} shall not be liable for any direct, indirect, incidental or consequential damages arising from the use of this website or our services.`,
  },
  {
    icon: Link2,
    heading: "Third-Party Links",
    body: "Our website may contain links to third-party websites for your convenience. We do not endorse or take responsibility for their content, accuracy or practices.",
  },
  {
    icon: RefreshCcw,
    heading: "Changes to Terms",
    body: "We may update these Terms & Conditions from time to time without prior notice. The updated version will be posted on this page with the revised effective date.",
  },
  {
    icon: Mail,
    heading: "Contact Us",
    body: `If you have any questions regarding these Terms & Conditions, please contact us at ${COMPANY.email} or call ${COMPANY.phones[0]}.`,
  },
];

export default function Page() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      intro="These terms and conditions govern your use of our website and our services. Please read them carefully."
      sections={SECTIONS}
      numbered
      effectiveNote="These Terms & Conditions are effective from the date mentioned above and supersede all previous versions."
      teamEyebrow="HAVE A QUESTION?"
      teamText="We're here to help with your project requirements."
      cardTitle={["From Concept to", "Lasting Impressions"]}
      cardText="We design and build spaces that inspire brands, engage people and deliver results."
    />
  );
}
