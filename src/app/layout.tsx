import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/Providers";
import GlobalFooterScripts from "@/components/GlobalFooterScripts";
import AnalyticsLoader from "@/components/AnalyticsLoader";
import { API_URL } from "@/lib/api";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Design House India",
  verification: {
    google: "mqnOE06iopOGw64MqLF8dbJAkRgBtecavtI_1OKzlFQ",
  },
  icons: {
    icon: "/favicon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} ${playfair.variable}`}>
      <body>
        {/* Preload cached hero image BEFORE React hydrates. The image is
            served by the backend API, not this frontend, so the URL must be
            built from API_URL — window.location.origin was this page's own
            origin and produced a wrong, always-404ing preload URL. */}
        <Script id="hero-preload" strategy="beforeInteractive">
          {`
            try {
              var cached = localStorage.getItem("dh_hero_slides_cache");
              if (cached) {
                var parsed = JSON.parse(cached);
                var now = Date.now();
                if (
                  parsed &&
                  parsed.timestamp &&
                  now - parsed.timestamp < 300000 &&
                  parsed.data &&
                  parsed.data[0] &&
                  parsed.data[0].image
                ) {
                  var img = parsed.data[0].image;
                  var apiUrl = ${JSON.stringify(API_URL)};
                  var fullUrl = img.startsWith("http") ? img : apiUrl + (img.startsWith("/") ? "" : "/") + img;
                  var link = document.createElement("link");
                  link.rel = "preload";
                  link.as = "image";
                  link.fetchPriority = "high";
                  link.href = fullUrl;
                  document.head.appendChild(link);
                }
              }
            } catch (e) {}
          `}
        </Script>

        <Providers>{children}</Providers>

        <GlobalFooterScripts />

        <AnalyticsLoader />
      </body>
    </html>
  );
}
