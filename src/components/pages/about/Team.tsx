"use client";

import { m } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Linkedin, Mail } from "lucide-react";

const teamMembers = [
  {
    name: "Rajesh Kumar",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    description: "40+ years experience in interior design industry",
  },
  {
    name: "Priya Sharma",
    role: "Design Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
    description: "Award-winning interior designer",
  },
  {
    name: "Amit Patel",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
    description: "Expert in project management and execution",
  },
  {
    name: "Sneha Gupta",
    role: "Creative Head",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400",
    description: "Innovative design solutions specialist",
  },
  {
    name: "Vikram Singh",
    role: "Technical Director",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    description: "Engineering and technical excellence",
  },
  {
    name: "Anita Mehta",
    role: "Client Relations",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
    description: "Building lasting client partnerships",
  },
];

const Team = () => {
  return (
    <PageLayout title="Our Team" subtitle="About Us">
      <section className="section-padding">
        <div className="container-wide">
          <m.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-6">
              Meet Our <span className="text-primary">Experts</span>
            </h2>
            <p className="text-muted-foreground">
              Our team of passionate designers, architects, and craftsmen bring decades of combined experience to every project.
            </p>
          </m.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <m.div
                key={idx}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full aspect-[3/4] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href="#" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-primary transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-primary transition-colors">
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-charcoal">{member.name}</h3>
                <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.description}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Team;