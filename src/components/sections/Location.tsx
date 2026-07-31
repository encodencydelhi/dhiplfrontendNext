"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

interface LocationProps {
    category?: string;
}

const Location: React.FC<LocationProps> = ({ category }) => {
    const [locations, setLocations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const currentPath = pathname.substring(1); // Remove leading slash

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const url = category
                    ? `/api/custom-pages/locations?category=${encodeURIComponent(category)}`
                    : "/api/custom-pages/locations";
                const response = await api.get(url);
                if (response.data.success) {
                    setLocations(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLocations();
    }, [category]);

    if (isLoading) return null;

    // Filter out the current city/location from the list
    const filteredLocations = locations.filter(loc => loc.permalink !== currentPath);

    if (filteredLocations.length === 0) return null;

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-wrap gap-4">
                    {filteredLocations.map((loc: any, index: number) => (
                        <Link
                            key={index}
                            href={`/${loc.permalink}`}
                            className="group px-3 py-1.5 border border-gray-300 text-xs text-gray-700 hover:bg-[#DE802B] hover:text-white transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                        >
                            <span className="relative">
                                {loc.location || loc.title}
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Location;