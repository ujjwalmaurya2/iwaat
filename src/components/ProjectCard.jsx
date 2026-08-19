import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Layers, ArrowUpRight } from 'lucide-react';
import { ProjectModal } from './ProjectModal';

export const ProjectCard = memo(({ project, index = 0 }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Helper to optimize image URL based on provider (Unsplash, Microlink, mShots, etc.)
  const rawImage = project.preview_url || project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=640&auto=format&fit=crop';
  
  const getOptimizedSrc = (url) => {
    if (!url || typeof url !== 'string') return fallbackImage;
    try {
      if (url.includes('unsplash.com')) {
        return url.replace(/w=\d+/, 'w=640').replace(/q=\d+/, 'q=80');
      }
      if (url.includes('api.microlink.io')) {
        const parsed = new URL(url);
        parsed.searchParams.set('screenshot.type', 'jpeg');
        parsed.searchParams.set('screenshot.quality', '80');
        parsed.searchParams.set('viewport.width', '960');
        parsed.searchParams.set('viewport.height', '600');
        parsed.searchParams.set('viewport.deviceScaleFactor', '1');
        return parsed.toString();
      }
      if (url.includes('wp.com/mshots')) {
        return url.replace(/w=\d+/, 'w=960').replace(/h=\d+/, 'h=600');
      }
      return url;
    } catch {
      return url;
    }
  };

  const optimizedImageSrc = getOptimizedSrc(rawImage);
  const fallbackImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=640&auto=format&fit=crop';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
        whileHover={{ y: -6 }}
        className="glass-panel rounded-3xl overflow-hidden glow-card flex flex-col justify-between h-full group"
      >
        {/* Project Image & Overlay */}
        <div
          className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer"
          onClick={() => setModalOpen(true)}
          data-cursor="VIEW"
        >
          <img
            src={optimizedImageSrc}
            alt={project.title}
            loading="lazy"
            decoding="async"
            width="600"
            height="375"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              e.target.src = fallbackImage;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Industry Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-950/80 text-violet-300 border border-violet-500/40 backdrop-blur-md shadow-lg">
              {project.category}
            </span>
          </div>

          {/* Hover CTA Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 backdrop-blur-[2px] bg-slate-950/40">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
              aria-label={`View Case Study for ${project.title}`}
              className="px-4 py-2 rounded-full text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              Case Study
            </button>
            {project.url && project.url !== '#' && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2.5 rounded-full bg-violet-600 text-white hover:bg-violet-500 shadow-xl transition-all active:scale-95"
                aria-label={`Open Live Demo of ${project.title}`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow">
          <div>
            <h3
              onClick={() => setModalOpen(true)}
              className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2 cursor-pointer group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors"
            >
              {project.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
              {project.description}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.technologies.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
            <button
              onClick={() => setModalOpen(true)}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-violet-500 transition-colors flex items-center gap-1"
            >
              <span>View Details</span>
              <Layers className="w-3.5 h-3.5" />
            </button>

            {project.url && project.url !== '#' ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 hover:bg-violet-600 hover:text-white transition-all active:scale-95"
              >
                <span>View Live</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-[11px] font-medium text-slate-400">Custom Retail Showcase</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Case Study Modal */}
      {modalOpen && (
        <ProjectModal project={project} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
});

export default ProjectCard;
