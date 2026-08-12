import React from 'react';
import { Star, Quote } from 'lucide-react';
import testimonialsData from '../data/testimonials.json';

const row1 = testimonialsData.slice(0, 4);
const row2 = testimonialsData.slice(4, 8);

const MarqueeCard = ({ testimonial }) => {
  return (
    <div className="w-[340px] sm:w-[420px] shrink-0 glass-panel p-7 sm:p-8 rounded-3xl glow-card flex flex-col justify-between relative mx-3 group hover:scale-[1.02] transition-transform duration-300">
      <Quote className="absolute top-6 right-6 w-10 h-10 text-violet-500/10 dark:text-violet-500/20 pointer-events-none" />

      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-4 text-amber-400">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400" />
          ))}
        </div>

        {/* Quote Text */}
        <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm italic leading-relaxed mb-6">
          "{testimonial.quote}"
        </p>
      </div>

      {/* Author Details */}
      <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={testimonial.avatar}
            alt={testimonial.author}
            className="w-10 h-10 rounded-full object-cover border-2 border-violet-500/40 shadow-md"
          />
          <div>
            <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {testimonial.author}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {testimonial.role} • <span className="text-violet-500 font-medium">{testimonial.organization}</span>
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-300">
          {testimonial.project}
        </span>
      </div>
    </div>
  );
};

export const TestimonialMarquee = () => {
  return (
    <div className="relative w-full overflow-hidden space-y-6 py-4">
      {/* Edge Gradient Mask Overlay */}
      <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white dark:from-[#0B1020] to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white dark:from-[#0B1020] to-transparent z-20 pointer-events-none" />

      {/* Row 1: Right to Left (Moving Left) */}
      <div className="flex overflow-hidden group">
        <div className="animate-marquee-left flex">
          {[...row1, ...row1, ...row1].map((item, index) => (
            <MarqueeCard key={`row1-${index}`} testimonial={item} />
          ))}
        </div>
      </div>

      {/* Row 2: Left to Right (Moving Right) */}
      <div className="flex overflow-hidden group">
        <div className="animate-marquee-right flex">
          {[...row2, ...row2, ...row2].map((item, index) => (
            <MarqueeCard key={`row2-${index}`} testimonial={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
