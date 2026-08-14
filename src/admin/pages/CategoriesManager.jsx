import React, { useState } from 'react';
import { Tags, Plus, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';

export const CategoriesManager = () => {
  const { categories, projects, addCategory, deleteCategory } = useCMS();
  const [newCatName, setNewCatName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsSubmitting(true);
    try {
      await addCategory({ name: newCatName.trim() });
      setNewCatName('');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-white">Project Categories</h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Manage project industries and tags used on the public showcase filter and admin project creator.
        </p>
      </div>

      {/* Add Category Form */}
      <div className="p-6 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-4">
        <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-violet-400" />
          <span>Add New Category</span>
        </h3>

        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Artificial Intelligence / FinTech / SaaS"
            required
            className="w-full sm:flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="p-6 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-4">
        <h3 className="font-heading font-bold text-base text-white">
          Active Categories ({categories.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const count = projects.filter(
              (p) =>
                p.category.toLowerCase() === cat.name.toLowerCase() ||
                p.category_slug === cat.slug
            ).length;

            return (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                    <Tags className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-white">{cat.name}</p>
                    <span className="text-[11px] text-slate-500 font-mono">
                      slug: {cat.slug} • {count} projects
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
