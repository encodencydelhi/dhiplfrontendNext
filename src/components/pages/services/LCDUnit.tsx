"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import DynamicHero from "@/components/layout/DynamicHero";
import RecentWorkSection from "@/components/sections/RecentWorkSection";
import Location from "@/components/sections/Location";
import ServiceContentSection from "@/components/sections/ServiceContentSection";
import useServiceDetail from "@/hooks/useServiceDetail";

const LCDUnitPage = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { data, portfolioGalleryImages } = useServiceDetail("Modular LCD Unit");

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Topbar />
      <Navbar />
      <DynamicHero
        pageName="Modular LCD Unit"
        fallbackImage="https://images.unsplash.com/photo-1593359677759-543733f79aa1?w=1920&q=80"
        overrideImage={data?.bgImage}
        overrideTitle={data?.bgTitle}
        overrideHighlight={data?.bgHighlightTitle}
      />
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <ServiceContentSection serviceName="Modular LCD Unit" />
        {portfolioGalleryImages && portfolioGalleryImages.length > 0 && (
          <RecentWorkSection
            galleryItems={portfolioGalleryImages}
            onImageClick={setSelectedImage}
            viewAllLink="/portfolio/furniture/lcd-unit-images"
          />
        )}
        <Location category="LCD Units" />
      </div>
      <Footer />
      <AnimatePresence>
        {selectedImage && (
          <m.div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)}>
            <button className="absolute top-4 right-4 text-white hover:text-gray-300 z-10" onClick={() => setSelectedImage(null)}><X className="w-8 h-8" /></button>
            <m.div className="relative max-w-6xl w-full" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <img src={selectedImage.url} alt={selectedImage.title} className="w-full h-auto rounded-lg shadow-2xl" />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LCDUnitPage;
