import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { ProcessTimeline } from '../components/ProcessTimeline';
import { MagneticButton } from '../components/MagneticButton';
import { SEO } from '../components/SEO';
import { getCanonicalUrl } from '../config/seo';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { generateBreadcrumbSchema } from '../utils/seoSchema';

export const Process = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Process', path: '/process' },
  ]);

  const processPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'iWAAT 7-Stage Agile Engineering & Growth Methodology',
    description:
      'Explore the transparent 7-stage software development lifecycle and quality guarantee at iWAAT.',
    url: getCanonicalUrl('/process'),
  };

  return (
    <div className="pt-24 md:pt-36 pb-20 space-y-20">
      {/* Dynamic SEO Meta & Schema */}
      <SEO
        title="Our Process — 7-Stage Agile Engineering & Quality Assurance | iWAAT"
        description="From initial discovery to launch and post-release scaling, our transparent agile process ensures predictable timelines and exceptional software quality."
        canonicalUrl={getCanonicalUrl('/process')}
        schema={[processPageSchema, breadcrumbSchema]}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeader
          badge="7-Stage Workflow"
          title="Our Battle-Tested Development & Growth"
          highlight="Methodology"
          subtitle="From initial discovery to launch and post-release scaling, our transparent agile process ensures predictable timelines and exceptional software quality."
        />
      </div>

      {/* Timeline Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProcessTimeline />
      </div>

      {/* Quality Standards Callout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl glow-card text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-orange-500 p-0.5 mx-auto">
            <div className="w-full h-full bg-[#0B1020] rounded-[14px] flex items-center justify-center text-violet-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            100% Quality & Security Guarantee
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Every line of code written by iWAAT undergoes automated static analysis, cross-browser compatibility checks, accessibility testing, and security hardening before reaching production servers.
          </p>

          <div className="pt-2">
            <Link to="/contact">
              <MagneticButton variant="primary" className="mx-auto">
                <span>Kickstart Your Project Discovery</span>
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Process;
