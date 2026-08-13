"use client";

import { useState } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { API_IS_LOCAL } from "@/lib/api";

interface GalleryItem {
  id: number;
  title: string;
  url: string;
  category: string;
}

interface RecentWorkSectionProps {
  galleryItems: GalleryItem[];
  onImageClick: (item: GalleryItem) => void;
  viewAllLink?: string;
}

const RecentWorkSection = ({ galleryItems, onImageClick, viewAllLink = "/portfolio" }: RecentWorkSectionProps) => {
  // SVG Path Animation Variants
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
          ease: "easeInOut" as const,
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
    <div className="mb-0 pt-0 mt-0">

      {/* Header - Left Aligned like Recent Articles */}
      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-left mb-6"

      >
        {/* Styled Span with Lines */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 mb-2"

        >
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]"></div>
          <span className="text-sm md:text-base uppercase tracking-[0.35em] text-[#134698] font-bold">
            OUR PORTFOLIO
          </span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#134698]"></div>
        </m.div>

        {/* Styled H2 with Animated Underline */}
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-2xl md:text-3xl lg:text-4xl font-serif mb-3 leading-tight text-gray-900"

        >
          Our Recent{" "}
          <span className="text-[#DE802B] relative inline-block">
            Work
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
                variants={pathVariants}
              />
            </m.svg>
          </span>
        </m.h2>

        <p className="text-gray-700 leading-relaxed text-sm md:text-base max-w-2xl">
          Real homes. Real elegance.
        </p>
      </m.div>

      {/* Gallery Grid - 4 Columns on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-0">

        {galleryItems.map((item, idx) => (
          <m.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: idx * 0.05, ease: [0.42, 0, 0.58, 1] }}
            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer aspect-[4/3]"
            onClick={() => onImageClick(item)}
          >
            <Image
              src={item.url}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              unoptimized={API_IS_LOCAL}
            />

            {/* Clean image-only view as requested */}
          </m.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          href={viewAllLink}
          className="inline-block rounded-md border border-[#134698] px-8 py-3 text-sm tracking-wider hover:bg-[#134698] hover:text-white transition-all duration-300 font-medium text-[#DE802B] shadow-lg hover:shadow-xl"
        >
          View All
        </Link>
      </div>
    </div>
  );
};

export default RecentWorkSection;