import { useLanguage } from '../lib/i18n';
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  MapPin as MapPinIcon, 
  Navigation as NavigationIcon, 
  Compass as CompassIcon, 
  Calendar as CalendarIcon, 
  Info as InfoIcon, 
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Layers,
  Globe,
  Maximize2,
  RefreshCw,
  Sparkles,
  Search
} from 'lucide-react';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Comprehensive Sri Lanka & Global Destination Geo-Coordinates Dictionary
const SRI_LANKA_GEO_DATABASE: Record<string, [number, number]> = {
  colombo: [6.9271, 79.8612],
  sigiriya: [7.9570, 80.7603],
  dambulla: [7.8742, 80.6511],
  kandy: [7.2906, 80.6337],
  'nuwara eliya': [6.9497, 80.7891],
  ella: [6.8667, 81.0466],
  yala: [6.3725, 81.5168],
  udawalawe: [6.4746, 80.8906],
  mirissa: [5.9483, 80.4716],
  galle: [6.0535, 80.2210],
  bentota: [6.4230, 79.9989],
  negombo: [7.2083, 79.8358],
  anuradhapura: [8.3114, 80.4037],
  polonnaruwa: [7.9403, 81.0188],
  trincomalee: [8.5874, 81.2152],
  pasikudah: [7.9228, 81.5645],
  'arugam bay': [6.8413, 81.8358],
  jaffna: [9.6615, 80.0255],
  pinnawala: [7.3015, 80.3847],
  habarana: [8.0347, 80.7516],
  hikkaduwa: [6.1392, 80.1063],
  sinharaja: [6.4028, 80.4578],
  kitulgala: [6.9984, 80.4137],
  hatton: [6.8329, 80.5982],
  badulla: [6.9934, 81.0550],
  tangalle: [6.0242, 80.7941],
  weligama: [5.9722, 80.4289],
  unawatuna: [6.0108, 80.2492],
  kalutara: [6.5854, 79.9607],
  wilpattu: [8.4552, 80.0573],
  knuckles: [7.4583, 80.7917],
  "adam's peak": [6.8096, 80.4993],
  sripada: [6.8096, 80.4993],
  horton: [6.8028, 80.8069],
  minneriya: [8.0333, 80.9000],
  kaudulla: [8.1389, 80.9167],
  ravana: [6.8667, 81.0466],
  matara: [5.9549, 80.5550],
  hambantota: [6.1241, 81.1185],
  haputale: [6.7681, 80.9572],
  bandarawela: [6.8333, 80.9833],
  ambewela: [6.8775, 80.8078],
  maldives: [4.3333, 73.5000],
  singapore: [1.2833, 103.8500],
  utah: [37.0658, -111.9056],
  'new york': [40.7644, -73.9744]
};

export interface Checkpoint {
  day: number;
  locationName: string;
  title: string;
  desc: string;
  coords: [number, number];
}

interface TourRouteMapProps {
  tourTitle: string;
  itineraryJson: string;
}

// MapFlyTo Controller for React Leaflet Mode
function MapController({ center, zoom, bounds }: { center?: [number, number]; zoom?: number; bounds?: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 13, { duration: 1.2, animate: true });
    } else if (bounds && bounds.length > 1) {
      try {
        const leafletBounds = L.latLngBounds(bounds.map(b => L.latLng(b[0], b[1])));
        map.fitBounds(leafletBounds, { padding: [50, 50], maxZoom: 13 });
      } catch (_) {}
    }
  }, [center, zoom, bounds, map]);
  return null;
}

// Function to calculate approximate distance between coordinates in km (Haversine formula)
function calculateTotalDistance(coords: [number, number][]): number {
  if (coords.length < 2) return 0;
  let total = 0;
  const R = 6371; // Earth radius in km
  for (let i = 0; i < coords.length - 1; i++) {
    const [lat1, lon1] = coords[i];
    const [lat2, lon2] = coords[i + 1];
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }
  return Math.round(total);
}

// Custom DivIcon creator for numbered route checkpoints
function createCheckpointIcon(number: number, isStart: boolean, isEnd: boolean, isSelected: boolean) {
  const bg = isSelected ? '#0091EA' : isStart ? '#10B981' : isEnd ? '#F59E0B' : '#0F172A';
  const label = isStart ? 'S' : isEnd ? 'E' : `${number}`;
  const scale = isSelected ? 'scale(1.2)' : 'scale(1)';
  const border = isSelected ? '3px solid #38BDF8' : '2.5px solid white';
  const shadow = isSelected ? '0 0 20px rgba(0,145,234,0.6)' : '0 4px 12px rgba(0,0,0,0.3)';
  
  const html = `
    <div style="
      background-color: ${bg};
      color: white;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 13px;
      border: ${border};
      box-shadow: ${shadow};
      transform: ${scale};
      transition: all 0.3s ease;
      position: relative;
    ">
      ${label}
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid ${bg};
      "></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-checkpoint-pin',
    iconSize: [34, 40],
    iconAnchor: [17, 40],
    popupAnchor: [0, -38]
  });
}

export default function TourRouteMap({ tourTitle, itineraryJson }: TourRouteMapProps) {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [activeCenter, setActiveCenter] = useState<[number, number]>([7.8731, 80.7718]);
  const [mapBounds, setMapBounds] = useState<[number, number][]>([]);
  
  // Interactive Map Controls State
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet'>('google');
  const [googleMapType, setGoogleMapType] = useState<'m' | 'k' | 'p' | 'h'>('m'); // m=roadmap, k=satellite, p=terrain, h=hybrid
  const [zoomLevel, setZoomLevel] = useState<number>(13);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rawDays: { day: number; title: string; desc: string; description?: string }[] = [];
    try {
      rawDays = typeof itineraryJson === 'string' ? JSON.parse(itineraryJson) : itineraryJson;
    } catch (e) {
      rawDays = [];
    }

    if (!Array.isArray(rawDays) || rawDays.length === 0) {
      setCheckpoints([]);
      return;
    }

    const parsedCheckpoints: Checkpoint[] = [];
    let prevCoords: [number, number] = [7.8731, 80.7718];

    rawDays.forEach((item: any) => {
      const titleLower = (item?.title || '').toLowerCase();
      const descLower = (item?.description || item?.desc || '').toLowerCase();
      const combinedText = `${titleLower} ${descLower}`;

      // Extract matching location from dictionary
      let matchedLocationName = '';
      let matchedCoords: [number, number] | null = null;

      for (const [key, coords] of Object.entries(SRI_LANKA_GEO_DATABASE)) {
        if (combinedText.includes(key)) {
          matchedLocationName = key.charAt(0).toUpperCase() + key.slice(1);
          matchedCoords = coords;
          break;
        }
      }

      // Fallback: Clean location name from item title
      if (!matchedCoords) {
        let cleanTitle = item.title || '';
        if (cleanTitle.includes(':')) {
          cleanTitle = cleanTitle.split(':')[1].trim();
        }
        matchedLocationName = cleanTitle;
        matchedCoords = [
          prevCoords[0] + (Math.random() * 0.12 - 0.06),
          prevCoords[1] + (Math.random() * 0.12 - 0.06)
        ];
      }

      prevCoords = matchedCoords;

      parsedCheckpoints.push({
        day: item.day || parsedCheckpoints.length + 1,
        title: item.title,
        desc: item.description || item.desc || '',
        locationName: matchedLocationName,
        coords: matchedCoords
      });
    });

    setCheckpoints(parsedCheckpoints);

    if (parsedCheckpoints.length > 0) {
      const coordsList = parsedCheckpoints.map(c => c.coords);
      setMapBounds(coordsList);
      setActiveCenter(coordsList[0]);
      setSelectedCheckpoint(parsedCheckpoints[0]);
    }
  }, [itineraryJson]);

  const polylinePositions = checkpoints.map(c => c.coords);
  const estDistanceKm = calculateTotalDistance(polylinePositions);

  const selectedIndex = checkpoints.findIndex(
    cp => cp.day === selectedCheckpoint?.day && cp.title === selectedCheckpoint?.title
  );

  const handleSelectCheckpoint = (cp: Checkpoint) => {
    setSelectedCheckpoint(cp);
    setActiveCenter(cp.coords);
  };

  const handleNextStop = () => {
    if (selectedIndex < checkpoints.length - 1) {
      const next = checkpoints[selectedIndex + 1];
      handleSelectCheckpoint(next);
    }
  };

  const handlePrevStop = () => {
    if (selectedIndex > 0) {
      const prev = checkpoints[selectedIndex - 1];
      handleSelectCheckpoint(prev);
    }
  };

  // Construct clean Google Maps Query
  const getCleanLocationQuery = (cp: Checkpoint | null): string => {
    if (!cp) return 'Sri Lanka';
    let loc = cp.locationName || cp.title || '';
    loc = loc.replace(/^Day\s*\d+\s*[:-]?\s*/i, '').trim();
    if (!loc.toLowerCase().includes('sri lanka')) {
      loc = `${loc}, Sri Lanka`;
    }
    return loc;
  };

  const currentSearchQuery = getCleanLocationQuery(selectedCheckpoint);

  if (checkpoints.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 p-8 shadow-xl text-center">
        <MapPinIcon className="w-10 h-10 text-[#0091EA] mx-auto mb-3 animate-bounce" />
        <h3 className="text-lg font-black text-gray-900 dark:text-white">{translate(`Processing Interactive Route Map`)}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">{translate(`Generating GPS checkpoint coordinates for this tour package...`)}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 p-5 md:p-8 shadow-xl shadow-sky-500/10 hover:border-[#0091EA] transition-all duration-300 space-y-5">
      
      {/* Route Header & Quick Specs Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-sky-100 dark:border-sky-900/50 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white text-[10px] uppercase font-black tracking-widest rounded-full shadow-md shadow-sky-500/20 flex items-center gap-1.5">
              <NavigationIcon className="w-3.5 h-3.5 text-white animate-pulse" /> {translate(`Live Dynamic Map`)}
            </span>
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
              {translate(`Auto-Sync Location`)}
            </span>
          </div>
          <h3 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {translate(`Tour Route & Interactive Checkpoints`)}
          </h3>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
            {translate(`Select any stop below to automatically focus and view live Google map details`)}
          </p>
        </div>

        {/* Engine Switcher & Distance Metrics */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Map Engine Toggle */}
          <div className="bg-slate-200/80 dark:bg-slate-800/90 p-1 rounded-2xl flex items-center gap-1 border border-slate-300/80 dark:border-slate-700">
            <button
              onClick={() => setMapEngine('google')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                mapEngine === 'google'
                  ? 'bg-[#0091EA] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{translate(`Google Map`)}</span>
            </button>
            <button
              onClick={() => setMapEngine('leaflet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                mapEngine === 'leaflet'
                  ? 'bg-[#0091EA] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{translate(`Vector Path`)}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-950 px-3.5 py-1.5 rounded-2xl border-2 border-sky-200 dark:border-sky-800 flex items-center gap-3 shadow-sm">
            <div className="text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{translate(`Stops`)}</span>
              <span className="text-xs font-black text-gray-900 dark:text-white">{checkpoints.length} Checkpoints</span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{translate(`Distance`)}</span>
              <span className="text-xs font-black text-[#0091EA]">~{estDistanceKm} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stop Selector Pills Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 dark:text-slate-400 px-1">
          <span className="flex items-center gap-1.5 uppercase text-2xs tracking-wider font-black text-[#0091EA]">
            <CompassIcon className="w-3.5 h-3.5 text-[#0091EA]" /> Click A Stop To Focus Map:
          </span>
          <span className="text-2xs font-mono font-bold text-slate-400">
            Stop {selectedIndex + 1} of {checkpoints.length}
          </span>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-sky-300 dark:scrollbar-thumb-sky-800"
        >
          {checkpoints.map((cp, idx) => {
            const isSelected = selectedCheckpoint?.day === cp.day && selectedCheckpoint?.title === cp.title;
            return (
              <button
                key={`stop-pill-${idx}`}
                onClick={() => handleSelectCheckpoint(cp)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#0091EA] to-sky-600 text-white border-[#0091EA] shadow-lg shadow-sky-500/30 scale-[1.03] ring-2 ring-sky-300 dark:ring-sky-700'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-700 hover:border-sky-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                  isSelected ? 'bg-white text-[#0091EA]' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {cp.day}
                </span>
                <span className="font-extrabold whitespace-nowrap">
                  {cp.locationName || `Day ${cp.day}`}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Visual Canvas Container */}
      <div className="relative w-full h-[420px] md:h-[520px] rounded-3xl overflow-hidden border-2 border-sky-200 dark:border-sky-900/60 shadow-2xl group bg-slate-950">
        
        {/* Floating Top Control Overlay Header */}
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Active Location Info Pill */}
          <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center gap-2.5 max-w-full">
            <div className="w-7 h-7 rounded-xl bg-[#0091EA] text-white font-black text-xs flex items-center justify-center shrink-0 border border-sky-400/30 shadow">
              D{selectedCheckpoint?.day || 1}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-sky-400 tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {translate(`GPS Auto Focus`)}
              </div>
              <h4 className="text-xs md:text-sm font-black text-white truncate max-w-[200px] sm:max-w-[320px]">
                {selectedCheckpoint?.locationName || selectedCheckpoint?.title}
              </h4>
            </div>
          </div>

          {/* Map Controls & Mode Switcher */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-xl">
            {mapEngine === 'google' && (
              <div className="flex items-center gap-1 px-1 border-r border-slate-800 pr-1.5">
                <button
                  onClick={() => setGoogleMapType('m')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                    googleMapType === 'm' ? 'bg-[#0091EA] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title={translate(`Roadmap View`)}
                >
                  {translate(`Map`)}
                </button>
                <button
                  onClick={() => setGoogleMapType('k')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                    googleMapType === 'k' ? 'bg-[#0091EA] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title={translate(`Satellite View`)}
                >
                  {translate(`Satellite`)}
                </button>
                <button
                  onClick={() => setGoogleMapType('p')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                    googleMapType === 'p' ? 'bg-[#0091EA] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title={translate(`Terrain View`)}
                >
                  {translate(`Terrain`)}
                </button>
              </div>
            )}

            {/* Google Directions External Link Button */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(currentSearchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black rounded-xl transition-all flex items-center gap-1 shadow cursor-pointer"
              title={translate(`Get Driving Directions in Google Maps`)}
            >
              <span>{translate(`Directions`)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Map Rendering Engine Switcher */}
        {mapEngine === 'google' ? (
          <iframe
            key={`gmap-${selectedCheckpoint?.day}-${googleMapType}-${zoomLevel}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(currentSearchQuery)}&t=${googleMapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full object-cover"
          ></iframe>
        ) : (
          <div className="w-full h-full relative z-0">
            <MapContainer
              center={activeCenter}
              zoom={zoomLevel}
              scrollWheelZoom={false}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">{translate(`CARTO`)}</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <MapController center={activeCenter} zoom={zoomLevel} bounds={mapBounds} />
              
              {/* Connected Route Polyline */}
              {polylinePositions.length > 1 && (
                <Polyline
                  positions={polylinePositions}
                  color="#0091EA"
                  weight={5}
                  opacity={0.8}
                  dashArray="8, 12"
                />
              )}

              {/* Numbered Stop Markers */}
              {checkpoints.map((cp, idx) => {
                const isSelected = selectedCheckpoint?.day === cp.day && selectedCheckpoint?.title === cp.title;
                const isStart = idx === 0;
                const isEnd = idx === checkpoints.length - 1;
                return (
                  <Marker
                    key={`m-${idx}`}
                    position={cp.coords}
                    icon={createCheckpointIcon(cp.day, isStart, isEnd, isSelected)}
                    eventHandlers={{
                      click: () => handleSelectCheckpoint(cp)
                    }}
                  >
                    <Popup className="custom-leaflet-popup">
                      <div className="p-1 font-sans">
                        <span className="text-[9px] font-black uppercase text-[#0091EA] block">Day {cp.day} Checkpoint</span>
                        <h5 className="font-extrabold text-xs text-slate-900 mt-0.5">{cp.title}</h5>
                        <p className="text-[10px] text-slate-600 mt-1 line-clamp-2">{cp.desc}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        )}

        {/* Floating Bottom Quick Navigation Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          {/* Previous Stop Button */}
          <button
            onClick={handlePrevStop}
            disabled={selectedIndex <= 0}
            className={`pointer-events-auto px-3.5 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md text-white border border-slate-700/80 text-xs font-black transition-all flex items-center gap-1.5 shadow-xl cursor-pointer ${
              selectedIndex <= 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#0091EA] hover:border-sky-400'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{translate(`Prev Stop`)}</span>
          </button>

          {/* Quick Zoom Buttons */}
          <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-xl flex items-center gap-1 text-white">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
              className="w-7 h-7 rounded-xl hover:bg-slate-800 flex items-center justify-center font-black text-sm cursor-pointer"
              title={translate(`Zoom In`)}
            >
              +
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1">z{zoomLevel}</span>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 1, 7))}
              className="w-7 h-7 rounded-xl hover:bg-slate-800 flex items-center justify-center font-black text-sm cursor-pointer"
              title={translate(`Zoom Out`)}
            >
              -
            </button>
          </div>

          {/* Next Stop Button */}
          <button
            onClick={handleNextStop}
            disabled={selectedIndex >= checkpoints.length - 1}
            className={`pointer-events-auto px-3.5 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md text-white border border-slate-700/80 text-xs font-black transition-all flex items-center gap-1.5 shadow-xl cursor-pointer ${
              selectedIndex >= checkpoints.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#0091EA] hover:border-sky-400'
            }`}
          >
            <span className="hidden sm:inline">{translate(`Next Stop`)}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Selected Checkpoint Detail Info Card */}
      {selectedCheckpoint && (
        <div className="bg-gradient-to-r from-sky-50/90 via-sky-50/50 to-white dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-900/90 rounded-2xl p-5 border-2 border-sky-200 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in shadow-md">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0091EA] to-sky-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20 border-2 border-white dark:border-slate-800">
              D{selectedCheckpoint.day}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xs uppercase font-black text-[#0091EA] tracking-wider bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                  Checkpoint {selectedCheckpoint.day} of {checkpoints.length}
                </span>
                <span className="text-2xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPinIcon className="w-3 h-3 text-emerald-500" />
                  {selectedCheckpoint.locationName}
                </span>
              </div>
              <h4 className="text-base md:text-lg font-black text-gray-900 dark:text-white mt-1">
                {selectedCheckpoint.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium leading-relaxed max-w-3xl">
                {selectedCheckpoint.desc}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById(`itinerary-day-${selectedCheckpoint.day}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="px-5 py-2.5 bg-[#0091EA] hover:bg-[#007cc7] text-white text-xs font-black rounded-xl transition-all shadow-md shadow-sky-500/20 shrink-0 self-start md:self-center flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
          >
            <span>{translate(`View Full Day Plan`)}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
