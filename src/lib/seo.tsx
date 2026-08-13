import type { Metadata } from "next";
import { cache } from "react";
import { API_URL } from "./api";

export interface SeoData {
  metaTitle?: string;
  title?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaKeyword?: string;
  canonicalTag?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  openGraphTags?: string;
  schemaMarkup?: string;
  bgImage?: string;
  mainImage?: { url?: string };
}

const decodeAndStripHtml = (str?: string) => {
  if (!str) return "";
  const decoded = str
    .replace(/&amp;lt;/gi, "<").replace(/&amp;gt;/gi, ">")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&amp;amp;/gi, "&").replace(/&amp;/gi, "&")
    .replace(/&amp;quot;/gi, '"').replace(/&quot;/gi, '"')
    .replace(/&amp;apos;/gi, "'").replace(/&apos;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/gi, " ");
  return decoded.replace(/<\/?[^>]+(>|$)/g, "").trim();
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.designhouse.co.in";

/**
 * Sanitizes the CMS's canonicalTag field before it goes into <head>.
 * - Strips stray HTML (contentEditable editor may leave markup behind)
 * - Rejects obvious junk (e.g. "[object Object]" from the old admin bug)
 * - Upgrades relative paths ("/about") to absolute site URLs
 * - Rejects values that are not a clean URL (spaces, uppercase paths, etc.)
 */
export function normalizeCanonical(raw?: string): string | undefined {
  const cleaned = decodeAndStripHtml(raw);
  if (!cleaned || cleaned === "[object Object]" || cleaned.includes("[object")) return undefined;
  if (cleaned.includes(" ") || /[A-Z]/.test(cleaned.split("/")[1] || "")) return undefined;

  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  if (cleaned.startsWith("/")) return `${SITE_URL}${cleaned}`;
  return undefined;
}

/**
 * The CMS's rich-text editor wraps every line in <div>/<p> and HTML-encodes
 * angle brackets, so a pasted <script>/<meta> tag arrives as e.g.
 * "&lt;script&gt;\r<div>{...}</div>". Undo both before tag-scanning.
 * Mirrors the old SeoHelmet.tsx's decode step exactly, minus DOMParser
 * (not available server-side — this needs to run in generateMetadata).
 */
const cleanRichTextWrapper = (html: string): string =>
  html
    .replace(/&amp;lt;/gi, "<").replace(/&amp;gt;/gi, ">")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&amp;amp;/gi, "&").replace(/&amp;/gi, "&")
    .replace(/&amp;quot;/gi, '"').replace(/&quot;/gi, '"')
    .replace(/&amp;apos;/gi, "'").replace(/&apos;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/<div[^>]*>/gi, "").replace(/<\/div>/gi, "\n")
    .replace(/<p[^>]*>/gi, "").replace(/<\/p>/gi, "\n")
    .replace(/<span[^>]*>/gi, "").replace(/<\/span>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n");

const parseTagAttrs = (attrString: string): Record<string, string> => {
  const attrs: Record<string, string> = {};
  const re = /([a-zA-Z0-9_:-]+)\s*=\s*"([^"]*)"|([a-zA-Z0-9_:-]+)\s*=\s*'([^']*)'/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrString))) {
    if (m[1]) attrs[m[1]] = m[2];
    else if (m[3]) attrs[m[3]] = m[4];
  }
  return attrs;
};

/** Extracts admin-pasted raw <meta>/<link> tags (e.g. a full custom OG tag set) from a rich-text field. */
export function parseRawMetaTags(html?: string): Record<string, string>[] {
  if (!html) return [];
  const clean = cleanRichTextWrapper(html);
  if (!clean.includes("<")) return [];
  const results: Record<string, string>[] = [];
  const tagRe = /<(meta|link)\s+([^>]*)\/?>/gi;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(clean))) {
    const attrs = parseTagAttrs(m[2]);
    if (Object.keys(attrs).length > 0) results.push({ __tag: m[1].toLowerCase(), ...attrs });
  }
  return results;
}

/** Extracts one or more JSON-LD blocks from an admin-pasted schema markup field. */
export function parseSchemaScripts(html?: string): string[] {
  if (!html) return [];
  const clean = cleanRichTextWrapper(html);
  if (!clean.includes("<")) {
    const bare = clean.trim();
    return bare ? [bare] : [];
  }
  const scripts: string[] = [];
  const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = scriptRe.exec(clean))) {
    const content = m[1].trim();
    if (content) scripts.push(content);
  }
  if (scripts.length === 0) {
    const stripped = clean.replace(/<\/?[^>]+(>|$)/g, "").trim();
    if (stripped) scripts.push(stripped);
  }
  return scripts;
}

/** Server-side equivalent of the old client-side SeoHelmet fetch for a given route path. */
async function fetchPageSeoUncached(pagePath: string): Promise<SeoData | null> {
  try {
    let path = pagePath;
    if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);
    const res = await fetch(`${API_URL}/api/seo/single?page=${encodeURIComponent(path)}`, {
      next: { revalidate: 300 },
    });
    const json = await res.json();
    if (json.success) return json.data as SeoData;
    return null;
  } catch {
    return null;
  }
}
// cache() dedupes this per request so generateMetadata() and the page body
// (which both need the same SEO record — one for <head> tags, one for the
// JSON-LD/raw-OG <script>/<meta> tags in the body) only hit the API once.
export const fetchPageSeo = cache(fetchPageSeoUncached);

/** Maps the CMS SEO payload onto Next's Metadata shape (replaces SeoHelmet's <Helmet> tags). */
export function buildMetadata(seo: SeoData | null, fallbackTitle = "Design House India"): Metadata {
  if (!seo) return { title: fallbackTitle };

  const metaTitle = decodeAndStripHtml(seo.metaTitle) || seo.title || fallbackTitle;
  const metaDescription = decodeAndStripHtml(seo.metaDescription);
  const metaKeywords = decodeAndStripHtml(seo.metaKeywords || seo.metaKeyword);
  const canonical = normalizeCanonical(seo.canonicalTag);
  const ogImageRaw = seo.ogImage || seo.bgImage || seo.mainImage?.url;
  const ogImage = ogImageRaw
    ? ogImageRaw.startsWith("http")
      ? ogImageRaw
      : `${API_URL}${ogImageRaw.startsWith("/") ? "" : "/"}${ogImageRaw}`
    : undefined;

  // If the admin pasted a raw og:title/og:description/og:image tag directly,
  // that takes precedence — don't also emit our derived version and end up
  // with duplicate tags (mirrors SeoHelmet's hasRawTitle/hasRawDesc/hasRawImage checks).
  const rawOgTags = parseRawMetaTags(seo.openGraphTags);
  const hasRaw = (prop: string) => rawOgTags.some((t) => t.property === prop);

  return {
    title: metaTitle,
    description: metaDescription || undefined,
    keywords: metaKeywords || undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: hasRaw("og:title") ? undefined : seo.ogTitle || metaTitle,
      description: hasRaw("og:description") ? undefined : seo.ogDescription || metaDescription || undefined,
      images: hasRaw("og:image") ? undefined : ogImage ? [ogImage] : undefined,
    },
  };
}

/**
 * Renders the parts of a CMS SEO record that Next's `metadata` export can't
 * express: JSON-LD schema scripts and any raw admin-pasted <meta>/<link> tags
 * (e.g. a full custom OG set). Next hoists <meta>/<link>/<script> tags found
 * anywhere in the tree into <head>, so this can render directly in page body.
 */
export function AdvancedSeoTags({ seo }: { seo: SeoData | null | undefined }) {
  if (!seo) return null;
  const schemaScripts = parseSchemaScripts(seo.schemaMarkup);
  const rawTags = parseRawMetaTags(seo.openGraphTags);

  return (
    <>
      {schemaScripts.map((script, i) => (
        // eslint-disable-next-line react/no-danger
        <script key={`schema-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: script }} />
      ))}
      {rawTags.map(({ __tag, ...attrs }, i) =>
        __tag === "link" ? (
          // eslint-disable-next-line @next/next/no-page-custom-font
          <link key={`ogtag-${i}`} {...(attrs as any)} />
        ) : (
          <meta key={`ogtag-${i}`} {...(attrs as any)} />
        )
      )}
    </>
  );
}

/**
 * Server-side equivalent of useServiceDetail() — used by service pages and
 * portfolio leaf pages (via PageTemplate) whose SEO comes from the
 * /api/service-details/:serviceName endpoint rather than /api/seo/single.
 */
async function fetchServiceDetailUncached(serviceName: string): Promise<any | null> {
  if (!serviceName) return null;
  try {
    const res = await fetch(`${API_URL}/api/service-details/${encodeURIComponent(serviceName)}`, {
      next: { revalidate: 300 },
    });
    const json = await res.json();
    if (json.success && json.data) return json.data;
    return null;
  } catch {
    return null;
  }
}
export const fetchServiceDetail = cache(fetchServiceDetailUncached);

/** Mirrors ServiceContentSection's setCustomSeo merge logic, mapped onto Next's Metadata. */
export function buildServiceMetadata(data: any | null, fallbackTitle = "Design House India"): Metadata {
  if (!data) return { title: fallbackTitle };
  const seo: SeoData = {
    ...(data.seo || {}),
    title: data.title || fallbackTitle,
    bgImage: data.bgImage,
  };
  return buildMetadata(seo, fallbackTitle);
}

/** Same shape data.seo used above — for rendering <AdvancedSeoTags> alongside a service/portfolio page. */
export function serviceDetailSeo(data: any | null): SeoData | null {
  return data?.seo ?? null;
}

/** Server-side equivalent of BlogDetail's api.get(`/api/blogs/slug/:id`) call. */
async function fetchBlogBySlugUncached(id: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_URL}/api/blogs/slug/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    const json = await res.json();
    if (json.success) return json.data;
    return null;
  } catch {
    return null;
  }
}
export const fetchBlogBySlug = cache(fetchBlogBySlugUncached);

/** Mirrors BlogDetail's setCustomSeo(blogData) — the Blog model carries metaTitle/metaDescription/ogImage/canonicalTag/schemaMarkup directly. */
export function buildBlogMetadata(post: any | null, fallbackTitle = "Design House India"): Metadata {
  if (!post) return { title: fallbackTitle };
  const seo: SeoData = {
    ...post,
    title: post.title || fallbackTitle,
    bgImage: post.image,
  };
  return buildMetadata(seo, fallbackTitle);
}

/** Server-side equivalent of DynamicLocationPage's api.get(`/api/custom-pages/slug/:slug`) call. */
async function fetchCustomPageBySlugUncached(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_URL}/api/custom-pages/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    const json = await res.json();
    if (json.success) return json.data;
    return null;
  } catch {
    return null;
  }
}
export const fetchCustomPageBySlug = cache(fetchCustomPageBySlugUncached);

/** Mirrors DynamicLocationPage's setCustomSeo(pageData.seo). */
export function buildCustomPageMetadata(pageData: any | null, fallbackTitle = "Design House India"): Metadata {
  if (!pageData) return { title: fallbackTitle };
  const seo: SeoData = {
    ...(pageData.seo || {}),
    title: pageData.title || fallbackTitle,
  };
  return buildMetadata(seo, fallbackTitle);
}
