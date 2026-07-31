import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Location from "@/components/sections/Location";
import Footer from "@/components/sections/Footer";

import DynamicHero from "@/components/layout/DynamicHero";
import About from "@/components/sections/About";
import BestInteriorCompany from "@/components/sections/BestInteriorCompany";
import CustomerService from "@/components/sections/CustomerService";
import ParallaxDivider from "@/components/sections/ParallaxDivider";
import WhyDesignHouse from "@/components/sections/WhyDesignHouse";
import ServicesSection from "@/components/sections/ServicesSection";
import OurTeam from "@/components/sections/OurTeam";
import OurAssociates from "@/components/sections/OurAssociates";
import FacilityInfrastructure from "@/components/sections/FacilityInfrastructure";
import BrandConsciousApproach from "@/components/sections/BrandConsciousApproach";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ================= TOPBAR ================= */}
      <Topbar />

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= PAGE CONTENT ================= */}
      <main className="flex-1">

        {/* Dynamic Hero Section */}
        <DynamicHero
          pageName="About Us"
          fallbackImage="https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1920&q=80&auto=format&fit=crop"
        />

        {/* About Section with Image Grid and Company Info */}
        <About />

        {/* Best Interior Design Company Section */}
        <BestInteriorCompany />

        <ServicesSection />

        {/* Parallax Image Divider */}
        <ParallaxDivider />

        {/* Why Choose Design House */}
        <WhyDesignHouse />

        {/* Customer Service Section */}
        <CustomerService />







        {/* Our Team Section */}
        <OurTeam />



        {/* Our Associates Section */}
        <OurAssociates />


        {/* <FacilityInfrastructure />

       
        <BrandConsciousApproach /> */}

      </main>

      {/* ================= FOOTER ================= */}

      <Footer />

    </div>
  );
};

export default AboutPage;