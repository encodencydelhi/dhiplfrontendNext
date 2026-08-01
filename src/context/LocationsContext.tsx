"use client";

import React, { createContext, useContext, ReactNode } from "react";

export interface LocationEntry {
    _id?: string;
    title?: string;
    permalink: string;
    location?: string;
    serviceCategory?: string;
}

const LocationsContext = createContext<LocationEntry[] | undefined>(undefined);

// Locations are fetched once, server-side, in the root layout and handed
// down through context so every page's Location widget renders its links
// straight into the initial HTML — crawlers that don't run JS/simulate
// interaction (xml-sitemaps.com, most SEO tools) need them there to ever
// discover the /[slug] city pages, since they're the only internal links
// pointing at those pages.
export const LocationsProvider: React.FC<{ children: ReactNode; locations: LocationEntry[] }> = ({
    children,
    locations,
}) => {
    return <LocationsContext.Provider value={locations}>{children}</LocationsContext.Provider>;
};

export const useLocations = (): LocationEntry[] => {
    const context = useContext(LocationsContext);
    if (context === undefined) {
        throw new Error("useLocations must be used within a LocationsProvider");
    }
    return context;
};
