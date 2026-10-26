import { FileText, Image as ImageIcon, Link2, RefreshCcw, ShieldCheck, UsersRound } from "lucide-react";

import LegalLayout, { COMPANY, InlineLink, tel, type LegalSection } from "@/components/pages/LegalLayout";

const SECTIONS: LegalSection[] = [
  {
    icon: FileText,
    heading: "General Information",
    body: "All content, including text, images, project photographs, graphics and other materials on this website is provided in good faith for general information and showcase purposes only. While we strive to keep the information accurate and up to date, we make no warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability of the information.",
  },
  {
    icon: ImageIcon,
    heading: "Project Images & Intellectual Property",
    body: `All project images, designs, concepts, layouts and other creative content displayed on this website are the property of ${COMPANY.name} or their respective owners. These are intended to showcase our design and execution capabilities. Unauthorised use, reproduction or distribution of any content without prior written permission is strictly prohibited.`,
  },
  {
    icon: Link2,
    heading: "External Links",
    body: "This website may contain links to third-party websites for your convenience. We do not endorse or take responsibility for the content, accuracy, or practices of any external websites. Visiting such links is at your own risk.",
  },
  {
    icon: UsersRound,
    heading: "No Professional Advice",
    body: "The content on this website does not constitute professional, legal or commercial advice. For project-specific requirements, please contact our team directly for expert consultation.",
  },
  {
    icon: ShieldCheck,
    heading: "Limitation of Liability",
    body: `Under no circumstances shall ${COMPANY.name} be liable for any direct, indirect, incidental or consequential damages arising from the use of this website or reliance on any information provided herein.`,
  },
  {
    icon: RefreshCcw,
    heading: "Changes to This Disclaimer",
    body: "We may update this disclaimer from time to time without prior notice. Any changes will be posted on this page with the revised effective date.",
  },
];

const Disclaimer = () => (
  <LegalLayout
    title="Disclaimer"
    intro="Important information about the use of this website and its content."
    sections={SECTIONS}
    effectiveNote={
      <>
        If you have any questions regarding this disclaimer, please contact us at{" "}
        <InlineLink href={`mailto:${COMPANY.email}`}>{COMPANY.email}</InlineLink> or call{" "}
        <InlineLink href={tel(COMPANY.phones[0])}>{COMPANY.phones[0]}</InlineLink>.
      </>
    }
    teamEyebrow="Need More Information?"
    teamText="Get expert guidance for your project requirements."
    cardTitle={["Transforming Spaces", "Creating Experiences"]}
    cardText="From concept to completion, we deliver spaces that inspire."
  />
);

export default Disclaimer;
