import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO_CONFIG, getCanonicalUrl, getAbsoluteImageUrl } from '../config/seo';

/**
 * Helper to update or create a meta tag
 */
const setMetaTag = (attributeName, attributeValue, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

/**
 * Helper to update or create a link tag (e.g. canonical)
 */
const setLinkTag = (rel, href) => {
  if (!href) return;
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

/**
 * Custom React SEO component for per-route dynamic metadata and Schema.org JSON-LD
 */
export const SEO = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noindex = false,
  schema = null,
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Title formatting
    const rawTitle = title || SEO_CONFIG.defaultTitle;
    const finalTitle =
      rawTitle.includes(SEO_CONFIG.siteName) || rawTitle.includes('404')
        ? rawTitle
        : `${rawTitle} | ${SEO_CONFIG.siteName}`;
    document.title = finalTitle;

    // 2. Meta description
    const finalDescription = description || SEO_CONFIG.defaultDescription;
    setMetaTag('name', 'description', finalDescription);

    // 3. Robots directive
    const finalRobots = noindex
      ? 'noindex, nofollow'
      : SEO_CONFIG.defaultRobots;
    setMetaTag('name', 'robots', finalRobots);
    setMetaTag('name', 'googlebot', finalRobots);

    // 4. Canonical URL
    const finalCanonical = canonicalUrl || getCanonicalUrl(location.pathname);
    setLinkTag('canonical', finalCanonical);

    // 5. Open Graph
    const finalOgImage = getAbsoluteImageUrl(ogImage || SEO_CONFIG.ogImageUrl);
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:image', finalOgImage);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', SEO_CONFIG.siteName);
    setMetaTag('property', 'og:locale', SEO_CONFIG.locale);

    // 6. Twitter / X Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDescription);
    setMetaTag('name', 'twitter:image', finalOgImage);
    if (SEO_CONFIG.twitterHandle) {
      setMetaTag('name', 'twitter:site', SEO_CONFIG.twitterHandle);
    }

    // 7. Schema.org JSON-LD structured data injection
    const existingScript = document.getElementById('iwaat-jsonld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'iwaat-jsonld-schema';
      script.type = 'application/ld+json';
      
      // If array of schemas or single schema
      const schemaData = Array.isArray(schema)
        ? {
            '@context': 'https://schema.org',
            '@graph': schema.filter(Boolean),
          }
        : schema;

      script.text = JSON.stringify(schemaData, null, 2);
      document.head.appendChild(script);
    }

    return () => {
      // Optional cleanup on unmount
      const schemaScript = document.getElementById('iwaat-jsonld-schema');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [title, description, canonicalUrl, ogImage, ogType, noindex, schema, location.pathname]);

  return null;
};

export default SEO;
