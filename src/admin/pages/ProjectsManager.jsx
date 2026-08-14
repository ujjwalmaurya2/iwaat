import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  ExternalLink,
  Edit,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';
import { INDUSTRY_CATEGORIES } from '../../data/industryCategories';

export const ProjectsManager = () => {
  const { projects, categories: dbCategories, deleteProject, toggleProjectPublish, toggleProjectFeatured } = useCMS();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Combine standard 39 categories with DB categories
  const allCategoryOptions = React.useMemo(() => {
    const map = new Map();
    INDUSTRY_CATEGORIES.forEach((c) => map.set(c.name.toLowerCase(), c));
    (dbCategories || []).forEach((c) => {
      if (!map.has(c.name.toLowerCase())) {
        map.set(c.name.toLowerCase(), {
          id: c.slug || c.id,
          name: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        });
      }
    });
    return Array.from(map.values());
  }, [dbCategories]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.url && p.url.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      p.category_slug === selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const matchesStatus =
      selectedStatus === 'All' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const confirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-white">Project Management</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Create, edit, publish, and manage all showcase websites and client applications.
          </p>
        </div>

        <Link
          to="/super-admin/projects/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-[#0B1020]/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, client, tech..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="All">All Categories</option>
              {allCategoryOptions.map((c) => (
                <option key={c.id || c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Projects Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-[#0B1020]/90 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all glow-card"
          >
            {/* Image Preview & Badges */}
            <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden group">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-violet-300 border border-violet-500/30 backdrop-blur-md">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 backdrop-blur-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3">
                <button
                  onClick={() => toggleProjectPublish(project.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-colors ${
                    project.status === 'published'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  }`}
                >
                  {project.status}
                </button>
              </div>

              {project.url && project.url !== '#' && (
                <div className="absolute bottom-3 right-3">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-950/80 hover:bg-violet-600 text-white border border-slate-700/60 shadow-lg backdrop-blur-md transition-colors block"
                    title="Open live website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Body Info */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-base text-white line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.technologies?.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-slate-400 border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                  {project.technologies?.length > 3 && (
                    <span className="text-[10px] text-slate-500 self-center">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleProjectFeatured(project.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      project.featured
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
                    }`}
                    title={project.featured ? 'Remove from Featured' : 'Mark as Featured'}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleProjectPublish(project.id)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    title={project.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {project.status === 'published' ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/super-admin/projects/edit/${project.id}`}
                    className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-md shadow-violet-500/20"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => setProjectToDelete(project)}
                    className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-3">
          <Sparkles className="w-8 h-8 text-violet-400 mx-auto" />
          <h3 className="font-heading font-bold text-white text-lg">No Projects Found</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search criteria or add a new project.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-[#0B1020] border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Delete Project</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to permanently delete{' '}
                <span className="font-bold text-white">"{projectToDelete.title}"</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
