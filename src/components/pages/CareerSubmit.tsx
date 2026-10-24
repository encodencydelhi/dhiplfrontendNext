"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronRight,
  ClipboardList,
  FileSearch,
  FileText,
  Headset,
  Leaf,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  Settings,
  Star,
  UserRound,
  Users,
  X,
} from "lucide-react";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { api } from "@/lib/api";
import { useSettings } from "@/hooks/useSettings";
import careerHero from "@/assets/career.webp";
import type { Vacancy } from "@/components/pages/career/jobs";
import { extractProfile, scoreCv, type CvProfile } from "@/components/pages/career/cvMatch";
import { loadCvFile } from "@/components/pages/career/cvHandoff";
import { CountRing } from "@/components/pages/career/CountUp";
import { useCvSession } from "@/components/pages/career/useCvSession";
import { CARD, CareerBreadcrumb, LABEL_STYLES, ProfileSummary, SecureNote, Stepper, stepsFor } from "@/components/pages/career/ui";

/* ─── Options ─── */

const LOCATIONS = ["Delhi NCR", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "On-site (Events)", "Remote"];
const NOTICE = ["No Notice Period", "15 Days", "30 Days", "60 Days", "90 Days"];
const AVAILABILITY = ["Immediately", "As per discussion", "Weekdays only", "Flexible"];
const JOINING = ["Immediately", "Within 15 Days", "Within 1 Month", "1 – 2 Months", "More than 2 Months"];
const WORKED_WITH = [
  "Project Coordination",
  "Client Communication",
  "Documentation",
  "Site Visits",
  "Vendor Management",
  "Event Coordination",
  "Design Tools (AutoCAD, Revit, etc.)",
  "Other (Please specify)",
];
const CONFIRMATIONS = [
  "I confirm that all the information provided is correct and complete.",
  "I authorize Design House to verify my information if required.",
  "I agree to be contacted for future opportunities.",
  "I have read and agree to the Privacy Policy and Terms & Conditions.",
];

// Short names for the four AI checks, as on the screening-result page
const CHECK_TITLES = ["Relevant Experience", "Skills & Tools", "Education & Qualification", "Communication & Teamwork"];

// Share of contact/profile details found in the CV (or added on the review page)
const PROFILE_FIELDS = ["name", "email", "phone", "location", "dob", "gender", "linkedin"] as const;
const profileCompleteness = (p: CvProfile) =>
  Math.round((PROFILE_FIELDS.filter(f => p[f]?.trim()).length / PROFILE_FIELDS.length) * 100);

const WHY_MAX = 500;
const SKILLS_MAX = 300;

interface Reference {
  name: string;
  designation: string;
  organization: string;
  contact: string;
  email: string;
}
const EMPTY_REF: Reference = { name: "", designation: "", organization: "", contact: "", email: "" };

// Demo prefill so the page shows a complete example; every field stays editable
const DEMO = {
  why: "I am passionate about creating functional and aesthetically inspiring spaces and I would be excited to contribute to Design House's vision of building better spaces for a brighter tomorrow.",
  skills: "Project coordination, client communication, documentation and event support.",
  workedWith: ["Project Coordination", "Client Communication", "Documentation"],
  references: [
    { name: "Mr. Ramesh Gupta", designation: "Project Manager", organization: "ABC Constructions", contact: "+91 98100 12345", email: "ramesh.gupta@email.com" },
    { name: "Ms. Neha Singh", designation: "Program Coordinator", organization: "XYZ Design Studio", contact: "+91 98765 43210", email: "neha.singh@email.com" },
  ] as Reference[],
};

const LABEL = "block text-xs text-gray-700 mb-1";
const INPUT =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:border-[#134698] focus:ring-2 focus:ring-[#134698]/10 disabled:bg-gray-50 disabled:text-gray-500";
const SMALL_INPUT =
  "w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#134698] focus:ring-2 focus:ring-[#134698]/10";

const Required = () => <span className="text-red-500"> *</span>;

const SectionCard = ({
  icon: Icon,
  title,
  note,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  note?: string;
  children: React.ReactNode;
}) => (
  <section className={`${CARD} px-4 sm:px-5 py-4`}>
    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
      <span className="w-9 h-9 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-white" />
      </span>
      <h2 className="font-sans font-semibold text-[#134698] text-sm md:text-[15px]">
        {title}
        {note && <span className="font-normal text-xs text-gray-500"> ({note})</span>}
      </h2>
    </div>
    {children}
  </section>
);

const Select = ({ value, onChange, options, disabled }: { value: string; onChange?: (v: string) => void; options: string[]; disabled?: boolean }) => (
  <select className={INPUT} value={value} disabled={disabled} onChange={e => onChange?.(e.target.value)}>
    <option value="">Select</option>
    {options.map(o => (
      <option key={o}>{o}</option>
    ))}
  </select>
);

// Values the candidate confirmed on the Review Details page (saved per CV in sessionStorage)
interface SavedReview {
  profile?: Partial<Record<"name" | "email" | "phone" | "dob" | "gender" | "location", string>>;
  position?: Partial<Record<"joining" | "notice", string>>;
}
const readSavedReview = (key: string | null): SavedReview => {
  if (!key) return {};
  try {
    return JSON.parse(sessionStorage.getItem(`${key}-review-v2`) || "{}");
  } catch {
    return {};
  }
};

/* ─── Submitted state ─── */

interface Receipt {
  id: string;
  at: Date;
}

const NEXT_STEPS = [
  { icon: FileSearch, title: "Application Review", text: "Our HR team will review your application and AI analysis report.", time: "1 – 3 Working Days" },
  { icon: Users, title: "Shortlisting", text: "If your profile matches the requirements, you will be shortlisted.", time: "3 – 5 Working Days" },
  { icon: Phone, title: "Interview Process", text: "You will be contacted via email/phone for the next steps.", time: "5 – 10 Working Days" },
  { icon: Mail, title: "Final Update", text: "You will receive the final status of your application by email.", time: "Within 2 Weeks" },
];

const VALUES = [
  { icon: ChartNoAxesColumnIncreasing, label: "Innovative\nDesigns" },
  { icon: Leaf, label: "Sustainable\nSolutions" },
  { icon: Settings, label: "Quality\nExecution" },
  { icon: Users, label: "People\nCentric Approach" },
];

const formatWhen = (d: Date) =>
  `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;

const SubmittedView = ({ job, profile, receipt }: { job: Vacancy; profile: CvProfile | null; receipt: Receipt | null }) => {
  const firstName = profile?.name?.split(" ")[0];
  return (
    <>
      {/* Thank-you hero */}
      <section className={`${CARD} relative overflow-hidden`}>
        {/* Building photo on the right, fading into the white card */}
        <div className="hidden md:block absolute inset-y-0 right-0 w-[48%]">
          <Image src={careerHero} alt="" fill placeholder="blur" sizes="500px" className="object-cover object-[85%_center]" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 via-25% to-transparent to-50%" />
        </div>

        <div className="relative px-5 sm:px-6 pt-5 pb-4 md:pr-[44%] flex gap-5">
          <span className="hidden sm:flex w-[72px] h-[72px] rounded-full bg-[#DE802B]/10 items-center justify-center flex-shrink-0">
            <Check className="w-9 h-9 text-[#DE802B]" strokeWidth={3} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#DE802B]">Application Submitted Successfully</p>
            <div className="h-0.5 w-10 bg-[#DE802B] mt-1 mb-2" />
            <h1 className="font-display font-bold text-[#134698] text-[29px] sm:text-[36px] leading-[1.1] mb-2.5">
              Thank You{firstName ? "," : ""} <span className="text-[#DE802B]">{firstName ? `${firstName}!` : "!"}</span>
            </h1>
            <p className="text-[#134698] text-base sm:text-lg leading-snug mb-2">
              Your application for <span className="font-semibold text-[#DE802B]">{job.title}</span> has been submitted successfully.
            </p>
            {/* One sentence per line on wide screens; the image's white fade sits behind any overlap */}
            <p className="text-[13px] text-gray-700 leading-snug">
              <span className="block lg:whitespace-nowrap">Thank you for your interest in joining Design House India Pvt. Ltd.</span>
              <span className="block lg:whitespace-nowrap">Our team will review your profile and get back to you soon.</span>
              <span className="block">Together, we build better spaces for a brighter tomorrow.</span>
            </p>
          </div>
        </div>

        {receipt && (
          <div className="relative grid sm:grid-cols-2 gap-3 px-5 sm:px-6 pb-5">
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-[#134698]/[0.07] flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-[#134698]" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Application ID</p>
                <p className="font-sans font-bold text-[#134698] text-lg leading-tight">{receipt.id}</p>
                <p className="text-[11px] text-gray-500">Please keep this ID for future reference.</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-[#134698]/[0.07] flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-5 h-5 text-[#134698]" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Submitted On</p>
                <p className="font-sans font-bold text-[#134698] text-lg leading-tight">{formatWhen(receipt.at)}</p>
                {profile?.email && (
                  <p className="text-[11px] text-gray-500 break-words">A confirmation email has been sent to {profile.email}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* What happens next */}
      <section className={`${CARD} px-5 sm:px-6 py-5`}>
        <h2 className="font-sans font-semibold text-[#134698] text-lg">What Happens Next?</h2>
        <p className="text-[13px] text-gray-600 mb-5">Here is what you can expect after submitting your application.</p>
        <ol className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
          {NEXT_STEPS.map(({ icon: Icon, title, text, time }, i) => (
            <li key={title} className="relative flex flex-col items-center text-center">
              {i < NEXT_STEPS.length - 1 && (
                <span className="hidden md:flex absolute top-6 left-[calc(50%+32px)] right-[calc(-50%+32px)] items-center" aria-hidden="true">
                  <span className="flex-1 h-px bg-[#134698]/20" />
                  <ChevronRight className="w-4 h-4 text-[#134698] -mx-1" />
                  <span className="flex-1 h-px bg-[#134698]/20" />
                </span>
              )}
              <span className="w-12 h-12 rounded-full bg-[#134698] flex items-center justify-center mb-2">
                <Icon className="w-5 h-5 text-white" />
              </span>
              <p className="font-sans font-semibold text-[#134698] text-sm mb-1">{title}</p>
              <p className="text-xs text-gray-600 leading-snug mb-2 flex-1">{text}</p>
              <span className="rounded bg-[#134698]/[0.07] px-3 py-1 text-xs text-[#134698]">{time}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Values strip */}
      <section className={`${CARD} px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-y-4`}>
        {VALUES.map(({ icon: Icon, label }, i) => (
          <div key={label} className={`flex items-center justify-center gap-3 px-2 ${i > 0 ? "md:border-l md:border-gray-200" : ""}`}>
            <Icon className="w-8 h-8 text-[#DE802B] flex-shrink-0" strokeWidth={2.4} />
            <span className="text-[13px] text-[#134698] leading-tight whitespace-pre-line">{label}</span>
          </div>
        ))}
      </section>
    </>
  );
};

/* ─── Page ─── */

const CareerSubmit = ({ job }: { job: Vacancy }) => {
  const { key, cv } = useCvSession(job._id);
  // Same contact details the Topbar shows
  const { settings } = useSettings();
  const helpPhone = settings?.phones?.find(p => p.forTopbar)?.phone || "+91 9654900525";
  const helpEmail = settings?.emails?.find(e => e.forTopbar)?.email || "info@designhouse.co.in";

  const result = useMemo(() => (cv ? scoreCv(cv.text, job) : null), [cv, job]);
  const [saved, setSaved] = useState<SavedReview>({});
  useEffect(() => {
    if (cv) setSaved(readSavedReview(key));
  }, [cv, key]);

  // CV profile, overridden by anything the candidate edited on the review page
  const profile = useMemo<CvProfile | null>(() => {
    if (!cv) return null;
    const p = extractProfile(cv.text);
    const s = saved.profile ?? {};
    return {
      ...p,
      name: s.name || p.name,
      email: s.email || p.email,
      phone: s.phone || p.phone,
      location: s.location || p.location,
      dob: s.dob || p.dob,
      gender: s.gender || p.gender,
    };
  }, [cv, saved]);

  const [locations, setLocations] = useState<string[]>([]);
  const [notice, setNotice] = useState("30 Days");
  const [availability, setAvailability] = useState("As per discussion");
  const [joining, setJoining] = useState("Within 1 Month");
  const [why, setWhy] = useState(DEMO.why);
  const [extraSkills, setExtraSkills] = useState(DEMO.skills);
  const [workedWith, setWorkedWith] = useState<string[]>(DEMO.workedWith);
  const [otherWork, setOtherWork] = useState("");
  const [references, setReferences] = useState<Reference[]>(DEMO.references.map(r => ({ ...r })));
  const [confirmed, setConfirmed] = useState<boolean[]>(CONFIRMATIONS.map(() => false));
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const submitted = receipt !== null;

  // Prefill from the job and the review page once they're known
  useEffect(() => {
    setLocations(job.location ? [job.location] : []);
  }, [job.location]);
  useEffect(() => {
    if (saved.position?.notice) setNotice(saved.position.notice);
    if (saved.position?.joining) setJoining(saved.position.joining);
  }, [saved]);

  const toggleIn = (list: string[], item: string) => (list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  const setRef = (i: number, field: keyof Reference, value: string) =>
    setReferences(rs => rs.map((r, j) => (j === i ? { ...r, [field]: value } : r)));

  const missing = [
    !profile?.name && "your name",
    !profile?.email && "your email",
    !profile?.phone && "your mobile number",
    locations.length === 0 && "a preferred location",
    !notice && "notice period",
    !availability && "expected availability",
    !joining && "joining preference",
    !why.trim() && "why you want to join Design House",
  ].filter(Boolean) as string[];
  const allConfirmed = confirmed.every(Boolean);
  const canSubmit = missing.length === 0 && allConfirmed && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !profile) return;
    setSubmitting(true);
    try {
      const refsText = references
        .filter(r => r.name.trim())
        .map((r, i) => `  ${i + 1}. ${r.name} — ${r.designation}, ${r.organization} | ${r.contact} | ${r.email}`)
        .join("\n");
      const worked = workedWith.map(w => (w.startsWith("Other") && otherWork.trim() ? `Other: ${otherWork.trim()}` : w));
      const message = [
        `Position: ${job.title} (${job.jobType || "—"})`,
        result ? `AI match score: ${result.score}% (${result.label})` : null,
        `Preferred location(s): ${locations.join(", ")}`,
        `Notice period: ${notice}`,
        `Expected availability: ${availability}`,
        `Joining preference: ${joining}`,
        profile.location ? `Current location: ${profile.location}` : null,
        "",
        `Why Design House:\n${why.trim()}`,
        extraSkills.trim() ? `\nAdditional skills:\n${extraSkills.trim()}` : null,
        worked.length ? `\nWorked with: ${worked.join(", ")}` : null,
        refsText ? `\nReferences:\n${refsText}` : null,
      ]
        .filter(line => line !== null)
        .join("\n");

      const fd = new FormData();
      fd.append("name", profile.name ?? "");
      fd.append("email", profile.email ?? "");
      fd.append("phone", profile.phone ?? "");
      fd.append("subject", `Application: ${job.title}`);
      fd.append("message", message);
      // Structured details for the candidate's confirmation email
      fd.append("position", job.title);
      if (profile.location) fd.append("location", profile.location);
      if (result) {
        fd.append("matchScore", String(result.score));
        fd.append("matchLabel", result.label);
        fd.append(
          "matchChecks",
          JSON.stringify([
            ...result.checks.map((c, i) => ({ label: CHECK_TITLES[i] ?? c.label, score: c.score })),
            // Two more real measures so the email's breakdown shows 3 + 3
            { label: "Overall Role Fit", score: result.score },
            { label: "Profile Completeness", score: profileCompleteness(profile) },
          ])
        );
      }
      const cvFile = await loadCvFile(key);
      if (cvFile) fd.append("document", cvFile, cvFile.name);

      const res = await api.post<{ applicationId?: string; data?: { _id?: string; createdAt?: string } }>("/api/career", fd);
      const at = res.data?.data?.createdAt ? new Date(res.data.data.createdAt) : new Date();
      const tail = (res.data?.data?._id ?? Date.now().toString(16)).slice(-5).toUpperCase();
      // The backend's ID is the one in the confirmation email
      setReceipt({ id: res.data?.applicationId ?? `DH-CAR-${at.getFullYear()}-${tail}`, at });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Could not submit your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepper = submitted ? stepsFor(5) : stepsFor(4);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      <Topbar />
      <Navbar solid />

      <div className="pt-[56px] sm:pt-[72px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:pl-11 lg:pr-8 pt-6 pb-14">
          <CareerBreadcrumb jobId={job._id} jobTitle={job.title} current={submitted ? "Application Submitted" : "Submit Application"} />

          {cv === null ? (
            <div className={`${CARD} max-w-xl mx-auto text-center px-6 py-12 mt-6`}>
              <span className="w-14 h-14 rounded-full bg-[#DE802B]/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-[#DE802B]" />
              </span>
              <h1 className="font-display font-bold text-[#134698] text-2xl mb-2">No CV found</h1>
              <p className="text-sm text-gray-600 mb-6">
                Please upload your CV on the job page and click &ldquo;Check Eligibility&rdquo; to continue your application.
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
                {submitted ? (
                  <Stepper steps={stepper} reach={4} lineDone />
                ) : (
                  <div>
                    <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#DE802B] mb-0.5">Careers at Design House</p>
                    <h1 className="font-display font-bold text-[#134698] text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.1] mb-3">
                      Complete Your <span className="text-[#DE802B]">Application</span>
                    </h1>
                    <p className="text-gray-700 text-[15px] md:text-base leading-relaxed max-w-2xl">
                      You&apos;re almost there! Please review and confirm your details to submit your application.
                    </p>
                    <div className="h-0.5 w-12 bg-[#DE802B] mt-3 mb-3" />
                    <Stepper steps={stepper} reach={4} lineDone={false} />
                  </div>
                )}

                {submitted ? (
                  <SubmittedView job={job} profile={profile} receipt={receipt} />
                ) : (
                  <>
                    {/* Application details */}
                    <SectionCard icon={ClipboardList} title="Application Details">
                      <div className="grid sm:grid-cols-3 gap-x-4 gap-y-4">
                        <div>
                          <label className={LABEL}>
                            Position Applied For
                            <Required />
                          </label>
                          <Select value={job.title} options={[job.title]} disabled />
                        </div>
                        <div>
                          <label className={LABEL}>
                            Preferred Location(s)
                            <Required />
                          </label>
                          <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2 py-1.5 min-h-[38px]">
                            {locations.map(l => (
                              <span key={l} className="inline-flex items-center gap-1 rounded bg-[#134698]/[0.07] px-2 py-0.5 text-xs text-[#134698]">
                                {l}
                                <button type="button" aria-label={`Remove ${l}`} onClick={() => setLocations(ls => ls.filter(x => x !== l))}>
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                            <select
                              aria-label="Add a preferred location"
                              className="flex-1 min-w-[70px] bg-transparent text-xs text-gray-500 focus:outline-none"
                              value=""
                              onChange={e => e.target.value && setLocations(ls => (ls.includes(e.target.value) ? ls : [...ls, e.target.value]))}
                            >
                              <option value="">{locations.length ? "Add" : "Select"}</option>
                              {LOCATIONS.filter(l => !locations.includes(l)).map(l => (
                                <option key={l}>{l}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className={LABEL}>
                            Notice Period
                            <Required />
                          </label>
                          <Select value={notice} onChange={setNotice} options={NOTICE} />
                        </div>
                        <div>
                          <label className={LABEL}>
                            Expected Availability
                            <Required />
                          </label>
                          <Select value={availability} onChange={setAvailability} options={AVAILABILITY} />
                        </div>
                        <div>
                          <label className={LABEL}>
                            Joining Preference
                            <Required />
                          </label>
                          <Select value={joining} onChange={setJoining} options={JOINING} />
                        </div>
                        <div>
                          <label className={`${LABEL} text-gray-400`}>Employment Type</label>
                          <Select value={job.jobType || ""} options={job.jobType ? [job.jobType] : []} disabled />
                        </div>
                      </div>
                    </SectionCard>

                    {/* Additional information */}
                    <SectionCard icon={FileText} title="Additional Information">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className={LABEL}>
                            Why do you want to join Design House?
                            <Required />
                          </label>
                          <textarea
                            className={`${INPUT} resize-none h-[84px] leading-snug`}
                            maxLength={WHY_MAX}
                            value={why}
                            onChange={e => setWhy(e.target.value)}
                          />
                          <p className="text-[10.5px] text-gray-400 text-right mt-0.5">{WHY_MAX - why.length} characters left</p>
                        </div>
                        <div>
                          <label className={LABEL}>Any additional skills or expertise?</label>
                          <textarea
                            className={`${INPUT} resize-none h-[84px] leading-snug`}
                            maxLength={SKILLS_MAX}
                            value={extraSkills}
                            onChange={e => setExtraSkills(e.target.value)}
                          />
                          <p className="text-[10.5px] text-gray-400 text-right mt-0.5">{SKILLS_MAX - extraSkills.length} characters left</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 mt-2 mb-2">
                        Have you worked with any of these? <span className="text-gray-500">(Optional)</span>
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {WORKED_WITH.map(w => {
                          const on = workedWith.includes(w);
                          return (
                            <label
                              key={w}
                              className={`flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs cursor-pointer transition-colors ${
                                on ? "border-[#134698]/40 bg-[#134698]/[0.04] text-[#134698]" : "border-gray-200 text-gray-700 hover:border-gray-300"
                              }`}
                            >
                              <input type="checkbox" className="sr-only" checked={on} onChange={() => setWorkedWith(ws => toggleIn(ws, w))} />
                              <span
                                className={`w-4 h-4 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${
                                  on ? "bg-[#134698] border-[#134698]" : "border-gray-300 bg-white"
                                }`}
                              >
                                {on && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                              </span>
                              <span className="leading-tight">{w}</span>
                            </label>
                          );
                        })}
                      </div>
                      {workedWith.some(w => w.startsWith("Other")) && (
                        <input
                          className={`${INPUT} mt-2`}
                          placeholder="Please specify"
                          value={otherWork}
                          onChange={e => setOtherWork(e.target.value)}
                        />
                      )}
                    </SectionCard>

                    {/* References */}
                    <SectionCard icon={UserRound} title="References" note="Optional">
                      <div className="grid md:grid-cols-2 gap-5">
                        {references.map((r, i) => (
                          <div key={i}>
                            <p className="text-[13px] font-semibold text-[#DE802B] mb-2">Reference {i + 1}</p>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                              {(
                                [
                                  ["name", "Name"],
                                  ["designation", "Designation"],
                                  ["organization", "Organization"],
                                  ["contact", "Contact Number"],
                                ] as const
                              ).map(([field, label]) => (
                                <div key={field}>
                                  <label className="block text-[10.5px] text-gray-900 mb-0.5">{label}</label>
                                  <input className={SMALL_INPUT} value={r[field]} onChange={e => setRef(i, field, e.target.value)} />
                                </div>
                              ))}
                              <div className="col-span-2">
                                <label className="block text-[10.5px] text-gray-900 mb-0.5">Email Address</label>
                                <input type="email" className={SMALL_INPUT} value={r.email} onChange={e => setRef(i, "email", e.target.value)} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {references.length === 0 && (
                        <button
                          type="button"
                          onClick={() => setReferences([{ ...EMPTY_REF }, { ...EMPTY_REF }])}
                          className="text-xs font-semibold text-[#134698] hover:text-[#DE802B]"
                        >
                          + Add references
                        </button>
                      )}
                    </SectionCard>
                  </>
                )}
              </div>

              {/* ═════════ RIGHT ═════════ */}
              {/* lg:mt lines the aside up with the subtitle, same as the Review Details page.
                  Once submitted there's no page heading, so the aside starts at the top. */}
              <aside className={`min-w-0 space-y-5 ${submitted ? "" : "lg:mt-[93px]"}`}>
                <ProfileSummary profile={profile} title="Your Profile" />

                {/* Position */}
                <section className={`${CARD} px-5 py-4 flex items-center gap-3`}>
                  <span className="w-11 h-11 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-white" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600">Position Applied For</p>
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

                {/* Match */}
                {result && (
                  <section className={`${CARD} px-5 py-4 flex items-center gap-4`}>
                    <CountRing value={result.score} className="w-[100px] h-[100px] flex-shrink-0">
                      {v => (
                        <>
                          <span className="font-sans font-bold text-[#134698] text-[21px] leading-none tabular-nums">{v}%</span>
                          <span className="text-[9px] text-gray-500 mt-0.5">Match Score</span>
                        </>
                      )}
                    </CountRing>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <p className="font-sans font-semibold text-[#134698] text-[15px]">Profile Match</p>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold border rounded px-1.5 py-0.5 ${LABEL_STYLES[result.label]}`}>
                          <Star className="w-3 h-3 fill-current" />
                          {result.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-snug">{result.summary}</p>
                    </div>
                  </section>
                )}

                {!submitted && (
                  <>
                    {/* Before you submit */}
                    <section className={`${CARD} px-5 py-4`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-9 h-9 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
                          <ClipboardList className="w-4 h-4 text-white" />
                        </span>
                        <h2 className="font-sans font-semibold text-[#134698] text-[15px]">Before You Submit</h2>
                      </div>
                      <ul className="space-y-2">
                        {CONFIRMATIONS.map((c, i) => (
                          <li key={c}>
                            <label className="flex items-start gap-2.5 text-xs text-gray-800 cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={confirmed[i]}
                                onChange={() => setConfirmed(cs => cs.map((v, j) => (j === i ? !v : v)))}
                              />
                              <span
                                className={`mt-px w-4 h-4 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${
                                  confirmed[i] ? "bg-green-600 border-green-600" : "border-gray-300 bg-white"
                                }`}
                              >
                                {confirmed[i] && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                              </span>
                              <span>{c}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Actions */}
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#134698] hover:bg-[#DE802B] disabled:bg-[#134698]/40 disabled:cursor-not-allowed text-white text-[15px] font-semibold py-3.5 rounded-md transition-colors"
                      >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {submitting ? "Submitting…" : "Submit Application"}
                        {!submitting && <ArrowRight className="w-4 h-4" />}
                      </button>
                      {!submitting && (missing.length > 0 || !allConfirmed) && (
                        <p className="text-[11px] text-gray-500 text-center">
                          {missing.length > 0 ? `Please add ${missing.join(", ")}.` : "Please tick all the confirmations above to submit."}
                        </p>
                      )}
                      <Link
                        href={`/career/${job._id}/review?cv=${key}`}
                        className="w-full inline-flex items-center justify-center gap-2 border border-[#134698] text-[#134698] hover:bg-[#134698]/5 text-sm font-semibold py-3 rounded-md transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Review Details
                      </Link>
                    </div>
                  </>
                )}

                {submitted ? (
                  <>
                    {/* What's next */}
                    <section className={`${CARD} px-5 py-4 flex items-start gap-4`}>
                      <span className="w-14 h-14 rounded-full bg-[#DE802B]/10 flex items-center justify-center flex-shrink-0">
                        <Search className="w-6 h-6 text-[#DE802B]" strokeWidth={2.6} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-sans font-semibold text-[#134698] text-[15px] mb-1">What&apos;s Next?</h2>
                        <p className="text-xs text-gray-600 leading-snug mb-3">
                          Would you like to explore other suitable opportunities? We will notify you about relevant openings.
                        </p>
                        <Link
                          href="/career#openings"
                          className="w-full inline-flex items-center justify-center gap-2 border border-[#134698] text-[#134698] hover:bg-[#134698]/5 text-[13px] font-semibold py-2.5 rounded-md transition-colors"
                        >
                          View Other Opportunities
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </section>

                    {/* Need help */}
                    <section className={`${CARD} px-5 py-4 flex items-start gap-4`}>
                      <span className="w-14 h-14 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
                        <Headset className="w-6 h-6 text-white" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-sans font-semibold text-[#134698] text-[15px] mb-1">Need Help?</h2>
                        <p className="text-xs text-gray-600 leading-snug mb-2">
                          If you have any questions regarding your application, feel free to reach out to our HR team.
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#134698]">
                          <a href={`mailto:${helpEmail}`} className="inline-flex items-center gap-1.5 hover:text-[#DE802B]">
                            <Mail className="w-3.5 h-3.5" />
                            {helpEmail}
                          </a>
                          <a href={`tel:${helpPhone.replace(/[^0-9+]/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-[#DE802B]">
                            <Phone className="w-3.5 h-3.5" />
                            {helpPhone}
                          </a>
                        </div>
                      </div>
                    </section>
                  </>
                ) : (
                  <SecureNote />
                )}
              </aside>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CareerSubmit;
