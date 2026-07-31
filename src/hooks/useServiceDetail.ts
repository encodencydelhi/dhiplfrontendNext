"use client";

import { useState, useEffect } from "react";
import { api, API_URL } from "@/lib/api";

export interface GalleryImage {
    url: string;
    altText: string;
}

export interface ServiceDetail {
    serviceName: string;
    bgImage: string;
    bgAltText: string;
    bgTitle: string;
    bgHighlightTitle: string;
    title: string;
    highlightText: string;
    description: string;
    galleryImages: GalleryImage[];
    portfolioGalleryImages?: GalleryImage[];
    seo?: {
        metaTitle?: string;
        metaKeywords?: string;
        metaDescription?: string;
        openGraphTags?: string;
        schemaMarkup?: string;
        canonicalTag?: string;
        ogImage?: string;
        ogImageAltText?: string;
    };
}

const useServiceDetail = (serviceName: string) => {
    const [data, setData] = useState<ServiceDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!serviceName) {
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const response = await api.get(
                    `/api/service-details/${encodeURIComponent(serviceName)}`
                );
                if (response.data.success && response.data.data) {
                    setData(response.data.data);
                }
            } catch {
                // No data found for this service, silently fail — fallback content will show
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [serviceName]);

    // Map service-specific gallery images (from Admin -> Create Service)
    const serviceGalleryImages = (data?.galleryImages || [])
        .filter((img) => img.url)
        .map((img, i) => ({
            id: i + 1,
            title: img.altText || `Service Image ${i + 1}`,
            url: img.url.startsWith("http") ? img.url : `${API_URL}${img.url.startsWith("/") ? "" : "/"}${img.url}`,
            category: img.altText || "",
        }));

    // Map broader portfolio gallery images (from Admin -> Portfolio)
    const portfolioGalleryImages = (data?.portfolioGalleryImages || [])
        .filter((img) => img.url)
        .map((img, i) => ({
            id: i + 1,
            title: img.altText || `Portfolio Image ${i + 1}`,
            url: img.url.startsWith("http") ? img.url : `${API_URL}${img.url.startsWith("/") ? "" : "/"}${img.url}`,
            category: img.altText || "",
        }));

    return {
        data,
        isLoading,
        serviceGalleryImages,
        portfolioGalleryImages,
    };
};

export default useServiceDetail;