import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCMS } from '../cms/cmsContext';
import { BrandLockup } from './BrandLockup';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { projects, contactSettings, websiteSettings } = useCMS();

  const publishedProjects = projects.filter((p) => p.status === 'published').slice(0, 6);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  const socials = contactSettings?.socials || {
    linkedin: 'https://linkedin.com/company/iwaat',
    github: 'https://github.com/iwaat-agency',
    twitter: 'https://twitter.com/iwaat_digital',
    instagram: 'https://instagram.com/iwaat.digital',
  };

  return (
    <footer className="relative bg-[#070A14] dark:bg-[#070A14] text-slate-300 pt-20 pb-12 overflow-hidden border-t border-slate-800/80">
      {/* Subtle background mesh highlight */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-violet-600/10 via-orange-500/10 to-pink-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-flex">
              <BrandLockup layout="col" showMotto={true} className="items-start text-left" />
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {websiteSettings?.short_description ||
                'We design, develop, and market modern digital products—from high-conversion websites and software platforms to branding, SEO, and growth solutions.'}
            </p>

            {/* Newsletter form */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider block">
                Stay updated with digital insights
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thank you for subscribing to {websiteSettings?.name || 'iWAAT'} updates!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your business email"
                    required
                    className="w-full px-4 py-2.5 rounded-full bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-full bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-md shadow-violet-500/20 shrink-0 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 1: Company */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-violet-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/process" className="hover:text-violet-400 transition-colors">Our Process</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <span>Events & Sprints</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300">New</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-violet-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services/web-development" className="hover:text-violet-400 transition-colors">Web Development</Link>
              </li>
              <li>
                <Link to="/services/software-development" className="hover:text-violet-400 transition-colors">Software Development</Link>
              </li>
              <li>
                <Link to="/services/ui-ux-design" className="hover:text-violet-400 transition-colors">UI/UX Design</Link>
              </li>
              <li>
                <Link to="/services/digital-marketing" className="hover:text-violet-400 transition-colors">Digital Marketing & SEO</Link>
              </li>
              <li>
                <Link to="/services/branding" className="hover:text-violet-400 transition-colors">Branding & Identity</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Real Projects */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Featured Projects
            </h4>
            <ul className="space-y-2.5 text-sm">
              {publishedProjects.map((proj) => (
                <li key={proj.id}>
                  <a
                    href={proj.url || '#'}
                    target={proj.url && proj.url !== '#' ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="hover:text-violet-400 transition-colors flex items-center justify-between"
                  >
                    <span className="truncate max-w-[140px]">{proj.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">Live</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright & Socials */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="flex items-center gap-1">
            {websiteSettings?.copyright_text || '© 2026 iWAAT Digital Services. Crafted with '}
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 mx-1 inline" />
            <span>for global impact.</span>
          </p>

          <div className="flex items-center gap-4">
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-violet-400 hover:border-violet-500/40 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            )}

            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-violet-400 hover:border-violet-500/40 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
              </a>
            )}

            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-pink-400 hover:border-pink-500/40 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}

            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                aria-label="Twitter X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}

            {/* Portal Link */}
            <Link
              to="/super-admin/login"
              className="p-2 rounded-full bg-slate-900/60 border border-slate-800 text-slate-500 hover:text-violet-400 transition-colors ml-2"
              title="Super Admin Portal Login"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};
