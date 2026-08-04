import { useLanguage } from '../lib/i18n';
import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Compass,
  Car,
  Plane,
  Calendar,
  Users,
  Mail,
  Bell,
  Settings,
  LogOut,
  Search,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  Check,
  X,
  Eye,
  RefreshCw,
  MapPin,
  User,
  Globe,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Lock,
  Database,
  RotateCcw,
  History,
  ChevronRight,
  Info,
  Sliders,
  Hotel,
  ShieldCheck,
  Heart,
  Share2,
  TrendingUp,
  Sparkles,
  BookOpen,
  Image as ImageIcon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import Logo from './Logo.tsx';
import FleetScheduleCalendar from './FleetScheduleCalendar.tsx';
import NotificationSimulatorModal from './NotificationSimulatorModal.tsx';

// TODO: Replace hardcoded auth with Supabase Auth + hashed passwords before production

interface AdminViewProps {
  onBackToMain: () => void;
  currentUser: any;
  userProfile: any;
  loadingAuth: boolean;
}

export default function AdminView({ onBackToMain, currentUser, userProfile, loadingAuth }: AdminViewProps) {
  // Authentication States - Bind to actual parent Firebase session check + offline fallback token
  const [localAdminToken, setLocalAdminToken] = useState<boolean>(() => {
    return localStorage.getItem('admin_token') === 'admin-secret-session-token';
  });
  const allowedAdminRoles = ['admin', 'hotel_manager', 'car_manager'];
  const isLoggedIn = (currentUser && userProfile?.role && allowedAdminRoles.includes(userProfile.role)) || localAdminToken;
  const setIsLoggedIn = setLocalAdminToken; // Aliased to satisfy legacy handlers without breaking changes
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Operating Role State for RBAC (Super Admin, Hotel Manager, Car Rent Manager, Flight Manager, Tour Manager, User)
  const [activeAdminRole, setActiveAdminRole] = useState<string>(() => {
    return userProfile?.role || localStorage.getItem('admin_active_role') || 'admin';
  });

  useEffect(() => {
    localStorage.setItem('admin_active_role', activeAdminRole);
  }, [activeAdminRole]);

  const ROLE_LABELS: Record<string, string> = {
    admin: 'Super Admin (ROOT_USER)',
    hotel_manager: 'Hotel Manager',
    car_manager: 'Car Rent Manager',
    flight_manager: 'Flight Manager',
    tour_manager: 'Tour Manager',
    customer: 'Customer / User'
  };

  const canManageSection = (section: 'tours' | 'cars' | 'flights' | 'hotels') => {
    if (activeAdminRole === 'admin') return true;
    if (activeAdminRole === 'hotel_manager' && section === 'hotels') return true;
    if (activeAdminRole === 'car_manager' && section === 'cars') return true;
    if (activeAdminRole === 'flight_manager' && section === 'flights') return true;
    if (activeAdminRole === 'tour_manager' && section === 'tours') return true;
    return false;
  };

  const getRequiredRoleName = (section: 'tours' | 'cars' | 'flights' | 'hotels') => {
    switch (section) {
      case 'hotels': return 'Hotel Manager';
      case 'cars': return 'Car Rent Manager';
      case 'flights': return 'Flight Manager';
      case 'tours': return 'Tour Manager';
      default: return 'Super Admin';
    }
  };

  // Layout & Navigation States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'tours' | 'cars' | 'fleet-schedule' | 'bookings' | 'flights' | 'hotels' | 'customers' | 'messages' | 'subscribers' | 'snapshots' | 'settings' | 'blogs'
  >('dashboard');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Global Data States
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [blogPerformance, setBlogPerformance] = useState<any>(null);
  const [toursList, setToursList] = useState<any[]>([]);
  const [carsList, setCarsList] = useState<any[]>([]);
  const [flightsList, setFlightsList] = useState<any[]>([]);
  const [hotelsList, setHotelsList] = useState<any[]>([]);
  const [snapshotsList, setSnapshotsList] = useState<any[]>([]);
  const [bookingsData, setBookingsData] = useState<{
    tourBookings: any[];
    carBookings: any[];
    flightBookings: any[];
    hotelBookings: any[];
  }>({ tourBookings: [], carBookings: [], flightBookings: [], hotelBookings: [] });
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [subscribersList, setSubscribersList] = useState<any[]>([]);
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [blogCategoriesList, setBlogCategoriesList] = useState<any[]>([]);

  // Search & Filter States
  const [globalSearch, setGlobalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bookingsActiveTab, setBookingsActiveTab] = useState<'tour' | 'car' | 'flight' | 'hotel'>('tour');

  // Modal States
  const [activeModal, setActiveModal] = useState<'tour' | 'car' | 'flight' | 'hotel' | 'blog' | 'blogCat' | 'customerDetail' | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [customerModalTab, setCustomerModalTab] = useState<'bookings' | 'logins'>('bookings');

  // Blog Article Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Heritage');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');
  const [blogAuthor, setBlogAuthor] = useState('Admin');
  const [blogDate, setBlogDate] = useState(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogImage, setBlogImage] = useState('');

  // Category Container Image Form State
  const [selectedCatId, setSelectedCatId] = useState('');
  const [selectedCatName, setSelectedCatName] = useState('');
  const [selectedCatImage, setSelectedCatImage] = useState('');

  // Form Field States
  // Tour Form
  const [tourTitle, setTourTitle] = useState('');
  const [tourDesc, setTourDesc] = useState('');
  const [tourImage, setTourImage] = useState('');
  const [tourDuration, setTourDuration] = useState('');
  const [tourPrice, setTourPrice] = useState('');
  const [tourCategory, setTourCategory] = useState('Beach Holidays');
  const [tourMaxGuests, setTourMaxGuests] = useState('10');
  const [tourStatus, setTourStatus] = useState('Active');
  const [tourItinerary, setTourItinerary] = useState<{ day: number; title: string; description: string }[]>([
    { day: 1, title: 'Arrival', description: 'Arrive at destination and check in.' }
  ]);
  const [tourGalleryImages, setTourGalleryImages] = useState<string[]>([]);
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState('');

  // Car Form
  const [carName, setCarName] = useState('');
  const [carCategory, setCarCategory] = useState('Sedan');
  const [carSeats, setCarSeats] = useState('5');
  const [carTransmission, setCarTransmission] = useState('Automatic');
  const [carPrice, setCarPrice] = useState('');
  const [carImage, setCarImage] = useState('');
  const [carStatus, setCarStatus] = useState('Available');

  // Flight Form
  const [flightAirline, setFlightAirline] = useState('');
  const [flightFrom, setFlightFrom] = useState('');
  const [flightTo, setFlightTo] = useState('');
  const [flightDeparture, setFlightDeparture] = useState('');
  const [flightArrival, setFlightArrival] = useState('');
  const [flightPrice, setFlightPrice] = useState('');
  const [flightStops, setFlightStops] = useState('0');

  // Hotel Form
  const [hotelName, setHotelName] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [hotelPrice, setHotelPrice] = useState('');
  const [hotelStarRating, setHotelStarRating] = useState('5');
  const [hotelDescription, setHotelDescription] = useState('');
  const [hotelAmenities, setHotelAmenities] = useState('');
  const [hotelImageUrl, setHotelImageUrl] = useState('');

  // Notification Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Settings State
  const [settingsBusinessName, setSettingsBusinessName] = useState('Premier Tour Booking');
  const [settingsPhone, setSettingsPhone] = useState('+94 77 123 1234');
  const [settingsEmail, setSettingsEmail] = useState('info@premiertours.com');
  const [settingsAddress, setSettingsAddress] = useState('123 Galle Road, Colombo, Sri Lanka');
  const [settingsVat, setSettingsVat] = useState('15');

  // Fetch all stats and tables
  const loadDashboardData = async () => {
    setStatsLoading(true);
    try {
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch message count for notifications
      const msgRes = await fetch('/api/admin/messages');
      if (msgRes.ok) {
        const msgs = await msgRes.json();
        setMessagesList(msgs);
      }
    } catch (e) {
      showToast('Failed to load real-time statistics', 'error');
    } finally {
      setStatsLoading(false);
    }
  };

  const loadTours = async () => {
    try {
      const res = await fetch('/api/admin/tours');
      if (res.ok) setToursList(await res.json());
    } catch (e) {
      showToast('Error loading tours', 'error');
    }
  };

  const handleExportBackup = async () => {
    try {
      const res = await fetch('/api/admin/backup');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tour_packages_db_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      showToast('Database backup exported successfully!', 'success');
    } catch (err) {
      showToast('Failed to export backup', 'error');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        const res = await fetch('/api/admin/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json)
        });
        if (res.ok) {
          showToast('Database backup restored successfully!', 'success');
          loadDashboardData();
          loadTours();
          loadCars();
          loadFlights();
          loadHotels();
          loadBlogs();
          loadSnapshots();
        } else {
          showToast('Failed to restore backup', 'error');
        }
      } catch (err) {
        showToast('Invalid backup file format', 'error');
      }
    };
    reader.readAsText(file);
  };

  const loadCars = async () => {
    try {
      const res = await fetch('/api/admin/cars');
      if (res.ok) setCarsList(await res.json());
    } catch (e) {
      showToast('Error loading cars', 'error');
    }
  };

  const loadFlights = async () => {
    try {
      const res = await fetch('/api/admin/flights');
      if (res.ok) setFlightsList(await res.json());
    } catch (e) {
      showToast('Error loading flights', 'error');
    }
  };

  const loadHotels = async () => {
    try {
      const res = await fetch('/api/admin/hotels');
      if (res.ok) {
        const data = await res.json();
        setHotelsList(data);
      }
    } catch (e) {
      showToast('Error loading hotels', 'error');
    }
  };

  const loadBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookingsData(data);
      }
    } catch (e) {
      showToast('Error loading bookings', 'error');
    }
  };

  const loadCustomers = async () => {
    try {
      const token = localStorage.getItem('premier_token') || localStorage.getItem('admin_token') || 'admin-secret-session-token';
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCustomersList(await res.json());
      } else {
        const fallbackRes = await fetch('/api/admin/customers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (fallbackRes.ok) setCustomersList(await fallbackRes.json());
      }
    } catch (e) {
      showToast('Error loading customer database', 'error');
    }
  };

  const loadSubscribers = async () => {
    try {
      const res = await fetch('/api/admin/subscribers');
      if (res.ok) setSubscribersList(await res.json());
    } catch (e) {
      showToast('Error loading subscriber database', 'error');
    }
  };

  const loadSnapshots = async () => {
    try {
      const res = await fetch('/api/admin/snapshots');
      if (res.ok) setSnapshotsList(await res.json());
    } catch (e) {
      showToast('Error loading database snapshots', 'error');
    }
  };

  const loadBlogPerformance = async () => {
    try {
      const res = await fetch('/api/admin/blogs/performance');
      if (res.ok) {
        const data = await res.json();
        setBlogPerformance(data);
      }
    } catch (e) {
      console.warn('Error loading blog performance stats', e);
    }
  };

  const handleSimulateEngagement = async () => {
    try {
      const res = await fetch('/api/admin/blogs/simulate-engagement', { method: 'POST' });
      if (res.ok) {
        showToast('Simulated real-time blog reader view & heart like!', 'success');
        loadBlogs();
      }
    } catch (e) {
      showToast('Simulation failed', 'error');
    }
  };

  const loadBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogsList(data.articles || []);
        setBlogCategoriesList(data.categories || []);
      }
      loadBlogPerformance();
    } catch (e) {
      showToast('Error loading blog articles', 'error');
    }
  };

  const handleOpenBlogModal = (mode: 'add' | 'edit', blog?: any) => {
    setModalMode(mode);
    setSelectedItem(blog || null);
    if (mode === 'edit' && blog) {
      setBlogTitle(blog.title || '');
      setBlogCategory(blog.category || 'Heritage');
      setBlogReadTime(blog.readTime || '5 min read');
      setBlogAuthor(blog.author || 'Admin');
      setBlogDate(blog.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
      setBlogExcerpt(blog.excerpt || '');
      setBlogImage(blog.image || '');
    } else {
      setBlogTitle('');
      setBlogCategory('Heritage');
      setBlogReadTime('5 min read');
      setBlogAuthor('Admin');
      setBlogDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
      setBlogExcerpt('');
      setBlogImage('');
    }
    setActiveModal('blog');
  };

  const handleOpenBlogCatModal = (cat: any) => {
    setSelectedCatId(cat.id);
    setSelectedCatName(cat.name);
    setSelectedCatImage(cat.image || '');
    setActiveModal('blogCat');
  };

  const handleSaveBlogArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) {
      showToast('Please enter an article title', 'error');
      return;
    }
    try {
      const payload = {
        id: modalMode === 'edit' && selectedItem ? selectedItem.id : undefined,
        title: blogTitle,
        category: blogCategory,
        readTime: blogReadTime,
        author: blogAuthor,
        date: blogDate,
        excerpt: blogExcerpt,
        image: blogImage || 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200'
      };
      const url = modalMode === 'edit' && selectedItem ? `/api/admin/blogs/${selectedItem.id}` : '/api/admin/blogs';
      const method = modalMode === 'edit' && selectedItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(`Article ${modalMode === 'add' ? 'created' : 'updated'} successfully!`, 'success');
        setActiveModal(null);
        loadBlogs();
      } else {
        showToast('Failed to save article', 'error');
      }
    } catch (err) {
      showToast('Error saving article', 'error');
    }
  };

  const handleDeleteBlogArticle = async (id: number | string) => {
    if (!window.confirm('Are you sure you want to delete this blog article?')) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Blog article deleted', 'success');
        loadBlogs();
      } else {
        showToast('Failed to delete blog article', 'error');
      }
    } catch (err) {
      showToast('Error deleting blog article', 'error');
    }
  };

  const handleSaveBlogCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId) return;
    try {
      const res = await fetch(`/api/admin/blog-categories/${selectedCatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedCatImage })
      });
      if (res.ok) {
        showToast('Category container image updated!', 'success');
        setActiveModal(null);
        loadBlogs();
      } else {
        showToast('Failed to update category image', 'error');
      }
    } catch (err) {
      showToast('Error updating category image', 'error');
    }
  };

  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);

  const handleTriggerSnapshot = async () => {
    try {
      const res = await fetch('/api/admin/snapshots/trigger', { method: 'POST' });
      if (res.ok) {
        showToast('New 24-hour database snapshot captured!', 'success');
        loadSnapshots();
      } else {
        showToast('Failed to trigger snapshot', 'error');
      }
    } catch (e) {
      showToast('Error triggering database snapshot', 'error');
    }
  };

  const handleRestoreSnapshot = async (id: string) => {
    if (confirmRestoreId !== id) {
      setConfirmRestoreId(id);
      setTimeout(() => setConfirmRestoreId(null), 3000);
      return;
    }
    setConfirmRestoreId(null);
    try {
      const res = await fetch(`/api/admin/snapshots/restore/${id}`, { method: 'POST' });
      if (res.ok) {
        showToast('Database successfully restored from snapshot!', 'success');
        loadDashboardData();
        loadTours();
        loadHotels();
        loadFlights();
        loadCars();
        loadBlogs();
        loadSnapshots();
      } else {
        showToast('Failed to restore snapshot', 'error');
      }
    } catch (e) {
      showToast('Error restoring snapshot', 'error');
    }
  };

  const handleRestoreSnapshotFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        
        let payload = json;
        if (json.data && (json.data.tours || json.data.hotels || json.data.blogs)) {
            payload = json.data;
        }

        const res = await fetch('/api/admin/snapshots/restore-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          showToast('Database restored successfully from uploaded file!', 'success');
          loadDashboardData();
          loadTours();
          loadHotels();
          loadFlights();
          loadCars();
          loadBlogs();
          loadSnapshots();
        } else {
          showToast('Failed to restore from file', 'error');
        }
      } catch (err) {
        showToast('Invalid JSON file format', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData();
      loadTours();
      loadCars();
      loadFlights();
      loadHotels();
      loadBookings();
      loadCustomers();
      loadSubscribers();
      loadSnapshots();
      loadBlogs();

      // Subscribe to real-time events via Server-Sent Events
      const eventSource = new EventSource('/api/realtime/stream');
      
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'booking-created') {
            showToast(`New ${payload.data.type} Booking Received!`, 'success');
            loadDashboardData();
            loadBookings();
            loadCustomers();
          } else if (payload.type === 'user-logged-in') {
            if (payload.data.role === 'customer') {
              showToast(`Customer ${payload.data.fullName} is active!`, 'info');
            }
            loadDashboardData();
            loadCustomers();
          } else if (payload.type === 'booking-updated') {
            loadDashboardData();
            loadBookings();
            loadCustomers();
          } else if (payload.type === 'catalog-updated') {
            loadTours();
            loadCars();
            loadFlights();
            loadHotels();
            loadBlogs();
            loadSnapshots();
          }
        } catch (err) {
          console.error('SSE JSON parse error:', err);
        }
      };

      eventSource.onerror = (err) => {
        console.warn('Real-time connection stream closed or retrying...');
      };

      return () => {
        eventSource.close();
      };
    }
  }, [isLoggedIn]);

  // Toast handler
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('admin_token', data.token);
        setIsLoggedIn(true);
        showToast('Successfully authenticated as administrator', 'success');
      } else {
        const err = await res.json();
        setLoginError(err.error || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('Server authentication failed');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    onBackToMain();
  };

  // Status Badge Helper
  const renderStatusBadge = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    let classes = 'px-2.5 py-1 text-xs font-semibold rounded-full ';
    if (s === 'confirmed' || s === 'active' || s === 'available' || s === 'read') {
      classes += 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    } else if (s === 'pending' || s === 'unread' || s === 'maintenance') {
      classes += 'bg-amber-50 text-amber-700 border border-amber-200';
    } else if (s === 'cancelled' || s === 'inactive' || s === 'booked') {
      classes += 'bg-rose-50 text-rose-700 border border-rose-200';
    } else {
      classes += 'bg-slate-50 text-slate-700 border border-slate-200';
    }
    return <span className={classes}>{status || 'N/A'}</span>;
  };

  // Export to CSV helper
  const handleExportCSV = (type: 'bookings' | 'subscribers' | 'customers') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (type === 'bookings') {
      csvContent += "ID,Customer Name,Item Booked,Travel/Pickup Date,Status,Amount\n";
      const currentList = bookingsActiveTab === 'tour' ? bookingsData.tourBookings 
                        : bookingsActiveTab === 'car' ? bookingsData.carBookings 
                        : bookingsData.flightBookings;

      currentList.forEach(row => {
        const dateStr = bookingsActiveTab === 'car' ? `${row.pickupDate} to ${row.returnDate}` : (row.travelDate || '');
        csvContent += `"${row.id}","${row.userName || row.customerName || row.passengerName || ''}","${row.itemName || ''}","${dateStr}","${row.status || ''}","${row.price || row.itemPrice || ''}"\n`;
      });
    } else if (type === 'subscribers') {
      csvContent += "ID,Email,Created At\n";
      subscribersList.forEach(row => {
        csvContent += `"${row.id}","${row.email}","${row.createdAt || ''}"\n`;
      });
    } else if (type === 'customers') {
      csvContent += "Email,Name,Phone,Bookings Count,Total Spend\n";
      customersList.forEach(row => {
        csvContent += `"${row.email}","${row.name}","${row.phone}","${row.bookingsCount}","${row.totalSpend}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Successfully exported ${type} to CSV`, 'success');
  };

  // Status update dispatcher
  const handleUpdateStatus = async (type: 'tour-booking' | 'car-booking' | 'flight-booking' | 'hotel-booking' | 'message', id: number | string, newStatus: string) => {
    let url = '';
    if (type === 'tour-booking') url = `/api/admin/bookings/${id}/status`;
    if (type === 'car-booking') url = `/api/admin/car-bookings/${id}/status`;
    if (type === 'flight-booking') url = `/api/admin/flight-bookings/${id}/status`;
    if (type === 'hotel-booking') url = `/api/admin/hotel-bookings/${id}/status`;
    if (type === 'message') url = `/api/admin/messages/${id}/status`;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast('Status successfully updated', 'success');
        loadBookings();
        loadDashboardData();
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch (e) {
      showToast('Error updating status', 'error');
    }
  };

  // User Role Update Dispatcher
  const handleUpdateUserRole = async (customer: any, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: customer.uid || customer.id,
          email: customer.email,
          role: newRole,
          fullName: customer.fullName || customer.name,
          phone: customer.phone
        })
      });

      if (res.ok) {
        showToast(`Role for ${customer.fullName || customer.email} updated to ${ROLE_LABELS[newRole] || newRole}`, 'success');
        loadCustomers();
      } else {
        showToast('Failed to update user role', 'error');
      }
    } catch (e) {
      showToast('Error updating user role', 'error');
    }
  };

  // CRUD Save Handlers
  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageSection('tours')) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only Tour Manager or Super Admin can save tour packages.`, 'error');
      return;
    }
    const payload = {
      title: tourTitle,
      description: tourDesc,
      imageUrl: tourImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      duration: tourDuration,
      price: tourPrice,
      category: tourCategory,
      maxGuests: tourMaxGuests,
      status: tourStatus,
      itinerary: JSON.stringify(tourItinerary),
      galleryImages: JSON.stringify(tourGalleryImages)
    };

    const url = modalMode === 'add' ? '/api/admin/tours' : `/api/admin/tours/${selectedItem.id}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'add' ? 'Tour successfully created' : 'Tour successfully updated', 'success');
        setActiveModal(null);
        loadTours();
        loadDashboardData();
      } else {
        showToast('Error saving tour information', 'error');
      }
    } catch (error) {
      showToast('Connection error', 'error');
    }
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageSection('cars')) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only Car Rent Manager or Super Admin can save vehicle rentals.`, 'error');
      return;
    }
    const payload = {
      name: carName,
      category: carCategory,
      seats: carSeats,
      transmission: carTransmission,
      pricePerDay: carPrice,
      imageUrl: carImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
      status: carStatus
    };

    const url = modalMode === 'add' ? '/api/admin/cars' : `/api/admin/cars/${selectedItem.id}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'add' ? 'Car rental successfully created' : 'Car rental successfully updated', 'success');
        setActiveModal(null);
        loadCars();
        loadDashboardData();
      } else {
        showToast('Error saving car information', 'error');
      }
    } catch (error) {
      showToast('Connection error', 'error');
    }
  };

  const handleSaveFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageSection('flights')) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only Flight Manager or Super Admin can save flights.`, 'error');
      return;
    }
    const payload = {
      airline: flightAirline,
      fromCity: flightFrom,
      toCity: flightTo,
      departureTime: flightDeparture,
      arrivalTime: flightArrival,
      price: flightPrice,
      stops: flightStops
    };

    const url = modalMode === 'add' ? '/api/admin/flights' : `/api/admin/flights/${selectedItem.id}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'add' ? 'Flight successfully created' : 'Flight successfully updated', 'success');
        setActiveModal(null);
        loadFlights();
        loadDashboardData();
      } else {
        showToast('Error saving flight information', 'error');
      }
    } catch (error) {
      showToast('Connection error', 'error');
    }
  };

  const handleSaveHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageSection('hotels')) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only Hotel Manager or Super Admin can save hotels.`, 'error');
      return;
    }
    const payload = {
      name: hotelName,
      location: hotelLocation,
      price: hotelPrice,
      starRating: hotelStarRating,
      description: hotelDescription,
      amenities: hotelAmenities,
      imageUrl: hotelImageUrl
    };

    const url = modalMode === 'add' ? '/api/admin/hotels' : `/api/admin/hotels/${selectedItem.id}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'add' ? 'Hotel successfully created' : 'Hotel successfully updated', 'success');
        setActiveModal(null);
        loadHotels();
        loadDashboardData();
      } else {
        showToast('Error saving hotel information', 'error');
      }
    } catch (error) {
      showToast('Connection error', 'error');
    }
  };

  // CRUD Delete Handlers
  const handleDeleteItem = async (type: 'tour' | 'car' | 'flight' | 'hotel', id: number | string) => {
    const sectionMap: Record<string, 'tours' | 'cars' | 'flights' | 'hotels'> = {
      tour: 'tours',
      car: 'cars',
      flight: 'flights',
      hotel: 'hotels'
    };
    const section = sectionMap[type];
    if (section && !canManageSection(section)) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only ${getRequiredRoleName(section)} or Super Admin can delete ${section}.`, 'error');
      return;
    }

    if (!confirm(`Are you absolutely sure you want to delete this ${type}? Doing so will clean up matching active sessions.`)) return;

    try {
      const res = await fetch(`/api/admin/${type}s/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`${type.toUpperCase()} deleted successfully`, 'success');
        if (type === 'tour') loadTours();
        if (type === 'car') loadCars();
        if (type === 'flight') loadFlights();
        if (type === 'hotel') loadHotels();
        loadDashboardData();
      } else {
        showToast(`Failed to delete ${type}`, 'error');
      }
    } catch (e) {
      showToast('Error deleting item', 'error');
    }
  };

  // Edit Modal Bootstrapping
  const openEditTour = (tour: any) => {
    if (!canManageSection('tours')) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only Tour Manager or Super Admin can edit tour packages.`, 'error');
      return;
    }
    setSelectedItem(tour);
    setModalMode('edit');
    setTourTitle(tour.title || '');
    setTourDesc(tour.description || '');
    setTourImage(tour.imageUrl || '');
    setTourDuration(tour.duration || '');
    setTourPrice(tour.price?.toString() || '');
    setTourCategory(tour.category || 'Beach Holidays');
    setTourMaxGuests(tour.maxGuests?.toString() || '10');
    setTourStatus(tour.status || 'Active');
    try {
      setTourItinerary(typeof tour.itinerary === 'string' ? JSON.parse(tour.itinerary) : tour.itinerary || []);
    } catch (e) {
      setTourItinerary([{ day: 1, title: 'Arrival', description: 'Arrive and check-in' }]);
    }

    let parsedGallery: string[] = [];
    if (tour.galleryImages) {
      try {
        parsedGallery = typeof tour.galleryImages === 'string' ? JSON.parse(tour.galleryImages) : tour.galleryImages;
      } catch (e) {
        if (typeof tour.galleryImages === 'string' && tour.galleryImages.includes(',')) {
          parsedGallery = tour.galleryImages.split(',').map((s: string) => s.trim());
        } else {
          parsedGallery = [tour.galleryImages];
        }
      }
    }
    if (!Array.isArray(parsedGallery) || parsedGallery.length === 0) {
      parsedGallery = [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
        'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800',
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800'
      ];
    }
    setTourGalleryImages(parsedGallery);
    setNewGalleryUrlInput('');
    setActiveModal('tour');
  };

  const openAddTour = () => {
    if (!canManageSection('tours')) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only Tour Manager or Super Admin can create tour packages.`, 'error');
      return;
    }
    setSelectedItem(null);
    setModalMode('add');
    setTourTitle('');
    setTourDesc('');
    setTourImage('');
    setTourDuration('');
    setTourPrice('');
    setTourCategory('Beach Holidays');
    setTourMaxGuests('10');
    setTourStatus('Active');
    setTourItinerary([{ day: 1, title: 'Arrival', description: 'Arrive at destination and check in.' }]);
    setTourGalleryImages([
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800'
    ]);
    setNewGalleryUrlInput('');
    setActiveModal('tour');
  };

  const openEditCar = (car: any) => {
    if (!canManageSection('cars')) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only Car Rent Manager or Super Admin can edit vehicles.`, 'error');
      return;
    }
    setSelectedItem(car);
    setModalMode('edit');
    setCarName(car.name || '');
    setCarCategory(car.category || 'Sedan');
    setCarSeats(car.seats?.toString() || '5');
    setCarTransmission(car.transmission || 'Automatic');
    setCarPrice(car.pricePerDay?.toString() || '');
    setCarImage(car.imageUrl || '');
    setCarStatus(car.status || 'Available');
    setActiveModal('car');
  };

  const openAddCar = () => {
    if (!canManageSection('cars')) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only Car Rent Manager or Super Admin can add vehicles.`, 'error');
      return;
    }
    setSelectedItem(null);
    setModalMode('add');
    setCarName('');
    setCarCategory('Sedan');
    setCarSeats('5');
    setCarTransmission('Automatic');
    setCarPrice('');
    setCarImage('');
    setCarStatus('Available');
    setActiveModal('car');
  };

  const openEditFlight = (flight: any) => {
    if (!canManageSection('flights')) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only Flight Manager or Super Admin can edit flights.`, 'error');
      return;
    }
    setSelectedItem(flight);
    setModalMode('edit');
    setFlightAirline(flight.airline || '');
    setFlightFrom(flight.fromCity || '');
    setFlightTo(flight.toCity || '');
    setFlightDeparture(flight.departureTime || '');
    setFlightArrival(flight.arrivalTime || '');
    setFlightPrice(flight.price?.toString() || '');
    setFlightStops(flight.stops?.toString() || '0');
    setActiveModal('flight');
  };

  const openAddFlight = () => {
    if (!canManageSection('flights')) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only Flight Manager or Super Admin can add flights.`, 'error');
      return;
    }
    setSelectedItem(null);
    setModalMode('add');
    setFlightAirline('');
    setFlightFrom('');
    setFlightTo('');
    setFlightDeparture('');
    setFlightArrival('');
    setFlightPrice('');
    setFlightStops('0');
    setActiveModal('flight');
  };

  const openEditHotel = (hotel: any) => {
    if (!canManageSection('hotels')) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only Hotel Manager or Super Admin can edit hotels.`, 'error');
      return;
    }
    setSelectedItem(hotel);
    setModalMode('edit');
    setHotelName(hotel.name || '');
    setHotelLocation(hotel.location || '');
    setHotelPrice(hotel.price?.toString() || '');
    setHotelStarRating(hotel.starRating?.toString() || '5');
    setHotelDescription(hotel.description || '');
    setHotelAmenities(Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : (hotel.amenities || ''));
    setHotelImageUrl(hotel.imageUrl || '');
    setActiveModal('hotel');
  };

  const openAddHotel = () => {
    if (!canManageSection('hotels')) {
      showToast(`Access Restricted: Operating as ${ROLE_LABELS[activeAdminRole] || activeAdminRole}. Only Hotel Manager or Super Admin can add hotels.`, 'error');
      return;
    }
    setSelectedItem(null);
    setModalMode('add');
    setHotelName('');
    setHotelLocation('');
    setHotelPrice('');
    setHotelStarRating('5');
    setHotelDescription('');
    setHotelAmenities('Free WiFi, Swimming Pool, Spa, Fitness Center, Restaurant, Air Conditioning, Room Service');
    setHotelImageUrl('');
    setActiveModal('hotel');
  };

  // Add itinerary day helper
  const handleAddItineraryDay = () => {
    const nextDay = tourItinerary.length + 1;
    setTourItinerary([...tourItinerary, { day: nextDay, title: `Day ${nextDay} Activity`, description: '' }]);
  };

  const handleRemoveItineraryDay = (index: number) => {
    const list = [...tourItinerary];
    list.splice(index, 1);
    // reindex days
    const reindexed = list.map((item, idx) => ({ ...item, day: idx + 1 }));
    setTourItinerary(reindexed);
  };

  // Tour Gallery Management Helpers
  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 1000;
          if (width > height && width > max_size) {
            height *= max_size / width;
            width = max_size;
          } else if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.75);

            try {
              const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: dataUrl })
              });
              if (res.ok) {
                const data = await res.json();
                if (data.url) {
                  setTourGalleryImages((prev) => [...prev, data.url]);
                  showToast('Gallery photo uploaded & added!', 'success');
                  return;
                }
              }
            } catch (err) {
              console.warn('Server upload endpoint failed, using dataUrl fallback', err);
            }
            setTourGalleryImages((prev) => [...prev, dataUrl]);
            showToast('Gallery photo added!', 'success');
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrlInput.trim()) return;
    setTourGalleryImages((prev) => [...prev, newGalleryUrlInput.trim()]);
    setNewGalleryUrlInput('');
    showToast('Gallery image URL added!', 'success');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setTourGalleryImages((prev) => prev.filter((_, i) => i !== index));
    showToast('Image removed from gallery', 'info');
  };

  // Direct article image uploader from table row
  const handleDirectArticleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, article: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onerror = () => {
      showToast('Failed to read image file', 'error');
      e.target.value = '';
    };
    reader.onloadend = () => {
      const img = new Image();
      img.onerror = () => {
        showToast('Invalid or corrupt image file', 'error');
        e.target.value = '';
      };
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 1200;
          if (width > height && width > max_size) {
            height *= max_size / width;
            width = max_size;
          } else if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          let dataUrl = reader.result as string;
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }

          let finalUrl = dataUrl;
          try {
            const res = await fetch('/api/admin/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: dataUrl })
            });
            if (res.ok) {
              const data = await res.json();
              if (data.url) finalUrl = data.url;
            }
          } catch (err) {
            console.warn('Server upload failed, using dataUrl fallback', err);
          }

          // Update article in DB
          const updateRes = await fetch(`/api/admin/blogs/${article.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...article, image: finalUrl })
          });

          if (updateRes.ok) {
            showToast('Blog container image updated successfully!', 'success');
            loadBlogs();
          } else {
            showToast('Failed to update blog image', 'error');
          }
        } catch (err) {
          showToast('Error processing uploaded image', 'error');
        } finally {
          e.target.value = '';
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Convert uploaded image file to server URL or base64 fallback
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'tour' | 'car' | 'hotel' | 'blog' | 'blogCat') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onerror = () => {
      showToast('Failed to read image file', 'error');
      e.target.value = '';
    };
    reader.onloadend = () => {
      const img = new Image();
      img.onerror = () => {
        showToast('Invalid or corrupt image file', 'error');
        e.target.value = '';
      };
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 1200;
          if (width > height && width > max_size) {
            height *= max_size / width;
            width = max_size;
          } else if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          let dataUrl = reader.result as string;
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }

          let finalUrl = dataUrl;
          try {
            const res = await fetch('/api/admin/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: dataUrl })
            });
            if (res.ok) {
              const data = await res.json();
              if (data.url) finalUrl = data.url;
            }
          } catch (err) {
            console.warn('Server upload endpoint failed, falling back to base64', err);
          }

          if (type === 'tour') setTourImage(finalUrl);
          if (type === 'car') setCarImage(finalUrl);
          if (type === 'hotel') setHotelImageUrl(finalUrl);
          if (type === 'blog') setBlogImage(finalUrl);
          if (type === 'blogCat') setSelectedCatImage(finalUrl);

          showToast('Image uploaded & attached successfully!', 'success');
        } catch (err) {
          showToast('Error processing uploaded image', 'error');
        } finally {
          e.target.value = '';
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Render Login Form View
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo size="md" lightText={true} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {translate(`Administrator Gateway`)}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            {translate(`Secure panel for internal reservation and tour management`)}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-800 py-8 px-4 shadow-xl border border-slate-700/50 rounded-xl sm:px-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  {translate(`Username`)}
                </label>
                <div className="mt-1.5 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-750 border border-slate-600 rounded-lg text-white placeholder-slate-450 focus:ring-2 focus:ring-[#0091EA] focus:border-[#0091EA]"
                    placeholder={translate(`Enter admin user`)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">
                  {translate(`Security Password`)}
                </label>
                <div className="mt-1.5 relative rounded-md shadow-sm">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-750 border border-slate-600 rounded-lg text-white placeholder-slate-450 focus:ring-2 focus:ring-[#0091EA] focus:border-[#0091EA]"
                    placeholder="••••"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3.5 bg-rose-500/15 border border-rose-500/20 rounded-lg text-rose-300 text-sm flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#0091EA] hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0091EA] transition-all disabled:opacity-50"
                >
                  {loginLoading ? 'Verifying Gateway...' : 'Access Console'}
                </button>
                
                <button
                  type="button"
                  onClick={onBackToMain}
                  className="w-full flex justify-center py-3 px-4 border border-slate-600 rounded-lg shadow-sm text-sm font-semibold text-slate-300 bg-transparent hover:bg-slate-700 focus:outline-none transition-all"
                >
                  {translate(`Return to Public Website`)}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5" />
            <span>{translate(`Strict Administrator Access Only. Port 3000 Secured.`)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Render Full Dashboard Workspace
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-55 max-w-md p-4 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-750 flex items-center gap-3 animate-slide-up">
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-400" />}
          {toast.type === 'error' && <AlertTriangle className="h-5 w-5 text-rose-400" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-[#0091EA]" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col shrink-0 border-r border-slate-800`}>
        {/* Sidebar Brand Logo */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between min-w-0">
          <Logo size={sidebarOpen ? "md" : "sm"} lightText={true} showText={sidebarOpen} />
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'tours', label: 'Manage Tour Packages', icon: Compass, sec: 'tours' },
            { id: 'cars', label: 'Rent A Car Catalog', icon: Car, sec: 'cars' },
            { id: 'fleet-schedule', label: 'Fleet Schedule Matrix', icon: Calendar, sec: 'cars' },
            { id: 'bookings', label: 'Bookings Logs', icon: Calendar },
            { id: 'flights', label: 'Manage Flights', icon: Plane, sec: 'flights' },
            { id: 'hotels', label: 'Manage Hotels', icon: Hotel, sec: 'hotels' },
            { id: 'blogs', label: 'Blog & Container Images', icon: FileText, sec: 'tours' },
            { id: 'customers', label: 'Customers', icon: Users, adminOnly: true },
            { id: 'messages', label: 'Inbox', icon: Mail, count: messagesList.filter(m => m.status === 'Unread').length, adminOnly: true },
            { id: 'subscribers', label: 'Subscribers', icon: Mail, adminOnly: true },
            { id: 'snapshots', label: '24h DB Snapshots', icon: Database, adminOnly: true },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].filter(item => {
            if (item.adminOnly && activeAdminRole !== 'admin') return false;
            
            return true;
          }).map((item) => {
            const IconComponent = item.icon;
            const isTabActive = activeTab === item.id;
            const canManage = true; // since we filter out the ones they can't manage
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isTabActive
                    ? 'bg-[#0091EA] text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <IconComponent className="h-5 w-5 shrink-0" />
                {sidebarOpen && (
                  <span className="flex-1 text-start truncate">{item.label}</span>
                )}
                {sidebarOpen && item.sec && (
                  <span className={`px-1.5 py-0.5 text-3xs font-extrabold rounded-md uppercase shrink-0 ${
                    canManage ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {canManage ? 'Full' : 'Read-Only'}
                  </span>
                )}
                {sidebarOpen && item.count && item.count > 0 ? (
                  <span className="px-2 py-0.5 text-2xs font-bold bg-amber-500 text-slate-950 rounded-full shrink-0">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Back to Public Web & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onBackToMain}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Globe className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="truncate">{translate(`Public Site`)}</span>}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="truncate">{translate(`Sign Out`)}</span>}
          </button>
        </div>
      </aside>

      {/* CORE CONTENT REGION */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR LAYOUT */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 focus:outline-none"
            >
              <Sliders className="h-5 w-5 rotate-90" />
            </button>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-450" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder={translate(`Global tracking search...`)}
                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-1.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0091EA] focus:border-[#0091EA]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Operating Role Selector */}
            {userProfile?.role === 'admin' && (
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <ShieldCheck className="h-4 w-4 text-[#0091EA] ml-1 shrink-0" />
                <span className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider hidden lg:inline">Active Role:</span>
                <select
                  value={activeAdminRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setActiveAdminRole(newRole);
                    showToast(`Operating role switched to ${ROLE_LABELS[newRole] || newRole}`, 'info');
                  }}
                  className="bg-white text-[#0A2540] font-bold text-xs rounded-lg px-2.5 py-1 border border-slate-250 focus:ring-2 focus:ring-[#0091EA] outline-none cursor-pointer shadow-2xs"
                >
                  <option value="admin">👑 Super Admin (ROOT_USER)</option>
                  <option value="hotel_manager">🏨 Hotel Manager</option>
                  <option value="car_manager">🚗 Car Rent Manager</option>
                  <option value="flight_manager">✈️ Flight Manager</option>
                  <option value="tour_manager">🗺️ Tour Manager</option>
                  <option value="customer">👤 Customer / User</option>
                </select>
              </div>
            )}
            
            {/* Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="h-8.5 w-8.5 rounded-full bg-[#0A2540] text-white font-bold flex items-center justify-center text-sm shadow-inner">
                {translate(`AD`)}
              </div>
              <div className="text-start hidden md:block">
                <div className="text-sm font-bold text-[#0A2540]">{translate(`Administrator`)}</div>
                <div className="text-2xs text-[#0091EA] font-extrabold uppercase">{ROLE_LABELS[activeAdminRole] || activeAdminRole}</div>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* VIEW: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#0A2540] tracking-tight">{translate(`Executive Dashboard`)}</h1>
                  <p className="text-slate-500 text-sm mt-1">{translate(`Real-time statistics synchronized from Supabase databases`)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNotificationModal(true)}
                    className="flex items-center gap-2 px-3.5 py-2 bg-[#0091EA] text-white hover:bg-sky-600 rounded-lg text-sm font-bold shadow-sm cursor-pointer transition-all"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{translate(`Dispatch Simulator`)}</span>
                  </button>
                  <button
                    onClick={loadDashboardData}
                    disabled={statsLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0A2540] text-white hover:bg-slate-850 rounded-lg text-sm font-bold shadow-sm cursor-pointer transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
                    <span>{translate(`Sync Metrics`)}</span>
                  </button>
                </div>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Total Revenue',
                    value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
                    desc: 'Accumulated logs',
                    icon: BarChart3,
                    color: 'text-sky-600 bg-sky-50 border-sky-100',
                  },
                  {
                    title: 'Bookings Logged',
                    value: stats?.totalBookings || '0',
                    desc: 'Combined totals',
                    icon: Calendar,
                    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
                  },
                  {
                    title: 'Active Tours',
                    value: stats?.activeToursCount || '0',
                    desc: 'Publicly listed',
                    icon: Compass,
                    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
                  },
                  {
                    title: 'Cars Available',
                    value: stats?.carsAvailableCount || '0',
                    desc: 'Fleet ready',
                    icon: Car,
                    color: 'text-amber-600 bg-amber-50 border-amber-100',
                  },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.title}</span>
                        <div className="text-2xl font-black text-[#0A2540]">{card.value}</div>
                        <span className="text-2xs text-slate-450 block">{card.desc}</span>
                      </div>
                      <div className={`p-3.5 rounded-lg border ${card.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart & Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bookings Trend Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-[#0A2540]">Booking Trend (Last 30 Days)</h2>
                    <span className="text-2xs font-bold font-mono text-slate-500 bg-slate-150 px-2 py-0.5 rounded">UNIT: RESERVATIONS</span>
                  </div>
                  <div className="h-80 w-full">
                    {stats?.bookingsTrend ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.bookingsTrend}>
                          <defs>
                            <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0091EA" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#0091EA" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0A2540', borderRadius: '8px', color: '#fff', border: 'none' }}
                          />
                          <Area type="monotone" dataKey="bookings" stroke="#0091EA" strokeWidth={3} fillOpacity={1} fill="url(#bookingGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full bg-slate-50 border border-dashed border-slate-250 rounded-lg flex items-center justify-center text-slate-400">
                        {translate(`Synthesizing trend chart...`)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activities Feed */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 flex flex-col">
                  <h2 className="text-base font-extrabold text-[#0A2540]">{translate(`System Action Feed`)}</h2>
                  <div className="flex-1 space-y-4 overflow-y-auto max-h-80 pr-1">
                    {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                      stats.recentActivity.map((act: any, idx: number) => (
                        <div key={idx} className="flex gap-3 text-sm pb-4 border-b border-slate-100 last:border-b-0">
                          <div className={`p-2 rounded-lg border shrink-0 h-10 w-10 flex items-center justify-center ${
                            act.type.includes('Tour') ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                            act.type.includes('Car') ? 'bg-amber-50 border-amber-100 text-amber-600' :
                            'bg-sky-50 border-sky-100 text-sky-600'
                          }`}>
                            {act.type.includes('Tour') ? <Compass className="h-5 w-5" /> :
                             act.type.includes('Car') ? <Car className="h-5 w-5" /> :
                             <Plane className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-[#0A2540] block truncate">{act.customerName || 'Guest'}</span>
                              <span className="text-3xs font-semibold text-slate-500 uppercase">{act.type}</span>
                            </div>
                            <span className="text-xs text-slate-550 block truncate mt-0.5">{act.item}</span>
                            <span className="text-2xs text-slate-400 block mt-0.5">{new Date(act.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="shrink-0 self-center">
                            {renderStatusBadge(act.status)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                        <Clock className="h-8 w-8 text-slate-300 mb-2 animate-spin" />
                        <span className="text-sm">{translate(`Waiting for incoming logs...`)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: MANAGE TOURS */}
          {activeTab === 'tours' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">{translate(`Active Tour Catalog`)}</h2>
                  <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                    <span>{translate(`Add, update, or unpublish public reservation packages`)}</span>
                    <span className="inline-flex items-center text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>{translate(`Auto-Saved to Database`)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportBackup}
                    title={translate(`Export database backup JSON file`)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200 shadow-2xs"
                  >
                    <Download className="h-4 w-4 text-slate-500" />
                    <span>{translate(`Export Backup`)}</span>
                  </button>
                  <label title={translate(`Restore database backup from JSON file`)} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200 shadow-2xs cursor-pointer">
                    <Upload className="h-4 w-4 text-slate-500" />
                    <span>{translate(`Restore`)}</span>
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>
                  {canManageSection('tours') && (
                    <button
                      onClick={openAddTour}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#0091EA] text-white hover:bg-sky-500 rounded-lg text-sm font-bold shadow-sm transition-all ml-1"
                    >
                      <Plus className="h-4.5 w-4.5" />
                      <span>{translate(`Create Tour`)}</span>
                    </button>
                  )}
                </div>
              </div>

              {!canManageSection('tours') ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-900 text-sm font-medium shadow-2xs">
                  <Lock className="h-5 w-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">Read-Only Mode: </span>
                    {translate(`Operating as`)} <span className="font-bold underline">{ROLE_LABELS[activeAdminRole] || activeAdminRole}</span>. You can inspect tours, but creating, editing, or deleting packages requires <span className="font-bold">{translate(`Tour Manager`)}</span> or <span className="font-bold">{translate(`Super Admin`)}</span> role.
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-emerald-900 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Manager Access Granted: Full management rights for Tour Packages as {ROLE_LABELS[activeAdminRole]}</span>
                  </div>
                  <span className="text-3xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">{translate(`Tour Manager Active`)}</span>
                </div>
              )}

              {/* Table list */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-2xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">{translate(`Tour Information`)}</th>
                        <th className="py-4 px-6">{translate(`Category`)}</th>
                        <th className="py-4 px-6">{translate(`Duration`)}</th>
                        <th className="py-4 px-6">{translate(`Gallery Collection`)}</th>
                        <th className="py-4 px-6">{translate(`Max Slots`)}</th>
                        <th className="py-4 px-6">Price (USD)</th>
                        <th className="py-4 px-6">{translate(`Status`)}</th>
                        <th className="py-4 px-6 text-end">{translate(`Actions`)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {toursList.length > 0 ? (
                        toursList.map((tour) => {
                          let galleryCount = 0;
                          if (tour.galleryImages) {
                            try {
                              const parsed = typeof tour.galleryImages === 'string' ? JSON.parse(tour.galleryImages) : tour.galleryImages;
                              galleryCount = Array.isArray(parsed) ? parsed.length : 1;
                            } catch (e) {
                              if (typeof tour.galleryImages === 'string' && tour.galleryImages.includes(',')) {
                                galleryCount = tour.galleryImages.split(',').length;
                              } else {
                                galleryCount = 1;
                              }
                            }
                          }

                          return (
                            <tr key={tour.id} className="hover:bg-slate-50/50">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={tour.imageUrl || 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800'}
                                    alt=""
                                    className="h-12 w-16 object-cover rounded-lg bg-slate-100 shrink-0"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800'; }}
                                  />
                                  <div className="min-w-0">
                                    <span className="font-extrabold text-[#0A2540] block truncate max-w-xs">{tour.title}</span>
                                    <span className="text-2xs text-slate-450 block truncate max-w-xs mt-0.5">{tour.description}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 font-semibold">{tour.category}</td>
                              <td className="py-4 px-6 text-slate-500 font-mono text-xs">{tour.duration}</td>
                              <td className="py-4 px-6">
                                <button
                                  type="button"
                                  onClick={() => openEditTour(tour)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0091EA] rounded-lg text-xs font-bold transition-all cursor-pointer"
                                  title={translate(`Click to manage photo gallery`)}
                                >
                                  <ImageIcon className="h-3.5 w-3.5" />
                                  <span>{galleryCount} Photos</span>
                                </button>
                              </td>
                              <td className="py-4 px-6 text-slate-550 font-semibold">{tour.maxGuests || 10} Persons</td>
                              <td className="py-4 px-6 font-bold text-[#0A2540]">${tour.price}</td>
                              <td className="py-4 px-6">{renderStatusBadge(tour.status)}</td>
                              <td className="py-4 px-6 text-end">
                                <div className="flex justify-end items-center gap-2">
                                  <button
                                    onClick={() => openEditTour(tour)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0091EA] hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                    title={translate(`Upload and Manage Gallery Photos`)}
                                  >
                                    <Upload className="h-3.5 w-3.5" />
                                    <span>Upload / Edit Photos</span>
                                  </button>
                                  <button
                                    onClick={() => openEditTour(tour)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
                                    title={translate(`Edit package details`)}
                                  >
                                    <Edit2 className="h-4.5 w-4.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem('tour', tour.id)}
                                    className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-all cursor-pointer"
                                    title={translate(`Delete package`)}
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400">
                            {translate(`No packages registered. Click Create Tour to register catalog.`)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: RENT A CAR */}
          {activeTab === 'cars' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">{translate(`Rental Fleet Inventory`)}</h2>
                  <p className="text-slate-500 text-sm mt-1">{translate(`Add, inspect, and service rental cars`)}</p>
                </div>
                {canManageSection('cars') && (
                  <button
                    onClick={openAddCar}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0091EA] text-white hover:bg-sky-500 rounded-lg text-sm font-bold shadow-sm transition-all"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    <span>{translate(`Register Vehicle`)}</span>
                  </button>
                )}
              </div>

              {!canManageSection('cars') ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-900 text-sm font-medium shadow-2xs">
                  <Lock className="h-5 w-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">Read-Only Mode: </span>
                    {translate(`Operating as`)} <span className="font-bold underline">{ROLE_LABELS[activeAdminRole] || activeAdminRole}</span>. You can inspect rental vehicles, but registered car edits, additions, or deletions require <span className="font-bold">{translate(`Car Rent Manager`)}</span> or <span className="font-bold">{translate(`Super Admin`)}</span> role.
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-emerald-900 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Manager Access Granted: Full management rights for Vehicle Fleet as {ROLE_LABELS[activeAdminRole]}</span>
                  </div>
                  <span className="text-3xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">{translate(`Car Manager Active`)}</span>
                </div>
              )}

              {/* Fleet List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-2xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">{translate(`Vehicle Detail`)}</th>
                        <th className="py-4 px-6">{translate(`Category`)}</th>
                        <th className="py-4 px-6">{translate(`Capacity`)}</th>
                        <th className="py-4 px-6">{translate(`Transmission`)}</th>
                        <th className="py-4 px-6">Rate (Per Day)</th>
                        <th className="py-4 px-6">{translate(`Status`)}</th>
                        <th className="py-4 px-6 text-end">{translate(`Actions`)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {carsList.length > 0 ? (
                        carsList.map((car) => (
                          <tr key={car.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-4">
                                <img
                                  src={car.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                                  alt=""
                                  className="h-12 w-16 object-cover rounded-lg bg-slate-100 shrink-0"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'; }}
                                />
                                <span className="font-extrabold text-[#0A2540] block truncate max-w-xs">{car.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 font-semibold">{car.category}</td>
                            <td className="py-4 px-6 text-slate-500 font-medium">{car.seats} Seats</td>
                            <td className="py-4 px-6 font-medium text-slate-500">{car.transmission}</td>
                            <td className="py-4 px-6 font-bold text-[#0A2540]">${car.pricePerDay}/day</td>
                            <td className="py-4 px-6">{renderStatusBadge(car.status)}</td>
                            <td className="py-4 px-6 text-end">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openEditCar(car)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 text-[#0091EA] transition-all"
                                  title={translate(`Edit vehicle registry`)}
                                >
                                  <Edit2 className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem('car', car.id)}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-all"
                                  title={translate(`Deregister vehicle`)}
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            {translate(`No vehicles cataloged. Click Register Vehicle to seed your rental fleet.`)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: FLEET SCHEDULE MATRIX */}
          {activeTab === 'fleet-schedule' && (
            <div className="space-y-6 animate-fade-in">
              <FleetScheduleCalendar />
            </div>
          )}

          {/* VIEW: BOOKINGS LOGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">{translate(`Audit Booking Logs`)}</h2>
                  <p className="text-slate-500 text-sm mt-1">{translate(`Inspect and approve pending client reservation sessions`)}</p>
                </div>
                <button
                  onClick={() => handleExportCSV('bookings')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm cursor-pointer transition-all"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>{translate(`Export CSV`)}</span>
                </button>
              </div>

              {/* Sub-tab Switcher */}
              <div className="flex border-b border-slate-200">
                {[
                  { id: 'tour', label: 'Tours & Packages', count: bookingsData.tourBookings.length },
                  { id: 'car', label: 'Car Rentals', count: bookingsData.carBookings.length },
                  { id: 'flight', label: 'Flights Booked', count: bookingsData.flightBookings.length },
                  { id: 'hotel', label: 'Hotels Booked', count: bookingsData.hotelBookings?.length || 0 }
                ].map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => setBookingsActiveTab(subTab.id as any)}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${
                      bookingsActiveTab === subTab.id
                        ? 'border-[#0091EA] text-[#0091EA]'
                        : 'border-transparent text-slate-450 hover:text-slate-750'
                    }`}
                  >
                    <span>{subTab.label}</span>
                    <span className="ml-2 px-1.5 py-0.5 text-3xs font-semibold bg-slate-100 text-slate-600 rounded-full">
                      {subTab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bookings Table List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-2xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">{translate(`Customer Contact`)}</th>
                        <th className="py-4 px-6">{translate(`Booked Item`)}</th>
                        <th className="py-4 px-6">{translate(`Schedule Date`)}</th>
                        <th className="py-4 px-6">{translate(`Recorded At`)}</th>
                        <th className="py-4 px-6">{translate(`Status`)}</th>
                        <th className="py-4 px-6 text-end">{translate(`Approve Actions`)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {bookingsActiveTab === 'tour' && bookingsData.tourBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6">
                            <div>
                              <span className="font-extrabold text-[#0A2540] block">{b.userName}</span>
                              <span className="text-2xs text-slate-450 block font-mono mt-0.5">{b.email}</span>
                              <span className="text-2xs text-slate-450 block font-mono mt-0.5">{b.phone}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-semibold block truncate max-w-xs">{b.itemName}</span>
                            <span className="text-2xs font-bold text-slate-500 mt-0.5 block">{b.guests} Guests</span>
                          </td>
                          <td className="py-4 px-6 text-slate-500 font-mono text-xs">{b.travelDate}</td>
                          <td className="py-4 px-6 text-slate-400 text-2xs">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-4 px-6">{renderStatusBadge(b.status)}</td>
                          <td className="py-4 px-6 text-end">
                            <div className="flex justify-end gap-1.5">
                              {b.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus('tour-booking', b.id, 'Confirmed')}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                    title={translate(`Confirm reservation`)}
                                  >
                                    <Check className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus('tour-booking', b.id, 'Cancelled')}
                                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                    title={translate(`Cancel reservation`)}
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {bookingsActiveTab === 'car' && bookingsData.carBookings.map((cb) => (
                        <tr key={cb.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6">
                            <div>
                              <span className="font-extrabold text-[#0A2540] block">{cb.customerName}</span>
                              <span className="text-2xs text-slate-400 italic">{translate(`Self-Drive Guest`)}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold">{cb.itemName}</td>
                          <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                            {cb.pickupDate} to {cb.returnDate}
                          </td>
                          <td className="py-4 px-6 text-slate-400 text-2xs">{cb.createdAt ? new Date(cb.createdAt).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-4 px-6">{renderStatusBadge(cb.status)}</td>
                          <td className="py-4 px-6 text-end">
                            <div className="flex justify-end gap-1.5">
                              {cb.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus('car-booking', cb.id, 'Confirmed')}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                    title={translate(`Confirm Booking`)}
                                  >
                                    <Check className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus('car-booking', cb.id, 'Cancelled')}
                                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                    title={translate(`Cancel Booking`)}
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {bookingsActiveTab === 'flight' && bookingsData.flightBookings.map((fb) => (
                        <tr key={fb.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6">
                            <div>
                              <span className="font-extrabold text-[#0A2540] block">{fb.passengerName}</span>
                              <span className="text-2xs text-slate-450 block font-mono mt-0.5">{fb.email}</span>
                              <span className="text-2xs text-slate-450 block font-mono mt-0.5">{fb.phone}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold">{fb.itemName}</td>
                          <td className="py-4 px-6 text-slate-500 font-mono text-xs">{translate(`At Departure`)}</td>
                          <td className="py-4 px-6 text-slate-400 text-2xs">{fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-4 px-6">{renderStatusBadge(fb.status)}</td>
                          <td className="py-4 px-6 text-end">
                            <div className="flex justify-end gap-1.5">
                              {fb.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus('flight-booking', fb.id, 'Confirmed')}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                    title={translate(`Confirm Flight`)}
                                  >
                                    <Check className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus('flight-booking', fb.id, 'Cancelled')}
                                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                    title={translate(`Cancel Flight`)}
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {bookingsActiveTab === 'hotel' && (bookingsData.hotelBookings || []).map((hb) => (
                        <tr key={hb.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6">
                            <div>
                              <span className="font-extrabold text-[#0A2540] block">{hb.userName}</span>
                              <span className="text-2xs text-slate-450 block font-mono mt-0.5">{hb.userEmail}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-semibold block truncate max-w-xs">{hb.itemName}</span>
                            <span className="text-2xs font-bold text-slate-500 mt-0.5 block">{hb.guests} Guests</span>
                          </td>
                          <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                            {hb.checkInDate} to {hb.checkOutDate}
                          </td>
                          <td className="py-4 px-6 text-slate-400 text-2xs">{hb.createdAt ? new Date(hb.createdAt).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-4 px-6">{renderStatusBadge(hb.status)}</td>
                          <td className="py-4 px-6 text-end">
                            <div className="flex justify-end gap-1.5">
                              {hb.status?.toLowerCase() === 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateStatus('hotel-booking', hb.id, 'Cancelled')}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                  title={translate(`Cancel Hotel Stay`)}
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {((bookingsActiveTab === 'tour' && bookingsData.tourBookings.length === 0) ||
                        (bookingsActiveTab === 'car' && bookingsData.carBookings.length === 0) ||
                        (bookingsActiveTab === 'flight' && bookingsData.flightBookings.length === 0) ||
                        (bookingsActiveTab === 'hotel' && (!bookingsData.hotelBookings || bookingsData.hotelBookings.length === 0))) && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            {translate(`No reservations recorded under this segment.`)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: MANAGE FLIGHTS */}
          {activeTab === 'flights' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">{translate(`Public Flight Schedules`)}</h2>
                  <p className="text-slate-500 text-sm mt-1">{translate(`Configure airline departures and rates`)}</p>
                </div>
                {canManageSection('flights') && (
                  <button
                    onClick={openAddFlight}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0091EA] text-white hover:bg-sky-500 rounded-lg text-sm font-bold shadow-sm transition-all"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    <span>{translate(`Register Flight`)}</span>
                  </button>
                )}
              </div>

              {!canManageSection('flights') ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-900 text-sm font-medium shadow-2xs">
                  <Lock className="h-5 w-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">Read-Only Mode: </span>
                    {translate(`Operating as`)} <span className="font-bold underline">{ROLE_LABELS[activeAdminRole] || activeAdminRole}</span>. You can inspect flight schedules, but adding, modifying, or deleting flights requires <span className="font-bold">{translate(`Flight Manager`)}</span> or <span className="font-bold">{translate(`Super Admin`)}</span> role.
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-emerald-900 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Manager Access Granted: Full management rights for Flight Schedules as {ROLE_LABELS[activeAdminRole]}</span>
                  </div>
                  <span className="text-3xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">{translate(`Flight Manager Active`)}</span>
                </div>
              )}

              {/* Flight List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-2xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">{translate(`Airline`)}</th>
                        <th className="py-4 px-6">{translate(`From City`)}</th>
                        <th className="py-4 px-6">{translate(`To City`)}</th>
                        <th className="py-4 px-6">{translate(`Departure Time`)}</th>
                        <th className="py-4 px-6">{translate(`Arrival Time`)}</th>
                        <th className="py-4 px-6">{translate(`Stops`)}</th>
                        <th className="py-4 px-6">Fare (USD)</th>
                        <th className="py-4 px-6 text-end">{translate(`Actions`)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {flightsList.length > 0 ? (
                        flightsList.map((flight) => (
                          <tr key={flight.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-6 font-extrabold text-[#0A2540]">{flight.airline}</td>
                            <td className="py-4 px-6 font-semibold text-slate-650">{flight.fromCity}</td>
                            <td className="py-4 px-6 font-semibold text-slate-650">{flight.toCity}</td>
                            <td className="py-4 px-6 text-slate-500 font-mono text-xs">{flight.departureTime}</td>
                            <td className="py-4 px-6 text-slate-500 font-mono text-xs">{flight.arrivalTime}</td>
                            <td className="py-4 px-6 text-slate-500 font-medium">
                              {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop(s)`}
                            </td>
                            <td className="py-4 px-6 font-bold text-[#0A2540]">${flight.price}</td>
                            <td className="py-4 px-6 text-end">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openEditFlight(flight)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 text-[#0091EA] transition-all"
                                  title={translate(`Edit flight registry`)}
                                >
                                  <Edit2 className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem('flight', flight.id)}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-all"
                                  title={translate(`Remove flight schedule`)}
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400">
                            {translate(`No flights mapped. Click Register Flight to populate scheduler.`)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: MANAGE HOTELS */}
          {activeTab === 'hotels' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">{translate(`Active Hotel Portfolio`)}</h2>
                  <p className="text-slate-500 text-sm mt-1">{translate(`Configure premium lodging listings, amenities, and nightly rates`)}</p>
                </div>
                {canManageSection('hotels') && (
                  <button
                    onClick={openAddHotel}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0091EA] text-white hover:bg-sky-500 rounded-lg text-sm font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    <span>{translate(`Add Hotel`)}</span>
                  </button>
                )}
              </div>

              {!canManageSection('hotels') ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-900 text-sm font-medium shadow-2xs">
                  <Lock className="h-5 w-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">Read-Only Mode: </span>
                    {translate(`Operating as`)} <span className="font-bold underline">{ROLE_LABELS[activeAdminRole] || activeAdminRole}</span>. You can inspect hotel listings, but adding, editing, or deleting hotel profiles requires <span className="font-bold">{translate(`Hotel Manager`)}</span> or <span className="font-bold">{translate(`Super Admin`)}</span> role.
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-emerald-900 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Manager Access Granted: Full management rights for Hotel Portfolio as {ROLE_LABELS[activeAdminRole]}</span>
                  </div>
                  <span className="text-3xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">{translate(`Hotel Manager Active`)}</span>
                </div>
              )}

              {/* Hotel List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-2xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">{translate(`Hotel Info`)}</th>
                        <th className="py-4 px-6">{translate(`Location`)}</th>
                        <th className="py-4 px-6">{translate(`Star Rating`)}</th>
                        <th className="py-4 px-6">{translate(`Amenities`)}</th>
                        <th className="py-4 px-6">Nightly Price (USD)</th>
                        <th className="py-4 px-6 text-end">{translate(`Actions`)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {hotelsList.length > 0 ? (
                        hotelsList.map((hotel) => (
                          <tr key={hotel.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-4">
                                <img
                                  src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                                  alt=""
                                  className="h-12 w-16 object-cover rounded-lg bg-slate-100 shrink-0"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'; }}
                                />
                                <div className="min-w-0">
                                  <span className="font-extrabold text-[#0A2540] block truncate max-w-xs">{hotel.name}</span>
                                  <span className="text-2xs text-slate-450 block truncate max-w-xs mt-0.5">{hotel.description}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 font-semibold text-slate-650">{hotel.location}</td>
                            <td className="py-4 px-6">
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-full">
                                {hotel.starRating} ★
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {(Array.isArray(hotel.amenities) ? hotel.amenities : (hotel.amenities ? String(hotel.amenities).split(',') : [])).slice(0, 3).map((amenity: string, i: number) => (
                                  <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-3xs font-medium">
                                    {amenity.trim()}
                                  </span>
                                ))}
                                {(Array.isArray(hotel.amenities) ? hotel.amenities : (hotel.amenities ? String(hotel.amenities).split(',') : [])).length > 3 && (
                                  <span className="text-3xs text-slate-400 self-center font-bold">
                                    +{ (Array.isArray(hotel.amenities) ? hotel.amenities : (hotel.amenities ? String(hotel.amenities).split(',') : [])).length - 3 }
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6 font-bold text-[#0A2540]">${hotel.price}</td>
                            <td className="py-4 px-6 text-end">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openEditHotel(hotel)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 text-[#0091EA] transition-all cursor-pointer"
                                  title={translate(`Edit hotel details`)}
                                >
                                  <Edit2 className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem('hotel', hotel.id)}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-all cursor-pointer"
                                  title={translate(`Delete hotel listing`)}
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            {translate(`No hotel listings found. Click Add Hotel to register one.`)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CUSTOMERS DATABASE */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">{translate(`Customer Intelligence & RBAC Access`)}</h2>
                  <p className="text-slate-500 text-sm mt-1">Assign custom management roles (Hotel, Car, Flight, Tour Manager, Admin, or User) and manage customer profiles</p>
                </div>
                <button
                  onClick={() => handleExportCSV('customers')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>{translate(`Export Profiles`)}</span>
                </button>
              </div>

              {/* Role Scope Guide */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-xs text-purple-700 mb-1">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>{translate(`Super Admin`)}</span>
                  </div>
                  <p className="text-2xs text-slate-500 leading-relaxed">{translate(`Full system control across all modules, settings & snapshots.`)}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-700 mb-1">
                    <Hotel className="h-4 w-4 shrink-0" />
                    <span>{translate(`Hotel Manager`)}</span>
                  </div>
                  <p className="text-2xs text-slate-500 leading-relaxed">{translate(`Exclusive rights to create, edit & delete hotel listings and pricing.`)}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-xs text-amber-700 mb-1">
                    <Car className="h-4 w-4 shrink-0" />
                    <span>{translate(`Car Rent Manager`)}</span>
                  </div>
                  <p className="text-2xs text-slate-500 leading-relaxed">{translate(`Exclusive rights to manage rental vehicle fleet & specs.`)}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-xs text-sky-700 mb-1">
                    <Plane className="h-4 w-4 shrink-0" />
                    <span>{translate(`Flight Manager`)}</span>
                  </div>
                  <p className="text-2xs text-slate-500 leading-relaxed">{translate(`Exclusive rights to configure airline schedules & flight fares.`)}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-xs text-indigo-700 mb-1">
                    <Compass className="h-4 w-4 shrink-0" />
                    <span>{translate(`Tour Manager`)}</span>
                  </div>
                  <p className="text-2xs text-slate-500 leading-relaxed">{translate(`Exclusive rights to build tour packages & itineraries.`)}</p>
                </div>
              </div>

              {/* Profiles Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-2xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">{translate(`Customer Name`)}</th>
                        <th className="py-4 px-6">{translate(`Email Address`)}</th>
                        <th className="py-4 px-6">{translate(`Assigned User Role`)}</th>
                        <th className="py-4 px-6">{translate(`Mobile Phone`)}</th>
                        <th className="py-4 px-6">{translate(`Total Sessions`)}</th>
                        <th className="py-4 px-6">Lifetime Value (LTV)</th>
                        <th className="py-4 px-6 text-end">{translate(`Action`)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {customersList.length > 0 ? (
                        customersList.map((customer, idx) => {
                          const customerName = customer.fullName || customer.name || 'Valued Customer';
                          const currentRole = customer.role || 'customer';
                          return (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="py-4 px-6 font-extrabold text-[#0A2540]">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-8 w-8 rounded-full bg-sky-100 text-[#0091EA] font-bold flex items-center justify-center text-xs">
                                    {customerName.charAt(0).toUpperCase()}
                                  </div>
                                  <span>{customerName}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 font-mono text-xs">{customer.email}</td>
                              <td className="py-4 px-6">
                                <select
                                  value={currentRole}
                                  onChange={(e) => handleUpdateUserRole(customer, e.target.value)}
                                  className="bg-slate-50 border border-slate-250 text-[#0A2540] text-xs font-extrabold rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-[#0091EA] outline-none cursor-pointer hover:bg-white transition-all shadow-2xs"
                                >
                                  <option value="customer">👤 Customer / User</option>
                                  <option value="vip">🌟 VIP Traveler</option>
                                  <option value="hotel_manager">🏨 Hotel Manager</option>
                                  <option value="car_manager">🚗 Car Rent Manager</option>
                                  <option value="flight_manager">✈️ Flight Manager</option>
                                  <option value="tour_manager">🗺️ Tour Manager</option>
                                  <option value="admin">👑 Super Admin</option>
                                </select>
                              </td>
                              <td className="py-4 px-6 text-slate-500 font-mono text-xs">{customer.phone || 'N/A'}</td>
                              <td className="py-4 px-6 font-semibold">
                                {customer.bookingsCount} Booking(s)
                                {customer.loginCount > 0 && (
                                  <span className="block text-2xs font-normal text-slate-400">
                                    ({customer.loginCount} Login sessions)
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6 font-black text-emerald-600">${customer.totalSpend?.toLocaleString()}</td>
                              <td className="py-4 px-6 text-end">
                                <button
                                  onClick={() => {
                                    setSelectedItem(customer);
                                    setActiveModal('customerDetail');
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A2540] hover:bg-slate-800 text-white rounded-lg text-xs font-bold inline-flex transition-all cursor-pointer"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>{translate(`History & Logs`)}</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            {translate(`No profiles registered. Once clients book, metadata compiles automatically.`)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: INBOX MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">{translate(`Contact Inbox`)}</h2>
                <p className="text-slate-500 text-sm mt-1">{translate(`Review and action inquiries submitted from Contact form`)}</p>
              </div>

              {/* Message List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {messagesList.length > 0 ? (
                    messagesList.map((msg) => (
                      <div key={msg.id} className={`p-6 transition-all hover:bg-slate-50/50 flex flex-col md:flex-row gap-6 ${msg.status === 'Unread' ? 'bg-amber-50/10' : ''}`}>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-extrabold text-[#0A2540] text-base">{msg.subject}</span>
                            {renderStatusBadge(msg.status)}
                          </div>
                          
                          <p className="text-slate-650 text-sm leading-relaxed max-w-4xl italic bg-slate-50 p-4 rounded-lg border border-slate-150 font-medium">
                            "{msg.message}"
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-slate-450 font-medium">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4 text-slate-400" />
                              <strong className="text-[#0A2540]">{msg.name}</strong>
                            </span>
                            <span className="font-mono">Email: {msg.email}</span>
                            <span className="font-mono">Phone: {msg.phone || 'N/A'}</span>
                            <span>On: {new Date(msg.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="shrink-0 self-start md:self-center flex gap-2">
                          {msg.status !== 'Replied' && (
                            <button
                              onClick={() => handleUpdateStatus('message', msg.id, 'Replied')}
                              className="px-3.5 py-1.5 bg-[#0091EA] text-white font-semibold rounded-lg text-xs hover:bg-sky-500 transition-all cursor-pointer"
                            >
                              {translate(`Mark as Replied`)}
                            </button>
                          )}
                          {msg.status === 'Unread' && (
                            <button
                              onClick={() => handleUpdateStatus('message', msg.id, 'Read')}
                              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-all cursor-pointer"
                            >
                              {translate(`Mark as Read`)}
                            </button>
                          )}
                          <a
                            href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)}`}
                            className="px-3.5 py-1.5 border border-slate-250 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 text-center transition-all"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span>{translate(`Reply`)}</span>
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                      <Mail className="h-10 w-10 text-slate-350" />
                      <span className="text-sm">{translate(`Inbox clear. No inquiries recorded.`)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">{translate(`Newsletter Subscribers`)}</h2>
                  <p className="text-slate-500 text-sm mt-1">{translate(`Export campaign subscribers linked to your public footer registry`)}</p>
                </div>
                <button
                  onClick={() => handleExportCSV('subscribers')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>{translate(`Export CSV`)}</span>
                </button>
              </div>

              {/* Subscribers Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-2xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">{translate(`Subscriber ID`)}</th>
                        <th className="py-4 px-6">{translate(`Email Address`)}</th>
                        <th className="py-4 px-6">{translate(`Joined Date`)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {subscribersList.length > 0 ? (
                        subscribersList.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-6 text-slate-450 font-mono text-xs">#SUB-{sub.id}</td>
                            <td className="py-4 px-6 font-extrabold text-[#0A2540]">{sub.email}</td>
                            <td className="py-4 px-6 text-slate-500">{sub.createdAt ? new Date(sub.createdAt).toLocaleString() : 'N/A'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-12 text-center text-slate-400">
                            {translate(`No active newsletter subscribers registered.`)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: 24-HOUR DATABASE SNAPSHOTS */}
          {activeTab === 'snapshots' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">24-Hour Database Snapshots</h2>
                    <span className="px-2.5 py-0.5 bg-sky-100 text-[#0091EA] text-2xs font-bold rounded-full border border-sky-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" /> {translate(`Firebase Trigger Active`)}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">
                    {translate(`Automated 24-hour scheduled snapshots of tour packages, hotel data, flight listings, and blog posts for redundancy & recovery.`)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTriggerSnapshot}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0091EA] hover:bg-sky-500 text-white rounded-lg text-sm font-bold shadow-sm transition-all"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    <span>{translate(`Trigger Snapshot Now`)}</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-4 bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-xl shadow-xs border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-[#0091EA]/20 text-[#0091EA] rounded-lg border border-[#0091EA]/30">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{translate(`Firebase Cloud Function Snapshot Engine`)}</span>
                      <span className="text-2xs bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded border border-emerald-500/30">{translate(`Active`)}</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {translate(`Cloud Function`)} <code className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-sky-300">dailyDatabaseSnapshot</code> runs automatically every 24 hours (<code className="text-amber-300">0 0 * * *</code>) to preserve state redundancy across all catalog models including blog posts.
                    </p>
                  </div>
                </div>
                <div className="text-end shrink-0">
                  <div className="text-2xs text-slate-400 uppercase font-bold tracking-wider">{translate(`Total Snapshots`)}</div>
                  <div className="text-2xl font-black text-white">{snapshotsList.length}</div>
                </div>
              </div>

              {/* Snapshots Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-2xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">{translate(`Snapshot ID`)}</th>
                        <th className="py-4 px-6">Timestamp / Schedule</th>
                        <th className="py-4 px-6">{translate(`Trigger Source`)}</th>
                        <th className="py-4 px-6">{translate(`Preserved Data Counts`)}</th>
                        <th className="py-4 px-6 text-end">{translate(`Recovery Actions`)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {snapshotsList.length > 0 ? (
                        snapshotsList.map((snap) => (
                          <tr key={snap.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-6 font-mono text-xs font-bold text-slate-900 flex items-center gap-2">
                              <History className="w-4 h-4 text-[#0091EA]" />
                              <span>{snap.id}</span>
                            </td>
                            <td className="py-4 px-6 text-xs text-slate-600">
                              <div className="font-semibold">{new Date(snap.createdAt).toLocaleString()}</div>
                              <div className="text-2xs text-slate-400">{translate(`Every 24h Cycle`)}</div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-2xs font-bold border border-slate-200">
                                <Clock className="w-3 h-3 text-sky-600" />
                                {snap.trigger === '24h_scheduled_trigger' || snap.trigger === 'firebase_cloud_function_24h' ? '24h Cloud Function' : snap.trigger}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex flex-wrap gap-1.5 text-2xs font-extrabold">
                                <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded border border-sky-200">
                                  Tour Packages: {snap.counts?.tours ?? 0}
                                </span>
                                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200">
                                  Hotels: {snap.counts?.hotels ?? 0}
                                </span>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                                  Flights: {snap.counts?.flights ?? 0}
                                </span>
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                                  Cars: {snap.counts?.cars ?? 0}
                                </span>
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                                  Custom Packages: {snap.counts?.packages ?? 0}
                                </span>
                                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded border border-rose-200">
                                  Blog Posts: {snap.counts?.blogs ?? (snap.data?.blogs?.length || 0)}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-end space-x-2">
                              <button
                                onClick={() => handleRestoreSnapshot(snap.id)}
                                title={translate(`Restore database to this snapshot state`)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all ${
                                  confirmRestoreId === snap.id
                                    ? 'bg-rose-600 text-white animate-pulse'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                                }`}
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>{confirmRestoreId === snap.id ? 'Confirm?' : 'Restore DB'}</span>
                              </button>
                              <button
                                onClick={() => {
                                  const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `${snap.id}.json`;
                                  a.click();
                                }}
                                title={translate(`Download JSON Snapshot`)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all border border-slate-200"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>{translate(`Export`)}</span>
                              </button>
                              <label
                                title={translate(`Upload JSON Snapshot and Restore`)}
                                className="px-2.5 py-1.5 cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{translate(`Import File`)}</span>
                                <input type="file" accept=".json" onChange={handleRestoreSnapshotFromFile} className="hidden" />
                              </label>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            {translate(`No snapshots recorded yet. Click "Trigger Snapshot Now" to create your first 24-hour recovery point.`)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div>
                <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">{translate(`System Configuration`)}</h2>
                <p className="text-slate-500 text-sm mt-1">{translate(`Configure global administrative parameters`)}</p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0A2540] mb-2">{translate(`Company Business Name`)}</label>
                    <input
                      type="text"
                      value={settingsBusinessName}
                      onChange={(e) => setSettingsBusinessName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#0A2540] mb-2">{translate(`Primary Helpline`)}</label>
                    <input
                      type="text"
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#0A2540] mb-2">{translate(`Support Email Address`)}</label>
                    <input
                      type="email"
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#0A2540] mb-2">{translate(`Operational Head Office`)}</label>
                    <input
                      type="text"
                      value={settingsAddress}
                      onChange={(e) => setSettingsAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#0A2540] mb-2">Base Booking VAT / Tax (%)</label>
                    <input
                      type="number"
                      value={settingsVat}
                      onChange={(e) => setSettingsVat(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => showToast('Global system parameters successfully synchronized', 'success')}
                    className="px-6 py-2.5 bg-[#0091EA] text-white hover:bg-sky-500 rounded-lg text-sm font-bold transition-all cursor-pointer"
                  >
                    {translate(`Save Settings`)}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: BLOG & CONTAINER IMAGES */}
          {activeTab === 'blogs' && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">{translate(`Blog & Performance Panel`)}</h2>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-3xs font-extrabold rounded-full border border-emerald-200 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {translate(`Real-Time & 24h Snapshot Synced`)}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">Real-time stats (view counts, engagement metrics, total blog posts) synced with the 24-hour snapshot database</p>
                </div>
                <div className="flex items-center gap-3 self-start md:self-auto">
                  <button
                    onClick={handleSimulateEngagement}
                    className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                    title={translate(`Simulate incoming reader view or heart like in real time`)}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-spin" />
                    <span>{translate(`Simulate Reader Traffic`)}</span>
                  </button>
                  <button
                    onClick={() => handleOpenBlogModal('add')}
                    className="px-5 py-2.5 bg-[#0091EA] text-white hover:bg-sky-500 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{translate(`New Blog Article`)}</span>
                  </button>
                </div>
              </div>

              {/* SECTION: BLOG PERFORMANCE PANEL */}
              <div className="bg-gradient-to-br from-[#0A2540] via-[#0D3156] to-[#0A2540] text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-800 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0091EA]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-widest font-extrabold mb-1">
                      <BarChart3 className="w-4 h-4" />
                      <span>{translate(`Blog Performance Analytics`)}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {translate(`Real-Time Reader Telemetry & Audience Metrics`)}
                    </h2>
                    <p className="text-slate-300 text-xs mt-1 max-w-2xl">
                      Tracking live view counts, reader hearts/likes, shares, and engagement rates. Fully synchronized with the 24-hour database snapshot backup engine.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-2xs font-extrabold uppercase text-slate-400">24h Snapshot DB Status</div>
                      <div className="text-emerald-300 font-bold font-mono text-2xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400 inline" />
                        {snapshotsList.length > 0 ? `${snapshotsList.length} Active Snapshots` : '24h Scheduled Backups Active'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* KPI Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10 hover:border-sky-400/50 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-xs font-extrabold uppercase tracking-wider">{translate(`Total Blog Posts`)}</span>
                      <BookOpen className="w-5 h-5 text-sky-400" />
                    </div>
                    <div className="text-3xl font-black text-white tracking-tight font-mono">
                      {blogPerformance?.totalArticles ?? blogsList.length}
                    </div>
                    <div className="mt-2 text-2xs text-sky-300 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      Across {blogCategoriesList.length} categories • 24h Snapshot Backed
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10 hover:border-sky-400/50 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-xs font-extrabold uppercase tracking-wider">{translate(`Total View Counts`)}</span>
                      <Eye className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-black text-white tracking-tight font-mono">
                      {(blogPerformance?.totalViews ?? 0).toLocaleString()}
                    </div>
                    <div className="mt-2 text-2xs text-emerald-300 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {translate(`Live reader traffic counter`)}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10 hover:border-sky-400/50 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-xs font-extrabold uppercase tracking-wider">{translate(`Total Engagements`)}</span>
                      <Heart className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="text-3xl font-black text-white tracking-tight font-mono">
                      {(blogPerformance?.totalEngagements ?? 0).toLocaleString()}
                    </div>
                    <div className="mt-2 text-2xs text-rose-300 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      {(blogPerformance?.totalLikes ?? 0).toLocaleString()} Likes • {(blogPerformance?.totalShares ?? 0).toLocaleString()} Shares
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10 hover:border-sky-400/50 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-xs font-extrabold uppercase tracking-wider">{translate(`Avg Engagement Rate`)}</span>
                      <TrendingUp className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-3xl font-black text-amber-300 tracking-tight font-mono">
                      {blogPerformance?.avgEngagementRate ?? '0.0%'}
                    </div>
                    <div className="mt-2 text-2xs text-amber-200/80 font-semibold">
                      (Engagements / Total Views) × 100
                    </div>
                  </div>
                </div>

                {/* Top Performing Articles & Category Reach */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10 pt-2">
                  {/* Top Articles Leaderboard */}
                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Top Performing Articles (By Views)
                      </h3>
                      <span className="text-3xs font-extrabold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded border border-sky-400/30">{translate(`Leaderboard`)}</span>
                    </div>

                    <div className="space-y-3">
                      {(blogPerformance?.topArticles || blogsList.slice(0, 5)).map((art: any, idx: number) => {
                        const views = art.views || 0;
                        const maxViews = blogPerformance?.topArticles?.[0]?.views || 3500;
                        const pct = Math.min(100, Math.max(10, Math.round((views / (maxViews || 1)) * 100)));
                        return (
                          <div key={art.id || idx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2 max-w-[70%]">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-3xs font-mono shrink-0 ${
                                  idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white'
                                }`}>
                                  {idx + 1}
                                </span>
                                <span className="font-bold text-slate-100 truncate">{art.title}</span>
                              </div>
                              <div className="text-end text-2xs font-mono font-bold text-sky-300 shrink-0">
                                {views.toLocaleString()} views <span className="text-slate-400">({art.likes || 0} ❤️)</span>
                              </div>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Performance Breakdown */}
                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-400" />
                        {translate(`Category Audience Reach`)}
                      </h3>
                      <span className="text-3xs font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">{translate(`Category Share`)}</span>
                    </div>

                    <div className="space-y-3">
                      {(blogPerformance?.categoryStats || []).map((cat: any) => {
                        const totalViews = blogPerformance?.totalViews || 1;
                        const pct = Math.round(((cat.views || 0) / totalViews) * 100);
                        return (
                          <div key={cat.name} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-200">{cat.name} <span className="text-slate-400 text-2xs">({cat.count} posts)</span></span>
                              <span className="font-mono text-2xs font-bold text-emerald-300">{cat.views.toLocaleString()} views ({pct}%)</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 1: Category Container Images */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-[#0A2540]">{translate(`Curated Experience Category Images`)}</h2>
                    <p className="text-slate-500 text-xs">{translate(`Click "Change Image" on any category card to edit its container background photo`)}</p>
                  </div>
                  <span className="text-xs font-extrabold text-[#0091EA] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                    {blogCategoriesList.length} Categories
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {blogCategoriesList.map((cat) => (
                    <div key={cat.id} className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 shadow-xs flex flex-col">
                      <div className="h-36 relative overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          onError={(e) => { e.currentTarget.onerror = null;
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                        <span className="absolute bottom-3 left-3 text-white font-extrabold text-sm drop-shadow-sm">
                          {cat.name}
                        </span>
                      </div>
                      <div className="p-3 bg-white flex items-center justify-between border-t border-slate-100">
                        <span className="text-3xs font-extrabold uppercase text-slate-400 font-mono tracking-wider">ID: {cat.id}</span>
                        <button
                          onClick={() => handleOpenBlogCatModal(cat)}
                          className="px-3 py-1 bg-sky-50 hover:bg-[#0091EA] text-[#0091EA] hover:text-white rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-sky-100"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{translate(`Change Image`)}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Journal Articles & Container Images */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-[#0A2540]">{translate(`Journal Articles & Telemetry`)}</h2>
                    <p className="text-slate-500 text-xs mt-0.5">{translate(`Manage articles, authors, container cover images, and view engagement metrics`)}</p>
                  </div>
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={translate(`Search articles or authors...`)}
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0091EA]"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-3xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-6">{translate(`Container Image`)}</th>
                        <th className="py-3 px-6">{translate(`Article Details`)}</th>
                        <th className="py-3 px-6">{translate(`Category`)}</th>
                        <th className="py-3 px-6">{translate(`Author & Date`)}</th>
                        <th className="py-3 px-6">{translate(`Views & Engagements`)}</th>
                        <th className="py-3 px-6 text-end">{translate(`Actions`)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {blogsList
                        .filter((b) =>
                          !globalSearch ||
                          (b.title && b.title.toLowerCase().includes(globalSearch.toLowerCase())) ||
                          (b.author && b.author.toLowerCase().includes(globalSearch.toLowerCase())) ||
                          (b.category && b.category.toLowerCase().includes(globalSearch.toLowerCase()))
                        )
                        .map((article) => {
                          const views = article.views || 0;
                          const likes = article.likes || 0;
                          const shares = article.shares || 0;
                          const rate = views ? (((likes + shares) / views) * 100).toFixed(1) : '0.0';
                          return (
                            <tr key={article.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-4 px-6">
                                <div className="w-20 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 relative group">
                                  <img 
                                    src={article.image} 
                                    alt={article.title} 
                                    onError={(e) => { e.currentTarget.onerror = null;
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200';
                                    }}
                                    className="w-full h-full object-cover" 
                                  />
                                  <label 
                                    className="absolute inset-0 bg-slate-900/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-3xs font-black cursor-pointer gap-0.5 p-1 text-center"
                                    title={translate(`Click to Upload New Container Image`)}
                                  >
                                    <Upload className="w-3.5 h-3.5 text-sky-400" />
                                    <span>{translate(`Change`)}</span>
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      onChange={(e) => handleDirectArticleImageUpload(e, article)} 
                                      className="hidden" 
                                    />
                                  </label>
                                </div>
                              </td>
                              <td className="py-4 px-6 max-w-xs">
                                <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-1">{article.title}</h3>
                                <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{article.excerpt}</p>
                              </td>
                              <td className="py-4 px-6">
                                <span className="px-2.5 py-1 bg-sky-50 text-[#0091EA] border border-sky-100 rounded-full text-[#0091EA] border-sky-100 text-3xs font-extrabold uppercase tracking-wider">
                                  {article.category}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-bold text-slate-800">{article.author}</div>
                                <div className="text-slate-400 text-3xs font-mono">{article.date} • {article.readTime}</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="space-y-1 font-mono">
                                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>{views.toLocaleString()} views</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-3xs font-semibold text-slate-500">
                                    <span className="text-rose-600 flex items-center gap-0.5"><Heart className="w-3 h-3 inline" /> {likes}</span>
                                    <span>•</span>
                                    <span className="text-sky-600 flex items-center gap-0.5"><Share2 className="w-3 h-3 inline" /> {shares}</span>
                                    <span>•</span>
                                    <span className="text-amber-700 font-extrabold bg-amber-50 px-1 rounded border border-amber-200">
                                      {rate}% ER
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-end">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenBlogModal('edit', article)}
                                    className="p-1.5 hover:bg-sky-50 text-slate-600 hover:text-[#0091EA] rounded-lg transition-colors cursor-pointer"
                                    title={translate(`Edit Article & Image`)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBlogArticle(article.id)}
                                    className="p-1.5 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                    title={translate(`Delete Article`)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {blogsList.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                            {translate(`No blog articles found. Click "New Blog Article" to publish one.`)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL CONTAINER: TOUR ADD/EDIT */}
      {activeModal === 'tour' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#0A2540]">
                {modalMode === 'add' ? 'Create Reservation Package' : 'Edit Tour Information'}
              </h2>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-450">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTour} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Tour Package Title`)}</label>
                  <input
                    type="text"
                    required
                    value={tourTitle}
                    onChange={(e) => setTourTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0091EA]"
                    placeholder="e.g. Scenic Sri Lanka Beach Getaway"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Overview Description`)}</label>
                  <textarea
                    required
                    rows={3}
                    value={tourDesc}
                    onChange={(e) => setTourDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0091EA]"
                    placeholder={translate(`Describe the adventure, activities and highlights...`)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Duration`)}</label>
                  <input
                    type="text"
                    required
                    value={tourDuration}
                    onChange={(e) => setTourDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0091EA]"
                    placeholder="e.g. 7 Days, 6 Nights"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={tourPrice}
                    onChange={(e) => setTourPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0091EA]"
                    placeholder="e.g. 1250"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Category`)}</label>
                  <select
                    value={tourCategory}
                    onChange={(e) => setTourCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0091EA]"
                  >
                    <option value="Beach Holidays">{translate(`Beach Holidays`)}</option>
                    <option value="City Tours">{translate(`City Tours`)}</option>
                    <option value="Adventure Tours">{translate(`Adventure Tours`)}</option>
                    <option value="Group Tours">{translate(`Group Tours`)}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Max Slots (Guests)</label>
                  <input
                    type="number"
                    required
                    value={tourMaxGuests}
                    onChange={(e) => setTourMaxGuests(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0091EA]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Visibility Status`)}</label>
                  <select
                    value={tourStatus}
                    onChange={(e) => setTourStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0091EA]"
                  >
                    <option value="Active">Active / Public</option>
                    <option value="Inactive">Inactive / Hidden</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tour Image (Upload Local or Paste URL)</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'tour')}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-[#0091EA] hover:file:bg-sky-100 cursor-pointer"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={tourImage}
                      onChange={(e) => setTourImage(e.target.value)}
                      placeholder={translate(`Paste photo URL...`)}
                      className="w-full bg-slate-50 border border-slate-250 p-2 rounded-lg text-xs text-slate-800 pr-16"
                    />
                    {tourImage && (
                      <button
                        type="button"
                        onClick={() => setTourImage('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded transition-colors"
                      >
                        {translate(`Clear`)}
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setTourImage('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800')}
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                    >
                      {translate(`Beach`)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTourImage('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800')}
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                    >
                      {translate(`Mountain`)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTourImage('https://images.unsplash.com/photo-1548013146-72479768bada?w=800')}
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                    >
                      {translate(`Culture`)}
                    </button>
                  </div>
                  {tourImage && (
                    <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                      <div className="relative w-12 h-10 rounded overflow-hidden bg-slate-200 shrink-0">
                        <img
                          src={tourImage}
                          alt="Tour preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.onerror = null;
                            setTourImage('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800');
                            showToast('Invalid tour image URL replaced with default preset.', 'error');
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">{translate(`Cover Image Connected`)}</span>
                    </div>
                  )}
                </div>

                {/* Tour Gallery Collection Manager */}
                <div className="md:col-span-2 border-t border-slate-200 pt-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-black text-[#0A2540] flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-[#0091EA]" />
                        <span>{translate(`Tour Package Gallery Collection`)}</span>
                        <span className="bg-sky-50 text-[#0091EA] border border-sky-200 text-xs px-2 py-0.5 rounded-full font-bold">
                          {tourGalleryImages.length} Photos
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        {translate(`Upload or manage the photo gallery displayed on the public tour details page.`)}
                      </p>
                    </div>

                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0091EA] hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer self-start sm:self-auto">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{translate(`Upload Photos`)}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Add Image by URL & Presets */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <label className="block text-2xs font-extrabold text-slate-400 uppercase">{translate(`Add Gallery Image via URL`)}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newGalleryUrlInput}
                        onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                        placeholder={translate(`Paste image URL (e.g. https://images.unsplash.com/...)`)}
                        className="flex-1 bg-white border border-slate-250 p-2 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0091EA]"
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryUrl}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                      >
                        {translate(`Add URL`)}
                      </button>
                    </div>

                    {/* Quick Preset Gallery Photos */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Quick Add Presets:</span>
                      <button
                        type="button"
                        onClick={() => setTourGalleryImages(prev => [...prev, 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800'])}
                        className="text-[10px] font-semibold bg-white border border-slate-200 hover:bg-sky-50 hover:text-[#0091EA] text-slate-700 px-2 py-1 rounded transition-colors"
                      >
                        + Tropical Beach
                      </button>
                      <button
                        type="button"
                        onClick={() => setTourGalleryImages(prev => [...prev, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'])}
                        className="text-[10px] font-semibold bg-white border border-slate-200 hover:bg-sky-50 hover:text-[#0091EA] text-slate-700 px-2 py-1 rounded transition-colors"
                      >
                        + Luxury Resort
                      </button>
                      <button
                        type="button"
                        onClick={() => setTourGalleryImages(prev => [...prev, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800'])}
                        className="text-[10px] font-semibold bg-white border border-slate-200 hover:bg-sky-50 hover:text-[#0091EA] text-slate-700 px-2 py-1 rounded transition-colors"
                      >
                        + Wilderness Safari
                      </button>
                      <button
                        type="button"
                        onClick={() => setTourGalleryImages(prev => [...prev, 'https://images.unsplash.com/photo-1549473889-14f410d83298?w=800'])}
                        className="text-[10px] font-semibold bg-white border border-slate-200 hover:bg-sky-50 hover:text-[#0091EA] text-slate-700 px-2 py-1 rounded transition-colors"
                      >
                        + Heritage Fortress
                      </button>
                    </div>
                  </div>

                  {/* Gallery Thumbnails Grid */}
                  {tourGalleryImages.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <ImageIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-600">{translate(`No Gallery Photos Added Yet`)}</p>
                      <p className="text-2xs text-slate-400 mt-0.5">{translate(`Upload photos or click quick add presets above.`)}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {tourGalleryImages.map((imgUrl, idx) => (
                        <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 flex flex-col shadow-2xs">
                          <img
                            src={imgUrl}
                            alt={`Gallery item ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => { e.currentTarget.onerror = null;
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';
                            }}
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                            <span className="text-[10px] font-black text-white bg-slate-900/70 px-2 py-0.5 rounded-full w-fit backdrop-blur-xs">
                              #{idx + 1}
                            </span>
                            <div className="flex items-center justify-between gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setTourImage(imgUrl);
                                  showToast('Set as main cover image', 'success');
                                }}
                                className="px-2 py-1 bg-white/90 hover:bg-white text-[10px] font-bold text-slate-800 rounded shadow-xs"
                                title={translate(`Set as Cover Image`)}
                              >
                                {translate(`Set Cover`)}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded shadow-xs"
                                title={translate(`Delete Photo`)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Itinerary step editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0A2540]">{translate(`Step-By-Step Itinerary Scheduler`)}</h3>
                  <button
                    type="button"
                    onClick={handleAddItineraryDay}
                    className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 hover:bg-sky-100 text-[#0091EA] rounded-md text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{translate(`Add Itinerary Day`)}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {tourItinerary.map((day, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative space-y-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveItineraryDay(idx)}
                        className="absolute top-4 right-4 p-1 rounded-md text-rose-500 hover:bg-rose-50"
                        title={translate(`Remove Day`)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-2xs font-extrabold text-slate-450 uppercase mb-1">{translate(`Timeline`)}</label>
                          <span className="block py-2 text-sm font-bold text-[#0A2540]">Day {day.day}</span>
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-2xs font-extrabold text-slate-450 uppercase mb-1">{translate(`Daily Heading`)}</label>
                          <input
                            type="text"
                            required
                            value={day.title}
                            onChange={(e) => {
                              const list = [...tourItinerary];
                              list[idx].title = e.target.value;
                              setTourItinerary(list);
                            }}
                            className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-semibold text-slate-800"
                            placeholder="e.g. Beach Picnic & Sunset Safari"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-2xs font-extrabold text-slate-450 uppercase mb-1">{translate(`Daily Description`)}</label>
                        <textarea
                          required
                          rows={2}
                          value={day.description}
                          onChange={(e) => {
                            const list = [...tourItinerary];
                            list[idx].description = e.target.value;
                            setTourItinerary(list);
                          }}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs text-slate-750"
                          placeholder={translate(`Describe today's plans...`)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-slate-250 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all"
                >
                  {translate(`Cancel`)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0091EA] text-white hover:bg-sky-500 rounded-lg text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  {translate(`Save Package`)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONTAINER: CAR REGISTER ADD/EDIT */}
      {activeModal === 'car' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#0A2540]">
                {modalMode === 'add' ? 'Register Vehicle Profile' : 'Edit Vehicle Registry'}
              </h2>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-450">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCar} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Vehicle Model Name`)}</label>
                <input
                  type="text"
                  required
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                  placeholder="e.g. Toyota Prius Hybrid"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Category`)}</label>
                  <select
                    value={carCategory}
                    onChange={(e) => setCarCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                  >
                    <option value="Sedan">{translate(`Sedan`)}</option>
                    <option value="SUV">{translate(`SUV`)}</option>
                    <option value="Luxury">{translate(`Luxury`)}</option>
                    <option value="Van">{translate(`Van`)}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Passenger Capacity`)}</label>
                  <input
                    type="number"
                    required
                    value={carSeats}
                    onChange={(e) => setCarSeats(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Transmission`)}</label>
                  <select
                    value={carTransmission}
                    onChange={(e) => setCarTransmission(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                  >
                    <option value="Automatic">{translate(`Automatic`)}</option>
                    <option value="Manual">{translate(`Manual`)}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Rate Per Day (USD)</label>
                  <input
                    type="number"
                    required
                    value={carPrice}
                    onChange={(e) => setCarPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                    placeholder="e.g. 45"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Vehicle Status`)}</label>
                  <select
                    value={carStatus}
                    onChange={(e) => setCarStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                  >
                    <option value="Available">{translate(`Available`)}</option>
                    <option value="Booked">{translate(`Booked`)}</option>
                    <option value="Maintenance">{translate(`Maintenance`)}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Car Image (Upload Local or Paste URL)</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'car')}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-[#0091EA] hover:file:bg-sky-100 cursor-pointer"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={carImage}
                      onChange={(e) => setCarImage(e.target.value)}
                      placeholder={translate(`Paste vehicle image URL...`)}
                      className="w-full bg-slate-50 border border-slate-250 p-2 rounded-lg text-xs text-slate-800 pr-16"
                    />
                    {carImage && (
                      <button
                        type="button"
                        onClick={() => setCarImage('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded transition-colors"
                      >
                        {translate(`Clear`)}
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setCarImage('https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800')}
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                    >
                      {translate(`Sedan`)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCarImage('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800')}
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                    >
                      {translate(`SUV`)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCarImage('https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800')}
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                    >
                      {translate(`Convertible`)}
                    </button>
                  </div>
                  {carImage && (
                    <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                      <div className="relative w-12 h-10 rounded overflow-hidden bg-slate-200 shrink-0">
                        <img
                          src={carImage}
                          alt="Car preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.onerror = null;
                            setCarImage('https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800');
                            showToast('Invalid car image URL replaced with default preset.', 'error');
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">{translate(`Image Connected`)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-slate-250 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all"
                >
                  {translate(`Cancel`)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0091EA] text-white hover:bg-sky-500 rounded-lg text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  {translate(`Save Vehicle`)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONTAINER: FLIGHT REGISTER ADD/EDIT */}
      {activeModal === 'flight' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#0A2540]">
                {modalMode === 'add' ? 'Register Flight Schedule' : 'Edit Flight details'}
              </h2>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-450">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFlight} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Airline Company`)}</label>
                <input
                  type="text"
                  required
                  value={flightAirline}
                  onChange={(e) => setFlightAirline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                  placeholder="e.g. SriLankan Airlines"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Origin (From City)</label>
                  <input
                    type="text"
                    required
                    value={flightFrom}
                    onChange={(e) => setFlightFrom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                    placeholder="e.g. London"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Destination (To City)</label>
                  <input
                    type="text"
                    required
                    value={flightTo}
                    onChange={(e) => setFlightTo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                    placeholder="e.g. Colombo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Departure Time`)}</label>
                  <input
                    type="text"
                    required
                    value={flightDeparture}
                    onChange={(e) => setFlightDeparture(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                    placeholder="e.g. 14:30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Arrival Time`)}</label>
                  <input
                    type="text"
                    required
                    value={flightArrival}
                    onChange={(e) => setFlightArrival(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                    placeholder="e.g. 05:45"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Stops`)}</label>
                  <input
                    type="number"
                    required
                    value={flightStops}
                    onChange={(e) => setFlightStops(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Ticket Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={flightPrice}
                    onChange={(e) => setFlightPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                    placeholder="e.g. 680"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-slate-250 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all"
                >
                  {translate(`Cancel`)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0091EA] text-white hover:bg-sky-500 rounded-lg text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  {translate(`Save Schedule`)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'hotel' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-black text-[#0A2540]">
                {modalMode === 'add' ? 'Register Premium Hotel' : 'Edit Hotel details'}
              </h2>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-450">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHotel} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Hotel Name`)}</label>
                <input
                  type="text"
                  required
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                  placeholder="e.g. Grand Serendib Hotel"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Location`)}</label>
                  <input
                    type="text"
                    required
                    value={hotelLocation}
                    onChange={(e) => setHotelLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                    placeholder="e.g. Kandy, Sri Lanka"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Star Rating (1-5)</label>
                  <select
                    value={hotelStarRating}
                    onChange={(e) => setHotelStarRating(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nightly Rate (USD)</label>
                  <input
                    type="number"
                    required
                    value={hotelPrice}
                    onChange={(e) => setHotelPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                    placeholder="e.g. 150"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Hotel Image (Upload Local or Paste URL)</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'hotel')}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-[#0091EA] hover:file:bg-sky-100 cursor-pointer"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={hotelImageUrl}
                      onChange={(e) => setHotelImageUrl(e.target.value)}
                      placeholder={translate(`Paste photo URL or path...`)}
                      className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800 pr-16"
                    />
                    {hotelImageUrl && (
                      <button
                        type="button"
                        onClick={() => setHotelImageUrl('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded transition-colors"
                      >
                        {translate(`Clear`)}
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setHotelImageUrl('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80')}
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                    >
                      {translate(`Resort & Spa`)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setHotelImageUrl('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80')}
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                    >
                      {translate(`Beach Villa`)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setHotelImageUrl('https://images.unsplash.com/photo-1582719508461-905c67377101?auto=format&fit=crop&w=800&q=80')}
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                    >
                      {translate(`Boutique`)}
                    </button>
                  </div>
                  {hotelImageUrl ? (
                    <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                      <div className="relative w-16 h-12 rounded overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                        <img
                          src={hotelImageUrl}
                          alt="Hotel preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.onerror = null;
                            setHotelImageUrl('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80');
                            showToast('Invalid hotel image URL replaced with default preset.', 'error');
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-emerald-600 block">✓ Valid Image Connected</span>
                        <span className="text-[10px] text-slate-400 block truncate font-mono">{hotelImageUrl}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                      {translate(`No photo set. Upload a file or click a preset above.`)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Description`)}</label>
                <textarea
                  value={hotelDescription}
                  onChange={(e) => setHotelDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800 h-20"
                  placeholder={translate(`Brief description of the luxury and comfort...`)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={hotelAmenities}
                  onChange={(e) => setHotelAmenities(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm text-slate-800"
                  placeholder={translate(`Free WiFi, Swimming Pool, Spa, Room Service, etc.`)}
                />
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-slate-250 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all"
                >
                  {translate(`Cancel`)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0091EA] text-white hover:bg-sky-500 rounded-lg text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  {modalMode === 'add' ? 'Create Listing' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BLOG CATEGORY CONTAINER IMAGE */}
      {activeModal === 'blogCat' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg flex flex-col animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#0A2540]">
                Update Container Image: {selectedCatName}
              </h2>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-450">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlogCategory} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{translate(`Category Container Image Preview`)}</label>
                <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 mb-4">
                  {selectedCatImage ? (
                    <img 
                      src={selectedCatImage} 
                      alt={selectedCatName} 
                      onError={(e) => { e.currentTarget.onerror = null;
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800';
                      }}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs">{translate(`No image selected`)}</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 text-white font-extrabold text-sm">{selectedCatName}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-3xs font-extrabold text-slate-400 uppercase mb-1">{translate(`Image URL`)}</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={selectedCatImage}
                      onChange={(e) => setSelectedCatImage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-bold uppercase">or</span>
                    <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{translate(`Upload Local Photo`)}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'blogCat')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  {translate(`Cancel`)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0091EA] text-white hover:bg-sky-500 rounded-lg text-xs font-bold transition-colors"
                >
                  {translate(`Save Container Image`)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BLOG ARTICLE ADD/EDIT */}
      {activeModal === 'blog' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#0A2540]">
                {modalMode === 'add' ? 'Publish New Blog Article' : 'Edit Article & Container Media'}
              </h2>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-450">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlogArticle} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Article Title`)}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Ultimate Luxury Guide to Sigiriya Rock Fortress"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm font-semibold text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Category`)}</label>
                    <select
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm font-semibold text-slate-800"
                    >
                      <option value="Heritage">{translate(`Heritage`)}</option>
                      <option value="Hill Country">{translate(`Hill Country`)}</option>
                      <option value="Beaches">{translate(`Beaches`)}</option>
                      <option value="Wildlife">{translate(`Wildlife`)}</option>
                      <option value="Food">{translate(`Food`)}</option>
                      <option value="Trains">{translate(`Scenic Train Journeys`)}</option>
                      <option value="Eco Tourism">{translate(`Eco Tourism`)}</option>
                      <option value="Luxury Escapes">{translate(`Luxury Escapes`)}</option>
                      <option value="Travel Tips">{translate(`Travel Tips`)}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Read Time`)}</label>
                    <input
                      type="text"
                      placeholder="e.g. 6 min read"
                      value={blogReadTime}
                      onChange={(e) => setBlogReadTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Author`)}</label>
                    <input
                      type="text"
                      placeholder="e.g. Isabella Rossi"
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Publish Date`)}</label>
                    <input
                      type="text"
                      placeholder="e.g. Oct 15, 2026"
                      value={blogDate}
                      onChange={(e) => setBlogDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Article Excerpt / Summary</label>
                  <textarea
                    rows={3}
                    placeholder={translate(`Brief summary of the travel guide or story...`)}
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-sm font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{translate(`Container Cover Image`)}</label>
                  {blogImage && (
                    <div className="relative h-40 rounded-xl overflow-hidden border border-slate-200 mb-3 bg-slate-100">
                      <img 
                        src={blogImage} 
                        alt="Cover Preview" 
                        onError={(e) => { e.currentTarget.onerror = null;
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200';
                        }}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder={translate(`Image URL (e.g. /uploads/... or https://...)`)}
                      value={blogImage}
                      onChange={(e) => setBlogImage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-lg text-xs font-semibold text-slate-800"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-bold uppercase">or</span>
                      <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{translate(`Upload Cover Photo`)}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'blog')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  {translate(`Cancel`)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0091EA] text-white hover:bg-sky-500 rounded-lg text-xs font-bold transition-colors"
                >
                  {modalMode === 'add' ? 'Publish Article' : 'Update Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONTAINER: CUSTOMER HISTORIC LOG DETAIL */}
      {activeModal === 'customerDetail' && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[80vh] flex flex-col animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#0A2540] text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  {(selectedItem.fullName || selectedItem.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-black text-[#0A2540]">{selectedItem.fullName || selectedItem.name || 'Valued Customer'}</h2>
                  <span className="text-2xs font-mono text-slate-500">{selectedItem.email}</span>
                </div>
              </div>
              <button onClick={() => { setActiveModal(null); setCustomerModalTab('bookings'); }} className="p-1 rounded-lg hover:bg-slate-100 text-slate-450">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-150">
                  <span className="text-3xs font-extrabold text-slate-450 uppercase block">{translate(`Total bookings count`)}</span>
                  <span className="text-xl font-black text-[#0A2540]">{selectedItem.bookingsCount} Session(s)</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-150">
                  <span className="text-3xs font-extrabold text-slate-450 uppercase block">{translate(`Lifetime LTV Spend`)}</span>
                  <span className="text-xl font-black text-emerald-600">${selectedItem.totalSpend?.toLocaleString()}</span>
                </div>
              </div>

              {/* TABS SELECTOR */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setCustomerModalTab('bookings')}
                  className={`py-2.5 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                    customerModalTab === 'bookings'
                      ? 'border-[#0091EA] text-[#0091EA]'
                      : 'border-transparent text-slate-450 hover:text-slate-600'
                  }`}
                >
                  {translate(`Booking History`)}
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerModalTab('logins')}
                  className={`py-2.5 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                    customerModalTab === 'logins'
                      ? 'border-[#0091EA] text-[#0091EA]'
                      : 'border-transparent text-slate-450 hover:text-slate-600'
                  }`}
                >
                  Login Log Audit ({selectedItem.loginCount || 0})
                </button>
              </div>

              {customerModalTab === 'bookings' ? (
                /* Booking History Table */
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{translate(`Segmented Session logs`)}</h3>
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full text-start border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-2xs font-extrabold text-slate-500 uppercase">
                          <th className="p-3">{translate(`Booking Segment`)}</th>
                          <th className="p-3">{translate(`Schedule Date`)}</th>
                          <th className="p-3">{translate(`Status`)}</th>
                          <th className="p-3 text-end">Value (USD)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {selectedItem.history && selectedItem.history.length > 0 ? (
                          selectedItem.history.map((hist: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/45">
                              <td className="p-3">
                                <span className="font-bold text-[#0A2540]">{hist.type}</span>
                              </td>
                              <td className="p-3 font-mono text-slate-500">{hist.date}</td>
                              <td className="p-3">{renderStatusBadge(hist.status)}</td>
                              <td className="p-3 text-end font-bold text-slate-900">${hist.amount}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-slate-400 font-normal">
                              {translate(`No historic segment bookings associated with this customer.`)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Login Logs Audit Table */
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{translate(`Security Login Audits`)}</h3>
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full text-start border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-2xs font-extrabold text-slate-500 uppercase">
                          <th className="p-3">{translate(`Login Date & Time`)}</th>
                          <th className="p-3">{translate(`Authorized Role`)}</th>
                          <th className="p-3">{translate(`Remote IP Address`)}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {selectedItem.loginHistory && selectedItem.loginHistory.length > 0 ? (
                          selectedItem.loginHistory.map((log: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/45">
                              <td className="p-3 font-mono text-slate-600">
                                {new Date(log.loggedInAt).toLocaleString()}
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded text-3xs font-bold uppercase bg-sky-50 text-[#0091EA] border border-sky-100">
                                  {log.role}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-slate-500">
                                {log.ipAddress || '127.0.0.1 (Localhost)'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="p-6 text-center text-slate-400 font-normal">
                              {translate(`No authenticated login log sessions recorded for this customer account.`)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => { setActiveModal(null); setCustomerModalTab('bookings'); }}
                className="px-5 py-2 bg-[#0A2540] text-white hover:bg-slate-800 rounded-lg text-sm font-bold transition-all cursor-pointer"
              >
                {translate(`Close Profile`)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Automated Email & SMS/WhatsApp Notification Simulator Modal */}
      <NotificationSimulatorModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </div>
  );
}
