import { cache } from "react";

import { API_URL } from "@/lib/api";
import type { Vacancy } from "./jobs";

// Server-side fetch of one active vacancy. cache() dedupes it between
// generateMetadata() and the page body within a request.
export const fetchVacancy = cache(async (id: string): Promise<Vacancy | null> => {
  try {
    const res = await fetch(`${API_URL}/api/vacancies/active/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? (json.data as Vacancy) : null;
  } catch {
    return null;
  }
});
