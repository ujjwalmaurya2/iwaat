import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../components/SectionHeader';
import { GlassCard } from '../components/GlassCard';
import { MagneticButton } from '../components/MagneticButton';
import { SEO } from '../components/SEO';
import { getCanonicalUrl } from '../config/seo';
import { Link } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  Sparkles,
  Gauge,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowUpRight,
  Code2,
  Award,
} from 'lucide-react';
import { useCMS } from '../cms/cmsContext';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '../utils/seoSchema';
import companyData from '../data/company.json';

const valueIcons = {
  Innovation: Zap,
  Reliability: ShieldCheck,
  Creativity: Sparkles,
  Performance: Gauge,
  Scalability: TrendingUp,
  Partnership: Users,
};

export const About = () => {
  const { websiteSettings, contactSettings } = useCMS();

  const orgSchema = generateOrganizationSchema(null, websiteSettings, contactSettings);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'About', path: '/about' },
  ]);

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About iWAAT Digital Services',
    description: websiteSettings?.about_description || companyData.shortDescription,
    url: getCanonicalUrl('/about'),
    mainEntity: {
      '@id': `${getCanonicalUrl('/')}#organization`,
    },
  };

  return (
    <div className="pt-24 md:pt-36 pb-20 space-y-24">
      {/* Dynamic SEO Meta & Schema */}
      <SEO
        title="About iWAAT — Digital Agency, Engineering Philosophy & Team | iWAAT"
        description={
          websiteSettings?.about_description ||
          companyData.shortDescription ||
          'Learn about iWAAT, a multidisciplinary digital services team specializing in web development, software engineering, UI/UX design, and digital marketing.'
        }
        canonicalUrl={getCanonicalUrl('/about')}
        schema={[aboutSchema, orgSchema, breadcrumbSchema]}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="About iWAAT"
          title="A Multidisciplinary Digital Team Focused On"
          highlight="Engineering Excellence"
          subtitle={websiteSettings?.about_description || companyData.shortDescription}
        />
      </div>

      {/* Story & Vision Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              We Build. We Scale.{' '}
              <span className="bg-gradient-to-r from-violet-500 via-orange-400 to-pink-500 bg-clip-text text-transparent">We Market.</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
              {companyData.fullStory}
            </p>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Whether working with a non-profit NGO establishing community trust, a medical center launching an online diagnostic portal, or an e-commerce brand wanting gold-standard aesthetics, we bring deep technical expertise and creative discipline to every engagement.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link to="/contact">
                <MagneticButton variant="primary">
                  <span>Work With iWAAT</span>
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

          {/* Right Visual Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-[4/3] bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                alt="iWAAT Multidisciplinary Software Engineering and Design Team Workspace"
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-violet-400 font-semibold uppercase tracking-wider block">
                    Engineering Culture
                  </span>
                  <p className="font-heading font-bold text-sm sm:text-base">
                    Collaborative • Agile • Global Reach
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
                  100%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Our Core Values"
          title="The Principles That Drive Our"
          highlight="Digital Craft"
          subtitle="Every project we execute is guided by a commitment to innovation, speed, clean code, and long-term partnership."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companyData.values.map((val, index) => {
            const IconComponent = valueIcons[val.title] || Zap;
            return (
              <GlassCard key={index} glow={true} className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                  {val.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {val.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default About;
