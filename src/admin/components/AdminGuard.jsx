import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../cms/authContext';
import { Sparkles } from 'lucide-react';

export const AdminGuard = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Extra buffer: give Supabase time to exchange the OAuth code/token
  // before deciding whether to show the dashboard or redirect to login.
  const [stabilized, setStabilized] = useState(false);
  useEffect(() => {
    if (!loading) {
      // Short delay to let auth state fully settle after OAuth redirect
      const t = setTimeout(() => setStabilized(true), 300);
      return () => clearTimeout(t);
    }
  }, [loading]);

  // Show spinner while loading OR during stabilization after OAuth
  if (loading || !stabilized) {
    return (
      <div className="min-h-screen bg-[#070A14] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-mono text-slate-400">Verifying Super Admin Authorization...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/super-admin/login" state={{ from: location }} replace />;
  }

  return children;
};
