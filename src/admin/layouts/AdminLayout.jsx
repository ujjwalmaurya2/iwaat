import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { Menu, Globe, Sparkles, ExternalLink } from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';

export const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Dynamic breadcrumb label
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/super-admin') return 'Dashboard Overview';
    if (path.includes('/projects/new')) return 'Create New Project';
    if (path.includes('/projects/edit')) return 'Edit Project';
    if (path.includes('/projects')) return 'Project Management & Previews';
    if (path.includes('/categories')) return 'Project Categories';
    if (path.includes('/services')) return 'Services Management';
    if (path.includes('/testimonials')) return 'Client Testimonials';
    if (path.includes('/events')) return 'Events & Gallery Albums';
    if (path.includes('/media')) return 'Media Library';
    if (path.includes('/inquiries/')) return 'Inquiry Details';
    if (path.includes('/inquiries')) return 'Client Project Inquiries CRM';
    if (path.includes('/contact')) return 'Public Contact Settings';
    if (path.includes('/settings')) return 'Website & SEO Settings';
    if (path.includes('/activity')) return 'Admin Audit Activity';
    return 'Super Admin';
  };

  return (
    <div className="min-h-screen bg-[#070A14] text-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <AdminSidebar mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 bg-[#070A14]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-2xl bg-slate-900 text-slate-300 border border-slate-800"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center gap-2">
                <span>{getPageTitle()}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Website Link */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-violet-400" />
              <span>View Public Site</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </Link>

            <ThemeToggle />
            <NotificationDropdown />
          </div>
        </header>

        {/* Dynamic Page Content Outlet */}
        <main className="p-4 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
