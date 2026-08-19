import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

/**
 * 60 FPS Custom Cursor
 * Uses direct MotionValues and springs to avoid React state re-renders on mousemove.
 * Completely disabled on touch screens and prefers-reduced-motion.
 */
export const CustomCursor = () => {
  const [cursorState, setCursorState] = useState({ isHovered: false, label: '' });
  const [isEnabled, setIsEnabled] = useState(false);

  // Motion values avoid React re-renders on every pixel of mouse move
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const dotSpringConfig = { stiffness: 600, damping: 30, mass: 0.1 };
  const dotX = useSpring(rawX, dotSpringConfig);
  const dotY = useSpring(rawY, dotSpringConfig);

  const ringSpringConfig = { stiffness: 350, damping: 25, mass: 0.2 };
  const ringX = useSpring(rawX, ringSpringConfig);
  const ringY = useSpring(rawY, ringSpringConfig);

  useEffect(() => {
    // Disable on touch screens, mobile screens, or reduced-motion devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReduced) {
      return;
    }

    setIsEnabled(true);

    let rafId = null;
    let latestEvent = null;

    const updateCoordinates = () => {
      if (latestEvent) {
        rawX.set(latestEvent.clientX);
        rawY.set(latestEvent.clientY);
      }
      rafId = null;
    };

    const onMouseMove = (e) => {
      latestEvent = e;
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateCoordinates);
      }
    };

    let currentHovered = false;
    let currentLabel = '';

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target || !target.closest) return;

      const customLabel =
        target.getAttribute('data-cursor') ||
        target.closest('[data-cursor]')?.getAttribute('data-cursor');
      const isCard = target.closest('.glow-card') || target.closest('.glass-panel');
      const isButton =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a');

      let nextHovered = false;
      let nextLabel = '';

      if (customLabel) {
        nextHovered = true;
        nextLabel = customLabel;
      } else if (isButton) {
        nextHovered = true;
        nextLabel = 'CLICK';
      } else if (isCard) {
        nextHovered = true;
        nextLabel = 'EXPLORE';
      }

      if (nextHovered !== currentHovered || nextLabel !== currentLabel) {
        currentHovered = nextHovered;
        currentLabel = nextLabel;
        setCursorState({ isHovered: nextHovered, label: nextLabel });
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [rawX, rawY]);

  if (!isEnabled) return null;

  return (
    <>
      {/* Primary Dot (GPU transform, zero React re-renders on move) */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-violet-500 rounded-full pointer-events-none z-[99999] hidden md:block mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: cursorState.isHovered ? (cursorState.label ? 0 : 1.8) : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Ring / Label Badge */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[99998] hidden md:flex items-center justify-center border transition-colors duration-200 ${
          cursorState.label
            ? 'px-3 py-1 bg-violet-600/90 text-white border-violet-400 text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-violet-500/40 backdrop-blur-md'
            : 'w-7 h-7 border-violet-400/50 bg-violet-500/10'
        }`}
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: cursorState.isHovered ? 1.15 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence>
          {cursorState.label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
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

export default CustomCursor;
