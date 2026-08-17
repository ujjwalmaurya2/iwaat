/**
 * iWAAT — Schema.org JSON-LD Generators
 * Generates semantic structured data using verified information only.
 * No fake ratings, no fake reviews, no fabricated business addresses.
 */

import { SEO_CONFIG, getCanonicalUrl, getAbsoluteImageUrl } from '../config/seo';

/**
 * WebSite Schema
 */
export const generateWebSiteSchema = (customSiteUrl) => {
  const url = customSiteUrl || SEO_CONFIG.siteUrl;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    url: url,
    name: SEO_CONFIG.siteName,
    alternateName: [SEO_CONFIG.legalName, SEO_CONFIG.alternateName],
    description: SEO_CONFIG.defaultDescription,
    inLanguage: SEO_CONFIG.language,
    publisher: {
      '@id': `${url}/#organization`,
    },
  };
};

/**
 * Organization Schema
 */
export const generateOrganizationSchema = (customSiteUrl, websiteSettings, contactSettings) => {
  const url = customSiteUrl || SEO_CONFIG.siteUrl;
  const name = websiteSettings?.name || SEO_CONFIG.siteName;
  const description =
    websiteSettings?.short_description ||
    websiteSettings?.about_description ||
    SEO_CONFIG.defaultDescription;
  const logo = getAbsoluteImageUrl(websiteSettings?.og_image || SEO_CONFIG.logoUrl);

  const email = contactSettings?.email || SEO_CONFIG.contact.email;
  const phone = contactSettings?.phone || SEO_CONFIG.contact.phone;
  const socials = contactSettings?.socials || SEO_CONFIG.socials;

  const sameAsList = Object.values(socials).filter(
    (link) => typeof link === 'string' && link.startsWith('http')
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name: name,
    legalName: SEO_CONFIG.legalName,
    alternateName: SEO_CONFIG.alternateName,
    url: url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
      caption: `${name} Official Logo`,
    },
    image: logo,
    description: description,
    slogan: websiteSettings?.tagline || SEO_CONFIG.tagline,
    email: email,
    sameAs: sameAsList,
    knowsAbout: [
      'Web Design',
      'Web Development',
      'Custom Software Development',
      'UI/UX Design',
      'Mobile Application Development',
      'E-Commerce Development',
      'Search Engine Optimization (SEO)',
      'Digital Marketing & Advertising',
      'Brand Identity Systems',
      'Cloud Architecture & Website Maintenance',
    ],
  };

  if (phone) {
    schema.telephone = phone;
    schema.contactPoint = [
      {
        '@type': 'ContactPoint',
        telephone: phone,
        email: email,
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
        areaServed: ['Global', 'India', 'Uttar Pradesh', 'Prayagraj'],
      },
    ];
  }

  return schema;
};

/**
 * ProfessionalService / Agency Schema (Legitimate entity representation)
 */
export const generateProfessionalServiceSchema = (customSiteUrl, websiteSettings, contactSettings) => {
  const url = customSiteUrl || SEO_CONFIG.siteUrl;
  const name = websiteSettings?.name || SEO_CONFIG.siteName;
  const email = contactSettings?.email || SEO_CONFIG.contact.email;
  const phone = contactSettings?.phone || SEO_CONFIG.contact.phone;
  const locationDesc = contactSettings?.location || SEO_CONFIG.contact.location;
  const workingHours = contactSettings?.working_hours || SEO_CONFIG.contact.workingHours;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${url}/#professionalservice`,
    name: name,
    url: url,
    logo: getAbsoluteImageUrl(SEO_CONFIG.logoUrl),
    image: getAbsoluteImageUrl(SEO_CONFIG.ogImageUrl),
    description:
      websiteSettings?.short_description || SEO_CONFIG.defaultDescription,
    email: email,
    priceRange: '$$',
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: 'Prayagraj',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Uttar Pradesh',
      },
      {
        '@type': 'Country',
        name: 'India',
      },
      {
        '@type': 'Place',
        name: 'Global / Remote Service',
      },
    ],
    knowsLanguage: ['en', 'hi'],
  };

  if (phone) {
    schema.telephone = phone;
  }

  if (workingHours) {
    schema.openingHours = 'Mo-Sa 09:00-20:00';
  }

  if (locationDesc) {
    schema.address = {
      '@type': 'PostalAddress',
      addressLocality: SEO_CONFIG.contact.hubCity,
      addressRegion: SEO_CONFIG.contact.hubState,
      addressCountry: SEO_CONFIG.contact.hubCountry,
      description: locationDesc,
    };
  }

  return schema;
};

/**
 * Single Service Schema
 */
export const generateSingleServiceSchema = (service, customSiteUrl) => {
  if (!service) return null;
  const url = customSiteUrl || SEO_CONFIG.siteUrl;
  const serviceUrl = `${url}/services/${service.slug || service.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${serviceUrl}/#service`,
    name: service.title,
    serviceType: service.title,
    description: service.description || service.shortDescription,
    url: serviceUrl,
    provider: {
      '@id': `${url}/#organization`,
    },
    areaServed: ['Global', 'India', 'Uttar Pradesh', 'Prayagraj'],
    hasOfferCatalog: service.features && service.features.length > 0
      ? {
          '@type': 'OfferCatalog',
          name: `${service.title} Capabilities`,
          itemListElement: service.features.map((feat, idx) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: feat,
            },
            position: idx + 1,
          })),
        }
      : undefined,
  };
};

/**
 * FAQPage Schema
 */
export const generateFAQSchema = (faqs = []) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * BreadcrumbList Schema
 */
export const generateBreadcrumbSchema = (breadcrumbs = [], customSiteUrl) => {
  const url = customSiteUrl || SEO_CONFIG.siteUrl;

  const itemList = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: url,
    },
    ...breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 2,
      name: crumb.name,
      item: crumb.path.startsWith('http') ? crumb.path : `${url}${crumb.path.startsWith('/') ? '' : '/'}${crumb.path}`,
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itemList,
  };
};

/**
 * Project / Portfolio Collection Schema
 */
export const generateProjectsCollectionSchema = (projects = [], customSiteUrl) => {
  const url = customSiteUrl || SEO_CONFIG.siteUrl;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'iWAAT Client Projects & Engineering Case Studies',
    description:
      'Showcase of production-deployed web applications, healthcare platforms, non-profit portals, and digital software engineered by iWAAT.',
    url: `${url}/projects`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.slice(0, 20).map((proj, idx) => ({
        '@type': 'CreativeWork',
        position: idx + 1,
        name: proj.title,
        description: proj.description,
        url: proj.url && proj.url !== '#' ? proj.url : `${url}/projects`,
        genre: proj.category,
        image: getAbsoluteImageUrl(proj.preview_url || proj.image),
        creator: {
          '@id': `${url}/#organization`,
        },
      })),
    },
  };
};
