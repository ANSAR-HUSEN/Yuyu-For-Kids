import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { api } from "../../services/api";
import yuyu from "../../assets/yuyu.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await api.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex bg-white">
        <div className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-slate-50 to-pink-50">
          <div className="absolute w-80 h-80 bg-pink-200 blur-3xl opacity-30 rounded-full top-20 left-20" />
          <div className="absolute w-96 h-96 bg-blue-200 blur-3xl opacity-20 rounded-full bottom-10 right-10" />
          
          <div className="text-center max-w-md">
            <img src={yuyu} alt="Yuyu AI" className="w-[300px] mx-auto drop-shadow-2xl" />
            <h2 className="text-3xl font-semibold mt-8 text-slate-800">Check Your Email</h2>
            <p className="text-slate-500 mt-4 text-sm">
              We've sent a password reset link to your email address.
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-500" size={40} />
              </div>
              
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">Email Sent!</h2>
              
              <p className="text-slate-600 mb-6">
                We've sent a password reset link to <strong className="text-pink-500">{email}</strong>
              </p>
              
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600">
                  Didn't receive the email? Check your spam folder or 
                  <button 
                    onClick={handleSubmit}
                    className="text-pink-500 ml-1 hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>
              
              <Link
                to="/login"
                className="inline-block w-full py-3 rounded-lg text-white font-medium transition hover:opacity-90"
                style={{ backgroundColor: '#ec4899' }}
              >
                Back to Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT SIDE - Brand */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-slate-50 to-pink-50">
        <div className="absolute w-80 h-80 bg-pink-200 blur-3xl opacity-30 rounded-full top-20 left-20" />
        <div className="absolute w-96 h-96 bg-blue-200 blur-3xl opacity-20 rounded-full bottom-10 right-10" />

        <div className="text-center max-w-md">
          <img
            src={yuyu}
            alt="Yuyu AI"
            className="w-[300px] mx-auto drop-shadow-2xl"
          />

          <h2 className="text-3xl font-semibold mt-8 text-slate-800">
            Reset Your Password
          </h2>

          <p className="text-slate-500 mt-4 text-sm">
            We'll send a secure link to your email to reset your account password and restore access safely.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Forgot password
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-500 mt-0.5" size={18} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form Card */}
          <div className="border border-slate-200 rounded-2xl p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-xs font-medium text-slate-500">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 p-3 border border-slate-200 rounded-lg outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#ec4899' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-sm text-center mt-6 text-slate-500">
            Remember your password?{" "}
            <Link to="/login" className="text-pink-500 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}