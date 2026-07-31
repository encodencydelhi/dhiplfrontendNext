"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Award, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Luxury Retail Flagship",
    category: "Retail Interior",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    location: "Mumbai, India",
    year: "2024",
    size: "5000 sq ft",
    client: "Premium Fashion Brand",
    description: "A flagship store featuring minimalist design with premium materials"
  },
  {
    id: 2,
    title: "Modern Tech Office",
    category: "Corporate Interior",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    location: "Bangalore, India",
    year: "2024",
    size: "8000 sq ft",
    client: "Tech Startup",
    description: "Collaborative workspace with biophilic design elements"
  },
  {
    id: 3,
    title: "Gourmet Restaurant",
    category: "Restaurant Interior",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    location: "Delhi, India",
    year: "2023",
    size: "3000 sq ft",
    client: "Fine Dining Chain",
    description: "Luxurious dining experience with custom lighting"
  },
  {
    id: 4,
    title: "Fashion Boutique",
    category: "Retail Interior",
    image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&q=80",
    location: "Pune, India",
    year: "2023",
    size: "2500 sq ft",
    client: "Designer Boutique",
    description: "Contemporary retail space with artistic displays"
  },
  {
    id: 5,
    title: "Corporate Headquarters",
    category: "Corporate Interior",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    location: "Gurgaon, India",
    year: "2024",
    size: "12000 sq ft",
    client: "Multinational Corporation",
    description: "Executive offices with sustainable materials"
  },
  {
    id: 6,
    title: "Premium Showroom",
    category: "Retail Interior",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    location: "Chennai, India",
    year: "2024",
    size: "6000 sq ft",
    client: "Automobile Brand",
    description: "Luxury showroom with interactive displays"
  },
  {
    id: 7,
    title: "Hotel Lobby & Lounge",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    location: "Goa, India",
    year: "2023",
    size: "4000 sq ft",
    client: "5-Star Hotel",
    description: "Grand lobby with custom furniture and art"
  },
  {
    id: 8,
    title: "Medical Center",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1516549655669-df6654e435de?w=800&q=80",
    location: "Hyderabad, India",
    year: "2024",
    size: "7000 sq ft",
    client: "Healthcare Group",
    description: "Healing environment with calming aesthetics"
  }
];

const categories = ["All", "Retail", "Corporate", "Restaurant", "Hospitality", "Healthcare"];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;


  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => 
        project.category.toLowerCase().includes(activeCategory.toLowerCase())
      );

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section 
      id="projects" 
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50"
    >
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#C8975F]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#134698]/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-2 rounded-full shadow-sm mb-6 border border-gray-100">
            <Award className="w-4 h-4 text-[#C8975F]" />
            <span className="text-sm font-semibold text-[#134698] tracking-wider uppercase">
              PORTFOLIO SHOWCASE
            </span>
          </div>
          
          <m.h2
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6 leading-tight"
          >
            Our <span className="text-[#C8975F]">Exquisite</span> Interior<br />
            Design Projects
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.42, 0, 0.58, 1] }}
            className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto"
          >
            Discover our portfolio of premium interior design projects that combine aesthetic excellence with functional brilliance
          </m.p>
        </div>

        {/* Filter Tabs */}
        <m.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.42, 0, 0.58, 1] }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1);
              }}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === category
                  ? 'bg-[#134698] text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#C8975F] hover:text-[#C8975F] hover:shadow-md'
              }`}
              aria-label={`Filter by ${category}`}
            >
              {category}
              {category !== "All" && (
                <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                  {projects.filter(p => p.category.toLowerCase().includes(category.toLowerCase())).length}
                </span>
              )}
            </button>
          ))}
        </m.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentProjects.map((project, index) => (
            <m.div
              key={project.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: (100 + (index % 3) * 100) / 1000, ease: [0.42, 0, 0.58, 1] }}
              className="relative group"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-gray-200">
                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                      {project.category}
                    </span>
                  </div>
                  
                  {/* Quick View Button */}
                  <div className="absolute top-6 right-6">
                    <button 
                      className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-300 opacity-0 group-hover:opacity-100"
                      aria-label={`Quick view ${project.title}`}
                    >
                      <Eye className="w-5 h-5 text-gray-900" />
                    </button>
                  </div>
                  
                  {/* Project Details on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {project.year}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      <div className="text-xs text-gray-500 flex items-center justify-between">
                        <span>{project.size}</span>
                        <span>{project.client}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Below Image */}
                <div className="p-6">
                  <h3 className="text-xl font-serif text-gray-900 mb-3 group-hover:text-[#134698] transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                      Completed Project
                    </span>
                    
                    <button 
                      className="flex items-center gap-2 text-[#134698] hover:text-[#C8975F] font-semibold text-sm transition-colors duration-300 group/btn"
                      aria-label={`View details for ${project.title}`}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C8975F]/30 rounded-2xl transition-all duration-500 pointer-events-none"></div>
              </div>
            </m.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <m.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
            className="flex items-center justify-center gap-4 mb-20"
          >
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-[#134698] hover:text-white hover:border-[#134698]'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-[#134698] text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#134698]'
                  }`}
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-[#134698] hover:text-white hover:border-[#134698]'
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </m.div>
        )}

        {/* Stats Section */}
        <m.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
          className="bg-gradient-to-r from-[#134698] to-[#0d2e6e] rounded-3xl p-8 md:p-12 mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Projects Completed", icon: "🏆" },
              { value: "40+", label: "Years Experience", icon: "⏳" },
              { value: "150+", label: "Happy Clients", icon: "😊" },
              { value: "50+", label: "Awards Won", icon: "⭐" }
            ].map((stat, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: (index * 100) / 1000, ease: [0.42, 0, 0.58, 1] }}
                className="text-center text-white"
              >
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80 text-sm font-medium">{stat.label}</div>
              </m.div>
            ))}
          </div>
        </m.div>

        {/* CTA Section */}
        <m.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
          className="text-center"
        >
          <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6">
            Ready to Transform Your Space?
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Let's collaborate to create an interior that reflects your vision and elevates your lifestyle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3.5 bg-[#134698] text-white rounded-lg font-semibold hover:bg-[#0d2e6e] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              Start Your Project
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-3.5 bg-white text-[#134698] rounded-lg font-semibold border-2 border-[#134698] hover:bg-[#134698] hover:text-white transition-all duration-300">
              View Full Portfolio
            </button>
          </div>
        </m.div>
      </div>
    </section>
  );
};

export default Projects;