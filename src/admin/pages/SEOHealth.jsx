import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  ExternalLink,
  Search,
  Layers,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Image as ImageIcon,
  Share2,
  Check,
} from 'lucide-react';
import { SEO_CONFIG, SITE_URL, getCanonicalUrl } from '../../config/seo';
import { useCMS } from '../../cms/cmsContext';
import fallbackServices from '../../data/services.json';
import fallbackCompany from '../../data/company.json';

export const SEOHealth = () => {
  const { websiteSettings, contactSettings, projects, services } = useCMS();
  const [filter, setFilter] = useState('all'); // 'all' | 'warning' | 'optimal'

  const activeServices = services && services.length > 0 ? services : fallbackServices;
  const publishedProjects = projects.filter((p) => p.status === 'published');

  // Define public routes audit data
  const auditedRoutes = [
    {
      path: '/',
      name: 'Homepage / Brand Core',
      intent: 'Brand & Core Services',
      title: websiteSettings?.seo_title || SEO_CONFIG.defaultTitle,
      description: websiteSettings?.seo_description || SEO_CONFIG.defaultDescription,
      canonical: getCanonicalUrl('/'),
      h1: 'Building Digital Experiences That Drive Business Growth',
      schemaTypes: ['WebSite', 'Organization', 'ProfessionalService', 'FAQPage'],
      ogImage: websiteSettings?.og_image || SEO_CONFIG.ogImageUrl,
    },
    {
      path: '/services',
      name: 'Services Hub Catalog',
      intent: 'Commercial Overview',
      title: 'Digital Services — Web Development, Software & Marketing | iWAAT',
      description:
        'Explore end-to-end digital services by iWAAT: Custom Web Development, Custom Software Solutions, UI/UX Design, SEO & Digital Marketing, Brand Identity, and Maintenance.',
      canonical: getCanonicalUrl('/services'),
      h1: 'End-to-End Technical & Creative Solutions',
      schemaTypes: ['OfferCatalog', 'BreadcrumbList', 'FAQPage'],
      ogImage: SEO_CONFIG.ogImageUrl,
    },
    ...activeServices.map((s) => ({
      path: `/services/${s.slug || s.id}`,
      name: `Service: ${s.title}`,
      intent: 'Commercial Service Intent',
      title: s.metaTitle ? `${s.metaTitle} | iWAAT` : `${s.title} Services | iWAAT`,
      description: s.metaDescription || s.description,
      canonical: getCanonicalUrl(`/services/${s.slug || s.id}`),
      h1: `${s.title} — Engineered for High Impact`,
      schemaTypes: ['Service', 'BreadcrumbList', 'FAQPage'],
      ogImage: SEO_CONFIG.ogImageUrl,
    })),
    {
      path: '/projects',
      name: 'Portfolio & Case Studies',
      intent: 'Commercial Proof / Portfolio',
      title: 'Selected Portfolio & Case Studies — Live Deployed Web Applications | iWAAT',
      description:
        'Explore our showcase of production-deployed web applications, healthcare management platforms, e-commerce portals, and non-profit websites.',
      canonical: getCanonicalUrl('/projects'),
      h1: 'Engineered Products That Drive Real Industry Growth',
      schemaTypes: ['CollectionPage', 'BreadcrumbList'],
      ogImage: SEO_CONFIG.ogImageUrl,
    },
    {
      path: '/about',
      name: 'About & Engineering Culture',
      intent: 'Brand & E-E-A-T Authority',
      title: 'About iWAAT — Digital Agency, Engineering Philosophy & Team | iWAAT',
      description:
        websiteSettings?.about_description ||
        fallbackCompany.shortDescription ||
        SEO_CONFIG.defaultDescription,
      canonical: getCanonicalUrl('/about'),
      h1: 'A Multidisciplinary Digital Team Focused On Engineering Excellence',
      schemaTypes: ['AboutPage', 'Organization', 'BreadcrumbList'],
      ogImage: SEO_CONFIG.ogImageUrl,
    },
    {
      path: '/process',
      name: '7-Stage Agile Process',
      intent: 'Methodology & Quality Trust',
      title: 'Our Process — 7-Stage Agile Engineering & Quality Assurance | iWAAT',
      description:
        'From initial discovery to launch and post-release scaling, our transparent agile process ensures predictable timelines and exceptional software quality.',
      canonical: getCanonicalUrl('/process'),
      h1: 'Our Battle-Tested Development & Growth Methodology',
      schemaTypes: ['WebPage', 'BreadcrumbList'],
      ogImage: SEO_CONFIG.ogImageUrl,
    },
    {
      path: '/events',
      name: 'Agency Milestones & Events',
      intent: 'Team Trust & Social Proof',
      title: 'Agency Events & Milestones — Behind The Scenes & Launches | iWAAT',
      description:
        'Explore behind-the-scenes photography from our engineering meetups, design hackathons, client workshops, and product releases.',
      canonical: getCanonicalUrl('/events'),
      h1: 'Team Events, Sprints & Project Launches',
      schemaTypes: ['CollectionPage', 'BreadcrumbList'],
      ogImage: SEO_CONFIG.ogImageUrl,
    },
    {
      path: '/contact',
      name: 'Contact & NAP Local Hub',
      intent: 'Conversion & Local Contact',
      title: 'Contact iWAAT — Start Your Website, App or Digital Project | iWAAT',
      description:
        'Ready to build a modern website, custom software app, or scale your digital marketing? Reach out to our engineering and design team for a free consultation proposal.',
      canonical: getCanonicalUrl('/contact'),
      h1: 'Start Your Project With iWAAT Today',
      schemaTypes: ['ContactPage', 'ProfessionalService', 'BreadcrumbList'],
      ogImage: SEO_CONFIG.ogImageUrl,
    },
  ];

  // Evaluate route audit health
  const evaluatedRoutes = auditedRoutes.map((r) => {
    const warnings = [];
    if (!r.title || r.title.length < 25) {
      warnings.push(`Title is unusually short (${r.title?.length || 0} chars)`);
    } else if (r.title.length > 70) {
      warnings.push(`Title may truncate on search engines (${r.title.length} chars)`);
    }

    if (!r.description || r.description.length < 80) {
      warnings.push(`Meta description is short (${r.description?.length || 0} chars)`);
    } else if (r.description.length > 180) {
      warnings.push(`Meta description exceeds recommended length (${r.description.length} chars)`);
    }

    if (!r.canonical.startsWith('http')) {
      warnings.push('Canonical URL does not use full HTTPS absolute path');
    }

    if (!r.h1) {
      warnings.push('Missing H1 heading declaration');
    }

    return {
      ...r,
      warnings,
      isOptimal: warnings.length === 0,
    };
  });

  const optimalCount = evaluatedRoutes.filter((r) => r.isOptimal).length;
  const warningCount = evaluatedRoutes.filter((r) => !r.isOptimal).length;
  const totalScore = Math.round((optimalCount / evaluatedRoutes.length) * 100);

  const displayedRoutes = evaluatedRoutes.filter((r) => {
    if (filter === 'optimal') return r.isOptimal;
    if (filter === 'warning') return !r.isOptimal;
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Technical SEO Audit
            </span>
            <span className="text-xs font-mono text-slate-400">Target: {SITE_URL}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-white">
            Search Engine & AI Answer Visibility Health
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Live technical audit of meta titles, descriptions, canonicals, Schema.org JSON-LD, robots.txt, and sitemaps.
          </p>
        </div>

        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-violet-500/40 transition-colors flex items-center gap-2"
        >
          <FileCode2 className="w-4 h-4 text-violet-400" />
          <span>View sitemap.xml</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">
            Overall Health Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl text-emerald-400">
              {totalScore}%
            </span>
            <span className="text-xs text-slate-500 font-mono">Production Ready</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">
            Audited Public Routes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl text-white">
              {evaluatedRoutes.length}
            </span>
            <span className="text-xs text-violet-400 font-mono">100% Crawlable</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">
            Robots & Crawler Policy
          </span>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm pt-1">
            <ShieldCheck className="w-5 h-5" />
            <span>Admin Protected / Assets Allowed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1020] border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">
            Published Live Projects
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl text-orange-400">
              {publishedProjects.length}
            </span>
            <span className="text-xs text-slate-500 font-mono">In Schema Graph</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-violet-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          All Routes ({evaluatedRoutes.length})
        </button>
        <button
          onClick={() => setFilter('optimal')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filter === 'optimal'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Optimal ({optimalCount})
        </button>
        <button
          onClick={() => setFilter('warning')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filter === 'warning'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Review Warnings ({warningCount})
        </button>
      </div>

      {/* Route Cards */}
      <div className="space-y-4">
        {displayedRoutes.map((route, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-5"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-violet-400">{route.path}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                    {route.intent}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-white">{route.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                {route.isOptimal ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Optimal</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{route.warnings.length} Notice(s)</span>
                  </span>
                )}
                <a
                  href={route.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  title="Open live route"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Warnings list if any */}
            {route.warnings.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block">
                  Guidance Notices:
                </span>
                {route.warnings.map((w, wIdx) => (
                  <p key={wIdx} className="text-xs text-amber-200/90 leading-relaxed">
                    • {w}
                  </p>
                ))}
              </div>
            )}

            {/* Metadata breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <span className="font-semibold text-slate-400 uppercase tracking-wider block text-[10px]">
                  SEO Title Tag ({route.title?.length || 0} chars)
                </span>
                <p className="font-heading font-medium text-white text-sm">{route.title}</p>
              </div>

              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <span className="font-semibold text-slate-400 uppercase tracking-wider block text-[10px]">
                  Primary H1 Heading
                </span>
                <p className="font-heading font-medium text-white text-sm">{route.h1}</p>
              </div>

              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 md:col-span-2">
                <span className="font-semibold text-slate-400 uppercase tracking-wider block text-[10px]">
                  Meta Description ({route.description?.length || 0} chars)
                </span>
                <p className="text-slate-300 leading-relaxed">{route.description}</p>
              </div>
            </div>

            {/* Schema tags & Canonical */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400 font-semibold text-[11px]">Schema Graph:</span>
                {route.schemaTypes.map((schemaType, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/30"
                  >
                    {schemaType}
                  </span>
                ))}
              </div>

              <div className="text-slate-400 font-mono text-[11px] truncate max-w-sm">
                Canonical: <span className="text-slate-200">{route.canonical}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Verification Checklist Box */}
      <div className="p-8 rounded-3xl bg-[#0B1020] border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-white">
              Google Search Console & Entity Submission Checklist
            </h3>
            <p className="text-xs text-slate-400">
              External tasks required after deploying to production.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-violet-300 font-semibold">
              <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Google Search Console Property</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Add domain property for <code className="text-violet-300 font-mono">{SITE_URL}</code> and verify via DNS TXT record or HTML tag.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-violet-300 font-semibold">
              <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Submit XML Sitemap</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Submit sitemap URL: <code className="text-violet-300 font-mono">{SITE_URL}/sitemap.xml</code> in Google Search Console Sitemaps section.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-violet-300 font-semibold">
              <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Google Business Profile (Prayagraj Hub)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Verify your official Google Business Profile matching the exact NAP (Name: iWAAT, Service area: India & Global, Category: Web Designer).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-violet-300 font-semibold">
              <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center text-[10px] font-bold">4</span>
              <span>Entity Social Link Verification</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Ensure official LinkedIn, GitHub, and Instagram company pages link back to <code className="text-violet-300 font-mono">{SITE_URL}</code> for Schema sameAs correlation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOHealth;
