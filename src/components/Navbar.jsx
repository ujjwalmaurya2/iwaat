import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useScrollPosition } from '../hooks/useScrollPosition';

import { useCMS } from '../cms/cmsContext';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isScrolled } = useScrollPosition();
  const location = useLocation();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-white/80 dark:bg-[#0B1020]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/80 shadow-lg shadow-violet-500/5'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo & Name */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5 group"
        >
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-orange-500 p-0.5 shadow-md shadow-violet-500/20"
          >
            <div className="w-full h-full bg-[#0B1020] dark:bg-[#0B1020] light:bg-white rounded-[14px] flex items-center justify-center text-violet-400 group-hover:text-orange-400 transition-colors">
              <Sparkles className="w-5 h-5 fill-violet-400/20" />
            </div>
          </motion.div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              iWAAt<span className="text-violet-500">.</span>
            </span>
          </div>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 px-4 py-2 rounded-full bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 group ${
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

        {/* Right: Theme Toggle & CTA */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          <Link to="/contact">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 transition-all duration-300"
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </div>

        {/* Mobile Menu Trigger & Theme Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />

          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
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

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="pt-4"
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
