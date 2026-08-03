import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { loadLocalData, saveLocalData } from './index.ts';
import { connectMongoDB, MongoUser } from './mongodb.ts';

export type UserRole = 'customer' | 'admin' | 'hotel_manager' | 'car_manager' | 'flight_manager' | 'tour_manager' | 'vip';

export interface UserRecord {
  id: string; // UUID
  first_name: string;
  last_name: string;
  username?: string;
  email: string;
  phone: string;
  password_hash: string;
  role: UserRole;
  status: 'active' | 'pending' | 'suspended';
  email_verified: boolean;
  profile_image: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  login_attempts: number;
  lockout_until?: string;
  verification_token?: string;
  verification_token_expires?: string;
  reset_token?: string;
  reset_token_expires?: string;
}

export interface LoginLogRecord {
  id: string;
  user_id: string;
  email: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  status: 'success' | 'failed' | 'locked';
}

// Generate random UUID helper
export function generateUUID(): string {
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return 'usr_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
}

// ----------------------------------------------------
// USER REPOSITORY OPERATIONS
// ----------------------------------------------------

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const cleanEmail = email.trim().toLowerCase();
  
  // Try Mongo first if connected
  const isMongo = await connectMongoDB();
  if (isMongo) {
    try {
      const doc = await MongoUser.findOne({ email: cleanEmail });
      if (doc) {
        return mapMongoToRecord(doc);
      }
    } catch (err) {
      console.warn('MongoDB email lookup error, falling back to local DB:', err);
    }
  }

  // Local persistent DB engine
  const localData = loadLocalData();
  const userList: UserRecord[] = localData.users || [];
  const found = userList.find(u => u.email && u.email.toLowerCase() === cleanEmail);
  return found || null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const isMongo = await connectMongoDB();
  if (isMongo) {
    try {
      const doc = await MongoUser.findOne({ uid: id });
      if (doc) {
        return mapMongoToRecord(doc);
      }
    } catch (err) {
      // Fallback
    }
  }

  const localData = loadLocalData();
  const userList: UserRecord[] = localData.users || [];
  const found = userList.find(u => u.id === id || (u as any).uid === id);
  return found || null;
}

export async function findUserByUsername(username: string): Promise<UserRecord | null> {
  if (!username) return null;
  const cleanUser = username.trim().toLowerCase();

  const localData = loadLocalData();
  const userList: UserRecord[] = localData.users || [];
  const found = userList.find(u => u.username && u.username.toLowerCase() === cleanUser);
  return found || null;
}

export async function createUser(data: {
  first_name: string;
  last_name: string;
  username?: string;
  email: string;
  phone: string;
  password_hash: string;
  role?: UserRole;
  status?: 'active' | 'pending' | 'suspended';
  email_verified?: boolean;
  profile_image?: string;
  verification_token?: string;
  verification_token_expires?: string;
}): Promise<UserRecord> {
  const cleanEmail = data.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const id = generateUUID();

  // Admin auto-assignment for admin@gmail.com
  const role: UserRole = cleanEmail === 'admin@gmail.com' ? 'admin' : (data.role || 'customer');
  
  const newUser: UserRecord = {
    id,
    first_name: data.first_name.trim(),
    last_name: data.last_name.trim(),
    username: data.username ? data.username.trim() : undefined,
    email: cleanEmail,
    phone: data.phone.trim(),
    password_hash: data.password_hash,
    role,
    status: data.status || 'pending',
    email_verified: data.email_verified !== undefined ? data.email_verified : (cleanEmail === 'admin@gmail.com'),
    profile_image: data.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.first_name + ' ' + data.last_name)}&background=0091EA&color=ffffff`,
    created_at: now,
    updated_at: now,
    login_attempts: 0,
    verification_token: data.verification_token,
    verification_token_expires: data.verification_token_expires,
  };

  // Save to MongoDB if available
  const isMongo = await connectMongoDB();
  if (isMongo) {
    try {
      const doc = new MongoUser({
        uid: newUser.id,
        email: newUser.email,
        password: data.password_hash,
        fullName: `${newUser.first_name} ${newUser.last_name}`,
        phone: newUser.phone,
        role: newUser.role,
        avatarUrl: newUser.profile_image,
      });
      await doc.save();
    } catch (err) {
      console.warn('MongoDB create user sync error:', err);
    }
  }

  // Save to persistent local JSON engine
  const localData = loadLocalData();
  if (!localData.users) localData.users = [];
  localData.users.push(newUser);
  saveLocalData(localData);

  return newUser;
}

export async function updateUserRecord(id: string, updates: Partial<UserRecord>): Promise<UserRecord | null> {
  const now = new Date().toISOString();
  const localData = loadLocalData();
  const userList: UserRecord[] = localData.users || [];
  const index = userList.findIndex(u => u.id === id || (u as any).uid === id);

  if (index === -1) {
    return null;
  }

  const updatedUser: UserRecord = {
    ...userList[index],
    ...updates,
    updated_at: now
  };

  userList[index] = updatedUser;
  localData.users = userList;
  saveLocalData(localData);

  // Sync Mongo if connected
  const isMongo = await connectMongoDB();
  if (isMongo) {
    try {
      const mongoUpdates: any = {};
      if (updates.first_name || updates.last_name) {
        mongoUpdates.fullName = `${updatedUser.first_name} ${updatedUser.last_name}`;
      }
      if (updates.phone) mongoUpdates.phone = updates.phone;
      if (updates.role) mongoUpdates.role = updates.role;
      if (updates.profile_image) mongoUpdates.avatarUrl = updates.profile_image;
      if (updates.password_hash) mongoUpdates.password = updates.password_hash;
      await MongoUser.updateOne({ uid: id }, { $set: mongoUpdates });
    } catch (err) {
      console.warn('MongoDB update sync error:', err);
    }
  }

  return updatedUser;
}

export async function incrementFailedLoginAttempts(user: UserRecord): Promise<{ attempts: number; isLocked: boolean; lockoutUntil?: string }> {
  const attempts = (user.login_attempts || 0) + 1;
  let lockout_until: string | undefined = user.lockout_until;

  if (attempts >= 5) {
    // Lock account for 15 minutes
    const lockoutDate = new Date(Date.now() + 15 * 60 * 1000);
    lockout_until = lockoutDate.toISOString();
  }

  await updateUserRecord(user.id, {
    login_attempts: attempts,
    lockout_until: lockout_until
  });

  return {
    attempts,
    isLocked: attempts >= 5,
    lockoutUntil: lockout_until
  };
}

export async function resetLoginAttemptsAndRecordLogin(userId: string): Promise<void> {
  const now = new Date().toISOString();
  await updateUserRecord(userId, {
    login_attempts: 0,
    lockout_until: undefined,
    last_login: now
  });
}

export async function isUserLockedOut(user: UserRecord): Promise<{ locked: boolean; minutesRemaining?: number }> {
  if (user.login_attempts < 5 || !user.lockout_until) {
    return { locked: false };
  }

  const lockoutTime = new Date(user.lockout_until).getTime();
  const now = Date.now();

  if (now < lockoutTime) {
    const minutesRemaining = Math.ceil((lockoutTime - now) / (60 * 1000));
    return { locked: true, minutesRemaining };
  }

  // Lockout expired, auto-reset attempts
  await updateUserRecord(user.id, {
    login_attempts: 0,
    lockout_until: undefined
  });

  return { locked: false };
}

// ----------------------------------------------------
// LOGIN HISTORY LOGS
// ----------------------------------------------------

export async function recordLoginLogEntry(log: {
  user_id: string;
  email: string;
  ip_address: string;
  user_agent: string;
  status: 'success' | 'failed' | 'locked';
}): Promise<LoginLogRecord> {
  const id = generateUUID();
  const newLog: LoginLogRecord = {
    id,
    user_id: log.user_id,
    email: log.email,
    ip_address: log.ip_address || '127.0.0.1',
    user_agent: log.user_agent || 'Unknown Device',
    timestamp: new Date().toISOString(),
    status: log.status
  };

  const localData = loadLocalData();
  if (!localData.loginLogs) localData.loginLogs = [];
  localData.loginLogs.unshift(newLog);
  // Keep last 500 logs
  if (localData.loginLogs.length > 500) {
    localData.loginLogs = localData.loginLogs.slice(0, 500);
  }
  saveLocalData(localData);

  return newLog;
}

export async function getLoginLogs(limit = 100): Promise<LoginLogRecord[]> {
  const localData = loadLocalData();
  const logs: LoginLogRecord[] = localData.loginLogs || [];
  return logs.slice(0, limit);
}

// ----------------------------------------------------
// ADMIN USERS MANAGEMENT
// ----------------------------------------------------

export async function getAllUsers(): Promise<UserRecord[]> {
  const localData = loadLocalData();
  const users: UserRecord[] = localData.users || [];
  return users;
}

export async function deleteUserRecord(id: string): Promise<boolean> {
  const localData = loadLocalData();
  const userList: UserRecord[] = localData.users || [];
  const index = userList.findIndex(u => u.id === id || (u as any).uid === id);

  if (index === -1) {
    return false;
  }

  userList.splice(index, 1);
  localData.users = userList;
  saveLocalData(localData);

  const isMongo = await connectMongoDB();
  if (isMongo) {
    try {
      await MongoUser.deleteOne({ uid: id });
    } catch (err) {
      console.warn('MongoDB delete sync error:', err);
    }
  }

  return true;
}

// Sanitize user object (never return password_hash)
export function sanitizeUser(user: UserRecord) {
  const { password_hash, verification_token, reset_token, ...safeUser } = user;
  return safeUser;
}

// Helper Mongo Mapper
function mapMongoToRecord(doc: any): UserRecord {
  const fullName = doc.fullName || '';
  const parts = fullName.split(' ');
  const first_name = parts[0] || 'User';
  const last_name = parts.slice(1).join(' ') || '';

  return {
    id: doc.uid || doc._id.toString(),
    first_name,
    last_name,
    email: doc.email,
    phone: doc.phone || '',
    password_hash: doc.password || '',
    role: doc.role || 'customer',
    status: 'active',
    email_verified: true,
    profile_image: doc.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`,
    created_at: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    updated_at: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
    login_attempts: 0
  };
}
