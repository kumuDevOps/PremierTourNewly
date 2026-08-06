import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CarFront, 
  MapPin, 
  Calendar, 
  Clock, 
  Search, 
  Users, 
  Sparkles, 
  Settings, 
  Fuel, 
  Check, 
  X,
  AlertCircle,
  Download,
  Share2,
  FileText,
  ChevronLeft,
  Plus,
  Minus,
  ShieldCheck,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  Building,
  CheckCircle2,
  CreditCard, Heart
} from 'lucide-react';
import { Car } from '../types.ts';
import DateRangePicker from './DateRangePicker.tsx';
import BookingConfirmationModal from './BookingConfirmationModal.tsx';
import BookingPDFModal, { BookingVoucherData } from './BookingPDFModal.tsx';
import BookingProgressBar from './BookingProgressBar.tsx';
import RouteMapPreview from './RouteMapPreview.tsx';
import OrderTrackingModal from './OrderTrackingModal.tsx';
import VehicleReviews from './VehicleReviews.tsx';
import { useLanguage } from '../lib/i18n.tsx';
import { useCurrency } from '../lib/CurrencyContext.tsx';

interface CarsViewProps {
  currentUser?: any;
  userProfile?: any;
  onOpenAuth?: () => void;
  onNavigate?: (page: string) => void;
  addToWishlist?: (item: any) => void;
  initialSearchQuery?: any;
}

export default function CarsView({ currentUser, userProfile, onOpenAuth, onNavigate, addToWishlist }: CarsViewProps = {}) {
  const { translate } = useLanguage();
  const { formatPrice } = useCurrency();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search parameters & Locations
  const [pickupLoc, setPickupLoc] = useState('Colombo Bandaranaike International Airport (CMB)');
  const [dropoffLoc, setDropoffLoc] = useState('Kandy City Center, Sri Lanka');
  const [pickupDate, setPickupDate] = useState('2026-08-01');
  const [returnDate, setReturnDate] = useState('2026-08-08');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Navigation & Page State
  const [isBookingPage, setIsBookingPage] = useState(false);

  // Booking & Passenger details
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [additionalGuests, setAdditionalGuests] = useState('');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [licenseCountry, setLicenseCountry] = useState('United Kingdom');
  const [specialRequests, setSpecialRequests] = useState('');

  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [pdfVoucherData, setPdfVoucherData] = useState<BookingVoucherData | null>(null);

  const calculateDays = () => {
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const handleOpenCarPdfVoucher = (customRef?: string) => {
    if (!selectedCar) return;
    const ref = customRef || bookingRef || 'CAR-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const days = calculateDays();
    const total = selectedCar.pricePerDay * days;

    const voucher: BookingVoucherData = {
      id: ref,
      bookingRef: ref,
      type: 'car',
      title: selectedCar.name,
      subtitle: `${selectedCar.category} • ${selectedCar.transmission} • ${days} Day(s) Chauffeur Rental`,
      description: `Private Luxury Chauffeur Rental Pass for ${customerName || 'Valued Guest'}. Pick-up at ${pickupLoc}, Pick-down at ${dropoffLoc}. Full insurance, fuel, and highway tolls included.`,
      category: 'VEHICLE RENTAL',
      customerName: customerName || userProfile?.fullName || currentUser?.displayName || 'Valued Guest',
      customerEmail: contactEmail || currentUser?.email || 'driver@example.com',
      customerPhone: contactPhone || userProfile?.phone || '',
      guestsCount: guestsCount || selectedCar.seats || 1,
      startDate: pickupDate,
      endDate: returnDate,
      startTime: '09:00 AM (Pick-up)',
      durationText: `${days} Day(s) Chauffeur Rental`,
      vehicleModel: selectedCar.name,
      pickupLocation: pickupLoc,
      dropoffLocation: dropoffLoc,
      carCategory: selectedCar.category,
      carTransmission: selectedCar.transmission,
      transmission: selectedCar.transmission,
      fuelType: 'Included (Uncapped Fuel & Tolls)',
      totalPrice: total,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };
    setPdfVoucherData(voucher);
    setShowPdfModal(true);
  };

  // Real-time Availability State
  const [availabilityMap, setAvailabilityMap] = useState<Record<number, any>>({});

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/availability');
      if (res.ok) {
        const data = await res.json();
        if (data && data.cars) {
          setAvailabilityMap(data.cars);
        }
      }
    } catch (e) {
      console.error('Error fetching availability:', e);
    }
  };

  useEffect(() => {
    fetchAvailability();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime/stream');
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'availability-updated') {
            if (parsed.data && parsed.data.cars) {
              setAvailabilityMap(parsed.data.cars);
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
      setCustomerName(userProfile.fullName || '');
      if (userProfile.phone) setContactPhone(userProfile.phone);
    }
    if (currentUser && currentUser.email) {
      setContactEmail(currentUser.email);
    }
  }, [userProfile, currentUser]);

  useEffect(() => {
    fetchCars();
  }, [selectedCategory]);

  const DEFAULT_FALLBACK_CARS: Car[] = [
    {
      id: 1,
      name: "Toyota Axio / Allion Sedan",
      category: "Car",
      seats: 3,
      transmission: "Automatic",
      pricePerDay: 45,
      imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      description: "Comfortable air-conditioned sedan ideal for 1-3 passengers. Includes professional English-speaking driver, fuel, highway tolls, and full insurance.",
      features: ["Air Conditioned", "English Speaking Driver", "Fuel Included", "Highway Tolls Included", "3 Luggage Bags"]
    },
    {
      id: 2,
      name: "Toyota KDH Flat Roof Van",
      category: "Van",
      seats: 6,
      transmission: "Automatic",
      pricePerDay: 65,
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      description: "Spacious mini van for families or small groups up to 6 passengers. Fully air-conditioned with adjustable reclining seats.",
      features: ["Dual A/C", "Reclining Seats", "English Speaking Driver", "Fuel & Tolls Included", "5 Luggage Bags"]
    },
    {
      id: 3,
      name: "Toyota KDH Super GL High Roof",
      category: "Van",
      seats: 9,
      transmission: "Automatic",
      pricePerDay: 80,
      imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
      description: "Luxury high-roof van featuring extra headroom, individual AC vents, and premium plush seating for up to 9 passengers.",
      features: ["High Roof Extra Space", "Individual A/C Vents", "Plush Reclining Seats", "Fuel & Tolls Included", "8 Luggage Bags"]
    },
    {
      id: 4,
      name: "Toyota Coaster Mini Bus",
      category: "Mini Bus",
      seats: 18,
      transmission: "Manual",
      pricePerDay: 125,
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
      description: "Medium-sized tourist bus perfect for groups up to 18 passengers. Equipped with high-performance AC, PA mic system, and large luggage storage.",
      features: ["High Capacity A/C", "PA Microphone System", "Reclining Seats", "Driver & Helper Included", "Large Luggage Bay"]
    },
    {
      id: 5,
      name: "Scania / Isuzu Luxury Coach",
      category: "Luxury Bus",
      seats: 35,
      transmission: "Manual",
      pricePerDay: 180,
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      description: "Full-size luxury tourist coach with climate control AC, under-floor luggage compartments, USB charging ports, and tour assistant.",
      features: ["Climate Control A/C", "USB Charging Ports", "Under-floor Luggage", "Senior Driver & Assistant", "TV/Audio System"]
    },
    {
      id: 6,
      name: "Toyota Land Cruiser Prado SUV",
      category: "SUV",
      seats: 4,
      transmission: "Automatic",
      pricePerDay: 95,
      imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
      description: "Premium 4WD SUV with leather interior, sunroof, and high ground clearance. Perfect for luxury private island tours.",
      features: ["4WD Off-Road", "Leather Seats & Sunroof", "VIP Chauffeur", "Fuel & Tolls Included", "4 Luggage Bags"]
    },
    {
      id: 7,
      name: "Bajaj RE Tuk Tuk Explorer",
      category: "Budget",
      seats: 2,
      transmission: "Manual",
      pricePerDay: 25,
      imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
      description: "Authentic Sri Lankan auto-rickshaw experience for short distance city tours and scenic coastal rides.",
      features: ["Open-Air Panoramic", "Bluetooth Speaker", "Local Driver/Guide", "Authentic Experience"]
    }
  ];

  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      let url = '/api/cars';
      if (selectedCategory !== 'All') {
        url += `?category=${selectedCategory}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCars(data);
        } else {
          const filtered = selectedCategory !== 'All' 
            ? DEFAULT_FALLBACK_CARS.filter(c => c.category.toLowerCase() === selectedCategory.toLowerCase())
            : DEFAULT_FALLBACK_CARS;
          setCars(filtered);
        }
      } else {
        const filtered = selectedCategory !== 'All' 
          ? DEFAULT_FALLBACK_CARS.filter(c => c.category.toLowerCase() === selectedCategory.toLowerCase())
          : DEFAULT_FALLBACK_CARS;
        setCars(filtered);
      }
    } catch (err) {
      console.error(err);
      const filtered = selectedCategory !== 'All' 
        ? DEFAULT_FALLBACK_CARS.filter(c => c.category.toLowerCase() === selectedCategory.toLowerCase())
        : DEFAULT_FALLBACK_CARS;
      setCars(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleStartBooking = (car: Car) => {
    setSelectedCar(car);
    setIsBookingPage(true);
    setBookingSuccess(false);
    setGuestsCount(Math.min(2, car.seats));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;

    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (!bookingRef) {
      const generatedRef = 'CAR-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      setBookingRef(generatedRef);
    }
    setShowConfirmModal(true);
  };

  const POPULAR_PICKUPS = [
    'Colombo Airport (CMB)',
    'Colombo Fort Hotel',
    'Kandy Station',
    'Galle Fort',
    'Negombo Beach'
  ];

  const POPULAR_DROPOFFS = [
    'Kandy City Center',
    'Galle Fort Resort',
    'Bentota Beach',
    'Ella Town',
    'Trincomalee Beach'
  ];

  return (
    <div id="cars-view" className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pb-20 transition-colors">
      
      {/* Header banner */}
      <div className="relative rounded-b-[40px] text-white py-14 px-6 border-b-2 border-sky-400/40 text-center overflow-hidden shadow-2xl animate-blue-glow mb-8 bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80" 
            alt="Luxury Car Fleet" 
            className="w-full h-full object-cover scale-105 filter brightness-90 transform transition-transform duration-1000 hover:scale-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/50 via-transparent to-cyan-950/50" />
        </div>

        <div className="relative z-10 space-y-3 max-w-3xl mx-auto">
          {isBookingPage && selectedCar ? (
            <button
              onClick={() => {
                setIsBookingPage(false);
                setBookingSuccess(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 hover:bg-[#0091EA] text-white text-xs font-bold border border-sky-400/40 transition-all cursor-pointer shadow-lg mb-2"
            >
              <ChevronLeft className="w-4 h-4 text-sky-400" />
              <span>{translate('Back to Fleet Packages')}</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sky-500/30 animate-light-blue-pulse">
              <CarFront className="w-3.5 h-3.5 text-white animate-pulse" />
              {translate('Premier Chauffeur & Fleet')}
            </span>
          )}

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
            <span className="bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent">
              {isBookingPage && selectedCar ? `${translate('Reserve')} ${selectedCar.name}` : translate('Sri Lanka Vehicle Rental Packages')}
            </span>
          </h1>
          <p className="text-xs md:text-sm text-sky-100/90 font-medium max-w-xl mx-auto leading-relaxed">
            {isBookingPage 
              ? translate('Specify your pick-up location, pick-down location, guest count, and passenger details below to generate your official PDF voucher.')
              : translate('Rent premium cars, vans, SUVs, and tourist buses with experienced English-speaking drivers. Fuel, highway tolls, and full insurance included.')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Progress Bar */}
        <BookingProgressBar
          currentStep={bookingSuccess ? 4 : showConfirmModal ? 3 : isBookingPage ? 2 : 1}
          type="car"
          onStepClick={(stepNum) => {
            if (stepNum === 1) {
              setIsBookingPage(false);
              setBookingSuccess(false);
              setShowConfirmModal(false);
            } else if (stepNum === 2 && selectedCar) {
              setIsBookingPage(true);
              setShowConfirmModal(false);
            } else if (stepNum === 3 && selectedCar) {
              if (!currentUser && onOpenAuth) {
                onOpenAuth();
                return;
              }
              setShowConfirmModal(true);
            }
          }}
        />

        {/* DEDICATED CAR BOOKING FORM PAGE VIEW */}
        {isBookingPage && selectedCar ? (
          <div className="bg-gradient-to-br from-white via-sky-50/30 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 md:p-10 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-2xl shadow-sky-500/10 space-y-8 animate-fade-in text-start">
            
            {/* Top Navigation Control */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-100 dark:border-sky-800/50 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0091EA] to-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/25">
                  <CarFront className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">{selectedCar.name}</h2>
                  <p className="text-xs font-bold text-[#0091EA] flex items-center gap-2 mt-0.5">
                    <span>{selectedCar.category}</span>
                    <span>•</span>
                    <span>{selectedCar.transmission}</span>
                    <span>•</span>
                    <span>{selectedCar.seats} {translate('Passengers Capacity')}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white dark:bg-slate-950 px-4 py-2.5 rounded-2xl border border-sky-200 dark:border-sky-800 shadow-sm">
                <span className="text-xs font-bold text-slate-500">{translate('Rental Cost')}:</span>
                <span className="text-lg font-black text-[#0091EA]">{formatPrice(selectedCar.pricePerDay * calculateDays())}</span>
                <span className="text-[10px] font-extrabold text-slate-400">({calculateDays()} {translate('Days')})</span>
              </div>
            </div>

            {bookingSuccess ? (
              /* Success Confirmation Banner */
              <div className="p-8 bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 rounded-3xl text-center space-y-6 animate-scale-up">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="px-3.5 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-2xs font-black uppercase tracking-widest rounded-full border border-emerald-300">
                    {translate('Booking Confirmed & Voucher Issued')}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{translate('Your Rental Vehicle is Locked!')}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {translate('Official booking reference')} <span className="font-mono font-bold text-[#0091EA]">{bookingRef}</span>. {translate('Vehicle pick-up is confirmed at')} <span className="font-bold">{pickupLoc}</span> {translate('and drop-off at')} <span className="font-bold">{dropoffLoc}</span>.
                  </p>
                </div>

                {/* PDF Generation & Share Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCarPdfVoucher()}
                    className="px-6 py-3.5 bg-[#0091EA] hover:bg-sky-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-sky-500/25 flex items-center gap-2.5 cursor-pointer animate-light-blue-pulse"
                  >
                    <Download className="w-4 h-4" />
                    <span>{translate('Download / View Official PDF Voucher')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsBookingPage(false)}
                    className="px-6 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    <span>{translate('Return to Vehicle Fleet')}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* DEDICATED CAR BOOKING FORM */
              <form onSubmit={handleBookSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Columns: Inputs & Locations */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* SECTION 1: PICK-UP & DROP-OFF LOCATIONS */}
                  <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-sky-200 dark:border-sky-800/80 shadow-sm space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#0091EA]" />
                      <span>{translate('1. Pick-Up & Drop-Off Location Details')}</span>
                    </h3>

                    {/* Pick-Up Location Input */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {translate('Pick-Up Location')} *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0091EA]" />
                        <input
                          type="text"
                          required
                          value={pickupLoc}
                          onChange={(e) => setPickupLoc(e.target.value)}
                          placeholder={translate('e.g. Colombo Bandaranaike Airport (CMB)')}
                          className="w-full ps-10 pe-4 py-3 bg-slate-50/50 dark:bg-slate-900 border-2 border-sky-100 dark:border-sky-800/60 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA]"
                        />
                      </div>
                      
                      {/* Popular Pick-Up Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase me-1">{translate('Quick Suggestions')}:</span>
                        {POPULAR_PICKUPS.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setPickupLoc(loc)}
                            className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/60 hover:bg-[#0091EA] hover:text-white text-sky-800 dark:text-sky-300 text-[10px] font-bold rounded-lg border border-sky-200 dark:border-sky-800 transition-all cursor-pointer"
                          >
                            + {translate(loc)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Drop-Off Location Input */}
                    <div className="space-y-1.5 pt-2">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {translate('Drop-Off Location')} *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                        <input
                          type="text"
                          required
                          value={dropoffLoc}
                          onChange={(e) => setDropoffLoc(e.target.value)}
                          placeholder={translate('e.g. Kandy City Hotel, Galle Fort')}
                          className="w-full ps-10 pe-4 py-3 bg-slate-50/50 dark:bg-slate-900 border-2 border-sky-100 dark:border-sky-800/60 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA]"
                        />
                      </div>

                      {/* Popular Drop-Off Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase me-1">{translate('Quick Suggestions')}:</span>
                        {POPULAR_DROPOFFS.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setDropoffLoc(loc)}
                            className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer"
                          >
                            + {translate(loc)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Route & Drop-Off Map Preview */}
                    <div className="pt-2">
                      <RouteMapPreview
                        pickupName={pickupLoc}
                        dropoffName={dropoffLoc}
                        onSelectRoute={(p, d) => {
                          setPickupLoc(p);
                          setDropoffLoc(d);
                        }}
                      />
                    </div>

                    {/* Live Telematics Tracker Banner */}
                    <div className="p-4 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl text-white flex items-center justify-between gap-3 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-sky-500/20 rounded-xl text-sky-400 border border-sky-400/30">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                            {translate(`Real-time Chauffeur Telematics`)}
                          </span>
                          <span className="text-xs font-bold text-slate-200 block">
                            {translate(`Live Driver Dispatched & Route Radar`)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTrackingModal(true)}
                        className="px-3.5 py-2 bg-[#0091EA] hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                      >
                        <span>{translate('Launch Live Radar')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* SECTION 2: PASSENGER & DRIVER DETAILS */}
                  <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-sky-200 dark:border-sky-800/80 shadow-sm space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#0091EA]" />
                      <span>{translate('2. Lead Guest & Passenger Details')}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Customer Name */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          {translate('Primary Guest / Lead Name')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder={translate('e.g. Sarah Smith')}
                          className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-900 border-2 border-sky-100 dark:border-sky-800/60 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA]"
                        />
                      </div>

                      {/* Number of Guests / Passengers */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          {translate('Number of Guests / Passengers')} *
                        </label>
                        <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900 border-2 border-sky-100 dark:border-sky-800/60 rounded-xl p-1.5">
                          <button
                            type="button"
                            onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold transition-all cursor-pointer shadow-2xs"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="flex-1 text-center font-black text-xs text-slate-900 dark:text-white">
                            {guestsCount} {translate('Passenger(s)')}
                          </span>

                          <button
                            type="button"
                            onClick={() => setGuestsCount(Math.min(selectedCar.seats, guestsCount + 1))}
                            className="w-8 h-8 rounded-lg bg-[#0091EA] hover:bg-sky-600 text-white flex items-center justify-center font-bold transition-all cursor-pointer shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[9px] text-slate-400 font-semibold mt-1">
                          {translate('Max capacity for vehicle')}: {selectedCar.seats} {translate('Passengers')}
                        </p>
                      </div>
                    </div>



                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          {translate('Contact Phone Number')}
                        </label>
                        <div className="relative">
                          <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="+44 7911 123456"
                            className="w-full ps-10 pe-4 py-3 bg-slate-50/50 dark:bg-slate-900 border-2 border-sky-100 dark:border-sky-800/60 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA]"
                          />
                        </div>
                      </div>

                      {/* Driver's License Country */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          {translate('License Issuing Country')}
                        </label>
                        <div className="relative">
                          <Globe className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={licenseCountry}
                            onChange={(e) => setLicenseCountry(e.target.value)}
                            placeholder={translate(`United Kingdom`)}
                            className="w-full ps-10 pe-4 py-3 bg-slate-50/50 dark:bg-slate-900 border-2 border-sky-100 dark:border-sky-800/60 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA]"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* SECTION 3: RENTAL DATES & SCHEDULE */}
                  <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-sky-200 dark:border-sky-800/80 shadow-sm space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#0091EA]" />
                      <span>{translate('3. Rental Period & Flight Schedule')}</span>
                    </h3>

                    <DateRangePicker
                      startDate={pickupDate}
                      endDate={returnDate}
                      onChange={(start, end) => {
                        setPickupDate(start);
                        if (end) setReturnDate(end);
                      }}
                      startLabel="Pickup Date"
                      endLabel="Return Date"
                      minDate={new Date().toISOString().split('T')[0]}
                    />

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        {translate('Special Requests or Flight Number')} ({translate('Optional')})
                      </label>
                      <textarea
                        rows={2}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder={translate('e.g. Flight QR668 arriving 08:30 AM. Prefer child safety seat.')}
                        className="w-full p-3 bg-slate-50/50 dark:bg-slate-900 border-2 border-sky-100 dark:border-sky-800/60 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA]"
                      />
                    </div>
                  </div>

                </div>

                {/* Right Column: Cost Breakdown & Submit */}
                <div className="space-y-6">
                  
                  {/* Summary Card */}
                  <div className="bg-white dark:bg-slate-950 rounded-3xl border-2 border-sky-300 dark:border-sky-800 p-6 shadow-xl space-y-5 sticky top-24">
                    <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-900">
                      <img 
                        src={selectedCar.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'} 
                        alt={selectedCar.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <span className="absolute bottom-3 start-3 px-3 py-1 bg-[#0091EA] text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow">
                        {translate(selectedCar.category)}
                      </span>
                    </div>

                    <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <h4 className="font-black text-slate-900 dark:text-white text-base">{translate(selectedCar.name)}</h4>
                      <p className="text-xs text-slate-500 font-medium">{translate(selectedCar.description)}</p>
                    </div>

                    {/* Included Services List */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-sky-800 dark:text-sky-300 tracking-wider">{translate('Package Inclusions')}:</p>
                      <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{translate('English Speaking Chauffeur')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{translate('Uncapped Fuel & Highway Tolls')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{translate('Passenger Liability Insurance')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{translate('24/7 Breakdown & Assistance')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financials Calculation */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                        <span>{translate('Daily Rate')}:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{formatPrice(selectedCar.pricePerDay)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                        <span>{translate('Rental Duration')}:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{calculateDays()} {translate('Days')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                        <span>{translate('Guests Count')}:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{guestsCount} {translate('Passengers')}</span>
                      </div>

                      <div className="pt-3 border-t border-sky-200 dark:border-sky-800 flex items-center justify-between">
                        <span className="font-black text-slate-900 dark:text-white uppercase text-xs">{translate('Total Amount')}:</span>
                        <span className="text-xl font-black bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                          {formatPrice(selectedCar.pricePerDay * calculateDays())}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer animate-light-blue-pulse"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{translate('Proceed to Review & Pay')}</span>
                    </button>

                  </div>

                </div>

              </form>
            )}

            {/* Verified Guest Reviews & Ratings Section */}
            <div className="mt-8">
              <VehicleReviews carName={selectedCar.name} />
            </div>

          </div>
        ) : (
          /* STANDARD FLEET LIST CATALOG VIEW */
          <>
            {/* Search & Location Bar */}
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 flex flex-col lg:flex-row items-end justify-between gap-6 text-start animate-blue-glow">
              
              {/* Pickup location */}
              <div className="flex flex-col gap-1.5 flex-grow">
                <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">{translate('Pickup Location')}</label>
                <div className="relative">
                  <MapPin className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0091EA]" />
                  <input
                    type="text"
                    value={pickupLoc}
                    onChange={(e) => setPickupLoc(e.target.value)}
                    className="w-full ps-9 pe-4 py-2.5 bg-white dark:bg-slate-950 border-2 border-sky-200 dark:border-sky-800/80 rounded-xl focus:ring-2 focus:ring-[#0091EA] focus:outline-none text-xs font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="flex flex-col gap-1.5 flex-grow max-w-md">
                <DateRangePicker
                  startDate={pickupDate}
                  endDate={returnDate}
                  onChange={(start, end) => {
                    setPickupDate(start);
                    if (end) setReturnDate(end);
                  }}
                  startLabel="Pickup Date"
                  endLabel="Return Date"
                  minDate={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Category Quick Filter */}
              <div className="flex flex-col gap-1.5 flex-grow max-w-xs">
                <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">{translate('Vehicle Category')}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white dark:bg-slate-950 border-2 border-sky-200 dark:border-sky-800/80 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA]"
                >
                  <option value="All">{translate('All Vehicle Fleet')}</option>
                  <option value="Car">{translate('Sedan / Standard Car')}</option>
                  <option value="Van">{translate('Mini Van & High Roof')}</option>
                  <option value="SUV">{translate('SUV / 4WD Luxury')}</option>
                  <option value="Mini Bus">{translate('Mini Bus / Coaster')}</option>
                  <option value="Luxury Bus">{translate('Luxury Coach / Large Bus')}</option>
                  <option value="Budget">{translate('Budget / Tuk Tuk')}</option>
                </select>
              </div>

            </div>

            {/* Cars Fleet Grid */}
            <div className="mt-8">
              
              {loading && (
                <div className="py-24 text-center text-gray-500 font-medium">{translate('Inspecting premier fleet packages...')}</div>
              )}

              {error && (
                <div className="py-24 text-center text-rose-500 font-semibold">{error}</div>
              )}

              {!loading && !error && cars.length === 0 && (
                <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
                  <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-slate-400 font-bold">{translate('No Vehicle Packages Match Filter')}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{translate('Try querying different categories or resetting filters.')}</p>
                </div>
              )}

              {!loading && !error && cars.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cars.map((car: any) => {
                    const avail = availabilityMap[car.id];
                    const isSoldOut = avail && avail.status === 'sold_out';
                    const isLimited = avail && avail.status === 'limited';

                    return (
                      <div 
                        key={car.id} 
                        onClick={() => handleStartBooking(car)}
                        className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 overflow-hidden shadow-xl shadow-sky-500/10 hover:shadow-2xl hover:shadow-sky-500/20 hover:border-[#0091EA] transition-all duration-300 group flex flex-col text-start h-full relative animate-blue-glow cursor-pointer"
                      >
                        {/* Photo background */}
                        <div className="relative h-[210px] overflow-hidden bg-gray-100 dark:bg-slate-800">
                          <img 
                            src={car.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'} 
                            alt={`${car.name} - Luxury Business Travel & Chauffeur Vehicle Rental`} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />

                          <span className="absolute top-4 start-4 px-3.5 py-1.5 bg-slate-950/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-full border border-sky-400/30 shadow-md">
                            {translate(car.category)}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (addToWishlist) addToWishlist(car);
                            }}
                            className="absolute top-4 end-4 z-10 w-9 h-9 rounded-full bg-slate-950/80 backdrop-blur-md border border-sky-400/30 flex items-center justify-center text-white shadow-lg hover:bg-[#0091EA] hover:text-white transition-all cursor-pointer group/wishlist"
                            aria-label={translate(`Add to wishlist`)}
                          >
                            <Heart className="w-4 h-4 group-hover/wishlist:fill-current" />
                          </button>
                          <div className="absolute top-15 end-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-sky-400/30 text-white shadow-lg">
                            <span className={`w-2 h-2 rounded-full ${
                              isSoldOut ? 'bg-rose-500' : isLimited ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
                            }`} />
                            <span className={`text-[9px] font-black uppercase tracking-wider ${
                              isSoldOut ? 'text-rose-400' : isLimited ? 'text-amber-300' : 'text-emerald-300'
                            }`}>
                              {avail ? translate(avail.badgeText) : translate('Ready for Booking')}
                            </span>
                          </div>

                          <span className="absolute bottom-4 end-4 px-3 py-1.5 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white text-[10px] font-black rounded-xl shadow-lg shadow-sky-500/30">
                            {formatPrice(car.pricePerDay)} / {translate('day')}
                          </span>
                        </div>

                        {/* Body details */}
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-[#0091EA] transition-colors">{translate(car.name)}</h3>
                          
                          <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-700 dark:text-slate-300 font-bold">
                            <span className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 border border-sky-100 dark:border-sky-800/50 px-3 py-1.5 rounded-xl">
                              <Users className="w-3.5 h-3.5 text-[#0091EA]" />
                              {car.seats} {translate('Passengers')}
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 border border-sky-100 dark:border-sky-800/50 px-3 py-1.5 rounded-xl">
                              <Settings className="w-3.5 h-3.5 text-[#0091EA]" />
                              {translate(car.transmission)}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-3.5 leading-relaxed font-medium">
                            {translate(car.description || 'Includes professional English-speaking driver, fuel, highway tolls, passenger liability insurance, and 24/7 breakdown support.')}
                          </p>

                          {/* Inclusions list */}
                          {car.features && Array.isArray(car.features) && car.features.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-sky-100 dark:border-sky-800/40">
                              <p className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider mb-2">{translate('Package Inclusions')}:</p>
                              <div className="grid grid-cols-1 gap-1.5">
                                {car.features.map((feat: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-200 font-semibold">
                                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span>{translate(feat)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Bottom bar */}
                          <div className="mt-6 pt-4 border-t border-sky-200/60 dark:border-sky-800/50 flex items-center justify-between mt-auto">
                            <div>
                              <span className="text-[9px] font-black text-sky-800 dark:text-sky-300 uppercase">{translate('Package Rate')}</span>
                              <p className="text-lg font-black bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 bg-clip-text text-transparent mt-0.5">
                                {formatPrice(car.pricePerDay)} <span className="text-[10px] font-bold text-slate-500">{translate('per day')}</span>
                              </p>
                            </div>

                            <button
                              disabled={isSoldOut}
                              onClick={() => handleStartBooking(car)}
                              className={`text-xs font-black uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-lg cursor-pointer ${
                                isSoldOut 
                                  ? 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                                  : 'bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-500 text-white shadow-sky-500/25 animate-light-blue-pulse'
                              }`}
                            >
                              {isSoldOut ? translate('Rented Out') : translate('Book Vehicle Package')}
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {selectedCar && (
        <BookingConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onPaymentSuccess={(data) => {
            setShowConfirmModal(false);
            setBookingSuccess(true);
            const ref = typeof data === 'string' ? data : (data?.bookingRef || bookingRef || 'CAR-' + Math.random().toString(36).substring(2, 9).toUpperCase());
            setBookingRef(ref);
            confetti({
              particleCount: 140,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#0091EA', '#00E676', '#FFD600', '#FF1744', '#AA00FF']
            });
            handleOpenCarPdfVoucher(ref);
          }}
          bookingType="car"
          title={translate(selectedCar.name)}
          subtitle={`${translate(selectedCar.category)} • ${translate(selectedCar.transmission)}`}
          dates={{ start: pickupDate, end: returnDate, days: calculateDays() }}
          travelers={guestsCount}
          pricePerUnit={selectedCar.pricePerDay}
          priceLabel="per day"
          totalCost={selectedCar.pricePerDay * calculateDays()}
          passengerDetails={{ name: customerName, email: contactEmail || currentUser?.email || '', phone: contactPhone || userProfile?.phone || '' }}
          bookingData={{
            carId: selectedCar.id,
            pickupDate,
            returnDate,
            pickupLocation: pickupLoc,
            dropoffLocation: dropoffLoc
          }}
          currentUser={currentUser}
        />
      )}

      {/* PDF Voucher Render Modal */}
      <BookingPDFModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        booking={pdfVoucherData}
      />

      {/* Live Order Telematics Tracking Modal */}
      <OrderTrackingModal
        isOpen={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
        bookingRef={bookingRef || 'CAR-8921A'}
        carName={selectedCar?.name || 'Mercedes Benz S-Class AMG'}
        customerName={customerName || userProfile?.fullName || 'Valued Traveler'}
        pickupLocation={pickupLoc}
        dropoffLocation={dropoffLoc}
      />

    </div>
  );
}
