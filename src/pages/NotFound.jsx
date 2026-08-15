import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 md:pt-36 pb-16 px-4">
      <div className="glass-panel p-10 sm:p-16 rounded-3xl glow-card text-center max-w-xl w-full space-y-6">
        <div className="font-heading font-extrabold text-7xl sm:text-8xl text-gradient-primary">
          404
        </div>

        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Page Not Found
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          The page you are looking for doesn't exist or has been moved to a new route.
        </p>

        <div className="pt-4">
          <Link to="/">
            <MagneticButton variant="primary" className="mx-auto">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Homepage</span>
            </MagneticButton>
          </Link>
        </div>
      </div>
    </div>
  );
};
