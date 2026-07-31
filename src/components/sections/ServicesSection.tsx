"use client";

import { m, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cleanDescription } from "@/lib/utils";
import { api, API_URL, API_IS_LOCAL } from "@/lib/api";

import {
  CheckCircle,
  ArrowRight,
  Package,
  Building2,
  PenTool,
  Sparkles,
  Globe,
  Users,
  Settings,
  ShieldCheck,
  Search,
  Megaphone,
  Code,
  ShoppingBag,
  Layout
} from "lucide-react";

const ICONS_MAP: Record<string, any> = {
  Package,
  Building2,
  PenTool,
  Sparkles,
  Globe,
  Users,
  Settings,
  ShieldCheck,
  Search,
  Megaphone,
  Code,
  ShoppingBag,
  Layout
};

const ServicesSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/api/what-we-do');
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.2, ease: "easeInOut", delay: 0.3 },
        opacity: { duration: 0.2, delay: 0.3 }
      }
    }
  };

  if (isLoading || !data) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#134698] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const services = data.cards || [];
  const currentService = services[activeTab];

  return (
    <section className="py-12 md:py-14 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        {/* Header - Left Aligned with Two Titles */}
        <div className="mb-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]"></div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#134698] font-bold">
              {data.subheading || 'WHAT WE DO'}
            </span>
          </m.div>

          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-gray-900"
          >
            {data.heading?.split(' ')[0] || 'Our'}{" "}
            <span className="text-[#DE802B] relative inline-block">
              {data.highlightText || data.heading?.split(' ').slice(1).join(' ') || 'Expertise'}
              <m.svg
                className="absolute -bottom-1 left-0 w-full h-2 text-[#134698]/50"
                viewBox="0 0 150 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <m.path
                  d="M2 6C50 2, 100 2, 148 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  variants={pathVariants as any}
                />
              </m.svg>
            </span>
          </m.h2>

          <m.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-serif mt-2 text-gray-700"
          >
            {data.description || 'Comprehensive Design Solutions'}
          </m.h3>
        </div>

        {/* Tabs Navigation */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide"
        >
          {services.map((service: any, index: number) => {
            const Icon = ICONS_MAP[service.icon] || Package;
            return (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`relative px-4 py-2.5 whitespace-nowrap font-medium text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === index
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900 bg-gray-100'
                  }`}
                style={{
                  background: activeTab === index
                    ? 'linear-gradient(135deg, #134698 0%, #1a5bb8 100%)'
                    : undefined,
                  boxShadow: activeTab === index
                    ? '0 4px 12px rgba(19, 70, 152, 0.25)'
                    : undefined
                }}
                aria-label={`View ${service.title} details`}
                aria-pressed={activeTab === index}
              >
                <Icon className="w-4 h-4" />
                {service.title}
              </button>
            );
          })}
        </m.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {currentService && (
            <m.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-5 gap-8 items-start"
            >
              {/* Image Side - 2 columns */}
              <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="md:col-span-2 relative"
              >
                <div className="relative overflow-hidden bg-gray-100 border-2 border-gray-200 h-[280px] md:h-[320px]">
                  <Image
                    src={currentService.image.startsWith('http') ? currentService.image : `${API_URL}${currentService.image.startsWith('/') ? '' : '/'}${currentService.image}`}
                    alt={currentService.altText || currentService.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500"
                    unoptimized={API_IS_LOCAL}
                  />

                  {/* Glass/Shiny Effect - Always Visible */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-white/30 blur-2xl pointer-events-none" />

                  {/* Auto Shine Animation - Continuous */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 animate-shine" />
                  </div>
                </div>
              </m.div>

              {/* Content Side - 3 columns */}
              <m.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="md:col-span-3 space-y-5"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {currentService.title}
                </h3>

                <div
                  className="text-gray-600 leading-relaxed text-sm md:text-base prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: cleanDescription(currentService.descriptionHtml) }}
                />

                {/* Features List - Grid Layout */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {currentService.features?.map((feature: string, idx: number) => (
                    <m.div
                      key={idx}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.08 }}
                      className="flex items-start gap-2 group"
                    >
                      <div className="flex-shrink-0 w-5 h-5 bg-[#134698] flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm leading-snug">{feature}</span>
                    </m.div>
                  ))}
                </div>

                {/* Read More Button - Right Aligned */}
                <div className="flex justify-end pt-2">
                  <m.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => {
                      if (currentService.buttonUrl) {
                        window.location.href = currentService.buttonUrl;
                      }
                    }}
                    className="px-6 py-2.5 border-2 border-[#134698] text-[#134698] font-semibold text-sm uppercase tracking-wide hover:bg-[#134698] hover:text-white transition-all duration-300 flex items-center gap-2 group"
                    aria-label={`${currentService.buttonText || 'Learn More'} about ${currentService.title}`}
                  >
                    {currentService.buttonText || 'Learn More'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </m.button>
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .prose li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }
      `}</style>

    </section>
  );
};

export default ServicesSection;
