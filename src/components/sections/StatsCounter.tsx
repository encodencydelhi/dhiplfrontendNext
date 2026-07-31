"use client";

import { m } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Award, Users, Briefcase, TrendingUp, ShoppingBag, Target, Zap, Heart } from "lucide-react";
import { api, API_URL, API_IS_LOCAL } from "@/lib/api";

// Extracted Counter component for better performance and reliable resizing/rendering
const Counter = ({ end, duration = 2, suffix = "", isVisible }: { end: number, duration?: number, suffix?: string, isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Reset count when not visible so it animates again when visible
    if (!isVisible) {
      setCount(0);
      return;
    }

    let startTime: number;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const StatsCounter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const sectionRef = useRef(null);

  // Icon mapping
  const iconMap: any = {
    Award, Users, Briefcase, TrendingUp, ShoppingBag, Target, Zap, Heart
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [stats.length]);

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/stats-counter");
        if (response.data.success) {
          // Sort by order 
          const sortedStats = response.data.data.counters.sort((a: any, b: any) => a.order - b.order);
          setStats(sortedStats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  if (stats.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-8 md:py-10 bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1480px]">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = iconMap[stat.icon] || Award;
            const imageUrl = stat.image.startsWith('http')
              ? stat.image
              : `${API_URL}${stat.image.startsWith('/') ? '' : '/'}${stat.image}`;

            return (
              <m.div
                key={stat._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group"
              >
                {/* Card with Image Background */}
                <div
                  className="relative p-5 h-full overflow-hidden rounded-xl"
                  style={{
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 20px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {/* Background Image - Always Visible */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={stat.altText || stat.label}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                      unoptimized={API_IS_LOCAL}
                    />
                    {/* Dynamic Overlay */}
                    <div
                      className="absolute inset-0 transition-all duration-500"
                      style={{
                        backgroundColor: stat.overlayColor || '#134698',
                        opacity: (stat.overlayOpacity || 50) / 100
                      }}
                    />
                    {/* Hover darkening effect */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-3">
                      <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Counter Number */}
                    <div className="mb-2">
                      <h3 className="text-3xl md:text-4xl font-bold text-white transition-all duration-300">
                        <Counter
                          end={parseInt(stat.number)}
                          suffix={stat.suffix}
                          isVisible={isVisible}
                        />
                      </h3>
                    </div>

                    {/* Label */}
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-white uppercase tracking-wide">
                        {stat.label}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-white/90">
                      {stat.description}
                    </p>
                  </div>

                  {/* Hover Accent Line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#DE802B] to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-xl" />
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;