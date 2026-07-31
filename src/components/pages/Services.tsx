"use client";

import { m } from "framer-motion";

import PageLayout from "@/components/layout/PageLayout";
import Link from "next/link";
import { ArrowRight, Palette, ShoppingBag, Building, Briefcase, Home, Monitor } from "lucide-react";

const services = [
  { icon: Palette, title: "Interior", description: "Complete interior solutions for retail, corporate, and restaurants", href: "/services/retail-interior", items: ["Retail Interior", "Corporate Interior", "Restaurant Interior", "Shop in Shop"] },
  { icon: ShoppingBag, title: "Merchandising", description: "Eye-catching displays that drive sales and brand engagement", href: "/services/retail-display", items: ["Retail Display", "Acrylic Display", "Gondolas", "Window Display"] },
  { icon: Building, title: "Kiosk", description: "Portable and permanent kiosk solutions for any location", href: "/services/retail-kiosk", items: ["Retail Kiosk", "Mobile Booth"] },
  { icon: Monitor, title: "Signage", description: "Professional signage that communicates your brand message", href: "/services/signage", items: ["Indoor Signage", "Outdoor Signage", "LED Signs"] },
  { icon: Briefcase, title: "Exhibitions & Events", description: "Stunning exhibition stands and event setups", href: "/services/exhibitions", items: ["Trade Shows", "Corporate Events", "Product Launches"] },
  { icon: Home, title: "Office Interior", description: "Workspaces that inspire productivity and reflect your culture", href: "/services/office-interior", items: ["Modular Workstation", "MD Cabin", "Office Chairs"] },
];

const Services = () => {
  return (
    <PageLayout title="Our Services" subtitle="What We Do">
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
              Complete Design & Interior <span className="text-primary">Solutions</span>
            </h2>
            <p className="text-muted-foreground">From concept to completion, we offer end-to-end services for all your interior and retail needs.</p>
          </m.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <m.div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-border hover:shadow-large group transition-all duration-500"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -8 }}
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <service.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={service.href} className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Ready to Transform Your Space?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">Let's discuss how we can bring your vision to life with our comprehensive design solutions.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-medium hover:shadow-large transition-all">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default Services;