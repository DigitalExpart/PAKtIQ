# 🔧 Fix: Expo App Authentication & Database Connection

## ❌ **The Problem**

You're experiencing two issues:
1. **No sign-up/sign-in screen shows** in your Expo app
2. **Pakts you create don't save** to the database

## 🔍 **Root Cause**

The Supabase client is configured for **Vite (web)** but **not for Expo (mobile)**:

```typescript
// src/lib/supabase.ts - ONLY WORKS FOR WEB!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;  // ❌ Expo doesn't support this
```

This means:
- ❌ Supabase can't connect in Expo
- ❌ Authentication doesn't work
- ❌ Database operations fail silently
- ❌ Your pakts never reach the database

---

## ✅ **The Fix**

I've created two files:

### 1. **`src/lib/supabase.native.ts`** (for Expo/React Native)
✅ Created - Uses `expo-constants` to load environment variables

### 2. **Updated `app.json`** with Supabase credentials
✅ Added `extra.supabaseUrl` and `extra.supabaseAnonKey`

---

## 🚀 **What You Need to Do Now**

### **Step 1: Stop the Expo Server**

In your terminal where Expo is running, press **`Ctrl+C`** to stop it.

### **Step 2: Create `.env` File**

Create a file named **`.env`** (no extension) in your project root:

```bash
# File: .env (in project root)
EXPO_PUBLIC_SUPABASE_URL=https://mirpnmrsjjmmiqbbawab.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnBubXJzamptbWlxYmJhd2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjQ5NDcsImV4cCI6MjA4MDMwMDk0N30.0INXVgxZsdjsD0DL8Ot_Q3RfYPqwBwz5O1_E6Lu4q9g
```

### **Step 3: Update Service Files to Use Platform-Specific Supabase**

I need to update all service files to import the correct Supabase client based on platform. 

Let me do this now...

### **Step 4: Restart Expo**

```bash
npm start
```

Then scan the QR code again.

---

## 📱 **What Will Happen After Fix**

1. **Open app** → See **Welcome Screen**
2. Click **"Get Started"** → See **AuthScreen** (purple gradient with email/password)
3. **Sign up** with:
   - Email: `yourname@example.com`
   - Password: `YourPassword123!`
4. **Profile created** in Supabase automatically
5. **Create pakt** → Saves to database ✓
6. **View in Supabase** → See your pakt in `pakts` table ✓

---

## 🔧 **Technical Details**

### **Problem:**
- Vite uses `import.meta.env.VITE_*` for environment variables
- Expo uses `process.env.EXPO_PUBLIC_*` or `Constants.expoConfig.extra.*`
- These are **incompatible**!

### **Solution:**
- Created `supabase.native.ts` for Expo/mobile
- Keep `supabase.ts` for Vite/web
- Services will import the correct one based on platform

---

## ⏳ **Status: IN PROGRESS**

I'm now updating the service files to use the correct Supabase client...

