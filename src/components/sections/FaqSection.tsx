"use client";

import { m, AnimatePresence } from "framer-motion";
import { HelpCircle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { api, API_URL, API_IS_LOCAL } from "@/lib/api";
import Image from "next/image";

const FaqSection = () => {
  const [data, setData] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await api.get("/api/faq");
        if (response.data.success) {
          setData(response.data.data);
          setFaqs(response.data.data.faqs || []);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, delay: 0.5 },
        opacity: { duration: 0.3, delay: 0.5 }
      }
    }
  };

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading || faqs.length === 0) {
    if (loading) return null;
    return null; // hide section if no FAQs
  }

  // Determine the image to show. If nothing active, show the one from index 0
  const displayIndex = activeIndex !== null ? activeIndex : 0;
  const currentFaq = faqs[displayIndex];

  return (
    <section className="py-12 md:py-16 bg-[#F9FAFB] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]"></div>
            <span className="text-sm md:text-base uppercase tracking-[0.35em] text-[#134698] font-bold">
              {data?.subheading || 'FAQS'}
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#134698]"></div>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-4 leading-tight text-gray-900">
            {data?.heading ? (
              <>
                {data.heading.split(data.highlightedWord).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="text-[#DE802B] relative inline-block">
                        {data.highlightedWord}
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
                    )}
                  </span>
                ))}
              </>
            ) : (
              <span>Frequently Asked Questions</span>
            )}
          </h2>
        </m.div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Questions (Left) */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl border transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-white shadow-lg border-[#134698]/20 scale-[1.02]"
                    : "bg-transparent border-gray-200 hover:border-[#134698]/30 overflow-hidden"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        activeIndex === index
                          ? "bg-[#134698] text-white"
                          : "bg-white text-[#134698] shadow-sm border border-gray-100"
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span
                      className={`font-semibold text-sm md:text-base transition-colors ${
                        activeIndex === index ? "text-[#134698]" : "text-gray-700"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={`transition-transform duration-300 ${
                      activeIndex === index ? "rotate-90 text-[#DE802B]" : "text-gray-300 group-hover:text-gray-400"
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-0 ml-[48px]">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            ))}
          </div>

          {/* Dynamic Image (Right) */}
          <div className="relative sticky top-24 h-[300px] lg:h-[450px] hidden lg:block overflow-hidden rounded-2xl shadow-2xl border-8 border-white">
            <AnimatePresence mode="wait">
              <m.div
                key={displayIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={currentFaq?.image?.startsWith('http') ? currentFaq.image : `${API_URL}${currentFaq.image}`}
                  alt={currentFaq?.altText || 'FAQ Image'}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                  unoptimized={API_IS_LOCAL}
                />
              </m.div>
            </AnimatePresence>
          </div>

          {/* Mobile Image - only visible on small screens when selected */}
          <div className="lg:hidden mt-4">
             <AnimatePresence mode="wait">
              <m.div
                key={displayIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-xl overflow-hidden shadow-lg border-2 border-white aspect-video"
              >
                <Image
                  src={currentFaq?.image?.startsWith('http') ? currentFaq.image : `${API_URL}${currentFaq.image}`}
                  alt={currentFaq?.altText || 'FAQ Image'}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                  unoptimized={API_IS_LOCAL}
                />
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;