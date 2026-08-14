import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Send,
  Trash2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Building,
  User,
  Sparkles,
} from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New Inquiry' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_discussion', label: 'In Discussion' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'approved', label: 'Approved & Signed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'archived', label: 'Archived' },
];

export const InquiryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inquiries, updateInquiryStatus, updateInquiryPriority, addInquiryNote, markInquiryRead, deleteInquiry } = useCMS();

  const inquiry = inquiries.find((i) => i.id === id);

  const [noteInput, setNoteInput] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  useEffect(() => {
    if (inquiry && !inquiry.is_read) {
      markInquiryRead(inquiry.id, true);
    }
  }, [inquiry, markInquiryRead]);

  if (!inquiry) {
    return (
      <div className="text-center py-20 space-y-4">
        <h3 className="font-heading font-bold text-white text-lg">Inquiry Not Found</h3>
        <Link to="/super-admin/inquiries" className="text-xs text-violet-400 hover:underline">
          ← Back to all inquiries
        </Link>
      </div>
    );
  }

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    await addInquiryNote(inquiry.id, noteInput.trim());
    setNoteInput('');
  };

  const handleDelete = async () => {
    if (confirm(`Permanently delete inquiry from ${inquiry.name}?`)) {
      await deleteInquiry(inquiry.id);
      navigate('/super-admin/inquiries');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Back & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to="/super-admin/inquiries"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Client Inquiries</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Inquiry</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Client Details & Message */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/95 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">
                  ID: {inquiry.id} • Submitted on {new Date(inquiry.created_at).toLocaleString()}
                </span>
                <h2 className="font-heading font-extrabold text-2xl text-white flex items-center gap-3">
                  <span>{inquiry.name}</span>
                </h2>
                {inquiry.company && (
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-violet-400" />
                    <span>Company: <strong className="text-white">{inquiry.company}</strong></span>
                  </p>
                )}
              </div>

              {/* Status Selector */}
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Deal Pipeline Status
                </label>
                <select
                  value={inquiry.status}
                  onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                  className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-violet-300 focus:outline-none focus:border-violet-500"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Project Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Interested Service</span>
                <p className="text-xs font-bold text-white">{inquiry.service}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Budget Range</span>
                <p className="text-xs font-bold text-white">{inquiry.budget || 'Custom / Flexible'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Priority</span>
                <select
                  value={inquiry.priority || 'medium'}
                  onChange={(e) => updateInquiryPriority(inquiry.id, e.target.value)}
                  className="bg-transparent text-xs font-bold text-orange-400 focus:outline-none capitalize"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent 🔥</option>
                </select>
              </div>
            </div>

            {/* Project Description */}
            <div className="space-y-3 pt-2">
              <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider text-slate-400">
                Project Requirements & Description
              </h4>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                {inquiry.description}
              </div>
            </div>
          </div>

          {/* Internal Notes & Timeline */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/95 border border-slate-800 space-y-6">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <span>Internal Admin Notes & Activity</span>
            </h3>

            {/* Note input */}
            <form onSubmit={handleAddNote} className="flex items-center gap-3">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add private note (e.g. Sent pricing deck via WhatsApp, scheduled call for Friday)..."
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-500/25 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </button>
            </form>

            {/* Notes list */}
            <div className="space-y-3">
              {!inquiry.notes || inquiry.notes.length === 0 ? (
                <p className="text-xs text-slate-500">No internal notes added yet.</p>
              ) : (
                inquiry.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span className="text-violet-400 font-semibold">{note.author}</span>
                      <span>{new Date(note.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Communication Triggers */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0B1020]/95 border border-slate-800 space-y-5">
            <h3 className="font-heading font-bold text-base text-white">
              Direct Client Actions
            </h3>

            <div className="space-y-3">
              {inquiry.email && (
                <a
                  href={`mailto:${inquiry.email}?subject=Regarding your inquiry at iWAAt - ${inquiry.service}`}
                  className="w-full py-3 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Client ({inquiry.email})</span>
                </a>
              )}

              {inquiry.phone && (
                <a
                  href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inquiry.name)},%20thank%20you%20for%20reaching%20out%20to%20iWAAt%20Digital%20Services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Client</span>
                </a>
              )}

              {inquiry.phone && (
                <a
                  href={`tel:${inquiry.phone}`}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-violet-400" />
                  <span>Call {inquiry.phone}</span>
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-3 text-xs text-slate-400">
              <p>
                <strong>Client:</strong> {inquiry.name}
              </p>
              <p>
                <strong>Email:</strong> {inquiry.email}
              </p>
              <p>
                <strong>Phone:</strong> {inquiry.phone || 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
