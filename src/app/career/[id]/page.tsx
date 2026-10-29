import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CareerDetailView from "@/components/pages/CareerDetail";
import { fetchVacancy } from "@/components/pages/career/fetchVacancy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await fetchVacancy(id);
  if (!job) return { title: "Careers | Design House India" };
  return {
    title: `${job.title} – Careers | Design House India`,
    description: job.description || undefined,
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
  return <CareerDetailView job={job} />;
}
