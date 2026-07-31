"use client";

import { m } from "framer-motion";
import { CheckCircle, Heart, Clock, Shield } from "lucide-react";

const CustomerService = () => {
  const services = [
    {
      icon: Heart,
      title: "Client-Centric Approach",
      description: "Your vision at the forefront, ensuring each project is a collaborative journey towards success"
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Meticulous attention to detail and superior quality control in every aspect of execution"
    },
    {
      icon: Clock,
      title: "Timely Delivery",
      description: "Seamless transition from concept to reality with adherence to project timelines"
    },
    {
      icon: Shield,
      title: "Long-term Relationships",
      description: "Building enduring partnerships based on trust, understanding, and mutual growth"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#134698]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#DE802B]/5 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#DE802B]/10 to-[#134698]/10 rounded-full mb-4">
            <div className="w-2 h-2 bg-[#134698] rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-gray-700 tracking-wider">WHY CHOOSE US</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Customer{" "}
            <span className="text-[#134698] relative inline-block">
              Service
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C60 2, 140 2, 198 10" stroke="#DE802B" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>

          <p className="text-gray-600 leading-relaxed mt-4">
          Design House understands the requirement of clients and prepares itself to offer custom-made solutions more than the expected design/quality/cost and timelines of the clients. Our long-standing relations with our clients are evident in our approach.
          </p>
        </m.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, idx) => (
            <m.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="group"
            >
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#134698] hover:shadow-lg transition-all duration-300 h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-[#134698] to-[#1a5bb8] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            </m.div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default CustomerService;
