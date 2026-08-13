"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { api, API_URL, API_IS_LOCAL } from "@/lib/api";
import Image from "next/image";

interface HeroData {
    pageName: string;
    backgroundImage: string;
    imageAltText?: string;
    title?: string;
    highlightedText?: string;
    shortDescription?: string;
    status: string;
}

interface DynamicHeroProps {
    pageName: string;
    fallbackImage?: string;
    fallbackAltText?: string;
    overrideTitle?: string;
    overrideImage?: string;
    overrideHighlight?: string;
    overrideDescription?: string;
}

const DynamicHero = ({
    pageName,
    fallbackImage,
    fallbackAltText,
    overrideTitle,
    overrideImage,
    overrideHighlight,
    overrideDescription
}: DynamicHeroProps) => {
    const ref = useRef(null);
    const [data, setData] = useState<HeroData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/api/hero-images/page/${pageName}`);
                if (response.data.success && response.data.data) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error(`Error fetching hero data for ${pageName}:`, error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHeroData();
    }, [pageName]);

    const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 1.5, ease: "easeInOut" as any, delay: 0.5 },
                opacity: { duration: 0.3, delay: 0.5 }
            }
        }
    };

    if (isLoading) {
        return (
            <section ref={ref} className="relative h-[50vh] min-h-[400px] bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#DE802B]/20 border-t-[#DE802B] rounded-full animate-spin"></div>
            </section>
        );
    }

    // If no data found, we could either hide or show fallback
    if (!data && !fallbackImage) return <div ref={ref} />;

    const bgImage = overrideImage
        ? (overrideImage.startsWith('http') ? overrideImage : `${API_URL}${overrideImage.startsWith('/') ? '' : '/'}${overrideImage}`)
        : (data?.backgroundImage
            ? `${API_URL}${data.backgroundImage.startsWith('/') ? '' : '/'}${data.backgroundImage}`
            : fallbackImage);

    const displayTitle = overrideTitle || data?.title || pageName;
    const displayHighlight = overrideHighlight || data?.highlightedText;
    const displayDescription = overrideDescription !== undefined ? overrideDescription : data?.shortDescription;

    return (
        <section ref={ref} className="relative h-[50vh] min-h-[400px] overflow-hidden bg-[#0a0a0a]">
            <m.div style={{ y, scale }} className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10" />
                <Image priority fetchPriority="high" decoding="async"
                    src={bgImage}
                    alt={data?.imageAltText || fallbackAltText || displayTitle}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    unoptimized={API_IS_LOCAL}
                />
            </m.div>

            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                <m.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#DE802B] rounded-full blur-[100px]"
                />
                <m.div
                    animate={{ scale: [1.3, 1, 1.3], opacity: [0.08, 0.12, 0.08] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#134698] rounded-full blur-[100px]"
                />
            </div>

            <m.div style={{ opacity, y: textY }} className="relative z-20 h-full flex items-center justify-center">
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
                                    {displayTitle}{" "}
                                    {displayHighlight && (
                                        <span className="relative inline-block">
                                            <span className="text-[#DE802B] ml-2">{displayHighlight}</span>
                                            <m.svg
                                                className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-[#134698]"
                                                viewBox="0 0 200 12"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                initial="hidden"
                                                animate="visible"
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

                            {displayDescription && (
                                <m.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-sm md:text-base text-gray-300 font-light max-w-2xl mx-auto tracking-wide"
                                >
                                    {displayDescription}
                                </m.p>
                            )}
                        </div>

                        <m.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className="h-px w-20 bg-gradient-to-r from-transparent via-[#DE802B] to-transparent mx-auto mt-5"
                        />
                    </m.div>
                </div>
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
    );
};

export default DynamicHero;