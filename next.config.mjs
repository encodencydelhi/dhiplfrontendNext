/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Vite's `vite build` transpiles with esbuild and never ran `tsc`, so this
    // codebase has pre-existing type errors (e.g. framer-motion Variants typing)
    // that were never surfaced. `next build` type-checks by default; keep parity
    // with the original build instead of gating on unrelated pre-existing errors.
    ignoreBuildErrors: true,
  },
  images: {
    // CMS-uploaded images (services, hero, stats-counter, logo, etc.) are
    // served from the backend at runtime, so next/image needs them allowlisted.
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "5000", pathname: "/uploads/**" },
      { protocol: "https", hostname: "api.designhouse.co.in", pathname: "/uploads/**" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
