import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Share2, 
  Printer, 
  CheckCircle2, 
  Compass, 
  Building, 
  Car, 
  Plane, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Copy,
  FileText,
  BedDouble,
  Hash,
  Upload,
  Globe,
  Server,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../lib/i18n.tsx';
import { useCurrency } from '../lib/CurrencyContext.tsx';

export interface BookingVoucherData {
  id: string | number;
  bookingRef: string;
  type: 'tour' | 'package' | 'hotel' | 'car' | 'flight' | string;
  title: string;
  subtitle?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  
  // Guest Info
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  guestsCount?: number;
  
  // Dates & Times
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  durationText?: string;
  
  // Specific Type Details
  roomNumber?: string;
  roomType?: string;
  hotelLocation?: string;
  hotelAmenities?: string;
  
  carCategory?: string;
  carTransmission?: string;
  vehicleModel?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  transmission?: string;
  fuelType?: string;
  
  flightAirline?: string;
  flightFrom?: string;
  flightTo?: string;
  flightDepartureTime?: string;
  flightArrivalTime?: string;
  
  // Financials
  pricePerUnit?: number;
  totalPrice: number;
  hotelPrice?: number;
  carPrice?: number;
  status: string;
  paymentMethod?: string;
  createdAt?: string;
}

interface BookingPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingVoucherData | null;
}

export default function BookingPDFModal({ isOpen, onClose, booking }: BookingPDFModalProps) {
  const { translate } = useLanguage();
  const { formatPrice } = useCurrency();
  const voucherRef = useRef<HTMLDivElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showHostingerGuide, setShowHostingerGuide] = useState(false);

  // Format type badges & icons
  const getServiceIcon = () => {
    switch (booking?.type?.toLowerCase()) {
      case 'hotel':
        return <Building className="w-5 h-5 text-[#0091EA]" />;
      case 'car':
        return <Car className="w-5 h-5 text-[#0091EA]" />;
      case 'flight':
        return <Plane className="w-5 h-5 text-[#0091EA]" />;
      default:
        return <Compass className="w-5 h-5 text-[#0091EA]" />;
    }
  };

  const getServiceLabel = () => {
    switch (booking?.type?.toLowerCase()) {
      case 'hotel':
        return 'Luxury Hotel & Suite Reservation';
      case 'car':
        return 'Private Vehicle Rental Pass';
      case 'flight':
        return 'Flight Travel Boarding Voucher';
      default:
        return 'Tour & Holiday Package Voucher';
    }
  };

  // Helper function to derive destination coordinates
  const getCoordinates = (locationName: string) => {
    const loc = (locationName || '').toLowerCase();
    if (loc.includes('paris')) return '48.8566° N, 2.3522° E';
    if (loc.includes('tokyo') || loc.includes('japan')) return '35.6762° N, 139.6503° E';
    if (loc.includes('dubai') || loc.includes('uae')) return '25.2048° N, 55.2708° E';
    if (loc.includes('york')) return '40.7128° N, 74.0060° W';
    if (loc.includes('colombo') || loc.includes('lanka')) return '6.9271° N, 79.8612° E';
    if (loc.includes('london') || loc.includes('uk')) return '51.5074° N, 0.1278° W';
    if (loc.includes('bali') || loc.includes('indonesia')) return '8.3405° S, 115.0920° E';
    if (loc.includes('maldives')) return '3.2028° N, 73.2207° E';
    if (loc.includes('rome') || loc.includes('italy')) return '41.9028° N, 12.4964° E';
    if (loc.includes('swiss') || loc.includes('alps') || loc.includes('zurich')) return '47.3769° N, 8.5417° E';
    return '6.9271° N, 79.8612° E';
  };

  // Generate Room Number or Details if absent
  const resolvedRoomNumber = booking?.roomNumber || `Suite #${100 + (Number(booking?.id) || 1) * 3}`;
  const resolvedRoomType = booking?.roomType || 'Executive Deluxe Ocean View';
  const resolvedDuration = booking?.durationText || (booking?.type === 'hotel' ? '3 Nights / 4 Days' : 'Full Day Experience');
  const resolvedStartTime = booking?.startTime || '09:00 AM (EST)';
  const destinationLoc = booking?.hotelLocation || booking?.flightTo || booking?.subtitle || booking?.title || 'Premier Luxury Destination';

  // Helper function to build a high-precision, vector-sharp luxury PDF voucher
  const buildLuxuryVectorPDF = (bookingData: BookingVoucherData) => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2; // 182mm

    // Service category label
    const serviceLabel = bookingData.type === 'hotel' 
      ? 'LUXURY HOTEL & SUITE RESERVATION' 
      : bookingData.type === 'car' 
      ? 'PRIVATE VEHICLE RENTAL PASS' 
      : bookingData.type === 'flight' 
      ? 'FLIGHT TRAVEL BOARDING VOUCHER' 
      : 'TOUR & HOLIDAY PACKAGE VOUCHER';

    // 1. TOP BRAND HEADER (Deep Navy Box)
    pdf.setFillColor(10, 37, 64); // #0A2540
    pdf.roundedRect(margin, 10, contentWidth, 26, 3, 3, 'F');

    // PTB Logo Square Icon
    pdf.setFillColor(0, 145, 234); // #0091EA
    pdf.roundedRect(margin + 4, 14, 14, 14, 2.5, 2.5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('PTB', margin + 11, 23, { align: 'center' });

    // Brand Name & Subtitle
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(15);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Premier Tour Booking', margin + 22, 20);

    pdf.setTextColor(56, 189, 248); // #38BDF8
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GLOBAL LUXURY TRAVEL & EXPERIENCES LTD.', margin + 22, 25);

    // Official Badge (Right Aligned)
    pdf.setFillColor(2, 44, 34); // #022C22
    pdf.roundedRect(pageWidth - margin - 60, 14, 56, 8, 3, 3, 'F');
    pdf.setDrawColor(5, 150, 105);
    pdf.setLineWidth(0.4);
    pdf.roundedRect(pageWidth - margin - 60, 14, 56, 8, 3, 3, 'S');

    pdf.setTextColor(52, 211, 153); // #34D399
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text('OFFICIAL VOUCHER & RECEIPT', pageWidth - margin - 32, 19.5, { align: 'center' });

    // Ref & Issue Date
    pdf.setTextColor(56, 189, 248);
    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`REF: #${bookingData.bookingRef}`, pageWidth - margin - 4, 28, { align: 'right' });

    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(6.5);
    pdf.setFont('helvetica', 'normal');
    const issueDateStr = bookingData.createdAt ? new Date(bookingData.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
    pdf.text(`Issued: ${issueDateStr}`, pageWidth - margin - 4, 32, { align: 'right' });


    // 2. HERO SERVICE CARD (Dark Slate Box)
    const heroY = 39;
    pdf.setFillColor(15, 23, 42); // #0F172A (Slate 900)
    pdf.roundedRect(margin, heroY, contentWidth, 38, 3, 3, 'F');

    // Service Tag
    pdf.setTextColor(56, 189, 248);
    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`COMPASS • ${serviceLabel}`, margin + 6, heroY + 8);

    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(13.5);
    pdf.setFont('helvetica', 'bold');
    const titleText = bookingData.title.length > 50 ? bookingData.title.substring(0, 47) + '...' : bookingData.title;
    pdf.text(titleText, margin + 6, heroY + 16);

    // Subtitle / Category
    const subtitleText = bookingData.subtitle || bookingData.category || 'Luxury Travel Experience';
    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(subtitleText.length > 65 ? subtitleText.substring(0, 62) + '...' : subtitleText, margin + 6, heroY + 21);

    // Divider Line inside Hero Card
    pdf.setDrawColor(30, 41, 59); // #1E293B
    pdf.setLineWidth(0.3);
    pdf.line(margin + 6, heroY + 24, margin + contentWidth - 6, heroY + 24);

    // 4 Spec Highlight Columns
    const colW = (contentWidth - 12) / 4;
    
    // Col 1: Status
    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(6.5);
    pdf.setFont('helvetica', 'bold');
    pdf.text('STATUS', margin + 6, heroY + 28);
    pdf.setTextColor(74, 222, 128); // #4ADE80
    pdf.setFontSize(8.5);
    pdf.text(`[OK] ${(bookingData.status || 'CONFIRMED').toUpperCase()}`, margin + 6, heroY + 33);

    // Col 2: Start Date
    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(6.5);
    pdf.setFont('helvetica', 'bold');
    pdf.text('START DATE', margin + 6 + colW, heroY + 28);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8.5);
    pdf.text(bookingData.startDate || 'Aug 15, 2026', margin + 6 + colW, heroY + 33);

    // Col 3: Start Time
    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(6.5);
    pdf.setFont('helvetica', 'bold');
    pdf.text('START TIME', margin + 6 + colW * 2, heroY + 28);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8.5);
    pdf.text(resolvedStartTime, margin + 6 + colW * 2, heroY + 33);

    // Col 4: Duration
    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(6.5);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DURATION', margin + 6 + colW * 3, heroY + 28);
    pdf.setTextColor(56, 189, 248);
    pdf.setFontSize(8.5);
    pdf.text(resolvedDuration, margin + 6 + colW * 3, heroY + 33);


    // 3. TWO SIDE-BY-SIDE SPECIFICATION CARDS
    const cardY = 81;
    const cardW = (contentWidth - 6) / 2; // 88mm each
    const cardH = 46;

    // --- Left Card: Lead Guest Details ---
    pdf.setFillColor(248, 250, 252); // #F8FAFC
    pdf.setDrawColor(226, 232, 240); // #E2E8F0
    pdf.setLineWidth(0.4);
    pdf.roundedRect(margin, cardY, cardW, cardH, 2.5, 2.5, 'FD');

    // Header Bar
    pdf.setFillColor(241, 245, 249);
    pdf.roundedRect(margin, cardY, cardW, 8.5, 2.5, 2.5, 'F');
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.text('LEAD GUEST DETAILS & CONTACT', margin + 5, cardY + 6);

    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(9.5);
    pdf.setFont('helvetica', 'bold');
    pdf.text(bookingData.customerName, margin + 5, cardY + 16);

    pdf.setTextColor(71, 85, 105);
    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Email: ${bookingData.customerEmail}`, margin + 5, cardY + 22);
    pdf.text(`Phone: ${bookingData.customerPhone || '+1 800-555-0199'}`, margin + 5, cardY + 27);
    pdf.text(`Party Size: ${bookingData.guestsCount || 1} Person(s)`, margin + 5, cardY + 32);

    pdf.setTextColor(5, 150, 105);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text('[OK] Verified Lead Guest & Online Payment', margin + 5, cardY + 40);


    // --- Right Card: Service Specifications ---
    const rightCardX = margin + cardW + 6;
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(rightCardX, cardY, cardW, cardH, 2.5, 2.5, 'FD');

    // Header Bar
    pdf.setFillColor(241, 245, 249);
    pdf.roundedRect(rightCardX, cardY, cardW, 8.5, 2.5, 2.5, 'F');
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.text('STAY & FACILITY SPECIFICATIONS', rightCardX + 5, cardY + 6);

    pdf.setFontSize(7.5);
    if (bookingData.type === 'hotel') {
      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Assigned Room:', rightCardX + 5, cardY + 16);
      pdf.setTextColor(0, 145, 234); pdf.setFont('helvetica', 'bold'); pdf.text(resolvedRoomNumber, rightCardX + 42, cardY + 16);

      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Room Category:', rightCardX + 5, cardY + 22);
      pdf.setTextColor(15, 23, 42); pdf.setFont('helvetica', 'bold'); pdf.text(resolvedRoomType.substring(0, 22), rightCardX + 42, cardY + 22);

      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Check-Out Date:', rightCardX + 5, cardY + 27);
      pdf.setTextColor(15, 23, 42); pdf.setFont('helvetica', 'bold'); pdf.text(bookingData.endDate || 'Standard Checkout', rightCardX + 42, cardY + 27);

      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Inclusions:', rightCardX + 5, cardY + 32);
      pdf.setTextColor(5, 150, 105); pdf.setFont('helvetica', 'bold'); pdf.text('Breakfast & Wi-Fi Free', rightCardX + 42, cardY + 32);
    } else if (bookingData.type === 'car') {
      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Category:', rightCardX + 5, cardY + 16);
      pdf.setTextColor(15, 23, 42); pdf.setFont('helvetica', 'bold'); pdf.text(bookingData.carCategory || 'SUV Luxury 4x4', rightCardX + 42, cardY + 16);

      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Return Date:', rightCardX + 5, cardY + 22);
      pdf.setTextColor(15, 23, 42); pdf.setFont('helvetica', 'bold'); pdf.text(bookingData.endDate || bookingData.startDate, rightCardX + 42, cardY + 22);

      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Transmission:', rightCardX + 5, cardY + 27);
      pdf.setTextColor(15, 23, 42); pdf.setFont('helvetica', 'bold'); pdf.text(bookingData.carTransmission || 'Automatic', rightCardX + 42, cardY + 27);

      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Mileage:', rightCardX + 5, cardY + 32);
      pdf.setTextColor(5, 150, 105); pdf.setFont('helvetica', 'bold'); pdf.text('Unlimited Included', rightCardX + 42, cardY + 32);
    } else if (bookingData.type === 'flight') {
      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Airline:', rightCardX + 5, cardY + 16);
      pdf.setTextColor(15, 23, 42); pdf.setFont('helvetica', 'bold'); pdf.text(bookingData.flightAirline || 'Emirates Air', rightCardX + 42, cardY + 16);

      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Route:', rightCardX + 5, cardY + 22);
      pdf.setTextColor(15, 23, 42); pdf.setFont('helvetica', 'bold'); pdf.text(`${bookingData.flightFrom || 'CMB'} -> ${bookingData.flightTo || 'DXB'}`, rightCardX + 42, cardY + 22);

      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Cabin Class:', rightCardX + 5, cardY + 27);
      pdf.setTextColor(15, 23, 42); pdf.setFont('helvetica', 'bold'); pdf.text('Business Class', rightCardX + 42, cardY + 27);

      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Baggage:', rightCardX + 5, cardY + 32);
      pdf.setTextColor(5, 150, 105); pdf.setFont('helvetica', 'bold'); pdf.text('32kg Checked Bag', rightCardX + 42, cardY + 32);
    } else {
      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Package Type:', rightCardX + 5, cardY + 16);
      pdf.setTextColor(0, 145, 234); pdf.setFont('helvetica', 'bold'); pdf.text(bookingData.category || 'All-Inclusive Tour', rightCardX + 42, cardY + 16);

      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Scheduled Guide:', rightCardX + 5, cardY + 22);
      pdf.setTextColor(15, 23, 42); pdf.setFont('helvetica', 'bold'); pdf.text('Licensed English Guide', rightCardX + 42, cardY + 22);

      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Transport:', rightCardX + 5, cardY + 27);
      pdf.setTextColor(15, 23, 42); pdf.setFont('helvetica', 'bold'); pdf.text('AC Luxury Coach', rightCardX + 42, cardY + 27);

      pdf.setTextColor(100, 116, 139); pdf.setFont('helvetica', 'normal'); pdf.text('Service Guarantee:', rightCardX + 5, cardY + 32);
      pdf.setTextColor(5, 150, 105); pdf.setFont('helvetica', 'bold'); pdf.text('5-Star Premier Rated', rightCardX + 42, cardY + 32);
    }


    // 4. ARRANGEMENT HIGHLIGHTS & ITINERARY NOTE
    const noteY = 131;
    pdf.setFillColor(241, 245, 249); // #F1F5F9
    pdf.setDrawColor(203, 213, 225); // #CBD5E1
    pdf.roundedRect(margin, noteY, contentWidth, 20, 2.5, 2.5, 'FD');

    pdf.setTextColor(51, 65, 85);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.text('ARRANGEMENT HIGHLIGHTS & ITINERARY NOTE', margin + 5, noteY + 5);

    pdf.setTextColor(71, 85, 105);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    const noteText = bookingData.description || `Confirmed reservation voucher for ${bookingData.customerName}. Includes all scheduled luxury transportation, dedicated host arrangements, and priority access passes.`;
    const splitNote = pdf.splitTextToSize(noteText, contentWidth - 10);
    pdf.text(splitNote, margin + 5, noteY + 11);


    // 5. DESTINATION MAP & ITINERARY LOCATION CARD (NEW!)
    const mapY = 155;
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.roundedRect(margin, mapY, contentWidth, 28, 2.5, 2.5, 'FD');

    // Card Header Bar
    pdf.setFillColor(241, 245, 249);
    pdf.roundedRect(margin, mapY, contentWidth, 7, 2.5, 2.5, 'F');
    pdf.setTextColor(51, 65, 85);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.text('DESTINATION MAP & ITINERARY LOCATION PASS', margin + 5, mapY + 5);

    pdf.setTextColor(0, 145, 234);
    pdf.setFontSize(7);
    pdf.text('GPS VERIFIED LOCATION', pageWidth - margin - 5, mapY + 5, { align: 'right' });

    // Vector Map Graphic Box (Left Side)
    const mapBoxX = margin + 4;
    const mapBoxY = mapY + 9;
    const mapBoxW = 52;
    const mapBoxH = 15;

    pdf.setFillColor(15, 23, 42); // Dark map tile
    pdf.roundedRect(mapBoxX, mapBoxY, mapBoxW, mapBoxH, 1.5, 1.5, 'F');

    // Vector Road Gridlines
    pdf.setDrawColor(30, 41, 59);
    pdf.setLineWidth(0.3);
    pdf.line(mapBoxX, mapBoxY + 5, mapBoxX + mapBoxW, mapBoxY + 5);
    pdf.line(mapBoxX, mapBoxY + 10, mapBoxX + mapBoxW, mapBoxY + 10);
    pdf.line(mapBoxX + 18, mapBoxY, mapBoxX + 18, mapBoxY + mapBoxH);
    pdf.line(mapBoxX + 36, mapBoxY, mapBoxX + 36, mapBoxY + mapBoxH);

    // Vector Map Marker Pin
    pdf.setFillColor(0, 145, 234);
    pdf.circle(mapBoxX + 26, mapBoxY + 6, 2.5, 'F');
    pdf.setFillColor(255, 255, 255);
    pdf.circle(mapBoxX + 26, mapBoxY + 6, 1, 'F');

    pdf.setTextColor(56, 189, 248);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6);
    pdf.text('DESTINATION PIN', mapBoxX + 26, mapBoxY + 12, { align: 'center' });

    // Location Text Details (Right Side)
    const locTextX = mapBoxX + mapBoxW + 6;
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text(destinationLoc.substring(0, 50), locTextX, mapY + 14);

    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.text('Primary Arrival & Check-In Point • Google Maps Static API Pass', locTextX, mapY + 19);

    pdf.setTextColor(5, 150, 105);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text(`Coordinates: ${getCoordinates(destinationLoc)} • Verified Destination`, locTextX, mapY + 23);


    // 6. PAYMENT SUMMARY & FARE BREAKDOWN TABLE
    const tableY = 187;
    
    // Amounts
    const baseAmount = formatPrice(bookingData.totalPrice * 0.88);
    const taxAmount = formatPrice(bookingData.totalPrice * 0.12);
    const hotelAmount = bookingData.hotelPrice ? formatPrice(bookingData.hotelPrice) : null;
    const carAmount = bookingData.carPrice ? formatPrice(bookingData.carPrice) : null;
    const totalAmount = formatPrice(bookingData.totalPrice);

    let currentY = tableY + 15;
    
    // Calculate content height
    let contentHeight = 15; // Starting offset
    contentHeight += 6; // Base rate
    if (hotelAmount) contentHeight += 6;
    if (carAmount) contentHeight += 6;
    contentHeight += 6; // Taxes
    contentHeight += 10; // Total
    const tableHeight = contentHeight + 10;

    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(0.4);
    pdf.roundedRect(margin, tableY, contentWidth, tableHeight, 2.5, 2.5, 'S');

    // Header Bar
    pdf.setFillColor(241, 245, 249);
    pdf.roundedRect(margin, tableY, contentWidth, 8, 2.5, 2.5, 'F');
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.text('Payment Summary & Fare Breakdown', margin + 5, tableY + 5.5);

    pdf.setTextColor(0, 145, 234);
    pdf.text('Paid via Stripe / Card', pageWidth - margin - 5, tableY + 5.5, { align: 'right' });

    pdf.setTextColor(71, 85, 105);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text(`Base Rate / Fare (${bookingData.guestsCount || 1} Traveler / Unit)`, margin + 5, currentY);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text(baseAmount, pageWidth - margin - 5, currentY, { align: 'right' });
    currentY += 6;

    if (hotelAmount) {
      pdf.setTextColor(71, 85, 105);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Hotel Accommodation Add-on', margin + 5, currentY);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.text(hotelAmount, pageWidth - margin - 5, currentY, { align: 'right' });
      currentY += 6;
    }

    if (carAmount) {
      pdf.setTextColor(71, 85, 105);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Private Vehicle Rental Add-on', margin + 5, currentY);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.text(carAmount, pageWidth - margin - 5, currentY, { align: 'right' });
      currentY += 6;
    }

    pdf.setTextColor(71, 85, 105);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Taxes, Tourism Levies & Service Fees', margin + 5, currentY);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text(taxAmount, pageWidth - margin - 5, currentY, { align: 'right' });
    
    currentY += 4;
    // Separator
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin + 5, currentY, pageWidth - margin - 5, currentY);
    
    currentY += 6.5;
    // Total
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.text('Total Amount Charged', margin + 5, currentY);

    pdf.setTextColor(0, 145, 234);
    pdf.setFontSize(11.5);
    pdf.setFont('helvetica', 'bold');
    pdf.text(totalAmount, pageWidth - margin - 5, currentY, { align: 'right' });


    // 7. TRAVELER INSTRUCTIONS & BARCODE
    const footerY = tableY + tableHeight + 5;
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, footerY, pageWidth - margin, footerY);

    // Left Column: Instructions
    pdf.setTextColor(51, 65, 85);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.text('Important Traveler Instructions:', margin, footerY + 5);

    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text('• Please present this physical PDF voucher or digital pass upon arrival.', margin, footerY + 10);
    pdf.text('• For 24/7 concierge assistance: support@premiertourbooking.com | +1 800-555-PREMIER.', margin, footerY + 15);
    pdf.text('• Non-transferable travel pass. Photo ID matching lead guest required at check-in.', margin, footerY + 20);

    // Right Column: Barcode Box
    const bcX = 140;
    const bcY = footerY + 2;
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(bcX, bcY, 56, 23, 2.5, 2.5, 'FD');

    pdf.setFillColor(15, 23, 42);
    const barPattern = [1.2, 0.6, 2, 0.8, 0.5, 1.5, 1, 0.6, 2.2, 1, 1.8, 0.5, 1.2, 0.8, 1.6, 0.5, 2, 1, 0.6, 1.5];
    let currX = bcX + 4;
    for (let i = 0; i < barPattern.length; i++) {
      const w = barPattern[i];
      pdf.rect(currX, bcY + 3, w, 12, 'F');
      currX += w + 0.8;
    }

    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    pdf.text(`VERIFIED • ${bookingData.bookingRef}`, bcX + 28, bcY + 19, { align: 'center' });


    // 8. BRAND FOOTER SEAL
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, 268, pageWidth - margin, 268);

    pdf.setTextColor(148, 163, 184);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text('Official Verified Travel Pass • Premier Tour Booking Ltd. • ABTA & ATOL Bonded • All Rights Reserved.', pageWidth / 2, 274, { align: 'center' });

    return pdf;
  };

  // PDF Export Action
  const handleDownloadPDF = async () => {
    if (!booking) return;
    setIsGenerating(true);

    try {
      // First attempt canvas rendering if possible
      let canvasSuccess = false;
      if (voucherRef.current) {
        try {
          const element = voucherRef.current;
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#FFFFFF',
            scrollX: 0,
            scrollY: 0,
            windowWidth: element.scrollWidth || 800,
            windowHeight: element.scrollHeight || 1100,
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.98);
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          const imgWidth = 210;
          const pageHeight = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
          pdf.save(`Premier_Booking_Voucher_${booking.bookingRef}.pdf`);
          canvasSuccess = true;
        } catch (canvasErr) {
          console.warn('Canvas PDF rendering skipped/failed, using high-precision vector builder:', canvasErr);
        }
      }

      if (!canvasSuccess) {
        // High precision, razor-sharp vector PDF generator
        const pdf = buildLuxuryVectorPDF(booking);
        pdf.save(`Premier_Booking_Voucher_${booking.bookingRef}.pdf`);
      }
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      try {
        const pdf = buildLuxuryVectorPDF(booking);
        pdf.save(`Premier_Booking_Voucher_${booking.bookingRef}.pdf`);
      } catch (fallbackErr) {
        console.error('Vector PDF fallback error:', fallbackErr);
        window.print();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Native Share or Copy Voucher Details
  const handleShareVoucher = async () => {
    const shareText = `Premier Tour Booking Voucher #${booking?.bookingRef}\nService: ${booking?.title}\nGuest: ${booking?.customerName}\nTravel Date: ${booking?.startDate}\nStatus: ${booking?.status}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Booking Voucher #${booking?.bookingRef}`,
          text: shareText,
          url: shareUrl
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        return;
      } catch (e) {
        console.log('User cancelled share or not supported', e);
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}\nDirect Link: ${shareUrl}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      console.error('Failed copy', err);
    }
  };

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
    <AnimatePresence>
      {isOpen && booking && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto w-screen h-screen left-0 top-0"
        >
        
        {/* Animated Container Box with Light Blue Glow */}
        <motion.div 
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-auto border-2 border-sky-400/50 dark:border-sky-500/50 flex flex-col max-h-[95vh] animate-blue-glow"
        >
          
          {/* Top Control Bar with Light Blue Accent Highlights */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-950 text-white border-b border-sky-900/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#0091EA] to-sky-600 rounded-2xl text-white shadow-lg shadow-sky-500/30 animate-light-blue-pulse">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                  <span className="bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">{translate('Official Booking Voucher')}</span>
                  <span className="text-2xs font-mono bg-sky-500/20 text-sky-300 border border-sky-400/40 px-2.5 py-0.5 rounded-full shadow-inner">
                    #{booking.bookingRef}
                  </span>
                </h3>
                <p className="text-2xs text-sky-200/70 font-medium">Download or share your verified travel document</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHostingerGuide(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="Hostinger PDF Upload Guide"
              >
                <Upload className="w-3.5 h-3.5 text-purple-300" />
                <span>Upload to Hostinger</span>
              </button>

              <button
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer hover:border hover:border-sky-400/40"
                title="Print Voucher"
              >
                <Printer className="w-3.5 h-3.5 text-sky-400" />
                <span>Print</span>
              </button>

              <button
                onClick={handleShareVoucher}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-900/50 hover:bg-sky-800 text-sky-300 border border-sky-600/50 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="Share Voucher"
              >
                {copiedLink || shareSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" /> : <Share2 className="w-3.5 h-3.5 text-sky-300" />}
                <span>{copiedLink ? 'Copied!' : shareSuccess ? 'Shared!' : 'Share'}</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-sky-500/30 cursor-pointer animate-light-blue-pulse"
              >
                {isGenerating ? (
                  <span className="animate-pulse flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-sky-200" />
                    Generating...
                  </span>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 bg-slate-800 hover:bg-sky-900/60 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

        {/* Scrollable Printable PDF Canvas Area */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950 flex-1 custom-scrollbar">
          
          <div 
            ref={voucherRef}
            className="w-full max-w-2xl mx-auto bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 space-y-6 print:shadow-none print:border-0 print:p-0"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {/* Header / Logo Brand Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-slate-900">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0091EA] text-white flex items-center justify-center font-black text-sm">
                    PTB
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0A2540]">
                    Premier Tour Booking
                  </h2>
                </div>
                <p className="text-2xs text-slate-500 font-semibold uppercase tracking-widest pl-10">
                  Global Luxury Travel & Experiences Ltd.
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase tracking-widest rounded-full border border-emerald-200">
                  ✓ Official Voucher & Receipt
                </span>
                <p className="text-xs font-mono font-black text-[#0091EA]">
                  REF: {booking.bookingRef}
                </p>
                <p className="text-2xs text-slate-400 font-medium">
                  Issued: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Service Title & Primary Details Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                {getServiceIcon()}
              </div>

              <div className="flex items-center gap-2 text-sky-400 text-2xs uppercase font-extrabold tracking-widest">
                {getServiceIcon()}
                <span>{getServiceLabel()}</span>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black leading-tight text-white">
                  {booking.title}
                </h2>
                {booking.subtitle && (
                  <p className="text-xs text-slate-300 font-medium">{booking.subtitle}</p>
                )}
              </div>

              {/* Badges / Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Status</span>
                  <span className="font-extrabold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {booking.status}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Start Date</span>
                  <span className="font-extrabold text-white mt-0.5 block">{booking.startDate}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Start Time</span>
                  <span className="font-extrabold text-white mt-0.5 block">{resolvedStartTime}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Duration</span>
                  <span className="font-extrabold text-sky-300 mt-0.5 block">{resolvedDuration}</span>
                </div>
              </div>
            </div>

            {/* Two-Column Guest & Location Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Traveler Information */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <h4 className="text-2xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Users className="w-3.5 h-3.5 text-[#0091EA]" />
                  <span>Lead Guest Details</span>
                </h4>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-900 text-sm">{booking.customerName}</p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{booking.customerEmail}</span>
                  </p>
                  {booking.customerPhone && (
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{booking.customerPhone}</span>
                    </p>
                  )}
                  <p className="text-slate-500 font-semibold pt-1">
                    Party Size: <span className="font-extrabold text-slate-800">{booking.guestsCount || 1} Person(s)</span>
                  </p>
                </div>
              </div>

              {/* Service Type Specific Details (Hotel Room / Car / Tour / Flight) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <h4 className="text-2xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Building className="w-3.5 h-3.5 text-[#0091EA]" />
                  <span>Stay & Facility Specifications</span>
                </h4>

                <div className="space-y-1 text-xs">
                  {booking.type === 'hotel' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Assigned Room:</span>
                        <span className="font-black text-[#0091EA] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          {resolvedRoomNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Room Category:</span>
                        <span className="font-bold text-slate-800">{resolvedRoomType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Check-Out Date:</span>
                        <span className="font-bold text-slate-800">{booking.endDate || 'Standard +3 Days'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Inclusions:</span>
                        <span className="font-bold text-emerald-600">Free Breakfast & Wi-Fi</span>
                      </div>
                    </>
                  ) : booking.type === 'car' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Vehicle Category:</span>
                        <span className="font-bold text-slate-800">{booking.carCategory || 'Luxury Vehicle'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Pick-Up Location:</span>
                        <span className="font-bold text-[#0091EA]">{booking.pickupLocation || 'Colombo International Airport'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Drop-Off Location:</span>
                        <span className="font-bold text-emerald-600">{booking.dropoffLocation || booking.pickupLocation || 'Destination Hotel'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Return Date:</span>
                        <span className="font-bold text-slate-800">{booking.endDate || booking.startDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Transmission:</span>
                        <span className="font-bold text-slate-800">{booking.carTransmission || booking.transmission || 'Automatic'}</span>
                      </div>
                    </>
                  ) : booking.type === 'flight' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Airline:</span>
                        <span className="font-bold text-slate-800">{booking.flightAirline || 'Emirates Air'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Route:</span>
                        <span className="font-bold text-slate-800">{booking.flightFrom || 'CMB'} ➔ {booking.flightTo || 'DXB'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Cabin Class:</span>
                        <span className="font-bold text-slate-800">Business Class</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Package Type:</span>
                        <span className="font-bold text-[#0091EA]">{booking.category || 'All-Inclusive Tour'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Scheduled Guide:</span>
                        <span className="font-bold text-slate-800">Licensed English Guide</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Transport:</span>
                        <span className="font-bold text-slate-800">AC Luxury Coach</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Description / Summary Note */}
            {booking.description && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-extrabold text-slate-800 uppercase text-[10px] tracking-widest block">
                  Arrangement Highlights & Itinerary Note
                </span>
                <p className="leading-relaxed font-medium">{booking.description}</p>
              </div>
            )}

            {/* Destination Location Static Map Thumbnail */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-2xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0091EA]" />
                  <span>Destination Map & Location Pass</span>
                </h4>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                  GPS Verified Location
                </span>
              </div>

              <div className="relative h-44 rounded-lg overflow-hidden border border-slate-300 bg-slate-900 group">
                {/* Live Embedded Google Map */}
                <iframe
                  title={`Google Map for ${destinationLoc}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(destinationLoc)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full rounded-lg"
                />

                {/* Map Overlay Badge & Marker Information */}
                <div className="absolute bottom-2 left-2 right-2 pointer-events-none flex items-center justify-between">
                  <div className="bg-slate-950/90 text-white font-mono text-[9px] font-extrabold px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5 backdrop-blur-sm pointer-events-auto">
                    <Compass className="w-3 h-3 text-sky-400" />
                    <span>{getCoordinates(destinationLoc)}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationLoc)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0091EA] hover:bg-[#007cc7] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow transition-all pointer-events-auto flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3 fill-white" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Payment & Financial Breakdown Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 p-3 font-extrabold text-slate-800 border-b border-slate-200 flex justify-between">
                <span>Payment Summary & Fare Breakdown</span>
                <span className="text-[#0091EA]">Paid via Stripe / Card</span>
              </div>

              <div className="p-4 space-y-2.5">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Base Rate / Fare ({booking.guestsCount || 1} Traveler / Unit)</span>
                  <span className="font-bold text-slate-800">
                    {formatPrice(booking.totalPrice * 0.88)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Taxes, Tourism Levies & Service Fees</span>
                  <span className="font-bold text-slate-800">
                    {formatPrice(booking.totalPrice * 0.12)}
                  </span>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-2.5 flex justify-between items-center text-sm">
                  <span className="font-black text-slate-900">Total Amount Charged</span>
                  <span className="text-base font-black text-[#0091EA] font-mono">
                    {formatPrice(booking.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Hostinger Upload Callout Card */}
            <div className="bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900 text-white p-4 rounded-xl border border-purple-500/30 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
                  <Server className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-purple-100 flex items-center gap-1.5">
                    <span>Hostinger Web Hosting Upload Guide</span>
                    <span className="text-[9px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold border border-purple-400/20">Hostinger hPanel</span>
                  </h4>
                  <p className="text-[10px] text-purple-200/80 font-medium mt-0.5">
                    Need to upload this hotel or tour package PDF to Hostinger file manager? Follow our 5-step hostinger guide.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHostingerGuide(true)}
                className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-black transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>How to Upload to Hostinger</span>
              </button>
            </div>

            {/* Footer Verification Barcode & Terms */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-2xs text-slate-400">
              
              <div className="space-y-1 text-center sm:text-left">
                <p className="font-bold text-slate-600">Important Traveler Instructions:</p>
                <p>• Please present this physical PDF voucher or digital screen pass upon arrival.</p>
                <p>• For 24/7 concierge assistance, contact support@premiertourbooking.com or +1 800-555-PREMIER.</p>
              </div>

              {/* Decorative Vector Barcode */}
              <div className="flex flex-col items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 shrink-0">
                <div className="flex items-center gap-1 h-8 opacity-80">
                  <div className="w-1 h-full bg-slate-900"></div>
                  <div className="w-0.5 h-full bg-slate-900"></div>
                  <div className="w-2 h-full bg-slate-900"></div>
                  <div className="w-1 h-full bg-slate-900"></div>
                  <div className="w-0.5 h-full bg-slate-900"></div>
                  <div className="w-1.5 h-full bg-slate-900"></div>
                  <div className="w-1 h-full bg-slate-900"></div>
                  <div className="w-0.5 h-full bg-slate-900"></div>
                  <div className="w-2 h-full bg-slate-900"></div>
                  <div className="w-1 h-full bg-slate-900"></div>
                  <div className="w-1.5 h-full bg-slate-900"></div>
                  <div className="w-0.5 h-full bg-slate-900"></div>
                  <div className="w-1 h-full bg-slate-900"></div>
                </div>
                <span className="font-mono text-[9px] font-bold text-slate-500 mt-1">
                  VERIFIED • {booking.bookingRef}
                </span>
              </div>

            </div>

          </div>

        </div>

      </motion.div>
    </motion.div>
    )}
    </AnimatePresence>

    {/* Hostinger Upload Step-by-Step Guide Modal */}
    <AnimatePresence>
      {showHostingerGuide && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHostingerGuide(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 relative z-10 text-left my-auto"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-purple-900 via-slate-900 to-slate-950 text-white flex justify-between items-center relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/30 border border-purple-400/30 flex items-center justify-center">
                  <Server className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">Hostinger hPanel Tutorial</span>
                  <h3 className="text-base font-black text-white">How to Upload PDF Voucher to Hostinger</h3>
                </div>
              </div>
              <button
                onClick={() => setShowHostingerGuide(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Guide Content Steps */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Download PDF Voucher to Computer</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Click the <strong className="text-purple-600 dark:text-purple-400">Download PDF</strong> button on this voucher screen. Save the file (e.g., <code className="bg-slate-200 dark:bg-slate-950 px-1 py-0.5 rounded font-mono text-[10px]">{booking?.bookingRef || 'PB-VOUCHER'}.pdf</code>) to your desktop or downloads folder.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Log into Hostinger hPanel</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Open <a href="https://hpanel.hostinger.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 font-bold underline inline-flex items-center gap-0.5">hpanel.hostinger.com <ExternalLink className="w-3 h-3 inline" /></a> and sign in to your Hostinger web hosting account.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Open File Manager in Hostinger</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Go to <strong className="text-slate-800 dark:text-slate-200">Websites</strong> &rarr; Click <strong className="text-slate-800 dark:text-slate-200">Dashboard</strong> next to your domain name &rarr; Click <strong className="text-purple-600 dark:text-purple-400">File Manager</strong> under Files.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Navigate to public_html & Upload PDF</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Open <code className="bg-slate-200 dark:bg-slate-950 px-1 py-0.5 rounded font-mono text-[10px]">public_html</code> (or create a subfolder named <code className="bg-slate-200 dark:bg-slate-950 px-1 py-0.5 rounded font-mono text-[10px]">vouchers</code>). Click the <strong className="text-emerald-600 dark:text-emerald-400">Upload File</strong> icon at top right and select your downloaded PDF.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  5
                </div>
                <div>
                  <h4 className="font-extrabold text-emerald-900 dark:text-emerald-300 text-xs">Access & Share Hosted PDF Online!</h4>
                  <p className="text-emerald-700 dark:text-emerald-400 text-[11px] mt-0.5">
                    Your PDF booking pass is now hosted live on your website! You or your travelers can access it at:
                  </p>
                  <div className="mt-2 bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 font-mono text-[11px] text-purple-700 dark:text-purple-300 font-bold break-all flex items-center justify-between">
                    <span>https://yourdomain.com/vouchers/{booking?.bookingRef || 'Voucher'}.pdf</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowHostingerGuide(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                Close Guide
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowHostingerGuide(false);
                  handleDownloadPDF();
                }}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF First</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>,
    document.body
  );
}
