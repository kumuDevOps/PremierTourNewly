import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  MapPin, 
  Clock, 
  DollarSign, 
  Filter, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  ArrowLeft, ArrowRight, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Check,
  X,
  Star,
  MessageSquare,
  Sparkles,
  Image as ImageIcon,
  Maximize2, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tour, ItineraryDay } from '../types.ts';
import { HOTEL_PACKAGES } from '../data.ts';
import DatePicker from './DatePicker.tsx';
import BookingConfirmationModal from './BookingConfirmationModal.tsx';
import BookingSuccessModal from './BookingSuccessModal.tsx';
import BookingProgressBar from './BookingProgressBar.tsx';
import MapView from './MapView.tsx';
import TourRouteMap from './TourRouteMap.tsx';
import { useLanguage } from '../lib/i18n.tsx';
import { useCurrency } from '../lib/CurrencyContext.tsx';

interface ToursViewProps {
  key?: string;
  addToWishlist: (item: any) => void;
  initialSearchQuery?: { from: string; to: string };
  initialCategory?: string;
  currentUser?: any;
  userProfile?: any;
  onOpenAuth?: () => void;
  onNavigate?: (page: string) => void;
}

export default function ToursView({ 
  addToWishlist, 
  initialSearchQuery, 
  initialCategory,
  currentUser,
  userProfile,
  onOpenAuth,
  onNavigate
}: ToursViewProps) {
  const { translate } = useLanguage();
  const { formatPrice, currency } = useCurrency();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery?.to || '');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  // Detail View State
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Lightbox Modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const getTourGallery = (tour: Tour | null): string[] => {
    if (!tour) return [];
    let images: string[] = [];
    if (tour.galleryImages) {
      try {
        images = typeof tour.galleryImages === 'string' ? JSON.parse(tour.galleryImages) : tour.galleryImages;
      } catch (e) {
        if (typeof tour.galleryImages === 'string' && tour.galleryImages.includes(',')) {
          images = tour.galleryImages.split(',').map(s => s.trim());
        } else if (typeof tour.galleryImages === 'string' && tour.galleryImages.trim().length > 0) {
          images = [tour.galleryImages.trim()];
        }
      }
    }
    if (!Array.isArray(images) || images.length === 0) {
      images = [
        tour.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200',
        'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200',
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200'
      ];
    } else {
      if (tour.imageUrl && !images.includes(tour.imageUrl)) {
        images.unshift(tour.imageUrl);
      }
    }
    return images;
  };

  // Booking form state
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingDate, setBookingDate] = useState('2026-08-15');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [visiblePackageCount, setVisiblePackageCount] = useState(2);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Review states
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Real-time Availability State
  const [availabilityMap, setAvailabilityMap] = useState<Record<number, any>>({});

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/availability');
      if (res.ok) {
        const data = await res.json();
        if (data && data.tours) {
          setAvailabilityMap(data.tours);
        }
      }
    } catch (e) {
      console.error('Error fetching availability:', e);
    }
  };

  useEffect(() => {
    fetchAvailability();

    // Setup real-time EventSource listener for live updates
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime/stream');
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'availability-updated') {
            if (parsed.data && parsed.data.tours) {
              setAvailabilityMap(parsed.data.tours);
            } else {
              fetchAvailability();
            }
          } else if (parsed.type === 'booking-created' || parsed.type === 'booking-updated') {
            fetchAvailability();
          }
        } catch (err) {
          // ignore stream parse errors
        }
      };
    } catch (e) {
      // ignore event source failover
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // Sync profile details to form when loaded
  useEffect(() => {
    if (userProfile) {
      setBookingName(userProfile.fullName || '');
      setBookingPhone(userProfile.phone || '');
    }
    if (currentUser?.email) {
      setBookingEmail(currentUser.email);
    }
  }, [currentUser, userProfile]);

  useEffect(() => {
    fetchTours();

    const checkUrlForTour = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const tourIdStr = searchParams.get('id');
      if (tourIdStr) {
        const tourId = parseInt(tourIdStr, 10);
        if (!isNaN(tourId)) {
          loadTourDetails(tourId);
        }
      } else {
        setActiveTour(null);
      }
    };

    checkUrlForTour();

    window.addEventListener('popstate', checkUrlForTour);
    return () => window.removeEventListener('popstate', checkUrlForTour);
  }, [selectedCategory, maxPrice]);

  const fetchTours = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `/api/tours?maxPrice=${maxPrice}`;
      if (selectedCategory !== 'All') {
        url += `&category=${selectedCategory}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTours(Array.isArray(data) && data.length > 0 ? data : getFallbackTours());
      } else {
        setTours(getFallbackTours());
      }
    } catch (err) {
      console.error(err);
      setTours(getFallbackTours());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackTours = (): Tour[] => {
    let list: Tour[] = [
      {
        id: 1,
        title: "Sigiriya & Dambulla Heritage Tour",
        category: "Cultural",
        duration: "1 Day",
        price: 120,
        location: "Sigiriya, Sri Lanka",
        imageUrl: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80",
        description: "Climb the ancient 5th-century Sigiriya Rock Fortress (UNESCO World Heritage) and explore the sacred Dambulla Cave Temple complex featuring over 150 Buddha statues.",
        highlights: "['UNESCO World Heritage', 'Ancient Frescoes', 'Mirror Wall', 'Golden Temple']" as any
      },
      {
        id: 2,
        title: "Ella Hill Country & Nine Arch Railway Journey",
        category: "Scenic",
        duration: "2 Days / 1 Night",
        price: 240,
        location: "Ella & Nuwara Eliya",
        imageUrl: "https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&q=80",
        description: "Experience the world-famous blue train ride through lush tea plantations, marvel at Nine Arch Bridge, and hike Little Adam's Peak.",
        highlights: "['Scenic Blue Train', 'Nine Arch Bridge', 'Tea Factory Tour', 'Little Adam\'s Peak']" as any
      },
      {
        id: 3,
        title: "Yala National Park Wild Leopard Safari",
        category: "Wildlife",
        duration: "1 Day",
        price: 180,
        location: "Yala National Park",
        imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
        description: "Embark on an exciting 4x4 Jeep Safari in Yala, world-renowned for highest leopard density, wild elephants, sloth bears, and exotic birds.",
        highlights: "['4x4 Safari Jeep', 'Highest Leopard Density', 'Elephant Herds', 'Bird Watching']" as any
      },
      {
        id: 4,
        title: "Mirissa Blue Whale Watching & Galle Fort",
        category: "Beach",
        duration: "1 Day",
        price: 140,
        location: "Mirissa & Galle",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        description: "Sail into the Indian Ocean to spot Blue Whales and Dolphins, followed by a sunset walking tour of 16th-century Portuguese Galle Fort.",
        highlights: "['Blue Whale Spotting', 'Galle Fort UNESCO Site', 'Coconut Tree Hill', 'Turtle Hatchery']" as any
      },
      {
        id: 5,
        title: "Cultural Heritage Explorer (Kandy, Polonnaruwa & Anuradhapura)",
        category: "Cultural",
        duration: "7 Days",
        price: 850,
        location: "Cultural Triangle",
        imageUrl: "https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200",
        description: "Comprehensive week-long journey through Sri Lanka's ancient royal kingdoms, sacred temples, and UNESCO world heritage sites.",
        highlights: "['Sacred Tooth Relic Temple', 'Polonnaruwa Ruins', 'Sigiriya Lion Rock', 'Kandy Botanical Gardens']" as any
      }
    ];

    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (maxPrice && maxPrice > 0) {
      list = list.filter(t => Number(t.price) <= Number(maxPrice));
    }
    return list;
  };

  const fetchReviews = async (tourId: number) => {
    setLoadingReviews(true);
    setReviewError('');
    try {
      const res = await fetch(`/api/tours/${tourId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviewsList(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTour) return;
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (!newComment.trim()) {
      setReviewError('Comment cannot be empty.');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess(false);

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/tours/${activeTour.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: newRating,
          comment: newComment.trim()
        })
      });

      if (res.ok) {
        const result = await res.json();
        setReviewSuccess(true);
        setNewComment('');
        setNewRating(5);
        // Prepend new review
        setReviewsList(prev => [result.review, ...prev]);
      } else {
        const errData = await res.json();
        setReviewError(errData.error || 'Failed to submit review.');
      }
    } catch (err) {
      console.error(err);
      setReviewError('An error occurred while submitting your review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (activeTour) {
      fetchReviews(activeTour.id);
    }
  }, [activeTour?.id]);

  const loadTourDetails = async (id: number) => {
    setLoadingDetail(true);
    setBookingSuccess(false);
    setReviewSuccess(false);
    setNewComment('');
    setNewRating(5);
    try {
      const res = await fetch(`/api/tours/${id}`);
      if (res.ok) {
        const data = await res.json();
        setActiveTour(data);
        window.history.pushState({}, '', `/tour?id=${id}`);
        // Scroll to top of detail view
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Could not retrieve details for this tour.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTour) return;
    
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmAndBookTour = async () => {
    if (!activeTour) return;
    setBookingSubmitting(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userName: bookingName,
          email: bookingEmail,
          phone: bookingPhone,
          tourId: activeTour.id,
          travelDate: bookingDate,
          guests: bookingGuests
        })
      });
      if (res.ok) {
        setBookingSuccess(true);
        setShowConfirmModal(false);
        setBookingName('');
        setBookingEmail('');
        setBookingPhone('');
        
        // Trigger celebratory confetti animation
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0091EA', '#00E676', '#FFD600', '#FF1744', '#AA00FF']
        });
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while placing the booking.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery, selectedCategory, maxPrice]);

  const filteredTours = tours.filter((tour) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (tour.title && tour.title.toLowerCase().includes(q)) || 
      (tour.category && tour.category.toLowerCase().includes(q)) ||
      (tour.description && tour.description.toLowerCase().includes(q)) ||
      (tour.location && tour.location.toLowerCase().includes(q));
    return matchesSearch;
  });

  const visibleTours = filteredTours.slice(0, visibleCount);

  return (
    <div id="tours-view" className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pb-20 transition-colors">
      
      {activeTour ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          
          {/* Visual Progress Bar Component */}
          <BookingProgressBar
            currentStep={bookingSuccess ? 4 : showConfirmModal ? 3 : 2}
            type="tour"
            onStepClick={(stepNum) => {
              if (stepNum === 1) {
                setActiveTour(null);
                setShowConfirmModal(false);
                setBookingSuccess(false);
              }
            }}
          />

          {/* Back button */}
          <button
            onClick={() => {
              setActiveTour(null);
              window.history.pushState({}, '', '/tour');
            }}
            className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-bold text-sm mb-6 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-800 hover:shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {translate('Back to Tour Explorer')}
          </button>

          {/* Tour Detail Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Col: Tour Information */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Image Bento Gallery Header */}
              {(() => {
                const tourGallery = getTourGallery(activeTour);
                const mainImage = tourGallery[0] || activeTour.imageUrl || 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200';
                const sideImages = tourGallery.slice(1, 5);

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] overflow-hidden border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 p-4 sm:p-6 animate-blue-glow space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-[400px] md:h-[500px]">
                      {/* Main Large Image */}
                      <div 
                        onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
                        className="relative md:col-span-2 md:row-span-2 rounded-[24px] overflow-hidden group cursor-pointer border border-sky-100 dark:border-sky-800/50 shadow-md"
                      >
                        <img 
                          src={mainImage} 
                          alt={translate(activeTour.title)} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          referrerPolicy="no-referrer" 
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white text-[10px] uppercase font-black tracking-widest rounded-full mb-3 shadow-lg shadow-sky-500/30 animate-light-blue-pulse">
                            <Compass className="w-3.5 h-3.5" />
                            {translate(activeTour.category)}
                          </span>
                          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg">{translate(activeTour.title)}</h2>
                        </div>
                      </div>
                      
                      {/* Smaller Images */}
                      {sideImages.map((imgUrl, idx) => {
                        const isLast = idx === 3 || idx === sideImages.length - 1;
                        const actualIdx = idx + 1;
                        return (
                          <div 
                            key={idx}
                            onClick={() => { setLightboxIndex(actualIdx); setLightboxOpen(true); }}
                            className="hidden md:block relative rounded-[20px] overflow-hidden group cursor-pointer border border-sky-100 dark:border-sky-800/40 shadow-sm"
                          >
                            <img 
                              src={imgUrl} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              alt={`${activeTour.title} - Luxury Holidays & Safari Gallery Photo ${actualIdx}`} 
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600'; }}
                            />
                            {isLast ? (
                              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center transition-colors group-hover:bg-slate-950/70">
                                <span className="flex items-center gap-2 text-white font-black text-xs bg-gradient-to-r from-[#0091EA] to-cyan-500 px-4 py-2.5 rounded-xl border border-sky-300/40 shadow-xl">
                                  <ImageIcon className="w-4 h-4" />
                                  <span>{translate('View all')} ({tourGallery.length}) {translate('photos')}</span>
                                </span>
                              </div>
                            ) : (
                              <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                {/* Quick stats panel */}
                <div className="grid grid-cols-3 divide-x divide-sky-200/60 dark:divide-sky-800/60 border border-sky-200/60 dark:border-sky-800/50 text-center py-5 bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-inner backdrop-blur-md">
                  <div>
                    <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest block mb-1.5">{translate('Duration')}</span>
                    <p className="text-sm md:text-base font-black text-gray-900 dark:text-white flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-[#0091EA] animate-pulse" />
                      {translate(activeTour.duration)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest block mb-1.5">{translate('Category')}</span>
                    <p className="text-sm md:text-base font-black text-gray-900 dark:text-white flex items-center justify-center gap-2">
                      <Compass className="w-4 h-4 text-[#0091EA]" />
                      {translate(activeTour.category)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest block mb-1.5">{translate('Base Price')}</span>
                    <p className="text-sm md:text-base font-black text-gray-900 dark:text-white flex items-center justify-center gap-1">
                      <span className="text-xl font-black bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 bg-clip-text text-transparent">{formatPrice(activeTour.price)}</span>
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 sm:p-6 space-y-3 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-sky-100 dark:border-sky-900/40">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0091EA]" />
                    {translate('Experience Overview')}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">{translate(activeTour.description)}</p>
                </div>
              </motion.div>
            );
          })()}

              {/* Package Options (Similar to Rooms) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] overflow-hidden border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 p-6 sm:p-8 animate-blue-glow"
              >
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0091EA] animate-ping" />
                  <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent">
                    {translate('Available Packages')}
                  </span>
                </h3>
                <div className="space-y-4">
                  {HOTEL_PACKAGES.slice(0, visiblePackageCount).map((pkg, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.01 }}
                      onClick={() => onNavigate && onNavigate('hotels')}
                      className="cursor-pointer flex flex-col sm:flex-row gap-4 p-5 border-2 border-sky-100 dark:border-sky-900/50 rounded-2xl hover:border-[#0091EA] hover:shadow-lg hover:shadow-sky-500/15 transition-all bg-white/90 dark:bg-slate-800/70 backdrop-blur-md"
                    >
                      <div className="w-full sm:w-48 h-32 shrink-0 rounded-xl overflow-hidden relative shadow-sm">
                        <img src={pkg.img || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80'} alt={pkg.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/10" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-base font-black text-gray-900 dark:text-white mb-1.5">{translate(pkg.title)}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-3">
                          {translate(pkg.desc)}
                        </p>
                        <button onClick={() => onNavigate && onNavigate('hotels')} className="text-[#0091EA] dark:text-sky-400 text-xs font-black text-start hover:underline w-fit flex items-center gap-1">
                          {translate('Show details')} →
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {visiblePackageCount < HOTEL_PACKAGES.length && (
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setVisiblePackageCount(HOTEL_PACKAGES.length)}
                    className="w-full py-3.5 mt-2 rounded-2xl border-2 border-sky-300 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-950/30 text-[#0091EA] dark:text-sky-300 font-black text-xs uppercase tracking-wider hover:bg-sky-100/80 dark:hover:bg-sky-900/50 transition-all shadow-sm"
                  >
                    {translate('Show 2 more options')}
                  </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Dynamic Interactive Tour Route Map */}
              <TourRouteMap tourTitle={activeTour.title} itineraryJson={activeTour.itinerary} />

              {/* Itinerary */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 p-6 sm:p-8 shadow-xl shadow-sky-500/10 animate-blue-glow"
              >
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#0091EA]" />
                  <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent">
                    {translate('Daily Itinerary')}
                  </span>
                </h3>
                
                <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-1 before:bg-gradient-to-b before:from-[#0091EA] before:via-sky-400 before:to-cyan-400 before:rounded-full">
                  {(() => {
                    try {
                      const days: ItineraryDay[] = JSON.parse(activeTour.itinerary);
                      return days.map((day, idx) => (
                        <div key={`itinerary-day-${day.day}-${idx}`} id={`itinerary-day-${day.day}-${idx}`} className="relative pl-12 text-start group">
                          {/* Circle Timeline indicator */}
                          <div className="absolute start-0 top-0.5 w-8 h-8 rounded-full bg-gradient-to-tr from-[#0091EA] to-cyan-400 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-black text-white shadow-md shadow-sky-500/30 group-hover:scale-125 transition-all duration-300 z-10">
                            {day.day}
                          </div>
                          <div className="p-4 bg-white/80 dark:bg-slate-800/60 rounded-2xl border border-sky-100 dark:border-sky-900/40 shadow-xs group-hover:shadow-md group-hover:border-sky-300 transition-all">
                            <h4 className="text-base font-black text-gray-900 dark:text-white group-hover:text-[#0091EA] transition-colors">{translate(day.title)}</h4>
                            <p className="text-xs text-[#0091EA] font-bold mt-1">{translate(day.shortDesc || 'No summary available')}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">{translate(day.desc)}</p>
                          </div>
                        </div>
                      ));
                    } catch (e) {
                      return <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{translate('Detailed itinerary information is currently unavailable.')}</p>;
                    }
                  })()}
                </div>
              </motion.div>

              {/* What's Included */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 p-6 sm:p-8 shadow-xl shadow-sky-500/10 animate-blue-glow grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="bg-emerald-50/80 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800/50 p-6 rounded-2xl shadow-sm">
                  <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    {translate('Inclusions')}
                  </h4>
                  <ul className="space-y-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-black">✓</span> {translate('Handpicked premium hotel accommodations')}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-black">✓</span> {translate('Professional bilingual local tour guide')}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-black">✓</span> {translate('Daily organic breakfasts & custom dinners')}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-black">✓</span> {translate('All site entrance fees & national park tickets')}
                    </li>
                  </ul>
                </div>
                <div className="bg-rose-50/80 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-800/50 p-6 rounded-2xl shadow-sm">
                  <h4 className="text-xs font-black text-rose-700 dark:text-rose-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <X className="w-4 h-4 text-rose-500" />
                    {translate('Exclusions')}
                  </h4>
                  <ul className="space-y-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-rose-500 font-black">✗</span> {translate('International flights & visa expenses')}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-500 font-black">✗</span> {translate('Personal shopping, souvenirs & tips')}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-rose-500 font-black">✗</span> {translate('Travel insurance coverage')}
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Animated & Colorful Reviews & Ratings section */}
              <motion.div 
                id="reviews-section" 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 p-6 sm:p-10 shadow-xl shadow-sky-500/10 space-y-8 overflow-hidden animate-blue-glow"
              >
                {/* Decorative background ambient glows */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-sky-400/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-400/15 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 dark:border-sky-900/50 pb-6 relative z-10">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
                      <div className="p-2.5 bg-gradient-to-tr from-[#0091EA] via-sky-500 to-cyan-400 text-white rounded-2xl shadow-md shadow-sky-500/30 animate-light-blue-pulse">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent">
                        {translate('Reviews & Ratings')}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-1">
                      {translate('What our guests say about this experience')}
                    </p>
                  </div>

                  {/* Summary Rating badge */}
                  {reviewsList.length > 0 && (
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-sky-200/70 dark:border-sky-700/50 shadow-md shadow-sky-500/10 self-start sm:self-auto"
                    >
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const avg = reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length;
                          return (
                            <Star
                              key={`avg-star-${star}`}
                              className={`w-4 h-4 transition-transform hover:scale-125 ${
                                star <= Math.round(avg)
                                  ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                                  : 'text-gray-300 dark:text-slate-700'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {(reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length).toFixed(1)}
                      </span>
                      <span className="text-xs text-sky-600 dark:text-sky-300 font-extrabold bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-full">
                        {reviewsList.length} {reviewsList.length === 1 ? translate('review') : translate('reviews')}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Rating Breakdown Bars */}
                {reviewsList.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-sky-200/60 dark:border-sky-800/40 shadow-inner relative z-10">
                    <div className="flex flex-col justify-center items-center text-center p-4 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 dark:from-sky-500/20 dark:to-cyan-500/10 rounded-2xl border border-sky-200/50 dark:border-sky-700/30">
                      <span className="text-6xl font-black bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-xs">
                        {(reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length).toFixed(1)}
                      </span>
                      <div className="flex items-center gap-1 mt-2 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const avg = reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length;
                          return (
                            <Star
                              key={`summary-star-${star}`}
                              className={`w-5 h-5 ${
                                star <= Math.round(avg)
                                  ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                                  : 'text-gray-300 dark:text-slate-700'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-2xs font-black text-sky-700 dark:text-sky-300 uppercase tracking-widest bg-sky-100/80 dark:bg-sky-900/60 px-3 py-1 rounded-full mt-1">
                        {reviewsList.length} {translate('Verified Guest Reviews')}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex flex-col justify-center">
                      {[5, 4, 3, 2, 1].map((ratingVal) => {
                        const count = reviewsList.filter(r => r.rating === ratingVal).length;
                        const pct = reviewsList.length > 0 ? (count / reviewsList.length) * 100 : 0;
                        return (
                          <div key={`breakdown-${ratingVal}`} className="flex items-center gap-3 text-xs">
                            <span className="w-8 text-end font-black text-gray-700 dark:text-slate-300 flex items-center justify-end gap-1">
                              {ratingVal} <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            </span>
                            <div className="flex-1 h-2.5 bg-sky-100/80 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, delay: 0.1 * ratingVal }}
                                className="h-full bg-gradient-to-r from-[#0091EA] via-sky-400 to-cyan-400 rounded-full shadow-sm"
                              />
                            </div>
                            <span className="w-8 text-sky-600 dark:text-sky-400 text-start font-black">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Submission Form for Authenticated Users */}
                <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-lg shadow-sky-500/5 relative z-10">
                  {currentUser ? (
                    <form onSubmit={handleSubmitReview} className="space-y-6 text-start">
                      <h4 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
                        {translate('Write a Review')}
                      </h4>

                      {/* Interactive Rating Input */}
                      <div>
                        <label className="block text-xs font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest mb-2">
                          {translate('Your Rating')}
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={`input-star-${star}`}
                              type="button"
                              whileHover={{ scale: 1.25, rotate: 6 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setNewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="p-1 focus:outline-none cursor-pointer"
                            >
                              <Star
                                className={`w-8 h-8 transition-colors ${
                                  (hoverRating !== null ? star <= hoverRating : star <= newRating)
                                    ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                                    : 'text-gray-300 dark:text-slate-700'
                                }`}
                              />
                            </motion.button>
                          ))}
                          <span className="text-xs font-black text-sky-700 dark:text-sky-300 uppercase tracking-widest ml-2 bg-gradient-to-r from-sky-100 to-cyan-100 dark:from-sky-950 dark:to-cyan-950 px-3 py-1 rounded-xl border border-sky-200/60 dark:border-sky-800">
                            {newRating === 5 ? translate('Excellent') :
                             newRating === 4 ? translate('Very Good') :
                             newRating === 3 ? translate('Average') :
                             newRating === 2 ? translate('Below Average') :
                             translate('Poor')}
                          </span>
                        </div>
                      </div>

                      {/* Comment Input */}
                      <div>
                        <label className="block text-xs font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest mb-2">
                          {translate('Review Comments')}
                        </label>
                        <textarea
                          rows={4}
                          required
                          placeholder={translate('Describe your experience, what you enjoyed most, and tips for future travelers...')}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full px-4 py-3 border.5 border-sky-200 dark:border-sky-800 bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA] focus:border-[#0091EA] focus:outline-none rounded-2xl text-sm transition-all shadow-inner"
                        />
                      </div>

                      {reviewError && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{reviewError}</span>
                        </motion.div>
                      )}

                      {reviewSuccess && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                        >
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{translate('Your review has been shared. Thank you for your feedback!')}</span>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={submittingReview}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-3.5 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-500 text-white font-black rounded-2xl text-xs hover:from-sky-500 hover:to-cyan-400 transition-all flex items-center gap-2 shadow-lg shadow-sky-500/25 disabled:opacity-50 cursor-pointer animate-light-blue-pulse"
                      >
                        {submittingReview ? translate('Sharing...') : translate('Post Review')}
                      </motion.button>
                    </form>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-600 dark:text-slate-400 font-medium mb-4">
                        {translate('Only authenticated guests can share their travel feedback.')}
                      </p>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onOpenAuth}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#0091EA] to-sky-600 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-sky-500/20 cursor-pointer"
                      >
                        {translate('Sign In / Sign Up')}
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Review list */}
                <div className="space-y-6 relative z-10">
                  <h4 className="text-base font-black text-gray-900 dark:text-white border-b border-sky-100 dark:border-sky-900/50 pb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0091EA] animate-ping"></span>
                    {translate('Guest Feedback')}
                  </h4>

                  {loadingReviews ? (
                    <div className="text-center py-12">
                      <div className="w-10 h-10 border-4 border-sky-100 dark:border-sky-950 border-t-[#0091EA] rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-xs text-sky-600 dark:text-sky-400 font-bold">{translate('Loading guest comments...')}</p>
                    </div>
                  ) : reviewsList.length === 0 ? (
                    <div className="text-center py-12 bg-white/50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-sky-200 dark:border-sky-900/50 p-6">
                      <MessageSquare className="w-10 h-10 text-sky-400 dark:text-sky-600 mx-auto mb-3 animate-float-sky" />
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{translate('Be the first to share feedback for this tour package!')}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviewsList.map((review: any, idx: number) => (
                        <motion.div 
                          key={`review-item-${review.id}`} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="flex gap-4 text-start p-5 bg-white/80 dark:bg-slate-900/70 rounded-2xl border border-sky-100 dark:border-sky-900/40 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700 transition-all"
                        >
                          <div className="shrink-0 mt-1">
                            <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-md shadow-sky-500/10 animate-light-blue-pulse" style={{ backgroundColor: review.rating >= 4.5 ? '#0091EA' : review.rating >= 3 ? '#0284c7' : '#0369a1' }}>
                              {review.rating.toFixed(1)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-black text-gray-900 dark:text-white">{review.userName}</p>
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={`rev-${review.id}-star-${s}`} className={`w-3.5 h-3.5 ${s <= Math.round(review.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-slate-700'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold mt-0.5 mb-2">
                              {translate('Reviewed on')} {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-medium">
                              {review.comment}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

            </div>

            {/* Right Col: Sticky Booking Card */}
            <div className="xl:col-span-4 space-y-6">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-white via-sky-50/50 to-slate-50 dark:from-slate-900 dark:via-sky-950/30 dark:to-slate-900 rounded-[32px] border-2 border-sky-300/80 dark:border-sky-700/60 p-6 sm:p-8 shadow-2xl shadow-sky-500/20 lg:sticky lg:top-24 animate-blue-glow"
              >
                
                {bookingSuccess ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-lg shadow-emerald-500/30 animate-bounce">✓</div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white">{translate('Booking Successful!')}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {translate('Your booking request has been submitted to Premier Tour. We have sent a confirmation email. A representative will reach out in 24 hours.')}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setBookingSuccess(false)}
                      className="w-full py-3.5 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
                    >
                      {translate('Book Another Experience')}
                    </motion.button>
                  </div>
                ) : (
                  <form onSubmit={handleBookSubmit} className="space-y-4 text-start">
                    <div className="border-b border-sky-200/80 dark:border-sky-800/60 pb-4">
                      <span className="text-[10px] text-sky-700 dark:text-sky-300 font-black uppercase tracking-widest">{translate('Start Planning')}</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-black bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 bg-clip-text text-transparent">{formatPrice(activeTour.price)}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">/ {translate('per person')}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">{translate('Your Full Name')}</label>
                      <input
                        type="text"
                        required
                        placeholder={translate(`Sarah Smith`)}
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-sky-200 dark:border-sky-800/80 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA] focus:border-[#0091EA] focus:outline-none rounded-xl text-sm mt-1 transition-all shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">{translate('Email Address')}</label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@example.com"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-sky-200 dark:border-sky-800/80 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA] focus:border-[#0091EA] focus:outline-none rounded-xl text-sm mt-1 transition-all shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">{translate('Phone Number')}</label>
                      <input
                        type="tel"
                        required
                        placeholder="+44 7911 123456"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-sky-200 dark:border-sky-800/80 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA] focus:border-[#0091EA] focus:outline-none rounded-xl text-sm mt-1 transition-all shadow-inner"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">{translate('Travel Date')}</label>
                        <DatePicker
                          value={bookingDate}
                          onChange={(date) => setBookingDate(date)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">{translate('Guests')}</label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          required
                          value={bookingGuests}
                          onChange={(e) => setBookingGuests(parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2.5 border-2 border-sky-200 dark:border-sky-800/80 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl text-sm mt-1 font-extrabold focus:ring-2 focus:ring-[#0091EA] focus:outline-none"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={bookingSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-500 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 disabled:opacity-50 cursor-pointer animate-light-blue-pulse mt-2"
                    >
                      {bookingSubmitting ? translate('Processing request...') : translate('Book Travel Now')}
                    </motion.button>

                    <div className="text-center pt-2">
                      <p className="text-[10px] text-sky-700 dark:text-sky-300 font-bold leading-normal">
                        {translate('Your booking is fully flexible. We do not charge cancellation fees up to 14 days before your departure.')}
                      </p>
                    </div>
                  </form>
                )}

              </motion.div>

              {/* Assistance Card */}
              <div className="relative bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-8 rounded-[32px] border-2 border-sky-500/30 shadow-xl shadow-sky-950/50 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-400/20 rounded-full blur-2xl pointer-events-none"></div>
                <h4 className="font-black text-lg mb-2 text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  {translate('Need Group Booking?')}
                </h4>
                <p className="text-xs text-sky-200/80 mt-2 font-medium leading-relaxed">{translate('We provide custom layouts, custom dates, and discounted group rates for groups larger than 10 passengers.')}</p>
                <a href="tel:+94761668155" className="mt-6 inline-flex items-center gap-1.5 text-xs font-black text-sky-300 hover:text-white bg-sky-900/60 border border-sky-700/50 px-4 py-2.5 rounded-xl transition-all shadow-md">{translate('Speak to Consultants (+94 76 166 8155) →')}</a>
              </div>

            </div>

          </div>

        </div>
      ) : (
        <div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            {/* Page Banner Header */}
            <div className="relative w-full h-[320px] md:h-[400px] rounded-[32px] overflow-hidden mb-12 shadow-2xl flex items-center justify-center border-2 border-sky-400/40 animate-blue-glow bg-slate-950">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2000&q=80" alt="Travel Header" className="w-full h-full object-cover scale-105 filter brightness-90 transform transition-transform duration-1000 hover:scale-100" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-sky-950/50 via-transparent to-cyan-950/50" />
              </div>
              
              {/* Ambient Glows */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none z-0" />
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none z-0" />

              <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sky-500/30 animate-light-blue-pulse">
                  <Compass className="w-3.5 h-3.5 text-white animate-pulse" />
                  {translate('Curated Experiences')}
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-xl">
                  <span className="bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent">{translate('Discover the Extraordinary')}</span>
                </h1>
                <p className="text-sky-100/90 text-xs md:text-sm font-medium max-w-xl mx-auto leading-relaxed drop-shadow-md">
                  {translate('Embark on unforgettable journeys with our meticulously crafted travel packages. From pristine beaches to historic cities.')}
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 md:p-8 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 animate-blue-glow mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              
              {/* Category selector */}
              <div className="w-full lg:w-auto">
                <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest block mb-3">{translate('Travel Style')}</span>
                <div className="flex flex-wrap gap-2.5">
                  {['All', 'Beach', 'City', 'Adventure', 'Cultural'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30 transform scale-105' 
                          : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-2 border-sky-100 dark:border-sky-800/50 hover:border-[#0091EA] hover:bg-sky-50/60 dark:hover:bg-slate-700 shadow-xs'
                      }`}
                    >
                      {translate(cat)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row w-full lg:w-auto gap-8 lg:gap-10 items-start lg:items-center flex-1 lg:justify-end">
                {/* Price slider */}
                <div className="w-full md:w-64">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest">{translate('Max Budget')}</span>
                    <span className="text-sm font-black text-[#0091EA] bg-sky-100 dark:bg-sky-950/80 px-3 py-1 rounded-xl border border-sky-200 dark:border-sky-800/50 shadow-xs">{formatPrice(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="2000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                    className="w-full accent-[#0091EA] h-2 bg-sky-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer border border-sky-200/60 dark:border-sky-800/40"
                  />
                </div>

                {/* Search input */}
                <div className="w-full md:w-72">
                  <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest block mb-3">{translate('Search Tours')}</span>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0091EA]" />
                    <input
                      type="text"
                      placeholder={translate('Destination, title...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 focus:border-[#0091EA] rounded-2xl text-xs md:text-sm font-bold focus:outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-xs"
                    />
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="w-full md:w-auto mt-2 md:mt-0 flex flex-col justify-end">
                  <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest block mb-3 hidden md:block opacity-0">.</span>
                  <div className="flex bg-sky-100/70 dark:bg-slate-950 p-1.5 rounded-2xl border-2 border-sky-200/80 dark:border-sky-800/60 shadow-inner">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        viewMode === 'list' 
                          ? 'bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white shadow-md shadow-sky-500/20' 
                          : 'text-sky-900 dark:text-sky-300 hover:text-[#0091EA] font-extrabold'
                      }`}
                    >
                      {translate('List View')}
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        viewMode === 'map' 
                          ? 'bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white shadow-md shadow-sky-500/20' 
                          : 'text-sky-900 dark:text-sky-300 hover:text-[#0091EA] font-extrabold'
                      }`}
                    >
                      {translate('Map View')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tours Grid */}
            <div className="pb-16">
              {loading && (
                <div className="py-24 text-center">
                  <div className="w-12 h-12 border-4 border-gray-200 dark:border-slate-800 border-t-[#0091EA] rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 font-bold">{translate('Retrieving exquisite tour departures...')}</p>
                </div>
              )}

              {error && (
                <div className="py-12 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/50 rounded-2xl text-center text-rose-600 dark:text-rose-400 font-bold">
                  <AlertCircle className="w-8 h-8 mx-auto mb-3" />
                  {translate(error)}
                </div>
              )}

              {!loading && !error && filteredTours.length === 0 && (
                <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-[24px] border border-dashed border-gray-200 dark:border-slate-800">
                  <Compass className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-gray-800 dark:text-slate-200 font-bold text-lg mb-1">{translate('No Tours Found')}</p>
                  <p className="text-sm text-gray-500 font-medium">{translate('Try raising the maximum budget or changing your search terms.')}</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setMaxPrice(2000);
                      setSelectedCategory('All');
                    }}
                    className="mt-6 px-6 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors text-gray-800 dark:text-white"
                  >
                    {translate('Clear Filters')}
                  </button>
                </div>
              )}

              {!loading && !error && filteredTours.length > 0 && viewMode === 'map' && (
                <div className="w-full bg-white dark:bg-slate-900 p-4 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-800 mb-8">
                  <MapView 
                    items={filteredTours.map(t => ({
                      id: t.id,
                      name: t.title,
                      locationName: t.description.includes('Locations:') ? t.description.split('Locations:')[1].trim() : 'Sri Lanka',
                      price: t.price,
                      imageUrl: t.imageUrl,
                      type: 'tour'
                    }))}
                    onMarkerClick={(item) => {
                      const tour = tours.find(t => t.id.toString() === item.id.toString());
                      if (tour) loadTourDetails(tour.id);
                    }}
                  />
                </div>
              )}

              {!loading && !error && filteredTours.length > 0 && viewMode === 'list' && (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {visibleTours.map((tour) => {
                    const tourKey = tour.tourId || tour.id;
                    const avail = availabilityMap[tourKey];
                    const isSoldOut = avail && avail.status === 'sold_out';
                    const isLimited = avail && avail.status === 'limited';

                    return (
                      <div 
                        key={tour.id} 
                        onClick={() => loadTourDetails(tour.tourId || tour.id)}
                        className="group flex flex-col bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 p-3 shadow-xl shadow-sky-500/10 hover:shadow-2xl hover:shadow-sky-500/20 hover:border-[#0091EA] transition-all duration-300 animate-blue-glow h-full min-h-[440px] cursor-pointer"
                      >
                        <div className="relative w-full h-[240px] rounded-[24px] overflow-hidden mb-5">
                          <img 
                            src={tour.imageUrl || 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800'} 
                            alt={translate(tour.title)} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
                          
                          {/* Wishlist Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToWishlist(tour);
                            }}
                            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/80 backdrop-blur-md border border-sky-400/30 flex items-center justify-center text-white shadow-lg hover:bg-[#0091EA] hover:text-white transition-all cursor-pointer group/wishlist"
                            aria-label={translate(`Add to wishlist`)}
                          >
                            <Heart className="w-4 h-4 group-hover/wishlist:fill-current" />
                          </button>

                          {/* Realtime Availability Badge Top Right - shifted down to avoid wishlist button */}
                          <div className="absolute top-15 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-sky-400/30 text-white shadow-lg">
                            <span className={`w-2 h-2 rounded-full ${
                              isSoldOut ? 'bg-rose-500' : isLimited ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
                            }`} />
                            <span className={`text-[10px] font-black uppercase tracking-wider ${
                              isSoldOut ? 'text-rose-400' : isLimited ? 'text-amber-300' : 'text-emerald-300'
                            }`}>
                              {avail ? translate(avail.badgeText) : translate('Instant Available')}
                            </span>
                          </div>

                          {tour.description.includes('Locations:') && (
                            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-sky-400/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 max-w-[50%] shadow-sm">
                              <MapPin className="w-3.5 h-3.5 text-[#0091EA] flex-shrink-0" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-white truncate">
                                {translate(tour.description)}
                              </span>
                            </div>
                          )}
                          
                          <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-sky-400/30">
                            <span className="text-[10px] uppercase tracking-widest font-black text-white">{translate(tour.category)}</span>
                          </div>
                        </div>
                        
                        <div className="px-3 flex flex-col flex-1 pb-2">
                          <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2 transition-colors group-hover:text-[#0091EA]">{translate(tour.title)}</h3>
                          
                          <div className="flex items-center gap-1 text-sky-800 dark:text-sky-300 mb-6 mt-1 font-bold">
                            <Clock className="w-4 h-4 text-[#0091EA]" />
                            <span className="text-xs">{translate(tour.duration)}</span>
                          </div>
                          
                          <div className="mt-auto pt-5 border-t border-sky-100 dark:border-sky-800/40 flex items-end justify-between">
                            <div>
                              <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest block mb-1">{translate('Starting From')}</span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 bg-clip-text text-transparent">{formatPrice(tour.price)}</span>
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => loadTourDetails(tour.tourId || tour.id)}
                              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0091EA] to-cyan-400 text-white flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-md shadow-sky-500/30 cursor-pointer"
                              title={isSoldOut ? "Fully Booked" : "View Details & Book"}
                            >
                              <ArrowRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {visibleCount < filteredTours.length && (
                  <div className="flex justify-center mt-12 mb-8">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 6)}
                      className="px-8 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 rounded-full font-bold text-sm tracking-wide shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#0091EA] hover:text-[#0091EA]"
                    >
                      {translate('Load More Tours')}
                    </button>
                  </div>
                )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {activeTour && (
        <BookingConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onPaymentSuccess={() => {
            setBookingSuccess(true);
            setShowConfirmModal(false);
            setBookingName('');
            setBookingEmail('');
            setBookingPhone('');
          }}
          bookingType="tour"
          title={translate(activeTour.title)}
          subtitle={translate(activeTour.category)}
          dates={{ start: bookingDate, days: activeTour.days }}
          travelers={bookingGuests}
          pricePerUnit={activeTour.price}
          totalCost={activeTour.price * bookingGuests}
          passengerDetails={{ name: bookingName, email: bookingEmail, phone: bookingPhone }}
          bookingData={{
            tourId: activeTour.id,
            travelDate: bookingDate,
            guests: bookingGuests
          }}
          currentUser={currentUser}
        />
      )}

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={bookingSuccess}
        onClose={() => {
          setBookingSuccess(false);
          setActiveTour(null);
        }}
        title={activeTour?.title || ''}
        orderNumber={`TR-${Math.random().toString(36).substr(2, 8).toUpperCase()}`}
        totalAmount={activeTour ? activeTour.price * bookingGuests : 0}
        bookingDetails={[
          { label: 'Date', value: bookingDate },
          { label: 'Guests', value: bookingGuests },
          { label: 'Duration', value: activeTour?.duration || '' }
        ]}
        onReturnToDashboard={() => {
          setBookingSuccess(false);
          setActiveTour(null);
          if (onNavigate) onNavigate('account-bookings');
        }}
      />

      {/* Lightbox Gallery Modal */}
      {lightboxOpen && activeTour && (() => {
        const gallery = getTourGallery(activeTour);
        const currentImg = gallery[lightboxIndex] || gallery[0];

        return (
          <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 md:p-8 backdrop-blur-xl animate-in fade-in duration-200">
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-3">
                <span className="bg-[#0091EA] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  {translate(activeTour.category)}
                </span>
                <h3 className="font-bold text-sm md:text-base hidden sm:block text-slate-200">
                  {translate(activeTour.title)}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-extrabold text-slate-400 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {lightboxIndex + 1} / {gallery.length}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
                  title={translate(`Close Gallery`)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Main Stage */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1))}
                className="absolute left-2 md:left-6 z-20 p-3 bg-black/60 hover:bg-[#0091EA] text-white rounded-full transition-all backdrop-blur-md shadow-2xl cursor-pointer"
                title={translate(`Previous Photo`)}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <img
                src={currentImg}
                alt={`Tour photo ${lightboxIndex + 1}`}
                className="max-h-[70vh] md:max-h-[78vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300"
                onError={(e) => { e.currentTarget.onerror = null;
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200';
                }}
              />

              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0))}
                className="absolute right-2 md:right-6 z-20 p-3 bg-black/60 hover:bg-[#0091EA] text-white rounded-full transition-all backdrop-blur-md shadow-2xl cursor-pointer"
                title={translate(`Next Photo`)}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Thumbnails Carousel */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 max-w-4xl mx-auto custom-scrollbar">
              {gallery.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer ${
                    lightboxIndex === idx
                      ? 'ring-2 ring-[#0091EA] scale-105 opacity-100'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.onerror = null;
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        );
      })()}

    </div>
  );
}
