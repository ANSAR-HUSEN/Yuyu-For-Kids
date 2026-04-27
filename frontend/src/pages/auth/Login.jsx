import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, AlertCircle, CheckCircle, X } from "lucide-react";
import { api } from "../../services/api";
import yuyu from "../../assets/yuyu.png";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.login({
        email: form.email,
        password: form.password,
      });
      
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("parentId", response.parentId);
        localStorage.setItem("parentEmail", response.email);
      }
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-slate-50 to-pink-50">
        <div className="absolute w-80 h-80 bg-pink-200 blur-3xl opacity-30 rounded-full top-20 left-20" />
        <div className="absolute w-96 h-96 bg-blue-200 blur-3xl opacity-20 rounded-full bottom-10 right-10" />

        <div className="text-center max-w-md">
          <img src={yuyu} alt="Yuyu AI" className="w-[300px] mx-auto drop-shadow-2xl" />
          <h2 className="text-3xl font-semibold mt-8 text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-4 text-sm">
            Continue your family learning journey in a safe AI-powered environment.
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
            <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
            <p className="text-sm text-slate-500 mt-2">
              Access your parent dashboard and child learning profiles.
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
            >
              <CheckCircle className="text-green-500" size={18} />
              <p className="text-sm text-green-600 flex-1">{successMessage}</p>
              <button onClick={() => setSuccessMessage("")} className="text-green-400 hover:text-green-600">
                <X size={16} />
              </button>
            </motion.div>
          )}

          {/* Error Message */}
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

          <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="w-full pl-10 p-3 border border-slate-200 rounded-lg outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-pink-500 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#ec4899' }}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>

          <p className="text-sm text-center mt-6 text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-pink-500 font-medium">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}