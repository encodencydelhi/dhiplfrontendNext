"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUp, ChevronRight, MapPin, Phone } from "lucide-react";

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
import iconMail from "@/assets/icon/c2.png";
import indiaMap from "@/assets/icon/map.png";
import footBg from "@/assets/icon/footb.png";
import statCities from "@/assets/icon/a1.png";
import statProjects from "@/assets/icon/a2.png";
import statYears from "@/assets/icon/a3.png";

/* ─── Content ─── */

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Solutions", href: "/services" },
  { label: "Our Projects", href: "/portfolio" },
  { label: "Our Clients", href: "/clients" },
  { label: "Why Choose Us", href: "/about#why-choose-us" },
  { label: "Blogs", href: "/blogs" },
  { label: "Careers", href: "/career" },
  { label: "Contact Us", href: "/contact" },
];

// Picture icon for a solution, picked by keywords in its label
const SOLUTION_ICONS: { match: RegExp; img: StaticImageData }[] = [
  { match: /restaurant|cafe|food/i, img: iconRestaurant },
  { match: /corporate|office|commercial|fit.?out/i, img: iconCorporate },
  { match: /shop.?in.?shop/i, img: iconShopInShop },
  { match: /display|merchandis|fixture|signage|branding/i, img: iconDisplay },
  { match: /kiosk|booth/i, img: iconKiosk },
  { match: /exhibition|event/i, img: iconExhibition },
  { match: /furniture|chair|sofa/i, img: iconFurniture },
  { match: /retail/i, img: iconRetail },
];
const iconFor = (label: string) => SOLUTION_ICONS.find(i => i.match.test(label))?.img ?? iconTurnkey;

// Fixed list, as in the design (not taken from Settings → Quick Links)
const SOLUTIONS: { label: string; href: string }[] = [
  { label: "Corporate Interiors", href: "/services/corporate-interior" },
  { label: "Retail Showrooms", href: "/services/retail-interior" },
  { label: "Restaurant Interiors", href: "/services/restaurant-interior" },
  { label: "Exhibition Stalls", href: "/services/exhibitions" },
  { label: "Retail Kiosks", href: "/services/retail-kiosk" },
  { label: "Commercial Fit-Outs", href: "/services/office-interior" },
  { label: "Signage & Branding", href: "/services/signage" },
  { label: "Display Fixtures", href: "/services/retail-display" },
];

// Cities shown in "Our Presence in India" (listed down the first column, then the second)
const CITIES: { name: string }[] = [
  { name: "Delhi" },
  { name: "Ghaziabad" },
  { name: "Noida" },
  { name: "Gurugram" },
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
];

const STATS = [
  { img: statCities, value: "Pan India", label: "Many More Cities" },
  { img: statProjects, value: "5000+", label: "Projects" },
  { img: statYears, value: "21+", label: "Years Experience" },
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

// Numbers in the Call Us Today box (fixed here, not taken from Settings → Phones)
const CALL_PHONES = ["+91 93106 08427", "+91 98102 47319"];
// The arrow in the Call Us Today box dials this number
const ARROW_PHONE = "+919810247319";
const FALLBACK_EMAIL = "info@designhouse.co.in";
// Office addresses, one array entry per printed line (as in the design)
const OFFICES = [
  {
    title: "Corporate Office",
    place: "Delhi-NCR, India",
    lines: ["Plot No. 12/29, Site-II Industrial Area,", "Loni Road, Mohan Nagar, Ghaziabad,", "Uttar Pradesh – 201007, India"],
  },
  {
    title: "Regional Office",
    place: "Delhi, India",
    lines: ["Ground Floor, E-1, Main Market,", "Opp. KFC, Kalkaji,", "New Delhi – 110019, India"],
  },
  {
    title: "Mumbai Branch Office",
    place: "Vasai-Virar",
    lines: ["U/IT-II SR Compound, Plot No 49/459,", "Opp Dynamic Flow Company,", "Wakanpada Road, Vasai Phata,", "Vasai East – 401208, India"],
  },
];

/* ─── India map ─── */

const IndiaMap = () => (
  <div className="relative w-[120px] sm:w-[160px] xl:w-[110px] min-[1440px]:w-[160px] min-[1700px]:w-[200px] flex-shrink-0">
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

/* ─── Footer ─── */

// showCta: the "Let's Build Together" band above the footer (only the home page shows it)
const Footer = ({ showCta = false }: { showCta?: boolean }) => {
  const { settings } = useSettings();

  const email = settings?.emails?.find(e => e.forContact)?.email || settings?.emails?.[0]?.email || FALLBACK_EMAIL;

  return (
    <footer className="bg-[#01182a] text-white font-sans overflow-x-hidden">
      {/* ================= CTA BANNER ================= */}
      {showCta && (
        <section className="relative overflow-hidden bg-[#0B2E7A]">
          {/* Banner artwork: blue streaks with the office reception on the right */}
          {/* Phones show the plain blue side of the artwork (darkened) so the text stays readable */}
          {/* The artwork is much wider than the band is tall, so it is cropped; 30% from the top keeps
              the logo on the reception wall in view (the band grows with the width, as the artwork does) */}
          <Image src={bandImg} alt="" fill placeholder="blur" sizes="100vw" className="object-cover object-left lg:object-[100%_37%]" />
          <div className="absolute inset-0 bg-[#0B2557]/60 lg:hidden" aria-hidden="true" />

          {/* lg+: everything stays left of the reception photo (the right ~30% of the artwork) */}
          <div className="relative max-w-[1520px] mx-auto px-4 sm:px-6 lg:pl-10 lg:pr-[30%] pt-5 pb-4 lg:py-2 lg:min-h-[5.3vw] flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-5 xl:gap-6">
            <div className="flex-shrink-0">
              <p className="flex items-center gap-3 text-[11px] sm:text-xs tracking-[0.12em] uppercase text-white/85 mb-1">
                Let&apos;s Build Together
                <span className="w-16 h-px bg-white/50" />
              </p>
              {/* One line from xl, as in the design; two on narrower screens */}
              <h2 className="font-bold leading-tight text-[22px] sm:text-[24px] lg:text-[22px] xl:text-[clamp(19px,1.5vw,25px)] xl:whitespace-nowrap">
                Transforming Spaces.
                <br className="xl:hidden" />
                <span className="text-[#3B9BFF]"> Delivering Impact.</span>
              </h2>
            </div>
            {/* Divider between the heading and the text */}
            <span className="hidden lg:block w-px h-12 bg-white/40 flex-shrink-0" />
            <p className="text-white/90 text-[13px] lg:text-[12px] 2xl:text-[13px] leading-snug lg:whitespace-nowrap">
              From retail environments to corporate spaces,
              <br className="hidden lg:block" /> we create functional, brand-driven and inspiring
              <br className="hidden lg:block" /> interiors across India.
            </p>
            <Link
              href="/contact"
              className="self-start lg:self-center flex-shrink-0 inline-flex items-center gap-2 bg-white text-[#134698] hover:bg-[#DE802B] hover:text-white font-bold text-[11px] uppercase tracking-wide px-3.5 py-2 rounded-md shadow-lg transition-colors"
            >
              Get Free Consultation
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* ================= MAIN FOOTER ================= */}
      <div className="relative">
      {/* xl+: blue-lit interior along the bottom left, behind the Call Us box (its top is transparent).
          Hidden on smaller screens, where that corner holds the stats instead */}
      <Image
        src={footBg}
        alt=""
        aria-hidden="true"
        loading="eager"
        unoptimized
        className="pointer-events-none absolute bottom-0 left-0 hidden xl:block w-[30%] h-auto opacity-90"
      />
      <div className="relative max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        {/* Phones: brand on top, Quick Links + Solutions side by side, then contact and presence */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-10 xl:grid-cols-[1fr_0.5fr_0.85fr_1.05fr_1.33fr] xl:gap-0">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 xl:pl-3 xl:pr-6 2xl:pl-8">
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
            {/* Call Us Today: orange phone disc, the numbers, and an arrow to the contact page */}
            <div className="inline-flex items-center gap-2.5 rounded-xl border-[1.5px] border-[#F2B33D] bg-[#04203a]/70 pl-2.5 pr-3 py-2 shadow-[0_0_16px_-2px_rgba(242,179,61,0.35)]">
              <span className="w-8 h-8 2xl:w-9 2xl:h-9 rounded-full bg-gradient-to-b from-[#FFC15A] to-[#F08A1C] flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_-4px_rgba(240,138,28,0.8)]">
                <Phone className="w-4 h-4 text-[#04203a]" fill="currentColor" strokeWidth={1.5} />
              </span>
              <div className="leading-tight">
                <p className="text-[11px] font-medium text-[#F7B84B] mb-0.5">Call Us Today</p>
                {CALL_PHONES.map(p => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/[^0-9+]/g, "")}`}
                    className="block whitespace-nowrap font-bold text-[13px] 2xl:text-[14px] tracking-tight hover:text-[#3B9BFF] transition-colors"
                  >
                    {p}
                  </a>
                ))}
              </div>
              <a href={`tel:${ARROW_PHONE}`} aria-label="Call +91 98102 47319" className="ml-0.5 text-white hover:text-[#F7B84B] transition-colors">
                <ArrowRight className="w-4 h-4 2xl:w-[18px] 2xl:h-[18px]" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="xl:border-l xl:border-white/10 xl:pl-6 xl:pr-4">
            <Heading>Quick Links</Heading>
            <ul className="space-y-2">
              {QUICK_LINKS.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="group inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap text-[13px] sm:text-sm text-white/85 hover:text-[#3B9BFF] transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70 group-hover:translate-x-0.5 transition-transform" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="xl:border-l xl:border-white/10 xl:pl-5 xl:pr-2">
            <Heading>Our Solutions</Heading>
            <ul className="space-y-1.5">
              {SOLUTIONS.map(({ label, href }) => (
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
            <Heading>Our Offices &amp; Contact</Heading>
            <a href={`mailto:${email}`} className="group flex items-center gap-3 pb-2.5 border-b border-white/10">
              <Image src={iconMail} alt="" width={36} height={36} className="w-9 h-9 object-contain flex-shrink-0" />
              <span className="leading-tight">
                <span className="block text-[12.5px] text-[#3B9BFF]">Email Us</span>
                <span className="block text-[13.5px] whitespace-nowrap group-hover:text-[#3B9BFF] transition-colors">{email}</span>
              </span>
            </a>
            <ul className="divide-y divide-white/10">
              {OFFICES.map((o, i) => (
                <li key={i} className="flex gap-3 py-2 last:pb-0">
                  <span className="w-9 h-9 rounded-full bg-[#1E73E8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-white" />
                  </span>
                  <div className="text-[12px] leading-[1.35] text-white/80">
                    <p className="font-semibold text-white mb-0.5 whitespace-nowrap">
                      {o.title}
                      <span className="text-[#3B9BFF] mx-1.5">|</span>
                      {o.place}
                    </p>
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
            {/* Map beside the list on phones and wide screens; a smaller one above it on laptops, where the column is narrow */}
            <div className="relative flex flex-row xl:flex-col min-[1440px]:flex-row gap-3 min-[1440px]:gap-2 items-start">
              {/* Faint skyline of Indian monuments behind the map and cities, along their bottom */}
              <Image
                src="/bgindia.png"
                alt=""
                aria-hidden="true"
                width={2172}
                height={462}
                sizes="(min-width: 1280px) 30vw, 100vw"
                className="pointer-events-none absolute -bottom-1 left-0 w-full h-auto opacity-30"
              />
              <IndiaMap />
              <div className="relative min-w-0">
                <ul className="grid grid-flow-col grid-rows-7 grid-cols-[auto_auto] gap-x-4 min-[1440px]:gap-x-8 gap-y-2 min-[1440px]:gap-y-[11px]">
                  {CITIES.map(c => (
                    <li key={c.name} className="flex items-center gap-2 text-[12.5px] min-[1440px]:text-[13.5px] text-white/85 whitespace-nowrap">
                      <MapPin className="w-4 h-4 flex-shrink-0" fill="#2F8CFF" color="#01182a" strokeWidth={1.75} />
                      {c.name}
                    </li>
                  ))}
                </ul>
                <p className="flex items-center gap-2 mt-2.5 text-[12px] text-white/75 whitespace-nowrap">
                  <span className="w-6 min-[1440px]:w-9 h-px bg-[#3B9BFF]/70" />
                  and many more cities
                  <span className="w-6 min-[1440px]:w-9 h-px bg-[#3B9BFF]/70" />
                </p>
              </div>
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
                    <p className="font-bold text-sm min-[1440px]:text-base whitespace-nowrap">{value}</p>
                    <p className="text-[10px] min-[1440px]:text-[11px] text-white/75 min-[1440px]:whitespace-nowrap">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="bg-black border-t border-white/10">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col xl:flex-row items-center justify-between gap-2 text-xs text-white">
          <p className="text-center xl:text-left xl:whitespace-nowrap">
            © {new Date().getFullYear()} Design House – Transforming Spaces, Creating Experiences.
            <span className="text-white/50 mx-2.5">|</span>
            All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3.5 min-[1440px]:gap-x-5 gap-y-2">
            <Link href="/sitemap.xml" className="hover:text-[#3B9BFF] transition-colors">
              Sitemap
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/privacy-policy" className="hover:text-[#3B9BFF] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/terms-and-conditions" className="hover:text-[#3B9BFF] transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/disclaimer" className="hover:text-[#3B9BFF] transition-colors">
              Disclaimer
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
