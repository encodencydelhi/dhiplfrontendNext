"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
const MotionSection = lazy(() => import("../MotionSection"));
import { ArrowRight } from "lucide-react";
import { Sparkles } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { api, API_URL } from "@/lib/api";

const HERO_CACHE_KEY = 'dh_hero_slides_cache';
const HERO_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const Hero = ({ isHomePage = true, initialSlides = [] }: { isHomePage?: boolean; initialSlides?: any[] }) => {
  // Prefer localStorage cache (freshest, client-only) for repeat visits, but
  // fall back to server-rendered initialSlides so the LCP image URL is
  // already present in the SSR HTML on first-ever visits (no client fetch
  // round-trip needed just to discover the image).
  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const cached = localStorage.getItem(HERO_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < HERO_CACHE_TTL && Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch { }
    return initialSlides;
  });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(heroSlides.length === 0);
  const isFirst = current === 0;

  // Fetch hero slides from API
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        // Only show loading if we have no cached data
        if (heroSlides.length === 0) setIsLoading(true);

        // Ensure this API endpoint matches your backend URL (e.g., http://localhost:5000/api/hero/active)
        const response = await api.get('/api/hero/active');

        if (response.data.success) {
          // Double-check scheduling on frontend just in case
          const activeSlides = response.data.data.filter(slide => {
            if (!slide.isActive) return false;

            // Check schedule if exists
            if (slide.schedule?.startDate && slide.schedule?.startTime) {
              const now = new Date().getTime();
              const startDateTime = new Date(
                slide.schedule.startDate + 'T' + slide.schedule.startTime
              ).getTime();
              const endDateTime = slide.schedule.endDate && slide.schedule.endTime
                ? new Date(slide.schedule.endDate + 'T' + slide.schedule.endTime).getTime()
                : null;

              // Check if slide should be shown based on schedule
              if (now < startDateTime) return false; // Not started yet
              if (endDateTime && now > endDateTime) return false; // Already ended
            }

            return true;
          });

          setHeroSlides(activeSlides);

          // Cache the fresh data for next visit
          try {
            localStorage.setItem(HERO_CACHE_KEY, JSON.stringify({
              data: activeSlides,
              timestamp: Date.now()
            }));
          } catch { }
        }
      } catch (error) {
        console.error('Failed to fetch hero slides:', error);
        if (heroSlides.length === 0) setHeroSlides([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroSlides();

    // Refresh slides every 30 seconds to check schedule changes
    // refresh only every 5 minutes
    const interval = setInterval(fetchHeroSlides, 600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleSlideChange = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const nextSlide = () => {
    if (heroSlides.length === 0) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    if (heroSlides.length === 0) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const slideVariants = {
    enter: {
      opacity: 0,
      scale: 1.05,
    },
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0.97,
    },
  };

  // No slides available check (keep this for actual empty states)
  const showEmpty = !isLoading && heroSlides.length === 0;

  if (showEmpty) {
    return (
      <section className="relative h-[65svh] sm:h-[80svh] md:h-[100svh] w-full overflow-hidden bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2 ">No Active Slides</h2>
          <p className="text-white/60">Please add hero slides from admin panel</p>
        </div>
      </section>
    );
  }

  return (

    <LazyMotion features={domAnimation}>
      <section className="relative h-[65svh] sm:h-[80svh] md:h-[100svh] w-full overflow-hidden bg-black">
        {/* Background Images with Animation */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <m.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{

              opacity: { duration: 0.6 },
              scale: { duration: 0.3 }
            }}
            className="absolute inset-0 z-0"
          >
            {/* Gradient Overlay */}
            <m.div
              className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent z-10"
              initial={isFirst ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            />

            {/* Image with Ken Burns Effect */}
            <m.div
              className="absolute inset-0"
              initial={isFirst ? false : { scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {heroSlides[current]?.image ? (
                <img
                  src={`${API_URL}${heroSlides[current].image}`}
                  alt={heroSlides[current]?.altText || heroSlides[current]?.title || "Hero Image"}
                  width={1920}
                  height={1080}
                  sizes="(max-width:768px) 100vw, 1920px"
                  loading={current === 0 ? "eager" : "lazy"}
                  fetchPriority={current === 0 ? "high" : "auto"}
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900" />
                </div>
              )}
            </m.div>
          </m.div>
        </AnimatePresence>

        {/* Decorative Blur Elements */}
        <div className="absolute top-40 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl z-10" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl z-10" />

        {/* Content Container */}
        <div className="relative z-20 container mx-auto px-4 sm:px-12 md:pl-20 md:pr-10 h-full flex flex-col justify-center items-start text-left text-white pt-12 pb-16 sm:pb-28 md:pt-24 md:pb-24">
          <AnimatePresence mode="wait">
            <m.div
              key={current}
              initial={isFirst ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl"
            >
              <Suspense fallback={null}>
                <MotionSection
                  initial={isFirst ? false : { opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
                >
                  <span className="w-8 sm:w-12 h-[1px] bg-white/40" />
                  <span 
                    className="text-[8px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-semibold text-white/90 flex items-center gap-1 sm:gap-2"
                    style={heroSlides[current]?.subtitleFontSize ? { fontSize: `${heroSlides[current].subtitleFontSize}px` } : {}}
                  >
                    <Sparkles size={10} className="text-white/70" />
                    {heroSlides[current]?.subtitle}
                  </span>
                </MotionSection>
              </Suspense>

              {/* Main Title - Conditional H1/H2 for SEO */}
              <Suspense fallback={isHomePage ? <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-4">{heroSlides[current]?.title}</h2> : <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-4">{heroSlides[current]?.title}</h1>}>
                <MotionSection
                  initial={isFirst ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.9 }}
                  className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-4 leading-[1.1] tracking-tight"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontSize: heroSlides[current]?.titleFontSize ? `${heroSlides[current].titleFontSize}px` : undefined
                  }}
                >
                  {isHomePage ? (
                    <h2>{heroSlides[current]?.title}</h2>
                  ) : (
                    <h1>{heroSlides[current]?.title}</h1>
                  )}
                </MotionSection>
              </Suspense>

              {/* Highlighted Title */}
              <Suspense fallback={null}>
                <MotionSection
                  initial={isFirst ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.9 }}
                  className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 md:mb-4 leading-[1.1] tracking-tight"
                  style={{ 
                    fontFamily: "'Inter', sans-serif", 
                    color: '#DE802B',
                    fontSize: heroSlides[current]?.highlightFontSize ? `${heroSlides[current].highlightFontSize}px` : undefined
                  }}
                >
                  <p>{heroSlides[current]?.highlight}</p>
                </MotionSection>
              </Suspense>

              {/* Description */}
              <Suspense fallback={null}>
                <MotionSection
                  initial={isFirst ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.9 }}
                >
                  <div 
                    className="text-[11px] sm:text-sm md:text-base lg:text-lg font-light mb-4 sm:mb-6 max-w-sm sm:max-w-xl md:max-w-4xl lg:max-w-5xl text-white/85 leading-relaxed tracking-wide whitespace-pre-wrap"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    dangerouslySetInnerHTML={{ __html: heroSlides[current]?.description || "" }}
                  />
                </MotionSection>
              </Suspense>

              {/* CTA Buttons - Using dynamic values from API */}
              <Suspense fallback={null}>
                <MotionSection
                  initial={isFirst ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.9 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                  {heroSlides[current]?.button1Name && (
                    <a
                      href={heroSlides[current]?.button1Url || "/projects-list"}
                      className="group relative overflow-hidden rounded-full px-4 sm:px-7 py-2 sm:py-3 text-white hover:opacity-90 transition-all duration-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] text-[9px] sm:text-[11px] font-bold border-2 border-white inline-flex items-center justify-center"
                      style={{ backgroundColor: '#1945a1' }}
                    >
                      <span className="relative z-10 flex items-center gap-1.5 sm:gap-2 justify-center">
                        {heroSlides[current].button1Name}
                        <ArrowRight size={10} className="sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </a>
                  )}

                  {heroSlides[current]?.button2Name && (
                    <a
                      href={heroSlides[current]?.button2Url || "/contact"}
                      className="group relative overflow-hidden rounded-full px-4 sm:px-7 py-2 sm:py-3 bg-white text-slate-900 hover:bg-neutral-100 transition-all duration-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] text-[9px] sm:text-[11px] font-bold border-2 border-white inline-flex items-center justify-center"
                      style={{ color: '#1945a1', borderColor: '#1945a1' }}
                    >
                      <span className="relative z-10 flex items-center gap-1.5 sm:gap-2 justify-center">
                        {heroSlides[current].button2Name}
                        <Sparkles size={10} className="sm:w-3 sm:h-3 group-hover:rotate-180 transition-transform duration-500" />
                      </span>
                    </a>
                  )}
                </MotionSection>
              </Suspense>
            </m.div>
          </AnimatePresence>
        </div>

        {/* Progress Indicators - Right Side */}
        <div className="absolute bottom-16 sm:bottom-24 md:bottom-20 right-3 sm:right-4 md:right-12 z-30 flex flex-col gap-3 sm:gap-4 md:gap-5">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSlideChange(i)}
              className="group relative flex items-center justify-end"
              aria-label={`Go to slide ${i + 1}`}
            >
              <m.span
                className="hidden md:block absolute right-0 text-[10px] font-semibold text-white/0 group-hover:text-white/70 transition-all duration-300 mr-16 uppercase tracking-wider"
                whileHover={{ x: -10 }}
              >
                0{i + 1}
              </m.span>
              <div className="relative w-10 sm:w-12 md:w-16 h-[2px] bg-white/20 overflow-hidden">
                <m.span
                  className="absolute left-0 top-0 h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: i === current ? "100%" : "0%" }}
                  transition={{ duration: i === current ? 6 : 0.6, ease: "linear" }}
                />
              </div>
              <span
                className={`ml-2 sm:ml-3 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white scale-100" : "bg-white/30 scale-75 group-hover:bg-white/50"
                  }`}
              />
            </button>
          ))}
        </div>

        {/* Navigation Arrows - Adjusted for small mobile screens */}
        <div className="absolute bottom-10 sm:bottom-24 md:bottom-16 left-6 sm:left-24 md:left-32 z-30 flex items-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={prevSlide}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border-2 border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border-2 border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Bottom Decorative Line */}
        <m.div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </section>
    </LazyMotion>
  );
};

export default Hero;