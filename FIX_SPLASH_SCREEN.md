# Fix Splash Screen in Expo Go

## The Problem
Expo Go generates splash screens server-side, so changing local files doesn't immediately update. You need to force Expo to regenerate the splash screen.

## Solution 1: Update Version (Easiest) ✅ DONE

I've updated your `app.json` version from `1.0.0` to `1.0.1`. This forces Expo to regenerate assets.

**Now do this:**

1. **Stop Expo server** (Ctrl+C)

2. **Clear all caches:**
   ```bash
   # Windows PowerShell
   Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
   npm start -- --clear --reset-cache
   ```

3. **In Expo Go app:**
   - Shake device (or long-press menu button)
   - Select "Reload"
   - OR close Expo Go completely and reopen it

4. **Scan the QR code again** - Expo should now regenerate the splash screen

---

## Solution 2: Generate Native Splash Assets

If Solution 1 doesn't work, we need to prebuild native assets:

```bash
# Install splash screen plugin
npm install expo-splash-screen

# Prebuild native assets (this generates splash screens)
npx expo prebuild --clean

# Then start
npm start -- --clear
```

**Note:** After prebuild, you'll need to rebuild the native app (not Expo Go):
```bash
npm run android
# or
npm run ios
```

---

## Solution 3: Publish to Expo (Regenerates on Expo Servers)

If you want to stay with Expo Go, publish your app to force regeneration:

```bash
npx expo publish
```

Then reload in Expo Go.

---

## Verify Splash File

Make sure `assets/splash.png` contains your Resolute Plan logo:
- Blue checkmark in blue square
- "Resolute Plan" text
- NOT the green placeholder square

---

## Quick Try This NOW:

1. **Version is now 1.0.1** (updated in app.json)
2. **Stop Expo** (Ctrl+C if running)
3. **Run:** `npm start -- --clear`
4. **In Expo Go:** Shake device → Reload
5. **Scan QR code again**

The version change should force Expo to regenerate the splash screen!

---

**If still not working after version update, we'll do Solution 2 (prebuild).**
