"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { api, API_URL, API_IS_LOCAL } from "@/lib/api";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const Footer = () => {
  const { settings } = useSettings();
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
  });

  // Fetch social links
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await api.get("/api/social-media");
        if (response.data.success) {
          setSocialLinks(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching social media links:", error);
      }
    };
    fetchSocialLinks();
  }, []);

  // Fix broken links (add https://)
  const normalizeUrl = (url: string) => {
    if (!url) return "";
    let u = url.trim();
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    if (u.startsWith("//")) return "https:" + u;
    return u === "#" ? "#" : "https://" + u;
  };

  const safeHref = (url: string) =>
    url && url.trim() !== "" ? normalizeUrl(url) : "#";

  const quickLinks = [
    { label: "Retail Interiors", href: "#" },
    { label: "Corporate Interiors", href: "#" },
    { label: "Restaurant Interior", href: "#" },
    { label: "Shop In Shops", href: "#" },
    { label: "Retail Display Merchandising", href: "#" },
    { label: "Retail Kiosk", href: "#" },
    { label: "Exhibition & Events", href: "#" },
    { label: "Interior Design Company", href: "#" },
  ];

  const socialLinksData = [
    { Icon: Facebook, href: socialLinks.facebook, label: "Facebook" },
    { Icon: Instagram, href: socialLinks.instagram, label: "Instagram" },
    { Icon: Twitter, href: socialLinks.twitter, label: "Twitter" },
    { Icon: Youtube, href: socialLinks.youtube, label: "YouTube" },
    { Icon: Linkedin, href: socialLinks.linkedin, label: "LinkedIn" },
  ];

  return (
    <footer className="bg-[#132440] text-white">
      {/* ================= MAIN FOOTER ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* ================= BRAND / ABOUT ================= */}
          <div>
            {/* LOGO WITH WHITE BACKGROUND */}
            <div className="mb-4 inline-block bg-white p-2 rounded-md">
              <Image
                src={settings?.logo ? `${API_URL}${settings.logo.startsWith('/') ? '' : '/'}${settings.logo}` : "/logo.webp"}
                alt="Design House"
                width={200}
                height={62}
                style={{ width: "auto" }}
                className="h-12 object-contain"
                loading="lazy"
                unoptimized={settings?.logo ? API_IS_LOCAL : false}
              />
            </div>

            <p className="text-white/80 mb-3 leading-relaxed text-sm">
              Design House India Private Limited is one of the most well-known
              and well-equipped producers of retail display and interior
              solutions.
            </p>

            <p className="text-white/80 leading-relaxed text-sm">
              Our efficient manufacturing and distribution network enables us to
              deliver consistent quality across projects nationwide.
            </p>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">
              Quick Links
            </h4>

            <ul className="space-y-2">
              {(settings?.quickLinks?.length ? settings.quickLinks : quickLinks).map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="group text-white/80 hover:text-[#DE802B] transition-colors duration-300 text-sm flex items-start"
                  >
                    <span className="mr-2 text-[#DE802B] group-hover:translate-x-1 transition-transform duration-300">
                      +
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= CONTACT INFO ================= */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Contact</h4>

            <div className="space-y-4">
              {/* PHONE */}
              <div>
                <h5 className="font-semibold mb-2 flex items-center text-white text-sm">
                  <Phone className="w-4 h-4 mr-2 text-[#DE802B]" />
                  Phone
                </h5>
                {settings?.phones?.length ? (
                  settings.phones.map((p, index) => (
                    <a
                      key={index}
                      href={`tel:${p.phone.replace(/[^0-9+]/g, "")}`}
                      className="block text-white/80 hover:text-[#DE802B] transition-colors text-sm mb-1"
                    >
                      {p.phone}
                    </a>
                  ))
                ) : (
                  <span className="text-white/60 text-sm">Loading...</span>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <h5 className="font-semibold mb-2 flex items-center text-white text-sm">
                  <Mail className="w-4 h-4 mr-2 text-[#DE802B]" />
                  Email
                </h5>
                {settings?.emails?.length ? (
                  settings.emails.map((e, index) => (
                    <a
                      key={index}
                      href={`mailto:${e.email}`}
                      className="block text-white/80 hover:text-[#DE802B] transition-colors text-sm mb-1"
                    >
                      {e.email}
                    </a>
                  ))
                ) : (
                  <span className="text-white/60 text-sm">Loading...</span>
                )}
              </div>
            </div>
          </div>

          {/* ================= ADDRESS ================= */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center text-white">
              <MapPin className="w-4 h-4 mr-2 text-[#DE802B]" />
              Address
            </h4>

            {settings?.addresses?.length ? (
              settings.addresses.map((addr, index) => (
                <div key={index} className="mb-3">
                  <p className="text-white font-medium text-sm mb-1">{addr.title || addr.city}</p>
                  <div className="text-white/80 text-xs leading-relaxed space-y-1">
                    <div dangerouslySetInnerHTML={{ __html: addr.street }} />
                    {(addr.city || addr.state || addr.zipCode) && (
                      <p className="opacity-75">
                        {[addr.city, addr.state, addr.zipCode].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="mb-3">
                <p className="text-white font-medium text-sm mb-1">Head Office</p>
                <p className="text-white/80 text-xs leading-relaxed">
                  12/29, Site-II, Loni Road, Industrial Area, Mohan Nagar,
                  Ghaziabad, Uttar Pradesh – 201007
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/80 text-xs text-center md:text-left">
              © 2026 IHWE <span className="text-[#DE802B] font-medium">Property of Namo Gange Wellness Pvt. Ltd.</span>. All rights reserved. <span> Designed & Developed by Encodancy Pvt. Ltd.</span>
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-3">
              {socialLinksData.map(({ Icon, href, label }, index) => (
                <a
                  key={index}
                  href={safeHref(href)}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group w-9 h-9 border border-white/30 flex items-center justify-center hover:bg-[#DE802B] hover:border-[#DE802B] transition-all duration-300 rounded ${!href ? 'opacity-40 cursor-not-allowed' : ''}`}
                  onClick={(e) => {
                    if (!href || !href.trim()) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Icon className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;