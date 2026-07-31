import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cleanDescription = (text: string | undefined): string => {
  if (!text) return "";
  // 1. Removes <!--StartFragment--> and <!--EndFragment--> tags
  let cleaned = text.replace(/(?:&lt;|<)!--\s*StartFragment\s*--(?:&gt;|>)|(?:&lt;|<)!--\s*EndFragment\s*--(?:&gt;|>)/gi, "");

  // 2. Remove empty paragraphs and redundant breaks/spaces
  cleaned = cleaned
    .replace(/<p>\s*(&nbsp;)*\s*<\/p>/gi, "") // Remove empty <p>
    .replace(/(&nbsp;){2,}/gi, " ") // Replace multiple &nbsp; with a single space
    .replace(/(<br\s*\/?>\s*){2,}/gi, "<br>") // Collapse multiple <br>s to one for tighter layout
    .replace(/\s{2,}/g, " "); // Normalize other multiple spaces

  return cleaned.trim();
};
