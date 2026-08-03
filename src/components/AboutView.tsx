import React from 'react';
import { useLanguage } from '../lib/i18n.tsx';
import { 
  Users, 
  MapPin, 
  ShieldCheck, 
  Coins, 
  HelpCircle, 
  Compass, 
  Award,
  Globe,
  Smile,
  Zap,
  Sparkles
} from 'lucide-react';

export default function AboutView() {
  const { translate } = useLanguage();

  return (
    <div id="about-view" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors pb-16">
      
      {/* 1. HERO BANNER WITH BLUE GLOW CARD STYLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-[36px] overflow-hidden border-2 border-sky-400/60 dark:border-sky-500/60 bg-slate-950 text-white shadow-2xl shadow-sky-500/30 animate-blue-glow py-16 md:py-24 px-6 md:px-12 text-center group">
          <div className="absolute inset-0 opacity-65 transition-opacity duration-700 group-hover:opacity-75">
            <img 
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80" 
              alt="About banner" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000" 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/30" />
          
          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 backdrop-blur-md border border-sky-400/40 text-sky-300">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
              <span className="text-xs font-black uppercase tracking-widest">{translate('OUR LEGACY')}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">
              {translate('Our Mission & Story')}
            </h1>
            
            <p className="text-sm md:text-base text-sky-100/80 max-w-xl mx-auto font-medium leading-relaxed">
              {translate("Learn about Premier Tour Booking's global commitment to handcrafting dream journeys.")}
            </p>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ltr:text-left rtl:text-right">
        <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-8 md:p-12 rounded-[36px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 animate-blue-glow space-y-6">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800">
              <span className="w-2 h-2 rounded-full bg-[#0091EA] animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0091EA] dark:text-sky-300">{translate('Established 2018')}</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent tracking-tight">
              {translate('Perfecting Travel Since 2018')}
            </h2>
            
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {translate('Premier Tour Booking was established in 2018 with a humble, powerful vision: to take the complexity out of custom international travel. What began as a local boutique consultation firm has matured into a comprehensive digital portal servicing over 120,000 satisfied passengers globally.')}
            </p>

            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {translate('We specialize in bridging flights, bespoke hotel partnerships, guided adventures, and premium vehicle fleets into cohesive, flexible itineraries. By bypassing traditional middlemen, we are able to maintain a premium standard of services while extending best-in-market rates directly to our travelers.')}
            </p>

            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {translate('Our core values are anchored on transparency, environmental sustainability, and meticulous customer care. With 24/7 global client support centers and an active flight tracking network, we make sure that our passengers are covered at every mile of their voyage.')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION */}
      <section className="py-16 bg-gradient-to-b from-slate-50 via-sky-50/20 to-slate-50 dark:from-slate-950/40 dark:via-sky-950/10 dark:to-slate-950/40 border-t border-b border-sky-100 dark:border-sky-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="mb-14 space-y-2">
            <span className="text-[11px] uppercase font-black tracking-widest text-[#0091EA] bg-sky-100 dark:bg-sky-950/80 px-3.5 py-1 rounded-full border border-sky-200 dark:border-sky-800 inline-block">
              {translate('Our Standards')}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {translate('Why Choose Premier Tour')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {translate('Four pillars that define our service excellence and travel quality.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/60 ltr:text-left rtl:text-right space-y-4 hover:shadow-xl hover:shadow-sky-500/20 hover:border-[#0091EA] transition-all duration-300 animate-blue-glow shadow-lg shadow-sky-500/10">
              <div className="w-12 h-12 bg-gradient-to-tr from-[#0091EA] via-sky-500 to-cyan-400 text-white rounded-2xl flex items-center justify-center shadow-md shadow-sky-500/30">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">{translate('Trusted Experience')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{translate('Over 8 years of continuous booking experience, verified tour experts, and ATOL/ABTA protected travel networks.')}</p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/60 ltr:text-left rtl:text-right space-y-4 hover:shadow-xl hover:shadow-sky-500/20 hover:border-[#0091EA] transition-all duration-300 animate-blue-glow shadow-lg shadow-sky-500/10">
              <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-2xl flex items-center justify-center shadow-md shadow-emerald-500/30">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">{translate('Best Price Guarantee')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{translate('Direct relationships with hoteliers and global flight networks let us match and beat any competitor pricing.')}</p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/60 ltr:text-left rtl:text-right space-y-4 hover:shadow-xl hover:shadow-sky-500/20 hover:border-[#0091EA] transition-all duration-300 animate-blue-glow shadow-lg shadow-sky-500/10">
              <div className="w-12 h-12 bg-gradient-to-tr from-[#0091EA] via-sky-500 to-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-md shadow-sky-500/30">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">{translate('24/7 Live Support')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{translate('Immediate concierge support in London, Dubai, and Singapore to handle cancellations or re-routing instantly.')}</p>
            </div>

            {/* Card 4 */}
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/60 ltr:text-left rtl:text-right space-y-4 hover:shadow-xl hover:shadow-sky-500/20 hover:border-[#0091EA] transition-all duration-300 animate-blue-glow shadow-lg shadow-sky-500/10">
              <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-cyan-500/30">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">{translate('Global Network')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{translate('Connecting 45 countries with local vehicle rental pickup counters and luxury resort options.')}</p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. TEAM & MILESTONES SECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            
            {/* Stat 1 */}
            <div className="space-y-3 p-8 rounded-[32px] bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 animate-blue-glow hover:border-[#0091EA] transition-all">
              <div className="flex justify-center text-[#0091EA] mb-1">
                <Compass className="w-8 h-8 animate-spin-slow" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">2018</h3>
              <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">{translate('Founded Year')}</p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-3 p-8 rounded-[32px] bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 animate-blue-glow hover:border-[#0091EA] transition-all">
              <div className="flex justify-center text-[#0091EA] mb-1">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">45+</h3>
              <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">{translate('Countries Covered')}</p>
            </div>

            {/* Stat 3 */}
            <div className="space-y-3 p-8 rounded-[32px] bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 animate-blue-glow hover:border-[#0091EA] transition-all">
              <div className="flex justify-center text-[#0091EA] mb-1">
                <Smile className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">120K+</h3>
              <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">{translate('Happy Customers')}</p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

