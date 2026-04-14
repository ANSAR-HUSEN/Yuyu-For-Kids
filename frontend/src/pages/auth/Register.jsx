import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

import yuyu from "../../assets/yuyu.png";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-slate-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center max-w-md"
        >
          <img
            src={yuyu}
            alt="Yuyu AI"
            className="w-[320px] mx-auto drop-shadow-2xl"
          />

          <h2 className="text-3xl font-semibold mt-8 text-slate-800">
            A Safe Learning Universe for Families
          </h2>

          <p className="text-slate-500 mt-4 text-sm leading-relaxed">
            Parents create one secure account. Children learn inside a protected AI environment designed for creativity, safety, and growth.
          </p>
        </motion.div>
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
              Create your account
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Parent account setup for managing child learning profiles.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl p-6 shadow-sm bg-white">
            <form className="space-y-5">
              <div>
                <label className="text-xs text-slate-500">Full name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-slate-200 rounded-lg outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-slate-200 rounded-lg outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500">Password</label>
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

              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white font-medium transition hover:opacity-90 bg-pink-400"
              >
                Create account
              </button>
            </form>
          </div>

          <p className="text-sm text-center mt-6 text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-500 font-medium">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}