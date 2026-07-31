"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SeoContextType {
    customSeo: any | null;
    setCustomSeo: (seo: any | null) => void;
}

const SeoContext = createContext<SeoContextType | undefined>(undefined);

export const SeoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [customSeo, setCustomSeo] = useState<any | null>(null);

    return (
        <SeoContext.Provider value={{ customSeo, setCustomSeo }}>
            {children}
        </SeoContext.Provider>
    );
};

export const useSeo = () => {
    const context = useContext(SeoContext);
    if (context === undefined) {
        throw new Error('useSeo must be used within a SeoProvider');
    }
    return context;
};