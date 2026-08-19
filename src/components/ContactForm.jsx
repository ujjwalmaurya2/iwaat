import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { useCMS } from '../cms/cmsContext';

// Helper to sanitize text fields and remove non-printable control characters
const sanitizeText = (val, maxLen = 100) => {
  if (!val || typeof val !== 'string') return '';
  return val
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // strip control chars cleanly
    .trim()
    .slice(0, maxLen);
};

export const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const lastSubmitTimeRef = useRef(0);
  const { submitInquiry } = useCMS();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      budget: '$2,000 – $5,000',
      customBudget: '',
      hp_website_url: '', // Honeypot field for bot detection
    },
  });

  const selectedBudget = watch('budget');

  // Automatically clear custom budget input when a predefined option is chosen
  useEffect(() => {
    if (selectedBudget !== 'Custom Budget') {
      setValue('customBudget', '');
      clearErrors('customBudget');
    }
  }, [selectedBudget, setValue, clearErrors]);

  const onSubmit = async (data) => {
    setSubmissionError(null);

    // 1. Honeypot check: If the hidden honeypot field is filled, silently drop bot submission
    if (data.hp_website_url) {
      console.warn('[Security] Honeypot triggered; discarding automated bot submission.');
      setSubmitted(true);
      reset();
      return;
    }

    // 2. Client-side cooldown / rate-limiting (10 seconds between submissions)
    const now = Date.now();
    const timeSinceLastSubmit = (now - lastSubmitTimeRef.current) / 1000;
    if (timeSinceLastSubmit < 10 && lastSubmitTimeRef.current !== 0) {
      const waitTime = Math.ceil(10 - timeSinceLastSubmit);
      setSubmissionError(`Please wait ${waitTime}s before sending another proposal.`);
      return;
    }

    try {
      let finalBudget = data.budget || '$2,000 – $5,000';
      if (data.budget === 'Custom Budget') {
        const customText = sanitizeText(data.customBudget, 80);
        finalBudget = customText ? `Custom Budget: ${customText}` : 'Custom Budget';
      } else {
        finalBudget = sanitizeText(data.budget, 40);
      }

      const sanitizedData = {
        name: sanitizeText(data.name, 100),
        email: sanitizeText(data.email, 120),
        phone: sanitizeText(data.phone || '', 30),
        company: sanitizeText(data.company || '', 100),
        service: sanitizeText(data.service, 60),
        budget: finalBudget,
        description: sanitizeText(data.description, 3000),
      };

      if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.description) {
        setSubmissionError('Please complete all required fields.');
        return;
      }

      await submitInquiry(sanitizedData);

      lastSubmitTimeRef.current = Date.now();

      // Dynamic import of celebratory confetti to keep initial bundle lean
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (_) {}

      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setSubmissionError(err.message || 'Failed to submit inquiry. Please try again.');
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
            Thank you for reaching out to <span className="font-bold text-violet-500">iWAAT</span>. Our senior technical team has received your project details and will reply within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            aria-label="Submit another project inquiry"
            className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-600 text-white shadow-md hover:bg-violet-500 transition-colors cursor-pointer"
          >
            Submit Another Project Inquiry
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Honeypot field - invisible to genuine human visitors, traps automated bots */}
          <div aria-hidden="true" className="opacity-0 absolute -left-[9999px] w-0 h-0 overflow-hidden pointer-events-none select-none">
            <label htmlFor="hp_website_url">Leave this field blank</label>
            <input
              id="hp_website_url"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register('hp_website_url')}
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-violet-500" />
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              Start Your Project Consultation
            </h3>
          </div>

          {submissionError && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submissionError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label htmlFor="contact_form_name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Your Full Name <span className="text-violet-500">*</span>
              </label>
              <input
                id="contact_form_name"
                type="text"
                placeholder="e.g. Alex Morgan"
                maxLength={100}
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
              <label htmlFor="contact_form_email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Business Email <span className="text-violet-500">*</span>
              </label>
              <input
                id="contact_form_email"
                type="email"
                placeholder="alex@company.com"
                maxLength={120}
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
              <label htmlFor="contact_form_phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Phone / WhatsApp Number
              </label>
              <input
                id="contact_form_phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                maxLength={30}
                {...register('phone')}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Company / Organization */}
            <div>
              <label htmlFor="contact_form_company" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Company / Organization
              </label>
              <input
                id="contact_form_company"
                type="text"
                placeholder="e.g. Apex Health / Studio X"
                maxLength={100}
                {...register('company')}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Service Interested In */}
            <div>
              <label htmlFor="contact_form_service" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Service Interested In <span className="text-violet-500">*</span>
              </label>
              <select
                id="contact_form_service"
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
              <label htmlFor="contact_form_budget" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Estimated Budget Range
              </label>
              <select
                id="contact_form_budget"
                {...register('budget')}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="$2,000 – $5,000">$2,000 – $5,000</option>
                <option value="$5,000 – $10,000">$5,000 – $10,000</option>
                <option value="$10,000 – $25,000">$10,000 – $25,000</option>
                <option value="$25,000+">$25,000+</option>
                <option value="Custom Budget">Custom Budget</option>
              </select>

              {/* Conditional Custom Budget Input */}
              <AnimatePresence>
                {selectedBudget === 'Custom Budget' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <label htmlFor="contact_form_custom_budget" className="sr-only">Enter custom budget</label>
                    <input
                      id="contact_form_custom_budget"
                      type="text"
                      placeholder="Enter your custom budget"
                      maxLength={80}
                      {...register('customBudget')}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="contact_form_description" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Project Description / Goals <span className="text-violet-500">*</span>
            </label>
            <textarea
              id="contact_form_description"
              rows="4"
              placeholder="Tell us about your project objectives, timeline, features, or design vision..."
              maxLength={3000}
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
            aria-label="Send Project Proposal"
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
