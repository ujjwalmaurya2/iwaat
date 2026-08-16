import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { BrandLockup } from './BrandLockup';
import { useCMS } from '../cms/cmsContext';
import { useAuth } from '../cms/authContext';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Projects', path: '/projects' },
  { label: 'About', path: '/about' },
  { label: 'Process', path: '/process' },
  { label: 'Events', path: '/events' },
  { label: 'Contact', path: '/contact' },
];


export const Navbar = () => {
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isScrolled } = useScrollPosition();
  const location = useLocation();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-2 bg-white/90 dark:bg-[#070A14]/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/80 shadow-lg shadow-violet-500/5'
          : 'pt-3.5 pb-2 bg-transparent dark:bg-gradient-to-b dark:from-[#070A14]/80 dark:via-[#070A14]/40 dark:to-transparent dark:backdrop-blur-[2px]'
      }`}
    >
      {/* DESKTOP TWO-ROW HEADER (>= md screens) */}
      <div className="hidden md:flex flex-col items-center gap-2.5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ROW 1: BRANDING (Centered Logo, Wordmark & Full Motto) */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="group inline-flex flex-col items-center"
        >
          <BrandLockup
            layout="stacked"
            showMotto={true}
            logoSize="w-9 h-9 sm:w-10 sm:h-10"
            wordmarkSize="text-2xl"
            mottoSize="text-[11px] sm:text-[12px]"
          />
        </Link>

        {/* ROW 2: NAVIGATION BAR (Full Links + Controls) */}
        <div className="w-full max-w-5xl flex items-center justify-between px-3 py-1.5 rounded-full bg-slate-100/75 dark:bg-slate-900/75 border border-slate-200/60 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
          {/* Left/Center: Nav Links */}
          <nav className="flex items-center gap-0.5 lg:gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors duration-200 group ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-white'
                    }`
                  }
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full shadow-md shadow-violet-500/25"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isActive && (
                    <span className="absolute bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-violet-500 to-orange-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out rounded-full" />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Admin Badge, Theme Toggle & CTA */}
          <div className="flex items-center gap-2.5">
            {isAdmin && (
              <Link
                to="/super-admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-500/15 border border-violet-500/30 text-violet-400 hover:bg-violet-500/25 transition-colors shadow-sm"
                title="Open Super Admin Dashboard"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            )}

            <ThemeToggle />

            <Link to="/contact">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-md shadow-violet-500/20 hover:shadow-violet-500/35 transition-all duration-300"
              >
                <span>Let's Talk</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE COMPACT HEADER (< md screens) */}
      <div className="flex md:hidden items-center justify-between max-w-7xl mx-auto px-4 sm:px-6">
        {/* Left: Brand Logo & Name */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="group"
        >
          <BrandLockup layout="row" showMotto={false} logoSize="w-8 h-8" wordmarkSize="text-xl" />
        </Link>

        {/* Right: Theme Toggle & Menu Button */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Animated Slide-out Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white/95 dark:bg-[#0B1020]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 shadow-2xl"
          >
            <div className="px-6 pt-4 pb-8 space-y-3">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`block px-4 py-3 rounded-2xl font-heading font-medium text-lg transition-all ${
                        isActive
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2"
                >
                  <Link
                    to="/super-admin"
                    onClick={closeMobileMenu}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-violet-600/20 border border-violet-500/40 text-violet-300 font-semibold text-sm shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Admin Portal</span>
                  </Link>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="pt-2"
              >
                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-orange-500 text-white font-semibold text-base shadow-lg shadow-violet-500/25"
                >
                  <span>Start Your Project</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
