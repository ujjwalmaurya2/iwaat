import React, { useState } from 'react';
import { Wrench, Plus, Edit, Trash2, Zap, CheckCircle2, Star } from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';

export const ServicesManager = () => {
  const { services, addService, updateService, deleteService } = useCMS();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Zap');
  const [popular, setPopular] = useState(false);
  const [stats, setStats] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [deliverablesText, setDeliverablesText] = useState('');

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setIcon('Zap');
    setPopular(false);
    setStats('');
    setFeaturesText('');
    setDeliverablesText('');
  };

  const handleEdit = (service) => {
    setIsEditing(true);
    setEditingId(service.id);
    setTitle(service.title || '');
    setSubtitle(service.subtitle || service.tagline || '');
    setDescription(service.description || '');
    setIcon(service.icon || 'Zap');
    setPopular(service.popular || false);
    setStats(service.stats || '');
    setFeaturesText((service.features || []).join('\n'));
    setDeliverablesText((service.deliverables || []).join('\n'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      subtitle,
      description,
      icon,
      popular,
      stats,
      features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
      deliverables: deliverablesText.split('\n').map((d) => d.trim()).filter(Boolean),
      status: 'published',
    };

    if (isEditing) {
      await updateService(editingId, payload);
    } else {
      await addService(payload);
    }
    resetForm();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-white">Services CMS</h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Add, edit, or customize core agency service capabilities displayed across the public website.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Editor Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-violet-400" />
            <span>{isEditing ? 'Edit Service' : 'Add New Service'}</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Service Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full-Stack Web Development"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Tagline / Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. React 19, Next.js & Serverless"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Description</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of what the agency delivers..."
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Icon Name</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Zap / Globe / Code2"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Result Metric</label>
                <input
                  type="text"
                  value={stats}
                  onChange={(e) => setStats(e.target.value)}
                  placeholder="e.g. +240% Growth"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Key Features (one per line)
              </label>
              <textarea
                rows="3"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="High performance architecture&#10;SEO optimization&#10;Interactive animations"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPopular(!popular)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  popular
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>{popular ? 'Marked as Most Popular' : 'Standard Service'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all cursor-pointer"
              >
                {isEditing ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Services List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-heading font-bold text-base text-white">
            Active Capabilities ({services.length})
          </h3>

          <div className="space-y-3">
            {services.map((serv) => (
              <div
                key={serv.id}
                className="p-5 rounded-3xl bg-[#0B1020]/90 border border-slate-800 hover:border-slate-700 transition-colors flex items-start justify-between gap-4 glow-card"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-base text-white">{serv.title}</span>
                    {serv.popular && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{serv.description}</p>
                  {serv.stats && (
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-violet-500/10 text-violet-300 text-[11px] font-semibold border border-violet-500/30">
                      Impact: {serv.stats}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(serv)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Service"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteService(serv.id)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
