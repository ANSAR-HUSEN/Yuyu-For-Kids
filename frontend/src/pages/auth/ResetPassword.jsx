import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Lock } from "lucide-react";

import yuyu from "../../assets/yuyu.png";

const colors = {
  accent: "#FF4D8D",
};

export default function ResetPassword() {
  const { token } = useParams();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Token:", token);
    console.log("New Password:", form.password);

    // POST /api/reset-password
    // { token, password }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-slate-50 to-pink-50">

        <div className="absolute w-80 h-80 bg-pink-200 blur-3xl opacity-30 rounded-full top-20 left-20" />
        <div className="absolute w-96 h-96 bg-blue-200 blur-3xl opacity-20 rounded-full bottom-10 right-10" />

        <div className="text-center max-w-md">
          <img src={yuyu} className="w-[300px] mx-auto drop-shadow-2xl" />

          <h2 className="text-3xl font-semibold mt-8 text-slate-800">
            Create New Password
          </h2>

          <p className="text-slate-500 mt-4 text-sm">
            Choose a strong password to secure your family account.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Reset password
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Enter a new password for your account.
            </p>
          </div>

          {/* FORM */}
          <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">

            <form className="space-y-5" onSubmit={handleSubmit}>

              {/* New Password */}
              <div>
                <label className="text-xs text-slate-500">New password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-slate-200 rounded-lg outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs text-slate-500">Confirm password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-slate-200 rounded-lg outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white font-medium transition hover:opacity-90 bg-pink-400"
              >
                Update password
              </button>
            </form>
          </div>

          {/* FOOTER */}
          <p className="text-sm text-center mt-6 text-slate-500">
            Back to{" "}
            <Link to="/login" className="text-pink-500 font-medium">
              Log in
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}