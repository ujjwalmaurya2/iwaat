import React from 'react';
import { motion } from 'framer-motion';
import { BrandLockup } from '../../components/BrandLockup';
import { ShieldCheck } from 'lucide-react';

export const AdminLoader = ({ message = "Initializing Super Admin Portal..." }) => {
  return (
    <div className="min-h-screen bg-[#070A14] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-violet-500 selection:text-white z-[100]">
      {/* Background Decorative Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <div className="relative">
          {/* Subtle outer glow that pulses */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-violet-500/30 rounded-3xl blur-2xl"
          />
          <BrandLockup 
            layout="col" 
            showMotto={true} 
            logoSize="w-16 h-16" 
            className="relative z-10 drop-shadow-xl"
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                className="w-1.5 h-1.5 rounded-full bg-violet-400"
              />
            ))}
          </div>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">{message}</p>
        </div>
      </motion.div>
    </div>
  );
};
