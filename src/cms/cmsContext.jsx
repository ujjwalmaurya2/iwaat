import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, seedInitialDataIfNeeded } from './dexieDb';
import { supabase, isSupabaseConfigured, uploadToSupabaseStorage } from './supabase';
import { optimizeImage } from './imageOptimizer';
import { useAuth } from './authContext';

const CMSContext = createContext(null);

export const CMSProvider = ({ children }) => {
  const { user, isAdmin } = useAuth();

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [events, setEvents] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [contactSettings, setContactSettings] = useState(null);
  const [websiteSettings, setWebsiteSettings] = useState(null);
  const [mediaAssets, setMediaAssets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to log audit actions
  const logAudit = useCallback(async (action, entity, entityId, summary) => {
    const logItem = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      admin_email: user?.email || 'admin@iwaat.com',
      action,
      entity,
      entity_id: entityId,
      summary,
      created_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured() && supabase && isAdmin) {
        await supabase.from('audit_logs').insert([logItem]);
      }
      await db.audit_logs.put(logItem);
      setAuditLogs((prev) => [logItem, ...prev]);
    } catch (err) {
      console.warn('[CMS Audit Log] Error logging audit action:', err);
    }
  }, [user, isAdmin]);

  // Load all CMS datasets from Supabase or Dexie
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await seedInitialDataIfNeeded();

      if (isSupabaseConfigured() && supabase) {
        const [
          { data: projData },
          { data: catData },
          { data: servData },
          { data: testData },
          { data: evtData },
          { data: inqData },
          { data: contactData },
          { data: siteData },
          { data: mediaData },
          { data: notifData },
          { data: auditData },
        ] = await Promise.all([
          supabase.from('projects').select('*').order('display_order', { ascending: true }),
          supabase.from('categories').select('*').order('display_order', { ascending: true }),
          supabase.from('services').select('*').order('order_index', { ascending: true }),
          supabase.from('testimonials').select('*').order('display_order', { ascending: true }),
          supabase.from('events').select('*').order('display_order', { ascending: true }),
          isAdmin ? supabase.from('inquiries').select('*').order('created_at', { ascending: false }) : Promise.resolve({ data: [] }),
          supabase.from('contact_settings').select('*').limit(1).maybeSingle(),
          supabase.from('website_settings').select('*').limit(1).maybeSingle(),
          supabase.from('media_assets').select('*').order('created_at', { ascending: false }),
          isAdmin ? supabase.from('notifications').select('*').order('created_at', { ascending: false }) : Promise.resolve({ data: [] }),
          isAdmin ? supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50) : Promise.resolve({ data: [] }),
        ]);

        if (projData && projData.length > 0) setProjects(projData);
        else setProjects(await db.projects.toArray());

        if (catData && catData.length > 0) setCategories(catData);
        else setCategories(await db.categories.toArray());

        if (servData && servData.length > 0) setServices(servData);
        else setServices(await db.services.toArray());

        if (testData && testData.length > 0) setTestimonials(testData);
        else setTestimonials(await db.testimonials.toArray());

        if (evtData && evtData.length > 0) setEvents(evtData);
        else setEvents(await db.events.toArray());

        if (inqData && inqData.length > 0) setInquiries(inqData);
        else setInquiries(await db.inquiries.orderBy('created_at').reverse().toArray());

        const localContact = await db.contact_settings.get('default');
        if (contactData) setContactSettings(contactData);
        else if (localContact) setContactSettings(localContact);
        else setContactSettings({
          id: 'default',
          email: 'hello@iwaat.com',
          secondary_email: 'support@iwaat.com',
          phone: '+1 (800) 492-2800',
          secondary_phone: '+1 (800) 492-2801',
          whatsapp: '+18004922800',
          location: 'Global / Remote Digital Agency (US & India Hubs)',
          working_hours: 'Mon - Sat: 9:00 AM - 8:00 PM EST (24/7 Support)',
          address: '750 Lexington Ave, Suite 1400',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          socials: { linkedin: 'https://linkedin.com/company/iwaat', twitter: 'https://twitter.com/iwaat', instagram: 'https://instagram.com/iwaat' }
        });

        const localSite = await db.website_settings.get('default');
        if (siteData) setWebsiteSettings(siteData);
        else if (localSite) setWebsiteSettings(localSite);
        else setWebsiteSettings({
          id: 'default',
          site_name: 'iWAAT Agency',
          tagline: 'Engineering High-Impact Digital Solutions & Scalable Web Applications',
          description: 'Premier digital agency specializing in custom web platforms, e-commerce, cloud infrastructure, and enterprise digital solutions.',
          primary_email: 'hello@iwaat.com',
          hero_title: 'Engineering Digital Excellence for Modern Global Brands',
          hero_subtitle: 'We architect bespoke digital products, responsive web apps, and secure high-performance platforms.'
        });

        if (mediaData && mediaData.length > 0) setMediaAssets(mediaData);
        else setMediaAssets(await db.media_assets.toArray());

        if (notifData && notifData.length > 0) setNotifications(notifData);
        else setNotifications(await db.notifications.orderBy('created_at').reverse().toArray());

        if (auditData && auditData.length > 0) setAuditLogs(auditData);
        else setAuditLogs(await db.audit_logs.orderBy('created_at').reverse().limit(50).toArray());
      } else {
        // Fallback / Offline / Dev mode using Dexie
        const [
          proj,
          cat,
          serv,
          test,
          evt,
          inq,
          contact,
          site,
          media,
          notifs,
          audits,
        ] = await Promise.all([
          db.projects.toArray(),
          db.categories.toArray(),
          db.services.toArray(),
          db.testimonials.toArray(),
          db.events.toArray(),
          db.inquiries.orderBy('created_at').reverse().toArray(),
          db.contact_settings.get('default'),
          db.website_settings.get('default'),
          db.media_assets.orderBy('created_at').reverse().toArray(),
          db.notifications.orderBy('created_at').reverse().toArray(),
          db.audit_logs.orderBy('created_at').reverse().limit(50).toArray(),
        ]);

        setProjects(proj);
        setCategories(cat);
        setServices(serv);
        setTestimonials(test);
        setEvents(evt);
        setInquiries(inq);
        setContactSettings(contact);
        setWebsiteSettings(site);
        setMediaAssets(media);
        setNotifications(notifs);
        setAuditLogs(audits);
      }
    } catch (err) {
      console.error('[CMS Context] Error refreshing CMS data:', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Helper to sanitize project payload for Supabase & Dexie
  const sanitizeProjectPayload = (data) => {
    const title = data.title || 'Untitled Project';
    const slug = data.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `proj-${Date.now()}`;
    const category = data.category || 'Healthcare';
    const category_slug = data.category_slug || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    return {
      id: data.id || `proj-${Date.now()}`,
      title,
      slug,
      tagline: data.tagline || '',
      description: data.description || '',
      long_description: data.long_description || data.description || '',
      category,
      category_slug,
      client_name: data.client_name || title.split(' ')[0] || 'Client',
      url: data.url || '',
      image: data.image || '',
      preview_status: data.preview_status || 'ready',
      preview_source: data.preview_source || 'auto',
      preview_updated_at: data.preview_updated_at || new Date().toISOString(),
      logo: data.logo || '',
      featured: Boolean(data.featured),
      status: data.status || 'published',
      start_date: data.start_date || '',
      completion_date: data.completion_date || '2026',
      display_order: Number(data.display_order) || 0,
      stats: Array.isArray(data.stats) ? data.stats : [],
      technologies: Array.isArray(data.technologies) ? data.technologies : [],
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      challenge: data.challenge || '',
      solution: data.solution || '',
      results: data.results || '',
      created_at: data.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  // ==========================================
  // PROJECTS CRUD
  // ==========================================
  const addProject = async (projectData) => {
    const newProject = sanitizeProjectPayload(projectData);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('projects').insert([newProject]);
        if (error) {
          // If live database schema cache is missing preview columns, retry with core fields
          if (
            error.message?.includes('preview_source') ||
            error.message?.includes('preview_status') ||
            error.message?.includes('preview_updated_at') ||
            error.code === 'PGRST204'
          ) {
            console.warn('[CMS Supabase] Column missing in schema cache, inserting core project payload...', error.message);
            const { preview_source, preview_status, preview_updated_at, ...corePayload } = newProject;
            const { error: coreErr } = await supabase.from('projects').insert([corePayload]);
            if (coreErr) throw coreErr;
          } else {
            throw error;
          }
        }
      } catch (insertErr) {
        console.error('[CMS Supabase] Error adding project to Supabase:', insertErr);
        throw insertErr;
      }
    }
    await db.projects.put(newProject);
    setProjects((prev) => [newProject, ...prev.filter((p) => p.id !== newProject.id)]);
    await logAudit('CREATE', 'PROJECT', newProject.id, `Created project "${newProject.title}"`);
    return newProject;
  };

  const updateProject = async (id, projectData) => {
    const updated = sanitizeProjectPayload({
      ...projectData,
      id,
      updated_at: new Date().toISOString(),
    });

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('projects').update(updated).eq('id', id);
        if (error) {
          // If live database schema cache is missing preview columns, retry with core fields
          if (
            error.message?.includes('preview_source') ||
            error.message?.includes('preview_status') ||
            error.message?.includes('preview_updated_at') ||
            error.code === 'PGRST204'
          ) {
            console.warn('[CMS Supabase] Column missing in schema cache on update, updating core project payload...', error.message);
            const { preview_source, preview_status, preview_updated_at, ...corePayload } = updated;
            const { error: coreErr } = await supabase.from('projects').update(corePayload).eq('id', id);
            if (coreErr) throw coreErr;
          } else {
            throw error;
          }
        }
      } catch (updateErr) {
        console.error('[CMS Supabase] Error updating project in Supabase:', updateErr);
        throw updateErr;
      }
    }
    await db.projects.put(updated);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    await logAudit('UPDATE', 'PROJECT', id, `Updated project "${updated.title || id}"`);
    return updated;
  };

  const deleteProject = async (id) => {
    const existing = projects.find((p) => p.id === id);
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    }
    await db.projects.delete(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await logAudit('DELETE', 'PROJECT', id, `Deleted project "${existing?.title || id}"`);
  };

  const toggleProjectPublish = async (id) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    const nextStatus = project.status === 'published' ? 'draft' : 'published';
    await updateProject(id, { ...project, status: nextStatus });
  };

  const toggleProjectFeatured = async (id) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    await updateProject(id, { ...project, featured: !project.featured });
  };

  // ==========================================
  // CATEGORIES CRUD
  // ==========================================
  const addCategory = async (categoryData) => {
    const slug = (categoryData.slug || categoryData.name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = {
      id: slug,
      name: categoryData.name,
      slug: slug,
      display_order: categories.length,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('categories').insert([newCat]);
      if (error) throw error;
    }
    await db.categories.put(newCat);
    setCategories((prev) => [...prev, newCat]);
    await logAudit('CREATE', 'CATEGORY', newCat.id, `Created category "${newCat.name}"`);
    return newCat;
  };

  const deleteCategory = async (id) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    }
    await db.categories.delete(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await logAudit('DELETE', 'CATEGORY', id, `Deleted category "${id}"`);
  };

  // ==========================================
  // SERVICES CRUD
  // ==========================================
  const addService = async (serviceData) => {
    const newService = {
      ...serviceData,
      id: serviceData.id || `service-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('services').insert([newService]);
      if (error) throw error;
    }
    await db.services.put(newService);
    setServices((prev) => [...prev, newService]);
    await logAudit('CREATE', 'SERVICE', newService.id, `Added service "${newService.title}"`);
    return newService;
  };

  const updateService = async (id, serviceData) => {
    const updated = {
      ...serviceData,
      id,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('services').update(updated).eq('id', id);
      if (error) throw error;
    }
    await db.services.put(updated);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
    await logAudit('UPDATE', 'SERVICE', id, `Updated service "${updated.title || id}"`);
    return updated;
  };

  const deleteService = async (id) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    }
    await db.services.delete(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    await logAudit('DELETE', 'SERVICE', id, `Deleted service "${id}"`);
  };

  // ==========================================
  // TESTIMONIALS CRUD
  // ==========================================
  const addTestimonial = async (testData) => {
    const newTestimonial = {
      ...testData,
      id: testData.id || `testimonial-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('testimonials').insert([newTestimonial]);
      if (error) throw error;
    }
    await db.testimonials.put(newTestimonial);
    setTestimonials((prev) => [newTestimonial, ...prev]);
    await logAudit('CREATE', 'TESTIMONIAL', newTestimonial.id, `Added testimonial for "${newTestimonial.name}"`);
    return newTestimonial;
  };

  const updateTestimonial = async (id, testData) => {
    const updated = { ...testData, id };
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('testimonials').update(updated).eq('id', id);
      if (error) throw error;
    }
    await db.testimonials.put(updated);
    setTestimonials((prev) => prev.map((t) => (t.id === id ? updated : t)));
    await logAudit('UPDATE', 'TESTIMONIAL', id, `Updated testimonial for "${updated.name || id}"`);
    return updated;
  };

  const deleteTestimonial = async (id) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    }
    await db.testimonials.delete(id);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    await logAudit('DELETE', 'TESTIMONIAL', id, `Deleted testimonial "${id}"`);
  };

  // ==========================================
  // EVENTS & GALLERY CRUD
  // ==========================================
  const addEvent = async (eventData) => {
    const newEvent = {
      ...eventData,
      id: eventData.id || `event-${Date.now()}`,
      slug: eventData.slug || (eventData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('events').insert([newEvent]);
      if (error) throw error;
    }
    await db.events.put(newEvent);
    setEvents((prev) => [newEvent, ...prev]);
    await logAudit('CREATE', 'EVENT', newEvent.id, `Published event album "${newEvent.title}"`);
    return newEvent;
  };

  const updateEvent = async (id, eventData) => {
    const updated = {
      ...eventData,
      id,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('events').update(updated).eq('id', id);
      if (error) throw error;
    }
    await db.events.put(updated);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    await logAudit('UPDATE', 'EVENT', id, `Updated event "${updated.title || id}"`);
    return updated;
  };

  const deleteEvent = async (id) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    }
    await db.events.delete(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    await logAudit('DELETE', 'EVENT', id, `Deleted event "${id}"`);
  };

  // ==========================================
  // CLIENT INQUIRIES & NOTIFICATIONS
  // ==========================================
  const submitInquiry = async (inquiryData) => {
    const newInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'new',
      priority: 'medium',
      is_read: false,
      notes: [],
      source: 'website_contact',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newNotification = {
      id: `notif-${Date.now()}`,
      title: `New Inquiry from ${newInquiry.name}`,
      message: `${newInquiry.name} (${newInquiry.company || 'Private'}) requested a consultation for ${newInquiry.service}.`,
      type: 'inquiry',
      is_read: false,
      link: `/super-admin/inquiries/${newInquiry.id}`,
      created_at: new Date().toISOString(),
    };

    // 1. Submit to Supabase if connected
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('inquiries').insert([newInquiry]);
        await supabase.from('notifications').insert([newNotification]);
      } catch (err) {
        console.warn('[CMS Inquiries] Supabase insert failed, storing in local fallback queue...', err);
      }
    }

    // 2. Persist in local Dexie database
    await db.inquiries.put(newInquiry);
    await db.notifications.put(newNotification);

    setInquiries((prev) => [newInquiry, ...prev]);
    setNotifications((prev) => [newNotification, ...prev]);

    return newInquiry;
  };

  const updateInquiryStatus = async (id, status) => {
    const existing = inquiries.find((i) => i.id === id);
    if (!existing) return;
    const updated = {
      ...existing,
      status,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('inquiries').update({ status, updated_at: updated.updated_at }).eq('id', id);
    }
    await db.inquiries.put(updated);
    setInquiries((prev) => prev.map((i) => (i.id === id ? updated : i)));
    await logAudit('UPDATE_STATUS', 'INQUIRY', id, `Changed inquiry status for "${existing.name}" to "${status}"`);
  };

  const updateInquiryPriority = async (id, priority) => {
    const existing = inquiries.find((i) => i.id === id);
    if (!existing) return;
    const updated = {
      ...existing,
      priority,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('inquiries').update({ priority, updated_at: updated.updated_at }).eq('id', id);
    }
    await db.inquiries.put(updated);
    setInquiries((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };

  const addInquiryNote = async (id, noteText) => {
    const existing = inquiries.find((i) => i.id === id);
    if (!existing) return;

    const newNote = {
      id: `note-${Date.now()}`,
      author: user?.email || 'Super Admin',
      text: noteText,
      created_at: new Date().toISOString(),
    };

    const updatedNotes = [...(existing.notes || []), newNote];
    const updated = {
      ...existing,
      notes: updatedNotes,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('inquiries').update({ notes: updatedNotes, updated_at: updated.updated_at }).eq('id', id);
    }
    await db.inquiries.put(updated);
    setInquiries((prev) => prev.map((i) => (i.id === id ? updated : i)));
    await logAudit('ADD_NOTE', 'INQUIRY', id, `Added internal note to inquiry from "${existing.name}"`);
  };

  const markInquiryRead = async (id, isRead = true) => {
    const existing = inquiries.find((i) => i.id === id);
    if (!existing) return;
    const updated = { ...existing, is_read: isRead };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('inquiries').update({ is_read: isRead }).eq('id', id);
    }
    await db.inquiries.put(updated);
    setInquiries((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };

  const deleteInquiry = async (id) => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('inquiries').delete().eq('id', id);
    }
    await db.inquiries.delete(id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    await logAudit('DELETE', 'INQUIRY', id, `Deleted inquiry "${id}"`);
  };

  // ==========================================
  // SETTINGS MANAGEMENT
  // ==========================================
  const updateContactSettings = async (settingsData) => {
    const updated = {
      ...settingsData,
      id: 'default',
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('contact_settings').upsert([updated]);
    }
    await db.contact_settings.put(updated);
    setContactSettings(updated);
    await logAudit('UPDATE', 'SETTINGS', 'contact_settings', 'Updated public contact information');
    return updated;
  };

  const updateWebsiteSettings = async (settingsData) => {
    const updated = {
      ...settingsData,
      id: 'default',
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('website_settings').upsert([updated]);
    }
    await db.website_settings.put(updated);
    setWebsiteSettings(updated);
    await logAudit('UPDATE', 'SETTINGS', 'website_settings', 'Updated public website & SEO metadata');
    return updated;
  };

  // ==========================================
  // MEDIA LIBRARY UPLOADER
  // ==========================================
  const uploadMedia = async (file, category = 'general') => {
    // 1. Optimize image client-side to WebP
    const webpDataUrl = await optimizeImage(file);

    let publicUrl = webpDataUrl;

    // 2. Upload to Supabase Storage if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const fileExt = 'webp';
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${fileExt}`;
        const path = `${category}/${fileName}`;
        publicUrl = await uploadToSupabaseStorage('iwaat-media', path, file);
      } catch (err) {
        console.warn('[CMS Storage] Supabase Storage upload failed, utilizing optimized WebP fallback...', err);
      }
    }

    const newMedia = {
      id: `media-${Date.now()}`,
      name: file.name,
      url: publicUrl,
      file_size: file.size,
      file_type: file.type,
      category,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('media_assets').insert([newMedia]);
      } catch (e) {}
    }
    await db.media_assets.put(newMedia);
    setMediaAssets((prev) => [newMedia, ...prev]);
    await logAudit('UPLOAD', 'MEDIA', newMedia.id, `Uploaded media asset "${file.name}"`);
    return newMedia;
  };

  const deleteMedia = async (id) => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('media_assets').delete().eq('id', id);
    }
    await db.media_assets.delete(id);
    setMediaAssets((prev) => prev.filter((m) => m.id !== id));
    await logAudit('DELETE', 'MEDIA', id, `Deleted media asset "${id}"`);
  };

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  const markNotificationRead = async (id) => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    }
    await db.notifications.update(id, { is_read: true });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const clearAllNotifications = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('notifications').delete().neq('id', '');
    }
    await db.notifications.clear();
    setNotifications([]);
  };

  return (
    <CMSContext.Provider
      value={{
        // Datasets
        projects,
        categories,
        services,
        testimonials,
        events,
        inquiries,
        contactSettings,
        websiteSettings,
        mediaAssets,
        notifications,
        auditLogs,
        loading,
        refreshData,

        // Projects
        addProject,
        updateProject,
        deleteProject,
        toggleProjectPublish,
        toggleProjectFeatured,

        // Categories
        addCategory,
        deleteCategory,

        // Services
        addService,
        updateService,
        deleteService,

        // Testimonials
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        // Events & Gallery
        addEvent,
        updateEvent,
        deleteEvent,

        // Inquiries & CRM
        submitInquiry,
        updateInquiryStatus,
        updateInquiryPriority,
        addInquiryNote,
        markInquiryRead,
        deleteInquiry,

        // Settings
        updateContactSettings,
        updateWebsiteSettings,

        // Media
        uploadMedia,
        deleteMedia,

        // Notifications
        markNotificationRead,
        clearAllNotifications,

        // Audit
        logAudit,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
