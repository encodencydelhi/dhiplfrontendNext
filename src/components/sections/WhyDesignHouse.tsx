"use client";

import { m } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const WhyDesignHouse = () => {
  const reasons = [
    "Our priority is client satisfaction",
    "Beautiful & unique design techniques every time",
    "Skilled and professional designers",
    "Regular client meet-ups and consultations",
    "Flexible designs that adapt to changing tastes",
    "Affordable service without compromising elegance",
    "Expert team working across different areas",
    "Proven track record of successful projects",
    "Perfect blend of imagination and innovation"
  ];


  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#134698]/5 to-transparent rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#DE802B]/5 to-transparent rounded-full blur-3xl translate-x-1/2" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#DE802B]/10 to-[#134698]/10 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#DE802B]" />
              <span className="text-xs font-semibold text-gray-700 tracking-wider">WHY CHOOSE US</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight mb-4">
              Why Design House India{" "}
              <span className="text-[#134698] relative inline-block">
                Private Limited?
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C60 2, 140 2, 198 10" stroke="#DE802B" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              People have shifted their focus from purchasing a house to making it a home with perfect interiors. With numerous interior designers in the market, choosing the right one is crucial for your dream space.
            </p>

            {/* Image with Stats */}
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                alt="Why Choose Design House"
                className="w-full h-72 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Excellence</h3>
                    <p className="text-white/90">in Every Detail</p>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg">
                    <div className="text-2xl font-bold text-[#134698]">20+</div>
                    <div className="text-xs text-gray-600">Years</div>
                  </div>
                </div>
              </div>
            </div>
          </m.div>

          {/* Right Content - Reasons */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
          >
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 md:p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Why you should select Design House India Pvt. Ltd:
              </h3>

              <ul className="space-y-3">
                {reasons.map((reason, idx) => (
                  <m.li
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: (idx * 50) / 1000, ease: [0.42, 0, 0.58, 1] }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#134698] to-[#1a5bb8] flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">
                      {reason}
                    </span>
                  </m.li>
                ))}
              </ul>
            </div>

            {/* Bottom CTA */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
              className="mt-6 bg-gradient-to-r from-[#134698] to-[#1a5bb8] rounded-xl p-6 text-white text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <p className="text-base font-medium relative z-10">
                Ready to transform your space? Let's create something extraordinary together!
              </p>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default WhyDesignHouse;
