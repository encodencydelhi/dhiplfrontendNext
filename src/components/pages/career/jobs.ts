import type { StaticImageData } from "next/image";

import jobImg1 from "@/assets/image/1.webp";
import jobImg2 from "@/assets/image/2.webp";
import jobImg3 from "@/assets/image/3.webp";
import jobImg4 from "@/assets/image/4.webp";

export interface Vacancy {
  _id: string;
  title: string;
  experience: string;
  salary: string;
  location: string;
  jobType?: string;
  education?: string;
  description?: string;
  responsibilities?: string[];
  requirements: string[];
  vacancyCount?: number;
  status: string;
  order: number;
  createdAt: string;
}

// Placeholder photos (vacancies have no image field) — cycled by position so a
// job shows the same photo on the listing card and its detail page.
const JOB_IMAGES: StaticImageData[] = [jobImg1, jobImg2, jobImg3, jobImg4];

export const getJobImage = (position: number) =>
  JOB_IMAGES[((position % JOB_IMAGES.length) + JOB_IMAGES.length) % JOB_IMAGES.length];

// List items are entered in the admin panel and sometimes arrive with
// leftover JSON-array punctuation (quotes, trailing commas); strip it for display.
export const cleanListItem = (item: string) =>
  item.trim().replace(/^["'\s]+/, "").replace(/["',\s]+$/, "");

export const cleanList = (items?: string[]) => (items ?? []).map(cleanListItem).filter(Boolean);
