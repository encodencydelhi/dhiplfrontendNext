"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image, { type StaticImageData } from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import h1 from "@/assets/banner/h1.webp";
import h2 from "@/assets/banner/h2.webp";
import h3 from "@/assets/banner/h3.webp";
import icon1 from "@/assets/icon/icon1.png";
import icon2 from "@/assets/icon/icon2.png";
import icon3 from "@/assets/icon/icon3.png";
import icon4 from "@/assets/icon/icon4.png";
import icon5 from "@/assets/icon/icon5.png";
import { notifyHeroTone, setHeroToneSampler, type Tone } from "@/lib/heroTone";

/* Light home hero carousel. Each banner is white on the left (for the text) with the
   work on the right. Slides change with a diagonal light-beam wipe; the navbar is told
   how bright the image is under each link, so links turn white only over dark parts
   and flip exactly as the wipe edge passes them. */

// posX: horizontal object-position on lg+ (0-1, also used by the tone sampler), with
// the matching class. Banners only get cropped sideways when wider than the hero box;
// the position keeps their white side behind the text.
type HeadingLine = {
  text: string;
  accent?: boolean;
};

type Slide = {
  img: StaticImageData;
  alt: string;
  posX: number;
  posClass: string;
  tagline: string[];
  taglineClass?: string;
  headingLines: HeadingLine[];
  desc: string;
  button1?: { text: string; href: string };
  button2?: { text: string; href: string };
  compact?: boolean; // smaller copy, for a banner whose white side is narrow
  uppercaseTitle?: boolean;
  underline?: boolean; // short bar between heading and description
  underlineClass?: string; // its colour (blue by default)
  serviceLabels?: string[]; // per-slide labels for the icon row (defaults: SERVICES)
  navLabel: string; // short title, used for the slide nav's accessible labels
  darkNav?: boolean; // keep every navbar link dark on this banner, whatever is behind it
  navTones?: Record<string, Tone>; // pin single navbar links ("dark" = white text), by label
};

const SLIDES: Slide[] = [
  {
    img: h1,
    darkNav: true,
    navLabel: "Retail Experiences",
    alt: "Retail store shelving and confectionery display fixtures by Design House",
    posX: 0,
    posClass: "lg:object-left",
    compact: true,
    uppercaseTitle: false,
    underline: true,
    tagline: ["Retail Interiors", "Display Solutions", "Turnkey Execution"],
    taglineClass: "text-[8px] sm:text-[9.5px] tracking-[0.12em] sm:tracking-[0.16em]",
    headingLines: [
      { text: "Designing", accent: false },
      { text: "Retail Experiences", accent: true },
      { text: "That Drive Sales.", accent: false },
    ],
    desc: "Innovative retail interiors and display solutions that\nattract customers and strengthen your brand.",
    button1: { text: "Discuss Your Retail Project", href: "/contact" },
    button2: { text: "View Our Work", href: "/portfolio" },
  },
  {
    img: h2,
    navLabel: "Brand Spaces",
    alt: "Corporate interiors, office design and turnkey retail fit-outs by Design House",
    posX: 0,
    posClass: "lg:object-left",
    compact: true,
    uppercaseTitle: true,
    tagline: ["Design", "Manufacturing", "Execution"],
    taglineClass: "text-[9px] sm:text-[10.5px] tracking-[0.16em] sm:tracking-[0.22em]",
    headingLines: [
      { text: "Spaces That", accent: false },
      { text: "Build Brands", accent: true },
    ],
    desc: "End-to-end interior, display and fit-out solutions for\nretail, corporate and commercial spaces across India.",
    button1: { text: "Discuss Your Project", href: "/contact" },
    button2: { text: "Explore Our Work", href: "/portfolio" },
  },
  {
    img: h3,
    navTones: { "Contact Us": "dark" },
    navLabel: "Retail Spaces",
    alt: "Premium watch store interior with glass display counters by Design House",
    posX: 0,
    posClass: "lg:object-left",
    compact: true,
    uppercaseTitle: true,
    underline: true,
    underlineClass: "bg-gradient-to-r from-[#DE802B] to-[#f0b46a]",
    serviceLabels: ["Retail\nInteriors", "Displays\n& Kiosks", "Corporate\nInteriors", "Exhibition\nStalls", "Manufacturing\n& Fabrication"],
    tagline: ["Retail Interiors", "Display Solutions", "Turnkey Execution"],
    taglineClass: "text-[8px] sm:text-[9.5px] tracking-[0.12em] sm:tracking-[0.16em]",
    headingLines: [
      { text: "Retail Spaces", accent: false },
      { text: "That Sell.", accent: true },
    ],
    desc: "Design, manufacturing and execution of premium\nretail interiors and display solutions for leading brands\nacross India.",
    button1: { text: "Discuss Your Project", href: "/contact" },
    button2: { text: "Explore Our Work", href: "/portfolio" },
  },
];

const SERVICES: { icon: StaticImageData; label: string; href: string }[] = [
  { icon: icon1, label: "Retail\nInteriors", href: "/services/retail-interior" },
  { icon: icon2, label: "Display\nSolutions", href: "/services/retail-kiosk" },
  { icon: icon3, label: "Corporate\nInteriors", href: "/services/corporate-interior" },
  { icon: icon4, label: "Exhibition\nStalls", href: "/services/exhibitions" },
  { icon: icon5, label: "Manufacturing\n& Execution", href: "/services" },
];

const INTERVAL = 4000; // time on each slide (the progress bar's duration)
const WIPE_MS = 1400; // slide change

// The wipe edge is a "/" diagonal: at the top it is 18% to the right of the bottom.
// It runs from just off the right edge (top 118%) to just off the left (top 0%).
const WIPE_EASE = [0.77, 0, 0.175, 1] as const;
const bezier = ([x1, y1, x2, y2]: readonly number[]) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  return (t: number) => {
    let lo = 0, hi = 1, s = t;
    for (let k = 0; k < 24; k++) {
      const x = ((ax * s + bx) * s + cx) * s;
      if (Math.abs(x - t) < 1e-4) break;
      if (x < t) lo = s; else hi = s;
      s = (lo + hi) / 2;
    }
    return ((ay * s + by) * s + cy) * s;
  };
};
const wipeEase = bezier(WIPE_EASE);

const band = (w: number) => `
  from { clip-path: polygon(${118 - w}% 0, ${118 + w}% 0, ${100 + w}% 100%, ${100 - w}% 100%); }
  to { clip-path: polygon(${-w}% 0, ${w}% 0, ${-18 + w}% 100%, ${-18 - w}% 100%); }`;

const CSS = `
.hh-hero {
  height: max(560px, calc(100vw / 2.456)); max-height: 100svh;
  --eo: cubic-bezier(0.19, 1, 0.22, 1);
  --wipe: cubic-bezier(${WIPE_EASE.join(", ")});
}
@media (max-width: 1023px) { .hh-hero { height: auto; max-height: none; } }

/* ── Image layers ── */
.hh-layer { position: absolute; inset: 0; overflow: hidden; visibility: hidden; }
.hh-layer.is-active { visibility: visible; z-index: 2; }
.hh-layer.is-prev { visibility: visible; z-index: 1; }
.hh-layer.is-active:not(.is-first) { animation: hh-wipe ${WIPE_MS}ms var(--wipe) both; }
.hh-move { position: absolute; inset: 0; will-change: transform; }
.is-first .hh-move { animation: hh-settle 2.2s cubic-bezier(0.22, 0.61, 0.36, 1) both; transform-origin: 70% 40%; }
.is-active:not(.is-first) .hh-move { animation: hh-dolly 2.6s cubic-bezier(0.16, 1, 0.3, 1) both; transform-origin: 60% 50%; }
.is-prev .hh-move { animation: hh-push ${WIPE_MS}ms cubic-bezier(0.65, 0, 0.35, 1) both; transform-origin: 30% 50%; }

@keyframes hh-wipe {
  from { clip-path: polygon(118% 0, 130% 0, 130% 100%, 100% 100%); }
  to { clip-path: polygon(0% 0, 130% 0, 130% 100%, -18% 100%); }
}
@keyframes hh-settle { from { transform: scale(1.06); } to { transform: scale(1); } }
@keyframes hh-dolly {
  from { transform: scale(1.16) translateX(5%); filter: brightness(1.22) saturate(0.85); }
  to { transform: scale(1) translateX(0); filter: brightness(1) saturate(1); }
}
@keyframes hh-push {
  from { transform: scale(1) translateX(0); filter: brightness(1) blur(0px); }
  to { transform: scale(1.08) translateX(-4%); filter: brightness(1.12) blur(4px); }
}

/* ── Light beam riding the wipe edge (blur on the wrapper, clip on the child) ── */
.hh-beam { position: absolute; inset: 0; z-index: 3; pointer-events: none; animation: hh-beam-fade ${WIPE_MS}ms linear both; }
.hh-beam > div { position: absolute; inset: 0; }
.hh-beam i { position: absolute; inset: 0; display: block; animation: ${WIPE_MS}ms var(--wipe) both; }
.hh-beam .b-haze { filter: blur(42px); opacity: 0.45; }
.hh-beam .b-haze i { background: #1E73E8; animation-name: hh-band-wide; }
.hh-beam .b-glow { filter: blur(14px); }
.hh-beam .b-glow i { background: rgba(255, 255, 255, 0.95); animation-name: hh-band-mid; }
.hh-beam .b-core i { background: linear-gradient(to bottom, #9fd0ff, #1E73E8 45%, #134698); animation-name: hh-band-core; }
@keyframes hh-band-wide {${band(11)} }
@keyframes hh-band-mid {${band(3.2)} }
@keyframes hh-band-core {${band(0.14)} }
@keyframes hh-beam-fade { 0% { opacity: 0; } 10% { opacity: 1; } 78% { opacity: 1; } 100% { opacity: 0; } }

/* ── Copy: one block per slide, stacked in the same grid cell ── */
.hh-copy { visibility: hidden; }
.hh-copy.is-active, .hh-copy.is-leaving { visibility: visible; }
.hh-copy.is-leaving { pointer-events: none; }
.hh-word { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.08em; margin-bottom: -0.08em; }
.hh-word-in { display: inline-block; }
.hh-accent .hh-word-in {
  color: transparent;
  background: linear-gradient(110deg, #134698 0%, #1E73E8 40%, #8cc2ff 50%, #1E73E8 60%, #134698 100%);
  background-size: 260% 100%; background-position: 0 0;
  -webkit-background-clip: text; background-clip: text;
}
.hh-copy.is-active .hh-tag { animation: hh-track-in 1.1s var(--eo) calc(var(--t0) + 0.15s) both; }
.hh-copy.is-active .hh-word-in { animation: hh-word-up 1.1s var(--eo) calc(var(--t0) + 0.25s + var(--i) * 0.09s) both; }
.hh-copy.is-active .hh-accent .hh-word-in {
  animation:
    hh-word-up 1.1s var(--eo) calc(var(--t0) + 0.25s + var(--i) * 0.09s) both,
    hh-shine 1.4s ease-in-out calc(var(--t0) + 1.1s + var(--i) * 0.09s) both;
}
.hh-copy.is-active .hh-desc { animation: hh-rise 1s var(--eo) calc(var(--t0) + 0.65s) both; }
.hh-copy.is-leaving .hh-tag, .hh-copy.is-leaving .hh-desc { animation: hh-out 0.45s cubic-bezier(0.7, 0, 0.84, 0) both; }
.hh-copy.is-leaving .hh-word-in { animation: hh-word-out 0.5s cubic-bezier(0.7, 0, 0.84, 0) calc(var(--i) * 0.04s) both; }

/* Buttons, icons and controls: first load only */
.hh-rise { animation: hh-rise 1s var(--eo) var(--d, 0.6s) both; }

@keyframes hh-track-in { from { opacity: 0; letter-spacing: 0.55em; filter: blur(6px); } to { opacity: 1; filter: blur(0); } }
@keyframes hh-word-up { from { transform: translateY(110%); } to { transform: translateY(0); } }
@keyframes hh-word-out { from { transform: translateY(0); } to { transform: translateY(-110%); } }
@keyframes hh-shine { from { background-position: 100% 0; } to { background-position: 0 0; } }
@keyframes hh-rise { from { opacity: 0; transform: translateY(22px); filter: blur(6px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
@keyframes hh-out { to { opacity: 0; transform: translateY(-14px); filter: blur(5px); } }

.hh-fill { transform-origin: left; animation: hh-fill ${INTERVAL}ms linear both; }
@keyframes hh-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }

@media (prefers-reduced-motion: reduce) {
  .hh-hero *:not(.hh-fill) { animation-duration: 0.01ms !important; animation-delay: 0ms !important; }
}
`;

const Words = ({ text, start = 0 }: { text: string; start?: number }) => (
  <>
    {text.split(" ").map((w, i) => (
      <Fragment key={i}>
        {i > 0 && " "}
        <span className="hh-word">
          <span className="hh-word-in" style={{ "--i": start + i } as CSSProperties}>{w}</span>
        </span>
      </Fragment>
    ))}
  </>
);

const getWordOffset = (lines: HeadingLine[], lineIndex: number) => {
  let count = 0;
  for (let i = 0; i < lineIndex; i++) {
    count += lines[i].text.split(" ").length;
  }
  return count;
};

type Lum = { data: Uint8ClampedArray; cw: number; ch: number };

const HomeHero = () => {
  const frameRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [changes, setChanges] = useState(0); // 0 until the first slide change
  const [paused, setPaused] = useState(false);
  const activeRef = useRef(0);
  const wipeRef = useRef<{ from: number; to: number; start: number } | null>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const waitingRef = useRef<number | null>(null); // slide whose banner is still loading

  const go = useCallback((next: number) => {
    waitingRef.current = null;
    const wipe = wipeRef.current;
    const now = performance.now();
    if (next === activeRef.current || (wipe && now - wipe.start < WIPE_MS)) return;
    wipeRef.current = { from: activeRef.current, to: next, start: now };
    setPrev(activeRef.current);
    setActive(next);
    setChanges((c) => c + 1);
    activeRef.current = next;
    // Keep the navbar re-measuring while the wipe edge travels across it
    const tick = () => {
      notifyHeroTone();
      if (performance.now() - now < WIPE_MS + 120) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);
  const step = (dir: number) => go((activeRef.current + dir + SLIDES.length) % SLIDES.length);

  // Autoplay never wipes to a banner that hasn't loaded (it would show the blurred
  // placeholder); it waits for it instead. Clicks still go straight away.
  const isLoaded = (i: number) => {
    const img = layerRefs.current[i]?.querySelector("img");
    return !!img && img.complete && img.naturalWidth > 0;
  };
  const autoAdvance = () => {
    const next = (activeRef.current + 1) % SLIDES.length;
    if (isLoaded(next)) go(next);
    else waitingRef.current = next;
  };
  const onBannerLoad = (i: number) => {
    if (waitingRef.current !== i) return;
    waitingRef.current = null;
    go(i);
  };

  // Read each banner into a small canvas, then answer "dark or light here?" for the navbar
  useEffect(() => {
    let cancelled = false;
    const maps: (Lum | null)[] = SLIDES.map(() => null);

    SLIDES.forEach((s, idx) => {
      const img = new window.Image();
      img.src = s.img.src;
      img.onload = () => {
        if (cancelled) return;
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        maps[idx] = { data: ctx.getImageData(0, 0, canvas.width, canvas.height).data, cw: canvas.width, ch: canvas.height };
        notifyHeroTone();
      };
    });

    const toneAt = (map: Lum, posX: number, box: DOMRect, clientX: number, clientY: number): Tone => {
      const { data, cw, ch } = map;
      // object-fit: cover, object-position: posX center (in canvas pixels)
      const scale = Math.max(box.width / cw, box.height / ch);
      const ox = (box.width - cw * scale) * posX;
      const oy = (box.height - ch * scale) / 2;
      const cx = Math.round((clientX - box.left - ox) / scale);
      const cy = Math.round((clientY - box.top - oy) / scale);
      let sum = 0;
      let n = 0;
      for (let dx = -3; dx <= 3; dx++)
        for (let dy = -1; dy <= 1; dy++) {
          const x = Math.min(cw - 1, Math.max(0, cx + dx));
          const y = Math.min(ch - 1, Math.max(0, cy + dy));
          const i = (y * cw + x) * 4;
          sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
          n++;
        }
      // Only clearly dark areas (e.g. wood ceilings) get white links; warm mid-tones stay dark text
      return sum / n < 115 ? "dark" : "light";
    };

    setHeroToneSampler((clientX, clientY, key) => {
      // Below lg the banners show their white left side, so the navbar sits on light
      if (window.innerWidth < 1024) return "light";
      const box = frameRef.current?.getBoundingClientRect();
      if (!box || clientY < box.top || clientY > box.bottom) return null;

      // Which banner is showing at this point — mid-wipe, that depends on the edge position
      let slide = activeRef.current;
      const wipe = wipeRef.current;
      const t = wipe ? (performance.now() - wipe.start) / WIPE_MS : 1;
      if (wipe && t < 1) {
        const p = wipeEase(Math.max(0, t));
        const top = 118 - 118 * p;
        const f = (clientY - box.top) / box.height;
        const edge = top - 18 * f;
        slide = ((clientX - box.left) / box.width) * 100 >= edge ? wipe.to : wipe.from;
      }
      const pinned = key ? SLIDES[slide].navTones?.[key] : undefined;
      if (pinned) return pinned;
      if (SLIDES[slide].darkNav) return "light";
      const map = maps[slide];
      return map ? toneAt(map, SLIDES[slide].posX, box, clientX, clientY) : null;
    });

    return () => {
      cancelled = true;
      setHeroToneSampler(null);
    };
  }, []);

  const layerState = (i: number) =>
    i === active ? `is-active ${changes === 0 ? "is-first" : ""}` : i === prev ? "is-prev" : "";
  const copyState = (i: number) => (i === active ? "is-active" : i === prev ? "is-leaving" : "");

  return (
    <section
      ref={frameRef}
      className="hh-hero relative w-full overflow-hidden bg-white"
      aria-roledescription="carousel"
      aria-label="Design House highlights"
    >
      <style>{CSS}</style>

      {/* Banners, no overlay: on phones their white left side sits behind the text; on desktop see posX */}
      <div className="absolute inset-0 z-0">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            ref={(el) => { layerRefs.current[i] = el; }}
            className={`hh-layer ${layerState(i)}`}
            aria-hidden={i !== active}
          >
            <div className="hh-move">
              <Image
                src={s.img}
                alt={s.alt}
                fill
                priority
                unoptimized
                sizes="100vw"
                onLoad={() => onBannerLoad(i)}
                className={`object-cover object-left ${s.posClass}`}
              />
            </div>
          </div>
        ))}

        {changes > 0 && (
          <div key={changes} className="hh-beam" aria-hidden="true">
            <div className="b-haze"><i /></div>
            <div className="b-glow"><i /></div>
            <div className="b-core"><i /></div>
          </div>
        )}

      </div>

      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-[104px] pb-10 lg:pt-[108px] lg:pb-4 flex flex-col justify-center">
        <div className="max-w-[660px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {/* Copy for every slide shares one grid cell, so the buttons below never jump */}
          <div className="grid">
            {SLIDES.map((s, i) => {
              const Heading = i === 0 ? "h1" : "h2";
              return (
                <div
                  key={i}
                  className={`hh-copy [grid-area:1/1] self-end ${copyState(i)}`}
                  style={{ "--t0": changes === 0 ? "0s" : "0.5s" } as CSSProperties}
                  aria-hidden={i !== active}
                >
                  <p className={`hh-tag flex flex-wrap items-center gap-x-2.5 sm:gap-x-0 gap-y-1 ${
                      s.taglineClass || (
                        i === 0
                          ? "text-[9.5px] sm:text-[11.5px] tracking-[0.16em] sm:tracking-[0.22em]"
                          : "text-[8.5px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.16em]"
                      )
                    } font-semibold uppercase text-neutral-500 mb-2 sm:mb-2.5`}>
                    {s.tagline.map((t, k) => (
                      <span key={t} className="whitespace-nowrap inline-flex items-center">
                        <span className="sm:hidden w-1 h-1 rounded-full bg-[#1E73E8] mr-1.5" />
                        {k > 0 && <span className="hidden sm:inline mx-2 text-neutral-300">|</span>}
                        {t}
                      </span>
                    ))}
                  </p>

                  <Heading
                    className={`leading-[1.04] tracking-[-0.02em] ${s.underline ? "mb-3" : "mb-4"} ${
                      // Mixed-case headings read better a step lighter than the uppercase ones
                      s.uppercaseTitle ? "uppercase font-extrabold" : "font-bold"
                    } ${
                      s.compact
                        ? "text-[32px] sm:text-[40px] xl:text-[46px] 2xl:text-[52px] min-[1800px]:text-[58px]"
                        : "text-[36px] sm:text-[46px] xl:text-[53px] 2xl:text-[60px] min-[1800px]:text-[66px]"
                    }`}
                  >
                    {s.headingLines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className={`block ${line.accent ? "hh-accent text-[#1E73E8]" : "text-[#262b33]"}`}
                      >
                        <Words text={line.text} start={getWordOffset(s.headingLines, lIdx)} />
                      </span>
                    ))}
                  </Heading>

                  {s.underline && (
                    <span
                      className={`hh-desc block w-14 h-[3px] rounded-full mb-4 ${s.underlineClass || "bg-gradient-to-r from-[#134698] to-[#1E73E8]"}`}
                      aria-hidden="true"
                    />
                  )}

                  <p
                    className={`hh-desc sm:whitespace-pre-line leading-relaxed font-medium text-neutral-800 mb-7 sm:mb-8 ${
                      s.compact ? "text-[13.5px] sm:text-[14.5px] xl:text-[15.5px]" : "text-[14px] sm:text-[15.5px] xl:text-[16.5px]"
                    }`}
                  >
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="hh-rise flex flex-wrap gap-3 sm:gap-4 mb-9 sm:mb-10" style={{ "--d": "0.8s" } as CSSProperties}>
            <a
              href={SLIDES[active]?.button1?.href || "/contact"}
              className="group inline-flex items-center gap-3 rounded-[3px] bg-gradient-to-r from-[#134698] to-[#1E73E8] px-4 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-[12px] font-bold uppercase tracking-wide text-white shadow-[0_10px_24px_-10px_rgba(19,70,152,0.7)] hover:from-[#DE802B] hover:to-[#f0a050] transition-colors"
            >
              {SLIDES[active]?.button1?.text || "Discuss Your Retail Project"}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={SLIDES[active]?.button2?.href || "/portfolio"}
              className="inline-flex items-center rounded-[3px] border-[1.5px] border-neutral-800 bg-white/80 px-4 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-[12px] font-bold uppercase tracking-wide text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              {SLIDES[active]?.button2?.text || "View Our Work"}
            </a>
          </div>

          {/* What we do */}
          <ul className="grid grid-cols-3 sm:flex gap-y-5">
            {SERVICES.map(({ icon: Icon, label: defaultLabel, href }, i) => {
              const label = SLIDES[active]?.serviceLabels?.[i] ?? defaultLabel;
              return (
              <li
                key={href + i}
                className={`hh-rise ${i > 0 ? "sm:border-l sm:border-neutral-300" : ""}`}
                style={{ "--d": `${0.95 + i * 0.08}s` } as CSSProperties}
              >
                <a
                  href={href}
                  className={`group flex flex-col items-center text-center gap-2 sm:px-5 text-[#134698] ${i === 0 ? "sm:pl-0" : ""}`}
                >
                  <Image
                    src={Icon}
                    alt=""
                    sizes="48px"
                    className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
                  />
                  <span className="text-[12.5px] sm:text-[14px] leading-tight text-black whitespace-pre-line group-hover:text-[#134698] transition-colors">
                    {label}
                  </span>
                </a>
              </li>
              );
            })}
          </ul>
        </div>

        {/* Slide nav: arrows + lines straight on the image, bottom right (no background; a drop shadow keeps
            them readable). The active line fills up and advances the slides; hovering pauses it. */}
        <div
          className="hh-rise self-center lg:self-auto mt-8 lg:mt-0 lg:absolute lg:bottom-6 lg:right-8 flex items-center gap-2 lg:drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
          style={{ "--d": "1.4s" } as CSSProperties}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous slide"
            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center ring-1 ring-[#134698]/25 text-[#134698] lg:ring-2 lg:ring-white/80 lg:text-white hover:bg-[#134698] hover:text-white lg:hover:bg-white lg:hover:text-[#134698] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {SLIDES.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show slide ${i + 1}: ${s.navLabel}`}
                aria-current={on}
                className={`group shrink-0 py-3 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  on ? "w-16 sm:w-20" : "w-7 sm:w-9"
                }`}
              >
                <span className="relative block h-[3px] rounded-full overflow-hidden bg-[#134698]/15 lg:bg-white/70 group-hover:bg-[#134698]/30 lg:group-hover:bg-white transition-colors">
                  {on && (
                    <span
                      key={changes}
                      className="hh-fill absolute inset-0 rounded-full bg-gradient-to-r from-[#DE802B] to-[#f5b971]"
                      style={{ animationPlayState: paused ? "paused" : "running" }}
                      onAnimationEnd={autoAdvance}
                    />
                  )}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next slide"
            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center ring-1 ring-[#134698]/25 text-[#134698] lg:ring-2 lg:ring-white/80 lg:text-white hover:bg-[#134698] hover:text-white lg:hover:bg-white lg:hover:text-[#134698] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
