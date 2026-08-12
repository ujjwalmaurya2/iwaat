import React from 'react';
import { motion } from 'framer-motion';
import {
  Atom,
  Layers,
  Palette,
  FileCode,
  Sparkles,
  Server,
  Zap,
  Database,
  DatabaseZap,
  Flame,
  GitBranch,
  Globe,
  PenTool,
  Box,
  Send,
  Search,
  BarChart3,
  Share2,
  Target,
  Mail,
  Code2,
} from 'lucide-react';

const iconMap = {
  Atom,
  Layers,
  Palette,
  FileCode,
  Sparkles,
  Server,
  Zap,
  Database,
  DatabaseZap,
  Flame,
  GitBranch,
  Globe,
  Figma: PenTool,
  Box,
  Send,
  Search,
  BarChart3,
  Share2,
  Target,
  Mail,
};

export const TechBadge = ({ tech, index = 0 }) => {
  const IconComponent = iconMap[tech.icon] || Code2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.03 }}
      className="glass-panel p-5 rounded-2xl glow-card flex flex-col justify-between group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform">
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            {tech.name}
          </h4>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-500">
            {tech.level}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {tech.description}
      </p>
    </motion.div>
  );
};
