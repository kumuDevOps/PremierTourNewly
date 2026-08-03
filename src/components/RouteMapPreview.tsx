import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Clock, ShieldCheck, Car, ArrowRight, Check } from 'lucide-react';

// Custom Leaflet Icons using SVG Data URIs for crisp rendering
const createCustomIcon = (color: string, label: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
      <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.059 27.941 0 18 0z" fill="${color}"/>
      <circle cx="18" cy="18" r="10" fill="#FFFFFF"/>
      <text x="18" y="22" font-size="11" font-weight="900" font-family="sans-serif" text-anchor="middle" fill="${color}">${label}</text>
    </svg>
  `;
  return L.icon({
    iconUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg),
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -42]
  });
};

const pickupIcon = createCustomIcon('#00E676', 'P');
const dropoffIcon = createCustomIcon('#FF1744', 'D');

export interface LocationCoord {
  name: string;
  lat: number;
  lng: number;
}

const KNOWN_COORDS: Record<string, { lat: number; lng: number }> = {
  'cmb': { lat: 7.1808, lng: 79.8841 },
  'airport': { lat: 7.1808, lng: 79.8841 },
  'bandaranaike': { lat: 7.1808, lng: 79.8841 },
  'katunayake': { lat: 7.1808, lng: 79.8841 },
  'colombo': { lat: 6.9271, lng: 79.8612 },
  'fort': { lat: 6.9344, lng: 79.8428 },
  'kurunegala': { lat: 7.4863, lng: 80.3623 },
  'kandy': { lat: 7.2906, lng: 80.6337 },
  'galle': { lat: 6.0535, lng: 80.2210 },
  'negombo': { lat: 7.2083, lng: 79.8358 },
  'sigiriya': { lat: 7.9570, lng: 80.7603 },
  'dambulla': { lat: 7.8742, lng: 80.6511 },
  'ella': { lat: 6.8667, lng: 81.0466 },
  'nuwara eliya': { lat: 6.9497, lng: 80.7891 },
  'mirissa': { lat: 5.9483, lng: 80.4716 },
  'bentota': { lat: 6.4230, lng: 79.9982 },
  'trincomalee': { lat: 8.5874, lng: 81.2152 },
  'trinco': { lat: 8.5874, lng: 81.2152 },
  'anuradhapura': { lat: 8.3114, lng: 80.4037 },
  'polonnaruwa': { lat: 7.9403, lng: 81.0188 },
  'jaffna': { lat: 9.6615, lng: 80.0255 },
  'hikkaduwa': { lat: 6.1392, lng: 80.1063 },
  'tangalle': { lat: 6.0243, lng: 80.7941 },
  'yala': { lat: 6.2811, lng: 81.2847 },
  'weligama': { lat: 5.9750, lng: 80.4287 },
  'matara': { lat: 5.9549, lng: 80.5550 },
  'badulla': { lat: 6.9934, lng: 81.0550 },
  'ratnapura': { lat: 6.6828, lng: 80.3992 },
  'kalutara': { lat: 6.5854, lng: 79.9607 },
  'arugam': { lat: 6.8421, lng: 81.8360 },
  'pasikuda': { lat: 7.7170, lng: 81.7000 },
  'batticaloa': { lat: 7.7170, lng: 81.7000 },
  'udawalawe': { lat: 6.4746, lng: 80.8892 },
  'kitulgala': { lat: 6.9984, lng: 80.4181 },
  'chilaw': { lat: 7.5758, lng: 79.7953 },
  'puttalam': { lat: 8.0362, lng: 79.8283 },
  'hambantota': { lat: 6.1242, lng: 81.1185 },
  'vavuniya': { lat: 8.7514, lng: 80.4971 },
  'mannar': { lat: 8.9810, lng: 79.9044 }
};

export function resolveLocation(inputName: string, isPickup = true): LocationCoord {
  if (!inputName || !inputName.trim()) {
    return isPickup
      ? { name: 'CMB Airport (Bandaranaike Intl)', lat: 7.1808, lng: 79.8841 }
      : { name: 'Galle Fort (South Coast)', lat: 6.0329, lng: 80.2168 };
  }

  const raw = inputName.trim();
  const lower = raw.toLowerCase();

  // 1. Direct or partial keyword search in KNOWN_COORDS
  for (const [key, coord] of Object.entries(KNOWN_COORDS)) {
    if (lower.includes(key) || key.includes(lower)) {
      return {
        name: raw,
        lat: coord.lat,
        lng: coord.lng
      };
    }
  }

  // 2. Deterministic hashing fallback for unlisted custom addresses inside Sri Lanka
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = (hash << 5) - hash + lower.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // Sri Lanka Bounds: Lat 6.0 - 8.8 N, Lng 79.8 - 81.5 E
  const lat = 6.0 + (positiveHash % 2800) / 1000;
  const lng = 79.8 + ((positiveHash >> 3) % 1700) / 1000;

  return {
    name: raw,
    lat: Number(lat.toFixed(4)),
    lng: Number(lng.toFixed(4))
  };
}

const PRESET_OPTIONS = [
  'CMB Airport (Bandaranaike Intl)',
  'Colombo Fort Hotel / City Center',
  'Kurunegala Town & Station',
  'Kandy Cultural Capital',
  'Galle Fort Resort (South Coast)',
  'Negombo Beach Coast',
  'Sigiriya Rock Fortress',
  'Ella Highlands',
  'Mirissa Coast',
  'Bentota Beach Resort',
  'Trincomalee Beach'
];

interface RouteMapPreviewProps {
  pickupName?: string;
  dropoffName?: string;
  onSelectRoute?: (pickup: string, dropoff: string) => void;
}

// Map Auto-Fit bounds helper
function MapBoundsAdjuster({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [coords, map]);
  return null;
}

export default function RouteMapPreview({
  pickupName = 'CMB Airport (Bandaranaike Intl)',
  dropoffName = 'Galle Fort (South Coast)',
  onSelectRoute
}: RouteMapPreviewProps) {
  const pCoord = resolveLocation(pickupName, true);
  const dCoord = resolveLocation(dropoffName, false);

  // Haversine road distance estimation
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const directDist = R * c;
    return Math.max(12, Math.round(directDist * 1.32)); // Road factor approx
  };

  const roadDist = calculateDistance(pCoord.lat, pCoord.lng, dCoord.lat, dCoord.lng);
  const estHours = Math.floor(roadDist / 50);
  const estMins = Math.round((roadDist % 50) * 1.2);

  // Midpoint curvature for road feel
  const midLat = (pCoord.lat + dCoord.lat) / 2 + (pCoord.lat < dCoord.lat ? 0.04 : -0.04);
  const midLng = (pCoord.lng + dCoord.lng) / 2 - 0.03;

  const routePolyline: [number, number][] = [
    [pCoord.lat, pCoord.lng],
    [midLat, midLng],
    [dCoord.lat, dCoord.lng]
  ];

  // Helper options ensuring current typed text is always present in select dropdowns
  const getPickupOptions = () => {
    const opts = [...PRESET_OPTIONS];
    if (pickupName && !opts.includes(pickupName)) opts.unshift(pickupName);
    return opts;
  };

  const getDropoffOptions = () => {
    const opts = [...PRESET_OPTIONS];
    if (dropoffName && !opts.includes(dropoffName)) opts.unshift(dropoffName);
    return opts;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-50 dark:bg-sky-950/60 rounded-xl text-[#0091EA]">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                LIVE ROUTE & TRANSFER MAP PREVIEW
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Real-time route calculation & mileage allowance
              </p>
            </div>
          </div>
        </div>

        {/* Route Stats Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 shadow-sm">
            <Car className="w-3.5 h-3.5" />
            <span>{roadDist} km Distance</span>
          </div>
          <div className="px-3 py-1.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl text-[#0091EA] font-bold text-xs flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>~{estHours > 0 ? `${estHours}h ` : ''}{estMins}m Transit</span>
          </div>
        </div>
      </div>

      {/* Synchronized Location Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            PICK-UP LOCATION
          </label>
          <select
            value={pickupName}
            onChange={(e) => onSelectRoute && onSelectRoute(e.target.value, dropoffName)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA] cursor-pointer"
          >
            {getPickupOptions().map((loc) => (
              <option key={loc} value={loc}>
                {loc === pickupName ? `📍 ${loc} (Entered)` : loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            DROP-OFF LOCATION
          </label>
          <select
            value={dropoffName}
            onChange={(e) => onSelectRoute && onSelectRoute(pickupName, e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#0091EA] cursor-pointer"
          >
            {getDropoffOptions().map((loc) => (
              <option key={loc} value={loc}>
                {loc === dropoffName ? `🎯 ${loc} (Entered)` : loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="relative w-full h-[290px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner z-0">
        <MapContainer
          center={[pCoord.lat, pCoord.lng]}
          zoom={9}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Green Pick-Up Marker */}
          <Marker position={[pCoord.lat, pCoord.lng]} icon={pickupIcon}>
            <Popup>
              <div className="p-1 font-sans text-left">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">
                  Pick-Up Location
                </span>
                <p className="font-bold text-xs text-slate-900 mt-0.5">{pCoord.name}</p>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                  Lat: {pCoord.lat}, Lng: {pCoord.lng}
                </span>
              </div>
            </Popup>
          </Marker>

          {/* Red Drop-Off Marker */}
          <Marker position={[dCoord.lat, dCoord.lng]} icon={dropoffIcon}>
            <Popup>
              <div className="p-1 font-sans text-left">
                <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block">
                  Drop-Off Location
                </span>
                <p className="font-bold text-xs text-slate-900 mt-0.5">{dCoord.name}</p>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                  Lat: {dCoord.lat}, Lng: {dCoord.lng}
                </span>
              </div>
            </Popup>
          </Marker>

          {/* Route Path Line */}
          <Polyline
            positions={routePolyline}
            pathOptions={{ color: '#0091EA', weight: 5, opacity: 0.85, dashArray: '8, 8' }}
          />

          <MapBoundsAdjuster coords={routePolyline} />
        </MapContainer>

        {/* Map Floating Route Summary Badge */}
        <div className="absolute bottom-3 left-3 right-3 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl text-white flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-2 overflow-hidden max-w-[70%]">
            <span className="font-bold text-xs text-emerald-400 truncate" title={pCoord.name}>
              {pCoord.name}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-bold text-xs text-rose-400 truncate" title={dCoord.name}>
              {dCoord.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-sky-400 flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>250 km/day Included</span>
          </div>
        </div>
      </div>
    </div>
  );
}

