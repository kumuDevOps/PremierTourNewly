import { useLanguage } from "../lib/i18n";
import React, { useState, useEffect } from 'react';
import { X, LogIn, LogOut, ShieldCheck, Mail, Phone, Calendar, Users, Eye } from 'lucide-react';
import { signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { Booking } from '../types.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
  setCurrentUser: (user: FirebaseUser | null) => void;
}

export default function AuthModal({ isOpen, onClose, currentUser, setCurrentUser }: AuthModalProps) {
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
  const [emailForBookings, setEmailForBookings] = useState('');
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [errorBookings, setErrorBookings] = useState('');
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.email) {
      setEmailForBookings(currentUser.email);
      fetchMyBookings(currentUser.email);
    }
  }, [currentUser]);

  const handleGoogleSignIn = async () => {
    setSignInError(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const token = await result.user.getIdToken();
      
      // Sync user to backend
      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        console.log('User synced with backend successfully');
      }
      setCurrentUser(result.user);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      if (error.code === 'auth/popup-blocked') {
        setSignInError(translate('Sign-in popup was blocked by your browser. Please allow popups for this site or use the main Login page bypass.'));
      } else if (error.code === 'auth/operation-not-allowed') {
        setSignInError(translate('Google authentication is not enabled in your Firebase console. Please go to your full Login page and select "Quick Demo Access" or "Bypass with Local DB".'));
      } else {
        setSignInError(translate('Google authentication failed or is blocked. Please use the main Login page bypass.'));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('premier_token');
      localStorage.removeItem('premier_demo_token');
      localStorage.removeItem('premier_user_profile');
      localStorage.removeItem('premier_demo_profile');
      setCurrentUser(null);
      setBookingsList([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchMyBookings = async (email: string) => {
    if (!email) return;
    setLoadingBookings(true);
    setErrorBookings('');
    try {
      const res = await fetch(`/api/bookings/my-bookings?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setBookingsList(data);
      } else {
        const errData = await res.json();
        setErrorBookings(errData.error || translate('Failed to fetch bookings.'));
      }
    } catch (err) {
      console.error(err);
      setErrorBookings(translate('An error occurred while fetching your bookings.'));
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSearchBookings = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMyBookings(emailForBookings);
  };

  if (!isOpen) return null;

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div id="auth-modal-content" className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#0091EA]" />
            {currentUser ? translate('My Account') : translate('Welcome to Premier Tour')}
          </h2>
          <button 
            id="close-auth-modal" 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        {currentUser && (
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'profile' ? 'text-[#0091EA] border-b-2 border-b-[#0091EA] bg-[#0091EA]/5' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            >
              {translate('My Profile')}
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'bookings' ? 'text-[#0091EA] border-b-2 border-b-[#0091EA] bg-[#0091EA]/5' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            >
              {translate('My Bookings')} ({bookingsList.length})
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {currentUser ? (
            activeTab === 'profile' ? (
              <div className="space-y-6 text-center">
                <div className="flex flex-col items-center">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="w-20 h-20 rounded-full ring-4 ring-slate-100 shadow-md" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-20 h-20 bg-[#0091EA] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                      {currentUser.displayName ? currentUser.displayName[0] : currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <h3 className="mt-4 text-xl font-bold text-gray-900">{translate(currentUser.displayName || 'Traveler')}</h3>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2">
                  <p className="text-xs font-semibold text-[#0091EA] uppercase tracking-wider">{translate('Verified Account')}</p>
                  <p className="text-sm text-gray-700">{translate('Welcome to your secure Premier Tour Booking traveler account. You can manage your search preferences and track your holiday itineraries seamlessly.')}</p>
                  <div className="pt-2 flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-500">{translate('Account Status:')}</span>
                    <span className="text-emerald-600 font-bold">{translate('Active')}</span>
                  </div>
                </div>

                <button
                  id="sign-out-btn"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 py-3 rounded-xl font-semibold transition-all hover:scale-[1.01]"
                >
                  <LogOut className="w-5 h-5" />
                  {translate('Sign Out of Account')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">{translate('Your Bookings List')}</h3>
                <p className="text-sm text-gray-500">{translate('Check current reservations and travel schedules synced under your registered email.')}</p>
                
                {loadingBookings && (
                  <div className="py-10 text-center text-gray-500">{translate('Loading your reservations...')}</div>
                )}

                {!loadingBookings && bookingsList.length === 0 && (
                  <div className="py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">{translate('No bookings found yet.')}</p>
                    <p className="text-xs text-gray-400 mt-1">{translate('Book a tour, holiday, or flight to see it here.')}</p>
                  </div>
                )}

                {!loadingBookings && bookingsList.length > 0 && (
                  <div className="space-y-3">
                    {bookingsList.map((booking) => (
                      <div key={booking.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/80 hover:bg-white hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                              {translate(booking.status)}
                            </span>
                            <h4 className="text-sm font-bold text-gray-800 mt-2">
                              {booking.packageId ? `${translate('Holiday Package Booking')} #${booking.id}` : `${translate('Tour Experience Booking')} #${booking.id}`}
                            </h4>
                          </div>
                          <p className="text-sm font-bold text-blue-600">ID: PTB-{1000 + booking.id}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{translate('Date')}: {booking.travelDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span>{translate('Guests')}: {booking.guests}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{booking.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{booking.phone}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600">{translate('Sign in to save your wishlist, view and track bookings, and manage your travel itineraries.')}</p>
              </div>

              {signInError && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold text-center leading-relaxed">
                  {signInError}
                </div>
              )}

              {/* MongoDB Login / Register Buttons */}
              <div className="space-y-3">
                <button
                  id="auth-modal-login-btn"
                  onClick={() => {
                    onClose();
                    window.history.pushState({}, '', '/login');
                    window.dispatchEvent(new Event('popstate'));
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#0091EA] hover:bg-[#007cc7] text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-[#0091EA]/10 hover:scale-[1.01] cursor-pointer"
                >
                  <LogIn className="w-5 h-5" />
                  {translate('Sign In to Account')}
                </button>
                <button
                  id="auth-modal-signup-btn"
                  onClick={() => {
                    onClose();
                    window.history.pushState({}, '', '/signup');
                    window.dispatchEvent(new Event('popstate'));
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl font-bold transition-all cursor-pointer"
                >
                  {translate('Create New Member Account')}
                </button>
              </div>

              <div className="relative flex items-center justify-center my-6">
                <hr className="w-full border-gray-200" />
                <span className="absolute bg-white px-4 text-xs font-medium text-gray-400 uppercase tracking-widest">{translate('or search guest bookings')}</span>
              </div>

              {/* Search Booking via Email */}
              <form onSubmit={handleSearchBookings} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">{translate('Your Email Address')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder={translate('Enter the email you booked with')}
                      value={emailForBookings}
                      onChange={(e) => setEmailForBookings(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0091EA] focus:border-transparent text-sm transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-bold text-sm transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Find My Guest Bookings
                </button>
              </form>

              {loadingBookings && (
                <div className="text-center text-sm text-gray-500 py-2">Searching bookings...</div>
              )}

              {errorBookings && (
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs border border-rose-100 text-center">{errorBookings}</div>
              )}

              {!loadingBookings && emailForBookings && bookingsList.length > 0 && (
                <div className="border-t border-gray-100 pt-4 space-y-2 max-h-[220px] overflow-y-auto">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Found {bookingsList.length} bookings:</p>
                  {bookingsList.map((booking) => (
                    <div key={booking.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-gray-800">PTB-{1000 + booking.id}</p>
                        <p className="text-gray-500">{booking.travelDate} • {booking.guests} guests</p>
                      </div>
                      <span className="px-2 py-0.5 font-semibold rounded-full bg-amber-100 text-amber-800">
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {!loadingBookings && emailForBookings && bookingsList.length === 0 && !errorBookings && (
                <p className="text-center text-xs text-gray-400 italic">No bookings found for this email.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
