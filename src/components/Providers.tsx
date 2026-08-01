"use client";

import { ReactNode, Suspense, useEffect, useState } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import SmoothScroll from "@/components/SmoothScroll";
import { SeoProvider } from "@/context/SeoContext";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import SocialSidebar from "@/components/ui/SocialSidebar";
import BookingFloat from "@/components/layout/BookingFloat";

const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [showFloating, setShowFloating] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const handleIdle = () => {
      if (!showFloating) setShowFloating(true);
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(handleIdle, { timeout: 3000 });
    } else {
      setTimeout(handleIdle, 3000);
    }
  }, [showFloating]);

  return (
    <LazyMotion features={domAnimation} strict>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ToastContainer position="top-right" autoClose={4000} newestOnTop />
          <SeoProvider>
            <SmoothScroll stopped={isBookingOpen}>
              {children}

              {showFloating && (
                <Suspense fallback={null}>
                  <WhatsAppFloat />
                  <SocialSidebar />
                  <BookingFloat open={isBookingOpen} onOpenChange={setIsBookingOpen} />
                </Suspense>
              )}
            </SmoothScroll>
          </SeoProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </LazyMotion>
  );
};

export default Providers;
