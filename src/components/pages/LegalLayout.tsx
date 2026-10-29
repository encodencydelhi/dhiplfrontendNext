import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, Clock, Mail, Phone, Send, type LucideIcon } from "lucide-react";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import heroImg from "@/assets/banner/disclam.webp";
import storeImg from "@/assets/image/disclaimer.webp";

/* Shared layout for the Disclaimer, Privacy Policy and Terms & Conditions pages:
   hero, icon + text sections, an effective-date box, and a "Talk to Our Team" sidebar. */

export const COMPANY = {
  name: "Design House India Pvt. Ltd.",
  email: "info@designhouse.co.in",
  phones: ["+91 9654900525", "+91 9810247319"],
};

export const EFFECTIVE_DATE = "25 October 2026";

export type LegalSection = { icon: LucideIcon; heading: string; body: string };

export const tel = (p: string) => `tel:${p.replace(/[^0-9+]/g, "")}`;

// Blue link inside the body text (email / phone)
export const InlineLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className="font-medium text-[#134698] hover:text-[#E8742A] transition-colors">
    {children}
  </a>
);

// Icon in a round tile on the navy "Talk to Our Team" card
const TeamRow = ({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) => (
  <div className="flex items-center gap-4">
    <span className="w-12 h-12 rounded-full bg-white/10 ring-1 ring-white/15 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-white" />
    </span>
    <div className="text-[15px] leading-relaxed text-white">{children}</div>
  </div>
);

const LegalLayout = ({
  title,
  intro,
  sections,
  numbered = false,
  effectiveNote,
  teamEyebrow,
  teamText,
  cardTitle,
  cardText,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  numbered?: boolean; // 01, 02… between the icon and the heading
  effectiveNote: ReactNode; // line under "Effective Date"
  teamEyebrow: string;
  teamText: string;
  cardTitle: [string, string]; // two lines
  cardText: string;
}) => (
  <div className="min-h-screen bg-white overflow-x-hidden font-sans">
    <Topbar />
    <Navbar />

    {/* ================= HERO ================= */}
    <section className="relative overflow-hidden bg-[#0b1426]">
      <Image
        src={heroImg}
        alt="Design House India reception and office"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-[75%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08111f]/70 via-[#08111f]/35 via-35% to-transparent to-55%" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] pb-12 sm:pt-[132px] lg:pt-[112px] lg:pb-6 lg:h-[400px] flex flex-col justify-center">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[14px] sm:text-[15px] text-white mb-3">
          <Link href="/" className="hover:text-[#F28A2E] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span>{title}</span>
        </nav>
        <span className="block w-12 h-[3px] rounded-full bg-[#E8742A] mb-4" />
        <h1 className="font-display font-bold text-white text-[40px] sm:text-[52px] lg:text-[58px] leading-[1.05] mb-4">{title}</h1>
        <p className="text-white/90 text-[15px] sm:text-[18px] leading-snug max-w-[480px]">{intro}</p>
      </div>
    </section>

    {/* ================= CONTENT + SIDEBAR ================= */}
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] xl:gap-10 items-start">
      <div>
        <ul className="divide-y divide-gray-200">
          {sections.map(({ icon: Icon, heading, body }, i) => (
            <li key={heading} className="flex gap-4 sm:gap-5 py-4 first:pt-0">
              <span className="w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-full bg-[#eaf1fb] flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#0f2a5c]" strokeWidth={1.7} />
              </span>
              {numbered && (
                <span className="hidden sm:flex w-9 flex-shrink-0 pt-3 font-display font-bold text-[20px] text-[#0f2a5c] [font-variant-numeric:lining-nums]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              <div className="min-w-0 sm:border-l sm:border-gray-200 sm:pl-5">
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0f2a5c] leading-tight">
                  {numbered && <span className="sm:hidden text-[#E8742A] mr-1.5">{String(i + 1).padStart(2, "0")}.</span>}
                  {heading}
                </h2>
                <span className="block w-7 h-[3px] rounded-full bg-[#E8742A] mt-1 mb-2" />
                <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-black">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Effective date */}
        <div className="mt-1 flex items-start gap-4 sm:gap-5 rounded-md bg-[#eaf1fb] px-5 sm:px-6 py-4">
          <CalendarDays className="w-8 h-8 text-[#0f2a5c] flex-shrink-0 mt-0.5" strokeWidth={1.6} />
          <div className="min-w-0 text-[14.5px] leading-relaxed text-gray-800">
            <p>
              <span className="font-bold text-[#0f2a5c]">Effective Date:</span> {EFFECTIVE_DATE}
            </p>
            {/* One line on wide screens; wraps normally on smaller ones */}
            <p className="min-[1440px]:whitespace-nowrap min-[1440px]:text-[13.5px] min-[1700px]:text-[14.5px]">{effectiveNote}</p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:sticky lg:top-24">
        <div className="rounded-md bg-gradient-to-br from-[#0f2a5c] to-[#0b1f45] p-6 sm:p-7 shadow-[0_18px_40px_-20px_rgba(15,42,92,0.7)]">
          <p className="flex items-center gap-3 text-[14px] text-white/90 mb-2">
            <span className="w-10 h-[3px] rounded-full bg-[#E8742A]" />
            {teamEyebrow}
          </p>
          <h2 className="font-display font-bold text-white text-[30px] sm:text-[34px] leading-tight mb-2">Talk to Our Team</h2>
          <p className="text-white/85 text-[15px] leading-relaxed mb-6">{teamText}</p>
          <div className="space-y-4 mb-7">
            <TeamRow icon={Phone}>
              {COMPANY.phones.map((p) => (
                <a key={p} href={tel(p)} className="block hover:text-[#F28A2E] transition-colors">
                  {p}
                </a>
              ))}
            </TeamRow>
            <TeamRow icon={Mail}>
              <a href={`mailto:${COMPANY.email}`} className="break-all hover:text-[#F28A2E] transition-colors">
                {COMPANY.email}
              </a>
            </TeamRow>
            <TeamRow icon={Clock}>
              <p>Monday – Saturday</p>
              <p>9:00 AM – 6:00 PM</p>
              <p>Sunday: Closed</p>
            </TeamRow>
          </div>
          <Link
            href="/contact"
            className="group flex items-center justify-center gap-3 rounded-[3px] bg-[#F07A22] hover:bg-[#e06a12] px-5 py-3.5 text-white text-[15px] font-bold uppercase tracking-wide transition-colors"
          >
            <Send className="w-5 h-5" />
            Send an Enquiry
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-md min-h-[380px] lg:min-h-[420px] bg-[#0b1f45]">
          <Image src={storeImg} alt="Retail store interior with lit display shelves by Design House" fill placeholder="blur" sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f45] via-[#0b1f45]/70 via-35% to-transparent to-60%" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
            <span className="block w-10 h-[3px] rounded-full bg-[#E8742A] mb-4" />
            <h2 className="font-display font-bold text-white text-[26px] sm:text-[28px] leading-tight mb-2">
              {cardTitle[0]}
              <br />
              {cardTitle[1]}
            </h2>
            <p className="text-white/85 text-[14.5px] leading-relaxed">{cardText}</p>
          </div>
        </div>
      </aside>
    </section>

    <Footer />
  </div>
);

export default LegalLayout;
