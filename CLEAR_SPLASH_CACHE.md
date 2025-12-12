# Clear Splash Screen Cache - Instructions

The splash screen is cached by Expo. Follow these steps to see your new logo:

## Method 1: Full Cache Clear (Recommended)

### Step 1: Stop Expo Server
Press `Ctrl+C` in the terminal where Expo is running

### Step 2: Clear All Caches
```bash
# Clear Expo cache
rm -rf .expo

# Clear Metro bundler cache
npm start -- --reset-cache

# Or on Windows PowerShell:
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
npm start -- --reset-cache
```

### Step 3: Clear Expo Go App Cache (On Your Device)

**For Android:**
1. Open Settings → Apps → Expo Go
2. Tap "Storage" or "Storage & cache"
3. Tap "Clear cache" and "Clear data"
4. Reopen Expo Go

**For iOS:**
1. Delete the Expo Go app
2. Reinstall it from App Store
3. Scan QR code again

### Step 4: Restart Expo
```bash
npm start -- --clear
```

Then scan the QR code again in Expo Go.

---

## Method 2: Rebuild Native App (For Development Builds)

If you're using a development build (not Expo Go):

```bash
# For Android
npm run android -- --clear

# For iOS  
npm run ios -- --clear
```

---

## Method 3: Force Asset Regeneration

Expo needs to regenerate the splash screen. Try this:

```bash
# Stop server (Ctrl+C)

# Delete .expo folder
rm -rf .expo

# Regenerate assets
npx expo prebuild --clean

# Restart
npm start -- --clear
```

---

## Quick Fix (Try This First)

1. **Stop Expo server** (Ctrl+C)
2. **Run:**
   ```bash
   npm start -- --clear --reset-cache
   ```
3. **In Expo Go app on your device:**
   - Shake device or long-press on Android
   - Select "Reload" or "Refresh"
   - Or close and reopen Expo Go completely

---

## If Still Not Working

The splash screen might be cached in Expo Go. Try:

1. **Uninstall Expo Go** completely
2. **Reinstall** from App Store/Play Store  
3. **Start fresh** with:
   ```bash
   npm start -- --clear
   ```
4. **Scan QR code** again

---

## Verify Logo File

Make sure your logo file is correct:
- File: `assets/splash.png`
- Should show the blue checkmark logo with "Resolute Plan" text
- Size: Should be at least 1242x2436px for best quality

---

**After clearing cache, the new logo should appear! 🎉**
