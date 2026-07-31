import type { MetadataRoute } from "next";
import { API_URL } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.designhouse.co.in";

const STATIC_ROUTES: string[] = [
  "/",
  "/about",
  "/about/brand-approach",
  "/about/infrastructure",
  "/about/associates",
  "/about/team",
  "/services",
  "/services/retail-interior",
  "/services/corporate-interior",
  "/services/restaurant-interior",
  "/services/shop-in-shop",
  "/services/retail-display",
  "/services/acrylic-display",
  "/services/gondolas",
  "/services/window-display",
  "/services/retail-kiosk",
  "/services/mobile-booth",
  "/services/signage",
  "/services/exhibitions",
  "/services/office-interior",
  "/services/modular-workstation",
  "/services/md-cabin",
  "/services/office-chairs",
  "/services/wardrobe",
  "/services/kitchen",
  "/services/lcd-unit",
  "/services/dressing-table",
  "/services/sofas",
  "/portfolio",
  "/portfolio/interior/retail-interior",
  "/portfolio/interior/corporate-interior",
  "/portfolio/interior/restaurant-interior",
  "/portfolio/interior/shops-in-shops",
  "/portfolio/merchandising/merchandising-images",
  "/portfolio/merchandising/acrylic-images",
  "/portfolio/merchandising/gandola-images",
  "/portfolio/merchandising/window-display-images",
  "/portfolio/kiosk/kiosk-images",
  "/portfolio/kiosk/booth-images",
  "/portfolio/signage/signage-portfolio",
  "/portfolio/signage/exhibition-events-portfolio",
  "/portfolio/office-interior/modular-images",
  "/portfolio/office-interior/md-cabin-images",
  "/portfolio/office-interior/office-chairs-images",
  "/portfolio/furniture/wardrobes-images",
  "/portfolio/furniture/kitchen-images",
  "/portfolio/furniture/lcd-unit-images",
  "/portfolio/furniture/sofas-images",
  "/portfolio/videos",
  "/downloads",
  "/clients",
  "/career",
  "/blogs",
  "/contact",
  "/testimonials",
];

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const json = await res.json();
    return json?.success ? json.data : null;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, customPages, galleries] = await Promise.all([
    fetchJson(`${API_URL}/api/blogs/published`),
    fetchJson(`${API_URL}/api/custom-pages/`),
    fetchJson(`${API_URL}/api/portfolio-gallery/all`),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = (blogs || [])
    .filter((b: any) => b.slug)
    .map((b: any) => ({
      url: `${SITE_URL}/blogs/${encodeURIComponent(b.slug)}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const customPageEntries: MetadataRoute.Sitemap = (customPages || [])
    .filter((p: any) => p.permalink && String(p.status).toLowerCase() === "active")
    .map((p: any) => ({
      url: `${SITE_URL}/${encodeURIComponent(p.permalink)}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const galleryEntries: MetadataRoute.Sitemap = (galleries || [])
    .filter((g: any) => g.slug && String(g.status).toLowerCase() === "active")
    .map((g: any) => ({
      url: `${SITE_URL}/gallery/${encodeURIComponent(g.slug)}`,
      lastModified: g.updatedAt ? new Date(g.updatedAt) : undefined,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [...staticEntries, ...blogEntries, ...customPageEntries, ...galleryEntries];
}
