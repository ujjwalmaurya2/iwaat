import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '../components/SectionHeader';
import { ProjectCard } from '../components/ProjectCard';
import { useCMS } from '../cms/cmsContext';
import { Sparkles } from 'lucide-react';

export const Projects = () => {
  const { projects, categories: dbCategories } = useCMS();
  const [activeCategory, setActiveCategory] = useState('All');

  const publishedProjects = projects.filter((p) => p.status === 'published');

  // Build category list dynamically: all unique categories from published projects, plus DB categories
  const projectCatNames = publishedProjects.map((p) => p.category).filter(Boolean);
  const dbCatNames = (dbCategories || []).map((c) => c.name).filter(Boolean);
  const uniqueCategories = Array.from(new Set([...projectCatNames, ...dbCatNames.filter((name) => projectCatNames.includes(name))]));
  const categories = ['All', ...(uniqueCategories.length > 0 ? uniqueCategories : ['Healthcare', 'Education', 'NGO & Nonprofit', 'E-Commerce'])];

  const filteredProjects =
    activeCategory === 'All'
      ? publishedProjects
      : publishedProjects.filter(
          (p) =>
            p.category?.toLowerCase() === activeCategory.toLowerCase() ||
            p.category_slug === activeCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
            p.categorySlug === activeCategory.toLowerCase()
        );

  return (
    <div className="pt-28 pb-20 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeader
          badge="Selected Portfolio"
          title="Engineered Products That Drive"
          highlight="Real Industry Growth"
          subtitle="Explore our showcase of production-deployed web applications, healthcare management platforms, e-commerce portals, and non-profit websites."
        />

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 scale-105'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 glass-panel rounded-3xl">
            <Sparkles className="w-10 h-10 text-violet-500 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2">
              No projects found in this category
            </h3>
            <p className="text-slate-500 text-sm">
              Try selecting 'All' to view all delivered digital products.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
