# Final Fix for Splash Screen in Expo Go

## The Problem
Expo Go is downloading OTA updates that contain the old cached splash screen. The splash screen is generated server-side by Expo.

## Solution: Disable Updates + Use Prebuild

I've disabled OTA updates in `app.json`. Now we have two options:

### Option 1: Use Development Build (Best for Splash Screen)

Since Expo Go caches splash screens server-side, the best solution is to create a development build:

```bash
# Generate native code
npx expo prebuild --clean

# Build for Android (requires Android Studio)
npm run android

# OR build for iOS (requires Xcode on Mac)
npm run ios
```

This creates a native app with your splash screen embedded locally.

---

### Option 2: Change App Slug (Force Server Regeneration)

Change the slug to force Expo to regenerate everything:

1. Update `app.json`:
   ```json
   "slug": "resolute-plan-v2"
   ```

2. Restart Expo:
   ```bash
   npm start -- --clear
   ```

3. Scan new QR code in Expo Go

---

### Option 3: Publish to Expo (Regenerates on Servers)

Publish your app to force Expo servers to regenerate splash screen:

```bash
npx expo publish
```

Then reload in Expo Go.

---

## What I've Done

✅ Disabled OTA updates (prevents downloading cached splash)
✅ Version updated to 1.0.1
✅ Splash screen plugin configured
✅ splash.png file in place

## Next Steps

**Try this first:**
1. Stop Expo (Ctrl+C)
2. Change slug in app.json to `"resolute-plan-v2"`
3. Run: `npm start -- --clear`
4. Scan NEW QR code in Expo Go
5. The new slug forces Expo to regenerate splash screen

**If that doesn't work:**
Use Option 1 (prebuild) - this guarantees your splash screen is used because it's embedded in the native app.

---

**The slug change should force Expo to regenerate the splash screen! 🚀**
