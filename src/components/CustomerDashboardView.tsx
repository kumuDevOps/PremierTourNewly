import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Calendar, 
  MapPin, 
  Compass, 
  Phone, 
  Mail, 
  Award, 
  CheckCircle, 
  Loader2, 
  ChevronRight, 
  Settings, 
  LogOut,
  Clock,
  Car,
  Plane,
  History,
  Building,
  Search,
  Heart,
  FileText,
  Download,
  Share2,
  Camera,
  Upload,
  Check,
  Sparkles,
  X
} from 'lucide-react';
import { useLanguage } from '../lib/i18n.tsx';
import { useCurrency } from '../lib/CurrencyContext.tsx';
import { auth } from '../lib/firebase.ts';
import { signOut } from 'firebase/auth';
import BookingPDFModal, { BookingVoucherData } from './BookingPDFModal.tsx';

interface CustomerDashboardViewProps {
  onNavigate: (page: string) => void;
  currentUser: any;
  userProfile: any;
  onProfileUpdate: (updatedProfile: any) => void;
  onLogout: () => void;
  initialTab?: 'dashboard' | 'bookings' | 'settings';
  onOpenWishlist?: () => void;
  wishlistCount?: number;
}

export default function CustomerDashboardView({ 
  onNavigate,
  currentUser,
  userProfile,
  onProfileUpdate,
  onLogout,
  initialTab = 'dashboard',
  onOpenWishlist,
  wishlistCount = 0
}: CustomerDashboardViewProps) {
  const { translate } = useLanguage();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'settings'>(initialTab);

  // Sync activeTab when initialTab changes (e.g. via parent route update)
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsList, setBookingsList] = useState<{
    tours: any[];
    flights: any[];
    cars: any[];
    hotels: any[];
  }>({ tours: [], flights: [], cars: [], hotels: [] });
  const [errorBookings, setErrorBookings] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [bookingToCancel, setBookingToCancel] = useState<{type: string, id: string | number} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // PDF Voucher State
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfVoucherData, setPdfVoucherData] = useState<BookingVoucherData | null>(null);

  const handleViewVoucher = (item: any, type: 'tour' | 'flight' | 'car' | 'hotel') => {
    let title = item.itemName || item.title || 'Travel Reservation';
    let ref = type === 'tour' ? `PTB-${1000 + item.id}` :
              type === 'flight' ? `FLT-${1000 + item.id}` :
              type === 'car' ? `CAR-${1000 + item.id}` :
              `HTL-${String(item.id).substring(0, 8).toUpperCase()}`;

    let startDate = item.travelDate || item.checkInDate || item.pickupDate || new Date().toISOString().split('T')[0];
    let endDate = item.checkOutDate || item.returnDate || undefined;
    let totalPrice = item.totalPrice || item.itemPrice || 0;
    let guestsCount = item.guests || 1;
    let custName = item.userName || item.passengerName || item.customerName || userProfile?.fullName || currentUser?.displayName || 'Valued Guest';
    let custEmail = item.email || item.userEmail || currentUser?.email || 'guest@example.com';

    const voucher: BookingVoucherData = {
      id: item.id,
      bookingRef: ref,
      type: type,
      title: title,
      subtitle: `${type.toUpperCase()} Booking • ${guestsCount} Guest(s)`,
      description: item.description || `${title} arrangement confirmed and registered for ${custName}.`,
      category: type.toUpperCase(),
      customerName: custName,
      customerEmail: custEmail,
      customerPhone: item.phone || userProfile?.phone || '',
      guestsCount: guestsCount,
      startDate: startDate,
      endDate: endDate,
      startTime: '09:00 AM (EST)',
      durationText: type === 'hotel' ? `${item.nights || 3} Nights Stay` : type === 'tour' ? 'Full Experience Tour' : 'Confirmed Booking',
      roomNumber: type === 'hotel' ? `Room #${100 + (Number(item.id) || 1) * 3}` : undefined,
      roomType: type === 'hotel' ? 'Luxury Executive Suite' : undefined,
      totalPrice: totalPrice,
      status: item.status || 'CONFIRMED',
      createdAt: item.createdAt || new Date().toISOString()
    };

    setPdfVoucherData(voucher);
    setShowPdfModal(true);
  };

  const filterBookings = (list: any[]) => {
    if (!searchQuery.trim()) return list;
    const lowerQ = searchQuery.toLowerCase();
    return list.filter(item => 
      (item.itemName && item.itemName.toLowerCase().includes(lowerQ)) ||
      (item.passengerName && item.passengerName.toLowerCase().includes(lowerQ)) ||
      (item.customerName && item.customerName.toLowerCase().includes(lowerQ)) ||
      (item.title && item.title.toLowerCase().includes(lowerQ)) ||
      (item.airline && item.airline.toLowerCase().includes(lowerQ)) ||
      (item.status && item.status.toLowerCase().includes(lowerQ)) ||
      (item.id && String(item.id).toLowerCase().includes(lowerQ))
    );
  };

const PRESET_AVATARS = [
  { id: 'explorer', name: 'Explorer', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { id: 'captain', name: 'Pilot', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { id: 'island', name: 'Voyager', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
  { id: 'safari', name: 'Adventurer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { id: 'luxury', name: 'VIP Guest', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { id: 'executive', name: 'Executive', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
];

  // Profile Picture & Avatar Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    userProfile?.profile_image || userProfile?.avatar || userProfile?.photoURL || ''
  );
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (userProfile) {
      const pic = userProfile.profile_image || userProfile.avatar || userProfile.photoURL;
      if (pic) setAvatarUrl(pic);
    }
  }, [userProfile]);

  const saveProfileAvatar = async (newUrl: string) => {
    try {
      const token = localStorage.getItem('premier_access_token') || localStorage.getItem('premier_token') || localStorage.getItem('admin_token') || (currentUser?.getIdToken ? await currentUser.getIdToken() : '');
      
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profile_image: newUrl })
      });

      if (res.ok) {
        const data = await res.json();
        const updatedUser = data.user || data;
        const updated = {
          ...userProfile,
          ...updatedUser,
          profile_image: newUrl,
          avatar: newUrl,
          photoURL: newUrl,
          fullName: `${updatedUser.first_name || userProfile?.fullName || 'User'} ${updatedUser.last_name || ''}`.trim()
        };
        onProfileUpdate(updated);
        localStorage.setItem('premier_user', JSON.stringify(updated));
        setSettingsSuccess('Profile picture updated successfully!');
        setTimeout(() => setSettingsSuccess(''), 4000);
      }
    } catch (err) {
      console.error('Failed to sync avatar profile:', err);
    }
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSettingsError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSettingsError('Image file size must be less than 5MB.');
      return;
    }

    setUploadingAvatar(true);
    setSettingsError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Data, filename: file.name })
          });

          if (res.ok) {
            const data = await res.json();
            const url = data.url || base64Data;
            setAvatarUrl(url);
            await saveProfileAvatar(url);
          } else {
            setAvatarUrl(base64Data);
            await saveProfileAvatar(base64Data);
          }
        } catch (apiErr) {
          setAvatarUrl(base64Data);
          await saveProfileAvatar(base64Data);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Avatar File Error:', err);
      setSettingsError('Failed to read image file.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSelectPresetAvatar = async (url: string) => {
    setAvatarUrl(url);
    setUploadingAvatar(true);
    await saveProfileAvatar(url);
    setUploadingAvatar(false);
  };

  // Form fields for Settings tab
  const [editName, setEditName] = useState(userProfile?.fullName || currentUser?.displayName || '');
  const [editPhone, setEditPhone] = useState(userProfile?.phone || '');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // Synchronize form fields when profile is fetched/updated
  useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.fullName);
      setEditPhone(userProfile.phone || '');
    }
  }, [userProfile]);

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser]);

  
  const handleCancelBookingClick = (type: string, id: string | number) => {
    setBookingToCancel({ type, id });
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;
    setCancelError('');
    const { type, id } = bookingToCancel;
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/bookings/${type}/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchBookings(); // Refresh the list
        setBookingToCancel(null);
      } else {
        const errData = await res.json();
        setCancelError(errData.error || 'Failed to cancel booking.');
      }
    } catch (err) {
      console.error(err);
      setCancelError('An error occurred while canceling the booking.');
    }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    setErrorBookings('');
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setBookingsList({
          tours: data.tours || [],
          flights: data.flights || [],
          cars: data.cars || [],
          hotels: data.hotels || []
        });
      } else {
        const errData = await res.json();
        setErrorBookings(errData.error || 'Failed to fetch bookings.');
      }
    } catch (err) {
      console.error(err);
      setErrorBookings('An error occurred while fetching your bookings list.');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess('');
    setSettingsError('');

    if (!editName.trim()) {
      setSettingsError('Full name is required.');
      setSavingSettings(false);
      return;
    }

    try {
      const token = localStorage.getItem('premier_token') || (currentUser?.getIdToken ? await currentUser.getIdToken() : '');
      const parts = editName.trim().split(' ');
      const first_name = parts[0] || editName.trim();
      const last_name = parts.slice(1).join(' ') || '';

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name,
          last_name,
          phone: editPhone.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        const updatedUser = data.user || data;
        onProfileUpdate({
          ...updatedUser,
          fullName: `${updatedUser.first_name || ''} ${updatedUser.last_name || ''}`.trim()
        });
        setSettingsSuccess('Your profile settings have been updated successfully!');
      } else {
        const errData = await res.json();
        setSettingsError(errData.error || 'Failed to save profile settings.');
      }
    } catch (err) {
      console.error(err);
      setSettingsError('Server connection error. Please try again.');
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredTours = filterBookings(bookingsList.tours);
  const filteredFlights = filterBookings(bookingsList.flights);
  const filteredCars = filterBookings(bookingsList.cars);
  const filteredHotels = filterBookings(bookingsList.hotels || []);

  const totalBookingsCount = bookingsList.tours.length + bookingsList.flights.length + bookingsList.cars.length + (bookingsList.hotels?.length || 0);
  const totalFilteredCount = filteredTours.length + filteredFlights.length + filteredCars.length + filteredHotels.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left sidebar navigation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 p-6 shadow-xl shadow-sky-500/10 text-center animate-blue-glow">
            {/* Interactive Profile Avatar */}
            <div 
              onClick={() => {
                setActiveTab('settings');
                setTimeout(() => fileInputRef.current?.click(), 100);
              }}
              className="relative w-24 h-24 rounded-3xl mx-auto cursor-pointer group shadow-xl shadow-sky-500/20 overflow-hidden border-2 border-sky-400/80 dark:border-sky-500/80 transition-all hover:scale-105"
              title="Click to change profile picture"
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile Avatar" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0091EA] via-sky-500 to-cyan-400 text-white font-black text-3xl flex items-center justify-center">
                  {(userProfile?.fullName || currentUser?.email || 'T').charAt(0).toUpperCase()}
                </div>
              )}

              {/* Hover Camera Overlay */}
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white backdrop-blur-xs">
                <Camera className="w-6 h-6 text-sky-400 mb-0.5 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">Change</span>
              </div>

              {/* Floating Camera Badge */}
              <div className="absolute bottom-1 right-1 p-1.5 bg-[#0091EA] text-white rounded-full shadow-md border border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="mt-4 font-black text-lg text-slate-900 dark:text-white">{userProfile?.fullName || 'Traveler'}</h3>
            <span className="text-2xs font-mono text-sky-800 dark:text-sky-300 block mt-1 font-bold">{currentUser?.email}</span>
            {userProfile?.role === 'admin' ? (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-3xs uppercase tracking-widest shadow-md">
                <Award className="w-3.5 h-3.5" />
                Admin
              </div>
            ) : userProfile?.role ? (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-3xs uppercase tracking-widest shadow-md">
                <Award className="w-3.5 h-3.5" />
                <span className="capitalize">{userProfile.role.replace('_', ' ')}</span>
              </div>
            ) : (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-3xs uppercase tracking-widest shadow-md">
                <Award className="w-3.5 h-3.5" />
                Pending Account
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 overflow-hidden shadow-xl shadow-sky-500/10 animate-blue-glow">
            <nav className="flex flex-col">
              <button
                onClick={() => onNavigate('account-dashboard')}
                className={`flex items-center gap-3 px-5 py-4 text-xs font-black uppercase tracking-wider text-left border-l-4 transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'border-[#0091EA] bg-sky-500/10 text-[#0091EA]'
                    : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-sky-500/5'
                }`}
              >
                <Compass className="w-5 h-5 text-[#0091EA]" />
                <span>{translate('My Dashboard')}</span>
              </button>

              <button
                onClick={() => onNavigate('account-bookings')}
                className={`flex items-center gap-3 px-5 py-4 text-xs font-black uppercase tracking-wider text-left border-l-4 transition-all cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'border-[#0091EA] bg-sky-500/10 text-[#0091EA]'
                    : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-sky-500/5'
                }`}
              >
                <Calendar className="w-5 h-5 text-[#0091EA]" />
                <span>{translate('My Bookings')} ({totalBookingsCount})</span>
              </button>

              <button
                onClick={() => onNavigate('account-settings')}
                className={`flex items-center gap-3 px-5 py-4 text-xs font-black uppercase tracking-wider text-left border-l-4 transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-[#0091EA] bg-sky-500/10 text-[#0091EA]'
                    : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-sky-500/5'
                }`}
              >
                <Settings className="w-5 h-5 text-[#0091EA]" />
                <span>{translate('Profile Settings')}</span>
              </button>

              <button
                onClick={() => onNavigate('wishlist')}
                className="flex items-center gap-3 px-5 py-4 text-xs font-black uppercase tracking-wider text-left border-l-4 border-transparent text-slate-600 dark:text-slate-300 hover:bg-sky-500/5 transition-all cursor-pointer"
              >
                <Heart className="w-5 h-5 text-rose-500" />
                <div className="flex items-center justify-between w-full">
                  <span>{translate('My Wishlist')}</span>
                  {wishlistCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-3 px-5 py-4 text-xs font-black uppercase tracking-wider text-left border-l-4 border-transparent text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>{translate('Sign Out')}</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Right main body */}
        <div className="lg:col-span-3 space-y-8 text-left">
          
          {activeTab === 'dashboard' && (
            /* Tab: My Dashboard */
            <div className="space-y-6 animate-fade-in">
              {/* Welcome banner */}
              <div className="relative rounded-[40px] bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-white p-8 md:p-10 border-2 border-sky-500/30 overflow-hidden shadow-2xl animate-blue-glow">
                <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />
                
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md">
                  <span className="bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent">{translate('Welcome Back')}, {userProfile?.fullName || translate('Traveler')}!</span>
                </h2>
                <p className="text-xs md:text-sm text-sky-100/90 mt-2 font-medium max-w-xl leading-relaxed">
                  We are delighted to have you on board. Discover your custom rewards, check pending reservations, or plan your next dream getaway with our custom guided tours.
                </p>
                <button
                  onClick={() => onNavigate('tour')}
                  className="mt-6 px-6 py-3.5 bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Explore Guided Tours
                </button>
              </div>

              {/* Stats card grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/60 p-6 shadow-xl shadow-sky-500/10 animate-blue-glow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest">{translate('Active Bookings')}</p>
                      <h4 className="text-3xl font-black bg-gradient-to-r from-[#0091EA] via-sky-500 to-cyan-400 bg-clip-text text-transparent mt-1.5">{totalBookingsCount}</h4>
                    </div>
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0091EA] to-cyan-500 text-white shadow-md">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-2xs text-slate-500 dark:text-slate-400 mt-2 block font-bold">{translate('Tours, flights & car rentals')}</span>
                </div>

                <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[28px] border-2 border-sky-200/80 dark:border-sky-800/60 p-6 shadow-xl shadow-sky-500/10 animate-blue-glow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest">{translate('Last Activity')}</p>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white mt-3 line-clamp-1">
                        {userProfile?.lastLoginAt ? new Date(userProfile.lastLoginAt).toLocaleDateString() : 'Active Now'}
                      </h4>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-900 text-sky-400 shadow-md">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-2xs text-slate-500 dark:text-slate-400 mt-2 block font-bold">{translate('Login from device browser')}</span>
                </div>
              </div>

              {/* Member privileges list */}
              <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 p-6 shadow-xl shadow-sky-500/10 space-y-4 animate-blue-glow">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-sky-100 dark:border-sky-800/50 pb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Your Gold Explorer Privileges
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">{translate('Complimentary Airport Lounge')}</h5>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{translate('Show membership barcode at selected flight transits.')}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">{translate('Prioritized Booking Queues')}</h5>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{translate('Enjoy instant, priority clearances on tour selections.')}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">{translate('Flexible Date Cancellations')}</h5>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{translate('Free changes up to 7 days before tour departure date.')}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">{translate('Premium Tour Insurance')}</h5>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{translate('Get complimentary basic coverage for tour packages.')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            /* Tab: My Bookings */
            <div className="bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 rounded-[32px] border-2 border-sky-200/80 dark:border-sky-800/60 p-6 md:p-8 shadow-xl shadow-sky-500/10 space-y-6 animate-blue-glow">
              <div className="flex justify-between items-center border-b border-sky-100 dark:border-sky-800/50 pb-4">
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">{translate('Booking History Logs')}</h3>
                  <p className="text-xs text-sky-800 dark:text-sky-300 font-semibold mt-0.5">{translate('All tour, package, flight, and car bookings linked to your profile')}</p>
                </div>
                <button
                  onClick={fetchBookings}
                  disabled={loadingBookings}
                  className="p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                >
                  {loadingBookings ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <History className="w-4 h-4" />
                  )}
                  <span>{translate('Refresh List')}</span>
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={translate("Search bookings by name, id, status, etc.")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-250 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0091EA] focus:border-transparent transition-all"
                />
              </div>

              {loadingBookings ? (
                <div className="py-20 text-center text-slate-500 font-bold space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0091EA]" />
                  <span>{translate('Retrieving active reservation records...')}</span>
                </div>
              ) : errorBookings ? (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold text-center">
                  {errorBookings}
                </div>
              ) : totalFilteredCount === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <Compass className="w-12 h-12 text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-700">{searchQuery ? translate('No Matching Bookings Found') : translate('No Reservations Found')}</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-normal">
                      {searchQuery ? translate('Try adjusting your search terms.') : translate("We couldn't locate any active flight, car, or guided tour reservations linked to your registered email account.")}
                    </p>
                  </div>
                  {!searchQuery && (
                    <button
                      onClick={() => onNavigate('tour')}
                      className="px-5 py-2.5 bg-[#0091EA] hover:bg-[#007cc7] text-white text-xs font-bold rounded-xl transition-all"
                    >
                      Browse Holiday Packages
                    </button>
                  )}
                </div>
              ) : (
                /* Bookings categories */
                <div className="space-y-6">
                  {/* Category 1: Tours/Packages */}
                  {filteredTours.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-[#0091EA]" />
                        <span>{translate('Tour & Package Bookings')} ({filteredTours.length})</span>
                      </h4>
                      <div className="space-y-3">
                        {filteredTours.map((b) => (
                          <div key={b.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <div className="flex gap-4 items-center">
                              {b.imageUrl ? (
                                <img src={b.imageUrl} alt={b.itemName} className="w-14 h-14 rounded-lg object-cover bg-slate-200" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400'; }} />
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-sky-50 flex items-center justify-center text-[#0091EA]">
                                  <Compass className="w-6 h-6" />
                                </div>
                              )}
                              <div className="text-left">
                                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#0091EA]">{translate('Booking Ref')}: PTB-{1000 + b.id}</span>
                                <h5 className="text-sm font-black text-slate-800 mt-0.5">{b.itemName}</h5>
                                <p className="text-2xs text-slate-500 font-medium mt-1">{translate('Travel Date')}: {b.travelDate} • {b.guests} {translate('Guests')}</p>
                              </div>
                            </div>
                            <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-dashed border-slate-150">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                b.status === 'Confirmed' || b.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                b.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  b.status === 'Confirmed' || b.status === 'Paid' ? 'bg-emerald-500' :
                                  b.status === 'Cancelled' ? 'bg-rose-500' :
                                  'bg-amber-500'
                                }`}></span>
                                {b.status}
                              </span>
                              {b.itemPrice > 0 && (
                                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{formatPrice(b.itemPrice)} / {translate('day')}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  type="button"
                                  onClick={() => handleViewVoucher(b, 'tour')}
                                  className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-[#0091EA] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Voucher PDF</span>
                                </button>
                                {b.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => handleCancelBookingClick('tour', b.id)}
                                    className="text-[10px] uppercase font-bold tracking-wider text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  
                  {/* Category 2: Flights */}
                  {filteredFlights.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Plane className="w-4 h-4 text-[#0091EA]" />
                        <span>{translate('Flight Bookings')} ({filteredFlights.length})</span>
                      </h4>
                      <div className="space-y-3">
                        {filteredFlights.map((b) => (
                          <div key={b.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <div className="flex gap-4 items-center">
                              {b.imageUrl ? (
                                <img src={b.imageUrl} alt={b.itemName} className="w-14 h-14 rounded-lg object-cover bg-slate-200" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400'; }} />
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-sky-50 flex items-center justify-center text-[#0091EA]">
                                  <Plane className="w-6 h-6" />
                                </div>
                              )}
                              <div className="text-left">
                                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#0091EA]">{translate('FLIGHT REF')}: FLT-{1000 + b.id}</span>
                                <h5 className="text-sm font-black text-slate-800 mt-0.5">{b.itemName}</h5>
                                <p className="text-2xs text-slate-500 font-medium mt-1">{translate('Travel Date')}: {b.travelDate} • {b.guests} {translate('Passengers')}</p>
                              </div>
                            </div>
                            <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-dashed border-slate-150">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                b.status === 'Confirmed' || b.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                b.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  b.status === 'Confirmed' || b.status === 'Paid' ? 'bg-emerald-500' :
                                  b.status === 'Cancelled' ? 'bg-rose-500' :
                                  'bg-amber-500'
                                }`}></span>
                                {b.status}
                              </span>
                              {b.itemPrice > 0 && (
                                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{formatPrice(b.itemPrice)}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  type="button"
                                  onClick={() => handleViewVoucher(b, 'flight')}
                                  className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-[#0091EA] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Voucher PDF</span>
                                </button>
                                {b.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => handleCancelBookingClick('flight', b.id)}
                                    className="text-[10px] uppercase font-bold tracking-wider text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Category 3: Cars */}
                  {filteredCars.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-[#0091EA]" />
                        <span>{translate('Car Rentals')} ({filteredCars.length})</span>
                      </h4>
                      <div className="space-y-3">
                        {filteredCars.map((b) => (
                          <div key={b.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <div className="flex gap-4 items-center">
                              {b.imageUrl ? (
                                <img src={b.imageUrl} alt={b.itemName} className="w-14 h-14 rounded-lg object-cover bg-slate-200" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400'; }} />
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-sky-50 flex items-center justify-center text-[#0091EA]">
                                  <Car className="w-6 h-6" />
                                </div>
                              )}
                              <div className="text-left">
                                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#0091EA]">{translate('RENTAL REF')}: CAR-{1000 + b.id}</span>
                                <h5 className="text-sm font-black text-slate-800 mt-0.5">{b.itemName}</h5>
                                <p className="text-2xs text-slate-500 font-medium mt-1">{translate('Pickup')}: {b.travelDate}</p>
                              </div>
                            </div>
                            <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-dashed border-slate-150">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                b.status === 'Confirmed' || b.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                b.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  b.status === 'Confirmed' || b.status === 'Paid' ? 'bg-emerald-500' :
                                  b.status === 'Cancelled' ? 'bg-rose-500' :
                                  'bg-amber-500'
                                }`}></span>
                                {b.status}
                              </span>
                              {b.itemPrice > 0 && (
                                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{formatPrice(b.itemPrice)} / {translate('day')}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  type="button"
                                  onClick={() => handleViewVoucher(b, 'car')}
                                  className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-[#0091EA] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Voucher PDF</span>
                                </button>
                                {b.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => handleCancelBookingClick('car', b.id)}
                                    className="text-[10px] uppercase font-bold tracking-wider text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                  {/* Category 4: Hotels */}
                  {filteredHotels.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-[#0091EA]" />
                        <span>{translate('Hotel & Suite Bookings')} ({filteredHotels.length})</span>
                      </h4>
                      <div className="space-y-3">
                        {filteredHotels.map((b) => (
                          <div key={b.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <div className="flex gap-4 items-center">
                              {b.imageUrl ? (
                                <img src={b.imageUrl} alt={b.itemName} className="w-14 h-14 rounded-lg object-cover bg-slate-200" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'; }} />
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-sky-50 flex items-center justify-center text-[#0091EA]">
                                  <Building className="w-6 h-6" />
                                </div>
                              )}
                              <div className="text-left">
                                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#0091EA]">{translate('STAY REF')}: {String(b.id).toUpperCase()}</span>
                                <h5 className="text-sm font-black text-slate-800 mt-0.5">{b.itemName}</h5>
                                <p className="text-2xs text-slate-500 font-medium mt-1">{translate('Check-in')}: {b.checkInDate} • {translate('Check-out')}: {b.checkOutDate} • {b.guests} {translate('Guests')}</p>
                              </div>
                            </div>
                            <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-dashed border-slate-150">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                b.status === 'Confirmed' || b.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                b.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  b.status === 'Confirmed' || b.status === 'Paid' ? 'bg-emerald-500' :
                                  b.status === 'Cancelled' ? 'bg-rose-500' :
                                  'bg-amber-500'
                                }`}></span>
                                {b.status}
                              </span>
                              {b.totalPrice > 0 && (
                                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{formatPrice(b.totalPrice)}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  type="button"
                                  onClick={() => handleViewVoucher(b, 'hotel')}
                                  className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-[#0091EA] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Voucher PDF</span>
                                </button>
                                {b.status !== 'Cancelled' && (
                                  <button
                                    onClick={() => handleCancelBookingClick('hotel', b.id)}
                                    className="text-[10px] uppercase font-bold tracking-wider text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            /* Tab: Profile Settings */
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm space-y-6 animate-fade-in">
              <div>
                <h3 className="font-black text-lg text-[#0A2540]">{translate('Profile Settings')}</h3>
                <p className="text-xs text-slate-450 font-medium mt-0.5">{translate('Manage your traveler details and contact credentials securely')}</p>
              </div>

              {settingsSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs font-semibold">
                  {settingsSuccess}
                </div>
              )}

              {/* Profile Picture Management Card */}
              <div className="p-5 bg-gradient-to-br from-sky-50/80 via-cyan-50/40 to-slate-50 dark:from-slate-800/80 dark:via-sky-950/30 dark:to-slate-800 rounded-2xl border border-sky-100 dark:border-sky-800/60 space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#0091EA]" />
                      Profile Picture & Avatar
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Upload a custom photo or choose a luxury travel avatar preset</p>
                  </div>
                  {uploadingAvatar && (
                    <span className="text-[11px] font-bold text-[#0091EA] flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Uploading...
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Current Avatar Ring with Camera Trigger */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-20 h-20 rounded-2xl cursor-pointer group shadow-md overflow-hidden border-2 border-sky-400/80 dark:border-sky-500/80 flex-shrink-0"
                    title="Click to upload new photo"
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0091EA] via-sky-500 to-cyan-400 text-white font-black text-2xl flex items-center justify-center">
                        {(editName || currentUser?.email || 'T').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-xs">
                      <Camera className="w-5 h-5 text-sky-400" />
                      <span className="text-[9px] font-bold uppercase mt-0.5">Upload</span>
                    </div>
                  </div>

                  {/* Hidden file input */}
                  <input 
                    ref={fileInputRef} 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarFileSelect} 
                    className="hidden" 
                  />

                  {/* Upload button & Presets */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#0091EA] dark:hover:border-[#0091EA] text-[#0A2540] dark:text-slate-200 text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Upload className="w-4 h-4 text-[#0091EA]" />
                      <span>Upload Custom Photo (JPG, PNG, WebP)</span>
                    </button>

                    {/* Presets Grid */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Or Choose Luxury Avatar Preset:</span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {PRESET_AVATARS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPresetAvatar(preset.url)}
                            className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                              avatarUrl === preset.url
                                ? 'border-[#0091EA] ring-2 ring-sky-500/30 scale-105'
                                : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                            title={preset.name}
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdateSettings} className="space-y-5 text-left max-w-xl">
                {/* Full Name */}
                <div>
                  <label htmlFor="settings-name" className="block text-xs font-bold text-[#0A2540] mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      id="settings-name"
                      type="text"
                      required
                      placeholder="Traveler Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 border border-slate-250 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0091EA] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Email Address (Disabled) */}
                <div>
                  <label htmlFor="settings-email" className="block text-xs font-bold text-[#0A2540] mb-1.5 uppercase tracking-wider">
                    Email Address <span className="text-[10px] font-normal text-slate-400">(Immutable member credential)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-350" />
                    <input
                      id="settings-email"
                      type="email"
                      disabled
                      value={currentUser?.email || ''}
                      className="w-full pl-11 pr-4 py-2.5 border border-slate-150 bg-slate-50 rounded-xl text-sm font-semibold text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="settings-phone" className="block text-xs font-bold text-[#0A2540] mb-1.5 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      id="settings-phone"
                      type="tel"
                      placeholder="Add phone contact"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 border border-slate-250 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0091EA] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="flex items-center justify-center gap-2 bg-[#0091EA] hover:bg-[#007cc7] disabled:bg-slate-300 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-sky-500/10 cursor-pointer"
                  >
                    {savingSettings ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        <span>{translate('Saving Changes...')}</span>
                      </>
                    ) : (
                      <span>{translate('Save Profile Settings')}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {bookingToCancel && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{translate('Cancel Booking')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {translate('Are you sure you want to cancel this booking? This action cannot be undone.')}
            </p>
            {cancelError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">
                {cancelError}
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => { setBookingToCancel(null); setCancelError(''); }}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {translate('Keep Booking')}
              </button>
              <button 
                onClick={confirmCancelBooking}
                className="px-4 py-2 text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
              >
                {translate('Yes, Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Voucher Modal */}
      <BookingPDFModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        booking={pdfVoucherData}
      />

    </div>
  );
}
