import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Trash2, 
  Compass, 
  Search, 
  Share2, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Star, 
  MapPin, 
  Calendar, 
  Car, 
  Hotel, 
  Plane, 
  ShieldCheck, 
  Eye, 
  Filter,
  Layers,
  ShoppingBag,
  ChevronRight,
  Wind
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { motion, AnimatePresence } from 'motion/react';

interface WishlistViewProps {
  wishlist: any[];
  removeFromWishlist: (id: number) => void;
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenAuth: () => void;
  currentUser: any;
  userProfile: any;
  clearWishlist?: () => void;
}

export default function WishlistView({
  wishlist,
  removeFromWishlist,
  onNavigate,
  onOpenAuth,
  currentUser,
  userProfile,
  clearWishlist
}: WishlistViewProps) {
  const { formatPrice } = useCurrency();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<any | null>(null);

  // Filtered and sorted list
  const filteredWishlist = useMemo(() => {
    return wishlist.filter((item) => {
      // Category check
      const type = (item.type || item.category || 'tour').toLowerCase();
      if (activeCategory !== 'all' && !type.includes(activeCategory)) {
        return false;
      }

      // Search check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (item.title || item.name || '').toLowerCase();
        const location = (item.location || item.destination || '').toLowerCase();
        const category = (item.category || item.type || '').toLowerCase();
        return title.includes(q) || location.includes(q) || category.includes(q);
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.priceUSD || a.price || 0;
      const priceB = b.priceUSD || b.price || 0;
      const ratingA = a.rating || a.stars || 5;
      const ratingB = b.rating || b.stars || 5;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return ratingB - ratingA;
      return 0; // Default newest
    });
  }, [wishlist, activeCategory, searchQuery, sortBy]);

  // Total calculated value
  const totalValueUSD = useMemo(() => {
    return wishlist.reduce((sum, item) => sum + (item.priceUSD || item.price || 0), 0);
  }, [wishlist]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts = { all: wishlist.length, tour: 0, hotel: 0, flight: 0, car: 0 };
    wishlist.forEach((item) => {
      const type = (item.type || item.category || 'tour').toLowerCase();
      if (type.includes('tour')) counts.tour++;
      else if (type.includes('hotel')) counts.hotel++;
      else if (type.includes('flight')) counts.flight++;
      else if (type.includes('car')) counts.car++;
    });
    return counts;
  }, [wishlist]);

  const handleCopyShareLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  const getItemCategoryIcon = (item: any, className?: string) => {
    const type = (item.type || item.category || 'tour').toLowerCase();
    if (type.includes('hotel')) return <Hotel className={className || "w-4 h-4 text-emerald-500"} />;
    if (type.includes('flight')) return <Plane className={className || "w-4 h-4 text-sky-500"} />;
    if (type.includes('car')) return <Car className={className || "w-4 h-4 text-indigo-500"} />;
    return <Compass className={className || "w-4 h-4 text-[#0091EA]"} />;
  };

  const getItemCategoryLabel = (item: any) => {
    const type = (item.type || item.category || 'tour').toLowerCase();
    if (type.includes('hotel')) return 'Hotel Stay';
    if (type.includes('flight')) return 'Flight Deal';
    if (type.includes('car')) return 'Car Rental';
    return 'Guided Tour';
  };

  const handleBookNow = (item: any) => {
    const type = (item.type || item.category || 'tour').toLowerCase();
    if (type.includes('hotel')) onNavigate('hotels');
    else if (type.includes('flight')) onNavigate('flights');
    else if (type.includes('car')) onNavigate('rent-a-car');
    else onNavigate('tour');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden font-sans pb-20 dark:bg-[#080d17] dark:text-slate-100 transition-colors duration-500">
      
      {/* Light Blue Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-200/40 dark:bg-sky-900/20 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-blue-200/30 dark:bg-blue-900/10 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-cyan-100/40 dark:bg-cyan-900/10 blur-[80px]"
        />
        
        {/* Subtle Grid overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.02]" />
      </div>

      <div className="relative z-10">
        {/* Top Header Hero Section */}
        <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sky-100 dark:border-slate-800/80 pb-8"
          >
            
            <div className="space-y-4 max-w-2xl">
              {/* Live Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-sky-100 dark:border-sky-900/50 text-sky-600 dark:text-sky-300 text-xs font-black uppercase tracking-widest shadow-sm">
                <Sparkles className="w-4 h-4 text-sky-500 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Your Saved Adventures</span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-indigo-400">Wishlist</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
                Handpicked itineraries, luxury stays, and memorable journeys saved for your next Sri Lankan getaway.
              </p>
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyShareLink}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-sky-100 dark:border-slate-700 text-sm font-extrabold text-slate-700 dark:text-slate-200 shadow-sm transition-colors cursor-pointer group"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-sky-500 group-hover:text-sky-600 transition-colors" />
                    <span>Share Wishlist</span>
                  </>
                )}
              </motion.button>

              {wishlist.length > 0 && clearWishlist && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearWishlist}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-100 dark:border-rose-500/30 text-sm font-extrabold text-rose-600 dark:text-rose-400 shadow-sm transition-colors cursor-pointer group"
                  title="Clear all saved items"
                >
                  <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span className="hidden sm:inline">Clear All</span>
                </motion.button>
              )}
            </div>

          </motion.div>

          {/* Dynamic Metric Stats Cards */}
          {wishlist.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5"
            >
              
              {/* Total Items */}
              <div className="relative overflow-hidden p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-sky-50 dark:border-sky-900/30 shadow-lg shadow-sky-100/50 dark:shadow-none flex items-center gap-5 hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-200/50 dark:bg-sky-900/20 rounded-bl-full blur-xl -z-10" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-50 dark:from-sky-900/40 dark:to-slate-800 border border-sky-200 dark:border-sky-700 flex items-center justify-center shrink-0 shadow-sm">
                  <Heart className="w-6 h-6 fill-sky-500 text-sky-500" />
                </div>
                <div>
                  <span className="text-xs font-black text-sky-600/80 dark:text-sky-400 uppercase tracking-wider block mb-1">Total Saved</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">{wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}</span>
                </div>
              </div>

              {/* Estimated Total Value */}
              <div className="relative overflow-hidden p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-blue-50 dark:border-blue-900/30 shadow-lg shadow-blue-100/50 dark:shadow-none flex items-center gap-5 hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/50 dark:bg-blue-900/20 rounded-bl-full blur-xl -z-10" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-slate-800 border border-blue-200 dark:border-blue-700 flex items-center justify-center shrink-0 shadow-sm">
                  <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-xs font-black text-blue-600/80 dark:text-blue-400 uppercase tracking-wider block mb-1">Estimated Value</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">{formatPrice(totalValueUSD || 250)}</span>
                </div>
              </div>

              {/* Protection Guarantee Badge */}
              <div className="relative overflow-hidden p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-indigo-50 dark:border-indigo-900/30 shadow-lg shadow-indigo-100/50 dark:shadow-none flex items-center gap-5 hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-200/50 dark:bg-indigo-900/20 rounded-bl-full blur-xl -z-10" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-slate-800 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <span className="text-xs font-black text-indigo-600/80 dark:text-indigo-400 uppercase tracking-wider block mb-1">Guarantee</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 leading-tight">100% Price<br/>Protection</span>
                </div>
              </div>

            </motion.div>
          )}

        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          {wishlist.length === 0 ? (
            /* Empty Wishlist Slate Screen */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="my-12 p-10 sm:p-20 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 border border-sky-100 dark:border-slate-800 backdrop-blur-2xl text-center relative overflow-hidden shadow-2xl shadow-sky-100/50 dark:shadow-none"
            >
              
              {/* Animated Floating Shapes */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-32 h-32 bg-sky-200/40 dark:bg-sky-800/30 rounded-full blur-3xl pointer-events-none"
              />
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} 
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-10 w-40 h-40 bg-blue-200/40 dark:bg-blue-800/30 rounded-full blur-3xl pointer-events-none"
              />

              <div className="relative z-10 max-w-2xl mx-auto">
                {/* Wind/Compass Animation */}
                <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-sky-100 dark:bg-slate-800 animate-ping opacity-60" />
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 p-[3px] shadow-2xl shadow-sky-200 dark:shadow-sky-900/50 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-sky-500">
                      <Wind className="w-12 h-12" />
                    </div>
                  </div>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">
                  Your Journey Awaits
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium mb-10 leading-relaxed">
                  Discover the beauty of Sri Lanka. Heart your favorite tours, luxury stays, flights, and car rentals to save them here for easy booking later.
                </p>

                {/* Quick Recommendation Discovery Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 text-left">
                  <motion.button
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                    onClick={() => onNavigate('tour')}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-sky-50 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-500 transition-colors cursor-pointer group shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-900/30 text-sky-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Compass className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-extrabold text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Explore Tours</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Cultural & wildlife</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                    onClick={() => onNavigate('hotels')}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-sky-50 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors cursor-pointer group shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Hotel className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-extrabold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Luxury Hotels</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Villas & resorts</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                    onClick={() => onNavigate('rent-a-car')}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-sky-50 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors cursor-pointer group shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Car className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-extrabold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Rent A Car</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Chauffeur & self-drive</p>
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('tour')}
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm shadow-xl shadow-slate-900/20 dark:shadow-white/20 transition-all cursor-pointer group"
                >
                  <span>Start Exploring Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

            </motion.div>
          ) : (
            /* Active Wishlist Content & Filter Tools */
            <div className="space-y-8">
              
              {/* Filter Tabs & Search Controls */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 sm:p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-sky-100 dark:border-slate-800/80 backdrop-blur-xl flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm"
              >
                
                {/* Category Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 scrollbar-none">
                  {[
                    { id: 'all', label: 'All Items', count: categoryCounts.all, icon: Layers },
                    { id: 'tour', label: 'Tours', count: categoryCounts.tour, icon: Compass },
                    { id: 'hotel', label: 'Hotels', count: categoryCounts.hotel, icon: Hotel },
                    { id: 'flight', label: 'Flights', count: categoryCounts.flight, icon: Plane },
                    { id: 'car', label: 'Car Rentals', count: categoryCounts.car, icon: Car },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveCategory(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 border ${
                          isActive 
                            ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/25' 
                            : 'bg-white dark:bg-slate-950 hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-sky-100 dark:border-slate-800'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{tab.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search input & Sort Selector */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                  <div className="relative flex-1 w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search items..."
                      className="w-full ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-sky-100 dark:border-slate-800 text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-sm"
                    />
                  </div>

                  <div className="relative shrink-0 w-full sm:w-auto">
                    <select
                      value={sortBy}
                      onChange={(e: any) => setSortBy(e.target.value)}
                      className="w-full sm:w-auto appearance-none px-5 py-3 ltr:pr-10 rtl:pl-10 rounded-2xl bg-white dark:bg-slate-950 border border-sky-100 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 cursor-pointer shadow-sm transition-all"
                    >
                      <option value="newest">Recently Saved</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                    <Filter className="w-4 h-4 text-slate-400 absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

              </motion.div>

              {/* Grid of Wishlist Item Cards */}
              <AnimatePresence mode="wait">
                {filteredWishlist.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="py-20 text-center bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-sky-50 dark:border-slate-800/80 backdrop-blur-sm"
                  >
                    <Search className="w-12 h-12 text-sky-200 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 text-base font-bold">No saved items match your current filter criteria.</p>
                    <button
                      onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                      className="mt-6 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-700 text-sm font-extrabold text-sky-600 dark:text-sky-400 transition-colors shadow-sm cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {filteredWishlist.map((item) => {
                      const imageSrc = item.image || item.img || item.photoUrl || item.heroImage || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80';
                      const title = item.title || item.name || 'Sri Lanka Tour Package';
                      const location = item.location || item.destination || 'Sri Lanka';
                      const price = item.priceUSD || item.price || 150;
                      const rating = item.rating || item.stars || 4.9;

                      return (
                        <motion.div
                          variants={itemVariants}
                          key={item.id}
                          className="group relative rounded-[2rem] bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-500/50 overflow-hidden shadow-lg shadow-sky-100/50 dark:shadow-none transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-200/50 flex flex-col"
                        >
                          {/* Image Thumbnail Header */}
                          <div className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                            <img
                              src={imageSrc}
                              alt={title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />

                            {/* Category Badge */}
                            <div className="absolute top-4 ltr:left-4 rtl:right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-slate-700 shadow-lg">
                              {getItemCategoryIcon(item)}
                              <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-wider">{getItemCategoryLabel(item)}</span>
                            </div>

                            {/* Heart Remove Action Button */}
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="absolute top-4 ltr:right-4 rtl:left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-rose-500 hover:bg-rose-500 hover:text-white shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                              title="Remove from wishlist"
                            >
                              <Heart className="w-5 h-5 fill-current" />
                            </button>

                            {/* Location Tag */}
                            <div className="absolute bottom-4 ltr:left-4 rtl:right-4 flex items-center gap-1.5 text-xs font-black text-white">
                              <MapPin className="w-4 h-4 text-sky-400" />
                              <span className="drop-shadow-md">{location}</span>
                            </div>
                          </div>

                          {/* Card Content Details */}
                          <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                                  <Star className="w-4 h-4 fill-amber-500" />
                                  <span>{rating}</span>
                                  <span className="text-slate-400 dark:text-slate-500 font-medium">({item.reviews || 24})</span>
                                </div>
                                {item.duration && (
                                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {item.duration}
                                  </span>
                                )}
                              </div>

                              <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
                                {title}
                              </h3>

                              {item.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            {/* Card Footer: Price & Direct Book Action */}
                            <div className="pt-4 flex items-center justify-between gap-3">
                              <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Total Price</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{formatPrice(price)}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedItemForModal(item)}
                                  className="w-11 h-11 flex items-center justify-center rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 transition-colors cursor-pointer"
                                  title="Quick View Details"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>

                                <button
                                  onClick={() => handleBookNow(item)}
                                  className="h-11 px-5 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-sky-500 hover:bg-sky-600 text-white text-sm font-black shadow-lg shadow-sky-500/20 transition-all hover:scale-105 cursor-pointer"
                                >
                                  <span>Book</span>
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

        </div>
      </div>

      {/* Quick View Detail Modal */}
      <AnimatePresence>
        {selectedItemForModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-sky-900/20 p-8 space-y-6 flex flex-col max-h-[90vh]"
            >
              
              <div className="relative h-56 -mx-8 -mt-8 mb-2 overflow-hidden shrink-0">
                <img 
                  src={selectedItemForModal.image || selectedItemForModal.img || selectedItemForModal.photoUrl || selectedItemForModal.heroImage} 
                  alt={selectedItemForModal.title || selectedItemForModal.name}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent" />
                
                <button
                  onClick={() => setSelectedItemForModal(null)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-slate-800 dark:text-white hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-colors shadow-sm"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-none space-y-4 -mx-2 px-2">
                <div className="flex items-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-500/20 text-xs font-black uppercase tracking-wider">
                    {getItemCategoryIcon(selectedItemForModal, "w-3.5 h-3.5")}
                    {getItemCategoryLabel(selectedItemForModal)}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {selectedItemForModal.title || selectedItemForModal.name}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {selectedItemForModal.description || 'Experience the authentic charm and scenic landscapes of Sri Lanka with our verified booking service.'}
                </p>
                
                <div className="flex items-center gap-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                   <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl">
                      <MapPin className="w-4 h-4 text-sky-500" />
                      <span>{selectedItemForModal.location || selectedItemForModal.destination || 'Sri Lanka'}</span>
                   </div>
                   <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-amber-600 dark:text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{selectedItemForModal.rating || selectedItemForModal.stars || '4.9'}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-sky-100 dark:border-slate-800 shrink-0">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-black mb-1">Total Price</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{formatPrice(selectedItemForModal.priceUSD || selectedItemForModal.price || 150)}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const item = selectedItemForModal;
                    setSelectedItemForModal(null);
                    handleBookNow(item);
                  }}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-sm shadow-xl shadow-sky-500/25 cursor-pointer transition-colors"
                >
                  <span>Proceed to Book</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

