"use client";

import { m } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, API_URL, API_IS_LOCAL } from "@/lib/api";
import { cleanDescription } from "@/lib/utils";
import Image from "next/image";

interface GalleryItem {
  _id: string;
  title: string;
  highlightText?: string;
  shortDescription?: string;
  number?: string;
  buttonText?: string;
  buttonUrl?: string;
  slug: string;
  mainImage: string;
  mainImageAltText?: string;
  status: string;
  category: {
    _id: string;
    name: string;
  };
  subcategory?: string;
}

interface PortfolioCategory {
  _id: string;
  name: string;
  subcategories: Array<{
    name: string;
    slug: string;
  }>;
  status: string;
}

const Portfolio = () => {
  const { category, subcategory } = useParams<{ category?: string; subcategory?: string }>();
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<PortfolioCategory | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (category && categories.length > 0) {
      const cat = categories.find(c =>
        c.name.toLowerCase().replace(/\s+/g, '-').includes(category)
      );
      setCurrentCategory(cat || null);
    }
  }, [category, categories]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, itemsRes] = await Promise.all([
        api.get('/api/gallery/categories'),
        api.get('/api/gallery/items')
      ]);

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data.filter((cat: PortfolioCategory) => cat.status === 'Active'));
      }

      if (itemsRes.data.success) {
        setGalleryItems(itemsRes.data.data.filter((item: GalleryItem) => item.status === 'Active'));
      }
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredItems = () => {
    if (!category) return [];

    return galleryItems.filter(item => {
      const categoryMatch = item.category?.name.toLowerCase().replace(/\s+/g, '-').includes(category);

      if (subcategory) {
        const subcategoryMatch = item.subcategory?.toLowerCase().replace(/\s+/g, '-').includes(subcategory);
        return categoryMatch && subcategoryMatch;
      }

      return categoryMatch;
    });
  };

  const filteredItems = getFilteredItems();

  // Show all categories if no specific category is selected
  if (!category) {
    return (
      <PageLayout title="Portfolio" subtitle="Our Work">
        <section className="section-padding">
          <div className="container-wide">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map((cat, idx) => {
                  const firstItem = galleryItems.find(item => item.category?._id === cat._id);
                  const categorySlug = cat.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

                  return (
                    <m.div
                      key={cat._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link href={`/portfolio/${categorySlug}`} className="block group">
                        <div className="rounded-xl overflow-hidden mb-4 bg-gray-100 relative aspect-square">
                          {firstItem ? (
                            <Image fill
                              src={`${API_URL}${firstItem.mainImage.startsWith('/') ? '' : '/'}${firstItem.mainImage}`}
                              alt={firstItem.mainImageAltText || cat.name}
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              loading="lazy"
                              unoptimized={API_IS_LOCAL}
                            />
                          ) : (
                            <div className="w-full aspect-square flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-charcoal group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        {cat.subcategories.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {cat.subcategories.length} subcategories
                          </p>
                        )}
                      </Link>
                    </m.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </PageLayout>
    );
  }

  // Show subcategories if category has them and no subcategory is selected
  if (currentCategory && currentCategory.subcategories.length > 0 && !subcategory) {
    return (
      <PageLayout title={currentCategory.name} subtitle="Portfolio">
        <section className="section-padding">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentCategory.subcategories.map((sub, idx) => {
                const subSlug = sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-');
                const firstItem = galleryItems.find(item =>
                  item.category?._id === currentCategory._id &&
                  item.subcategory === sub.name
                );

                return (
                  <m.div
                    key={idx}
                    className="group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link href={`/portfolio/${category}/${subSlug}`}>
                      <div className="rounded-xl overflow-hidden mb-4 bg-gray-100 relative aspect-[4/3]">
                        {firstItem ? (
                          <Image fill
                            src={`${API_URL}${firstItem.mainImage.startsWith('/') ? '' : '/'}${firstItem.mainImage}`}
                            alt={firstItem.mainImageAltText || sub.name}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            unoptimized={API_IS_LOCAL}
                          />
                        ) : (
                          <div className="w-full aspect-[4/3] flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-charcoal group-hover:text-primary transition-colors">
                        {sub.name}
                      </h3>
                    </Link>
                  </m.div>
                );
              })}
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  // Show gallery items
  return (
    <PageLayout
      title={subcategory ? filteredItems[0]?.subcategory || "Gallery" : currentCategory?.name || "Portfolio"}
      subtitle="Portfolio"
    >
      <section className="section-padding">
        <div className="container-wide">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No items found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, idx) => (
                <m.div
                  key={item._id}
                  className="group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="rounded-xl overflow-hidden mb-4 bg-gray-100 relative aspect-[4/3]">
                    <Image fill
                      src={`${API_URL}${item.mainImage.startsWith('/') ? '' : '/'}${item.mainImage}`}
                      alt={item.mainImageAltText || item.title}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      unoptimized={API_IS_LOCAL}
                    />
                    {item.number && (
                      <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                        {item.number}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal mb-1">{item.title}</h3>
                  {item.highlightText && (
                    <p className="text-sm text-primary font-medium mb-2">{item.highlightText}</p>
                  )}
                  {item.shortDescription && (
                    <div
                      className="text-muted-foreground text-sm line-clamp-2 mb-3"
                      dangerouslySetInnerHTML={{ __html: cleanDescription(item.shortDescription) }}
                    />
                  )}
                  {item.buttonUrl && (
                    <Link
                      href={item.buttonUrl}
                      className="inline-block text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                    >
                      {item.buttonText || "VIEW DETAILS"} →
                    </Link>
                  )}
                </m.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Portfolio;