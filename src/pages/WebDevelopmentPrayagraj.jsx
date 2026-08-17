import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Smartphone,
  Zap,
  Search,
  Layers,
  MapPin,
  HelpCircle,
  FolderGit2,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { getCanonicalUrl } from '../config/seo';
import { SectionHeader } from '../components/SectionHeader';
import { MagneticButton } from '../components/MagneticButton';
import { GlassCard } from '../components/GlassCard';
import { ProjectCard } from '../components/ProjectCard';
import { useCMS } from '../cms/cmsContext';
import {
  generateProfessionalServiceSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateSingleServiceSchema,
} from '../utils/seoSchema';

const localFaqs = [
  {
    question: 'How much does website development cost in Prayagraj?',
    answer:
      'Standard business websites in Prayagraj typically start from ₹15,000 to ₹35,000, while custom e-commerce platforms and web applications with online payment gateways or patient/client portals range from ₹40,000 to ₹1,00,000+ depending on custom feature requirements.',
  },
  {
    question: 'Why should Prayagraj businesses hire iWAAT over remote freelancers?',
    answer:
      'iWAAT provides a dedicated engineering team with local accountability, face-to-face consultative project scoping, 100% intellectual property ownership, bank-grade security, and ongoing technical support with zero downtime guarantees.',
  },
  {
    question: 'How long does it take to design and launch a business website in Prayagraj?',
    answer:
      'A bespoke 5 to 10-page responsive business website typically launches within 2 to 3 weeks. Custom web applications and e-commerce stores with database integrations take 3 to 6 weeks.',
  },
  {
    question: 'Will my website rank on Google for local searches in Prayagraj and Uttar Pradesh?',
    answer:
      'Yes. Every website built by iWAAT includes technical on-page SEO, semantic Schema.org structured data, mobile speed optimization, Google Search Console registration, and Google Business Profile alignment to maximize local visibility.',
  },
  {
    question: 'Do you provide website maintenance and hosting support after launch?',
    answer:
      'Yes. We offer comprehensive annual maintenance plans covering cloud hosting on high-speed global CDNs, automated daily database backups, SSL certificate renewals, and security patch updates.',
  },
];

const capabilityCards = [
  {
    title: 'Custom Business Websites',
    desc: 'Bespoke corporate web architectures tailored for clinics, consulting firms, schools, legal practices, and institutions in Prayagraj.',
    icon: Code2,
  },
  {
    title: 'E-Commerce & Online Stores',
    desc: 'High-converting online shopping experiences with Razorpay/Stripe payments, automated WhatsApp order alerts, and inventory management.',
    icon: Zap,
  },
  {
    title: 'Custom Web Applications',
    desc: 'Diagnostic lab portals, appointment booking software, internal ERPs, and NGO donation systems built with React and cloud databases.',
    icon: Layers,
  },
  {
    title: 'Mobile-First UI/UX Design',
    desc: 'Fluid layouts optimized for smartphones, ensuring fast loading over 4G/5G mobile networks with thumb-friendly navigation.',
    icon: Smartphone,
  },
  {
    title: 'Local SEO & Google Rankings',
    desc: 'Search-ready architecture designed to capture high-intent local customer searches across Prayagraj and Uttar Pradesh.',
    icon: Search,
  },
  {
    title: 'Security & 99.9% Uptime',
    desc: 'Hardened Content Security Policies (CSP), continuous SSL encryption, DDoS mitigation, and daily automated cloud backups.',
    icon: ShieldCheck,
  },
];

export const WebDevelopmentPrayagraj = () => {
  const { projects, websiteSettings, contactSettings } = useCMS();

  // Filter published projects for case studies
  const localCaseStudies = projects
    .filter((p) => p.status === 'published')
    .slice(0, 3);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Web Development Prayagraj', path: '/web-development-prayagraj' },
  ]);

  const serviceEntitySchema = generateProfessionalServiceSchema(
    null,
    websiteSettings,
    contactSettings
  );

  const webDevServiceSchema = generateSingleServiceSchema({
    id: 'web-development-prayagraj',
    slug: 'web-development-prayagraj',
    title: 'Web Development in Prayagraj',
    description:
      'Professional custom website development, UI/UX design, e-commerce, and software solutions for businesses in Prayagraj and Uttar Pradesh.',
    features: [
      'Custom Responsive Web Design',
      'Local SEO & Google Search Console Optimization',
      'E-Commerce & Payment Gateway Integration',
      'Healthcare & Diagnostic Portals',
      'Speed Optimization & Cloud Hosting',
      'Annual Maintenance & Security',
    ],
  });

  const faqSchema = generateFAQSchema(localFaqs);

  return (
    <div className="pt-24 md:pt-36 pb-20 space-y-24">
      {/* Dynamic SEO Meta & Schema.org Graph */}
      <SEO
        title="Web Development & Website Design in Prayagraj | iWAAT"
        description="Looking for professional web development in Prayagraj? iWAAT engineers custom business websites, e-commerce stores, and software applications with fast speeds and local SEO."
        canonicalUrl={getCanonicalUrl('/web-development-prayagraj')}
        schema={[webDevServiceSchema, serviceEntitySchema, breadcrumbSchema, faqSchema]}
      />

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/30 text-violet-600 dark:text-violet-300 text-xs sm:text-sm font-semibold">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>Prayagraj & Uttar Pradesh Digital Engineering Hub</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Web Development &amp;{' '}
            <span className="bg-gradient-to-r from-violet-500 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              Website Design
            </span>{' '}
            in Prayagraj
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            iWAAT is a premier web development and digital agency in Prayagraj, Uttar Pradesh. We engineer custom, high-performance websites, e-commerce platforms, and scalable web applications designed to convert local searchers into paying clients.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact">
              <MagneticButton variant="primary">
                <span>Start Your Prayagraj Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
            </Link>

            <Link to="/projects">
              <MagneticButton variant="glass">
                <span>Explore Client Work</span>
              </MagneticButton>
            </Link>
          </div>
        </div>
      </div>

      {/* WHY BUSINESSES NEED A PROFESSIONAL WEBSITE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl glow-card space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-500">
              Strategic Digital Advantage
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Why Businesses in Prayagraj Need a High-Performance Website
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              In today's competitive digital economy, more than 80% of local customers in Prayagraj research medical services, schools, retail stores, and commercial contractors on Google before making contact. A slow, template-driven site loses potential customers to competitors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
                Direct Google Search Capture
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Rank when local customers search for your specific services in Prayagraj, Civil Lines, Katra, Naini, and across Uttar Pradesh.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
                Uncompromising Trust & E-E-A-T
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                A custom modern website establishes professional credibility, showcasing verified case studies, client reviews, and official contact channels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
                Automated Leads & Sales
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Capture consultation requests, schedule clinic appointments, and process online payments 24 hours a day, 7 days a week.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT IWAAT BUILDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Full-Stack Capabilities"
          title="What We Build for Businesses in"
          highlight="Prayagraj & Beyond"
          subtitle="From rapid business landing pages to enterprise web applications, every system is engineered with clean code and modern frameworks."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilityCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <GlassCard key={idx} glow={true} className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* 5-STAGE DEVELOPMENT WORKFLOW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl glow-card space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-500">
              Transparent Methodology
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Our 5-Stage Web Development Process
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              Predictable timelines, continuous milestone demos, and complete transparency from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
            {[
              { step: '01', title: 'Discovery & Scoping', desc: 'Understanding your business goals, target demographic in Prayagraj/UP, and competitor landscape.' },
              { step: '02', title: 'UI/UX Wireframing', desc: 'Designing custom responsive prototypes focused on intuitive usability and conversions.' },
              { step: '03', title: 'Full-Stack Coding', desc: 'Writing clean React, Node, and database architecture optimized for speed.' },
              { step: '04', title: 'Testing & QA', desc: 'Cross-browser testing, mobile ergonomics, security audit, and technical SEO schema check.' },
              { step: '05', title: 'Launch & Support', desc: 'Deploying to high-speed global cloud CDN with SSL encryption and Google Search Console indexing.' },
            ].map((p, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-violet-400 block">{p.step}</span>
                <h4 className="font-heading font-bold text-sm text-white">{p.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED CASE STUDIES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-500 block mb-2">
              Proven Track Record
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Live Production Case Studies
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-500 hover:text-violet-400 transition-colors"
          >
            <span>View All Client Work</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {localCaseStudies.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeader
          badge="Got Questions?"
          title="Frequently Asked Questions About Web Development in"
          highlight="Prayagraj"
          subtitle="Honest answers regarding pricing, project delivery timelines, and technology options."
        />

        <div className="space-y-4">
          {localFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-panel glow-card space-y-2 border border-slate-200/60 dark:border-slate-800"
            >
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed pl-7">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT CALL TO ACTION */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-14 rounded-3xl glow-card text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to Grow Your Business?</span>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white">
            Let's Engineer Your Next Web Project in Prayagraj
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Contact our engineering team for a free consultation proposal. We will analyze your requirements, outline the optimal tech stack, and deliver a transparent quotation.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact">
              <MagneticButton variant="primary">
                <span>Request Free Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
            </Link>

            <Link to="/services">
              <MagneticButton variant="glass">
                <span>Explore All Services</span>
              </MagneticButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebDevelopmentPrayagraj;
