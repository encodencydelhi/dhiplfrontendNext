"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const CallFloat = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchCallNumber = async () => {
      try {
        const response = await api.get("/api/social-media");
        if (response.data.success && response.data.data) {
          setPhoneNumber(response.data.data.callNumber || "");
        }
      } catch (error) {
        console.error("Error fetching call number:", error);
      }
    };
    fetchCallNumber();
  }, []);

  if (!phoneNumber) return null;

  return (
    <>
      <style>{`
        @keyframes phonePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes ringPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .call-float-btn {
          position: relative;
          z-index: 50;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(30, 58, 138, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          animation: phonePulse 2s ease-in-out infinite;
        }

        .call-float-btn:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 8px 24px rgba(30, 58, 138, 0.6);
          background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
        }

        .call-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          animation: ringPulse 2s ease-out infinite;
        }

        .call-ring:nth-child(2) {
          animation-delay: 0.5s;
        }

        .call-ring:nth-child(3) {
          animation-delay: 1s;
        }

        .call-icon {
          color: white;
          animation: phonePulse 2s ease-in-out infinite;
        }

        @media (max-width: 1024px) {
          .call-float-btn {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 640px) {
          .call-float-btn {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>

      <a
        href={`tel:${phoneNumber}`}
        className="call-float-btn"
        aria-label="Call us"
        onClick={() => {
          api.post("/api/analytics/log", { iconName: "Call Float" }).catch(console.error);
        }}
      >
        {/* Pulse Rings */}
        <div className="call-ring"></div>
        <div className="call-ring"></div>
        <div className="call-ring"></div>

        {/* Call Icon */}
        <Phone className="call-icon" size={18} strokeWidth={2.5} />
        <span className="sr-only">Call Us</span>
      </a>
    </>
  );
};

export default CallFloat;