import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export const TestimonialCard = ({ testimonial, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="glass-panel p-8 rounded-3xl glow-card flex flex-col justify-between h-full relative"
    >
      <Quote className="absolute top-6 right-6 w-10 h-10 text-violet-500/10 dark:text-violet-500/20 pointer-events-none" />

      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-6 text-amber-400">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400" />
          ))}
        </div>

        {/* Quote Text */}
        <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base italic leading-relaxed mb-8">
          "{testimonial.quote}"
        </p>
      </div>

      {/* Author Details & Avatar */}
      <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={testimonial.avatar}
            alt={testimonial.author}
            className="w-12 h-12 rounded-full object-cover border-2 border-violet-500/40 shadow-md"
          />
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
              {testimonial.author}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {testimonial.role} • <span className="text-violet-500 font-medium">{testimonial.organization}</span>
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-300">
          {testimonial.project}
        </span>
      </div>
    </motion.div>
  );
};
