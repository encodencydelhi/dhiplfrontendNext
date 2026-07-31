"use client";

import { useRef, useState, lazy, Suspense } from 'react';
import { m, useInView, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from 'lucide-react';
const MotionSection = lazy(() => import('../MotionSection'));

const galleryImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200',
    title: 'Luxury Living Room',
    category: 'Living Space',
    delay: 0.1
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800',
    title: 'Modern Kitchen',
    category: 'Kitchen',
    delay: 0.2
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=800',
    title: 'Grand Bathroom',
    category: 'Bathroom',
    delay: 0.3
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=800',
    title: 'Elegant Bedroom',
    category: 'Bedroom',
    delay: 0.4
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=800',
    title: 'Outdoor Patio',
    category: 'Outdoor',
    delay: 0.5
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=800',
    title: 'Contemporary Hall',
    category: 'Hallway',
    delay: 0.6
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=800',
    title: 'Designer Kitchen',
    category: 'Kitchen',
    delay: 0.7
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
    title: 'Spacious Living',
    category: 'Living Space',
    delay: 0.8
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800',
    title: 'Cozy Study',
    category: 'Study Room',
    delay: 0.9
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800',
    title: 'Modern Dining',
    category: 'Dining Room',
    delay: 1.0
  },
];

const Gallery = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const cardVariants: any = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95,
      filter: "blur(10px)"
    },
    visible: (delay: number) => ({ 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 0.8,
        delay: delay || 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const renderGalleryCard = (item, className, idx = 0) => (
    <Suspense fallback={<div className={`bg-gray-100 animate-pulse rounded-2xl ${className}`} />}>
      <MotionSection
        key={item.id}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        custom={(idx % 3) * 0.15 + (Math.floor(idx / 3) * 0.1)}
        onClick={() => setSelectedImage(item)}
        className={`group relative ${className} rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500`}
        role="button"
        aria-label={`View ${item.title} in full screen`}
        tabIndex={0}
      >
        <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />
        </div>

        {/* Zoom Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <ZoomIn className="text-slate-900" size={28} />
          </div>
        </div>

        <div className="absolute top-4 lg:top-5 right-4 lg:right-5 z-10">
          <div className="px-3 lg:px-4 py-1.5 lg:py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
            <span className="text-xs lg:text-sm font-semibold text-slate-900">{item.category}</span>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <h3 className="text-lg lg:text-2xl font-bold text-white">
            {item.title}
          </h3>
        </div>
      </MotionSection>
    </Suspense>
  );

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          
          <Suspense fallback={<div className="h-24 w-full bg-gray-50" />}>
            <MotionSection
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-slate-400"></div>
                <span className="text-xs text-slate-600 tracking-[0.3em] uppercase font-medium px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-slate-200">
                  Gallery
                </span>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-slate-400"></div>
              </div>

                 <h2
                className="text-3xl md:text-4xl lg:text-4xl font-serif mb-5 leading-snug text-gray-900"
              >
                Our  
                <span className="text-[#DE802B] font-semibold"> Showcase</span>
              </h2>
            </MotionSection>
          </Suspense>

          <div ref={sectionRef} className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {renderGalleryCard(galleryImages[0], 'col-span-2 lg:col-span-1 lg:row-span-2 aspect-[1/1] lg:aspect-auto', 0)}
            {galleryImages.slice(1, 5).map((item, i) => renderGalleryCard(item, 'aspect-square', i + 1))}
            {renderGalleryCard(galleryImages[5], 'col-span-2 aspect-[2/1]', 5)}
            {galleryImages.slice(6).map((item, i) => renderGalleryCard(item, 'aspect-square', i + 6))}
          </div>

        </div>
      </section>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <m.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-[100]"
              aria-label="Close image gallery"
            >
              <X className="text-white" size={24} />
            </m.button>

            {/* Image Container */}
            <m.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.34, 1.56, 0.64, 1],
                scale: { type: "spring", stiffness: 300, damping: 25 }
              }}
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl mx-auto"
              />

              {/* Image Info Overlay */}
              <m.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-md mx-auto mt-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20"
              >
                <h3 className="text-xl font-bold text-white text-center">{selectedImage.title}</h3>
                <p className="text-white/70 text-sm text-center uppercase tracking-widest mt-1">{selectedImage.category}</p>
              </m.div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;