"use client";

import { m, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Fetch active testimonials from API
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/api/testimonials/active');

      if (response.data.success && Array.isArray(response.data.testimonials)) {
        // Transform API data to match frontend format
        const transformedData = response.data.testimonials.map(item => ({
          name: item.name,
          role: item.role,
          initials: item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
          feedback: item.feedback,
          rating: item.rating,
          company: item.company
        }));

        setTestimonials(transformedData);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setError("Failed to load testimonials");

      // Fallback to empty array or show error
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 4;
        return nextIndex >= testimonials.length ? 0 : nextIndex;
      });
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const nextIndex = prev + 4;
      return nextIndex >= testimonials.length ? 0 : nextIndex;
    });
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const prevIndex = prev - 4;
      return prevIndex < 0 ? Math.max(0, testimonials.length - 4) : prevIndex;
    });
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // SVG Path Animation Variants
  const pathVariants = {
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
          ease: "easeInOut",
          delay: 0.5
        },
        opacity: {
          duration: 0.3,
          delay: 0.5
        }
      }
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#134698] mx-auto"></div>
          <p className="text-gray-500 text-lg font-medium mt-4">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">{error}</p>
          <button
            onClick={fetchTestimonials}
            className="px-4 py-2 bg-[#134698] text-white rounded-lg hover:bg-[#0f3470] transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-white flex justify-center items-center">
        <p className="text-gray-500 text-lg font-medium italic">No testimonials available yet.</p>
      </section>
    );
  }

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 4);

  return (
    <section className="py-8 md:py-10 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Styled Span with Lines */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]"></div>
            <span className="text-sm md:text-base uppercase tracking-[0.35em] text-[#134698] font-bold">
              TESTIMONIALS
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#134698]"></div>
          </m.div>

          {/* Styled H2 with Animated Underline */}
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-2xl md:text-3xl lg:text-4xl font-serif mb-5 leading-tight text-gray-900"
          >
            What{" "}
            <span className="text-[#DE802B] relative inline-block">
              People Says
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

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
            <div className="text-center md:text-left flex-1">
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Real experiences from our satisfied customers who trust us with their spaces
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#DE802B] text-white rounded-lg font-medium hover:bg-[#c66d1f] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                View All Testimonials
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </m.div>

        {/* Testimonials Carousel - 4 Cards at a time */}
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <m.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {visibleTestimonials.map((testimonial, idx) => (
                <m.div
                  key={currentIndex + idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative bg-gradient-to-br from-[#134698]/[0.02] to-white rounded-xl p-5 border border-gray-200 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {/* Accent Bar */}
                  <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${idx % 2 === 0
                    ? "bg-gradient-to-b from-[#134698] to-[#000080]"
                    : "bg-gradient-to-b from-[#DE802B] to-[#134698]"
                    }`} />

                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-5">
                    <Quote className={`w-12 h-12 ${idx % 2 === 0 ? "text-[#134698]" : "text-[#DE802B]"}`} />
                  </div>

                  <div className="relative z-10">
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#DE802B] text-[#DE802B]" />
                      ))}
                    </div>

                    {/* Feedback */}
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed font-normal min-h-[80px]">
                      "{testimonial.feedback}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      {/* Avatar with Initials */}
                      <div className={`relative w-11 h-11 rounded-full flex items-center justify-center border-2 shadow-sm flex-shrink-0 ${idx % 2 === 0
                        ? "bg-gradient-to-br from-[#134698] to-[#000080] border-[#134698]/20"
                        : "bg-gradient-to-br from-[#DE802B] to-[#134698] border-[#DE802B]/20"
                        }`}>
                        <span className="text-white font-bold text-sm">
                          {testimonial.initials || "UN"}
                        </span>
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-gray-600">
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

          {/* Navigation Controls */}
          {testimonials.length > 4 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prev}
                disabled={currentIndex === 0}
                className={`w-10 h-10 rounded-lg bg-white border border-[#134698]/30 hover:border-[#134698] hover:bg-[#000080]/5 flex items-center justify-center shadow-sm transition-all ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-4 w-4 text-[#134698]" />
              </m.button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.ceil(testimonials.length / 4) }).map((_, index) => (
                  <m.button
                    key={index}
                    onClick={() => goToSlide(index * 4)}
                    whileHover={{ scale: 1.2 }}
                    className={`rounded-full transition-all duration-300 ${Math.floor(currentIndex / 4) === index
                      ? "w-6 h-1.5 bg-[#134698]"
                      : "w-1.5 h-1.5 bg-gray-300 hover:bg-[#DE802B]"
                      }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>

              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={next}
                disabled={currentIndex + 4 >= testimonials.length}
                className={`w-10 h-10 rounded-lg bg-white border border-[#134698]/30 hover:border-[#134698] hover:bg-[#000080]/5 flex items-center justify-center shadow-sm transition-all ${currentIndex + 4 >= testimonials.length ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-4 w-4 text-[#134698]" />
              </m.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;