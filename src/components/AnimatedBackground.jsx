import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dot Grid Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 dark:opacity-30" />

      {/* Floating Gradient Blob 1 (Violet) */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/20 via-purple-500/15 to-transparent blur-[120px]"
      />

      {/* Floating Gradient Blob 2 (Orange/Pink) */}
      <motion.div
        animate={{
          x: [0, -100, 60, 0],
          y: [0, 80, -50, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-orange-500/20 via-pink-500/15 to-transparent blur-[140px]"
      />

      {/* Floating Gradient Blob 3 (Cyan/Indigo) */}
      <motion.div
        animate={{
          x: [0, 70, -80, 0],
          y: [0, -70, 70, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-indigo-600/15 to-transparent blur-[150px]"
      />
    </div>
  );
};
