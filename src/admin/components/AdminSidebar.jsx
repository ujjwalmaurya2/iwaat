import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Tags,
  Wrench,
  MessageSquareQuote,
  Calendar,
  Image as ImageIcon,
  Inbox,
  PhoneCall,
  Settings,
  Globe,
  Activity,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../cms/authContext';
import { useCMS } from '../../cms/cmsContext';

export const AdminSidebar = ({ mobileOpen, closeMobile }) => {
  const { user, logout, isSupabase } = useAuth();
  const { projects, inquiries } = useCMS();

  const unreadInquiries = inquiries.filter((i) => !i.is_read || i.status === 'new').length;

  const navItems = [
    { label: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
    { label: 'Projects', path: '/super-admin/projects', icon: FolderGit2, badge: projects.length },
    { label: 'Categories', path: '/super-admin/categories', icon: Tags },
    { label: 'Services', path: '/super-admin/services', icon: Wrench },
    { label: 'Testimonials', path: '/super-admin/testimonials', icon: MessageSquareQuote },
    { label: 'Events & Gallery', path: '/super-admin/events', icon: Calendar },
    { label: 'Media Library', path: '/super-admin/media', icon: ImageIcon },
    { label: 'Client Inquiries', path: '/super-admin/inquiries', icon: Inbox, badge: unreadInquiries, badgeColor: 'bg-violet-600' },
    { label: 'Contact Settings', path: '/super-admin/contact', icon: PhoneCall },
    { label: 'Website Settings', path: '/super-admin/settings', icon: Settings },
    { label: 'SEO & Visibility', path: '/super-admin/seo-health', icon: Globe },
    { label: 'Audit Activity', path: '/super-admin/activity', icon: Activity },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-[#070A14] border-r border-slate-800/80 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/super-admin" onClick={closeMobile} className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 relative flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="iWAAT Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(168,85,247,0.35)]"
                />
              </div>
              <div>
                <span className="font-brand font-semibold text-lg tracking-tight text-white flex items-center gap-1">
                  iWAAT <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono">CMS</span>
                </span>
                <span className="text-[11px] text-slate-400 block font-medium">Super Admin Portal</span>
              </div>
            </Link>

            <button
              onClick={closeMobile}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/super-admin'}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#0B1020]/60">
          {/* Environment Status */}
          <div className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSupabase ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isSupabase ? 'Supabase Cloud' : 'Local Persistence'}</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">v2.0</span>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-2.5 truncate">
              {user?.user_metadata?.avatar_url || user?.avatar_url ? (
                <img
                  src={user?.user_metadata?.avatar_url || user?.avatar_url}
                  alt={user?.email || 'User'}
                  className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-violet-600/30 text-violet-300 font-bold text-xs flex items-center justify-center shrink-0 border border-violet-500/40">
                  {(user?.email || 'A')[0].toUpperCase()}
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {user?.user_metadata?.full_name || user?.full_name || user?.email || 'Super Admin'}
                </p>
                <span className="text-[10px] text-violet-400 font-mono capitalize">
                  {user?.role || 'super_admin'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
