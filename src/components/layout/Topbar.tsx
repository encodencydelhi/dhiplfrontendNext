"use client";

import { Phone, Mail, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useSettings } from "@/hooks/useSettings";

/* Slim navy bar above the navbar. It is exactly 48px tall, because the navbar is
   fixed at top-[48px] until the page scrolls. The content uses the navbar's
   container, so the phone number lines up with the logo below it. */

// Phone / email: round icon chip + text (the text is hidden on small screens)
const ContactLink = ({ href, icon: Icon, label, text }: { href: string; icon: LucideIcon; label: string; text: string }) => (
  <a href={href} aria-label={label} className="group flex items-center gap-2.5 text-white/85 hover:text-white transition-colors duration-300">
    <span className="w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.07] ring-1 ring-white/15 group-hover:bg-[#ED985F] group-hover:ring-[#ED985F] transition-all duration-300">
      <Icon className="w-3.5 h-3.5 text-[#ED985F] group-hover:text-white transition-colors duration-300" />
    </span>
    <span className="hidden md:inline text-[13px] font-medium tracking-wide">{text}</span>
  </a>
);

const Topbar = () => {
  const { settings, loading } = useSettings();

  const topbarPhone = settings?.phones?.find((p) => p.forTopbar)?.phone || "+91 9654900525";
  const topbarEmail = settings?.emails?.find((e) => e.forTopbar)?.email || "info@designhouse.co.in";

  if (loading) {
    return <div className="h-12 bg-[#0a1a33] animate-pulse" />;
  }

  return (
    <div className="relative z-50 h-12 overflow-visible bg-[#0a1a33]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navy base with a soft brand-blue glow on the right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 140% at 85% 50%, rgba(30,115,232,0.28) 0%, transparent 70%), linear-gradient(90deg, #0a1a33 0%, #0d2347 55%, #10306a 100%)",
        }}
      />
      {/* Bottom hairline: orange to blue, fading at both ends */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#ED985F]/60 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-px bg-gradient-to-r from-transparent to-[#1E73E8]/70" />

      <div className="relative h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Contact */}
        <div className="flex items-center gap-3 md:gap-0">
          <ContactLink href={`tel:${topbarPhone.replace(/[^0-9+]/g, "")}`} icon={Phone} label="Call us" text={topbarPhone} />
          <span className="hidden md:block w-px h-4 bg-white/15 mx-5" aria-hidden="true" />
          <ContactLink href={`mailto:${topbarEmail}`} icon={Mail} label="Email us" text={topbarEmail} />
        </div>

        {/* Ensis */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://ensis.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-2 h-8 px-1.5 rounded-full bg-white ring-1 ring-white/60 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.5)] hover:shadow-[0_0_18px_rgba(237,152,95,0.45)] transition-shadow duration-300"
          >
            {/* ensis.jpeg has its own white background, so it sits in a white pill */}
            <Image
              src="/ensis.jpeg"
              alt="Ensis – Wellness Furniture"
              width={1600}
              height={639}
              style={{ width: "auto" }}
              className="h-[22px] sm:h-6 rounded-full"
            />
            {/* Tooltip */}
            <span className="absolute top-[calc(100%+10px)] right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 px-2.5 py-1.5 bg-[#0a1a33] text-white text-[10px] font-bold tracking-wider uppercase rounded-md shadow-2xl opacity-0 translate-y-2 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none whitespace-nowrap z-[100] ring-1 ring-white/15">
              Panchkarma Solution
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
