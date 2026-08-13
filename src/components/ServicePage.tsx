"use client";

import { m } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Location from "@/components/sections/Location";
import Image from "next/image";
import { API_IS_LOCAL } from "@/lib/api";

interface ServicePageProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
  relatedServices?: { title: string; href: string }[];
  category?: string;
}

const ServicePage = ({ title, subtitle, description, features, image, relatedServices, category }: ServicePageProps) => {
  return (
    <PageLayout title={title} subtitle={subtitle} category={category}>
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <m.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-6">
                {title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {description}
              </p>

              <div className="space-y-4 mb-8">
                {features.map((feature, idx) => (
                  <m.div
                    key={idx}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-charcoal">{feature}</span>
                  </m.div>
                ))}
              </div>

              <Link href="/contact">
                <Button size="lg" className="group">
                  Get a Quote
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </m.div>

            <m.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                  unoptimized={API_IS_LOCAL}
                />
              </div>
            </m.div>
          </div>

          {relatedServices && relatedServices.length > 0 && (
            <div className="mb-20">
              <h3 className="text-2xl font-display font-bold text-charcoal mb-8">Related Services</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedServices.map((service, idx) => (
                  <Link
                    key={idx}
                    href={service.href}
                    className="p-6 bg-cream rounded-xl hover:bg-primary hover:text-white transition-all duration-300 group"
                  >
                    <span className="font-medium group-hover:text-white">{service.title}</span>
                    <ArrowRight className="w-4 h-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Location category={category || "Retail Interiors"} />
      </section>
    </PageLayout>
  );
};

export default ServicePage;