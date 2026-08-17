import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Share2,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { getCanonicalUrl } from '../config/seo';
import { MagneticButton } from '../components/MagneticButton';
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '../utils/seoSchema';
import articlesData from '../data/articles.json';

export const ResourceArticle = () => {
  const { slug } = useParams();

  const article = articlesData.find((a) => (a.slug || a.id) === slug);

  if (!article) {
    return <Navigate to="/resources" replace />;
  }

  const articleSchema = generateArticleSchema(article);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Resources', path: '/resources' },
    { name: article.title, path: `/resources/${article.slug || article.id}` },
  ]);
  const faqSchema = article.faqs ? generateFAQSchema(article.faqs) : null;

  const relatedArticles = articlesData
    .filter((a) => (a.slug || a.id) !== (article.slug || article.id))
    .slice(0, 2);

  return (
    <div className="pt-24 md:pt-36 pb-20 space-y-16">
      {/* Dynamic SEO Meta & Schema */}
      <SEO
        title={article.metaTitle || `${article.title} | iWAAT Insights`}
        description={article.metaDescription || article.summary}
        canonicalUrl={getCanonicalUrl(`/resources/${article.slug || article.id}`)}
        schema={[articleSchema, breadcrumbSchema, faqSchema].filter(Boolean)}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Link to="/" className="hover:text-violet-500 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/resources" className="hover:text-violet-500 transition-colors">
            Resources
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white line-clamp-1">{article.title}</span>
        </nav>
      </div>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/30">
            {article.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime}</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{article.publishedDate}</span>
          </span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed border-l-2 border-violet-500 pl-4 py-1 italic bg-violet-500/5 rounded-r-xl">
          {article.summary}
        </p>

        <div className="pt-2 flex items-center justify-between border-y border-slate-200/60 dark:border-slate-800/80 py-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2 font-medium">
            <User className="w-4 h-4 text-violet-500" />
            <span>Written by {article.author}</span>
          </span>

          <Link to="/resources" className="hover:text-violet-500 flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Guides</span>
          </Link>
        </div>
      </div>

      {/* Main Article Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl glow-card space-y-8">
          {article.content.map((block, idx) => {
            if (block.type === 'heading') {
              return (
                <h2
                  key={idx}
                  className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white pt-4 first:pt-0"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'paragraph') {
              return (
                <p
                  key={idx}
                  className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed"
                >
                  {block.text}
                </p>
              );
            }
            if (block.type === 'list') {
              return (
                <div key={idx} className="space-y-4 pt-2">
                  {block.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                      <div>
                        {item.split('**').map((part, pIdx) =>
                          pIdx % 2 === 1 ? (
                            <strong key={pIdx} className="text-slate-900 dark:text-white font-semibold">
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* FAQs Section */}
      {article.faqs && article.faqs.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-violet-500" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-4">
            {article.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel glow-card space-y-2 border border-slate-200/60 dark:border-slate-800"
              >
                <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                  {faq.question}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Internal Links & CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl glow-card text-center space-y-6">
          <h3 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
            Need Expert Web Development Advice?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
            Discuss your website architecture, tech stack, or local SEO strategy with the iWAAT engineering team in Prayagraj.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact">
              <MagneticButton variant="primary">
                <span>Start Free Project Consultation</span>
              </MagneticButton>
            </Link>
            <Link to="/web-development-prayagraj">
              <MagneticButton variant="glass">
                <span>Prayagraj Services</span>
              </MagneticButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceArticle;
