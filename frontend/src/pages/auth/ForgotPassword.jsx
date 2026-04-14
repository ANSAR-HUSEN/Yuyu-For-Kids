import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import yuyu from "../../assets/yuyu.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="min-h-screen flex bg-white">
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

      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Forgot password
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl p-6 shadow-sm bg-white">
            <form className="space-y-5">
              <div>
                <label className="text-xs text-slate-500">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-slate-200 rounded-lg outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white font-medium transition hover:opacity-90 bg-pink-400"
              >
                Send reset link
              </button>
            </form>
          </div>

          <p className="text-sm text-center mt-6 text-slate-500">
            Remember your password?{" "}
            <Link to="/login" className="text-pink-500 font-medium">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}