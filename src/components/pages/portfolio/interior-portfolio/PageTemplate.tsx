"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import Location from "@/components/sections/Location";
import useServiceDetail from "@/hooks/useServiceDetail";
import { API_URL, API_IS_LOCAL } from "@/lib/api";
import Image from "next/image";
import { useSeo } from "@/context/SeoContext";
import { cleanDescription } from "@/lib/utils";

interface PageItem {
  title: string;
  description: string;
  image: string;
  href?: string;
}

interface PageTemplateProps {
  heroImage: string;
  mainTitle?: string;
  highlightedTitle?: string;
  subtitle?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  portfolioTitle?: string;
  items: PageItem[];
  primaryColor?: string;
  secondaryColor?: string;
  showReadMore?: boolean;
  onReadMoreClick?: (item: PageItem, index: number) => void;
  category?: string;
  subCategory?: string;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  heroImage: propHeroImage,
  mainTitle: propMainTitle = "",
  highlightedTitle: propHighlightedTitle = "",
  subtitle: propSubtitle = "",
  sectionTitle = "",
  sectionSubtitle = "",
  portfolioTitle = "OUR PORTFOLIO",
  items,
  primaryColor = "#134698",
  secondaryColor = "#DE802B",
  showReadMore = true,
  onReadMoreClick,
  category = "",
  subCategory = ""
}) => {
  const { data, isLoading: isServiceLoading, portfolioGalleryImages } = useServiceDetail(category);
  const { setCustomSeo } = useSeo();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [bannerData, setBannerData] = useState<{
    heroImage: string;
    bannerTitle: string;
    bannerHighlightText: string;
    heroImageAltText: string;
    description: string;
  } | null>(null);
  const [isBannerLoading, setIsBannerLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);

  useEffect(() => {
    const fetchCategoryBanner = async () => {
      if (!category) return;
      try {
        setIsBannerLoading(true);
        const url = new URL(`${API_URL}/api/portfolio-gallery/category-banner`);
        url.searchParams.append("category", category);
        if (subCategory) url.searchParams.append("subCategory", subCategory);
        
        const response = await fetch(url.toString());
        const result = await response.json();
        if (result.success && result.data) {
          setBannerData({
            heroImage: result.data.heroImage || "",
            bannerTitle: result.data.bannerTitle || "",
            bannerHighlightText: result.data.bannerHighlightText || "",
            heroImageAltText: result.data.heroImageAltText || "",
            description: result.data.description || "",
          });
        }
      } catch (error) {
        console.error("Error fetching category banner:", error);
      } finally {
        setIsBannerLoading(false);
      }
    };

    fetchCategoryBanner();

    const fetchGalleryImages = async () => {
      if (!category) return;
      try {
        setIsGalleryLoading(true);
        const url = new URL(`${API_URL}/api/portfolio-gallery/get-images`);
        url.searchParams.append("category", category);
        if (subCategory) url.searchParams.append("subCategory", subCategory);
        
        const response = await fetch(url.toString());
        const result = await response.json();
        if (result.success && result.data) {
          setGalleryImages(result.data);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setIsGalleryLoading(false);
      }
    };

    fetchGalleryImages();
  }, [category, subCategory]);

  useEffect(() => {
    if (data?.seo) {
      setCustomSeo(data.seo);
    }
    return () => setCustomSeo(null);
  }, [data, setCustomSeo]);

  // Use dynamic data if available, fallback to subCategory/category or props
  // Priority: 1. Banner Settings (Portfolio Gallery) -> 2. Service Detail -> 3. Fallback from Subcategory/Category -> 4. Props
  const heroImage = bannerData?.heroImage 
    ? `${API_URL}${bannerData.heroImage.startsWith('/') ? '' : '/'}${bannerData.heroImage}`
    : (data?.bgImage ? `${API_URL}${data.bgImage.startsWith('/') ? '' : '/'}${data.bgImage}` : propHeroImage);
  
  // Dynamic fallbacks based on props
  const fallbackMainTitle = subCategory || category || propMainTitle;
  const fallbackSubtitle = `Discover our exceptional ${subCategory || category || 'projects'} and innovative design solutions.`;

  const mainTitle = bannerData?.bannerTitle || data?.bgTitle || propMainTitle || subCategory || category;
  const bgHighlightTitle = bannerData?.bannerHighlightText || data?.bgHighlightTitle || "";
  const subtitle = bannerData?.description || data?.highlightText || propSubtitle || fallbackSubtitle;
  const highlightedTitle = (bannerData?.bannerHighlightText || data?.bgHighlightTitle) 
    ? (bannerData?.bannerHighlightText || data?.bgHighlightTitle) 
    : (propHighlightedTitle || ""); 
  
  const heroAlt = bannerData?.heroImageAltText || data?.bgAltText || mainTitle;
  
  // Update section titles to be more dynamic
  const finalSectionTitle = sectionTitle || "Our";
  const finalSectionSubtitle = sectionSubtitle || (subCategory || category || "Portfolio");

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
          ease: "easeInOut" as any,
          delay: 0.5
        },
        opacity: {
          duration: 0.3,
          delay: 0.5
        }
      }
    }
  };

  const handleReadMoreClick = (item: PageItem, index: number) => {
    if (onReadMoreClick) {
      onReadMoreClick(item, index);
    }
  };

  if (isServiceLoading || isBannerLoading) {
    return (
      <div ref={ref} className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#134698] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <Navbar />

      {/* Hero Section */}
      <section ref={ref} className="relative h-[50vh] min-h-[400px] overflow-hidden bg-[#0a0a0a]">
        <m.div
          style={{ y, scale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10" />

          <Image priority fetchPriority="high" loading="eager" decoding="async"
            src={heroImage}
            alt={heroAlt}
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized={API_IS_LOCAL}
          />
        </m.div>

        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <m.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full blur-[100px]"
            style={{ backgroundColor: secondaryColor }}
          />
          <m.div
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.08, 0.12, 0.08],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full blur-[100px]"
            style={{ backgroundColor: primaryColor }}
          />
        </div>

        <m.div
          style={{ opacity, y: textY }}
          className="relative z-20 h-full flex items-center justify-center"
        >
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-5"
            >
              <div className="space-y-3">
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-serif text-white leading-tight tracking-wide">
                    {mainTitle}
                    {highlightedTitle && (
                      <span className="relative inline-block" style={{ color: secondaryColor }}>
                        {" "}{highlightedTitle}
                        <m.svg
                          className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3"
                          viewBox="0 0 200 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          initial="hidden"
                          animate="visible"
                          style={{ color: primaryColor }}
                        >
                          <m.path
                            d="M2 10C60 2, 140 2, 198 10"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            variants={pathVariants}
                          />
                        </m.svg>
                      </span>
                    )}
                  </h1>
                </m.div>

                <m.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm md:text-base text-gray-300 font-light max-w-2xl mx-auto tracking-wide"
                >
                  {subtitle}
                </m.p>
              </div>

              <m.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="h-px w-20 mx-auto mt-5"
                style={{
                  background: `linear-gradient(to right, transparent, ${secondaryColor}, transparent)`
                }}
              />
            </m.div>
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.9 }}
          className="absolute top-1/4 left-12 z-20 hidden lg:block"
        >
          <m.div
            animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full shadow-lg"
            style={{
              backgroundColor: secondaryColor,
              boxShadow: `0 0 20px ${secondaryColor}80`
            }}
          />
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.1 }}
          className="absolute top-1/3 right-20 z-20 hidden lg:block"
        >
          <m.div
            animate={{ y: [0, 15, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 border rounded-full shadow-lg"
            style={{
              borderColor: primaryColor,
              boxShadow: `0 0 20px ${primaryColor}80`
            }}
          />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <m.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 border border-gray-500/40 rounded-full flex items-start justify-center p-1.5 backdrop-blur-sm bg-black/20"
          >
            <m.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-gray-400 rounded-full"
            />
          </m.div>
        </m.div>
      </section>

      {/* GALLERY SECTION */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
            style={{ backgroundColor: primaryColor }} />
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl"
            style={{ backgroundColor: secondaryColor }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="mb-12 md:mb-16 text-left">
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div
                className="h-px w-12"
                style={{ backgroundColor: primaryColor }}
              />
              <span
                className="text-xs md:text-sm uppercase tracking-[0.25em] font-semibold"
                style={{ color: primaryColor }}
              >
                {portfolioTitle}
              </span>
            </m.div>

            <m.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 tracking-tight"
            >
              {finalSectionTitle}{" "}
              <span className="relative inline-block" style={{ color: secondaryColor }}>
                {finalSectionSubtitle}
                <m.svg
                  className="absolute -bottom-2 left-0 w-full h-3"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  style={{ color: `${primaryColor}80` }}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {galleryImages.length === 0 && !isGalleryLoading ? (
               <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg">
                 <p className="text-xl text-gray-500 font-serif">No images available for this section yet.</p>
               </div>
            ) : (
              galleryImages.map((img, index) => {
                const isHovered = hoveredCard === index;

                return (
                  <m.div
                    key={img.id || index}
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: (index % 12) * 0.05, ease: [0.42, 0, 0.58, 1] }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() =>
                      setSelectedImage({
                        src: `${API_URL}${img.url}`,
                        alt: img.altText || img.galleryTitle || portfolioTitle,
                      })
                    }
                    className="group relative cursor-pointer overflow-hidden bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <m.img
                        src={`${API_URL}${img.url}`}
                        alt={img.altText}
                        className="w-full h-full object-cover"
                        animate={{
                          scale: isHovered ? 1.08 : 1,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut"
                        }}
                      />

                      <m.div
                        className="absolute inset-0 bg-black/40 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: isHovered ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-col items-center gap-2">
                           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#134698] scale-0 group-hover:scale-100 transition-transform duration-500">
                             <div className="w-5 h-5 border-2 border-[#134698] rounded-full flex items-center justify-center">
                                <div className="w-1 h-1 bg-[#134698] rounded-full" />
                             </div>
                           </div>
                           <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                             Enlarge
                           </span>
                        </div>
                      </m.div>

                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-[10px] text-white font-bold truncate uppercase tracking-wider">{img.galleryTitle}</p>
                      </div>
                    </div>
                  </m.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Lightbox / Full Image View */}
      {selectedImage && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedImage(null)}
        >
          <m.div className="relative max-w-full max-h-full">
<Image
              loading="lazy"
              decoding="async"
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1600}
              height={1200}
              className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
              unoptimized={API_IS_LOCAL}
            />
            <button className="absolute top-4 right-4 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all">
                <X size={24} />
            </button>
          </m.div>
        </m.div>
      )}

      {/* PORTFOLIO GALLERY SECTION */}
      {portfolioGalleryImages.length > 0 && (
        <section className="py-16 md:py-24 bg-[#0a0a0a] text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-4">
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-secondary"
                >
                  <div className="w-8 h-px bg-secondary" />
                  <span className="text-xs uppercase tracking-[0.3em] font-bold">Project Showcase</span>
                </m.div>
                <m.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-serif tracking-tight"
                >
                  Portfolio <span className="text-gray-400 italic">Gallery</span>
                </m.h2>
              </div>
              <m.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="max-w-md text-gray-400 font-light text-sm md:text-base leading-relaxed"
              >
                Explore our curated selection of {category} projects. Each image represents our commitment to excellence and high-end design.
              </m.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {portfolioGalleryImages.map((img, idx) => (
                <m.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group aspect-[4/5] overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt={img.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                    unoptimized={API_IS_LOCAL}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <p className="text-xs uppercase tracking-widest font-bold text-white border-b border-secondary pb-2">{img.title}</p>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default PageTemplate;
