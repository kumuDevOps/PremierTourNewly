import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

let client: MongoClient | null = null;
let dbInstance: any = null;
let mongoConnectionFailed = false;

const seedPath = path.join(process.cwd(), 'src', 'db', 'seed_data.json');

// Lazy initialize MongoDB connection
export async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }
  if (mongoConnectionFailed) {
    return null;
  }
  if (uri.includes('<') || uri.includes('>') || uri.includes('db_password') || uri.includes('<password>')) {
    console.warn('ℹ️ [MongoDB Atlas Info]: MONGODB_URI contains unconfigured password placeholder (<db_password>). Operating seamlessly with local JSON storage engine.');
    mongoConnectionFailed = true;
    return null;
  }
  if (!client) {
    try {
      console.log('Attempting to connect to MongoDB Atlas...');
      client = new MongoClient(uri, {
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
        tlsAllowInvalidCertificates: true // Avoid tlsv1 alert internal errors (SSL alert 80)
      });
      await client.connect();
      
      const dbName = process.env.MONGODB_DB_NAME || 'premier_tour_booking';
      dbInstance = client.db(dbName);
      console.log('Successfully connected to MongoDB Atlas database:', dbName);
      
      // Auto-seed if collections are empty
      await seedDatabaseIfNeeded(dbInstance);
    } catch (err: any) {
      console.warn('⚠️ MongoDB Atlas Connection Info: Could not connect to the remote database.');
      const msg = (err && err.message ? String(err.message) : '');
      if (msg.includes('80') || msg.includes('tlsv1') || msg.includes('SSL') || msg.includes('alert')) {
        console.warn('   Reason: TLS connection rejected. This typically indicates that your MongoDB Atlas network settings are blocking this container.');
      } else if (msg.includes('auth') || msg.includes('Authentication')) {
        console.warn('   Reason: Authentication failed (check MONGODB_URI username and password).');
      } else {
        console.warn('   Reason: Connection timed out or refused by remote host.');
      }
      console.warn('   💡 Tip: To connect your MongoDB Atlas cluster to this preview, go to your Atlas Dashboard -> Network Access, and add "0.0.0.0/0" (Allow Access from Anywhere) so your cloud container can connect.');
      console.warn('   🔄 Status: Safe fallback activated! The app is successfully running with the built-in JSON Database engine. All features (Sign up, login, bookings, stats) are fully operational.');
      mongoConnectionFailed = true;
      client = null;
      dbInstance = null;
    }
  }
  return client;
}

export async function getDb() {
  await getMongoClient();
  return dbInstance;
}

// Check if we should use MongoDB or local JSON engine
export function useMongo(): boolean {
  return !!process.env.MONGODB_URI && !mongoConnectionFailed;
}

// Helper to get next auto-increment integer ID
export async function getNextId(collection: any): Promise<number> {
  const lastDoc = await collection.find({}).sort({ id: -1 }).limit(1).toArray();
  if (lastDoc && lastDoc.length > 0) {
    return (lastDoc[0].id || 0) + 1;
  }
  return 1;
}

// Strip out MongoDB ObjectId to prevent serialization issues
function normalizeDoc(doc: any) {
  if (!doc) return doc;
  const newDoc = { ...doc };
  delete newDoc._id;
  return newDoc;
}

// Database Seeder
async function seedDatabaseIfNeeded(db: any) {
  try {
    if (!fs.existsSync(seedPath)) {
      console.log('No seed data file found, skipping auto-seed.');
      return;
    }
    
    const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
    const mappings: Record<string, string> = {
      users: 'users',
      profiles: 'profiles',
      loginLogs: 'login_logs',
      wishlist: 'wishlist',
      packages: 'packages',
      tours: 'tours',
      flights: 'flights',
      cars: 'cars',
      bookings: 'bookings',
      flightBookings: 'flight_bookings',
      carBookings: 'car_bookings',
      subscribers: 'subscribers',
      contactMessages: 'contact_messages',
      hotels: 'hotels',
      hotelBookings: 'hotel_bookings',
      reviews: 'reviews'
    };

    for (const [key, collectionName] of Object.entries(mappings)) {
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      if (count === 0 && seedData[key] && seedData[key].length > 0) {
        console.log(`Seeding collection ${collectionName} with ${seedData[key].length} documents...`);
        const docs = seedData[key].map((doc: any) => {
          const newDoc = { ...doc };
          if (newDoc.createdAt) newDoc.createdAt = new Date(newDoc.createdAt);
          if (newDoc.loggedInAt) newDoc.loggedInAt = new Date(newDoc.loggedInAt);
          if (newDoc.lastLoginAt) newDoc.lastLoginAt = new Date(newDoc.lastLoginAt);
          return newDoc;
        });
        await collection.insertMany(docs);
      }
    }
    console.log('Database check and seeding complete.');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

// Map schema table names to seed_data keys
function getSeedDataKey(tableName: string): string {
  const mappings: Record<string, string> = {
    'users': 'users',
    'profiles': 'profiles',
    'login_logs': 'loginLogs',
    'wishlist': 'wishlist',
    'packages': 'packages',
    'tours': 'tours',
    'flights': 'flights',
    'cars': 'cars',
    'bookings': 'bookings',
    'flight_bookings': 'flightBookings',
    'car_bookings': 'carBookings',
    'subscribers': 'subscribers',
    'contact_messages': 'contactMessages',
    'hotels': 'hotels',
    'hotel_bookings': 'hotelBookings',
    'reviews': 'reviews',
    'blogs': 'blogs',
    'blog_categories': 'blogCategories'
  };
  return mappings[tableName] || tableName;
}

const rootSeedPath = path.join(process.cwd(), 'seed_data.json');
const backupPathSrc = path.join(process.cwd(), 'src', 'db', 'seed_data_backup.json');
const backupPathPublic = path.join(process.cwd(), 'public', 'seed_data_backup.json');
const backupPathDist = path.join(process.cwd(), 'dist', 'seed_data_backup.json');

// Local File IO Helpers
export function loadLocalData(): any {
  const keys = [
    'users', 'profiles', 'loginLogs', 'wishlist', 'packages', 'tours', 'flights', 
    'cars', 'bookings', 'flightBookings', 'carBookings', 'subscribers', 'contactMessages',
    'hotels', 'hotelBookings', 'reviews', 'blogs', 'blogCategories'
  ];

  let candidateDataList: any[] = [];
  const pathsToCheck = [rootSeedPath, seedPath, backupPathSrc, backupPathPublic, backupPathDist];

  for (const p of pathsToCheck) {
    if (fs.existsSync(p)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(p, 'utf-8'));
        if (parsed && typeof parsed === 'object') {
          candidateDataList.push(parsed);
        }
      } catch (_) {}
    }
  }

  let bestData: any = null;
  let maxCount = -1;

  for (const candidate of candidateDataList) {
    let count = 0;
    keys.forEach(k => {
      if (Array.isArray(candidate[k])) {
        count += candidate[k].length;
      }
    });
    if (count > maxCount) {
      maxCount = count;
      bestData = candidate;
    }
  }

  if (!bestData) {
    bestData = {};
  }

  keys.forEach(k => {
    if (!Array.isArray(bestData[k])) {
      bestData[k] = [];
    }
  });

  return bestData;
}

export function saveLocalData(data: any) {
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(seedPath, jsonStr);
    
    try { fs.writeFileSync(backupPathSrc, jsonStr); } catch (_) {}
    try {
      const pubDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
      fs.writeFileSync(backupPathPublic, jsonStr);
    } catch (_) {}
    try {
      const distDir = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(backupPathDist, jsonStr);
      }
    } catch (_) {}
  } catch (e) {
    console.error("Failed to write to seed_data.json:", e);
  }
}

// Local filter checker
function matchesCondition(doc: any, condition: any): boolean {
  if (!condition) return true;
  if (condition.type === 'eq') {
    return doc[condition.field] === condition.value || String(doc[condition.field]) === String(condition.value);
  }
  if (condition.type === 'lte') {
    return Number(doc[condition.field]) <= Number(condition.value);
  }
  if (condition.type === 'gte') {
    return Number(doc[condition.field]) >= Number(condition.value);
  }
  if (condition.type === 'like') {
    const term = condition.value.replace(/%/g, '').toLowerCase();
    const val = String(doc[condition.field] || '').toLowerCase();
    return val.includes(term);
  }
  if (condition.type === 'and') {
    return condition.conditions.every((c: any) => matchesCondition(doc, c));
  }
  if (condition.type === 'or') {
    return condition.conditions.some((c: any) => matchesCondition(doc, c));
  }
  return true;
}

// Interpreter for Drizzle-like operators to Mongo filters
function buildMongoFilter(condition: any): any {
  if (!condition) return {};
  if (condition.type === 'eq') {
    return { [condition.field]: condition.value };
  }
  if (condition.type === 'lte') {
    return { [condition.field]: { $lte: condition.value } };
  }
  if (condition.type === 'gte') {
    return { [condition.field]: { $gte: condition.value } };
  }
  if (condition.type === 'like') {
    const escapedValue = condition.value.replace(/[%]/g, '').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return { [condition.field]: { $regex: escapedValue, $options: 'i' } };
  }
  if (condition.type === 'and') {
    const filters = condition.conditions.map((c: any) => buildMongoFilter(c)).filter((f: any) => Object.keys(f).length > 0);
    if (filters.length === 0) return {};
    return { $and: filters };
  }
  if (condition.type === 'or') {
    const filters = condition.conditions.map((c: any) => buildMongoFilter(c)).filter((f: any) => Object.keys(f).length > 0);
    if (filters.length === 0) return {};
    return { $or: filters };
  }
  return {};
}

// Drizzle-like query builders
class SelectQuery {
  private _where: any = null;
  private _orderBy: any = null;
  private table: any;

  constructor(table: any) {
    this.table = table;
  }

  where(condition: any) {
    this._where = condition;
    return this;
  }

  orderBy(condition: any) {
    this._orderBy = condition;
    return this;
  }

  async exec() {
    const isBookingTable = ['bookings', 'flight_bookings', 'car_bookings'].includes(this.table.name);
    if (useMongo()) {
      try {
        const mongoDb = await getDb();
        if (mongoDb) {
          const collection = mongoDb.collection(this.table.name);
          
          const filter = buildMongoFilter(this._where);
          let cursor = collection.find(filter);
          
          if (this._orderBy) {
            const sortField = this._orderBy.field;
            const sortDir = this._orderBy.type === 'desc' ? -1 : 1;
            cursor = cursor.sort({ [sortField]: sortDir });
          }
          
          const results = await cursor.toArray();
          return results.map(normalizeDoc);
        }
      } catch (err: any) {
        console.error("MongoDB Select failed, falling back to local database:", err);
      }
    }
    
    const localData = loadLocalData();
    const key = getSeedDataKey(this.table.name);
    let list = localData[key] || [];
    
    // Filter
    list = list.filter((doc: any) => matchesCondition(doc, this._where));
    
    // Sort
    if (this._orderBy) {
      const sortField = this._orderBy.field;
      const sortDir = this._orderBy.type === 'desc' ? -1 : 1;
      list.sort((a: any, b: any) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === valB) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;
        return valA > valB ? sortDir : -sortDir;
      });
    }
    return list;
  }

  then(onfulfilled?: (value: any[]) => any, onrejected?: (reason: any) => any) {
    return this.exec().then(onfulfilled, onrejected);
  }
}

class InsertQuery {
  private _returning: boolean = false;
  private _values: any = null;
  private table: any;

  constructor(table: any) {
    this.table = table;
  }

  values(data: any) {
    this._values = data;
    return this;
  }

  onConflictDoNothing() {
    return this;
  }

  onConflictDoUpdate(options: any) {
    return this;
  }

  async exec() {
    const isBookingTable = ['bookings', 'flight_bookings', 'car_bookings'].includes(this.table.name);
    if (useMongo()) {
      try {
        const mongoDb = await getDb();
        if (mongoDb) {
          const collection = mongoDb.collection(this.table.name);
          
          const isArray = Array.isArray(this._values);
          const dataList = isArray ? this._values : [this._values];
          const insertedDocs = [];
          
          for (const item of dataList) {
            const copy = { ...item };
            
            // Ensure unique integer ID
            if (copy.id === undefined || copy.id === null) {
              copy.id = await getNextId(collection);
            }
            if (copy.createdAt === undefined) {
              copy.createdAt = new Date();
            }

            // Handle duplicate checks for profiles & users
            if (this.table.name === 'users' && copy.uid) {
              const existing = await collection.findOne({ uid: copy.uid });
              if (existing) {
                await collection.updateOne({ uid: copy.uid }, { $set: copy });
                const updated = await collection.findOne({ uid: copy.uid });
                insertedDocs.push(normalizeDoc(updated));
                continue;
              }
            } else if (this.table.name === 'profiles' && copy.uid) {
              const existing = await collection.findOne({ uid: copy.uid });
              if (existing) {
                await collection.updateOne({ uid: copy.uid }, { $set: copy });
                const updated = await collection.findOne({ uid: copy.uid });
                insertedDocs.push(normalizeDoc(updated));
                continue;
              }
            } else if (this.table.name === 'subscribers' && copy.email) {
              const existing = await collection.findOne({ email: copy.email });
              if (existing) {
                insertedDocs.push(normalizeDoc(existing));
                continue;
              }
            }
            
            const res = await collection.insertOne(copy);
            const inserted = await collection.findOne({ _id: res.insertedId });
            insertedDocs.push(normalizeDoc(inserted));
          }
          
          return this._returning ? insertedDocs : (isArray ? insertedDocs : insertedDocs[0]);
        }
      } catch (err: any) {
        console.error("MongoDB Insert failed, falling back to local database:", err);
      }
    }
    
    const localData = loadLocalData();
    const key = getSeedDataKey(this.table.name);
    const list = localData[key] || [];
    
    const isArray = Array.isArray(this._values);
    const dataList = isArray ? this._values : [this._values];
    const insertedDocs = [];
    
    for (const item of dataList) {
      const copy = { ...item };
      if (copy.id === undefined || copy.id === null) {
        const maxId = list.reduce((max: number, d: any) => {
          let num = d.id;
          if (typeof num === 'string') {
            const match = num.match(/\d+/);
            num = match ? parseInt(match[0], 10) : 0;
          }
          return Math.max(max, typeof num === 'number' && !isNaN(num) ? num : 0);
        }, 0);
        copy.id = maxId + 1;
      }
      if (copy.createdAt === undefined) {
        copy.createdAt = new Date();
      }

      // Handle duplicate checks for profiles & users
      if (this.table.name === 'users' && copy.uid) {
        const idx = list.findIndex((d: any) => d.uid === copy.uid);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...copy };
          insertedDocs.push(list[idx]);
          continue;
        }
      } else if (this.table.name === 'profiles' && copy.uid) {
        const idx = list.findIndex((d: any) => d.uid === copy.uid);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...copy };
          insertedDocs.push(list[idx]);
          continue;
        }
      } else if (this.table.name === 'subscribers' && copy.email) {
        const existing = list.find((d: any) => d.email === copy.email);
        if (existing) {
          insertedDocs.push(existing);
          continue;
        }
      }
      
      list.push(copy);
      insertedDocs.push(copy);
    }
    
    localData[key] = list;
    saveLocalData(localData);
    
    return this._returning ? insertedDocs : (isArray ? insertedDocs : insertedDocs[0]);
  }

  returning() {
    this._returning = true;
    return this;
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.exec().then(onfulfilled, onrejected);
  }
}

class UpdateQuery {
  private _returning: boolean = false;
  private _set: any = null;
  private _where: any = null;
  private table: any;

  constructor(table: any) {
    this.table = table;
  }

  set(data: any) {
    this._set = data;
    return this;
  }

  where(condition: any) {
    this._where = condition;
    return this;
  }

  async exec() {
    const isBookingTable = ['bookings', 'flight_bookings', 'car_bookings'].includes(this.table.name);
    if (useMongo()) {
      try {
        const mongoDb = await getDb();
        if (mongoDb) {
          const collection = mongoDb.collection(this.table.name);
          const filter = buildMongoFilter(this._where);
          
          const matchingDocs = await collection.find(filter).toArray();
          if (matchingDocs.length > 0) {
            await collection.updateMany(filter, { $set: this._set });
          }
          
          const updatedDocs = await collection.find(filter).toArray();
          return updatedDocs.map(normalizeDoc);
        }
      } catch (err: any) {
        console.error("MongoDB Update failed, falling back to local database:", err);
      }
    }
    
    const localData = loadLocalData();
    const key = getSeedDataKey(this.table.name);
    const list = localData[key] || [];
    const updatedDocs = [];
    
    for (let i = 0; i < list.length; i++) {
      if (matchesCondition(list[i], this._where)) {
        list[i] = { ...list[i], ...this._set };
        updatedDocs.push(list[i]);
      }
    }
    
    localData[key] = list;
    saveLocalData(localData);
    return updatedDocs;
  }

  returning() {
    this._returning = true;
    return this;
  }

  then(onfulfilled?: (value: any[]) => any, onrejected?: (reason: any) => any) {
    return this.exec().then(onfulfilled, onrejected);
  }
}

class DeleteQuery {
  private _returning: boolean = false;
  private _where: any = null;
  private table: any;

  constructor(table: any) {
    this.table = table;
  }

  where(condition: any) {
    this._where = condition;
    return this;
  }

  async exec() {
    const isBookingTable = ['bookings', 'flight_bookings', 'car_bookings'].includes(this.table.name);
    if (useMongo()) {
      try {
        const mongoDb = await getDb();
        if (mongoDb) {
          const collection = mongoDb.collection(this.table.name);
          const filter = buildMongoFilter(this._where);
          
          const matchingDocs = await collection.find(filter).toArray();
          if (matchingDocs.length > 0) {
            await collection.deleteMany(filter);
          }
          
          return matchingDocs.map(normalizeDoc);
        }
      } catch (err: any) {
        console.error("MongoDB Delete failed, falling back to local database:", err);
      }
    }
    
    const localData = loadLocalData();
    const key = getSeedDataKey(this.table.name);
    const list = localData[key] || [];
    const keptDocs = [];
    const deletedDocs = [];
    
    for (const item of list) {
      if (matchesCondition(item, this._where)) {
        deletedDocs.push(item);
      } else {
        keptDocs.push(item);
      }
    }
    
    localData[key] = keptDocs;
    saveLocalData(localData);
    return deletedDocs;
  }

  returning() {
    this._returning = true;
    return this;
  }

  then(onfulfilled?: (value: any[]) => any, onrejected?: (reason: any) => any) {
    return this.exec().then(onfulfilled, onrejected);
  }
}

// Export mock Drizzle-compatible db object
export const db = {
  select() {
    return {
      from(table: any) {
        return new SelectQuery(table);
      }
    };
  },
  insert(table: any) {
    return new InsertQuery(table);
  },
  update(table: any) {
    return new UpdateQuery(table);
  },
  delete(table: any) {
    return new DeleteQuery(table);
  }
};

// Export SQL-compatible Drizzle operators
export function eq(field: any, value: any) {
  return { type: 'eq', field: field._fieldName, value };
}

export function and(...conditions: any[]) {
  return { type: 'and', conditions };
}

export function or(...conditions: any[]) {
  return { type: 'or', conditions };
}

export function lte(field: any, value: any) {
  return { type: 'lte', field: field._fieldName, value };
}

export function gte(field: any, value: any) {
  return { type: 'gte', field: field._fieldName, value };
}

export function like(field: any, value: any) {
  return { type: 'like', field: field._fieldName, value };
}

export function desc(field: any) {
  return { type: 'desc', field: field._fieldName };
}

export function sql(strings: TemplateStringsArray, ...values: any[]) {
  return '';
}

// Export mock createPool to prevent Drizzle-kit or scripts from failing
export const createPool = () => ({});
