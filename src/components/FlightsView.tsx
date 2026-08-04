import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  ChevronRight, 
  Check, 
  Ticket, 
  ShieldCheck, 
  Luggage,
  Clock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Flight } from '../types.ts';
import DatePicker from './DatePicker.tsx';
import DateRangePicker from './DateRangePicker.tsx';
import BookingConfirmationModal from './BookingConfirmationModal.tsx';
import BookingProgressBar from './BookingProgressBar.tsx';
import { useLanguage } from '../lib/i18n.tsx';
import { useCurrency } from '../lib/CurrencyContext.tsx';

interface FlightsViewProps {
  initialQuery?: { from: string; to: string };
  currentUser?: any;
  userProfile?: any;
  onOpenAuth?: () => void;
  onNavigate?: (page: string) => void;
}

export default function FlightsView({ 
  initialQuery,
  currentUser,
  userProfile,
  onOpenAuth,
  onNavigate
}: FlightsViewProps) {
  const { translate } = useLanguage();
  const { formatPrice, currency } = useCurrency();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Flight search form state
  const [fromCity, setFromCity] = useState(initialQuery?.from || '');
  const [toCity, setToCity] = useState(initialQuery?.to || '');
  const [depDate, setDepDate] = useState('2026-08-01');
  const [retDate, setRetDate] = useState('2026-08-10');
  const [passengersCount, setPassengersCount] = useState(2);
  const [cabinClass, setCabinClass] = useState('Economy');

  // Booking states
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Sync profile details to form when loaded
  useEffect(() => {
    if (userProfile) {
      setPassengerName(userProfile.fullName || '');
      setPassengerPhone(userProfile.phone || '');
    }
    if (currentUser?.email) {
      setPassengerEmail(currentUser.email);
    }
  }, [currentUser, userProfile]);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    setError('');
    try {
      let url = '/api/flights';
      const params = [];
      if (fromCity.trim() !== '') params.push(`fromCity=${encodeURIComponent(fromCity)}`);
      if (toCity.trim() !== '') params.push(`toCity=${encodeURIComponent(toCity)}`);
      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setFlights(data);
      } else {
        setError(translate('Failed to fetch scheduled flights.'));
      }
    } catch (err) {
      console.error(err);
      setError(translate('An error occurred while loading flight schedule.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFlights();
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlight) return;

    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmAndBookFlight = async () => {
    if (!selectedFlight) return;
    setBookingSubmitting(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/flight-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          flightId: selectedFlight.id,
          passengerName,
          email: passengerEmail,
          phone: passengerPhone
        })
      });
      if (res.ok) {
        const data = await res.json();
        setBookingConfirmation({
          bookingId: `PTF-${1200 + selectedFlight.id}`,
          flight: selectedFlight,
          passenger: { name: passengerName, email: passengerEmail, phone: passengerPhone },
          cabin: cabinClass,
          passengers: passengersCount,
          date: depDate
        });
        setShowConfirmModal(false);
        // Reset
        setPassengerName('');
        setPassengerEmail('');
        setPassengerPhone('');
        
        // Trigger celebratory confetti animation
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0091EA', '#00E676', '#FFD600', '#FF1744', '#AA00FF']
        });
      } else {
        alert(translate('Booking failed. Please try again.'));
      }
    } catch (err) {
      console.error(err);
      alert(translate('An error occurred while placing your booking.'));
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div id="flights-view" className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pb-20 transition-colors">
      
      {/* Header banner */}
      <div className="relative rounded-b-[40px] text-white py-16 px-6 border-b-2 border-sky-400/40 text-center overflow-hidden shadow-2xl animate-blue-glow mb-8 bg-slate-950">
        {/* Background Aviation Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80" 
            alt="Premier Aviation" 
            className="w-full h-full object-cover scale-105 filter brightness-90 transform transition-transform duration-1000 hover:scale-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/50 via-transparent to-cyan-950/50" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none z-0" />
        
        <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sky-500/30 animate-light-blue-pulse">
            <Plane className="w-3.5 h-3.5 text-white animate-pulse" />
            {translate('Premier Aviation Schedules')}
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
            <span className="bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent">{translate('Flight Search')}</span>
          </h1>
          <p className="text-xs md:text-sm text-sky-100/90 font-medium max-w-md mx-auto leading-relaxed">
            {translate('Compare international flights and reserve your premium cabin seats seamlessly.')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Visual Progress Bar Component */}
        <BookingProgressBar
          currentStep={bookingConfirmation ? 4 : selectedFlight ? 2 : 1}
          type="flight"
          onStepClick={(stepNum) => {
            if (stepNum === 1) {
              setSelectedFlight(null);
              setBookingConfirmation(null);
            }
          }}
        />

        {/* Dynamic Booking confirmation view */}
        {bookingConfirmation ? (
          <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden p-6 text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{translate('Flight Seat Confirmed!')}</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">{translate('Your boarding itinerary has been registered. We have sent tickets to your email address.')}</p>
            </div>

            {/* Simulated Boarding Pass */}
            <div className="border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl p-4 bg-gray-50/80 dark:bg-slate-950 text-start space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-dashed border-gray-200 dark:border-slate-800 pb-3 font-mono">
                <span>{translate('PREMIER BOARDING PASS')}</span>
                <span className="font-bold text-[#0091EA]">{bookingConfirmation.bookingId}</span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{translate('Origin')}</span>
                  <h4 className="text-sm font-extrabold text-gray-800 dark:text-slate-200 mt-0.5">{bookingConfirmation.flight.fromCity}</h4>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className="text-end">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{translate('Destination')}</span>
                  <h4 className="text-sm font-extrabold text-gray-800 dark:text-slate-200 mt-0.5">{bookingConfirmation.flight.toCity}</h4>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2 border-t border-gray-100 dark:border-slate-800">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{translate('Passenger')}</span>
                  <p className="text-gray-800 dark:text-slate-200 mt-0.5 truncate">{bookingConfirmation.passenger.name}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{translate('Airline')}</span>
                  <p className="text-gray-800 dark:text-slate-200 mt-0.5">{bookingConfirmation.flight.airline}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{translate('Departure Time')}</span>
                  <p className="text-gray-800 dark:text-slate-200 mt-0.5">{bookingConfirmation.flight.departureTime}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{translate('Class / Seats')}</span>
                  <p className="text-gray-800 dark:text-slate-200 mt-0.5">{translate(bookingConfirmation.cabin)} ({bookingConfirmation.passengers} {translate('pax')})</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setBookingConfirmation(null)}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all"
            >
              {translate('Search More Flights')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Col: Search filters Form */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-6 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 text-start animate-blue-glow">
                <h3 className="font-black text-slate-900 dark:text-slate-100 text-base mb-4 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-[#0091EA]" />
                  <span className="bg-gradient-to-r from-slate-900 via-sky-900 to-[#0091EA] dark:from-white dark:via-sky-200 dark:to-cyan-300 bg-clip-text text-transparent">
                    {translate('Flight Search')}
                  </span>
                </h3>

                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  
                  {/* From */}
                  <div>
                    <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">{translate('From City/Airport')}</label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0091EA]" />
                      <input
                        type="text"
                        placeholder={translate('e.g. London (LHR)')}
                        value={fromCity}
                        onChange={(e) => setFromCity(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border-2 border-sky-200 dark:border-sky-800/80 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-[#0091EA] focus:outline-none text-xs text-slate-800 dark:text-slate-200 font-medium"
                      />
                    </div>
                  </div>

                  {/* To */}
                  <div>
                    <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">{translate('To City/Airport')}</label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0091EA]" />
                      <input
                        type="text"
                        placeholder={translate('e.g. Maldives (MLE)')}
                        value={toCity}
                        onChange={(e) => setToCity(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border-2 border-sky-200 dark:border-sky-800/80 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-[#0091EA] focus:outline-none text-xs text-slate-800 dark:text-slate-200 font-medium"
                      />
                    </div>
                  </div>

                  {/* Date fields */}
                  <div>
                    <DateRangePicker
                      startDate={depDate}
                      endDate={retDate}
                      onChange={(start, end) => {
                        setDepDate(start);
                        if (end) setRetDate(end);
                      }}
                      startLabel="Departure"
                      endLabel="Return"
                      minDate={new Date().toISOString().split('T')[0]}
                      compact
                    />
                  </div>

                  {/* Passengers & Class */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">{translate('Passengers')}</label>
                      <input
                        type="number"
                        min="1"
                        max="9"
                        value={passengersCount}
                        onChange={(e) => setPassengersCount(parseInt(e.target.value, 10))}
                        className="w-full mt-1 px-3 py-2 border-2 border-sky-200 dark:border-sky-800/80 bg-white dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">{translate('Cabin Class')}</label>
                      <select
                        value={cabinClass}
                        onChange={(e) => setCabinClass(e.target.value)}
                        className="w-full mt-1 px-3 py-2.5 border-2 border-sky-200 dark:border-sky-800/80 bg-white dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-bold"
                      >
                        <option value="Economy">{translate('Economy')}</option>
                        <option value="Premium">{translate('Premium')}</option>
                        <option value="Business">{translate('Business')}</option>
                        <option value="First">{translate('First')}</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/25 animate-light-blue-pulse cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    {translate('Query Flight Schedule')}
                  </button>

                </form>
              </div>

              {/* Luggage assistance info */}
              <div className="bg-gradient-to-br from-white via-sky-50/30 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-5 rounded-2xl border-2 border-sky-100 dark:border-sky-900/40 text-start space-y-2.5 shadow-sm">
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <Luggage className="w-4 h-4 text-[#0091EA]" />
                  {translate('Baggage Allowances')}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {translate('All international departures hosted by Premier Tour include 1 cabin carry-on (up to 8kg) and 1 checked suitcase (up to 23kg) at no extra charge.')}
                </p>
              </div>
            </div>

            {/* Right Col: Active lists or Passenger booking form */}
            <div className="md:col-span-2 space-y-6">
              
             {selectedFlight ? (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg text-start">
                  
                  {/* Cancel / Back to results */}
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4 mb-6">
                    <div>
                      <span className="text-[10px] font-bold text-[#0091EA] uppercase tracking-wider">{translate('Reviewing Flight Details')}</span>
                      <h3 className="font-extrabold text-slate-800 dark:text-white text-base">{translate('Passenger Registration')}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedFlight(null)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-800 dark:hover:text-white border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850"
                    >
                      {translate('Change Flight')}
                    </button>
                  </div>

                  {/* Selected Flight Details Summary */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 bg-[#0091EA] text-white text-[9px] font-bold rounded">{selectedFlight.airline}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{formatPrice(selectedFlight.price * passengersCount)} {translate('Total')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold pt-1">
                      <span>{selectedFlight.fromCity}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>{selectedFlight.toCity}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">{translate('Schedule:')} {selectedFlight.departureTime} → {selectedFlight.arrivalTime} • {selectedFlight.stops} {translate('Stops')}</p>
                  </div>

                  {/* Passenger Details form */}
                  <form onSubmit={handleBookSubmit} className="space-y-4">
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate('Primary Passenger Name')}</label>
                      <input
                        type="text"
                        required
                        placeholder={translate(`Sarah Smith`)}
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-[#0091EA] focus:outline-none text-sm mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate('Passenger Email')}</label>
                        <input
                          type="email"
                          required
                          placeholder="sarah@example.com"
                          value={passengerEmail}
                          onChange={(e) => setPassengerEmail(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-[#0091EA] focus:outline-none text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{translate('Mobile Phone')}</label>
                        <input
                          type="tel"
                          required
                          placeholder="+44 7911 123456"
                          value={passengerPhone}
                          onChange={(e) => setPassengerPhone(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-[#0091EA] focus:outline-none text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button
                        type="submit"
                        disabled={bookingSubmitting}
                        className="flex items-center gap-1.5 bg-[#0091EA] hover:bg-[#007cc7] text-white font-bold px-8 py-3.5 rounded-xl text-xs transition-colors shadow-lg shadow-[#0091EA]/10"
                      >
                        <Ticket className="w-4 h-4" />
                        {bookingSubmitting ? translate('Securing Flight Seats...') : translate('Place Secure Flight Booking')}
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  {loading && (
                    <div className="py-24 text-center text-gray-500 font-medium">{translate('Scanning international skies...')}</div>
                  )}

                  {error && (
                    <div className="py-24 text-center text-rose-500 font-semibold">{error}</div>
                  )}

                  {!loading && !error && flights.length === 0 && (
                    <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
                      <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-slate-400 font-bold">{translate('No Flights Found matching criteria')}</p>
                    </div>
                  )}

                  {!loading && !error && flights.length > 0 && (
                    <div className="space-y-4">
                      <div className="text-start">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{translate('Available Flight Schedules')} ({flights.length})</h4>
                      </div>

                      {flights.map((flight) => (
                        <div 
                          key={flight.id} 
                          onClick={() => setSelectedFlight(flight)}
                          className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/60 hover:border-[#0091EA] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 shadow-lg shadow-sky-500/10 hover:shadow-xl hover:shadow-sky-500/20 hover:-translate-y-1 text-start animate-blue-glow group cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 bg-gradient-to-tr from-[#0091EA] via-sky-500 to-cyan-400 text-white rounded-2xl flex items-center justify-center shadow-md shadow-sky-500/30 shrink-0">
                              <Plane className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#0091EA] transition-colors">{flight.airline}</h4>
                              <p className="text-[10px] text-sky-700 dark:text-sky-300 font-extrabold mt-0.5 uppercase tracking-wider">{flight.fromCity} - {flight.toCity}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedFlight(flight)}
                            className="bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-500 text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-lg shadow-sky-500/25 animate-light-blue-pulse flex items-center gap-1 cursor-pointer">
                              {translate('Select Seat')}
                              <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {selectedFlight && (
        <BookingConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onPaymentSuccess={(booking) => {
            setShowConfirmModal(false);
            setPassengerName('');
            setPassengerEmail('');
            setPassengerPhone('');
            if (onNavigate) {
              onNavigate('account-bookings');
            }
          }}
          bookingType="flight"
          title={`${selectedFlight.airline} ${selectedFlight.flightNumber}`}
          subtitle={`${selectedFlight.fromCity} (${selectedFlight.fromCode}) to ${selectedFlight.toCity} (${selectedFlight.toCode})`}
          dates={{ start: depDate, end: retDate }}
          travelers={passengersCount}
          pricePerUnit={selectedFlight.price}
          priceLabel={`${cabinClass} Cabin`}
          totalCost={selectedFlight.price * passengersCount}
          passengerDetails={{ name: passengerName, email: passengerEmail, phone: passengerPhone }}
          bookingData={{
            flightId: selectedFlight.id
          }}
          currentUser={currentUser}
        />
      )}

    </div>
  );
}
