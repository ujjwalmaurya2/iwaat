import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '../components/SectionHeader';
import { Calendar, MapPin, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import { useCMS } from '../cms/cmsContext';

export const Events = () => {
  const { events } = useCMS();
  const [selectedImage, setSelectedImage] = useState(null);

  const publishedEvents = events.filter((e) => e.status === 'published');

  return (
    <div className="pt-24 md:pt-36 pb-20 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeader
          badge="Agency Life & Milestones"
          title="Team Events, Sprints &"
          highlight="Project Launches"
          subtitle="Explore behind-the-scenes photography from our engineering meetups, design hackathons, client workshops, and product releases."
        />
      </div>

      {/* Events Album List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {publishedEvents.map((evt, idx) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-panel p-8 sm:p-10 rounded-3xl glow-card space-y-8"
          >
            {/* Event Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-6">
              <div className="space-y-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/30 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Milestone</span>
                </span>
                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                  {evt.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
                <span className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  <span>{evt.event_date}</span>
                </span>
                {evt.location && (
                  <span className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{evt.location}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(evt.images && evt.images.length > 0 ? evt.images : [{ url: evt.cover_image, caption: evt.title }]).map((img, imgIdx) => (
                <motion.div
                  key={imgIdx}
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer shadow-lg group"
                  onClick={() => setSelectedImage(img.url)}
                >
                  <img
                    src={img.url}
                    alt={img.caption || `Event photo ${imgIdx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    {img.caption && (
                      <span className="text-xs font-medium text-white line-clamp-1">
                        {img.caption}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {publishedEvents.length === 0 && (
          <div className="text-center py-20 glass-panel rounded-3xl space-y-3">
            <ImageIcon className="w-10 h-10 text-violet-500 mx-auto" />
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              No Events Published Yet
            </h3>
            <p className="text-slate-500 text-sm">
              Check back soon for team celebrations, launches, and conference updates.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-slate-900 text-white border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
