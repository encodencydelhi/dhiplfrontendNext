"use client";

import { m, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useEffect } from "react";

const AboutHero = () => {
  const ref = useRef<HTMLElement>(null);

  // Mouse Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Scroll Motion Values with the specific offset requested
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Enhanced parallax layers from user snippet
  const y1 = useTransform(scrollYProgress, [0, 1], ["-25%", "25%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"]);
  const opacityScroll = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const scaleScroll = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);
  const rotateScroll = useTransform(scrollYProgress, [0, 1], [-1, 1]);
  const imgX = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  // Secondary Text Parallax (keeps focus)
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse based parallax (subtle depth)
  const mouseBgX = useTransform(smoothMouseX, [-500, 500], ["0.5%", "-0.5%"]);
  const mouseBgY = useTransform(smoothMouseY, [-500, 500], ["0.5%", "-0.5%"]);
  const mouseTextX = useTransform(smoothMouseX, [-500, 500], ["-1%", "1%"]);
  const mouseTextY = useTransform(smoothMouseY, [-500, 500], ["-1%", "1%"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = clientX - innerWidth / 2;
      const y = clientY - innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // SVG Path Animation Variants
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.5 },
        opacity: { duration: 0.3, delay: 0.5 }
      }
    }
  };

  return (
    <section
      ref={ref}
      className="relative h-[65vh] min-h-[500px] overflow-hidden bg-[#050505] flex items-center justify-center"
    >
      {/* 1. Deep Background Layer (Scroll Logic from User Snippet) */}
      <m.div
        style={{
          y: y1,
          scale: scaleScroll,
          opacity: opacityScroll,
          rotate: rotateScroll,
          x: mouseBgX,
          translateY: mouseBgY
        }}
        className="absolute inset-x-0 w-full h-[150%] -top-[25%] z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#050505] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />
        <m.img
          src="https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1920&q=80&auto=format&fit=crop"
          alt="Luxury Interior Design"
          className="w-full h-full object-cover grayscale-[10%] contrast-[110%]"
          style={{ x: imgX }}
        />
      </m.div>

      {/* 2. Secondary Depth Layer Overlay (y2 from Snippet) */}
      <m.div
        style={{ y: y2 }}
        className="absolute inset-x-0 w-full h-[180%] -top-[40%] z-5 opacity-20 pointer-events-none"
      >
        <div className="w-full h-full bg-linear-to-r from-[#DE802B]/10 via-transparent to-[#134698]/10" />
      </m.div>

      {/* 3. Dynamic Glow Orbs */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <m.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#DE802B]/20 rounded-full blur-[120px]"
        />
        <m.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#134698]/20 rounded-full blur-[140px]"
        />
      </div>

      {/* 4. Foreground Content (High Parallax) */}
      <m.div
        style={{
          opacity: textOpacity,
          y: textY,
          x: mouseTextX,
          translateY: mouseTextY
        }}
        className="relative z-30 container mx-auto px-6 max-w-5xl text-center"
      >
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {/* Tagline */}
          <m.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-block text-[#DE802B] uppercase tracking-[0.3em] text-xs font-semibold"
          >
            Since 2004 — Excellence in Design
          </m.span>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] tracking-tight">
              Designing Dreams,
              <br />
              <span className="relative inline-block mt-2">
                <span className="text-white italic font-light opacity-90">Creating </span>
                <span className="text-[#DE802B]">Memories</span>
                <m.svg
                  className="absolute -bottom-3 left-0 w-full h-4 text-[#134698]/80"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial="hidden"
                  animate="visible"
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
            </h1>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-base md:text-lg text-gray-400 font-light max-w-2xl mx-auto leading-relaxed"
            >
              Transforming spaces into timeless masterpieces where innovation
              meets elegance in every thoughtful detail.
            </m.p>
          </div>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <m.div initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 1, duration: 1 }} className="h-[1px] bg-gradient-to-r from-transparent to-[#DE802B]/50" />
            <div className="w-1.5 h-1.5 bg-[#DE802B] rotate-45 shadow-[0_0_10px_#DE802B]" />
            <m.div initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 1, duration: 1 }} className="h-[1px] bg-gradient-to-l from-transparent to-[#DE802B]/50" />
          </div>
        </m.div>
      </m.div>

      {/* 5. Floating Glass Particles */}
      {[...Array(6)].map((_, i) => (
        <m.div
          key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [0, -100 - i * 50, 0],
            x: [0, (i % 2 === 0 ? 50 : -50), 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 1.5
          }}
          className="absolute z-40 pointer-events-none"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
        >
          <div
            className={`w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-[#DE802B]' : 'bg-[#134698]'} blur-[1px] shadow-[0_0_8px_currentColor]`}
          />
        </m.div>
      ))}

      {/* Scroll Down Indicator */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-medium">Discover More</span>
        <m.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[2px] h-10 bg-gradient-to-b from-[#DE802B] to-transparent"
        />
      </m.div>
    </section>
  );
};

export default AboutHero;