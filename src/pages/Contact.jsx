import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { ContactForm } from '../components/ContactForm';
import { FAQAccordion } from '../components/FAQAccordion';
import { SEO } from '../components/SEO';
import { getCanonicalUrl } from '../config/seo';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { useCMS } from '../cms/cmsContext';
import { generateProfessionalServiceSchema, generateBreadcrumbSchema, generateFAQSchema } from '../utils/seoSchema';
import fallbackCompany from '../data/company.json';
import fallbackFaqs from '../data/faqs.json';

export const Contact = () => {
  const { contactSettings, websiteSettings } = useCMS();

  const email = contactSettings?.email || fallbackCompany.contactInfo.email;
  const phone = contactSettings?.phone || fallbackCompany.contactInfo.phone;
  const location = contactSettings?.location || fallbackCompany.contactInfo.location;
  const workingHours = contactSettings?.working_hours || fallbackCompany.contactInfo.workingHours;

  const serviceSchema = generateProfessionalServiceSchema(null, websiteSettings, contactSettings);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Contact', path: '/contact' },
  ]);
  const faqSchema = generateFAQSchema(fallbackFaqs);

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact iWAAT Digital Services',
    description: 'Get in touch with iWAAT for web development, custom software, UI/UX design, and digital marketing inquiries.',
    url: getCanonicalUrl('/contact'),
    mainEntity: {
      '@id': `${getCanonicalUrl('/')}#organization`,
    },
  };

  return (
    <div className="pt-24 md:pt-36 pb-20 space-y-24">
      {/* Dynamic SEO Meta & Schema */}
      <SEO
        title="Contact iWAAT — Start Your Website, App or Digital Project | iWAAT"
        description="Ready to build a modern website, custom software app, or scale your digital marketing? Reach out to our engineering and design team for a free consultation proposal."
        canonicalUrl={getCanonicalUrl('/contact')}
        schema={[contactPageSchema, serviceSchema, breadcrumbSchema, faqSchema]}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeader
          badge="Let's Talk"
          title="Start Your Project With"
          highlight="iWAAT Today"
          subtitle="Ready to build a modern website, custom software app, or scale your digital marketing? Reach out to our engineering and design team for a free consultation proposal."
        />
      </div>

      {/* Main 2-Column Contact Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading font-extrabold text-3xl text-slate-900 dark:text-white">
                Get In Touch
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Whether you have a fully documented specification or an early conceptual idea, we're here to help you scope, design, and engineer your vision.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-5 rounded-2xl glass-panel glow-card">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="font-heading font-bold text-slate-900 dark:text-white text-lg hover:text-violet-500 transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl glass-panel glow-card">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Phone & WhatsApp Direct Line
                  </span>
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                    className="font-heading font-bold text-slate-900 dark:text-white text-lg hover:text-violet-500 transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl glass-panel glow-card">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Office & Engineering Hubs
                  </span>
                  <p className="font-heading font-bold text-slate-900 dark:text-white text-base">
                    {location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl glass-panel glow-card">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Working Hours
                  </span>
                  <p className="font-heading font-bold text-slate-900 dark:text-white text-base">
                    {workingHours}
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
      </div>

      {/* FAQs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Got Questions?"
          title="Common Questions Before"
          highlight="Starting A Project"
          subtitle="Explore quick answers to common questions about working with iWAAT."
        />
        <FAQAccordion />
      </div>
    </div>
  );
};

export default Contact;
