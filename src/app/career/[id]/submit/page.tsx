import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import CareerSubmitView from "@/components/pages/CareerSubmit";
import { fetchVacancy } from "@/components/pages/career/fetchVacancy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await fetchVacancy(id);
  return {
    title: job ? `Complete Your Application – ${job.title} | Design House India` : "Complete Your Application | Design House India",
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
      <CareerSubmitView job={job} />
    </Suspense>
  );
}
