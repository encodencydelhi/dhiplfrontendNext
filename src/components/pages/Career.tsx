"use client";

import { useEffect, useRef, useState } from "react";

import {
  m,
  AnimatePresence,
} from "framer-motion";

import { Briefcase, MapPin, Send, Mail, Phone, Loader2, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import DynamicHero from "@/components/layout/DynamicHero";
import { api } from "@/lib/api";

interface Vacancy {
  _id: string;
  title: string;
  experience: string;
  salary: string;
  location: string;
  description?: string;
  requirements: string[];
  vacancyCount?: number;
  status: string;
  order: number;
  createdAt: string;
}

const Career = () => {



  const [jobs, setJobs] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchVacancies();
  }, []);

  // Fetch vacancies from backend
  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/vacancies/active", {
        params: {
          limit: 100
        }
      });

      if (response.data.success) {
        const sortedJobs = response.data.vacancies.sort(
          (a: Vacancy, b: Vacancy) => a.order - b.order
        );
        setJobs(sortedJobs);
      }

    } catch (error) {
      console.error("Error fetching vacancies:", error);
      toast.error("Failed to load vacancies. Please try again later.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (jobId: string) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });



  const [submitting, setSubmitting] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (name === "email") { setIsEmailVerified(false); setEmailOtpSent(false); setEmailOtp(""); }
    if (name === "phone") { setIsPhoneVerified(false); setPhoneOtpSent(false); setPhoneOtp(""); }
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


  // Validation function
  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      message: ""
    };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!isEmailVerified) {
      newErrors.email = "Email must be verified with OTP";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    // Message validation (optional but if provided, must be meaningful)
    if (formData.message.trim() && formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setSubmitting(true);

      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("phone", formData.phone.trim());
      submitData.append("email", formData.email.trim().toLowerCase());
      submitData.append("subject", formData.subject.trim());
      submitData.append("message", formData.message.trim());



      const response = await api.post("/api/career", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Show success state
        setIsSuccess(true);

        // Reset form after 4 seconds
        setTimeout(() => {
          setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
          setErrors({ name: "", email: "", phone: "", message: "" });
          setIsEmailVerified(false);
          setEmailOtpSent(false);
          setIsPhoneVerified(false);
          setPhoneOtpSent(false);
          setIsSuccess(false);
        }, 4000);
      }
    } catch (error: any) {
      console.error("Submit error:", error);

      const errorMessage = error.response?.data?.message ||
        "Failed to submit application. Please try again.";

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Topbar />
      <Navbar />

      {/* HERO SECTION */}
      <DynamicHero
        pageName="Career"
        fallbackImage="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80"
      />

      {/* BROWSER JOBS SECTION */}
      <section className="relative pt-20 pb-8 px-4 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <m.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
            className="text-center"
          >
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#134698]"></div>
              <span className="text-sm md:text-base uppercase tracking-[0.35em] text-[#134698] font-bold">
                CURRENT OPENINGS
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#134698]"></div>
            </m.div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Browse <span className="text-[#DE802B]">Jobs</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm leading-relaxed">
              The provided quality for ideas is awesome and unique in the market rather than the other companies in the same career and international output as shown in below.
            </p>
          </m.div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#134698]"></div>
              <p className="mt-4 text-gray-600">Loading vacancies...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No vacancies available at the moment.</p>
              <p className="text-gray-400 text-sm mt-2">Please check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => {
                const isExpanded = expandedJobs[job._id];
                const requirementsToShow = isExpanded ? job.requirements : job.requirements.slice(0, 3);

                return (
                  <m.div
                    key={job._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border-2 border-gray-200 p-5 hover:shadow-2xl hover:border-[#134698] transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-[#134698] mb-3 uppercase tracking-wide">
                        {job.title}
                      </h3>

                      <div className="space-y-1.5 mb-3 text-xs text-gray-700 font-medium">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-[#DE802B]" />
                          <span>{job.experience}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#DE802B]">₹</span>
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#134698]" />
                          <span>{job.location}</span>
                        </div>
                        {job.vacancyCount && job.vacancyCount > 1 && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#DE802B] font-bold">Positions:</span>
                            <span>{job.vacancyCount}</span>
                          </div>
                        )}
                      </div>

                      {job.description && (
                        <p className="text-xs font-semibold text-gray-800 mb-3 bg-gray-50 p-2 border-l-2 border-[#DE802B]">
                          {job.description}
                        </p>
                      )}

                      <ul className="space-y-1.5 text-xs text-gray-600 leading-relaxed">
                        {requirementsToShow.map((req, idx) => (
                          <li key={idx} className="flex gap-2 text-wrap">
                            <span className="text-[#DE802B] mt-0.5 font-bold flex-shrink-0">→</span>
                            <span className="break-words">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {job.requirements.length > 3 && (
                      <button
                        onClick={() => toggleExpand(job._id)}
                        className="text-[#134698] font-bold text-left mt-3 hover:underline flex items-center gap-1 text-xs"
                      >
                        {isExpanded ? (
                          "Show less"
                        ) : (
                          `+${job.requirements.length - 3} more requirements`
                        )}
                      </button>
                    )}
                  </m.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="relative pt-10 pb-16 px-4 bg-white border-t border-gray-200">
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
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Phone Number</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-700 font-medium">
                  <p className="hover:text-[#DE802B] transition-colors cursor-pointer">+91 9654900525</p>
                  <p className="hover:text-[#DE802B] transition-colors cursor-pointer">+91-9810247319</p>
                  <p className="hover:text-[#DE802B] transition-colors cursor-pointer">+91-93106 08427</p>
                </div>
              </div>

              <div className="border-l-4 border-[#134698] pl-6 py-4 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-6 h-6 text-[#134698]" />
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Email Address</h3>
                </div>
                <p className="text-sm text-gray-700 font-medium hover:text-[#134698] transition-colors cursor-pointer">info@designhouse.co.in</p>
              </div>

              <div className="border-2 border-[#134698] p-6 bg-[#134698]/5">
                <h4 className="text-base font-bold text-[#134698] mb-3 uppercase">Why Join Us?</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-[#DE802B] font-bold">→</span>
                    <span>Work with industry leaders</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#DE802B] font-bold">→</span>
                    <span>Competitive salary packages</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#DE802B] font-bold">→</span>
                    <span>Growth opportunities</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#DE802B] font-bold">→</span>
                    <span>Professional environment</span>
                  </li>
                </ul>
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
                      Application Submitted Successfully!
                    </m.h3>

                    <m.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 text-center mb-8 max-w-md text-lg"
                    >
                      Thank you for applying! Our HR team will review your application and contact you within 48 hours.
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
                        <div>
                          <input
                            type="text"
                            name="name"
                            placeholder="Name..."
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-[#134698] transition-colors text-sm`}
                            required
                            disabled={submitting}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                          )}
                        </div>

                        {/* Phone Field with WhatsApp Verify Button */}
                        <div className="relative">
                          <input type="tel" name="phone" placeholder="Phone Number..."
                            value={formData.phone} onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-[#134698] transition-colors text-sm pr-24`}
                            required disabled={submitting || isPhoneVerified || phoneOtpSent} />
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
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                      </div>

                      {/* Phone OTP Panel (WhatsApp) */}
                      {phoneOtpSent && (
                        <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          className="bg-[#DE802B]/5 border-2 border-[#DE802B]/20 p-3 rounded-lg">
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
                        </m.div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Email with Verify Button */}
                        <div className="relative">
                          <input type="email" name="email" placeholder="Email Address..."
                            value={formData.email} onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-[#134698] transition-colors text-sm pr-24`}
                            required disabled={submitting || isEmailVerified || emailOtpSent} />
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
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <input type="text" name="subject" placeholder="Subject..."
                          value={formData.subject} onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#134698] transition-colors text-sm"
                          disabled={submitting} />
                      </div>

                      {/* Email OTP Panel */}
                      {emailOtpSent && (
                        <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          className="bg-[#134698]/5 border-2 border-[#134698]/20 p-3 rounded-lg">
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
                        </m.div>
                      )}

                      <div>
                        <textarea
                          name="message"
                          placeholder="Enter Message Here..."
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={5}
                          className={`w-full px-4 py-3 border-2 ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-[#134698] transition-colors resize-none text-sm`}
                          disabled={submitting}
                        />
                        {errors.message && (
                          <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                        )}
                      </div>



                      <button onClick={handleSubmit} disabled={submitting}
                        className={`w-full font-bold py-4 px-6 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider text-sm shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed text-white ${(!isEmailVerified || !isPhoneVerified) ? 'opacity-70 bg-gray-500 cursor-not-allowed' : 'bg-[#DE802B] hover:bg-[#c97024]'}`}>
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4" />
                          </>
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

      <Footer />
    </div>
  );
};

export default Career;
