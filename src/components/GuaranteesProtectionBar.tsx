import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  RotateCcw, 
  PhoneCall, 
  CreditCard, 
  Info, 
  X, 
  CheckCircle2, 
  Award, 
  Sparkles,
  ChevronRight,
  Compass,
  Leaf,
  DollarSign,
  CloudSun,
  Wifi
} from 'lucide-react';
import { useLanguage } from '../lib/i18n.tsx';

interface GuaranteeItem {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  badge: string;
  gradient: string;
  image: string;
  buttonText: string;
  detailsTitle: string;
  details: string[];
}

export default function GuaranteesProtectionBar() {
  const { translate } = useLanguage();
  const [activeModal, setActiveModal] = useState<GuaranteeItem | null>(null);

  const items: GuaranteeItem[] = [
    {
      id: 'atol',
      icon: ShieldCheck,
      title: 'ABTA & ATOL Bonded',
      subtitle: '100% Financial Protection held safely in trust.',
      badge: 'Protected',
      gradient: 'from-amber-500 to-amber-600',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      buttonText: 'VIEW GUARANTEE',
      detailsTitle: 'Complete Financial Peace of Mind',
      details: [
        'Full financial bonding under official ABTA & ATOL protection schemes.',
        'Your payment is held safely in trust until your trip completes.',
        'Repatriation guarantee and flight failure protection included.',
        'Official ATOL certificate issued immediately upon booking confirmation.'
      ]
    },
    {
      id: 'cancel',
      icon: RotateCcw,
      title: 'Flexible Free Cancellation',
      subtitle: 'Cancel up to 48 hours prior to start.',
      badge: 'Zero Risk',
      gradient: 'from-emerald-500 to-teal-600',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      buttonText: 'CANCEL POLICY',
      detailsTitle: 'Stress-Free Booking Flexibility',
      details: [
        'Free cancellation on eligible tours up to 48 hours prior to start.',
        'Instant 100% refund processed back to your original payment method.',
        'Free date adjustments with no rebooking penalty fees.',
        'Emergency travel disruption cover built-in.'
      ]
    },
    {
      id: 'concierge',
      icon: PhoneCall,
      title: '24/7 Chauffeur & Concierge',
      subtitle: 'English-speaking luxury chauffeur for your stay.',
      badge: '24/7 Support',
      gradient: 'from-[#0091EA] to-sky-600',
      image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200',
      buttonText: 'BOOK TRANSFER',
      detailsTitle: 'Dedicated Local Hospitality',
      details: [
        'English-speaking certified luxury chauffeur for your entire stay.',
        '24/7 live assistance hotline via WhatsApp, phone, and email.',
        'Instant itinerary adjustments and restaurant / activity reservations.',
        'Flight monitoring with free airport delay waiting times.'
      ]
    },
    {
      id: 'fees',
      icon: CreditCard,
      title: 'Zero Hidden Booking Fees',
      subtitle: 'All-inclusive transparent pricing upfront.',
      badge: 'Best Price',
      gradient: 'from-indigo-500 to-purple-600',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
      buttonText: 'PRICE MATCH',
      detailsTitle: 'Transparent Luxury Pricing Guarantee',
      details: [
        'The price you see is the final price — taxes, road tolls & driver allowances included.',
        'No credit card processing surcharges or currency conversion markups.',
        'Best Price Match Guarantee against any verified tour operator.',
        'Detailed itemized receipt provided with full breakdowns.'
      ]
    },
    {
      id: 'support',
      icon: ShieldCheck,
      title: '24/7 Client Support',
      subtitle: 'Always available globally whenever needed.',
      badge: 'Global Help',
      gradient: 'from-sky-400 to-blue-600',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
      buttonText: 'CONTACT HELP',
      detailsTitle: 'Round-the-Clock Travel Concierge',
      details: [
        'Instant emergency assistance in English, French, German & Sinhala.',
        'Dedicated travel manager assigned to your itinerary.',
        'Direct line to emergency medical services and resort liaisons.',
        'Live GPS tracking on all chauffeur vehicles for complete security.'
      ]
    },
    {
      id: 'currency',
      icon: DollarSign,
      title: 'Currency & Forex',
      subtitle: 'LKR (Sri Lanka Rupee). High-end spots accept USD.',
      badge: 'Money Guide',
      gradient: 'from-emerald-600 to-green-700',
      image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&q=80',
      buttonText: 'EXCHANGE INFO',
      detailsTitle: 'Sri Lanka Currency & Foreign Exchange',
      details: [
        'Official currency is the Sri Lankan Rupee (LKR).',
        'Major hotels, luxury resorts, and tour operators accept USD and major credit cards.',
        'Currency exchange desks are available 24/7 at Colombo BIA Airport.',
        'Visa and MasterCard ATMs are widely accessible in major towns.'
      ]
    },
    {
      id: 'weather',
      icon: CloudSun,
      title: 'Weather & Seasons',
      subtitle: 'Dec-Mar for South/West. May-Sep for East Coast.',
      badge: 'Forecast',
      gradient: 'from-amber-400 to-orange-500',
      image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
      buttonText: 'CHECK FORECAST',
      detailsTitle: 'Sri Lanka Tropical Climate Guide',
      details: [
        'Sri Lanka is a year-round tropical paradise with two distinct monsoon seasons.',
        'South & West Coasts (Bentota, Galle, Mirissa): Best weather from November to April.',
        'East Coast (Trincomalee, Pasikudah): Peak sunny weather from May to September.',
        'Hill Country (Kandy, Nuwara Eliya): Cool mountain climate year-round (15°C - 20°C).'
      ]
    },
    {
      id: 'connectivity',
      icon: Wifi,
      title: 'Connectivity & e-SIM',
      subtitle: 'Pick up a tourist e-SIM at the airport arrival hall.',
      badge: 'e-SIM Ready',
      gradient: 'from-cyan-500 to-blue-600',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      buttonText: 'BUY E-SIM',
      detailsTitle: 'High-Speed Internet & Mobile Data',
      details: [
        'Instant 4G/5G tourist e-SIM activation before landing in Sri Lanka.',
        'Comprehensive island-wide coverage even in safari national parks and hill country.',
        'Generous data packages starting from $10 USD for 30 days.',
        'Free Wi-Fi included in all private chauffeur vehicles and partner luxury hotels.'
      ]
    },
    {
      id: 'guided',
      icon: Compass,
      title: 'Guided Excursions',
      subtitle: 'Pre-planned verified tours with expert local guides.',
      badge: 'Certified',
      gradient: 'from-teal-500 to-emerald-600',
      image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80',
      buttonText: 'EXPLORE TOURS',
      detailsTitle: 'Licensed Local Guide Network',
      details: [
        'Sri Lanka Tourism Development Authority (SLTDA) certified naturalists and historians.',
        'Deep local insider knowledge on wildlife, Buddhism, ancient architecture & tea.',
        'Skip-the-line VIP priority access at Sigiriya Rock and major UNESCO monuments.',
        'Customizable pace tailored for families, couples, and photography lovers.'
      ]
    },
    {
      id: 'eco',
      icon: Leaf,
      title: 'Sustainable Options',
      subtitle: 'Eco-friendly carbon offsets and wildlife protection.',
      badge: 'Eco-Friendly',
      gradient: 'from-emerald-400 to-teal-700',
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&q=80',
      buttonText: 'ECO INITIATIVE',
      detailsTitle: 'Sustainable & Responsible Tourism',
      details: [
        '100% carbon-offset options available for all chauffeur transfers and tours.',
        'Direct funding support to elephant transit homes and turtle conservation hatcheries.',
        'Strict plastic-reduction policies with refillable glass water bottles in vehicles.',
        'Support for local rural village communities and eco-lodges.'
      ]
    }
  ];

  return (
    <section className="relative z-20 py-14 bg-gradient-to-b from-sky-50/90 via-blue-50/70 to-sky-100/90 dark:from-slate-950 dark:via-sky-950/40 dark:to-slate-900 border-t-2 border-b-2 border-sky-200/80 dark:border-sky-800/60 transition-colors duration-500 overflow-hidden">
      
      {/* Light Animated Blue Glow Orbs */}
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-[#0091EA]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 end-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-sky-200/80 dark:border-sky-800/60">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0091EA]/10 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/30 text-[#0091EA] dark:text-sky-300 text-[10px] font-black uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#0091EA] animate-spin-slow" />
                {translate('Premier Guarantees & Travel Extras')}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold hidden sm:inline">
                • {translate('Book with absolute confidence & 100% financial protection')}
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {translate('ESSENTIAL PROTECTION &')} <span className="bg-gradient-to-r from-[#0091EA] via-sky-600 to-cyan-500 dark:from-sky-300 dark:via-sky-400 dark:to-cyan-300 bg-clip-text text-transparent">{translate('TRAVEL EXTRAS')}</span>
            </h2>
          </div>

          {/* Right Side Official Trust Badges */}
          <div className="flex items-center gap-3 text-[11px] font-extrabold text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-sky-200 dark:border-sky-800/60 shadow-md">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              {translate('ATOL #11840')}
            </span>
            <span className="text-sky-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
              {translate('ABTA Y6421')}
            </span>
          </div>
        </div>

      </div>

      {/* AUTO-MOVING CONTINUOUS HORIZONTAL MARQUEE TRACK (NO BUTTONS) */}
      <div className="w-full overflow-hidden py-2">
        <div className="flex gap-6 px-4 w-max animate-marquee">
          {/* Duplicate items array for continuous smooth infinite scrolling */}
          {[...items, ...items].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => setActiveModal(item)}
                className="w-[290px] sm:w-[320px] bg-white/95 dark:bg-slate-900/95 hover:bg-sky-50/90 dark:hover:bg-slate-800/95 border-2 border-sky-200/90 dark:border-sky-800/60 hover:border-[#0091EA] dark:hover:border-sky-400 rounded-[28px] overflow-hidden shadow-xl shadow-sky-500/10 hover:shadow-2xl hover:shadow-sky-500/25 transition-all duration-300 cursor-pointer flex flex-col justify-between shrink-0 group relative"
              >
                {/* Card Top Image Banner with Icon Overlay */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent dark:from-slate-900 dark:via-slate-900/40" />

                  {/* Icon Badge Top Left */}
                  <div className={`absolute top-3 start-3 w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Badge Top Right */}
                  <div className="absolute top-3 end-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-400/30 shadow-sm">
                    {translate(item.badge)}
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#0091EA] dark:group-hover:text-sky-300 transition-colors leading-snug mb-1.5">
                      {translate(item.title)}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
                      {translate(item.subtitle)}
                    </p>
                  </div>

                  {/* Card Footer Button */}
                  <div className="mt-5 pt-3 border-t border-sky-100 dark:border-sky-900/60 flex items-center justify-between text-[11px] font-extrabold text-[#0091EA] dark:text-sky-400 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                    <span className="uppercase tracking-wider">{translate(item.buttonText)}</span>
                    <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800 flex items-center justify-center group-hover:bg-[#0091EA] group-hover:text-white transition-all shadow-sm">
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Popup for Card Details */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 border-2 border-sky-300 dark:border-sky-500/40 rounded-3xl max-w-lg w-full p-6 text-slate-900 dark:text-white shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 end-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 mb-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeModal.gradient} text-white flex items-center justify-center shadow-lg shrink-0`}>
                  {React.createElement(activeModal.icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0091EA]">{translate('Essential Extra & Protection')}</span>
                  <h3 className="text-xl font-black leading-tight">{translate(activeModal.detailsTitle)}</h3>
                </div>
              </div>

              <div className="space-y-3 mb-6 bg-sky-50/80 dark:bg-slate-950/60 p-4 rounded-2xl border border-sky-200 dark:border-sky-900/50">
                {activeModal.details.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{translate(point)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-sky-100/50 dark:bg-slate-800/40 p-3 rounded-xl mb-5">
                <span className="flex items-center gap-1.5 font-bold text-[#0091EA] dark:text-sky-300">
                  <Info className="w-3.5 h-3.5" />
                  {translate('Official Service & Policy standard')}
                </span>
                <span className="font-mono text-slate-500">REF: PTB-EX-2026</span>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 hover:from-[#007cc7] hover:to-sky-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-sky-500/25 cursor-pointer"
              >
                {translate('Close & Continue')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
