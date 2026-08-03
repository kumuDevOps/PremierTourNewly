import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  HelpCircle, 
  ChevronDown, 
  MessageCircle,
  Map 
} from 'lucide-react';
import { useLanguage } from '../lib/i18n.tsx';

export default function ContactView() {
  const { translate } = useLanguage();
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // FAQ Accordion state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      if (res.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        alert('Could not submit contact request. Try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "What is your refund and cancellation policy?",
      a: "Our tours and holiday packages are fully flexible. You can cancel or make changes to your booking dates up to 14 days prior to departure without incurring any cancellation fees from Premier Tour. Air ticket refunds are subject to individual carrier guidelines."
    },
    {
      q: "How do I receive my booking confirmations and travel vouchers?",
      a: "Once you complete your payment on Premier Tour Booking, a confirmation email with your digital itinerary, e-tickets, and rental vouchers will be sent instantly to your registered email address. You can also view, print, and track all your active booking history from your Customer Dashboard."
    },
    {
      q: "Are flights and accommodations ATOL protected?",
      a: "Yes! All flight packages, holidays, and hotel stays arranged through Premier Tour Booking are fully protected under our ABTA and ATOL Bonding certifications, ensuring complete financial security for your journey."
    },
    {
      q: "Do you offer customizable travel dates and layouts?",
      a: "Absolutely. If you require specialized dates, custom hotel room configurations, multi-destination stopovers, or private charter vehicle setups, please submit a Contact Form or contact our 24/7 travel desk at +94 76 166 8155."
    },
    {
      q: "What documentation do I need for vehicle rental collections?",
      a: "You must present a valid passport, a driver's license held for a minimum of 1 year, and a valid Credit Card under the main driver's name. Renters must be 21 years or older, and some performance vehicle tiers require an age of 25."
    }
  ];

  return (
    <div id="contact-view" className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pb-20 transition-colors">
      
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-14 border-b border-slate-800 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1200&q=80" alt="Contact banner" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{translate('Connect With Us')}</h1>
          <p className="text-xs text-gray-400 max-w-md mx-auto">{translate('Get in touch with our global travel desks or find answers to your reservation queries.')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Col: Contact Info, Office, WhatsApp (5 cols) */}
          <div className="lg:col-span-5 space-y-6 ltr:text-left rtl:text-right">
            
            {/* Quick Contact Info */}
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 space-y-6 animate-blue-glow">
              <h3 className="font-black text-gray-900 dark:text-white text-base flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0091EA] animate-ping" />
                {translate('Global Help Centers')}
              </h3>
              
              <div className="space-y-4 text-xs font-semibold text-gray-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gradient-to-tr from-[#0091EA] via-sky-500 to-cyan-400 text-white rounded-xl shadow-md shadow-sky-500/20">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sky-800 dark:text-sky-300 text-[10px] uppercase font-black tracking-wider">{translate('Phone Support (24/7)')}</p>
                    <a href="tel:+94761668155" className="text-sm font-black text-gray-900 dark:text-white hover:text-[#0091EA] transition-colors mt-0.5 block">+94 76 166 8155</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-xl shadow-md shadow-emerald-500/20">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-emerald-700 dark:text-emerald-400 text-[10px] uppercase font-black tracking-wider">{translate('WhatsApp Concierge')}</p>
                    <a href="https://wa.me/94761668155" target="_blank" rel="noopener noreferrer" className="text-sm font-black text-emerald-600 hover:underline mt-0.5 block">{translate('Chat on WhatsApp')} (+94 76 166 8155)</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 text-white rounded-xl shadow-md shadow-sky-500/20">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sky-800 dark:text-sky-300 text-[10px] uppercase font-black tracking-wider">{translate('Email Inquiry')}</p>
                    <a href="mailto:support@premiertourbooking.com" className="text-sm font-black text-gray-900 dark:text-white hover:text-[#0091EA] transition-colors mt-0.5 block">support@premiertour.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Hours */}
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 space-y-6 animate-blue-glow">
              <h3 className="font-black text-gray-900 dark:text-white text-base">{translate('Premier Digital Head Office')}</h3>

              <div className="space-y-4 text-xs font-semibold text-gray-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 dark:bg-orange-950/40 text-orange-600 rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-400 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">{translate('Office Address')}</p>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">{translate('Premier Digital, Colombo, Sri Lanka')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-50 dark:bg-teal-950/40 text-teal-600 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-400 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">{translate('Business Hours')}</p>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">{translate('Monday – Friday: 08:30 – 17:30')} <br />{translate('Saturday: 09:00 – 13:00 (IST)')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map View */}
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 space-y-4 animate-blue-glow">
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent font-black">{translate('Premier Digital - Colombo Location')}</span>
                <span className="text-emerald-500 flex items-center gap-1.5 font-black text-[10px] bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {translate('Active Office')}
                </span>
              </div>
              <div className="relative h-64 w-full bg-slate-900 rounded-2xl overflow-hidden border-2 border-sky-400/40 shadow-inner group">
                <iframe
                  title="Premier Digital Colombo Google Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=Premier+Digital,+Colombo,+Sri+Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full rounded-2xl filter contrast-[1.02]"
                />
                
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Premier+Digital+Colombo+Sri+Lanka" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-slate-950/90 hover:bg-[#0091EA] text-white px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border border-sky-400/40 transition-all flex items-center gap-1.5 cursor-pointer z-10"
                >
                  <MapPin className="w-3 h-3 text-sky-400 group-hover:text-white" />
                  <span>{translate('Open in Google Maps')}</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Col: Contact Form & FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-8 ltr:text-left rtl:text-right">
            
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 md:p-8 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 animate-blue-glow">
              <h3 className="font-black text-gray-900 dark:text-white text-base mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0091EA] animate-ping" />
                <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent">
                  {translate('Send An Inquiry Message')}
                </span>
              </h3>

              {success ? (
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{translate('Message Submitted!')}</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                    {translate('Thank you. We have securely logged your communication. A travel consultant will contact you via email or phone within 4 to 8 hours.')}
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-slate-850 dark:hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    {translate('Send Another Message')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate('Your Name')}</label>
                      <input
                        type="text"
                        required
                        placeholder="Sarah Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-[#0091EA] focus:outline-none rounded-xl text-xs text-slate-700 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate('Email Address')}</label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-[#0091EA] focus:outline-none rounded-xl text-xs text-slate-700 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate('Mobile Phone (Optional)')}</label>
                      <input
                        type="tel"
                        placeholder="+44 7911 123456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full mt-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-[#0091EA] focus:outline-none rounded-xl text-xs text-slate-700 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate('Subject')}</label>
                      <input
                        type="text"
                        required
                        placeholder={translate("e.g. Booking Reservation Correction")}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full mt-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-[#0091EA] focus:outline-none rounded-xl text-xs text-slate-700 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate('Your Message')}</label>
                    <textarea
                      required
                      rows={5}
                      placeholder={translate("Please specify dates, passenger details, or custom booking needs...")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA] focus:outline-none rounded-xl text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/25 animate-light-blue-pulse cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? translate('Submitting message...') : translate('Submit Inquiry Form')}
                  </button>

                </form>
              )}

            </div>

            {/* FAQ Accordion Section */}
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 md:p-8 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 space-y-6 animate-blue-glow">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#0091EA]" />
                <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent">
                  {translate('Frequently Asked Questions')}
                </span>
              </h3>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-2 border-sky-100 dark:border-sky-900/50 rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-950/40 shadow-xs hover:border-sky-300 dark:hover:border-sky-700 transition-all">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full px-5 py-4 flex items-center justify-between ltr:text-left rtl:text-right font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-sky-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="pr-4 leading-relaxed font-extrabold text-slate-800 dark:text-slate-100">{translate(faq.q)}</span>
                      <ChevronDown className={`w-4 h-4 shrink-0 text-sky-500 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-[#0091EA]' : ''}`} />
                    </button>

                    {activeFaq === idx && (
                      <div className="px-5 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium pt-2 border-t border-sky-100 dark:border-sky-900/40 bg-sky-50/30 dark:bg-slate-900/80">
                        {translate(faq.a)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
