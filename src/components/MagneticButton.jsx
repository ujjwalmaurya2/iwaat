import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const MagneticButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  href,
  ...props
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [contentPosition, setContentPosition] = useState({ x: 0, y: 0 });
  const [isTouchOrReduced, setIsTouchOrReduced] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReduced) {
      setIsTouchOrReduced(true);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (isTouchOrReduced) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Restrained movement (max 8px movement for button container)
    const rawX = (clientX - centerX) * 0.2;
    const rawY = (clientY - centerY) * 0.2;
    const clampX = Math.min(Math.max(rawX, -8), 8);
    const clampY = Math.min(Math.max(rawY, -8), 8);

    // Inner content additional depth (additional 3px offset)
    const innerX = Math.min(Math.max(rawX * 0.4, -4), 4);
    const innerY = Math.min(Math.max(rawY * 0.4, -4), 4);

    setPosition({ x: clampX, y: clampY });
    setContentPosition({ x: innerX, y: innerY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setContentPosition({ x: 0, y: 0 });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] border border-violet-400/30';
      case 'secondary':
        return 'bg-slate-900/80 dark:bg-slate-800/80 text-white dark:text-slate-100 hover:bg-slate-800 border border-slate-700/60 shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] backdrop-blur-md';
      case 'glass':
        return 'bg-white/10 dark:bg-white/5 text-slate-900 dark:text-white border border-white/20 dark:border-white/10 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] backdrop-blur-lg';
      case 'outline':
        return 'bg-transparent text-violet-600 dark:text-violet-400 border border-violet-500/40 hover:bg-violet-500/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]';
      default:
        return '';
    }
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-sm tracking-wide cursor-pointer transition-shadow duration-300 relative overflow-hidden group ${getVariantStyles()} ${className}`}
      {...props}
    >
      <motion.span
        animate={{ x: contentPosition.x, y: contentPosition.y }}
        transition={{ type: 'spring', stiffness: 250, damping: 15 }}
        className="relative z-10 flex items-center gap-2 [&>svg]:transition-transform [&>svg]:duration-300 [&>svg]:ease-out group-hover:[&>svg]:translate-x-1.5"
      >
        {children}
      </motion.span>
      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none rounded-full" />
    </Component>
  );
};
