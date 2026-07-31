"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence, Variants } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";

interface Testimonial {
  name: string;
  role: string;
  initials: string;
  feedback: string;
  rating: number;
  company: string;
}

const pathVariants: Variants = {
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
        ease: "easeInOut" as const,
        delay: 0.5,
      },
      opacity: {
        duration: 0.3,
        delay: 0.5,
      },
    },
  },
};

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/api/testimonials/active');

      if (response.data.success && Array.isArray(response.data.testimonials)) {
        const transformedData = response.data.testimonials.map((item: any) => ({
          name: item.name,
          role: item.role,
          initials: item.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          feedback: item.feedback,
          rating: item.rating,
          company: item.company,
        }));

        setTestimonials(transformedData);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const currentTestimonials = testimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const prevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const nextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Topbar />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16 md:pb-24 bg-white overflow-hidden relative min-h-screen">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white"></div>
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Header */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]"></div>
              <span className="text-sm md:text-base uppercase tracking-[0.35em] text-[#134698] font-bold">
                CLIENT REVIEWS
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#134698]"></div>
            </m.div>

            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 leading-tight text-gray-900"
            >
              What Our{" "}
              <span className="text-[#DE802B] relative inline-block">
                Clients Say
                <m.svg
                  className="absolute -bottom-2 right-0 w-full h-3 text-[#134698]/50"
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

            <p className="text-gray-700 leading-relaxed text-sm md:text-base md:text-lg max-w-3xl mx-auto">
              Read real experiences from the people and companies that trust Design House to transform their spaces into exceptional environments.
            </p>
          </m.div>

          {/* Loading/Error/Content States */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#134698]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
              <button
                onClick={fetchTestimonials}
                className="px-6 py-2.5 bg-[#134698] text-white rounded-lg font-medium hover:bg-[#0f3470] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg font-medium italic">No testimonials available yet.</p>
            </div>
          ) : (
            <AnimatePresence>
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
              >
                {currentTestimonials.map((testimonial, idx) => (
                  <m.div
                    key={`${currentPage}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 5) * 0.1 }}
                    className="relative bg-gradient-to-br from-[#134698]/[0.02] to-white rounded-xl p-4 md:p-5 border border-gray-200 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-md group flex flex-col h-full"
                  >
                    {/* Accent Bar */}
                    <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${idx % 2 === 0
                      ? "bg-gradient-to-b from-[#134698] to-[#000080]"
                      : "bg-gradient-to-b from-[#DE802B] to-[#134698]"
                      }`} />

                    {/* Quote Icon */}
                    <div className="absolute top-3 right-3 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                      <Quote className={`w-8 h-8 md:w-10 md:h-10 ${idx % 2 === 0 ? "text-[#134698]" : "text-[#DE802B]"}`} />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Rating Stars */}
                      <div className="flex gap-0.5 mb-2.5">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-[#DE802B] text-[#DE802B]" />
                        ))}
                      </div>

                      {/* Feedback */}
                      <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-normal flex-1 mb-4 pt-1">
                        "{testimonial.feedback}"
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-100 mt-auto">
                        {/* Avatar with Initials */}
                        <div className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border shadow-sm flex-shrink-0 ${idx % 2 === 0
                          ? "bg-gradient-to-br from-[#134698] to-[#000080] border-[#134698]/20"
                          : "bg-gradient-to-br from-[#DE802B] to-[#134698] border-[#DE802B]/20"
                          }`}>
                          <span className="text-white font-bold text-[10px] md:text-xs">
                            {testimonial.initials || "UN"}
                          </span>
                        </div>

                        <div>
                          <p className="font-semibold text-[13px] md:text-sm text-gray-900 leading-tight">
                            {testimonial.name}
                          </p>
                          <p className="text-[11px] md:text-xs text-gray-500 leading-tight">
                            {testimonial.role || "Customer"}
                            {testimonial.company && `, ${testimonial.company}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </m.div>
                ))}
              </m.div>
            </AnimatePresence>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && !loading && !error && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[#134698] border border-[#134698] hover:bg-[#134698] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all duration-300 ${
                      currentPage === i + 1
                        ? "bg-[#DE802B] text-white border border-[#DE802B]"
                        : "text-gray-600 border border-gray-300 hover:border-[#134698] hover:text-[#134698]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[#134698] border border-[#134698] hover:bg-[#134698] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TestimonialsPage;