"use client";

import { m, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";

interface BookingDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingDrawer = ({ open, onOpenChange }: BookingDrawerProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Email OTP States
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpError, setEmailOtpError] = useState("");
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);

  // Phone OTP States (WhatsApp)
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);

  // Disable background scrolling when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [open]);

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
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    if (!isEmailVerified) {
      newErrors.email = "Email must be verified via OTP";
      isValid = false;
    }

    if (!isPhoneVerified) {
      newErrors.phone = "Phone must be verified via WhatsApp OTP";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendEmailOtp = async () => {
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

  const handleSendPhoneOtp = async () => {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
    if (field === "email") {
      setIsEmailVerified(false);
      setEmailOtpSent(false);
      setEmailOtp("");
    }
    if (field === "phone") {
      setIsPhoneVerified(false);
      setPhoneOtpSent(false);
      setPhoneOtp("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/api/bookings', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        message: formData.message.trim()
      });

      if (response.data.success) {
        setIsSuccess(true);
        
        // Immediate reset so it's clean for next time
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: ""
        });
        setErrors({ name: "", email: "", phone: "", message: "" });
        setIsEmailVerified(false);
        setEmailOtpSent(false);
        setIsPhoneVerified(false);
        setPhoneOtpSent(false);
        setIsSubmitting(false);

        // Auto-close after 4 seconds
        setTimeout(() => {
          setIsSuccess(false);
          onOpenChange(false);
        }, 4000);
      }
    } catch (error: any) {
      console.error("Booking submission error:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit booking request. Please try again.";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.5 },
        opacity: { duration: 0.3, delay: 0.5 }
      }
    }
  } as any;

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => !isSubmitting && !isSuccess && onOpenChange(false)}
          />

          <m.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="relative bg-[#001F3D] px-6 py-4 border-b-2 border-amber-400">
                <button
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting || isSuccess}
                  className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="text-center pr-8">
                  <h2 className="text-2xl font-serif font-bold text-white">
                    BOOK A{" "}
                    <span className="text-[#DE802B] relative inline-block">
                      MEETING
                      <m.svg
                        className="absolute -bottom-2 left-0 w-full h-3 text-white"
                        viewBox="0 0 200 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        initial="hidden"
                        animate="visible"
                      >
                        <m.path
                          d="M2 10C60 2, 140 2, 198 10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          variants={pathVariants}
                        />
                      </m.svg>
                    </span>
                  </h2>
                  <p className="text-blue-100 text-sm mt-2">Let's discuss your project</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                  >
                    <m.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                    </m.div>
                    <m.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold text-gray-900 mb-3"
                    >
                      Meeting Requested Successfully!
                    </m.h3>
                    <m.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 mb-6 px-8"
                    >
                      Thank you for reaching out! Our team will review your request and contact you within 24 hours.
                    </m.p>
                    <m.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-2 text-sm text-gray-500"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Drawer will close automatically...
                    </m.div>
                  </m.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5 overflow-y-auto" data-lenis-prevent>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Your Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="John Doe"
                        className={errors.name ? 'border-red-500' : ''}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Email Address *</label>
                      <div className="relative">
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="john@company.com"
                          className={`${errors.email ? 'border-red-500' : ''} pr-24`}
                          disabled={isSubmitting || isEmailVerified || emailOtpSent}
                          required
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          {!isEmailVerified && !emailOtpSent && (
                            <button type="button" onClick={handleSendEmailOtp}
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
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}

                      {/* Email OTP Panel */}
                      {emailOtpSent && (
                        <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          className="bg-[#134698]/5 border-2 border-[#134698]/20 p-3 rounded-lg mt-3">
                          <label className="text-[10px] font-bold uppercase text-[#134698] mb-2 block">✉️ Email OTP Verification</label>
                          <Input type="text" placeholder="Enter 6-digit OTP from email"
                            value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)}
                            className={`${emailOtpError ? 'border-red-500' : 'border-gray-200'} font-mono tracking-widest mb-2`}
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
                        </m.div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number *</label>
                      <div className="relative">
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+91 98765 43210"
                          className={`${errors.phone ? 'border-red-500' : ''} pr-24`}
                          disabled={isSubmitting || isPhoneVerified || phoneOtpSent}
                          required
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          {!isPhoneVerified && !phoneOtpSent && (
                            <button type="button" onClick={handleSendPhoneOtp}
                              disabled={phoneOtpLoading}
                              className="px-3 py-1.5 bg-[#DE802B] text-white text-[10px] uppercase font-bold rounded hover:bg-[#134698] transition-colors disabled:opacity-70">
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
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}

                      {/* Phone OTP Panel (WhatsApp) */}
                      {phoneOtpSent && (
                        <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          className="bg-[#DE802B]/5 border-2 border-[#DE802B]/20 p-3 rounded-lg mt-3">
                          <label className="text-[10px] font-bold uppercase text-[#DE802B] mb-2 block">📱 WhatsApp OTP Verification</label>
                          <Input type="text" placeholder="Enter 6-digit OTP from WhatsApp"
                            value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)}
                            className={`${phoneOtpError ? 'border-red-500' : 'border-gray-200'} font-mono tracking-widest mb-2`}
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
                        </m.div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Company Name (Optional)</label>
                      <Input
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Your Company"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Message *</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us about your project requirements..."
                        className={errors.message ? 'border-red-500' : ''}
                        disabled={isSubmitting}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">{formData.message.length}/500 characters</p>
                    </div>
                    <div className="pt-4">
                      <Button type="submit" size="lg" 
                        className={`w-full h-14 transition-all duration-300 ${(!isEmailVerified || !isPhoneVerified) ? 'bg-gray-400 hover:bg-gray-400 opacity-70 cursor-not-allowed' : 'bg-[#DE802B]'}`} 
                        disabled={isSubmitting || !isEmailVerified || !isPhoneVerified}>
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5 mr-2" /> Submit Request</>}
                      </Button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingDrawer;