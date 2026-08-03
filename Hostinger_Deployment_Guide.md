# Hostinger Node.js & MongoDB Deployment Guide — Premier Tour Booking

Follow these step-by-step instructions to deploy your Premier Tour Booking application to **Hostinger Node.js Hosting** or **Hostinger VPS** without build or extraction errors.

---

## 🛑 Root Cause of Previous Hostinger Build Error (`TAR_ENTRY_ERROR / Error -122`)

If your Hostinger deployment previously failed with:
`npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, lstat ... node_modules/...`
`Unknown system error -122`

**Why this occurred:**
1. **Zipping `node_modules`**: Uploading a ZIP file that includes the local `node_modules` folder triggers Hostinger file quota / inode limits and path length errors (`Error -122`) when Hostinger extracts the archive on Linux.
2. **Unseparated Dev Dependencies**: Build tools like Vite, TypeScript, and Tailwind were listed in `dependencies`.

**What has been fixed in this codebase:**
- `package.json` was reorganized to separate dev tools from runtime dependencies (`express`, `mongodb`, `mongoose`, `stripe`, `jsonwebtoken`, `bcryptjs`, etc.).
- `create-deploy-zip.js` script packages pre-built `dist/` and clean source code while **excluding `node_modules`**.

---

## 1. How to Generate the Clean Deployment ZIP

Open your terminal in the project directory and run:

```bash
node create-deploy-zip.js
```

This generates **`Premier-Tour-Booking-Hostinger-Deployment.zip`** in the root directory.

---

## 2. Step-by-Step Hostinger hPanel Deployment

1. **Log in to Hostinger hPanel** (`hpanel.hostinger.com`).
2. Navigate to **Websites** -> Select **`theluxuryesp.com`** -> **Node.js Applications** (or **Deployments** / **File Manager**).
3. Upload `Premier-Tour-Booking-Hostinger-Deployment.zip` to your website's root folder (`/` or `/public_html`).
4. **Extract** the ZIP file directly inside Hostinger File Manager.
5. In the Hostinger Node.js Dashboard, configure the following settings:
   - **Node.js Version**: `18.x`, `20.x`, or `22.x`
   - **Application Mode**: `Production`
   - **Application Root**: `/`
   - **Application Startup File**: `dist/server.cjs`
6. Click **Run NPM Install** (or allow Hostinger's automatic dependency installation).
7. Click **Start App** / **Redeploy**.

---

## 3. MongoDB Atlas Configuration

In your `.env` file (or Hostinger Environment Variables settings), ensure your database connection string and secret key are set:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://kumudevops_db_user:YOUR_REAL_PASSWORD_HERE@cluster0.z1bggci.mongodb.net/?appName=Cluster0
JWT_SECRET=premier_tour_luxury_secret_key_2026_hostinger
```

> **Note**: If MongoDB Atlas is connecting for the first time, Premier Tour Booking automatically seeds initial data and admin credentials so your site is ready immediately!

---

## 4. Pre-Configured Administrator Credentials

- **Admin Control Panel**: [https://theluxuryesp.com/admin](https://theluxuryesp.com/admin)
- **Admin Email**: `admin@gmail.com`
- **Admin Password**: `admin2005`

---

## 5. Key Features Active in Production Bundle

✅ **Pre-compiled Static & Express Bundle** (`dist/` + `dist/server.cjs`)  
✅ **Dynamic Payment Gateway** (Stripe, PayHere Sri Lanka LKR, PayPal Express, Pay on Arrival)  
✅ **Profile Picture & Avatar Storage** (`POST /api/upload`)  
✅ **Interactive Sri Lanka Map & Destination Explorer**  
✅ **11 High-Value SEO Keywords Grid & Metadata**  
✅ **Clean Production Dependency Footprint (Zero `node_modules` file extraction error)**  

