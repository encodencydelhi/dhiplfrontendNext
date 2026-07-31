"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { m } from "framer-motion";
import { useSeo } from "@/context/SeoContext";
import { Home, ArrowRight } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";

// This 404 page is reachable from the root layout's not-found boundary on
// every route, which was pulling its ~650KB Lottie player into the shared JS
// loaded on EVERY page. Load it only when this component actually mounts.
const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((m) => m.DotLottieReact),
  { ssr: false }
);

const SectionPlaceholder = () => (
  <div className="min-h-[300px] bg-slate-50 animate-pulse" aria-hidden="true" />
);

const NotFoundContent = () => {
  const { setCustomSeo } = useSeo();

  useEffect(() => {
    setCustomSeo({
      metaTitle: "404 - Page Not Found | Design House India",
      metaDescription: "Oops! The page you're looking for isn't here. Return home to explore Design House's premium architectural and interior design services.",
      ogTitle: "404 - Page Not Found | Design House India",
      ogDescription: "Lost in design? Return home to see our latest architectural and interior projects.",
    });

    return () => setCustomSeo(null);
  }, [setCustomSeo]);

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#DE802B]/20">
      <Suspense fallback={null}>
        <Topbar />
      </Suspense>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <main className="flex-1 flex items-center justify-center p-6 md:p-12 mt-16 md:mt-24">
        <div className="max-w-2xl w-full text-center">
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 relative"
          >
            {/* Main Lottie Animation */}
            <div className="w-full max-w-[500px] mx-auto aspect-square flex items-center justify-center">
              <DotLottieReact
                src="https://lottie.host/1f335721-f65c-47d0-94f8-a44867db26ab/KD2IORkpGn.lottie"
                loop
                autoplay
                className="w-full h-full"
              />
            </div>

            {/* Error Code Subtle Label */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-neutral-200">Error Code: 404</span>
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-[#134698] tracking-tight">
              Oops! Page Not Found
            </h1>
            <p className="text-neutral-500 text-base md:text-xl max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find the page you were looking for. It might have been moved or deleted.
            </p>

            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#134698] text-white rounded-full font-bold hover:bg-[#DE802B] transition-all duration-500 shadow-xl shadow-blue-900/10 group"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Return to Home
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </m.div>
        </div>
      </main>

      <Suspense fallback={<SectionPlaceholder />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default NotFoundContent;
