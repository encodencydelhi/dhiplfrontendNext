"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { sanitizeJsonLd } from "@/lib/seo";

const GlobalFooterScripts = () => {
  const [footerScripts, setFooterScripts] = useState("");

  useEffect(() => {
    const fetchFooterScripts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/seo-settings/advanced`);
        const result = await response.json();
        if (result.success) {
          setFooterScripts(result.data.footerScripts || "");
        }
      } catch (error) {
        console.error("Error fetching footer scripts:", error);
      }
    };
    fetchFooterScripts();
  }, []);

  if (!footerScripts) return null;

  const cleanHtml = footerScripts
    .replace(/<div[^>]*>/g, "")
    .replace(/<\/div>/g, "\n")
    .replace(/<p[^>]*>/g, "")
    .replace(/<\/p>/g, "\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  // Only render JSON-LD blocks that actually parse — broken/garbage schema
  // gets dropped instead of injected into the page.
  const sanitizedHtml = cleanHtml.replace(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
    (full, attrsRaw, content) => {
      const attrs = String(attrsRaw).toLowerCase();
      if (attrs.includes("application/ld+json")) {
        const safe = sanitizeJsonLd(String(content));
        return safe ? `<script type="application/ld+json">${safe}</script>` : "";
      }
      return full;
    }
  );

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default GlobalFooterScripts;
