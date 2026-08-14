import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderGit2,
  Inbox,
  Calendar,
  Sparkles,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Wrench,
  MessageSquareQuote,
  Eye,
  Mail,
} from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';

export const AdminDashboard = () => {
  const { projects, inquiries, events, services, testimonials, auditLogs } = useCMS();

  const publishedProjects = projects.filter((p) => p.status === 'published');
  const draftProjects = projects.filter((p) => p.status === 'draft');
  const newInquiries = inquiries.filter((i) => i.status === 'new' || !i.is_read);

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      subValue: `${publishedProjects.length} published • ${draftProjects.length} draft`,
      icon: FolderGit2,
      color: 'from-violet-600 to-indigo-600',
      link: '/super-admin/projects',
    },
    {
      title: 'Client Inquiries',
      value: inquiries.length,
      subValue: `${newInquiries.length} unread / new proposals`,
      icon: Inbox,
      color: 'from-orange-500 to-pink-500',
      link: '/super-admin/inquiries',
    },
    {
      title: 'Events & Gallery',
      value: events.length,
      subValue: 'Team meetups & project launches',
      icon: Calendar,
      color: 'from-emerald-500 to-teal-600',
      link: '/super-admin/events',
    },
    {
      title: 'Services & Testimonials',
      value: `${services.length} / ${testimonials.length}`,
      subValue: 'Active dynamic capabilities',
      icon: Sparkles,
      color: 'from-cyan-500 to-blue-600',
      link: '/super-admin/services',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-violet-950 via-[#0B1020] to-slate-900 border border-violet-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Super Admin Master Control</span>
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              iWAAt Content & Growth Hub
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Create and publish projects, generate live website screenshots, manage client inquiries, and customize all agency information in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/super-admin/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </Link>

            <Link
              to="/super-admin/inquiries"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            >
              <Inbox className="w-4 h-4 text-orange-400" />
              <span>View Inquiries</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link key={idx} to={stat.link}>
              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-[#0B1020]/80 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4 glow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${stat.color} p-2 text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-extrabold text-3xl text-white">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{stat.subValue}</p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* 2-Column Section: Recent Projects & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Recent Projects */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-violet-400" />
              <span>Recent Projects</span>
            </h3>
            <Link
              to="/super-admin/projects"
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-2xl bg-[#0B1020]/90 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="w-14 h-10 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-800">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <h4 className="font-heading font-bold text-sm text-white truncate">
                      {project.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {project.category} • {project.technologies?.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      project.status === 'published'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {project.status}
                  </span>
                  <Link
                    to={`/super-admin/projects/edit/${project.id}`}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Recent Inquiries */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-orange-400" />
              <span>Incoming Inquiries</span>
            </h3>
            <Link
              to="/super-admin/inquiries"
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <span>View All ({inquiries.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0B1020]/90 border border-slate-800 text-center text-slate-500 text-xs">
                No inquiries received yet.
              </div>
            ) : (
              inquiries.slice(0, 4).map((inq) => (
                <Link
                  key={inq.id}
                  to={`/super-admin/inquiries/${inq.id}`}
                  className="block p-4 rounded-2xl bg-[#0B1020]/90 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-white group-hover:text-violet-400 transition-colors">
                        {inq.name}
                      </span>
                      {inq.status === 'new' && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                    {inq.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                    <span className="text-violet-400 font-medium">{inq.service}</span>
                    <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {inq.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Admin Audit Activity Timeline */}
      <div className="p-6 rounded-3xl bg-[#0B1020]/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-400" />
            <span>Recent Admin Activity</span>
          </h3>
          <Link
            to="/super-admin/activity"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Full Audit Log →
          </Link>
        </div>

        <div className="divide-y divide-slate-800/60">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono font-bold text-violet-300 border border-slate-800">
                  {log.action}
                </span>
                <span className="text-slate-300">{log.summary}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono shrink-0">
                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
