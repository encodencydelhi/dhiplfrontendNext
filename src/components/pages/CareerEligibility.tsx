"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Briefcase,
  Check,
  CircleCheck,
  ClipboardList,
  Download,
  ExternalLink,
  Clock,
  FileText,
  GraduationCap,
  Lightbulb,
  Loader2,
  MapPin,
  Search,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import type { Vacancy } from "@/components/pages/career/jobs";
import { extractProfile, scoreCv } from "@/components/pages/career/cvMatch";
import ScoreRing from "@/components/pages/career/ScoreRing";
import { useCvSession } from "@/components/pages/career/useCvSession";
import {
  CARD,
  CareerBreadcrumb,
  FileTypeIcon,
  LABEL_STYLES,
  ProfileSummary,
  SecureNote,
  Stepper,
  stepsFor,
  fileExtOf,
  formatSize,
  scoreTone,
} from "@/components/pages/career/ui";

// Analysis steps, in the order they run. `col` places them either side of the ring.
const STEPS = [
  { icon: FileText, title: "Reading Your CV", text: "Extracting key information from your profile", col: 0 },
  { icon: Search, title: "Matching Skills", text: "Comparing your skills with job requirements", col: 0 },
  { icon: Briefcase, title: "Checking Experience", text: "Analysing relevant work experience", col: 0 },
  { icon: GraduationCap, title: "Verifying Education", text: "Checking qualifications and certifications", col: 1 },
  { icon: Settings, title: "Analysing Competencies", text: "Assessing role-specific skills and expertise", col: 1 },
  { icon: BarChart3, title: "Calculating Match Score", text: "Generating your eligibility score", col: 1 },
];
const STEP_MS = 1300;
const TOTAL_MS = STEP_MS * STEPS.length;

const NEXT_STEPS = [
  { title: "AI Profile Analysis", text: "We analyse your CV for relevant skills, qualifications and experience." },
  { title: "Eligibility Result", text: "See your match score and tips to strengthen your profile." },
  { title: "Application Submission", text: "Submit your application to our HR team." },
  { title: "Confirmation", text: "Our HR team will reach out if your profile is shortlisted." },
];


const StepState = ({ state }: { state: "done" | "active" | "pending" }) =>
  state === "done" ? (
    <span className="w-7 h-7 rounded-full bg-[#DE802B] flex items-center justify-center flex-shrink-0">
      <Check className="w-4 h-4 text-white" strokeWidth={3} />
    </span>
  ) : state === "active" ? (
    <Loader2 className="w-7 h-7 text-[#DE802B] animate-spin flex-shrink-0" />
  ) : (
    <span className="w-7 h-7 rounded-full border-[3px] border-gray-200 flex-shrink-0" />
  );

const CareerEligibility = ({ job }: { job: Vacancy }) => {
  const { key, cv, fileUrl } = useCvSession(job._id);
  const [elapsed, setElapsed] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [fileMissing, setFileMissing] = useState(false);

  const result = useMemo(() => (cv ? scoreCv(cv.text, job) : null), [cv, job]);
  const profile = useMemo(() => (cv ? extractProfile(cv.text) : null), [cv]);
  const fileExt = fileExtOf(cv?.fileName);
  const done = elapsed >= TOTAL_MS;
  const progress = Math.round((Math.min(elapsed, TOTAL_MS) / TOTAL_MS) * 100);

  // Run the analysis timeline
  useEffect(() => {
    if (!cv) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = now - start;
      setElapsed(t);
      if (t < TOTAL_MS) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [cv]);

  // Count the match score up once analysis finishes
  useEffect(() => {
    if (!done || !result) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1200);
      setDisplayScore(Math.round(result.score * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [done, result]);

  const stepState = (i: number): "done" | "active" | "pending" =>
    elapsed >= (i + 1) * STEP_MS ? "done" : elapsed >= i * STEP_MS ? "active" : "pending";

  const stepper = done
    ? stepsFor(2, "Ready")
    : [
        ...stepsFor(1, "In Progress").slice(0, 2),
        ...stepsFor(1).slice(2).map(st => ({ ...st, state: "Pending" })),
      ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      <Topbar />
      <Navbar solid />

      <div className="pt-[56px] sm:pt-[72px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:pl-11 lg:pr-8 pt-6 pb-14">
          <CareerBreadcrumb jobId={job._id} jobTitle={job.title} current="Eligibility Check" />

          {cv === null ? (
            /* ── No CV handed over (opened directly, or storage cleared) ── */
            <div className={`${CARD} max-w-xl mx-auto text-center px-6 py-12 mt-6`}>
              <span className="w-14 h-14 rounded-full bg-[#DE802B]/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-[#DE802B]" />
              </span>
              <h1 className="font-display font-bold text-[#134698] text-2xl mb-2">No CV found</h1>
              <p className="text-sm text-gray-600 mb-6">
                Please upload your CV on the job page and click &ldquo;Check Eligibility&rdquo; to start the analysis.
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
                {/* Heading + stepper */}
                <div>
                  <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#DE802B] mb-0.5">
                    Careers at Design House
                  </p>
                  <h1 className="font-display font-bold text-[#134698] text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.1] mb-3">
                    {done ? "Analysis " : "Application in "}
                    <span className="text-[#DE802B]">{done ? "Complete" : "Progress"}</span>
                  </h1>
                  <p className="text-gray-700 text-[15px] md:text-base leading-relaxed max-w-3xl">
                    {done
                      ? "Your CV has been analysed against this role's requirements, and your profile match is ready."
                      : "We're analysing your CV against the requirements of this role. Here's an update on the progress so far."}
                  </p>
                  <div className="h-0.5 w-12 bg-[#DE802B] mt-3 mb-3" />

                  <Stepper steps={stepper} reach={done ? 1 : progress / 100} lineDone={done} />
                </div>

                {/* Uploaded CV */}
                <section className={`${CARD} px-5 pt-3 pb-4`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-9 h-9 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-4 h-4 text-white" />
                    </span>
                    <h2 className="font-display font-bold text-[#134698] text-base md:text-lg">Uploaded CV</h2>
                  </div>
                  <div className="grid md:grid-cols-[1.4fr_1fr] gap-3">
                    <a
                      href={fileUrl ?? undefined}
                      // PDFs open in a new tab; Word files can't be shown by the browser, so they download
                      {...(fileExt === "PDF" ? { target: "_blank", rel: "noopener noreferrer" } : { download: cv?.fileName })}
                      role="button"
                      onClick={e => {
                        if (!fileUrl) {
                          e.preventDefault();
                          setFileMissing(true);
                        }
                      }}
                      title={fileExt === "PDF" ? "Open CV" : "Download CV"}
                      className="group cursor-pointer rounded-lg border border-gray-200 px-3 py-2.5 flex items-center gap-3 transition-colors hover:border-[#134698]/40 hover:bg-[#134698]/[0.03]"
                    >
                      <FileTypeIcon ext={fileExt} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#134698] truncate group-hover:underline">{cv?.fileName ?? "…"}</p>
                        <p className="text-xs text-gray-500 flex items-center flex-wrap gap-x-3 gap-y-0.5">
                          <span>Uploaded successfully</span>
                          {cv && (
                            <>
                              <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
                              <span>{fileExt}</span>
                              <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
                              <span>{formatSize(cv.fileSize)}</span>
                            </>
                          )}
                        </p>
                      </div>
                      {cv && (
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#134698]/[0.06] group-hover:bg-[#134698] flex items-center justify-center transition-colors">
                          {fileExt === "PDF" ? (
                            <ExternalLink className="w-4 h-4 text-[#134698] group-hover:text-white" />
                          ) : (
                            <Download className="w-4 h-4 text-[#134698] group-hover:text-white" />
                          )}
                        </span>
                      )}
                    </a>
                    <div className="rounded-lg bg-green-50 border border-green-100 px-3 py-2.5 flex items-center gap-3">
                      <CircleCheck className="w-8 h-8 text-white fill-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-sans font-semibold text-green-800">CV Received</p>
                        <p className="text-xs text-green-900/70">
                          {done ? "Your profile has been analysed." : "Your profile is now being analysed."}
                        </p>
                      </div>
                    </div>
                  </div>
                  {fileMissing && !fileUrl && (
                    <p className="mt-2 text-xs text-red-600">
                      The CV file isn't available in this tab. Please upload your CV again on the job page and click &ldquo;Check Eligibility&rdquo;.
                    </p>
                  )}
                </section>

                {/* Analysis */}
                <section className={`${CARD} px-5 py-4`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <span className="w-9 h-9 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-[#F5B041]" />
                      </span>
                      <div>
                        <h2 className="font-display font-bold text-[#134698] text-base md:text-lg">
                          AI Analysis {done ? "Complete" : "in Progress"}
                        </h2>
                        <p className="text-[13px] text-gray-600">
                          {done
                            ? "Your profile has been compared with the job requirements."
                            : "Please wait while we analyse your profile against the job requirements."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 self-start">
                      <Clock className="w-5 h-5 text-[#134698]" />
                      <p className="text-[11px] text-gray-600 leading-snug">
                        This usually takes
                        <br />a few seconds.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[1fr_200px_1fr] gap-3 items-center">
                    {[0, 1].map(col => (
                      <div key={col} className={`space-y-2 ${col === 1 ? "md:order-3" : ""}`}>
                        {STEPS.map((s, i) =>
                          s.col !== col ? null : (
                            <div key={s.title} className="rounded-lg border border-gray-200 px-3 py-2 flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-[#134698]/[0.07] flex items-center justify-center flex-shrink-0">
                                <s.icon className="w-4 h-4 text-[#134698]" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="font-sans font-semibold text-[#134698] text-[13px]">{s.title}</p>
                                <p className="text-[11px] text-gray-500 leading-snug">{s.text}</p>
                              </div>
                              <StepState state={stepState(i)} />
                            </div>
                          )
                        )}
                      </div>
                    ))}

                    <ScoreRing value={progress} variant="progress" width={8} className="w-[195px] h-[195px] mx-auto md:order-2">
                      <span className="font-sans font-bold text-[#134698] text-[32px] leading-none tabular-nums">
                        {progress}%
                      </span>
                      <span className="font-sans font-semibold text-[#134698] text-[14px] mt-1">
                        {done ? "Complete" : "Analysing…"}
                      </span>
                      <span className="text-[11px] text-gray-500 leading-snug px-8 mt-0.5">
                        {done ? "Your match score is ready" : "Extracting skills, experience and qualifications"}
                      </span>
                    </ScoreRing>
                  </div>
                </section>

                {/* Status note */}
                <section className={`${CARD.replace("bg-white", "bg-[#F7F9FC]")} px-5 py-4 flex items-center gap-4`}>
                  <span className="w-12 h-12 rounded-full bg-[#DE802B]/10 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-[#DE802B]" />
                  </span>
                  <div className="flex-1">
                    <p className="font-sans font-semibold text-[#134698] text-[15px]">
                      Please keep this page open
                    </p>
                    <p className="text-[12px] text-gray-500 leading-snug mt-0.5">
                      {done
                        ? "Your analysis is complete. Click “View Your Result” to see your detailed eligibility result."
                        : "Do not refresh or close this page while the analysis is in progress. Your match score will appear as soon as it's complete."}
                    </p>
                  </div>
                </section>
              </div>

              {/* ═════════ RIGHT ═════════ */}
              <aside className="min-w-0 space-y-5">
                <ProfileSummary profile={profile} title="Your Application Summary" />

                {/* Position */}
                <section className={`${CARD} px-5 py-4 flex items-center gap-3`}>
                  <span className="w-9 h-9 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-white" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600">Position Applied For</p>
                    <p className="font-sans font-bold text-[#134698] text-base mb-1">{job.title}</p>
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

                {/* What next */}
                <section className={`${CARD} px-5 py-4`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-9 h-9 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-4 h-4 text-white" />
                    </span>
                    <h2 className="font-display font-bold text-[#134698] text-base">What Happens Next?</h2>
                  </div>
                  <ol className="relative space-y-2.5 pl-1">
                    <span className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-gray-200" aria-hidden="true" />
                    {NEXT_STEPS.map((s, i) => {
                      const tone = i === 0 ? (done ? "done" : "active") : "pending";
                      return (
                        <li key={s.title} className="relative flex gap-3">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              tone === "done" ? "bg-green-600 text-white" : tone === "active" ? "bg-[#DE802B] text-white" : "bg-gray-300 text-white"
                            }`}
                          >
                            {tone === "done" ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
                          </span>
                          <div>
                            <p className="font-sans font-semibold text-[#134698] text-[13px]">{s.title}</p>
                            <p className="text-xs text-gray-600 leading-snug">{s.text}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </section>

                {/* Profile match */}
                <section className={`${CARD} px-5 py-4`}>
                  <div className="flex items-center gap-4">
                    <ScoreRing value={done ? displayScore : 0} className="w-[92px] h-[92px] flex-shrink-0">
                      {done ? (
                        <>
                          <span className="font-sans font-bold text-[#134698] text-[17px] leading-none tabular-nums">
                            {displayScore}%
                          </span>
                          <span className="text-[8px] text-gray-500 mt-0.5">Match Score</span>
                        </>
                      ) : (
                        <Loader2 className="w-7 h-7 text-[#DE802B] animate-spin" />
                      )}
                    </ScoreRing>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <p className="font-display font-bold text-[#134698] text-base leading-tight">Your Profile Match</p>
                        {done && result && (
                          <m.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold border rounded px-1.5 py-0.5 ${LABEL_STYLES[result.label]}`}
                          >
                            <Star className="w-3 h-3 fill-current" />
                            {result.label}
                          </m.span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-snug">
                        {done && result ? result.summary : "Your score will appear once the analysis is complete."}
                      </p>
                    </div>
                  </div>

                  {done && result && (
                    <m.ul
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-3 pt-3 border-t border-gray-100 space-y-1.5"
                    >
                      {result.checks.map(c => (
                        <li key={c.label} className="flex items-center gap-3 text-xs text-gray-700">
                          <span className="flex-1">{c.label}</span>
                          <span className={`font-bold tabular-nums ${scoreTone(c.score)}`}>{c.score}%</span>
                        </li>
                      ))}
                    </m.ul>
                  )}

                  {/* The candidate moves on when ready — no automatic redirect */}
                  {done && result && (
                    <m.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                      <Link
                        href={`/career/${job._id}/result?cv=${key}`}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#134698] hover:bg-[#DE802B] text-white text-sm font-semibold py-3 rounded-md transition-colors"
                      >
                        View Your Result
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </m.div>
                  )}
                </section>

                <SecureNote />
              </aside>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CareerEligibility;
