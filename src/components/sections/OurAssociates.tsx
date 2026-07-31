"use client";

import { m } from "framer-motion";
import { Handshake, Award, TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";

const OurAssociates = () => {
  const highlights = [
    {
      icon: Award,
      title: "Premium Quality",
      desc: "European-grade standards & finish",
    },
    {
      icon: ShieldCheck,
      title: "Reliable Execution",
      desc: "Strong service + repeat partnerships",
    },
    {
      icon: TrendingUp,
      title: "Proven Performance",
      desc: "Consistent long-term results",
    },
  ];

  // SVG Path Animation Variants (same as About section)
  const pathVariants = {
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
          ease: "easeInOut",
          delay: 0.5,
        },
        opacity: {
          duration: 0.3,
          delay: 0.5,
        },
      },
    },
  };

  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-b from-[#f6f8ff] via-[#fafafa] to-white">
      {/* Soft decorative background */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#134698]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-[#DE802B]/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          
          {/* ================= LEFT CONTENT ================= */}
          <m.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Top label - styled like About section */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#134698]"></div>
              <span className="text-sm md:text-base lg:text-lg uppercase tracking-[0.3em] text-[#134698] font-bold">
                OUR ASSOCIATES
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#134698]"></div>
            </m.div>

            {/* Heading - styled like About section with animated underline */}
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif mb-5 leading-tight text-gray-900"
            >
              Building Strong{" "}
              <span className="text-[#DE802B] relative inline-block">
                Partnerships
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
                    variants={pathVariants as any}
                  />
                </m.svg>
              </span>
            </m.h2>

            {/* Short Description */}
            <p className="mt-4 text-sm md:text-base text-gray-700 leading-relaxed max-w-xl">
              We work with trusted brands and experienced partners to ensure
              quality, durability, and premium finishes across interiors, retail,
              and turnkey execution.
            </p>

            {/* Info Blocks (Professional style) */}
            <div className="mt-6 space-y-4 max-w-xl">
              {/* Block 1 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Ensis — Quality that matches global standards
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Ensis is a center of excellence and offers high-quality,
                  best-in-class design solutions including Italian and European
                  kitchen cabinets and shutters — crafted to suit diverse tastes
                  while delivering true value for money.
                </p>
              </div>

              {/* Block 2 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Furniture, Flooring & Modular Expertise
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Ensis is one of the leading manufacturers and importers of
                  wooden flooring, modular furniture, office furniture, modular
                  kitchens, post-forming, and wardrobes. Their team delivers a
                  perfect blend of quality, durability, and style.
                </p>
              </div>

              {/* Block 3 (Highlight line) */}
              <div className="bg-[#134698]/5 border border-[#134698]/20 rounded-2xl p-5">
                <p className="text-gray-800 text-sm leading-relaxed">
                  Our association with{" "}
                  <span className="font-bold text-[#134698]">KUMAR DESIGNS</span>{" "}
                  provides strong support to meet furniture and retail fixture
                  requirements with speed and consistency.
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {highlights.map((item, idx) => (
                <m.div
                  key={idx}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#134698]/40 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#DE802B]/10 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-[#DE802B]" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </m.div>
              ))}
            </div>
          </m.div>

          {/* ================= RIGHT PREMIUM CARD ================= */}
          <m.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="relative"
          >
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400">
              
              {/* Image */}
              <div className="relative h-64 md:h-72 overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1400&q=80&auto=format&fit=crop"
                  alt="Associates"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

                {/* Top Badge */}
              

                {/* Stats Card */}
               
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Premium Collaboration. Consistent Results.
                </h3>

                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Our partners support high-end interior output through refined
                  workmanship, premium material sourcing, and seamless execution.
                </p>

                {/* Divider */}
                <div className="my-5 h-px w-full bg-gray-200" />

                {/* Mini Points */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-gray-200 p-4 bg-[#fafafa]">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Focus
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      Quality Output
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 p-4 bg-[#fafafa]">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Strength
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      Timely Delivery
                    </p>
                  </div>
                </div>

                {/* Button */}
                <div className="mt-5 flex items-center justify-end">
                  <button 
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#134698] text-white text-sm font-semibold hover:bg-black transition-all duration-300"
                    aria-label="Explore our partners"
                  >
                    Explore Partners
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative card behind */}
            <div className="hidden lg:block absolute -top-6 -right-6 w-28 h-28 bg-[#DE802B]/10 rounded-3xl -z-10" />
          </m.div>

        </div>
      </div>
    </section>
  );
};

export default OurAssociates;