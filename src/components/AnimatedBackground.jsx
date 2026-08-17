import React, { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground = memo(() => {
  const [isVisible, setIsVisible] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setIsReducedMotion(e.matches);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const shouldAnimate = isVisible && !isReducedMotion;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transform-gpu">
      {/* Dot Grid Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 dark:opacity-30" />

      {/* Floating Gradient Blob 1 (Violet) */}
      <motion.div
        animate={
          shouldAnimate
            ? {
                x: [0, 60, -30, 0],
                y: [0, -50, 30, 0],
                scale: [1, 1.15, 0.95, 1],
              }
            : { x: 0, y: 0, scale: 1 }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute -top-32 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-gradient-to-br from-violet-600/20 via-purple-500/15 to-transparent blur-[80px] sm:blur-[120px] will-change-transform"
      />

      {/* Floating Gradient Blob 2 (Orange/Pink) */}
      <motion.div
        animate={
          shouldAnimate
            ? {
                x: [0, -70, 40, 0],
                y: [0, 60, -40, 0],
                scale: [1, 1.1, 0.9, 1],
              }
            : { x: 0, y: 0, scale: 1 }
        }
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -right-32 w-[380px] sm:w-[550px] h-[380px] sm:h-[550px] rounded-full bg-gradient-to-tl from-orange-500/20 via-pink-500/15 to-transparent blur-[90px] sm:blur-[130px] will-change-transform"
      />

      {/* Floating Gradient Blob 3 (Cyan/Indigo) */}
      <motion.div
        animate={
          shouldAnimate
            ? {
                x: [0, 50, -60, 0],
                y: [0, -50, 50, 0],
                scale: [1, 1.1, 0.95, 1],
              }
            : { x: 0, y: 0, scale: 1 }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute -bottom-32 left-1/3 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-indigo-600/15 to-transparent blur-[100px] sm:blur-[140px] will-change-transform"
      />
    </div>
  );
});

export default AnimatedBackground;
