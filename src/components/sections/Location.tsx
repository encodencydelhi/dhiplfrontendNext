"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocations } from "@/context/LocationsContext";

interface LocationProps {
    category?: string;
}

// Backend does a singular/plural-insensitive match on serviceCategory
// (strips a trailing "s", case-insensitive) — mirrored here so filtering
// the already-fetched full list client-side matches what the old
// `?category=X` API call used to return.
const normalize = (value: string) => value.trim().toLowerCase().replace(/s$/, "");

const Location: React.FC<LocationProps> = ({ category }) => {
    const locations = useLocations();
    const pathname = usePathname();
    const currentPath = pathname.substring(1); // Remove leading slash

    const filteredLocations = locations.filter((loc) => {
        if (loc.permalink === currentPath) return false;
        if (category && normalize(loc.serviceCategory || "") !== normalize(category)) return false;
        return true;
    });

    if (filteredLocations.length === 0) return null;

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-wrap gap-4">
                    {filteredLocations.map((loc, index) => (
                        <Link
                            key={loc._id || index}
                            href={`/${String(loc.permalink).toLowerCase().replace(/\s+/g, "-")}`}
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
