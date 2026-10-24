"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CircleAlert, CloudUpload, FileText, Loader2, Sparkles, X } from "lucide-react";

import type { Vacancy } from "./jobs";
import { CvReadError, extractCvText } from "./cvMatch";
import { newCvKey, saveCvFile, saveCvHandoff } from "./cvHandoff";

const CV_EXTENSIONS = [".pdf", ".doc", ".docx"];
const CV_MAX_BYTES = 5 * 1024 * 1024;

const CHECK_LABELS = [
  "Relevant experience for this role",
  "Skills and tools listed in your CV",
  "Education and qualifications",
  "Communication and teamwork skills",
  "Overall profile match",
];

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

type Status = "idle" | "reading" | "ready" | "error";

// Fired by the job page's "Apply for this Position" button: scroll to the
// upload box and, if no CV is chosen yet, flag it in red.
export const APPLY_EVENT = "career:apply";

// Job-page card: pick/drop a CV, read its text right away (so problems show up
// here), then "Check Eligibility" opens the analysis page in a new tab.
const CvEligibility = ({ job }: { job: Vacancy }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const runId = useRef(0);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [needsCv, setNeedsCv] = useState(false);
  // Bumped on every Apply click so the shake replays each time
  const [nudge, setNudge] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const hasFile = !!file;

  useEffect(() => {
    const onApply = () => {
      boxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (!hasFile) {
        setNeedsCv(true);
        setNudge(n => n + 1);
      }
    };
    window.addEventListener(APPLY_EVENT, onApply);
    return () => window.removeEventListener(APPLY_EVENT, onApply);
  }, [hasFile]);

  const readFile = async (picked: File) => {
    const id = ++runId.current;
    setStatus("reading");
    setError("");
    try {
      const extracted = await extractCvText(picked);
      if (id !== runId.current) return; // a newer file replaced this one
      setText(extracted);
      setStatus("ready");
    } catch (err) {
      if (id !== runId.current) return;
      setError(err instanceof CvReadError ? err.message : "Something went wrong while reading your CV.");
      setStatus("error");
    }
  };

  const handleFile = (picked?: File | null) => {
    if (!picked) return;
    const ext = picked.name.slice(picked.name.lastIndexOf(".")).toLowerCase();
    if (!CV_EXTENSIONS.includes(ext)) {
      setError("Please upload a PDF, DOC or DOCX file.");
      return;
    }
    if (picked.size > CV_MAX_BYTES) {
      setError("File is too large. Maximum size is 5 MB.");
      return;
    }
    setFile(picked);
    setNeedsCv(false);
    readFile(picked);
  };

  const reset = () => {
    runId.current++;
    setFile(null);
    setText("");
    setStatus("idle");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  // Synchronous on click, so the browser doesn't treat the new tab as a popup
  const checkEligibility = () => {
    if (!file || status !== "ready") return;
    const key = newCvKey();
    if (!saveCvHandoff(key, { jobId: job._id, fileName: file.name, fileSize: file.size, text, uploadedAt: Date.now() })) {
      setError("Your browser blocked storage needed for the analysis. Please allow site data and try again.");
      return;
    }
    // The file is stored in the background; the new tab waits for it when needed
    saveCvFile(key, file);
    window.open(`/career/${job._id}/eligibility?cv=${key}`, "_blank");
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />

      <div ref={boxRef} className="mb-5 scroll-mt-24">
        {file ? (
          <>
            <div className="rounded-lg border-2 border-[#134698]/30 bg-[#134698]/5 px-4 py-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-white border border-[#DE802B]/40 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-[#DE802B]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#134698] truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {formatSize(file.size)} ·{" "}
                  {status === "reading" ? "Reading CV…" : status === "error" ? "Could not read" : "CV uploaded"}
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                aria-label="Remove CV"
                className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <button
              type="button"
              onClick={status === "error" ? () => inputRef.current?.click() : checkEligibility}
              disabled={status === "reading"}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-[#134698] hover:bg-[#DE802B] disabled:opacity-70 disabled:hover:bg-[#134698] text-white text-sm font-semibold py-3 rounded-md transition-colors"
            >
              {status === "reading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Reading your CV…
                </>
              ) : status === "error" ? (
                "Upload a different file"
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Check Eligibility
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </>
        ) : (
          <div
            key={nudge}
            onDragOver={e => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setDragging(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`rounded-lg border-2 border-dashed px-4 py-3.5 text-center transition-colors ${
              dragging
                ? "border-[#DE802B] bg-[#DE802B]/5"
                : needsCv
                  ? "border-red-500 bg-red-50 animate-[cv-shake_0.4s_ease-in-out]"
                  : "border-gray-300 bg-gray-50"
            }`}
          >
            <CloudUpload className="w-7 h-7 text-[#DE802B] mx-auto mb-1" />
            <p className="font-bold text-[#134698]">Upload Your CV</p>
            <p className="text-xs text-gray-500 mt-0.5">Drag &amp; drop your file here or click to browse</p>
            <p className="text-xs text-gray-500 mb-2.5">PDF, DOC or DOCX (Max 5 MB)</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full max-w-[200px] bg-[#134698] hover:bg-[#DE802B] text-white text-sm font-semibold py-1.5 rounded-md transition-colors"
            >
              Choose File
            </button>
          </div>
        )}

        {needsCv && !file && (
          <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600">
            <CircleAlert className="w-4 h-4 flex-shrink-0" />
            Please upload your CV to apply for this position.
          </p>
        )}
        {error && <p className="text-xs text-red-600 mt-2 leading-relaxed">{error}</p>}
      </div>

      <h3 className="font-display font-bold text-[#134698] text-[17px] mb-2.5">AI will check:</h3>
      <ul className="space-y-2 mb-4">
        {CHECK_LABELS.map(label => (
          <li key={label} className="flex items-center gap-2.5 text-[12.5px] md:text-[13.5px] text-gray-700 leading-relaxed">
            <span className="w-[18px] h-[18px] rounded-full bg-[#DE802B] flex items-center justify-center flex-shrink-0">
              <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />
            </span>
            {label}
          </li>
        ))}
      </ul>

      <div className="rounded-lg bg-[#134698]/5 px-3.5 py-3.5 flex items-center gap-2.5">
        <Sparkles className="w-[18px] h-[18px] text-[#DE802B] flex-shrink-0" />
        <p className="text-[12.5px] md:text-[13.5px] text-[#134698] leading-snug">
          {status === "ready"
            ? "Your CV is ready. Click “Check Eligibility” to see your match score."
            : "Upload your CV to see how well your profile matches this position."}
        </p>
      </div>
    </>
  );
};

export default CvEligibility;
