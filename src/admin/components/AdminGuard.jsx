import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../cms/authContext';
import { AdminLoader } from './AdminLoader';

export const AdminGuard = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Give Supabase's onAuthStateChange a brief window to fire after the OAuth
  // callback lands. Without this, the guard evaluates before the session is
  // set and incorrectly redirects to /super-admin/login.
  const [stabilized, setStabilized] = useState(false);
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setStabilized(true), 500);
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (loading || !stabilized) {
    return <AdminLoader message="Verifying Super Admin Authorization..." />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/super-admin/login" state={{ from: location }} replace />;
  }

  return children;
};
