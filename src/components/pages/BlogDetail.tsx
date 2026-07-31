"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { m, useScroll, useTransform, Variants } from "framer-motion";

import { useRef, useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  BookmarkPlus,
  Tag
} from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { api, API_URL } from "@/lib/api";
import DynamicHero from "@/components/layout/DynamicHero";
import { useSeo } from "@/context/SeoContext";
import { cleanDescription } from "@/lib/utils";


const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { setCustomSeo } = useSeo();


  // State
  const [post, setPost] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reading progress
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);


  // SVG Path Animation Variants
  const pathVariants: Variants = {
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
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };


  // Fetch blog details
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Fetch main blog content first (Critical)
        const blogResponse = await api.get(`/api/blogs/slug/${id}`);
        if (blogResponse.data.success) {
          const blogData = blogResponse.data.data;
          setPost(blogData);
          setCustomSeo(blogData);

          // 2. Fetch secondary data (Non-critical)
          // We don't want the whole page to fail if these fail
          try {
            const [relatedRes, latestRes] = await Promise.allSettled([
              api.get(`/api/blogs/slug/${id}/related?limit=3`),
              api.get(`/api/blogs/published?limit=6`)
            ]);

            if (relatedRes.status === 'fulfilled' && relatedRes.value.data.success) {
              setRelatedBlogs(relatedRes.value.data.data);
            }
            if (latestRes.status === 'fulfilled' && latestRes.value.data.success) {
              setLatestBlogs(latestRes.value.data.data);
            }
          } catch (secondaryError) {
            console.warn("Secondary blog data fetch failed:", secondaryError);
          }
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.response?.data?.message || "Failed to load blog");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      window.scrollTo(0, 0);
      fetchBlogDetails();
    }

    // Cleanup SEO on unmount
    return () => {
      setCustomSeo(null);
    };
  }, [id, setCustomSeo]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Topbar />
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-16 h-16 border-4 border-[#134698] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Topbar />
        <Navbar />

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl font-bold mb-4 text-charcoal">
              Blog Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "The article you're looking for doesn't exist."}
            </p>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#134698] to-[#DE802B] text-white rounded-lg hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Blogs
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Topbar />
      <Navbar />

      {/* Reading Progress Bar */}
      <m.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#134698] to-[#DE802B] z-50"
        style={{ width: progressWidth }}
      />

      {/* Hero Section */}
      {/* HERO SECTION */}
      <DynamicHero
        pageName={post.title}
        overrideTitle={post.h1Title || post.title}
        fallbackImage={`${API_URL}${post.image.startsWith('/') ? '' : '/'}${post.image}`}
      />


      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left Column: Blog Content */}
            <div className="lg:col-span-8">
              {/* Blog Meta Info */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-10 text-left"
              >
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 border-b pb-6">
                  <span className="flex items-center gap-2 font-medium">
                    <User size={16} className="text-[#134698]" />
                    By {post.author}
                  </span>
                  <span className="flex items-center gap-2 font-medium">
                    <Calendar size={16} className="text-[#DE802B]" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                  <span className="flex items-center gap-2 bg-[#134698]/5 text-[#134698] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
                    <Tag size={14} />
                    {post.category}
                  </span>
                </div>

                <h2 className="text-2xl md:text-4xl font-serif font-semibold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h2>

                <p className="text-lg text-gray-600 leading-relaxed font-medium italic border-l-4 border-[#DE802B] pl-6 py-2 bg-gray-50/50">
                  {cleanDescription(post.excerpt)}
                </p>
              </m.div>

              {/* Action Buttons */}
              <div className="flex justify-start items-center gap-4 mb-10">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#134698] text-white rounded-lg hover:bg-[#0d3370] transition-all shadow-md font-bold text-sm">
                  <Share2 size={16} />
                  Share Article
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-[#134698] hover:text-[#134698] transition-all font-bold text-sm">
                  <BookmarkPlus size={16} />
                  Save for Later
                </button>
              </div>

              {/* Content Area */}
              <m.article
                className="prose prose-lg max-w-none mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <style>{`
                  .prose {
                    font-family: 'Inter', sans-serif;
                    text-align: left;
                  }
                  .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                    color: #1a1a1a;
                    font-family: 'Inter', sans-serif !important;
                    font-weight: 800 !important;
                    margin-top: 2.5rem;
                    margin-bottom: 1rem;
                    text-align: left;
                    line-height: 1.3;
                  }
                  .prose h2 {
                    font-size: 2rem;
                    border-bottom: 2px solid #f1f1f1;
                    padding-bottom: 0.5rem;
                  }
                  .prose p, .prose li, .prose div {
                    color: #333333 !important;
                    font-family: 'Inter', sans-serif !important;
                    font-weight: 450 !important;
                    font-size: 1.125rem;
                    line-height: 1.625;
                    margin-bottom: 1rem;
                    text-align: justify !important;
                    hyphens: auto;
                  }
                  .prose img {
                    border-radius: 1rem;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                    margin: 2.5rem 0;
                  }
                  .prose strong {
                    color: #111827;
                    font-weight: 700;
                  }
                  .prose blockquote {
                    border-left-color: #134698;
                    font-style: italic;
                    background: #f9fafb;
                    padding: 2rem;
                    border-radius: 0 1rem 1rem 0;
                  }
                  .prose a {
                    color: #134698;
                    text-decoration: none;
                    font-weight: 600;
                    border-bottom: 2px solid #DE802B;
                    transition: all 0.2s;
                  }
                  .prose a:hover {
                    color: #DE802B;
                    background: #DE802B/5;
                  }
                `}</style>
                <div
                  className="blog-content-body"
                  dangerouslySetInnerHTML={{ __html: cleanDescription(post.content) }}
                />
              </m.article>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-8 border-t border-gray-100 mb-12">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-5 py-2 bg-gray-50 text-gray-600 rounded-full text-sm font-bold border border-gray-200 hover:border-[#134698] hover:text-[#134698] transition-all cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Latest Posts Widget */}
              <div className="sticky top-24">
                <h3 className="text-xl font-bold text-[#134698] mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-[#DE802B] rounded-full"></div>
                  Latest Blogs
                </h3>

                <div className="flex flex-col gap-4">
                  {latestBlogs.filter(b => b._id !== post._id).slice(0, 5).map((blog) => (
                    <Link
                      key={blog._id}
                      href={`/blogs/${blog.slug}`}
                      className="group bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-[#134698]/20 transition-all duration-300 flex gap-4 items-center"
                    >
                      <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={`${API_URL}${blog.image.startsWith('/') ? '' : '/'}${blog.image}`}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1 pr-2">
                        <span className="text-[10px] uppercase tracking-widest text-[#DE802B] font-extrabold">
                          {blog.category}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#134698] line-clamp-2 transition-colors duration-300 leading-snug">
                          {blog.title}
                        </h4>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogDetail;