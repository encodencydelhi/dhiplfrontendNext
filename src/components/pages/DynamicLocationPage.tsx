"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { CheckCircle, X, MapPin } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import DynamicHero from "@/components/layout/DynamicHero";
import Location from "@/components/sections/Location";
import { api, API_URL } from "@/lib/api";
import { useSeo } from "@/context/SeoContext";
import { cleanDescription } from "@/lib/utils";

const DynamicLocationPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();
    const [pageData, setPageData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const { setCustomSeo } = useSeo();

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                setIsLoading(true);
                const normalizedSlug = String(slug).trim().toLowerCase().replace(/\s+/g, "-");
                const response = await api.get(`/api/custom-pages/slug/${normalizedSlug}`);
                if (response.data.success) {
                    setPageData(response.data.data);
                } else {
                    router.push("/404");
                }
            } catch (error) {
                console.error("Error fetching page data:", error);
                router.push("/404");
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchPageData();
            window.scrollTo(0, 0);
        }

        return () => {
            setCustomSeo(null);
        };
    }, [slug, router, setCustomSeo]);

    useEffect(() => {
        if (pageData?.seo) {
            setCustomSeo(pageData.seo);
        }
    }, [pageData, setCustomSeo]);

    const pathVariants: any = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.5 },
                opacity: { duration: 0.3, delay: 0.5 },
            },
        },
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#134698] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!pageData) return null;

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <Topbar />
            <Navbar />

            <DynamicHero
                pageName={pageData.title}
                fallbackImage={`${API_URL}${pageData.mainImage.url.startsWith('/') ? '' : '/'}${pageData.mainImage.url}`}
                fallbackAltText={pageData.mainImage.altTag}
            />

            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
                {/* Header: Full Width Title & Badges */}
                <m.div
                    initial={{ y: -20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-6 border-b border-gray-100 pb-4"
                >
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-3 leading-tight text-gray-900">
                        {pageData.highlightedTitle}{" "}
                        <span className="text-[#DE802B] relative inline-block">
                            {pageData.location}
                            <m.svg
                                className="absolute -bottom-1 left-0 w-full h-3 text-[#134698]/20"
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
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    variants={pathVariants}
                                />
                            </m.svg>
                        </span>
                    </h2>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
                            <MapPin className="w-3.5 h-3.5 text-[#134698]" />
                            <span className="uppercase tracking-widest text-[10px] font-bold text-[#134698]">{pageData.location}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 shadow-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-[#DE802B]" />
                            <span className="uppercase tracking-widest text-[10px] font-bold text-[#DE802B]">{pageData.serviceCategory}</span>
                        </div>
                    </div>
                </m.div>

                {/* Main Content Area: Text flowing around the Gallery */}
                <div className="block clearfix overflow-hidden">
                    {/* Gallery Container - Floated Right on LG screens */}
                    <div className="lg:float-right lg:ml-6 lg:mb-4 mb-6 w-full lg:w-[480px] xl:w-[540px] relative">
                        <div className="grid grid-cols-2 gap-4">
                            {pageData.galleryImages.slice(0, 4).map((img: any, idx: number) => (
                                <m.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-xl border border-gray-100"
                                    onClick={() => setSelectedImage({ ...img, url: `${API_URL}${img.url.startsWith('/') ? '' : '/'}${img.url}` })}
                                >
                                    <img
                                        src={`${API_URL}${img.url.startsWith('/') ? '' : '/'}${img.url}`}
                                        alt={img.altTag || `Gallery ${idx + 1}`}
                                        className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/90 p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                            <CheckCircle className="w-6 h-6 text-[#134698]" />
                                        </div>
                                    </div>
                                </m.div>
                            ))}
                        </div>
                        {/* Decorative blur elements for the gallery */}
                        <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-[#DE802B]/10 rounded-full blur-3xl"></div>
                        <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#134698]/10 rounded-full blur-3xl"></div>
                    </div>

                    {/* Text Flow Container */}
                    <m.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        {/* Short Description: Featured Lead Text */}
                        <div className="relative mb-3 pt-1">
                            <div className="absolute left-0 top-0 w-1.5 h-10 bg-[#DE802B] rounded-full hidden lg:block"></div>
                            <p className="text-[#134698] font-medium text-base md:text-lg italic leading-relaxed lg:pl-5 max-w-4xl text-justify">
                                {cleanDescription(pageData.shortDescription)}
                            </p>
                        </div>

                        {/* Long Description: Wraps under the Gallery */}
                        <div
                            className="rich-text-content text-gray-700 leading-relaxed text-[14px] lg:text-[16px] text-justify"
                            dangerouslySetInnerHTML={{ __html: cleanDescription(pageData.postDescription) }}
                        />
                    </m.div>

                    <style>{`
                        .clearfix::after {
                            content: "";
                            clear: both;
                            display: table;
                        }
                        .rich-text-content {
                            color: #333333 !important;
                            text-align: justify !important;
                        }
                        .rich-text-content a {
                            color: #2563eb;
                            text-decoration: underline;
                            font-weight: 600;
                        }
                        .rich-text-content a:hover {
                            color: #1e40af;
                        }
                        .rich-text-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.75rem; width: 100%; text-align: justify !important; }
                        .rich-text-content ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.75rem; width: 100%; text-align: justify !important; }
                        .rich-text-content p { margin-bottom: 0.75rem; text-align: justify !important; color: #333333 !important; }
                        .rich-text-content h1, .rich-text-content h2, .rich-text-content h3 { 
                            font-weight: 700; 
                            margin-top: 1.25rem; 
                            margin-bottom: 0.5rem; 
                            color: #111827;
                            line-height: 1.2;
                            clear: left;
                        }
                        .rich-text-content h1 { font-size: 1.5rem; }
                        .rich-text-content h2 { font-size: 1.35rem; }
                        .rich-text-content h3 { font-size: 1.25rem; }
                        .rich-text-content img {
                            max-width: 100%;
                            height: auto;
                            border-radius: 0.75rem;
                            margin: 1.25rem 0;
                            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                        }
                        @media (max-width: 1023px) {
                            .rich-text-content h1 { font-size: 1.35rem; }
                            .rich-text-content h2 { font-size: 1.25rem; }
                        }
                    `}</style>
                </div>

                <div className="mt-6">
                    <Location category={pageData.serviceCategory} />
                </div>
            </div>

            <Footer />

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <m.div
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <m.div
                            className="relative max-w-5xl w-full"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.altTag}
                                className="w-full h-auto rounded-lg shadow-2xl"
                            />
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DynamicLocationPage;
