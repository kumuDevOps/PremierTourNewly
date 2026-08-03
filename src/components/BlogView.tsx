import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { ChevronRight, Clock, User, ArrowRight, Search, MapPin, Compass, Play, Mail, Share2, Heart, MessageSquare, Cloud, ChevronLeft, Map, Camera, X, ArrowUp, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const CATEGORIES = [
  { id: 'beaches', name: 'Beaches', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
  { id: 'hill-country', name: 'Hill Country', image: 'https://images.unsplash.com/photo-1546843975-423e05748831?auto=format&fit=crop&q=80&w=800' },
  { id: 'wildlife', name: 'Wildlife', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800' },
  { id: 'heritage', name: 'Heritage', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800' },
  { id: 'food', name: 'Food', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800' },
  { id: 'trains', name: 'Scenic Train Journeys', image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=800' },
  { id: 'eco', name: 'Eco Tourism', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800' },
  { id: 'luxury', name: 'Luxury Escapes', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800' }
];

const ARTICLES = [
  { id: 1, title: 'The Ultimate Luxury Guide to Sigiriya Rock Fortress', category: 'Heritage', readTime: '8 min read', author: 'Isabella Rossi', date: 'Oct 15, 2026', excerpt: 'Ascend the ancient Lion Rock in style. Discover private guided tours, nearby boutique luxury stays, and hidden sunset viewpoints away from the crowds.', image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200' },
  { id: 2, title: 'Ella – Sri Lanka\'s Most Beautiful Mountain Escape', category: 'Hill Country', readTime: '6 min read', author: 'Julian Vance', date: 'Oct 12, 2026', excerpt: 'Mist-shrouded tea estates, the iconic Nine Arch Bridge, and exclusive eco-lodges make Ella the crown jewel of the high country.', image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200' },
  { id: 3, title: '10 Hidden Beaches You Must Visit in Sri Lanka', category: 'Beaches', readTime: '7 min read', author: 'Elena Cruz', date: 'Oct 09, 2026', excerpt: 'Escape the popular southern coast and discover secluded golden sands where luxury villas and pristine waters await.', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200' },
  { id: 4, title: 'The Scenic Train Journey from Kandy to Ella', category: 'Trains', readTime: '5 min read', author: 'Marcus Wei', date: 'Oct 07, 2026', excerpt: 'Experience the world\'s most beautiful train ride. Tips for securing first-class observation tickets and capturing the best photos.', image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200' },
  { id: 5, title: 'Yala National Park Safari Guide', category: 'Wildlife', readTime: '10 min read', author: 'David Hunter', date: 'Oct 05, 2026', excerpt: 'Track leopards in their natural habitat while staying in ultra-luxury tented camps that blend wilderness with five-star comfort.', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=1200' },
  { id: 6, title: 'Luxury Hotels in Sri Lanka Worth Every Dollar', category: 'Luxury Escapes', readTime: '12 min read', author: 'Sophie Laurent', date: 'Sep 28, 2026', excerpt: 'An exclusive curation of Aman resorts, boutique colonial manors, and contemporary wellness retreats across the island.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200' },
  { id: 7, title: 'Tea Plantation Experiences in Nuwara Eliya', category: 'Hill Country', readTime: '6 min read', author: 'James Sterling', date: 'Sep 22, 2026', excerpt: 'Step back in time to "Little England." Experience high tea, private tasting tours, and stays in meticulously restored planter bungalows.', image: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&q=80&w=1200' },
  { id: 8, title: 'Best Waterfalls in Sri Lanka', category: 'Eco Tourism', readTime: '8 min read', author: 'Maya Lin', date: 'Sep 18, 2026', excerpt: 'From Bambarakanda to Diyaluma. Discover the island\'s majestic cascading falls and the best times to visit for swimming.', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200' },
  { id: 9, title: 'A Complete Guide to Galle Fort', category: 'Heritage', readTime: '7 min read', author: 'Arthur Penn', date: 'Sep 15, 2026', excerpt: 'Wander cobbled streets lined with Dutch-colonial buildings, chic boutiques, and world-class seafood restaurants.', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200' },
  { id: 10, title: 'The Best Time to Visit Sri Lanka', category: 'Travel Tips', readTime: '4 min read', author: 'Elena Cruz', date: 'Sep 12, 2026', excerpt: 'Navigate the island\'s two monsoon seasons. A month-by-month breakdown to help you plan the perfect tropical getaway.', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200' },
  { id: 11, title: 'Top Romantic Honeymoon Destinations', category: 'Luxury Escapes', readTime: '9 min read', author: 'Sophie Laurent', date: 'Sep 08, 2026', excerpt: 'From secluded private pool villas in Tangalle to misty romantic hideaways in the central highlands.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200' },
  { id: 12, title: 'Luxury Wellness Retreats in Sri Lanka', category: 'Eco Tourism', readTime: '11 min read', author: 'Isabella Rossi', date: 'Sep 05, 2026', excerpt: 'Rejuvenate your mind, body, and soul with authentic Ayurvedic treatments in the world\'s most serene natural settings.', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=1200' }
];

const TRAVEL_TIPS = [
  { icon: Utensils, title: 'Fine Dining', desc: 'Savor world-class culinary experiences infused with local spices.', image: 'https://images.unsplash.com/photo-1544681280-d25a782adc9b?w=500&q=80', btnText: 'Explore Cuisine' },
  { icon: DollarSign, title: 'Currency', desc: 'LKR (Sri Lankan Rupee). High-end spots accept USD.', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&q=80', btnText: 'Exchange Info' },
  { icon: CloudRain, title: 'Weather', desc: 'Dec-Mar for South/West. May-Sep for East.', image: 'https://images.unsplash.com/photo-1513224502586-d1e602410265?w=500&q=80', btnText: 'Check Forecast' },
  { icon: Smartphone, title: 'Connectivity', desc: 'Pick up a tourist e-SIM at the airport.', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', btnText: 'Buy e-SIM' },
  { icon: Car, title: 'Transport', desc: 'Private luxury chauffeurs are highly recommended.', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80', btnText: 'Book Transfer' },
  { icon: Shield, title: 'Safety', desc: 'Very safe for tourists. Standard precautions apply.', image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500&q=80', btnText: 'Safety Guide' },
  { icon: MessageCircle, title: 'Language', desc: 'Sinhala & Tamil. English is widely spoken.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80', btnText: 'Learn Basics' }
];

import { FileText, DollarSign, CloudRain, Smartphone, Car, Shield, MessageCircle, Users, Utensils } from 'lucide-react';

const MAP_LOCATIONS = ['Sigiriya', 'Ella', 'Kandy', 'Mirissa', 'Bentota', 'Yala', 'Arugam Bay', 'Trincomalee', 'Nuwara Eliya', 'Anuradhapura', 'Polonnaruwa', 'Galle'];

const API_KEY = (process.env.GOOGLE_MAPS_PLATFORM_KEY || "").trim();
const isKeyProvided = Boolean(API_KEY) && API_KEY.startsWith("AIza") && API_KEY.length >= 30 && !API_KEY.includes("YOUR_");

interface BlogViewProps {
  onNavigate?: (page: string) => void;
}

export default function BlogView({ onNavigate }: BlogViewProps = {}) {
  const { scrollYProgress } = useScroll();
  const [articles, setArticles] = useState<any[]>(ARTICLES);
  const [categories, setCategories] = useState<any[]>(CATEGORIES);
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [showTop, setShowTop] = useState(false);
  const [mapAuthFailed, setMapAuthFailed] = useState(false);

  const [showLikedToast, setShowLikedToast] = useState(false);
  const [activeExploreLocation, setActiveExploreLocation] = useState<string>('Sri Lanka');

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterSubmitting(true);
    setNewsletterError('');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newsletterEmail })
      });
      if (res.ok) {
        setNewsletterSuccess(true);
        setNewsletterEmail('');
      } else {
        const data = await res.json().catch(() => ({}));
        setNewsletterError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setNewsletterError('An error occurred. Please try again later.');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const handleSelectArticle = (article: any) => {
    setSelectedArticle(article);
    if (article?.id) {
      fetch(`/api/blogs/${article.id}/view`, { method: 'POST' }).catch(() => {});
    }
  };

  const handleLikeArticle = (articleId: any) => {
    if (articleId) {
      fetch(`/api/blogs/${articleId}/like`, { method: 'POST' }).catch(() => {});
      setShowLikedToast(true);
      setTimeout(() => setShowLikedToast(false), 2500);
      if (selectedArticle && selectedArticle.id === articleId) {
        setSelectedArticle((prev: any) => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : prev);
      }
    }
  };

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) setArticles(data.articles);
        if (data.categories && data.categories.length > 0) setCategories(data.categories);
      }
    } catch (e) {
      console.warn('Could not fetch dynamic blogs, using default fallback', e);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // Listen for SSE updates
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime/stream');
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'catalog-updated') {
            fetchBlogs();
          }
        } catch (_) {}
      };
    } catch (_) {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  useEffect(() => {
    const prevAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = () => {
      setMapAuthFailed(true);
      if (typeof prevAuthFailure === "function") prevAuthFailure();
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setShowTop(latest > 0.1);
  });
  useEffect(() => { window.scrollTo(0, 0); }, [selectedArticle]);
  
  if (selectedArticle) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans text-slate-800 dark:text-slate-100 transition-colors pb-16">
        <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[#0091EA] origin-left z-[100]" style={{ scaleX: scrollYProgress }} />
        
        {/* HERO BANNER WITH BLUE GLOW CARD STYLE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="relative rounded-[32px] md:rounded-[40px] overflow-hidden border-2 border-sky-400/60 dark:border-sky-500/60 bg-slate-950 text-white shadow-2xl shadow-sky-500/30 animate-blue-glow min-h-[480px] md:min-h-[560px] flex flex-col justify-between p-6 md:p-12 group">
            <img 
              src={selectedArticle.image} 
              alt={selectedArticle.title} 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200';
              }}
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
            
            <div className="relative z-10">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center gap-2 text-sky-100 hover:text-white bg-slate-950/60 hover:bg-sky-950/80 border border-sky-400/50 px-5 py-2.5 rounded-full backdrop-blur-md shadow-lg shadow-sky-500/20 transition-all font-semibold text-xs tracking-wider uppercase cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-sky-400" /> Back to Journal
              </button>
            </div>
            
            <div className="relative z-10 space-y-4 max-w-4xl mt-12">
              <span className="px-4 py-1.5 bg-sky-500/20 backdrop-blur-md border border-sky-400/40 text-sky-300 text-xs font-black uppercase tracking-widest rounded-full inline-block">
                {selectedArticle.category}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                {selectedArticle.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-sky-100/90 font-semibold pt-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/60 rounded-full border border-sky-400/30 backdrop-blur-sm"><User className="w-4 h-4 text-sky-400" /> {selectedArticle.author}</div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/60 rounded-full border border-sky-400/30 backdrop-blur-sm"><Clock className="w-4 h-4 text-sky-400" /> {selectedArticle.date}</div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/60 rounded-full border border-sky-400/30 backdrop-blur-sm"><MapPin className="w-4 h-4 text-sky-400" /> Sri Lanka</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3">
            <div className="sticky top-28 space-y-8">
              {/* Share & Like card */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-sky-300/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 animate-blue-glow">
                <h4 className="text-xs font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-4">Share Article</h4>
                <div className="flex items-center gap-3">
                  <button className="w-11 h-11 rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#0091EA] hover:border-[#0091EA] transition-all shadow-sm">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleLikeArticle(selectedArticle.id)}
                    className="w-11 h-11 rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:border-rose-300 transition-all cursor-pointer shadow-sm group"
                    title="Like article"
                  >
                    <Heart className="w-4 h-4 fill-rose-500/20 text-rose-500 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                {selectedArticle.likes !== undefined && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-semibold">{selectedArticle.likes} readers liked this</p>
                )}
              </div>

              {/* Quick Facts card */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-sky-300/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 animate-blue-glow">
                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4 font-sans tracking-tight">Quick Facts</h4>
                <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex justify-between border-b border-sky-100 dark:border-slate-800 pb-2.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Best Time:</span> 
                    <span className="font-bold text-slate-900 dark:text-sky-300">Dec - April</span>
                  </li>
                  <li className="flex justify-between border-b border-sky-100 dark:border-slate-800 pb-2.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Duration:</span> 
                    <span className="font-bold text-slate-900 dark:text-sky-300">3-4 Days</span>
                  </li>
                  <li className="flex justify-between border-b border-sky-100 dark:border-slate-800 pb-2.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Budget:</span> 
                    <span className="font-bold text-slate-900 dark:text-sky-300">$$$ Luxury</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="lg:w-2/3 space-y-8 text-base md:text-lg text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
            <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug mb-8 border-l-4 border-[#0091EA] pl-4">
              {selectedArticle.excerpt}
            </p>
            <p>
              Sri Lanka is an island nation that defies expectations. Just when you think you've seen its most beautiful beach, a hidden cove reveals itself. Just when you believe you've tasted its finest curry, a humble roadside eatery redefines your palate. Our journey begins here, where luxury meets wild, untamed beauty.
            </p>
            
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-12 mb-6 tracking-tight">
              The Grand Arrival
            </h3>
            <p>
              Navigating the terrain requires both patience and an appreciation for the journey itself. Whether you opt for a private helicopter charter or a luxury SUV, the transition from the bustling coastal cities to the serene interior is nothing short of cinematic.
            </p>
            
            {/* Editor's Tip with Blue Glow */}
            <div className="my-10 p-8 bg-sky-50/90 dark:bg-sky-950/40 rounded-3xl border-2 border-sky-400/60 dark:border-sky-700/60 shadow-xl shadow-sky-500/15 animate-blue-glow relative overflow-hidden">
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-black text-xs uppercase tracking-widest mb-2">
                <Sparkles className="w-4 h-4 text-[#0091EA]" /> Editor's Tip
              </div>
              <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                Always pack a lightweight shawl or jacket. The temperature drop in the hill country can be surprisingly brisk, especially in the early mornings.
              </p>
            </div>

            <p>
              From the architecture that echoes colonial elegance to the ultra-modern eco-lodges perched on cliff edges, every accommodation tells a story. This isn't just about five-star service; it's about authentic, localized luxury that connects you deeply to the land.
            </p>

            {/* Live Interactive Google Map with Blue Glow */}
            <div className="w-full h-80 bg-slate-900 rounded-3xl my-10 border-2 border-sky-400/60 shadow-xl shadow-sky-500/20 animate-blue-glow relative overflow-hidden group">
              <iframe
                title="Article Destination Live Google Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent((selectedArticle?.title || 'Sigiriya') + ' Sri Lanka')}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full rounded-3xl"
              />
              <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full border border-sky-400/30 text-xs font-bold flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{selectedArticle?.title || 'Interactive Route Map'}</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((selectedArticle?.title || 'Sigiriya') + ' Sri Lanka')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 bg-slate-950/90 hover:bg-[#0091EA] text-white px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border border-sky-400/40 transition-all flex items-center gap-1.5 cursor-pointer z-10"
              >
                <MapPin className="w-3 h-3 text-sky-400 group-hover:text-white" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans selection:bg-[#0091EA] selection:text-white">
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[#0091EA] origin-left z-[100]" style={{ scaleX: scrollYProgress }} />
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=2400" 
            alt="Sigiriya" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A2540]/70 via-[#0A2540]/40 to-[#0A2540]/80" />
        </motion.div>

        {/* Animated Clouds */}
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-full opacity-20 pointer-events-none"
        >
          <Cloud className="w-48 h-48 text-white" />
        </motion.div>
        <motion.div 
          animate={{ x: [0, 1000] }} 
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-60 -left-64 opacity-10 pointer-events-none"
        >
          <Cloud className="w-64 h-64 text-white" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block text-[#0091EA] uppercase tracking-[0.3em] text-xs font-bold mb-6"
          >
            The Luxury Editorial
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-sans text-white leading-tight mb-8"
           
          >
            Discover Sri Lanka <br className="hidden md:block" /> 
            <span className="italic text-[#0091EA] font-light">Where Every Journey</span> <br className="hidden md:block" />
            Becomes a Story
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed mb-12"
          >
            Explore ancient kingdoms, misty mountains, golden beaches, wildlife safaris, tea plantations, luxury resorts, hidden waterfalls, and unforgettable cultural experiences.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={() => {
                document.getElementById('articles-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-[#0091EA] hover:bg-[#007cc7] text-white rounded-full font-medium tracking-wide transition-all duration-300 w-full sm:w-auto shadow-[0_8px_30px_rgb(200,169,106,0.3)]"
            >
              Read Articles
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-medium tracking-wide transition-all duration-300 w-full sm:w-auto">
              Plan Your Journey
            </button>
          </motion.div>
        </div>

      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl lg:text-5xl font-sans text-slate-900 mb-4">Curated Experiences</h2>
              <p className="text-slate-500 font-light max-w-2xl text-lg">Browse our collection of luxury travel stories by destination and experience type.</p>
            </div>
            <button className="text-sm font-semibold text-[#0091EA] flex items-center gap-2 hover:gap-3 transition-all">
              View All Categories <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative h-48 md:h-64 rounded-3xl overflow-hidden cursor-pointer border-2 border-sky-300/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 hover:border-[#0091EA] hover:shadow-2xl hover:shadow-sky-500/25 transition-all duration-300 animate-blue-glow"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  referrerPolicy="no-referrer" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800';
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                <h3 className="absolute bottom-5 left-5 text-white font-extrabold text-lg md:text-xl tracking-wide group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending / Featured Section */}
      <section className="py-24 bg-white dark:bg-slate-950 border-y border-sky-100 dark:border-sky-900/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-[#0091EA]"></span>
              <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent">Editor's Choice</span>
            </h2>
            {articles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group relative rounded-[32px] overflow-hidden bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 flex flex-col lg:flex-row shadow-2xl shadow-sky-500/15 cursor-pointer border-2 border-sky-200/80 dark:border-sky-800/60 hover:border-[#0091EA] transition-all duration-300 animate-blue-glow"
                onClick={() => handleSelectArticle(articles[0])}
              >
                <div className="lg:w-1/2 relative overflow-hidden min-h-[400px]">
                  <img 
                    src={articles[0].image} 
                    alt={articles[0].title} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200';
                    }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />
                </div>
                <div className="lg:w-1/2 p-10 lg:p-12 flex flex-col justify-center z-10 relative">
                  <span className="inline-flex px-3.5 py-1.5 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white text-xs font-black uppercase tracking-widest rounded-full mb-6 w-fit shadow-md shadow-sky-500/20">
                    {articles[0].category}
                  </span>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-[#0091EA] transition-colors">
                    {articles[0].title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8 text-sm">
                    {articles[0].excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-sky-800 dark:text-sky-300 font-bold">
                    <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#0091EA]" /> {articles[0].author}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#0091EA]" /> {articles[0].readTime}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-[#0091EA]"></span>
              <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent">Trending Stories</span>
            </h2>
            <div className="space-y-6">
              {articles.slice(1, 4).map((article, idx) => (
                <div 
                  key={article.id} 
                  className="group flex gap-5 items-center cursor-pointer p-3.5 rounded-2xl bg-gradient-to-br from-white via-sky-50/30 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 border border-sky-100 dark:border-sky-800/50 hover:border-[#0091EA] transition-all shadow-sm"
                  onClick={() => handleSelectArticle(article)}
                >
                  <div className="text-3xl font-black text-[#0091EA] italic w-8 text-center shrink-0">
                    0{idx + 1}
                  </div>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 relative">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200';
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#0091EA] font-black uppercase tracking-widest block mb-1">{article.category}</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-[#0091EA] transition-colors">{article.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section id="articles-grid" className="py-24 bg-slate-50/50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">
              <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent">Latest from the Journal</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <motion.article 
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                className="group flex flex-col h-full cursor-pointer bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] p-4 border-2 border-sky-200/80 dark:border-sky-800/60 hover:border-[#0091EA] shadow-xl shadow-sky-500/10 hover:shadow-2xl hover:shadow-sky-500/20 hover:-translate-y-1 transition-all duration-300 animate-blue-glow"
                onMouseEnter={() => setHoveredArticle(article.id)}
                onMouseLeave={() => setHoveredArticle(null)}
                onClick={() => handleSelectArticle(article)}
              >
                <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200';
                    }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 bg-slate-950/80 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest rounded-full shadow-md border border-sky-400/30">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-grow px-2">
                  <div className="flex items-center gap-4 text-[11px] font-black text-sky-800 dark:text-sky-300 mb-3 uppercase tracking-wider">
                    <span>{article.date}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0091EA]" />
                    <span>{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-[#0091EA] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6 flex-grow text-xs">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-sky-200/60 dark:border-sky-800/50 flex items-center justify-between">
                    <span className="text-xs font-black text-[#0091EA] uppercase tracking-widest">Read Article</span>
                    <motion.div 
                      animate={{ x: hoveredArticle === article.id ? 5 : 0 }}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-[#0091EA] group-hover:bg-[#0091EA] group-hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Sri Lanka Map (Mock) */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/3">
            <h2 className="text-4xl font-sans text-white mb-6">Explore the Map</h2>
            <p className="text-slate-400 font-light text-lg mb-8">Interact with our curated map to discover handpicked destinations, luxury stays, and scenic routes.</p>
            <div className="flex flex-wrap gap-2">
              {MAP_LOCATIONS.map((loc) => {
                const isActive = activeExploreLocation === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => setActiveExploreLocation(loc)}
                    className={`px-4 py-2 border rounded-full text-sm font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#0091EA] text-white border-[#0091EA] shadow-lg shadow-sky-500/30' 
                        : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-sky-400'
                    }`}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="lg:w-2/3 w-full h-[500px] bg-slate-800 rounded-3xl border-2 border-sky-400/60 flex flex-col items-center justify-center text-slate-500 shadow-2xl shadow-sky-500/20 relative overflow-hidden animate-blue-glow">
            <iframe
              key={activeExploreLocation}
              title={`Explore ${activeExploreLocation} Sri Lanka Map`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(activeExploreLocation + ' Sri Lanka')}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full rounded-3xl"
            ></iframe>
            <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-sky-400/40 text-xs font-black flex items-center gap-2 shadow-xl z-10">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Google Maps: {activeExploreLocation}</span>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeExploreLocation + ' Sri Lanka')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-slate-950/90 hover:bg-[#0091EA] text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-xl border border-sky-400/40 transition-all flex items-center gap-2 cursor-pointer z-10"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400 group-hover:text-white" />
              <span>Open in Google Maps</span>
            </a>
          </div>
        </div>
      </section>

      {/* Photography Gallery */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-sans text-slate-900 dark:text-white mb-4">Through the Lens</h2>
            <p className="text-slate-500 dark:text-slate-400 font-light max-w-2xl mx-auto text-lg">Cinematic moments captured across the island.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl overflow-hidden relative group cursor-pointer border-2 border-sky-300/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 hover:border-[#0091EA] animate-blue-glow h-72">
              <img 
                src="https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=800" 
                alt="Gallery" 
                referrerPolicy="no-referrer" 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=800'; }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"><Camera className="text-white w-8 h-8" /></div>
            </div>
            <div className="rounded-3xl overflow-hidden relative group cursor-pointer border-2 border-sky-300/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 hover:border-[#0091EA] animate-blue-glow h-72">
              <img 
                src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800" 
                alt="Gallery - Sri Lanka Safari" 
                referrerPolicy="no-referrer" 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800'; }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"><Camera className="text-white w-8 h-8" /></div>
            </div>
            <div className="rounded-3xl overflow-hidden relative group cursor-pointer border-2 border-sky-300/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 hover:border-[#0091EA] animate-blue-glow h-72">
              <img 
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800" 
                alt="Gallery" 
                referrerPolicy="no-referrer" 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'; }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"><Camera className="text-white w-8 h-8" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-24 bg-[#0A2540] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2540] via-[#0A2540]/90 to-[#0091EA]/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 relative z-10">
          <div className="text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[#0091EA] uppercase tracking-[0.3em] text-xs font-bold mb-4"
            >
              Essential Guides
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-sans text-white mb-6"
            >
              Travel Extras
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/70 font-light max-w-2xl mx-auto text-lg"
            >
              Everything you need to take your journey further.
            </motion.p>
          </div>
        </div>

        <div className="relative w-full flex overflow-x-hidden group z-10 pb-12">
          {/* Fading Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0A2540] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0A2540] to-transparent z-20 pointer-events-none" />
          
          <motion.div 
            className="flex gap-6 px-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          >
            {[...TRAVEL_TIPS, ...TRAVEL_TIPS].map((tip, idx) => (
              <div 
                key={idx}
                className="w-[320px] shrink-0 bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col hover:bg-white/10 border-2 border-sky-400/40 hover:border-[#0091EA] transition-all duration-500 group/card cursor-pointer shadow-lg shadow-sky-500/10 animate-blue-glow"
              >
                <div className="h-52 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#0A2540]/30 group-hover/card:bg-transparent transition-colors duration-500 z-10" />
                  <img src={tip.image} alt={tip.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110" />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg z-20 group-hover/card:scale-110 transition-transform duration-500">
                    <tip.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-[#0091EA] transition-colors">{tip.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-8 flex-grow font-light">{tip.desc}</p>
                  <button className="w-full py-3.5 bg-transparent border border-white/20 hover:border-[#0091EA] hover:bg-[#0091EA] text-white rounded-full text-xs font-bold transition-all tracking-widest uppercase">
                    {tip.btnText}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden flex justify-center px-6">
        {/* Animated Light Blue background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-32 left-20 w-[500px] h-[500px] bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl w-full flex flex-col md:flex-row relative z-10 shadow-2xl shadow-sky-500/20 rounded-3xl overflow-hidden border-2 border-sky-400/50 animate-blue-glow"
        >
          {/* Left Column */}
          <div className="md:w-1/2 bg-[#0091EA] p-12 md:p-16 flex items-center justify-center relative overflow-hidden group">
            {/* Animated background shape in left column */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute -right-20 -top-20 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl"
               />
               <motion.div 
                 animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute -left-20 -bottom-20 w-48 h-48 bg-white rounded-full mix-blend-overlay filter blur-2xl"
               />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight relative z-10 text-center md:text-left">
              Where to next?
            </h2>
          </div>

          {/* Right Column */}
          <div className="md:w-1/2 bg-[#333333] p-12 md:p-16 flex flex-col justify-center">
            <p className="text-white font-medium text-base md:text-lg mb-8 leading-relaxed">
              For exclusive deals, tailored holiday packages, and the best of the Premier Tour Booking portfolio, add your email below.
            </p>

            {newsletterSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-950/80 border border-emerald-500/50 p-6 rounded-2xl text-emerald-300 flex items-start gap-4 shadow-xl"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base mb-1">You're Subscribed!</h4>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    Thank you for subscribing. Exclusive luxury offers and tailored holiday packages will be delivered to your inbox.
                  </p>
                  <button 
                    type="button"
                    onClick={() => setNewsletterSuccess(false)}
                    className="mt-3 text-xs font-bold text-sky-400 hover:text-sky-300 underline cursor-pointer"
                  >
                    Subscribe another email
                  </button>
                </div>
              </motion.div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email address" 
                  className="flex-grow px-4 py-3 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-[#0091EA] transition-all bg-white text-slate-900 placeholder-slate-500 font-medium text-base shadow-inner disabled:opacity-60"
                  required
                  disabled={newsletterSubmitting}
                />
                <button 
                  type="submit" 
                  disabled={newsletterSubmitting}
                  className="px-8 py-3 bg-[#0091EA] hover:bg-[#007cc7] text-white rounded-md font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap text-base cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {newsletterSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing up...</span>
                    </>
                  ) : (
                    <span>Sign up</span>
                  )}
                </button>
              </form>
            )}

            {newsletterError && (
              <p className="text-xs font-bold text-rose-400 mt-3 flex items-center gap-1.5">
                <span>{newsletterError}</span>
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <button 
                type="button" 
                onClick={() => setShowPrivacyModal(true)}
                className="text-[11px] text-white/50 hover:text-sky-300 transition-colors underline cursor-pointer font-medium"
              >
                Privacy Notice
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Privacy Notice Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8 border border-sky-200 dark:border-sky-800 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 text-[#0091EA] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Privacy Notice</h3>
              </div>

              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                <p>
                  At Premier Tour Booking, we prioritize your privacy and data security. By subscribing to our newsletter, you consent to receive curated travel guides, luxury deals, and exclusive holiday packages.
                </p>
                <p>
                  We store your email address securely and strictly adhere to international privacy regulations. We will never sell or share your information with third parties.
                </p>
                <p className="text-xs text-slate-400">
                  You can unsubscribe at any time by clicking the unsubscribe link in any email or contacting our support team.
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="flex-1 py-3 bg-[#0091EA] hover:bg-[#007cc7] text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer text-center"
                >
                  Understood
                </button>
                {onNavigate && (
                  <button 
                    onClick={() => {
                      setShowPrivacyModal(false);
                      onNavigate('about-us');
                    }}
                    className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all cursor-pointer"
                  >
                    About Us
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-600 hover:text-[#0091EA] border border-slate-200 z-50 hover:-translate-y-1 transition-all duration-300"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
