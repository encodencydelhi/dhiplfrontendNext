"use client";

import { m } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Factory, Truck, Settings, Shield } from "lucide-react";

const Infrastructure = () => {
  const facilities = [
    {
      icon: Factory,
      title: "Manufacturing Unit",
      description: "State-of-the-art manufacturing facility spread across 50,000 sq ft with modern machinery and skilled craftsmen.",
    },
    {
      icon: Settings,
      title: "Design Studio",
      description: "Dedicated design studio equipped with the latest software and visualization tools for 3D rendering.",
    },
    {
      icon: Truck,
      title: "Logistics Hub",
      description: "Efficient logistics network ensuring timely delivery across India with our fleet of specialized vehicles.",
    },
    {
      icon: Shield,
      title: "Quality Control",
      description: "Rigorous quality checks at every stage of production to ensure premium finish and durability.",
    },
  ];

  return (
    <PageLayout title="Infrastructure" subtitle="About Us">
      <section className="section-padding">
        <div className="container-wide">
          <m.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-6">
              World-Class <span className="text-primary">Facilities</span>
            </h2>
            <p className="text-muted-foreground">
              Our infrastructure is designed to deliver excellence at scale while maintaining the highest standards of quality and craftsmanship.
            </p>
          </m.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {facilities.map((facility, idx) => (
              <m.div
                key={idx}
                className="bg-white rounded-xl p-8 border border-border hover:shadow-large transition-all duration-500 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <facility.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">{facility.title}</h3>
                <p className="text-muted-foreground">{facility.description}</p>
              </m.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { value: "50,000+", label: "Sq Ft Manufacturing" },
              { value: "200+", label: "Skilled Workforce" },
              { value: "PAN India", label: "Delivery Network" },
            ].map((stat, idx) => (
              <m.div
                key={idx}
                className="text-center p-8 bg-cream rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Infrastructure;