"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { api, API_URL } from "@/lib/api";
import { getHeroToneSampler, subscribeHeroTone, type Tone } from "@/lib/heroTone";
import {
  Armchair,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronRight,
  FileDown,
  FileText,
  LayoutGrid,
  MonitorSmartphone,
  Newspaper,
  Presentation,
  ShieldCheck,
  Signpost,
  Sparkles,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    dropdown: [
      {
        label: "Interiors",
        subItems: [
          { label: "Retail Interior", href: "/services/retail-interior" },
          { label: "Corporate Interior", href: "/services/corporate-interior" },
          { label: "Restaurant Interior", href: "/services/restaurant-interior" },
          { label: "Shop in Shops", href: "/services/shop-in-shop" },
        ],
      },
      {
        label: "Merchandising",
        subItems: [
          { label: "Retail Display Merchandising", href: "/services/retail-display" },
          { label: "Acrylic Display", href: "/services/acrylic-display" },
          { label: "Gondolas", href: "/services/gondolas" },
          { label: "Window Display", href: "/services/window-display" },
        ],
      },
      {
        label: "Kiosk",
        subItems: [
          { label: "Retail Kiosk", href: "/services/retail-kiosk" },
          { label: "Mobile Booth", href: "/services/mobile-booth" },
        ],
      },
      { label: "Signage", href: "/services/signage" },
      { label: "Exhibitions & Events", href: "/services/exhibitions" },
      {
        label: "Office Interior",
        subItems: [
          { label: "Modular Work Station", href: "/services/modular-workstation" },
          { label: "MD Cabin", href: "/services/md-cabin" },
          { label: "Chairs", href: "/services/office-chairs" },
        ],
      },
      {
        label: "Furniture",
        subItems: [
          { label: "Wardrobe", href: "/services/wardrobe" },
          { label: "Kitchen", href: "/services/kitchen" },
          { label: "LCD Unit", href: "/services/lcd-unit" },
          { label: "Dressing Table", href: "/services/dressing-table" },
          { label: "Sofas", href: "/services/sofas" },
        ],
      },
    ],
  },

  {
    label: "Projects",
    alignRight: true,
    dropdown: [
      {
        label: "Interiors Portfolio",
        subItems: [
          { label: "Retail Interior Images", href: "/portfolio/interior/retail-interior" },
          { label: "Corporate Interior Images", href: "/portfolio/interior/corporate-interior" },
          { label: "Restaurant Interior Images", href: "/portfolio/interior/restaurant-interior" },
          { label: "Shop in Shop Images", href: "/portfolio/interior/shops-in-shops" },
        ],
      },
      {
        label: "Merchandising Portfolio",
        subItems: [
          { label: "Retail Merchandising Images", href: "/portfolio/merchandising/merchandising-images" },
          { label: "Acrylic Table Tops Images", href: "/portfolio/merchandising/acrylic-images" },
          { label: "Gondola Displays Images", href: "/portfolio/merchandising/gandola-images" },
          { label: "Window Displays Images", href: "/portfolio/merchandising/window-display-images" },
        ],
      },
      {
        label: "Kiosk Portfolio",
        subItems: [
          { label: "Retail Kiosks Images", href: "/portfolio/kiosk/kiosk-images" },
          { label: "Mobile Booths Images", href: "/portfolio/kiosk/booth-images" },
        ],
      },
      { label: "Signage Portfolio Images", href: "/portfolio/signage/signage-portfolio" },
      { label: "Exhibition & Events Portfolio", href: "/portfolio/signage/exhibition-events-portfolio" },
      {
        label: "Office Interior Portfolio",
        subItems: [
          { label: "Modular Work Station Images", href: "/portfolio/office-interior/modular-images" },
          { label: "MD Cabin Images", href: "/portfolio/office-interior/md-cabin-images" },
          { label: "Office Chairs Images", href: "/portfolio/office-interior/office-chairs-images" },
        ],
      },
      {
        label: "Furniture Portfolio",
        subItems: [
          { label: "Modular Wardrobes Images", href: "/portfolio/furniture/wardrobes-images" },
          { label: "Modular Kitchen Images", href: "/portfolio/furniture/kitchen-images" },
          { label: "Modular LCD Units Images", href: "/portfolio/furniture/lcd-unit-images" },
          { label: "Sofas Images", href: "/portfolio/furniture/sofas-images" },
        ],
      },
      { label: "Videos", href: "/portfolio/videos" },
    ],
  },


  { label: "Clients", href: "/clients" },

  { label: "Career", href: "/career" },
  { label: "Blogs", href: "/blogs" },

  {
    label: "Downloads",
    alignRight: true,
    dropdown: [
      {
        label: "E-Broucher",
        subItems: [
          { label: "Modular Furniture", href: "/downloads/ebrochures/Modular Furniture.pdf", isPdf: true },
          { label: "Office Furniture", href: "/downloads/ebrochures/office furniture.pdf", isPdf: true },
          { label: "Modular Kitchen", href: "/downloads/ebrochures/Modular Kitchen.pdf", isPdf: true },
          { label: "Spa & Panchkarma", href: "/downloads/ebrochures/e-broucher.pdf", isPdf: true },
        ],
      },
      {
        label: "Newsletter",
        subItems: [
          { label: "Corporate Interior", href: "/downloads/newsletter/corprate_nov.pdf", isPdf: true },
          { label: "Residential Interior", href: "/downloads/newsletter/residential_nov.pdf", isPdf: true },
        ],
      },
      {
        label: "Company Profile",
        subItems: [
          { label: "Company Profile", href: "/downloads/company-profile.pdf", isPdf: true },
          { label: "Corporate Presentation", href: "/downloads/corporate-presentation.pdf", isPdf: true },
          { label: "Infrastructure Overview", href: "/downloads/infrastructure.pdf", isPdf: true },
          { label: "Quality Standards", href: "/downloads/quality-standards.pdf", isPdf: true },
          { label: "Safety Policy", href: "/downloads/safety-policy.pdf", isPdf: true },
          { label: "Core Values", href: "/downloads/core-values.pdf", isPdf: true },
        ],
      },
    ],
  },

  { label: "Contact Us", href: "/contact" },








];

/* Desktop dropdown open/close is CSS-transition driven (see Navbar below) —
   framer-motion variants were removed from there since the dropdowns are
   now always mounted for SEO and tracking ~68 elements as motion instances
   was adding real hydration cost. Mobile menu below still uses framer-motion
   since it's genuinely mount/unmount (hamburger-triggered), not always-on. */

// Icon for a dropdown group, picked from its label
const GROUP_ICONS: [RegExp, LucideIcon][] = [
  [/video/i, Video],
  [/brouch|brochure/i, BookOpen],
  [/newsletter/i, Newspaper],
  [/company profile/i, FileText],
  [/merchandis/i, LayoutGrid],
  [/kiosk|booth/i, MonitorSmartphone],
  [/signage/i, Signpost],
  [/exhibition|event/i, Presentation],
  [/office/i, BriefcaseBusiness],
  [/furniture|wardrobe|sofa/i, Armchair],
  [/interior/i, Building2],
];
const groupIcon = (label: string) => GROUP_ICONS.find(([re]) => re.test(label))?.[1] ?? Sparkles;

// A top-level item is "current" when the page is it, or one of its dropdown links
const isActiveItem = (item, pathname: string) => {
  if (!pathname) return false;
  if (item.href) return item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
  const hrefs = (item.dropdown || []).flatMap((d) => [d.href, ...(d.subItems || []).map((s) => s.href)]).filter(Boolean);
  return hrefs.some((h) => !h.endsWith(".pdf") && (pathname === h || pathname.startsWith(h + "/")));
};

/* ─── Navbar ─── */

// `solid` keeps the light (scrolled) styling from the start — for pages whose
// hero is light, where the transparent white-text navbar would be unreadable.
// `lightHero` is for a light hero image with dark patches (the home banner): the
// bar stays transparent and each link is dark or white depending on what is behind it.
const Navbar = ({ solid = false, lightHero = false }: { solid?: boolean; lightHero?: boolean } = {}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isLight = isScrolled || solid;
  const overHero = lightHero && !isLight;
  // Tone of the hero behind each link / the logo / Login ("dark" → white text)
  const toneRefs = useRef<Record<string, HTMLElement | null>>({});
  const [tones, setTones] = useState<Record<string, Tone>>({});
  const toneOf = (key: string): Tone => (isLight ? "light" : overHero ? tones[key] ?? "light" : "dark");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedItems, setMobileExpandedItems] = useState({});
  const [companyProfilePdfs, setCompanyProfilePdfs] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await api.get("/api/pdf-manager");
        if (response.data.success) {
          // Filter only active PDFs that are NOT in static categories
          const filtered = response.data.data.filter(
            (pdf) => pdf.status === "Active" && pdf.category !== "E-Broucher" && pdf.category !== "Newsletter"
          );
          setCompanyProfilePdfs(filtered);
        }
      } catch (error) {
        console.error("Error fetching PDFs:", error);
      }
    };
    fetchPdfs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!lightHero) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sample = getHeroToneSampler();
        if (!sample) return;
        const next: Record<string, Tone> = {};
        for (const [key, el] of Object.entries(toneRefs.current)) {
          if (!el) continue;
          // Sample across the whole label; white text once a good part of it sits on dark
          const r = el.getBoundingClientRect();
          let dark = 0;
          let seen = 0;
          for (let k = 0; k < 5; k++) {
            const tone = sample(r.left + (r.width * (k + 0.5)) / 5, r.top + r.height / 2, key);
            if (!tone) continue;
            seen++;
            if (tone === "dark") dark++;
          }
          if (seen) next[key] = dark / seen >= 0.4 ? "dark" : "light";
        }
        setTones((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
      });
    };
    measure();
    const unsubscribe = subscribeHeroTone(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    // Links shift when the web font or the PDF list arrives, so re-measure on any size change
    const ro = new ResizeObserver(measure);
    Object.values(toneRefs.current).forEach((el) => el && ro.observe(el));
    document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      unsubscribe();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [lightHero]);

  const toggleMobileItem = (label) => {
    setMobileExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const dynamicNavItems = navItems.map((item) => {
    if (item.label === "Downloads") {
      return {
        ...item,
        dropdown: item.dropdown.map((sub) => {
          if (sub.label === "Company Profile") {
            const dynamicSubItems = companyProfilePdfs.map((pdf) => ({
              label: pdf.subCategory || pdf.pdfTitle,
              href: `${API_URL}/${pdf.pdfUrl}`,
              isPdf: true,
            }));

            return {
              ...sub,
              subItems: dynamicSubItems.length > 0 ? dynamicSubItems : sub.subItems,
            };
          }
          return sub;
        }),
      };
    }
    return item;
  });

  return (
    <>
      {/* ─── Navbar ─── */}
      <m.nav
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ease-in-out ${isScrolled
          ? "top-0 bg-white/95 backdrop-blur-xl shadow-[0_10px_30px_-12px_rgba(19,70,152,0.25)]"
          : solid
            ? "top-[48px] bg-white shadow-none"
            : overHero
              ? "top-[48px] bg-transparent shadow-none"
              : // Over a photo hero: a soft dark fade keeps the white links readable
              "top-[48px] bg-gradient-to-b from-black/45 via-black/15 to-transparent backdrop-blur-none shadow-none"
          }`}
        style={{ fontFamily: "'Inter', sans-serif", borderBottom: isLight ? "1.5px solid rgba(19,70,152,0.09)" : "none" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[56px] sm:h-[72px] flex justify-between lg:grid lg:grid-cols-[auto_1fr_auto] items-center">

          {/* Logo (public/logobg.png, which has its own white background) */}
          <a href="/" ref={(el) => { toneRefs.current.__logo = el; }} className="flex items-center z-10 h-[42px] sm:h-[62px] min-w-[135px] sm:min-w-[200px]">
            <m.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.2 }}
              // On the white (scrolled / solid) navbar the logo sits on it directly, no box;
              // over a photo hero it keeps its white card so it stays readable.
              className={`transition-all duration-500 rounded-xl px-2 py-0.5 sm:px-3 sm:py-1 ${toneOf("__logo") === "light"
                  ? "bg-transparent shadow-none"
                  : "bg-white shadow-[0_0_40px_rgba(255,255,255,0.8),0_0_15px_rgba(255,255,255,0.5)] border border-white/40 mb-1"
                }`}
            >
              {/* logobg.png has wide white margins (the logo is the middle 534×306 of 606×412);
                  this box has the logo's own shape and the image is scaled to crop the margins,
                  so the logo is bigger without making the navbar taller. */}
              {/* Over the home hero (before scrolling) the logo grows down into the hero;
                  scaled from its top-left so the navbar itself keeps its height. */}
              <div
                className={`relative overflow-hidden h-[44px] sm:h-[60px] aspect-[534/306] origin-top-left transition-transform duration-500 ${
                  overHero ? "scale-[1.3] sm:scale-[1.5]" : ""
                }`}
              >
                <Image
                  src="/logobg.png"
                  alt="Design House India Pvt. Ltd."
                  fill
                  sizes="110px"
                  className="object-cover scale-[1.1]"
                  priority
                />
              </div>
            </m.div>
          </a>

          {/* ─── Desktop Nav ─── */}
          <div className="hidden lg:flex justify-center items-center gap-1 whitespace-nowrap h-full">
            {dynamicNavItems.map((item) => {
              const open = activeDropdown === item.label;
              const active = isActiveItem(item, pathname);
              const onLight = toneOf(item.label) === "light";
              const setRef = (el: HTMLElement | null) => { toneRefs.current[item.label] = el; };
              // Pill-style link: soft background on hover/open, underline under the current page
              const linkClass = `relative inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-[11.5px] uppercase tracking-[0.12em] font-semibold leading-none transition-colors duration-300 ${
                onLight
                  ? `${active || open ? "text-[#134698]" : "text-neutral-800"} hover:text-[#134698] ${open ? "bg-[#134698]/[0.07]" : "hover:bg-[#134698]/[0.06]"}`
                  : `text-white ${open ? "bg-white/15" : "hover:bg-white/10"} ${overHero ? "[text-shadow:0_1px_8px_rgba(0,0,0,0.45)]" : ""}`
              }`;
              const dot = active && (
                <span
                  className={`absolute left-3.5 right-3.5 bottom-0.5 h-[2px] rounded-full transition-colors duration-300 ${onLight ? "bg-[#134698]" : "bg-white"}`}
                  aria-hidden="true"
                />
              );

              return (
                <div
                  key={item.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => { setActiveDropdown(null); setActiveSubDropdown(null); }}
                >
                  {item.href && !item.dropdown ? (
                    <a href={item.href} ref={setRef} className={linkClass} aria-current={active ? "page" : undefined}>
                      {item.label}
                      {dot}
                    </a>
                  ) : (
                    <button ref={setRef} className={`${linkClass} bg-transparent border-0 cursor-pointer`} aria-label={`Toggle ${item.label} menu`} aria-expanded={open}>
                      <span className="leading-none">{item.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                      {dot}
                    </button>
                  )}

                  {/* ─── Level 1 Dropdown ───
                      Always rendered (visibility toggled via a CSS transition, not
                      JS mount/unmount or framer-motion) so every link exists in the
                      server-rendered HTML for crawlers/SEO tools, not just after a
                      mouse hover — and so hydrating ~68 always-mounted links doesn't
                      cost a framer-motion instance each. */}
                  {item.dropdown && (
                    <div
                      className={`absolute top-full pt-2 ${item.alignRight ? "right-0" : "left-0"} transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        open ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible pointer-events-none"
                      }`}
                      style={{ zIndex: 9999 }}
                    >
                      <div
                        className="relative bg-white rounded-2xl p-2 min-w-[290px] border border-[#134698]/10"
                        style={{ boxShadow: "0 24px 56px -16px rgba(19,70,152,0.35), 0 6px 18px -6px rgba(19,70,152,0.12)" }}
                      >
                        {/* Heading strip */}
                        <div className="flex items-center justify-between px-3 pt-2 pb-2.5 mb-1 border-b border-[#134698]/[0.08]">
                          <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#DE802B]">{item.label}</span>
                          <span className="h-[2px] w-10 rounded-full bg-gradient-to-r from-[#134698] to-[#DE802B]" />
                        </div>

                        {item.dropdown.map((subItem, idx) => {
                          const Icon = groupIcon(subItem.label);
                          const subOpen = activeSubDropdown === subItem.label;
                          const count = subItem.subItems?.length;
                          const row = (
                            <>
                              <span
                                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                                  subOpen ? "bg-[#134698] text-white" : "bg-[#134698]/[0.06] text-[#134698] group-hover/row:bg-[#134698] group-hover/row:text-white"
                                }`}
                              >
                                <Icon className="w-[17px] h-[17px]" />
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className={`block text-[13.5px] font-semibold transition-colors ${subOpen ? "text-[#134698]" : "text-neutral-800 group-hover/row:text-[#134698]"}`}>
                                  {subItem.label}
                                </span>
                                {count ? (
                                  <span className="block text-[11px] text-neutral-400 mt-0.5">
                                    {count} {subItem.subItems.some((s) => s.isPdf) ? (count === 1 ? "file" : "files") : count === 1 ? "page" : "pages"}
                                  </span>
                                ) : null}
                              </span>
                              {/* Arrow only where a sub-menu opens; direct links show it on hover */}
                              <ChevronRight
                                className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                                  subOpen
                                    ? "text-[#DE802B] translate-x-0.5"
                                    : count
                                      ? "text-neutral-300 group-hover/row:text-[#DE802B] group-hover/row:translate-x-0.5"
                                      : "text-[#DE802B] opacity-0 -translate-x-1 group-hover/row:opacity-100 group-hover/row:translate-x-0"
                                }`}
                              />
                            </>
                          );
                          const rowClass = `group/row w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-colors duration-200 ${
                            subOpen ? "bg-[#F4F7FC]" : "hover:bg-[#F4F7FC]"
                          }`;

                          return (
                            <div
                              key={idx}
                              className="relative"
                              onMouseEnter={() => setActiveSubDropdown(subItem.subItems ? subItem.label : null)}
                              onMouseLeave={() => setActiveSubDropdown(null)}
                            >
                              {subItem.href ? (
                                <a href={subItem.href} className={rowClass}>{row}</a>
                              ) : (
                                <button className={rowClass} aria-label={`Toggle ${subItem.label} submenu`} aria-expanded={subOpen}>
                                  {row}
                                </button>
                              )}

                              {/* ─── Level 2 flyout ───
                                  Opens away from the screen edge (left for right-aligned menus).
                                  Padding, not margin, bridges the gap so the hover isn't lost. */}
                              {subItem.subItems && (
                                <div
                                  className={`absolute top-[-8px] ${item.alignRight ? "right-full pr-2.5" : "left-full pl-2.5"} transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                    subOpen
                                      ? "opacity-100 translate-x-0 visible"
                                      : `opacity-0 ${item.alignRight ? "translate-x-2" : "-translate-x-2"} invisible pointer-events-none`
                                  }`}
                                  style={{ zIndex: 99999 }}
                                >
                                  <div
                                    className="bg-white rounded-2xl p-2 min-w-[250px] border border-[#134698]/10"
                                    style={{ boxShadow: "0 24px 56px -16px rgba(19,70,152,0.35), 0 6px 18px -6px rgba(19,70,152,0.12)" }}
                                  >
                                    <div className="flex items-center gap-2 px-3 pt-2 pb-2.5 mb-1 border-b border-[#134698]/[0.08]">
                                      <Icon className="w-4 h-4 text-[#DE802B]" />
                                      <span className="text-[12.5px] font-bold text-[#134698]">{subItem.label}</span>
                                    </div>
                                    {subItem.subItems.map((subsub, subIdx) => (
                                      <a
                                        key={subIdx}
                                        href={subsub.href}
                                        target={subsub.isPdf ? "_blank" : undefined}
                                        rel={subsub.isPdf ? "noopener noreferrer" : undefined}
                                        className="group/sub flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-neutral-600 hover:text-[#134698] hover:bg-[#F4F7FC] transition-colors duration-200"
                                      >
                                        {subsub.isPdf ? (
                                          <FileDown className="w-3.5 h-3.5 text-[#DE802B]/70 group-hover/sub:text-[#DE802B] flex-shrink-0" />
                                        ) : (
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#DE802B]/50 group-hover/sub:bg-[#DE802B] group-hover/sub:w-3 transition-all duration-200 flex-shrink-0" />
                                        )}
                                        {subsub.label}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* ─── Right Side Actions (Login + Mobile Toggle) ─── */}
          <div className="flex items-center justify-end gap-3 h-full">
            {/* Desktop Login Button */}
            <a
              href="https://admin.designhouse.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              ref={(el) => { toneRefs.current.__login = el; }}
              className={`group hidden lg:inline-flex items-center gap-1.5 px-4 py-2 text-[10.5px] font-bold tracking-[0.14em] uppercase rounded-full transition-all duration-300 ${toneOf("__login") === "light"
                ? "bg-[#134698] text-white shadow-[0_6px_16px_-6px_rgba(19,70,152,0.6)] hover:bg-[#DE802B] hover:shadow-[0_6px_16px_-6px_rgba(222,128,43,0.6)]"
                : "bg-white/10 text-white border border-white/40 backdrop-blur-sm hover:bg-white hover:text-[#134698]"
                }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
              <span>Login</span>
            </a>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden relative p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <m.span
                  animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-[#134698] block origin-center"
                />
                <m.span
                  animate={isMobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  className="w-full h-0.5 bg-[#DE802B] block"
                />
                <m.span
                  animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-[#134698] block origin-center"
                />
              </div>
            </button>
          </div>

        </div>
      </m.nav>

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <m.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm z-50 lg:hidden"
              style={{
                background: "white",
                boxShadow: "8px 0 48px 0 rgba(19,70,152,0.18), 2px 0 12px 0 rgba(19,70,152,0.10)",
              }}
            >
              <div className="flex flex-col h-full">

                {/* Header */}
                <div
                  className="flex items-center justify-between p-5 border-b"
                  style={{ borderColor: "rgba(19,70,152,0.1)", background: "linear-gradient(135deg, rgba(19,70,152,0.04) 0%, transparent 100%)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#134698] to-[#DE802B]" />
                    <span className="text-base font-bold tracking-widest uppercase text-[#134698]">Menu</span>
                  </div>
                  <m.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-[#DE802B]/40 hover:border-[#DE802B] hover:bg-[#DE802B]/10 transition-all"
                  >
                    <X size={18} className="text-[#DE802B]" />
                  </m.button>
                </div>

                {/* Nav Items */}
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="flex flex-col px-4 gap-2 mb-4 border-b pb-4" style={{ borderColor: "rgba(19,70,152,0.06)" }}>
                    {/* Corporate Button */}
                    <button className="relative flex items-center justify-center gap-2 px-4 py-2 text-[12px] font-bold text-blue-400 border border-[#134698] bg-[#134698] transition-all duration-300 hover:bg-blue-400 hover:text-white group overflow-hidden uppercase tracking-widest">
                      <Building2 className="w-3.5 h-3.5" />
                      Corporate
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                    </button>
                  </div>
                  <div className="flex flex-col px-3">
                    {dynamicNavItems.map((item, i) => (
                      <m.div
                        key={item.label}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="border-b"
                        style={{ borderColor: "rgba(19,70,152,0.06)" }}
                      >
                        {item.href && !item.dropdown ? (
                          <a
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center text-[11.5px] uppercase tracking-[0.12em] font-semibold py-4 px-3 text-neutral-600 hover:text-[#134698] hover:bg-[#134698]/[0.04] rounded-xl transition-all duration-200"
                          >
                            <span className="w-1 h-1 rounded-full bg-[#DE802B] mr-3 opacity-60" />
                            {item.label}
                          </a>
                        ) : (
                          <div>
                            <button
                              onClick={() => toggleMobileItem(item.label)}
                              className="w-full flex items-center justify-between text-[11.5px] uppercase tracking-[0.12em] font-semibold py-4 px-3 text-neutral-600 hover:text-[#134698] hover:bg-[#134698]/[0.04] rounded-xl transition-all duration-200"
                            >
                              <span className="flex items-center gap-3">
                                <span className="w-1 h-1 rounded-full bg-[#DE802B] opacity-60" />
                                {item.label}
                              </span>
                              <m.span
                                animate={{ rotate: mobileExpandedItems[item.label] ? 180 : 0 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="inline-flex"
                              >
                                <ChevronDown className="w-4 h-4 text-[#DE802B]" />
                              </m.span>
                            </button>

                            <AnimatePresence>
                              {mobileExpandedItems[item.label] && (
                                <m.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                  className="overflow-hidden"
                                >
                                  <div
                                    className="ml-5 mb-3 mt-1 pl-4 border-l-2 space-y-1 rounded-r-xl"
                                    style={{ borderColor: "rgba(19,70,152,0.15)", background: "rgba(19,70,152,0.02)" }}
                                  >
                                    {item.dropdown?.map((sub, idx) => (
                                      <div key={idx} className="py-1">
                                        {sub.href ? (
                                          <a
                                            href={sub.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-3 py-2 text-[12px] font-semibold text-[#134698]/80 hover:text-[#134698] rounded-lg hover:bg-[#134698]/[0.05] transition-all"
                                          >
                                            {sub.label}
                                          </a>
                                        ) : (
                                          <p className="px-3 py-2 text-[12px] font-semibold text-[#134698]/80">
                                            {sub.label}
                                          </p>
                                        )}
                                        {sub.subItems?.map((subsub, subIdx) => (
                                          <a
                                            key={subIdx}
                                            href={subsub.href}
                                            target={subsub.isPdf ? "_blank" : undefined}
                                            rel={subsub.isPdf ? "noopener noreferrer" : undefined}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-2 w-full text-left px-5 py-1.5 text-[11.5px] text-neutral-500 hover:text-[#DE802B] transition-all duration-150"
                                          >
                                            <span className="w-1 h-1 rounded-full bg-[#DE802B] opacity-50 flex-shrink-0" />
                                            {subsub.label}
                                          </a>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </m.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </m.div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="p-5 border-t"
                  style={{ borderColor: "rgba(19,70,152,0.1)", background: "linear-gradient(135deg, rgba(19,70,152,0.03) 0%, transparent 100%)" }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]/40" />
                    <p className="text-[10px] text-neutral-400 uppercase tracking-[0.18em] font-semibold">Est. 1984</p>
                    <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#134698]/40" />
                  </div>
                </div>

              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
