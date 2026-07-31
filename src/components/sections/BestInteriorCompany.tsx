"use client";

import { useEffect, useState, useRef } from 'react';
import { Users, Sparkles, Clock, Award, Target, Globe, ChevronRight, CheckCircle } from "lucide-react";
import { api, API_URL } from "@/lib/api";
import { cleanDescription } from "@/lib/utils";

const BestInteriorCompany = () => {
  const [counts, setCounts] = useState({
    projects: 0,
    team: 0,
    satisfaction: 0,
    cities: 0
  });

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/why-choose-us');
        if (response.data.success && response.data.data) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching Why Choose Us data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Counter Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-50px' }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [data]);

  useEffect(() => {
    if (!isVisible || !data) return;

    // Helper to parse numbers like "5000+" or "98%"
    const parseStat = (val: string) => {
      if (!val) return 0;
      const num = parseInt(val.replace(/[^0-9]/g, ""));
      return isNaN(num) ? 0 : num;
    };

    const targets = {
      projects: parseStat(data.statCounters?.[0]?.number || "0"),
      team: parseStat(data.statCounters?.[1]?.number || "0"),
      satisfaction: parseStat(data.statCounters?.[2]?.number || "0"),
      cities: parseStat(data.statCounters?.[3]?.number || "0")
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        projects: Math.floor(targets.projects * progress),
        team: Math.floor(targets.team * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
        cities: Math.floor(targets.cities * progress)
      });

      if (currentStep >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, data]);

  if (isLoading || !data) {
    return <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-[#134698] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const iconMap: { [key: string]: any } = {
    "Innovative Designs": Sparkles,
    "Expert Team": Users,
    "Timely Delivery": Clock,
    "Award-Winning": Award,
    "Client-Centric": Target,
    "Nationwide Service": Globe
  };

  const interiorImages = [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w-800&q=80&auto=format&fit=crop"
  ];

  return (
    <section className="py-0 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(#134698 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-gradient-to-br from-[#DE802B]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-tl from-[#134698]/5 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Main Header - Blogs Page Style */}
        <div className="mb-16">
          {/* Styled Span with Lines */}
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]"></div>
            <span className="text-sm md:text-base uppercase tracking-[0.35em] text-[#134698] font-bold">
              {data.subheading}
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#134698]"></div>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-4xl font-serif mb-5 leading-tight text-gray-900">
            {data.heading.split(data.highlightedText)[0]}
            <span className="text-[#DE802B] relative inline-block">
              {data.highlightedText}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-[#134698]/50"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C60 2, 140 2, 198 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-[draw_1.5s_ease-out_forwards]"
                  style={{
                    strokeDasharray: 200,
                    strokeDashoffset: 200
                  }}
                />
              </svg>
            </span>
            {data.heading.split(data.highlightedText)[1]}
          </h2>

          {/* Description */}
          <div className="max-w-4xl">
            <div
              className="text-gray-700 leading-relaxed text-base md:text-lg mb-6 rich-text-content"
              dangerouslySetInnerHTML={{ __html: cleanDescription(data.descriptionHtml) }}
            />
          </div>
        </div>

        {/* Key Points */}
        <div className="mb-16">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.excellenceCards.map((card: any, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-white border border-gray-200 hover:border-[#134698]/30 hover:shadow-md transition-all duration-300"
              >
                <CheckCircle className="w-5 h-5 text-[#DE802B] mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{card.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left Content - Benefits Cards (Blogs Page Style) */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {data.featureCards.map((feature: any, idx: number) => {
                const IconComponent = iconMap[feature.title] || Sparkles;
                return (
                  <div
                    key={idx}
                    className="group bg-white border-2 border-gray-200 p-6 hover:shadow-2xl hover:border-[#134698] transition-all duration-300"
                  >
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#134698]/10 to-[#DE802B]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-[#134698]" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#134698] mb-2 uppercase tracking-wide group-hover:text-[#DE802B] transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {cleanDescription(feature.description)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Image Gallery & Stats */}
          <div className="space-y-8">
            {/* Interior Design Image */}
            <div className="relative overflow-hidden group">
              <img
                src={data.image ? `${API_URL}${data.image.startsWith('/') ? '' : '/'}${data.image}` : "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format&fit=crop"}
                alt={data.imageAltText || "Premium Interior Design"}
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Image Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#DE802B] to-[#ff9d45] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">20+</div>
                    <div className="text-xs text-gray-600">Years Excellence</div>
                  </div>
                </div>
              </div>

              {/* Additional Images section removed as per instruction */}
            </div>

            {/* Stats with Counter */}
            <div
              ref={counterRef}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { key: 'projects', color: '#134698', hoverColor: '#DE802B' },
                { key: 'team', color: '#DE802B', hoverColor: '#134698' },
                { key: 'satisfaction', color: '#134698', hoverColor: '#DE802B' },
                { key: 'cities', color: '#DE802B', hoverColor: '#134698' }
              ].map((stat, idx) => {
                const statData = data.statCounters[idx];
                const suffix = statData?.number.replace(/[0-9]/g, "") || "+";
                return (
                  <div key={idx} className="group bg-white border-2 border-gray-200 p-6 hover:shadow-xl transition-all duration-300" style={{ borderColor: 'transparent', borderImage: `linear-gradient(to bottom, #e2e8f0, #e2e8f0) 1` }}>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2 transition-colors duration-300" style={{ color: stat.color }}>
                        {(counts as any)[stat.key]}{suffix}
                      </div>
                      <div className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                        {statData?.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Call to Action */}

      </div>

      <style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default BestInteriorCompany;