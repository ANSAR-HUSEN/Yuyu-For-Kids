import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { api } from "../../services/api";
import yuyu from "../../assets/yuyu.png";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.register({
        email: form.email,
        password: form.password,
        name: form.name,
      });
      
      // Store token if needed
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("parentId", response.parentId);
      }
      
      // Redirect to login or dashboard
      navigate("/login", { 
        state: { message: "Registration successful! Please log in." }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="border border-slate-200 rounded-2xl p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    required
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
                    required
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
                    required
                    minLength={6}
                    className="w-full pl-10 p-3 border border-slate-200 rounded-lg outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-medium transition hover:opacity-90 bg-softPink disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#ec4899' }}
              >
                {loading ? "Creating account..." : "Create account"}
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