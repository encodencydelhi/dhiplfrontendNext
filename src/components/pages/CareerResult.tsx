"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  ChartColumnIncreasing,
  CircleAlert,
  CircleCheck,
  CircleX,
  ClipboardCheck,
  Eye,
  Download,
  FileText,
  GraduationCap,
  Headset,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Target,
  TriangleAlert,
  UserRound,
  UserRoundX,
  Users,
  Wrench,
} from "lucide-react";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import type { Vacancy } from "@/components/pages/career/jobs";
import { buildSuggestions, extractProfile, scoreCv, type CvProfile, type MatchResult } from "@/components/pages/career/cvMatch";
import { CountRing, CountText } from "@/components/pages/career/CountUp";
import { useCvSession } from "@/components/pages/career/useCvSession";
import {
  CARD,
  CareerBreadcrumb,
  ProfileSummary,
  SecureNote,
  Stepper,
  stepsFor,
  fileExtOf,
  formatSize,
  scoreTone,
} from "@/components/pages/career/ui";

import heroPhoto from "@/assets/image/done.webp";
import careerHero from "@/assets/career.webp";

const HR_EMAIL = "info@designhouse.co.in";
const HR_PHONE = "+91 9654900525";

type Label = MatchResult["label"];

// Copy for each match band — honest about where the candidate stands
const VERDICT: Record<Label, { title: string; text: string; quote: string }> = {
  "Strong Match": {
    title: "You are eligible to apply for this position.",
    text: "Your profile matches the key requirements of this role. We appreciate your interest in joining Design House.",
    quote: "With your relevant experience and skills, you can be a great fit\nfor our team. Keep going!",
  },
  "Moderate Match": {
    title: "",
    text: "Your profile shows good potential, but a few key areas need improvement. You can still apply after reviewing the suggestions below and updating your profile or CV.",
    quote: "We encourage you to apply if you are confident\nabout your relevant experience and skills.",
  },
  "Low Match": {
    title: "Your profile does not meet the key requirements for this position.",
    text: "Based on our AI analysis, your current profile does not match the minimum requirements for this role at Design House India Pvt. Ltd. However, we appreciate your interest and encourage you to explore other suitable opportunities or improve your profile for future openings.",
    quote: "Keep learning and growing. The right opportunity will\ncome at the right time.",
  },
};

// Bands shown next to the score ring; below 50% is "Not Eligible"
const LEGEND: { range: string; label: string; band: Label; dot: string }[] = [
  { range: "70 – 100%", label: "Strong Match", band: "Strong Match", dot: "bg-green-600" },
  { range: "50 – 69%", label: "Moderate Match", band: "Moderate Match", dot: "bg-[#F5A524]" },
  { range: "Below 50%", label: "Not Eligible", band: "Low Match", dot: "bg-red-500" },
];

const BREAKDOWN = [
  { icon: Briefcase, title: "Relevant Experience" },
  { icon: Wrench, title: "Skills & Tools" },
  { icon: GraduationCap, title: "Education & Qualification" },
  { icon: Users, title: "Communication & Teamwork" },
];

// Bar colour follows the score: red below 50, orange 50–69, green from 70
const barTone = (score: number) => (score >= 70 ? "bg-green-500" : score >= 50 ? "bg-[#F5A524]" : "bg-red-500");

const SectionTitle = ({ icon: Icon, children, small }: { icon: typeof Target; children: React.ReactNode; small?: boolean }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className="w-9 h-9 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-white" />
    </span>
    <h2 className={`font-sans font-semibold text-[#134698] ${small ? "text-[15px] leading-tight" : "text-base md:text-[17px]"}`}>{children}</h2>
  </div>
);

// Quote box used inside the verdict card
const Quote = ({ text, italic }: { text: string; italic?: boolean }) => (
  <blockquote className="relative rounded-lg border border-gray-200 bg-white/70 pl-3 pr-8 pt-2.5 pb-2.5 flex gap-2">
    <span className="font-display font-bold text-[44px] leading-[0.8] text-[#DE802B] select-none" aria-hidden="true">
      &ldquo;
    </span>
    <div className="min-w-0">
      <p className={`text-[13px] text-[#134698] leading-snug ${italic ? "italic" : ""}`}>
        {/* Each authored line stays on one line on wide screens */}
        {text.split("\n").map(line => (
          <span key={line} className="block xl:whitespace-nowrap">
            {line}
          </span>
        ))}
      </p>
      <p className="mt-1.5 flex items-center gap-2 text-[13px] font-semibold text-[#134698]">
        <span className="w-5 h-px bg-[#DE802B]" aria-hidden="true" />
        Talent Acquisition Team
      </p>
      <p className="pl-7 text-xs text-gray-600">Design House India Pvt. Ltd.</p>
    </div>
    <span className="absolute right-3 -bottom-1 font-display font-bold text-[44px] leading-none text-[#DE802B] select-none" aria-hidden="true">
      &rdquo;
    </span>
  </blockquote>
);

// Concrete gaps for a not-eligible result, from the weakest checks
function buildGaps(result: MatchResult, job: Vacancy, profile: CvProfile | null): string[] {
  const [experience, skills, education, teamwork] = result.checks.map(c => c.score);
  const gaps: string[] = [];
  if (education < 50) gaps.push(job.education ? `Required qualification (${job.education}) not found in your profile.` : "Required qualification not found in your profile.");
  if (experience < 50) gaps.push(`Relevant ${job.title.toLowerCase()} experience is not clearly shown.`);
  if (skills < 50)
    gaps.push(
      result.missingSkills.length
        ? `Experience with ${result.missingSkills.slice(0, 3).join(", ")} not mentioned.`
        : "Tools and skills listed in the job requirements are not mentioned."
    );
  if (teamwork < 50) gaps.push("Examples of communication and teamwork are missing.");
  if (job.location && !(profile?.location && job.location.toLowerCase().includes(profile.location.toLowerCase())))
    gaps.push(`Preferred location (${job.location}) is not mentioned.`);
  if (gaps.length < 3) gaps.push("Portfolio or work links are missing.");
  return gaps.slice(0, 5);
}

const CareerResult = ({ job }: { job: Vacancy }) => {
  const { key, cv, fileUrl } = useCvSession(job._id);

  const result = useMemo(() => (cv ? scoreCv(cv.text, job) : null), [cv, job]);
  const profile = useMemo(() => (cv ? extractProfile(cv.text) : null), [cv]);
  const suggestions = useMemo(() => (result ? buildSuggestions(result, job, profile) : []), [result, job, profile]);
  const gaps = useMemo(() => (result ? buildGaps(result, job, profile) : []), [result, job, profile]);
  const fileExt = fileExtOf(cv?.fileName);
  const verdict = result ? VERDICT[result.label] : null;
  const firstName = profile?.name?.split(/\s+/)[0];

  const isStrong = result?.label === "Strong Match";
  const isModerate = result?.label === "Moderate Match";
  const isLow = result?.label === "Low Match";

  const stepper = stepsFor(2);

  const breakdownSubs = [job.experience, "Tools & software", job.education || "Qualification", "Interpersonal & client handling"];

  const jobSummary = [
    { icon: UserRound, label: "Position", value: job.title },
    { icon: Building2, label: "Organization", value: "Design House India Pvt. Ltd." },
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Briefcase, label: "Employment Type", value: job.jobType },
    { icon: ClipboardCheck, label: "Experience Required", value: job.experience },
    { icon: GraduationCap, label: "Qualification", value: job.education },
  ].filter(r => r.value);

  const uploadedAt = cv?.uploadedAt
    ? new Date(cv.uploadedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  const [titleFirst, ...titleRest] = job.title.split(" ");
  const jobMeta = [
    { icon: MapPin, value: job.location },
    { icon: Briefcase, value: job.jobType },
    { icon: UserRound, value: job.experience },
    { icon: GraduationCap, value: job.education },
  ].filter(item => item.value);

  /* ─── Pieces shared between the variants ─── */

  const scoreLegend = (
    <ul className="space-y-2">
      {LEGEND.map(l => (
        <li
          key={l.label}
          className={`flex items-center gap-2 text-xs ${result && l.band === result.label ? "font-semibold text-[#134698]" : "text-gray-600"}`}
        >
          <span className={`w-3 h-3 rounded-full ${l.dot} flex-shrink-0`} />
          <span className="w-[68px] flex-shrink-0 whitespace-nowrap">{l.range}</span>
          <span>{l.label}</span>
        </li>
      ))}
    </ul>
  );

  const breakdownRows = (cols: string) =>
    result && (
      <div className={`grid ${cols} gap-x-8 gap-y-3`}>
        {result.checks.map((c, i) => {
          const { icon: Icon, title } = BREAKDOWN[i];
          return (
            <div key={c.label} className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-[#134698] flex-shrink-0" />
              <div className="min-w-0 w-[44%] flex-shrink-0">
                <p className="text-[13px] font-semibold text-[#134698] truncate">{title}</p>
                <p className="text-[11px] text-gray-500 truncate">{breakdownSubs[i]}</p>
              </div>
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                {/* Grows from 0 when the breakdown scrolls into view */}
                <m.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${c.score}%` }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.9, delay: 0.1 * i, ease: "easeOut" }}
                  className={`h-full rounded-full ${isStrong ? "bg-gradient-to-r from-[#E8902F] to-[#F5A524]" : barTone(c.score)}`}
                />
              </div>
              <CountText
                value={c.score}
                delayMs={100 * i}
                className={`w-10 text-right text-xs font-bold tabular-nums ${scoreTone(c.score)}`}
              />
            </div>
          );
        })}
      </div>
    );

  const tip = (text: string) => (
    <div className="rounded-lg bg-[#DE802B]/[0.07] px-4 py-2.5 flex items-start gap-3">
      <Lightbulb className="w-4 h-4 text-[#DE802B] flex-shrink-0 mt-0.5" />
      <p className="text-[13px] text-gray-700">
        <span className="font-semibold text-[#DE802B]">Tip:</span> {text}
      </p>
    </div>
  );

  const suggestionList = (
    <ol className={isModerate ? "space-y-3" : "space-y-1.5"}>
      {suggestions.slice(0, isModerate ? 4 : 5).map((s, i) => (
        <li key={s} className={`flex items-center gap-3 text-gray-700 leading-snug ${isModerate ? "text-[13px]" : "text-xs gap-2.5"}`}>
          <span
            className={`rounded-full bg-[#DE802B]/10 text-[#DE802B] font-bold flex items-center justify-center flex-shrink-0 ${
              isModerate ? "w-9 h-9 text-xs" : "w-5 h-5 text-[10px]"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );

  const helpCard = (
    <section className={`${CARD} px-5 py-4 flex items-start gap-3`}>
      <span className="w-11 h-11 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
        <Headset className="w-5 h-5 text-white" />
      </span>
      <div className="min-w-0">
        <p className="font-sans font-semibold text-[#134698] text-[15px]">{isLow ? "Need Help?" : "Need Any Assistance?"}</p>
        <p className="text-xs text-gray-600 mb-1.5">Feel free to reach out to our HR team at</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#134698]">
          <a href={`mailto:${HR_EMAIL}`} className="inline-flex items-center gap-1.5 hover:text-[#DE802B] transition-colors">
            <Mail className="w-3.5 h-3.5 text-[#DE802B]" />
            {HR_EMAIL}
          </a>
          <a href={`tel:${HR_PHONE.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-[#DE802B] transition-colors">
            <Phone className="w-3.5 h-3.5 text-[#DE802B]" />
            {HR_PHONE}
          </a>
        </div>
      </div>
    </section>
  );

  const cvCard = (
    <section className={`${CARD} px-5 py-4`}>
      <h2 className="font-sans font-bold text-[#134698] text-[15px] mb-3">Your CV</h2>
      <div className="flex items-start gap-3">
        <span className="relative flex-shrink-0">
          <FileText className="w-11 h-11 text-[#134698]" strokeWidth={1.6} />
          <CircleCheck className="w-5 h-5 absolute -bottom-1 -right-1 text-white fill-[#134698]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#134698] truncate">{cv?.fileName ?? "…"}</p>
          <p className="text-xs text-gray-500 flex flex-wrap items-center gap-x-2">
            {cv && <span>{formatSize(cv.fileSize)}</span>}
            {uploadedAt && (
              <>
                <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
                <span>{uploadedAt}</span>
              </>
            )}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] font-semibold">
            {fileUrl && (
              <a
                href={fileUrl}
                {...(fileExt === "PDF" ? { target: "_blank", rel: "noopener noreferrer" } : { download: cv?.fileName })}
                className="inline-flex items-center gap-1.5 text-[#134698] hover:text-[#DE802B] transition-colors"
              >
                {fileExt === "PDF" ? <Eye className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                {fileExt === "PDF" ? "View File" : "Download File"}
              </a>
            )}
            <Link href={`/career/${job._id}`} className="inline-flex items-center gap-1.5 text-[#134698] hover:text-[#DE802B] transition-colors">
              <RefreshCw className="w-4 h-4" />
              Upload Different CV
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  /* ─── Page ─── */

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      <Topbar />
      <Navbar solid />

      <div className="pt-[56px] sm:pt-[72px]">
        {/* Not eligible: job header with the building photo, like the job detail page */}
        {isLow && (
          <section className="relative">
            <div className="hidden lg:block absolute inset-y-0 right-0 w-[55%]">
              <Image src={careerHero} alt="" fill priority placeholder="blur" sizes="55vw" className="object-cover object-[70%_40%]" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 via-30% to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
              <p className="absolute top-8 right-10 border-l-2 border-[#DE802B] pl-3 font-display font-bold text-[#134698] text-2xl leading-tight">
                Building
                <br />
                Better Spaces
                <br />
                Together
              </p>
            </div>
            <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:pl-11 lg:pr-8 pt-6 pb-2">
              <CareerBreadcrumb jobId={job._id} jobTitle={job.title} current="AI Screening Result" />
              <div className="max-w-3xl">
                {job.jobType && (
                  <span className="inline-block bg-[#DE802B]/10 text-[#DE802B] text-sm font-bold uppercase tracking-[0.15em] px-3 py-1 rounded mb-3">
                    {job.jobType}
                  </span>
                )}
                <h1 className="font-display font-bold text-[#134698] text-[32px] sm:text-[42px] lg:text-[50px] leading-[1.1] mb-3">
                  {titleFirst}
                  {titleRest.length > 0 && <span className="text-[#DE802B]"> {titleRest.join(" ")}</span>}
                </h1>
                <div className="flex flex-wrap items-center gap-y-2 text-[13px] md:text-sm text-gray-700 mb-5">
                  {jobMeta.map(({ icon: Icon, value }, i) => (
                    <span key={i} className={`inline-flex items-center gap-2 pr-4 mr-4 ${i < jobMeta.length - 1 ? "border-r border-gray-300" : ""}`}>
                      <Icon className="w-4 h-4 text-[#DE802B]" />
                      {value}
                    </span>
                  ))}
                </div>
                <Stepper steps={stepper} reach={2} lineDone={false} />
              </div>
            </div>
          </section>
        )}

        <div className={`max-w-[1400px] mx-auto px-4 sm:px-6 lg:pl-11 lg:pr-8 pb-14 ${isLow ? "pt-4" : "pt-6"}`}>
          {!isLow && <CareerBreadcrumb jobId={job._id} jobTitle={job.title} current="AI Screening Result" />}

          {cv === null ? (
            <div className={`${CARD} max-w-xl mx-auto text-center px-6 py-12 mt-6`}>
              <span className="w-14 h-14 rounded-full bg-[#DE802B]/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-[#DE802B]" />
              </span>
              <h1 className="font-display font-bold text-[#134698] text-2xl mb-2">No CV found</h1>
              <p className="text-sm text-gray-600 mb-6">
                Please upload your CV on the job page and click &ldquo;Check Eligibility&rdquo; to see your result.
              </p>
              <Link
                href={`/career/${job._id}`}
                className="inline-flex items-center gap-2 bg-[#134698] hover:bg-[#DE802B] text-white text-sm font-semibold px-6 py-3 rounded-md transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {job.title}
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">
              {/* ═════════ LEFT ═════════ */}
              <div className="min-w-0 space-y-5">
                {!isLow && (
                  <div>
                    <Link
                      href={`/career/${job._id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#134698] hover:text-[#DE802B] transition-colors mb-3"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Job Details
                    </Link>
                    <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#DE802B] mb-0.5">Careers at Design House</p>
                    <h1 className="font-display font-bold text-[#134698] text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.1] mb-3">
                      AI Screening <span className="text-[#DE802B]">Result</span>
                    </h1>
                    <p className="text-gray-700 text-[15px] md:text-base leading-relaxed max-w-2xl">
                      Here is your profile match and analysis for the applied position.
                    </p>
                    <div className="h-0.5 w-12 bg-[#DE802B] mt-3 mb-3" />
                    <Stepper steps={stepper} reach={2} lineDone={false} />
                  </div>
                )}

                {/* Verdict */}
                {result && verdict && (
                  <m.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`${CARD} grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] overflow-hidden ${isLow ? "!bg-red-50/40" : ""}`}
                  >
                    <div className="relative h-44 md:h-auto">
                      <Image src={heroPhoto} alt="" fill placeholder="blur" sizes="(max-width: 768px) 100vw, 440px" className="object-cover object-[50%_30%]" />
                    </div>
                    <div className="px-5 py-4">
                      {isStrong && (
                        <>
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                              <CircleCheck className="w-5 h-5 text-white" />
                            </span>
                            <h2 className="font-display font-bold text-[#134698] text-2xl md:text-[28px] leading-tight">
                              Great News
                              {firstName && <span className="text-[#DE802B]">, {firstName}</span>}!
                            </h2>
                          </div>
                          <p className="font-sans font-semibold text-[#134698] text-sm mb-1">{verdict.title}</p>
                        </>
                      )}

                      {isModerate && (
                        <div className="flex items-start gap-3 mb-2">
                          <span className="w-12 h-12 rounded-full bg-[#F5A524] flex items-center justify-center flex-shrink-0">
                            <CircleAlert className="w-7 h-7 text-white" strokeWidth={2.4} />
                          </span>
                          <h2 className="font-display font-bold text-[#134698] text-2xl md:text-[28px] leading-tight">
                            You&apos;re a <span className="text-[#DE802B]">Partially Matched</span> Candidate{firstName ? `, ${firstName}` : ""}!
                          </h2>
                        </div>
                      )}

                      {isLow && (
                        <div className="flex items-start gap-3 mb-1.5">
                          <span className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                            <CircleX className="w-7 h-7 text-white" strokeWidth={2.4} />
                          </span>
                          <div>
                            <h2 className="font-display font-bold text-[#134698] text-2xl md:text-[28px] leading-tight">
                              <span className="text-red-600">Currently Not Eligible{firstName ? "," : ""}</span> {firstName}
                            </h2>
                            <p className="font-display font-bold text-[#134698] text-base leading-snug mt-1">{verdict.title}</p>
                          </div>
                        </div>
                      )}

                      <p className="text-[12.5px] text-gray-700 leading-snug mb-3">{verdict.text}</p>
                      <Quote text={verdict.quote} italic={isLow} />
                    </div>
                  </m.section>
                )}

                {/* Strong: profile match + suggestions, then breakdown */}
                {result && isStrong && (
                  <>
                    <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-5">
                      <section className={`${CARD} px-5 py-4`}>
                        <SectionTitle icon={ChartColumnIncreasing}>Your Profile Match</SectionTitle>
                        <div className="flex items-center gap-4">
                          <CountRing value={result.score} className="w-[132px] h-[132px] flex-shrink-0">
                            {v => (
                              <>
                                <span className="font-sans font-bold text-[#134698] text-[26px] leading-none tabular-nums">{v}%</span>
                                <span className="text-[10px] text-gray-500 mt-0.5">Match Score</span>
                              </>
                            )}
                          </CountRing>
                          {scoreLegend}
                        </div>
                      </section>
                      <section className={`${CARD} px-5 py-4`}>
                        <SectionTitle icon={Target} small>
                          Key Suggestions to Strengthen Your Profile
                        </SectionTitle>
                        {suggestionList}
                      </section>
                    </div>
                    <section className={`${CARD} px-5 py-4`}>
                      <SectionTitle icon={ChartColumnIncreasing}>Detailed Match Breakdown</SectionTitle>
                      <p className="text-[13px] text-gray-600 -mt-2 mb-4">Here&apos;s how your profile aligns with the key requirements.</p>
                      {breakdownRows("md:grid-cols-2")}
                      <div className="mt-4">{tip("Update your CV with more relevant experience and highlight your key skills to increase your match score.")}</div>
                    </section>
                  </>
                )}

                {/* Moderate: suggestions next to the breakdown, then a tip */}
                {result && isModerate && (
                  <>
                    <div className="grid md:grid-cols-2 gap-5">
                      <section className={`${CARD} px-5 py-4`}>
                        <SectionTitle icon={Target} small>
                          Key Suggestions to Improve Your Match
                        </SectionTitle>
                        {suggestionList}
                      </section>
                      <section className={`${CARD} px-5 py-4`}>
                        <SectionTitle icon={BarChart3} small>
                          Detailed Match Breakdown
                        </SectionTitle>
                        {breakdownRows("grid-cols-1")}
                      </section>
                    </div>
                    {tip("Update your CV with more relevant experience, improve your portfolio and highlight your key skills to increase your match score and improve your chances.")}
                  </>
                )}

                {/* Not eligible: match level + key gaps, then the breakdown */}
                {result && isLow && (
                  <>
                    <div className="grid md:grid-cols-2 gap-5">
                      <section className={`${CARD} px-5 py-4 flex items-center gap-4`}>
                        <CountRing value={result.score} variant="progress" color="#DC2626" className="w-[124px] h-[124px] flex-shrink-0">
                          {v => (
                            <>
                              <span className="font-sans font-bold text-red-600 text-[28px] leading-none tabular-nums">{v}%</span>
                              <span className="text-[11px] font-semibold text-[#134698] mt-0.5">Match Score</span>
                            </>
                          )}
                        </CountRing>
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 font-sans font-semibold text-[#134698] text-[15px] mb-1">
                            <UserRoundX className="w-5 h-5 text-red-600" />
                            Match Level: <span className="text-red-600">Not Eligible</span>
                          </p>
                          <p className="text-xs text-gray-600 leading-snug mb-3">Your profile does not meet the minimum requirements for this position.</p>
                          {scoreLegend}
                        </div>
                      </section>
                      <section className={`${CARD} !bg-red-50/40 px-5 py-4`}>
                        <p className="flex items-center gap-2 font-sans font-semibold text-[#134698] text-[15px] mb-3">
                          <TriangleAlert className="w-5 h-5 text-red-600" />
                          Key Gaps in Your Profile
                        </p>
                        <ol className="space-y-2">
                          {gaps.map((g, i) => (
                            <li key={g} className="flex items-start gap-2.5 text-xs text-gray-700 leading-snug">
                              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                {i + 1}
                              </span>
                              <span className="pt-0.5">{g}</span>
                            </li>
                          ))}
                        </ol>
                      </section>
                    </div>
                    <section className={`${CARD} px-5 py-4`}>
                      <SectionTitle icon={BarChart3}>Detailed Match Breakdown</SectionTitle>
                      <p className="text-[13px] text-gray-600 -mt-2 mb-4">Here&apos;s how your profile aligns with the job requirements.</p>
                      {breakdownRows("md:grid-cols-2")}
                      <div className="mt-4">
                        {tip("Upgrade your qualifications, gain relevant experience and highlight your projects and portfolio to improve your chances for future opportunities.")}
                      </div>
                    </section>
                  </>
                )}
              </div>

              {/* ═════════ RIGHT ═════════ */}
              <aside className="min-w-0 space-y-5">
                <ProfileSummary profile={profile} title="Your Profile" />

                {/* Moderate: applied position + profile match; others: the CV */}
                {isModerate && result ? (
                  <>
                    <section className={`${CARD} px-5 py-4 flex items-center gap-3`}>
                      <span className="w-11 h-11 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-white" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-600">Applied Position</p>
                        <p className="font-sans font-semibold text-[#134698] text-[15px] mb-1">{job.title}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#134698]">
                          {job.jobType && (
                            <span className="inline-flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-[#DE802B]" />
                              {job.jobType}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#DE802B]" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </section>
                    <section className={`${CARD} px-5 py-4 flex items-center gap-4`}>
                      <CountRing value={result.score} variant="progress" color="#F5A524" className="w-[112px] h-[112px] flex-shrink-0">
                        {v => (
                          <>
                            <span className="font-sans font-bold text-[#134698] text-[24px] leading-none tabular-nums">{v}%</span>
                            <span className="text-[10px] text-gray-500 mt-0.5">Match Score</span>
                          </>
                        )}
                      </CountRing>
                      <div className="min-w-0">
                        <p className="font-sans font-semibold text-[#134698] text-[15px] mb-2">Profile Match</p>
                        {scoreLegend}
                      </div>
                    </section>
                  </>
                ) : (
                  cvCard
                )}

                {/* Job summary + actions */}
                <section className={`${CARD} px-5 py-4`}>
                  <h2 className="font-sans font-bold text-[#134698] text-[15px] mb-2">Job Summary</h2>
                  <dl className="divide-y divide-gray-100">
                    {jobSummary.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="grid grid-cols-[20px_1fr_1.2fr] items-center gap-2 py-1.5 text-xs">
                        <Icon className="w-4 h-4 text-[#DE802B]" />
                        <dt className="text-gray-900">{label}</dt>
                        <dd className="text-[#134698] font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {isLow ? (
                    <Link
                      href="/career#openings"
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#134698] hover:bg-[#DE802B] text-white text-sm font-semibold py-3 rounded-md transition-colors"
                    >
                      Explore Other Jobs
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/career/${job._id}/review?cv=${key}`}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#134698] hover:bg-[#DE802B] text-white text-sm font-semibold py-3 rounded-md transition-colors"
                    >
                      {isModerate ? "Continue & Apply for This Opportunity" : "Continue & Apply for This Job"}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </section>

                {helpCard}

                {!isModerate && <SecureNote />}
              </aside>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CareerResult;
