import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './cms/authContext';
import { CMSProvider } from './cms/cmsContext';
import { RootLayout } from './layouts/RootLayout';

// Public Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Projects } from './pages/Projects';
import { About } from './pages/About';
import { Process } from './pages/Process';
import { Contact } from './pages/Contact';
import { Events } from './pages/Events';
import { NotFound } from './pages/NotFound';

// Super Admin CMS Pages & Layout
import { AdminGuard } from './admin/components/AdminGuard';
import { AdminLayout } from './admin/layouts/AdminLayout';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { ProjectsManager } from './admin/pages/ProjectsManager';
import { ProjectEditor } from './admin/pages/ProjectEditor';
import { CategoriesManager } from './admin/pages/CategoriesManager';
import { ServicesManager } from './admin/pages/ServicesManager';
import { TestimonialsManager } from './admin/pages/TestimonialsManager';
import { EventsManager } from './admin/pages/EventsManager';
import { MediaLibrary } from './admin/pages/MediaLibrary';
import { InquiriesManager } from './admin/pages/InquiriesManager';
import { InquiryDetailPage } from './admin/pages/InquiryDetailPage';
import { ContactSettings } from './admin/pages/ContactSettings';
import { WebsiteSettings } from './admin/pages/WebsiteSettings';
import { AuditActivity } from './admin/pages/AuditActivity';
import { SEOHealth } from './admin/pages/SEOHealth';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CMSProvider>
          <Router>
            <Routes>
              {/* Public Website Routes */}
              <Route path="/" element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="services" element={<Services />} />
                <Route path="services/:slug" element={<ServiceDetail />} />
                <Route path="projects" element={<Projects />} />
                <Route path="about" element={<About />} />
                <Route path="process" element={<Process />} />
                <Route path="events" element={<Events />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Super Admin Login (Unprotected) */}
              <Route path="/super-admin/login" element={<AdminLogin />} />

              {/* Super Admin Protected Portal Routes */}
              <Route
                path="/super-admin"
                element={
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="projects/new" element={<ProjectEditor />} />
                <Route path="projects/edit/:id" element={<ProjectEditor />} />
                <Route path="categories" element={<CategoriesManager />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="events" element={<EventsManager />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="inquiries" element={<InquiriesManager />} />
                <Route path="inquiries/:id" element={<InquiryDetailPage />} />
                <Route path="contact" element={<ContactSettings />} />
                <Route path="settings" element={<WebsiteSettings />} />
                <Route path="seo-health" element={<SEOHealth />} />
                <Route path="activity" element={<AuditActivity />} />
              </Route>
            </Routes>
          </Router>
        </CMSProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
