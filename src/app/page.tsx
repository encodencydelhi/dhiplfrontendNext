import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import { fetchPageSeo, buildMetadata, AdvancedSeoTags } from "@/lib/seo";
import { fetchActiveHeroSlides } from "@/lib/api";

const Topbar = dynamic(() => import("@/components/layout/Topbar"));
const Navbar = dynamic(() => import("@/components/layout/Navbar"));

const HowWeWork = dynamic(() => import("@/components/sections/HowWeWork"));
const LogoMarquee = dynamic(() => import("@/components/sections/LogoMarquee"));
const ServicesCarousel = dynamic(() => import("@/components/sections/ServicesCarousel"));
const StatsCounter = dynamic(() => import("@/components/sections/StatsCounter"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const FaqSection = dynamic(() => import("@/components/sections/FaqSection"));
const RecentArticles = dynamic(() => import("@/components/sections/RecentArticles"));
const Location = dynamic(() => import("@/components/sections/Location"));
const Footer = dynamic(() => import("@/components/sections/Footer"));

const SectionPlaceholder = () => (
  <div className="min-h-[300px] bg-slate-50 animate-pulse" aria-hidden="true" />
);

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeo("/");
  return buildMetadata(seo, undefined, "/");
}

export default async function Index() {
  const initialSlides = await fetchActiveHeroSlides();
  const seo = await fetchPageSeo("/");

  return (
    <div className="min-h-screen bg-background">
      <AdvancedSeoTags seo={seo} />
      <Suspense fallback={null}>
        <Topbar />
      </Suspense>

      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <main>
        <Hero isHomePage={true} initialSlides={initialSlides} />
        <About />

        <Suspense fallback={<SectionPlaceholder />}><ServicesCarousel /></Suspense>
        <Suspense fallback={<SectionPlaceholder />}><HowWeWork isHomePage={true} /></Suspense>
        <Suspense fallback={<SectionPlaceholder />}><StatsCounter /></Suspense>
        <Suspense fallback={<SectionPlaceholder />}><LogoMarquee /></Suspense>
        <Suspense fallback={<SectionPlaceholder />}><Testimonials /></Suspense>
        <Suspense fallback={<SectionPlaceholder />}><FaqSection /></Suspense>
        <Suspense fallback={<SectionPlaceholder />}><RecentArticles /></Suspense>
        <Suspense fallback={<SectionPlaceholder />}><Location category="Interior Design Company" /></Suspense>
        <Suspense fallback={<SectionPlaceholder />}><Footer /></Suspense>
      </main>
    </div>
  );
}
