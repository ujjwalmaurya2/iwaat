import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar,
  User,
  Search,
  Tag,
  ArrowUpRight,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { getCanonicalUrl } from '../config/seo';
import { SectionHeader } from '../components/SectionHeader';
import { GlassCard } from '../components/GlassCard';
import { generateBreadcrumbSchema } from '../utils/seoSchema';
import articlesData from '../data/articles.json';

export const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    ...Array.from(new Set(articlesData.map((a) => a.category))),
  ];

  const filteredArticles = articlesData.filter((art) => {
    const matchesCategory =
      selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Resources & Insights', path: '/resources' },
  ]);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'iWAAT Engineering Insights, Guides & Industry Resources',
    description:
      'Explore actionable guides on web development costs, hiring agencies in Prayagraj, mobile responsiveness, and SEO strategies for growing businesses.',
    url: getCanonicalUrl('/resources'),
  };

  return (
    <div className="pt-24 md:pt-36 pb-20 space-y-20">
      {/* Dynamic SEO Meta & Structured Data */}
      <SEO
        title="Resources & Insights — Web Development & Digital Strategy Guides | iWAAT"
        description="Explore actionable guides on website costs in Prayagraj, web agency selection, mobile-first design, and organic SEO strategies by iWAAT."
        canonicalUrl={getCanonicalUrl('/resources')}
        schema={[collectionSchema, breadcrumbSchema]}
      />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeader
          badge="Knowledge & Guides"
          title="Actionable Insights on Web Engineering &"
          highlight="Digital Growth"
          subtitle="Explore in-depth educational resources written by our software engineers and designers to help business owners make smart digital investments."
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel glow-card">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              to={`/resources/${article.slug || article.id}`}
              className="group block"
            >
              <GlassCard glow={true} className="h-full flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/30">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-violet-500" />
                    <span>{article.author}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-violet-500 group-hover:translate-x-1 transition-transform">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
