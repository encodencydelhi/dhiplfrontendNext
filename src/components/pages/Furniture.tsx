"use client";

import { m } from "framer-motion";

import PageLayout from "@/components/layout/PageLayout";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { API_IS_LOCAL } from "@/lib/api";

const furniture = [
  { title: "Wardrobe", description: "Custom wardrobes designed to maximize storage and style", image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=600", href: "/services/wardrobe" },
  { title: "Kitchen", description: "Modern modular kitchens with premium finishes", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600", href: "/services/kitchen" },
  { title: "LCD Unit", description: "Contemporary entertainment units for your living room", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=600", href: "/services/lcd-unit" },
  { title: "Dressing Table", description: "Elegant dressing tables with integrated lighting", image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=600", href: "/services/dressing-table" },
  { title: "Sofas", description: "Luxurious seating crafted for comfort and style", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600", href: "/services/sofas" },
];

const Furniture = () => {
  return (
    <PageLayout title="Furniture" subtitle="Custom Solutions">
      <section className="section-padding">
        <div className="container-wide">
          <m.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-6">
              Premium Custom <span className="text-primary">Furniture</span>
            </h2>
            <p className="text-muted-foreground">Handcrafted furniture solutions designed to transform your home with elegance and functionality.</p>
          </m.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {furniture.map((item, idx) => (
              <m.div
                key={idx}
                className="group"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Link href={item.href}>
                  <div className="relative rounded-2xl overflow-hidden mb-4 aspect-[4/3]">
                    <Image src={item.image} alt={item.title} fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized={API_IS_LOCAL} />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center gap-2 text-white font-medium">
                        View Details <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{item.description}</p>
                </Link>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Furniture;