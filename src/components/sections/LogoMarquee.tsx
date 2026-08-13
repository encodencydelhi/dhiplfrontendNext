"use client";

import { m } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { api, API_URL, API_IS_LOCAL } from "@/lib/api";
import Image from "next/image";

interface Client {
  _id: string;
  name: string;
  url: string;
  image: string;
  altText?: string;
  status: string;
  showOnHomepage: boolean;
}

const LogoMarquee = () => {
  const [logos, setLogos] = useState<Client[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);


  // ✅ FETCH HOMEPAGE CLIENTS FROM BACKEND
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await api.get("/api/client/homepage");

        if (response.data.success) {
          setLogos(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch homepage logos:", error);
      }
    };

    fetchLogos();
  }, []);



  // ✅ SVG PATH ANIMATION
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: 1.5,
          ease: "easeInOut" as any,
          delay: 0.5,
        },
        opacity: {
          duration: 0.3,
          delay: 0.5,
        },
      },
    },
  };

  // ✅ DON'T SHOW SECTION IF NO LOGOS
  if (logos.length === 0) {
    return null;
  }

  return (
    <section className="pt-16 pb-4 md:pt-20 md:pb-6 bg-gradient-to-b from-blue-50/30 to-white overflow-hidden relative">
      <div className="w-full">
        {/* HEADER */}
        <div className="container mx-auto max-w-[1400px] px-4 md:px-8 lg:px-10 mb-12 relative">
          {/* Centered Text Content */}
          <div className="text-center max-w-3xl mx-auto">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]"></div>
              <span className="text-sm md:text-base uppercase tracking-[0.35em] text-[#134698] font-bold">
                OUR CLIENTS
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#134698]"></div>
            </m.div>

            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-2xl md:text-3xl lg:text-4xl font-serif mb-5 leading-tight text-gray-900"
            >
              Trusted by{" "}
              <span className="text-[#DE802B] relative inline-block">
                Leading Brands
                <m.svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#134698]/50"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <m.path
                    d="M2 10C60 2, 140 2, 198 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    variants={pathVariants}
                  />
                </m.svg>
              </span>
            </m.h2>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="text-gray-700 leading-relaxed text-sm md:text-base max-w-2xl mx-auto"
            >
              Partnering with industry leaders to create exceptional spaces
            </m.p>
          </div>

          {/* View All Button - Positioned Right on Desktop */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 md:mt-0 md:absolute md:right-8 md:bottom-2 lg:right-10"
          >
            <a
              href="/clients"
              className="group inline-flex items-center gap-2 px-4 py-2 bg-[#DE802B] text-white text-[11px] font-bold rounded-lg hover:bg-[#c66d21] transition-all duration-300 shadow-lg hover:shadow-[#DE802B]/20 uppercase tracking-wider"
            >
              VIEW ALL CLIENTS
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </m.div>
        </div>

        {/* INFINITE SLIDER */}
        <div className="relative w-full border-t border-b border-gray-500">
          {/* FADE OVERLAYS */}
          <div className="pointer-events-none absolute top-0 left-0 h-full w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />

          {/* SLIDER CONTAINER */}
          <div
            className="overflow-hidden py-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
           <div
  ref={containerRef}
  className={`flex gap-6 md:gap-8 items-center marquee ${
    isHovered ? "pause-marquee" : ""
  }`}
>
              {/* DUPLICATE LOGOS TWICE FOR SEAMLESS LOOP */}
              {[...logos, ...logos].map((logo, index) => (
                <div
                  key={`${logo._id}-${index}`}
                  className="flex-shrink-0"
                  style={{ width: "180px" }}
                >
                  {logo.url && logo.url !== "#" ? (
                    <a
                      href={logo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center h-36 px-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#DE802B]/20 transition-all duration-300"
                    >
                      <Image
                        src={`${API_URL}${logo.image?.startsWith('/') ? '' : '/'}${logo.image}`}
                        alt={logo.altText || logo.name}
                        width={160}
                        height={64}
                        className="  object-contain transition-all duration-300 group-hover:scale-110"
                        loading="lazy"
                        unoptimized={API_IS_LOCAL}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector("span")) {
                            const span = document.createElement("span");
                            span.className = "text-gray-400 text-sm font-semibold";
                            span.textContent = logo.name;
                            parent.appendChild(span);
                          }
                        }}
                      />
                    </a>
                  ) : (
                    <div className="group flex items-center justify-center h-24 px-6 bg-white rounded-xl shadow-sm border border-gray-100">
                      <Image
                        src={`${API_URL}${logo.image.startsWith('/') ? '' : '/'}${logo.image}`}
                        alt={logo.altText || logo.name}
                        width={160}
                        height={64}
                        className="max-w-full max-h-16 object-contain"
                        loading="lazy"
                        unoptimized={API_IS_LOCAL}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector("span")) {
                            const span = document.createElement("span");
                            span.className = "text-gray-400 text-sm font-semibold";
                            span.textContent = logo.name;
                            parent.appendChild(span);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
           </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;