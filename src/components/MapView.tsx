import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface LocationItem {
  id: string | number;
  name: string;
  locationName: string;
  price: number;
  imageUrl?: string;
  type: 'hotel' | 'tour';
}

interface MapViewProps {
  items: LocationItem[];
  onMarkerClick?: (item: LocationItem) => void;
}

export default function MapView({ items, onMarkerClick }: MapViewProps) {
  const activeLocation = items.length > 0 ? items[0].locationName : 'Sri Lanka';
  const query = encodeURIComponent(activeLocation + ' Sri Lanka');

  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden border-2 border-sky-300 dark:border-sky-800/60 shadow-xl shadow-sky-500/10 relative z-0 group animate-blue-glow">
      <iframe
        title={`Google Maps - ${activeLocation}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${query}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
        className="w-full h-full rounded-3xl"
      ></iframe>
      
      {/* Floating Active Location Header */}
      <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-sky-400/40 text-xs font-black flex items-center gap-2 shadow-xl z-10">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <MapPin className="w-3.5 h-3.5 text-sky-400" />
        <span>Google Maps: {activeLocation}</span>
      </div>

      {/* External Directions & Link Button */}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 bg-slate-950/90 hover:bg-[#0091EA] text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-xl border border-sky-400/40 transition-all flex items-center gap-2 cursor-pointer z-10"
      >
        <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:text-white" />
        <span>Open in Google Maps</span>
      </a>
    </div>
  );
}
