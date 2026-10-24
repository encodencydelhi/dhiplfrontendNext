import { cleanList, type Vacancy } from "./jobs";

/* ─── Text extraction (runs in the browser; the CV never leaves the device) ─── */

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Keep line breaks (hasEOL) so the name on the first line can be picked out later
    pages.push(content.items.map(item => ("str" in item ? item.str + (item.hasEOL ? "\n" : " ") : "")).join(""));
    // CVs often show a clickable "LinkedIn" label; the actual URL lives in the link annotation
    const links = (await page.getAnnotations())
      .map(a => (a as { url?: string }).url)
      .filter((u): u is string => !!u);
    if (links.length) pages.push(links.join("\n"));
  }
  return pages.join("\n");
}

async function extractDocxText(file: File): Promise<string> {
  // The browser build has no type declarations; extractRawText is all we need.
  const mammoth = (await import("mammoth/mammoth.browser")) as unknown as {
    extractRawText: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
  };
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}

export class CvReadError extends Error {}

export async function extractCvText(file: File): Promise<string> {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  let text = "";
  try {
    if (ext === ".pdf") text = await extractPdfText(file);
    else if (ext === ".docx") text = await extractDocxText(file);
    else throw new CvReadError("Old .DOC files can't be read. Please save your CV as PDF or DOCX and upload again.");
  } catch (err) {
    if (err instanceof CvReadError) throw err;
    throw new CvReadError("We couldn't read this file. Please try another PDF or DOCX.");
  }
  if (text.replace(/\s/g, "").length < 50) {
    // Scanned/image-only PDFs have no text layer to match against
    throw new CvReadError("We couldn't find readable text in this CV. If it's a scanned image, please upload a text-based PDF or DOCX.");
  }
  return text;
}

/* ─── Contact details ─── */

export interface CvProfile {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  dob?: string;
  gender?: string;
  linkedin?: string;
}

// Common Indian cities, checked in order; the first one found in the CV is shown
const CITIES = [
  "Delhi NCR", "New Delhi", "Delhi", "Gurugram", "Gurgaon", "Noida", "Ghaziabad", "Faridabad",
  "Mumbai", "Navi Mumbai", "Pune", "Bengaluru", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Ahmedabad", "Jaipur", "Chandigarh", "Lucknow", "Indore", "Bhopal", "Kochi", "Surat", "Nagpur",
];

// Best-effort pull of contact details; anything not found is simply left out.
export function extractProfile(cvText: string): CvProfile {
  const email = cvText.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0];
  const phone = (cvText.match(/\+?\d[\d\s()-]{8,16}\d/g) || [])
    .map(p => p.trim())
    .find(p => p.replace(/\D/g, "").length >= 10 && p.replace(/\D/g, "").length <= 13);
  const linkedin = cvText.match(/linkedin\.com\/in\/[\w-]+/i)?.[0];
  // CVs usually open with the candidate's name on its own line
  const name = cvText
    .split("\n")
    .map(l => l.trim())
    .find(l => /^[A-Za-z][A-Za-z.' ]{2,38}$/.test(l) && l.split(/\s+/).length >= 2 && l.split(/\s+/).length <= 4);
  const location = CITIES.find(c => new RegExp(`\\b${c}\\b`, "i").test(cvText));
  // Only read a date that is explicitly labelled as date of birth
  const dob = cvText
    .match(/(?:d\.?\s?o\.?\s?b\.?|date\s+of\s+birth|birth\s*date)\s*[:\-–]?\s*(\d{1,2}(?:st|nd|rd|th)?[\s./-]+(?:\d{1,2}|[A-Za-z]{3,9})[\s.,/-]+\d{2,4})/i)?.[1]
    ?.trim();
  const genderMatch = cvText.match(/\b(?:gender|sex)\s*[:\-–]?\s*(male|female|other)\b/i)?.[1];
  const gender = genderMatch ? genderMatch[0].toUpperCase() + genderMatch.slice(1).toLowerCase() : undefined;
  return { name, email, phone, location, dob, gender, linkedin };
}

/* ─── Matching ─── */

const STOPWORDS = new Set(
  ("the and for with our your you are that this from into such all any its has have will can who what " +
    "their them they these those about across over under per via etc ensure ensuring create creating " +
    "related similar strong good right balance work working role roles field skills ability using use " +
    "level year years minimum experience degree bachelor master bachelors masters").split(" ")
);

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/[\s/,-]+/)
    .map(w => w.replace(/^\.+|\.+$/g, ""))
    .filter(w => w.length >= 3 && !STOPWORDS.has(w));

const keywordsOf = (...parts: (string | string[] | undefined)[]) =>
  Array.from(new Set(tokenize(parts.flat().filter(Boolean).join(" "))));

// Share of `keywords` found in the CV, 0–1
const coverage = (keywords: string[], cvWords: Set<string>) =>
  keywords.length === 0 ? 0 : keywords.filter(k => cvWords.has(k)).length / keywords.length;

const EDUCATION_TERMS = /\b(b\.?\s?arch|m\.?\s?arch|b\.?\s?des|m\.?\s?des|b\.?\s?tech|m\.?\s?tech|b\.?\s?e\b|m\.?\s?e\b|bachelor|master|degree|diploma|graduat|university|college|institute)/i;
const TEAMWORK_TERMS = /\b(communicat|collaborat|team|stakeholder|client|coordinat|present|lead|mentor)/i;
const YEARS_RE = /(\d{1,2})\s*\+?\s*(?:years?|yrs?)/gi;

// Concrete tools/skills named in the requirements: items of "such as …" lists
// first, then other capitalised names (e.g. Revit, MS Project).
function namedSkills(requirements: string[], suchAsOnly = false): string[] {
  const found: string[] = [];
  const add = (phrase: string) => {
    const p = phrase.trim().replace(/^(and|or)\s+/i, "").replace(/\s+(or similar|etc)\.?$/i, "").replace(/[.;:]+$/, "");
    // Names start with a capital or digit; this drops filler like "similar"
    if (/^[A-Z0-9]/.test(p) && p.length >= 2 && p.length <= 30 && !found.some(f => f.toLowerCase() === p.toLowerCase())) found.push(p);
  };
  for (const req of requirements) {
    const list = req.match(/such as ([^.]+)/i)?.[1];
    if (list) list.split(/,|\bor\b|\band\b/i).forEach(add);
  }
  if (suchAsOnly) return found;
  for (const req of requirements) {
    // Capitalised words after the first one in a sentence, grouped into phrases
    for (const m of req.slice(1).matchAll(/\b([A-Z][\w+#.]*(?:\s+[A-Z][\w+#.]*)*)/g)) {
      if (!/^(Bachelor|Master|Degree|Diploma|Strong|Good|Proven|Working|Ability)/i.test(m[1])) add(m[1]);
    }
  }
  return found;
}

export interface MatchCheck {
  label: string;
  score: number; // 0–100
}

export interface MatchResult {
  score: number; // 0–100
  label: "Strong Match" | "Moderate Match" | "Low Match";
  summary: string;
  checks: MatchCheck[];
  // Words from the job's qualifications that the CV doesn't mention (for suggestions)
  missingSkills: string[];
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function scoreCv(cvText: string, job: Vacancy): MatchResult {
  const cvLower = cvText.toLowerCase();
  const cvWords = new Set(tokenize(cvText));

  // 1. Relevant experience — role title + responsibilities vocabulary, plus stated years
  const titleCov = coverage(keywordsOf(job.title), cvWords);
  const respCov = coverage(keywordsOf(cleanList(job.responsibilities), job.description), cvWords);
  const requiredYears = Number((job.experience.match(/\d+/) || [])[0]) || 0;
  const cvYears = Math.max(0, ...Array.from(cvLower.matchAll(YEARS_RE), m => Number(m[1])));
  const yearsFit = requiredYears === 0 ? 1 : cvYears === 0 ? 0.4 : Math.min(1, cvYears / requiredYears);
  const experience = clamp((titleCov * 0.35 + Math.min(1, respCov * 2) * 0.4 + yearsFit * 0.25) * 100);

  // 2. Skills & tools — vocabulary from the qualifications list
  const skillWords = keywordsOf(cleanList(job.requirements));
  const skills = clamp(Math.min(1, coverage(skillWords, cvWords) * 2.2) * 100);
  const missingSkills = namedSkills(cleanList(job.requirements))
    .filter(phrase => !tokenize(phrase).some(w => cvWords.has(w)))
    .slice(0, 4);

  // 3. Education — named qualification, or any recognisable degree
  const eduCov = coverage(keywordsOf(job.education), cvWords);
  const education = clamp((EDUCATION_TERMS.test(cvText) ? 0.6 : 0) * 100 + eduCov * 40);

  // 4. Communication & teamwork
  const teamHits = (cvLower.match(new RegExp(TEAMWORK_TERMS.source, "gi")) || []).length;
  const teamwork = clamp(Math.min(1, teamHits / 4) * 100);

  const score = clamp(experience * 0.35 + skills * 0.35 + education * 0.15 + teamwork * 0.15);

  // Same bands as the legend on the screening-result page
  const label: MatchResult["label"] = score >= 70 ? "Strong Match" : score >= 50 ? "Moderate Match" : "Low Match";

  const summary = {
    "Strong Match": "Based on your experience, skills and qualifications, you are a strong match for this position.",
    "Moderate Match": "Your profile matches several key requirements. Highlighting relevant skills and projects could strengthen it.",
    "Low Match": "Your CV doesn't reflect many of this role's requirements yet. Consider tailoring it to this position.",
  }[label];

  return {
    score,
    label,
    summary,
    checks: [
      { label: "Relevant experience for this role", score: experience },
      { label: "Skills and tools listed in your CV", score: skills },
      { label: "Education and qualifications", score: education },
      { label: "Communication and teamwork skills", score: teamwork },
    ],
    missingSkills,
  };
}

/* ─── Suggestions ─── */

// Practical, CV-specific tips: weakest areas first, then general ones to make up five.
export function buildSuggestions(result: MatchResult, job: Vacancy, profile: CvProfile | null): string[] {
  const [experience, skills, education, teamwork] = result.checks.map(c => c.score);
  const tips: string[] = [];
  // Kept to one short line each
  if (experience < 70) tips.push("Add more details about your relevant experience.");
  if (skills < 70)
    tips.push(
      result.missingSkills.length
        ? `Mention tools like ${result.missingSkills.slice(0, 2).join(" and ")}.`
        : "Include specific tools or software you use."
    );
  if (education < 70) tips.push(job.education ? `Show your qualification clearly (${job.education}).` : "Show your highest qualification clearly.");
  if (teamwork < 70) tips.push("Showcase examples of teamwork and communication.");
  if (profile && (!profile.phone || !profile.email)) tips.push("Add your phone number and email.");
  const general = [
    "Highlight certifications related to your domain.",
    "Add measurable achievements from your projects.",
    "Mention your availability and preferred location.",
    "Keep your CV updated with recent projects.",
    "Keep your contact details up to date.",
  ];
  for (const g of general) if (tips.length < 5) tips.push(g);
  return tips.slice(0, 5);
}

/* ─── Review-page prefill ─── */

const DEGREES: [RegExp, string][] = [
  [/\bph\.?\s?d\b/i, "Ph.D"],
  [/\bm\.?\s?arch\b/i, "M.Arch"],
  [/\bm\.?\s?tech\b/i, "M.Tech"],
  [/\bm\.?\s?des\b/i, "M.Des"],
  [/\bmba\b/i, "MBA"],
  [/\bm\.?\s?sc\b/i, "M.Sc"],
  [/\bm\.?\s?com\b/i, "M.Com"],
  [/\bmca\b/i, "MCA"],
  [/\bb\.?\s?arch\b/i, "B.Arch"],
  [/\bb\.?\s?tech\b/i, "B.Tech"],
  [/\bb\.?\s?e\.(?=\s|,|$)/i, "B.E."],
  [/\bb\.?\s?des\b/i, "B.Des"],
  [/\bbba\b/i, "BBA"],
  [/\bbca\b/i, "BCA"],
  [/\bb\.?\s?sc\b/i, "B.Sc"],
  [/\bb\.?\s?com\b/i, "B.Com"],
  [/\bdiploma\b/i, "Diploma"],
];

// Degrees mentioned in the CV, highest first
export const extractDegrees = (cvText: string) => DEGREES.filter(([re]) => re.test(cvText)).map(([, name]) => name);

const KNOWN_TOOLS = [
  "AutoCAD", "Revit", "SketchUp", "3ds Max", "V-Ray", "Lumion", "Rhino", "Navisworks", "Primavera", "MS Project",
  "Figma", "Sketch", "Adobe Creative Suite", "Photoshop", "Illustrator", "InDesign", "CorelDRAW",
  "MS Office", "Excel", "PowerPoint", "Tally", "SAP", "Zoho",
];

// Tools/skills the CV mentions: those named in the job's requirements first, then common design-industry tools
export function extractSkills(cvText: string, job: Vacancy): string[] {
  const lower = cvText.toLowerCase();
  const has = (name: string) => new RegExp(`(^|[^a-z])${name.toLowerCase().replace(/[.+]/g, "\$&")}([^a-z]|$)`).test(lower);
  const found: string[] = [];
  for (const name of [...namedSkills(cleanList(job.requirements), true), ...KNOWN_TOOLS]) {
    if (has(name) && !found.some(f => f.toLowerCase() === name.toLowerCase())) found.push(name);
  }
  return found.slice(0, 8);
}

// Strengths worth calling out on the review page, from the stronger checks
export function buildStrengths(result: MatchResult, job: Vacancy, skills: string[]): string[] {
  const [experience, skillScore, education, teamwork] = result.checks.map(c => c.score);
  const out: string[] = [];
  if (experience >= 60) out.push(`Relevant experience for the ${job.title} role`);
  if (skillScore >= 60) out.push(skills.length ? `Proficiency in ${skills.slice(0, 2).join(" and ")}` : "Skills that match the role's requirements");
  if (education >= 60) out.push("Qualifications aligned with the role");
  if (teamwork >= 60) out.push("Good communication and teamwork skills");
  if (!out.length) out.push("Interest in growing with Design House");
  return out;
}
