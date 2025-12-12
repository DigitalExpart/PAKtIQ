# 🎯 Fix Splash Screen - Follow These Steps

## ✅ What I've Done
1. Updated app version from `1.0.0` → `1.0.1` (forces Expo to regenerate)
2. Added `expo-splash-screen` plugin to `app.json`
3. Cleared `.expo` cache

## 📋 What YOU Need to Do Now

### Step 1: Install the Splash Screen Package
```bash
npm install expo-splash-screen
```

### Step 2: Stop Expo Server
Press `Ctrl+C` in the terminal where Expo is running

### Step 3: Clear Everything and Restart
```bash
# Remove .expo cache
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue

# Start with cleared cache
npm start -- --clear --reset-cache
```

### Step 4: In Expo Go App
1. **Shake your device** (or long-press menu button on Android)
2. Select **"Reload"** 
3. **OR** close Expo Go completely and reopen it

### Step 5: Scan QR Code Again
- Scan the new QR code that appears
- Expo should now regenerate the splash screen with your logo

---

## 🔧 Alternative: If Still Not Working

If the above doesn't work, try generating native splash assets:

```bash
# Prebuild generates native splash screens
npx expo prebuild --clean

# Then rebuild (NOTE: This requires Android Studio/Xcode)
npm run android
```

**But this means you can't use Expo Go anymore** - you'd need to run a development build.

---

## 🎨 Verify Your Splash File

Make sure `assets/splash.png` shows:
- ✅ Blue checkmark in blue square outline
- ✅ "Resolute Plan" text
- ❌ NOT the green placeholder square

---

## ⚡ Quick Commands (Copy & Paste)

```bash
npm install expo-splash-screen
npm start -- --clear --reset-cache
```

Then reload in Expo Go!

---

**The version change + plugin should force Expo to regenerate your splash screen! 🚀**
