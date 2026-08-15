import React, { useState } from 'react';
import { MessageSquareQuote, Plus, Edit, Trash2, Star, CheckCircle2 } from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';

export const TestimonialsManager = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useCMS();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState('');

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setRole('');
    setCompany('');
    setContent('');
    setRating(5);
    setImage('');
  };

  const handleEdit = (test) => {
    setIsEditing(true);
    setEditingId(test.id);
    setName(test.name || '');
    setRole(test.role || '');
    setCompany(test.company || '');
    setContent(test.content || '');
    setRating(test.rating || 5);
    setImage(test.image || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      role,
      company,
      content,
      rating: Number(rating),
      image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      status: 'published',
      featured: true,
    };

    if (isEditing) {
      await updateTestimonial(editingId, payload);
    } else {
      await addTestimonial(payload);
    }
    resetForm();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-white">Client Testimonials CMS</h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Manage authentic feedback and reviews displayed in the marquee on the public website.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4 text-violet-400" />
            <span>{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Client / Founder Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Sharma"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Client Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Founder & CEO"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Health"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Testimonial Quote</label>
              <textarea
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What the client said about iWAAT..."
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Rating (1 to 5 Stars)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Client Avatar / Photo URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
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
                {isEditing ? 'Update Testimonial' : 'Publish Testimonial'}
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-heading font-bold text-base text-white">
            Client Reviews ({testimonials.length})
          </h3>

          <div className="space-y-3">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="p-5 rounded-3xl bg-[#0B1020]/90 border border-slate-800 hover:border-slate-700 transition-colors space-y-3 glow-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
                      {test.image ? (
                        <img src={test.image} alt={test.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-violet-400 text-xs">
                          {test.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">{test.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {test.role} {test.company ? `• ${test.company}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <button
                      onClick={() => handleEdit(test)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteTestimonial(test.id)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{test.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
