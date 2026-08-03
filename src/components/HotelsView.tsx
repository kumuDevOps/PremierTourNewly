import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Building, 
  MapPin, 
  Calendar, 
  Star, 
  Search, 
  Plus, 
  X, 
  Check, 
  AlertCircle, 
  Sparkles,
  Wifi,
  Coffee,
  Waves,
  Compass,
  DollarSign,
  Heart,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Award,
  SlidersHorizontal,
  Phone,
  Mail,
  User,
  Clock,
  Maximize2,
  CheckCircle,
  Users,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Hotel } from '../types.ts';
import DatePicker from './DatePicker.tsx';
import DateRangePicker from './DateRangePicker.tsx';
import BookingConfirmationModal from './BookingConfirmationModal.tsx';
import BookingPDFModal, { BookingVoucherData } from './BookingPDFModal.tsx';
import BookingProgressBar from './BookingProgressBar.tsx';
import MapView from './MapView.tsx';
import TourRouteMap from './TourRouteMap.tsx';
import { useLanguage } from '../lib/i18n.tsx';
import { useCurrency } from '../lib/CurrencyContext.tsx';

interface HotelsViewProps {
  currentUser?: any;
  userProfile?: any;
  onOpenAuth?: () => void;
  onNavigate?: (page: string) => void;
  addToWishlist?: (item: any) => void;
}

const QUICK_FILTERS = [
  { label: 'All Stays', value: '' },
  { label: 'Sri Lanka', value: 'Sri Lanka' }, { label: 'Maldives', value: 'Maldives' },
  { label: 'Bali', value: 'Bali' },
  { label: 'Tokyo', value: 'Tokyo' },
  { label: 'Paris', value: 'Paris' },
  { label: 'Alps', value: 'Alps' }
];

import { HOTEL_PACKAGES } from '../data';

export default function HotelsView({ 
  currentUser, 
  userProfile, 
  onOpenAuth, 
  onNavigate,
  addToWishlist
}: HotelsViewProps) {
  const { language, t, translate } = useLanguage();
  const { formatPrice, currency } = useCurrency();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search parameters
  const [searchLocation, setSearchLocation] = useState('');
  
  // New Hotel Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelLocation, setNewHotelLocation] = useState('');
  const [newHotelPrice, setNewHotelPrice] = useState('');
  const [newHotelRating, setNewHotelRating] = useState('5');
  const [newHotelDesc, setNewHotelDesc] = useState('');
  const [newHotelImage, setNewHotelImage] = useState('');
  const [newHotelAmenities, setNewHotelAmenities] = useState<string[]>([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Booking Form State
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [checkIn, setCheckIn] = useState('2026-08-01');
  const [checkOut, setCheckOut] = useState('2026-08-08');
  const [guests, setGuests] = useState('2');
  const [selectedPackageTitle, setSelectedPackageTitle] = useState('Standard Package');
  const [showMorePackages, setShowMorePackages] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfVoucherData, setPdfVoucherData] = useState<BookingVoucherData | null>(null);

  // Lightbox Modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Reviews State
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (selectedHotel) {
      fetchReviews(selectedHotel.id);
    }
  }, [selectedHotel]);

  const fetchReviews = async (hotelId: number | string) => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/hotels/${hotelId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviewsList(data);
      }
    } catch (e) {
      console.error('Error loading reviews', e);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) return;
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (!newComment.trim()) {
      setReviewError(translate('Please write a review comment.'));
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess(false);

    try {
      const token = await currentUser.getIdToken?.() || '';
      const res = await fetch(`/api/hotels/${selectedHotel.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: newRating,
          comment: newComment
        })
      });

      if (res.ok) {
        setReviewSuccess(true);
        setNewComment('');
        setNewRating(5);
        fetchReviews(selectedHotel.id);
      } else {
        const data = await res.json();
        setReviewError(data.error || translate('Failed to post review.'));
      }
    } catch (err: any) {
      setReviewError(err.message || translate('An error occurred.'));
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSelectHotel = (hotel: Hotel | null) => {
    setSelectedHotel(hotel);
    setBookingSuccess(false);
    setShowConfirmModal(false);
    if (hotel) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('hotelId', hotel.id.toString());
      window.history.pushState({}, '', `?${searchParams.toString()}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete('hotelId');
      const newSearch = searchParams.toString();
      window.history.pushState({}, '', newSearch ? `?${newSearch}` : window.location.pathname);
    }
  };

  const getHotelGallery = (hotel: Hotel | null): string[] => {
    if (!hotel) return [];
    const mainImg = hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200';
    return [
      mainImg,
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ];
  };

  const getHotelCheckpointsJson = (hotel: Hotel) => {
    const loc = hotel.location || 'Resort';
    return JSON.stringify([
      { day: 1, title: `Arrival & Welcome Checkpoint`, desc: `Airport pickup and VIP check-in at ${hotel.name}, ${loc}.`, description: `Welcome drink and check-in at ${loc}` },
      { day: 2, title: `Resort Spa & Ocean Wellness`, desc: `Infinity pool, signature massage and private beach lounge.`, description: `Spa and beach relaxation in ${loc}` },
      { day: 3, title: `Coastal Excursion & Dining`, desc: `Guided sunset boat tour and oceanfront candlelit dinner.`, description: `Coastal excursion and dinner in ${loc}` }
    ]);
  };

  const handleOpenPdfVoucher = () => {
    if (!selectedHotel) return;
    const ref = 'HTL-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const nightsCount = Math.ceil(Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const packageObj = HOTEL_PACKAGES.find(p => p.title === selectedPackageTitle) || HOTEL_PACKAGES[0];
    const unitPrice = selectedHotel.price * packageObj.multiplier;
    const total = unitPrice * nightsCount;

    const voucher: BookingVoucherData = {
      id: ref,
      bookingRef: ref,
      type: 'hotel',
      title: selectedHotel.name,
      subtitle: `${selectedHotel.location} • ${nightsCount} Night(s) Stay`,
      description: `Luxury Stay Booking Voucher for ${bookingName || 'Guest'}. Confirmed reservation at ${selectedHotel.name}.`,
      category: 'HOTEL STAY',
      customerName: bookingName || userProfile?.fullName || currentUser?.displayName || 'Valued Guest',
      customerEmail: bookingEmail || currentUser?.email || 'guest@example.com',
      guestsCount: parseInt(guests, 10) || 2,
      startDate: checkIn,
      endDate: checkOut,
      startTime: '02:00 PM EST (Check-in)',
      durationText: `${nightsCount} Nights`,
      roomNumber: `Suite #${100 + Math.floor(Math.random() * 800)}`,
      roomType: selectedPackageTitle,
      hotelLocation: selectedHotel.location,
      totalPrice: total,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };
    setPdfVoucherData(voucher);
    setShowPdfModal(true);
  };

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Favorites Simulation/UI state for premium feel
  const [favorites, setFavorites] = useState<string[]>([]);

  // Sync profile details to form when loaded
  useEffect(() => {
    if (userProfile) {
      setBookingName(userProfile.fullName || '');
      setBookingEmail(currentUser?.email || '');
      setBookingPhone(userProfile.phone || '');
    }
  }, [userProfile, currentUser]);

  useEffect(() => {
    fetchHotels();
  }, [searchLocation]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hotelIdStr = searchParams.get('hotelId') || searchParams.get('id');
    if (hotelIdStr && hotels.length > 0) {
      const hotel = hotels.find(h => h.id.toString() === hotelIdStr);
      if (hotel) {
        setSelectedHotel(hotel);
      }
    }
  }, [hotels]);

  const fetchHotels = async () => {
    setLoading(true);
    setError('');
    try {
      let url = '/api/hotels';
      if (searchLocation) {
        url += `?location=${encodeURIComponent(searchLocation)}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setHotels(data);
      } else {
        setError('Failed to fetch hotels. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while connecting to the database.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName || !newHotelLocation || !newHotelPrice) {
      setFormError('Please fill in Name, Location and Price.');
      return;
    }

    setFormSubmitting(true);
    setFormError('');
    try {
      const res = await fetch('/api/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newHotelName,
          location: newHotelLocation,
          price: parseInt(newHotelPrice, 10),
          starRating: parseInt(newHotelRating, 10),
          description: newHotelDesc,
          amenities: newHotelAmenities.join(', '),
          imageUrl: newHotelImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
        })
      });

      if (res.ok) {
        // Reset form & reload
        setNewHotelName('');
        setNewHotelLocation('');
        setNewHotelPrice('');
        setNewHotelRating('5');
        setNewHotelDesc('');
        setNewHotelImage('');
        setNewHotelAmenities([]);
        setShowAddForm(false);
        fetchHotels();
      } else {
        const errData = await res.json();
        setFormError(errData.error || 'Failed to register the hotel.');
      }
    } catch (err) {
      console.error(err);
      setFormError('Server connection error.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) return;

    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setShowConfirmModal(true);
  };

  const toggleFavorite = (hotel: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (addToWishlist) {
      addToWishlist(hotel);
    } else {
      // Fallback if not provided
      if (favorites.includes(hotel.id)) {
        setFavorites(favorites.filter(favId => favId !== hotel.id));
      } else {
        setFavorites([...favorites, hotel.id]);
      }
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (newHotelAmenities.includes(amenity)) {
      setNewHotelAmenities(newHotelAmenities.filter(a => a !== amenity));
    } else {
      setNewHotelAmenities([...newHotelAmenities, amenity]);
    }
  };

  // Helper to get matching icons for amenities
  const getAmenityIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('wifi') || n.includes('internet')) return <Wifi className="w-3.5 h-3.5" />;
    if (n.includes('breakfast') || n.includes('coffee') || n.includes('dining')) return <Coffee className="w-3.5 h-3.5" />;
    if (n.includes('pool') || n.includes('swim')) return <Waves className="w-3.5 h-3.5" />;
    return <Sparkles className="w-3.5 h-3.5" />;
  };

  // Check if current user is admin/hotel-owner
  const isAuthorized = userProfile?.role === 'admin' || userProfile?.role === 'hotel-owner' || userProfile?.role === 'owner';

  // Framer Motion Variants for Stagger Grid
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 90, 
        damping: 14 
      } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-20 relative overflow-hidden transition-colors"
    >
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl -translate-y-12 pointer-events-none" />
      <div className="absolute top-[40vh] right-10 w-80 h-80 bg-[#0091EA]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* Visual Progress Bar Component */}
        <div className="mb-8">
          <BookingProgressBar
            currentStep={bookingSuccess ? 4 : showConfirmModal ? 3 : selectedHotel ? 2 : 1}
            type="hotel"
            onStepClick={(stepNum) => {
              if (stepNum === 1) {
                handleSelectHotel(null);
              }
            }}
          />
        </div>

        {selectedHotel ? (
          /* ========================================================= */
          /* FULL PAGE HOTEL DETAIL & BOOKING VIEW (Matching 2nd image) */
          /* ========================================================= */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Top Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <motion.button
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectHotel(null)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border-2 border-sky-200/80 dark:border-sky-800/80 rounded-2xl text-xs font-black text-slate-700 dark:text-slate-200 hover:text-[#0091EA] dark:hover:text-sky-400 hover:border-[#0091EA] shadow-md transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#0091EA]" />
                <span>{translate('Return to All Hotels')}</span>
              </motion.button>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{translate('Best Price Guaranteed')}</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-[#0091EA] dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{translate('Instant Confirmation')}</span>
                </span>
              </div>
            </div>

            {/* Header Title Section with Anime Blue Glow */}
            <div className="relative rounded-[32px] overflow-hidden text-white p-6 md:p-10 shadow-2xl border-2 border-sky-400/80 animate-blue-glow bg-slate-950">
              {/* Background Resort Ambient Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={selectedHotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80'} 
                  alt={`${selectedHotel.name} - 5-Star Luxury Hotels & Luxury Villas in ${selectedHotel.location}`} 
                  className="w-full h-full object-cover scale-105 filter brightness-75 transform transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-sky-950/30" />
              </div>

              {/* Ambient Glowing Orbs */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/25 rounded-full blur-3xl pointer-events-none z-0" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none z-0" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white text-[10px] font-black uppercase tracking-widest shadow-md shadow-sky-500/30 animate-light-blue-pulse">
                      <Sparkles className="w-3 h-3 text-white animate-pulse" />
                      {translate('Premier Luxury Stay')}
                    </span>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-400/40 text-amber-400">
                      {Array.from({ length: selectedHotel.starRating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[10px] font-black text-sky-200 ml-1">({selectedHotel.starRating || 5}.0)</span>
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-md">
                    <span className="bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent">
                      {translate(selectedHotel.name)}
                    </span>
                  </h2>
                  
                  <p className="text-xs md:text-sm text-sky-200/90 font-semibold mt-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{translate(selectedHotel.location)}</span>
                  </p>
                </div>

                <div className="text-left md:text-right shrink-0 bg-slate-900/90 backdrop-blur-md p-4 px-6 rounded-2xl border-2 border-cyan-400/60 shadow-xl shadow-cyan-500/20 animate-light-blue-pulse">
                  <span className="text-[10px] font-black text-sky-300 uppercase tracking-widest block mb-0.5">{translate('Starting From')}</span>
                  <span className="text-3xl md:text-4xl font-black text-cyan-300 drop-shadow-md">
                    {formatPrice(selectedHotel.price)}
                  </span>
                  <span className="text-[10px] font-bold text-sky-200/90 block mt-0.5">/ {translate('per night')}</span>
                </div>
              </div>
            </div>

            {/* Main 2-Column Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Gallery, Overview, Room Packages & Map */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Photo Gallery Grid */}
                <div className="space-y-3">
                  {(() => {
                    const gallery = getHotelGallery(selectedHotel);
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div 
                          onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
                          className="md:col-span-3 h-80 md:h-96 rounded-3xl overflow-hidden relative group cursor-pointer border-2 border-sky-100 dark:border-sky-800 shadow-lg"
                        >
                          <img 
                            src={gallery[0]} 
                            alt={selectedHotel.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                          <button className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:bg-black/80 transition-all">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>{translate('View Full Gallery')} ({gallery.length})</span>
                          </button>
                        </div>

                        <div className="hidden md:flex flex-col gap-3">
                          {gallery.slice(1, 4).map((img, idx) => (
                            <div 
                              key={idx}
                              onClick={() => { setLightboxIndex(idx + 1); setLightboxOpen(true); }}
                              className="h-28 rounded-2xl overflow-hidden relative group cursor-pointer border border-sky-100 dark:border-sky-800 shadow-xs"
                            >
                              <img src={img} alt="Hotel Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Quick Stats & Features Panel */}
                <div className="grid grid-cols-3 divide-x divide-sky-200/60 dark:divide-sky-800/60 border-2 border-sky-200/80 dark:border-sky-800/60 text-center py-5 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-md backdrop-blur-md">
                  <div>
                    <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest block mb-1">{translate('Star Rating')}</span>
                    <p className="text-sm md:text-base font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{selectedHotel.starRating || 5}-Star Luxury</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest block mb-1">{translate('Location')}</span>
                    <p className="text-sm md:text-base font-black text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#0091EA]" />
                      <span>{translate(selectedHotel.location)}</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest block mb-1">{translate('Base Nightly')}</span>
                    <p className="text-sm md:text-base font-black text-[#0091EA] dark:text-sky-400">
                      {formatPrice(selectedHotel.price)}
                    </p>
                  </div>
                </div>

                {/* Experience Overview */}
                <div className="p-6 space-y-3 bg-gradient-to-br from-white via-sky-50/30 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-3xl border-2 border-sky-200/80 dark:border-sky-800/60 shadow-md">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-[#0091EA]" />
                    <span>{translate('Experience Overview')}</span>
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                    {translate(selectedHotel.description || 'Enjoy bespoke concierge services, refined coastal architecture, hand-crafted interior finishes, and world-class dining overlooking pristine views.')}
                  </p>

                  {/* Amenities Badges */}
                  <div className="pt-3 border-t border-sky-100 dark:border-sky-800/50">
                    <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest block mb-2.5">{translate('Included Resort Amenities')}</span>
                    <div className="flex flex-wrap gap-2">
                      {['Wi-Fi', 'Breakfast Included', 'Swimming Pool', 'Luxury Spa', 'Fitness Center', 'Beachfront'].map((amenity, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 shadow-2xs">
                          {getAmenityIcon(amenity)}
                          <span>{translate(amenity)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Available Packages Section (Matching Second Image) */}
                <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] overflow-hidden border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl p-6 sm:p-8 animate-blue-glow">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0091EA] animate-ping" />
                      <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent">
                        {translate('Available Packages')}
                      </span>
                    </h3>
                    <span className="text-xs font-black text-[#0091EA] uppercase tracking-wider">{translate('Choose Room Option')}</span>
                  </div>

                  <div className="space-y-4">
                    {HOTEL_PACKAGES.slice(0, showMorePackages ? HOTEL_PACKAGES.length : 2).map((pkg, idx) => {
                      const isSelected = selectedPackageTitle === pkg.title;
                      const pkgPrice = Math.round(selectedHotel.price * pkg.multiplier);

                      return (
                        <motion.div 
                          key={idx}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setSelectedPackageTitle(pkg.title)}
                          className={`flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-[#0091EA] bg-sky-50/90 dark:bg-sky-950/40 shadow-lg shadow-sky-500/15' 
                              : 'border-sky-100 dark:border-sky-900/50 bg-white/90 dark:bg-slate-800/70 hover:border-[#0091EA]'
                          }`}
                        >
                          <div className="w-full sm:w-48 h-32 shrink-0 rounded-xl overflow-hidden relative shadow-sm">
                            <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider">
                              {isSelected ? translate('Selected Option') : translate('Room Option')}
                            </div>
                          </div>

                          <div className="flex flex-col justify-between flex-1">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className="text-base font-black text-slate-900 dark:text-white">{translate(pkg.title)}</h4>
                                <span className="text-base font-black text-[#0091EA] dark:text-sky-400 shrink-0">
                                  {formatPrice(pkgPrice)} <span className="text-[10px] text-slate-400">/ night</span>
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-3">
                                {translate(pkg.desc)}
                              </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-sky-100 dark:border-sky-800/50 pt-2.5 mt-1">
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                {translate('Free Cancellation Available')}
                              </span>
                              <button 
                                type="button"
                                className={`text-xs font-black uppercase tracking-wider flex items-center gap-1 ${
                                  isSelected ? 'text-[#0091EA]' : 'text-slate-400 hover:text-[#0091EA]'
                                }`}
                              >
                                <span>{isSelected ? translate('Selected') : translate('Select Package')}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {!showMorePackages && (
                      <motion.button 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setShowMorePackages(true)}
                        className="w-full py-3.5 mt-2 rounded-2xl border-2 border-sky-300 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-950/30 text-[#0091EA] dark:text-sky-300 font-black text-xs uppercase tracking-wider hover:bg-sky-100/80 dark:hover:bg-sky-900/50 transition-all shadow-xs cursor-pointer"
                      >
                        {translate('Show 2 More Options')}
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Dynamic Interactive Location Map & Checkpoints */}
                <TourRouteMap 
                  tourTitle={selectedHotel.name} 
                  itineraryJson={getHotelCheckpointsJson(selectedHotel)} 
                />

                {/* Animated & Colorful Reviews & Ratings section */}
                <motion.div 
                  id="reviews-section" 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 p-6 sm:p-10 shadow-xl shadow-sky-500/10 space-y-8 overflow-hidden animate-blue-glow mt-8"
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
                          {reviewsList.length} {translate('VERIFIED GUEST REVIEWS')}
                        </span>
                      </div>

                      <div className="space-y-2.5 flex flex-col justify-center">
                        {[5, 4, 3, 2, 1].map((ratingVal) => {
                          const count = reviewsList.filter(r => r.rating === ratingVal).length;
                          const pct = reviewsList.length > 0 ? (count / reviewsList.length) * 100 : 0;
                          return (
                            <div key={`breakdown-${ratingVal}`} className="flex items-center gap-3 text-xs">
                              <span className="w-8 text-right font-black text-gray-700 dark:text-slate-300 flex items-center justify-end gap-1">
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
                              <span className="w-8 text-sky-600 dark:text-sky-400 text-left font-black">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Submission Form */}
                  <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-lg shadow-sky-500/5 relative z-10">
                    {currentUser ? (
                      <form onSubmit={handleSubmitReview} className="space-y-6 text-left">
                        <h4 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
                          {translate('Write a Review')}
                        </h4>

                        {/* Interactive Rating Input */}
                        <div>
                          <label className="block text-xs font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest mb-2">
                            {translate('YOUR RATING')}
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
                              {newRating === 5 ? translate('EXCELLENT') :
                               newRating === 4 ? translate('VERY GOOD') :
                               newRating === 3 ? translate('AVERAGE') :
                               newRating === 2 ? translate('BELOW AVERAGE') :
                               translate('POOR')}
                            </span>
                          </div>
                        </div>

                        {/* Comment Input */}
                        <div>
                          <label className="block text-xs font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest mb-2">
                            {translate('REVIEW COMMENTS')}
                          </label>
                          <textarea
                            rows={4}
                            required
                            placeholder={translate('Describe your experience, what you enjoyed most, and tips for future travelers...')}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-sky-200 dark:border-sky-800 bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA] focus:border-[#0091EA] focus:outline-none rounded-2xl text-sm transition-all shadow-inner"
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
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{translate('Be the first to share feedback for this hotel!')}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviewsList.map((review: any, idx: number) => (
                          <motion.div 
                            key={`review-item-${review.id}`} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="flex gap-4 text-left p-5 bg-white/80 dark:bg-slate-900/70 rounded-2xl border border-sky-100 dark:border-sky-900/40 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700 transition-all"
                          >
                            <div className="shrink-0 mt-1">
                              <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-md shadow-sky-500/10 animate-light-blue-pulse" style={{ backgroundColor: review.rating >= 4.5 ? '#0091EA' : review.rating >= 3 ? '#0284c7' : '#0369a1' }}>
                                {Number(review.rating).toFixed(1)}
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

              {/* Right Column: Sticky "START PLANNING" Booking Widget (Matching 2nd Image) */}
              <div className="lg:col-span-1 lg:sticky lg:top-24">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white via-sky-50/50 to-slate-50 dark:from-slate-900 dark:via-sky-950/30 dark:to-slate-900 rounded-[32px] border-2 border-sky-300 dark:border-sky-700/80 shadow-2xl p-6 sm:p-8 animate-blue-glow"
                >
                  {/* Card Header */}
                  <div className="border-b border-sky-200/80 dark:border-sky-800/60 pb-5 mb-6 text-center">
                    <span className="text-[11px] font-black text-[#0091EA] dark:text-sky-300 uppercase tracking-widest block mb-1">
                      {translate('START PLANNING')}
                    </span>
                    <div className="mt-2 flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-black bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                        {formatPrice(Math.round(selectedHotel.price * (HOTEL_PACKAGES.find(p => p.title === selectedPackageTitle)?.multiplier || 1.0)))}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/ {translate('per night')}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                      {translate('Package')}: <span className="text-[#0091EA] font-bold">{selectedPackageTitle}</span>
                    </p>
                  </div>

                  {/* Booking Form */}
                  <form onSubmit={handleBookSubmit} className="space-y-4">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#0091EA]" />
                        <span>{translate('YOUR FULL NAME')} *</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border-2 border-sky-100 dark:border-sky-800 focus:border-[#0091EA] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#0091EA]" />
                        <span>{translate('EMAIL ADDRESS')} *</span>
                      </label>
                      <input 
                        type="email"
                        required
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border-2 border-sky-100 dark:border-sky-800 focus:border-[#0091EA] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#0091EA]" />
                        <span>{translate('PHONE NUMBER')}</span>
                      </label>
                      <input 
                        type="tel"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border-2 border-sky-100 dark:border-sky-800 focus:border-[#0091EA] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
                      />
                    </div>

                    {/* Check In / Out Dates */}
                    <div>
                      <DateRangePicker 
                        startDate={checkIn}
                        endDate={checkOut}
                        onChange={(start, end) => {
                          setCheckIn(start);
                          if (end) setCheckOut(end);
                        }}
                        startLabel="Check In"
                        endLabel="Check Out"
                        minDate={new Date().toISOString().split('T')[0]}
                        compact
                      />
                    </div>

                    {/* Guests Select */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#0091EA]" />
                        <span>{translate('GUESTS COUNT')}</span>
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-950 border-2 border-sky-100 dark:border-sky-800 focus:border-[#0091EA] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none transition-all cursor-pointer shadow-xs"
                      >
                        <option value="1">1 {translate('Guest')}</option>
                        <option value="2">2 {translate('Guests')}</option>
                        <option value="3">3 {translate('Guests')}</option>
                        <option value="4">4 {translate('Guests')}</option>
                        <option value="5">5 {translate('Guests')}</option>
                        <option value="6">6 {translate('Guests')}</option>
                        <option value="7">7 {translate('Guests')}</option>
                        <option value="8">8 {translate('Guests')}</option>
                        <option value="9">9 {translate('Guests')}</option>
                        <option value="10">10+ {translate('Guests')}</option>
                      </select>
                    </div>

                    {/* Estimated Total Summary */}
                    {(() => {
                      const nights = Math.ceil(Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1;
                      const unitP = Math.round(selectedHotel.price * (HOTEL_PACKAGES.find(p => p.title === selectedPackageTitle)?.multiplier || 1.0));
                      const totalCalc = unitP * nights;

                      return (
                        <div className="bg-sky-50/80 dark:bg-slate-950/60 p-4 rounded-2xl border border-sky-200 dark:border-sky-800/60 space-y-2 mt-4">
                          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                            <span>{formatPrice(unitP)} × {nights} {translate('nights')}</span>
                            <span className="font-bold">{formatPrice(totalCalc)}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                            <span>{translate('Taxes & Resort Fees')}</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{translate('Included')}</span>
                          </div>
                          <div className="border-t border-sky-200 dark:border-sky-800/80 pt-2 flex items-center justify-between font-black text-slate-900 dark:text-white">
                            <span>{translate('Total Cost')}</span>
                            <span className="text-lg text-[#0091EA] dark:text-sky-400">{formatPrice(totalCalc)}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Book Now Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 mt-4 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 cursor-pointer border-2 border-sky-200/50 animate-light-blue-pulse"
                    >
                      <span>{translate('BOOK HOTEL NOW')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>

                    {/* Flexible Cancellation Disclaimer */}
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-medium leading-relaxed pt-2">
                      {translate('Your booking is fully flexible. We do not charge cancellation fees up to 14 days before your departure.')}
                    </p>

                  </form>
                </motion.div>
              </div>

            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
              {lightboxOpen && (
                <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
                  <button 
                    onClick={() => setLightboxOpen(false)}
                    className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <img 
                    src={getHotelGallery(selectedHotel)[lightboxIndex]} 
                    alt="Lightbox View" 
                    className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                  />
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        ) : (
          /* ========================================================= */
          /* DEFAULT HOTELS LIST & SEARCH VIEW                         */
          /* ========================================================= */
          <>
            {/* Banner Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 70 }}
              className="relative rounded-[32px] overflow-hidden text-white p-8 md:p-14 shadow-2xl mb-12 border-2 border-sky-400/40 animate-blue-glow bg-slate-950"
            >
              {/* Background Luxury Hotel Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80" 
                  alt="Luxury Hotel Resort" 
                  className="w-full h-full object-cover scale-105 filter brightness-90 transform transition-transform duration-1000 hover:scale-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-sky-950/30" />
              </div>

              {/* Ambient Glows */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none z-0" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none z-0" />

              <div className="relative z-10 max-w-3xl">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white text-[10px] font-black uppercase tracking-widest mb-5 shadow-lg shadow-sky-500/30 animate-light-blue-pulse"
                >
                  <Award className="w-3.5 h-3.5 text-white animate-pulse" />
                  {translate('Elite Travel Selection')}
                </motion.span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white drop-shadow-md">
                  <span className="bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent">{t.hotels}</span>
                </h1>
                <p className="mt-4 text-sm md:text-lg text-sky-100/90 font-medium max-w-xl leading-relaxed">
                  {t.hotelsDesc}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-sky-200/90 font-bold border-t border-sky-800/60 pt-6">
                  <div className="flex items-center gap-2 bg-sky-900/40 px-3 py-1.5 rounded-xl border border-sky-700/50">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{translate('Best Price Guarantee')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-sky-900/40 px-3 py-1.5 rounded-xl border border-sky-700/50">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>{translate('Hand-picked 5-Star Suites')}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Controls, Quick Filters and Admin actions */}
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-5 md:p-6 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 animate-blue-glow mb-10">
              
              <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between">
                
                {/* Search Input Box */}
                <div className="relative w-full lg:max-w-md shrink-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#0091EA]" />
                  <input 
                    type="text"
                    placeholder={translate('Search hotels by location, country or property...')}
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 focus:border-[#0091EA] rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all shadow-xs"
                  />
                  {searchLocation && (
                    <button 
                      onClick={() => setSearchLocation('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>



                {/* Register Property Button & View Toggle Group */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {isAuthorized && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 hover:from-[#0080d0] hover:to-sky-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-sky-500/30 animate-light-blue-pulse cursor-pointer shrink-0 border-2 border-sky-200/50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{translate('REGISTER PROPERTY')}</span>
                    </motion.button>
                  )}

                  {/* View Mode Toggle */}
                  <div className="flex bg-sky-100/70 dark:bg-slate-950 p-1.5 rounded-2xl border-2 border-sky-200/80 dark:border-sky-800/60 shadow-inner shrink-0">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        viewMode === 'list' 
                          ? 'bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white shadow-md shadow-sky-500/20' 
                          : 'text-sky-900 dark:text-sky-300 hover:text-[#0091EA] font-extrabold'
                      }`}
                    >
                      {translate('List View')}
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
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

            {/* Content Area */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-28 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-slate-100/60 dark:border-slate-800/60 backdrop-blur-md">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-slate-200/60 border-t-[#0091EA] rounded-full animate-spin" />
                  <Building className="w-5 h-5 text-[#0091EA] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="text-xs text-slate-400 font-extrabold mt-5 uppercase tracking-widest">{translate('Loading Premium Collection...')}</p>
              </div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs font-bold">{error}</span>
              </motion.div>
            ) : hotels.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 p-10 shadow-sm"
              >
                <Building className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-5 stroke-1" />
                <h3 className="text-lg font-black text-slate-700 dark:text-slate-200">{translate('No Properties Match Your Search')}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 max-w-sm mx-auto font-medium">
                  {translate('Try adjusting your location or filter settings.')}
                </p>
                <button 
                  onClick={() => setSearchLocation('')}
                  className="mt-6 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0A2540] dark:text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  {translate('Clear Filter')}
                </button>
              </motion.div>
            ) : viewMode === 'map' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-150 dark:border-slate-800"
              >
                <MapView 
                  items={hotels.map(h => ({
                    id: h.id,
                    name: h.name,
                    locationName: h.location,
                    price: h.price,
                    imageUrl: h.imageUrl,
                    type: 'hotel'
                  }))}
                  onMarkerClick={(item) => {
                    const hotel = hotels.find(h => h.id.toString() === item.id.toString());
                    if (hotel) handleSelectHotel(hotel);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div 
                variants={gridContainerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                { (searchLocation ? HOTEL_PACKAGES.map((pkg, idx) => ({
                    id: pkg.title,
                    name: pkg.title,
                    location: 'Package Special',
                    price: 0,
                    starRating: 5,
                    description: pkg.desc,
                    amenities: '[]',
                    imageUrl: pkg.img
                  })) : hotels).map((hotel) => {
                  let amenitiesList: string[] = [];
                  if (hotel.amenities) {
                    if (Array.isArray(hotel.amenities)) {
                      amenitiesList = hotel.amenities.map(s => String(s).trim()).filter(Boolean);
                    } else if (typeof hotel.amenities === 'string') {
                      const trimmed = hotel.amenities.trim();
                      if (trimmed.startsWith('[')) {
                        try {
                          const parsed = JSON.parse(trimmed);
                          if (Array.isArray(parsed)) {
                            amenitiesList = parsed.map(s => String(s).trim()).filter(Boolean);
                          } else {
                            amenitiesList = [trimmed];
                          }
                        } catch {
                          amenitiesList = trimmed.split(',').map(s => s.trim()).filter(Boolean);
                        }
                      } else {
                        amenitiesList = trimmed.split(',').map(s => s.trim()).filter(Boolean);
                      }
                    } else if (typeof hotel.amenities === 'object') {
                      try {
                        amenitiesList = Object.values(hotel.amenities).map(s => String(s).trim()).filter(Boolean);
                      } catch {
                        amenitiesList = [];
                      }
                    }
                  }
                  const isFav = favorites.includes(hotel.id);
                    
                  return (
                    <motion.div 
                      key={hotel.id}
                      variants={cardVariants}
                      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                      onClick={() => handleSelectHotel(hotel)}
                      className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 overflow-hidden shadow-xl shadow-sky-500/10 hover:shadow-2xl hover:shadow-sky-500/20 hover:border-[#0091EA] transition-all duration-300 group flex flex-col h-full relative animate-blue-glow cursor-pointer"
                    >
                      {/* Premium Tag for High Ratings */}
                      {(hotel.starRating || 5) >= 5 && (
                        <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 text-white text-[9px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center gap-1 select-none animate-pulse">
                          <Sparkles className="w-3 h-3 fill-white text-white" />
                          <span>{translate('Elite Tier')}</span>
                        </div>
                      )}

                      {/* Photo Frame */}
                      <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800 select-none">
                        <img 
                          src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'} 
                          alt={translate(hotel.name)}
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />
                        
                        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md border border-sky-400/30">
                          <MapPin className="w-3.5 h-3.5 text-[#0091EA]" />
                          <span>{translate(hotel.location)}</span>
                        </div>

                        {/* Wishlist Heart Button */}
                        <button
                          onClick={(e) => toggleFavorite(hotel, e)}
                          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md text-slate-400 hover:text-rose-500 active:scale-90 transition-all cursor-pointer z-10"
                          title={translate('Add to wishlist')}
                        >
                          <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Core Info & Copy */}
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          {/* Star Display */}
                          <div className="flex items-center gap-1 text-amber-400 mb-2">
                            {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 filter drop-shadow-[0_1px_1px_rgba(245,158,11,0.2)]" />
                            ))}
                            <span className="text-[10px] text-sky-800 dark:text-sky-300 font-black ml-1">({hotel.starRating || 5}.0)</span>
                          </div>

                          <h3 
                            onClick={() => handleSelectHotel(hotel)}
                            className="text-base md:text-lg font-black text-gray-900 dark:text-slate-100 group-hover:text-[#0091EA] dark:group-hover:text-sky-400 transition-colors line-clamp-1 cursor-pointer"
                          >
                            {translate(hotel.name)}
                          </h3>

                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 font-medium leading-relaxed line-clamp-3">
                            {translate(hotel.description || 'Experience ultimate comfort with bespoke guest concierge services, refined dining, and sweeping coastal vistas.')}
                          </p>

                          {/* Amenities Badges */}
                          {amenitiesList.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-4">
                              {amenitiesList.slice(0, 4).map((amenity, idx) => (
                                <span 
                                  key={idx}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-sky-100 dark:border-sky-800/50 text-[10px] text-sky-900 dark:text-sky-200 font-bold shadow-2xs"
                                >
                                  {getAmenityIcon(amenity)}
                                  <span>{translate(amenity)}</span>
                                </span>
                              ))}
                              {amenitiesList.length > 4 && (
                                <span className="px-2.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-[10px] text-sky-700 dark:text-sky-300 font-black">
                                  +{amenitiesList.length - 4} {translate('more')}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Pricing, Divider & CTA Button */}
                        <div className="border-t border-sky-200/60 dark:border-sky-800/50 pt-5 mt-6 flex items-center justify-between">
                          <div>
                            <span className="block text-[9px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest leading-none">{translate('Price per night')}</span>
                            <span className="text-xl font-black bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 bg-clip-text text-transparent mt-1.5 block leading-none">
                              {formatPrice(hotel.price)}
                            </span>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleSelectHotel(hotel)}
                            className="flex items-center gap-1 px-5 py-3 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-sky-500/25 cursor-pointer animate-light-blue-pulse"
                          >
                            <span>{t.bookNow}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </>
        )}

        {/* Add Hotel Drawer/Modal with AnimatePresence */}
        <AnimatePresence>
          {showAddForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddForm(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              />

              {/* Modal Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-800 p-6 md:p-8 relative z-10 animate-fade-in text-left"
              >
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900 shadow-sm">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] dark:text-slate-100">{t.addHotelTitle}</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest">{translate('Property Management Suite')}</p>
                  </div>
                </div>

                {formError && (
                  <div className="mb-5 bg-red-50 dark:bg-red-950/25 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleAddHotel} className="space-y-5 text-left">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">{t.hotelName} *</label>
                    <input 
                      type="text"
                      required
                      value={newHotelName}
                      onChange={(e) => setNewHotelName(e.target.value)}
                      placeholder="e.g. Grand Heritage Maldives Resort"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#0091EA] focus:bg-white dark:focus:bg-slate-900 transition-all shadow-3xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">{t.locationAddress} *</label>
                      <input 
                        type="text"
                        required
                        value={newHotelLocation}
                        onChange={(e) => setNewHotelLocation(e.target.value)}
                        placeholder="e.g. Maldives"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#0091EA] focus:bg-white dark:focus:bg-slate-900 transition-all shadow-3xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">{t.pricePerNightLabel} *</label>
                      <input 
                        type="number"
                        required
                        value={newHotelPrice}
                        onChange={(e) => setNewHotelPrice(e.target.value)}
                        placeholder="e.g. 450"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#0091EA] focus:bg-white dark:focus:bg-slate-900 transition-all shadow-3xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">{t.starRating} (1-5)</label>
                      <select
                        value={newHotelRating}
                        onChange={(e) => setNewHotelRating(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#0091EA] focus:bg-white dark:focus:bg-slate-900 transition-all shadow-3xs"
                      >
                        <option value="5">5 Stars Rating</option>
                        <option value="4">4 Stars Rating</option>
                        <option value="3">3 Stars Rating</option>
                        <option value="2">2 Stars Rating</option>
                        <option value="1">1 Star Rating</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">{t.imageUpload}</label>
                      <input 
                        type="text"
                        value={newHotelImage}
                        onChange={(e) => setNewHotelImage(e.target.value)}
                        placeholder="e.g. https://images.unsplash.com/..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#0091EA] focus:bg-white dark:focus:bg-slate-900 transition-all shadow-3xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">{t.description}</label>
                    <textarea 
                      rows={3}
                      value={newHotelDesc}
                      onChange={(e) => setNewHotelDesc(e.target.value)}
                      placeholder="Describe the rooms, coastal location, ambient amenities, views..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#0091EA] focus:bg-white dark:focus:bg-slate-900 transition-all resize-none shadow-3xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">{t.amenities} offered</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['Wi-Fi', 'Breakfast Included', 'Swimming Pool', 'Luxury Spa', 'Fitness Center', 'Beachfront'].map((amenity) => {
                        const selected = newHotelAmenities.includes(amenity);
                        return (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            key={amenity}
                            onClick={() => toggleAmenity(amenity)}
                            className={`px-3 py-2 border rounded-xl text-[10px] font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs ${
                              selected 
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-black' 
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100/60'
                            }`}
                          >
                            {getAmenityIcon(amenity)}
                            <span>{translate(amenity)}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-5 mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={formSubmitting}
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 disabled:opacity-50 cursor-pointer"
                    >
                      {formSubmitting ? t.submitting : t.addHotelTitle}
                    </motion.button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Booking Confirmation Dialog */}
        {selectedHotel && (
          <BookingConfirmationModal 
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onPaymentSuccess={() => {
              setBookingSuccess(true);
              setShowConfirmModal(false);
            }}
            bookingType="hotel"
            title="Stay Booking Confirmation"
            subtitle={`${selectedHotel.name} (${selectedPackageTitle})`}
            dates={{
              start: checkIn,
              end: checkOut,
              nights: Math.ceil(Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1
            }}
            travelers={parseInt(guests, 10)}
            pricePerUnit={Math.round(selectedHotel.price * (HOTEL_PACKAGES.find(p => p.title === selectedPackageTitle)?.multiplier || 1.0))}
            priceLabel="per night"
            totalCost={Math.round(selectedHotel.price * (HOTEL_PACKAGES.find(p => p.title === selectedPackageTitle)?.multiplier || 1.0)) * (Math.ceil(Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1)}
            passengerDetails={{
              name: bookingName,
              email: bookingEmail,
              phone: bookingPhone
            }}
            bookingData={{
              hotelId: selectedHotel.id,
              checkInDate: checkIn,
              checkOutDate: checkOut,
              guests: parseInt(guests, 10),
              roomPackage: selectedPackageTitle,
              totalPrice: Math.round(selectedHotel.price * (HOTEL_PACKAGES.find(p => p.title === selectedPackageTitle)?.multiplier || 1.0)) * (Math.ceil(Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1)
            }}
            currentUser={currentUser}
          />
        )}

        {/* Success Modal */}
        <AnimatePresence>
          {bookingSuccess && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full p-6 md:p-8 text-center border border-slate-100 dark:border-slate-800 relative z-10 animate-fade-in"
              >
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center rounded-full mx-auto mb-5 border border-emerald-100 dark:border-emerald-800 animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-[#0A2540] dark:text-slate-100">{translate('Stay Reservation Completed!')}</h3>
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-1.5">{translate('Confirmed & Secured')}</p>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-semibold">
                  Your luxury stay has been reserved successfully. Booking details have been logged and a secure invoice has been dispatched to your email address.
                </p>

                <div className="space-y-2 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOpenPdfVoucher}
                    className="w-full py-3.5 bg-[#0091EA] hover:bg-[#007cc7] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Download PDF Voucher</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setBookingSuccess(false);
                      handleSelectHotel(null);
                      if (onNavigate) onNavigate('account-bookings');
                    }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Go to My Bookings
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* PDF Voucher Modal */}
        <BookingPDFModal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          booking={pdfVoucherData}
        />

      </div>
    </motion.div>
  );
}
