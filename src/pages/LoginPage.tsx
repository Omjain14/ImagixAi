import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Zap, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Simulate quick fake login for demo purposes
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const fakeUserData = {
        id: "demo-user-" + Math.random().toString(36).substr(2, 9),
        name: email.split("@")[0] || "Demo User",
        email: email,
        credits: 25,
        role: email === "omjain1401@gmail.com" ? "admin" : "user"
      };

      login(fakeUserData as any);
      navigate("/generator");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-6 bg-slate-100 dark:bg-[#050505] transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full card-geometric glass p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

        <div className="flex flex-col items-center text-center mb-10 relative z-10">
          <div className="w-14 h-14 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl skew-x-2">
            <div className="w-6 h-6 bg-white dark:bg-black rounded-sm rotate-45"></div>
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tighter uppercase mb-2 text-slate-900 dark:text-white">Welcome <span className="opacity-40">Back</span></h1>
          <p className="text-slate-500 dark:text-white/40 text-[10px] uppercase tracking-widest font-bold">Access your creative workbench</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs py-3 px-4 rounded-xl mb-6 flex items-center gap-2">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-brand-gray px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-brand-gray" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-slate-900 dark:focus:border-brand-white transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-brand-gray px-1 text-left block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-brand-gray" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-slate-900 dark:focus:border-brand-white transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 dark:bg-brand-white text-white dark:text-brand-black font-bold py-4 rounded-2xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 shadow-lg shadow-slate-900/10 dark:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5 text-center">
          <p className="text-sm text-slate-500 dark:text-brand-gray">
            Don't have an account?{" "}
            <Link to="/signup" className="text-slate-900 dark:text-brand-white font-bold hover:underline underline-offset-4">
              Sign up now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
