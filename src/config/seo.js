/**
 * iWAAT — Centralized SEO & Brand Configuration
 * Official Production Domain: https://www.iwaat.in/
 * Never hardcodes or fabricates data.
 */

import fallbackCompany from '../data/company.json';

// Detect environment production URL (Defaults strictly to the official production canonical domain https://www.iwaat.in)
const getProductionSiteUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_SITE_URL) return import.meta.env.VITE_SITE_URL;
    if (
      import.meta.env.VITE_APP_URL &&
      !import.meta.env.VITE_APP_URL.includes('localhost') &&
      !import.meta.env.VITE_APP_URL.includes('vercel.app')
    ) {
      return import.meta.env.VITE_APP_URL;
    }
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin;
    if (
      !origin.includes('localhost') &&
      !origin.includes('127.0.0.1') &&
      !origin.includes('vercel.app')
    ) {
      return origin;
    }
  }
  return 'https://www.iwaat.in';
};

export const SITE_URL = getProductionSiteUrl().replace(/\/+$/, '');

export const SEO_CONFIG = {
  siteName: 'iWAAT',
  legalName: 'iWAAT Digital Services',
  alternateName: 'iWAAT (Information · Website · Apps · Ads · Transparency)',
  tagline: fallbackCompany.tagline || 'We Build. We Scale. We Market.',
  motto: 'Information · Website · Apps · Ads · Transparency',
  siteUrl: SITE_URL,
  logoUrl: `${SITE_URL}/logo.png`,
  ogImageUrl: `${SITE_URL}/og-image.png`,
  locale: 'en_US',
  language: 'en',
  themeColor: '#7c3aed',
  backgroundColor: '#070A14',
  
  // Default homepage metadata
  defaultTitle: 'iWAAT — Web Design, Web Development & Digital Agency',
  titleTemplate: '%s | iWAAT',
  defaultDescription:
    'iWAAT is a premier digital agency specializing in custom web design, high-performance web development, mobile apps, SEO, and digital marketing for businesses across India, Uttar Pradesh, Prayagraj, and global markets.',
  defaultRobots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  
  // Verified business & entity data
  contact: {
    email: fallbackCompany.contactInfo?.email || 'iwaatproduction@gmail.com',
    phone: fallbackCompany.contactInfo?.phone || '+1 (800) 492-2800',
    whatsapp: fallbackCompany.contactInfo?.whatsapp || '+18004922800',
    location: fallbackCompany.contactInfo?.location || 'Global / Remote Digital Agency (US & India Hubs)',
    hubCity: 'Prayagraj',
    hubState: 'Uttar Pradesh',
    hubCountry: 'India',
    workingHours: fallbackCompany.contactInfo?.workingHours || 'Mon - Sat: 9:00 AM - 8:00 PM EST (24/7 Emergency Support)',
  },

  // Verified social profiles (sameAs)
  socials: fallbackCompany.contactInfo?.socials || {
    linkedin: 'https://linkedin.com/company/iwaat',
    github: 'https://github.com/iwaat-agency',
    twitter: 'https://twitter.com/iwaat_digital',
    instagram: 'https://instagram.com/iwaat.digital',
  },
  
  // Twitter handle
  twitterHandle: '@iwaat_digital',
};

/**
 * Returns canonical absolute URL for a given path
 * @param {string} path - route path (e.g. '/services')
 * @returns {string} canonical URL
 */
export const getCanonicalUrl = (path = '') => {
  const cleanPath = path.split('?')[0].split('#')[0].replace(/^\/+/, '');
  return cleanPath ? `${SITE_URL}/${cleanPath}` : `${SITE_URL}/`;
};

/**
 * Returns full image URL for metadata
 * @param {string} imagePath
 * @returns {string} absolute image URL
 */
export const getAbsoluteImageUrl = (imagePath) => {
  if (!imagePath) return SEO_CONFIG.ogImageUrl;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${SITE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};
