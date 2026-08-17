import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles, ArrowUpRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { getCanonicalUrl } from '../config/seo';
import { SectionHeader } from '../components/SectionHeader';
import { ServiceCard } from '../components/ServiceCard';
import { FAQAccordion } from '../components/FAQAccordion';
import { MagneticButton } from '../components/MagneticButton';
import { generateBreadcrumbSchema, generateFAQSchema } from '../utils/seoSchema';
import { useCMS } from '../cms/cmsContext';
import fallbackServices from '../data/services.json';
import fallbackFaqs from '../data/faqs.json';

export const Services = () => {
  const { services: cmsServices } = useCMS();
  const servicesData = cmsServices && cmsServices.length > 0 ? cmsServices : fallbackServices;

  const [activeTab, setActiveTab] = useState(servicesData[0]?.id || 'web-development');
  const selectedService = servicesData.find((s) => s.id === activeTab) || servicesData[0];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Services', path: '/services' },
  ]);
  const faqSchema = generateFAQSchema(fallbackFaqs);

  // Generate Service catalog schema
  const catalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'iWAAT Digital Services & Solutions',
    itemListElement: servicesData.map((s, idx) => ({
      '@type': 'Offer',
      position: idx + 1,
      itemOffered: {
        '@type': 'Service',
        name: s.title,
        description: s.shortDescription || s.description,
        url: getCanonicalUrl(`/services/${s.slug || s.id}`),
      },
    })),
  };

  return (
    <div className="pt-24 md:pt-36 pb-20 space-y-24">
      {/* Dynamic SEO Meta & Structured Data */}
      <SEO
        title="Digital Services — Web Development, Software & Marketing"
        description="Explore end-to-end digital services by iWAAT: Custom Web Development, Custom Software Solutions, UI/UX Design, SEO & Digital Marketing, Brand Identity, and Maintenance."
        canonicalUrl={getCanonicalUrl('/services')}
        schema={[catalogSchema, breadcrumbSchema, faqSchema]}
      />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeader
          badge="Digital Services"
          title="End-to-End Technical & Creative"
          highlight="Solutions"
          subtitle="From early-stage conceptualization to full enterprise development and marketing growth, we offer comprehensive services tailored to your exact business objectives."
        />
      </div>

      {/* Interactive Service Filter Tabs & Deep Dive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {servicesData.map((service) => {
            const isActive = activeTab === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setActiveTab(service.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 scale-105'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {service.title}
              </button>
            );
          })}
        </div>

        {/* Selected Service Spotlight Detail */}
        {selectedService && (
          <motion.div
            key={selectedService.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-panel p-8 sm:p-12 rounded-3xl glow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-500/15 text-violet-500 inline-block">
                {selectedService.badge}
              </span>

              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
                {selectedService.title}
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                {selectedService.description}
              </p>

              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-400">
                  Core Capabilities & Scope:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedService.features?.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center gap-4">
                <Link to={`/services/${selectedService.slug || selectedService.id}`}>
                  <MagneticButton variant="primary">
                    <span>View Dedicated {selectedService.title} Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </Link>

                <Link to="/contact">
                  <MagneticButton variant="glass">
                    <span>Start This Project</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </MagneticButton>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-2 text-violet-400 font-heading font-bold text-base">
                <Sparkles className="w-5 h-5" />
                <span>Service Deliverables</span>
              </div>

              <ul className="space-y-3">
                {selectedService.deliverables?.map((del, dIdx) => (
                  <li
                    key={dIdx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
                  >
                    <span>{del}</span>
                    <span className="text-emerald-400">Included</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>

      {/* Full Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
            All Service Offerings
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Click any service to view full technical capabilities and case studies.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>

      {/* FAQS SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Frequently Asked Questions"
          title="Everything You Need To Know About"
          highlight="Our Services"
          subtitle="Got questions about project timelines, costs, or maintenance? Here are answers to common inquiries."
        />
        <FAQAccordion />
      </div>
    </div>
  );
};

export default Services;
