import { db } from './index.ts';
import {
  users,
  packages,
  tours,
  flights,
  cars,
  bookings,
  flightBookings,
  carBookings,
  subscribers,
  contactMessages,
  profiles,
  loginLogs,
  wishlist,
  hotels,
  hotelBookings
} from './schema.ts';
import { eq, and, lte, gte, or, like } from './index.ts';

// Query Layer Error Helper
function handleQueryError(context: string, error: unknown): never {
  console.error(`Database query failed [${context}]:`, error);
  throw new Error(`Database operation failed during [${context}]. Please try again later.`, { cause: error });
}

// 1. Users
export async function getOrCreateUser(uid: string, email: string) {
  try {
    const result = await db.insert(users)
      .values({ uid, email })
      .onConflictDoUpdate({
        target: users.uid,
        set: { email }
      })
      .returning();
    return result[0];
  } catch (error) {
    handleQueryError('getOrCreateUser', error);
  }
}

// 2. Packages
export const DEFAULT_PACKAGES = [
  { id: 1, title: 'Sri Lanka Grand Luxury Escape', category: 'Luxury', duration: '10 Days / 9 Nights', price: 2450, imageUrl: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80', description: 'Experience the ultimate luxury journey across Sri Lanka from private helicopter tours to 5-star beachfront resorts.' },
  { id: 2, title: 'Tropical Wildlife & Beach Safari', category: 'Safari', duration: '7 Days / 6 Nights', price: 1680, imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80', description: 'Discover Yala leopards, blue whales of Mirissa, and pristine coastal sanctuaries.' }
];

export async function getPackages(category?: string) {
  try {
    let result = await db.select().from(packages);
    if (!result || result.length === 0) {
      for (const p of DEFAULT_PACKAGES) {
        await db.insert(packages).values(p);
      }
      result = await db.select().from(packages);
    }
    if (!result || result.length === 0) {
      result = DEFAULT_PACKAGES;
    }
    if (category && category !== 'All') {
      return result.filter((p: any) => p.category && p.category.toLowerCase() === category.toLowerCase());
    }
    return result;
  } catch (error) {
    if (category && category !== 'All') {
      return DEFAULT_PACKAGES.filter((p: any) => p.category && p.category.toLowerCase() === category.toLowerCase());
    }
    return DEFAULT_PACKAGES;
  }
}

// 3. Tours
export const DEFAULT_TOURS = [
  {
    id: 1,
    title: "Sigiriya & Dambulla Heritage Tour",
    category: "Cultural",
    duration: "1 Day",
    price: 120,
    location: "Sigiriya, Sri Lanka",
    imageUrl: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80",
    description: "Climb the ancient 5th-century Sigiriya Rock Fortress (UNESCO World Heritage) and explore the sacred Dambulla Cave Temple complex featuring over 150 Buddha statues.",
    highlights: "['UNESCO World Heritage', 'Ancient Frescoes', 'Mirror Wall', 'Golden Temple']",
    itinerary: "['06:00 AM - Hotel Pickup', '09:30 AM - Arrive & Climb Sigiriya', '01:00 PM - Traditional Lunch', '02:30 PM - Dambulla Cave Temple', '06:00 PM - Return']",
    included: "['Air-conditioned vehicle', 'English-speaking guide', 'Entrance tickets', 'Traditional lunch']",
    excluded: "['Personal expenses', 'Tips & gratuities']"
  },
  {
    id: 2,
    title: "Ella Hill Country & Nine Arch Railway Journey",
    category: "Scenic",
    duration: "2 Days / 1 Night",
    price: 240,
    location: "Ella & Nuwara Eliya",
    imageUrl: "https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&q=80",
    description: "Experience the world-famous blue train ride through lush tea plantations, marvel at Nine Arch Bridge, and hike Little Adam's Peak.",
    highlights: "['Scenic Blue Train', 'Nine Arch Bridge', 'Tea Factory Tour', 'Little Adam\'s Peak']",
    itinerary: "['Day 1: Kandy to Ella Train Ride', 'Day 2: Hike & Waterfall Exploration']",
    included: "['First-class Train Tickets', '1 Night Hotel Stay', 'Breakfast & Dinner', 'Private Transfers']",
    excluded: "['Lunch', 'Alcoholic beverages']"
  },
  {
    id: 3,
    title: "Yala National Park Wild Leopard Safari",
    category: "Wildlife",
    duration: "1 Day",
    price: 180,
    location: "Yala National Park",
    imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
    description: "Embark on an exciting 4x4 Jeep Safari in Yala, world-renowned for highest leopard density, wild elephants, sloth bears, and exotic birds.",
    highlights: "['4x4 Safari Jeep', 'Highest Leopard Density', 'Elephant Herds', 'Bird Watching']",
    itinerary: "['05:00 AM - Morning Safari Game Drive', '11:00 AM - Lunch break at campsite', '02:00 PM - Afternoon Safari Drive']",
    included: "['Park Entrance Permit', 'Private 4x4 Safari Jeep', 'Expert Tracker', 'Picnic Lunch & Water']",
    excluded: "['Camera fees', 'Driver tip']"
  },
  {
    id: 4,
    title: "Mirissa Blue Whale Watching & Galle Fort",
    category: "Beach",
    duration: "1 Day",
    price: 140,
    location: "Mirissa & Galle",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    description: "Sail into the Indian Ocean to spot Blue Whales and Dolphins, followed by a sunset walking tour of 16th-century Portuguese Galle Fort.",
    highlights: "['Blue Whale Spotting', 'Galle Fort UNESCO Site', 'Coconut Tree Hill', 'Turtle Hatchery']",
    itinerary: "['06:00 AM - Catamaran Cruise', '11:30 AM - Seafood Lunch', '02:00 PM - Galle Fort Walking Tour']",
    included: "['Whale Watching Boat Pass', 'Life Jackets & Breakfast on Board', 'Air-conditioned Private Car']",
    excluded: "['Personal shopping']"
  },
  {
    id: 5,
    title: "Cultural Heritage Explorer (Kandy, Polonnaruwa & Anuradhapura)",
    category: "Cultural",
    duration: "7 Days",
    price: 850,
    location: "Cultural Triangle",
    imageUrl: "https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200",
    description: "Comprehensive week-long journey through Sri Lanka's ancient royal kingdoms, sacred temples, and UNESCO world heritage sites.",
    highlights: "['Sacred Tooth Relic Temple', 'Polonnaruwa Ruins', 'Sigiriya Lion Rock', 'Kandy Botanical Gardens']",
    itinerary: "['Day 1-2: Kandy', 'Day 3-4: Sigiriya & Dambulla', 'Day 5-6: Polonnaruwa & Anuradhapura', 'Day 7: Departure']",
    included: "['Luxury Hotel Accommodation', 'Daily Breakfast & Dinner', 'Private Chauffeured Vehicle', 'All Monument Entrance Fees']",
    excluded: "['International flights', 'Lunch']"
  }
];

export async function getTours(category?: string, maxPrice?: number) {
  try {
    let result = await db.select().from(tours);
    if (!result || result.length === 0) {
      for (const t of DEFAULT_TOURS) {
        await db.insert(tours).values(t);
      }
      result = await db.select().from(tours);
    }
    if (!result || result.length === 0) {
      result = DEFAULT_TOURS;
    }
    if (category && category !== 'All') {
      result = result.filter((t: any) => t.category && t.category.toLowerCase() === category.toLowerCase());
    }
    if (maxPrice && maxPrice > 0) {
      result = result.filter((t: any) => Number(t.price) <= Number(maxPrice));
    }
    return result;
  } catch (error) {
    let result = DEFAULT_TOURS;
    if (category && category !== 'All') {
      result = result.filter((t: any) => t.category && t.category.toLowerCase() === category.toLowerCase());
    }
    if (maxPrice && maxPrice > 0) {
      result = result.filter((t: any) => Number(t.price) <= Number(maxPrice));
    }
    return result;
  }
}

export async function getTourById(id: number) {
  try {
    const result = await db.select().from(tours).where(eq(tours.id, id));
    if (result && result.length > 0) return result[0];
    return DEFAULT_TOURS.find(t => t.id === id) || DEFAULT_TOURS[0];
  } catch (error) {
    return DEFAULT_TOURS.find(t => t.id === id) || DEFAULT_TOURS[0];
  }
}

// 4. Flights
export async function getFlights(fromCity?: string, toCity?: string) {
  try {
    let result = await db.select().from(flights);
    if (!result || result.length === 0) {
      const defaultFlightsList = [
        { id: 1, airline: "SriLankan Airlines (UL 504)", fromCity: "London (LHR)", toCity: "Colombo (CMB), Sri Lanka", departureTime: "21:30", arrivalTime: "12:45 (+1)", price: 780, stops: 0 },
        { id: 2, airline: "Emirates (EK 650)", fromCity: "Dubai (DXB)", toCity: "Colombo (CMB), Sri Lanka", departureTime: "02:40", arrivalTime: "08:25", price: 450, stops: 0 },
        { id: 3, airline: "Qatar Airways (QR 668)", fromCity: "Doha (DOH)", toCity: "Colombo (CMB), Sri Lanka", departureTime: "18:50", arrivalTime: "02:10 (+1)", price: 490, stops: 0 },
        { id: 4, airline: "Singapore Airlines (SQ 468)", fromCity: "Singapore (SIN)", toCity: "Colombo (CMB), Sri Lanka", departureTime: "22:20", arrivalTime: "23:40", price: 420, stops: 0 },
        { id: 5, airline: "SriLankan Airlines (UL 605)", fromCity: "Melbourne (MEL)", toCity: "Colombo (CMB), Sri Lanka", departureTime: "16:10", arrivalTime: "22:25", price: 890, stops: 0 },
        { id: 6, airline: "Etihad Airways (EY 266)", fromCity: "Abu Dhabi (AUH)", toCity: "Colombo (CMB), Sri Lanka", departureTime: "21:25", arrivalTime: "03:20 (+1)", price: 410, stops: 0 },
        { id: 7, airline: "SriLankan Airlines (UL 102)", fromCity: "Male (MLE), Maldives", toCity: "Colombo (CMB), Sri Lanka", departureTime: "09:20", arrivalTime: "11:15", price: 180, stops: 0 },
        { id: 8, airline: "Turkish Airlines (TK 730)", fromCity: "Frankfurt (FRA)", toCity: "Colombo (CMB), Sri Lanka", departureTime: "14:15", arrivalTime: "05:45 (+1)", price: 680, stops: 1 }
      ];
      for (const f of defaultFlightsList) {
        await db.insert(flights).values(f);
      }
      result = await db.select().from(flights);
    }
    const fc = fromCity ? fromCity.toLowerCase().trim() : '';
    const tc = toCity ? toCity.toLowerCase().trim() : '';
    if (fc || tc) {
      return result.filter((f: any) => {
        const matchFrom = !fc || (f.fromCity && f.fromCity.toLowerCase().includes(fc));
        const matchTo = !tc || (f.toCity && f.toCity.toLowerCase().includes(tc));
        return matchFrom && matchTo;
      });
    }
    return result;
  } catch (error) {
    handleQueryError('getFlights', error);
  }
}

// 5. Cars
const DEFAULT_CARS = [
  {
    id: 1,
    name: "Toyota Axio / Allion Sedan",
    category: "Car",
    seats: 3,
    transmission: "Automatic",
    pricePerDay: 45,
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    description: "Comfortable air-conditioned sedan ideal for 1-3 passengers. Includes professional English-speaking driver, fuel, highway tolls, and full insurance.",
    features: ["Air Conditioned", "English Speaking Driver", "Fuel Included", "Highway Tolls Included", "3 Luggage Bags"]
  },
  {
    id: 2,
    name: "Toyota KDH Flat Roof Van",
    category: "Van",
    seats: 6,
    transmission: "Automatic",
    pricePerDay: 65,
    imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    description: "Spacious mini van for families or small groups up to 6 passengers. Fully air-conditioned with adjustable reclining seats.",
    features: ["Dual A/C", "Reclining Seats", "English Speaking Driver", "Fuel & Tolls Included", "5 Luggage Bags"]
  },
  {
    id: 3,
    name: "Toyota KDH Super GL High Roof",
    category: "Van",
    seats: 9,
    transmission: "Automatic",
    pricePerDay: 80,
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    description: "Luxury high-roof van featuring extra headroom, individual AC vents, and premium plush seating for up to 9 passengers.",
    features: ["High Roof Extra Space", "Individual A/C Vents", "Plush Reclining Seats", "Fuel & Tolls Included", "8 Luggage Bags"]
  },
  {
    id: 4,
    name: "Toyota Coaster Mini Bus",
    category: "Mini Bus",
    seats: 18,
    transmission: "Manual",
    pricePerDay: 125,
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    description: "Medium-sized tourist bus perfect for groups up to 18 passengers. Equipped with high-performance AC, PA mic system, and large luggage storage.",
    features: ["High Capacity A/C", "PA Microphone System", "Reclining Seats", "Driver & Helper Included", "Large Luggage Bay"]
  },
  {
    id: 5,
    name: "Scania / Isuzu Luxury Coach",
    category: "Luxury Bus",
    seats: 35,
    transmission: "Manual",
    pricePerDay: 180,
    imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    description: "Full-size luxury tourist coach with climate control AC, under-floor luggage compartments, USB charging ports, and tour assistant.",
    features: ["Climate Control A/C", "USB Charging Ports", "Under-floor Luggage", "Senior Driver & Assistant", "TV/Audio System"]
  },
  {
    id: 6,
    name: "Toyota Land Cruiser Prado SUV",
    category: "SUV",
    seats: 4,
    transmission: "Automatic",
    pricePerDay: 95,
    imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
    description: "Premium 4WD SUV with leather interior, sunroof, and high ground clearance. Perfect for luxury private island tours.",
    features: ["4WD Off-Road", "Leather Seats & Sunroof", "VIP Chauffeur", "Fuel & Tolls Included", "4 Luggage Bags"]
  },
  {
    id: 7,
    name: "Bajaj RE Tuk Tuk Explorer",
    category: "Budget",
    seats: 2,
    transmission: "Manual",
    pricePerDay: 25,
    imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
    description: "Authentic Sri Lankan auto-rickshaw experience for short distance city tours and scenic coastal rides.",
    features: ["Open-Air Panoramic", "Bluetooth Speaker", "Local Driver/Guide", "Authentic Experience"]
  }
];

export async function getCars(category?: string) {
  try {
    let result = [];
    if (category && category !== 'All') {
      result = await db.select().from(cars).where(eq(cars.category, category));
    } else {
      result = await db.select().from(cars);
    }
    
    if (!result || result.length === 0) {
      if (category && category !== 'All') {
        return DEFAULT_CARS.filter(c => c.category.toLowerCase() === category.toLowerCase());
      }
      return DEFAULT_CARS;
    }
    return result;
  } catch (error) {
    if (category && category !== 'All') {
      return DEFAULT_CARS.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    return DEFAULT_CARS;
  }
}

// 5b. Hotels
export const DEFAULT_HOTELS = [
  { id: 1, name: "Amanwella Luxury Resort", location: "Tangalle", price: 650, starRating: 5, description: "Contemporary beachfront resort set in a peaceful coconut grove along a crescent-shaped beach.", amenities: ["Infinity Pool", "Private Beach", "Ayurvedic Spa", "Personal Butler"], imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Ceylon Tea Trails", location: "Hatton", price: 580, starRating: 5, description: "Restored colonial tea planter bungalows nestled amidst Sri Lanka's high country tea estates.", amenities: ["All Inclusive", "High Tea", "Heated Pool", "Personal Chef"], imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Wild Coast Tented Lodge", location: "Yala", price: 720, starRating: 5, description: "Ultra-luxury safari lodge where the jungle meets the pristine Indian Ocean adjacent to Yala National Park.", amenities: ["Private Plunge Pool", "Wilderness Safaris", "Gourmet Dining", "Spa"], imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80" }
];

export async function getHotels(location?: string) {
  try {
    let result = await db.select().from(hotels);
    if (!result || result.length === 0) {
      for (const h of DEFAULT_HOTELS) {
        await db.insert(hotels).values(h);
      }
      result = await db.select().from(hotels);
    }
    if (!result || result.length === 0) {
      result = DEFAULT_HOTELS;
    }
    if (location && location.trim() !== '') {
      const loc = location.toLowerCase().trim();
      return result.filter((h: any) => h.location && h.location.toLowerCase().includes(loc));
    }
    return result;
  } catch (error) {
    if (location && location.trim() !== '') {
      const loc = location.toLowerCase().trim();
      return DEFAULT_HOTELS.filter((h: any) => h.location && h.location.toLowerCase().includes(loc));
    }
    return DEFAULT_HOTELS;
  }
}

export async function createHotel(data: {
  name: string;
  location: string;
  price: number;
  starRating: number;
  description: string;
  amenities: string[];
  imageUrl: string;
}) {
  try {
    const result = await db.insert(hotels).values({
      name: data.name,
      location: data.location,
      price: data.price,
      starRating: data.starRating,
      description: data.description,
      amenities: data.amenities,
      imageUrl: data.imageUrl
    }).returning();
    return result[0];
  } catch (error) {
    handleQueryError('createHotel', error);
  }
}

// 6. Bookings (Packages & Tours)
export async function createBooking(data: {
  userName: string;
  email: string;
  phone: string;
  packageId?: number | null;
  tourId?: number | null;
  travelDate: string;
  guests: number;
}) {
  try {
    const result = await db.insert(bookings)
      .values({
        userName: data.userName,
        email: data.email,
        phone: data.phone,
        packageId: data.packageId,
        tourId: data.tourId,
        travelDate: data.travelDate,
        guests: data.guests,
        status: 'Pending'
      })
      .returning();
    return result[0];
  } catch (error) {
    handleQueryError('createBooking', error);
  }
}

export async function getBookingsByEmail(email: string) {
  try {
    return await db.select().from(bookings).where(eq(bookings.email, email));
  } catch (error) {
    handleQueryError('getBookingsByEmail', error);
  }
}

// 7. Flight Bookings
export async function createFlightBooking(data: {
  flightId: number;
  passengerName: string;
  email: string;
  phone: string;
}) {
  try {
    const result = await db.insert(flightBookings)
      .values(data)
      .returning();
    return result[0];
  } catch (error) {
    handleQueryError('createFlightBooking', error);
  }
}

// 8. Car Bookings
export async function createCarBooking(data: {
  carId: number;
  customerName: string;
  pickupDate: string;
  returnDate: string;
}) {
  try {
    const result = await db.insert(carBookings)
      .values(data)
      .returning();
    return result[0];
  } catch (error) {
    handleQueryError('createCarBooking', error);
  }
}

// 9. Subscribers
export async function createSubscriber(email: string) {
  try {
    const result = await db.insert(subscribers)
      .values({ email })
      .onConflictDoNothing()
      .returning();
    return result[0] || { email, status: 'already_subscribed' };
  } catch (error) {
    handleQueryError('createSubscriber', error);
  }
}

// 10. Contact Messages
export async function createContactMessage(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    const result = await db.insert(contactMessages)
      .values(data)
      .returning();
    return result[0];
  } catch (error) {
    handleQueryError('createContactMessage', error);
  }
}

// 11. Profiles
export async function getProfileByUid(uid: string) {
  try {
    const result = await db.select().from(profiles).where(eq(profiles.uid, uid));
    return result[0] || null;
  } catch (error) {
    handleQueryError('getProfileByUid', error);
  }
}

export async function createOrUpdateProfile(uid: string, data: { fullName: string; email: string; phone?: string; role?: string }) {
  try {
    const existing = await getProfileByUid(uid);
    if (existing) {
      const updated = await db.update(profiles)
        .set({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone ?? existing.phone,
          role: data.role ?? existing.role,
        })
        .where(eq(profiles.uid, uid))
        .returning();
      return updated[0];
    } else {
      const result = await db.insert(profiles)
        .values({
          uid,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || '',
          role: data.role || 'customer'
        })
        .returning();
      return result[0];
    }
  } catch (error) {
    handleQueryError('createOrUpdateProfile', error);
  }
}

// 12. Login Logs
export async function recordLoginLog(uid: string, role: string, ipAddress?: string) {
  try {
    await db.update(profiles)
      .set({ lastLoginAt: new Date() })
      .where(eq(profiles.uid, uid));
    
    const result = await db.insert(loginLogs)
      .values({
        userId: uid,
        role,
        ipAddress: ipAddress || 'unknown'
      })
      .returning();
    return result[0];
  } catch (error) {
    handleQueryError('recordLoginLog', error);
  }
}

// 13. Wishlist
export async function getWishlist(userId: string) {
  try {
    return await db.select().from(wishlist).where(eq(wishlist.userId, userId));
  } catch (error) {
    handleQueryError('getWishlist', error);
  }
}

export async function addToWishlist(userId: string, itemType: string, itemId: number) {
  try {
    const existing = await db.select().from(wishlist).where(
      and(
        eq(wishlist.userId, userId),
        eq(wishlist.itemType, itemType),
        eq(wishlist.itemId, itemId)
      )
    );
    if (existing.length > 0) return existing[0];
    const result = await db.insert(wishlist)
      .values({ userId, itemType, itemId })
      .returning();
    return result[0];
  } catch (error) {
    handleQueryError('addToWishlist', error);
  }
}

export async function removeFromWishlist(userId: string, itemType: string, itemId: number) {
  try {
    return await db.delete(wishlist).where(
      and(
        eq(wishlist.userId, userId),
        eq(wishlist.itemType, itemType),
        eq(wishlist.itemId, itemId)
      )
    ).returning();
  } catch (error) {
    handleQueryError('removeFromWishlist', error);
  }
}

// 14. Profiles with full Statistics
export async function getAllProfilesWithStats() {
  try {
    const allProfiles = await db.select().from(profiles);
    const allBookings = await db.select().from(bookings);
    const allCarBookings = await db.select().from(carBookings);
    const allFlightBookings = await db.select().from(flightBookings);
    const allLogs = await db.select().from(loginLogs);
    
    const allTours = await db.select().from(tours);
    const allCars = await db.select().from(cars);
    const allFlights = await db.select().from(flights);
    
    return allProfiles.map(p => {
      const pEmail = p.email ? p.email.toLowerCase().trim() : '';
      const userBookings = allBookings.filter(b => b.userId === p.uid || (!b.userId && b.email && b.email.toLowerCase().trim() === pEmail));
      const userCarBookings = allCarBookings.filter(b => b.userId === p.uid || (!b.userId && b.customerName && b.customerName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@rental-guest.com' === pEmail));
      const userFlightBookings = allFlightBookings.filter(b => b.userId === p.uid || (!b.userId && b.email && b.email.toLowerCase().trim() === pEmail));
      
      const tourSpend = userBookings.reduce((sum, b) => {
        if (b.status === 'Cancelled') return sum;
        const t = allTours.find(x => x.id === b.tourId);
        return sum + (t ? t.price * b.guests : 0);
      }, 0);
      
      const carSpend = userCarBookings.reduce((sum, cb) => {
        if (cb.status === 'Cancelled') return sum;
        const c = allCars.find(x => x.id === cb.carId);
        if (!c) return sum;
        const start = new Date(cb.pickupDate);
        const end = new Date(cb.returnDate);
        const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
        return sum + (c.pricePerDay * diffDays);
      }, 0);
      
      const flightSpend = userFlightBookings.reduce((sum, fb) => {
        if (fb.status === 'Cancelled') return sum;
        const f = allFlights.find(x => x.id === fb.flightId);
        return sum + (f ? f.price : 0);
      }, 0);
      
      const userLogs = allLogs.filter(l => l.userId === p.uid);
      
      return {
        ...p,
        bookingsCount: userBookings.length + userCarBookings.length + userFlightBookings.length,
        totalSpend: tourSpend + carSpend + flightSpend,
        loginCount: userLogs.length,
        loginHistory: userLogs.sort((a,b) => (b.loggedInAt?.getTime() || 0) - (a.loggedInAt?.getTime() || 0))
      };
    });
  } catch (error) {
    handleQueryError('getAllProfilesWithStats', error);
  }
}

// 8. Blogs & Blog Categories
export const DEFAULT_BLOG_CATEGORIES = [
  { id: 'beaches', name: 'Beaches', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800' },
  { id: 'hill-country', name: 'Hill Country', image: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&q=80&w=800' },
  { id: 'wildlife', name: 'Wildlife', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800' },
  { id: 'heritage', name: 'Heritage', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800' },
  { id: 'food', name: 'Food', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800' },
  { id: 'trains', name: 'Scenic Train Journeys', image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=800' },
  { id: 'eco', name: 'Eco Tourism', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800' },
  { id: 'luxury', name: 'Luxury Escapes', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800' }
];

export const DEFAULT_BLOG_ARTICLES = [
  { id: 1, title: 'The Ultimate Luxury Guide to Sigiriya Rock Fortress', category: 'Heritage', readTime: '8 min read', author: 'Isabella Rossi', date: 'Oct 15, 2026', excerpt: 'Ascend the ancient Lion Rock in style. Discover private guided tours, nearby boutique luxury stays, and hidden sunset viewpoints away from the crowds.', image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200', views: 3420, likes: 412, shares: 98 },
  { id: 2, title: 'Ella – Sri Lanka\'s Most Beautiful Mountain Escape', category: 'Hill Country', readTime: '6 min read', author: 'Julian Vance', date: 'Oct 12, 2026', excerpt: 'Mist-shrouded tea estates, the iconic Nine Arch Bridge, and exclusive eco-lodges make Ella the crown jewel of the high country.', image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200', views: 2980, likes: 365, shares: 84 },
  { id: 3, title: '10 Hidden Beaches You Must Visit in Sri Lanka', category: 'Beaches', readTime: '7 min read', author: 'Elena Cruz', date: 'Oct 09, 2026', excerpt: 'Escape the popular southern coast and discover secluded golden sands where luxury villas and pristine waters await.', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200', views: 2650, likes: 290, shares: 62 },
  { id: 4, title: 'The Scenic Train Journey from Kandy to Ella', category: 'Trains', readTime: '5 min read', author: 'Marcus Wei', date: 'Oct 07, 2026', excerpt: 'Experience the world\'s most beautiful train ride. Tips for securing first-class observation tickets and capturing the best photos.', image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1200', views: 2410, likes: 275, shares: 55 },
  { id: 5, title: 'Yala National Park Safari Guide', category: 'Wildlife', readTime: '10 min read', author: 'David Hunter', date: 'Oct 05, 2026', excerpt: 'Track leopards in their natural habitat while staying in ultra-luxury tented camps that blend wilderness with five-star comfort.', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=1200', views: 2190, likes: 240, shares: 48 },
  { id: 6, title: 'Luxury Hotels in Sri Lanka Worth Every Dollar', category: 'Luxury Escapes', readTime: '12 min read', author: 'Sophie Laurent', date: 'Sep 28, 2026', excerpt: 'An exclusive curation of Aman resorts, boutique colonial manors, and contemporary wellness retreats across the island.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200', views: 1950, likes: 210, shares: 42 },
  { id: 7, title: 'Tea Plantation Experiences in Nuwara Eliya', category: 'Hill Country', readTime: '6 min read', author: 'James Sterling', date: 'Sep 22, 2026', excerpt: 'Step back in time to "Little England." Experience high tea, private tasting tours, and stays in meticulously restored planter bungalows.', image: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&q=80&w=1200', views: 1780, likes: 185, shares: 36 },
  { id: 8, title: 'Best Waterfalls in Sri Lanka', category: 'Eco Tourism', readTime: '8 min read', author: 'Maya Lin', date: 'Sep 18, 2026', excerpt: 'From Bambarakanda to Diyaluma. Discover the island\'s majestic cascading falls and the best times to visit for swimming.', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200', views: 1620, likes: 160, shares: 31 },
  { id: 9, title: 'A Complete Guide to Galle Fort', category: 'Heritage', readTime: '7 min read', author: 'Arthur Penn', date: 'Sep 15, 2026', excerpt: 'Wander cobbled streets lined with Dutch-colonial buildings, chic boutiques, and world-class seafood restaurants.', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200', views: 1480, likes: 145, shares: 29 },
  { id: 10, title: 'The Best Time to Visit Sri Lanka', category: 'Travel Tips', readTime: '4 min read', author: 'Elena Cruz', date: 'Sep 12, 2026', excerpt: 'Navigate the island\'s two monsoon seasons. A month-by-month breakdown to help you plan the perfect tropical getaway.', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200', views: 1350, likes: 130, shares: 25 },
  { id: 11, title: 'Top Romantic Honeymoon Destinations', category: 'Luxury Escapes', readTime: '9 min read', author: 'Sophie Laurent', date: 'Sep 08, 2026', excerpt: 'From secluded private pool villas in Tangalle to misty romantic hideaways in the central highlands.', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200', views: 1210, likes: 115, shares: 22 },
  { id: 12, title: 'Luxury Wellness Retreats in Sri Lanka', category: 'Eco Tourism', readTime: '11 min read', author: 'Isabella Rossi', date: 'Sep 05, 2026', excerpt: 'Rejuvenate your mind, body, and soul with authentic Ayurvedic treatments in the world\'s most serene natural settings.', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=1200', views: 1050, likes: 98, shares: 18 }
];

import { loadLocalData, saveLocalData } from './index.ts';

export function getBlogsData() {
  const data = loadLocalData();
  let modified = false;
  if (!data.blogs || data.blogs.length === 0) {
    data.blogs = DEFAULT_BLOG_ARTICLES;
    modified = true;
  } else {
    // Backfill views/likes/shares if missing on existing articles
    data.blogs = data.blogs.map((b: any, idx: number) => {
      const views = typeof b.views === 'number' ? b.views : Math.max(500, 3000 - idx * 180);
      const likes = typeof b.likes === 'number' ? b.likes : Math.floor(views * 0.12);
      const shares = typeof b.shares === 'number' ? b.shares : Math.floor(views * 0.03);
      if (b.views === undefined || b.likes === undefined || b.shares === undefined) {
        modified = true;
        return { ...b, views, likes, shares };
      }
      return b;
    });
  }
  if (!data.blogCategories || data.blogCategories.length === 0) {
    data.blogCategories = DEFAULT_BLOG_CATEGORIES;
    modified = true;
  }
  if (modified) {
    saveLocalData(data);
  }
  return {
    articles: data.blogs,
    categories: data.blogCategories
  };
}

export function saveBlogArticle(articleData: any) {
  const data = loadLocalData();
  if (!data.blogs) data.blogs = [...DEFAULT_BLOG_ARTICLES];
  
  if (articleData.id) {
    const idx = data.blogs.findIndex((b: any) => String(b.id) === String(articleData.id));
    if (idx !== -1) {
      data.blogs[idx] = { 
        views: 0,
        likes: 0,
        shares: 0,
        ...data.blogs[idx], 
        ...articleData 
      };
    } else {
      data.blogs.unshift({
        views: 0,
        likes: 0,
        shares: 0,
        ...articleData
      });
    }
  } else {
    const maxId = data.blogs.reduce((max: number, b: any) => Math.max(max, Number(b.id) || 0), 0);
    const newArticle = { 
      views: 0,
      likes: 0,
      shares: 0,
      ...articleData, 
      id: maxId + 1 
    };
    data.blogs.unshift(newArticle);
  }
  saveLocalData(data);
  return data.blogs;
}

export function deleteBlogArticle(id: number | string) {
  const data = loadLocalData();
  if (!data.blogs) data.blogs = [...DEFAULT_BLOG_ARTICLES];
  data.blogs = data.blogs.filter((b: any) => String(b.id) !== String(id));
  saveLocalData(data);
  return data.blogs;
}

export function incrementBlogView(id: number | string) {
  const data = loadLocalData();
  if (!data.blogs) getBlogsData();
  const currentBlogs = loadLocalData().blogs || [];
  const idx = currentBlogs.findIndex((b: any) => String(b.id) === String(id));
  if (idx !== -1) {
    currentBlogs[idx].views = (currentBlogs[idx].views || 0) + 1;
    const allData = loadLocalData();
    allData.blogs = currentBlogs;
    saveLocalData(allData);
  }
  return currentBlogs;
}

export function incrementBlogLike(id: number | string) {
  const data = loadLocalData();
  if (!data.blogs) getBlogsData();
  const currentBlogs = loadLocalData().blogs || [];
  const idx = currentBlogs.findIndex((b: any) => String(b.id) === String(id));
  if (idx !== -1) {
    currentBlogs[idx].likes = (currentBlogs[idx].likes || 0) + 1;
    const allData = loadLocalData();
    allData.blogs = currentBlogs;
    saveLocalData(allData);
  }
  return currentBlogs;
}

export function getBlogPerformanceStats() {
  const { articles, categories } = getBlogsData();
  let totalViews = 0;
  let totalLikes = 0;
  let totalShares = 0;

  articles.forEach((a: any) => {
    totalViews += a.views || 0;
    totalLikes += a.likes || 0;
    totalShares += a.shares || 0;
  });

  const totalEngagements = totalLikes + totalShares;
  const avgEngagementRate = totalViews > 0 ? ((totalEngagements / totalViews) * 100).toFixed(1) : '0.0';

  const topArticles = [...articles]
    .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const categoryMap: Record<string, { name: string; count: number; views: number; likes: number }> = {};
  articles.forEach((a: any) => {
    const cat = a.category || 'General';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { name: cat, count: 0, views: 0, likes: 0 };
    }
    categoryMap[cat].count += 1;
    categoryMap[cat].views += a.views || 0;
    categoryMap[cat].likes += a.likes || 0;
  });

  const categoryStats = Object.values(categoryMap).sort((a, b) => b.views - a.views);

  return {
    totalArticles: articles.length,
    totalViews,
    totalLikes,
    totalShares,
    totalEngagements,
    avgEngagementRate: `${avgEngagementRate}%`,
    topArticles,
    categoryStats,
    categoriesCount: categories.length
  };
}

export function updateBlogCategoryImage(catId: string, image: string) {
  const data = loadLocalData();
  if (!data.blogCategories) data.blogCategories = [...DEFAULT_BLOG_CATEGORIES];
  const idx = data.blogCategories.findIndex((c: any) => c.id === catId);
  if (idx !== -1) {
    data.blogCategories[idx].image = image;
  } else {
    data.blogCategories.push({ id: catId, name: catId, image });
  }
  saveLocalData(data);
  return data.blogCategories;
}
