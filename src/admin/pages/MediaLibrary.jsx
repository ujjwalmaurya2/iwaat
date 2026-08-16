import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Search, Sparkles } from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';

export const MediaLibrary = () => {
  const { mediaAssets, uploadMedia, deleteMedia } = useCMS();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        await uploadMedia(file, 'general');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const copyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredMedia = mediaAssets.filter((m) =>
    (m.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-white">Media Library</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Centralized asset manager for screenshots, project imagery, brand logos, and banners.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all cursor-pointer">
          <Upload className={`w-4 h-4 ${isUploading ? 'animate-bounce' : ''}`} />
          <span>{isUploading ? 'Compressing & Uploading...' : 'Upload Media Asset'}</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Search */}
      <div className="p-4 rounded-3xl bg-[#0B1020]/90 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media files by name..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          {filteredMedia.length} Assets
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMedia.map((asset) => (
          <div
            key={asset.id}
            className="rounded-2xl bg-[#0B1020]/90 border border-slate-800 overflow-hidden flex flex-col justify-between group glow-card"
          >
            <div className="relative aspect-square bg-slate-950 overflow-hidden">
              <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />

              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(asset.id, asset.url)}
                  className="p-2 rounded-xl bg-violet-600 text-white text-xs"
                  title="Copy URL"
                >
                  {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => deleteMedia(asset.id)}
                  className="p-2 rounded-xl bg-red-600 text-white text-xs"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3">
              <p className="text-[11px] font-bold text-white truncate">{asset.name}</p>
              <span className="text-[10px] text-slate-500 font-mono uppercase">
                {asset.category || 'General'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-16 p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-3">
          <ImageIcon className="w-8 h-8 text-violet-400 mx-auto" />
          <h3 className="font-heading font-bold text-white text-base">Media Library Ready</h3>
          <p className="text-xs text-slate-400">
            Upload images here to easily reuse across projects, events, and website banners.
          </p>
        </div>
      )}
    </div>
  );
};
