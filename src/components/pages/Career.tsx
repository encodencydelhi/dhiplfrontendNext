"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { m } from "framer-motion";

import {
  Briefcase,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { api } from "@/lib/api";
import { getJobImage, type Vacancy } from "@/components/pages/career/jobs";

import careerHero from "@/assets/career.webp";
import lifeImg1 from "@/assets/image/5.webp";
import lifeImg2 from "@/assets/image/2.webp";
import lifeImg3 from "@/assets/image/3.webp";
import lifeImg4 from "@/assets/image/6.webp";
import ctaImg from "@/assets/image/7.webp";
import highlightIcon1 from "@/assets/icon/1.png";
import highlightIcon2 from "@/assets/icon/2.png";
import highlightIcon3 from "@/assets/icon/3.png";
import highlightIcon4 from "@/assets/icon/4.png";
import purposeIcon from "@/assets/icon/5.png";

const HERO_HIGHLIGHTS = [
  { icon: highlightIcon1, label: "Innovative\nWork" },
  { icon: highlightIcon2, label: "Collaborative\nTeam" },
  { icon: highlightIcon3, label: "Sustainable\nImpact" },
  { icon: highlightIcon4, label: "Growth\nOpportunities" },
];

const WHY_WORK = [
  {
    icon: purposeIcon,
    title: "Purpose-Driven Work",
    text: "Contribute to projects that create lasting value for brands and communities.",
  },
  {
    icon: highlightIcon2,
    title: "Supportive Team Environment",
    text: "Work with collaborative\nand diverse teams\nwho inspire growth.",
  },
  {
    icon: highlightIcon3,
    title: "Learning & Growth",
    text: "Develop your skills with\ncontinuous learning\nand new challenges.",
  },
  {
    icon: highlightIcon4,
    title: "Real-World Impact",
    text: "Be part of infrastructure\nsolutions that build\nbetter spaces for tomorrow.",
  },
];

const LIFE_IMAGES = [
  { src: lifeImg1, alt: "Design House team reviewing a building design" },
  { src: lifeImg2, alt: "Design House team member at work" },
  { src: lifeImg3, alt: "Design House team discussing project plans" },
  { src: lifeImg4, alt: "Design House office lounge" },
];

const SectionLabel = ({ children, className = "mb-3" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-block text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#DE802B] ${className}`}>
    {children}
  </span>
);

// Light line drawing of a few office blocks, used either side of the "no openings" card.
// Drawn facing right; mirror it with -scale-x-100 for the right-hand side.
const BuildingSketch = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 300 160"
    preserveAspectRatio="xMinYMax meet"
    className={className}
    fill="none"
    stroke="#134698"
    strokeOpacity="0.22"
    strokeWidth="1"
    aria-hidden="true"
    style={{ maskImage: "linear-gradient(to right, black 40%, transparent)", WebkitMaskImage: "linear-gradient(to right, black 40%, transparent)" }}
  >
    {/* Ground */}
    <path d="M0 158h300" />
    {/* Tall tower */}
    <path d="M30 158V30l30-12v140M60 18l24 10v130" />
    {[40, 56, 72, 88, 104, 120, 136].map(y => (
      <path key={`t${y}`} d={`M34 ${y}h22M64 ${y + 2}h16`} />
    ))}
    <path d="M45 30v128M72 24v134" />
    {/* Mid block */}
    <path d="M90 158V70h50v88M90 70l14-10h50l-14 10M154 60v98" />
    {[82, 96, 110, 124, 138].map(y => (
      <path key={`m${y}`} d={`M94 ${y}h42`} />
    ))}
    <path d="M107 70v88M123 70v88" />
    {/* Low block */}
    <path d="M160 158v-48h70v48M160 110l10-8h70l-10 8M240 102v56" />
    {[120, 132, 144].map(y => (
      <path key={`l${y}`} d={`M164 ${y}h62`} />
    ))}
    <path d="M178 110v48M196 110v48M214 110v48" />
    {/* Trees */}
    <path d="M250 158v-14M250 144c-8 0-10-12-2-16 1-8 12-8 13 0 8 4 6 16-2 16z" />
    <path d="M275 158v-10M275 148c-6 0-7-9-1-11 1-6 9-6 10 0 6 2 5 11-1 11z" />
  </svg>
);

const Career = () => {
  const [jobs, setJobs] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVacancies();
  }, []);

  // Fetch vacancies from backend
  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/vacancies/active", {
        params: {
          limit: 100
        }
      });

      if (response.data.success) {
        const sortedJobs = response.data.vacancies.sort(
          (a: Vacancy, b: Vacancy) => a.order - b.order
        );
        setJobs(sortedJobs);
      }

    } catch (error) {
      console.error("Error fetching vacancies:", error);
      toast.error("Failed to load vacancies. Please try again later.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      <Topbar />
      <Navbar solid />

      {/* ============ HERO ============ */}
      {/* pt clears the fixed navbar (56px mobile / 72px sm+) */}
      <section className="relative bg-white pt-[56px] sm:pt-[72px] flex flex-col lg:block">
        {/* Background image — the asset already fades to white on the left. On lg a
            white gradient extends that fade further right so the text stays readable. */}
        <div className="relative order-2 h-56 sm:h-72 overflow-hidden lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[72px] lg:h-auto">
          <Image
            src={careerHero}
            alt="Design House office building"
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-right lg:object-[25%_center] lg:scale-[1.15] lg:origin-[100%_20%]"
          />
          {/* Soft "fog" instead of a straight edge: a solid white base under the text,
              then overlapping radial clouds so the fade line wanders, blurred at the end */}
          <div
            className="hidden lg:block absolute inset-y-0 left-0 w-[56%] pointer-events-none"
            style={{ background: "linear-gradient(to right, #fff 0%, #fff 60%, rgba(255,255,255,0.8) 77%, rgba(255,255,255,0.35) 91%, transparent 100%)" }}
          />
          {/* Fog clouds at different heights and depths break up the vertical line */}
          {[
            "left-[43%] top-[-6%] w-[16%] h-[36%]",
            "left-[47%] top-[25%] w-[12%] h-[29%]",
            "left-[41%] top-[49%] w-[18%] h-[33%]",
            "left-[48%] top-[75%] w-[13%] h-[35%]",
          ].map(pos => (
            <div key={pos} className={`hidden lg:block absolute ${pos} rounded-full bg-white/80 blur-3xl pointer-events-none`} />
          ))}
        </div>

        <div className="relative order-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:pl-11 lg:pr-8 pt-8 pb-8 lg:pt-6 lg:pb-5">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.42, 0, 0.58, 1] }}
            className="max-w-xl"
          >
            <SectionLabel className="mb-3 md:text-[15px]">Careers at Design House</SectionLabel>
            <h1 className="font-display font-bold text-[#134698] text-[32px] sm:text-[42px] lg:text-[56px] leading-[1.1] mb-4">
              Be a Part of a <br />
              <span className="text-[#DE802B]">Bigger and Brighter</span>
              <br /> Tomorrow
            </h1>
            <p className="text-gray-700 text-[15px] md:text-[17px] leading-relaxed mb-6 max-w-lg">
              Join Design House and help create innovative, sustainable spaces —
              retail stores, offices and interiors that make a lasting difference
              for brands, people and communities.
            </p>
            <button
              onClick={() => scrollToId("openings")}
              className="inline-flex items-center gap-2 bg-[#134698] hover:bg-[#DE802B] text-white font-semibold px-6 py-3 text-sm rounded-md shadow-lg transition-colors"
            >
              Explore Opportunities
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-8 lg:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-y-5 max-w-md">
              {HERO_HIGHLIGHTS.map(({ icon, label }, i) => (
                <div
                  key={label}
                  className={`flex flex-col items-center text-center px-2 ${i > 0 ? "sm:border-l sm:border-gray-300" : ""}`}
                >
                  <Image
                    src={icon}
                    alt=""
                    width={56}
                    height={56}
                    className="w-14 h-14 object-contain mb-2"
                  />
                  <span className="text-xs font-semibold text-[#134698] leading-tight whitespace-pre-line">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </m.div>
        </div>
      </section>

      {/* ============ CURRENT OPENINGS ============ */}
      <section id="openings" className="scroll-mt-24 pt-3 md:pt-3 pb-4 md:pb-5 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <SectionLabel className="mb-1">Current Openings</SectionLabel>
              <h2 className="font-display font-bold text-[#134698] text-2xl md:text-4xl mb-2">
                Join Our Team
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Explore exciting career opportunities and be part of a team{" "}
                <br className="hidden sm:block" />
                that is shaping a better, more sustainable tomorrow.
              </p>
            </m.div>

            <m.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex items-start gap-4 lg:max-w-sm lg:pt-8"
            >
              <span className="font-display font-bold text-6xl leading-[0.75] text-[#DE802B] select-none" aria-hidden="true">
                &ldquo;
              </span>
              <div>
                <p className="font-display font-bold text-xl md:text-2xl text-[#134698] leading-snug">
                  Great spaces are built
                  <br />
                  by great people, together.
                </p>
                <div className="h-0.5 w-16 bg-[#DE802B] mt-4" />
              </div>
            </m.div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#134698]"></div>
              <p className="mt-4 text-gray-600">Loading vacancies...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="relative overflow-hidden text-center px-6 py-10 md:py-12 bg-white rounded-lg border border-gray-200">
              {/* Line-drawn buildings fading in from both sides */}
              <BuildingSketch className="hidden md:block absolute left-0 bottom-0 h-full w-[30%]" />
              <BuildingSketch className="hidden md:block absolute right-0 bottom-0 h-full w-[30%] -scale-x-100" />

              <div className="relative">
                <span className="w-16 h-16 rounded-full border-2 border-[#DE802B] bg-white flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-7 h-7 text-[#DE802B]" />
                </span>
                <h3 className="font-display font-bold text-[#134698] text-xl md:text-2xl mb-2">No Open Positions at the Moment</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We appreciate your interest in joining Design House India Pvt. Ltd.
                  <br />
                  Please check back soon for new opportunities.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {jobs.map((job, index) => (
                <m.div
                  key={job._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    href={`/career/${job._id}`}
                    className="group h-full bg-white rounded shadow-[0px_1px_3px_0px_rgba(0,0,0,0.02),0px_0px_0px_1px_rgba(27,31,35,0.15)] flex flex-col overflow-hidden"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={getJobImage(job.order - 1)}
                        alt=""
                        fill
                        placeholder="blur"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-[#134698] mb-1.5">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-600 mb-2">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#DE802B]" />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-[#DE802B]" />
                          {job.jobType || job.experience}
                        </span>
                      </div>

                      {job.description && (
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">
                          {job.description}
                        </p>
                      )}

                      <span className="mt-auto w-full inline-flex items-center justify-center gap-2 border border-[#DE802B] text-[#DE802B] group-hover:bg-[#DE802B] group-hover:text-white font-semibold text-sm py-2 rounded-md transition-colors">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </m.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ WHY WORK WITH US ============ */}
      <section className="pt-2 md:pt-2 pb-4 md:pb-5 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 lg:items-start mb-6">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <SectionLabel className="mb-1">Why Work With Design House</SectionLabel>
              <h2 className="font-display font-bold text-[#134698] text-3xl md:text-5xl leading-tight">
                A Meaningful Career,
                <br />
                <span className="text-[#DE802B]">A Greater Impact</span>
              </h2>
            </m.div>
            <m.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[#134698] text-[15px] md:text-[17px] leading-relaxed lg:pt-4 lg:justify-self-end"
            >
              At Design House, you will be part of a passionate and{" "}
              <br className="hidden lg:block" />
              dedicated team that designs innovative, sustainable and{" "}
              <br className="hidden lg:block" />
              future-ready infrastructure solutions, shaping better{" "}
              <br className="hidden lg:block" />
              communities for tomorrow.
            </m.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_WORK.map(({ icon, title, text }, i) => (
              <m.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center bg-white rounded-lg shadow-[0px_1px_3px_rgba(0,0,0,0.12),0px_1px_2px_rgba(0,0,0,0.24)] px-6 pt-3 pb-5"
              >
                <Image
                  src={icon}
                  alt=""
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain mb-2"
                />
                <h3 className="font-display text-xl font-bold text-[#134698] mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[15rem] whitespace-pre-line">{text}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LIFE AT DESIGN HOUSE ============ */}
      <section className="pt-4 md:pt-5 pb-4 md:pb-5 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-12 lg:items-end mb-8">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <SectionLabel className="mb-1">Life at Design House</SectionLabel>
              <h2 className="font-display font-bold text-[#134698] text-3xl md:text-4xl leading-tight">
                People. Purpose.{" "}
                <span className="text-[#DE802B]">A Brighter Tomorrow.</span>
              </h2>
            </m.div>
            <m.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-gray-600 text-base leading-relaxed"
            >
              Our team works with creativity, commitment and a shared purpose — to
              design spaces that improve lives and create long-term value for
              communities.
            </m.p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {LIFE_IMAGES.map((img, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative aspect-[16/10] rounded-lg overflow-hidden shadow-soft group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="bg-white">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white overflow-hidden flex flex-col lg:flex-row lg:items-center"
        >
          <div className="relative h-32 sm:h-36 lg:h-auto lg:self-stretch lg:min-h-[110px] lg:ml-[max(2rem,(100vw_-_80rem)/2)] lg:w-[20rem] flex-shrink-0">
            <Image
              src={ctaImg}
              alt=""
              fill
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-left"
            />
            {/* Soft white fade so the image blends into the text side
                (to the right on desktop, downwards when stacked on mobile) */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-white lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-1/4 lg:bg-gradient-to-r" />
          </div>

          <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 px-4 sm:px-6 py-4 lg:py-3 lg:pl-2 lg:pr-[max(2rem,(100vw_-_80rem)/2)]">
            <h2 className="font-display font-bold text-[#134698] text-xl md:text-2xl leading-tight flex-shrink-0">
              Be Part of Something
              <br />
              <span className="text-[#DE802B] text-3xl md:text-4xl">Bigger</span>
            </h2>
            <p className="text-gray-900 text-sm md:text-[15px] leading-relaxed">
              Join Design House and help us create innovative,{" "}
              <br className="hidden xl:block" />
              <span className="xl:whitespace-nowrap">
                sustainable and people-centric spaces for a better tomorrow.
              </span>
            </p>
            <button
              onClick={() => scrollToId("openings")}
              className="lg:ml-auto self-start lg:self-center flex-shrink-0 inline-flex items-center gap-2 bg-[#134698] hover:bg-[#DE802B] text-white font-semibold text-sm px-6 py-3 rounded-md shadow-lg transition-colors"
            >
              Explore Opportunities
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </m.div>
      </section>

      <Footer />
    </div>
  );
};

export default Career;
