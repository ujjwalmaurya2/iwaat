import React, { useEffect, useState, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * 60 FPS Magnetic Button
 * Uses Framer Motion values & springs directly bound to element style.
 * Zero React state updates on mouse movement.
 */
export const MagneticButton = memo(({
  children,
  onClick,
  className = '',
  variant = 'primary',
  href,
  ...props
}) => {
  const [isTouchOrReduced, setIsTouchOrReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.innerWidth < 768
    );
  });

  // Motion values for button container
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springConfig = { stiffness: 250, damping: 18, mass: 0.1 };
  const posX = useSpring(rawX, springConfig);
  const posY = useSpring(rawY, springConfig);

  // Motion values for inner content text/icon
  const rawContentX = useMotionValue(0);
  const rawContentY = useMotionValue(0);
  const contentSpringConfig = { stiffness: 300, damping: 15, mass: 0.1 };
  const contentPosX = useSpring(rawContentX, contentSpringConfig);
  const contentPosY = useSpring(rawContentY, contentSpringConfig);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReduced) {
      setIsTouchOrReduced(true);
    }
  }, []);

  const rectRef = React.useRef(null);

  const handleMouseEnter = (e) => {
    if (isTouchOrReduced) return;
    rectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const handleMouseMove = (e) => {
    if (isTouchOrReduced) return;
    if (!rectRef.current) {
      rectRef.current = e.currentTarget.getBoundingClientRect();
    }
    const { clientX, clientY } = e;
    const { left, top, width, height } = rectRef.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Restrained movement (max 8px movement for button container)
    const rawOffsetX = (clientX - centerX) * 0.2;
    const rawOffsetY = (clientY - centerY) * 0.2;
    const clampX = Math.min(Math.max(rawOffsetX, -8), 8);
    const clampY = Math.min(Math.max(rawOffsetY, -8), 8);

    // Inner content additional depth
    const innerX = Math.min(Math.max(rawOffsetX * 0.4, -4), 4);
    const innerY = Math.min(Math.max(rawOffsetY * 0.4, -4), 4);

    rawX.set(clampX);
    rawY.set(clampY);
    rawContentX.set(innerX);
    rawContentY.set(innerY);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    rawX.set(0);
    rawY.set(0);
    rawContentX.set(0);
    rawContentY.set(0);
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
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: posX,
        y: posY,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-sm tracking-wide cursor-pointer transition-shadow duration-300 relative overflow-hidden group ${getVariantStyles()} ${className}`}
      {...props}
    >
      <motion.span
        style={{
          x: contentPosX,
          y: contentPosY,
        }}
        className="relative z-10 flex items-center gap-2 [&>svg]:transition-transform [&>svg]:duration-300 [&>svg]:ease-out group-hover:[&>svg]:translate-x-1.5"
      >
        {children}
      </motion.span>
      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none rounded-full" />
    </Component>
  );
});

export default MagneticButton;
