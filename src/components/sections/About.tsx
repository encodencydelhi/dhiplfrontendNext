"use client";
import React, { lazy, Suspense, useRef, useEffect, useState } from "react";
import Image from "next/image";
import { m } from "framer-motion";
const MotionSection = lazy(() => import("../MotionSection"));
import { Target, Award, ArrowRight } from "lucide-react";
import staticImg11 from "@/assets/11.webp";
import aboutImg1 from "@/assets/3_11zon.webp";
import aboutImg2 from "@/assets/5.jpg_11zon.jpeg";
import aboutImg3 from "@/assets/about3_11zon.webp";
import aboutImg4 from "@/assets/8_11zon.jpg";
import { api, API_URL } from "@/lib/api";
import { cleanDescription } from "@/lib/utils";

/* =========================
   TYPES
========================= */
interface Section {
  _id: string;
  type: string;
  content: string;
  heading?: string;
  subheading?: string;
  highlightedWord?: string;
  title?: string;
  order: number;
}


interface DescriptionBox {
  _id: string;
  type: "normal" | "mission" | "vision";
  title: string;
  content: string;
}

interface Image {
  _id: string;
  url: string;
  caption: string;
  alt?: string;
}

interface AboutData {
  ctaText: string;
  ctaPath: string;
  sections: Section[];
  descriptionBoxes: DescriptionBox[];
  media: {
    images: Image[];
    videos: any[];
  };
  bottomMediaType?: 'image' | 'video';
  heading?: string;
  subheading?: string;
  highlightedWord?: string;
}

/* =========================
   COMPONENT
========================= */
const About = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);

        const aboutRes = await api.get("/api/about");

        if (aboutRes.data?.success) {
          setAboutData(aboutRes.data.data);
        }
      } catch (err: any) {
        console.error("Error fetching about/youtube data:", err);
        setError(err.response?.data?.message || "Failed to load about page data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  /* =========================
     SVG ANIMATION
  ========================= */
  const pathVariants: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.5 },
        opacity: { duration: 0.3, delay: 0.5 },
      },
    },
  };

  /* =========================
     HELPERS
  ========================= */
  const latestSection = aboutData?.sections && aboutData.sections.length > 0
    ? [...aboutData.sections].sort((a, b) => b.order - a.order)[0]
    : null;

  const headingText = latestSection?.heading || aboutData?.heading || "About Us";
  const subheadingText = latestSection?.subheading || aboutData?.subheading || "";
  const highlightContent = latestSection?.highlightedWord || aboutData?.highlightedWord || "";

  const bottomMediaType = aboutData?.bottomMediaType || 'image';

  const getDescriptions = () =>
    aboutData?.descriptionBoxes?.filter((b) => b.type === "normal") || [];

  const getMissionBox = () =>
    aboutData?.descriptionBoxes?.find((b) => b.type === "mission");

  const getVisionBox = () =>
    aboutData?.descriptionBoxes?.find((b) => b.type === "vision");

  const dynamicVideos = aboutData?.media?.videos || [];

  const ctaText = aboutData?.ctaText || "Read More";
  const ctaPath = aboutData?.ctaPath || "#";

  const descriptions = getDescriptions();
  const missionBox = getMissionBox();
  const visionBox = getVisionBox();

  /* =========================
     LOADING / ERROR
  ========================= */
  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="flex justify-center min-h-[300px] items-center">
          <div className="w-12 h-12 border-4 border-[#134698] border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#134698] text-white rounded-md"
          aria-label="Retry loading about content"
        >
          Retry
        </button>
      </section>
    );
  }

  /* =========================
     JSX
  ========================= */
  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-16 md:py-20 bg-white overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* ================= MEDIA GRID ================= */}
          <Suspense fallback={<div className="h-[400px] w-full bg-gray-50 animate-pulse rounded-2xl" />}>
            <MotionSection
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {[aboutImg1, aboutImg2, aboutImg3, aboutImg4].map((imgSrc, idx) => {
                  return (
                    <m.div
                      key={`static-image-${idx}`}
                      initial={{ opacity: 0, x: -100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: (100 + idx * 100) / 1000, ease: [0.42, 0, 0.58, 1] }}
                      className="relative overflow-hidden rounded-xl aspect-square bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 group"
                    >
                        <Image
                          src={imgSrc}
                          alt={`About Image ${idx + 1}`}
                          quality={70}
                          style={{ aspectRatio: '1/1' }}
                          sizes="(max-width: 768px) 50vw, 300px"
                          loading="lazy"
                          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                        />
                    </m.div>
                  );
                })}
              </div>
            </MotionSection>
          </Suspense>

          {/* ================= CONTENT ================= */}
          <Suspense fallback={<div className="h-[400px] w-full bg-gray-50 animate-pulse rounded-2xl" />}>
            <MotionSection
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* ABOUT US LABEL */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#134698]" />
                <span className="uppercase tracking-[0.3em] text-[#134698] font-bold text-sm">
                  {headingText}
                </span>
                <div className="h-px w-8 bg-[#134698]" />
              </div>

              {/* HEADING + HIGHLIGHT */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 text-gray-900 leading-tight">
                {subheadingText}
                {highlightContent && (
                  <span className="ml-2 text-[#DE802B] relative inline-block">
                    {highlightContent}
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-3 text-[#134698]/50"
                      viewBox="0 0 200 12"
                      fill="none"
                    >
                      <path
                        d="M2 10C60 2, 140 2, 198 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        // Removed complex motion variants for now to prioritize fix
                      />
                    </svg>
                  </span>
                )}
              </h2>

              {/* DESCRIPTIONS */}
              <div className="space-y-4 mb-6">
                {descriptions.map((desc) => (
                  <div
                    key={desc._id}
                    className="text-gray-700 text-sm md:text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: cleanDescription(desc.content) }}
                  />
                ))}
              </div>

              {/* MISSION & VISION */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {missionBox && (
                  <m.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.42, 0, 0.58, 1] }}
                    className="bg-white border-2 border-gray-200 p-6 hover:shadow-2xl hover:border-[#DE802B] transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#DE802B]/10 flex items-center justify-center flex-shrink-0 rounded">
                        <Target className="w-6 h-6 text-[#DE802B]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#134698] uppercase tracking-wide">
                          Our {missionBox.title}
                        </h3>
                      </div>
                    </div>
                    <div
                      className="text-sm text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: cleanDescription(missionBox.content) }}
                    />
                  </m.div>
                )}

                {visionBox && (
                  <m.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.42, 0, 0.58, 1] }}
                    className="bg-white border-2 border-gray-200 p-6 hover:shadow-2xl hover:border-[#134698] transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#134698]/10 flex items-center justify-center flex-shrink-0 rounded">
                        <Award className="w-6 h-6 text-[#134698]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#DE802B] uppercase tracking-wide">
                          Our {visionBox.title}
                        </h3>
                      </div>
                    </div>
                    <div
                      className="text-sm text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: cleanDescription(visionBox.content) }}
                    />
                  </m.div>
                )}
              </div>

              {/* BUTTON */}
              <div className="flex justify-end">
                <a
                  href={ctaPath}
                  className="border border-[#134698] px-5 py-2.5 text-xs font-medium tracking-wider hover:bg-[#134698] hover:text-white transition flex items-center gap-2 text-[#DE802B] no-underline"
                >
                  {ctaText}
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </MotionSection>
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default About;
