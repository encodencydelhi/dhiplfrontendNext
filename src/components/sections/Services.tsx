"use client";

import { useState } from "react";
import { m } from "framer-motion";
import heroImage1 from "@/assets/about1.webp";

const projects = [
  {
    id: 1,
    number: "01",
    title: "Cozy",
    subtitle: "Living",
    subtitle2: "Room",
    description: "Exploring Excellence in Every Meticulous Design Detail with Premium Quality",
    image: heroImage1.src,
  },
  {
    id: 2,
    number: "02",
    title: "Luxurious",
    subtitle: "Living",
    subtitle2: "Room",
    description: "Sophisticated interiors crafted for premium living experiences in modern homes.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600",
  },
  {
    id: 3,
    number: "03",
    title: "Elegant",
    subtitle: "Bed",
    subtitle2: "room",
    description: "Calm, elegant bedroom spaces blending modern comfort and aesthetic style.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600",
  },
  {
    id: 4,
    number: "04",
    title: "Rustic",
    subtitle: "Comfort",
    
    description: "Warm rustic interiors with natural textures and timeless appeal for families.",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600",
  },
  {
    id: 5,
    number: "05",
    title: "Urban",
    subtitle: "Living",
    subtitle2: "Space",
    description: "Contemporary urban living spaces designed for high-end modern lifestyles.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600",
  },
];

const ProjectShowcase = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="relative bg-[#ffffff] py-16 overflow-hidden w-full">
      <div className="w-full">
        {/* HEADING CONTAINER */}
       

        {/* SHOWCASE WRAPPER */}
        <div className="flex w-full h-[500px] lg:h-[600px] gap-0 overflow-hidden">
          {projects.map((project, index) => {
            const isHovered = hovered === index;
            const originClass = index < 3 ? "origin-left" : "origin-right";

            return (
              <m.div
                key={project.id}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className={`relative h-full cursor-pointer overflow-hidden ${originClass}`}
                animate={{
                  flex: isHovered ? 3 : 1,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 1, 0.5, 1],
                }}
              >
                {/* IMAGE */}
                <m.img
                  src={project.image}
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  transition={{ duration: 1.5 }}
                />

                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-60"}`} />

                {/* CONTENT */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6 lg:p-8">
                  {/* NUMBER */}
                  <div className="relative">
                    <div className="text-5xl lg:text-6xl font-black italic opacity-20 absolute top-0 left-0" style={{ WebkitTextStroke: "1px white", color: "transparent" }}>
                      {project.number}
                    </div>
                    <m.div
                      className="text-5xl lg:text-6xl font-black italic relative"
                      animate={{
                        color: isHovered ? "#7EC8FF" : "rgba(255,255,255,0)",
                        WebkitTextStroke: isHovered ? "0px transparent" : "1px rgba(255,255,255,0.8)",
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {project.number}
                    </m.div>
                  </div>

                  {/* BOTTOM TEXT AREA */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 lg:gap-6">
                    {/* LEFT SIDE: TITLES */}
                    <div className="flex flex-col">
                      <h3 className="text-white text-2xl lg:text-3xl font-black uppercase leading-tight">{project.title}</h3>
                      <h3 className="text-white text-2xl lg:text-3xl font-black uppercase leading-tight ml-3 lg:ml-4">{project.subtitle}</h3>
                      <h3 className="text-white text-2xl lg:text-3xl font-black uppercase leading-tight ml-6 lg:ml-8">{project.subtitle2}</h3>
                      <div className="mt-3 h-[2px] w-20 bg-transparent border border-[#7EC8FF] relative overflow-hidden">
                        <m.div 
                          className="absolute inset-0 bg-[#7EC8FF]" 
                          animate={{ x: isHovered ? "0%" : "-100%" }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </div>

                    {/* RIGHT SIDE: DESCRIPTION */}
                    <m.div
                      className="max-w-[280px]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 20
                      }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <p className="text-white text-xs uppercase font-medium tracking-wider leading-relaxed text-right">
                        {project.description}
                      </p>
                    </m.div>
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;