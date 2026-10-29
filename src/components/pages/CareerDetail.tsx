"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  ArrowRight,
  BarChart3,
  ChartNoAxesColumnIncreasing,
  Briefcase,
  Check,
  ChevronRight,
  ClipboardList,
  FileSearch,
  GraduationCap,
  Heart,
  Home,
  Lightbulb,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { cleanList, getJobImage, type Vacancy } from "@/components/pages/career/jobs";
import CvEligibility, { APPLY_EVENT } from "@/components/pages/career/CvEligibility";

import careerHero from "@/assets/career.webp";

const ROBOT_ANIMATION =
  "https://lottie.host/1b8c3f18-5a5d-4188-bb8a-2c22a9061098/Rftbn3Qe1p.lottie";

const HERO_HIGHLIGHTS = [
  { icon: Users, filled: true, stroke: 2, label: "Meaningful\nWork" },
  { icon: Lightbulb, filled: false, stroke: 2, label: "Innovative\nTeam" },
  { icon: ChartNoAxesColumnIncreasing, filled: false, stroke: 3.5, label: "Growth\nOpportunities" },
  { icon: Heart, filled: true, stroke: 1.5, label: "Real Impact\non Lives" },
];

const CULTURE_ICONS = [
  { icon: Users, filled: true, stroke: 2, label: "People" },
  { icon: Lightbulb, filled: false, stroke: 2, label: "Ideas" },
  { icon: ChartNoAxesColumnIncreasing, filled: false, stroke: 3.5, label: "Growth" },
];

const CARD_SHADOW =
  "shadow-[0px_1px_3px_0px_rgba(0,0,0,0.02),0px_0px_0px_1px_rgba(27,31,35,0.15)]";

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3 text-[13px] md:text-sm text-gray-700 leading-relaxed">
    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#DE802B] flex items-center justify-center flex-shrink-0">
      <Check className="w-3 h-3 text-white" strokeWidth={3} />
    </span>
    <span>{children}</span>
  </li>
);

const SectionHeading = ({ icon: Icon, children }: { icon: typeof ClipboardList; children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-5">
    <span className="w-12 h-12 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-white" />
    </span>
    <h2 className="font-display font-bold text-[#134698] text-xl md:text-2xl">{children}</h2>
    <span className="hidden sm:block flex-1 h-px bg-gray-200" />
  </div>
);

const CareerDetail = ({ job }: { job: Vacancy }) => {
  const [firstWord, ...restWords] = job.title.split(" ");
  const responsibilities = cleanList(job.responsibilities);
  const qualifications = cleanList(job.requirements);

  const meta = [
    { icon: MapPin, value: job.location },
    { icon: Briefcase, value: job.jobType },
    { icon: BarChart3, value: job.experience },
    { icon: GraduationCap, value: job.education },
  ].filter(item => item.value);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      <Topbar />
      <Navbar solid />

      {/* ============ HERO ============ */}
      {/* pt clears the fixed navbar (56px mobile / 72px sm+) */}
      <section className="relative bg-white pt-[56px] sm:pt-[72px] flex flex-col lg:block">
        {/* The asset already fades to white on the left; on lg a white gradient
            extends that fade further right, same as the Careers page */}
        <div className="relative order-2 h-56 sm:h-72 lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[72px] lg:h-auto">
          <Image
            src={careerHero}
            alt="Design House office building"
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-right lg:object-[25%_center]"
          />
          <div className="hidden lg:block absolute inset-y-0 left-0 w-[65%] bg-gradient-to-r from-white from-48% via-white/80 to-transparent pointer-events-none" />
        </div>

        <div className="relative order-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:pl-11 lg:pr-8 pt-6 pb-8 lg:pt-6 lg:pb-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-sm text-gray-600 mb-5">
            <Link href="/" className="inline-flex items-center gap-2 hover:text-[#134698] transition-colors">
              <Home className="w-4 h-4 text-[#134698]" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/career" className="hover:text-[#134698] transition-colors">Careers</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-800">{job.title}</span>
          </nav>

          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.42, 0, 0.58, 1] }}
            className="max-w-3xl"
          >
            {job.jobType && (
              <span className="inline-block bg-[#DE802B]/10 text-[#DE802B] text-sm font-bold uppercase tracking-[0.15em] px-3 py-1 rounded mb-1.5">
                {job.jobType}
              </span>
            )}

            <h1 className="font-display font-bold text-[#134698] text-[32px] sm:text-[42px] lg:text-[54px] leading-[1.1] mb-4">
              {firstWord}
              {restWords.length > 0 && (
                <>
                  {" "}
                  <span className="text-[#DE802B]">{restWords.join(" ")}</span>
                </>
              )}
            </h1>

            {meta.length > 0 && (
              <div className="flex flex-wrap items-center gap-y-2 text-[13px] md:text-sm text-gray-700 mb-5">
                {meta.map(({ icon: Icon, value }, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-2 pr-4 mr-4 ${i < meta.length - 1 ? "border-r border-gray-300" : ""}`}
                  >
                    <Icon className="w-4 h-4 text-[#DE802B]" />
                    {value}
                  </span>
                ))}
              </div>
            )}

            {job.description && (
              <p className="text-gray-900 text-[15px] md:text-base leading-relaxed mb-7 max-w-xl">
                {job.description}
              </p>
            )}

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-y-5">
              {HERO_HIGHLIGHTS.map(({ icon: Icon, filled, stroke, label }, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 px-2 sm:px-4 ${i > 0 ? "sm:border-l sm:border-gray-300" : ""}`}
                >
                  <span className="w-12 h-12 rounded-full border border-[#DE802B]/50 bg-white flex items-center justify-center flex-shrink-0">
                    <Icon
                      className="w-6 h-6 text-[#DE802B]"
                      fill={filled ? "currentColor" : "none"}
                      strokeWidth={stroke}
                    />
                  </span>
                  <span className="text-xs font-semibold text-[#134698] leading-tight whitespace-pre-line">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </m.div>
        </div>
      </section>

      {/* ============ DETAILS ============ */}
      <section className="pt-6 md:pt-8 pb-6 md:pb-8 px-4 sm:px-6 lg:px-0 bg-white">
        <div className="max-w-[1400px] mx-auto lg:pl-11 lg:pr-8 grid lg:grid-cols-[1fr_400px] gap-6 items-start">
          {/* Job details card */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`min-w-0 bg-white rounded-lg ${CARD_SHADOW} p-5 pt-3 md:p-8 md:pt-3 md:pb-6 grid md:grid-cols-[1fr_240px] lg:grid-cols-1 xl:grid-cols-[1fr_240px] gap-8`}
          >
            <div>
              {responsibilities.length > 0 && (
                <div className="mb-5">
                  <SectionHeading icon={ClipboardList}>Key Responsibilities</SectionHeading>
                  <ul className="space-y-3">
                    {responsibilities.map((item, i) => (
                      <CheckItem key={i}>{item}</CheckItem>
                    ))}
                  </ul>
                </div>
              )}

              {qualifications.length > 0 && (
                <div className="mb-8">
                  <SectionHeading icon={GraduationCap}>Qualifications &amp; Experience</SectionHeading>
                  <ul className="space-y-3">
                    {qualifications.map((item, i) => (
                      <CheckItem key={i}>{item}</CheckItem>
                    ))}
                  </ul>
                </div>
              )}

              {/* Applying starts with the CV: jump to the upload box (flagged red if empty) */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(APPLY_EVENT))}
                className="inline-flex items-center gap-2 bg-[#134698] hover:bg-[#DE802B] text-white text-sm font-semibold px-6 py-3 rounded-md shadow-lg transition-colors"
              >
                Apply for this Position
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden">
                <Image
                  src={getJobImage(job.order - 1)}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-3 w-full mt-6">
                {CULTURE_ICONS.map(({ icon: Icon, filled, stroke, label }, i) => (
                  <div
                    key={label}
                    className={`flex flex-col items-center gap-2 ${i > 0 ? "border-l border-gray-200" : ""}`}
                  >
                    <span className="w-14 h-14 rounded-full border border-[#DE802B]/50 bg-white flex items-center justify-center">
                      <Icon className="w-7 h-7 text-[#DE802B]" fill={filled ? "currentColor" : "none"} strokeWidth={stroke} />
                    </span>
                    <span className="text-sm font-semibold text-[#134698]">{label}</span>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-[11px] tracking-[0.2em] uppercase text-gray-500 whitespace-nowrap">For a Brighter Tomorrow</p>
              <div className="h-0.5 w-12 bg-[#DE802B] mt-3" />
            </div>
          </m.div>

          {/* AI eligibility card — design only for now, no analysis runs */}
          <m.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`relative min-w-0 bg-white rounded-lg ${CARD_SHADOW} p-5 md:p-6`}
          >
            {/* Robot sits beside the label, heading and intro text together */}
            <div className="flex items-center justify-between gap-1 mb-5">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-[#DE802B] mb-3">
                  Let AI Help You
                  <Sparkles className="w-4 h-4" />
                </p>

                <div className="flex items-start gap-3 mb-3">
                  <span className="w-10 h-10 rounded-lg border-2 border-[#DE802B] flex items-center justify-center flex-shrink-0">
                    <FileSearch className="w-5 h-5 text-[#DE802B]" />
                  </span>
                  <h2 className="font-display font-bold text-[#134698] text-lg leading-tight">
                    <span className="sm:whitespace-nowrap">Check Your Eligibility</span>
                    <br />
                    with AI
                  </h2>
                </div>

                <p className="text-[13px] lg:text-xs text-gray-600 leading-relaxed">
                  <span className="lg:whitespace-nowrap">Upload your CV and get an instant analysis</span>{" "}
                  <br className="hidden lg:block" />
                  <span className="lg:whitespace-nowrap">of how well your profile matches this position.</span>
                </p>
              </div>

              <div
                aria-hidden="true"
                className="w-24 h-24 sm:w-[104px] sm:h-[104px] flex-shrink-0 -mr-3 sm:-mr-6 lg:absolute lg:-right-6 lg:top-2 lg:w-[164px] lg:h-[160px] lg:mr-0"
              >
                <DotLottieReact src={ROBOT_ANIMATION} loop autoplay className="w-full h-full" />
              </div>
            </div>

            <CvEligibility job={job} />
          </m.aside>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareerDetail;
