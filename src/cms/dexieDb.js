import Dexie from 'dexie';
import initialProjects from '../data/projects.json';
import initialServices from '../data/services.json';
import initialTestimonials from '../data/testimonials.json';
import initialCompany from '../data/company.json';
import { INDUSTRY_CATEGORIES } from '../data/industryCategories';

export const db = new Dexie('iwaat_cms_db');

db.version(1).stores({
  projects: 'id, title, category, category_slug, status, featured, display_order, created_at',
  categories: 'id, name, slug, display_order',
  services: 'id, title, order_index, status',
  testimonials: 'id, name, featured, status, display_order',
  events: 'id, title, slug, event_date, status, display_order',
  inquiries: 'id, email, service, status, priority, is_read, created_at',
  contact_settings: 'id',
  website_settings: 'id',
  media_assets: 'id, name, category, created_at',
  notifications: 'id, type, is_read, created_at',
  audit_logs: 'id, entity, created_at'
});

// Initial seed function to migrate existing static content
export async function seedInitialDataIfNeeded() {
  try {
    // 1. Projects - Ensure all standard static projects exist
    const categoryMap = {
      'Healthcare': 'Healthcare',
      'NGO': 'NGO & Nonprofit',
      'Photography': 'Photography',
      'Retail': 'Retail',
      'Fitness': 'Sports & Fitness',
    };

    const formattedProjects = initialProjects.map((p, idx) => {
      const category = categoryMap[p.category] || p.category || 'Healthcare';
      return {
        id: p.id || `proj-${idx + 1}`,
        title: p.title,
        slug: p.id,
        category,
        category_slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        url: p.url || '',
        tagline: p.tagline || '',
        description: p.description || '',
        long_description: p.longDescription || p.description || '',
        image: p.image,
        preview_status: 'ready',
        preview_source: 'original',
        preview_updated_at: new Date().toISOString(),
        logo: '',
        featured: p.featured ?? true,
        status: 'published',
        start_date: '',
        completion_date: '2026',
        display_order: idx + 1,
        stats: p.stats || [],
        technologies: p.technologies || [],
        highlights: p.highlights || [],
        client_name: p.title.split(' ')[0],
        challenge: '',
        solution: '',
        results: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    // Check which projects are already in IndexedDB
    for (const proj of formattedProjects) {
      const exists = await db.projects.get(proj.id);
      if (!exists) {
        await db.projects.put(proj);
      }
    }

    // 2. Categories (39 Standard Industry Categories)
    await db.categories.bulkPut(INDUSTRY_CATEGORIES);

      // 3. Services
      const formattedServices = initialServices.map((s, idx) => ({
        id: s.id || `service-${idx + 1}`,
        title: s.title,
        subtitle: s.tagline || s.title,
        description: s.description,
        icon: s.icon || 'Zap',
        popular: s.popular || false,
        order_index: idx,
        features: s.features || [],
        deliverables: s.deliverables || [],
        stats: s.stats || '',
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      await db.services.bulkPut(formattedServices);

      // 4. Testimonials
      const formattedTestimonials = initialTestimonials.map((t, idx) => ({
        id: t.id || `test-${idx + 1}`,
        name: t.name,
        role: t.role || '',
        company: t.company || '',
        content: t.content || t.quote,
        rating: t.rating || 5,
        image: t.image || t.avatar || '',
        project_id: t.projectId || '',
        project_title: t.projectTitle || '',
        featured: t.featured ?? true,
        status: 'published',
        display_order: idx,
        created_at: new Date().toISOString()
      }));
      await db.testimonials.bulkPut(formattedTestimonials);

      // 5. Events / Gallery Seed
      const initialEvents = [
        {
          id: 'event-team-summit-2026',
          title: 'iWAAT Global Strategy & Innovation Meetup 2026',
          slug: 'team-meetup-2026',
          description: 'Annual digital innovation summit gathering our engineering, UI/UX, and marketing teams to showcase next-generation client architectures.',
          event_date: '2026-05-18',
          location: 'Global Hub / New York & Virtual',
          cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
              caption: 'Keynote presentation on AI and React 19 frameworks'
            },
            {
              url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
              caption: 'Collaborative product architecture workshop'
            },
            {
              url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
              caption: 'Design sprints and branding showcase'
            }
          ],
          status: 'published',
          display_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      await db.events.bulkPut(initialEvents);

      // 6. Contact Settings
      const initialContactSettings = {
        id: 'default',
        email: initialCompany.contactInfo?.email || 'hello@iwaat.com',
        secondary_email: 'support@iwaat.com',
        phone: initialCompany.contactInfo?.phone || '+1 (800) 492-2800',
        secondary_phone: '+1 (800) 492-2801',
        whatsapp: initialCompany.contactInfo?.whatsapp || '+18004922800',
        location: initialCompany.contactInfo?.location || 'Global / Remote Digital Agency (US & India Hubs)',
        working_hours: initialCompany.contactInfo?.workingHours || 'Mon - Sat: 9:00 AM - 8:00 PM EST (24/7 Support)',
        address: '750 Lexington Ave, Suite 1400',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        socials: initialCompany.contactInfo?.socials || {
          linkedin: 'https://linkedin.com/company/iwaat',
          github: 'https://github.com/iwaat-agency',
          twitter: 'https://twitter.com/iwaat_digital',
          instagram: 'https://instagram.com/iwaat.digital'
        },
        updated_at: new Date().toISOString()
      };
      await db.contact_settings.put(initialContactSettings);

      // 7. Website Settings
      const initialWebsiteSettings = {
        id: 'default',
        name: initialCompany.name || 'iWAAt',
        tagline: initialCompany.tagline || 'We Build. We Scale. We Market.',
        short_description: initialCompany.shortDescription || 'iWAAt is a multidisciplinary digital services team.',
        about_description: initialCompany.fullStory || '',
        seo_title: 'iWAAt — Modern Digital Services, Web Development & Growth Agency',
        seo_description: 'We engineer high-performance web applications, bespoke software, luxury UI/UX design, and ROI-driven marketing campaigns.',
        seo_keywords: 'web development, react, custom software, digital marketing, seo, ui ux design, branding',
        og_image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
        copyright_text: '© 2026 iWAAt Digital Services. All rights reserved.',
        updated_at: new Date().toISOString()
      };
      await db.website_settings.put(initialWebsiteSettings);

      // 8. Sample System Notification
      await db.notifications.put({
        id: 'notif-welcome',
        title: 'Super Admin Portal Activated',
        message: 'Welcome to the iWAAT Dynamic Content Management System. All live projects, services, and inquiries are active.',
        type: 'system',
        is_read: false,
        link: '/super-admin',
        created_at: new Date().toISOString()
      });

      // 9. Initial Audit Log
      await db.audit_logs.put({
        id: 'audit-init',
        admin_email: 'superadmin@iwaat.com',
        action: 'INITIALIZE_CMS',
        entity: 'SYSTEM',
        entity_id: 'iwaat_core',
        summary: 'Imported and seeded initial static JSON content into the dynamic CMS database.',
        created_at: new Date().toISOString()
      });

      console.info('[iWAAT CMS] Database successfully seeded with existing data.');
  } catch (error) {
    console.error('[iWAAT CMS] Seed error:', error);
  }
}
