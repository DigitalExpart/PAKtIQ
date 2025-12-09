# App Distribution Guide - Android APK & iOS

## 📱 How Users Can Download Your App

### Option 1: EAS Build with Direct Download Links (Recommended)

EAS Build automatically provides download links for your builds. Here's how to set it up:

#### Step 1: Build Your Apps

**For Android APK (Preview Build):**
```bash
eas build --platform android --profile preview
```

**For iOS (Preview Build for TestFlight):**
```bash
eas build --platform ios --profile preview
```

#### Step 2: Get Download Links

After the build completes:
1. Visit: https://expo.dev/accounts/resolute-plan/projects/resolute-plan/builds
2. Click on your completed build
3. Copy the download link
4. Share this link with users

**Android APK:**
- Direct download link works immediately
- Users can download and install on any Android device
- No restrictions

**iOS:**
- For TestFlight: Share TestFlight link (requires Apple Developer account)
- For Ad-Hoc: Limited to specific device UDIDs (up to 100 devices)
- For App Store: Public download (requires App Store submission)

### Option 2: Create a Download Page

You can create a simple HTML page that hosts download links. Here's a template:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Download Resolute Plan</title>
    <style>
        body { font-family: Arial; text-align: center; padding: 50px; }
        .download-btn { 
            display: inline-block; 
            padding: 15px 30px; 
            margin: 10px; 
            background: #9163F2; 
            color: white; 
            text-decoration: none; 
            border-radius: 8px; 
        }
    </style>
</head>
<body>
    <h1>Download Resolute Plan</h1>
    <p>Choose your platform:</p>
    <a href="YOUR_ANDROID_APK_LINK" class="download-btn">Download for Android</a>
    <a href="YOUR_IOS_TESTFLIGHT_LINK" class="download-btn">Download for iOS (TestFlight)</a>
</body>
</html>
```

### Option 3: Use EAS Update for OTA Updates

For easier distribution, you can use EAS Update to push updates without rebuilding:

```bash
# Enable updates in app.json
# Then push updates:
eas update --branch production --message "Bug fixes"
```

---

## 🔧 Configuration for Distribution

### Android APK Distribution

**Current Setup:**
- ✅ Preview profile builds APK (ready for direct download)
- ✅ Production profile builds App Bundle (for Play Store)

**To share APK:**
1. Build with preview profile
2. Get download link from EAS dashboard
3. Share link - users can download and install directly

### iOS Distribution Options

#### Option A: TestFlight (Recommended for Beta Testing)
1. Build with preview profile
2. Upload to App Store Connect
3. Add testers in TestFlight
4. Share TestFlight link

#### Option B: Ad-Hoc Distribution (Limited)
1. Build with development profile
2. Register device UDIDs (max 100 devices)
3. Distribute IPA to registered devices

#### Option C: App Store (Public Release)
1. Build with production profile
2. Submit to App Store
3. Public download after approval

---

## 📋 Step-by-Step: Making Apps Available for Download

### For Android APK:

1. **Build the APK:**
   ```bash
   eas build --platform android --profile preview
   ```

2. **Wait for build to complete** (check: https://expo.dev/accounts/resolute-plan/projects/resolute-plan/builds)

3. **Get download link:**
   - Click on completed build
   - Copy the download URL
   - Example: `https://expo.dev/artifacts/eas/xxxxx.apk`

4. **Share with users:**
   - Send link via email/message
   - Post on website
   - Share via QR code

5. **User installation:**
   - Download APK on Android device
   - Enable "Install from Unknown Sources" in settings
   - Tap APK to install

### For iOS:

#### Using TestFlight (Easiest):

1. **Build for TestFlight:**
   ```bash
   eas build --platform ios --profile preview
   ```

2. **Submit to App Store Connect:**
   ```bash
   eas submit --platform ios
   ```
   (You'll need to configure Apple credentials first)

3. **Add TestFlight testers:**
   - Go to App Store Connect → TestFlight
   - Add internal/external testers
   - Share TestFlight link

4. **User installation:**
   - Users install TestFlight app
   - Accept invitation
   - Install your app from TestFlight

---

## 🚀 Quick Start Commands

```bash
# Build Android APK for direct download
eas build --platform android --profile preview

# Build iOS for TestFlight
eas build --platform ios --profile preview

# Build both at once
eas build --platform all --profile preview

# Check build status
eas build:list

# View build details and get download link
eas build:view [BUILD_ID]
```

---

## 📝 Important Notes

### Android:
- ✅ APK can be downloaded and installed directly
- ✅ No restrictions on distribution
- ✅ Works on any Android device
- ⚠️ Users need to enable "Unknown Sources" for first install

### iOS:
- ⚠️ Cannot install IPA directly like Android
- ✅ TestFlight is the easiest way for beta testing
- ✅ App Store is required for public distribution
- ⚠️ Ad-hoc distribution limited to 100 devices
- ⚠️ Requires Apple Developer account ($99/year)

---

## 🔗 Useful Links

- EAS Build Dashboard: https://expo.dev/accounts/resolute-plan/projects/resolute-plan/builds
- TestFlight: https://developer.apple.com/testflight/
- App Store Connect: https://appstoreconnect.apple.com/

---

## 💡 Pro Tips

1. **For Android:** Use preview profile for APK distribution
2. **For iOS:** Use TestFlight for easy beta testing
3. **Update builds:** Increment version in app.json before each build
4. **Track downloads:** Use analytics to see how many users download
5. **QR Codes:** Generate QR codes for download links for easy sharing
