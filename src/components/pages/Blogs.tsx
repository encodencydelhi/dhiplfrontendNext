"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import DynamicHero from "@/components/layout/DynamicHero";
import { api, API_URL } from "@/lib/api";

const Blogs = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  // Fetch published blogs from API
  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/blogs/published");

      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/blogs/categories");

      if (response.data.success) {
        setCategories(["All", ...response.data.data]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Filter blogs by category
  const filteredBlogs = selectedCategory === "All"
    ? blogs
    : blogs.filter(blog => blog.category === selectedCategory);

  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: 1.5,
          ease: "easeInOut",
          delay: 0.5
        },
        opacity: {
          duration: 0.3,
          delay: 0.5
        }
      }
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div ref={ref} className="min-h-screen bg-background overflow-x-hidden">
      <Topbar />
      <Navbar />

      <main>
        {/* Dynamic Hero Section */}
        <DynamicHero
          pageName="Blogs"
          fallbackImage="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80&auto=format&fit=crop"
        />

        {/* Category Filter Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${selectedCategory === category
                    ? "bg-[#134698] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid Section */}
        <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-[#134698] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Blogs Found</h3>
                <p className="text-gray-600">Check back later for new content!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog, idx) => (
                  <m.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-[#134698] transition-all duration-300"
                  >
                    <Link href={`/blogs/${blog.slug}`} className="block">
                      {/* Image Container */}
                      <div className="relative overflow-hidden aspect-[16/9]">
                        <img
                          src={`${API_URL}${blog.image.startsWith('/') ? '' : '/'}${blog.image}`}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 bg-white/95 backdrop-blur-sm text-[#134698] text-xs font-semibold uppercase tracking-wide shadow-md">
                            {blog.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2.5 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#DE802B]" />
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[#134698] mb-2.5 uppercase tracking-wide group-hover:text-[#DE802B] transition-colors duration-300 line-clamp-2">
                          {blog.title}
                        </h3>

                        <p className="text-slate-600 text-sm leading-relaxed mb-3.5 line-clamp-3">
                          {blog.excerpt}
                        </p>

                        {/* Author */}
                        <div className="text-xs text-gray-500 mb-3">
                          By {blog.author}
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {blog.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center text-[#DE802B] text-sm font-bold gap-1 group-hover:gap-2 transition-all duration-300 uppercase tracking-wide">
                          <span>Read More</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>
                  </m.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blogs;
