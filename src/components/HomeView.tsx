import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Coins, 
  CreditCard, 
  Undo, 
  Leaf, 
  ChevronRight, ArrowRight, ChevronLeft, 
  Sparkles,
  PlaneTakeoff,
  AlertCircle,
  X,
  Compass,
  ArrowLeftRight,
  ChevronDown,
  Plus,
  Minus,
  User,
  BedDouble,
  Plane
} from 'lucide-react';
import { TravelPackage, Tour } from '../types.ts';
import DatePicker from './DatePicker.tsx';
import DateRangePicker from './DateRangePicker.tsx';
import BookingConfirmationModal from './BookingConfirmationModal.tsx';
import GuaranteesProtectionBar from './GuaranteesProtectionBar.tsx';
import TravelerReviewCarousel from './TravelerReviewCarousel.tsx';
import { useLanguage } from '../lib/i18n.tsx';
import { useCurrency } from '../lib/CurrencyContext.tsx';

interface HomeViewProps {
  setCurrentPage: (page: string, params?: Record<string, string>) => void;
  onOpenAuth: () => void;
  addToWishlist: (item: any) => void;
  setSearchQuery: (query: { from: string; to: string }) => void;
  homeSearchTab: 'flight-hotel' | 'hotels' | 'flights' | 'cars';
  setHomeSearchTab: (tab: 'flight-hotel' | 'hotels' | 'flights' | 'cars') => void;
  currentUser?: any;
  userProfile?: any;
}

import { HOTEL_PACKAGES, FLIGHT_PACKAGES } from '../data';

export default function HomeView({ 
  setCurrentPage, 
  onOpenAuth, 
  addToWishlist, 
  setSearchQuery,
  homeSearchTab,
  setHomeSearchTab,
  currentUser,
  userProfile,
}: HomeViewProps) {
  const { language, t, translate } = useLanguage();
  const { formatPrice } = useCurrency();
  // Use parent states
  const activeTab = homeSearchTab;
  const setActiveTab = setHomeSearchTab;

  // Search state
  const [searchGoingTo, setSearchGoingTo] = useState('');
  const [searchFlyingFrom, setSearchFlyingFrom] = useState('');
  const [searchDate, setSearchDate] = useState('2026-08-01');
  const [searchReturnDate, setSearchReturnDate] = useState('2026-08-08');
  
  // Interactive Guests & Cabin Class state
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy');
  // const [searchGuests, setSearchGuests] = useState('2 Adults, Economy');
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);

  // Hotels Tab specific states
  const [destinationDropdownOpen, setDestinationDropdownOpen] = useState(false);
  const [hotelCheckIn, setHotelCheckIn] = useState('2026-07-23');
  const [hotelCheckOut, setHotelCheckOut] = useState('2026-07-30');
  const [hotelAdultsCount, setHotelAdultsCount] = useState(2);
  const [hotelChildrenCount, setHotelChildrenCount] = useState(0);
  const [hotelRoomsCount, setHotelRoomsCount] = useState(1);
  // const [hotelGuests, setHotelGuests] = useState('2 Adults, 1 Room');
  const [hotelGuestsDropdownOpen, setHotelGuestsDropdownOpen] = useState(false);

  const updateSearchGuestsText = (a: number, c: number, r: number, cl: string) => {
    setAdultsCount(a);
    setChildrenCount(c);
    setRoomsCount(r);
    setCabinClass(cl);
  };

  const updateHotelGuestsText = (a: number, c: number, r: number) => {
    setHotelAdultsCount(a);
    setHotelChildrenCount(c);
    setHotelRoomsCount(r);
  };

  // Rent a Car Tab specific states
  const [carPickup, setCarPickup] = useState('');
  const [carDropoff, setCarDropoff] = useState('');
  const [carPickupDate, setCarPickupDate] = useState('2026-07-23');
  const [carPickupTime, setCarPickupTime] = useState('10:00');
  const [carDropoffDate, setCarDropoffDate] = useState('2026-07-30');
  const [carDropoffTime, setCarDropoffTime] = useState('10:00');
  const [carCategory, setCarCategory] = useState('Prestige SUV');
  const [carCategoryDropdownOpen, setCarCategoryDropdownOpen] = useState(false);

  // Dynamic tours
  const [tours, setTours] = useState<Tour[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [currentHotelIndex, setCurrentHotelIndex] = useState(0);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [errorPackages, setErrorPackages] = useState('');
  const [visibleToursCount, setVisibleToursCount] = useState(4);

  // Autocomplete state
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tour[]>([]);

  useEffect(() => {
    if (searchGoingTo.length > 0) {
      const query = searchGoingTo.toLowerCase();
      let suggestions: any[] = [];
      if (activeTab === 'flight-hotel') {
          suggestions = tours.filter(tour => 
            (tour.title && tour.title.toLowerCase().includes(query)) || 
            (tour.category && tour.category.toLowerCase().includes(query))
          );
      } else if (activeTab === 'hotels') {
          suggestions = HOTEL_PACKAGES.filter(pkg => 
            pkg.title.toLowerCase().includes(query) || 
            pkg.desc.toLowerCase().includes(query)
          ).map(pkg => ({
            id: pkg.title,
            name: pkg.title,
            location: 'Hotel Package',
            imageUrl: pkg.img,
            isPackage: true
          }));
      } else if (activeTab === 'flights') {
          suggestions = flights.filter(flight => 
            flight.airline.toLowerCase().includes(query) ||
            flight.fromCity.toLowerCase().includes(query) ||
            flight.toCity.toLowerCase().includes(query)
          ).map(flight => ({
            id: flight.id,
            name: flight.airline,
            location: `${flight.fromCity} - ${flight.toCity}`,
            imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=100',
            isPackage: false
          }));
      }
      setFilteredSuggestions(suggestions);
    } else if (activeTab === 'hotels') {
        setFilteredSuggestions(HOTEL_PACKAGES.map(pkg => ({
            id: pkg.title,
            name: pkg.title,
            location: 'Hotel Package',
            imageUrl: pkg.img,
            isPackage: true
        })));
    } else if (activeTab === 'flights') {
        setFilteredSuggestions(flights.map(flight => ({
            id: flight.id,
            name: flight.airline,
            location: `${flight.fromCity} - ${flight.toCity}`,
            imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=100',
            isPackage: false
        })));
    } else {
        setFilteredSuggestions([]);
    }
  }, [searchGoingTo, tours, hotels, flights, activeTab]);

  // Booking modal for tours
  const [selectedPackage, setSelectedPackage] = useState<Tour | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingGuestsCount, setBookingGuestsCount] = useState(2);
  const [bookingDate, setBookingDate] = useState('2026-08-01');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Sync profile details to form when loaded
  useEffect(() => {
    if (userProfile) {
      setBookingName(userProfile.fullName || '');
      setBookingEmail(userProfile.email || '');
      setBookingPhone(userProfile.phone || '');
    } else if (currentUser) {
      setBookingEmail(currentUser.email || '');
    }
  }, [userProfile, currentUser]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoadingPackages(true);
    setErrorPackages('');
    try {
      const [resTours, resHotels, resFlights] = await Promise.all([
        fetch('/api/tours'),
        fetch('/api/hotels'),
        fetch('/api/flights')
      ]);

      if (resTours.ok) {
        const dataTours = await resTours.json();
        setTours(dataTours);
      } else {
        setErrorPackages(translate('Failed to retrieve holiday packages and tours.'));
      }

      if (resHotels.ok) {
        const dataHotels = await resHotels.json();
        setHotels(dataHotels);
      }
      
      if (resFlights.ok) {
        const dataFlights = await resFlights.json();
        setFlights(dataFlights);
      }
    } catch (err) {
      console.error(err);
      setErrorPackages(translate('Unable to connect to service.'));
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery({ from: searchFlyingFrom, to: searchGoingTo });
    if (activeTab === 'flights') {
      setCurrentPage('flights', { from: searchFlyingFrom, to: searchGoingTo });
    } else if (activeTab === 'cars') {
      setCurrentPage('rent-a-car', { pickup: searchFlyingFrom, dropoff: searchGoingTo });
    } else if (activeTab === 'hotels') {
      setCurrentPage('hotels', { location: searchGoingTo });
    } else {
      // General redirection to Tour or Flights
      setCurrentPage('tour', { from: searchFlyingFrom, to: searchGoingTo });
    }
  };

  const handlePackageBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setShowConfirmModal(true);
  };

  const handleConfirmAndBookPackage = async () => {
    if (!selectedPackage) return;
    setBookingSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: bookingName,
          email: bookingEmail,
          phone: bookingPhone,
          packageId: selectedPackage.id,
          travelDate: bookingDate,
          guests: bookingGuestsCount
        })
      });
      if (res.ok) {
        setBookingSuccess(true);
        setShowConfirmModal(false);
        setBookingName('');
        setBookingEmail('');
        setBookingPhone('');
      } else {
        alert(translate('Booking failed. Please try again.'));
      }
    } catch (err) {
      console.error(err);
      alert(translate('An error occurred during booking.'));
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitting(true);
    setNewsletterMessage('');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newsletterEmail })
      });
      if (res.ok) {
        setNewsletterMessage(translate('✓ Thank you for subscribing! Exquisite offers are on the way.'));
        setNewsletterEmail('');
      } else {
        setNewsletterMessage(translate('An error occurred. Please try again.'));
      }
    } catch (err) {
      console.error(err);
      setNewsletterMessage(translate('An error occurred. Please try again.'));
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const filteredHomeTours = tours.filter(tour => {
    if (activeTab !== 'flight-hotel' || !searchGoingTo) return true;
    const q = searchGoingTo.toLowerCase();
    return (tour.title && tour.title.toLowerCase().includes(q)) || 
           (tour.category && tour.category.toLowerCase().includes(q)) ||
           (tour.location && tour.location.toLowerCase().includes(q));
  });

  return (
    <div id="home-view" className="relative">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Video Beach background with reliable fallback */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            poster="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=82"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.85]"
          >
            {/* User uploaded video */}
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/80 via-transparent to-[#0A2540]/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-between py-12 lg:py-20">
          
          {/* Dynamic Top-Right Background Heading */}
          <div className="flex justify-end pr-4 lg:pr-12 md:mt-4">
            <span className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white/90 drop-shadow-xl select-none animate-pulse-slow uppercase block">
              {activeTab === 'flight-hotel' && translate('Holidays')}
              {activeTab === 'hotels' && translate('Hotels')}
              {activeTab === 'flights' && translate('Flights')}
              {activeTab === 'cars' && translate('Rentals')}
            </span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 lg:mt-16"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-2xl drop-shadow-md">
              {activeTab === 'flight-hotel' && (
                <>{translate('Discover the World,')} <br /><span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-[#0091EA] bg-clip-text text-transparent">{translate('Perfected For You')}</span></>
              )}
              {activeTab === 'hotels' && (
                <>{translate('The Perfect Stay,')} <br /><span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-[#0091EA] bg-clip-text text-transparent">{translate('Every Single Time')}</span></>
              )}
              {activeTab === 'flights' && (
                <>{translate('The Perfect Flight,')} <br /><span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-[#0091EA] bg-clip-text text-transparent">{translate('Every Single Time')}</span></>
              )}
              {activeTab === 'cars' && (
                <>{translate('Exquisite Luxury,')} <br /><span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-[#0091EA] bg-clip-text text-transparent">{translate('Unrestricted Paths')}</span></>
              )}
            </h1>
            <p className="text-white/80 text-sm md:text-base mt-2 max-w-lg font-medium drop-shadow-sm">
              {activeTab === 'flight-hotel' && t.holidaysDesc}
              {activeTab === 'hotels' && t.hotelsDesc}
              {activeTab === 'flights' && t.flightsDesc}
              {activeTab === 'cars' && t.carsDesc}
            </p>
          </motion.div>

        </div>
      </section>

      {/* 2. FLOATING SEARCH CARD (Overlapping with light blue glow animation) */}
      <section id="search-card-container" className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] shadow-2xl shadow-sky-500/15 border-2 border-sky-200/80 dark:border-sky-800/60 animate-blue-glow relative"
        >
          
          {/* Tabs */}
          <div className="flex overflow-x-auto scrollbar-hide bg-sky-50/60 dark:bg-slate-950 border-b-2 border-sky-100 dark:border-sky-800/50 rounded-t-[30px] overflow-hidden">
            {[
              { id: 'flight-hotel', label: t.tours || translate('Tours') },
              { id: 'hotels', label: t.hotels },
              { id: 'flights', label: translate('Flights') },
              { id: 'cars', label: t.rentACar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap px-5 sm:px-6 py-3.5 sm:py-4.5 text-xs md:text-sm shrink-0 font-black tracking-wide transition-all duration-200 border-r border-sky-100 dark:border-sky-900/50 cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white font-black shadow-md shadow-sky-500/20' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-[#0091EA] dark:hover:text-[#0091EA] hover:bg-sky-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Fields Form */}
          <div className="p-6 md:p-8 rounded-b-[30px]">
            {activeTab === 'hotels' && (
              <div className="space-y-6">
                {/* Hotels Search Fields */}
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
                  
                  {/* Field 1: Going To with Popular Destinations */}
                  <div className="lg:col-span-4 bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 hover:border-[#0091EA] transition-all rounded-2xl p-4 flex flex-col text-start justify-center relative cursor-pointer shadow-sm">
                    <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider block">{translate('Going to')}</label>
                    <div className="relative flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-[#0091EA] shrink-0" />
                      <input
                        type="text"
                        placeholder={translate('Destination or hotel name')}
                        value={searchGoingTo}
                        onFocus={() => setDestinationDropdownOpen(true)}
                        onChange={(e) => {
                          setSearchGoingTo(e.target.value);
                          setDestinationDropdownOpen(true);
                        }}
                        className="w-full bg-transparent border-none outline-none focus:ring-0 text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                      />
                    </div>
                    
                    {destinationDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setDestinationDropdownOpen(false)} />
                        <div className="absolute top-[105%] start-0 w-[calc(100vw-2rem)] sm:w-full sm:min-w-[280px] max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-2 border-sky-200/80 dark:border-sky-800/80 z-50 p-5 animate-fade-in text-start">
                          <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 px-1">{translate('Available Hotels')}</p>
                          <div className="space-y-1">
                            {hotels.map((hotel, idx) => (
                              <div
                                key={hotel.id || idx}
                                onClick={() => {
                                  setSearchGoingTo(hotel.name);
                                  setDestinationDropdownOpen(false);
                                }}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-slate-700 group-hover:bg-[#0091EA] group-hover:text-white flex items-center justify-center text-[#0091EA] transition-colors">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0091EA] transition-colors">{translate(hotel.name)}</p>
                                  {hotel.location && <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{translate(hotel.location)}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Field 2: Check-in - Check-out Dates */}
                  <div className="lg:col-span-4 bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 hover:border-[#0091EA] transition-all rounded-2xl p-3.5 flex flex-col text-start justify-center shadow-sm">
                    <DateRangePicker
                      startDate={hotelCheckIn}
                      endDate={hotelCheckOut}
                      onChange={(start, end) => {
                        setHotelCheckIn(start);
                        if (end) setHotelCheckOut(end);
                      }}
                      startLabel="Check In"
                      endLabel="Check Out"
                      minDate={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Field 3: Guests selector */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 hover:border-[#0091EA] transition-all rounded-2xl p-4 flex flex-col text-start justify-center relative cursor-pointer shadow-sm">
                    <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider block">{translate('Guests')}</label>
                    <button
                      type="button"
                      onClick={() => setHotelGuestsDropdownOpen(!hotelGuestsDropdownOpen)}
                      className="w-full text-start bg-transparent border-none outline-none text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 flex justify-between items-center cursor-pointer"
                    >
                      <span className="truncate">
                        {language === 'ar' ? (
                          <>
                            {hotelAdultsCount === 2 ? 'شخصان بالغان' : `${hotelAdultsCount} ${hotelAdultsCount === 1 ? translate('Adult') : translate('Adults')}`}
                            {hotelChildrenCount > 0 ? ` ، ${hotelChildrenCount === 2 ? 'طفلان' : `${hotelChildrenCount} ${hotelChildrenCount === 1 ? translate('Child') : translate('Children')}`}` : ''}
                            {` ، ${hotelRoomsCount === 1 ? translate('Room') : hotelRoomsCount === 2 ? 'غرفتان' : `${hotelRoomsCount} ${translate('Rooms')}`}`}
                          </>
                        ) : (
                          <>
                            {hotelAdultsCount} {hotelAdultsCount === 1 ? translate('Adult') : translate('Adults')}
                            {hotelChildrenCount > 0 ? `, ${hotelChildrenCount} ${hotelChildrenCount === 1 ? translate('Child') : translate('Children')}` : ''}
                            , {hotelRoomsCount} {hotelRoomsCount === 1 ? translate('Room') : translate('Rooms')}
                          </>
                        )}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    </button>

                    {hotelGuestsDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setHotelGuestsDropdownOpen(false)} />
                        <div className="absolute top-[105%] start-0 w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-sky-200/80 dark:border-sky-800/80 z-50 p-5 space-y-4 text-start">
                          <div className="flex items-center justify-between border-b border-sky-100 dark:border-sky-900/50 pb-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{translate('Guests & Rooms')}</span>
                            <span className="text-[10px] font-bold text-[#0091EA] bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-full">{hotelAdultsCount + hotelChildrenCount} {translate('Guests')}</span>
                          </div>

                          {/* Adults counter */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-black text-slate-800 dark:text-slate-200">{translate('Adults')}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{translate('Age 13+')}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={hotelAdultsCount <= 1}
                                onClick={() => updateHotelGuestsText(Math.max(1, hotelAdultsCount - 1), hotelChildrenCount, hotelRoomsCount)}
                                className="w-8 h-8 rounded-full border border-sky-200 dark:border-sky-800 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-5 text-center text-xs font-black text-slate-900 dark:text-white">{hotelAdultsCount}</span>
                              <button
                                type="button"
                                disabled={hotelAdultsCount >= 10}
                                onClick={() => updateHotelGuestsText(hotelAdultsCount + 1, hotelChildrenCount, hotelRoomsCount)}
                                className="w-8 h-8 rounded-full border border-sky-200 dark:border-sky-800 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Children counter */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-black text-slate-800 dark:text-slate-200">{translate('Children')}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{translate('Ages 0 - 12')}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={hotelChildrenCount <= 0}
                                onClick={() => updateHotelGuestsText(hotelAdultsCount, Math.max(0, hotelChildrenCount - 1), hotelRoomsCount)}
                                className="w-8 h-8 rounded-full border border-sky-200 dark:border-sky-800 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-5 text-center text-xs font-black text-slate-900 dark:text-white">{hotelChildrenCount}</span>
                              <button
                                type="button"
                                disabled={hotelChildrenCount >= 6}
                                onClick={() => updateHotelGuestsText(hotelAdultsCount, hotelChildrenCount + 1, hotelRoomsCount)}
                                className="w-8 h-8 rounded-full border border-sky-200 dark:border-sky-800 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Rooms counter */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-black text-slate-800 dark:text-slate-200">{translate('Rooms')}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{translate('Rooms needed')}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={hotelRoomsCount <= 1}
                                onClick={() => updateHotelGuestsText(hotelAdultsCount, hotelChildrenCount, Math.max(1, hotelRoomsCount - 1))}
                                className="w-8 h-8 rounded-full border border-sky-200 dark:border-sky-800 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-5 text-center text-xs font-black text-slate-900 dark:text-white">{hotelRoomsCount}</span>
                              <button
                                type="button"
                                disabled={hotelRoomsCount >= 5}
                                onClick={() => updateHotelGuestsText(hotelAdultsCount, hotelChildrenCount, hotelRoomsCount + 1)}
                                className="w-8 h-8 rounded-full border border-sky-200 dark:border-sky-800 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-sky-100 dark:border-sky-900/50 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setHotelGuestsDropdownOpen(false)}
                              className="w-full py-2.5 bg-gradient-to-r from-[#0091EA] to-sky-500 text-white font-black rounded-xl text-xs shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                            >
                              {translate('Done')}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Field 4: Search Button */}
                  <div className="lg:col-span-2 flex items-center">
                    <button
                      type="submit"
                      className="w-full h-14 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] animate-light-blue-pulse cursor-pointer uppercase tracking-wider text-xs"
                    >
                      <Search className="w-4 h-4" />
                      <span>{t.searchBtn}</span>
                    </button>
                  </div>

                </form>
              </div>
            )}

            {activeTab === 'cars' && (
              <div className="space-y-6">
                {/* Rent a Car Search Fields */}
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
                  
                  {/* Field 1: Pick-up Location */}
                  <div className="lg:col-span-3 bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 hover:border-[#0091EA] transition-all rounded-2xl p-4 flex flex-col text-start justify-center relative cursor-pointer shadow-sm">
                    <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider block">{translate('Pick-up Location')}</label>
                    <div className="relative flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-[#0091EA] shrink-0" />
                      <input
                        type="text"
                        placeholder={translate('City, airport, or hotel')}
                        value={carPickup}
                        onChange={(e) => setCarPickup(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:ring-0 text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Field 2: Drop-off Location */}
                  <div className="lg:col-span-3 bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 hover:border-[#0091EA] transition-all rounded-2xl p-4 flex flex-col text-start justify-center relative cursor-pointer shadow-sm">
                    <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider block">{translate('Drop-off Location')}</label>
                    <div className="relative flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-[#0091EA] shrink-0" />
                      <input
                        type="text"
                        placeholder={translate('Same as pick-up, or different location')}
                        value={carDropoff}
                        onChange={(e) => setCarDropoff(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:ring-0 text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Field 3: Rental Dates & Times */}
                  <div className="lg:col-span-4 bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 hover:border-[#0091EA] transition-all rounded-2xl p-3.5 flex flex-col text-start justify-center shadow-sm">
                    <DateRangePicker
                      startDate={carPickupDate}
                      endDate={carDropoffDate}
                      onChange={(start, end) => {
                        setCarPickupDate(start);
                        if (end) setCarDropoffDate(end);
                      }}
                      startLabel="Pick-up Date"
                      endLabel="Return Date"
                      minDate={new Date().toISOString().split('T')[0]}
                    />
                    <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-sky-100 dark:border-sky-800/50 text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase">{translate('Time:')}</span>
                        <input
                          type="text"
                          placeholder="10:00"
                          value={carPickupTime}
                          onChange={(e) => setCarPickupTime(e.target.value)}
                          className="w-12 bg-transparent text-slate-900 dark:text-slate-100 font-black focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase">{translate('Time:')}</span>
                        <input
                          type="text"
                          placeholder="10:00"
                          value={carDropoffTime}
                          onChange={(e) => setCarDropoffTime(e.target.value)}
                          className="w-12 bg-transparent text-slate-900 dark:text-slate-100 font-black focus:outline-none text-end"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Field 4: Car Class / Category */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 hover:border-[#0091EA] transition-all rounded-2xl p-4 flex flex-col text-start justify-center relative cursor-pointer shadow-sm">
                    <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider block">{translate('Car Class')}</label>
                    <button
                      type="button"
                      onClick={() => setCarCategoryDropdownOpen(!carCategoryDropdownOpen)}
                      className="w-full text-start bg-transparent border-none outline-none text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 flex justify-between items-center cursor-pointer"
                    >
                      <span className="truncate">{translate(carCategory)}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    </button>

                    {carCategoryDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setCarCategoryDropdownOpen(false)} />
                        <div className="absolute top-[105%] start-0 w-[calc(100vw-2rem)] sm:w-full sm:min-w-[200px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-sky-200/80 dark:border-sky-800/80 z-50 p-3 text-start">
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2 px-1">{translate('Select Car Category')}</p>
                          <div className="space-y-1">
                            {[
                              'Luxury Sports Car',
                              'Prestige SUV',
                              'Luxury Sedan',
                              'Convertible Coupe',
                              'Premium Electric',
                              'Spacious Minivan'
                            ].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setCarCategory(option);
                                  setCarCategoryDropdownOpen(false);
                                }}
                                className="w-full text-start px-3 py-2 text-xs hover:bg-[#0091EA]/10 hover:text-[#0091EA] dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
                              >
                                {translate(option)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Field 5: Search Button in its own line */}
                  <div className="xl:col-span-12 flex justify-end mt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white font-black px-8 py-3.5 rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-sky-500/25 animate-light-blue-pulse cursor-pointer uppercase tracking-wider text-xs"
                    >
                      <Search className="w-4 h-4" />
                      <span>{t.searchRentalBtn}</span>
                    </button>
                  </div>

                </form>
              </div>
            )}

            {(activeTab !== 'hotels' && activeTab !== 'cars') && (
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-start items-stretch">
                
                {/* Field 1: Going To */}
                <div className="bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 hover:border-[#0091EA] transition-all rounded-2xl p-3.5 flex flex-col justify-center relative cursor-pointer shadow-sm">
                  <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider block mb-1">{translate('Going to')}</label>
                  <div className="relative flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0091EA] shrink-0" />
                    <input
                      type="text"
                      placeholder={translate(`e.g. Maldives, Istanbul, Santorini`)}
                      value={searchGoingTo}
                      onFocus={() => setSearchDropdownOpen(true)}
                      onChange={(e) => {
                        setSearchGoingTo(e.target.value);
                        setSearchDropdownOpen(true);
                      }}
                      className="w-full bg-transparent border-none outline-none focus:ring-0 text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                  </div>
                  {(activeTab === 'flight-hotel' || activeTab === 'flights') && searchDropdownOpen && filteredSuggestions.length > 0 && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setSearchDropdownOpen(false)} />
                      <div className="absolute top-[105%] start-0 w-[calc(100vw-2rem)] sm:w-full sm:min-w-[280px] max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 p-2 max-h-[300px] overflow-y-auto animate-fade-in text-start">
                        {filteredSuggestions.map((item, idx) => (
                          <div 
                            key={`suggest-${activeTab}-${item.id}-${idx}`}
                            onClick={() => {
                              setSearchGoingTo((activeTab === 'flight-hotel') ? item.title : item.name);
                              setSearchDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer transition-colors"
                          >
                            {activeTab === 'flights' ? (
                              <div className="w-12 h-12 bg-gradient-to-tr from-[#0091EA] via-sky-500 to-cyan-400 text-white rounded-lg flex items-center justify-center shrink-0">
                                <Plane className="w-6 h-6" />
                              </div>
                            ) : (
                              <img 
                                src={item.imageUrl || 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=100'} 
                                alt="" 
                                className="w-12 h-12 rounded-lg object-cover bg-slate-100" 
                                referrerPolicy="no-referrer"
                                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=100'; }}
                              />
                            )}
                            <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{translate((activeTab === 'flight-hotel') ? item.title : item.name)}</p>
                              <p className="text-[10px] font-extrabold text-[#0091EA] uppercase mt-0.5">{translate((activeTab === 'flight-hotel') ? item.category : item.location)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Field 2: Flying From */}
                <div className="bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 hover:border-[#0091EA] transition-all rounded-2xl p-3.5 flex flex-col justify-center relative shadow-sm">
                  <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider block mb-1">{translate('Flying from')}</label>
                  <div className="relative flex items-center gap-2">
                    <PlaneTakeoff className="w-4 h-4 text-[#0091EA] shrink-0" />
                    <input
                      type="text"
                      placeholder={translate(`e.g. London LHR, Dubai DXB`)}
                      value={searchFlyingFrom}
                      onChange={(e) => setSearchFlyingFrom(e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:ring-0 text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Field 3: Travel Dates */}
                <div className="bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 hover:border-[#0091EA] transition-all rounded-2xl p-3.5 flex flex-col justify-center relative shadow-sm">
                  <span className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider block mb-1">{translate('Travel Dates')}</span>
                  <DateRangePicker
                    startDate={searchDate}
                    endDate={searchReturnDate}
                    onChange={(start, end) => {
                      setSearchDate(start);
                      if (end) setSearchReturnDate(end);
                    }}
                    startLabel="Departure"
                    endLabel="Return"
                    minDate={new Date().toISOString().split('T')[0]}
                    compact
                  />
                </div>

                {/* Field 4: Guests & Class */}
                <div className="bg-white dark:bg-slate-950 border-2 border-sky-200/80 dark:border-sky-800/80 hover:border-[#0091EA] transition-all rounded-2xl p-3.5 flex flex-col justify-center relative cursor-pointer shadow-sm">
                  <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider block mb-1">{translate('Guests & Cabin Class')}</label>
                  <div className="relative flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0091EA] shrink-0" />
                    <button
                      type="button"
                      onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                      className="w-full text-start bg-transparent border-none outline-none text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 flex justify-between items-center cursor-pointer"
                    >
                      <span className="truncate">
                        {language === 'ar' ? (
                          <>
                            {adultsCount === 2 ? 'شخصان بالغان' : `${adultsCount} ${adultsCount === 1 ? translate('Adult') : translate('Adults')}`}
                            {childrenCount > 0 ? ` ، ${childrenCount === 2 ? 'طفلان' : `${childrenCount} ${childrenCount === 1 ? translate('Child') : translate('Children')}`}` : ''}
                            {roomsCount > 1 ? ` ، ${roomsCount === 2 ? 'غرفتان' : `${roomsCount} ${translate('Rooms')}`}` : ''}
                            {' ، '}{translate(cabinClass)}
                          </>
                        ) : (
                          <>
                            {adultsCount} {adultsCount === 1 ? translate('Adult') : translate('Adults')}
                            {childrenCount > 0 ? `, ${childrenCount} ${childrenCount === 1 ? translate('Child') : translate('Children')}` : ''}
                            {roomsCount > 1 ? `, ${roomsCount} ${translate('Rooms')}` : ''}
                            , {translate(cabinClass)}
                          </>
                        )}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 ml-1" />
                    </button>
                  </div>

                  {guestDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setGuestDropdownOpen(false)} />
                      <div className="absolute top-[105%] start-0 w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-sky-200/80 dark:border-sky-800/80 z-50 p-5 space-y-4 text-start">
                        <div className="flex items-center justify-between border-b border-sky-100 dark:border-sky-900/50 pb-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{translate('Passengers & Cabin')}</span>
                          <span className="text-[10px] font-bold text-[#0091EA] bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-full">{adultsCount + childrenCount} {translate('Guests')}</span>
                        </div>

                        {/* Adults counter */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black text-slate-800 dark:text-slate-200">{translate('Adults')}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{translate('Age 13+')}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              disabled={adultsCount <= 1}
                              onClick={() => updateSearchGuestsText(Math.max(1, adultsCount - 1), childrenCount, roomsCount, cabinClass)}
                              className="w-8 h-8 rounded-full border border-sky-200 dark:border-sky-800 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-5 text-center text-xs font-black text-slate-900 dark:text-white">{adultsCount}</span>
                            <button
                              type="button"
                              disabled={adultsCount >= 10}
                              onClick={() => updateSearchGuestsText(adultsCount + 1, childrenCount, roomsCount, cabinClass)}
                              className="w-8 h-8 rounded-full border border-sky-200 dark:border-sky-800 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Children counter */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black text-slate-800 dark:text-slate-200">{translate('Children')}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{translate('Ages 0 - 12')}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              disabled={childrenCount <= 0}
                              onClick={() => updateSearchGuestsText(adultsCount, Math.max(0, childrenCount - 1), roomsCount, cabinClass)}
                              className="w-8 h-8 rounded-full border border-sky-200 dark:border-sky-800 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-5 text-center text-xs font-black text-slate-900 dark:text-white">{childrenCount}</span>
                            <button
                              type="button"
                              disabled={childrenCount >= 6}
                              onClick={() => updateSearchGuestsText(adultsCount, childrenCount + 1, roomsCount, cabinClass)}
                              className="w-8 h-8 rounded-full border border-sky-200 dark:border-sky-800 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Cabin Class */}
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase mb-1.5">{translate('Cabin Class')}</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {['Economy', 'Premium', 'Business', 'First'].map((cl) => (
                              <button
                                key={cl}
                                type="button"
                                onClick={() => updateSearchGuestsText(adultsCount, childrenCount, roomsCount, cl)}
                                className={`px-2.5 py-2 text-xs text-center border rounded-xl font-bold transition-all cursor-pointer ${
                                  cabinClass === cl
                                    ? 'bg-[#0091EA] text-white border-[#0091EA] shadow-md shadow-sky-500/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-[#0091EA] hover:bg-[#0091EA]/10 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {translate(cl)}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-sky-100 dark:border-sky-900/50 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setGuestDropdownOpen(false)}
                            className="w-full py-2.5 bg-gradient-to-r from-[#0091EA] to-sky-500 text-white font-black rounded-xl text-xs shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            {translate('Done')}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Submit Button */}
                <div className="col-span-1 md:col-span-2 xl:col-span-4 flex justify-end mt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white font-black px-8 py-3.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-sky-500/25 animate-light-blue-pulse cursor-pointer uppercase tracking-wider text-xs"
                  >
                    <Search className="w-4 h-4" />
                    <span>{t.searchStaysTravel}</span>
                  </button>
                </div>

              </form>
            )}
          </div>

        </motion.div>
      </section>



      {/* 4. STRATEGIC PARTNERSHIPS SECTION */}
      <section id="intro-text" className="py-16 relative overflow-hidden transition-colors duration-500 border-t border-b border-sky-100 dark:border-sky-900/40">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 backdrop-blur-3xl z-0"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-300/20 dark:bg-sky-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-pulse-slow z-0"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-300/20 dark:bg-fuchsia-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-pulse-slow z-0" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase mb-2">
            <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent">{translate('Strategic Partnerships')}</span>
          </h2>
          <p className="text-sm md:text-base text-sky-800 dark:text-sky-200 mb-10 font-bold">
            {translate('Working together to bring you the best of each destination')}
          </p>
          
          <div className="relative w-full max-w-7xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-[36px] overflow-hidden group shadow-2xl bg-slate-900 border-2 border-sky-300 dark:border-sky-800 animate-blue-glow">
            {hotels.length > 0 ? (
              hotels.map((hotel, index) => (
                <div key={hotel.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHotelIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                  <img 
                    src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'} 
                    alt={`${hotel.name} - Premier Luxury Hotels & Luxury Villas in ${hotel.location}`} 
                    className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Dark overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
                  
                  {/* Content overlaid on image */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
                    <div className="flex flex-col items-center max-w-lg text-center">
                      <h3 className="text-3xl md:text-5xl font-black tracking-wider text-white mb-2 uppercase drop-shadow-md flex items-center justify-center flex-wrap gap-2">
                        {translate(hotel.name)}
                      </h3>
                      <h4 className="text-xl md:text-2xl font-black tracking-wider text-sky-300 mb-2 uppercase drop-shadow-md">{translate(hotel.location)}</h4>
                      <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-gray-200 drop-shadow-sm flex items-center justify-center gap-1 font-extrabold">
                        {Array.from({ length: hotel.rating || 5 }).map((_, i) => (
                          <span key={i} className="text-amber-400">★</span>
                        ))} 
                        <span className="ml-2 rtl:mr-2 rtl:ml-0">{translate('LUXURY RESORT')}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0091EA]"></div>
              </div>
            )}

            {/* Navigation Arrows */}
            {hotels.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentHotelIndex((prev) => (prev - 1 + hotels.length) % hotels.length); }} 
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-slate-950/80 hover:bg-[#0091EA] border border-sky-400/30 text-white rounded-full flex items-center justify-center z-20 backdrop-blur-md transition-all group/arrow shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6 transition-transform group-hover/arrow:-translate-x-0.5" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentHotelIndex((prev) => (prev + 1) % hotels.length); }} 
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-slate-950/80 hover:bg-[#0091EA] border border-sky-400/30 text-white rounded-full flex items-center justify-center z-20 backdrop-blur-md transition-all group/arrow shadow-lg"
                >
                  <ChevronRight className="w-6 h-6 transition-transform group-hover/arrow:translate-x-0.5" />
                </button>
              </>
            )}

            {/* Bottom button and pagination */}
            <div className="absolute bottom-6 md:bottom-10 left-0 right-0 flex flex-col items-center gap-6 z-20">
              <button 
                onClick={() => {
                  if (hotels.length > 0) {
                     setHomeSearchTab('hotels');
                     setCurrentPage('hotels');
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white font-black text-xs uppercase tracking-wider rounded-full hover:scale-105 transition-all shadow-lg shadow-sky-500/30 cursor-pointer"
              >
                {translate('Book now')}
              </button>
              
              {hotels.length > 1 && (
                <div className="flex gap-2.5">
                  {hotels.map((_, i) => (
                    <div 
                      key={i} 
                      onClick={() => setCurrentHotelIndex(i)} 
                      className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${i === currentHotelIndex ? 'bg-[#0091EA] scale-125 shadow-md shadow-sky-500/50' : 'bg-white/40 hover:bg-white/70'}`}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOLIDAY PACKAGES SECTION */}
      <section id="holiday-packages" className="py-20 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-500">
        
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0091EA]/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0091EA]/5 dark:bg-slate-800/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-black tracking-widest text-white bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 px-4 py-1.5 rounded-full shadow-md shadow-sky-500/20">{translate('Exclusive Escapes')}</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-4 transition-colors">
              <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent">{translate('HOLIDAY PACKAGES')}</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto transition-colors">{translate('Explore carefully curated escapes and top holiday deals selected by our expert travel guides.')}</p>
          </div>

          {loadingPackages && (
            <div className="py-16 text-center text-sky-800 dark:text-sky-300 font-bold">{translate('Retrieving exquisite holiday packages...')}</div>
          )}

          {errorPackages && (
            <div className="py-16 text-center text-rose-500 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{errorPackages}</span>
            </div>
          )}

          {!loadingPackages && !errorPackages && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredHomeTours.slice(0, visibleToursCount).map((tour) => (
                  <div 
                    key={tour.id} 
                    onClick={() => setCurrentPage('tour', { id: tour.id.toString() })}
                    className="group relative bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 p-3 overflow-hidden shadow-xl shadow-sky-500/10 hover:shadow-2xl hover:shadow-sky-500/20 hover:border-[#0091EA] transition-all duration-300 animate-blue-glow flex flex-col h-[420px] cursor-pointer"
                  >
                    <div className="relative w-full h-[200px] rounded-[24px] overflow-hidden mb-4">
                      <img 
                        src={tour.imageUrl || 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800'} 
                        alt={`${tour.title} - Luxury Holidays & Luxury Safari Experiences in Sri Lanka`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-sky-400/30 flex items-center gap-1.5 shadow-md">
                        <MapPin className="w-3 h-3 text-[#0091EA]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">{translate('Sri Lanka')}</span>
                      </div>
                    </div>
                    
                    <div className="px-3 flex flex-col flex-1 pb-2">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest font-black text-[#0091EA] mb-1.5 block">{translate(tour.category)}</span>
                          <h3 className="text-[15px] font-black text-slate-900 dark:text-white leading-tight line-clamp-2 transition-colors group-hover:text-[#0091EA]">{translate(tour.title)}</h3>
                        </div>
                      </div>
                      
                      <div className="mt-auto flex items-end justify-between border-t border-sky-100 dark:border-sky-800/40 pt-4">
                        <div>
                          <p className="text-[10px] text-sky-800 dark:text-sky-300 font-extrabold mb-0.5">{translate(tour.duration)}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{translate('From')}</span>
                            <span className="text-lg font-black bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 bg-clip-text text-transparent">{formatPrice(tour.price)}</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setCurrentPage('tour', { id: tour.id.toString() })}
                          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0091EA] to-cyan-400 text-white flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-md shadow-sky-500/30 cursor-pointer"
                          title={translate(`Book Now`)}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {visibleToursCount < filteredHomeTours.length && (
                <div className="flex justify-center mt-12 mb-4">
                  <button
                    onClick={() => setVisibleToursCount(prev => prev + 4)}
                    className="px-8 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 rounded-full font-bold text-sm tracking-wide shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#0091EA] hover:text-[#0091EA] cursor-pointer"
                  >
                    {translate('Load More Tours')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* VERIFIED TRAVELER PHOTO & REVIEW CAROUSEL */}
      <TravelerReviewCarousel 
        currentUser={currentUser}
        userProfile={userProfile}
        onOpenAuth={onOpenAuth}
      />

      {/* 6. NEWSLETTER CTA SECTION */}
      <section id="newsletter-section" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[36px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-2xl shadow-sky-500/10 animate-blue-glow overflow-hidden flex flex-col lg:flex-row min-h-[300px]">
          
          {/* Left Side: Info Block */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-white flex flex-col justify-center px-8 py-14 md:px-16 md:py-20 text-start relative overflow-hidden group">
            <div className="absolute top-4 left-4 text-sky-500/20 transition-transform duration-1000 group-hover:rotate-180 group-hover:scale-110">
              <Compass className="w-48 h-48 animate-spin-slow" />
            </div>
            <div className="relative z-10">
              <span className="text-xs uppercase font-black text-white bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 px-4 py-1.5 rounded-full shadow-md shadow-sky-500/30">{translate('Get Inspired')}</span>
              <h2 className="text-4xl md:text-5xl font-black mt-5 tracking-tight leading-none uppercase">
                {translate('WHERE TO')} <br /><span className="bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent">{translate('NEXT?')}</span>
              </h2>
            </div>
          </div>

          {/* Right Side: Block */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-14 md:px-16 md:py-20 text-start">
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-md">
              {translate('Sign up to receive early access to premier flight rates, bespoke itineraries, global travel updates, and exclusive members-only discounts.')}
            </p>

            <form onSubmit={handleNewsletterSignup} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                required
                placeholder={translate('Your email address')}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-grow px-4 py-3 bg-white dark:bg-slate-950 border-2 border-sky-200 dark:border-sky-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0091EA] text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-400 shadow-sm"
              />
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className="px-6 py-3.5 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {newsletterSubmitting ? translate('Signing up...') : translate('Sign Up')}
              </button>
            </form>

            {newsletterMessage && (
              <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-3">{newsletterMessage}</p>
            )}

            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-semibold">
              {translate('By signing up, you consent to receive newsletter and marketing emails. You can unsubscribe at any time. Read our')} <button onClick={() => setCurrentPage('about-us')} className="underline hover:text-[#0091EA] font-bold">{translate('Privacy Notice')}</button>.
            </p>
          </div>

        </div>
      </section>

      {/* UNIFIED LIGHT-ANIMATED-BLUE AUTO-MOVING GUARANTEES & TRAVEL EXTRAS ROW AT BOTTOM */}
      <GuaranteesProtectionBar />
      {selectedPackage && !showConfirmModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-fade-in w-screen h-screen">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden my-auto">
            
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 shrink-0">
              <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm">{translate(`Book`)}: {translate(selectedPackage.title)}</h3>
              <button 
                onClick={() => {
                  setSelectedPackage(null);
                  setBookingSuccess(false);
                }}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {bookingSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100 font-sans">{translate(`Booking Requested!`)}</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{translate(`We have recorded your interest. Our travel booking consultants will call or email you shortly to confirm travel options.`)}</p>
                  <button
                    onClick={() => {
                      setSelectedPackage(null);
                      setBookingSuccess(false);
                    }}
                    className="w-full py-2.5 bg-gray-900 dark:bg-slate-800 hover:bg-gray-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                  >
                    {translate(`Done`)}
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePackageBookSubmit} className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{translate(`Holiday Package Details`)}:</p>
                    <p className="text-gray-600 dark:text-slate-400 mt-1">{translate(`Destination`)}: {translate(selectedPackage.location)}</p>
                    <p className="text-gray-600 dark:text-slate-400">{translate(`Price`)}: {formatPrice(selectedPackage.price)} / {translate(`person`)} • {selectedPackage.nights} {translate(`nights`)}</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate(`Your Name`)}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Smith"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-[#0091EA] focus:outline-none text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate(`Your Email`)}</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-[#0091EA] focus:outline-none text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate(`Your Phone`)}</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +44 7911 123456"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-[#0091EA] focus:outline-none text-sm mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate(`Travel Date`)}</label>
                      <DatePicker
                        value={bookingDate}
                        onChange={setBookingDate}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate(`Guests`)}</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        required
                        value={bookingGuestsCount}
                        onChange={(e) => setBookingGuestsCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-full px-3 py-2.5 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm mt-1 focus:ring-2 focus:ring-[#0091EA] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="w-full py-3 bg-[#0091EA] hover:bg-[#007cc7] text-white rounded-xl text-sm font-bold transition-colors mt-2 cursor-pointer"
                  >
                    {bookingSubmitting ? translate('Requesting booking...') : translate('Confirm Request Booking')}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

      {selectedPackage && (
        <BookingConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onPaymentSuccess={() => {
            setShowConfirmModal(false);
            setBookingName('');
            setBookingEmail('');
            setBookingPhone('');
            setCurrentPage('account-bookings');
          }}
          bookingType="tour"
          title={translate(selectedPackage.title)}
          subtitle={translate(`Sri Lanka`)}
          dates={{ start: bookingDate }}
          travelers={bookingGuestsCount}
          pricePerUnit={selectedPackage.price}
          totalCost={selectedPackage.price * bookingGuestsCount}
          passengerDetails={{ name: bookingName, email: bookingEmail, phone: bookingPhone }}
          bookingData={{
            tourId: selectedPackage.id,
            travelDate: bookingDate,
            guests: bookingGuestsCount
          }}
          currentUser={currentUser}
        />
      )}

    </div>
  );
}
