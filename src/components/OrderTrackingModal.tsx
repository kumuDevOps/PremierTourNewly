import { useLanguage } from '../lib/i18n';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  X,
  Navigation,
  Phone,
  MessageCircle,
  Car,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Gauge,
  Fuel,
  MapPin,
  Sparkles,
  UserCheck
} from 'lucide-react';

// Custom car movement marker
const carIcon = L.icon({
  iconUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#0091EA" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 1 12v4c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/>
      <path d="M9 17h6"/>
      <circle cx="17" cy="17" r="2"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingRef?: string;
  carName?: string;
  customerName?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
}

export default function OrderTrackingModal({
  isOpen,
  onClose,
  bookingRef = 'CAR-8921A',
  carName = 'Mercedes Benz S-Class AMG',
  customerName = 'Valued Traveler',
  pickupLocation = 'CMB Bandaranaike International Airport',
  dropoffLocation = 'Kurunegala Town'
}: OrderTrackingModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(3); // 3 = Driver En Route
  const [driverPos, setDriverPos] = useState<[number, number]>([7.155, 79.870]);
  const [speed, setSpeed] = useState<number>(48);
  const [etaMins, setEtaMins] = useState<number>(11);

  // Animate driver moving closer to airport/pickup on interval
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setDriverPos((prev) => {
        const nextLat = prev[0] + 0.0012;
        const nextLng = prev[1] + 0.0008;
        return [nextLat, nextLng];
      });

      setSpeed(Math.floor(40 + Math.random() * 18));
      setEtaMins((prev) => (prev > 1 ? prev - 1 : 12));
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const STATUS_STEPS = [
    { id: 1, title: 'Booking Confirmed', desc: 'Vehicle reserved & sanitized' },
    { id: 2, title: 'Dispatched & Inspected', desc: 'Chauffeur assigned & ready' },
    { id: 3, title: 'Driver En Route', desc: `3.2 km away (~${etaMins} mins)` },
    { id: 4, title: 'Arrived at Pickup', desc: 'Chauffeur waiting with name card' },
    { id: 5, title: 'Handover Complete', desc: 'Journey in progress' }
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 rounded-2xl border border-sky-400/30 text-sky-400">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase rounded-full">
                  {translate(`Live Telematics Active`)}
                </span>
                <span className="text-xs text-slate-400 font-mono font-bold">Ref: #{bookingRef}</span>
              </div>
              <h2 className="text-lg font-black tracking-tight mt-0.5">{carName}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Progress Timeline */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
              {translate(`Real-time Order Progress Status`)}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
              {STATUS_STEPS.map((step) => {
                const isPassed = step.id <= currentStep;
                const isCurrent = step.id === currentStep;
                return (
                  <div key={step.id} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-start sm:text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all flex-shrink-0 ${
                        isCurrent
                          ? 'bg-[#0091EA] text-white ring-4 ring-sky-500/20 animate-bounce'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                    </div>
                    <div>
                      <span className={`block text-xs font-bold ${isPassed ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium leading-tight">
                        {step.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Map & Telematics Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Map Column (2 cols) */}
            <div className="lg:col-span-2 relative h-[260px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
              <MapContainer
                center={driverPos}
                zoom={12}
                scrollWheelZoom={false}
                className="w-full h-full z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={driverPos} icon={carIcon}>
                  <Popup>
                    <div className="p-1 font-sans">
                      <span className="text-[10px] font-black text-[#0091EA] uppercase">{translate(`Dispatched Driver`)}</span>
                      <p className="font-bold text-xs text-slate-900">Chaminda Silva (WP CAD-8899)</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>

              {/* Floating Live Speedometer */}
              <div className="absolute top-3 right-3 z-[400] bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black">{speed} km/h</span>
              </div>
            </div>

            {/* Telematics Metrics Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#0091EA] tracking-wider block mb-2">
                  {translate(`Live Telematics Telemetry`)}
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold">
                      <Clock className="w-4 h-4 text-sky-500" />
                      <span>{translate(`Estimated Arrival`)}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white">~{etaMins} mins</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold">
                      <Fuel className="w-4 h-4 text-amber-500" />
                      <span>{translate(`Fuel Level`)}</span>
                    </div>
                    <span className="text-xs font-black text-emerald-500">92% Full Tank</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>{translate(`Sanitization Check`)}</span>
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">{translate(`PASSED`)}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-100 dark:border-sky-900/50 text-[11px] text-slate-600 dark:text-slate-300 font-medium space-y-1">
                <div>
                  <span className="font-bold text-[#0091EA] block">Pick-Up Location:</span>
                  {pickupLocation}
                </div>
                <div>
                  <span className="font-bold text-rose-500 block">Drop-Off Destination:</span>
                  {dropoffLocation}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Driver Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
                alt="Chauffeur"
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-white">{translate(`Chaminda Silva`)}</h4>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-md border border-emerald-500/30">
                    4.98 ★ Senior Chauffeur
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Vehicle: <span className="text-sky-400 font-bold">{translate(`WP CAD-8899`)}</span> (English/German Speaking)
                </p>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="tel:+94771231234"
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-slate-700"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{translate(`Call Chauffeur`)}</span>
              </a>
              <a
                href="https://wa.me/94771231234"
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-600/30"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{translate(`WhatsApp`)}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
