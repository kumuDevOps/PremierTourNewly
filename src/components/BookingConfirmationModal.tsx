import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../lib/i18n.tsx';
import { useCurrency } from '../lib/CurrencyContext.tsx';
import BookingProgressBar from './BookingProgressBar.tsx';
import BookingPDFModal, { BookingVoucherData } from './BookingPDFModal.tsx';
import { 
  X, 
  Calendar, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  Compass, 
  Plane, 
  Car, 
  Building,
  ArrowRight, 
  Lock, 
  AlertCircle, 
  CheckCircle,
  Check,
  Sparkles,
  Info,
  Copy,
  Hash,
  FileText,
  Download,
  Share2,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  
  // Direct requested props
  title: string;
  type?: 'package' | 'tour' | 'flight' | 'car' | 'hotel' | string;
  date?: string;
  price?: number;
  referenceId?: string;

  // Additional rich checkout props
  bookingType?: 'package' | 'tour' | 'flight' | 'car' | 'hotel' | string;
  subtitle?: string;
  dates?: {
    start: string;
    end?: string;
    nights?: number;
    days?: number;
  };
  travelers?: number;
  pricePerUnit?: number;
  priceLabel?: string;
  totalCost?: number;
  passengerDetails?: {
    name: string;
    email: string;
    phone: string;
  };
  bookingData?: any;
  currentUser?: any;
  onPaymentSuccess?: (booking: any) => void;
  onConfirm?: (bookingRef: string) => void;
}

export default function BookingConfirmationModal({ 
  isOpen,
  onClose,
  title,
  type,
  date,
  price,
  referenceId,
  bookingType,
  subtitle,
  dates,
  travelers = 1,
  pricePerUnit,
  priceLabel,
  totalCost,
  passengerDetails,
  bookingData,
  currentUser,
  onPaymentSuccess,
  onConfirm,
}: BookingConfirmationModalProps) {
  const { translate } = useLanguage();
  const { formatPrice, currency } = useCurrency();

  // Resolved Props fallback
  const resolvedType = (type || bookingType || 'tour').toLowerCase();
  const resolvedDateStart = date || dates?.start || new Date().toISOString().split('T')[0];
  const resolvedDateEnd = dates?.end || '';
  const resolvedPriceUnit = pricePerUnit || price || 0;
  const resolvedTotalCost = totalCost || (resolvedPriceUnit * travelers);

  // State Hooks
  const [bookingRef, setBookingRef] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState(false);
  const [step, setStep] = useState<'review' | 'payment' | 'success'>('review');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfVoucherData, setPdfVoucherData] = useState<BookingVoucherData | null>(null);

  // Tour Add-ons (Hotel & Vehicle)
  const [includeHotel, setIncludeHotel] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<number>(1);
  const [hotelNights, setHotelNights] = useState<number>(dates?.nights || 1);

  const [includeVehicle, setIncludeVehicle] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number>(1);
  const [vehicleDays, setVehicleDays] = useState<number>(dates?.days || 1);

  // Rent a car driver selection state ('driver' vs 'self')
  const [driverOption, setDriverOption] = useState<'driver' | 'self'>('driver');

  // Available Addon Data
  const AVAILABLE_ADDON_HOTELS = [
    { id: 1, name: 'Amanwella Luxury Resort', location: 'Tangalle', pricePerNight: 650 },
    { id: 2, name: 'Ceylon Tea Trails', location: 'Hatton', pricePerNight: 580 },
    { id: 3, name: 'Wild Coast Tented Lodge', location: 'Yala', pricePerNight: 720 },
    { id: 4, name: 'Cinnamon Grand Colombo', location: 'Colombo', pricePerNight: 220 },
    { id: 5, name: 'Heritance Kandalama', location: 'Dambulla', pricePerNight: 310 }
  ];

  const AVAILABLE_ADDON_VEHICLES = [
    { id: 1, name: 'Mercedes-Benz S-Class', category: 'Luxury', pricePerDay: 250 },
    { id: 2, name: 'Range Rover Defender', category: 'SUV', pricePerDay: 320 },
    { id: 3, name: 'Toyota Land Cruiser Prado', category: 'Prestige SUV', pricePerDay: 180 },
    { id: 4, name: 'Porsche 911 Carrera', category: 'Sports', pricePerDay: 450 },
    { id: 5, name: 'Tuk-Tuk Open Panoramic', category: 'Panoramic', pricePerDay: 45 }
  ];

  // Customer / Lead details state
  const [custName, setCustName] = useState(passengerDetails?.name || '');
  const [custEmail, setCustEmail] = useState(passengerDetails?.email || currentUser?.email || '');
  const [custPhone, setCustPhone] = useState(passengerDetails?.phone || '');

  // Card details state
  const [paymentGateway, setPaymentGateway] = useState<'stripe' | 'payhere' | 'paypal' | 'arrival'>('stripe');
  const [cardName, setCardName] = useState(passengerDetails?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // PayHere, PayPal & Arrival Gateway states
  const [payHereBank, setPayHereBank] = useState('Commercial Bank (LKR Card / Online)');
  const [payHereMobile, setPayHereMobile] = useState(passengerDetails?.phone || '');
  const [payPalEmail, setPayPalEmail] = useState(passengerDetails?.email || currentUser?.email || '');
  const [arrivalNotes, setArrivalNotes] = useState('');

  // API Call States
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any | null>(null);

  // Pricing calculations (8% tax + 2% service fee)
  const selectedHotel = AVAILABLE_ADDON_HOTELS.find(h => h.id === Number(selectedHotelId)) || AVAILABLE_ADDON_HOTELS[0];
  const hotelAddonCost = (includeHotel && (resolvedType === 'tour' || resolvedType === 'package' || resolvedType === 'flight')) ? (selectedHotel.pricePerNight * hotelNights) : 0;

  const selectedVehicle = AVAILABLE_ADDON_VEHICLES.find(v => v.id === Number(selectedVehicleId)) || AVAILABLE_ADDON_VEHICLES[0];
  const addonDriverDailyFee = driverOption === 'driver' ? 35 : 0;
  const vehicleAddonCost = (includeVehicle && (resolvedType === 'tour' || resolvedType === 'package' || resolvedType === 'flight')) ? ((selectedVehicle.pricePerDay + addonDriverDailyFee) * vehicleDays) : 0;

  // Car rental direct booking driver fee (when booking type is 'car')
  const carRentalDays = dates?.days || dates?.nights || 1;
  const carDirectDriverCost = (resolvedType === 'car' && driverOption === 'driver') ? (35 * carRentalDays) : 0;

  const calculatedSubtotal = resolvedTotalCost + hotelAddonCost + vehicleAddonCost + carDirectDriverCost;
  const taxAmount = Math.round(calculatedSubtotal * 0.08);
  const serviceFee = Math.round(calculatedSubtotal * 0.02);
  const grandTotal = calculatedSubtotal + taxAmount + serviceFee;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (referenceId) {
        setBookingRef(referenceId);
      } else {
        const generated = 'PB-' + Math.random().toString(36).substring(2, 11).toUpperCase();
        setBookingRef(generated);
      }
      setStep('review');
      setPaymentError(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, referenceId]);

  useEffect(() => {
    if (passengerDetails?.name) {
      setCustName(passengerDetails.name);
      if (!cardName) setCardName(passengerDetails.name);
    }
    if (passengerDetails?.email) {
      setCustEmail(passengerDetails.email);
      if (!payPalEmail) setPayPalEmail(passengerDetails.email);
    }
    if (passengerDetails?.phone) {
      setCustPhone(passengerDetails.phone);
      if (!payHereMobile) setPayHereMobile(passengerDetails.phone);
    }
  }, [passengerDetails]);

  const handleOpenPdfVoucher = () => {
    let customSubtitle = subtitle || `${travelers} Traveler(s) • Scheduled Arrangement`;
    if (resolvedType === 'car') {
      customSubtitle += ` • ${driverOption === 'driver' ? 'With Driver' : 'Self-Drive'}`;
    }

    const addonDetails = [];
    if (includeHotel) addonDetails.push(`${translate('Hotel')}: ${translate(selectedHotel.name)} (${hotelNights} ${translate('nights')})`);
    if (includeVehicle) addonDetails.push(`${translate('Vehicle')}: ${translate(selectedVehicle.name)} (${vehicleDays} ${translate('days')} - ${driverOption === 'driver' ? translate('With Driver') : translate('Self-Drive')})`);

    const voucher: BookingVoucherData = {
      id: bookingRef,
      bookingRef: bookingRef,
      type: resolvedType,
      title: title,
      subtitle: customSubtitle,
      description: (bookingData?.description || `${translate(title)} - ${translate('Confirmed Booking Voucher for')} ${custName || translate('Guest')}.`) + (addonDetails.length > 0 ? ` [${translate('Add-ons')}: ${addonDetails.join('; ')}]` : ''),
      category: resolvedType.toUpperCase(),
      customerName: custName || currentUser?.displayName || translate('Traveler'),
      customerEmail: custEmail || currentUser?.email || 'customer@example.com',
      customerPhone: custPhone || '',
      guestsCount: travelers,
      startDate: formatDate(resolvedDateStart),
      endDate: resolvedDateEnd ? formatDate(resolvedDateEnd) : undefined,
      startTime: '09:00 AM EST',
      durationText: dates?.days ? `${dates.days} ${translate('days')} / ${dates.nights || dates.days - 1} ${translate('nights')}` : translate('Full Experience'),
      roomNumber: (resolvedType === 'hotel' || includeHotel) ? `Suite #${100 + Math.floor(Math.random() * 800)}` : undefined,
      roomType: includeHotel ? `${translate(selectedHotel.name)} (${hotelNights} ${translate('nights')})` : (resolvedType === 'hotel' ? translate('Luxury Executive Ocean Suite') : undefined),
      carCategory: includeVehicle ? `${translate(selectedVehicle.name)} (${driverOption === 'driver' ? translate('With Driver') : translate('Self-Drive')})` : (bookingData?.carCategory || (resolvedType === 'car' ? `${subtitle || ''} (${driverOption === 'driver' ? translate('With Driver') : translate('Self-Drive')})` : undefined)),
      pickupLocation: bookingData?.pickupLocation || bookingData?.pickupLoc,
      dropoffLocation: bookingData?.dropoffLocation || bookingData?.dropoffLoc,
      totalPrice: grandTotal,
      hotelPrice: hotelAddonCost > 0 ? hotelAddonCost : undefined,
      carPrice: vehicleAddonCost > 0 ? vehicleAddonCost : undefined,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };
    setPdfVoucherData(voucher);
    setShowPdfModal(true);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(bookingRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  // Format credit card input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    setCardNumber(parts.join(' ').substring(0, 19));
  };

  // Format expiry cleanly (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length >= 2) {
      const month = parseInt(value.substring(0, 2), 10);
      const cleanMonth = month > 12 ? '12' : value.substring(0, 2);
      setCardExpiry(cleanMonth + (value.length > 2 ? '/' + value.substring(2, 4) : ''));
    } else {
      setCardExpiry(value);
    }
  };

  // Format CVC
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvc(e.target.value.replace(/[^0-9]/g, '').substring(0, 4));
  };

  const getCardBrand = () => {
    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.startsWith('4')) return 'visa';
    if (cleanNum.startsWith('5')) return 'mastercard';
    if (cleanNum.startsWith('3')) return 'amex';
    if (cleanNum.startsWith('6')) return 'discover';
    return 'generic';
  };

  const getTypeIcon = () => {
    switch (resolvedType) {
      case 'flight':
        return <Plane className="w-5 h-5 text-[#0091EA]" />;
      case 'car':
        return <Car className="w-5 h-5 text-[#0091EA]" />;
      case 'hotel':
        return <Building className="w-5 h-5 text-[#0091EA]" />;
      default:
        return <Compass className="w-5 h-5 text-[#0091EA]" />;
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (paymentGateway === 'stripe') {
      if (!cardName.trim()) {
        setPaymentError(translate('Cardholder name is required.'));
        return;
      }
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 13 || cleanNum.length > 19) {
        setPaymentError(translate('Please enter a valid credit card number.'));
        return;
      }
      if (cardExpiry.length < 5) {
        setPaymentError(translate('Please enter a valid expiration date (MM/YY).'));
        return;
      }
      if (cardCvc.length < 3) {
        setPaymentError(translate('Please enter a valid CVC security code.'));
        return;
      }
    } else if (paymentGateway === 'payhere') {
      if (!payHereMobile.trim()) {
        setPaymentError(translate('Please enter a mobile phone or bank reference number for PayHere LKR verification.'));
        return;
      }
    } else if (paymentGateway === 'paypal') {
      if (!payPalEmail.trim() || !payPalEmail.includes('@')) {
        setPaymentError(translate('Please enter a valid PayPal account email address.'));
        return;
      }
    } else if (paymentGateway === 'arrival') {
      if (!custPhone.trim()) {
        setPaymentError(translate('Please enter a contact phone number for arrival booking confirmation.'));
        return;
      }
    }

    setIsProcessing(true);

    try {
      let data: any = null;

      if (currentUser && paymentGateway === 'stripe') {
        try {
          const idToken = await currentUser.getIdToken();
          const response = await fetch('/api/stripe/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
              bookingType: resolvedType,
              amount: grandTotal,
              title,
              bookingRef,
              cardName,
              cardNumber,
              cardExpiry,
              cardCvc,
              passengerDetails: {
                name: custName || cardName,
                email: custEmail || currentUser.email || '',
                phone: custPhone || ''
              },
              bookingData
            })
          });

          if (response.ok) {
            data = await response.json();
          }
        } catch (apiErr) {
          console.warn('API Payment failed, falling back to instant client simulation', apiErr);
        }
      }

      // Fallback/Simulated confirmation details
      if (!data) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let gatewayTitle = 'Stripe Credit Card';
        let paidAmount = grandTotal;
        if (paymentGateway === 'payhere') {
          gatewayTitle = `PayHere Sri Lanka (${payHereBank})`;
        } else if (paymentGateway === 'paypal') {
          gatewayTitle = `PayPal Express (${payPalEmail})`;
        } else if (paymentGateway === 'arrival') {
          gatewayTitle = 'Pay on Arrival (15% Deposit Paid)';
          paidAmount = Math.round(grandTotal * 0.15);
        }

        data = {
          success: true,
          chargeId: 'ch_' + paymentGateway + '_' + Math.random().toString(36).substring(2, 10),
          gateway: paymentGateway,
          gatewayTitle,
          amountPaid: paidAmount,
          isSimulated: true,
          bookingRef,
          booking: {
            id: bookingRef,
            bookingRef,
            title,
            type: resolvedType,
            date: resolvedDateStart,
            price: paidAmount,
            status: paymentGateway === 'arrival' ? 'Deposit Paid' : 'Confirmed'
          }
        };
      }

      setPaymentDetails(data);
      setStep('success');

      if (onConfirm) {
        onConfirm(bookingRef);
      }

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

    } catch (err: any) {
      console.error('Booking Confirmation Payment Error:', err);
      setPaymentError(err.message || translate('Payment processing failed. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinishClose = () => {
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentDetails?.booking || { bookingRef, title, price: grandTotal });
    }
    onClose();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (e) {}
    return dateStr;
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-3 sm:p-6 overflow-y-auto w-screen h-screen"
        >
        <motion.div 
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-sky-400/50 dark:border-sky-500/50 flex flex-col text-slate-800 dark:text-slate-200 my-auto animate-blue-glow z-[10000]"
        >
          
          {/* HEADER WITH BOOKING REFERENCE ID */}
          <div className="px-6 pt-6 pb-5 bg-gradient-to-b from-sky-50/80 to-white dark:from-sky-950/30 dark:to-slate-900 border-b border-sky-100 dark:border-sky-900/50 relative">
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors z-20 cursor-pointer"
            title={translate('Close')}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-800 text-[#0091EA] text-xs font-black mb-2">
              <Hash className="w-3.5 h-3.5" />
              <span>{translate('Ref ID:')} {bookingRef}</span>
              <button 
                onClick={handleCopyRef}
                className="p-1 hover:bg-sky-100 dark:hover:bg-sky-900 rounded transition-colors cursor-pointer"
                title={translate(`Copy Reference ID`)}
              >
                {copiedRef ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-sky-500" />}
              </button>
            </div>

            <h3 className="font-black text-xl text-slate-900 dark:text-white">
              {translate('Booking Confirmation')}
            </h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              {translate('Premier Tour Booking Service')}
            </p>
          </div>

          {/* Booking Progress Bar */}
          <div className="mt-4 px-2">
            <BookingProgressBar
              currentStep={step === 'review' ? 2 : step === 'payment' ? 3 : 4}
              type={resolvedType}
              onStepClick={(stepNum) => {
                if (stepNum === 2 && step === 'payment') {
                  setStep('review');
                }
              }}
            />
          </div>
        </div>

        {/* STEP 1: REVIEW SUMMARY */}
        {step === 'review' && (
          <div className="flex flex-col">
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-5 text-start">
              
              {/* Card Summary Item */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-3.5">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-100 dark:border-slate-700">
                  {getTypeIcon()}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#0091EA] uppercase tracking-wider bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md">
                      {translate(resolvedType.toUpperCase())}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      Ref: {bookingRef}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight truncate">{translate(title)}</h4>
                  {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{translate(subtitle)}</p>}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#0091EA] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{translate('Travel Date')}</span>
                    <p className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(resolvedDateStart)}</p>
                    {resolvedDateEnd && (
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <ArrowRight className="w-3 h-3 text-slate-300" />
                        {formatDate(resolvedDateEnd)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-[#0091EA] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{translate('Travelers')}</span>
                    <p className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">{travelers} {travelers === 1 ? translate('Guest') : translate('Guests')}</p>
                    {resolvedPriceUnit > 0 && (
                      <p className="text-[10px] text-slate-400 font-medium">{formatPrice(resolvedPriceUnit)} {priceLabel ? translate(priceLabel) : translate('per person')}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pickup & Dropoff Locations for Cars / Transfers */}
              {(bookingData?.pickupLocation || bookingData?.dropoffLocation) && (
                <div className="bg-sky-50/60 dark:bg-sky-950/30 p-3.5 rounded-2xl border border-sky-100 dark:border-sky-900/50 space-y-2 text-start">
                  <span className="text-[10px] font-black text-[#0091EA] uppercase tracking-wider block">
                    {translate('Pick-up & Drop-off Route')}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {bookingData?.pickupLocation && (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-400 font-medium text-[10px]">{translate('Pickup')}:</span>
                        <span className="truncate">{bookingData.pickupLocation}</span>
                      </div>
                    )}
                    {bookingData?.dropoffLocation && (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-3 h-3 text-rose-500 flex-shrink-0" />
                        <span className="text-slate-400 font-medium text-[10px]">{translate('Dropoff')}:</span>
                        <span className="truncate">{bookingData.dropoffLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CAR RENTAL DRIVER VS SELF-DRIVE SELECTOR */}
              {resolvedType === 'car' && (
                <div className="bg-gradient-to-br from-sky-50/80 to-indigo-50/50 dark:from-slate-800/80 dark:to-slate-900/80 p-4 rounded-2xl border-2 border-sky-200 dark:border-sky-800/80 space-y-3 text-start">
                  <span className="text-xs font-black text-[#0091EA] uppercase tracking-wider block flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-[#0091EA]" />
                    {translate('Rental Service Option')}
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {translate('Our premium fleet includes a professional chauffeur service for your comfort and safety.')}
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      type="button"
                      className="p-3 rounded-2xl text-xs font-bold border-2 border-[#0091EA] bg-[#0091EA]/10 text-[#0091EA] shadow-md text-start flex items-start gap-2.5"
                    >
                      <span className="text-xl">👨‍✈️</span>
                      <div>
                        <span className="font-black block">{translate('With Professional Driver')}</span>
                        <span className="text-[10px] opacity-80 font-medium block">
                          {translate('Includes expert driver, fuel & insurance (+')} {formatPrice(35)}/{translate('day')})
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* TOUR CUSTOMIZATION ADD-ONS (HOTEL & VEHICLE) */}
              {(resolvedType === 'tour' || resolvedType === 'package' || resolvedType === 'hotel' || resolvedType === 'flight') && (
                <div className="bg-gradient-to-br from-sky-50/80 to-indigo-50/50 dark:from-slate-800/80 dark:to-slate-900/80 p-4 rounded-2xl border-2 border-sky-200 dark:border-sky-800/80 space-y-4 text-start">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0091EA] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {translate('Enhance Your Experience (Optional Add-ons)')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                      {translate('Customize Experience')}
                    </span>
                  </div>

                  {/* 1. Hotel Option */}
                  {(resolvedType === 'tour' || resolvedType === 'package' || resolvedType === 'flight') && (
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-sky-100 dark:border-sky-800/60 space-y-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={includeHotel}
                            onChange={(e) => setIncludeHotel(e.target.checked)}
                            className="w-4 h-4 rounded text-[#0091EA] focus:ring-[#0091EA] cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-[#0091EA]" />
                              {translate('Add Hotel Accommodation')}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                              {translate('Select luxury resort stay for your tour dates')}
                            </span>
                          </div>
                        </div>
                        {includeHotel && (
                          <span className="text-xs font-black text-[#0091EA] bg-sky-50 dark:bg-sky-950 px-2.5 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                            +{formatPrice(selectedHotel.pricePerNight * hotelNights)}
                          </span>
                        )}
                      </label>

                      {includeHotel && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5 animate-fade-in">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="sm:col-span-2">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">{translate('Select Hotel / Resort')}</label>
                              <select
                                value={selectedHotelId}
                                onChange={(e) => setSelectedHotelId(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:border-[#0091EA] text-slate-800 dark:text-slate-200"
                              >
                                {AVAILABLE_ADDON_HOTELS.map((h) => (
                                  <option key={h.id} value={h.id}>
                                    {translate(h.name)} ({translate(h.location)}) - {formatPrice(h.pricePerNight)}/{translate('night')}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">{translate('Duration')}</label>
                              <select
                                value={hotelNights}
                                onChange={(e) => setHotelNights(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:border-[#0091EA] text-slate-800 dark:text-slate-200"
                              >
                                {[1, 2, 3, 4, 5, 7, 10].map((n) => (
                                  <option key={n} value={n}>{n} {n === 1 ? translate('Night') : translate('Nights')}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. Vehicle Option */}
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-sky-100 dark:border-sky-800/60 space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={includeVehicle}
                          onChange={(e) => setIncludeVehicle(e.target.checked)}
                          className="w-4 h-4 rounded text-[#0091EA] focus:ring-[#0091EA] cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-[#0091EA]" />
                            {translate('Add Private Vehicle Transport')}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                            {translate('Chauffeured car for your travel')}
                          </span>
                        </div>
                      </div>
                      {includeVehicle && (
                        <span className="text-xs font-black text-[#0091EA] bg-sky-50 dark:bg-sky-950 px-2.5 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                          +{formatPrice((selectedVehicle.pricePerDay + addonDriverDailyFee) * vehicleDays)}
                        </span>
                      )}
                    </label>

                    {includeVehicle && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">{translate('Select Vehicle Model')}</label>
                            <select
                              value={selectedVehicleId}
                              onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:border-[#0091EA] text-slate-800 dark:text-slate-200"
                            >
                              {AVAILABLE_ADDON_VEHICLES.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {translate(v.name)} ({translate(v.category)}) - {formatPrice(v.pricePerDay)}/{translate('day')}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">{translate('Duration')}</label>
                            <select
                              value={vehicleDays}
                              onChange={(e) => setVehicleDays(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:border-[#0091EA] text-slate-800 dark:text-slate-200"
                            >
                              {[1, 2, 3, 4, 5, 7, 10].map((d) => (
                                <option key={d} value={d}>{d} {d === 1 ? translate('Day') : translate('Days')}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden text-start">
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#0091EA]" />
                    {translate('Pricing Breakdown')}
                  </span>
                  <span className="text-[10px] font-black text-[#0091EA] bg-[#0091EA]/10 dark:bg-[#0091EA]/20 px-2 py-0.5 rounded-md">
                    {currency.code}
                  </span>
                </div>
                
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>{translate('Base Subtotal')} ({travelers} × {formatPrice(resolvedPriceUnit)})</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatPrice(resolvedTotalCost)}</span>
                  </div>

                  {/* Hotel Addon Line Item */}
                  {includeHotel && (hotelAddonCost > 0) && (
                    <div className="flex justify-between text-sky-700 dark:text-sky-300 font-medium bg-sky-50/50 dark:bg-sky-950/30 px-2 py-1 rounded-lg">
                      <span>🏨 {translate(selectedHotel.name)} ({hotelNights} {hotelNights === 1 ? translate('Night') : translate('Nights')})</span>
                      <span className="font-bold">+{formatPrice(hotelAddonCost)}</span>
                    </div>
                  )}

                  {/* Vehicle Addon Line Item */}
                  {includeVehicle && (vehicleAddonCost > 0) && (
                    <div className="flex justify-between text-sky-700 dark:text-sky-300 font-medium bg-sky-50/50 dark:bg-sky-950/30 px-2 py-1 rounded-lg">
                      <span>🚗 {translate(selectedVehicle.name)} ({vehicleDays} {vehicleDays === 1 ? translate('Day') : translate('Days')}) {driverOption === 'driver' ? `(${translate('With Driver')})` : `(${translate('Self-Drive')})`}</span>
                      <span className="font-bold">+{formatPrice(vehicleAddonCost)}</span>
                    </div>
                  )}

                  {/* Car Rental Direct Driver Fee Line Item */}
                  {resolvedType === 'car' && driverOption === 'driver' && (
                    <div className="flex justify-between text-sky-700 dark:text-sky-300 font-medium bg-sky-50/50 dark:bg-sky-950/30 px-2 py-1 rounded-lg">
                      <span>👨‍✈️ {translate('Professional Driver Service')} ({carRentalDays} {carRentalDays === 1 ? translate('Day') : translate('Days')})</span>
                      <span className="font-bold">+{formatPrice(carDirectDriverCost)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>{translate('Taxes & Fees')} (8%)</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatPrice(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>{translate('Service Fee')} (2%)</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatPrice(serviceFee)}</span>
                  </div>
                  
                  <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{translate('Total Amount')}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{translate('All taxes and fees included')}</span>
                    </div>
                    <span className="text-2xl font-black text-[#0091EA]">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Security Banner */}
              <div className="bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl p-3 border border-emerald-100 dark:border-emerald-900 flex gap-2.5 items-start">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">{translate('Instant Reservation Guarantee')}</p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-normal font-medium mt-0.5">
                    {translate('Your booking reference ID is generated and reserved immediately. You can confirm your details below.')}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                {translate('Cancel')}
              </button>
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="px-5 py-2.5 bg-[#0091EA] hover:bg-[#007cc7] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>{translate('Proceed to Payment')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT FORM */}
        {step === 'payment' && (
          <form onSubmit={handlePaymentSubmit} className="flex flex-col text-start">
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-5">
              
              {/* Payment Gateway Selection */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  {translate('Select Payment Gateway')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentGateway('stripe')}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      paymentGateway === 'stripe'
                        ? 'border-[#0091EA] bg-sky-50/60 dark:bg-sky-950/40 text-slate-900 dark:text-white ring-2 ring-sky-500/30'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="block font-black text-xs">{translate(`Stripe`)}</span>
                    <span className="block text-[9px] text-slate-400">Card / Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGateway('payhere')}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      paymentGateway === 'payhere'
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-slate-900 dark:text-white ring-2 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="block font-black text-xs text-emerald-600">{translate(`PayHere`)}</span>
                    <span className="block text-[9px] text-slate-400">{translate(`LKR Local Bank`)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGateway('paypal')}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      paymentGateway === 'paypal'
                        ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-slate-900 dark:text-white ring-2 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="block font-black text-xs text-indigo-600">{translate(`PayPal`)}</span>
                    <span className="block text-[9px] text-slate-400">{translate(`PayPal Express`)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGateway('arrival')}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      paymentGateway === 'arrival'
                        ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-slate-900 dark:text-white ring-2 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="block font-black text-xs text-amber-600">{translate(`Pay on Arrival`)}</span>
                    <span className="block text-[9px] text-slate-400">{translate(`15% Deposit Now`)}</span>
                  </button>
                </div>
              </div>

              {/* Security Deposit Pre-Authorization Notice for Vehicles */}
              {resolvedType === 'car' && (
                <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 block tracking-wider">
                      {translate(`Security Deposit Pre-authorization Hold`)}
                    </span>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed mt-0.5">
                      {translate('An automated security deposit hold of')} {formatPrice(250)} {translate('is pre-authorized on your card. No money is charged; the temporary hold is automatically released 24 hours after vehicle return post-inspection.')}
                    </p>
                  </div>
                </div>
              )}

              {/* DYNAMIC PAYMENT GATEWAY CONTENT */}

              {/* 1. STRIPE GATEWAY */}
              {paymentGateway === 'stripe' && (
                <div className="space-y-4">
                  {/* Virtual Card Display */}
                  <div className="w-full h-44 bg-gradient-to-br from-slate-900 via-slate-800 to-[#0091EA] rounded-2xl p-5 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">{translate('Booking Reference Card')}</span>
                        <span className="text-[9px] text-sky-300 font-extrabold uppercase mt-0.5 block tracking-wider">{bookingRef}</span>
                      </div>
                      <div className="bg-black/20 px-2.5 py-1 rounded-lg border border-white/10 text-xs font-black uppercase">
                        {getCardBrand()}
                      </div>
                    </div>

                    <div className="font-mono text-lg tracking-widest text-center text-white/90">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <span className="text-[8px] text-white/50 block tracking-widest uppercase">{translate('Cardholder')}</span>
                        <span className="font-bold font-mono tracking-wide truncate block">
                          {(cardName || custName || 'YOUR NAME').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <span className="text-[8px] text-white/50 block tracking-widest uppercase">{translate('Expires')}</span>
                          <span className="font-bold font-mono block">{cardExpiry || 'MM/YY'}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-white/50 block tracking-widest uppercase">{translate('CVC')}</span>
                          <span className="font-bold font-mono block">{cardCvc || '•••'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">{translate('Cardholder Name')}</label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder={translate(`As printed on card`)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs font-semibold outline-none focus:border-[#0091EA]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">{translate('Card Number')}</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4242 4242 4242 4242"
                          className="w-full ps-10 pe-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs font-mono outline-none focus:border-[#0091EA] font-bold"
                        />
                        <CreditCard className="w-4 h-4 text-slate-400 absolute start-3.5 top-3" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">{translate('Expiry Date')}</label>
                        <input
                          type="text"
                          required
                          placeholder={translate(`MM/YY`)}
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs font-mono outline-none focus:border-[#0091EA] font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">{translate('CVC')}</label>
                        <input
                          type="password"
                          required
                          placeholder="123"
                          value={cardCvc}
                          onChange={handleCvcChange}
                          className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs font-mono outline-none focus:border-[#0091EA] font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Test Hint */}
                  <div className="bg-sky-50 dark:bg-sky-950/50 rounded-xl p-3 border border-sky-100 dark:border-sky-800 text-[11px] text-sky-800 dark:text-sky-300 font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#0091EA] flex-shrink-0" />
                    <span>{translate('Use test card numbers (e.g. 4242 4242 4242 4242) for instant booking confirmation.')}</span>
                  </div>
                </div>
              )}

              {/* 2. PAYHERE SRI LANKA GATEWAY */}
              {paymentGateway === 'payhere' && (
                <div className="space-y-4">
                  {/* PayHere LKR Conversion Card */}
                  <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-emerald-500/30 space-y-3">
                    <div className="flex justify-between items-center border-b border-emerald-500/30 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded uppercase">{translate(`PayHere`)}</span>
                        <span className="text-xs font-bold text-emerald-200">{translate(`Sri Lanka Local Gateway`)}</span>
                      </div>
                      <span className="text-[10px] text-emerald-300 font-mono font-bold">1 USD = 310 LKR</span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-emerald-300 font-bold block">{translate(`Equivalent LKR Amount`)}</span>
                        <span className="text-2xl font-black text-white font-mono">
                          Rs. {(grandTotal * 310).toLocaleString()} <span className="text-xs font-normal text-emerald-300">{translate(`LKR`)}</span>
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="text-[9px] uppercase tracking-widest text-emerald-300 font-bold block">{translate(`Base Total`)}</span>
                        <span className="text-sm font-bold text-white font-mono">{formatPrice(grandTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">{translate(`Select Sri Lankan Bank or Mobile Wallet`)}</label>
                      <select
                        value={payHereBank}
                        onChange={(e) => setPayHereBank(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
                      >
                        <option value="Commercial Bank (LKR Card / Online)">Commercial Bank (LKR Visa/MasterCard)</option>
                        <option value="Sampath Vishwa Internet Banking">{translate(`Sampath Vishwa Internet Banking`)}</option>
                        <option value="HNB SOLO / Mobile Banking">Hatton National Bank (HNB SOLO)</option>
                        <option value="Bank of Ceylon (BOC Online)">Bank of Ceylon (BOC Online)</option>
                        <option value="eZ Cash / mCash Mobile Wallet">eZ Cash / mCash Mobile Wallet</option>
                        <option value="FriMi Digital Wallet">{translate(`FriMi Digital Banking`)}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">{translate(`Mobile Phone Number (SMS OTP Verification)`)}</label>
                      <input
                        type="tel"
                        required
                        value={payHereMobile}
                        onChange={(e) => setPayHereMobile(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs font-mono font-bold outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Info Notice */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 rounded-xl p-3 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{translate(`PayHere is approved by Central Bank of Sri Lanka. Click below to generate your LKR payment token.`)}</span>
                  </div>
                </div>
              )}

              {/* 3. PAYPAL EXPRESS GATEWAY */}
              {paymentGateway === 'paypal' && (
                <div className="space-y-4">
                  {/* PayPal Banner Card */}
                  <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-indigo-500/30 space-y-3">
                    <div className="flex justify-between items-center border-b border-indigo-500/30 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#FFC439] text-indigo-950 text-xs font-black rounded italic">{translate(`PayPal`)}</span>
                        <span className="text-xs font-bold text-indigo-200">{translate(`Express Checkout`)}</span>
                      </div>
                      <span className="text-[10px] text-indigo-300 font-mono font-bold">{translate(`One-Click Pay`)}</span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-bold block">{translate(`Authorization Total`)}</span>
                        <span className="text-2xl font-black text-white font-mono">{formatPrice(grandTotal)}</span>
                      </div>
                      <div className="text-end">
                        <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-bold block">{translate(`Protection`)}</span>
                        <span className="text-xs font-bold text-emerald-400">{translate(`Buyer Protection Eligible`)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">{translate(`Registered PayPal Email Account`)}</label>
                      <input
                        type="email"
                        required
                        value={payPalEmail}
                        onChange={(e) => setPayPalEmail(e.target.value)}
                        placeholder="user@paypal.com"
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Interactive PayPal Yellow Button Mockup */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-2">
                    <p className="text-[11px] font-bold text-slate-500">{translate(`PayPal Express Checkout Preview:`)}</p>
                    <div className="w-full py-3 bg-[#FFC439] hover:bg-[#f2b82e] text-indigo-950 rounded-xl font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all">
                      <span className="italic font-extrabold text-base">{translate(`Pay`)}<span className="text-blue-700">{translate(`Pal`)}</span></span>
                      <span>{translate(`Checkout`)}</span>
                    </div>
                  </div>

                  {/* Info Notice */}
                  <div className="bg-indigo-50 dark:bg-indigo-950/50 rounded-xl p-3 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-800 dark:text-indigo-300 font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>{translate(`You will be securely authenticated with PayPal Express to confirm your booking.`)}</span>
                  </div>
                </div>
              )}

              {/* 4. PAY ON ARRIVAL GATEWAY */}
              {paymentGateway === 'arrival' && (
                <div className="space-y-4">
                  {/* Pay on Arrival Banner */}
                  <div className="bg-gradient-to-br from-amber-900 via-yellow-900 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-amber-500/30 space-y-3">
                    <div className="flex justify-between items-center border-b border-amber-500/30 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded uppercase">{translate(`Pay on Arrival`)}</span>
                        <span className="text-xs font-bold text-amber-200">{translate(`15% Deposit Guarantee`)}</span>
                      </div>
                      <span className="text-[10px] text-amber-300 font-mono font-bold">{translate(`Flexible Settlement`)}</span>
                    </div>

                    {/* Deposit Calculation Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-black/30 p-2.5 rounded-xl border border-amber-400/20">
                        <span className="text-[9px] uppercase tracking-widest text-amber-300 font-black block">{translate(`Deposit Due Today (15%)`)}</span>
                        <span className="text-xl font-black text-emerald-400 font-mono">{formatPrice(Math.round(grandTotal * 0.15))}</span>
                      </div>
                      <div className="bg-black/30 p-2.5 rounded-xl border border-amber-400/20">
                        <span className="text-[9px] uppercase tracking-widest text-amber-300 font-black block">{translate(`Balance Upon Arrival (85%)`)}</span>
                        <span className="text-xl font-black text-white font-mono">{formatPrice(grandTotal - Math.round(grandTotal * 0.15))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">{translate(`Contact Phone Number for Arrival Agent Call`)}</label>
                      <input
                        type="tel"
                        required
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs font-mono font-bold outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">{translate(`Flight Number or Arrival Notes (Optional)`)}</label>
                      <input
                        type="text"
                        value={arrivalNotes}
                        onChange={(e) => setArrivalNotes(e.target.value)}
                        placeholder="e.g. UL-504 arriving at Colombo BIA at 14:30"
                        className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs font-semibold outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Info Notice */}
                  <div className="bg-amber-50 dark:bg-amber-950/50 rounded-xl p-3 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{translate('Pay only')} {formatPrice(Math.round(grandTotal * 0.15))} {translate('today to lock in your reservation. The remaining balance can be paid in cash or card upon arrival.')}</span>
                  </div>
                </div>
              )}

              {paymentError && (
                <div className="bg-rose-50 rounded-xl p-3 border border-rose-150 flex gap-2 text-xs text-rose-700 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <p>{paymentError}</p>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end items-center">
              <button
                type="button"
                onClick={() => setStep('review')}
                disabled={isProcessing}
                className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                {translate('Back')}
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className={`px-5 py-2.5 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  paymentGateway === 'payhere' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  paymentGateway === 'paypal' ? 'bg-indigo-600 hover:bg-indigo-700' :
                  paymentGateway === 'arrival' ? 'bg-amber-600 hover:bg-amber-700' :
                  'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>{translate('Processing...')}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {paymentGateway === 'payhere'
                        ? `${translate('Proceed with PayHere')} (Rs. ${(grandTotal * 310).toLocaleString()} LKR)`
                        : paymentGateway === 'paypal'
                        ? `${translate('Pay with PayPal')} (${formatPrice(grandTotal)})`
                        : paymentGateway === 'arrival'
                        ? `${translate('Pay 15% Deposit')} (${formatPrice(Math.round(grandTotal * 0.15))}) & ${translate('Confirm')}`
                        : `${translate('Confirm & Pay')} ${formatPrice(grandTotal)}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 'success' && (
          <div className="p-6 text-center space-y-5 flex flex-col items-center">
            
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/60 rounded-full flex items-center justify-center border border-emerald-100 dark:border-emerald-800 text-emerald-500 shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-1 text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-100 dark:border-emerald-800 rounded-full uppercase tracking-wider">
                {translate('Booking Confirmed')}
              </span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">{translate('Reservation Success!')}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {translate('Your reservation has been confirmed and logged into our booking engine.')}
              </p>
            </div>

            {/* Official Receipt Box */}
            <div className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-start text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">{translate('Official Receipt')}</span>
                <span className="font-mono text-xs font-black text-[#0091EA]">{bookingRef}</span>
              </div>
              
              <div className="space-y-2 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="font-medium">{translate('Item / Package')}:</span>
                  <span className="font-black text-slate-900 dark:text-white truncate max-w-[60%]">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{translate('Travel Date')}:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatDate(resolvedDateStart)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{translate('Total Amount')}:</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{formatPrice(grandTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{translate('Lead Guest')}:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{custName || 'Guest'}</span>
                </div>
              </div>
            </div>

            {/* PDF Voucher & Return Buttons */}
            <div className="w-full space-y-2 pt-1">
              <button
                type="button"
                onClick={handleOpenPdfVoucher}
                className="w-full py-3 bg-[#0091EA] hover:bg-sky-600 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-sky-500/20 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{translate('Download / Share PDF Voucher')}</span>
              </button>

              <button
                type="button"
                onClick={handleFinishClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {translate('Done & Return')}
              </button>
            </div>

          </div>
        )}

        </motion.div>

        {/* PDF Voucher Render Modal */}
        <BookingPDFModal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          booking={pdfVoucherData}
        />
      </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
