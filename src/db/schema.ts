class Table {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const createTable = (name: string) => {
  return new Proxy(new Table(name), {
    get(target: any, prop: string) {
      if (prop === 'name' || prop === '_tableName') return name;
      return { _tableName: name, _fieldName: prop };
    }
  });
};

export const users = createTable('users');
export const profiles = createTable('profiles');
export const loginLogs = createTable('login_logs');
export const wishlist = createTable('wishlist');
export const packages = createTable('packages');
export const tours = createTable('tours');
export const flights = createTable('flights');
export const cars = createTable('cars');
export const bookings = createTable('bookings');
export const flightBookings = createTable('flight_bookings');
export const carBookings = createTable('car_bookings');
export const subscribers = createTable('subscribers');
export const contactMessages = createTable('contact_messages');
export const hotels = createTable('hotels');
export const hotelBookings = createTable('hotel_bookings');
export const reviews = createTable('reviews');
export const blogs = createTable('blogs');
export const blogCategories = createTable('blog_categories');

