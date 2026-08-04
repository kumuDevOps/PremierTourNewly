import React from 'react';
import { Compass, Facebook, Instagram, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../lib/i18n.tsx';
import Logo from './Logo.tsx';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const { translate } = useLanguage();
  return (
    <footer className="relative bg-gradient-to-br from-white via-sky-50/50 to-slate-100 dark:from-slate-950 dark:via-sky-950/40 dark:to-slate-900 text-slate-700 dark:text-slate-300 pt-16 pb-10 border-t-2 border-sky-300/80 dark:border-sky-800/60 shadow-2xl shadow-sky-500/10 animate-blue-glow transition-colors duration-500 overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
        
        {/* Top 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b-2 border-sky-200/80 dark:border-sky-800/50 pb-12">
          
          {/* Column 1: Brand details */}
          <div className="space-y-6 lg:col-span-2">
            <div 
              onClick={() => setCurrentPage('home')} 
              className="flex items-center cursor-pointer group"
            >
              <Logo size="md" lightText={false} />
            </div>
            
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium max-w-sm">
              {translate('Premier Tour Booking is a global travel provider offering customizable beach retreats, cultural explorations, modern flight packages, and premier car rentals since 2018. Over 120,000 travelers trust us to craft their dream itineraries.')}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800/60 rounded-xl text-slate-600 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-[#0091EA] hover:border-[#0091EA] shadow-md shadow-sky-500/10 transition-all cursor-pointer">
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800/60 rounded-xl text-slate-600 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-slate-800 hover:border-slate-800 shadow-md shadow-sky-500/10 transition-all cursor-pointer">
                <span className="font-black text-sm font-mono tracking-tighter leading-none">X</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800/60 rounded-xl text-slate-600 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-gradient-to-tr hover:from-yellow-500 hover:to-purple-600 shadow-md shadow-sky-500/10 transition-all cursor-pointer">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Help Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-sky-900 dark:text-sky-300 uppercase tracking-widest bg-gradient-to-r from-sky-900 to-[#0091EA] dark:from-sky-300 dark:to-cyan-300 bg-clip-text text-transparent">{translate('Help')}</h4>
            <ul className="space-y-2 text-xs md:text-sm font-semibold">
              <li>
                <button onClick={() => setCurrentPage('contact-us')} className="hover:text-[#0091EA] transition-colors cursor-pointer">{translate('Support Centre')}</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact-us')} className="hover:text-[#0091EA] transition-colors cursor-pointer">{translate('Contact Us')}</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact-us')} className="hover:text-[#0091EA] transition-colors cursor-pointer">{translate('Store Locator')}</button>
              </li>
              <li>
                <span className="text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full font-black inline-flex items-center gap-1.5 mt-2 shadow-md shadow-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  {translate('ABTA & ATOL Bonded')}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: General Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-sky-900 dark:text-sky-300 uppercase tracking-widest bg-gradient-to-r from-sky-900 to-[#0091EA] dark:from-sky-300 dark:to-cyan-300 bg-clip-text text-transparent">{translate('General')}</h4>
            <ul className="space-y-2 text-xs md:text-sm font-semibold">
              <li>
                <button onClick={() => setCurrentPage('about-us')} className="hover:text-[#0091EA] transition-colors cursor-pointer">{translate('About Us')}</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about-us')} className="hover:text-[#0091EA] transition-colors cursor-pointer">{translate('Careers')}</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about-us')} className="hover:text-[#0091EA] transition-colors cursor-pointer">{translate('Brochures')}</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about-us')} className="hover:text-[#0091EA] transition-colors cursor-pointer">{translate('Privacy Policy')}</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about-us')} className="hover:text-[#0091EA] transition-colors cursor-pointer">{translate('Terms of Service')}</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about-us')} className="hover:text-[#0091EA] transition-colors cursor-pointer">{translate('Cookie Policy')}</button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payments */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
          <p>
            © 2026 Premier Tour Booking Ltd. {translate('All rights reserved.')}
          </p>
          
          {/* Payment Method Badges */}
          <div className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
            {/* Visa */}
            <div className="h-7 w-11 bg-white border border-sky-200 dark:border-slate-700 rounded-lg flex items-center justify-center shadow-sm overflow-hidden" title={translate(`Visa`)}>
              <span className="text-[10px] font-black italic text-[#1434CB] tracking-tighter">{translate(`VISA`)}</span>
            </div>
            {/* Mastercard */}
            <div className="h-7 w-11 bg-white border border-sky-200 dark:border-slate-700 rounded-lg flex items-center justify-center shadow-sm overflow-hidden relative" title={translate(`Mastercard`)}>
              <div className="w-4 h-4 rounded-full bg-[#EB001B] absolute -ml-2.5"></div>
              <div className="w-4 h-4 rounded-full bg-[#F79E1B] absolute ml-2.5 opacity-90 mix-blend-multiply dark:mix-blend-normal"></div>
            </div>
            {/* Amex */}
            <div className="h-7 w-11 bg-[#2E77BB] border border-sky-200 dark:border-slate-700 rounded-lg flex items-center justify-center shadow-sm" title={translate(`American Express`)}>
              <span className="text-[8px] font-black tracking-tight text-white leading-none text-center">{translate(`AMEX`)}</span>
            </div>
            {/* GPay */}
            <div className="h-7 w-11 bg-black border border-sky-200 dark:border-slate-700 rounded-lg flex items-center justify-center shadow-sm" title={translate(`Google Pay`)}>
              <span className="text-[9px] font-bold text-white tracking-tighter">{translate(`GPay`)}</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
