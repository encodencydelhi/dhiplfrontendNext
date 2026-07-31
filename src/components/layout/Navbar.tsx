"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { api, API_URL, API_IS_LOCAL } from "@/lib/api";
import { ChevronDown, X, Building2, ShieldCheck } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useSettings } from "@/hooks/useSettings";

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

/* ─── Animation Variants ─── */

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as any, staggerChildren: 0.04, delayChildren: 0.05 },
  },
  exit: { opacity: 0, y: -6, scale: 0.97, filter: "blur(3px)", transition: { duration: 0.22 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as any } },
};

const subDropdownVariants = {
  hidden: { opacity: 0, x: -10, scale: 0.96, filter: "blur(4px)" },
  visible: {
    opacity: 1, x: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as any, staggerChildren: 0.035, delayChildren: 0.04 },
  },
  exit: { opacity: 0, x: -8, scale: 0.96, filter: "blur(3px)", transition: { duration: 0.18 } },
};

const subItemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as any } },
};

/* ─── Navbar ─── */

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedItems, setMobileExpandedItems] = useState({});
  const [companyProfilePdfs, setCompanyProfilePdfs] = useState([]);
  const { settings } = useSettings();

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
          ? "top-0 bg-white backdrop-blur-lg shadow-[0_4px_32px_0_rgba(19,70,152,0.13),0_1.5px_0_0_rgba(19,70,152,0.08)]"
          : "top-[48px] bg-transparent backdrop-blur-none shadow-none"
          }`}
        style={{ fontFamily: "'Inter', sans-serif", borderBottom: isScrolled ? "1.5px solid rgba(19,70,152,0.09)" : "none" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[56px] sm:h-[72px] flex justify-between lg:grid lg:grid-cols-[auto_1fr_auto] items-center">

          {/* Logo — this grid slot (lg:grid-cols-[auto_1fr_auto]) is always
              rendered even before settings load, so the nav-links and
              right-actions columns don't reflow once the logo pops in. */}
          <a href="/" className="flex items-center z-10 h-[42px] sm:h-[62px] min-w-[135px] sm:min-w-[200px]">
            {settings?.logo && (
              <m.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.2 }}
                className={`transition-all duration-500 rounded-xl px-2 py-0.5 sm:px-3 sm:py-1 ${isScrolled
                    ? "bg-white/90 backdrop-blur-sm shadow-sm"
                    : "bg-white shadow-[0_0_40px_rgba(255,255,255,0.8),0_0_15px_rgba(255,255,255,0.5)] border border-white/40 mb-1"
                  }`}
              >
                <Image
                  src={`${API_URL}${settings.logo.startsWith('/') ? '' : '/'}${settings.logo}`}
                  alt="Design House"
                  width={200}
                  height={62}
                  style={{ width: "auto" }}
                  className="h-[42px] sm:h-[62px]"
                  priority
                  unoptimized={API_IS_LOCAL}
                />
              </m.div>
            )}
          </a>

          {/* ─── Desktop Nav ─── */}
          <div className="hidden lg:flex justify-center items-center gap-7 whitespace-nowrap h-full">
            {dynamicNavItems.map((item) => (
              <div
                key={item.label}
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => { setActiveDropdown(null); setActiveSubDropdown(null); }}
              >
                {/* ── Single link (no dropdown) ── */}
                {item.href && !item.dropdown ? (
                  <a
                    href={item.href}
                    className={`inline-flex items-center text-[11.5px] uppercase tracking-[0.1em] font-semibold transition-all duration-300 relative group leading-none ${isScrolled ? "text-neutral-700 hover:text-[#134698]" : "text-white hover:text-white/80"}`}
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full bg-gradient-to-r from-[#134698] to-[#DE802B]" />
                  </a>
                ) : (
                  /* ── Dropdown trigger ── */
                  <button
                    className={`inline-flex items-center gap-1 text-[11.5px] uppercase tracking-[0.1em] font-semibold transition-all duration-300 relative group leading-none bg-transparent border-0 p-0 m-0 cursor-pointer ${isScrolled ? "text-neutral-700 hover:text-[#134698]" : "text-white hover:text-white/80"}`}
                    style={{ verticalAlign: "middle" }}
                    aria-label={`Toggle ${item.label} menu`}
                    aria-expanded={activeDropdown === item.label}
                  >
                    <span className="leading-none">{item.label}</span>
                    {item.dropdown && (
                      <m.span
                        animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center leading-none"
                        style={{ lineHeight: 0 }}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </m.span>
                    )}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full bg-gradient-to-r from-[#134698] to-[#DE802B]" />
                  </button>
                )}

                {/* ─── Level 1 Dropdown ─── */}
                <AnimatePresence>
                  {item.dropdown && activeDropdown === item.label && (
                    <m.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`absolute top-full pt-5 ${item.alignRight ? "right-0" : "left-0"}`}
                      style={{ zIndex: 9999 }}
                    >
                      {/* Arrow tip */}
                      <div
                        className={`absolute top-3 w-3 h-3 bg-white rotate-45 border-t border-l border-[#134698]/10 ${item.alignRight ? "right-6" : "left-6"}`}
                        style={{ zIndex: 10000 }}
                      />

                      <div
                        className="bg-white rounded-2xl py-3 min-w-[240px]"
                        style={{
                          boxShadow: "0 8px 40px 0 rgba(19,70,152,0.14), 0 2px 8px 0 rgba(19,70,152,0.08), 0 0 0 1px rgba(19,70,152,0.07)",
                        }}
                      >
                        {/* Top accent line */}
                        <div className="h-[2px] mx-4 mb-3 rounded-full bg-gradient-to-r from-[#134698] via-[#DE802B] to-transparent opacity-60" />

                        {item.dropdown.map((subItem, idx) => (
                          <m.div
                            key={idx}
                            variants={itemVariants}
                            className="relative"
                            onMouseEnter={() => subItem.subItems && setActiveSubDropdown(subItem.label)}
                            onMouseLeave={() => setActiveSubDropdown(null)}
                          >
                            {subItem.href ? (
                              <a
                                href={subItem.href}
                                className="flex items-center justify-between px-5 py-2.5 text-[13px] font-medium text-neutral-600 hover:text-[#134698] hover:bg-[#134698]/[0.04] transition-all duration-200 group mx-1 rounded-lg"
                              >
                                <span className="relative">
                                  {subItem.label}
                                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#DE802B] transition-all duration-300 group-hover:w-full" />
                                </span>
                                {subItem.subItems && (
                                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#DE802B] opacity-70" />
                                )}
                              </a>
                            ) : (
                              <button
                                className="flex items-center justify-between px-5 py-2.5 text-[13px] font-medium text-neutral-600 hover:text-[#134698] hover:bg-[#134698]/[0.04] transition-all duration-200 group w-full mx-1 rounded-lg text-left"
                                aria-label={`Toggle ${subItem.label} submenu`}
                                aria-expanded={activeSubDropdown === subItem.label}
                              >
                                <span className="relative">
                                  {subItem.label}
                                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#DE802B] transition-all duration-300 group-hover:w-full" />
                                </span>
                                {subItem.subItems && (
                                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#DE802B] opacity-70" />
                                )}
                              </button>
                            )}

                            {/* ─── Level 2 Sub-Dropdown ─── */}
                            <AnimatePresence>
                              {subItem.subItems && activeSubDropdown === subItem.label && (
                                <m.div
                                  variants={subDropdownVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="absolute left-full top-0 ml-2"
                                  style={{ zIndex: 99999 }}
                                  onMouseEnter={() => setActiveSubDropdown(subItem.label)}
                                  onMouseLeave={() => setActiveSubDropdown(null)}
                                >
                                  {/* Arrow tip */}
                                  <div
                                    className="absolute left-[-5px] top-4 w-2.5 h-2.5 bg-[#134698] rotate-45"
                                    style={{ zIndex: 100000 }}
                                  />

                                  <div
                                    className="rounded-2xl py-2.5 min-w-[210px]"
                                    style={{
                                      background: "linear-gradient(145deg, #1a56b8 0%, #134698 60%, #0e3578 100%)",
                                      boxShadow: "0 12px 48px 0 rgba(19,70,152,0.30), 0 4px 16px 0 rgba(19,70,152,0.20), inset 0 1px 0 rgba(255,255,255,0.12)",
                                    }}
                                  >
                                    <div className="h-[1px] mx-3 mb-2 rounded-full bg-gradient-to-r from-white/20 via-white/40 to-transparent" />

                                    {subItem.subItems.map((subsub, subIdx) => (
                                      <m.button
                                        key={subIdx}
                                        variants={subItemVariants}
                                        onClick={() => {
                                          if (subsub.isPdf) {
                                            window.open(subsub.href, "_blank", "noopener,noreferrer");
                                          } else {
                                            window.location.href = subsub.href;
                                          }
                                        }}
                                        className="flex items-center gap-2.5 w-full text-left px-5 py-2.5 text-[12.5px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#DE802B] opacity-60 group-hover:opacity-100 transition-all duration-200 flex-shrink-0" />
                                        {subsub.label}
                                      </m.button>
                                    ))}
                                  </div>
                                </m.div>
                              )}
                            </AnimatePresence>

                          </m.div>
                        ))}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>

              </div>
            ))}
          </div>

          {/* ─── Right Side Actions (Login + Mobile Toggle) ─── */}
          <div className="flex items-center justify-end gap-3 h-full">
            {/* Desktop Login Button */}
            <a
              href="https://admin.designhouse.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group hidden lg:flex items-center gap-1 px-3 py-1.5 text-[9.5px] font-bold tracking-widest uppercase border-2 rounded-lg bg-transparent transition-all duration-300 ${isScrolled
                ? "border-[#134698] hover:bg-white hover:shadow-[0_0_15px_rgba(19,70,152,0.2)]"
                : "border-white hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${isScrolled
                ? "text-[#134698] group-hover:text-[#134698]"
                : "text-white group-hover:text-[#134698]"
                }`} />
              <span className={`transition-colors ${isScrolled
                ? "text-[#134698] group-hover:text-[#134698]"
                : "text-white group-hover:text-[#134698]"
                }`}>Login</span>
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
                                          <button
                                            key={subIdx}
                                            onClick={() => {
                                              if (subsub.isPdf) {
                                                window.open(subsub.href, "_blank", "noopener,noreferrer");
                                              } else {
                                                window.location.href = subsub.href;
                                              }
                                              setIsMobileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-2 w-full text-left px-5 py-1.5 text-[11.5px] text-neutral-500 hover:text-[#DE802B] transition-all duration-150"
                                          >
                                            <span className="w-1 h-1 rounded-full bg-[#DE802B] opacity-50 flex-shrink-0" />
                                            {subsub.label}
                                          </button>
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