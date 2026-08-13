"use client";

import { m } from "framer-motion";
import { Sparkles, Target, Palette, Zap } from "lucide-react";
import Image from "next/image";
import { API_IS_LOCAL } from "@/lib/api";

const BrandConsciousApproach = () => {
  const approaches = [
    {
      icon: Target,
      title: "Competitive Advantage",
      description: "High-demand products unavailable from other designers or retail options, coupled with superior service and support"
    },
    {
      icon: Palette,
      title: "Distinctive Design",
      description: "Choice of antiques, home décor items, and ancillary goods combined with expert interior design consulting"
    },
    {
      icon: Sparkles,
      title: "Creative Innovation",
      description: "Highly sophisticated methodology starting with data gathering, analysis, and concept development"
    },
    {
      icon: Zap,
      title: "Exclusive Excellence",
      description: "History of innovation with novel, forward-thinking design methods for each project"
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#134698]/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#DE802B]/5 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-[#DE802B]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#134698] font-bold">
              OUR PHILOSOPHY
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Brand Conscious{" "}
            <span className="text-[#134698] relative inline-block">
              Approach
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C60 2, 140 2, 198 10" stroke="#DE802B" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
        </m.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Standing Out in the Market
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                When compared to other interior designers, Design House will stand out for the value it provides in high-demand products that are not available from other designers or retail options, as well as for the superior service and support it provides.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Perfect customer follow-through will be provided. The same tried-and-true elements that suggested increased success rates for interior design services are leveraged in this competitive advantage.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#134698] to-[#000080] rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-serif font-bold mb-4">
                Best Interior Design Expertise
              </h3>
              <p className="text-white/90 leading-relaxed">
                We provide the best interior design expertise for the home and workplace. The concept is distinctive due to the choice of antiques, home décor items, and ancillary goods as well as the interior design consulting expertise.
              </p>
            </div>
          </m.div>

          {/* Right Image */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"
                alt="Brand Conscious Design"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
                loading="lazy"
                unoptimized={API_IS_LOCAL}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <p className="text-white text-lg font-medium">
                    "THE FINEST DESIGN POSSIBLE"
                  </p>
                  <p className="text-white/80 text-sm mt-2">
                    Thanks to our creative vision and approach
                  </p>
                </div>
              </div>
            </div>
          </m.div>
        </div>

        {/* Approach Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approaches.map((approach, idx) => (
            <m.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:border-[#134698] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#134698] to-[#000080] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <approach.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">{approach.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{approach.description}</p>
            </m.div>
          ))}
        </div>

        {/* Bottom Statement */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 md:p-10 border-2 border-gray-200 text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              The method we use is highly sophisticated; it starts with gathering all the relevant data, facts, and numbers, then analyzing them to develop the concept that will lead to an exclusive design created only for you.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              We value creativity throughout and have a history of being innovators in many fields. Every new project outlines and demonstrates a novel and forward-thinking method of design. For our clients, we guarantee <strong className="text-[#134698]">"THE FINEST DESIGN POSSIBLE"</strong> thanks to our creative vision and approach to the projects.
            </p>
          </div>
        </m.div>
      </div>
    </section>
  );
};

export default BrandConsciousApproach;