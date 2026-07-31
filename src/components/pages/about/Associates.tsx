"use client";

import { m } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";

const associates = [
  {
    name: "Titan Industries",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200",
    description: "Premium watch and jewelry brand partnership",
  },
  {
    name: "Raymond Ltd",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200",
    description: "Leading textile and retail solutions",
  },
  {
    name: "Reliance Retail",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200",
    description: "Multi-format retail design projects",
  },
  {
    name: "Future Group",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200",
    description: "Retail space transformation",
  },
  {
    name: "Shoppers Stop",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200",
    description: "Department store interiors",
  },
  {
    name: "Lifestyle Intl",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200",
    description: "Fashion retail design",
  },
];

const Associates = () => {
  return (
    <PageLayout title="Our Associates" subtitle="About Us">
      <section className="section-padding">
        <div className="container-wide">
          <m.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-6">
              Trusted <span className="text-primary">Partnerships</span>
            </h2>
            <p className="text-muted-foreground">
              We are proud to partner with India's leading brands and retailers, delivering exceptional design solutions that drive business success.
            </p>
          </m.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {associates.map((associate, idx) => (
              <m.div
                key={idx}
                className="bg-white rounded-xl p-8 border border-border hover:shadow-large hover:-translate-y-2 transition-all duration-500 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="w-20 h-20 rounded-full bg-cream mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{associate.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">{associate.name}</h3>
                <p className="text-muted-foreground text-sm">{associate.description}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Associates;