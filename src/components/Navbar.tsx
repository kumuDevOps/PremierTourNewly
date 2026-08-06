import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo.tsx';
import { useLanguage } from '../lib/i18n.tsx';
import LanguageSelector from './LanguageSelector.tsx';
import CurrencySelector from './CurrencySelector.tsx';
import { motion } from 'motion/react';
import { 
  Phone, 
  ChevronDown, 
  ChevronRight,
  Menu, 
  X,
  FileText,
  Globe,
  Clock,
  Shield,
  CheckCircle2,
  PhoneCall,
  User,
  Heart,
  LogOut,
  Calendar,
  Settings,
  ShieldAlert,
  Award,
  Compass,
  Sun,
  Moon,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser?: any;
  userProfile?: any;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  homeSearchTab?: 'flight-hotel' | 'hotels' | 'flights' | 'cars';
  onSelectSearchTab?: (tab: 'flight-hotel' | 'hotels' | 'flights' | 'cars') => void;
  onSelectTourCategory?: (category: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function Navbar({ 
  currentPage, 
  setCurrentPage, 
  currentUser,
  userProfile,
  onOpenAuth,
  onLogout,
  wishlistCount = 0,
  onOpenWishlist,
  onSelectTourCategory,
  darkMode = false,
  onToggleDarkMode
}: NavbarProps) {
  const { language, setLanguage, t, translate } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false);
  const [mobileToursOpen, setMobileToursOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser?.email) {
      try {
        navigator.clipboard.writeText(currentUser.email);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    }
  };

  // Monitor scroll state to apply shadow and transition style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToursDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map user-visible tours categories to internal database category values
  const tourCategories = [
    { label: 'Beach Holidays', dbValue: 'Beach' },
    { label: 'City Tours', dbValue: 'City' },
    { label: 'Adventure Tours', dbValue: 'Adventure' },
    { label: 'Group Tours', dbValue: 'Cultural' },
    { label: 'Flights', dbValue: 'Flights' }
  ];

  const handleTourCategoryClick = (dbValue: string) => {
    if (dbValue === 'Flights') {
      setCurrentPage('flights');
    } else if (onSelectTourCategory) {
      onSelectTourCategory(dbValue);
    } else {
      setCurrentPage('tour');
    }
    setToursDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNavLinkClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    setToursDropdownOpen(false);
  };

  const isActive = (pageId: string) => {
    if (pageId === 'account-dashboard' && ['account-dashboard', 'account-bookings', 'account-settings'].includes(currentPage)) {
      return true;
    }
    return currentPage === pageId;
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      id="navbar-header"
      className={`sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-500 border-b border-sky-100 dark:border-sky-900/50 shadow-md ${
        scrolled ? 'h-[72px]' : 'h-[80px]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex lg:grid lg:grid-cols-[auto_1fr_auto] items-center justify-between h-full w-full gap-4 xl:gap-8">
          
          {/* Left Side: Logo */}
          <div 
            id="navbar-logo"
            onClick={() => handleNavLinkClick('home')} 
            className="flex items-center justify-start cursor-pointer hover:scale-105 transition-transform duration-300 py-2 shrink-0"
          >
            <Logo size="md" lightText={darkMode} />
          </div>

          {/* Center: Menu items (centered in the middle of the header) */}
          <nav 
            id="navbar-desktop-nav"
            className="hidden lg:flex items-center justify-center gap-2 xl:gap-6 mx-auto px-1 xl:px-4"
          >
            {/* 1. Home */}
            <button
              id="nav-link-home"
              onClick={() => handleNavLinkClick('home')}
              className={`relative py-6 px-1 text-[11px] xl:text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer whitespace-nowrap group ${
                isActive('home')
                  ? 'text-[#0091EA]' 
                  : 'text-[#0A2540] dark:text-slate-300 hover:text-[#0091EA] dark:hover:text-[#0091EA]'
              }`}
            >
              {t.home}
              <span className={`absolute bottom-0 start-0 w-full h-0.5 bg-[#0091EA] transition-transform duration-300 ${isActive('home') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>

            {/* 2. Tours Dropdown */}
            <div 
              id="nav-link-tours-wrapper"
              ref={dropdownRef}
              className="relative py-6 group"
              onMouseEnter={() => setToursDropdownOpen(true)}
              onMouseLeave={() => setToursDropdownOpen(false)}
            >
              <button
                id="nav-link-tours-trigger"
                onClick={() => {
                  setToursDropdownOpen(!toursDropdownOpen);
                  setCurrentPage('tour');
                }}
                className={`flex items-center gap-1.5 text-[11px] xl:text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isActive('tour')
                    ? 'text-[#0091EA]' 
                    : 'text-[#0A2540] dark:text-slate-300 hover:text-[#0091EA] dark:hover:text-[#0091EA]'
                }`}
              >
                <span>{t.tours}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${toursDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <span className={`absolute bottom-0 start-0 w-full h-0.5 bg-[#0091EA] transition-transform duration-300 ${isActive('tour') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />

              {/* Dropdown Menu */}
              {toursDropdownOpen && (
                <div 
                  id="tours-dropdown-menu"
                  className="absolute start-0 mt-0 w-52 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-sky-100 dark:border-sky-900 z-50 py-3 animate-fade-in"
                >
                  {tourCategories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTourCategoryClick(cat.dbValue)}
                      className="w-full text-start px-6 py-3 text-[11px] font-black tracking-wider uppercase text-[#0A2540] dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-[#0091EA] transition-all duration-300 cursor-pointer"
                    >
                      {translate(cat.label)}
                    </button>
                  ))}
                </div>
              )}
            </div>


            {/* Flights Link */}
            <button
              id="nav-link-flights"
              onClick={() => handleNavLinkClick('flights')}
              className={`relative py-6 px-1 text-[11px] xl:text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer whitespace-nowrap group ${
                isActive('flights')
                  ? 'text-[#0091EA]' 
                  : 'text-[#0A2540] dark:text-slate-300 hover:text-[#0091EA] dark:hover:text-[#0091EA]'
              }`}
            >
              {t.flights || 'Flights'}
              <span className={`absolute bottom-0 start-0 w-full h-0.5 bg-[#0091EA] transition-transform duration-300 ${isActive('flights') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>

            {/* Hotels Link */}
            <button
              id="nav-link-hotels"
              onClick={() => handleNavLinkClick('hotels')}
              className={`relative py-6 px-1 text-[11px] xl:text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer whitespace-nowrap group ${
                isActive('hotels')
                  ? 'text-[#0091EA]' 
                  : 'text-[#0A2540] dark:text-slate-300 hover:text-[#0091EA] dark:hover:text-[#0091EA]'
              }`}
            >
              {t.hotels}
              <span className={`absolute bottom-0 start-0 w-full h-0.5 bg-[#0091EA] transition-transform duration-300 ${isActive('hotels') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>

            {/* 3. Rent a Car */}
            <button
              id="nav-link-cars"
              onClick={() => handleNavLinkClick('rent-a-car')}
              className={`relative py-6 px-1 text-[11px] xl:text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer whitespace-nowrap group ${
                isActive('rent-a-car')
                  ? 'text-[#0091EA]' 
                  : 'text-[#0A2540] dark:text-slate-300 hover:text-[#0091EA] dark:hover:text-[#0091EA]'
              }`}
            >
              {t.rentACar}
              <span className={`absolute bottom-0 start-0 w-full h-0.5 bg-[#0091EA] transition-transform duration-300 ${isActive('rent-a-car') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>

            {/* 4. Contact Us */}
            <button
              id="nav-link-contact"
              onClick={() => handleNavLinkClick('contact-us')}
              className={`relative py-6 px-1 text-[11px] xl:text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer whitespace-nowrap group ${
                isActive('contact-us')
                  ? 'text-[#0091EA]' 
                  : 'text-[#0A2540] dark:text-slate-300 hover:text-[#0091EA] dark:hover:text-[#0091EA]'
              }`}
            >
              {t.contactUs}
              <span className={`absolute bottom-0 start-0 w-full h-0.5 bg-[#0091EA] transition-transform duration-300 ${isActive('contact-us') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>

            {/* 5. About Us */}
            <button
              id="nav-link-about"
              onClick={() => handleNavLinkClick('about-us')}
              className={`relative py-6 px-1 text-[11px] xl:text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer whitespace-nowrap group ${
                isActive('about-us')
                  ? 'text-[#0091EA]' 
                  : 'text-[#0A2540] dark:text-slate-300 hover:text-[#0091EA] dark:hover:text-[#0091EA]'
              }`}
            >
              {t.aboutUs}
              <span className={`absolute bottom-0 start-0 w-full h-0.5 bg-[#0091EA] transition-transform duration-300 ${isActive('about-us') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>

            {/* 6. Visa Link */}
            <button
              id="nav-link-blog"
              onClick={() => handleNavLinkClick('blog')}
              className={`relative py-6 px-1 text-[11px] xl:text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer whitespace-nowrap group ${
                currentPage === 'blog'
                  ? 'text-[#0091EA]' 
                  : 'text-[#0A2540] dark:text-slate-300 hover:text-[#0091EA] dark:hover:text-[#0091EA]'
              }`}
            >
              {translate('Blog')}
              <span className={`absolute bottom-0 start-0 w-full h-0.5 bg-[#0091EA] transition-transform duration-300 ${currentPage === 'blog' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>
          </nav>

          {/* Right Controls Container */}
          <div className="hidden lg:flex items-center justify-end gap-2 xl:gap-3 shrink-0">
            {/* User Profile / Auth Button (Prominent) */}
            {currentUser ? (
              <div ref={userDropdownRef} className="relative z-50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  id="user-profile-menu-trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-3 ps-2 pe-4 py-2 rounded-full transition-all duration-200 cursor-pointer border ${
                    userDropdownOpen 
                      ? 'border-[#0091EA] bg-sky-50/80 dark:bg-slate-800 ring-4 ring-[#0091EA]/15 shadow-md' 
                      : 'border-slate-200 dark:border-slate-700/80 hover:border-[#0091EA]/60 bg-white/90 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0091EA] via-sky-400 to-indigo-600 p-0.5 shadow-xs">
                      <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-black text-xs text-[#0091EA] overflow-hidden">
                        {userProfile?.avatar || userProfile?.photoURL || userProfile?.profile_image ? (
                          <img 
                            src={userProfile.avatar || userProfile.photoURL || userProfile.profile_image} 
                            alt="User Avatar" 
                            className="w-full h-full object-cover rounded-full" 
                          />
                        ) : (
                          (userProfile?.fullName || currentUser.email || 'T').charAt(0).toUpperCase()
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-start hidden md:block max-w-[120px]">
                    <p className="text-xs font-black text-[#0A2540] dark:text-slate-100 truncate leading-tight">
                      {translate(userProfile?.fullName || 'Traveler')}
                    </p>
                  </div>
                </motion.button>
                {/* Popover Card Menu */}
                {userDropdownOpen && (
                  <div className="absolute end-0 mt-2.5 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50">
                    
                    {/* Account Header Section */}
                    <div className="relative p-4 bg-gradient-to-br from-sky-500/10 via-[#0091EA]/5 to-indigo-500/10 dark:from-sky-950/40 dark:via-slate-900 dark:to-indigo-950/40 border-b border-slate-100 dark:border-slate-800/80">
                      
                      {/* Active account status badge */}
                      <div className="flex items-center justify-between mb-3">
                        {userProfile?.role ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-widest">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                             <span className="capitalize">{translate(userProfile.role)}</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                            <span>{translate('Pending Account')}</span>
                          </div>
                        )}
                      </div>

                      {/* User Info details */}
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0091EA] via-sky-400 to-indigo-600 p-0.5 shadow-md">
                            <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center font-black text-lg text-[#0091EA] overflow-hidden">
                              {userProfile?.avatar || userProfile?.photoURL || userProfile?.profile_image ? (
                                <img 
                                  src={userProfile.avatar || userProfile.photoURL || userProfile.profile_image} 
                                  alt="User Avatar" 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                (userProfile?.fullName || currentUser.email || 'T').charAt(0).toUpperCase()
                              )}
                            </div>
                          </div>
                          <span className="absolute -bottom-1 -end-1 p-0.5 bg-emerald-500 text-white rounded-full ring-2 ring-white dark:ring-slate-900">
                            <CheckCircle2 className="w-3 h-3" />
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-black text-[#0A2540] dark:text-slate-100 truncate leading-snug">
                            {translate(userProfile?.fullName || 'Traveler')}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                              {currentUser.email}
                            </p>
                            <button
                              type="button"
                              onClick={handleCopyEmail}
                              className="p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                              title={translate(`Copy Email`)}
                            >
                              {copiedEmail ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Quick Metric / Shortcuts Bar */}
                    <div className="p-2 grid grid-cols-2 gap-1.5 bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setCurrentPage('account-bookings');
                        }}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-150 dark:border-slate-700/80 hover:border-[#0091EA]/40 dark:hover:border-sky-500/40 hover:bg-sky-50/50 dark:hover:bg-slate-700/60 transition-all cursor-pointer group text-start"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#0091EA]/10 text-[#0091EA] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[10px] font-extrabold text-[#0A2540] dark:text-slate-200 leading-tight">{translate('My Bookings')}</span>
                          <span className="block text-[9px] text-slate-400 dark:text-slate-400 font-semibold truncate">{translate('View Trips')}</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onOpenWishlist) onOpenWishlist();
                          else setCurrentPage('account-dashboard');
                        }}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-150 dark:border-slate-700/80 hover:border-rose-300 dark:hover:border-rose-800/50 hover:bg-rose-50/40 dark:hover:bg-slate-700/60 transition-all cursor-pointer group text-start"
                      >
                        <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-[#0A2540] dark:text-slate-200 leading-tight">{translate('Wishlist')}</span>
                            {wishlistCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-black text-[8px]">
                                {wishlistCount}
                              </span>
                            )}
                          </div>
                          <span className="block text-[9px] text-slate-400 dark:text-slate-400 font-semibold truncate">{translate('Saved Items')}</span>
                        </div>
                      </button>
                    </div>

                    {/* Navigation Menu Links */}
                    <div className="p-2 space-y-1">
                      
                      {/* My Dashboard */}
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setCurrentPage('account-dashboard');
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer group ${
                          isActive('account-dashboard') && currentPage === 'account-dashboard'
                            ? 'bg-[#0091EA]/10 text-[#0091EA] dark:bg-sky-500/20 dark:text-sky-400'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-[#0091EA] dark:hover:text-sky-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                            isActive('account-dashboard') && currentPage === 'account-dashboard'
                              ? 'bg-[#0091EA] text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-[#0091EA]/15 group-hover:text-[#0091EA]'
                          }`}>
                            <Compass className="w-4 h-4" />
                          </div>
                          <div className="text-start">
                            <p className="font-extrabold leading-tight">{translate(`My Dashboard`)}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-0.5">{translate('Overview & Quick Actions')}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>

                      {/* My Bookings */}
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setCurrentPage('account-bookings');
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer group ${
                          isActive('account-dashboard') && currentPage === 'account-bookings'
                            ? 'bg-[#0091EA]/10 text-[#0091EA] dark:bg-sky-500/20 dark:text-sky-400'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-[#0091EA] dark:hover:text-sky-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                            isActive('account-dashboard') && currentPage === 'account-bookings'
                              ? 'bg-[#0091EA] text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-[#0091EA]/15 group-hover:text-[#0091EA]'
                          }`}>
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div className="text-start">
                            <p className="font-extrabold leading-tight">{translate(`My Bookings`)}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-0.5">{translate('Tours, Hotels & Rentals')}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>

                      {/* Profile Settings */}
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setCurrentPage('account-settings');
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer group ${
                          isActive('account-dashboard') && currentPage === 'account-settings'
                            ? 'bg-[#0091EA]/10 text-[#0091EA] dark:bg-sky-500/20 dark:text-sky-400'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-[#0091EA] dark:hover:text-sky-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                            isActive('account-dashboard') && currentPage === 'account-settings'
                              ? 'bg-[#0091EA] text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-[#0091EA]/15 group-hover:text-[#0091EA]'
                          }`}>
                            <Settings className="w-4 h-4" />
                          </div>
                          <div className="text-start">
                            <p className="font-extrabold leading-tight">{translate(`Profile Settings`)}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-0.5">{translate('Security & Preferences')}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>

                      {/* Admin section */}
                      {['admin', 'hotel_manager', 'car_manager', 'flight_manager', 'tour_manager'].includes(userProfile?.role) && (
                        <div className="pt-1">
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              setCurrentPage('admin');
                            }}
                            className="w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 hover:border-amber-500 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                                <ShieldAlert className="w-4 h-4 animate-pulse" />
                              </div>
                              <div className="text-start">
                                <p className="font-extrabold leading-tight">{translate('Admin Panel')}</p>
                                <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-semibold leading-none mt-0.5">{translate('Manage Platform & Bookings')}</p>
                              </div>
                            </div>
                            <Sparkles className="w-4 h-4 text-amber-500" />
                          </button>
                        </div>
                      )}
                      
                      {/* Theme Toggle in Dropdown */}
                      <button
                        onClick={onToggleDarkMode}
                        className="w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer group text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-[#0091EA] dark:hover:text-sky-400"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                             {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                          </div>
                          <div className="text-start">
                            <p className="font-extrabold leading-tight">{darkMode ? translate('Light Mode') : translate('Dark Mode')}</p>
                          </div>
                        </div>
                      </button>

                      {/* Language and Currency in Dropdown */}
                      <div className="px-3 pt-2 grid grid-cols-2 gap-2">
                        <CurrencySelector variant="dropdown" />
                        <LanguageSelector variant="dropdown" />
                      </div>

                    </div>

                    {/* Footer / Sign Out Area */}
                    <div className="p-2 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <div className="text-start">
                            <p className="font-extrabold leading-tight">{translate(`Sign Out`)}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-0.5">{translate('End active session')}</p>
                          </div>
                        </div>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-signin-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 bg-[#0A2540] hover:bg-[#0091EA] text-white font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-full transition-all hover:scale-[1.02] cursor-pointer"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t.signIn}</span>
              </button>
            )}

          </div>

          {/* Mobile hamburger menu button */}
          <div id="navbar-mobile-controls" className="flex lg:hidden items-center gap-2.5">
            {/* Global Dark Mode Theme Toggle for Mobile */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-slate-500 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-700 transition-all active:scale-90 cursor-pointer shrink-0"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? (
                  <Sun className="w-4.5 h-4.5 text-amber-500 fill-amber-400/20" />
                ) : (
                  <Moon className="w-4.5 h-4.5 text-slate-600 dark:text-slate-400 fill-slate-500/10" />
                )}
              </button>
            )}

            {/* Quick Mobile Phone Action */}
            <a 
              id="phone-link-mobile-icon"
              href="tel:+94771231234"
              className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-[#0091EA] dark:text-sky-400 active:bg-[#0091EA]/10 transition-all active:scale-90 shrink-0"
              title={translate(`Call us`)}
            >
              <Phone className="w-4.5 h-4.5" />
            </a>

            {/* Drawer Toggle */}
            <button
              id="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-[#0A2540] dark:text-slate-300 hover:text-[#0091EA] hover:bg-slate-100 active:scale-90 transition-all cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slider / Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="navbar-mobile-drawer"
          className="lg:hidden fixed top-[84px] start-0 end-0 bottom-0 bg-[#0A2540]/40 dark:bg-black/50 backdrop-blur-xs z-45 transition-all"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-2xl p-6 space-y-6 animate-slide-down max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Account Panel at very top of Mobile Drawer */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              {currentUser ? (
                <div className="flex items-center gap-3.5 text-start bg-gradient-to-r from-sky-500/10 via-[#0091EA]/5 to-indigo-500/10 dark:from-slate-800 dark:to-slate-800/90 p-4 rounded-2xl border border-sky-500/20 dark:border-slate-700">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 bg-gradient-to-tr from-[#0091EA] to-indigo-600 text-white flex items-center justify-center font-black text-base rounded-2xl shadow-sm overflow-hidden">
                      {userProfile?.avatar || userProfile?.photoURL || userProfile?.profile_image ? (
                        <img 
                          src={userProfile.avatar || userProfile.photoURL || userProfile.profile_image} 
                          alt="User Avatar" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        (userProfile?.fullName || currentUser.email || 'T').charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="absolute -bottom-1 -end-1 w-3 h-3 bg-emerald-500 ring-2 ring-white dark:ring-slate-900 rounded-full" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-black text-sm text-[#0A2540] dark:text-slate-100 truncate leading-tight">{translate(userProfile?.fullName || 'Traveler')}</h5>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block truncate mt-0.5">{currentUser.email}</span>
                  </div>
                  {userProfile?.role === 'admin' ? (
                    <div className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[8px] font-black uppercase tracking-widest">
                      {translate('Admin')}
                    </div>
                  ) : userProfile?.role === 'vip' ? (
                    <div className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-widest">
                      {translate('VIP Traveler')}
                    </div>
                  ) : (
                    <div className="px-2 py-0.5 rounded-md bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 text-[8px] font-black uppercase tracking-widest">
                      {translate('Pending')}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#0A2540] dark:bg-slate-800 hover:bg-[#0091EA] dark:hover:bg-[#0091EA] text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>{translate('Sign In / Register')}</span>
                </button>
              )}
            </div>

            <nav className="flex flex-col gap-1.5">
              
              {/* 1. Home */}
              <button
                onClick={() => handleNavLinkClick('home')}
                className={`w-full text-start px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  isActive('home')
                    ? 'bg-[#0091EA]/10 text-[#0091EA]' 
                    : 'text-[#0A2540] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {t.home}
              </button>

              {/* 2. Tours (Expandable accordion on mobile) */}
              <div className="rounded-xl border border-transparent overflow-hidden">
                <button
                  onClick={() => setMobileToursOpen(!mobileToursOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    isActive('tour')
                      ? 'bg-[#0091EA]/5 text-[#0091EA]' 
                      : 'text-[#0A2540] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span>{t.tours}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileToursOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileToursOpen && (
                  <div className="bg-slate-50/50 dark:bg-slate-800/40 ps-6 pe-4 py-1.5 space-y-1">
                    <button
                      onClick={() => {
                        setCurrentPage('tour');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-start py-2 text-xs font-bold text-[#0A2540] dark:text-slate-200 hover:text-[#0091EA] dark:hover:text-[#0091EA] border-b border-dashed border-slate-100 dark:border-slate-800"
                    >
                      {translate(`View All Tours`)}
                    </button>
                    {tourCategories.map((cat, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTourCategoryClick(cat.dbValue)}
                        className="w-full text-start py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0091EA] dark:hover:text-sky-400"
                      >
                        {translate(cat.label)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Rent a Car */}
              <button
                onClick={() => handleNavLinkClick('rent-a-car')}
                className={`w-full text-start px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  isActive('rent-a-car')
                    ? 'bg-[#0091EA]/10 text-[#0091EA]' 
                    : 'text-[#0A2540] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {t.rentACar}
              </button>

              {/* 4. Contact Us */}
              <button
                onClick={() => handleNavLinkClick('contact-us')}
                className={`w-full text-start px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  isActive('contact-us')
                    ? 'bg-[#0091EA]/10 text-[#0091EA]' 
                    : 'text-[#0A2540] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {t.contactUs}
              </button>

              {/* 5. About Us */}
              <button
                onClick={() => handleNavLinkClick('about-us')}
                className={`w-full text-start px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  isActive('about-us')
                    ? 'bg-[#0091EA]/10 text-[#0091EA]' 
                    : 'text-[#0A2540] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {t.aboutUs}
              </button>

              {/* 6. Blog */}
              <button
                onClick={() => handleNavLinkClick('blog')}
                className={`w-full text-start px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${currentPage === 'blog' ? 'bg-[#0091EA]/10 text-[#0091EA] dark:bg-[#0091EA]/20 dark:text-[#0091EA]' : 'text-[#0A2540] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                {translate('Blog')}
              </button>

              {/* 7. Wishlist */}
              <button
                onClick={() => handleNavLinkClick('wishlist')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${currentPage === 'wishlist' ? 'bg-[#0091EA]/10 text-[#0091EA]' : 'text-[#0A2540] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                  <span>{translate('Wishlist')}</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Logged in member navigation accordion */}
              {currentUser && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 space-y-1">
                  <span className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest ps-4 mb-2">{translate(`Member Dashboard`)}</span>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentPage('account-dashboard');
                    }}
                    className={`w-full text-start px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      isActive('account-dashboard') && currentPage === 'account-dashboard' ? 'bg-[#0091EA]/10 text-[#0091EA]' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {translate(`My Dashboard`)}
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentPage('account-bookings');
                    }}
                    className={`w-full text-start px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      isActive('account-dashboard') && currentPage === 'account-bookings' ? 'bg-[#0091EA]/10 text-[#0091EA]' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {translate(`My Bookings`)}
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentPage('account-settings');
                    }}
                    className={`w-full text-start px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      isActive('account-dashboard') && currentPage === 'account-settings' ? 'bg-[#0091EA]/10 text-[#0091EA]' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {translate(`Profile Settings`)}
                  </button>

                  {['admin', 'hotel_manager', 'car_manager', 'flight_manager', 'tour_manager'].includes(userProfile?.role) && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setCurrentPage('admin');
                      }}
                      className="w-full text-start px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase text-amber-700 bg-amber-50/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-all cursor-pointer"
                    >
                      {translate('Admin Panel')}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full text-start px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                  >
                    {translate(`Sign Out`)}
                  </button>
                </div>
              )}

            </nav>

            {/* Mobile Contact & Language/Currency selection */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
              <CurrencySelector variant="mobile" onSelect={() => setMobileMenuOpen(false)} />
              <LanguageSelector variant="mobile" onSelect={() => setMobileMenuOpen(false)} />

              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-full bg-[#0091EA]/10 flex items-center justify-center text-[#0091EA]">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-start">
                  <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{translate('Hotline')}</span>
                  <a href="tel:+94771231234" className="block text-xs font-extrabold text-[#0A2540] dark:text-slate-200 hover:text-[#0091EA] transition-colors mt-0.5">+94 77 123 1234</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </motion.header>
  );
}
