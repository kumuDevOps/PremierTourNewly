export interface User {
  id: number;
  uid: string;
  email: string;
  createdAt?: string;
}

export interface TravelPackage {
  id: number;
  title: string;
  imageUrl: string;
  location: string;
  price: number;
  nights: number;
  category: string;
}

export interface Tour {
  id: number;
  tourId?: number;
  title: string;
  description: string;
  imageUrl: string;
  galleryImages?: string; // JSON array or comma separated string of image URLs
  duration: string;
  price: number;
  itinerary?: string; // JSON string representation
  category: string;
  location?: string;
  nights?: number;
  days?: number;
  rating?: number;
  reviewsCount?: number;
  highlights?: string[];
}

export interface Flight {
  id: number;
  airline: string;
  flightNumber?: string;
  fromCity: string;
  fromCode?: string;
  toCity: string;
  toCode?: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  stops: number;
}

export interface Car {
  id: number;
  name: string;
  category: string;
  seats: number;
  transmission: string;
  pricePerDay: number;
  imageUrl: string;
  description?: string;
  features?: string[];
}

export interface Booking {
  id: number;
  userName: string;
  email: string;
  phone: string;
  packageId?: number | null;
  tourId?: number | null;
  travelDate: string;
  guests: number;
  status: string;
  createdAt?: string;
}

export interface FlightBooking {
  id: number;
  flightId: number;
  passengerName: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export interface CarBooking {
  id: number;
  carId: number;
  customerName: string;
  pickupDate: string;
  returnDate: string;
  createdAt?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  starRating?: number;
  description?: string;
  amenities?: string; // stored as comma-separated or parsed to array
  imageUrl?: string;
  createdAt?: string;
}

export interface HotelBooking {
  id: string;
  hotelId: string;
  userId: string;
  userName: string;
  userEmail: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  desc: string;
  shortDesc?: string;
}
