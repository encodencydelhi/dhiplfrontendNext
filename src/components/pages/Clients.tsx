"use client";

import { useEffect, useRef, useState } from "react";
import {
  m,
  useMotionValue,
  animate,
} from "framer-motion";



import { api, API_URL, API_IS_LOCAL } from "@/lib/api";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import DynamicHero from "@/components/layout/DynamicHero";
import Image from "next/image";

interface Client {
  _id: string;
  name: string;
  url: string;
  image: string;
  altText?: string;
  status: string;
  showOnHomepage: boolean;
}

// ✅ TABLE-STYLE LOGO CARD
const LogoCard = ({ client, index }: { client: Client; index: number }) => {
  const CardContent = (
    <>
      {/* TABLE HEADER */}
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-r from-slate-100 to-gray-50 border-b border-slate-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* LOGO CONTAINER */}
      <div className="h-full w-full flex items-center justify-center px-6 pt-8">
        <Image
          src={`${API_URL}${client.image.startsWith('/') ? '' : '/'}${client.image}`}
          alt={client.altText || client.name}
          width={180}
          height={85}
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          unoptimized={API_IS_LOCAL}
        />
      </div>

      {/* BOTTOM BORDER */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-60 group-hover:via-[#DE802B] transition-all duration-300" />
    </>
  );

  return (
    <m.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      {client.url && client.url !== "#" ? (
        <a
          href={client.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative h-[150px] rounded-lg border border-slate-300 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#DE802B]/40"
        >
          {CardContent}
        </a>
      ) : (
        <div className="relative h-[150px] rounded-lg border border-slate-300 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#DE802B]/40">
          {CardContent}
        </div>
      )}
    </m.div>
  );
};

// ✅ MARQUEE CARD
const LogoMarqueeCard = ({ client }: { client: Client }) => {
  const CardContent = (
    <Image
      src={`${API_URL}${client.image.startsWith('/') ? '' : '/'}${client.image}`}
      alt={client.altText || client.name}
      width={160}
      height={80}
      className="max-w-full max-h-20 object-contain transition-all duration-300 group-hover:scale-110"
      loading="lazy"
      unoptimized={API_IS_LOCAL}
    />
  );

  return (
    <div className="flex-shrink-0" style={{ width: "200px" }}>
      {client.url && client.url !== "#" ? (
        <a
          href={client.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center h-28 px-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#DE802B]/20 transition-all duration-300"
        >
          {CardContent}
        </a>
      ) : (
        <div className="group flex items-center justify-center h-28 px-6 bg-white rounded-xl shadow-sm border border-gray-100">
          {CardContent}
        </div>
      )}
    </div>
  );
};

const Clients = () => {

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ FETCH ACTIVE CLIENTS
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/client/active");

        if (response.data.success) {
          setClients(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);



  // ✅ PATH VARIANTS
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut" as any, delay: 0.5 },
        opacity: { duration: 0.3, delay: 0.5 },
      },
    },
  };

  // ✅ MARQUEE MOTION
  const [containerWidth, setContainerWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    const calculateWidth = () => {
      if (!marqueeRef.current) return;
      const width = marqueeRef.current.scrollWidth / 2;
      setContainerWidth(width);
    };

    calculateWidth();
    window.addEventListener("resize", calculateWidth);

    return () => window.removeEventListener("resize", calculateWidth);
  }, [clients]);

  useEffect(() => {
    if (!containerWidth) return;

    if (!isHovered) {
      animationRef.current?.stop();
      animationRef.current = animate(x, [0, -containerWidth], {
        duration: 80,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      });
    } else {
      animationRef.current?.stop();
    }

    return () => animationRef.current?.stop();
  }, [containerWidth, isHovered, x]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Topbar />
      <Navbar />

      {/* HERO SECTION */}
      <DynamicHero
        pageName="Our Clients"
        fallbackImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80"
      />

      {/* TABLE-STYLE CLIENTS SECTION */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-white" />

        <div className="max-w-7xl mx-auto space-y-14">
          {/* HEADER */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-left mb-12"
          >
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]"></div>
              <span className="text-sm md:text-base uppercase tracking-[0.35em] text-[#134698] font-bold">
                OUR CLIENTS
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#134698]"></div>
            </m.div>

            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-2xl md:text-3xl lg:text-4xl font-serif mb-5 leading-tight text-gray-900"
            >
              Our Client{" "}
              <span className="text-[#DE802B] relative inline-block">
                Portfolio
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

            <p className="text-gray-700 leading-relaxed text-sm md:text-base max-w-none">
              A curated collection of industry leaders and premium brands that trust us with their vision. We partner with global companies to deliver exceptional retail environments, innovative kiosks, and bespoke interior solutions across India and beyond.
            </p>
          </m.div>

          {/* LOADING STATE */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#134698] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No clients found</p>
            </div>
          ) : (
            <>
              {/* TABLE-STYLE GRID */}
              <m.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
                className="bg-white rounded-xl border border-slate-300 shadow-md overflow-hidden"
              >
                {/* TABLE HEADER */}
                <div
                  className="bg-[#DE802B] p-4"
                  style={{ backgroundColor: "#DE802B" }}
                >
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1"></div>
                    <div className="col-span-3"></div>
                    <div className="col-span-5"></div>
                    <div className="col-span-3"></div>
                  </div>
                </div>

                {/* TABLE BODY - LOGOS GRID */}
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {clients.map((client, i) => (
                      <LogoCard key={client._id} client={client} index={i} />
                    ))}
                  </div>
                </div>

                {/* TABLE FOOTER */}
                <div className="bg-slate-100 border-t border-slate-300 p-4">
                  <div className="flex justify-between items-center text-sm text-slate-600">
                    <div>
                      Showing {clients.length} of {clients.length} clients
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>All Active</span>
                    </div>
                  </div>
                </div>
              </m.div>

              {/* MARQUEE */}
              <m.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
                className="relative w-full border-t border-b border-gray-500"
              >
                <div className="pointer-events-none absolute top-0 left-0 h-full w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="pointer-events-none absolute top-0 right-0 h-full w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />

                <div
                  className="overflow-hidden py-8"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <m.div
                    ref={marqueeRef}
                    className="flex gap-6 md:gap-8 items-center"
                    style={{ x }}
                  >
                    {[...clients, ...clients].map((client, index) => (
                      <LogoMarqueeCard
                        key={`${client._id}-${index}`}
                        client={client}
                      />
                    ))}
                  </m.div>
                </div>
              </m.div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Clients;
