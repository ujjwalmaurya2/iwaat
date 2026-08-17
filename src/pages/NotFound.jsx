import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Sparkles, FolderGit2, Wrench } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';
import { SEO } from '../components/SEO';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 md:pt-36 pb-16 px-4">
      {/* Strict noindex for 404 error page */}
      <SEO
        title="404: Page Not Found | iWAAT"
        description="The requested page could not be found. Return to the iWAAT homepage or explore our services and portfolio."
        noindex={true}
      />

      <div className="glass-panel p-10 sm:p-16 rounded-3xl glow-card text-center max-w-xl w-full space-y-6">
        <div className="font-heading font-extrabold text-7xl sm:text-8xl bg-gradient-to-r from-violet-500 via-orange-400 to-pink-500 bg-clip-text text-transparent">
          404
        </div>

        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Page Not Found
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          The page you are looking for doesn't exist, has been removed, or moved to a new URL.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <MagneticButton variant="primary" className="mx-auto">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Homepage</span>
            </MagneticButton>
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-3 font-semibold uppercase tracking-wider">
            Helpful Navigation Links
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-violet-500 dark:text-violet-400">
            <Link to="/services" className="hover:underline flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" />
              <span>Explore Services</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link to="/projects" className="hover:underline flex items-center gap-1">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>View Case Studies</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link to="/contact" className="hover:underline flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
