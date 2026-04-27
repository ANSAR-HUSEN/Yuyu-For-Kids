import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, AlertCircle, CheckCircle, X } from "lucide-react";
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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate("/login", { 
        });
      }, 2000);
    } catch (err) {
      setError(err.message);
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
          <img src={yuyu} alt="Yuyu AI" className="w-[320px] mx-auto drop-shadow-2xl" />
          <h2 className="text-3xl font-semibold mt-8 text-slate-800">
            A Safe Learning Universe for Families
          </h2>
          <p className="text-slate-500 mt-4 text-sm leading-relaxed">
            Parents create one secure account. Children learn inside a protected AI environment.
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
            <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
            <p className="text-sm text-slate-500 mt-2">Parent account setup for managing child learning profiles.</p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
            >
              <CheckCircle className="text-green-500" size={18} />
              <p className="text-sm text-green-600 flex-1">Account created! Redirecting to login...</p>
            </motion.div>
          )}

          {/* Error Message with Dismiss Button */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="text-red-500" size={18} />
              <p className="text-sm text-red-600 flex-1">{error}</p>
              <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
                <X size={16} />
              </button>
            </motion.div>
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
                className="w-full py-3 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#ec4899' }}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>

          <p className="text-sm text-center mt-6 text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-500 font-medium">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}