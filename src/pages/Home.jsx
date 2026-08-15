import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Hero3DMockup } from '../components/Hero3DMockup';
import { StatsCounter } from '../components/StatsCounter';
import { SectionHeader } from '../components/SectionHeader';
import { ServiceCard } from '../components/ServiceCard';
import { ProjectCard } from '../components/ProjectCard';
import { TechBadge } from '../components/TechBadge';
import { TestimonialMarquee } from '../components/TestimonialMarquee';
import { ContactForm } from '../components/ContactForm';
import { MagneticButton } from '../components/MagneticButton';
import { useCMS } from '../cms/cmsContext';

import fallbackTechnologies from '../data/technologies.json';
import fallbackCompany from '../data/company.json';

export const Home = () => {
  const { projects, services, contactSettings, websiteSettings } = useCMS();

  // Published & featured projects
  const publishedFeaturedProjects = projects
    .filter((p) => p.status === 'published' && p.featured)
    .slice(0, 6);

  const contactEmail = contactSettings?.email || fallbackCompany.contactInfo.email;
  const contactPhone = contactSettings?.phone || fallbackCompany.contactInfo.phone;
  const contactLocation = contactSettings?.location || fallbackCompany.contactInfo.location;
  const contactHours = contactSettings?.working_hours || fallbackCompany.contactInfo.workingHours;

  return (
    <div className="space-y-24 md:space-y-32 pb-16">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/30 text-violet-600 dark:text-violet-300 text-xs sm:text-sm font-semibold shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-violet-500 animate-spin" />
                <span>{websiteSettings?.tagline || 'We Build • We Scale • We Market'}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-slate-900 dark:text-white leading-[1.08]"
              >
                Building Digital{' '}
                <span className="bg-gradient-to-r from-violet-500 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                  Experiences
                </span>{' '}
                That Drive Business Growth
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-600 dark:text-slate-300 text-base sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                {websiteSettings?.short_description ||
                  'We design, develop, and market modern digital products—from websites and software platforms to branding, SEO, and growth solutions for startups, NGOs, healthcare, fitness, and commerce.'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <MagneticButton href="/projects" variant="primary">
                  <span>View Our Work</span>
                  <ArrowUpRight className="w-4 h-4" />
                </MagneticButton>

                <MagneticButton href="/contact" variant="secondary">
                  <span>Start a Project</span>
                </MagneticButton>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>20+ Live Projects Delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500" />
                  <span>99.9% Uptime Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>24/7 Client Support</span>
                </div>
              </motion.div>
            </div>

            {/* Right 3D Mockup Composition */}
            <div className="lg:col-span-5 relative">
              <Hero3DMockup />
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1.5 pt-12 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
          >
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Scroll Down
            </span>
            <ChevronDown className="w-4 h-4 text-violet-500" />
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <StatsCounter />

      {/* SERVICES SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Our Core Capabilities"
          title="Multidisciplinary Services Engineered for"
          highlight="Scale & Impact"
          subtitle="From high-speed web apps and custom ERP software to luxury UI/UX and ROI-driven marketing, we build complete digital ecosystems."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Featured Client Work"
          title="Real Digital Products Delivering"
          highlight="Measurable Success"
          subtitle="Explore live deployed platforms engineered for healthcare, non-profits, luxury retail, photography, fitness, and enterprise services."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {publishedFeaturedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/projects">
            <MagneticButton variant="glass" className="mx-auto">
              <span>Explore Full Portfolio & Case Studies</span>
              <ArrowUpRight className="w-4 h-4" />
            </MagneticButton>
          </Link>
        </div>
      </section>

      {/* TECHNOLOGIES STACK SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Modern Tech Stack"
          title="Built With World-Class"
          highlight="Frameworks & Tools"
          subtitle="We leverage battle-tested technologies and modern cloud infrastructure for speed, security, and developer efficiency."
        />

        <div className="space-y-12">
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              Frontend & UI Performance
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {fallbackTechnologies.frontend.map((tech, idx) => (
                <TechBadge key={idx} tech={tech} index={idx} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Backend Architecture & Cloud DB
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {fallbackTechnologies.backend.map((tech, idx) => (
                <TechBadge key={idx} tech={tech} index={idx} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                Development & DevOps Tools
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {fallbackTechnologies.tools.map((tech, idx) => (
                  <TechBadge key={idx} tech={tech} index={idx} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                Growth & SEO Analytics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {fallbackTechnologies.marketing.map((tech, idx) => (
                  <TechBadge key={idx} tech={tech} index={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Why Choose iWAAT"
          title="The Digital Partner Your Business"
          highlight="Deserves"
          subtitle="We combine top-tier technical craftsmanship with strategic design to ensure every digital product we create yields exceptional business results."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {fallbackCompany.whyChooseUs.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-panel p-6 rounded-3xl glow-card space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                {feature.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION (MODERN INFINITE DUAL MARQUEE) */}
      <section className="relative z-10 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Client Testimonials"
            title="Trusted By Founders, Directors &"
            highlight="Industry Leaders"
            subtitle="Explore authentic feedback from leaders across healthcare, NGOs, photography, luxury retail, and fitness. Hover over any quote to pause."
          />
        </div>
        <TestimonialMarquee />
      </section>

      {/* LARGE CTA BANNER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[36px] overflow-hidden p-10 sm:p-16 text-center bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-950 border border-violet-500/30 shadow-2xl">
          <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-500/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/40 inline-block">
              Let's Build Together
            </span>

            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              Ready to Build Something{' '}
              <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-violet-300 bg-clip-text text-transparent">
                Extraordinary?
              </span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Whether you need a website, software platform, branding, or digital marketing, {websiteSettings?.name || 'iWAAT'} is ready to help your business scale.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/contact">
                <MagneticButton variant="primary">
                  <span>Start Your Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </MagneticButton>
              </Link>

              <Link to="/process">
                <MagneticButton variant="glass">
                  <span>Explore Our Process</span>
                </MagneticButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Get In Touch"
          title="Let's Discuss Your Next"
          highlight="Digital Breakthrough"
          subtitle="Have a question or a new project in mind? Reach out to our team today for a free technical consultation."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Business Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                We operate as a global remote agency with dedicated engineering and design hubs. We respond to all inquiries within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl glass-panel">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="font-heading font-bold text-slate-900 dark:text-white hover:text-violet-500 transition-colors text-base"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl glass-panel">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Phone & WhatsApp
                  </span>
                  <a
                    href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`}
                    className="font-heading font-bold text-slate-900 dark:text-white hover:text-violet-500 transition-colors text-base"
                  >
                    {contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl glass-panel">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Location & Hubs
                  </span>
                  <p className="font-heading font-bold text-slate-900 dark:text-white text-base">
                    {contactLocation}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl glass-panel">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Working Hours
                  </span>
                  <p className="font-heading font-bold text-slate-900 dark:text-white text-base">
                    {contactHours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};
