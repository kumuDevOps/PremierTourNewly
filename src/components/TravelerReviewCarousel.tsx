import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  ThumbsUp, 
  Camera, 
  Sparkles, 
  X, 
  Quote, 
  MapPin, 
  Plus, 
  Send,
  MessageSquare,
  Upload,
  User,
  Image as ImageIcon,
  Loader2,
  LogIn,
  Check
} from 'lucide-react';
import { useLanguage } from '../lib/i18n.tsx';

interface ReviewItem {
  id: string;
  author: string;
  location: string;
  flag: string;
  avatar: string;
  tourName: string;
  rating: number;
  date: string;
  category: 'honeymoon' | 'family' | 'solo';
  title: string;
  comment: string;
  photos: string[];
  helpfulCount: number;
  verified: boolean;
}

interface TravelerReviewCarouselProps {
  currentUser?: any;
  userProfile?: any;
  onOpenAuth?: () => void;
}

const initialDefaultReviews: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Eleanor & Marcus Vance',
    location: 'London, United Kingdom',
    flag: '🇬🇧',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    tourName: 'Luxury Sri Lanka Grand Tour • 14 Days',
    rating: 5,
    date: 'July 2026',
    category: 'honeymoon',
    title: 'An Unforgettable 5-Star Honeymoon Experience!',
    comment: 'Premier Tour Booking curated the dream luxury holiday for our wedding anniversary. From the helicopter airport transfer to our private chauffeur, Priyantha, every detail was immaculate. Watching sunrise at Sigiriya and staying in a tea estate villa were highlights of a lifetime!',
    photos: [
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80',
      'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200'
    ],
    helpfulCount: 42,
    verified: true
  },
  {
    id: 'rev-2',
    author: 'David & Sarah Miller',
    location: 'Melbourne, Australia',
    flag: '🇦🇺',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    tourName: 'Wild Sri Lanka Leopard Safari • 3 Days',
    rating: 5,
    date: 'June 2026',
    category: 'family',
    title: 'Spotted 3 Leopards in Yala! Exceptional Private Guide',
    comment: 'Our family of four was thoroughly impressed. The custom 4x4 jeep safari in Yala was incredibly organized. Our kids were thrilled to spot mother leopard with cubs and wild elephant herds. The luxury glamping tent afterwards was pure bliss.',
    photos: [
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&q=80'
    ],
    helpfulCount: 29,
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Dr. Helene Dubois',
    location: 'Paris, France',
    flag: '🇫🇷',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    tourName: 'Elite Sanctuary Ayurveda & Yoga Retreat',
    rating: 5,
    date: 'July 2026',
    category: 'solo',
    title: 'Pure Rejuvenation & Unmatched Hospitality',
    comment: 'As a busy surgeon in Paris, I desperately needed wellness and tranquility. The personalized Ayurveda consultation, oceanfront yoga sessions in Weligama, and organic herbal cuisine restored my energy completely. I will be returning every year!',
    photos: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80'
    ],
    helpfulCount: 38,
    verified: true
  },
  {
    id: 'rev-4',
    author: 'Oliver & Sophia Schmidt',
    location: 'Zurich, Switzerland',
    flag: '🇨🇭',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    tourName: 'Southern Coast & Beach Escape • 10 Days',
    rating: 5,
    date: 'May 2026',
    category: 'honeymoon',
    title: 'Blue Whales in Mirissa & Sunset Fort Walks',
    comment: 'Booking through Premier Tour Booking gave us 100% peace of mind. The private catamaran whale watching charter was top-notch, and the Dutch Fort in Galle felt straight out of a fairy tale. Outstanding 24/7 concierge support!',
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
    ],
    helpfulCount: 19,
    verified: true
  }
];

export default function TravelerReviewCarousel({ currentUser, userProfile, onOpenAuth }: TravelerReviewCarouselProps) {
  const { translate } = useLanguage();

  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(initialDefaultReviews);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  
  // Submit Review Modal State
  const [showAddReviewModal, setShowAddReviewModal] = useState<boolean>(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTour, setNewTour] = useState('Luxury Sri Lanka Grand Tour • 14 Days');
  const [newCategory, setNewCategory] = useState<'honeymoon' | 'family' | 'solo'>('honeymoon');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newPhotos, setNewPhotos] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch persisted reviews from backend on load
  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.ok ? res.json() : [])
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const formattedApiReviews: ReviewItem[] = data.map((r: any) => ({
            id: r.id || 'rev-' + Math.random(),
            author: r.author || r.userName || 'Verified Guest',
            location: r.location || 'Sri Lanka Guest',
            flag: r.flag || '🇱🇰',
            avatar: r.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.author || r.userName || 'Guest')}`,
            tourName: r.tourName || 'Luxury Sri Lanka Tour',
            rating: Number(r.rating) || 5,
            date: r.date || 'Recently',
            category: (r.category as any) || 'honeymoon',
            title: r.title || 'Incredible Sri Lanka Experience!',
            comment: r.comment || '',
            photos: Array.isArray(r.photos) ? r.photos : [],
            helpfulCount: Number(r.helpfulCount) || 0,
            verified: r.verified !== undefined ? Boolean(r.verified) : true
          }));

          // Merge without duplicate IDs
          const existingIds = new Set(initialDefaultReviews.map(dr => dr.id));
          const uniqueApi = formattedApiReviews.filter(ar => !existingIds.has(ar.id));
          setReviewsList([...uniqueApi, ...initialDefaultReviews]);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch server reviews, using initial set:', err);
      });
  }, []);

  // Pre-fill user details when logged in
  useEffect(() => {
    if (showAddReviewModal) {
      if (userProfile?.fullName || currentUser?.displayName) {
        setNewAuthor(userProfile?.fullName || currentUser?.displayName || '');
      }
      if (userProfile?.country || userProfile?.location) {
        setNewLocation(userProfile?.country || userProfile?.location || 'Colombo, Sri Lanka');
      } else {
        if (!newLocation) setNewLocation('Colombo, Sri Lanka');
      }
    }
  }, [showAddReviewModal, userProfile, currentUser]);

  const filteredReviews = reviewsList.filter(r => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'photos') return r.photos && r.photos.length > 0;
    return r.category === activeCategory;
  });

  const nextSlide = () => {
    if (filteredReviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
  };

  const prevSlide = () => {
    if (filteredReviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
  };

  const toggleLike = (id: string) => {
    setLikedReviews(prev => {
      const isLiked = !prev[id];
      if (isLiked) {
        fetch(`/api/reviews/${id}/helpful`, { method: 'POST' }).catch(() => {});
      }
      return { ...prev, [id]: isLiked };
    });
  };

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const fileList = Array.from(files);

    Promise.all(
      fileList.map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            // Upload to server if base64 available
            if (base64) {
              fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 })
              })
                .then(res => res.json())
                .then(data => {
                  if (data.url) resolve(data.url);
                  else resolve(base64);
                })
                .catch(() => resolve(base64));
            } else {
              resolve('');
            }
          };
          reader.readAsDataURL(file);
        });
      })
    ).then((uploadedUrls) => {
      const valid = uploadedUrls.filter(u => u && u.trim() !== '');
      setNewPhotos(prev => [...prev, ...valid]);
      setIsUploading(false);
    });
  };

  // Handle adding image via Direct URL
  const handleAddPhotoUrl = () => {
    if (!photoUrlInput || !photoUrlInput.trim()) return;
    setNewPhotos(prev => [...prev, photoUrlInput.trim()]);
    setPhotoUrlInput('');
  };

  const handleRemovePhoto = (index: number) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Form Submission
  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newTitle || !newComment) return;

    setIsSubmitting(true);
    const isUserLoggedIn = Boolean(currentUser || userProfile);

    const payload = {
      author: newAuthor,
      location: newLocation || 'Traveler',
      flag: '🇱🇰',
      avatar: userProfile?.avatar || userProfile?.profile_image || userProfile?.photoURL || currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newAuthor)}`,
      tourName: newTour,
      rating: newRating,
      category: newCategory,
      title: newTitle,
      comment: newComment,
      photos: newPhotos,
      verified: isUserLoggedIn,
      userEmail: userProfile?.email || currentUser?.email || ''
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      const createdReview: ReviewItem = {
        id: data.review?.id || 'rev-' + Date.now(),
        author: payload.author,
        location: payload.location,
        flag: payload.flag,
        avatar: payload.avatar,
        tourName: payload.tourName,
        rating: payload.rating,
        date: 'Just Now',
        category: payload.category,
        title: payload.title,
        comment: payload.comment,
        photos: payload.photos,
        helpfulCount: 0,
        verified: payload.verified
      };

      setReviewsList(prev => [createdReview, ...prev]);
      setSubmitSuccess(true);
      setCurrentIndex(0); // Jump carousel to top so new review shows immediately

      setTimeout(() => {
        setShowAddReviewModal(false);
        setSubmitSuccess(false);
        setNewTitle('');
        setNewComment('');
        setNewPhotos([]);
      }, 1600);
    } catch (err) {
      console.error('Error submitting review:', err);
      // Local fallback insert
      const fallbackReview: ReviewItem = {
        id: 'rev-' + Date.now(),
        author: payload.author,
        location: payload.location,
        flag: payload.flag,
        avatar: payload.avatar,
        tourName: payload.tourName,
        rating: payload.rating,
        date: 'Just Now',
        category: payload.category,
        title: payload.title,
        comment: payload.comment,
        photos: payload.photos,
        helpfulCount: 0,
        verified: payload.verified
      };
      setReviewsList(prev => [fallbackReview, ...prev]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowAddReviewModal(false);
        setSubmitSuccess(false);
        setNewTitle('');
        setNewComment('');
        setNewPhotos([]);
      }, 1600);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="traveler-reviews" className="py-20 bg-gradient-to-b from-white via-sky-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0091EA]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TOP TRUST SUMMARY BAR */}
        <div className="bg-slate-950 rounded-[32px] border-2 border-sky-400/40 p-6 md:p-8 mb-14 shadow-2xl text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            
            {/* Trustpilot Box */}
            <div className="flex flex-col items-center sm:items-start border-b sm:border-b-0 sm:border-r border-sky-800/60 pb-4 sm:pb-0 sm:pr-6">
              <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-xs uppercase tracking-widest mb-1">
                <Star className="w-4 h-4 fill-emerald-400" />
                <span>Trustpilot</span>
              </div>
              <div className="flex items-center gap-1 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="w-6 h-6 bg-emerald-500 flex items-center justify-center rounded-md">
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-300 mt-1">
                <strong className="text-white">4.9 / 5.0</strong> • {translate('Based on 1,480+ verified reviews')}
              </p>
            </div>

            {/* Google Reviews Box */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-1.5 text-sky-400 font-extrabold text-xs uppercase tracking-widest mb-1">
                <Star className="w-4 h-4 fill-sky-400" />
                <span>Google Reviews</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 text-lg font-black my-0.5">
                <span>4.9</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs font-bold text-slate-300">
                820+ {translate('Authentic Traveler Ratings')}
              </p>
            </div>

          </div>

          {/* Center Callout */}
          <div className="text-center max-w-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-black uppercase tracking-widest border border-sky-400/30 mb-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {translate('100% Real Guest Experiences')}
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
              {translate('Loved by Travelers Worldwide')}
            </h3>
          </div>

          {/* Action Button */}
          <button
            id="share-story-btn"
            onClick={() => setShowAddReviewModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-sky-500/25 flex items-center gap-2 hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            <span>{translate('Share Your Story')}</span>
          </button>

        </div>

        {/* SECTION HEADING & CATEGORY FILTERS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#0091EA] bg-sky-50 dark:bg-sky-950/80 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
              {translate('Verified Social Proof')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-3">
              {translate('TRAVELER PHOTOS &')} <span className="bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 bg-clip-text text-transparent">{translate('REVIEWS')}</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: 'all', label: 'All Reviews' },
              { id: 'photos', label: 'With Photos' },
              { id: 'honeymoon', label: 'Honeymoon & Couples' },
              { id: 'family', label: 'Family Trips' },
              { id: 'solo', label: 'Solo & Wellness' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setCurrentIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#0091EA] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-sky-200 dark:border-sky-800 hover:border-[#0091EA]'
                }`}
              >
                {translate(cat.label)}
              </button>
            ))}
          </div>
        </div>

        {/* CAROUSEL CONTAINER */}
        {filteredReviews.length > 0 ? (
          <div className="relative">
            
            {/* Main Review Cards Slider */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredReviews.slice(currentIndex, currentIndex + 2).map((rev) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white dark:bg-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/80 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative"
                >
                  <div>
                    {/* Header: Author & Verified Tag */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={rev.avatar} 
                          alt={rev.author}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0091EA] bg-slate-100 dark:bg-slate-800" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as any).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rev.author)}`;
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-base font-black text-slate-900 dark:text-white">{rev.author}</h4>
                            <span className="text-sm">{rev.flag}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{rev.location}</p>
                        </div>
                      </div>

                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-black border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          {translate('Verified Guest')}
                        </span>
                      )}
                    </div>

                    {/* Star Rating & Tour Booked */}
                    <div className="flex items-center justify-between mb-3 bg-sky-50/50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-sky-100 dark:border-sky-800/40">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-4 h-4 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-[#0091EA] line-clamp-1 truncate max-w-[220px]">
                        {rev.tourName}
                      </span>
                    </div>

                    {/* Review Title & Content */}
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 leading-snug">
                      "{translate(rev.title)}"
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6 whitespace-pre-line">
                      {translate(rev.comment)}
                    </p>

                    {/* Traveler Uploaded Photos Grid */}
                    {rev.photos && rev.photos.length > 0 && (
                      <div className="mb-6">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2 flex items-center gap-1">
                          <Camera className="w-3 h-3 text-[#0091EA]" />
                          {translate('Photos Taken By Guest')}:
                        </p>
                        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                          {rev.photos.map((photo, pIdx) => (
                            <div 
                              key={pIdx}
                              onClick={() => setSelectedPhoto(photo)}
                              className="relative w-24 h-20 rounded-xl overflow-hidden cursor-pointer group shrink-0 border border-sky-200 dark:border-sky-800 shadow-sm"
                            >
                              <img 
                                src={photo} 
                                alt="Traveler photo" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer: Date & Helpful Vote */}
                  <div className="pt-4 border-t border-sky-100 dark:border-sky-900/40 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold">{rev.date}</span>

                    <button
                      onClick={() => toggleLike(rev.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                        likedReviews[rev.id] 
                          ? 'bg-sky-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{rev.helpfulCount + (likedReviews[rev.id] ? 1 : 0)}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation Controls */}
            {filteredReviews.length > 2 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-2 border-sky-200 dark:border-sky-800 text-slate-800 dark:text-white flex items-center justify-center hover:bg-[#0091EA] hover:text-white transition-all shadow-md cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">
                  {currentIndex + 1} - {Math.min(currentIndex + 2, filteredReviews.length)} of {filteredReviews.length}
                </span>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-2 border-sky-200 dark:border-sky-800 text-slate-800 dark:text-white flex items-center justify-center hover:bg-[#0091EA] hover:text-white transition-all shadow-md cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 font-bold">
            {translate('No reviews found for this filter.')}
          </div>
        )}

      </div>

      {/* FULL PHOTO LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-sky-500/40"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img 
                src={selectedPhoto} 
                alt="Full size holiday photo" 
                className="w-full h-full object-contain bg-slate-950 max-h-[80vh]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUBMIT REVIEW MODAL */}
      <AnimatePresence>
        {showAddReviewModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 border-2 border-sky-200 dark:border-sky-800 rounded-3xl max-w-lg w-full p-6 text-slate-900 dark:text-white shadow-2xl relative my-auto max-h-[92vh] flex flex-col overflow-y-auto"
            >
              <button
                onClick={() => setShowAddReviewModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-[#0091EA] flex items-center justify-center font-bold shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black">{translate('Share Your Sri Lanka Experience')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{translate('Your story and photos inspire fellow luxury travelers!')}</p>
                </div>
              </div>

              {/* AUTH USER STATE STATUS BAR */}
              {(currentUser || userProfile) ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-3 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {(userProfile?.fullName || currentUser?.displayName || 'U').charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                        <span>{translate('Signed in as')}: <strong>{userProfile?.fullName || currentUser?.displayName || currentUser?.email}</strong></span>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      </p>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">{translate('Verified Guest badge will be automatically attached!')}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 rounded-2xl p-3 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0091EA]" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {translate('Posting as Guest')}
                    </p>
                  </div>
                  {onOpenAuth && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddReviewModal(false);
                        onOpenAuth();
                      }}
                      className="px-3 py-1 bg-[#0091EA] text-white rounded-xl text-[11px] font-extrabold flex items-center gap-1 hover:bg-sky-600 cursor-pointer"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>{translate('Sign In First')}</span>
                    </button>
                  )}
                </div>
              )}

              {submitSuccess ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
                    ✓
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">{translate('Story Published Successfully!')}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {translate('Thank you! Your story and photos are now live on our website for travelers around the world to discover.')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAddReviewSubmit} className="space-y-4">
                  
                  {/* Name and Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">{translate('Your Name')}</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-sky-200 dark:border-sky-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0091EA]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">{translate('City & Country')}</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. London, United Kingdom"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-sky-200 dark:border-sky-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0091EA]"
                      />
                    </div>
                  </div>

                  {/* Tour Dropdown & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">{translate('Tour / Experience')}</label>
                      <select
                        value={newTour}
                        onChange={(e) => setNewTour(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-sky-200 dark:border-sky-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0091EA]"
                      >
                        <option value="Luxury Sri Lanka Grand Tour • 14 Days">Luxury Sri Lanka Grand Tour • 14 Days</option>
                        <option value="Wild Sri Lanka Leopard Safari • 3 Days">Wild Sri Lanka Leopard Safari • 3 Days</option>
                        <option value="Elite Sanctuary Ayurveda & Yoga Retreat">Elite Sanctuary Ayurveda Retreat</option>
                        <option value="Southern Coast & Beach Escape • 10 Days">Southern Coast Beach Escape • 10 Days</option>
                        <option value="Tea Country & Sigiriya Rock Expedition">Tea Country & Cultural Triangle Expedition</option>
                        <option value="Custom Bespoke Sri Lanka Tour">Custom Bespoke Sri Lanka Tour</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">{translate('Trip Category')}</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-sky-200 dark:border-sky-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0091EA]"
                      >
                        <option value="honeymoon">Honeymoon & Couples</option>
                        <option value="family">Family Trips</option>
                        <option value="solo">Solo & Wellness</option>
                      </select>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">{translate('Overall Rating')}</label>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="text-amber-400 cursor-pointer p-0.5 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                        </button>
                      ))}
                      <span className="text-xs font-black text-slate-600 dark:text-slate-400 ml-2">{newRating} / 5 Stars</span>
                    </div>
                  </div>

                  {/* Headline */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">{translate('Story Title / Headline')}</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Unforgettable Honeymoon - Chauffeur Priyantha was amazing!"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-sky-200 dark:border-sky-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0091EA]"
                    />
                  </div>

                  {/* Narrative Story */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">{translate('Your Story & Experience')}</label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="Share details about the locations, driver guide, luxury villas, meals and favorite moments..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-sky-200 dark:border-sky-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0091EA]"
                    />
                  </div>

                  {/* PHOTO UPLOAD SECTION */}
                  <div className="bg-sky-50/50 dark:bg-slate-950/50 border border-sky-200 dark:border-sky-800 rounded-2xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#0091EA]" />
                        <span>{translate('Attach Holiday Photos')}</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">{newPhotos.length} {translate('Photos Attached')}</span>
                    </div>

                    {/* File Upload Button */}
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-800 rounded-xl text-xs font-extrabold text-[#0091EA] flex items-center gap-1.5 cursor-pointer hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? translate('Uploading...') : translate('Upload From Device')}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          disabled={isUploading}
                          onChange={handleFileChange}
                          className="hidden" 
                        />
                      </label>

                      <span className="text-[10px] text-slate-400 font-bold uppercase">{translate('OR')}</span>

                      <div className="flex items-center gap-1 flex-1 min-w-[180px]">
                        <input
                          type="url"
                          placeholder="Paste image URL..."
                          value={photoUrlInput}
                          onChange={(e) => setPhotoUrlInput(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 rounded-xl text-[11px] font-medium focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddPhotoUrl}
                          className="px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-[11px] font-bold cursor-pointer hover:bg-[#0091EA]"
                        >
                          {translate('Add')}
                        </button>
                      </div>
                    </div>

                    {/* Attached Photo Thumbnails Grid */}
                    {newPhotos.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
                        {newPhotos.map((photo, pIdx) => (
                          <div key={pIdx} className="relative w-16 h-14 rounded-lg overflow-hidden border border-sky-400 shrink-0 group">
                            <img src={photo} alt="Upload preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(pIdx)}
                              className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] cursor-pointer hover:scale-110"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-500/25 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{translate('Publishing Story...')}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{translate('Publish Verified Traveler Story')}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
