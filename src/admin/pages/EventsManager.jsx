import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Image as ImageIcon,
  Upload,
  Trash2,
  Edit,
  MapPin,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';
import { optimizeImage } from '../../cms/imageOptimizer';

export const EventsManager = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useCMS();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('2026-08-15');
  const [location, setLocation] = useState('Global Hub / New York & Virtual');
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setTitle('');
    setDescription('');
    setEventDate('2026-08-15');
    setLocation('Global Hub / New York & Virtual');
    setCoverImage('');
    setGalleryImages([]);
  };

  const handleEdit = (evt) => {
    setIsCreating(true);
    setEditingId(evt.id);
    setTitle(evt.title || '');
    setDescription(evt.description || '');
    setEventDate(evt.event_date || '2026-08-15');
    setLocation(evt.location || '');
    setCoverImage(evt.cover_image || '');
    setGalleryImages(evt.images || []);
  };

  // Multi-image upload handler
  const handleMultipleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const optimizedUrls = [];
      for (const file of files) {
        const webpUrl = await optimizeImage(file);
        optimizedUrls.push({
          url: webpUrl,
          caption: file.name.replace(/\.[^/.]+$/, ''),
        });
      }

      if (!coverImage && optimizedUrls.length > 0) {
        setCoverImage(optimizedUrls[0].url);
      }

      setGalleryImages((prev) => [...prev, ...optimizedUrls]);
    } catch (err) {
      alert('Error optimizing images: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeGalleryImage = (idx) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      event_date: eventDate,
      location,
      cover_image: coverImage || (galleryImages[0]?.url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop'),
      images: galleryImages,
      status: 'published',
      display_order: events.length,
    };

    if (editingId) {
      await updateEvent(editingId, payload);
    } else {
      await addEvent(payload);
    }
    resetForm();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-white">Events & Gallery CMS</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Publish event photo albums, team meetups, launch ceremonies, and client workshops.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event Album</span>
          </button>
        )}
      </div>

      {/* Album Creation / Editor Card */}
      {isCreating && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/95 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-400" />
              <span>{editingId ? 'Edit Event Album' : 'New Event Photo Album'}</span>
            </h3>
            <button
              onClick={resetForm}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Event Title <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. iWAAT Global Team Meetup 2026"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Location / Venue
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New York Hub & Virtual"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Event Story & Overview
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of the event, workshop highlights, or celebration..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Multiple Image Upload Box */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Upload Event Photos (Multi-Image Drag & Drop)
              </label>

              <label className="border-2 border-dashed border-slate-800 hover:border-violet-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all text-center">
                <Upload className={`w-8 h-8 text-violet-400 ${isUploading ? 'animate-bounce' : ''}`} />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isUploading ? 'Compressing & Uploading Photos...' : 'Click to select multiple photos'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Supports JPG, PNG, WebP (Automatically WebP-compressed)
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleMultipleUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Gallery Preview Thumbnails */}
            {galleryImages.length > 0 && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-400">
                  Uploaded Photos ({galleryImages.length}) — Click star to set cover image
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-[4/3] rounded-2xl overflow-hidden border ${
                        coverImage === img.url ? 'border-violet-500 ring-2 ring-violet-500/30' : 'border-slate-800'
                      }`}
                    >
                      <img src={img.url} alt={`Photo ${idx}`} className="w-full h-full object-cover" />

                      <div className="absolute inset-0 bg-slate-950/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCoverImage(img.url)}
                          className="p-1.5 rounded-lg bg-violet-600 text-white text-[10px] font-bold"
                          title="Set as Cover Photo"
                        >
                          Cover
                        </button>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="p-1.5 rounded-lg bg-red-600 text-white"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {coverImage === img.url && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-violet-600 text-white">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
              >
                {editingId ? 'Update Album' : 'Publish Album'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events Album Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="rounded-3xl bg-[#0B1020]/90 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all glow-card"
          >
            <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
              <img
                src={evt.cover_image || evt.images?.[0]?.url}
                alt={evt.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-violet-300 border border-violet-500/30 backdrop-blur-md flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>{evt.images?.length || 1} Photos</span>
                </span>
              </div>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-base text-white">{evt.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{evt.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    <span>{evt.event_date}</span>
                  </span>
                  {evt.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      <span className="truncate max-w-[120px]">{evt.location}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(evt)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deleteEvent(evt.id)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
