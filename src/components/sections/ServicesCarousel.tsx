"use client";

import { m } from "framer-motion";
import { useState, useEffect } from "react";
import { ShoppingBag, Store, Utensils, Building, Megaphone, Calendar, ArrowRight } from "lucide-react";
import { api, API_URL } from "@/lib/api";

const FeaturedServices = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [headings, setHeadings] = useState({
    subheading: "SERVICES WE DO",
    heading: "Our Featured Services",
    highlightedWord: "& Transformations"
  });
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Icon mapping
  const iconMap = {
    ShoppingBag,
    Store,
    Utensils,
    Building,
    Megaphone,
    Calendar,
    ArrowRight
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/api/featured-services");
        if (response.data.success) {
          const data = response.data.data;
          setHeadings({
            subheading: data.subheading || "SERVICES WE DO",
            heading: data.heading || "Our Featured Services",
            highlightedWord: data.highlightedWord || "& Transformations"
          });

          // Map services with proper icon components
          const mappedServices = data.services.map((service: any) => ({
            ...service,
            order: service.order || 0,
            icon: iconMap[service.icon as keyof typeof iconMap] || ShoppingBag,
            image: service.image?.startsWith('http')
              ? service.image
              : `${API_URL}${service.image?.startsWith('/') ? '' : '/'}${service.image}`
          }));

          // Sort by order field
          mappedServices.sort((a, b) => a.order - b.order);

          setServices(mappedServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: 1.5,
          ease: "easeInOut",
          delay: 0.5
        },
        opacity: {
          duration: 0.3,
          delay: 0.5
        }
      }
    }
  };

  return (
    <section className="relative pt-8 md:pt-10 pb-8 md:pb-10 bg-[#F5F2F2] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Header - About Style */}
        <div className="mb-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-2"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#134698]"></div>
            <span className="text-sm md:text-base lg:text-lg uppercase tracking-[0.3em] text-[#134698] font-bold">
              {headings.subheading}
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#134698]"></div>
          </m.div>

          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif mb-5 leading-tight text-gray-900"
          >
            {headings.heading}{" "}
            <span className="text-[#DE802B] relative inline-block">
              {headings.highlightedWord}
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
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredCard === index;

            return (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative cursor-pointer"
              >
                {/* Card Container */}
                <div className="relative h-[400px] bg-white border border-gray-200 overflow-hidden transition-all duration-500 hover:border-gray-300 hover:shadow-2xl">
                  {/* Background Image - Full Card on Hover */}
                  <div className="absolute inset-0 overflow-hidden">
                    <m.img
                      src={service.image}
                      alt={service.altText || service.title}
                      className="w-full h-full object-cover"
                      decoding="async"
                      animate={{
                        scale: isHovered ? 1.15 : 1.05,
                      }}
                      transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                    />

                    {/* Gradient Overlay - Lighter when not hovered */}
                    <m.div
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
                      animate={{
                        opacity: isHovered ? 0.8 : 0.3,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Number Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <m.div
                      className="w-14 h-14 bg-white/95 backdrop-blur-sm flex items-center justify-center"
                      animate={{
                        y: isHovered ? -4 : 0,
                        opacity: isHovered ? 0 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-xl font-light text-[#134698]">{service.number}</span>
                    </m.div>
                  </div>

                  {/* Icon - Hide on Hover */}
                  <m.div
                    className="absolute top-6 right-6 z-20"
                    animate={{
                      scale: isHovered ? 0 : 1,
                      opacity: isHovered ? 0 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-12 h-12 bg-white/95 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#DE802B]" strokeWidth={2} />
                    </div>
                  </m.div>

                  {/* Content Section - Hide on Hover */}
                  <m.div
                    className="absolute bottom-0 left-0 right-0 p-6 bg-white h-[170px] z-10"
                    animate={{
                      y: isHovered ? 100 : 0,
                      opacity: isHovered ? 0 : 1,
                    }}
                    transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                  >
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {/* CTA Link */}
                    <div className="flex items-center gap-2 text-[#134698] font-semibold">
                      <span className="text-xs uppercase tracking-wider">{service.buttonText || "Learn More"}</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                  </m.div>

                  {/* Hover State - Show Title in Center */}
                  <m.div
                    className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-8"
                    animate={{
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-center mb-auto pt-20">
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-white/90 text-base leading-relaxed max-w-sm mx-auto">
                        {service.description}
                      </p>
                    </div>
                  </m.div>

                  {/* Learn More Button - Bottom Right on Hover */}
                  <m.div
                    className="absolute bottom-6 right-6 z-30"
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      y: isHovered ? 0 : 20,
                    }}
                    transition={{ duration: 0.4, delay: isHovered ? 0.2 : 0 }}
                  >
                    <a
                      href={service.buttonUrl || "#"}
                      className="border-2 border-white px-5 py-2.5 text-xs tracking-wider text-white bg-transparent transition-all duration-300 flex items-center gap-2 font-medium hover:bg-white/10"
                    >
                      {service.buttonText || "Learn More"}
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </m.div>

                  {/* Bottom Accent Bar */}
                  <m.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#DE802B] to-[#134698] z-30"
                    initial={{ width: 0 }}
                    animate={{ width: isHovered ? "100%" : 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                  />
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;