import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './cms/authContext';
import { CMSProvider } from './cms/cmsContext';
import { RootLayout } from './layouts/RootLayout';

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
  </div>
);

// Public Pages (Lazy Loaded for Sub-Second Initial Bundle)
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail').then(m => ({ default: m.ServiceDetail })));
const WebDevelopmentPrayagraj = lazy(() => import('./pages/WebDevelopmentPrayagraj').then(m => ({ default: m.WebDevelopmentPrayagraj })));
const Projects = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Process = lazy(() => import('./pages/Process').then(m => ({ default: m.Process })));
const Resources = lazy(() => import('./pages/Resources').then(m => ({ default: m.Resources })));
const ResourceArticle = lazy(() => import('./pages/ResourceArticle').then(m => ({ default: m.ResourceArticle })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Events = lazy(() => import('./pages/Events').then(m => ({ default: m.Events })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Super Admin CMS Pages & Layout (Lazy Loaded)
const AdminGuard = lazy(() => import('./admin/components/AdminGuard').then(m => ({ default: m.AdminGuard })));
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ProjectsManager = lazy(() => import('./admin/pages/ProjectsManager').then(m => ({ default: m.ProjectsManager })));
const ProjectEditor = lazy(() => import('./admin/pages/ProjectEditor').then(m => ({ default: m.ProjectEditor })));
const CategoriesManager = lazy(() => import('./admin/pages/CategoriesManager').then(m => ({ default: m.CategoriesManager })));
const ServicesManager = lazy(() => import('./admin/pages/ServicesManager').then(m => ({ default: m.ServicesManager })));
const TestimonialsManager = lazy(() => import('./admin/pages/TestimonialsManager').then(m => ({ default: m.TestimonialsManager })));
const EventsManager = lazy(() => import('./admin/pages/EventsManager').then(m => ({ default: m.EventsManager })));
const MediaLibrary = lazy(() => import('./admin/pages/MediaLibrary').then(m => ({ default: m.MediaLibrary })));
const InquiriesManager = lazy(() => import('./admin/pages/InquiriesManager').then(m => ({ default: m.InquiriesManager })));
const InquiryDetailPage = lazy(() => import('./admin/pages/InquiryDetailPage').then(m => ({ default: m.InquiryDetailPage })));
const ContactSettings = lazy(() => import('./admin/pages/ContactSettings').then(m => ({ default: m.ContactSettings })));
const WebsiteSettings = lazy(() => import('./admin/pages/WebsiteSettings').then(m => ({ default: m.WebsiteSettings })));
const AuditActivity = lazy(() => import('./admin/pages/AuditActivity').then(m => ({ default: m.AuditActivity })));
const SEOHealth = lazy(() => import('./admin/pages/SEOHealth').then(m => ({ default: m.SEOHealth })));

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CMSProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Website Routes */}
                <Route path="/" element={<RootLayout />}>
                  <Route index element={<Home />} />
                  <Route path="services" element={<Services />} />
                  <Route path="services/:slug" element={<ServiceDetail />} />
                  <Route path="web-development-prayagraj" element={<WebDevelopmentPrayagraj />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="about" element={<About />} />
                  <Route path="process" element={<Process />} />
                  <Route path="resources" element={<Resources />} />
                  <Route path="resources/:slug" element={<ResourceArticle />} />
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
            </Suspense>
          </Router>
        </CMSProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
