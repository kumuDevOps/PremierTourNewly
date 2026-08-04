import React, { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './lib/firebase.ts';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import AuthModal from './components/AuthModal.tsx';
import HomeView from './components/HomeView.tsx';
import ToursView from './components/ToursView.tsx';
import FlightsView from './components/FlightsView.tsx';
import CarsView from './components/CarsView.tsx';
import HotelsView from './components/HotelsView.tsx';
import AboutView from './components/AboutView.tsx';
import ContactView from './components/ContactView.tsx';
import AdminView from './components/AdminView.tsx';
import LoginView from './components/LoginView.tsx';
import SignupView from './components/SignupView.tsx';
import ForgotPasswordView from './components/ForgotPasswordView.tsx';
import CustomerDashboardView from './components/CustomerDashboardView.tsx';
import BlogView from './components/BlogView.tsx';
import WishlistView from './components/WishlistView.tsx';
import { Heart, Trash2, X, Compass, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const path = window.location.pathname;
    if (path === '/admin') return 'admin';
    if (path === '/login') return 'login';
    if (path === '/signup') return 'signup';
    if (path === '/forgot-password') return 'forgot-password';
    if (path === '/account/dashboard') return 'account-dashboard';
    if (path === '/account/bookings') return 'account-bookings';
    if (path === '/account/settings') return 'account-settings';
    if (path === '/wishlist') return 'wishlist';
    if (path === '/tour') return 'tour';
    if (path === '/hotels') return 'hotels';
    if (path === '/flights') return 'flights';
    if (path === '/rent-a-car') return 'rent-a-car';
    if (path === '/about-us') return 'about-us';
    if (path === '/contact-us') return 'contact-us';
    return 'home';
  });

  const [homeSearchTab, setHomeSearchTab] = useState<'flight-hotel' | 'hotels' | 'flights' | 'cars'>('flight-hotel');
  const [tourCategory, setTourCategory] = useState<string>('All');
  
  // Authentication States
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  
  // Visual Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Dark Mode Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('premier_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Sync theme preference with DOM classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('premier_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Search parameters syncing from Home Search Form to Flights/Tours
  const [searchParams, setSearchParams] = useState<{ from: string; to: string } | undefined>(undefined);

  // Wishlist state (saved in LocalStorage)
  const [wishlist, setWishlist] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('premier_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlistOpen, setWishlistOpen] = useState<boolean>(false);

  // Navigate wrapper supporting both pushState and view setting
  const navigateTo = (page: string, params?: Record<string, string>) => {
    let path = '/';
    if (page === 'home') path = '/';
    else if (page === 'admin') path = '/admin';
    else if (page === 'login') path = '/login';
    else if (page === 'signup') path = '/signup';
    else if (page === 'forgot-password') path = '/forgot-password';
    else if (page === 'account-dashboard') path = '/account/dashboard';
    else if (page === 'account-bookings') path = '/account/bookings';
    else if (page === 'account-settings') path = '/account/settings';
    else if (page === 'wishlist') path = '/wishlist';
    else if (page === 'tour') path = '/tour';
    else if (page === 'hotels') path = '/hotels';
    else if (page === 'flights') path = '/flights';
    else if (page === 'rent-a-car') path = '/rent-a-car';
    else if (page === 'about-us') path = '/about-us';
    else if (page === 'contact-us') path = '/contact-us';

    if (params) {
      const searchParams = new URLSearchParams(params);
      path = `${path}?${searchParams.toString()}`;
    }

    window.history.pushState({}, '', path);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for navigation updates (popstate for back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') setCurrentPage('admin');
      else if (path === '/login') setCurrentPage('login');
      else if (path === '/signup') setCurrentPage('signup');
      else if (path === '/forgot-password') setCurrentPage('forgot-password');
      else if (path === '/account/dashboard') setCurrentPage('account-dashboard');
      else if (path === '/account/bookings') setCurrentPage('account-bookings');
      else if (path === '/account/settings') setCurrentPage('account-settings');
      else if (path === '/wishlist') setCurrentPage('wishlist');
      else if (path === '/tour') setCurrentPage('tour');
      else if (path === '/hotels') setCurrentPage('hotels');
      else if (path === '/flights') setCurrentPage('flights');
      else if (path === '/rent-a-car') setCurrentPage('rent-a-car');
      else if (path === '/about-us') setCurrentPage('about-us');
      else if (path === '/contact-us') setCurrentPage('contact-us');
      else setCurrentPage('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Monitor auth session with MongoDB token persistence
  useEffect(() => {
    async function checkAuthSession() {
      const token = localStorage.getItem('premier_token') || localStorage.getItem('premier_demo_token');
      const savedProfileStr = localStorage.getItem('premier_user_profile') || localStorage.getItem('premier_demo_profile');

      if (token) {
        try {
          // Verify token with backend /api/auth/me
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (res.ok) {
            const user = await res.json();
            setUserProfile(user);
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.fullName || user.email,
              getIdToken: async () => token
            } as any);
            setLoadingAuth(false);
            return;
          }
        } catch (e) {
          console.error('Failed to verify token with MongoDB backend:', e);
        }

        // Fallback to local profile cache if offline
        if (savedProfileStr) {
          try {
            const savedProfile = JSON.parse(savedProfileStr);
            setUserProfile(savedProfile);
            setCurrentUser({
              uid: savedProfile.uid,
              email: savedProfile.email,
              displayName: savedProfile.fullName || savedProfile.email,
              getIdToken: async () => token
            } as any);
            setLoadingAuth(false);
            return;
          } catch (e) {
            console.error('Error parsing saved local profile:', e);
          }
        }
      }

      setCurrentUser(null);
      setUserProfile(null);
      setLoadingAuth(false);
    }

    checkAuthSession();
  }, []);


  // Route Protection & Middleware checks
  useEffect(() => {
    if (loadingAuth) return;

    // 1. Admin Page Protection
    if (currentPage === 'admin') {
      const allowedAdminRoles = ['admin', 'hotel_manager', 'car_manager'];
      if (!currentUser || !userProfile || !allowedAdminRoles.includes(userProfile.role)) {
        // Redirect with message
        window.history.pushState({}, '', '/login?redirect=/admin&error=Insufficient%20permissions%20to%20access%20the%20Admin%20Panel');
        setCurrentPage('login');
        showToast('You do not have permission to access the Admin Panel.', 'error');
      }
    }

    // 2. Customer Dashboard Protection
    const accountPages = ['account-dashboard', 'account-bookings', 'account-settings'];
    if (accountPages.includes(currentPage)) {
      if (!currentUser) {
        window.history.pushState({}, '', `/login?redirect=/account/dashboard&error=Sign%20in%20required%20to%20access%20dashboard`);
        setCurrentPage('login');
        showToast('Please sign in to access your dashboard.', 'error');
      }
    }
  }, [currentPage, currentUser, userProfile, loadingAuth]);

  useEffect(() => {
    localStorage.setItem('premier_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Global toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('premier_token');
      localStorage.removeItem('premier_demo_token');
      localStorage.removeItem('premier_user_profile');
      localStorage.removeItem('premier_demo_profile');
      setCurrentUser(null);
      setUserProfile(null);
      showToast("You've been logged out successfully.", 'success');
      navigateTo('home');
    } catch (err) {
      console.error('Logout failed:', err);
      showToast('An error occurred during sign out.', 'error');
    }
  };

  const handleLoginSuccess = (profile: any, redirectUrl?: string) => {
    setUserProfile(profile);
    
    const savedToken = localStorage.getItem('premier_token') || localStorage.getItem('premier_demo_token');
    setCurrentUser({
      uid: profile.uid,
      email: profile.email,
      displayName: profile.fullName || profile.email,
      getIdToken: async () => savedToken || ''
    } as any);

    showToast(`Welcome back, ${profile.fullName || profile.email}!`, 'success');

    
    if (redirectUrl) {
      // Decode redirect URL and navigate
      const decoded = decodeURIComponent(redirectUrl);
      if (decoded === '/admin' && profile.role === 'admin') {
        navigateTo('admin');
      } else if (decoded.startsWith('/account')) {
        navigateTo('account-dashboard');
      } else if (decoded === '/tour') {
        navigateTo('tour');
      } else if (decoded === '/flights') {
        navigateTo('flights');
      } else if (decoded === '/rent-a-car') {
        navigateTo('rent-a-car');
      } else {
        navigateTo('home');
      }
    } else {
      // Default roles redirections
      if (profile.role === 'admin') {
        navigateTo('admin');
      } else {
        navigateTo('account-dashboard');
      }
    }
  };

  const addToWishlist = (item: any) => {
    const exists = wishlist.some((w) => w.id === item.id);
    if (!exists) {
      setWishlist([...wishlist, item]);
      showToast(`Added ${item.title} to your wishlist!`, 'success');
    } else {
      showToast('Item is already in your wishlist.', 'info');
    }
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(wishlist.filter((w) => w.id !== id));
    showToast('Removed item from your wishlist.', 'info');
  };

  const handleSetSearchQuery = (query: { from: string; to: string }) => {
    setSearchParams(query);
  };

  const renderActiveView = () => {
    if (loadingAuth) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#0091EA]" />
          <p className="text-sm font-bold text-slate-500">Checking traveler credentials...</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <HomeView 
            setCurrentPage={navigateTo} 
            onOpenAuth={() => navigateTo('login')}
            addToWishlist={addToWishlist}
            setSearchQuery={handleSetSearchQuery}
            homeSearchTab={homeSearchTab}
            setHomeSearchTab={setHomeSearchTab}
            currentUser={currentUser}
            userProfile={userProfile}
          />
        );
      case 'tour':
        return (
          <ToursView 
            key={tourCategory}
            addToWishlist={addToWishlist}
            initialSearchQuery={searchParams}
            initialCategory={tourCategory}
            currentUser={currentUser}
            userProfile={userProfile}
            onOpenAuth={() => navigateTo('login')}
            onNavigate={navigateTo}
          />
        );
      case 'flights':
        return (
          <FlightsView 
            initialQuery={searchParams}
            currentUser={currentUser}
            userProfile={userProfile}
            onOpenAuth={() => navigateTo('login')}
            onNavigate={navigateTo}
          />
        );
      case 'rent-a-car':
        return (
          <CarsView 
            addToWishlist={addToWishlist} 
            initialSearchQuery={searchParams}
            currentUser={currentUser}
            userProfile={userProfile}
            onOpenAuth={() => navigateTo('login')}
            onNavigate={navigateTo}
          />
        );
      case 'hotels':
        return (
          <HotelsView 
            addToWishlist={addToWishlist} 
            initialSearchQuery={searchParams}
            currentUser={currentUser}
            userProfile={userProfile}
            onOpenAuth={() => navigateTo('login')}
            onNavigate={navigateTo}
          />
        );
      case 'about-us':
        return (
          <AboutView />
        );
      case 'blog':
        return (
          <BlogView onNavigate={navigateTo} />
        );
      case 'contact-us':
        return (
          <ContactView />
        );
      case 'wishlist':
        return (
          <WishlistView 
            wishlist={wishlist}
            removeFromWishlist={removeFromWishlist}
            onNavigate={navigateTo}
            onOpenAuth={() => navigateTo('login')}
            currentUser={currentUser}
            userProfile={userProfile}
            clearWishlist={() => {
              setWishlist([]);
              showToast('Wishlist cleared.', 'info');
            }}
          />
        );
      case 'login':
        return (
          <LoginView 
            onNavigate={navigateTo}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'signup':
        return (
          <SignupView 
            onNavigate={navigateTo}
            onSignupSuccess={(profile) => {
              setUserProfile(profile);
              showToast('Account registered successfully!', 'success');
              navigateTo('account-dashboard');
            }}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordView 
            onNavigate={navigateTo}
          />
        );
      case 'account-dashboard':
      case 'account-bookings':
      case 'account-settings': {
        const initialTab = currentPage === 'account-bookings' ? 'bookings' : (currentPage === 'account-settings' ? 'settings' : 'dashboard');
        return (
          <CustomerDashboardView 
            onNavigate={navigateTo}
            currentUser={currentUser}
            userProfile={userProfile}
            onProfileUpdate={(updated) => setUserProfile(updated)}
            onLogout={handleLogout}
            initialTab={initialTab}
            onOpenWishlist={() => navigateTo('wishlist')}
            wishlistCount={wishlist.length}
          />
        );
      }
      default:
        return (
          <HomeView 
            setCurrentPage={navigateTo} 
            onOpenAuth={() => navigateTo('login')}
            addToWishlist={addToWishlist}
            setSearchQuery={handleSetSearchQuery}
            homeSearchTab={homeSearchTab}
            setHomeSearchTab={setHomeSearchTab}
            currentUser={currentUser}
            userProfile={userProfile}
          />
        );
    }
  };

  if (currentPage === 'admin') {
    return (
      <div className="relative">
        {/* Toast alerts inside Admin View */}
        {toast && (
          <div className="fixed top-5 right-5 z-[999] animate-slide-left p-4 rounded-xl shadow-xl flex items-center gap-3 border bg-slate-900 border-slate-800 text-white font-medium text-xs">
            <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-sky-500'}`} />
            <span>{toast.message}</span>
          </div>
        )}
        <AdminView
          onBackToMain={() => {
            window.history.pushState({}, '', '/');
            setCurrentPage('home');
          }}
          currentUser={currentUser}
          userProfile={userProfile}
          loadingAuth={loadingAuth}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
      
      {/* Dynamic Toast Notifications */}
      {toast && (
        <div className="fixed top-5 right-5 z-[999] animate-slide-left p-4 rounded-xl shadow-xl flex items-center gap-3 border bg-slate-900 border-slate-800 text-white font-semibold text-xs">
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : toast.type === 'error' ? 'bg-rose-400' : 'bg-sky-400'}`} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Dynamic Header */}
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={navigateTo}
        currentUser={currentUser}
        userProfile={userProfile}
        onOpenAuth={() => navigateTo('login')}
        onLogout={handleLogout}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => navigateTo('wishlist')}
        homeSearchTab={homeSearchTab}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onSelectSearchTab={(tab) => {
          setHomeSearchTab(tab);
          navigateTo('home');
          setTimeout(() => {
            const el = document.getElementById('search-card-container');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }}
        onSelectTourCategory={(category) => {
          setTourCategory(category);
          navigateTo('tour');
        }}
      />

      {/* Main Content Body */}
      <main className="flex-grow">
        {renderActiveView()}
      </main>

      {/* Dynamic Footer */}
      <Footer setCurrentPage={navigateTo} />

    </div>
  );
}
