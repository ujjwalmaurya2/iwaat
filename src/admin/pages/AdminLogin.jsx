import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, AlertCircle, Sparkles, LogOut, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../cms/authContext';
import { BrandLockup } from '../../components/BrandLockup';
import { AdminLoader } from '../components/AdminLoader';

export const AdminLogin = () => {
  const { user, adminProfile, isAdmin, loginWithGoogle, loginDevMock, logout, isSupabase, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/super-admin';

  // If user is already authenticated & active admin, redirect to destination
  React.useEffect(() => {
    if (isAdmin && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAdmin, loading, navigate, from]);

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    if (!res.success) {
      setErrorMsg(res.error || 'Google login failed. Please check your connection.');
      setIsSubmitting(false);
    }
  };

  const handleDevMockLogin = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await loginDevMock('ujjwalmaurya2@gmail.com');
    setIsSubmitting(false);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error);
    }
  };

  // Google SVG Icon
  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );

  if (loading) {
    return <AdminLoader message="Checking authentication status..." />;
  }

  return (
    <div className="min-h-screen bg-[#070A14] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-violet-500 selection:text-white">
      {/* Background Decorative Mesh */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex">
            <BrandLockup layout="col" showMotto={true} logoSize="w-14 h-14" />
          </Link>
          <h2 className="font-heading font-extrabold text-2xl text-white">Super Admin Portal</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Sign in with your approved Google Administrator account to manage production projects, gallery, and client CRM.
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel p-8 sm:p-10 rounded-3xl glow-card border border-slate-800 space-y-6 bg-[#0B1020]/90"
        >
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* If user is logged into Google but unauthorized in admin_users */}
          {user && !isAdmin && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-start gap-2.5 text-amber-400 text-xs font-medium">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Unauthorized Google Account</p>
                  <p className="text-slate-400 mt-1">
                    Signed in as <span className="text-amber-300 font-mono">{user.email}</span>. This account is not listed as an active administrator in the database.
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch Google Account</span>
              </button>
            </div>
          )}

          {/* Main Google OAuth Button */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-100 hover:shadow-2xl transition-all flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-50"
            >
              <GoogleIcon />
              <span>{isSubmitting ? 'Redirecting to Google...' : 'Continue with Google'}</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform ml-auto" />
            </button>

            <div className="text-center">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Protected by Supabase Auth & PostgreSQL Row Level Security (RLS). Access requires verified Google email and active status in <code className="text-violet-400">admin_users</code>.
              </p>
            </div>
          </div>

          {/* Development Mock Bypass (Strictly DEV mode only) */}
          {import.meta.env.DEV && (
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-violet-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Dev Offline Mode</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[9px] uppercase font-bold">
                  Localhost Only
                </span>
              </div>
              <button
                type="button"
                onClick={handleDevMockLogin}
                className="w-full py-2.5 rounded-xl bg-violet-950/40 border border-violet-800/40 text-violet-300 hover:bg-violet-900/50 text-xs font-semibold transition-colors cursor-pointer"
              >
                ⚡ Dev Bypass: Sign In as Ujjwal Maurya
              </button>
            </div>
          )}
        </motion.div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
};
