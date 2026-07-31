"use client";

import { m } from "framer-motion";
import { Factory, CheckCircle2 } from "lucide-react";

const FacilityInfrastructure = () => {
  const facilities = [
    "Laser Cutting",
    "LED Display Board",
    "3D Design Included",
    "3-D Letter Signage",
    "Post Forming Machinery",
    "Powder Coating",
    "Corian Sheet Fabrication",
    "Paint Booth",
    "Acrylic Fabrication",
    "All Types of Polish Work",
    "All Types of Metal Fabrication",
    "In House Carriage",
    "House Designing Studio",
    "Modular Furniture Fabrication",
    "House Tool Room Setup",
    "HIP & ABS Thermoforming",
    "HP Latex Digital Printing",
    "Solid Wood Furniture Fabrication",
    "Hot Press Lamination Machinery",
    "Chair and Sofa Fabrication",
    "CNC Router Cutting"
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 bg-blue-50 rounded-full">
            <Factory className="w-4 h-4 text-[#134698]" />
            <span className="text-xs uppercase tracking-wider text-[#134698] font-semibold">
              Infrastructure
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Facility & <span className="text-[#134698]">Capabilities</span>
          </h2>

          <p className="text-gray-600">
            Advanced in-house facilities for superior quality and timely execution
          </p>
        </m.div>

        {/* Stats Bar */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto"
        >
          {[
            { value: "22+", label: "Advanced Facilities" },
            { value: "50K+", label: "Sq. Ft. Facility" },
            { value: "24/7", label: "Production Support" }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg border border-gray-200 text-center"
            >
              <div className="text-2xl font-bold text-[#134698] mb-1">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </m.div>

        {/* Facilities List - 2 Columns */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {facilities.map((facility, idx) => (
                <m.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  className="flex items-center gap-2.5 group py-1"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#134698] flex-shrink-0" strokeWidth={2} />
                  <span className="text-sm text-gray-700">
                    {facility}
                  </span>
                </m.div>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
};

export default FacilityInfrastructure;