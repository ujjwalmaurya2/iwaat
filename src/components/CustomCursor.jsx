import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState({ isHovered: false, label: '' });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch screens or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReduced) {
      return;
    }

    setIsVisible(true);

    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e) => {
      const target = e.target;

      // Check for specific interactive tags or data-cursor attributes
      const customLabel = target.getAttribute('data-cursor') || target.closest('[data-cursor]')?.getAttribute('data-cursor');
      const isCard = target.closest('.glow-card') || target.closest('.glass-panel');
      const isButton = target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a');

      if (customLabel) {
        setCursorState({ isHovered: true, label: customLabel });
      } else if (isButton) {
        setCursorState({ isHovered: true, label: 'CLICK' });
      } else if (isCard) {
        setCursorState({ isHovered: true, label: 'EXPLORE' });
      } else {
        setCursorState({ isHovered: false, label: '' });
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Primary Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-violet-500 rounded-full pointer-events-none z-[99999] hidden md:block mix-blend-difference"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: cursorState.isHovered ? (cursorState.label ? 0 : 1.8) : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.1 }}
      />

      {/* Ring / Label Badge */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[99998] hidden md:flex items-center justify-center border transition-colors duration-200 ${
          cursorState.label
            ? 'px-3 py-1 bg-violet-600/90 text-white border-violet-400 text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-violet-500/40 backdrop-blur-md'
            : 'w-7 h-7 border-violet-400/50 bg-violet-500/10'
        }`}
        animate={{
          x: cursorState.label ? mousePosition.x - 28 : mousePosition.x - 14,
          y: cursorState.label ? mousePosition.y - 14 : mousePosition.y - 14,
          scale: cursorState.isHovered ? 1.15 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <AnimatePresence>
          {cursorState.label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="font-mono text-[9px] font-extrabold uppercase text-white tracking-widest whitespace-nowrap"
            >
              {cursorState.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
