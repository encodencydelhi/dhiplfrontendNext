"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { loadCvFile, takeCvHandoff, type CvHandoff } from "./cvHandoff";

// Reads the CV handed over via ?cv=<key> for this job, plus an object URL for
// the file itself (to open a PDF or download a Word file).
// `cv` is undefined while loading and null when there is no CV for this job.
export function useCvSession(jobId: string) {
  const searchParams = useSearchParams();
  const key = searchParams.get("cv");
  const [cv, setCv] = useState<CvHandoff | null | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const data = takeCvHandoff(key);
    setCv(data && data.jobId === jobId ? data : null);
  }, [key, jobId]);

  // The job page writes the file in the background, so retry briefly if it isn't there yet
  useEffect(() => {
    if (!cv) return;
    let url: string | null = null;
    let cancelled = false;
    (async () => {
      for (let attempt = 0; attempt < 10 && !cancelled; attempt++) {
        const file = await loadCvFile(key);
        if (file) {
          if (cancelled) return;
          url = URL.createObjectURL(file);
          setFileUrl(url);
          return;
        }
        await new Promise(r => setTimeout(r, 300));
      }
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [cv, key]);

  return { key, cv, fileUrl };
}
