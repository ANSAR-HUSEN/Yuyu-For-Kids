import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { api } from "../../services/api";
import yuyu from "../../assets/yuyu.png";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await api.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { state: { message: "Password reset successful! Please login." } });
      }, 3000);
    } catch (err) {
      setError(err.message || "Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex bg-white">
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-50 to-pink-50 items-center justify-center">
          <div className="text-center max-w-md">
            <img src={yuyu} alt="Yuyu AI" className="w-[300px] mx-auto drop-shadow-2xl" />
            <h2 className="text-3xl font-semibold mt-8 text-slate-800">Password Reset!</h2>
            <p className="text-slate-500 mt-4">Redirecting to login...</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center px-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500" size={40} />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Password Reset Successfully!</h2>
            <p className="text-slate-600 mb-6">Redirecting you to login...</p>
            <Link to="/login" className="text-pink-500 font-medium">Go to Login →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-slate-50 to-pink-50">
        <div className="absolute w-80 h-80 bg-pink-200 blur-3xl opacity-30 rounded-full top-20 left-20" />
        <div className="absolute w-96 h-96 bg-blue-200 blur-3xl opacity-20 rounded-full bottom-10 right-10" />
        <div className="text-center max-w-md">
          <img src={yuyu} alt="Yuyu AI" className="w-[300px] mx-auto drop-shadow-2xl" />
          <h2 className="text-3xl font-semibold mt-8 text-slate-800">Create New Password</h2>
          <p className="text-slate-500 mt-4 text-sm">Enter your new password below</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">Reset Password</h1>
            <p className="text-sm text-slate-500 mt-2">Choose a strong password for your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-500" size={18} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="border border-slate-200 rounded-2xl p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs text-slate-500">New Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 p-3 border border-slate-200 rounded-lg outline-none focus:border-pink-400"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500">Confirm Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
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
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>

          <p className="text-sm text-center mt-6 text-slate-500">
            Remember your password? <Link to="/login" className="text-pink-500 font-medium">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}