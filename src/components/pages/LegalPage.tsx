import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";

export interface LegalSection {
  heading: string;
  body: (string | string[])[]; // a string is a paragraph, a string[] is a bullet list
}

export const COMPANY = {
  name: "Design House India Pvt. Ltd.",
  email: "info@designhouse.co.in",
  address: "Plot No. 12/29, Site II Industrial Area, Loni Road, Mohan Nagar, Ghaziabad, Uttar Pradesh – 201007, India",
};

// Shared layout for the Privacy Policy and Terms & Conditions pages
const LegalPage = ({
  title,
  highlight,
  intro,
  updated,
  sections,
}: {
  title: string;
  highlight: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) => (
  <div className="min-h-screen bg-white overflow-x-hidden font-sans">
    <Topbar />
    <Navbar solid />

    <main className="pt-[56px] sm:pt-[72px]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:pl-11 lg:pr-8 pt-6 pb-16">
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-sm text-gray-600 mb-5">
          <Link href="/" className="inline-flex items-center gap-2 hover:text-[#134698] transition-colors">
            <Home className="w-4 h-4 text-[#134698]" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#DE802B]">
            {title} {highlight}
          </span>
        </nav>

        <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#DE802B] mb-2">Design House India</p>
        <h1 className="font-display font-bold text-[#134698] text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.1] mb-3">
          {title} <span className="text-[#DE802B]">{highlight}</span>
        </h1>
        <p className="text-gray-700 text-[15px] md:text-base leading-relaxed max-w-3xl">{intro}</p>
        <p className="mt-2 text-sm text-gray-500">Last updated: {updated}</p>
        <div className="h-0.5 w-12 bg-[#DE802B] mt-4 mb-8" />

        <div className="max-w-4xl space-y-7">
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="font-display font-bold text-[#134698] text-xl md:text-2xl mb-2">
                <span className="text-[#DE802B] mr-2">{String(i + 1).padStart(2, "0")}.</span>
                {s.heading}
              </h2>
              <div className="space-y-2.5 text-[15px] text-gray-700 leading-relaxed">
                {s.body.map((block, j) =>
                  Array.isArray(block) ? (
                    <ul key={j} className="list-disc pl-5 space-y-1.5 marker:text-[#DE802B]">
                      {block.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={j}>{block}</p>
                  )
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

export default LegalPage;
