"use client";

import { m, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api, API_URL } from "@/lib/api";

const RecentArticles = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch only featured blogs for homepage
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/blogs/published");

        if (response.data.success) {
          // Only show featured blogs on the homepage as requested
          const featuredBlogs = response.data.data.filter(blog => blog.featured === true);
          setBlogs(featuredBlogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || blogs.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 3;
        return nextIndex >= blogs.length ? 0 : nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, blogs.length]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const nextIndex = prev + 3;
      return nextIndex >= blogs.length ? 0 : nextIndex;
    });
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const prevIndex = prev - 3;
      return prevIndex < 0 ? Math.max(0, blogs.length - 3) : prevIndex;
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // SVG Path Animation Variants
  const pathVariants: any = {
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

  if (isLoading) {
    return (
      <section className="py-8 md:py-10 bg-gray-50">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-[#134698] border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="py-8 md:py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Blogs Available</h3>
            <p className="text-gray-600">Check back later for new content!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-10 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header - Left Aligned */}
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-left mb-12"
        >
          {/* Styled Span with Lines */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]"></div>
            <span className="text-sm md:text-base uppercase tracking-[0.35em] text-[#134698] font-bold">
              OUR BLOG
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#134698]"></div>
          </m.div>

          {/* Styled H2 with Animated Underline */}
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-2xl md:text-3xl lg:text-4xl font-serif mb-5 leading-tight text-gray-900"
          >
            Read Our Latest{" "}
            <span className="text-[#DE802B] relative inline-block">
              Articles
              <m.svg
                className="absolute -bottom-2 left-0 w-full h-3 text-[#134698]/50"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <m.path
                  d="M2 10C60 2, 140 2, 198 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  variants={pathVariants}
                />
              </m.svg>
            </span>
          </m.h2>

          <p className="text-gray-700 leading-relaxed text-sm md:text-base max-w-2xl">
            Stay updated with the latest trends, tips, and insights in interior design
          </p>
        </m.div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Arrow - Left (Navy Blue) */}
          {blogs.length > 3 && (
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 rounded-full bg-[#134698] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-[#0f3575]"
              aria-label="Previous articles"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Articles Grid with AnimatePresence */}
          <AnimatePresence mode="wait">
            <m.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {blogs.slice(currentIndex, currentIndex + 3).map((blog, index) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog.slug}`}
                  className="block"
                >
                  <m.article
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group cursor-pointer bg-white border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-[#134698] transition-all duration-300"
                  >
                    {/* Image with Glossy Effect */}
                    <div className="relative overflow-hidden aspect-[16/9]">
                      <img
                        src={`${API_URL}${blog.image?.startsWith('/') ? '' : '/'}${blog.image}`}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80";
                        }}
                      />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 bg-white/95 backdrop-blur-sm text-[#134698] text-xs font-semibold uppercase tracking-wide shadow-md">
                          {blog.category}
                        </span>
                      </div>

                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Meta Info */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-2.5 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#DE802B]" />
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-[#134698] mb-2.5 uppercase tracking-wide group-hover:text-[#DE802B] transition-colors duration-300 line-clamp-2">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
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
                          {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read More Link */}
                      <div className="flex items-center text-[#DE802B] text-sm font-bold gap-1 group-hover:gap-2 transition-all duration-300 uppercase tracking-wide">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </m.article>
                </Link>
              ))}
            </m.div>
          </AnimatePresence>

          {/* Navigation Arrow - Right (Orange) */}
          {blogs.length > 3 && (
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 rounded-full bg-[#DE802B] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-[#c97024]"
              aria-label="Next articles"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Navigation Dots */}
          {blogs.length > 3 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(blogs.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index * 3);
                  }}
                  className={`rounded-full transition-all duration-300 ${Math.floor(currentIndex / 3) === index
                    ? "w-8 h-2 bg-[#134698]"
                    : "w-2 h-2 bg-gray-300 hover:bg-[#DE802B]"
                    }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-10"
        >
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-md border-2 border-[#134698] px-8 py-3 text-sm tracking-wider font-semibold text-[#134698] shadow-md transition-all duration-300 hover:bg-[#134698] hover:text-white hover:shadow-lg"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </m.div>
      </div>
    </section>
  );
};

export default RecentArticles;