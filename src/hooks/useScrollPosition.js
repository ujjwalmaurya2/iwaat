import { useState, useEffect } from 'react';

/**
 * High-performance scroll position hook
 * Only triggers React state updates when the `isScrolled` threshold changes.
 * Uses requestAnimationFrame and passive event listeners to maintain 60 FPS.
 */
export const useScrollPosition = (threshold = 20) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const getScroll = () => window.scrollY || window.pageYOffset || 0;
    let lastIsScrolled = getScroll() > threshold;

    // Set initial value immediately
    setIsScrolled(lastIsScrolled);

    const updatePosition = () => {
      const currentScroll = getScroll();
      const newIsScrolled = currentScroll > threshold;

      if (newIsScrolled !== lastIsScrolled) {
        lastIsScrolled = newIsScrolled;
        setIsScrolled(newIsScrolled);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { isScrolled };
};

export default useScrollPosition;
