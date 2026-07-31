"use client";

import { m } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { CheckCircle, Target, Eye, Award } from "lucide-react";

const BrandApproach = () => {
  return (
    <PageLayout title="Brand Conscious Approach" subtitle="About Us">
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <m.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-6">
                Building Brands Through <span className="text-primary">Exceptional Design</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At Design House, we understand that every space tells a story. Our brand-conscious approach ensures that your interior design not only looks stunning but also reinforces your brand identity and values at every touchpoint.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We collaborate closely with our clients to understand their brand ethos, target audience, and business objectives. This deep understanding allows us to create spaces that resonate with your customers and strengthen brand loyalty.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: Target, title: "Strategic Alignment", desc: "Design that supports business goals" },
                  { icon: Eye, title: "Visual Consistency", desc: "Cohesive brand experience" },
                  { icon: Award, title: "Premium Quality", desc: "Excellence in every detail" },
                  { icon: CheckCircle, title: "Client Satisfaction", desc: "100% commitment to your vision" },
                ].map((item, idx) => (
                  <m.div
                    key={idx}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </m.div>
                ))}
              </div>
            </m.div>
            
            <m.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
                  alt="Brand Design Process"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-primary text-white p-6 rounded-xl">
                <div className="text-4xl font-bold">40+</div>
                <div className="text-sm opacity-90">Years Experience</div>
              </div>
            </m.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default BrandApproach;