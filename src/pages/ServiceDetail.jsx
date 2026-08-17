import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code2,
  Cpu,
  Layout,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Zap,
  HelpCircle,
  FolderGit2,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { getCanonicalUrl } from '../config/seo';
import { MagneticButton } from '../components/MagneticButton';
import { ProjectCard } from '../components/ProjectCard';
import { useCMS } from '../cms/cmsContext';
import { generateSingleServiceSchema, generateBreadcrumbSchema, generateFAQSchema } from '../utils/seoSchema';
import fallbackServices from '../data/services.json';

const iconMap = {
  Code2,
  Cpu,
  Layout,
  TrendingUp,
  Sparkles,
  ShieldCheck,
};

export const ServiceDetail = () => {
  const { slug } = useParams();
  const { projects, services: cmsServices } = useCMS();

  // Find service from CMS or fallback
  const allServices = cmsServices && cmsServices.length > 0 ? cmsServices : fallbackServices;
  const service =
    allServices.find((s) => (s.slug || s.id) === slug) ||
    fallbackServices.find((s) => (s.slug || s.id) === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const IconComponent = iconMap[service.icon] || Code2;

  // Filter published projects related to this service
  const relatedProjects = projects
    .filter((p) => p.status === 'published')
    .filter((p) => {
      if (service.slug === 'web-development') return true;
      if (service.slug === 'software-development') {
        return ['Healthcare', 'Education', 'NGO & Nonprofit'].includes(p.category);
      }
      if (service.slug === 'ui-ux-design') {
        return ['Photography', 'Retail', 'Fitness'].includes(p.category);
      }
      if (service.slug === 'digital-marketing') {
        return ['Fitness', 'Retail', 'Healthcare'].includes(p.category);
      }
      return true;
    })
    .slice(0, 3);

  // Other services for internal linking
  const otherServices = allServices.filter((s) => (s.slug || s.id) !== service.slug);

  // Structured data schemas
  const serviceSchema = generateSingleServiceSchema(service);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Services', path: '/services' },
    { name: service.title, path: `/services/${service.slug || service.id}` },
  ]);
  const faqSchema = service.faqs ? generateFAQSchema(service.faqs) : null;

  return (
    <div className="pt-24 md:pt-36 pb-20 space-y-24">
      {/* Dynamic SEO Meta & Schema */}
      <SEO
        title={service.metaTitle ? `${service.metaTitle} | iWAAT` : `${service.title} Services | iWAAT`}
        description={service.metaDescription || service.description}
        canonicalUrl={getCanonicalUrl(`/services/${service.slug || service.id}`)}
        schema={[serviceSchema, breadcrumbSchema, faqSchema].filter(Boolean)}
      />

      {/* Breadcrumb Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Link to="/" className="hover:text-violet-500 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/services" className="hover:text-violet-500 transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 dark:text-white font-semibold truncate">
            {service.title}
          </span>
        </nav>
      </div>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-14 glow-card space-y-8">
          <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${service.gradient || 'from-violet-600 to-indigo-600'}`} />

          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30">
              <IconComponent className="w-4 h-4 text-violet-500" />
              <span>{service.badge || 'Professional Service'}</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white leading-[1.12]">
              {service.title} —{' '}
              <span className="bg-gradient-to-r from-violet-500 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                Engineered for High Impact
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
              {service.description}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link to="/contact">
                <MagneticButton variant="primary">
                  <span>Start Your {service.title} Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </MagneticButton>
              </Link>

              <Link to="/projects">
                <MagneticButton variant="glass">
                  <span>View Related Case Studies</span>
                </MagneticButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CHALLENGES WE SOLVE & BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problems Solved */}
          {service.problemsSolved && (
            <div className="glass-panel p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                  Challenges We Solve
                </h2>
              </div>
              <ul className="space-y-3.5">
                {service.problemsSolved.map((prob, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Strategic Benefits */}
          {service.benefits && (
            <div className="glass-panel p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                  Key Strategic Benefits
                </h2>
              </div>
              <ul className="space-y-3.5">
                {service.benefits.map((ben, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* CORE SCOPE & DELIVERABLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl space-y-6">
            <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
              Core Capabilities & Scope
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-mono text-violet-500 font-semibold block">0{idx + 1}.</span>
                  <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">{feat}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950 p-8 rounded-3xl border border-slate-800 text-white space-y-6">
            <div className="flex items-center gap-2 text-violet-400 font-heading font-bold text-lg">
              <Sparkles className="w-5 h-5" />
              <span>Included Deliverables</span>
            </div>
            <ul className="space-y-3">
              {service.deliverables.map((del, dIdx) => (
                <li
                  key={dIdx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
                >
                  <span className="truncate pr-2">{del}</span>
                  <span className="text-emerald-400 shrink-0 font-bold">Included</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5-STAGE PROCESS */}
      {service.process && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-500/10 text-violet-500 inline-block mb-3">
              Execution Roadmap
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">
              Our 5-Stage {service.title} Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {service.process.map((step, sIdx) => (
              <div key={sIdx} className="glass-panel p-6 rounded-3xl glow-card space-y-3 flex flex-col justify-between">
                <div>
                  <span className="font-mono font-extrabold text-2xl text-gradient-primary block mb-2">
                    {step.step}
                  </span>
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-2">
                    {step.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TECHNOLOGIES STACK */}
      {service.technologies && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 rounded-3xl glow-card space-y-4 text-center">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Technologies & Frameworks Employed
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {service.technologies.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-300 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELATED PROJECTS */}
      {relatedProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-500/10 text-violet-500 inline-block mb-2">
                Proof of Work
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                Related Live Case Studies
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-500 hover:text-violet-400 transition-colors"
            >
              <span>View All Portfolio Work</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProjects.map((proj, idx) => (
              <ProjectCard key={proj.id} project={proj} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* SERVICE FAQS (VISIBLE & STRUCTURED) */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center mx-auto">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Frequently Asked Questions About {service.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Clear answers to help you make informed decisions about your digital project.
            </p>
          </div>

          <div className="space-y-4">
            {service.faqs.map((faq, fIdx) => (
              <div key={fIdx} className="glass-panel p-6 rounded-2xl glow-card space-y-2">
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPLORE OTHER SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white text-center">
          Explore Other Digital Capabilities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {otherServices.slice(0, 5).map((other) => (
            <Link
              key={other.id}
              to={`/services/${other.slug || other.id}`}
              className="p-5 rounded-2xl glass-panel glow-card hover:border-violet-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  {other.badge}
                </span>
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white group-hover:text-violet-500 transition-colors">
                  {other.title}
                </h4>
              </div>
              <div className="pt-3 flex items-center gap-1 text-xs font-semibold text-violet-500">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-10 sm:p-14 text-center bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-950 border border-violet-500/30 shadow-2xl space-y-6">
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            Ready to Build Your {service.title} Solution?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Contact our engineering and design team today for a free technical consultation and tailored proposal.
          </p>
          <div className="pt-2">
            <Link to="/contact">
              <MagneticButton variant="primary" className="mx-auto">
                <span>Request Free Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
