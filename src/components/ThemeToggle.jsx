import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative p-2.5 rounded-full bg-slate-800/40 dark:bg-slate-800/60 border border-slate-700/50 text-slate-200 hover:text-white hover:border-violet-500/50 transition-all duration-300 backdrop-blur-md overflow-hidden group shadow-inner"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : 180,
          scale: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: 'backOut' }}
        className="absolute inset-0 flex items-center justify-center text-amber-400"
      >
        <Sun className="w-5 h-5 fill-amber-400/20" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? -180 : 0,
          scale: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: 'backOut' }}
        className="flex items-center justify-center text-violet-400"
      >
        <Moon className="w-5 h-5 fill-violet-400/20" />
      </motion.div>

      <span className="sr-only">Toggle Theme</span>
    </motion.button>
  );
};
