import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCMS } from '../cms/cmsContext';

export const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const { submitInquiry } = useCMS();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await submitInquiry({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        company: data.company || '',
        service: data.service,
        budget: data.budget || '$2,000 – $5,000',
        description: data.description,
      });

      // Fire celebratory confetti!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      alert('Error submitting inquiry: ' + err.message);
    }
  };

  return (
    <div className="glass-panel p-8 sm:p-10 rounded-3xl glow-card relative">
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
            Project Proposal Received!
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
            Thank you for reaching out to <span className="font-bold text-violet-500">iWAAt</span>. Our senior technical team has received your project details and will reply within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-600 text-white shadow-md hover:bg-violet-500 transition-colors"
          >
            Submit Another Project Inquiry
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-violet-500" />
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              Start Your Project Consultation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Your Full Name <span className="text-violet-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                {...register('name', { required: 'Name is required' })}
                className={`w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border ${
                  errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                } text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500 transition-colors`}
              />
              {errors.name && (
                <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Business Email <span className="text-violet-500">*</span>
              </label>
              <input
                type="email"
                placeholder="alex@company.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border ${
                  errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                } text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500 transition-colors`}
              />
              {errors.email && (
                <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Phone / WhatsApp Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register('phone')}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Company / Organization */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Company / Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Health / Studio X"
                {...register('company')}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Service Interested In */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Service Interested In <span className="text-violet-500">*</span>
              </label>
              <select
                {...register('service', { required: 'Please select a service' })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="">Select Primary Service...</option>
                <option value="Web Development">Web Development (React / Next.js)</option>
                <option value="Software Development">Custom Software & CRM/ERP</option>
                <option value="UI/UX Design">UI/UX Design & Prototyping</option>
                <option value="Digital Marketing">Digital Marketing & SEO</option>
                <option value="Branding & Identity">Branding & Visual Identity</option>
                <option value="Maintenance & Support">Maintenance & Support</option>
              </select>
              {errors.service && (
                <span className="text-xs text-red-500 mt-1 block">{errors.service.message}</span>
              )}
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Estimated Budget Range
              </label>
              <select
                {...register('budget')}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="$2,000 – $5,000">$2,000 – $5,000</option>
                <option value="$5,000 – $10,000">$5,000 – $10,000</option>
                <option value="$10,000 – $25,000">$10,000 – $25,000</option>
                <option value="$25,000+">$25,000+</option>
              </select>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Project Description / Goals <span className="text-violet-500">*</span>
            </label>
            <textarea
              rows="4"
              placeholder="Tell us about your project objectives, timeline, features, or design vision..."
              {...register('description', { required: 'Project description is required' })}
              className={`w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border ${
                errors.description ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
              } text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500 transition-colors`}
            />
            {errors.description && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 text-white font-bold text-base shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Sending Proposal...' : 'Send Project Proposal'}</span>
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      )}
    </div>
  );
};
