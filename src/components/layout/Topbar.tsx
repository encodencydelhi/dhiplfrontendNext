"use client";

import {
  Phone,
  Mail,
  ShieldCheck,
  Home,
} from "lucide-react";
import Image from "next/image";
import { useSettings } from "@/hooks/useSettings";

const Topbar = () => {
  const { settings, loading } = useSettings();

  const topbarPhone = settings?.phones?.find((p) => p.forTopbar)?.phone || "+91 9654900525";
  const topbarEmail = settings?.emails?.find((e) => e.forTopbar)?.email || "info@designhouse.co.in";

  if (loading) {
    return <div className="bg-[#0f172a] h-[50px] border-b border-blue-400/20 animate-pulse"></div>;
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-blue-400/20 relative z-50">
      {/* Subtle background pattern (static) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Desktop View */}
        <div className="hidden lg:flex items-center justify-between py-2">
          {/* Left side - Contact Info */}
          <div className="flex items-center gap-6">
            {/* Phone */}
            <a
              href={`tel:${topbarPhone.replace(/[^0-9+]/g, "")}`}
              className="flex items-center gap-2.5 text-white/90 hover:text-[#ED985F] transition-all duration-300 group"
            >
              <div className="p-1.5 bg-[#ED985F]/20 rounded-lg group-hover:bg-[#ED985F]/30 transition-all duration-300">
                <Phone className="w-4 h-4 text-[#ED985F]" />
              </div>
              <span className="text-sm font-medium">{topbarPhone}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${topbarEmail}`}
              className="flex items-center gap-2.5 text-white/90 hover:text-[#ED985F] transition-all duration-300 group"
            >
              <div className="p-1.5 bg-[#ED985F]/20 rounded-lg group-hover:bg-[#ED985F]/30 transition-all duration-300">
                <Mail className="w-4 h-4 text-[#ED985F]" />
              </div>
              <span className="text-sm font-medium">
                {topbarEmail}
              </span>
            </a>
          </div>

          {/* Right side - Buttons */}
          <div className="flex items-center gap-3">
            {/* Ensis Button */}
            <a
              href="https://ensis.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center px-2 py-0.5 bg-white border border-white rounded transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              <Image
                src="/Ensis Panchakarma.png"
                alt="Ensis Panchakarma"
                width={472}
                height={193}
                style={{ width: "auto" }}
                className="h-[20px] brightness-110"
              />
              {/* Tooltip */}
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase rounded shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-[100] border border-blue-400/30 backdrop-blur-sm">
                Panchkarma Solution
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-t border-l border-blue-400/30" />
              </div>
            </a>

            {/* Ensis Home Button */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group relative flex items-center px-2 py-0.5 bg-white border border-white rounded transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              <Image
                src="/Ensis home.png"
                alt="Ensis Home Interior"
                width={474}
                height={197}
                style={{ width: "auto" }}
                className="h-[20px] brightness-110"
              />
              {/* Tooltip */}
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase rounded shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-[100] border border-blue-400/30 backdrop-blur-sm">
                Home Solution
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-t border-l border-blue-400/30" />
              </div>
            </a>

            {/* Login Button */}
            <a
              href="https://admin.designhouse.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-widest uppercase border border-white rounded bg-white text-slate-900 hover:bg-white/90 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              <ShieldCheck className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
              <span>Login</span>
            </a>
          </div>
        </div>

        {/* Tablet View (md to lg) */}
        <div className="hidden md:flex lg:hidden items-center justify-between py-2">
          {/* Contact Icons Only */}
          <div className="flex items-center gap-4">
            <a
              href={`tel:${topbarPhone.replace(/[^0-9+]/g, "")}`}
              className="flex items-center gap-2 text-white/90 hover:text-[#ED985F] transition-all duration-300 group"
            >
              <div className="p-1.5 bg-[#ED985F]/20 rounded-lg group-hover:bg-[#ED985F]/30 transition-all duration-300">
                <Phone className="w-4 h-4 text-[#ED985F]" />
              </div>
            </a>

            <a
              href={`mailto:${topbarEmail}`}
              className="flex items-center gap-2 text-white/90 hover:text-[#ED985F] transition-all duration-300 group"
            >
              <div className="p-1.5 bg-[#ED985F]/20 rounded-lg group-hover:bg-[#ED985F]/30 transition-all duration-300">
                <Mail className="w-4 h-4 text-[#ED985F]" />
              </div>
            </a>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <a
              href="https://ensis.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center px-2 py-0.5 bg-white border border-white rounded transition-all duration-300"
            >
              <Image
                src="/Ensis Panchakarma.png"
                alt="Ensis Panchakarma"
                width={472}
                height={193}
                style={{ width: "auto" }}
                className="h-[22px]"
              />
              {/* Tooltip */}
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase rounded shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-[100] border border-blue-400/30 backdrop-blur-sm">
                Panchkarma Solution
              </div>
            </a>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group relative flex items-center px-2 py-0.5 bg-white border border-white rounded transition-all duration-300"
            >
              <Image
                src="/Ensis home.png"
                alt="Ensis Home Interior"
                width={474}
                height={197}
                style={{ width: "auto" }}
                className="h-[22px]"
              />
              {/* Tooltip */}
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase rounded shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-[100] border border-blue-400/30 backdrop-blur-sm">
                Home Solution
              </div>
            </a>

            {/* Admin Login Button */}
            <a
              href="https://admin.designhouse.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold tracking-widest uppercase bg-white text-slate-900 border border-white rounded hover:bg-white/90 transition-all"
            >
              <ShieldCheck className="w-3 h-3" />
              Login
            </a>
          </div>
        </div>

        {/* Mobile View - NO HAMBURGER MENU, BUTTONS INLINE */}
        <div className="md:hidden py-2">
          <div className="flex items-center justify-between">
            {/* Contact Icons */}
            <div className="flex items-center gap-3">
              <a
                href={`tel:${topbarPhone.replace(/[^0-9+]/g, "")}`}
                aria-label="Call us"
                className="p-1.5 bg-[#ED985F]/20 rounded-lg hover:bg-[#ED985F]/30 transition-all duration-300"
              >
                <Phone className="w-4 h-4 text-[#ED985F]" />
              </a>

              <a
                href={`mailto:${topbarEmail}`}
                aria-label="Email us"
                className="p-1.5 bg-[#ED985F]/20 rounded-lg hover:bg-[#ED985F]/30 transition-all duration-300"
              >
                <Mail className="w-4 h-4 text-[#ED985F]" />
              </a>
            </div>

            {/* Buttons in a row - ONLY ENSIS + ADMIN FOR MOBILE */}
            <div className="flex items-center gap-1.5">
              {/* Ensis Button */}
              <a
                href="https://ensis.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center px-1.5 py-0.5 bg-white border border-white rounded transition-all duration-300"
              >
                <Image
                  src="/Ensis Panchakarma.png"
                  alt="Ensis Panchakarma"
                  width={472}
                  height={193}
                  style={{ width: "auto" }}
                  className="h-[18px]"
                />
                {/* Tooltip (Only if user has mouse on mobile, e.g. iPad) */}
                <div className="absolute bottom-[calc(100%+8px)] right-0 px-2 py-1 bg-slate-900 text-white text-[8px] font-bold tracking-wider uppercase rounded shadow-2xl opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-[100] border border-blue-400/30">
                  Panchkarma Solution
                </div>
              </a>

              {/* User Login - Mobile */}
              <a
                href="https://admin.designhouse.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase bg-white text-slate-900 border border-white rounded"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Login</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Static bottom accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
    </div>
  );
};

export default Topbar;