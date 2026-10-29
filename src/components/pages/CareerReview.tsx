"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BarChart3,
  Briefcase,
  Check,
  CircleAlert,
  FileText,
  GraduationCap,
  Lightbulb,
  MapPin,
  Pencil,
  Plus,
  Send,
  Settings,
  Star,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import type { Vacancy } from "@/components/pages/career/jobs";
import {
  buildStrengths,
  buildSuggestions,
  extractProfile,
  extractSkills,
  scoreCv,
} from "@/components/pages/career/cvMatch";
import { CountRing } from "@/components/pages/career/CountUp";
import { useCvSession } from "@/components/pages/career/useCvSession";
import { CARD, CareerBreadcrumb, LABEL_STYLES, SecureNote, Stepper, formatSize, stepsFor } from "@/components/pages/career/ui";

import demoPhoto from "@/assets/image/demo.webp";

/* ─── Form model ─── */

interface EducationRow {
  qualification: string;
  institute: string;
  year: string;
  percentage: string;
  specialization: string;
}
interface ExperienceRow {
  organization: string;
  designation: string;
  duration: string;
  responsibilities: string;
}
interface ReviewForm {
  profile: { name: string; email: string; phone: string; dob: string; gender: string; location: string; address: string };
  position: { locationPref: string; joining: string; salary: string; notice: string; source: string };
  education: EducationRow[];
  experience: ExperienceRow[];
  skills: { name: string; level: number }[];
  certifications: string[];
}

const EMPTY_EDU: EducationRow = { qualification: "", institute: "", year: "", percentage: "", specialization: "" };
const EMPTY_EXP: ExperienceRow = { organization: "", designation: "", duration: "", responsibilities: "" };

// Demo values used wherever the CV doesn't supply a field, so the page always
// shows a complete example. Every value stays editable via the card's Edit button.
const DEMO = {
  profile: { dob: "14 Nov 1992", gender: "Male", location: "Delhi NCR", address: "B-101, Green Park, New Delhi – 110016" },
  position: { joining: "Within 1 Month", salary: "As per company norms", notice: "30 Days" },
  education: [
    { qualification: "B.Tech", institute: "Delhi University", year: "2014", percentage: "78%", specialization: "Civil Engineering" },
    { qualification: "MBA", institute: "Indian Institute of Management", year: "2016", percentage: "82%", specialization: "Project Management" },
    { qualification: "Certification", institute: "NIIT", year: "2018", percentage: "-", specialization: "MS Project" },
  ],
  experience: [
    {
      organization: "ABC Infra Pvt. Ltd.",
      designation: "Project Coordinator",
      duration: "2021 – Present (3 Years)",
      responsibilities: "Project planning, client coordination, site management",
    },
    {
      organization: "XYZ Design Studio",
      designation: "Assistant Project Manager",
      duration: "2018 – 2021 (3 Years)",
      responsibilities: "Documentation, vendor management, progress tracking",
    },
    {
      organization: "BuildSpace Consultants",
      designation: "Project Trainee",
      duration: "2016 – 2018 (2 Years)",
      responsibilities: "Site coordination and reporting",
    },
  ],
  skills: [
    { name: "Project Coordination", level: 90 },
    { name: "Communication Skills", level: 85 },
    { name: "MS Office (Excel, Word, PPT)", level: 85 },
    { name: "Client Management", level: 80 },
    { name: "Documentation", level: 78 },
    { name: "Team Collaboration", level: 80 },
    { name: "Time Management", level: 82 },
  ],
  certifications: ["PMP (In Progress)", "MS Project Certification", "AutoCAD (Basic)", "Lean Management", "Health & Safety (Construction)"],
  // Display-only examples in Additional Documents (not real files, never submitted)
  documents: [
    { name: "Academic Certificates.pdf", size: "3.1 MB" },
    { name: "Experience Letter.pdf", size: "1.8 MB" },
    { name: "Medical Registration.pdf", size: "1.2 MB" },
    { name: "ID Proof (Aadhaar).pdf", size: "0.8 MB" },
  ],
};

const JOINING = ["Immediately", "Within 15 Days", "Within 1 Month", "1 – 2 Months", "More than 2 Months"];
const NOTICE = ["No Notice Period", "15 Days", "30 Days", "60 Days", "90 Days"];
const SOURCES = ["Company Website", "LinkedIn", "Job Portal", "Referral", "Social Media", "Other"];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

const INPUT =
  "w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:outline-none focus:border-[#134698] focus:ring-2 focus:ring-[#134698]/10";

/* ─── Small building blocks ─── */

const EditButton = ({ editing, onClick }: { editing: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
      editing ? "border-green-600 bg-green-600 text-white hover:bg-green-700" : "border-gray-200 text-[#134698] hover:border-[#134698]/40"
    }`}
  >
    {editing ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <Pencil className="w-3.5 h-3.5" />}
    {editing ? "Done" : "Edit"}
  </button>
);

const ReviewCard = ({
  icon: Icon,
  title,
  editing,
  onToggle,
  children,
  className = "",
}: {
  icon: typeof UserRound;
  title: string;
  editing?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`${CARD} px-4 py-4 ${className}`}>
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-9 h-9 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-white" />
        </span>
        <h2 className="font-sans font-semibold text-[#134698] text-sm md:text-[15px] leading-tight whitespace-nowrap">{title}</h2>
      </div>
      {onToggle && <EditButton editing={!!editing} onClick={onToggle} />}
    </div>
    {children}
  </section>
);

// Label/value row that turns into an input while editing
const Field = ({
  label,
  value,
  editing,
  onChange,
  options,
  readOnly,
  placeholder,
  wide,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange?: (v: string) => void;
  options?: string[];
  readOnly?: boolean;
  placeholder?: string;
  // More space between label and value (used where labels are long)
  wide?: boolean;
}) => (
  <div
    className={`grid items-center py-1 border-b border-gray-100 last:border-0 text-xs ${
      wide ? "grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-x-5" : "grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-x-2"
    }`}
  >
    <span className="text-gray-900">{label}</span>
    {editing && !readOnly ? (
      options ? (
        <select className={INPUT} value={value} onChange={e => onChange?.(e.target.value)}>
          <option value="">Select</option>
          {options.map(o => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input className={INPUT} value={value} placeholder={placeholder} onChange={e => onChange?.(e.target.value)} />
      )
    ) : (
      <span className={value ? "text-[#134698]" : "text-gray-400"}>{value || "Not provided"}</span>
    )}
  </div>
);

const TABLE_HEAD = "bg-[#134698]/[0.06] text-[10.5px] font-semibold text-[#134698] text-left px-1.5 py-1.5 leading-tight align-bottom";
const TABLE_CELL = "px-1.5 py-1.5 text-[11px] text-gray-800 align-top break-words";

/* ─── Page ─── */

const CareerReview = ({ job }: { job: Vacancy }) => {
  const { key, cv } = useCvSession(job._id);
  // "-v2": edits saved before demo prefill existed are ignored, so the demo data shows
  const storageKey = key ? `${key}-review-v2` : null;

  const result = useMemo(() => (cv ? scoreCv(cv.text, job) : null), [cv, job]);
  const profile = useMemo(() => (cv ? extractProfile(cv.text) : null), [cv]);
  const cvSkills = useMemo(() => (cv ? extractSkills(cv.text, job) : []), [cv, job]);
  const strengths = useMemo(() => (result ? buildStrengths(result, job, cvSkills) : []), [result, job, cvSkills]);
  const improvements = useMemo(() => (result ? buildSuggestions(result, job, profile).slice(0, 3) : []), [result, job, profile]);

  const [form, setForm] = useState<ReviewForm | null>(null);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [docs, setDocs] = useState<File[]>([]);
  const [demoDocs, setDemoDocs] = useState(DEMO.documents);
  const [newCert, setNewCert] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const docInput = useRef<HTMLInputElement>(null);

  // Start from saved edits for this CV, or prefill from the CV itself
  useEffect(() => {
    if (!cv) return;
    try {
      const saved = storageKey && sessionStorage.getItem(storageKey);
      if (saved) {
        setForm(JSON.parse(saved));
        return;
      }
    } catch {
      /* ignore and prefill */
    }
    const p = extractProfile(cv.text);
    const cvSkillNames = extractSkills(cv.text, job);
    setForm({
      profile: {
        name: p.name ?? "",
        email: p.email ?? "",
        phone: p.phone ?? "",
        dob: p.dob ?? DEMO.profile.dob,
        gender: p.gender ?? DEMO.profile.gender,
        location: p.location ?? DEMO.profile.location,
        address: DEMO.profile.address,
      },
      position: { locationPref: job.location, ...DEMO.position, source: "Company Website" },
      education: DEMO.education.map(row => ({ ...row })),
      experience: DEMO.experience.map(row => ({ ...row })),
      skills: cvSkillNames.length ? cvSkillNames.map(name => ({ name, level: 75 })) : DEMO.skills.map(s => ({ ...s })),
      certifications: [...DEMO.certifications],
    });
  }, [cv, job, storageKey]);

  // Keep edits for this tab, so going back to the result and returning doesn't lose them
  useEffect(() => {
    if (!form || !storageKey) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(form));
    } catch {
      /* storage full or blocked: edits still work for this visit */
    }
  }, [form, storageKey]);

  const toggle = (section: string) => setEditing(e => ({ ...e, [section]: !e[section] }));
  const update = <K extends keyof ReviewForm>(section: K, value: ReviewForm[K]) => setForm(f => (f ? { ...f, [section]: value } : f));

  const stepper = stepsFor(3);

  const addDocs = (files: FileList | null) => {
    if (!files) return;
    setDocs(d => [...d, ...Array.from(files).filter(f => f.size <= 10 * 1024 * 1024)]);
    if (docInput.current) docInput.current.value = "";
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      <Topbar />
      <Navbar solid />

      <div className="pt-[56px] sm:pt-[72px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:pl-11 lg:pr-8 pt-6 pb-14">
          <CareerBreadcrumb jobId={job._id} jobTitle={job.title} current="Review Details" />

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
                <div>
                  <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#DE802B] mb-0.5">Careers at Design House</p>
                  <h1 className="font-display font-bold text-[#134698] text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.1] mb-3">
                    Review Your <span className="text-[#DE802B]">Details</span>
                  </h1>
                  <p className="text-gray-700 text-[15px] md:text-base leading-relaxed max-w-2xl">
                    Please review your information below before submitting your application.
                  </p>
                  <div className="h-0.5 w-12 bg-[#DE802B] mt-3 mb-3" />
                  <Stepper steps={stepper} reach={3} lineDone={false} />
                </div>

                {form && (
                  <>
                    <div className="grid xl:grid-cols-2 gap-5">
                      {/* Candidate profile */}
                      <ReviewCard icon={UserRound} title="Candidate Profile" editing={editing.profile} onToggle={() => toggle("profile")}>
                        <div className="flex gap-3">
                          <div className="relative w-[96px] h-[120px] rounded-md overflow-hidden flex-shrink-0 hidden sm:block">
                            <Image src={demoPhoto} alt="" fill placeholder="blur" sizes="96px" className="object-cover object-top" />
                          </div>
                          <div className="min-w-0 flex-1">
                            {(
                              [
                                ["Full Name", "name"],
                                ["Email Address", "email"],
                                ["Mobile Number", "phone"],
                                ["Date of Birth", "dob"],
                                ["Gender", "gender"],
                                ["Current Location", "location"],
                                ["Permanent Address", "address"],
                              ] as const
                            ).map(([label, k]) => (
                              <Field
                                key={k}
                                label={label}
                                value={form.profile[k]}
                                editing={!!editing.profile}
                                options={k === "gender" ? GENDERS : undefined}
                                onChange={v => update("profile", { ...form.profile, [k]: v })}
                              />
                            ))}
                          </div>
                        </div>
                      </ReviewCard>

                      {/* Position */}
                      <ReviewCard icon={Briefcase} title="Position Details" editing={editing.position} onToggle={() => toggle("position")}>
                        <Field wide label="Position Applied For" value={job.title} editing={!!editing.position} readOnly />
                        <Field
                          wide
                          label="Location Preference"
                          value={form.position.locationPref}
                          editing={!!editing.position}
                          onChange={v => update("position", { ...form.position, locationPref: v })}
                        />
                        <Field wide label="Employment Type" value={job.jobType ?? ""} editing={!!editing.position} readOnly />
                        <Field
                          wide
                          label="Expected Joining"
                          value={form.position.joining}
                          editing={!!editing.position}
                          options={JOINING}
                          onChange={v => update("position", { ...form.position, joining: v })}
                        />
                        <Field
                          wide
                          label="Expected Salary (CTC)"
                          value={form.position.salary}
                          editing={!!editing.position}
                          placeholder="e.g. 6 LPA"
                          onChange={v => update("position", { ...form.position, salary: v })}
                        />
                        <Field
                          wide
                          label="Notice Period"
                          value={form.position.notice}
                          editing={!!editing.position}
                          options={NOTICE}
                          onChange={v => update("position", { ...form.position, notice: v })}
                        />
                        <Field
                          wide
                          label="How did you hear about us?"
                          value={form.position.source}
                          editing={!!editing.position}
                          options={SOURCES}
                          onChange={v => update("position", { ...form.position, source: v })}
                        />
                      </ReviewCard>
                    </div>

                    <div className="grid xl:grid-cols-2 gap-5">
                      {/* Education */}
                      <ReviewCard icon={GraduationCap} title="Education Details" editing={editing.education} onToggle={() => toggle("education")}>
                        <div>
                          <table className="w-full table-fixed border-collapse">
                            <thead>
                              <tr>
                                {(
                                  [
                                    ["Qualification", "20%"],
                                    ["Institute / University", "32%"],
                                    ["Year", "10%"],
                                    ["%", "8%"],
                                    ["Specialization", "30%"],
                                  ] as const
                                ).map(([h, w]) => (
                                  <th key={h} className={`${TABLE_HEAD} whitespace-nowrap`} style={{ width: w }}>
                                    {h}
                                  </th>
                                ))}
                                {editing.education && <th className={TABLE_HEAD} style={{ width: 28 }} />}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {form.education.map((row, i) => (
                                <tr key={i}>
                                  {(Object.keys(EMPTY_EDU) as (keyof EducationRow)[]).map(k => (
                                    <td key={k} className={TABLE_CELL}>
                                      {editing.education ? (
                                        <input
                                          className={INPUT}
                                          value={row[k]}
                                          onChange={e =>
                                            update(
                                              "education",
                                              form.education.map((r, j) => (j === i ? { ...r, [k]: e.target.value } : r))
                                            )
                                          }
                                        />
                                      ) : (
                                        row[k] || <span className="text-gray-400">–</span>
                                      )}
                                    </td>
                                  ))}
                                  {editing.education && (
                                    <td className={TABLE_CELL}>
                                      <button
                                        type="button"
                                        aria-label="Remove row"
                                        onClick={() => update("education", form.education.filter((_, j) => j !== i))}
                                        className="p-0.5 text-gray-400 hover:text-red-500"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {editing.education && (
                          <button
                            type="button"
                            onClick={() => update("education", [...form.education, { ...EMPTY_EDU }])}
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#134698] hover:text-[#DE802B]"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add qualification
                          </button>
                        )}
                      </ReviewCard>

                      {/* Experience */}
                      <ReviewCard icon={Briefcase} title="Work Experience" editing={editing.experience} onToggle={() => toggle("experience")}>
                        <div>
                          <table className="w-full table-fixed border-collapse">
                            <thead>
                              <tr>
                                {(
                                  [
                                    ["Organization", "25%"],
                                    ["Designation", "22%"],
                                    ["Duration", "20%"],
                                    ["Key Responsibilities", "33%"],
                                  ] as const
                                ).map(([h, w]) => (
                                  <th key={h} className={TABLE_HEAD} style={{ width: w }}>
                                    {h}
                                  </th>
                                ))}
                                {editing.experience && <th className={TABLE_HEAD} style={{ width: 28 }} />}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {form.experience.map((row, i) => (
                                <tr key={i}>
                                  {(Object.keys(EMPTY_EXP) as (keyof ExperienceRow)[]).map(k => (
                                    <td key={k} className={TABLE_CELL}>
                                      {editing.experience ? (
                                        <input
                                          className={INPUT}
                                          value={row[k]}
                                          placeholder={k === "duration" ? "2021 – Present" : undefined}
                                          onChange={e =>
                                            update(
                                              "experience",
                                              form.experience.map((r, j) => (j === i ? { ...r, [k]: e.target.value } : r))
                                            )
                                          }
                                        />
                                      ) : (
                                        row[k] || <span className="text-gray-400">–</span>
                                      )}
                                    </td>
                                  ))}
                                  {editing.experience && (
                                    <td className={TABLE_CELL}>
                                      <button
                                        type="button"
                                        aria-label="Remove row"
                                        onClick={() => update("experience", form.experience.filter((_, j) => j !== i))}
                                        className="p-0.5 text-gray-400 hover:text-red-500"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {editing.experience ? (
                          <button
                            type="button"
                            onClick={() => update("experience", [...form.experience, { ...EMPTY_EXP }])}
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#134698] hover:text-[#DE802B]"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add experience
                          </button>
                        ) : (
                          !form.experience.some(r => r.organization) && (
                            <p className="mt-2 text-xs text-gray-500">Click Edit to add your work experience.</p>
                          )
                        )}
                      </ReviewCard>
                    </div>

                    {/* Middle column a bit wider so "Certifications & Licenses" fits on one line */}
                    <div className="grid md:grid-cols-[1fr_1.3fr_1fr] gap-5">
                      {/* Skills */}
                      <ReviewCard icon={Settings} title="Skills" editing={editing.skills} onToggle={() => toggle("skills")}>
                        {form.skills.length === 0 && !editing.skills && (
                          <p className="text-xs text-gray-500">No skills found in your CV. Click Edit to add them.</p>
                        )}
                        <ul className="space-y-2">
                          {form.skills.map((s, i) => (
                            <li key={s.name} className="text-xs">
                              <div className="flex items-center gap-2">
                                <span className="flex-1 min-w-0 truncate text-[#134698]">{s.name}</span>
                                {editing.skills ? (
                                  <button
                                    type="button"
                                    aria-label={`Remove ${s.name}`}
                                    onClick={() => update("skills", form.skills.filter((_, j) => j !== i))}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <span className="tabular-nums text-gray-600">{s.level}%</span>
                                )}
                              </div>
                              {editing.skills ? (
                                <input
                                  type="range"
                                  min={10}
                                  max={100}
                                  step={5}
                                  value={s.level}
                                  aria-label={`${s.name} level`}
                                  onChange={e =>
                                    update(
                                      "skills",
                                      form.skills.map((x, j) => (j === i ? { ...x, level: Number(e.target.value) } : x))
                                    )
                                  }
                                  className="w-full accent-[#134698]"
                                />
                              ) : (
                                <div className="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${s.level >= 80 ? "bg-[#134698]" : "bg-[#F5A524]"}`}
                                    style={{ width: `${s.level}%` }}
                                  />
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                        {editing.skills && (
                          <form
                            className="mt-2 flex gap-2"
                            onSubmit={e => {
                              e.preventDefault();
                              const name = newSkill.trim();
                              if (name && !form.skills.some(s => s.name.toLowerCase() === name.toLowerCase()))
                                update("skills", [...form.skills, { name, level: 70 }]);
                              setNewSkill("");
                            }}
                          >
                            <input className={INPUT} value={newSkill} placeholder="Add a skill" onChange={e => setNewSkill(e.target.value)} />
                            <button type="submit" aria-label="Add skill" className="px-2.5 rounded-md bg-[#134698] text-white">
                              <Plus className="w-4 h-4" />
                            </button>
                          </form>
                        )}
                      </ReviewCard>

                      {/* Certifications */}
                      <ReviewCard
                        icon={Award}
                        title="Certifications & Licenses"
                        editing={editing.certifications}
                        onToggle={() => toggle("certifications")}
                      >
                        {form.certifications.length === 0 && !editing.certifications && (
                          <p className="text-xs text-gray-500">No certifications added. Click Edit to add them.</p>
                        )}
                        <ul className="divide-y divide-gray-100">
                          {form.certifications.map((c, i) => (
                            <li key={c} className="flex items-center gap-2.5 py-1.5 text-xs text-[#134698]">
                              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-[#DE802B]" />
                              <span className="flex-1 min-w-0 truncate">{c}</span>
                              {editing.certifications && (
                                <button
                                  type="button"
                                  aria-label={`Remove ${c}`}
                                  onClick={() => update("certifications", form.certifications.filter((_, j) => j !== i))}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                        {editing.certifications && (
                          <form
                            className="mt-2 flex gap-2"
                            onSubmit={e => {
                              e.preventDefault();
                              const name = newCert.trim();
                              if (name && !form.certifications.includes(name)) update("certifications", [...form.certifications, name]);
                              setNewCert("");
                            }}
                          >
                            <input className={INPUT} value={newCert} placeholder="e.g. PMP, AutoCAD" onChange={e => setNewCert(e.target.value)} />
                            <button type="submit" aria-label="Add certification" className="px-2.5 rounded-md bg-[#134698] text-white">
                              <Plus className="w-4 h-4" />
                            </button>
                          </form>
                        )}
                      </ReviewCard>

                      {/* Documents */}
                      <ReviewCard icon={FileText} title="Additional Documents">
                        <input
                          ref={docInput}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={e => addDocs(e.target.files)}
                        />
                        <ul className="divide-y divide-gray-100">
                          {cv && (
                            <li className="flex items-center gap-2.5 py-1.5 text-xs text-[#134698]">
                              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-[#DE802B]" />
                              <span className="flex-1 min-w-0 truncate">
                                {cv.fileName} <span className="text-gray-500">({formatSize(cv.fileSize)})</span>
                              </span>
                            </li>
                          )}
                          {demoDocs.map(d => (
                            <li key={d.name} className="flex items-center gap-2.5 py-1.5 text-xs text-[#134698]">
                              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-[#DE802B]" />
                              <span className="flex-1 min-w-0 truncate">
                                {d.name} <span className="text-gray-500">({d.size})</span>
                              </span>
                              <button
                                type="button"
                                aria-label={`Remove ${d.name}`}
                                onClick={() => setDemoDocs(ds => ds.filter(x => x.name !== d.name))}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </li>
                          ))}
                          {docs.map((d, i) => (
                            <li key={`${d.name}-${i}`} className="flex items-center gap-2.5 py-1.5 text-xs text-[#134698]">
                              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-[#DE802B]" />
                              <span className="flex-1 min-w-0 truncate">
                                {d.name} <span className="text-gray-500">({formatSize(d.size)})</span>
                              </span>
                              <button
                                type="button"
                                aria-label={`Remove ${d.name}`}
                                onClick={() => setDocs(ds => ds.filter((_, j) => j !== i))}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => docInput.current?.click()}
                          className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-dashed border-gray-300 py-2 text-xs font-semibold text-[#134698] hover:border-[#134698]/50"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload documents
                        </button>
                        <p className="mt-1 text-[10.5px] text-gray-500">Certificates, experience letters, ID proof (max 10 MB each)</p>
                      </ReviewCard>
                    </div>
                  </>
                )}
              </div>

              {/* ═════════ RIGHT ═════════ */}
              {/* lg:mt lines the aside up with the subtitle: eyebrow (20px + 8px mb) + h1 (48px × 1.1 + 12px mb) */}
              <aside className="min-w-0 space-y-5 lg:mt-[93px]">
                {/* Application summary */}
                <section className={`${CARD} px-5 py-4`}>
                  <h2 className="font-sans font-bold text-[#134698] text-[15px] mb-3">Application Summary</h2>
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-full bg-[#134698] flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-white" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans font-bold text-[#134698] text-base">{job.title}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#134698]">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#DE802B]" />
                          {job.location}
                        </span>
                        {job.jobType && (
                          <span className="inline-flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-[#DE802B]" />
                            {job.jobType}
                          </span>
                        )}
                        {job.education && (
                          <span className="inline-flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-[#DE802B]" />
                            {job.education}
                          </span>
                        )}
                      </div>
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

                {/* Strengths */}
                {strengths.length > 0 && (
                  <section className={`${CARD} px-5 py-4`}>
                    <div className="flex items-center gap-3 mb-3">
                      <BarChart3 className="w-6 h-6 text-[#134698]" />
                      <h2 className="font-sans font-semibold text-[#134698] text-[15px]">Key Strengths Identified</h2>
                    </div>
                    <ul className="space-y-1.5">
                      {strengths.map(s => (
                        <li key={s} className="flex items-center gap-2.5 text-xs text-gray-800">
                          <span className="w-4 h-4 rounded-full bg-[#DE802B] flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Improvements */}
                {improvements.length > 0 && (
                  <section className={`${CARD} px-5 py-4`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Lightbulb className="w-6 h-6 text-[#F5A524] fill-[#F5A524]/30" />
                      <h2 className="font-sans font-semibold text-[#134698] text-[15px]">
                        Areas for Improvement <span className="font-sans font-normal text-xs text-gray-500">(Optional)</span>
                      </h2>
                    </div>
                    <ul className="space-y-1.5">
                      {improvements.map(s => (
                        <li key={s} className="flex items-center gap-2.5 text-xs text-gray-800">
                          <CircleAlert className="w-4 h-4 text-white fill-[#F5A524] flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Actions — the final submit happens on the next step's page */}
                <div className="space-y-2.5">
                  <Link
                    href={`/career/${job._id}/submit?cv=${key}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#134698] hover:bg-[#DE802B] text-white text-[15px] font-semibold py-3.5 rounded-md transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Submit Application
                  </Link>
                  <Link
                    href={`/career/${job._id}/result?cv=${key}`}
                    className="w-full inline-flex items-center justify-center gap-2 border border-[#134698] text-[#134698] hover:bg-[#134698]/5 text-sm font-semibold py-3 rounded-md transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to AI Analysis
                  </Link>
                </div>

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

export default CareerReview;
