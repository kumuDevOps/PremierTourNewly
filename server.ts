import fs from "fs";
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db, loadLocalData, saveLocalData } from './src/db/index.ts';
import { eq, and, or, desc, sql } from './src/db/index.ts';
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
  hotelBookings,
  reviews
} from './src/db/schema.ts';
import {
  getOrCreateUser,
  getPackages,
  getTours,
  getTourById,
  getFlights,
  getCars,
  createBooking,
  getBookingsByEmail,
  createFlightBooking,
  createCarBooking,
  createSubscriber,
  createContactMessage,
  getProfileByUid,
  createOrUpdateProfile,
  recordLoginLog,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getAllProfilesWithStats,
  getHotels,
  createHotel,
  getBlogsData,
  saveBlogArticle,
  deleteBlogArticle,
  updateBlogCategoryImage,
  incrementBlogView,
  incrementBlogLike,
  getBlogPerformanceStats
} from './src/db/helpers.ts';
import {
  findUserByEmail,
  findUserById,
  findUserByUsername,
  createUser,
  updateUserRecord,
  incrementFailedLoginAttempts,
  resetLoginAttemptsAndRecordLogin,
  isUserLockedOut,
  recordLoginLogEntry,
  getLoginLogs,
  getAllUsers,
  deleteUserRecord,
  sanitizeUser,
  generateUUID
} from './src/db/userStore.ts';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  requireAuth,
  requireAdmin,
  AuthRequest
} from './src/middleware/auth.ts';
import bcrypt from 'bcryptjs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Direct Download Route for Hostinger Deployment ZIP
  app.get('/api/download-hostinger-zip', (req, res) => {
    try {
      const archiver = require('archiver');
      const zipPath = path.join(process.cwd(), 'Premier-Tour-Booking-Hostinger-Deployment.zip');
      res.attachment('Premier-Tour-Booking-Hostinger-Deployment.zip');
      
      const archive = archiver('zip', { zlib: { level: 9 } });
      const fileStream = fs.createWriteStream(zipPath);

      archive.pipe(res);
      archive.pipe(fileStream);

      const rootFiles = [
        '.env',
        '.env.example',
        'Hostinger_Deployment_Guide.md',
        'package.json',
        'package-lock.json',
        'vite.config.ts',
        'tsconfig.json',
        'index.html',
        'server.ts',
        'seed_data.json'
      ];

      for (const f of rootFiles) {
        const fp = path.join(process.cwd(), f);
        if (fs.existsSync(fp)) archive.file(fp, { name: f });
      }

      if (fs.existsSync(path.join(process.cwd(), 'dist'))) archive.directory(path.join(process.cwd(), 'dist'), 'dist');
      if (fs.existsSync(path.join(process.cwd(), 'src'))) archive.directory(path.join(process.cwd(), 'src'), 'src');
      if (fs.existsSync(path.join(process.cwd(), 'public'))) archive.directory(path.join(process.cwd(), 'public'), 'public');

      archive.finalize();
    } catch (err: any) {
      res.status(500).send('Error creating zip: ' + err.message);
    }
  });

  // Endpoint to create Hostinger Deployment ZIP package
  app.get('/api/admin/create-hostinger-zip', (req, res) => {
    try {
      const archiver = require('archiver');
      const zipPath = path.join(__dirname, 'Premier-Tour-Booking-Hostinger-Deployment.zip');
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', function () {
        console.log(`✅ Success! Created Hostinger Deployment ZIP: ${zipPath}`);
        res.json({
          success: true,
          message: 'ZIP package created successfully!',
          file: 'Premier-Tour-Booking-Hostinger-Deployment.zip',
          size: `${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`,
          path: zipPath
        });
      });

      archive.on('error', function (err: any) {
        console.error('ZIP creation error:', err);
        res.status(500).json({ error: err.message });
      });

      archive.pipe(output);

      const rootFiles = [
        '.env',
        '.env.example',
        'Hostinger_Deployment_Guide.md',
        'package.json',
        'package-lock.json',
        'vite.config.ts',
        'tsconfig.json',
        'index.html',
        'server.ts',
        'seed_data.json'
      ];

      for (const file of rootFiles) {
        const fp = path.join(__dirname, file);
        if (fs.existsSync(fp)) {
          archive.file(fp, { name: file });
        }
      }

      if (fs.existsSync(path.join(__dirname, 'dist'))) {
        archive.directory(path.join(__dirname, 'dist'), 'dist');
      }
      if (fs.existsSync(path.join(__dirname, 'src'))) {
        archive.directory(path.join(__dirname, 'src'), 'src');
      }
      if (fs.existsSync(path.join(__dirname, 'public'))) {
        archive.directory(path.join(__dirname, 'public'), 'public');
      }

      archive.finalize();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });

  // Ensure uploads and locales directories exist
  const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const distUploadsDir = path.join(process.cwd(), 'dist', 'uploads');
  if (!fs.existsSync(publicUploadsDir)) fs.mkdirSync(publicUploadsDir, { recursive: true });
  if (!fs.existsSync(distUploadsDir)) fs.mkdirSync(distUploadsDir, { recursive: true });

  const publicLocalesDir = path.join(process.cwd(), 'public', 'locales');
  const srcLocalesDir = path.join(process.cwd(), 'src', 'locales');
  if (fs.existsSync(publicLocalesDir)) {
    if (!fs.existsSync(srcLocalesDir)) fs.mkdirSync(srcLocalesDir, { recursive: true });
    try {
      const localeFiles = fs.readdirSync(publicLocalesDir);
      for (const file of localeFiles) {
        // fs.copyFileSync(path.join(publicLocalesDir, file), path.join(srcLocalesDir, file));
      }
    } catch (_) {}
  }

  // Serve uploads statically
  app.use('/uploads', express.static(publicUploadsDir));
  app.use('/uploads', express.static(distUploadsDir));
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use(express.static(path.join(process.cwd(), 'dist')));

  // Body parser middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Image Upload Endpoint (Avatars & Attachments)
  app.post('/api/upload', (req, res) => {
    try {
      const { image, filename } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'No image data provided.' });
      }

      // If already a remote URL
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return res.json({ success: true, url: image });
      }

      // Base64 Data URI handling
      if (image.startsWith('data:image/')) {
        const matches = image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const ext = matches[1] || 'png';
          const buffer = Buffer.from(matches[2], 'base64');
          const name = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
          const targetPath = path.join(publicUploadsDir, name);
          fs.writeFileSync(targetPath, buffer);

          if (fs.existsSync(distUploadsDir)) {
            fs.writeFileSync(path.join(distUploadsDir, name), buffer);
          }

          const publicUrl = `/uploads/${name}`;
          return res.json({ success: true, url: publicUrl });
        }
      }

      res.json({ success: true, url: image });
    } catch (err: any) {
      console.error('Upload API Error:', err);
      res.status(500).json({ error: err.message || 'Image upload failed.' });
    }
  });

  // Real-time SSE Sync Clients
  let sseClients: any[] = [];

  function broadcastSse(type: string, data: any) {
    const message = JSON.stringify({ type, data });
    sseClients.forEach(client => {
      try {
        client.write(`data: ${message}\n\n`);
      } catch (err) {
        // Client might have disconnected
      }
    });
  }

  // Real-time Event Stream Endpoint
  app.get('/api/realtime/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    sseClients.push(res);

    // Initial message
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    req.on('close', () => {
      sseClients = sseClients.filter(client => client !== res);
    });
  });

  // ==========================================
  // AUTHENTICATION & USER MANAGEMENT ENDPOINTS
  // ==========================================

  // Validation Helpers
  function validatePassword(password: string): string | null {
    if (!password || password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter (A-Z).';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter (a-z).';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number (0-9).';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*).';
    }
    return null;
  }

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone: string): boolean {
    return /^[+0-9\s-]{7,20}$/.test(phone);
  }

  // 1. User Registration (Sign Up)
  app.post('/api/auth/register', async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        username,
        email,
        phone,
        password,
        confirm_password
      } = req.body;

      if (!first_name || !last_name || !email || !phone || !password) {
        return res.status(400).json({ error: 'All required fields (First Name, Last Name, Email, Phone, Password) must be provided.' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }

      if (!validatePhone(phone)) {
        return res.status(400).json({ error: 'Please enter a valid phone number.' });
      }

      const passErr = validatePassword(password);
      if (passErr) {
        return res.status(400).json({ error: passErr });
      }

      if (confirm_password && password !== confirm_password) {
        return res.status(400).json({ error: 'Password and Confirm Password do not match.' });
      }

      // Check existing email
      const existingEmail = await findUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'An account with this email address already exists.' });
      }

      // Check existing username
      if (username) {
        const existingUsername = await findUserByUsername(username);
        if (existingUsername) {
          return res.status(400).json({ error: 'This username is already taken. Please choose another.' });
        }
      }

      // Hash password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Generate verification token
      const verification_token = generateUUID();
      const verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      // Save user to database
      const newUser = await createUser({
        first_name,
        last_name,
        username,
        email,
        phone,
        password_hash,
        role: email.trim().toLowerCase() === 'admin@gmail.com' ? 'admin' : 'customer',
        status: 'active',
        email_verified: true,
        verification_token,
        verification_token_expires
      });

      // Generate JWT Access & Refresh Tokens
      const token = generateAccessToken(newUser);
      const refreshToken = generateRefreshToken(newUser);

      // Record initial login log
      await recordLoginLogEntry({
        user_id: newUser.id,
        email: newUser.email,
        ip_address: req.ip || '127.0.0.1',
        user_agent: (req.headers['user-agent'] as string) || 'Browser',
        status: 'success'
      });

      // Sync to local profile helper
      await createOrUpdateProfile(newUser.id, {
        fullName: `${newUser.first_name} ${newUser.last_name}`,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      });

      broadcastSse('user-registered', {
        id: newUser.id,
        name: `${newUser.first_name} ${newUser.last_name}`,
        email: newUser.email,
        role: newUser.role
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token,
        refreshToken,
        user: sanitizeUser(newUser)
      });
    } catch (error: any) {
      console.error('Registration Error:', error);
      res.status(500).json({ error: error.message || 'Server error during registration.' });
    }
  });

  // 2. User Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const cleanEmail = email.trim().toLowerCase();

      // Find user by email
      let user = await findUserByEmail(cleanEmail);

      // Auto-create admin@gmail.com if logging in for the first time
      if (!user && cleanEmail === 'admin@gmail.com' && password === 'admin2005') {
        const adminHash = await bcrypt.hash('admin2005', 10);
        user = await createUser({
          first_name: 'Admin',
          last_name: 'Control',
          username: 'admin',
          email: 'admin@gmail.com',
          phone: '+94 77 000 0000',
          password_hash: adminHash,
          role: 'admin',
          status: 'active',
          email_verified: true
        });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Lockout check
      const lockCheck = await isUserLockedOut(user);
      if (lockCheck.locked) {
        await recordLoginLogEntry({
          user_id: user.id,
          email: user.email,
          ip_address: req.ip || '127.0.0.1',
          user_agent: (req.headers['user-agent'] as string) || 'Browser',
          status: 'locked'
        });
        return res.status(423).json({
          error: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${lockCheck.minutesRemaining} minutes.`
        });
      }

      // Check account status
      if (user.status === 'suspended') {
        return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
      }

      // Special check for admin@gmail.com / admin2005 bypass if legacy, else bcrypt
      let isMatch = false;
      if (cleanEmail === 'admin@gmail.com' && password === 'admin2005') {
        isMatch = true;
      } else if (user.password_hash) {
        isMatch = await bcrypt.compare(password, user.password_hash);
      }

      if (!isMatch) {
        const failedInfo = await incrementFailedLoginAttempts(user);
        await recordLoginLogEntry({
          user_id: user.id,
          email: user.email,
          ip_address: req.ip || '127.0.0.1',
          user_agent: (req.headers['user-agent'] as string) || 'Browser',
          status: 'failed'
        });

        if (failedInfo.isLocked) {
          return res.status(423).json({ error: 'Account locked due to 5 consecutive failed login attempts. Please try again in 15 minutes.' });
        }

        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Login Successful
      await resetLoginAttemptsAndRecordLogin(user.id);

      const token = generateAccessToken(user, rememberMe ? '30d' : '1d');
      const refreshToken = generateRefreshToken(user, rememberMe ? '60d' : '7d');

      await recordLoginLogEntry({
        user_id: user.id,
        email: user.email,
        ip_address: req.ip || '127.0.0.1',
        user_agent: (req.headers['user-agent'] as string) || 'Browser',
        status: 'success'
      });

      // Sync profile
      await createOrUpdateProfile(user.id, {
        fullName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone,
        role: user.role
      });

      broadcastSse('user-logged-in', {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role
      });

      res.json({
        success: true,
        message: 'Login successful!',
        token,
        refreshToken,
        user: sanitizeUser(user)
      });
    } catch (error: any) {
      console.error('Login Error:', error);
      res.status(500).json({ error: error.message || 'Server error during login.' });
    }
  });

  // 3. User Logout
  app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // 4. Token Refresh
  app.post('/api/auth/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required.' });
      }

      const payload = verifyRefreshToken(refreshToken);
      if (!payload) {
        return res.status(401).json({ error: 'Invalid or expired refresh token.' });
      }

      const user = await findUserById(payload.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const newToken = generateAccessToken(user);
      res.json({ success: true, token: newToken });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 5. Forgot Password Request
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email address is required.' });
      }

      const user = await findUserByEmail(email);
      if (!user) {
        // Return generic message for security
        return res.json({ success: true, message: 'If an account exists for this email, a reset token has been generated.' });
      }

      const resetToken = generateUUID();
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      await updateUserRecord(user.id, {
        reset_token: resetToken,
        reset_token_expires: resetExpires
      });

      res.json({
        success: true,
        message: 'Password reset link generated successfully.',
        resetToken // Provided so frontend can populate reset modal
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 6. Reset Password Execution
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, password, confirm_password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ error: 'Reset token and new password are required.' });
      }

      const passErr = validatePassword(password);
      if (passErr) {
        return res.status(400).json({ error: passErr });
      }

      if (confirm_password && password !== confirm_password) {
        return res.status(400).json({ error: 'Password and Confirm Password do not match.' });
      }

      const allUsers = await getAllUsers();
      const user = allUsers.find(u => u.reset_token === token);

      if (!user || !user.reset_token_expires || new Date(user.reset_token_expires).getTime() < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired password reset token.' });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      await updateUserRecord(user.id, {
        password_hash,
        reset_token: undefined,
        reset_token_expires: undefined,
        login_attempts: 0,
        lockout_until: undefined
      });

      res.json({ success: true, message: 'Password updated successfully! You can now log in.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 7. Verify Email Endpoint
  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: 'Verification token is required.' });
      }

      const allUsers = await getAllUsers();
      const user = allUsers.find(u => u.verification_token === token);

      if (!user) {
        return res.status(400).json({ error: 'Invalid verification token.' });
      }

      await updateUserRecord(user.id, {
        email_verified: true,
        status: 'active',
        verification_token: undefined,
        verification_token_expires: undefined
      });

      res.json({ success: true, message: 'Email verified successfully!' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 8. Current Authenticated User Profile (GET /api/auth/me)
  app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = await findUserById(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: 'User profile not found.' });
      }
      res.json(sanitizeUser(user));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 9. Update Profile (PUT /api/auth/profile)
  app.put('/api/auth/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
      const {
        first_name,
        last_name,
        username,
        phone,
        password,
        profile_image
      } = req.body;

      const user = await findUserById(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const updates: Record<string, any> = {};

      if (first_name) updates.first_name = first_name.trim();
      if (last_name) updates.last_name = last_name.trim();
      if (phone) {
        if (!validatePhone(phone)) {
          return res.status(400).json({ error: 'Invalid phone number format.' });
        }
        updates.phone = phone.trim();
      }
      if (profile_image) updates.profile_image = profile_image;

      if (username && username.trim() !== user.username) {
        const existingUser = await findUserByUsername(username);
        if (existingUser && existingUser.id !== user.id) {
          return res.status(400).json({ error: 'Username is already taken.' });
        }
        updates.username = username.trim();
      }

      if (password) {
        const passErr = validatePassword(password);
        if (passErr) {
          return res.status(400).json({ error: passErr });
        }
        const salt = await bcrypt.genSalt(10);
        updates.password_hash = await bcrypt.hash(password, salt);
      }

      const updatedUser = await updateUserRecord(user.id, updates);
      if (!updatedUser) {
        return res.status(400).json({ error: 'Failed to update profile.' });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully!',
        user: sanitizeUser(updatedUser)
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==========================================
  // ADMIN USER MANAGEMENT ENDPOINTS
  // ==========================================

  // Admin GET All Users
  app.get('/api/admin/users', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const allUsers = await getAllUsers();
      const sanitized = allUsers.map(u => sanitizeUser(u));
      res.json(sanitized);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin GET All Customers (Legacy/Alias route)
  app.get('/api/admin/customers', async (req, res) => {
    try {
      const allUsers = await getAllUsers();
      const sanitized = allUsers.map(u => sanitizeUser(u));
      res.json(sanitized);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Update User Status
  app.put('/api/admin/users/:id/status', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['active', 'pending', 'suspended'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
      }

      const updated = await updateUserRecord(id, { status });
      if (!updated) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.json({ success: true, message: `User status updated to ${status}.`, user: sanitizeUser(updated) });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Update User Role
  app.put('/api/admin/users/:id/role', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const validRoles = ['customer', 'admin', 'hotel_manager', 'car_manager', 'flight_manager', 'tour_manager', 'vip'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role value.' });
      }

      const updated = await updateUserRecord(id, { role });
      if (!updated) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.json({ success: true, message: `User role updated to ${role}.`, user: sanitizeUser(updated) });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Reset Password for User
  app.post('/api/admin/users/:id/reset-password', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      const passErr = validatePassword(newPassword);
      if (passErr) {
        return res.status(400).json({ error: passErr });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(newPassword, salt);

      const updated = await updateUserRecord(id, {
        password_hash,
        login_attempts: 0,
        lockout_until: undefined
      });

      if (!updated) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.json({ success: true, message: 'User password reset successfully.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Delete User
  app.delete('/api/admin/users/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const deleted = await deleteUserRecord(id);
      if (!deleted) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.json({ success: true, message: 'User deleted successfully.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin View Login History Logs
  app.get('/api/admin/login-logs', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const logs = await getLoginLogs();
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 1. Sync / Register Auth User (Legacy/Bypass compatibility)
  app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { email, uid, name } = req.user!;
      if (!email || !uid) {
        return res.status(400).json({ error: 'Missing user email or UID' });
      }

      const { fullName, phone, role } = req.body;

      // Check if profile exists
      let profile = await getProfileByUid(uid);
      if (!profile) {
        profile = await createOrUpdateProfile(uid, {
          fullName: fullName || name || email.split('@')[0],
          email,
          phone: phone || '',
          role: role || 'customer'
        });
      } else {
        // Just update last login if profile exists
        profile = await createOrUpdateProfile(uid, {
          fullName: fullName || profile.fullName,
          email: email || profile.email,
          phone: phone || profile.phone,
          role: role || profile.role
        });
      }

      // Record login log
      await recordLoginLog(uid, profile.role, req.ip);

      // Broadcast login event for admin live stats
      broadcastSse('user-logged-in', { uid, fullName: profile.fullName, role: profile.role, email: profile.email });

      res.json({ success: true, user: profile });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Profile endpoints
  app.get('/api/users/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
      const profile = await getProfileByUid(req.user!.uid);
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/users/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { fullName, phone } = req.body;
      const profile = await createOrUpdateProfile(req.user!.uid, {
        fullName,
        email: req.user!.email!,
        phone
      });
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Wishlist endpoints
  app.get('/api/wishlist', requireAuth, async (req: AuthRequest, res) => {
    try {
      const list = await getWishlist(req.user!.uid);
      res.json(list || []);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/wishlist', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { itemType, itemId } = req.body;
      const result = await addToWishlist(req.user!.uid, itemType, parseInt(itemId, 10));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/wishlist', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { itemType, itemId } = req.body;
      const result = await removeFromWishlist(req.user!.uid, itemType, parseInt(itemId, 10));
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 2. Packages (GET)
  app.get('/api/packages', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const data = await getPackages(category);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 3. Tours (GET)
  app.get('/api/tours', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const maxPriceStr = req.query.maxPrice as string | undefined;
      const maxPrice = maxPriceStr ? parseInt(maxPriceStr, 10) : undefined;
      const data = await getTours(category, maxPrice);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4. Tour detail (GET)
  app.get('/api/tours/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid tour ID' });
      }
      const tour = await getTourById(id);
      if (!tour) {
        return res.status(404).json({ error: 'Tour not found' });
      }
      res.json(tour);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4b. Tour reviews (GET)
  app.get('/api/tours/:id/reviews', async (req, res) => {
    try {
      const tourId = parseInt(req.params.id, 10);
      if (isNaN(tourId)) {
        return res.status(400).json({ error: 'Invalid tour ID' });
      }
      const data = await db.select().from(reviews).where(eq(reviews.tourId, tourId));
      // Sort reviews descending by createdAt/id so newest are first
      const sortedData = data.sort((a: any, b: any) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      res.json(sortedData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4c. Submit Tour review (POST)
  app.post('/api/tours/:id/reviews', requireAuth, async (req: AuthRequest, res) => {
    try {
      const tourId = parseInt(req.params.id, 10);
      if (isNaN(tourId)) {
        return res.status(400).json({ error: 'Invalid tour ID' });
      }
      const { rating, comment } = req.body;
      const numRating = parseInt(rating, 10);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
      }
      if (!comment || comment.trim() === '') {
        return res.status(400).json({ error: 'Comment is required' });
      }

      // Check if tour exists
      const tour = await getTourById(tourId);
      if (!tour) {
        return res.status(404).json({ error: 'Tour not found' });
      }

      const userName = req.user!.name || req.user!.email?.split('@')[0] || 'Premium Traveler';
      const userEmail = req.user!.email || 'guest@example.com';

      const result = await db.insert(reviews).values({
        tourId,
        userName,
        userEmail,
        rating: numRating,
        comment: comment.trim(),
        status: 'Pending',
        createdAt: new Date()
      }).returning();

      res.status(201).json({ success: true, review: result[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4d. Global Traveler Reviews / Stories (GET)
  app.get('/api/reviews', async (req, res) => {
    try {
      const data = await db.select().from(reviews);
      // Filter strictly for Approved reviews only
      const approvedOnly = (data || []).filter((r: any) => r.status === 'Approved');
      const sortedData = [...approvedOnly].sort((a: any, b: any) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (typeof a.id === 'string' ? 0 : Number(a.id) || 0);
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (typeof b.id === 'string' ? 0 : Number(b.id) || 0);
        return timeB - timeA;
      });
      res.json(sortedData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4e. Submit Global Traveler Review / Story (POST)
  app.post('/api/reviews', async (req, res) => {
    try {
      const {
        author,
        location,
        flag,
        avatar,
        tourName,
        rating,
        category,
        title,
        comment,
        photos,
        verified,
        userEmail
      } = req.body;

      if (!author || !title || !comment) {
        return res.status(400).json({ error: 'Author, title, and comment are required' });
      }

      const newReview = {
        id: 'rev-' + Date.now() + '-' + Math.round(Math.random() * 1000),
        author: author.trim(),
        location: (location || 'Traveler').trim(),
        flag: flag || '🇱🇰',
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(author)}`,
        tourName: tourName || 'Luxury Sri Lanka Tour',
        rating: Number(rating) || 5,
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        category: category || 'honeymoon',
        title: title.trim(),
        comment: comment.trim(),
        photos: Array.isArray(photos) ? photos : [],
        helpfulCount: 0,
        verified: verified !== undefined ? Boolean(verified) : true,
        userEmail: userEmail || '',
        status: 'Pending',
        createdAt: new Date()
      };

      const inserted = await db.insert(reviews).values(newReview).returning();
      broadcastSse('NEW_REVIEW', inserted[0] || newReview);

      res.status(201).json({ success: true, review: inserted[0] || newReview });
    } catch (error: any) {
      console.error('Submit review error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 4f. Upvote Review Helpful Count (POST)
  app.post('/api/reviews/:id/helpful', async (req, res) => {
    try {
      const { id } = req.params;
      const allReviews = await db.select().from(reviews);
      const target = allReviews.find((r: any) => String(r.id) === String(id));
      if (target) {
        const newCount = (target.helpfulCount || 0) + 1;
        await db.update(reviews).set({ helpfulCount: newCount }).where(eq(reviews.id as any, id as any));
        return res.json({ success: true, helpfulCount: newCount });
      }
      res.status(404).json({ error: 'Review not found' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4f2. Admin Reviews Management API Routes
  
  // GET /api/admin/reviews - Fetch all reviews for admin management
  app.get('/api/admin/reviews', requireAuth, async (req, res) => {
    try {
      const data = await db.select().from(reviews);
      const normalized = (data || []).map((r: any) => ({
        id: r.id,
        author: r.author || r.userName || r.name || 'Anonymous Traveler',
        userName: r.userName || r.author || r.name || 'Anonymous Traveler',
        userEmail: r.userEmail || r.email || '',
        location: r.location || r.country || 'Sri Lanka',
        country: r.country || r.location || 'Sri Lanka',
        flag: r.flag || '🇱🇰',
        avatar: r.avatar || r.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.author || r.userName || 'user')}`,
        tourName: r.tourName || r.tourPackage || r.packageName || 'Luxury Sri Lanka Tour',
        rating: Number(r.rating) || 5,
        title: r.title || (r.comment ? (r.comment.length > 35 ? r.comment.substring(0, 35) + '...' : r.comment) : 'Travel Review'),
        comment: r.comment || r.description || '',
        photos: Array.isArray(r.photos) ? r.photos : (Array.isArray(r.images) ? r.images : []),
        status: r.status || 'Approved',
        helpfulCount: Number(r.helpfulCount) || 0,
        verified: r.verified !== undefined ? Boolean(r.verified) : true,
        createdAt: r.createdAt || r.date || new Date().toISOString()
      }));

      normalized.sort((a: any, b: any) => {
        const timeA = new Date(a.createdAt).getTime() || 0;
        const timeB = new Date(b.createdAt).getTime() || 0;
        return timeB - timeA;
      });

      res.json(normalized);
    } catch (error: any) {
      console.error('Fetch admin reviews error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // PUT /api/admin/reviews/:id - Edit review
  app.put('/api/admin/reviews/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { author, userEmail, location, tourName, rating, title, comment, photos, status } = req.body;

      if (rating !== undefined && (Number(rating) < 1 || Number(rating) > 5)) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' });
      }
      if (status && !['Pending', 'Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value. Must be Pending, Approved, or Rejected' });
      }

      const allReviews = await db.select().from(reviews);
      const existing = allReviews.find((r: any) => String(r.id) === String(id));
      if (!existing) {
        return res.status(404).json({ error: 'Review not found' });
      }

      const updatedPayload: any = {
        author: author !== undefined ? String(author).trim() : (existing.author || existing.userName || 'Traveler'),
        userName: author !== undefined ? String(author).trim() : (existing.userName || existing.author || 'Traveler'),
        userEmail: userEmail !== undefined ? String(userEmail).trim() : (existing.userEmail || existing.email || ''),
        location: location !== undefined ? String(location).trim() : (existing.location || 'Sri Lanka'),
        tourName: tourName !== undefined ? String(tourName).trim() : (existing.tourName || 'Luxury Sri Lanka Tour'),
        rating: rating !== undefined ? Number(rating) : (existing.rating || 5),
        title: title !== undefined ? String(title).trim() : (existing.title || 'Travel Review'),
        comment: comment !== undefined ? String(comment).trim() : (existing.comment || ''),
        photos: Array.isArray(photos) ? photos : (existing.photos || existing.images || []),
        status: status || existing.status || 'Approved'
      };

      await db.update(reviews).set(updatedPayload).where(eq(reviews.id as any, id as any));
      const updatedReview = { ...existing, ...updatedPayload, id };
      broadcastSse('catalog-updated', { type: 'review-updated', id });
      res.json({ success: true, review: updatedReview });
    } catch (error: any) {
      console.error('Update review error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // PATCH /api/admin/reviews/:id/status - Update review status
  app.patch('/api/admin/reviews/:id/status', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value. Must be Pending, Approved, or Rejected' });
      }

      const allReviews = await db.select().from(reviews);
      const target = allReviews.find((r: any) => String(r.id) === String(id));
      if (!target) {
        return res.status(404).json({ error: 'Review not found' });
      }

      await db.update(reviews).set({ status }).where(eq(reviews.id as any, id as any));
      broadcastSse('catalog-updated', { type: 'review-status-updated', id, status });
      res.json({ success: true, id, status });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /api/admin/reviews/:id - Delete review & cleanup photos
  app.delete('/api/admin/reviews/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const allReviews = await db.select().from(reviews);
      const target = allReviews.find((r: any) => String(r.id) === String(id));

      if (!target) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // Delete associated image files if stored locally in /uploads
      const photosToDelete = target.photos || target.images || [];
      if (Array.isArray(photosToDelete)) {
        for (const photoUrl of photosToDelete) {
          if (typeof photoUrl === 'string' && photoUrl.includes('/uploads/')) {
            const filename = photoUrl.split('/uploads/').pop();
            if (filename) {
              const pubPath = path.join(process.cwd(), 'public', 'uploads', filename);
              const distPath = path.join(process.cwd(), 'dist', 'uploads', filename);
              try { if (fs.existsSync(pubPath)) fs.unlinkSync(pubPath); } catch (_) {}
              try { if (fs.existsSync(distPath)) fs.unlinkSync(distPath); } catch (_) {}
            }
          }
        }
      }

      await db.delete(reviews).where(eq(reviews.id as any, id as any));
      broadcastSse('catalog-updated', { type: 'review-deleted', id });
      res.json({ success: true, message: 'Review deleted successfully.' });
    } catch (error: any) {
      console.error('Delete review error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/admin/reviews/bulk - Bulk approve, reject, or delete
  app.post('/api/admin/reviews/bulk', requireAuth, async (req, res) => {
    try {
      const { action, ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'No review IDs provided' });
      }

      if (action === 'approve' || action === 'reject') {
        const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
        for (const id of ids) {
          await db.update(reviews).set({ status: newStatus }).where(eq(reviews.id as any, id as any));
        }
        broadcastSse('catalog-updated', { type: 'review-bulk-updated', action, ids });
        return res.json({ success: true, updatedCount: ids.length, status: newStatus });
      }

      if (action === 'delete') {
        const allReviews = await db.select().from(reviews);
        for (const id of ids) {
          const target = allReviews.find((r: any) => String(r.id) === String(id));
          if (target) {
            const photosToDelete = target.photos || target.images || [];
            if (Array.isArray(photosToDelete)) {
              for (const photoUrl of photosToDelete) {
                if (typeof photoUrl === 'string' && photoUrl.includes('/uploads/')) {
                  const filename = photoUrl.split('/uploads/').pop();
                  if (filename) {
                    const pubPath = path.join(process.cwd(), 'public', 'uploads', filename);
                    const distPath = path.join(process.cwd(), 'dist', 'uploads', filename);
                    try { if (fs.existsSync(pubPath)) fs.unlinkSync(pubPath); } catch (_) {}
                    try { if (fs.existsSync(distPath)) fs.unlinkSync(distPath); } catch (_) {}
                  }
                }
              }
            }
            await db.delete(reviews).where(eq(reviews.id as any, id as any));
          }
        }
        broadcastSse('catalog-updated', { type: 'review-bulk-deleted', ids });
        return res.json({ success: true, deletedCount: ids.length });
      }

      return res.status(400).json({ error: 'Invalid bulk action type' });
    } catch (error: any) {
      console.error('Bulk review action error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET & POST /api/admin/reviews/activity-logs
  const reviewActivityLogsPath = path.join(process.cwd(), 'public', 'admin_review_activity_logs.json');

  app.get('/api/admin/reviews/activity-logs', requireAuth, async (req, res) => {
    try {
      if (fs.existsSync(reviewActivityLogsPath)) {
        const logsData = JSON.parse(fs.readFileSync(reviewActivityLogsPath, 'utf-8'));
        return res.json(logsData);
      }
      res.json([]);
    } catch (error: any) {
      res.json([]);
    }
  });

  app.post('/api/admin/reviews/activity-logs', requireAuth, async (req, res) => {
    try {
      const { adminName, action, details } = req.body;
      const newLog = {
        id: 'log-' + Date.now() + '-' + Math.round(Math.random() * 1000),
        adminName: adminName || (req as any).user?.name || 'Admin',
        action: action || 'Updated review',
        details: details || '',
        timestamp: new Date().toISOString()
      };

      let currentLogs: any[] = [];
      if (fs.existsSync(reviewActivityLogsPath)) {
        try {
          currentLogs = JSON.parse(fs.readFileSync(reviewActivityLogsPath, 'utf-8'));
        } catch (_) {}
      }
      currentLogs.unshift(newLog);
      currentLogs = currentLogs.slice(0, 100);

      fs.writeFileSync(reviewActivityLogsPath, JSON.stringify(currentLogs, null, 2));
      const distLogsPath = path.join(process.cwd(), 'dist', 'admin_review_activity_logs.json');
      try { fs.writeFileSync(distLogsPath, JSON.stringify(currentLogs, null, 2)); } catch (_) {}

      res.json({ success: true, log: newLog });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4g. Public Photo Upload Endpoint
  app.post('/api/upload', (req, res) => {
    try {
      const { image } = req.body;
      if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Invalid image format' });
      }
      const matches = image.match(/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,([\s\S]+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid base64 payload' });
      }
      let rawExt = matches[1].toLowerCase();
      if (rawExt.includes('svg')) rawExt = 'svg';
      const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
      const buffer = Buffer.from(matches[2].trim(), 'base64');
      const filename = 'user-' + Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext;

      const publicUploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
      const distUploadPath = path.join(process.cwd(), 'dist', 'uploads', filename);

      fs.writeFileSync(publicUploadPath, buffer);
      try {
        const distDir = path.dirname(distUploadPath);
        if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
        fs.writeFileSync(distUploadPath, buffer);
      } catch (_) { }

      res.json({ url: '/uploads/' + filename });
    } catch (err: any) {
      console.error('Public upload error:', err);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  // 5. Flights (GET)
  app.get('/api/flights', async (req, res) => {
    try {
      const fromCity = req.query.fromCity as string | undefined;
      const toCity = req.query.toCity as string | undefined;
      const data = await getFlights(fromCity, toCity);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 6. Cars (GET)
  app.get('/api/cars', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const data = await getCars(category);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Real-time Availability Calculation Helper
  async function getRealtimeAvailabilityData() {
    try {
      const allBookings = await db.select().from(bookings);
      const allCarBookings = await db.select().from(carBookings);

      // Tour capacity configuration (capacity per tour item)
      const tourCapacities: Record<number, number> = {
        1: 10, 2: 8, 3: 12, 4: 15, 5: 6, 6: 10, 7: 12, 8: 15
      };

      // Count tour guests
      const tourBookedCounts: Record<number, number> = {};
      (allBookings || []).forEach((b: any) => {
        if (b.tourId && b.status !== 'Cancelled') {
          const id = Number(b.tourId);
          const guestCount = Number(b.guests) || 1;
          tourBookedCounts[id] = (tourBookedCounts[id] || 0) + guestCount;
        }
      });

      const allToursList = await getTours();
      const tourAvailability: Record<number, any> = {};

      (allToursList || []).forEach((t: any) => {
        const capacity = tourCapacities[t.id] || 12;
        const booked = tourBookedCounts[t.id] || 0;
        const seatsRemaining = Math.max(0, capacity - booked);

        let status: 'available' | 'limited' | 'sold_out' = 'available';
        let badgeText = `${seatsRemaining} Seats Available`;
        let badgeColor = 'emerald';

        if (seatsRemaining === 0) {
          status = 'sold_out';
          badgeText = 'Fully Booked';
          badgeColor = 'rose';
        } else if (seatsRemaining <= 3) {
          status = 'limited';
          badgeText = `High Demand • ${seatsRemaining} Seats Left`;
          badgeColor = 'amber';
        } else {
          badgeText = `Instant Available • ${seatsRemaining} Seats`;
          badgeColor = 'emerald';
        }

        tourAvailability[t.id] = {
          tourId: t.id,
          bookedCount: booked,
          capacity,
          seatsRemaining,
          status,
          isAvailable: seatsRemaining > 0,
          badgeText,
          badgeColor
        };
      });

      // Car fleet configuration
      const carFleets: Record<number, number> = {
        1: 2, 2: 2, 3: 2, 4: 1, 5: 1, 6: 2, 7: 3
      };

      const carBookedCounts: Record<number, number> = {};
      (allCarBookings || []).forEach((cb: any) => {
        if (cb.carId && cb.status !== 'Cancelled') {
          const id = Number(cb.carId);
          carBookedCounts[id] = (carBookedCounts[id] || 0) + 1;
        }
      });

      const allCarsList = await getCars();
      const carAvailability: Record<number, any> = {};

      (allCarsList || []).forEach((c: any) => {
        const fleetTotal = carFleets[c.id] || 2;
        const booked = carBookedCounts[c.id] || 0;
        const availableCount = Math.max(0, fleetTotal - booked);

        let status: 'available' | 'limited' | 'sold_out' = 'available';
        let badgeText = `${availableCount} Available`;
        let badgeColor = 'emerald';

        if (availableCount === 0) {
          status = 'sold_out';
          badgeText = 'Currently Rented Out';
          badgeColor = 'rose';
        } else if (availableCount === 1) {
          status = 'limited';
          badgeText = 'Only 1 Vehicle Left';
          badgeColor = 'amber';
        } else {
          badgeText = `Ready for Booking (${availableCount} Fleet)`;
          badgeColor = 'emerald';
        }

        carAvailability[c.id] = {
          carId: c.id,
          bookedCount: booked,
          fleetTotal,
          availableCount,
          status,
          isAvailable: availableCount > 0,
          badgeText,
          badgeColor
        };
      });

      return {
        tours: tourAvailability,
        cars: carAvailability,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error computing availability:', error);
      return { tours: {}, cars: {}, lastUpdated: new Date().toISOString() };
    }
  }

  // Real-time Availability Endpoint
  app.get('/api/availability', async (req, res) => {
    try {
      const data = await getRealtimeAvailabilityData();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 6b. Hotels (GET & POST)
  app.get('/api/hotels', async (req, res) => {
    try {
      const location = req.query.location as string | undefined;
      const data = await getHotels(location);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/hotels', async (req, res) => {
    try {
      const { name, location, price, starRating, description, amenities, imageUrl } = req.body;
      if (!name || !location || !price) {
        return res.status(400).json({ error: 'Missing required hotel fields (name, location, price)' });
      }
      const data = await createHotel({
        name,
        location,
        price: parseInt(price, 10) || 0,
        starRating: parseInt(starRating, 10) || 5,
        description: description || '',
        amenities: Array.isArray(amenities) ? amenities : (amenities ? String(amenities).split(',').map((s: string) => s.trim()) : []),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      });
      res.status(201).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Hotel Reviews GET
  app.get('/api/hotels/:id/reviews', async (req, res) => {
    try {
      const rawHotelId = req.params.id;
      if (!rawHotelId) {
        return res.status(400).json({ error: 'Invalid hotel ID' });
      }
      const numId = parseInt(rawHotelId, 10);
      const hotelId = isNaN(numId) ? rawHotelId : numId;

      let data: any[] = [];
      try {
        data = await db.select().from(reviews).where(
          or(
            eq((reviews as any).hotelId, rawHotelId),
            eq((reviews as any).hotelId, hotelId as any)
          )
        );
      } catch (dbErr) {
        data = [];
      }

      // Default sample reviews if empty for rich experience
      let list = data || [];
      if (list.length === 0) {
        list = [
          {
            id: 101,
            hotelId: rawHotelId,
            userName: 'Samantha Vance',
            userEmail: 'samantha@example.com',
            rating: 5,
            comment: 'Unforgettable luxury stay! The staff made us feel like royalty and the ocean view from our private suite was breath-taking.',
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
          },
          {
            id: 102,
            hotelId: rawHotelId,
            userName: 'Liam Hemsworth',
            userEmail: 'liam@example.com',
            rating: 4,
            comment: 'Exceptional hospitality and serene atmosphere. The breakfast spread and Infinity pool were top notch!',
            createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
          }
        ];
      }

      const sortedData = list.sort((a: any, b: any) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      res.json(sortedData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Hotel Reviews POST
  app.post('/api/hotels/:id/reviews', requireAuth, async (req: AuthRequest, res) => {
    try {
      const rawHotelId = req.params.id;
      if (!rawHotelId) {
        return res.status(400).json({ error: 'Invalid hotel ID' });
      }
      const numId = parseInt(rawHotelId, 10);
      const hotelId = isNaN(numId) ? rawHotelId : numId;

      const { rating, comment } = req.body;
      const numRating = parseInt(rating, 10);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      if (!comment || comment.trim() === '') {
        return res.status(400).json({ error: 'Comment is required' });
      }

      const userName = req.user!.name || req.user!.email?.split('@')[0] || 'Premium Traveler';
      const userEmail = req.user!.email || 'guest@example.com';

      let newReview: any = {
        id: Date.now(),
        hotelId: rawHotelId,
        userName,
        userEmail,
        rating: numRating,
        comment: comment.trim(),
        createdAt: new Date().toISOString()
      };

      try {
        const result = await db.insert(reviews).values({
          hotelId: hotelId as any,
          userName,
          userEmail,
          rating: numRating,
          comment: comment.trim(),
          createdAt: new Date()
        } as any).returning();

        if (result && result.length > 0) {
          newReview = result[0];
        }
      } catch (dbErr) {
        console.log('Inserting into reviews table:', dbErr);
      }

      res.status(201).json({ success: true, review: newReview });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 7. General Booking (POST)
  app.post('/api/bookings', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { userName, email, phone, packageId, tourId, travelDate, guests } = req.body;
      const userId = req.user!.uid;

      if (!userName || !email || !phone || !travelDate || !guests) {
        return res.status(400).json({ error: 'Missing required booking fields' });
      }

      // Realtime double-booking prevention check
      if (tourId) {
        const avail = await getRealtimeAvailabilityData();
        const tAvail = avail.tours[parseInt(tourId, 10)];
        const numGuests = parseInt(guests, 10) || 1;
        if (tAvail && (!tAvail.isAvailable || tAvail.seatsRemaining < numGuests)) {
          return res.status(409).json({
            error: `Double Booking Prevented: This tour currently only has ${tAvail?.seatsRemaining || 0} remaining seats available.`
          });
        }
      }

      const result = await db.insert(bookings)
        .values({
          userId,
          userName,
          email,
          phone,
          packageId: packageId ? parseInt(packageId, 10) : null,
          tourId: tourId ? parseInt(tourId, 10) : null,
          travelDate,
          guests: parseInt(guests, 10),
          status: 'Pending'
        })
        .returning();

      // Broadcast new booking real-time event for admins and clients
      broadcastSse('booking-created', { type: 'Tour/Package', booking: result[0] });
      const currentAvail = await getRealtimeAvailabilityData();
      broadcastSse('availability-updated', currentAvail);

      res.status(201).json({ success: true, booking: result[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Payment & Booking Creation Endpoint
  app.post('/api/stripe/payment', requireAuth, async (req: AuthRequest, res) => {
    try {
      const {
        bookingType,      // 'package' | 'tour' | 'flight' | 'car'
        amount,           // total cost in dollars
        title,            // title of travel arrangement
        cardName,
        cardNumber,
        cardExpiry,
        cardCvc,
        passengerDetails, // { name, email, phone }
        bookingData       // standard booking payload
      } = req.body;

      const userId = req.user!.uid;

      if (!bookingType || amount === undefined || amount === null || !title || !cardName || !cardNumber || !cardExpiry || !cardCvc) {
        return res.status(400).json({ error: 'Missing payment or booking details' });
      }

      if (amount <= 0) {
        return res.status(400).json({ error: 'Total amount must be greater than zero' });
      }

      let chargeId = 'ch_sandbox_' + Math.random().toString(36).substring(2, 12);
      let receiptUrl = '';
      let isSimulated = true;

      // 1. Process with Stripe SDK if secret key is present
      if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
        try {
          const StripeModule = await import('stripe');
          const stripe = new StripeModule.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16' as any,
          });

          const [expMonthStr, expYearStr] = cardExpiry.split('/');
          const expMonth = parseInt(expMonthStr, 10);
          const expYear = parseInt('20' + expYearStr, 10);

          if (isNaN(expMonth) || isNaN(expYear)) {
            return res.status(400).json({ error: 'Invalid card expiration date. Please use MM/YY format.' });
          }

          // Create standard card token securely using Stripe Node SDK
          const token = await stripe.tokens.create({
            card: {
              number: cardNumber.replace(/\s+/g, ''),
              exp_month: expMonth.toString(),
              exp_year: expYear.toString(),
              cvc: cardCvc,
              name: cardName,
            },
          });

          // Create charge on Stripe
          const charge = await stripe.charges.create({
            amount: Math.round(amount * 100), // convert dollars to cents
            currency: 'usd',
            source: token.id,
            description: `Travel Booking: ${title} (${bookingType})`,
            receipt_email: passengerDetails?.email || req.user!.email,
          });

          chargeId = charge.id;
          receiptUrl = charge.receipt_url || '';
          isSimulated = false;
        } catch (stripeErr: any) {
          console.error('❌ [Stripe API Error]:', stripeErr);
          return res.status(400).json({ error: stripeErr.message || 'Stripe payment failed.' });
        }
      } else {
        // Simulated Stripe sandbox delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.warn('⚠️ [Stripe Developer Warning]: STRIPE_SECRET_KEY is missing. Running in simulated Sandbox Mode.');
      }

      // 2. Persist booking directly inside database with status = "Paid"
      let createdBooking: any = null;

      if (bookingType === 'package' || bookingType === 'tour') {
        const { packageId, tourId, travelDate, guests } = bookingData;
        const result = await db.insert(bookings)
          .values({
            userId,
            userName: passengerDetails.name,
            email: passengerDetails.email,
            phone: passengerDetails.phone,
            packageId: packageId ? parseInt(packageId, 10) : null,
            tourId: tourId ? parseInt(tourId, 10) : null,
            travelDate,
            guests: parseInt(guests, 10),
            status: 'Paid',
            notes: `Paid with Stripe. Transaction ID: ${chargeId}`
          })
          .returning();
        createdBooking = result[0];
        broadcastSse('booking-created', { type: 'Tour/Package', booking: createdBooking });
      } else if (bookingType === 'flight') {
        const { flightId } = bookingData;
        const result = await db.insert(flightBookings)
          .values({
            userId,
            flightId: parseInt(flightId, 10),
            passengerName: passengerDetails.name,
            email: passengerDetails.email,
            phone: passengerDetails.phone,
            status: 'Paid',
            notes: `Paid with Stripe. Transaction ID: ${chargeId}`
          })
          .returning();
        createdBooking = result[0];
        broadcastSse('booking-created', { type: 'Flight', booking: createdBooking });
      } else if (bookingType === 'car') {
        const { carId, pickupDate, returnDate } = bookingData;
        const result = await db.insert(carBookings)
          .values({
            userId,
            carId: parseInt(carId, 10),
            customerName: passengerDetails.name,
            pickupDate,
            returnDate,
            status: 'Paid',
            notes: `Paid with Stripe. Transaction ID: ${chargeId}`
          })
          .returning();
        createdBooking = result[0];
        broadcastSse('booking-created', { type: 'Car Rental', booking: createdBooking });
      } else if (bookingType === 'hotel') {
        const { hotelId, checkInDate, checkOutDate, guests, totalPrice } = bookingData;
        const result = await db.insert(hotelBookings)
          .values({
            id: 'hb_' + Math.random().toString(36).substring(2, 11),
            hotelId,
            userId,
            userName: passengerDetails.name,
            userEmail: passengerDetails.email,
            checkInDate,
            checkOutDate,
            guests: parseInt(guests, 10) || 1,
            totalPrice: parseInt(totalPrice, 10) || 0,
            status: 'Paid',
            notes: `Paid with Stripe. Transaction ID: ${chargeId}`
          })
          .returning();
        createdBooking = result[0];
        broadcastSse('booking-created', { type: 'Hotel Stay', booking: createdBooking });
      }

      res.status(201).json({
        success: true,
        chargeId,
        receiptUrl,
        isSimulated,
        booking: createdBooking
      });

    } catch (error: any) {
      console.error('❌ Error processing payment & booking:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 8. User Bookings (GET)
  // Supports fetching for authenticated user or fallback guest search by email

  // Cancel Booking (POST)
  app.put('/api/bookings/:type/:id/cancel', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { type, id } = req.params;
      const userId = req.user.uid;

      if (type === 'tour') {
        const b = await db.select().from(bookings).where(eq(bookings.id, parseInt(id, 10)));
        if (!b.length || b[0].userId !== userId) return res.status(404).json({ error: 'Not found' });
        const result = await db.update(bookings).set({ status: 'Cancelled' }).where(eq(bookings.id, parseInt(id, 10))).returning();
        return res.json({ success: true, booking: result[0] });
      } else if (type === 'flight') {
        const b = await db.select().from(flightBookings).where(eq(flightBookings.id, parseInt(id, 10)));
        if (!b.length || b[0].userId !== userId) return res.status(404).json({ error: 'Not found' });
        const result = await db.update(flightBookings).set({ status: 'Cancelled' }).where(eq(flightBookings.id, parseInt(id, 10))).returning();
        return res.json({ success: true, booking: result[0] });
      } else if (type === 'car') {
        const b = await db.select().from(carBookings).where(eq(carBookings.id, parseInt(id, 10)));
        if (!b.length || b[0].userId !== userId) return res.status(404).json({ error: 'Not found' });
        const result = await db.update(carBookings).set({ status: 'Cancelled' }).where(eq(carBookings.id, parseInt(id, 10))).returning();
        return res.json({ success: true, booking: result[0] });
      } else if (type === 'hotel') {
        const b = await db.select().from(hotelBookings).where(eq(hotelBookings.id, id));
        if (!b.length || b[0].userId !== userId) return res.status(404).json({ error: 'Not found' });
        const result = await db.update(hotelBookings).set({ status: 'Cancelled' }).where(eq(hotelBookings.id, id)).returning();
        return res.json({ success: true, booking: result[0] });
      }
      return res.status(400).json({ error: 'Invalid type' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/bookings/my-bookings', async (req: any, res) => {
    try {
      let userId: string | undefined;
      let email: string | undefined = req.query.email as string | undefined;

      // Check if authorization is provided
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split('Bearer ')[1] || authHeader.split(' ')[1];
          if (token.startsWith('demo-token-')) {
            const payloadStr = Buffer.from(token.substring('demo-token-'.length), 'base64').toString('utf8');
            const payload = JSON.parse(payloadStr);
            userId = payload.uid || 'demo-user-123';
            email = payload.email || 'demo@example.com';
          } else {
            const decodedToken = verifyAccessToken(token);
            if (decodedToken) {
              userId = decodedToken.uid;
              email = decodedToken.email;
            }
          }
        } catch (e) {
          console.error('Error parsing token in my-bookings:', e);
          // Ignore token parsing error, fallback to guest search
        }
      }

      // If requireAuth successfully put user in req, let's use it (fallback check)
      if (req.user) {
        userId = req.user.uid;
        email = req.user.email;
      }

      const allTours = await db.select().from(tours);
      const allCars = await db.select().from(cars);
      const allFlights = await db.select().from(flights);
      const allHotels = await db.select().from(hotels);

      let tBookings = [];
      let fBookings = [];
      let cBookings = [];
      let hBookings = [];

      if (userId) {
        // Authenticated user: filter strictly by userId
        tBookings = await db.select().from(bookings).where(eq(bookings.userId, userId));
        fBookings = await db.select().from(flightBookings).where(eq(flightBookings.userId, userId));
        cBookings = await db.select().from(carBookings).where(eq(carBookings.userId, userId));
        hBookings = await db.select().from(hotelBookings).where(eq(hotelBookings.userId, userId));
      } else if (email) {
        // Guest user: fallback to email-based query
        tBookings = await db.select().from(bookings).where(eq(bookings.email, email));
        fBookings = await db.select().from(flightBookings).where(eq(flightBookings.email, email));
        cBookings = await db.select().from(carBookings).where(eq(carBookings.customerName, email)); // or matching
        hBookings = await db.select().from(hotelBookings).where(eq(hotelBookings.userEmail, email));
      } else {
        return res.status(400).json({ error: 'Auth session or email query parameter is required' });
      }

      // Enrich bookings with item details
      const tourBookingsEnriched = tBookings.map(b => {
        const t = b.tourId ? allTours.find(x => x.id === b.tourId) : null;
        return {
          ...b,
          itemName: t ? t.title : 'Unknown Tour',
          itemPrice: t ? t.price : 0,
          imageUrl: t ? t.imageUrl : ''
        };
      });

      const flightBookingsEnriched = fBookings.map(fb => {
        const f = allFlights.find(x => x.id === fb.flightId);
        return {
          ...fb,
          itemName: f ? `${f.airline} (${f.fromCity} ➔ ${f.toCity})` : 'Unknown Flight',
          itemPrice: f ? f.price : 0
        };
      });

      const carBookingsEnriched = cBookings.map(cb => {
        const c = allCars.find(x => x.id === cb.carId);
        return {
          ...cb,
          itemName: c ? c.name : 'Unknown Car',
          itemPrice: c ? c.pricePerDay : 0,
          imageUrl: c ? c.imageUrl : ''
        };
      });

      const hotelBookingsEnriched = hBookings.map(hb => {
        const h = allHotels.find(x => x.id === hb.hotelId);
        return {
          ...hb,
          itemName: h ? h.name : 'Unknown Hotel',
          itemPrice: h ? h.price : 0,
          imageUrl: h ? h.imageUrl : ''
        };
      });

      res.json({
        tours: tourBookingsEnriched,
        flights: flightBookingsEnriched,
        cars: carBookingsEnriched,
        hotels: hotelBookingsEnriched
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 9. Flight Booking (POST)
  app.post('/api/flight-bookings', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { flightId, passengerName, email, phone } = req.body;
      const userId = req.user!.uid;

      if (!flightId || !passengerName || !email || !phone) {
        return res.status(400).json({ error: 'Missing required flight booking fields' });
      }

      const result = await db.insert(flightBookings)
        .values({
          userId,
          flightId: parseInt(flightId, 10),
          passengerName,
          email,
          phone,
          status: 'Pending'
        })
        .returning();

      broadcastSse('booking-created', { type: 'Flight', booking: result[0] });

      res.status(201).json({ success: true, booking: result[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 10. Car Booking (POST)
  app.post('/api/car-bookings', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { carId, customerName, pickupDate, returnDate } = req.body;
      const userId = req.user!.uid;

      if (!carId || !customerName || !pickupDate || !returnDate) {
        return res.status(400).json({ error: 'Missing required car booking fields' });
      }

      // Check real-time vehicle availability to prevent double booking
      if (carId) {
        const avail = await getRealtimeAvailabilityData();
        const cAvail = avail.cars[parseInt(carId, 10)];
        if (cAvail && (!cAvail.isAvailable || cAvail.availableCount < 1)) {
          return res.status(409).json({
            error: 'Double Booking Prevented: This vehicle model is currently rented out or fully reserved.'
          });
        }
      }

      const result = await db.insert(carBookings)
        .values({
          userId,
          carId: parseInt(carId, 10),
          customerName,
          pickupDate,
          returnDate,
          status: 'Pending'
        })
        .returning();

      broadcastSse('booking-created', { type: 'Car Rental', booking: result[0] });
      const currentAvail = await getRealtimeAvailabilityData();
      broadcastSse('availability-updated', currentAvail);

      res.status(201).json({ success: true, booking: result[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 10b. Hotel Booking (POST)
  app.post('/api/hotel-bookings', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { hotelId, userName, userEmail, checkInDate, checkOutDate, guests, totalPrice } = req.body;
      const userId = req.user!.uid;

      if (!hotelId || !userName || !userEmail || !checkInDate || !checkOutDate || !guests || !totalPrice) {
        return res.status(400).json({ error: 'Missing required hotel booking fields' });
      }

      const result = await db.insert(hotelBookings)
        .values({
          id: 'hb_' + Math.random().toString(36).substring(2, 11),
          hotelId,
          userId,
          userName,
          userEmail,
          checkInDate,
          checkOutDate,
          guests: parseInt(guests, 10) || 1,
          totalPrice: parseInt(totalPrice, 10) || 0,
          status: 'confirmed'
        })
        .returning();

      broadcastSse('booking-created', { type: 'Hotel Stay', booking: result[0] });

      res.status(201).json({ success: true, booking: result[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 11. Newsletter Subscription (POST)
  app.post('/api/subscribers', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      const data = await createSubscriber(email);
      res.status(201).json({ success: true, subscriber: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 12. Contact Messages (POST)
  app.post('/api/contact-messages', async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Missing required contact fields' });
      }
      const data = await createContactMessage({
        name,
        email,
        phone: phone || '',
        subject,
        message
      });
      res.status(201).json({ success: true, message: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==========================================
  // ADMIN DASHBOARD REST ENDPOINTS
  // ==========================================

  // 1. Admin Login
  app.post('/api/admin/login', (req, res) => {
    // TODO: Replace hardcoded auth with Supabase Auth + hashed passwords before production
    const { username, password } = req.body;
    if (username === 'admin' && password === '0000') {
      res.json({ success: true, token: 'admin-secret-session-token' });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });

  // 2. Dashboard Statistics
  app.get('/api/admin/stats', async (req, res) => {
    try {
      // Fetch datasets
      const allProfiles = await db.select().from(profiles).where(eq(profiles.role, 'customer'));
      const allTours = await db.select().from(tours);
      const activeTours = allTours.filter(t => t.status === 'Active');
      const allCars = await db.select().from(cars);
      const availableCars = allCars.filter(c => c.status === 'Available');

      const allBookings = await db.select().from(bookings);
      const allCarBookings = await db.select().from(carBookings);
      const allFlightBookings = await db.select().from(flightBookings);

      const totalBookingsCount = allBookings.length + allCarBookings.length + allFlightBookings.length;

      // Logged-in Users Today: unique userIds logged in today
      const allLogs = await db.select().from(loginLogs);
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const loggedInTodayUids = new Set(
        allLogs
          .filter(log => log.loggedInAt && new Date(log.loggedInAt).getTime() >= startOfToday.getTime())
          .map(log => log.userId)
      );
      const loggedInUsersToday = loggedInTodayUids.size || 0;

      // Calculate total revenue
      let totalRevenue = 0;

      // Tour/Package Bookings Revenue
      for (const b of allBookings) {
        if (b.status === 'Cancelled') continue;
        if (b.tourId) {
          const t = allTours.find(x => x.id === b.tourId);
          if (t) totalRevenue += (t.price || 0) * (b.guests || 1);
        } else if (b.packageId) {
          const pResult = await db.select().from(packages).where(eq(packages.id, b.packageId));
          if (pResult[0]) totalRevenue += (pResult[0].price || 0) * (b.guests || 1);
        }
      }

      // Car Rentals Revenue
      for (const cb of allCarBookings) {
        if (cb.status === 'Cancelled') continue;
        const c = allCars.find(x => x.id === cb.carId);
        if (c) {
          const start = new Date(cb.pickupDate);
          const end = new Date(cb.returnDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          totalRevenue += (c.pricePerDay || 0) * diffDays;
        }
      }

      // Flight Revenue
      const allFlights = await db.select().from(flights);
      for (const fb of allFlightBookings) {
        if (fb.status === 'Cancelled') continue;
        const fList = allFlights.filter(f => f.id === fb.flightId);
        if (fList[0]) {
          totalRevenue += fList[0].price || 0;
        }
      }

      // Generate trend stats (last 30 days)
      const bookingsTrend = [];
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateString = d.toISOString().split('T')[0];

        const tourCount = allBookings.filter(b => b.createdAt && new Date(b.createdAt).toISOString().split('T')[0] === dateString).length;
        const carCount = allCarBookings.filter(cb => cb.createdAt && new Date(cb.createdAt).toISOString().split('T')[0] === dateString).length;
        const flightCount = allFlightBookings.filter(fb => fb.createdAt && new Date(fb.createdAt).toISOString().split('T')[0] === dateString).length;

        bookingsTrend.push({
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          bookings: tourCount + carCount + flightCount
        });
      }

      // Merge and retrieve the 10 most recent activities
      const combinedActivities = [
        ...allBookings.map(b => ({
          id: `tour-${b.id}`,
          type: 'Tour/Package',
          customerName: b.userName,
          item: b.tourId ? `Tour #${b.tourId}` : `Package #${b.packageId}`,
          date: b.travelDate,
          createdAt: b.createdAt || new Date(),
          status: b.status,
        })),
        ...allCarBookings.map(cb => {
          const c = allCars.find(x => x.id === cb.carId);
          return {
            id: `car-${cb.id}`,
            type: 'Car Rental',
            customerName: cb.customerName,
            item: c ? c.name : `Car #${cb.carId}`,
            date: `${cb.pickupDate} to ${cb.returnDate}`,
            createdAt: cb.createdAt || new Date(),
            status: cb.status,
          };
        }),
        ...allFlightBookings.map(fb => ({
          id: `flight-${fb.id}`,
          type: 'Flight',
          customerName: fb.passengerName,
          item: `Flight #${fb.flightId}`,
          date: fb.createdAt ? new Date(fb.createdAt).toISOString().split('T')[0] : '',
          createdAt: fb.createdAt || new Date(),
          status: fb.status,
        }))
      ];

      combinedActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const recentActivity = combinedActivities.slice(0, 10);

      res.json({
        totalCustomers: allProfiles.length,
        totalBookings: totalBookingsCount,
        totalRevenue,
        activeToursCount: activeTours.length,
        carsAvailableCount: availableCars.length,
        totalBlogsCount: (getBlogsData().articles || []).length,
        loggedInUsersToday,
        bookingsTrend,
        recentActivity
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 3. Tours CRUD

  app.post('/api/admin/upload', (req, res) => {
    try {
      const { image } = req.body;
      if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Invalid image format' });
      }
      const matches = image.match(/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,([\s\S]+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid base64 payload' });
      }
      let rawExt = matches[1].toLowerCase();
      if (rawExt.includes('svg')) rawExt = 'svg';
      const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
      const buffer = Buffer.from(matches[2].trim(), 'base64');
      const filename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext;

      const publicUploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
      const distUploadPath = path.join(process.cwd(), 'dist', 'uploads', filename);

      fs.writeFileSync(publicUploadPath, buffer);
      try {
        const distDir = path.dirname(distUploadPath);
        if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
        fs.writeFileSync(distUploadPath, buffer);
      } catch (_) { }

      res.json({ url: '/uploads/' + filename });
    } catch (err) {
      console.error('Upload endpoint error:', err);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  // Database Backup and Auto-Restore Endpoints
  app.get('/api/admin/backup', (req, res) => {
    try {
      const data = loadLocalData();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/backup', async (req, res) => {
    try {
      const newData = req.body;
      if (!newData || typeof newData !== 'object') {
        return res.status(400).json({ error: 'Invalid backup payload' });
      }
      const payload = newData.data && (newData.data.tours || newData.data.hotels || newData.data.blogs) ? newData.data : newData;
      saveLocalData(payload);

      try {
        if (Array.isArray(payload.tours)) {
          await db.delete(tours);
          if (payload.tours.length > 0) await db.insert(tours).values(payload.tours);
        }
        if (Array.isArray(payload.hotels)) {
          await db.delete(hotels);
          if (payload.hotels.length > 0) await db.insert(hotels).values(payload.hotels);
        }
        if (Array.isArray(payload.flights)) {
          await db.delete(flights);
          if (payload.flights.length > 0) await db.insert(flights).values(payload.flights);
        }
        if (Array.isArray(payload.packages)) {
          await db.delete(packages);
          if (payload.packages.length > 0) await db.insert(packages).values(payload.packages);
        }
        if (Array.isArray(payload.cars)) {
          await db.delete(cars);
          if (payload.cars.length > 0) await db.insert(cars).values(payload.cars);
        }
      } catch (dbErr) {
        console.warn('SQLite restore sync warning:', dbErr);
      }

      broadcastSse('catalog-updated', { type: 'backup-restored' });
      res.json({ success: true, message: 'Database updated and backed up successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Automated 24-Hour Snapshot Helper
  const createDailySnapshot = async (triggerName: string = '24h_scheduled_trigger') => {
    try {
      const dbData = loadLocalData();
      if (!Array.isArray(dbData.snapshots)) {
        dbData.snapshots = [];
      }

      const toursData = await getTours();
      const hotelsData = await getHotels();
      const flightsData = await getFlights();
      const carsData = await getCars();
      const packagesData = await getPackages();
      const blogsData = getBlogsData();

      const snapshotRecord = {
        id: `snap_${Date.now()}`,
        createdAt: new Date().toISOString(),
        trigger: triggerName,
        counts: {
          tours: toursData?.length || 0,
          hotels: hotelsData?.length || 0,
          flights: flightsData?.length || 0,
          packages: packagesData?.length || 0,
          cars: carsData?.length || 0,
          blogs: blogsData?.articles?.length || 0
        },
        data: {
          tours: toursData || [],
          hotels: hotelsData || [],
          flights: flightsData || [],
          packages: packagesData || [],
          cars: carsData || [],
          blogs: blogsData?.articles || [],
          blogCategories: blogsData?.categories || []
        }
      };

      const todayDate = new Date().toISOString().split('T')[0];
      if (dbData.snapshots.length > 0 && dbData.snapshots[0].createdAt.startsWith(todayDate)) {
        snapshotRecord.id = dbData.snapshots[0].id;
        dbData.snapshots[0] = snapshotRecord;
      } else {
        dbData.snapshots.unshift(snapshotRecord);
        if (dbData.snapshots.length > 30) {
          dbData.snapshots = dbData.snapshots.slice(0, 30);
        }
      }

      saveLocalData(dbData);
      console.log(`[24H SNAPSHOT] Created snapshot ${snapshotRecord.id} with ${snapshotRecord.counts.tours} tours, ${snapshotRecord.counts.hotels} hotels, ${snapshotRecord.counts.flights} flights, ${snapshotRecord.counts.blogs} blogs.`);
      return snapshotRecord;
      return snapshotRecord;
    } catch (e) {
      console.error('[24H SNAPSHOT] Failed to create snapshot:', e);
      return null;
    }
  };

  // Create initial snapshot if none exists
  const initialData = loadLocalData();
  if (!initialData.snapshots || initialData.snapshots.length === 0) {
    createDailySnapshot().catch(console.error);
  }

  // Schedule automatic 24-hour snapshot (24 * 60 * 60 * 1000 ms)
  setInterval(() => {
    createDailySnapshot().catch(console.error);
  }, 24 * 60 * 60 * 1000);

  // Snapshot API endpoints
  app.get('/api/admin/snapshots', async (req, res) => {
    try {
      // Auto-trigger snapshot to ensure real-time data on the tab
      await createDailySnapshot('realtime_view_trigger');
      const data = loadLocalData();
      res.json(data.snapshots || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/snapshots/trigger', async (req, res) => {
    try {
      const snap = await createDailySnapshot('manual_trigger');
      broadcastSse('catalog-updated', { type: 'snapshot-triggered' });
      res.json({ success: true, snapshot: snap });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/snapshots/restore/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = loadLocalData();
      const targetSnap = (data.snapshots || []).find((s: any) => s.id === id);
      if (!targetSnap) {
        return res.status(404).json({ error: 'Snapshot not found' });
      }
      if (targetSnap.data) {
        try {
          if (Array.isArray(targetSnap.data.tours)) {
            await db.delete(tours);
            if (targetSnap.data.tours.length > 0) await db.insert(tours).values(targetSnap.data.tours);
          }
          if (Array.isArray(targetSnap.data.hotels)) {
            await db.delete(hotels);
            if (targetSnap.data.hotels.length > 0) await db.insert(hotels).values(targetSnap.data.hotels);
          }
          if (Array.isArray(targetSnap.data.flights)) {
            await db.delete(flights);
            if (targetSnap.data.flights.length > 0) await db.insert(flights).values(targetSnap.data.flights);
          }
          if (Array.isArray(targetSnap.data.packages)) {
            await db.delete(packages);
            if (targetSnap.data.packages.length > 0) await db.insert(packages).values(targetSnap.data.packages);
          }
          if (Array.isArray(targetSnap.data.cars)) {
            await db.delete(cars);
            if (targetSnap.data.cars.length > 0) await db.insert(cars).values(targetSnap.data.cars);
          }
        } catch (dbErr) {
          console.warn('DB Sync warning during restore:', dbErr);
        }
        if (targetSnap.data.blogs) {
          const currentData = loadLocalData();
          currentData.blogs = targetSnap.data.blogs;
          if (targetSnap.data.blogCategories) {
            currentData.blogCategories = targetSnap.data.blogCategories;
          }
          saveLocalData(currentData);
        }
      }
      broadcastSse('catalog-updated', { type: 'snapshot-restored' });
      res.json({ success: true, message: `Successfully restored database to snapshot ${id}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/snapshots/restore-upload', async (req, res) => {
    try {
      const payload = req.body;

      try {
        if (Array.isArray(payload.tours)) {
          await db.delete(tours);
          if (payload.tours.length > 0) await db.insert(tours).values(payload.tours);
        }
        if (Array.isArray(payload.hotels)) {
          await db.delete(hotels);
          if (payload.hotels.length > 0) await db.insert(hotels).values(payload.hotels);
        }
        if (Array.isArray(payload.flights)) {
          await db.delete(flights);
          if (payload.flights.length > 0) await db.insert(flights).values(payload.flights);
        }
        if (Array.isArray(payload.packages)) {
          await db.delete(packages);
          if (payload.packages.length > 0) await db.insert(packages).values(payload.packages);
        }
        if (Array.isArray(payload.cars)) {
          await db.delete(cars);
          if (payload.cars.length > 0) await db.insert(cars).values(payload.cars);
        }
      } catch (dbErr) {
        console.warn('DB Sync warning during restore-upload:', dbErr);
      }

      if (payload.blogs) {
        const currentData = loadLocalData();
        currentData.blogs = payload.blogs;
        if (payload.blogCategories) {
          currentData.blogCategories = payload.blogCategories;
        }
        saveLocalData(currentData);
      }

      broadcastSse('catalog-updated', { type: 'snapshot-restored' });
      res.json({ success: true, message: 'Database restored successfully from upload' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/admin/tours', async (req, res) => {
    try {
      const data = await db.select().from(tours).orderBy(desc(tours.id));
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/tours', async (req, res) => {
    try {
      const { title, description, imageUrl, duration, price, itinerary, category, status, maxGuests, galleryImages } = req.body;
      const result = await db.insert(tours).values({
        title,
        description,
        imageUrl,
        duration,
        price: parseInt(price, 10) || 0,
        itinerary: typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary || []),
        category,
        status: status || 'Active',
        maxGuests: parseInt(maxGuests, 10) || 10,
        galleryImages: typeof galleryImages === 'string' ? galleryImages : JSON.stringify(galleryImages || [])
      }).returning();
      res.status(201).json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/tours/:id', async (req, res) => {
    try {
      const rawId = req.params.id;
      const id = isNaN(parseInt(rawId, 10)) ? rawId : parseInt(rawId, 10);
      const { title, description, imageUrl, duration, price, itinerary, category, status, maxGuests, galleryImages } = req.body;
      const result = await db.update(tours)
        .set({
          title,
          description,
          imageUrl,
          duration,
          price: parseInt(price, 10) || 0,
          itinerary: typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary || []),
          category,
          status,
          maxGuests: parseInt(maxGuests, 10) || 10,
          galleryImages: typeof galleryImages === 'string' ? galleryImages : JSON.stringify(galleryImages || [])
        })
        .where(eq(tours.id, id as any))
        .returning();
      res.json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/tours/:id', async (req, res) => {
    try {
      const rawId = req.params.id;
      const id = isNaN(parseInt(rawId, 10)) ? rawId : parseInt(rawId, 10);
      await db.delete(bookings).where(eq(bookings.tourId, id as any));
      const result = await db.delete(tours).where(eq(tours.id, id as any)).returning();
      res.json({ success: true, deleted: result[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4. Cars CRUD
  app.get('/api/admin/cars', async (req, res) => {
    try {
      const data = await db.select().from(cars).orderBy(desc(cars.id));
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/cars', async (req, res) => {
    try {
      const { name, category, seats, transmission, pricePerDay, imageUrl, status } = req.body;
      const result = await db.insert(cars).values({
        name,
        category,
        seats: parseInt(seats, 10) || 4,
        transmission,
        pricePerDay: parseInt(pricePerDay, 10) || 0,
        imageUrl,
        status: status || 'Available'
      }).returning();
      res.status(201).json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/cars/:id', async (req, res) => {
    try {
      const rawId = req.params.id;
      const id = isNaN(parseInt(rawId, 10)) ? rawId : parseInt(rawId, 10);
      const { name, category, seats, transmission, pricePerDay, imageUrl, status } = req.body;
      const result = await db.update(cars)
        .set({
          name,
          category,
          seats: parseInt(seats, 10) || 4,
          transmission,
          pricePerDay: parseInt(pricePerDay, 10) || 0,
          imageUrl,
          status
        })
        .where(eq(cars.id, id as any))
        .returning();
      res.json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/cars/:id', async (req, res) => {
    try {
      const rawId = req.params.id;
      const id = isNaN(parseInt(rawId, 10)) ? rawId : parseInt(rawId, 10);
      await db.delete(carBookings).where(eq(carBookings.carId, id as any));
      const result = await db.delete(cars).where(eq(cars.id, id as any)).returning();
      res.json({ success: true, deleted: result[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 5. Flights CRUD
  app.get('/api/admin/flights', async (req, res) => {
    try {
      const data = await db.select().from(flights).orderBy(desc(flights.id));
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/flights', async (req, res) => {
    try {
      const { airline, fromCity, toCity, departureTime, arrivalTime, price, stops } = req.body;
      const result = await db.insert(flights).values({
        airline,
        fromCity,
        toCity,
        departureTime,
        arrivalTime,
        price: parseInt(price, 10) || 0,
        stops: parseInt(stops, 10) || 0
      }).returning();
      res.status(201).json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/flights/:id', async (req, res) => {
    try {
      const rawId = req.params.id;
      const id = isNaN(parseInt(rawId, 10)) ? rawId : parseInt(rawId, 10);
      const { airline, fromCity, toCity, departureTime, arrivalTime, price, stops } = req.body;
      const result = await db.update(flights)
        .set({
          airline,
          fromCity,
          toCity,
          departureTime,
          arrivalTime,
          price: parseInt(price, 10) || 0,
          stops: parseInt(stops, 10) || 0
        })
        .where(eq(flights.id, id as any))
        .returning();
      res.json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/flights/:id', async (req, res) => {
    try {
      const rawId = req.params.id;
      const id = isNaN(parseInt(rawId, 10)) ? rawId : parseInt(rawId, 10);
      await db.delete(flightBookings).where(eq(flightBookings.flightId, id as any));
      const result = await db.delete(flights).where(eq(flights.id, id as any)).returning();
      res.json({ success: true, deleted: result[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 5b. Hotels CRUD
  app.get('/api/admin/hotels', async (req, res) => {
    try {
      const data = await db.select().from(hotels).orderBy(desc(hotels.id));
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/hotels', async (req, res) => {
    try {
      const { name, location, price, starRating, description, amenities, imageUrl } = req.body;
      const result = await db.insert(hotels).values({
        name,
        location,
        price: parseInt(price, 10) || 0,
        starRating: parseInt(starRating, 10) || 5,
        description: description || '',
        amenities: Array.isArray(amenities) ? amenities : (amenities ? String(amenities).split(',').map((s: string) => s.trim()) : []),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      }).returning();
      res.status(201).json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/hotels/:id', async (req, res) => {
    try {
      const rawId = req.params.id;
      const id = isNaN(parseInt(rawId, 10)) ? rawId : parseInt(rawId, 10);
      const { name, location, price, starRating, description, amenities, imageUrl } = req.body;
      const result = await db.update(hotels)
        .set({
          name,
          location,
          price: parseInt(price, 10) || 0,
          starRating: parseInt(starRating, 10) || 5,
          description: description || '',
          amenities: Array.isArray(amenities) ? amenities : (amenities ? String(amenities).split(',').map((s: string) => s.trim()) : []),
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
        })
        .where(eq(hotels.id, id))
        .returning();
      res.json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/hotels/:id', async (req, res) => {
    try {
      const rawId = req.params.id;
      const id = isNaN(parseInt(rawId, 10)) ? rawId : parseInt(rawId, 10);
      await db.delete(hotelBookings).where(eq(hotelBookings.hotelId, id));
      const result = await db.delete(hotels).where(eq(hotels.id, id)).returning();
      res.json({ success: true, deleted: result[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 5b. Blog Articles & Categories API
  app.get('/api/blogs', (req, res) => {
    try {
      const data = getBlogsData();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/blogs', (req, res) => {
    try {
      const data = getBlogsData();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/blogs/performance', (req, res) => {
    try {
      const stats = getBlogPerformanceStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/blogs/:id/view', (req, res) => {
    try {
      const { id } = req.params;
      const updatedArticles = incrementBlogView(id);
      broadcastSse('catalog-updated', { type: 'blog-viewed', id });
      res.json({ success: true, articles: updatedArticles });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/blogs/:id/like', (req, res) => {
    try {
      const { id } = req.params;
      const updatedArticles = incrementBlogLike(id);
      broadcastSse('catalog-updated', { type: 'blog-liked', id });
      res.json({ success: true, articles: updatedArticles });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/blogs/simulate-engagement', (req, res) => {
    try {
      const { articles } = getBlogsData();
      if (articles.length > 0) {
        const randomArticle = articles[Math.floor(Math.random() * articles.length)];
        incrementBlogView(randomArticle.id);
        if (Math.random() > 0.4) incrementBlogLike(randomArticle.id);
        broadcastSse('catalog-updated', { type: 'blog-engagement-simulated', id: randomArticle.id });
      }
      const stats = getBlogPerformanceStats();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/blogs', (req, res) => {
    try {
      const updatedArticles = saveBlogArticle(req.body);
      broadcastSse('catalog-updated', { type: 'blog-created' });
      res.json({ success: true, articles: updatedArticles });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/blogs/:id', (req, res) => {
    try {
      const rawId = req.params.id;
      const id = isNaN(parseInt(rawId, 10)) ? rawId : parseInt(rawId, 10);
      const articleData = { ...req.body, id };
      const updatedArticles = saveBlogArticle(articleData);
      broadcastSse('catalog-updated', { type: 'blog-updated' });
      res.json({ success: true, articles: updatedArticles });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/admin/blogs/:id', (req, res) => {
    try {
      const rawId = req.params.id;
      const id = isNaN(parseInt(rawId, 10)) ? rawId : parseInt(rawId, 10);
      const updatedArticles = deleteBlogArticle(id);
      broadcastSse('catalog-updated', { type: 'blog-deleted' });
      res.json({ success: true, articles: updatedArticles });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/blog-categories/:id', (req, res) => {
    try {
      const catId = req.params.id;
      const { image } = req.body;
      const updatedCategories = updateBlogCategoryImage(catId, image);
      broadcastSse('catalog-updated', { type: 'blog-category-updated' });
      res.json({ success: true, categories: updatedCategories });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 6. Bookings CRUD & Lists
  app.get('/api/admin/bookings', async (req, res) => {
    try {
      const allTours = await db.select().from(tours);
      const allCars = await db.select().from(cars);
      const allFlights = await db.select().from(flights);

      const tourBookingsData = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
      const carBookingsData = await db.select().from(carBookings).orderBy(desc(carBookings.createdAt));
      const flightBookingsData = await db.select().from(flightBookings).orderBy(desc(flightBookings.createdAt));

      // Enrich Tour Bookings
      const tourBookingsEnriched = tourBookingsData.map(b => {
        const t = b.tourId ? allTours.find(x => x.id === b.tourId) : null;
        return {
          ...b,
          itemName: t ? t.title : (b.packageId ? `Package #${b.packageId}` : 'Unknown Item'),
          itemPrice: t ? t.price : 0
        };
      });

      // Enrich Car Bookings
      const carBookingsEnriched = carBookingsData.map(cb => {
        const c = allCars.find(x => x.id === cb.carId);
        return {
          ...cb,
          itemName: c ? c.name : `Car #${cb.carId}`,
          itemPrice: c ? c.pricePerDay : 0,
          imageUrl: c ? c.imageUrl : ''
        };
      });

      // Enrich Flight Bookings
      const flightBookingsEnriched = flightBookingsData.map(fb => {
        const f = allFlights.find(x => x.id === fb.flightId);
        return {
          ...fb,
          itemName: f ? `${f.airline} (${f.fromCity} ➔ ${f.toCity})` : `Flight #${fb.flightId}`,
          itemPrice: f ? f.price : 0
        };
      });

      // Enrich Hotel Bookings
      const hotelBookingsData = await db.select().from(hotelBookings).orderBy(desc(hotelBookings.createdAt));
      const allHotels = await db.select().from(hotels);
      const hotelBookingsEnriched = hotelBookingsData.map(hb => {
        const h = allHotels.find(x => x.id === hb.hotelId);
        return {
          ...hb,
          itemName: h ? h.name : `Hotel #${hb.hotelId}`,
          itemPrice: h ? h.price : 0
        };
      });

      res.json({
        tourBookings: tourBookingsEnriched,
        carBookings: carBookingsEnriched,
        flightBookings: flightBookingsEnriched,
        hotelBookings: hotelBookingsEnriched
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/bookings/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      const result = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();

      // Broadcast real-time status update to SSE subscribers
      broadcastSse('booking-updated', { type: 'tours', id, status });

      res.json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/car-bookings/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      const result = await db.update(carBookings).set({ status }).where(eq(carBookings.id, id)).returning();

      // Broadcast real-time status update to SSE subscribers
      broadcastSse('booking-updated', { type: 'cars', id, status });

      res.json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/flight-bookings/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      const result = await db.update(flightBookings).set({ status }).where(eq(flightBookings.id, id)).returning();

      // Broadcast real-time status update to SSE subscribers
      broadcastSse('booking-updated', { type: 'flights', id, status });

      res.json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/hotel-bookings/:id/status', async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const result = await db.update(hotelBookings).set({ status }).where(eq(hotelBookings.id, id)).returning();

      // Broadcast real-time status update to SSE subscribers
      broadcastSse('booking-updated', { type: 'hotels', id, status });

      res.json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 7. Customers list (Combines registered accounts + guest log data)
  app.get('/api/admin/customers', async (req, res) => {
    try {
      const statsProfiles = await getAllProfilesWithStats();
      const allBookings = await db.select().from(bookings);
      const allCarBookings = await db.select().from(carBookings);
      const allFlightBookings = await db.select().from(flightBookings);

      const registeredEmails = new Set(statsProfiles?.map(p => p.email.toLowerCase().trim()) || []);
      const guestCustomersMap = new Map<string, any>();

      const allTours = await db.select().from(tours);
      const allCars = await db.select().from(cars);
      const allFlights = await db.select().from(flights);

      const addGuest = (email: string, name: string, phone: string, type: string, amount: number, date: string, status: string) => {
        const lowerEmail = email.toLowerCase().trim();
        if (!lowerEmail || registeredEmails.has(lowerEmail)) return;
        if (!guestCustomersMap.has(lowerEmail)) {
          guestCustomersMap.set(lowerEmail, {
            id: 'guest-' + lowerEmail,
            fullName: name || 'Guest Customer',
            email: lowerEmail,
            phone: phone || 'N/A',
            role: 'customer',
            createdAt: new Date(),
            lastLoginAt: null,
            bookingsCount: 0,
            totalSpend: 0,
            loginCount: 0,
            loginHistory: []
          });
        }
        const g = guestCustomersMap.get(lowerEmail);
        g.bookingsCount += 1;
        g.totalSpend += amount;
      };

      for (const b of allBookings) {
        let price = 0;
        if (b.tourId) {
          const t = allTours.find(x => x.id === b.tourId);
          if (t) price = (t.price || 0) * (b.guests || 1);
        }
        addGuest(b.email, b.userName, b.phone, 'Tour/Package', price, b.travelDate, b.status);
      }

      for (const cb of allCarBookings) {
        let price = 0;
        const c = allCars.find(x => x.id === cb.carId);
        if (c) {
          const start = new Date(cb.pickupDate);
          const end = new Date(cb.returnDate);
          const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
          price = (c.pricePerDay || 0) * diffDays;
        }
        const mockEmail = cb.customerName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@rental-guest.com';
        addGuest(mockEmail, cb.customerName, 'N/A', 'Car Rental', price, `${cb.pickupDate} to ${cb.returnDate}`, cb.status);
      }

      for (const fb of allFlightBookings) {
        let price = 0;
        const f = allFlights.find(x => x.id === fb.flightId);
        if (f) price = f.price || 0;
        addGuest(fb.email, fb.passengerName, fb.phone, 'Flight', price, fb.createdAt ? new Date(fb.createdAt).toISOString().split('T')[0] : '', fb.status);
      }

      const merged = [
        ...(statsProfiles || []),
        ...Array.from(guestCustomersMap.values())
      ];

      res.json(merged);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 8. Messages list
  app.get('/api/admin/messages', async (req, res) => {
    try {
      const data = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/admin/messages/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      const result = await db.update(contactMessages).set({ status }).where(eq(contactMessages.id, id)).returning();
      res.json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 9. Subscribers list
  app.get('/api/admin/subscribers', async (req, res) => {
    try {
      const data = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 10. User Role Update
  app.put('/api/admin/users/role', async (req, res) => {
    try {
      const { uid, email, role, fullName, phone } = req.body;
      const userUid = (uid && !uid.startsWith('guest-')) ? uid : (email ? `user-${email.toLowerCase().replace(/[^a-z0-9]/g, '')}` : `user-${Date.now()}`);
      
      const updated = await createOrUpdateProfile(userUid, {
        fullName: fullName || 'User',
        email: email || '',
        phone: phone || '',
        role: role || 'customer'
      });
      
      if (uid && !uid.startsWith('guest-')) {
        await updateUserRecord(uid, { role });
      }

      broadcastSse('user-role-updated', { uid: userUid, email, role });
      res.json({ success: true, profile: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Database Export Endpoint (Retrieve all database data across all tables/collections)
  app.get(['/api/db/export', '/api/admin/db-all'], async (req, res) => {
    try {
      const data = loadLocalData();
      const summary: Record<string, number> = {};
      for (const [k, v] of Object.entries(data)) {
        if (Array.isArray(v)) {
          summary[k] = v.length;
        }
      }
      res.json({
        success: true,
        useMongo: Boolean(process.env.MONGODB_URI),
        collectionsCount: Object.keys(summary).length,
        summary,
        data
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Endpoint to create Hostinger Deployment ZIP package
  app.get('/api/make-hostinger-zip', async (req, res) => {
    try {
      // @ts-ignore
      const archiverModule = await import('archiver');
      const archiver = archiverModule.default || archiverModule;
      const zipPath = path.join(process.cwd(), 'Premier-Tour-Booking-Hostinger-Deployment.zip');
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        console.log(`✅ Success! Created Hostinger Deployment ZIP: ${zipPath}`);
        res.json({
          success: true,
          message: 'Hostinger Deployment ZIP created successfully!',
          sizeMB: (archive.pointer() / 1024 / 1024).toFixed(2),
          zipPath
        });
      });

      archive.on('error', (err: any) => {
        console.error('ZIP Error:', err);
        res.status(500).json({ error: err.message });
      });

      archive.pipe(output);

      const files = ['.env', '.env.example', 'Hostinger_Deployment_Guide.md', 'package.json', 'package-lock.json', 'vite.config.ts', 'tsconfig.json', 'index.html', 'server.ts', 'seed_data.json'];
      files.forEach(f => {
        const fp = path.join(process.cwd(), f);
        if (fs.existsSync(fp)) archive.file(fp, { name: f });
      });

      if (fs.existsSync(path.join(process.cwd(), 'dist'))) archive.directory(path.join(process.cwd(), 'dist'), 'dist');
      if (fs.existsSync(path.join(process.cwd(), 'src'))) archive.directory(path.join(process.cwd(), 'src'), 'src');
      if (fs.existsSync(path.join(process.cwd(), 'public'))) archive.directory(path.join(process.cwd(), 'public'), 'public');

      await archive.finalize();
    } catch (err: any) {
      console.error('API Error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for assets serving in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          ignored: ['**/src/db/*.json', '**/seed_data*.json', '**/dist/**']
        }
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

