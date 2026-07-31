"use client";

import React, { useCallback } from "react";

/* ---------- TYPES ---------- */
interface PdfFile {
  label: string;
  path: string;
}

interface PdfSection {
  title: string;
  items: PdfFile[];
}

/* ---------- DATA ---------- */
const pdfList: PdfSection[] = [
  {
    title: "E-Brochures",
    items: [
      {
        label: "Modular Furniture",
        path: "/downloads/ebrochures/Modular Furniture.pdf",
      },
      {
        label: "Office Furniture",
        path: "/downloads/ebrochures/office furniture.pdf",
      },
      {
        label: "Modular Kitchen",
        path: "/downloads/ebrochures/Modular Kitchen.pdf",
      },
      {
        label: "SPA & Panchkula",
        path: "/downloads/ebrochures/e-broucher.pdf",
      },
    ],
  },
  {
    title: "Newsletters",
    items: [
      {
        label: "Corporate Interior",
        path: "/downloads/newsletter/corprate_nov.pdf",
      },
      {
        label: "Residential Interior",
        path: "/downloads/newsletter/residential_nov.pdf",
      },
    ],
  },
  {
    title: "Company Profile",
    items: [
      {
        label: "DHIPL Company Profile",
        path: "/downloads/dhipl-profile.pdf",
      },
    ],
  },
];

/* ---------- COMPONENT ---------- */
const DownloadsPage: React.FC = () => {
  const openPdf = useCallback((path: string) => {
    window.open(path, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-[#274896] mb-8 text-center">
          Downloads
        </h2>

        {pdfList.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            {/* Section Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              {section.title}
            </h3>

            {/* PDF Items */}
            <ul className="space-y-3">
              {section.items.map((file, fileIndex) => (
                <li key={fileIndex}>
                  <button
                    onClick={() => openPdf(file.path)}
                    className="w-full flex items-center justify-between
                    px-4 py-3 rounded-lg border border-gray-200
                    text-gray-700 hover:text-[#CDA274]
                    hover:border-[#CDA274] hover:bg-gray-50
                    transition-all duration-200"
                  >
                    <span className="text-sm font-medium">
                      {file.label}
                    </span>
                    <span className="text-xs text-gray-400">PDF</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadsPage;