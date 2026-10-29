// Building blocks shared by the eligibility and screening-result pages.
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Check, ChevronRight, Home, Mail, MapPin, Phone } from "lucide-react";

import type { CvProfile, MatchResult } from "./cvMatch";
import demoPhoto from "@/assets/image/demo.webp";

export const CARD = "bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.02),0px_0px_0px_1px_rgba(27,31,35,0.15)]";

export const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export const LABEL_STYLES: Record<MatchResult["label"], string> = {
  "Strong Match": "bg-green-50 text-green-700 border-green-200",
  "Moderate Match": "bg-[#DE802B]/10 text-[#B8651C] border-[#DE802B]/30",
  "Low Match": "bg-red-50 text-red-600 border-red-200",
};

export const fileExtOf = (fileName?: string) => (fileName?.split(".").pop() || "").toUpperCase();

export const scoreTone = (score: number) =>
  score >= 70 ? "text-green-600" : score >= 50 ? "text-[#DE802B]" : "text-red-500";

// Document icon with a folded top-right corner and the file type on it
export const FileTypeIcon = ({ ext, className = "w-10 h-12" }: { ext: string; className?: string }) => (
  <svg viewBox="0 0 40 48" className={`${className} flex-shrink-0`} aria-hidden="true">
    <path d="M4 0h23l13 13v31a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill={ext === "PDF" ? "#D93025" : "#2B579A"} />
    <path d="M27 0l13 13H31a4 4 0 0 1-4-4z" fill="#fff" fillOpacity="0.45" />
    <text x="20" y="37" textAnchor="middle" fill="#fff" fontSize={ext.length > 3 ? 8.5 : 10.5} fontWeight="700" fontFamily="Inter, Arial, sans-serif">
      {ext}
    </text>
  </svg>
);

export const CareerBreadcrumb = ({ jobId, jobTitle, current }: { jobId: string; jobTitle: string; current: string }) => (
  <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-sm text-gray-600 mb-5">
    <Link href="/" className="inline-flex items-center gap-2 hover:text-[#134698] transition-colors">
      <Home className="w-4 h-4 text-[#134698]" />
      Home
    </Link>
    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
    <Link href="/career" className="hover:text-[#134698] transition-colors">Careers</Link>
    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
    <Link href={`/career/${jobId}`} className="hover:text-[#134698] transition-colors">{jobTitle}</Link>
    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
    <span className="text-[#DE802B]">{current}</span>
  </nav>
);

export type StepTone = "done" | "active" | "pending";

export const STEP_TITLES = ["Upload CV", "AI Analysis", "Eligibility Result", "Review Details", "Submit Application"];

// Progress bar across any number of steps. `reach` is the step index (can be
// fractional) the coloured line runs to, measured between dot centres.
export const Stepper = ({ steps, reach, lineDone }: { steps: { title: string; state: string; tone: StepTone }[]; reach: number; lineDone: boolean }) => {
  const slot = 100 / steps.length;
  return (
    <ol className="grid relative" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      <span className="absolute top-4 h-0.5 bg-gray-200" style={{ left: `${slot / 2}%`, right: `${slot / 2}%` }} aria-hidden="true" />
      <span
        className={`absolute top-4 h-0.5 transition-all duration-700 ${lineDone ? "bg-green-600" : "bg-[#DE802B]"}`}
        style={{ left: `${slot / 2}%`, width: `${Math.max(0, reach) * slot}%` }}
        aria-hidden="true"
      />
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex flex-col items-center text-center px-1">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 mb-2 ${
              s.tone === "done"
                ? "bg-green-600 border-green-600 text-white"
                : s.tone === "active"
                  ? "bg-[#DE802B] border-[#DE802B] text-white"
                  : "bg-white border-gray-300 text-gray-500"
            }`}
          >
            {s.tone === "done" ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
          </span>
          <span className="text-[11px] sm:text-[13px] font-semibold text-[#134698] leading-tight">{s.title}</span>
          <span className={`text-[10px] sm:text-xs font-medium ${s.tone === "active" ? "text-[#DE802B]" : s.tone === "done" ? "text-green-600" : "text-gray-500"}`}>
            {s.state}
          </span>
        </li>
      ))}
    </ol>
  );
};

// Standard 5-step state for a page whose current step is `current` (0-based)
export const stepsFor = (current: number, currentLabel = "Current Step") =>
  STEP_TITLES.map((title, i) => ({
    title,
    state: i < current ? "Completed" : i === current ? currentLabel : i === current + 1 ? "Next" : "Pending",
    tone: (i < current ? "done" : i === current ? "active" : "pending") as StepTone,
  }));

// Photo + contact details pulled from the CV. Every row is always shown;
// anything the CV doesn't mention reads "Not mentioned in CV".
export const ProfileSummary = ({ profile, title }: { profile: CvProfile | null; title: string }) => {
  const rows = [
    { key: "email", icon: Mail, value: profile?.email },
    { key: "phone", icon: Phone, value: profile?.phone },
    { key: "location", icon: MapPin, value: profile?.location },
    { key: "dob", icon: CalendarDays, value: profile?.dob, extra: profile?.gender },
    { key: "linkedin", icon: Mail, value: profile?.linkedin, linkedin: true },
  ];
  return (
    <section className={`${CARD} px-5 py-4`}>
      <h2 className="font-sans font-bold text-[#134698] text-[15px] mb-3">{title}</h2>
      <div className="flex items-start gap-3">
        <div className="relative w-[88px] h-[108px] rounded-md overflow-hidden flex-shrink-0">
          <Image src={demoPhoto} alt="" fill placeholder="blur" sizes="88px" className="object-cover object-top" />
        </div>
        <div className="min-w-0">
          <p className="font-sans font-bold text-[#134698] text-base mb-1.5 truncate">{profile?.name || "Your Profile"}</p>
          <ul className="space-y-1">
            {rows.map(({ key, icon: Icon, value, extra, linkedin }) => (
              <li key={key} className="flex items-center gap-2.5 text-xs text-[#134698] min-w-0">
                {linkedin ? (
                  <span className="w-3.5 h-3.5 rounded-[3px] bg-[#0A66C2] text-white text-[9px] font-bold leading-none flex items-center justify-center flex-shrink-0">
                    in
                  </span>
                ) : (
                  <Icon className="w-3.5 h-3.5 text-[#134698] flex-shrink-0" strokeWidth={2.4} />
                )}
                {value ? (
                  linkedin ? (
                    <a
                      href={value.startsWith("http") ? value : `https://${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate hover:text-[#DE802B] transition-colors"
                    >
                      {value.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "")}
                    </a>
                  ) : (
                    <span className="truncate">
                      {value}
                      {extra && (
                        <>
                          <span className="mx-2 text-gray-300">|</span>
                          {extra}
                        </>
                      )}
                    </span>
                  )
                ) : (
                  <span className="truncate text-gray-400">Not mentioned in CV</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export const SecureNote = () => (
  <p className={`${CARD} px-5 py-4 flex items-center gap-4 text-[13px] text-[#134698]`}>
    {/* Solid padlock: filled body, outlined shackle, white keyhole */}
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
      <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="#134698" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="4" y="10" width="16" height="12" rx="2" fill="#134698" />
      <circle cx="12" cy="15.5" r="1.6" fill="#fff" />
      <rect x="11.25" y="16" width="1.5" height="3" rx="0.75" fill="#fff" />
    </svg>
    Your data is secure and will only be used for recruitment purposes.
  </p>
);
