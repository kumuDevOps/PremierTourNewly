import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Compass, 
  Star, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Grid, 
  Map as MapIcon, 
  CheckCircle2,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { useLanguage } from '../lib/i18n.tsx';
import { useCurrency } from '../lib/CurrencyContext.tsx';

interface SpotHighlight {
  id: string;
  name: string;
  region: string;
  category: 'cultural' | 'wildlife' | 'beach' | 'hills';
  coordinates: { x: number; y: number }; // Percentage position on image (0..100)
  image: string;
  rating: number;
  reviewsCount: number;
  bestSeason: string;
  shortDescription: string;
  featuredTour: {
    id: number | string;
    title: string;
    duration: string;
    price: number;
    category: string;
  };
  highlights: string[];
}

interface InteractiveSriLankaMapProps {
  setCurrentPage: (page: string, params?: Record<string, string>) => void;
}

export default function InteractiveSriLankaMap({ setCurrentPage }: InteractiveSriLankaMapProps) {
  const { translate } = useLanguage();
  const { formatPrice } = useCurrency();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedSpotId, setSelectedSpotId] = useState<string>('sigiriya');
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');

  const spots: SpotHighlight[] = [
    {
      id: 'sigiriya',
      name: 'Sigiriya Lion Rock',
      region: 'Cultural Triangle',
      category: 'cultural',
      coordinates: { x: 48, y: 38 },
      image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80',
      rating: 4.95,
      reviewsCount: 1420,
      bestSeason: 'Jan - Aug',
      shortDescription: 'Ancient 5th-century rock fortress rising 200m above lush jungle, featuring UNESCO frescoes & mirror wall.',
      featuredTour: {
        id: 1,
        title: 'Sigiriya & Dambulla Heritage Tour',
        duration: '1 Day',
        price: 120,
        category: 'Heritage Tours'
      },
      highlights: ['UNESCO World Heritage', 'Ancient Frescoes', 'Mirror Wall', 'Panoramic Peak Views']
    },
    {
      id: 'kandy',
      name: 'Kandy Temple of Tooth',
      region: 'Central Highlands',
      category: 'cultural',
      coordinates: { x: 49, y: 52 },
      image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200',
      rating: 4.90,
      reviewsCount: 980,
      bestSeason: 'Year-Round',
      shortDescription: 'Sri Lanka’s cultural capital nestled around Kandy Lake, home to the sacred Tooth Relic of the Buddha.',
      featuredTour: {
        id: 5,
        title: 'Cultural Heritage Explorer',
        duration: '7 Days',
        price: 850,
        category: 'Heritage Tours'
      },
      highlights: ['Sacred Relic Temple', 'Royal Botanical Gardens', 'Kandy Lake Promenade', 'Traditional Esala Perahera']
    },
    {
      id: 'ella',
      name: 'Nine Arch Bridge & Ella Gap',
      region: 'Hill Country',
      category: 'hills',
      coordinates: { x: 62, y: 64 },
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&q=80',
      rating: 4.98,
      reviewsCount: 2150,
      bestSeason: 'Dec - May',
      shortDescription: 'Iconic colonial viaduct train bridge surrounded by emerald tea plantations and misty waterfall peaks.',
      featuredTour: {
        id: 7,
        title: 'Sri Lanka Tea Trail & Hiking',
        duration: '9 Days',
        price: 1100,
        category: 'Adventure'
      },
      highlights: ['Iconic Blue Train Ride', 'Nine Arch Demodara', 'Little Adam’s Peak Trek', 'Ravana Falls']
    },
    {
      id: 'yala',
      name: 'Yala National Park',
      region: 'Wild Southeast',
      category: 'wildlife',
      coordinates: { x: 71, y: 75 },
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80',
      rating: 4.92,
      reviewsCount: 1640,
      bestSeason: 'Feb - Jul',
      shortDescription: 'World-famous safari sanctuary boasting the highest density of wild leopards, elephants, and sloth bears.',
      featuredTour: {
        id: 3,
        title: 'Wild Sri Lanka Leopard Safari',
        duration: '3 Days',
        price: 450,
        category: 'Safari & Wildlife'
      },
      highlights: ['Sri Lankan Leopard Safaris', 'Wild Elephant Herds', 'Sloth Bears & Crocodiles', 'Private 4x4 Jeeps']
    },
    {
      id: 'mirissa',
      name: 'Mirissa & Southern Coast',
      region: 'Southern Province',
      category: 'beach',
      coordinates: { x: 45, y: 88 },
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      rating: 4.94,
      reviewsCount: 1890,
      bestSeason: 'Nov - Apr',
      shortDescription: 'Golden coconut beaches, turquoise surfing swells, coconut tree hill, and world-class Blue Whale ocean safaris.',
      featuredTour: {
        id: 4,
        title: 'Southern Coast & Beach Escape',
        duration: '10 Days',
        price: 1350,
        category: 'Beach Holidays'
      },
      highlights: ['Blue Whale Ocean Cruises', 'Coconut Tree Hill', 'Secret Beach Cove', 'Surfing & Seafood']
    },
    {
      id: 'galle',
      name: 'Galle Dutch Fort',
      region: 'South West Coast',
      category: 'cultural',
      coordinates: { x: 32, y: 84 },
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      rating: 4.88,
      reviewsCount: 1120,
      bestSeason: 'Nov - Apr',
      shortDescription: 'Preserved 17th-century Portuguese & Dutch fort ramparts with chic boutique cafes, lighthouse & ocean walks.',
      featuredTour: {
        id: 2,
        title: 'Luxury Sri Lanka Grand Tour',
        duration: '14 Days',
        price: 2400,
        category: 'Luxury Escapes'
      },
      highlights: ['Dutch Rampart Sunset Walk', 'Iconic White Lighthouse', 'Artisan Jewelry & Cafes', 'Colonial Architecture']
    },
    {
      id: 'trinco',
      name: 'Trincomalee & Pigeon Island',
      region: 'Eastern Shore',
      category: 'beach',
      coordinates: { x: 74, y: 28 },
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      rating: 4.91,
      reviewsCount: 750,
      bestSeason: 'May - Sep',
      shortDescription: 'Untouched turquoise waters on the east coast with coral reef marine reserves, turtles & Koneswaram Temple.',
      featuredTour: {
        id: 6,
        title: 'East Coast Beach Paradise',
        duration: '12 Days',
        price: 1200,
        category: 'Beach Holidays'
      },
      highlights: ['Pigeon Island Snorkeling', 'Koneswaram Cliff Temple', 'Nilaveli Crystal Waters', 'Dolphin Watching']
    },
    {
      id: 'nuwaraeliya',
      name: 'Nuwara Eliya Tea Country',
      region: 'Central Mountains',
      category: 'hills',
      coordinates: { x: 54, y: 58 },
      image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200',
      rating: 4.89,
      reviewsCount: 890,
      bestSeason: 'Feb - May',
      shortDescription: 'Little England hill station surrounded by rolling tea plantations, cool mountain air & colonial bungalows.',
      featuredTour: {
        id: 10,
        title: 'Misty Hills Meditation & Tea Spa',
        duration: '6 Days',
        price: 1650,
        category: 'Wellness'
      },
      highlights: ['Ceylon Tea Estate Tasting', 'Horton Plains World’s End', 'Gregory Lake Boating', 'High Tea at Grand Hotel']
    },
    {
      id: 'jaffna',
      name: 'Jaffna Cultural Kingdom',
      region: 'Northern Peninsula',
      category: 'cultural',
      coordinates: { x: 42, y: 15 },
      image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&q=80',
      rating: 4.87,
      reviewsCount: 640,
      bestSeason: 'May - Sep',
      shortDescription: 'Vibrant Tamil heritage city featuring Nallur Kandaswamy Kovil, Jaffna Fort, and tranquil island archipelagos.',
      featuredTour: {
        id: 11,
        title: 'Northern Kingdom Heritage Odyssey',
        duration: '5 Days',
        price: 920,
        category: 'Heritage Tours'
      },
      highlights: ['Nallur Kovil Festival', 'Jaffna Fort', 'Delft Island Wild Horses', 'Keerimalai Springs']
    },
    {
      id: 'anuradhapura',
      name: 'Anuradhapura Sacred City',
      region: 'North Central Province',
      category: 'cultural',
      coordinates: { x: 44, y: 30 },
      image: 'https://images.unsplash.com/photo-1609825488888-3a766db05542?w=800&q=80',
      rating: 4.93,
      reviewsCount: 1150,
      bestSeason: 'Year-Round',
      shortDescription: 'First ancient capital of Sri Lanka featuring massive 2,000-year-old stupas and the sacred Jaya Sri Maha Bodhi tree.',
      featuredTour: {
        id: 12,
        title: 'Ancient Sacred Capitals Tour',
        duration: '4 Days',
        price: 680,
        category: 'Heritage Tours'
      },
      highlights: ['Ruwanwelisaya Stupa', 'Jaya Sri Maha Bodhi', 'Abhayagiri Monastery', 'Twin Ponds Kuttam Pokuna']
    },
    {
      id: 'polonnaruwa',
      name: 'Polonnaruwa Ancient Ruins',
      region: 'North Central East',
      category: 'cultural',
      coordinates: { x: 62, y: 36 },
      image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80',
      rating: 4.91,
      reviewsCount: 910,
      bestSeason: 'May - Sep',
      shortDescription: 'Medieval royal kingdom with towering Gal Vihara rock sculptures and magnificent Parakrama Samudra reservoir.',
      featuredTour: {
        id: 13,
        title: 'Medieval Royal Kingdom Cycling',
        duration: '2 Days',
        price: 340,
        category: 'Heritage Tours'
      },
      highlights: ['Gal Vihara Carved Buddhas', 'Royal Palace Ruins', 'Vatadage Shrine', 'Parakrama Samudra']
    },
    {
      id: 'dambulla',
      name: 'Dambulla Cave Temple',
      region: 'Central Province',
      category: 'cultural',
      coordinates: { x: 48, y: 41 },
      image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?w=800&q=80',
      rating: 4.89,
      reviewsCount: 1280,
      bestSeason: 'Year-Round',
      shortDescription: 'Largest cave temple complex in Sri Lanka with 153 Buddha statues and intricate ancient ceiling wall murals.',
      featuredTour: {
        id: 14,
        title: 'Golden Cave & Spice Trail',
        duration: '2 Days',
        price: 290,
        category: 'Heritage Tours'
      },
      highlights: ['Golden Cave Temples', '153 Buddha Statues', 'Matale Spice Gardens', 'Panoramic Jungle Overlook']
    },
    {
      id: 'pasikudah',
      name: 'Pasikudah Bay',
      region: 'Eastern Shore',
      category: 'beach',
      coordinates: { x: 78, y: 44 },
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      rating: 4.90,
      reviewsCount: 820,
      bestSeason: 'Apr - Oct',
      shortDescription: 'Shallow crystal lagoon where you can walk out 1km into the warm turquoise Indian Ocean waters safely.',
      featuredTour: {
        id: 15,
        title: 'East Coast Luxury Lagoon Retreat',
        duration: '6 Days',
        price: 990,
        category: 'Beach Holidays'
      },
      highlights: ['Shallow Coral Bay Walk', 'Luxury Beachfront Resorts', 'Sunset Catamaran Cruise', 'Water Sports']
    },
    {
      id: 'arugambay',
      name: 'Arugam Bay Surf Haven',
      region: 'East Coast',
      category: 'beach',
      coordinates: { x: 80, y: 60 },
      image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
      rating: 4.96,
      reviewsCount: 1730,
      bestSeason: 'May - Sep',
      shortDescription: 'World Top 10 surf point featuring legendary right-hand point breaks, bohemian beach cafes, and Kumana safari.',
      featuredTour: {
        id: 16,
        title: 'Arugam Bay Surf & Safari Expedition',
        duration: '7 Days',
        price: 1050,
        category: 'Adventure'
      },
      highlights: ['Main Point Right Break', 'Elephant Rock Sunset', 'Kumana Bird Safari', 'Beachfront Cafe Vibe']
    },
    {
      id: 'colombo',
      name: 'Colombo Ocean Capital',
      region: 'West Coast',
      category: 'cultural',
      coordinates: { x: 28, y: 58 },
      image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&q=80',
      rating: 4.86,
      reviewsCount: 1540,
      bestSeason: 'Nov - Apr',
      shortDescription: 'Dynamic oceanfront metropolis blending high-rise luxury, colonial Pettah bazaars, and Lotus Tower views.',
      featuredTour: {
        id: 17,
        title: 'Colombo City Heritage & Fine Dining',
        duration: '1 Day',
        price: 150,
        category: 'City Tours'
      },
      highlights: ['Galle Face Green Promenade', 'Lotus Tower Observation', 'Gangaramaya Temple', 'Dutch Hospital Shopping']
    },
    {
      id: 'negombo',
      name: 'Negombo Lagoon & Beach',
      region: 'Northwest Coast',
      category: 'beach',
      coordinates: { x: 27, y: 52 },
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      rating: 4.85,
      reviewsCount: 960,
      bestSeason: 'Nov - Apr',
      shortDescription: 'Charming coastal town famed for historic Dutch canals, colorful catamaran fishing fleets, and sandy beaches.',
      featuredTour: {
        id: 18,
        title: 'Dutch Canal Boat Safari & Beach',
        duration: '1 Day',
        price: 110,
        category: 'Beach Holidays'
      },
      highlights: ['Dutch Canal Boat Cruise', 'Lellama Fish Market', 'Golden Sands Beach', 'Seafood Sunset Dining']
    },
    {
      id: 'bentota',
      name: 'Bentota Water Sports Resort',
      region: 'Southwest Coast',
      category: 'beach',
      coordinates: { x: 30, y: 70 },
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      rating: 4.89,
      reviewsCount: 1320,
      bestSeason: 'Nov - Apr',
      shortDescription: 'Premier beach resort enclave boasting Madu Ganga mangrove boat safaris, turtle hatcheries, and jet-skiing.',
      featuredTour: {
        id: 19,
        title: 'Bentota Water Sports & River Safari',
        duration: '3 Days',
        price: 420,
        category: 'Beach Holidays'
      },
      highlights: ['Madu River Mangrove Safari', 'Kosgoda Turtle Conservation', 'Brief Garden Estate', 'Jet Skiing & Banana Boat']
    },
    {
      id: 'hambantota',
      name: 'Hambantota & Bundala',
      region: 'South Southeast',
      category: 'wildlife',
      coordinates: { x: 62, y: 82 },
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80',
      rating: 4.88,
      reviewsCount: 680,
      bestSeason: 'Dec - Apr',
      shortDescription: 'Coastal wilderness hub home to UNESCO Bundala Flamingo Wetland Reserve and luxury golf beach resorts.',
      featuredTour: {
        id: 20,
        title: 'Bundala Wetland Bird & Safari Escapes',
        duration: '4 Days',
        price: 580,
        category: 'Safari & Wildlife'
      },
      highlights: ['Bundala Flamingo Reserve', 'Shangri-La Golf Course', 'Salt Pan Lagoons', 'Coastal Dunes']
    }
  ];

  const filteredSpots = spots.filter(s => activeCategory === 'all' || s.category === activeCategory);
  const selectedSpot = spots.find(s => s.id === selectedSpotId) || spots[0];

  return (
    <section id="interactive-sri-lanka-map" className="py-20 bg-gradient-to-b from-sky-50/70 via-white to-sky-50/90 dark:bg-slate-950 border-t border-b border-sky-200/80 dark:border-sky-900/40 relative overflow-hidden">
      
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-1/4 left-10 w-[550px] h-[550px] bg-sky-300/20 dark:bg-[#0091EA]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-teal-300/20 dark:bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0091EA] via-sky-500 to-teal-400 px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-md shadow-sky-500/20 mb-3 border border-sky-300/40">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{translate('Geographic Travel Guide')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {translate('EXPLORE SRI LANKA')} <span className="bg-gradient-to-r from-[#0091EA] via-sky-500 to-teal-500 bg-clip-text text-transparent">{translate('HIGHLIGHTS')}</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2 max-w-xl">
              {translate('Click or hover over famous locations across the island to discover curated luxury tours and signature travel experiences.')}
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-3">
            <div className="bg-white/90 dark:bg-slate-900/90 p-1.5 rounded-2xl border-2 border-sky-200 dark:border-sky-800 shadow-md flex items-center backdrop-blur-md">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  viewMode === 'map' 
                    ? 'bg-gradient-to-r from-[#0091EA] to-sky-500 text-white shadow-md font-black' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>{translate('Interactive Map')}</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-[#0091EA] to-sky-500 text-white shadow-md font-black' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>{translate('Grid View')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {[
            { id: 'all', label: 'All Highlights' },
            { id: 'cultural', label: 'Cultural & Historic' },
            { id: 'wildlife', label: 'Wildlife & Safaris' },
            { id: 'beach', label: 'Beaches & Surfing' },
            { id: 'hills', label: 'Tea & Hill Country' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#0091EA] to-sky-500 text-white font-black shadow-lg shadow-sky-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-sky-200 dark:border-sky-800 hover:border-[#0091EA]'
              }`}
            >
              {translate(cat.label)}
            </button>
          ))}
        </div>

        {viewMode === 'map' ? (
          /* MAP VIEW WITH SRI LANKA SHAPE IMAGE AND OVERLAY PINS */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Sri Lanka Image Map Container */}
            <div className="lg:col-span-7 relative group flex flex-col justify-between">
              
              {/* Outer Soft Ambient Glow */}
              <div className="absolute -inset-1 rounded-[38px] bg-gradient-to-r from-[#0091EA] via-sky-400 to-teal-300 opacity-30 blur-xl group-hover:opacity-60 transition-opacity duration-700 pointer-events-none animate-pulse-slow" />

              <div className="relative bg-gradient-to-b from-white via-sky-50/50 to-sky-100/40 dark:from-slate-950 dark:via-sky-950 dark:to-slate-900 rounded-[36px] border-2 border-sky-200 dark:border-sky-700/60 p-6 shadow-[0_20px_50px_rgba(2,132,199,0.12)] flex flex-col justify-between overflow-hidden min-h-[580px]">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between z-20 mb-2">
                  <div className="bg-white/90 dark:bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-300 dark:border-sky-500/40 text-[#0091EA] dark:text-[#2FC8FF] flex items-center gap-2 text-[11px] font-mono shadow-md">
                    <Compass className="w-3.5 h-3.5 animate-spin-slow text-[#0091EA]" />
                    <span className="font-extrabold uppercase tracking-widest">SRI LANKA MAP OVERVIEW</span>
                  </div>
                  <span className="text-[10px] font-mono text-sky-700 dark:text-sky-400/60 font-semibold hidden sm:block">
                    LAT: 7.8731° N | LON: 80.7718° E
                  </span>
                </div>

                {/* Sri Lanka Image with Interactive Hotspot Pins Overlay */}
                <div className="relative w-full max-w-md mx-auto aspect-[3/4] my-auto flex items-center justify-center py-4">
                  
                  {/* Real Sri Lanka Shape Image */}
                  <img
                    src="/shapeofsrilanka.jpg"
                    alt="Sri Lanka Map"
                    className="w-full h-full object-contain drop-shadow-[0_15px_35px_rgba(0,145,234,0.3)] rounded-2xl select-none pointer-events-none"
                  />

                  {/* Interactive Hotspot Pins Overlay */}
                  {filteredSpots.map((spot) => {
                    const isSelected = spot.id === selectedSpot.id;
                    return (
                      <motion.div
                        key={spot.id}
                        style={{
                          left: `${spot.coordinates.x}%`,
                          top: `${spot.coordinates.y}%`
                        }}
                        onClick={() => setSelectedSpotId(spot.id)}
                        onMouseEnter={() => setSelectedSpotId(spot.id)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
                        whileHover={{ scale: 1.15 }}
                      >
                        {/* Pulse Ring */}
                        <span className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${isSelected ? 'bg-amber-400' : 'bg-[#0091EA]'}`} />

                        {/* Marker Icon */}
                        <div className={`relative w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                          isSelected 
                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 scale-125 ring-4 ring-amber-400/60 shadow-[0_0_20px_#fbbf24]' 
                            : 'bg-gradient-to-r from-[#0091EA] to-sky-500 text-white hover:bg-sky-400 border border-white shadow-[0_4px_14px_rgba(0,145,234,0.4)]'
                        }`}>
                          <MapPin className="w-4 h-4" />
                        </div>

                        {/* Floating Label */}
                        <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 pointer-events-none shadow-lg border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-amber-400 opacity-100 scale-100 font-extrabold'
                            : 'bg-white/95 text-slate-900 border-sky-200 dark:border-sky-700 opacity-0 group-hover:opacity-100 group-hover:scale-100'
                        }`}>
                          {translate(spot.name)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-sky-200 dark:border-sky-800 text-xs text-slate-700 dark:text-sky-200 font-semibold z-20">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24] animate-pulse" />
                    {translate('Selected Location')}: <strong className="text-slate-900 dark:text-white font-bold ml-1">{selectedSpot.name}</strong>
                  </span>
                  <span className="text-[#0091EA] font-mono font-bold">{filteredSpots.length} {translate('Destination Spots')}</span>
                </div>
              </div>
            </div>

            {/* Selected Location Details Card Column */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSpot.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-[36px] border-2 border-sky-200 dark:border-sky-800 p-6 md:p-8 shadow-2xl flex flex-col justify-between h-full relative overflow-hidden"
                >
                  <div>
                    {/* Location Image Banner */}
                    <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-6 shadow-xl border border-sky-200 dark:border-sky-800">
                      <img 
                        src={selectedSpot.image} 
                        alt={selectedSpot.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-sky-400/30 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#0091EA]" />
                        <span>{translate(selectedSpot.region)}</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <div className="flex items-center gap-1 bg-amber-500/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-black shadow-md">
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>{selectedSpot.rating}</span>
                          <span className="text-[10px] opacity-80">({selectedSpot.reviewsCount})</span>
                        </div>
                        <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 text-sky-200 border border-sky-400/30">
                          <Calendar className="w-3 h-3 text-[#0091EA]" />
                          <span>{translate('Best')}: {selectedSpot.bestSeason}</span>
                        </div>
                      </div>
                    </div>

                    {/* Spot Title & Summary */}
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                      {translate(selectedSpot.name)}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6">
                      {translate(selectedSpot.shortDescription)}
                    </p>

                    {/* Key Highlights Tags */}
                    <div className="mb-6">
                      <p className="text-[10px] uppercase font-black tracking-widest text-[#0091EA] mb-2">{translate('Spot Highlights')}:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpot.highlights.map((h, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-800"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            {translate(h)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Featured Matching Tour Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-4 rounded-2xl border border-sky-400/30 mb-6 shadow-xl relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-md border border-sky-400/30">
                          {translate('Featured Tour')}
                        </span>
                        <span className="text-[10px] font-bold text-sky-300">{selectedSpot.featuredTour.category}</span>
                      </div>
                      <h4 className="text-sm font-black text-white mt-1 leading-snug">
                        {translate(selectedSpot.featuredTour.title)}
                      </h4>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-sky-800/60 text-xs">
                        <span className="text-sky-200 font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#0091EA]" />
                          {selectedSpot.featuredTour.duration}
                        </span>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">{translate('From')}</span>
                          <span className="text-lg font-black text-amber-400">{formatPrice(selectedSpot.featuredTour.price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setCurrentPage('tour', { id: selectedSpot.featuredTour.id.toString() })}
                      className="flex-1 py-3.5 bg-gradient-to-r from-[#0091EA] via-sky-500 to-teal-400 hover:from-[#007cc7] hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <span>{translate('Book Tour for this Spot')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        ) : (
          /* GRID VIEW LAYOUT */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSpots.map((spot) => (
              <div 
                key={spot.id}
                className="group bg-white dark:bg-slate-900 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/80 p-4 shadow-xl hover:shadow-2xl hover:border-[#0091EA] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-sky-200 dark:border-sky-800">
                    <img 
                      src={spot.image} 
                      alt={spot.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 border border-sky-400/30">
                      <MapPin className="w-3 h-3 text-[#0091EA]" />
                      <span>{translate(spot.region)}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 leading-snug">
                    {translate(spot.name)}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2 mb-4">
                    {translate(spot.shortDescription)}
                  </p>
                </div>

                <div className="pt-3 border-t border-sky-100 dark:border-sky-900/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">{translate('From')}</span>
                    <span className="text-base font-black text-[#0091EA]">{formatPrice(spot.featuredTour.price)}</span>
                  </div>

                  <button
                    onClick={() => setCurrentPage('tour', { id: spot.featuredTour.id.toString() })}
                    className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#0091EA] to-sky-500 text-white font-black flex items-center justify-center hover:bg-sky-600 transition-colors cursor-pointer shadow-md"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
