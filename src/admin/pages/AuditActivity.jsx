import React, { useState } from 'react';
import { Activity, Search, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';

export const AuditActivity = () => {
  const { auditLogs } = useCMS();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    return (
      (log.action || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.entity || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.summary || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.admin_email || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-white">Super Admin Audit Activity</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Immutable tracking log of administrative CRUD changes, project publishes, and client CRM actions.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="p-4 rounded-3xl bg-[#0B1020]/90 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, entity, summary..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          {filteredLogs.length} Events Recorded
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-4">
        <div className="divide-y divide-slate-800/80">
          {filteredLogs.map((log) => (
            <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono font-bold text-violet-300 border border-slate-800 uppercase">
                      {log.action}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      [{log.entity}]
                    </span>
                    <span className="text-[11px] text-slate-500">by {log.admin_email}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{log.summary}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 sm:justify-end">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                </span>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              No audit logs matching query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
