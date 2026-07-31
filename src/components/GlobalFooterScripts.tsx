"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

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

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};

export default GlobalFooterScripts;
