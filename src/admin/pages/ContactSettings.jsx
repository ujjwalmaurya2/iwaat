import React, { useState, useEffect } from 'react';
import { PhoneCall, Mail, Phone, MapPin, Clock, Save, CheckCircle2, Globe, MessageSquare } from 'lucide-react';
import { useCMS } from '../../cms/cmsContext';

export const ContactSettings = () => {
  const { contactSettings, updateContactSettings } = useCMS();

  const [email, setEmail] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  // Socials
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (contactSettings) {
      setEmail(contactSettings.email || '');
      setSecondaryEmail(contactSettings.secondary_email || '');
      setPhone(contactSettings.phone || '');
      setSecondaryPhone(contactSettings.secondary_phone || '');
      setWhatsapp(contactSettings.whatsapp || '');
      setLocation(contactSettings.location || '');
      setWorkingHours(contactSettings.working_hours || '');
      setAddress(contactSettings.address || '');
      setCity(contactSettings.city || '');
      setState(contactSettings.state || '');
      setCountry(contactSettings.country || '');
      if (contactSettings.socials) {
        setLinkedin(contactSettings.socials.linkedin || '');
        setGithub(contactSettings.socials.github || '');
        setTwitter(contactSettings.socials.twitter || '');
        setInstagram(contactSettings.socials.instagram || '');
      }
    }
  }, [contactSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateContactSettings({
        email,
        secondary_email: secondaryEmail,
        phone,
        secondary_phone: secondaryPhone,
        whatsapp,
        location,
        working_hours: workingHours,
        address,
        city,
        state,
        country,
        socials: {
          linkedin,
          github,
          twitter,
          instagram,
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      alert('Error updating contact settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-white">Contact Information Settings</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Update agency contact emails, phone numbers, WhatsApp, and social media handles. Public pages update immediately.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Contact settings updated and synced across all public website sections!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Email & Phone */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-6">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-violet-400" />
            <span>Email & Telephone Lines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Primary Business Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Secondary / Support Email</label>
              <input
                type="email"
                value={secondaryEmail}
                onChange={(e) => setSecondaryEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Primary Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">WhatsApp Direct Number</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+18004922800"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Location & Hours */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-6">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>Office Location & Working Hours</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">Headline Location Description</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">Working Hours String</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1020]/90 border border-slate-800 space-y-6">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Official Social Media Profiles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">LinkedIn URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/iwaat"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">GitHub Organization URL</label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/iwaat-agency"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Twitter / X URL</label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/iwaat_digital"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Instagram URL</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/iwaat.digital"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
