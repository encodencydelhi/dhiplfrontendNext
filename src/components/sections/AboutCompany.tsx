"use client";

import { m } from "framer-motion";
import { Target, Award } from "lucide-react";
import Image from "next/image";
import { API_IS_LOCAL } from "@/lib/api";

const AboutCompany = () => {

  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Images Grid with Shiny Effect */}
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {[
                "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
                "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
                "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
              ].map((src, idx) => (
                <m.div
                  key={idx}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: (idx * 100) / 1000, ease: [0.42, 0, 0.58, 1] }}
                  className="relative overflow-hidden rounded-2xl group aspect-square"
                >
                  <Image
                    src={src}
                    alt={`Interior design ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    unoptimized={API_IS_LOCAL}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-60" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:animate-[shine_1.5s_ease-in-out]" />
                  </div>
                </m.div>
              ))}
            </div>
          </div>

          {/* Content */}
          <m.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <m.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#134698]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#134698] font-bold">
                ABOUT US
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#134698]" />
            </m.div>

            <m.h2
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1, ease: [0.42, 0, 0.58, 1] }}
              className="text-4xl md:text-5xl font-serif mb-6 leading-tight text-gray-900"
            >
              Crafting Exceptional Spaces{" "}
              <span className="text-[#DE802B] relative inline-block">
                Since 1983
              </span>
            </m.h2>

            <div className="space-y-5 mb-8">
              <m.p
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.15, ease: [0.42, 0, 0.58, 1] }}
                className="text-gray-700 leading-relaxed text-base"
              >
                <strong className="text-gray-900">Design House India Private Limited</strong> is a premier manufacturer of retail display solutions with nationwide reach. Our efficient production and distribution network delivers seamless solutions across India.
              </m.p>

              <m.p
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.42, 0, 0.58, 1] }}
                className="text-gray-700 leading-relaxed text-base"
              >
                As a leading interior design company in Delhi, we specialize in Display Merchandising, Events, Exhibitions, Retail Kiosks, and Turnkey Projects with a team of qualified professionals.
              </m.p>
            </div>

            {/* Mission & Vision Cards */}
            <m.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.25, ease: [0.42, 0, 0.58, 1] }}
              className="grid sm:grid-cols-2 gap-5 mb-8"
            >
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:-translate-y-2 transition-all duration-300 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#000080]/10 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#DE802B]" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg">Our Mission</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Deliver innovative designs that exceed expectations and create lasting value through exceptional craftsmanship.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:-translate-y-2 transition-all duration-300 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#000080]/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-[#DE802B]" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg">Our Vision</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  To be the most trusted interior design partner, transforming spaces into inspiring environments.
                </p>
              </div>
            </m.div>

            <m.p
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.42, 0, 0.58, 1] }}
              className="text-gray-700 text-base leading-relaxed"
            >
              Our experienced team understands corporate culture and designs spaces that enhance brand identity—a crucial growth factor for organizations.
            </m.p>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default AboutCompany;