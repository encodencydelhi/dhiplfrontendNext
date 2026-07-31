"use client";

import { Users, PenTool, Hammer, CheckCircle, Target, HelpCircle, ArrowRight } from "lucide-react";
import { m } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect, lazy, Suspense } from "react";
const MotionSection = lazy(() => import("../MotionSection"));
import { api, API_URL, API_IS_LOCAL } from "@/lib/api";
import { cleanDescription } from "@/lib/utils";

const iconMap: { [key: string]: any } = {
  Users,
  PenTool,
  Hammer,
  CheckCircle,
  Target,
  HelpCircle
};

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  image: string;
  altText?: string;
  icon: string;
  color: 'orange' | 'blue';
  order: number;
}

interface HowWeWorkData {
  subheading: string;
  heading: string;
  highlightTexts: string[];
  descriptionHtml: string;
  quote: string;
  processSteps: ProcessStep[];
}

const HowWeWork = ({ isHomePage = false }: { isHomePage?: boolean }) => {
  const [data, setData] = useState<HowWeWorkData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/how-we-work");
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching How We Work data:", error);
      }
    };
    fetchData();
  }, []);

  const pathVariants: any = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: 1.5,
          ease: [0.42, 0, 0.58, 1],
          delay: 0.5
        },
        opacity: {
          duration: 0.3,
          delay: 0.5
        }
      }
    }
  };

  return (
    <section
      id="how-we-work"
      className="relative pt-12 md:pt-0 pb-12 md:pb-16 overflow-hidden bg-fixed"
      style={{
        backgroundImage: "url('/h1-bg01-1.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-start">

          {/* Left Side - Content (2 columns) */}
          <div className="lg:col-span-2 lg:sticky lg:top-6 mt-0 md:-mt-14 lg:-mt-20">
            {/* Section Label */}
            <Suspense fallback={<div className="h-6 w-32 bg-gray-50 mb-2" />}>
              <MotionSection
                className="inline-flex items-center gap-3 mb-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="h-px w-8 bg-gradient-to-r from-transparent via-[#134698] to-[#134698]"></div>
                <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-[#134698] font-bold">
                  {data?.subheading || 'HOW WE WORK'}
                </span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent via-[#134698] to-[#134698]"></div>
              </MotionSection>
            </Suspense>

            {/* Main Heading - H1 for Home Page SEO, H2 otherwise */}
            <Suspense fallback={<div className="h-10 w-full bg-gray-50 mb-6" />}>
              <MotionSection
                className="text-2xl md:text-3xl lg:text-4xl font-serif leading-tight text-gray-900 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                {isHomePage ? (
                  <h1>
                    {data?.heading ? (
                      <>
                        {data.heading.split('\n').map((line, lineIdx) => (
                          <span key={lineIdx} className="block mb-1">
                            {line.split(new RegExp(`(${data.highlightTexts.filter(t => t.trim()).join('|')})`, 'gi')).map((part, i) => {
                              const isHighlighted = data.highlightTexts.some(h =>
                                h.trim().toLowerCase() === part.trim().toLowerCase() && h.trim() !== ""
                              );
                              if (isHighlighted) {
                                return (
                                  <span key={i} className="text-[#DE802B] relative inline-block mx-1">
                                    {part}
                                    <svg
                                      className="absolute -bottom-1 left-0 w-full h-2"
                                      viewBox="0 0 200 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M2 10C60 2, 140 2, 198 10"
                                        stroke="#134698"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeOpacity="0.5"
                                      />
                                    </svg>
                                  </span>
                                );
                              }
                              return <span key={i}>{part}</span>;
                            })}
                          </span>
                        ))}
                      </>
                    ) : (
                      <>
                        <span className="block mb-1">Description</span>
                        <span className="text-[#DE802B] relative inline-block">
                          Architecture
                          <svg
                            className="absolute -bottom-1 left-0 w-full h-2"
                            viewBox="0 0 200 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 10C60 2, 140 2, 198 10"
                              stroke="#134698"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeOpacity="0.5"
                            />
                          </svg>
                        </span>
                        <br />
                        <span className="text-[#DE802B] relative inline-block mt-1">
                          Process
                          <svg
                            className="absolute -bottom-1 left-0 w-full h-2"
                            viewBox="0 0 200 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 10C60 2, 140 2, 198 10"
                              stroke="#134698"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeOpacity="0.5"
                            />
                          </svg>
                        </span>
                        <span className="block mt-1">For Exceptional Results.</span>
                      </>
                    )}
                  </h1>
                ) : (
                  <>
                    {data?.heading ? (
                      <>
                        {data.heading.split('\n').map((line, lineIdx) => (
                          <span key={lineIdx} className="block mb-1">
                            {line.split(new RegExp(`(${data.highlightTexts.filter(t => t.trim()).join('|')})`, 'gi')).map((part, i) => {
                              const isHighlighted = data.highlightTexts.some(h =>
                                h.trim().toLowerCase() === part.trim().toLowerCase() && h.trim() !== ""
                              );
                              if (isHighlighted) {
                                return (
                                  <span key={i} className="text-[#DE802B] relative inline-block mx-1">
                                    {part}
                                    <svg
                                      className="absolute -bottom-1 left-0 w-full h-2"
                                      viewBox="0 0 200 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M2 10C60 2, 140 2, 198 10"
                                        stroke="#134698"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeOpacity="0.5"
                                      />
                                    </svg>
                                  </span>
                                );
                              }
                              return <span key={i}>{part}</span>;
                            })}
                          </span>
                        ))}
                      </>
                    ) : (
                      <>
                        <span className="block mb-1">Description</span>
                        <span className="text-[#DE802B] relative inline-block">
                          Architecture
                          <svg
                            className="absolute -bottom-1 left-0 w-full h-2"
                            viewBox="0 0 200 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 10C60 2, 140 2, 198 10"
                              stroke="#134698"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeOpacity="0.5"
                            />
                          </svg>
                        </span>
                        <br />
                        <span className="text-[#DE802B] relative inline-block mt-1">
                          Process
                          <svg
                            className="absolute -bottom-1 left-0 w-full h-2"
                            viewBox="0 0 200 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 10C60 2, 140 2, 198 10"
                              stroke="#134698"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeOpacity="0.5"
                            />
                          </svg>
                        </span>
                        <span className="block mt-1">For Exceptional Results.</span>
                      </>
                    )}
                  </>
                )}
              </MotionSection>
            </Suspense>

            {/* Description Paragraphs - Compact */}
            <Suspense fallback={<div className="h-24 w-full bg-gray-50" />}>
              <MotionSection
                className="space-y-3 how-we-work-content max-w-none text-gray-700 leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                dangerouslySetInnerHTML={{
                  __html: cleanDescription(data?.descriptionHtml) || `
                  <p>Our process is alive – adapting, refining, and growing with your vision. Always evolving to meet your unique needs.</p>
                  <p>Like artists with a blank canvas, we transform ordinary spaces into extraordinary living works of art that inspire daily.</p>
                  <p>Every space we design perfectly balances aesthetics with functionality, ensuring comfort and timeless appeal.</p>
                  <p>From concept to completion, we focus on materials, lighting, and textures that elevate everyday living.</p>
                ` }}
              />
            </Suspense>
            <style>{`
            .how-we-work-content a {
                color: #2563eb;
                text-decoration: underline;
                font-weight: 600;
            }
            .how-we-work-content a:hover {
                color: #1e40af;
            }
            .how-we-work-content p { margin-bottom: 1em; }
            `}</style>

            {/* Decorative Quote - Compact */}
            {(data?.quote || !data) && (
              <Suspense fallback={<div className="h-10 w-full bg-gray-50 mt-6" />}>
                <MotionSection
                  className="mt-6 pl-4 border-l-4 border-[#DE802B]"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm md:text-base font-serif italic text-gray-700">
                    {data?.quote || `"Excellence in architecture is a journey of continuous refinement."`}
                  </p>
                </MotionSection>
              </Suspense>
            )}
          </div>

          {/* Right Side - Process Cards - Smaller Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {(data?.processSteps || []).map((step, index) => {
                const Icon = iconMap[step.icon] || HelpCircle;
                const imageUrl = step.image.startsWith('http') ? step.image : `${API_URL}${step.image.startsWith('/') ? '' : '/'}${step.image}`;

                return (
                  <Suspense key={index} fallback={<div className={`bg-gray-100 animate-pulse rounded-2xl h-64 ${index === 1 || index === 2 ? 'sm:mt-8' : ''}`} />}>
                    <MotionSection
                      className={`group ${index === 1 || index === 2 ? 'sm:mt-8' : ''}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                    <div
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
                      style={{
                        boxShadow: step.color === 'orange'
                          ? '0 8px 20px -4px rgba(222, 128, 43, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                          : '0 8px 20px -4px rgba(19, 70, 152, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      {/* Image Section - Reduced Height */}
                      <div className="relative h-40 overflow-hidden bg-gray-100">
                        <Image
                          src={imageUrl}
                          alt={step.altText || step.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          unoptimized={API_IS_LOCAL}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                        {/* Icon Badge - Smaller */}
                        <div className="absolute top-3 left-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                          <Icon className={`w-5 h-5 ${step.color === 'orange' ? 'text-[#DE802B]' : 'text-[#134698]'}`} />
                        </div>

                        {/* Large Number Watermark - Smaller */}
                        <div className="absolute bottom-3 right-3 text-white/30 text-5xl font-bold leading-none font-serif">
                          {(index + 1).toString().padStart(2, '0')}
                        </div>
                      </div>

                      {/* Content Section - Compact */}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`${step.color === 'orange' ? 'text-[#DE802B]' : 'text-[#134698]'} font-bold text-base`}>
                            {step.number}
                          </span>
                          <h4 className="font-bold text-gray-900 text-base">
                            {step.title}
                          </h4>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed">
                          {cleanDescription(step.description)}
                        </p>

                        {/* Hover Indicator */}
                        <div className={`mt-3 h-0.5 w-0 group-hover:w-full ${step.color === 'orange' ? 'bg-[#DE802B]' : 'bg-[#134698]'} transition-all duration-500 rounded-full`}></div>
                      </div>
                    </div>
                    </MotionSection>
                  </Suspense>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
