"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GA_ID = "G-YN241B64T9";
const INTERACTION_EVENTS = ["scroll", "click", "touchstart", "mousemove", "keydown"];
const FALLBACK_DELAY_MS = 5000;

// Google Tag Manager only starts costing main-thread time (long tasks,
// ~500ms TBT) once its script actually runs. Deferring it until the user
// has genuinely engaged (or a fallback timeout for readers who never
// scroll/click) keeps it off the critical initial-load path entirely
// while still capturing a pageview for real visitors.
export default function AnalyticsLoader() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;

    const trigger = () => setShouldLoad(true);
    const fallbackTimer = setTimeout(trigger, FALLBACK_DELAY_MS);

    INTERACTION_EVENTS.forEach((evt) =>
      window.addEventListener(evt, trigger, { once: true, passive: true })
    );

    return () => {
      clearTimeout(fallbackTimer);
      INTERACTION_EVENTS.forEach((evt) => window.removeEventListener(evt, trigger));
    };
  }, [shouldLoad]);

  if (!shouldLoad) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
