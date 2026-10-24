"use client";

import { useState, useEffect } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Youtube,
  type LucideIcon,
} from "lucide-react";

import { api } from "@/lib/api";
import { useSettings } from "@/hooks/useSettings";
import bandImg from "@/assets/band.png";
import iconRetail from "@/assets/icon/f1_11zon.png";
import iconCorporate from "@/assets/icon/f2_11zon.png";
import iconRestaurant from "@/assets/icon/f3_11zon.png";
import iconShopInShop from "@/assets/icon/f4_11zon.png";
import iconDisplay from "@/assets/icon/f5_11zon.png";
import iconKiosk from "@/assets/icon/f6_11zon.png";
import iconExhibition from "@/assets/icon/f7_11zon.png";
import iconFurniture from "@/assets/icon/f8_11zon.png";
import iconTurnkey from "@/assets/icon/f9_11zon.png";
import iconPhone from "@/assets/icon/c1.png";
import iconMail from "@/assets/icon/c2.png";
import indiaMap from "@/assets/icon/map.png";
import statCities from "@/assets/icon/a1.png";
import statProjects from "@/assets/icon/a2.png";
import statYears from "@/assets/icon/a3.png";

/* ─── Content ─── */

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/portfolio" },
  { label: "Clients", href: "/clients" },
  { label: "Career", href: "/career" },
  { label: "Blogs", href: "/blogs" },
  { label: "Downloads", href: "/downloads" },
  { label: "Contact Us", href: "/contact" },
];

// Used when Settings → Quick Links is empty; otherwise those links are shown with these icons in order
// Picture icon for a solution, picked by keywords in its label (works for the
// Settings → Quick Links list too, whatever its order)
const SOLUTION_ICONS: { match: RegExp; img: StaticImageData }[] = [
  { match: /restaurant|cafe|food/i, img: iconRestaurant },
  { match: /corporate|office/i, img: iconCorporate },
  { match: /shop.?in.?shop/i, img: iconShopInShop },
  { match: /display|merchandis/i, img: iconDisplay },
  { match: /kiosk|booth/i, img: iconKiosk },
  { match: /exhibition|event/i, img: iconExhibition },
  { match: /furniture|chair|sofa/i, img: iconFurniture },
  { match: /retail/i, img: iconRetail },
];
const iconFor = (label: string) => SOLUTION_ICONS.find(i => i.match.test(label))?.img ?? iconTurnkey;

const SOLUTIONS: { label: string; href: string }[] = [
  { label: "Retail Interiors", href: "/services/retail-interior" },
  { label: "Corporate Interiors", href: "/services/corporate-interior" },
  { label: "Restaurant Interiors", href: "/services/restaurant-interior" },
  { label: "Shop-in-Shops", href: "/services/shop-in-shop" },
  { label: "Retail Display & Merchandising", href: "/services/retail-display" },
  { label: "Retail Kiosks", href: "/services/retail-kiosk" },
  { label: "Exhibitions & Events", href: "/services/exhibitions" },
  { label: "Furniture", href: "/services/sofas" },
  { label: "Turnkey Interior Solutions", href: "/services" },
];

// Cities shown in "Our Presence in India"
const CITIES: { name: string }[] = [
  { name: "Delhi" },
  { name: "Ghaziabad" },
  { name: "Noida" },
  { name: "Gurugram" },
  { name: "Faridabad" },
  { name: "Ahmedabad" },
  { name: "Indore" },
  { name: "Mumbai" },
  { name: "Pune" },
  { name: "Bengaluru" },
  { name: "Chennai" },
  { name: "Hyderabad" },
  { name: "Kolkata" },
  { name: "Jaipur" },
  { name: "Lucknow" },
  { name: "Chandigarh" },
];

const STATS = [
  { img: statCities, value: "15+", label: "Cities" },
  { img: statProjects, value: "5000+", label: "Projects" },
  { img: statYears, value: "40+", label: "Years Experience" },
];

// Small four-point stars scattered around the footer logo (position, size, twinkle delay)
const LOGO_SPARKLES = [
  { x: "8%", y: "6%", size: 9, delay: "0s" },
  { x: "22%", y: "30%", size: 6, delay: "1.1s" },
  { x: "82%", y: "4%", size: 11, delay: "0.5s" },
  { x: "92%", y: "38%", size: 7, delay: "1.7s" },
  { x: "-3%", y: "58%", size: 8, delay: "0.8s" },
  { x: "97%", y: "70%", size: 9, delay: "2.1s" },
  { x: "46%", y: "-4%", size: 7, delay: "1.4s" },
  { x: "70%", y: "88%", size: 6, delay: "0.3s" },
  { x: "14%", y: "92%", size: 7, delay: "1.9s" },
];

const FALLBACK_PHONES = ["+91 98102 47319", "+91 96549 00525"];
const FALLBACK_EMAIL = "info@designhouse.co.in";
// Office addresses, one array entry per printed line (as in the design)
const OFFICES = [
  { title: "Head Office (Ghaziabad)", lines: ["Plot No. 12/29, Site II Industrial Area,", "Loni Road, Mohan Nagar, Ghaziabad,", "Uttar Pradesh – 201007, India"] },
  { title: "Delhi Branch", lines: ["Ground Floor, Main Market, E-1,", "opposite KFC, Kalkaji,", "New Delhi – 110019, India"] },
  { title: "Mumbai Branch", lines: ["212 Bussa Industrial Estate,", "Lower Parel, Mumbai,", "Maharashtra – 400013, India"] },
];

/* ─── Icons not in lucide ─── */

const XLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.3 22H3.2l7.3-8.3L1 2h6.3l4.4 5.9zm-1.1 18.1h1.7L6.3 3.8H4.5z" />
  </svg>
);

/* ─── India map ─── */

const IndiaMap = () => (
  <div className="relative w-[120px] sm:w-[160px] min-[1700px]:w-[200px] flex-shrink-0">
    <Image src={indiaMap} alt="Design House presence across India" placeholder="blur" sizes="165px" className="w-full h-auto" />
  </div>
);

/* ─── Small pieces ─── */

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="font-sans font-bold text-white text-[17px] uppercase tracking-wide whitespace-nowrap mb-3.5">
    {children}
    <span className="block w-8 h-[3px] bg-[#1E73E8] mt-1.5 rounded-full" />
  </h4>
);

const normalizeUrl = (url: string) => {
  const u = (url || "").trim();
  if (!u || u === "#") return "";
  if (/^https?:\/\//.test(u)) return u;
  if (u.startsWith("//")) return "https:" + u;
  return "https://" + u;
};

/* ─── Footer ─── */

const Footer = () => {
  const { settings } = useSettings();
  const [social, setSocial] = useState({ facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "" });

  useEffect(() => {
    api
      .get("/api/social-media")
      .then(res => res.data.success && setSocial(res.data.data))
      .catch(() => {});
  }, []);

  const socialLinks = [
    { Icon: Linkedin, href: social.linkedin, label: "LinkedIn" },
    { Icon: Facebook, href: social.facebook, label: "Facebook" },
    { Icon: Instagram, href: social.instagram, label: "Instagram" },
    { Icon: Youtube, href: social.youtube, label: "YouTube" },
    { Icon: XLogo, href: social.twitter, label: "X" },
  ];

  const solutions = settings?.quickLinks?.length
    ? settings.quickLinks
    : SOLUTIONS;
  const phones = settings?.phones?.length ? settings.phones.map(p => p.phone) : FALLBACK_PHONES;
  const email = settings?.emails?.find(e => e.forContact)?.email || settings?.emails?.[0]?.email || FALLBACK_EMAIL;

  return (
    <footer className="bg-[#01182a] text-white font-sans overflow-x-hidden">
      {/* ================= CTA BANNER ================= */}
      <section className="relative overflow-hidden bg-[#0B2E7A]">
        {/* Banner artwork: blue streaks with the office reception on the right */}
        {/* Phones show the plain blue side of the artwork (darkened) so the text stays readable */}
        <Image src={bandImg} alt="" fill placeholder="blur" sizes="100vw" className="object-cover object-left lg:object-right" />
        <div className="absolute inset-0 bg-[#0B2557]/60 lg:hidden" aria-hidden="true" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:pl-11 lg:pr-8 pt-5 pb-3 lg:pt-3.5 lg:pb-1.5 lg:pr-[28%] flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-7">
          <div className="flex-shrink-0">
            <p className="flex items-center gap-3 text-xs sm:text-sm tracking-[0.15em] uppercase text-white/85 mb-1">
              Let&apos;s Build Together
              <span className="w-20 h-px bg-white/50" />
            </p>
            <h2 className="font-bold leading-[1.12] text-[24px] sm:text-[28px] lg:text-[29px]">
              Transforming Spaces.
              <br />
              <span className="text-[#3B9BFF]">Delivering Impact.</span>
            </h2>
          </div>
          {/* Divider between the heading and the text */}
          <span className="hidden lg:block w-px h-14 bg-white/40 flex-shrink-0" />
          <p className="text-white/90 text-sm leading-relaxed lg:whitespace-nowrap">
            From retail environments to corporate
            <br className="hidden lg:block" /> spaces, we create functional, brand-driven
            <br className="hidden lg:block" /> and inspiring interiors across India.
          </p>
          <Link
            href="/contact"
            className="self-start lg:self-center lg:-ml-2 flex-shrink-0 inline-flex items-center gap-2.5 bg-white text-[#134698] hover:bg-[#DE802B] hover:text-white font-bold text-[13px] uppercase tracking-wide px-5 py-3 rounded-md shadow-lg transition-colors"
          >
            Get Free Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ================= MAIN FOOTER ================= */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:pl-6 lg:pr-6 pt-5 pb-2">
        {/* Phones: brand on top, Quick Links + Solutions side by side, then contact and presence */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-10 xl:grid-cols-[0.9fr_0.62fr_0.9fr_1.1fr_1.9fr] xl:gap-0">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 xl:pr-7">
            {/* Soft white glow behind the "DESIGN" word so the logo stands out on the dark footer */}
            <div className="relative w-[170px] sm:w-[190px]">
              <span
                aria-hidden="true"
                className="absolute left-[2%] top-[52%] w-[62%] h-[34%] rounded-full bg-white/[0.08] blur-xl pointer-events-none"
              />
              <span
                aria-hidden="true"
                className="absolute left-[25%] top-[8%] w-[55%] h-[45%] rounded-full bg-white/[0.025] blur-2xl pointer-events-none"
              />
              {/* Twinkling white sparkles around the logo */}
              {LOGO_SPARKLES.map((s, i) => (
                <svg
                  key={i}
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="absolute pointer-events-none text-white animate-[logo-twinkle_2.8s_ease-in-out_infinite]"
                  style={{ left: s.x, top: s.y, width: s.size, height: s.size, animationDelay: s.delay, filter: "drop-shadow(0 0 3px rgba(255,255,255,0.9))" }}
                >
                  <path fill="currentColor" d="M12 0c.6 5.6 2.4 9.4 12 12-9.6 2.6-11.4 6.4-12 12-.6-5.6-2.4-9.4-12-12C9.6 9.4 11.4 5.6 12 0z" />
                </svg>
              ))}
              <Image
                src="/logotransparent.png"
                alt="Design House India Pvt. Ltd."
                width={1521}
                height={1034}
                sizes="190px"
                className="relative w-full h-auto [filter:drop-shadow(0_0_4px_rgba(255,255,255,0.12))]"
              />
              {/* Shine sweep (as on the hero's orange text), masked to the logo's shape */}
              <span
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none animate-[logo-shine_4s_ease-in-out_infinite]"
                style={{
                  background: "linear-gradient(110deg, transparent 38%, rgba(255,255,255,0.85) 50%, transparent 62%)",
                  backgroundSize: "260% 100%",
                  WebkitMaskImage: "url(/logotransparent.png)",
                  maskImage: "url(/logotransparent.png)",
                  WebkitMaskSize: "100% 100%",
                  maskSize: "100% 100%",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                }}
              />
            </div>
            <span className="block w-10 h-[3px] bg-[#1E73E8] mt-2 mb-3 rounded-full" />
            {/* One phrase per line, as in the design */}
            <p className="text-white/80 text-[13px] sm:text-sm leading-relaxed mb-4 sm:whitespace-nowrap">
              A leading provider of turnkey interior
              <br />
              design, retail display, merchandising
              <br />
              and exhibition solutions, delivering
              <br />
              innovative, functional and inspiring
              <br />
              spaces across India.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ Icon, href, label }) => {
                const url = normalizeUrl(href);
                return (
                  <a
                    key={label}
                    href={url || undefined}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!url}
                    onClick={e => !url && e.preventDefault()}
                    className={`w-8 h-8 rounded-full border border-[#2F8CFF] shadow-[0_0_6px_rgba(47,140,255,0.75),inset_0_0_4px_rgba(47,140,255,0.35)] flex items-center justify-center hover:bg-[#1E73E8] hover:border-[#1E73E8] transition-colors ${
                      url ? "" : "opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="xl:border-l xl:border-white/10 xl:px-7">
            <Heading>Quick Links</Heading>
            <ul className="space-y-2">
              {QUICK_LINKS.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="group inline-flex items-center gap-2 sm:gap-3 text-[13px] sm:text-sm text-white/85 hover:text-[#3B9BFF] transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70 group-hover:translate-x-0.5 transition-transform" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="xl:border-l xl:border-white/10 xl:pl-7 xl:pr-2">
            <Heading>Our Solutions</Heading>
            <ul className="space-y-1.5">
              {solutions.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href || "#"} className="group inline-flex items-center gap-2 sm:gap-2.5 text-[12.5px] sm:text-[13px] leading-snug text-white/85 sm:whitespace-nowrap hover:text-[#3B9BFF] transition-colors">
                    <Image src={iconFor(label)} alt="" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & offices */}
          <div className="col-span-2 sm:col-span-1 xl:border-l xl:border-white/10 xl:pl-6 xl:pr-3">
            <Heading>Contact &amp; Offices</Heading>
            <div className="space-y-1.5 pb-2 border-b border-white/10">
              <p className="flex items-center gap-2.5 text-[12px]">
                <Image src={iconPhone} alt="" width={28} height={28} className="w-7 h-7 object-contain flex-shrink-0" />
                {/* Both numbers on one line, separated by a bar */}
                <span className="flex items-center whitespace-nowrap">
                  {phones.map((p, i) => (
                    <span key={p} className="inline-flex items-center whitespace-nowrap">
                      {i > 0 && <span className="text-white/40 mx-1.5">|</span>}
                      <a href={`tel:${p.replace(/[^0-9+]/g, "")}`} className="hover:text-[#3B9BFF] transition-colors">
                        {p}
                      </a>
                    </span>
                  ))}
                </span>
              </p>
              <p className="flex items-center gap-2.5 text-[12.5px]">
                <Image src={iconMail} alt="" width={28} height={28} className="w-7 h-7 object-contain flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-[#3B9BFF] transition-colors whitespace-nowrap">
                  {email}
                </a>
              </p>
            </div>
            <ul className="divide-y divide-white/10">
              {OFFICES.map((o, i) => (
                <li key={i} className="flex gap-2.5 py-1.5 last:pb-0">
                  <span className="w-7 h-7 rounded-full bg-[#1E73E8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  </span>
                  <div className="text-[12px] leading-[1.35] text-white/80">
                    <p className="font-semibold text-white mb-0.5">{o.title}</p>
                    {o.lines.map(line => (
                      <p key={line} className="whitespace-nowrap">{line}</p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Presence in India */}
          <div className="col-span-2 sm:col-span-1 xl:border-l xl:border-white/10 xl:pl-4">
            <Heading>Our Presence in India</Heading>
            {/* Map beside the list on phones and wide screens; stacked on mid-size laptops where the column is narrow */}
            <div className="flex flex-row xl:flex-col min-[1440px]:flex-row gap-3 min-[1440px]:gap-2 items-start">
              <IndiaMap />
              <ul className="grid grid-cols-[auto_auto] gap-x-3 gap-y-2 min-[1440px]:gap-y-[11px] min-w-0">
                {CITIES.map(c => (
                  <li key={c.name} className="flex items-center gap-1.5 text-[12.5px] min-[1440px]:text-[13.5px] text-white/85 whitespace-nowrap">
                    <MapPin className="w-3.5 h-3.5 text-[#3B9BFF] flex-shrink-0" />
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
            {/* Line above the stats, and a divider between each */}
            <div className="flex mt-3 pt-3 pl-1 min-[1440px]:pl-3 border-t border-white/15">
              {STATS.map(({ img, value, label }, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-1.5 pr-1.5 min-[1440px]:pr-2.5 ${i > 0 ? "pl-1.5 min-[1440px]:pl-2.5 border-l border-white/20" : ""}`}
                >
                  <Image src={img} alt="" width={36} height={36} className="w-7 h-7 min-[1440px]:w-9 min-[1440px]:h-9 object-contain flex-shrink-0" />
                  <div className="leading-tight">
                    <p className="font-bold text-sm min-[1440px]:text-base">{value}</p>
                    <p className="text-[10px] min-[1440px]:text-[11px] text-white/75 min-[1440px]:whitespace-nowrap">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="bg-black border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:pl-11 lg:pr-8 py-2 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white">
          <p className="text-center md:text-left">© {new Date().getFullYear()} Design House India Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-[#3B9BFF] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/terms-and-conditions" className="hover:text-[#3B9BFF] transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/sitemap.xml" className="hover:text-[#3B9BFF] transition-colors">
              Sitemap
            </Link>
            <span className="text-white/30">|</span>
            <span className="inline-flex items-center gap-2">
              Designed &amp; Developed by
              <a href="https://encodency.com" target="_blank" rel="noopener noreferrer" aria-label="Encodency Pvt. Ltd.">
                <Image src="/encodencylogo.jpeg" alt="Encodency Pvt. Ltd." width={800} height={224} className="h-8 w-auto rounded-sm" />
              </a>
            </span>
            <button
              type="button"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-[#1E73E8] hover:border-[#1E73E8] transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
