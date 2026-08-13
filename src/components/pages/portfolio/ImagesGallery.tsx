"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { api, API_URL } from "@/lib/api";

interface ImageItem {
  id: number;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageGalleryProps {
  title?: string;
  subtitle?: string;
  images?: ImageItem[];
  heroImage?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  title: propTitle,
  subtitle: propSubtitle,
  images: propImages,
  heroImage: propHeroImage
}) => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [images, setImages] = useState<ImageItem[]>(propImages || []);
  const [title, setTitle] = useState(propTitle || "Image Gallery");
  const [bannerHighlight, setBannerHighlight] = useState("");
  const [subtitle, setSubtitle] = useState(propSubtitle || "Crafting beautiful interior experiences");
  const [heroImage, setHeroImage] = useState(propHeroImage);
  const [loading, setLoading] = useState(!!slug);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const imagesPerPage = 12;

  const ref = useRef(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  // ... existing scroll logic ...
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);

  useEffect(() => {
    const fetchGalleryData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const normalizedSlug = String(slug).trim().toLowerCase().replace(/\s+/g, "-");
        const response = await api.get(`/api/portfolio-gallery/${normalizedSlug}`);

        if (response.data.success) {
          const galleryData = response.data.data;

          const cleanSubtitle = (text: string) => {
            if (!text) return text;
            return text.replace(/<!--StartFragment-->|<!--EndFragment-->/g, '').trim();
          };

          setTitle(galleryData.bannerTitle || galleryData.title);
          setBannerHighlight(galleryData.bannerHighlightText || "");
          setSubtitle(cleanSubtitle(galleryData.description || galleryData.highlightText || "Gallery"));
          setHeroImage(`${API_URL}${galleryData.heroImage.startsWith('/') ? '' : '/'}${galleryData.heroImage}`);

          const mappedImages = galleryData.galleryImages.map((img: any, index: number) => ({
            id: index + 1,
            src: `${API_URL}${img.image.startsWith('/') ? '' : '/'}${img.image}`,
            alt: img.altText || galleryData.title,
            title: `${galleryData.title} - ${index + 1}`,
            description: img.altText || "Portfolio Image"
          }));

          setImages(mappedImages);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, [slug]);

  const pathVariants: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.5 },
        opacity: { duration: 0.3, delay: 0.5 }
      }
    }
  };

  const primaryColor = "#134698";
  const secondaryColor = "#DE802B";

  // Fallback images if no images are loaded and no slug is present
  const defaultImages: ImageItem[] = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80",
      alt: "Interior Design",
      title: "Modern Interior",
      description: "Elegant interior with modern aesthetics and sophisticated design elements"
    },
  ];

  const displayImages = images.length > 0 ? images : (slug ? [] : defaultImages);
  const displayHeroImage = heroImage || (displayImages.length > 0 ? displayImages[0].src : "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80");

  // Pagination Logic
  const totalPages = Math.ceil(displayImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const paginatedImages = displayImages.slice(startIndex, startIndex + imagesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div ref={ref} className="min-h-screen flex items-center justify-center bg-white">
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

          <img
            src={displayHeroImage}
            alt={title}
            width="1920"
            height="400"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
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
                    {title} <span className="relative inline-block" style={{ color: secondaryColor }}>{bannerHighlight}</span>
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
      </section>

      {/* GALLERY SECTION */}
      <section ref={galleryRef} className="py-12 md:py-16 bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
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
                OUR IMAGE COLLECTION
              </span>
            </m.div>

            <m.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 tracking-tight"
            >
              Explore Our{" "}
              <span className="relative inline-block" style={{ color: secondaryColor }}>
                Visual Portfolio
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

          {/* Gallery Grid */}
          {paginatedImages.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-xl text-gray-500 font-serif">No images available for this gallery yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {paginatedImages.map((image, index) => {
                  const isHovered = hoveredCard === index;

                  return (
                    <m.div
                      key={image.id}
                      initial={{ opacity: 0, y: 100 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: (index % imagesPerPage) * 0.05, ease: [0.42, 0, 0.58, 1] }}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => setSelectedImage(image.src)}
                      className="group relative cursor-pointer overflow-hidden bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-500"
                    >
                      <div className="relative h-[220px] md:h-[240px] overflow-hidden">
                        <m.img
                          src={image.src}
                          alt={image.alt}
                          width="300"
                          height="240"
                          className="w-full h-full object-cover"
                          loading="lazy"
                          animate={{
                            scale: isHovered ? 1.05 : 1,
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
                               <ArrowLeft className="w-5 h-5 rotate-180" />
                             </div>
                             <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                               View Image
                             </span>
                          </div>
                        </m.div>

                        <m.div
                          className="absolute bottom-0 left-0 right-0 h-[2px]"
                          style={{
                            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                          }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: isHovered ? 1 : 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </m.div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 rounded-full border border-gray-200 text-gray-400 hover:border-[#134698] hover:text-[#134698] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-12 h-12 rounded-full text-sm font-bold transition-all ${
                        currentPage === page
                          ? "bg-[#134698] text-white shadow-lg"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-full border border-gray-200 text-gray-400 hover:border-[#134698] hover:text-[#134698] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowLeft size={20} className="rotate-180" />
                  </button>
                </div>
              )}
            </>
          )}


          {/* Back Button */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white rounded-sm hover:shadow-lg transition-all duration-300"
              style={{
                backgroundColor: secondaryColor,
                boxShadow: '0 4px 14px rgba(222, 128, 43, 0.3)'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </button>
          </m.div>
        </div>
      </section>

      {/* Lightbox / Full Image View */}
      {selectedImage && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedImage(null)}
        >
          <m.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-full max-h-full overflow-hidden"
          >
            <img
              src={selectedImage}
              alt="Full View"
              className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm border-2 border-white/10"
            />
            <button
              className="absolute -top-12 right-0 text-white flex items-center gap-2 hover:text-[#DE802B] transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <span className="text-xs font-bold tracking-widest uppercase">Close</span>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                <X className="w-4 h-4" />
              </div>
            </button>
          </m.div>
        </m.div>
      )}

      <Footer />
    </div>
  );
};

export default ImageGallery;
