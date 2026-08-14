import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';
import { Link } from 'react-router-dom';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationRead, clearAllNotifications } = useCMS();
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-violet-600 text-white text-[11px] font-bold flex items-center justify-center animate-pulse shadow-md shadow-violet-500/50">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-[#0B1020]/95 backdrop-blur-2xl border border-slate-800 shadow-2xl shadow-violet-500/10 z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h4 className="font-heading font-bold text-sm text-white">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300">
                  {unreadCount} new
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-[11px] text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 transition-colors ${
                    n.is_read ? 'bg-transparent opacity-75' : 'bg-violet-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white leading-snug">{n.title}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {!n.is_read && (
                      <button
                        onClick={() => markNotificationRead(n.id)}
                        className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {n.link && (
                    <Link
                      to={n.link}
                      onClick={() => {
                        markNotificationRead(n.id);
                        setIsOpen(false);
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
