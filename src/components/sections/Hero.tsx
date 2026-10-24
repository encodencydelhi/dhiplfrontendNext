"use client";

import { Fragment, useState, useEffect, useRef, useCallback, type CSSProperties } from "react";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { api, API_URL } from "@/lib/api";

const HERO_CACHE_KEY = 'dh_hero_slides_cache';
const HERO_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Each slide's time on screen.
const INTERVAL = 6000;
// How long the old slide's text takes to leave before the new text comes in.
const TEXT_EXIT_MS = 450;

/* Cinematic transition (same system as the Help Now hero): the new slide wipes
   in on a diagonal while the old one recedes underneath, the image settles with
   a 3D camera move and then dollies slowly in, a light beam rides the wipe edge,
   and the text rises word by word from behind masks. Plain CSS keyframes, so the
   slides don't need framer-motion. */
const CSS = `
.dh-hero { position: relative; }

.dh-layer { position: absolute; inset: 0; z-index: 0; opacity: 0; overflow: hidden; perspective: 1600px; }
.dh-layer-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform-origin: 60% 40%; will-change: transform; }
.dh-layer.is-prev { opacity: 1; z-index: 1; }
.dh-layer.is-prev .dh-layer-img { animation: dh-recede 1.5s cubic-bezier(0.77, 0, 0.18, 1) forwards; }
.dh-layer.is-active { opacity: 1; z-index: 2; animation: dh-wipe 1.5s cubic-bezier(0.77, 0, 0.18, 1) both; }
.dh-layer.is-active.is-back { animation-name: dh-wipe-back; }
.dh-layer.is-active .dh-layer-img { animation: dh-settle ${INTERVAL + 1500}ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
/* First slide on page load: no wipe or blur (it's the LCP image), just the slow dolly. */
.dh-layer.is-active.is-first { animation: none; }
.dh-layer.is-active.is-first .dh-layer-img { animation: dh-dolly ${INTERVAL + 1500}ms linear both; }

@keyframes dh-wipe {
  from { clip-path: polygon(100% 0, 110% 0, 110% 100%, 118% 100%); }
  to   { clip-path: polygon(-18% 0, 110% 0, 110% 100%, 0% 100%); }
}
@keyframes dh-wipe-back {
  from { clip-path: polygon(0% 0, -10% 0, -10% 100%, -18% 100%); }
  to   { clip-path: polygon(118% 0, -10% 0, -10% 100%, 100% 100%); }
}
/* 3D camera: starts close and tilted, swings back flat, then dollies slowly in. */
@keyframes dh-settle {
  0%   { transform: translateZ(440px) rotateY(-10deg) rotateX(4deg); filter: brightness(1.18) saturate(1.2) contrast(1.05) blur(4px); }
  26%  { transform: translateZ(0) rotateY(0) rotateX(0); filter: brightness(1) saturate(1.05) contrast(1) blur(0); }
  100% { transform: translateZ(150px) rotateY(-2deg) rotateX(0.6deg); filter: brightness(1) saturate(1.05) contrast(1) blur(0); }
}
@keyframes dh-dolly {
  from { transform: translateZ(0); }
  to   { transform: translateZ(150px) rotateY(-2deg) rotateX(0.6deg); }
}
@keyframes dh-recede {
  from { transform: translateZ(150px) rotateY(-2deg) rotateX(0.6deg); filter: brightness(1); }
  to   { transform: translateZ(260px) translateX(-4%) rotateY(5deg); filter: brightness(0.85) blur(4px); }
}

/* Cool light beam riding the wipe's edge */
.dh-beam {
  position: absolute; top: -10%; bottom: -10%; left: 0; width: 22vw; z-index: 3; pointer-events: none;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(190,215,255,0.5) 45%, rgba(255,255,255,0.85) 52%, rgba(190,215,255,0.4) 60%, rgba(255,255,255,0) 100%);
  mix-blend-mode: soft-light; filter: blur(6px);
  animation: dh-beam 1.5s cubic-bezier(0.77, 0, 0.18, 1) forwards;
}
.dh-beam.is-back { animation-name: dh-beam-back; }
@keyframes dh-beam {
  0%   { transform: translateX(105vw) skewX(-8deg); opacity: 0; }
  15%, 85% { opacity: 1; }
  100% { transform: translateX(-30vw) skewX(-8deg); opacity: 0; }
}
@keyframes dh-beam-back {
  0%   { transform: translateX(-30vw) skewX(-8deg); opacity: 0; }
  15%, 85% { opacity: 1; }
  100% { transform: translateX(105vw) skewX(-8deg); opacity: 0; }
}
/* Soft light bloom as each slide lands */
.dh-flare {
  position: absolute; inset: 0; z-index: 4; pointer-events: none; opacity: 0; mix-blend-mode: screen;
  background:
    radial-gradient(circle at 70% 34%, rgba(255,255,255,0.55) 0%, rgba(160,200,255,0.22) 18%, rgba(160,200,255,0) 42%),
    radial-gradient(circle at 88% 12%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 22%);
  animation: dh-flare 1.6s ease-out 0.55s both;
}
@keyframes dh-flare {
  0%   { opacity: 0; transform: scale(0.85); }
  35%  { opacity: 0.7; }
  100% { opacity: 0; transform: scale(1.15); }
}

/* ── Text: enters word by word from behind a mask; leaves upward ── */
.dh-anim .dh-rule { transform-origin: left center; animation: dh-grow 0.9s cubic-bezier(0.19, 1, 0.22, 1) 0.1s both; }
.dh-anim .dh-badge { animation: dh-track-in 1.1s cubic-bezier(0.19, 1, 0.22, 1) 0.18s both; }
.dh-word { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.12em; margin-bottom: -0.12em; }
.dh-word-in { display: inline-block; transform-origin: left bottom; }
.dh-anim .dh-word-in { animation: dh-word-up 1.1s cubic-bezier(0.19, 1, 0.22, 1) calc(0.28s + var(--i, 0) * 0.08s) both; }
/* Orange line: one shine once it has landed */
.dh-anim .dh-accent .dh-word-in {
  color: transparent;
  background: linear-gradient(110deg, #DE802B 0%, #DE802B 40%, #ffe0b8 50%, #DE802B 60%, #DE802B 100%);
  background-size: 260% 100%; background-position: 100% 0;
  -webkit-background-clip: text; background-clip: text;
  animation:
    dh-word-up 1.1s cubic-bezier(0.19, 1, 0.22, 1) calc(0.28s + var(--i, 0) * 0.08s) both,
    dh-shine 1.3s ease-in-out calc(1.15s + var(--i, 0) * 0.08s) both;
}
.dh-anim .dh-desc { animation: dh-rise-blur 1.1s cubic-bezier(0.19, 1, 0.22, 1) 0.58s both; }
.dh-anim .dh-btns { animation: dh-rise-blur 1.1s cubic-bezier(0.19, 1, 0.22, 1) 0.72s both; }

.dh-content.is-leaving .dh-sub,
.dh-content.is-leaving .dh-desc,
.dh-content.is-leaving .dh-btns { animation: dh-leave 0.42s cubic-bezier(0.55, 0, 1, 0.45) both; }
.dh-content.is-leaving .dh-word-in { animation: dh-word-out 0.42s cubic-bezier(0.55, 0, 1, 0.45) calc(var(--i, 0) * 0.025s) both; }
.dh-content.is-leaving .dh-desc { animation-delay: 0.06s; }
.dh-content.is-leaving .dh-btns { animation-delay: 0.1s; }

@keyframes dh-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes dh-track-in { from { opacity: 0; letter-spacing: 0.6em; filter: blur(8px); } to { opacity: 1; filter: blur(0); } }
@keyframes dh-word-up { from { transform: translateY(115%) rotate(6deg); filter: blur(4px); } to { transform: translateY(0) rotate(0); filter: blur(0); } }
@keyframes dh-shine { from { background-position: 100% 0; } to { background-position: 0% 0; } }
@keyframes dh-rise-blur { from { opacity: 0; transform: translateY(26px); filter: blur(8px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
@keyframes dh-leave { to { opacity: 0; transform: translateY(-14px); filter: blur(6px); } }
@keyframes dh-word-out { to { transform: translateY(-110%); } }

/* Progress bar fills over the slide's time on screen */
.dh-fill { position: absolute; inset: 0; background: #fff; transform-origin: left center; animation: dh-fill ${INTERVAL}ms linear both; }
@keyframes dh-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.dh-baseline { transform-origin: center; animation: dh-grow 1.5s ease-out 0.5s both; }

@media (max-width: 1023px) { .dh-beam { width: 40vw; } }
@media (prefers-reduced-motion: reduce) {
  .dh-hero *, .dh-hero *::before, .dh-hero *::after { animation-duration: 0.01ms !important; animation-delay: 0ms !important; }
  .dh-beam, .dh-flare { display: none; }
}
`;

// Splits a line into masked words; `start` continues the stagger index across lines
const Words = ({ text, start = 0 }: { text?: string; start?: number }) => (
  <>
    {String(text || "")
      .split(/\s+/)
      .filter(Boolean)
      .map((word, w) => (
        <Fragment key={w}>
          {w > 0 && " "}
          <span className="dh-word">
            <span className="dh-word-in" style={{ "--i": start + w } as CSSProperties}>{word}</span>
          </span>
        </Fragment>
      ))}
  </>
);
const wordCount = (text?: string) => String(text || "").split(/\s+/).filter(Boolean).length;

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
  const [isLoading, setIsLoading] = useState(heroSlides.length === 0);

  // `current` drives the image (changes at once), `shown` the text (changes once
  // the old text has left). `tick` replays the image transition; `back` flips it.
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const [back, setBack] = useState(false);
  const [shown, setShown] = useState(0);
  const [textKey, setTextKey] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch hero slides from API
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        // Only show loading if we have no cached data
        if (heroSlides.length === 0) setIsLoading(true);

        const response = await api.get('/api/hero/active');

        if (response.data.success) {
          // Double-check scheduling on frontend just in case
          const activeSlides = response.data.data.filter(slide => {
            if (!slide.isActive) return false;

            if (slide.schedule?.startDate && slide.schedule?.startTime) {
              const now = new Date().getTime();
              const startDateTime = new Date(slide.schedule.startDate + 'T' + slide.schedule.startTime).getTime();
              const endDateTime = slide.schedule.endDate && slide.schedule.endTime
                ? new Date(slide.schedule.endDate + 'T' + slide.schedule.endTime).getTime()
                : null;

              if (now < startDateTime) return false; // Not started yet
              if (endDateTime && now > endDateTime) return false; // Already ended
            }

            return true;
          });

          setHeroSlides(activeSlides);

          try {
            localStorage.setItem(HERO_CACHE_KEY, JSON.stringify({ data: activeSlides, timestamp: Date.now() }));
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
    const interval = setInterval(fetchHeroSlides, 600000);
    return () => clearInterval(interval);
  }, []);

  const goTo = useCallback(
    (index: number, goingBack = false) => {
      if (index === current || heroSlides.length < 2) return;
      setPrev(current);
      setCurrent(index);
      setBack(goingBack);
      setTick((t) => t + 1);
      setLeaving(true);
      if (exitTimer.current) clearTimeout(exitTimer.current);
      exitTimer.current = setTimeout(() => {
        setShown(index);
        setTextKey((k) => k + 1);
        setLeaving(false);
      }, TEXT_EXIT_MS);
    },
    [current, heroSlides.length]
  );

  // Autoplay; restarts whenever the slide changes, so a click gets a full turn.
  useEffect(() => {
    if (heroSlides.length < 2) return;
    const t = setTimeout(() => goTo((current + 1) % heroSlides.length), INTERVAL);
    return () => clearTimeout(t);
  }, [current, tick, goTo, heroSlides.length]);

  useEffect(() => () => { if (exitTimer.current) clearTimeout(exitTimer.current); }, []);

  // Slides list shrank (schedule ended): start over
  useEffect(() => {
    if (current >= heroSlides.length && heroSlides.length) {
      setCurrent(0);
      setShown(0);
      setPrev(null);
    }
  }, [heroSlides.length, current]);

  const nextSlide = () => heroSlides.length && goTo((current + 1) % heroSlides.length);
  const prevSlide = () => heroSlides.length && goTo((current - 1 + heroSlides.length) % heroSlides.length, true);

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

  const slide = heroSlides[shown] ?? heroSlides[0] ?? {};
  // First text on page load stays static (it's server-rendered for SEO/LCP); later slides animate in
  const animate = textKey > 0;
  const titleWords = wordCount(slide.title);
  const TitleTag = isHomePage ? "h2" : "h1";

  return (
    <section className="dh-hero relative h-[65svh] sm:h-[80svh] md:h-[100svh] w-full overflow-hidden bg-black">
      <style>{CSS}</style>

      {/* Background layers — all mounted so every image loads up front; the
          active one is re-keyed per change to replay its transition. */}
      {heroSlides.map((s, i) => {
        const isActive = i === current;
        const state = isActive ? `is-active${tick === 0 ? " is-first" : ""}${back ? " is-back" : ""}` : i === prev ? "is-prev" : "";
        return (
          <div key={isActive ? `active-${tick}` : `layer-${i}`} className={`dh-layer ${state}`} aria-hidden={!isActive || undefined}>
            {s?.image ? (
              <img
                src={`${API_URL}${s.image}`}
                alt={isActive ? s.altText || s.title || "Hero Image" : ""}
                width={1920}
                height={1080}
                sizes="(max-width:768px) 100vw, 1920px"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
                decoding="async"
                className="dh-layer-img"
              />
            ) : (
              <div className="w-full h-full bg-slate-900" />
            )}
          </div>
        );
      })}
      {tick > 0 && <div key={`beam-${tick}`} className={`dh-beam${back ? " is-back" : ""}`} />}
      {tick > 0 && <div key={`flare-${tick}`} className="dh-flare" />}

      {/* Readability overlay + soft decorative glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/45 to-transparent z-[5] pointer-events-none" />
      <div className="absolute top-40 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl z-[5] pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl z-[5] pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-12 md:pl-20 md:pr-10 h-full flex flex-col justify-center items-start text-left text-white pt-12 pb-16 sm:pb-28 md:pt-24 md:pb-24">
        <div key={`content-${textKey}`} className={`dh-content max-w-4xl${animate ? " dh-anim" : ""}${leaving ? " is-leaving" : ""}`}>
          {/* Subtitle */}
          <div className="dh-sub flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <span className="dh-rule w-8 sm:w-12 h-[1px] bg-white/40" />
            <span
              className="dh-badge text-[8px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-semibold text-white/90 flex items-center gap-1 sm:gap-2"
              style={slide.subtitleFontSize ? { fontSize: `${slide.subtitleFontSize}px` } : undefined}
            >
              <Sparkles size={10} className="text-white/70" />
              {slide.subtitle}
            </span>
          </div>

          {/* Title (H1/H2 for SEO) */}
          <TitleTag
            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-4 leading-[1.1] tracking-tight"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: slide.titleFontSize ? `${slide.titleFontSize}px` : undefined }}
          >
            <Words text={slide.title} />
          </TitleTag>

          {/* Highlighted line */}
          {slide.highlight && (
            <p
              className="dh-accent text-lg sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 leading-[1.1] tracking-tight text-[#DE802B]"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: slide.highlightFontSize ? `${slide.highlightFontSize}px` : undefined }}
            >
              <Words text={slide.highlight} start={titleWords} />
            </p>
          )}

          {/* Description */}
          <div
            className="dh-desc text-[11px] sm:text-sm md:text-base lg:text-lg font-light mb-4 sm:mb-6 max-w-sm sm:max-w-xl md:max-w-4xl lg:max-w-5xl text-white/85 leading-relaxed tracking-wide whitespace-pre-wrap"
            style={{ fontFamily: "'Inter', sans-serif" }}
            dangerouslySetInnerHTML={{ __html: slide.description || "" }}
          />

          {/* CTA buttons (from the admin slide) */}
          <div className="dh-btns flex flex-col sm:flex-row gap-3 sm:gap-4">
            {slide.button1Name && (
              <a
                href={slide.button1Url || "/projects-list"}
                className="group relative overflow-hidden rounded-full px-4 sm:px-7 py-2 sm:py-3 text-white hover:opacity-90 transition-all duration-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] text-[9px] sm:text-[11px] font-bold border-2 border-white inline-flex items-center justify-center"
                style={{ backgroundColor: '#1945a1' }}
              >
                <span className="relative z-10 flex items-center gap-1.5 sm:gap-2 justify-center">
                  {slide.button1Name}
                  <ArrowRight size={10} className="sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </a>
            )}
            {slide.button2Name && (
              <a
                href={slide.button2Url || "/contact"}
                className="group relative overflow-hidden rounded-full px-4 sm:px-7 py-2 sm:py-3 bg-white text-slate-900 hover:bg-neutral-100 transition-all duration-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] text-[9px] sm:text-[11px] font-bold border-2 border-white inline-flex items-center justify-center"
                style={{ color: '#1945a1', borderColor: '#1945a1' }}
              >
                <span className="relative z-10 flex items-center gap-1.5 sm:gap-2 justify-center">
                  {slide.button2Name}
                  <Sparkles size={10} className="sm:w-3 sm:h-3 group-hover:rotate-180 transition-transform duration-500" />
                </span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Progress indicators - right side */}
      <div className="absolute bottom-16 sm:bottom-24 md:bottom-20 right-3 sm:right-4 md:right-12 z-30 flex flex-col gap-3 sm:gap-4 md:gap-5">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i < current)}
            className="group relative flex items-center justify-end"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current || undefined}
          >
            <span className="hidden md:block absolute right-0 text-[10px] font-semibold text-white/0 group-hover:text-white/70 transition-all duration-300 mr-16 uppercase tracking-wider group-hover:-translate-x-2.5">
              0{i + 1}
            </span>
            <div className="relative w-10 sm:w-12 md:w-16 h-[2px] bg-white/20 overflow-hidden">
              {i === current && <span key={`fill-${tick}`} className="dh-fill" />}
            </div>
            <span
              className={`ml-2 sm:ml-3 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white scale-100" : "bg-white/30 scale-75 group-hover:bg-white/50"}`}
            />
          </button>
        ))}
      </div>

      {/* Navigation arrows */}
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

      {/* Bottom decorative line */}
      <div className="dh-baseline absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-30" />
    </section>
  );
};

export default Hero;
