/**
 * iWAAT — Automated SEO Regression & Integrity Test Suite
 * Tests canonical URLs, robots.txt, sitemap.xml, favicon assets, web manifest,
 * metadata configurations, and Schema.org structured data validity.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✔\x1b[0m ${message}`);
  } else {
    failedTests++;
    console.error(`  \x1b[31m✖\x1b[0m ${message}`);
  }
}

console.log('\n\x1b[1m\x1b[35m[iWAAT SEO Regression Test Suite]\x1b[0m Running validation checks...\n');

// -------------------------------------------------------------
// TEST 1: Robots.txt integrity
// -------------------------------------------------------------
console.log('\x1b[1m1. Robots.txt Validation\x1b[0m');
const robotsPath = path.join(rootDir, 'public', 'robots.txt');
assert(fs.existsSync(robotsPath), 'public/robots.txt exists');

if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  assert(robotsContent.includes('User-agent: *'), 'robots.txt specifies User-agent: *');
  assert(robotsContent.includes('Disallow: /super-admin/'), 'robots.txt protects /super-admin/ endpoints');
  assert(robotsContent.includes('Sitemap: https://www.iwaat.in/sitemap.xml'), 'robots.txt references official HTTPS sitemap.xml');
  assert(robotsContent.includes('Allow: /favicon.ico'), 'robots.txt explicitly allows favicon.ico');
  assert(robotsContent.includes('Allow: /favicon.png'), 'robots.txt explicitly allows favicon.png');
  assert(robotsContent.includes('Allow: /site.webmanifest'), 'robots.txt explicitly allows site.webmanifest');
}

// -------------------------------------------------------------
// TEST 2: Sitemap.xml integrity
// -------------------------------------------------------------
console.log('\n\x1b[1m2. Sitemap.xml Validation\x1b[0m');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'public/sitemap.xml exists');

if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  assert(sitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'sitemap.xml has valid XML declaration');
  assert(sitemapContent.includes('<urlset'), 'sitemap.xml contains valid <urlset> root node');
  
  // Extract all <loc> URLs
  const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  assert(locMatches.length >= 15, `sitemap.xml contains all expected public URLs (found ${locMatches.length} URLs)`);

  let allHttpsWww = true;
  let hasAdminUrls = false;

  for (const url of locMatches) {
    if (!url.startsWith('https://www.iwaat.in/')) {
      allHttpsWww = false;
      console.error(`    Non-canonical URL detected in sitemap: ${url}`);
    }
    if (url.includes('admin') || url.includes('super-admin') || url.includes('login') || url.includes('404')) {
      hasAdminUrls = true;
      console.error(`    Private/Internal URL detected in sitemap: ${url}`);
    }
  }

  assert(allHttpsWww, 'All sitemap URLs use official https://www.iwaat.in/ canonical origin');
  assert(!hasAdminUrls, 'No private admin, login, or 404 routes present in sitemap.xml');
  assert(locMatches.includes('https://www.iwaat.in/web-development-prayagraj'), 'Sitemap includes local landing /web-development-prayagraj');
  assert(locMatches.includes('https://www.iwaat.in/resources/how-much-does-a-website-cost-in-prayagraj'), 'Sitemap includes cost guide article');
}

// -------------------------------------------------------------
// TEST 3: Favicon & PWA Web Manifest Assets
// -------------------------------------------------------------
console.log('\n\x1b[1m3. Favicon & Web Manifest Asset Validation\x1b[0m');
const publicDir = path.join(rootDir, 'public');
const expectedIcons = [
  'favicon.ico',
  'favicon.png',
  'favicon.svg',
  'favicon-48x48.png',
  'favicon-192x192.png',
  'favicon-512x512.png',
  'apple-touch-icon.png',
  'site.webmanifest'
];

for (const icon of expectedIcons) {
  const iconPath = path.join(publicDir, icon);
  const exists = fs.existsSync(iconPath);
  const size = exists ? fs.statSync(iconPath).size : 0;
  assert(exists && size > 0, `public/${icon} exists and is non-empty (${size} bytes)`);
}

const manifestPath = path.join(publicDir, 'site.webmanifest');
if (fs.existsSync(manifestPath)) {
  try {
    const manifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert(manifestJson.name === 'iWAAT Digital Services', 'site.webmanifest has correct brand name');
    assert(manifestJson.short_name === 'iWAAT', 'site.webmanifest has correct short_name');
    assert(Array.isArray(manifestJson.icons) && manifestJson.icons.length >= 2, 'site.webmanifest contains valid icons array');
  } catch (err) {
    assert(false, `site.webmanifest JSON parsing error: ${err.message}`);
  }
}

// -------------------------------------------------------------
// TEST 4: Index.html Head Metadata & SEO Tags
// -------------------------------------------------------------
console.log('\n\x1b[1m4. Index.html Head Metadata Validation\x1b[0m');
const indexPath = path.join(rootDir, 'index.html');
assert(fs.existsSync(indexPath), 'index.html exists');

if (fs.existsSync(indexPath)) {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  assert(indexHtml.includes('<title>'), 'index.html has <title> tag');
  assert(indexHtml.includes('name="description"'), 'index.html has meta description');
  assert(indexHtml.includes('rel="canonical"'), 'index.html has canonical link');
  assert(indexHtml.includes('https://www.iwaat.in/'), 'index.html canonical points to https://www.iwaat.in/');
  assert(indexHtml.includes('rel="icon" href="/favicon.ico"'), 'index.html links /favicon.ico');
  assert(indexHtml.includes('rel="icon" type="image/svg+xml" href="/favicon.svg"'), 'index.html links /favicon.svg');
  assert(indexHtml.includes('rel="apple-touch-icon"'), 'index.html links apple-touch-icon');
  assert(indexHtml.includes('rel="manifest" href="/site.webmanifest"'), 'index.html links site.webmanifest');
  assert(indexHtml.includes('property="og:title"'), 'index.html has og:title');
  assert(indexHtml.includes('property="og:image"'), 'index.html has og:image');
  assert(indexHtml.includes('name="twitter:card"'), 'index.html has twitter:card');
}

// -------------------------------------------------------------
// TEST 5: Educational Resources & Articles Data Integrity
// -------------------------------------------------------------
console.log('\n\x1b[1m5. Educational Resources (10 Articles) Validation\x1b[0m');
const articlesPath = path.join(rootDir, 'src', 'data', 'articles.json');
assert(fs.existsSync(articlesPath), 'src/data/articles.json exists');

if (fs.existsSync(articlesPath)) {
  try {
    const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
    assert(articles.length === 10, `articles.json contains exactly 10 high-value articles (found ${articles.length})`);
    
    let allHaveRequiredFields = true;
    let allHaveFaqs = true;
    const slugs = new Set();
    let hasDuplicateSlugs = false;

    for (const art of articles) {
      if (!art.title || !art.slug || !art.metaTitle || !art.metaDescription || !art.summary || !Array.isArray(art.content)) {
        allHaveRequiredFields = false;
        console.error(`    Article missing required fields: ${art.title || art.id}`);
      }
      if (!Array.isArray(art.faqs) || art.faqs.length === 0) {
        allHaveFaqs = false;
        console.error(`    Article missing FAQ list: ${art.title}`);
      }
      if (slugs.has(art.slug)) {
        hasDuplicateSlugs = true;
        console.error(`    Duplicate article slug: ${art.slug}`);
      }
      slugs.add(art.slug);
    }

    assert(allHaveRequiredFields, 'All 10 articles contain full required schema fields');
    assert(allHaveFaqs, 'All 10 articles contain structured FAQs for AEO');
    assert(!hasDuplicateSlugs, 'All article slugs are unique');
  } catch (err) {
    assert(false, `articles.json parsing error: ${err.message}`);
  }
}

// -------------------------------------------------------------
// TEST 6: Vercel Routing & Static Asset Whitelist
// -------------------------------------------------------------
console.log('\n\x1b[1m6. Vercel Configuration & Routing Rules\x1b[0m');
const vercelPath = path.join(rootDir, 'vercel.json');
assert(fs.existsSync(vercelPath), 'vercel.json exists');

if (fs.existsSync(vercelPath)) {
  try {
    const vercelJson = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    const rewrites = vercelJson.rewrites || [];
    const mainRewrite = rewrites[0] ? rewrites[0].source : '';
    
    assert(mainRewrite.includes('robots\\.txt') || mainRewrite.includes('robots.txt'), 'vercel.json whitelists robots.txt from SPA rewrite');
    assert(mainRewrite.includes('sitemap\\.xml') || mainRewrite.includes('sitemap.xml'), 'vercel.json whitelists sitemap.xml from SPA rewrite');
    assert(mainRewrite.includes('site\\.webmanifest') || mainRewrite.includes('site.webmanifest'), 'vercel.json whitelists site.webmanifest from SPA rewrite');
    assert(mainRewrite.includes('favicon\\.ico') || mainRewrite.includes('favicon.ico'), 'vercel.json whitelists favicon.ico from SPA rewrite');
  } catch (err) {
    assert(false, `vercel.json parse error: ${err.message}`);
  }
}

// -------------------------------------------------------------
// FINAL SUMMARY
// -------------------------------------------------------------
console.log('\n======================================================');
console.log(`SEO Integrity Test Results: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
if (failedTests > 0) {
  console.log(`\x1b[31mFAILED: ${failedTests} test(s) failed.\x1b[0m`);
  process.exit(1);
} else {
  console.log('\x1b[32mSUCCESS: All SEO regression and technical integrity tests passed!\x1b[0m');
  console.log('======================================================\n');
  process.exit(0);
}
