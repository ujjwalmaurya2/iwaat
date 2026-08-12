import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import {
  Plane,
  Compass,
  Network,
  Palette,
  Code,
  CheckCircle2,
  Rocket,
  TrendingUp,
} from 'lucide-react';
import processData from '../data/process.json';

const iconMap = {
  Compass,
  Network,
  Palette,
  Code,
  CheckCircle2,
  Rocket,
  TrendingUp,
};

export const ProcessTimeline = () => {
  const containerRef = useRef(null);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const prevProgress = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 85%'],
  });

  // Track scroll direction to flip aeroplane orientation smoothly
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < prevProgress.current - 0.002) {
      setIsScrollingUp(true);
    } else if (latest > prevProgress.current + 0.002) {
      setIsScrollingUp(false);
    }
    prevProgress.current = latest;
  });

  // Heavy, slow-inertia spring physics for ultra-smooth floating plane motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 30,
    mass: 0.8,
    restDelta: 0.001,
  });

  // Filled progress bar height following smooth scroll
  const pathHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  // Aeroplane position down the clean vertical timeline flight line
  const planeTop = useTransform(smoothProgress, [0, 1], ['0%', '96%']);

  return (
    <div ref={containerRef} className="relative max-w-5xl mx-auto py-8">
      {/* Clean Unobstructed Flight Track Line (Desktop) */}
      <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-1 -translate-x-1/2 bg-slate-200 dark:bg-slate-800/80 rounded-full" />

      {/* Active Glowing Jetstream Filled Progress Line */}
      <motion.div
        style={{ height: pathHeight }}
        className="hidden lg:block absolute left-1/2 top-8 w-1 -translate-x-1/2 bg-gradient-to-b from-violet-600 via-orange-500 to-pink-500 rounded-full shadow-[0_0_18px_rgba(139,92,246,0.9)] z-10 origin-top"
      />

      {/* Dynamic Direction-Aware Flying Aeroplane */}
      <motion.div
        style={{ top: planeTop }}
        className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none items-center justify-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            rotate: isScrollingUp ? -45 : 135,
          }}
          transition={{
            rotate: { duration: 0.4, ease: 'easeOut' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 via-purple-600 to-orange-500 p-0.5 shadow-2xl shadow-violet-500/80 flex items-center justify-center text-white border border-white/40 backdrop-blur-md"
        >
          <Plane className="w-6 h-6 fill-white/30 text-white" />
        </motion.div>
      </motion.div>

      <div className="space-y-12 lg:space-y-16">
        {processData.map((item, index) => {
          const IconComponent = iconMap[item.icon] || Compass;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content Card Side */}
              <div className="w-full lg:w-1/2">
                <div className="glass-panel p-6 sm:p-8 rounded-3xl glow-card relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-500 shrink-0">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-500 flex items-center gap-1.5">
                          <Plane className="w-3.5 h-3.5 -rotate-45 text-orange-500" />
                          Flight Stage 0{item.step}
                        </span>
                        <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <span className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-500 text-xs font-bold font-mono flex items-center justify-center shrink-0">
                      0{item.step}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-orange-500 dark:text-orange-400 mb-3">
                    {item.tagline}
                  </p>

                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Deliverables tags */}
                  <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Key Deliverables:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.deliverables.map((del, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {del}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty Spacer Side for Desktop layout balance */}
              <div className="hidden lg:block w-1/2" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
