import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  Clock,
  ShieldCheck,
  X,
  RotateCcw,
} from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';
import { generateWebsitePreview, normalizeUrl } from '../../cms/previewService';
import { optimizeImage } from '../../cms/imageOptimizer';
import { INDUSTRY_CATEGORIES } from '../../data/industryCategories';

export const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { projects, categories: dbCategories, addProject, updateProject, updateProjectPreview } = useCMS();

  // Combine static official 39 industry categories with any custom admin categories
  const allCategories = useMemo(() => {
    const map = new Map();
    INDUSTRY_CATEGORIES.forEach((c) => map.set(c.name.toLowerCase(), c));
    (dbCategories || []).forEach((c) => {
      if (!map.has(c.name.toLowerCase())) {
        map.set(c.name.toLowerCase(), {
          id: c.slug || c.id,
          name: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          display_order: c.display_order || 99,
        });
      }
    });
    return Array.from(map.values());
  }, [dbCategories]);

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
  const [previewSource, setPreviewSource] = useState('none');
  const [previewUpdatedAt, setPreviewUpdatedAt] = useState('');
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
  const [generatingStepText, setGeneratingStepText] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  const [previewMessageType, setPreviewMessageType] = useState('info'); // 'success' | 'error' | 'info'
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
        setPreviewSource(existing.preview_source || (existing.image?.includes('microlink') ? 'microlink' : existing.image ? 'custom' : 'none'));
        setPreviewUpdatedAt(existing.preview_updated_at || '');
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
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setPreviewMessageType('error');
      setPreviewMessage('Website URL is invalid. Please enter a valid address (e.g. https://example.com).');
      return;
    }

    setIsGeneratingPreview(true);
    setPreviewMessageType('info');
    setGeneratingStepText('Capturing live website rendering...');
    setPreviewMessage('');

    try {
      const slug = (title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const result = await generateWebsitePreview(normalized, slug);

      if (result.status === 'success' && result.previewUrl) {
        setImage(result.previewUrl);
        setPreviewStatus('ready');
        setPreviewSource(result.provider || 'auto');
        setPreviewUpdatedAt(result.timestamp || new Date().toISOString());
        setPreviewMessageType('success');
        setPreviewMessage(`✅ Real website screenshot captured via ${result.provider || 'live engine'}!`);
      } else {
        setPreviewMessageType('error');
        setPreviewMessage(
          result.message || 'Automatic preview generation failed for this website. The website may block external crawlers. Please upload a screenshot manually.'
        );
      }
    } catch (err) {
      console.error('[ProjectEditor] Preview error:', err);
      setPreviewMessageType('error');
      setPreviewMessage('Automatic preview unavailable for this website. Please upload a screenshot manually.');
    } finally {
      setIsGeneratingPreview(false);
      setGeneratingStepText('');
    }
  };

  // Upload custom screenshot fallback
  const handleCustomUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedWebP = await optimizeImage(file);
      setImage(optimizedWebP);
      setPreviewStatus('ready');
      setPreviewSource('manual');
      setPreviewUpdatedAt(new Date().toISOString());
      setPreviewMessageType('success');
      setPreviewMessage('✅ Custom screenshot uploaded and WebP-optimized!');
    } catch (err) {
      setPreviewMessageType('error');
      setPreviewMessage('Failed to optimize uploaded screenshot. Please try another image.');
    }
  };

  // Remove preview
  const handleRemovePreview = () => {
    setImage('');
    setPreviewStatus('empty');
    setPreviewSource('none');
    setPreviewUpdatedAt('');
    setPreviewMessage('');
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

    const selectedCatObj = allCategories.find((c) => c.name.toLowerCase() === category.toLowerCase());
    const normalizedUrl = normalizeUrl(url) || url;

    const projectPayload = {
      title,
      slug: (title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline,
      description,
      long_description: longDescription,
      category,
      category_slug: selectedCatObj?.slug || category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      client_name: clientName || title.split(' ')[0],
      url: normalizedUrl,
      image: image || '',
      preview_status: previewStatus,
      preview_source: previewSource,
      preview_updated_at: previewUpdatedAt || new Date().toISOString(),
      featured,
      status,
      completion_date: completionDate,
      technologies: techArray,
      highlights: highlightArray,
      stats,
    };

    try {
      let savedProject = null;
      if (isEditing) {
        savedProject = await updateProject(id, projectPayload);
      } else {
        savedProject = await addProject(projectPayload);
      }

      setSaveSuccess(true);

      // If project has a URL but no preview image, trigger asynchronous preview generation in background
      if (normalizedUrl && !image && savedProject?.id) {
        generateWebsitePreview(normalizedUrl, savedProject.id, savedProject.slug)
          .then((res) => {
            if (res.status === 'ready' && res.previewUrl) {
              updateProjectPreview(savedProject.id, {
                preview_url: res.previewUrl,
                preview_source: res.provider || 'auto',
                preview_status: 'ready',
                preview_updated_at: res.timestamp || new Date().toISOString(),
                preview_error: null,
              });
            }
          })
          .catch((err) => {
            console.warn('[ProjectEditor] Background preview generation note:', err.message);
          });
      }

      setTimeout(() => {
        navigate('/super-admin/projects');
      }, 800);
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
        {/* SECTION 1: REAL WEBSITE PREVIEW GENERATOR */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-violet-950/40 via-[#0B1020] to-slate-950 border border-violet-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Live Website Preview Engine</span>
              </span>
              <h3 className="font-heading font-extrabold text-xl text-white">
                Project Website & Real Screenshot Preview
              </h3>
              <p className="text-slate-400 text-xs">
                Enter the live client website URL. The engine captures the actual rendered appearance of the website.
              </p>
            </div>

            {url && normalizeUrl(url) && (
              <a
                href={normalizeUrl(url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-violet-400 hover:text-white border border-slate-800 shrink-0"
              >
                <span>Visit Live Site</span>
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
                    placeholder="https://client-portal.com or client-portal.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleGeneratePreview}
                  disabled={isGeneratingPreview || !url}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingPreview ? 'animate-spin' : ''}`} />
                  <span>
                    {isGeneratingPreview
                      ? generatingStepText || 'Capturing Website...'
                      : image
                      ? '⚡ Regenerate Website Preview'
                      : '⚡ Auto-Generate Website Preview'}
                  </span>
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
                <div
                  className={`p-3.5 rounded-2xl border text-xs font-medium leading-relaxed flex items-start justify-between gap-3 ${
                    previewMessageType === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : previewMessageType === 'error'
                      ? 'bg-red-500/10 border-red-500/30 text-red-300'
                      : 'bg-slate-900/90 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {previewMessageType === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <span>{previewMessage}</span>
                  </div>

                  {previewMessageType === 'error' && (
                    <button
                      type="button"
                      onClick={handleGeneratePreview}
                      disabled={isGeneratingPreview}
                      className="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-bold shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Try Again</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right Preview Card Box */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Preview Rendering
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={handleRemovePreview}
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <div className="relative aspect-[16/10] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner group flex items-center justify-center">
                {image ? (
                  <>
                    <img
                      src={image}
                      alt="Project Website Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleGeneratePreview}
                        disabled={isGeneratingPreview}
                        className="px-3.5 py-1.5 rounded-full bg-violet-600 text-white text-[11px] font-bold shadow hover:bg-violet-500 cursor-pointer"
                      >
                        Regenerate Preview
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2 bg-slate-950/70">
                    <Globe className="w-8 h-8 text-slate-700" />
                    <span className="text-xs">No screenshot generated yet</span>
                    <span className="text-[10px] text-slate-600">Enter a website URL and click Auto-Generate</span>
                  </div>
                )}
              </div>

              {/* Metadata details */}
              {image && (
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>
                    Source: <strong className="text-violet-300 uppercase">{previewSource}</strong>
                  </span>
                  {previewUpdatedAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(previewUpdatedAt).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: BASIC INFORMATION & INDUSTRY CATEGORY */}
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

            {/* Industry Category (Expanded 39 Categories System) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Industry Category ({allCategories.length} Options) <span className="text-violet-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              >
                {allCategories.map((c) => (
                  <option key={c.id || c.slug} value={c.name}>
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
                placeholder="e.g. Apex Health Systems"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Summary Description <span className="text-violet-400">*</span>
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief high-level summary of the digital product..."
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Long Description / Case Study */}
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Full Case Study Details
              </label>
              <textarea
                rows="5"
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Comprehensive breakdown of client objectives, technical hurdles, architecture, and business outcomes..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TECHNICAL STACK & HIGHLIGHTS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-6">
          <h3 className="font-heading font-extrabold text-lg text-white">
            Engineering & Features
          </h3>

          <div className="space-y-6">
            {/* Technologies Comma-separated */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Technologies Used (Comma-Separated)
              </label>
              <input
                type="text"
                value={technologiesText}
                onChange={(e) => setTechnologiesText(e.target.value)}
                placeholder="React 19, Tailwind CSS, Vite, Supabase, Framer Motion"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Feature Highlights (1 per line) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Feature Highlights (One Per Line)
              </label>
              <textarea
                rows="3"
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                placeholder="Real-time patient telemetry\nAutomated invoice generation\nSub-second global load times"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Key Metric Stats Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Key Metrics / Numbers
                </label>
                <button
                  type="button"
                  onClick={addStatRow}
                  className="px-3 py-1 rounded-xl bg-violet-600/20 text-violet-300 hover:bg-violet-600/40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stat</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3"
                  >
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => updateStatRow(idx, 'label', e.target.value)}
                      placeholder="Metric Label (e.g. Uptime)"
                      className="w-1/2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => updateStatRow(idx, 'value', e.target.value)}
                      placeholder="Value (e.g. 99.9%)"
                      className="w-1/2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-bold"
                    />
                    {stats.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStatRow(idx)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: PUBLISHING CONTROLS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-6">
          <h3 className="font-heading font-extrabold text-lg text-white">
            Publishing Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Status (Published vs Draft) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 font-semibold"
              >
                <option value="published">🚀 Published (Live on Website)</option>
                <option value="draft">📝 Draft (Super Admin Only)</option>
              </select>
            </div>

            {/* Featured Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Featured on Homepage
              </label>
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`w-full px-4 py-3 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  featured
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Star className={`w-4 h-4 ${featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{featured ? '★ Featured on Home' : 'Standard Portfolio'}</span>
              </button>
            </div>

            {/* Year / Date */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Delivery Year
              </label>
              <input
                type="text"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                placeholder="2026"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
          <Link
            to="/super-admin/projects"
            className="px-6 py-3 rounded-full text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-full text-sm font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish to Portfolio'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
