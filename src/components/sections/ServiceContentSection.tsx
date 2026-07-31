"use client";

import { m } from "framer-motion";
import useServiceDetail from "@/hooks/useServiceDetail";
import { useSeo } from "@/context/SeoContext";
import { useEffect } from "react";
import { cleanDescription } from "@/lib/utils";

interface Props {
    serviceName: string;
}

const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: 1.5, ease: "easeInOut" as const, delay: 0.5 },
            opacity: { duration: 0.3, delay: 0.5 },
        },
    },
};

const ServiceContentSection = ({
    serviceName
}: Props) => {
    const { data, serviceGalleryImages } = useServiceDetail(serviceName);
    const { setCustomSeo } = useSeo();

    useEffect(() => {
        if (data) {
            // Extract SEO data from the 'seo' object or fallback to top-level fields
            const seoData = data.seo || {
                metaTitle: (data as any).metaTitle,
                metaKeywords: (data as any).metaKeywords,
                metaDescription: (data as any).metaDescription,
                schemaMarkup: (data as any).schemaMarkup,
                openGraphTags: (data as any).openGraphTags,
                canonicalTag: (data as any).canonicalTag,
                ogTitle: (data as any).ogTitle,
                ogDescription: (data as any).ogDescription,
                ogImage: (data as any).ogImage
            };

            // Inject service-specific SEO data into the global SEO context
            setCustomSeo({
                ...seoData,
                title: data.title, // Fallback title
                bgImage: data.bgImage,
                bgTitle: data.bgTitle
            });
        }
        return () => setCustomSeo(null); // Cleanup on unmount
    }, [data, setCustomSeo]);

    if (!data) return null;

    const title = data.title;
    const highlight = data.highlightText;

    return (
        <div className="block mb-16">
            {/* Images Side — Moved before text for correct floating behavior */}
            {serviceGalleryImages.length > 0 && (
                <div className="lg:float-right lg:w-[45%] w-full lg:ml-10 lg:mb-8 mb-10 relative">
                    <div className="relative z-10">
                        <div className="grid grid-cols-2 gap-4">
                            {serviceGalleryImages.slice(0, 4).map((img, index) => (
                                <m.div
                                    key={img.id}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: (100 + index * 100) / 1000, ease: [0.42, 0, 0.58, 1] }}
                                    className="overflow-hidden border-2 border-gray-200 hover:border-[#134698] transition-all duration-300 group"
                                >
                                    <img
                                        src={img.url}
                                        alt={img.title}
                                        className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </m.div>
                            ))}
                        </div>
                    </div>
                    <m.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="absolute -bottom-3 -right-3 w-40 h-40 bg-[#000080]/5 -z-0"
                    />
                </div>
            )}

            {/* Content Side */}
            <m.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="w-full"
            >
                {/* Title */}
                <m.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-3xl md:text-4xl lg:text-4xl font-serif mb-6 leading-tight text-black"
                >
                    <span className="block mb-2">{title}</span>
                    {highlight && (
                        <span className="text-[#DE802B] relative inline-block">
                            {highlight}
                            <m.svg
                                className="absolute -bottom-2 left-0 w-full h-3 text-[#134698]/30"
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
                    )}
                </m.h2>

                {/* Description */}
                <div className="description-container">
                    <style>{`
                        .service-description-rich {
                            color: #333333 !important;
                            text-align: justify !important;
                            hyphens: auto;
                        }
                        .service-description-rich p {
                            margin-bottom: 0.75rem; /* Reduced margin */
                            line-height: 1.6;
                            text-align: justify !important;
                            color: #333333 !important;
                        }
                        .service-description-rich strong {
                            font-weight: 800;
                            color: #333333 !important;
                        }
                        .service-description-rich em {
                            font-style: italic;
                            color: #333333 !important;
                        }
                        .service-description-rich ul {
                            list-style-type: disc !important;
                            padding-left: 1.5rem !important;
                            margin-bottom: 1.25rem !important;
                        }
                        .service-description-rich ol {
                            list-style-type: decimal !important;
                            padding-left: 1.5rem !important;
                            margin-bottom: 1.25rem !important;
                        }
                        .service-description-rich p, 
                        .service-description-rich li, 
                        .service-description-rich span,
                        .service-description-rich strong,
                        .service-description-rich font {
                            color: #333333 !important;
                            text-align: justify !important;
                            line-height: 1.6;
                        }
                        .service-description-rich ul, .service-description-rich ol {
                            margin-top: 1rem !important;
                            margin-bottom: 1.5rem !important;
                            list-style-type: none !important;
                            padding-left: 0 !important;
                        }
                        .service-description-rich li {
                            margin-bottom: 0.6rem !important;
                            padding-left: 0 !important;
                            position: relative;
                            padding-left: 2rem !important;
                            text-align: justify !important;
                            color: #333333 !important;
                        }
                        .service-description-rich ul li::before {
                            content: '✓';
                            position: absolute;
                            left: 0;
                            color: #134698 !important;
                            font-weight: bold;
                        }
                        .service-description-rich strong {
                            font-weight: 600 !important;
                            color: #333333 !important;
                        }
                        .service-description-rich a {
                            color: #2563eb !important;
                            text-decoration: underline !important;
                            font-weight: 500;
                        }
                        .service-description-rich a:hover {
                            color: #1d4ed8 !important;
                        }
                    `}</style>
                    <m.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.1, ease: [0.42, 0, 0.58, 1] }}
                        className="service-description-rich text-sm md:text-base mb-6 prose prose-slate max-w-none
                            prose-p:text-[#333333] prose-strong:text-[#333333] prose-li:text-[#333333] prose-headings:text-black
                            prose-ul:list-none prose-ol:list-decimal"
                        dangerouslySetInnerHTML={{ __html: cleanDescription(data.description) }}
                    />
                </div>
            </m.div>
        </div>
    );
};

export default ServiceContentSection;