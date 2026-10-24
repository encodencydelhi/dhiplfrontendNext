import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import CareerEligibilityView from "@/components/pages/CareerEligibility";
import { fetchVacancy } from "@/components/pages/career/fetchVacancy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await fetchVacancy(id);
  return {
    title: job ? `Eligibility Check – ${job.title} | Design House India` : "Eligibility Check | Design House India",
    // Per-visitor page built from their own CV; nothing here for search engines
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await fetchVacancy(id);
  if (!job) notFound();
  // useSearchParams() in the view needs a Suspense boundary
  return (
    <Suspense>
      <CareerEligibilityView job={job} />
    </Suspense>
  );
}
