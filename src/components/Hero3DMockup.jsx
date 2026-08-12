import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, ShieldCheck, Terminal, Smartphone, Laptop, Layers, TrendingUp } from 'lucide-react';

export const Hero3DMockup = () => {
  return (
    <div className="relative w-full aspect-square max-w-[620px] mx-auto flex items-center justify-center">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 via-orange-500/20 to-pink-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      {/* Main Container Layer */}
      <div className="relative w-full h-full flex items-center justify-center">

        {/* 1. Main Laptop Mockup Frame (Center Base) */}
        <motion.div
          initial={{ y: 30, opacity: 0, rotateX: 10 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          whileHover={{ scale: 1.02, rotateY: -3 }}
          className="relative z-20 w-[85%] rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 md:p-3 backdrop-blur-xl"
        >
          {/* Laptop Screen Header Dots */}
          <div className="flex items-center gap-1.5 pb-2.5 px-2 border-b border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[10px] font-mono text-slate-400 truncate">
              https://iwaat.com/dashboard/analytics
            </span>
          </div>

          {/* Laptop Preview Content Area */}
          <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[16/10] p-4 flex flex-col justify-between">
            {/* Top Bar inside Website Preview */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
                  iW
                </div>
                <span className="text-xs font-semibold text-white">Healthcare Portal</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live 99.9%
              </span>
            </div>

            {/* Simulated Live Analytics Bar Chart */}
            <div className="space-y-2 py-2">
              <div className="flex justify-between items-end h-20 gap-1.5 pt-2">
                {[45, 65, 80, 55, 90, 75, 100, 85, 95].map((val, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ duration: 1, delay: idx * 0.08 }}
                    className="flex-1 bg-gradient-to-t from-violet-600 via-indigo-500 to-orange-400 rounded-t-sm"
                  />
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
              </div>
            </div>

            {/* Bottom Mini Metrics inside Laptop */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-400 block">Total Traffic</span>
                <span className="text-xs font-bold text-white">148.5K</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-400 block">Conversion</span>
                <span className="text-xs font-bold text-emerald-400">+24.8%</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-400 block">Speed Score</span>
                <span className="text-xs font-bold text-violet-400">99 / 100</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Floating Mobile App Screen (Top Left) */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-2 -left-4 z-30 w-36 md:w-44 rounded-2xl bg-slate-900/90 border border-violet-500/40 p-2.5 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Smartphone className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[10px] font-semibold text-slate-200">Mobile UI</span>
          </div>
          <div className="space-y-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="h-2 w-3/4 bg-violet-500/40 rounded" />
            <div className="h-2 w-1/2 bg-slate-700 rounded" />
            <div className="mt-2 h-10 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 p-1.5 flex items-center justify-between text-white text-[9px] font-bold">
              <span>Gym App</span>
              <Activity className="w-3 h-3" />
            </div>
          </div>
        </motion.div>

        {/* 3. Floating Code Editor Card (Bottom Right) */}
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-2 -right-4 z-30 w-44 md:w-56 rounded-2xl bg-slate-950/90 border border-slate-700/80 p-3 shadow-2xl backdrop-blur-xl font-mono text-[10px]"
        >
          <div className="flex items-center gap-1.5 text-slate-400 mb-2 pb-1.5 border-b border-slate-800">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">App.jsx</span>
          </div>
          <div className="space-y-1 text-slate-300">
            <div>
              <span className="text-pink-400">const</span> <span className="text-amber-300">iWAAt</span> = () =&gt; &#123;
            </div>
            <div className="pl-3 text-slate-400">
              return &lt;<span className="text-violet-400">DigitalProduct</span>
            </div>
            <div className="pl-6 text-emerald-300">scale=&#123;true&#125;</div>
            <div className="pl-6 text-cyan-300">seo="top1"</div>
            <div className="pl-3 text-slate-400">/&gt;</div>
            <div>&#125;</div>
          </div>
        </motion.div>

        {/* 4. Floating Marketing ROI Pill (Top Right) */}
        <motion.div
          animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-10 -right-6 z-30 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-white shadow-lg backdrop-blur-md flex items-center gap-2 border border-orange-400/40"
        >
          <TrendingUp className="w-4 h-4 text-white" />
          <div>
            <span className="text-[9px] uppercase block tracking-wider font-semibold">SEO ROI</span>
            <span className="text-xs font-bold">+210% Growth</span>
          </div>
        </motion.div>

        {/* 5. Floating Trust & Security Badge (Bottom Left) */}
        <motion.div
          animate={{ x: [0, -8, 0], y: [0, 10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-6 -left-6 z-30 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-emerald-400 shadow-lg backdrop-blur-md flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">100% Secure & Scalable</span>
        </motion.div>

      </div>
    </div>
  );
};
