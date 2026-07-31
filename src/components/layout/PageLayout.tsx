import DynamicHero from "@/components/layout/DynamicHero";
import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import Location from "@/components/sections/Location";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  category?: string;
}

const PageLayout = ({
  children,
  title,
  subtitle,
  backgroundImage,
  category,
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Topbar />
      <Navbar />

      {/* HERO SECTION */}
      <DynamicHero
        pageName={title}
        fallbackImage={backgroundImage || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80"}
      />

      <main>{children}</main>

      <Location category={category} />
      <Footer />
    </div>
  );
};

export default PageLayout;