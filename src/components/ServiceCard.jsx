import React, { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Cpu,
  Layout,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  Code2,
  Cpu,
  Layout,
  TrendingUp,
  Sparkles,
  ShieldCheck,
};

export const ServiceCard = memo(({ service, index = 0 }) => {
  const IconComponent = iconMap[service.icon] || Code2;
  const servicePath = `/services/${service.slug || service.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.3) }}
      whileHover={{ y: -6 }}
      className="glass-panel p-8 rounded-3xl glow-card flex flex-col justify-between h-full group relative overflow-hidden"
    >
      {/* Top Accent Gradient Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.gradient || 'from-violet-600 to-indigo-600'}`}
      />

      <div>
        {/* Header & Icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-500 dark:text-violet-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md">
            <IconComponent className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
            {service.badge}
          </span>
        </div>

        {/* Title & Short Description */}
        <Link to={servicePath}>
          <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
            {service.title}
          </h3>
        </Link>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
          {service.shortDescription}
        </p>

        {/* Feature List Bullets */}
        <ul className="space-y-2.5 mb-8">
          {service.features?.map((feature, fIdx) => (
            <li
              key={fIdx}
              className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Link */}
      <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between">
        <Link
          to={servicePath}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 group-hover:text-orange-500 transition-colors"
        >
          <span>Explore Detailed Scope</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
});

export default ServiceCard;
