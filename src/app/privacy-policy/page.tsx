import type { Metadata } from "next";
import { CalendarCheck, Cookie, ExternalLink, FileText, RefreshCcw, Settings, Share2, ShieldCheck, User, UserCog } from "lucide-react";

import LegalLayout, { COMPANY, type LegalSection } from "@/components/pages/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Design House India",
  description: `How ${COMPANY.name} collects, uses and protects your personal information.`,
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.designhouse.co.in"}/privacy-policy` },
};

const SECTIONS: LegalSection[] = [
  {
    icon: FileText,
    heading: "Introduction",
    body: `${COMPANY.name} is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose and safeguard your information when you visit our website www.designhouse.co.in or interact with us online or offline.`,
  },
  {
    icon: User,
    heading: "Information We Collect",
    body: "We may collect personal information such as your name, phone number, email address, company name, project requirements and location when you fill out enquiry forms, contact us, or subscribe to our updates. We also collect non-personal information such as browser type, device information, pages visited and cookies to improve your experience.",
  },
  {
    icon: Settings,
    heading: "How We Use Your Information",
    body: "We use your information to respond to enquiries, provide services, share relevant updates, improve our website and understand your requirements. We do not use your information for any purpose other than those stated in this policy without your consent.",
  },
  {
    icon: Share2,
    heading: "Sharing of Information",
    body: "We do not sell, trade or rent your personal information to third parties. We may share your information with trusted service providers who assist us in website operations, communication, marketing or project execution, under strict confidentiality obligations, or when required by law.",
  },
  {
    icon: ShieldCheck,
    heading: "Data Security",
    body: "We implement reasonable security measures to protect your personal information from unauthorised access, alteration, disclosure or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
  },
  {
    icon: Cookie,
    heading: "Cookies",
    body: "Our website uses cookies to enhance your browsing experience, analyse website traffic and understand user preferences. You can choose to disable cookies through your browser settings, although this may affect certain website functionalities.",
  },
  {
    icon: ExternalLink,
    heading: "Third-Party Links",
    body: "Our website may contain links to third-party websites for your convenience. We are not responsible for the privacy practices or content of such external websites. We encourage you to review their privacy policies.",
  },
  {
    icon: UserCog,
    heading: "Your Rights",
    body: "You may request access, correction or deletion of your personal information by contacting us at the details provided below. We will respond to your request in a reasonable timeframe, subject to legal obligations.",
  },
  {
    icon: RefreshCcw,
    heading: "Changes to This Privacy Policy",
    body: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated policy will be posted on this page with the revised effective date.",
  },
  {
    icon: CalendarCheck,
    heading: "Contact Us",
    body: `If you have any questions, concerns or requests regarding this Privacy Policy, please contact us at ${COMPANY.email} or call ${COMPANY.phones[0]}.`,
  },
];

export default function Page() {
  return (
    <LegalLayout
      title="Privacy Policy"
      intro="Your privacy is important to us. This policy explains how we collect, use and protect your information."
      sections={SECTIONS}
      numbered
      effectiveNote="This Privacy Policy is effective from the date mentioned above and supersedes all previous versions."
      teamEyebrow="HAVE A QUESTION?"
      teamText="We're here to help with your project requirements."
      cardTitle={["Transforming Spaces", "Creating Experiences"]}
      cardText="From concept to completion, we deliver spaces that inspire."
    />
  );
}
