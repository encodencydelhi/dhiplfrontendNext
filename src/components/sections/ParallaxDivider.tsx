"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import parallaxImg from "../../assets/5.webp";

const ParallaxDivider = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Enhanced parallax layers with more dramatic movement
  const y1 = useTransform(scrollYProgress, [0, 1], ["-25%", "25%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-1, 1]);

  return (
    <section 
      ref={ref} 
      className="relative h-[40vh] md:h-[50vh] lg:h-[55vh] overflow-hidden bg-gray-900"
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/15 via-black/25 to-black/15" />

      {/* Main Parallax Image Layer with Enhanced Movement */}
      <m.div 
        style={{ 
          y: y1, 
          scale, 
          opacity,
          rotate
        }}
        className="absolute inset-0 w-full h-[150%] -top-[25%]"
      >
        <m.img
          src={parallaxImg.src}
          alt="Luxury Interior Design"
          className="w-full h-full object-cover object-center brightness-105 contrast-110"
          style={{
            x: useTransform(scrollYProgress, [0, 1], ["-3%", "3%"])
          }}
        />
      </m.div>

      {/* Secondary Parallax Layer for Depth */}
      <m.div 
        style={{ y: y2 }}
        className="absolute inset-0 w-full h-[180%] -top-[40%] z-10 opacity-25"
      >
        <div className="w-full h-full bg-gradient-to-r from-[#DE802B]/20 via-transparent to-[#134698]/20" />
      </m.div>

      {/* Floating Elements with Different Parallax Speeds */}
      <m.div
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]),
          x: useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])
        }}
        className="absolute top-1/4 left-10 w-20 h-20 border border-white/10 rounded-full hidden lg:block z-30"
      />
      <m.div
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]),
          x: useTransform(scrollYProgress, [0, 1], ["5%", "-5%"])
        }}
        className="absolute bottom-1/4 right-12 w-16 h-16 border border-[#DE802B]/20 rounded-full hidden lg:block z-30"
      />
      <m.div
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ["-18%", "18%"]),
          rotate: useTransform(scrollYProgress, [0, 1], [0, 360])
        }}
        className="absolute top-1/3 right-1/4 w-12 h-12 border border-white/5 rounded-full hidden lg:block z-30"
      />
    </section>
  );
};

export default ParallaxDivider;