import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../cms/authContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { CustomCursor } from '../components/CustomCursor';
import { ScrollToTop } from '../components/ScrollToTop';

export const RootLayout = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin && !loading && typeof window !== 'undefined') {
      if (sessionStorage.getItem('iwaat_admin_login_intent') === 'true') {
        sessionStorage.removeItem('iwaat_admin_login_intent');
        navigate('/super-admin', { replace: true });
      }
    }
  }, [isAdmin, loading, navigate]);
  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-violet-500 selection:text-white">
      {/* Dynamic Animated Mesh Background */}
      <AnimatedBackground />

      {/* Magnetic Custom Cursor Effect (Desktop) */}
      <CustomCursor />

      {/* Auto Scroll Reset & Back-to-Top Button */}
      <ScrollToTop />

      {/* Header Navigation */}
      <Navbar />

      {/* Main Page View Content */}
      <main className="relative z-10 flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
