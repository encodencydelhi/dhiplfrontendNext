"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { Linkedin, Mail, ArrowRight } from "lucide-react";
import { api, API_URL } from "@/lib/api";

const OurTeam = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await api.get('/api/our-team');
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeamData();
  }, []);

  // SVG Path Animation Variants
  const pathVariants: any = {
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

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center bg-white min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#134698] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return null;

  const renderHeading = () => {
    if (!data.highlightText || !data.heading.includes(data.highlightText)) {
      return data.heading;
    }

    const parts = data.heading.split(data.highlightText);
    return (
      <>
        {parts[0]}
        <span className="text-[#DE802B] relative inline-block">
          {data.highlightText}
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
        {parts[1]}
      </>
    );
  };



  return (
    <section className="pt-10 md:pt-12 pb-16 md:pb-20 bg-gradient-to-b from-[#f7f9ff] via-[#fafafa] to-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* HEADER: About Us Style */}
        <div className="mb-8 text-center">
          {/* Styled Span with Lines */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-3"
          >
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]"></div>

            <span className="text-base md:text-lg lg:text-xl uppercase tracking-[0.35em] text-[#134698] font-bold">
              {data.subheading || 'OUR TEAM'}
            </span>

            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#134698]"></div>
          </m.div>

          {/* Styled H2 with Animated Underline */}
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-2xl md:text-3xl lg:text-4xl font-serif mb-4 leading-tight text-gray-900"
          >
            {renderHeading()}
          </m.h2>

          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto"
          >
            {data.description}
          </m.p>
        </div>

        {/* TEAM GRID: Full Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.members?.map((member: any, idx: number) => (
            <m.div
              key={member._id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative"
            >
              {/* Image Card - Full Color */}
              <div className="relative aspect-[4/5] overflow-hidden transition-all duration-700 ease-in-out bg-gray-200 rounded-lg shadow-md hover:shadow-xl">
                <img
                  src={member.image.startsWith('http') ? member.image : `${API_URL}${member.image.startsWith('/') ? '' : '/'}${member.image}`}
                  alt={member.altText || member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Social Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white text-black hover:bg-[#134698] hover:text-white transition-colors rounded"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {member.mailUrl && (
                    <a
                      href={member.mailUrl.startsWith('mailto:') ? member.mailUrl : `mailto:${member.mailUrl}`}
                      className="p-2 bg-white text-black hover:bg-[#134698] hover:text-white transition-colors rounded"
                    >
                      <Mail size={18} />
                    </a>
                  )}
                </div>
              </div>

              {/* Name & Position: Minimalist Style */}
              <div className="mt-5 text-center md:text-left">
                <h3 className="text-lg font-bold text-[#134698] tracking-tight transition-colors">
                  {member.name}
                </h3>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                  <div className="w-4 h-[1px] bg-[#DE802B]"></div>
                  <p className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">
                    {member.position}
                  </p>
                </div>
              </div>
            </m.div>
          ))}
        </div>

        {/* COMPACT FOOTER DESCRIPTION */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-14 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-gray-600 text-[15px] max-w-2xl leading-relaxed italic">
            {data.footerQuote}
          </p>
          <a
            href={data.buttonUrl || "#"}
            className="flex items-center gap-2 px-6 py-3 bg-[#134698] text-white text-sm font-semibold hover:bg-black transition-all group rounded-md"
          >
            {data.buttonText || 'Work With Us'}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </m.div>
      </div>
    </section>
  );
};

export default OurTeam;
