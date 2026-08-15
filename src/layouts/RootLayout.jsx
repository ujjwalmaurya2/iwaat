import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { CustomCursor } from '../components/CustomCursor';
import { ScrollToTop } from '../components/ScrollToTop';

export const RootLayout = () => {
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
