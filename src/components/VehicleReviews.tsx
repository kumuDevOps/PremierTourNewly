import { useLanguage } from '../lib/i18n';
import React, { useState } from 'react';
import { Star, ShieldCheck, ThumbsUp, Camera, MessageSquare, Check, Sparkles, UserCheck } from 'lucide-react';

export interface ReviewItem {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  verified: boolean;
  rentalPeriod: string;
  comment: string;
  photos?: string[];
  likes: number;
  breakdown: {
    cleanliness: number;
    comfort: number;
    performance: number;
    chauffeur: number;
  };
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Alexander & Sarah Wright',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: 'July 18, 2026',
    verified: true,
    rentalPeriod: '7-Day Tour across Kandy & Ella',
    comment: 'Exceptional luxury experience from start to finish. The Mercedes S-Class was spotless, smelled fresh, and our chauffeur Mr. Chaminda was extraordinarily punctual and knowledgeable. Highly recommended for couples!',
    photos: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400'
    ],
    likes: 24,
    breakdown: { cleanliness: 5.0, comfort: 5.0, performance: 4.9, chauffeur: 5.0 }
  },
  {
    id: 'rev-2',
    author: 'Dr. Michael Chang',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: 'June 29, 2026',
    verified: true,
    rentalPeriod: 'Airport Transfer to Galle Fort',
    comment: 'Seamless booking and instant PDF voucher generation. The vehicle telematics kept me informed of the driver’s arrival down to the minute at Colombo Airport. Worth every dollar.',
    photos: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=400'
    ],
    likes: 18,
    breakdown: { cleanliness: 5.0, comfort: 4.8, performance: 5.0, chauffeur: 5.0 }
  }
];

export default function VehicleReviews({ carName }: { carName: string }) {
  const { translate } = useLanguage();
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  
  // New review form states
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photoInput, setPhotoInput] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const handleAddPhoto = () => {
    if (photoInput.trim()) {
      setUploadedPhotos([...uploadedPhotos, photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !comment) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: authorName,
      rating,
      date: 'Just now',
      verified: true,
      rentalPeriod: 'Verified Rental',
      comment,
      photos: uploadedPhotos,
      likes: 0,
      breakdown: { cleanliness: rating, comfort: rating, performance: rating, chauffeur: rating }
    };

    setReviews([newRev, ...reviews]);
    setAuthorName('');
    setComment('');
    setUploadedPhotos([]);
    setShowForm(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      {/* Overview Breakdown Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-[#0091EA] to-sky-600 text-white rounded-2xl text-center shadow-lg shadow-sky-500/25 min-w-[90px]">
            <span className="text-3xl font-black block leading-none">4.9</span>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-300 text-amber-300" />
              ))}
            </div>
            <span className="text-[10px] font-bold opacity-90 block mt-1">{translate(`Out of 5`)}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {translate(`Verified Customer Reviews`)}
              </h3>
              <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-black rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {translate(`Verified Guest Only`)}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Based on {reviews.length + 42} completed luxury rentals for {carName}
            </p>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{translate(`Cleanliness`)}</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">5.0 / 5</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{translate(`Comfort`)}</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">4.9 / 5</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{translate(`Performance`)}</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">4.9 / 5</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{translate(`Chauffeur`)}</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">5.0 / 5</span>
          </div>
        </div>
      </div>

      {/* Write Review Toggle Button */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
          {translate(`Recent Guest Feedback & Photos`)}
        </h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#0091EA] hover:bg-sky-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/20 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{showForm ? 'Cancel Review' : 'Write Verified Review'}</span>
        </button>
      </div>

      {/* Add Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-sky-100 dark:border-sky-900/50 space-y-4 animate-fade-in">
          <h5 className="text-xs font-black uppercase text-[#0091EA] tracking-wider">
            {translate(`Submit Your Verified Rental Review`)}
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">{translate(`Your Full Name`)}</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. David Miller"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">{translate(`Overall Rating`)}</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value={5}>5 Stars - Exceptional Luxury</option>
                <option value={4}>4 Stars - Very Good</option>
                <option value={3}>3 Stars - Average</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">{translate(`Your Review Comment`)}</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={translate(`Share details about cleanliness, vehicle performance, and driver service...`)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Photo attachment URL */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">Attach Vehicle Photo URL (Optional)</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
              >
                {translate(`Add Photo`)}
              </button>
            </div>
            {uploadedPhotos.length > 0 && (
              <div className="flex gap-2 mt-2">
                {uploadedPhotos.map((url, idx) => (
                  <img key={idx} src={url} alt="Uploaded preview" className="w-12 h-12 rounded-lg object-cover border border-slate-300" />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
          >
            {translate(`Submit Verified Review`)}
          </button>
        </form>
      )}

      {/* Review List Cards */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-4 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                  alt={rev.author}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">{rev.author}</h5>
                    {rev.verified && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        {translate(`Verified`)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{rev.rentalPeriod} • {rev.date}</span>
                </div>
              </div>

              {/* Star rating */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              "{rev.comment}"
            </p>

            {/* Photo Gallery preview */}
            {rev.photos && rev.photos.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                {rev.photos.map((p, idx) => (
                  <img
                    key={idx}
                    src={p}
                    alt="Rental Photo"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform cursor-pointer shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
