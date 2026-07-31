"use client";

import { useState } from "react";

import {
  m,
  AnimatePresence,
} from "framer-motion";



import { Send, Mail, Phone, Clock, MapPin, Loader2, CheckCircle, Share2 } from "lucide-react";
import { toast } from "react-toastify";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import DynamicHero from "@/components/layout/DynamicHero";
import { api } from "@/lib/api";
import { useSettings } from "@/hooks/useSettings";

const SERVICES_DATA = {
  "Interiors": ["Retail Interior", "Corporate Interior", "Restaurant Interior", "Shop in Shops"],
  "Merchandising": ["Retail Display Merchandising", "Acrylic Display", "Gondolas", "Window Display"],
  "Kiosk": ["Retail Kiosk", "Mobile Booth"],
  "Signage": [],
  "Exhibitions & Events": [],
  "Office Interior": ["Modular Work Station", "MD Cabin", "Chairs"],
  "Furniture": ["Wardrobe", "Kitchen", "LCD Unit", "Dressing Table", "Sofas"]
};

const Contact = () => {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    subService: "",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // OTP States - Separate for Phone and Email
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [emailOtpError, setEmailOtpError] = useState("");
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "service") {
      setFormData({
        ...formData,
        service: value,
        subService: "" // Reset subservice when main service changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
    
    // Reset verification if phone/email changes
    if (name === "phone") { setIsPhoneVerified(false); setPhoneOtpSent(false); setPhoneOtp(""); }
    if (name === "email") { setIsEmailVerified(false); setEmailOtpSent(false); setEmailOtp(""); }
  };

  const handleSendOtp = async (type: "phone" | "email") => {
    if (type === "phone") {
      if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
        setErrors({ ...errors, phone: "Enter a valid 10-digit number first" });
        return;
      }
      setPhoneOtpLoading(true);
      setPhoneOtpSent(true);
      setPhoneOtp("");
      setPhoneOtpError("");
      try {
        const res = await api.post("/api/otp/send-whatsapp", { mobile: formData.phone });
        if (res.data.success) {
          toast.info(`OTP sent to your WhatsApp (${formData.phone}). Check your WhatsApp!`);
        } else {
          toast.error(res.data.message || "Failed to send OTP");
          setPhoneOtpSent(false);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to send WhatsApp OTP");
        setPhoneOtpSent(false);
      } finally {
        setPhoneOtpLoading(false);
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setErrors({ ...errors, email: "Enter a valid email first" });
        return;
      }
      setEmailOtpLoading(true);
      setEmailOtpSent(true);
      setEmailOtp("");
      setEmailOtpError("");
      try {
        const res = await api.post("/api/otp/send-email", { email: formData.email });
        if (res.data.success) {
          toast.info(`OTP sent to ${formData.email}. Check your inbox!`);
        } else {
          toast.error(res.data.message || "Failed to send OTP");
          setEmailOtpSent(false);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to send OTP");
        setEmailOtpSent(false);
      } finally {
        setEmailOtpLoading(false);
      }
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp.trim()) { setPhoneOtpError("Please enter the OTP"); return; }
    setPhoneOtpLoading(true);
    try {
      const res = await api.post("/api/otp/verify-whatsapp", { mobile: formData.phone, otp: phoneOtp });
      if (res.data.success) {
        setIsPhoneVerified(true);
        setPhoneOtpSent(false);
        setPhoneOtpError("");
        toast.success("Phone verified successfully!");
      } else {
        setPhoneOtpError(res.data.message || "Invalid OTP");
      }
    } catch (err: any) {
      setPhoneOtpError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp.trim()) { setEmailOtpError("Please enter the OTP"); return; }
    setEmailOtpLoading(true);
    try {
      const res = await api.post("/api/otp/verify-email", { email: formData.email, otp: emailOtp });
      if (res.data.success) {
        setIsEmailVerified(true);
        setEmailOtpSent(false);
        setEmailOtpError("");
        toast.success("Email verified successfully!");
      } else {
        setEmailOtpError(res.data.message || "Invalid OTP");
      }
    } catch (err: any) {
      setEmailOtpError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      message: ""
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!isEmailVerified) {
      newErrors.email = "Email must be verified";
      isValid = false;
    }
    if (formData.message.trim() && formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please verify your contact details first");
      return;
    }

    try {
      setSubmitting(true);

      const submitData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        service: formData.service.trim(),
        subService: formData.subService.trim(),
        message: formData.message.trim()
      };

      const response = await api.post("/api/contacts", submitData);

      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setFormData({
            name: "",
            phone: "",
            email: "",
            service: "",
            subService: "",
            message: ""
          });
          setIsPhoneVerified(false);
          setIsEmailVerified(false);
          setIsSuccess(false);
        }, 4000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Topbar />
      <Navbar />

      {/* Dynamic HERO SECTION */}
      <DynamicHero
        pageName="Contact Us"
        fallbackImage="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80"
      />

      {/* OFFICE LOCATIONS SECTION */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-wrap justify-center gap-8">
            {settings?.addresses?.length ? (
              settings.addresses.map((office, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full sm:w-[320px] bg-white border-2 border-gray-200 p-6 hover:shadow-2xl hover:border-[#134698] transition-all duration-300 rounded-none transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#DE802B]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#DE802B]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#134698] uppercase tracking-wide">
                        {office.title || office.city}
                      </h3>
                      <p className="text-xs font-semibold text-[#DE802B]">{office.city}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed space-y-1">
                    <div dangerouslySetInnerHTML={{ __html: office.street }} />
                    {(office.city || office.state || office.zipCode) && (
                      <p className="opacity-75">
                        {[office.city, office.state, office.zipCode].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <a 
                      href={office.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${office.title || office.city} ${office.street || ''} ${office.city || ''}`)}`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center justify-center gap-1.5 px-2 py-2 bg-[#134698]/5 text-[#134698] border border-[#134698]/20 hover:bg-[#134698] hover:text-white transition-all duration-300 text-[10px] font-bold uppercase rounded shadow-sm"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Direction
                    </a>
                    
                    <button 
                      onClick={() => {
                        const addressText = `${office.title || 'Design House Office'}\n${office.street ? office.street.replace(/<[^>]*>?/gm, '') : ''}\n${office.city || ''}`;
                        if (navigator.share) {
                          navigator.share({
                            title: office.title || 'Office Location',
                            text: addressText,
                            url: window.location.href
                          }).catch(console.error);
                        } else {
                          navigator.clipboard.writeText(addressText);
                          toast.success("Address copied to clipboard!");
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-2 py-2 bg-[#DE802B]/5 text-[#DE802B] border border-[#DE802B]/20 hover:bg-[#DE802B] hover:text-white transition-all duration-300 text-[10px] font-bold uppercase rounded shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Share
                    </button>
                  </div>
                </m.div>
              ))
            ) : (
              <div className="w-full text-center text-gray-400 py-10">Loading locations...</div>
            )}

          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="relative py-10 px-4 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]"></div>
              <span className="text-sm md:text-base uppercase tracking-[0.35em] text-[#134698] font-bold">
                GET IN TOUCH
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#134698]"></div>
            </m.div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              Send Your Details or <span className="text-[#DE802B]">Contact Us</span>
            </h2>
          </m.div>

          <div className="grid lg:grid-cols-5 gap-12">
            <m.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="border-l-4 border-[#DE802B] pl-6 py-4 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-6 h-6 text-[#DE802B]" />
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Call Us</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-700 font-medium">
                  {settings?.phones?.filter(p => p.forContact).map((p, i) => (
                    <a key={i} href={`tel:${p.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#DE802B] transition-colors cursor-pointer block">
                      {p.phone}
                    </a>
                  ))}
                  {!settings?.phones?.some(p => p.forContact) && <p className="text-gray-400 italic">No contact number available</p>}
                </div>
              </div>

              <div className="border-l-4 border-[#134698] pl-6 py-4 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-6 h-6 text-[#134698]" />
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Email Us</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-700 font-medium">
                  {settings?.emails?.filter(e => e.forContact).map((e, i) => (
                    <a key={i} href={`mailto:${e.email}`} className="text-sm text-gray-700 font-medium hover:text-[#134698] transition-colors cursor-pointer block">{e.email}</a>
                  ))}
                  {!settings?.emails?.some(e => e.forContact) && <p className="text-gray-400 italic">No email available</p>}
                </div>
              </div>

              <div className="border-l-4 border-[#DE802B] pl-6 py-4 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-[#DE802B]" />
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Working Hours</h3>
                </div>
                <div className="space-y-1 text-sm text-gray-700 font-medium">
                  <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <m.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="border-2 border-green-500 p-12 bg-green-50 shadow-lg flex flex-col items-center justify-center min-h-[500px]"
                  >
                    <m.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
                    </m.div>

                    <m.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold text-gray-900 mb-4 text-center"
                    >
                      Message Sent Successfully!
                    </m.h3>

                    <m.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 text-center mb-8 max-w-md text-lg"
                    >
                      Thank you for contacting us! Our team will get back to you within 24 hours.
                    </m.p>

                    <m.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-2 text-sm text-gray-500"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Form will reset automatically...
                    </m.div>
                  </m.div>
                ) : (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-2 border-gray-200 p-6 bg-white shadow-lg"
                  >
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Name Field */}
                        <div>
                          <input type="text" name="name" placeholder="Full Name..."
                            value={formData.name} onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-[#134698] transition-colors text-sm`}
                            required disabled={submitting} />
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Phone Field with Verify Button */}
                        <div className="relative">
                          <input type="tel" name="phone" placeholder="Phone Number..."
                            value={formData.phone} onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-[#134698] transition-colors text-sm pr-24`}
                            required disabled={submitting || isPhoneVerified || phoneOtpSent} />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            {!isPhoneVerified && !phoneOtpSent && (
                              <button type="button" onClick={() => handleSendOtp("phone")}
                                disabled={phoneOtpLoading}
                                className="px-3 py-1.5 bg-[#134698] text-white text-[10px] uppercase font-bold rounded hover:bg-[#DE802B] transition-colors disabled:opacity-70">
                                {phoneOtpLoading ? "..." : "Verify"}
                              </button>
                            )}
                            {isPhoneVerified && (
                              <div className="px-2 text-green-500 flex items-center gap-1 bg-green-50 rounded py-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-bold uppercase">Verified</span>
                              </div>
                            )}
                          </div>
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Email Field with Verify Button */}
                        <div className="relative">
                          <input type="email" name="email" placeholder="Email Address..."
                            value={formData.email} onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-[#134698] transition-colors text-sm pr-24`}
                            required disabled={submitting || isEmailVerified || emailOtpSent} />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            {!isEmailVerified && !emailOtpSent && (
                              <button type="button" onClick={() => handleSendOtp("email")}
                                disabled={emailOtpLoading}
                                className="px-3 py-1.5 bg-[#134698] text-white text-[10px] uppercase font-bold rounded hover:bg-[#DE802B] transition-colors disabled:opacity-70">
                                {emailOtpLoading ? "..." : "Verify"}
                              </button>
                            )}
                            {isEmailVerified && (
                              <div className="px-2 text-green-500 flex items-center gap-1 bg-green-50 rounded py-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-bold uppercase">Verified</span>
                              </div>
                            )}
                          </div>
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Service Selection */}
                        <select name="service" value={formData.service} onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#134698] transition-colors text-sm bg-white"
                          disabled={submitting}>
                          <option value="">Select Service...</option>
                          {Object.keys(SERVICES_DATA).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Sub-Service */}
                      <AnimatePresence>
                        {formData.service && SERVICES_DATA[formData.service as keyof typeof SERVICES_DATA]?.length > 0 && (
                          <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <select name="subService" value={formData.subService} onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-[#134698]/30 focus:outline-none focus:border-[#134698] transition-colors text-sm bg-gray-50 font-medium"
                              disabled={submitting}>
                              <option value="">Select Sub-Service...</option>
                              {SERVICES_DATA[formData.service as keyof typeof SERVICES_DATA].map((ss) => (
                                <option key={ss} value={ss}>{ss}</option>
                              ))}
                            </select>
                          </m.div>
                        )}
                      </AnimatePresence>

                      {/* OTP Inputs - Side by Side (Phone Left | Email Right) */}
                      {(phoneOtpSent || emailOtpSent) && (
                        <m.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="grid md:grid-cols-2 gap-4"
                        >
                          {/* 📱 Phone OTP - Left Half */}
                          {phoneOtpSent && (
                            <div className="bg-[#DE802B]/5 border-2 border-[#DE802B]/20 p-3 rounded-lg">
                              <label className="text-[10px] font-bold uppercase text-[#DE802B] mb-2 block">📱 WhatsApp OTP</label>
                              <input type="text" placeholder="Enter 6-digit OTP from WhatsApp"
                                value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)}
                                className={`w-full px-3 py-2 border-2 ${phoneOtpError ? 'border-red-500' : 'border-gray-200'} rounded focus:border-[#134698] transition-colors text-sm font-mono tracking-widest mb-2`}
                                maxLength={6} />
                              {phoneOtpError && <p className="text-red-500 text-[10px] mb-2 font-bold">{phoneOtpError}</p>}
                              <div className="flex gap-2">
                                <button type="button" onClick={handleVerifyPhoneOtp} disabled={phoneOtpLoading}
                                  className="flex-1 py-1.5 bg-[#134698] text-white text-[10px] font-bold uppercase rounded hover:bg-[#DE802B] transition-all disabled:opacity-70">
                                  {phoneOtpLoading ? "Verifying..." : "Confirm"}
                                </button>
                                <button type="button" onClick={() => { setPhoneOtpSent(false); setPhoneOtp(""); setPhoneOtpError(""); }}
                                  className="px-3 py-1.5 text-gray-500 text-[10px] font-bold uppercase hover:text-red-500 transition-colors">Cancel</button>
                              </div>
                            </div>
                          )}
                          {/* ✉️ Email OTP - Right Half */}
                          {emailOtpSent && (
                            <div className="bg-[#134698]/5 border-2 border-[#134698]/20 p-3 rounded-lg">
                              <label className="text-[10px] font-bold uppercase text-[#134698] mb-2 block">✉️ Email OTP Verification</label>
                              <input type="text" placeholder="Enter 6-digit OTP from email"
                                value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)}
                                className={`w-full px-3 py-2 border-2 ${emailOtpError ? 'border-red-500' : 'border-gray-200'} rounded focus:border-[#134698] transition-colors text-sm font-mono tracking-widest mb-2`}
                                maxLength={6} />
                              {emailOtpError && <p className="text-red-500 text-[10px] mb-2 font-bold">{emailOtpError}</p>}
                              <div className="flex gap-2">
                                <button type="button" onClick={handleVerifyEmailOtp} disabled={emailOtpLoading}
                                  className="flex-1 py-1.5 bg-[#134698] text-white text-[10px] font-bold uppercase rounded hover:bg-[#DE802B] transition-all disabled:opacity-70">
                                  {emailOtpLoading ? "Verifying..." : "Confirm"}
                                </button>
                                <button type="button" onClick={() => { setEmailOtpSent(false); setEmailOtp(""); setEmailOtpError(""); }}
                                  className="px-3 py-1.5 text-gray-500 text-[10px] font-bold uppercase hover:text-red-500 transition-colors">Cancel</button>
                              </div>
                            </div>
                          )}
                        </m.div>
                      )}

                      <div>
                        <textarea name="message" placeholder="Describe us about your requirement..."
                          value={formData.message} onChange={handleInputChange} rows={5}
                          className={`w-full px-4 py-3 border-2 ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-[#134698] transition-colors resize-none text-sm`}
                          disabled={submitting} />
                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                      </div>

                      <button onClick={handleSubmit} disabled={submitting}
                        className={`w-full font-bold py-4 px-6 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider text-sm shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed text-white ${!isEmailVerified ? 'opacity-70 bg-gray-500 cursor-not-allowed' : 'bg-[#DE802B] hover:bg-[#c97024]'}`}>
                        {submitting ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        ) : (
                          <><Send className="w-4 h-4" /> Send Message</>
                        )}
                      </button>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>

            </m.div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="relative py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <m.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
            className="border-2 border-gray-200 overflow-hidden shadow-xl"
          >
            {settings?.mapIframe && settings.mapIframe.includes('<iframe') ? (
              <div dangerouslySetInnerHTML={{
                __html: settings.mapIframe
                  .replace(/width="[^"]*"/i, 'width="100%"')
                  .replace(/height="[^"]*"/i, 'height="450"')
              }} />
            ) : (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.61252705822!2d77.22288779999999!3d28.667856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfb89c993c94f%3A0xa0b3c2e1d86f7e0f!2sMohan%20Nagar%2C%20Ghaziabad%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </m.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
