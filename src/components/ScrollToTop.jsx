import React, { useEffect, useState, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop = memo(() => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Instant scroll to top on route change to prevent layout shift & animation fighting
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  // Throttled scroll listener for back-to-top button
  useEffect(() => {
    let ticking = false;
    let lastVisible = false;

    const checkVisibility = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const shouldBeVisible = scrollY > 400;
      if (shouldBeVisible !== lastVisible) {
        lastVisible = shouldBeVisible;
        setIsVisible(shouldBeVisible);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkVisibility);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-500/30 border border-violet-400/40 backdrop-blur-md hover:bg-violet-500 transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
});

export default ScrollToTop;
