import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Globe,
  Sparkles,
  Upload,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Layers,
  Star,
  Eye,
} from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';
import { generateWebsitePreview, normalizeUrl } from '../../cms/previewService';
import { optimizeImage } from '../../cms/imageOptimizer';

export const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { projects, categories, addProject, updateProject } = useCMS();

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [category, setCategory] = useState('Healthcare');
  const [clientName, setClientName] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [previewStatus, setPreviewStatus] = useState('ready');
  const [featured, setFeatured] = useState(true);
  const [status, setStatus] = useState('published');
  const [completionDate, setCompletionDate] = useState('2026');
  
  // Array items
  const [technologiesText, setTechnologiesText] = useState('React 19, Tailwind CSS, Vite, Framer Motion');
  const [highlightsText, setHighlightsText] = useState('Responsive layout architecture\nSub-second load times\nConversion-focused UX');
  const [stats, setStats] = useState([
    { label: 'Global Reach', value: '100K+' },
    { label: 'Load Speed', value: '0.5s' },
  ]);

  // UI state
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load existing data if editing
  useEffect(() => {
    if (isEditing && projects.length > 0) {
      const existing = projects.find((p) => p.id === id);
      if (existing) {
        setTitle(existing.title || '');
        setTagline(existing.tagline || '');
        setDescription(existing.description || '');
        setLongDescription(existing.long_description || existing.description || '');
        setCategory(existing.category || 'Healthcare');
        setClientName(existing.client_name || '');
        setUrl(existing.url || '');
        setImage(existing.image || '');
        setPreviewStatus(existing.preview_status || 'ready');
        setFeatured(existing.featured ?? true);
        setStatus(existing.status || 'published');
        setCompletionDate(existing.completion_date || '2026');
        setTechnologiesText((existing.technologies || []).join(', '));
        setHighlightsText((existing.highlights || []).join('\n'));
        if (existing.stats && existing.stats.length > 0) {
          setStats(existing.stats);
        }
      }
    }
  }, [id, isEditing, projects]);

  // Auto-generate live website screenshot from URL
  const handleGeneratePreview = async () => {
    if (!url || url === '#') {
      setPreviewMessage('Please enter a valid website URL first.');
      return;
    }

    setIsGeneratingPreview(true);
    setPreviewMessage('');

    try {
      const result = await generateWebsitePreview(url);
      if (result.status === 'success' && result.previewUrl) {
        setImage(result.previewUrl);
        setPreviewStatus('generated');
        setPreviewMessage('✅ Live website preview generated successfully!');
      } else {
        setPreviewMessage(`⚠️ ${result.message || 'Automatic preview unavailable. Please upload a custom screenshot.'}`);
      }
    } catch (err) {
      setPreviewMessage('⚠️ Automatic preview unavailable. Please upload a custom screenshot.');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  // Upload custom screenshot fallback
  const handleCustomUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedWebP = await optimizeImage(file);
      setImage(optimizedWebP);
      setPreviewStatus('custom_upload');
      setPreviewMessage('✅ Custom screenshot uploaded and WebP-optimized!');
    } catch (err) {
      setPreviewMessage('⚠️ Failed to optimize image. Please try again.');
    }
  };

  // Add/Remove Stats row
  const addStatRow = () => {
    setStats([...stats, { label: 'New Metric', value: '100%' }]);
  };

  const removeStatRow = (index) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const updateStatRow = (index, field, val) => {
    const updated = [...stats];
    updated[index][field] = val;
    setStats(updated);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const techArray = technologiesText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const highlightArray = highlightsText
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const projectPayload = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline,
      description,
      long_description: longDescription,
      category,
      category_slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      client_name: clientName || title.split(' ')[0],
      url: normalizeUrl(url),
      image: image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
      preview_status: previewStatus,
      preview_updated_at: new Date().toISOString(),
      featured,
      status,
      completion_date: completionDate,
      technologies: techArray,
      highlights: highlightArray,
      stats,
    };

    try {
      if (isEditing) {
        await updateProject(id, projectPayload);
      } else {
        await addProject(projectPayload);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/super-admin/projects');
      }, 1200);
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Error saving project: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/super-admin/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Project Saved! Redirecting...</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : isEditing ? 'Update Project' : 'Publish Project'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: WEBSITE PREVIEW GENERATOR (CRITICAL REQUIREMENT) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-violet-950/40 via-[#0B1020] to-slate-950 border border-violet-500/40 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Live Website Preview Engine</span>
              </span>
              <h3 className="font-heading font-extrabold text-xl text-white">
                Project Website & Real Screenshot
              </h3>
              <p className="text-slate-400 text-xs">
                Enter the live client website URL. The engine will capture the actual rendered site preview.
              </p>
            </div>

            {url && url !== '#' && (
              <a
                href={normalizeUrl(url)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-violet-400 hover:text-white border border-slate-800"
              >
                <span>Test Live Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left URL input & Generator Buttons */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Client Website URL <span className="text-violet-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example-client-website.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons: Auto-generate & Manual Upload */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleGeneratePreview}
                  disabled={isGeneratingPreview}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingPreview ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingPreview ? 'Capturing Screenshot...' : '⚡ Auto-Generate Website Preview'}</span>
                </button>

                <label className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-violet-400" />
                  <span>Upload Custom Screenshot</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Status Notice */}
              {previewMessage && (
                <p className="text-xs font-medium text-slate-300 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 leading-relaxed">
                  {previewMessage}
                </p>
              )}
            </div>

            {/* Right Preview Card Box */}
            <div className="lg:col-span-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Preview Rendering
              </label>
              <div className="relative aspect-[16/10] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner group">
                {image ? (
                  <>
                    <img
                      src={image}
                      alt="Project Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleGeneratePreview}
                        className="px-3 py-1.5 rounded-full bg-violet-600 text-white text-[11px] font-bold"
                      >
                        Regenerate
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                    <Globe className="w-8 h-8 text-slate-600" />
                    <span className="text-xs">No screenshot generated yet</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: BASIC INFORMATION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-6">
          <h3 className="font-heading font-extrabold text-lg text-white">
            Basic Project Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Project Title <span className="text-violet-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Apex Health Global Portal"
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Tagline / Subtitle */}
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Healthcare management platform & mobile patient records"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Industry Category <span className="text-violet-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Client Name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Client / Organization Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Apex Health Corp"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Publish Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              >
                <option value="published">Published (Visible on Public Website)</option>
                <option value="draft">Draft (Hidden in Public)</option>
              </select>
            </div>

            {/* Featured Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Featured on Homepage
              </label>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                    featured
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  <Star className={`w-4 h-4 ${featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{featured ? 'Featured on Home & Portfolio' : 'Standard Portfolio Item'}</span>
                </button>
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Short Overview Description <span className="text-violet-400">*</span>
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="2-3 sentences summarizing the product and impact..."
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Full Case Study Description */}
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Full Case Study Story / Architecture Details
              </label>
              <textarea
                rows="5"
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="In-depth details on how the system was engineered, challenges solved, and results..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TECH STACK & HIGHLIGHTS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-6">
          <h3 className="font-heading font-extrabold text-lg text-white">
            Technologies & Key Highlights
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Technologies (comma separated)
              </label>
              <input
                type="text"
                value={technologiesText}
                onChange={(e) => setTechnologiesText(e.target.value)}
                placeholder="React 19, Tailwind CSS, Vite, Supabase"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Completion Year
              </label>
              <input
                type="text"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                placeholder="2026"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Key Features / Deliverable Highlights (one per line)
              </label>
              <textarea
                rows="4"
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: KEY STATS / METRICS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-lg text-white">
              Measurable Results & Stats
            </h3>
            <button
              type="button"
              onClick={addStatRow}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Metric</span>
            </button>
          </div>

          <div className="space-y-3">
            {stats.map((st, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => updateStatRow(idx, 'label', e.target.value)}
                  placeholder="Metric Label (e.g. Load Speed)"
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
                <input
                  type="text"
                  value={st.value}
                  onChange={(e) => updateStatRow(idx, 'value', e.target.value)}
                  placeholder="Value (e.g. 0.4s or +120%)"
                  className="w-36 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() => removeStatRow(idx)}
                  className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Submit */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to="/super-admin/projects"
            className="px-6 py-3 rounded-full text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-full text-sm font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Project...' : isEditing ? 'Save Changes' : 'Publish to Website'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
