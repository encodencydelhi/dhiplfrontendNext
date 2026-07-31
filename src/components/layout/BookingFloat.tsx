"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import BookingDrawer from "@/components/layout/BookingDrawer";
import { useEffect } from "react";
import { api } from "@/lib/api";

interface BookingFloatProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const BookingFloat = ({ open: propsOpen, onOpenChange }: BookingFloatProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use props if provided, otherwise use internal state
  const open = propsOpen !== undefined ? propsOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // ✅ Add hash listener to open drawer from anywhere (like Hero CTA)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#book-meeting") {
        setOpen(true);
        // Clear hash after opening to allow re-triggering and clean URL
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };

    // Check on initial load
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <>
      {/* SHOW BUTTON ONLY WHEN DRAWER IS CLOSED */}
      <AnimatePresence>
        {!open && (
          <m.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:block fixed left-0 top-[45%] -translate-y-1/2 z-[999]"
          >
            <m.button
              onClick={() => {
                setOpen(true);
                api.post("/api/analytics/log", { iconName: "Book Meeting" }).catch(console.error);
              }}
              whileHover={{ x: 3 }}
              className="group relative"
              aria-label="Book a Meeting"
            >
              <div className="bg-[#DE802B] text-white px-2 py-4 rounded-r-md shadow-md hover:bg-[#000066] transition-colors">
                <div className="flex flex-col items-center gap-1">
                  <Calendar className="w-4 h-4" strokeWidth={2.5} />
                  <div
                    className="text-[12px] font-bold tracking-[0.12em] uppercase"
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                    }}
                  >
                    Book Meeting
                  </div>
                </div>
              </div>
              <span className="sr-only">Book a Meeting</span>
|
              {/* Tooltip */}
              <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white px-2 py-1 rounded text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Schedule a Meeting
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-gray-900 rotate-45" />
              </div>
            </m.button>
          </m.div>
        )}
      </AnimatePresence>

      {/* DRAWER */}
      <BookingDrawer open={open} onOpenChange={setOpen} />
    </>
  );
};

export default BookingFloat;