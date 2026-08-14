import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';

export const WebsiteSettings = () => {
  const { websiteSettings, updateWebsiteSettings } = useCMS();

  const [name, setName] = useState('iWAAt');
  const [tagline, setTagline] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [aboutDescription, setAboutDescription] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [copyrightText, setCopyrightText] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (websiteSettings) {
      setName(websiteSettings.name || 'iWAAt');
      setTagline(websiteSettings.tagline || '');
      setShortDescription(websiteSettings.short_description || '');
      setAboutDescription(websiteSettings.about_description || '');
      setSeoTitle(websiteSettings.seo_title || '');
      setSeoDescription(websiteSettings.seo_description || '');
      setSeoKeywords(websiteSettings.seo_keywords || '');
      setOgImage(websiteSettings.og_image || '');
      setCopyrightText(websiteSettings.copyright_text || '');
    }
  }, [websiteSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateWebsiteSettings({
        name,
        tagline,
        short_description: shortDescription,
        about_description: aboutDescription,
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_keywords: seoKeywords,
        og_image: ogImage,
        copyright_text: copyrightText,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      alert('Error saving website settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-white">Website & Brand Settings</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Customize branding, agency slogans, about story, SEO search metadata, and Open Graph previews.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Website branding and SEO settings successfully updated!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Brand Information */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-6">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Brand Identity & Story</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Agency Brand Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Core Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">Short Hero Overview</label>
              <textarea
                rows="2"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">Full About Page Narrative</label>
              <textarea
                rows="4"
                value={aboutDescription}
                onChange={(e) => setAboutDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* SEO & Meta Tags */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-6">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-400" />
            <span>Search Engine Optimization (SEO) & Social Graph</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">SEO Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">SEO Meta Description</label>
              <textarea
                rows="3"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Keywords (comma separated)</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Open Graph Social Image URL</label>
              <input
                type="text"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">Footer Copyright Text</label>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
