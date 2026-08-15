import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Search,
  Filter,
  Eye,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';

const STATUS_CONFIG = {
  new: { label: 'New', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  contacted: { label: 'Contacted', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  in_discussion: { label: 'In Discussion', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  proposal_sent: { label: 'Proposal Sent', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  approved: { label: 'Approved', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  in_progress: { label: 'In Progress', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  completed: { label: 'Completed', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  archived: { label: 'Archived', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
};

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: 'bg-red-500 text-white' },
  high: { label: 'High', color: 'bg-orange-500 text-white' },
  medium: { label: 'Medium', color: 'bg-slate-800 text-slate-300' },
  low: { label: 'Low', color: 'bg-slate-800 text-slate-400' },
};

export const InquiriesManager = () => {
  const { inquiries, updateInquiryStatus, markInquiryRead, deleteInquiry } = useCMS();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      (inq.company && inq.company.toLowerCase().includes(search.toLowerCase())) ||
      inq.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || inq.status === statusFilter;

    const matchesService =
      serviceFilter === 'All' || inq.service === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-white">
            Client Inquiries & CRM
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Manage incoming consultation requests, proposals, client communication, and deal pipelines.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-[#0B1020]/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client, email, company..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="All">All Statuses</option>
              {Object.keys(STATUS_CONFIG).map((st) => (
                <option key={st} value={st}>
                  {STATUS_CONFIG[st].label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries Table / Cards */}
      <div className="space-y-3">
        {filteredInquiries.map((inq) => {
          const statusBadge = STATUS_CONFIG[inq.status] || STATUS_CONFIG.new;
          const priorityBadge = PRIORITY_CONFIG[inq.priority] || PRIORITY_CONFIG.medium;

          return (
            <div
              key={inq.id}
              className={`p-5 rounded-3xl bg-[#0B1020]/90 border transition-all ${
                !inq.is_read
                  ? 'border-violet-500/50 shadow-lg shadow-violet-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Left Client Overview */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      to={`/super-admin/inquiries/${inq.id}`}
                      onClick={() => markInquiryRead(inq.id, true)}
                      className="font-heading font-extrabold text-base text-white hover:text-violet-400 transition-colors flex items-center gap-2"
                    >
                      <span>{inq.name}</span>
                      {!inq.is_read && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      )}
                    </Link>

                    {inq.company && (
                      <span className="text-xs text-slate-400 font-medium">
                        at <span className="text-slate-200">{inq.company}</span>
                      </span>
                    )}

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>

                    {inq.priority === 'urgent' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                        Urgent
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {inq.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="text-violet-400 font-semibold">{inq.service}</span>
                    {inq.budget && <span>Budget: <strong className="text-slate-300">{inq.budget}</strong></span>}
                    <span>Submitted: {new Date(inq.created_at).toLocaleDateString()}</span>
                    {inq.notes?.length > 0 && (
                      <span className="text-slate-400">📝 {inq.notes.length} internal notes</span>
                    )}
                  </div>
                </div>

                {/* Right Action Quick Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {inq.email && (
                    <a
                      href={`mailto:${inq.email}?subject=iWAAT Project Consultation - ${inq.name}`}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-violet-400 hover:bg-slate-800 transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}

                  {inq.phone && (
                    <a
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                      title="WhatsApp Client"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  )}

                  {/* Status Dropdown Quick Change */}
                  <select
                    value={inq.status}
                    onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    {Object.keys(STATUS_CONFIG).map((st) => (
                      <option key={st} value={st}>
                        {STATUS_CONFIG[st].label}
                      </option>
                    ))}
                  </select>

                  <Link
                    to={`/super-admin/inquiries/${inq.id}`}
                    onClick={() => markInquiryRead(inq.id, true)}
                    className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-violet-500/20"
                  >
                    <span>Open CRM View</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => deleteInquiry(inq.id)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredInquiries.length === 0 && (
        <div className="text-center py-16 p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-3">
          <Inbox className="w-8 h-8 text-violet-400 mx-auto" />
          <h3 className="font-heading font-bold text-white text-base">No Inquiries Found</h3>
          <p className="text-xs text-slate-400">
            Incoming inquiries from the public website contact form will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
};
