# Complete Guide: Building Your App & Setting Up Notifications

## 📱 Part 1: Building Your App with EAS

### Prerequisites
1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Link your project** (already done, but verify):
   ```bash
   eas init --id 3fd4af30-6d0e-4455-8a28-07f929aa6d24
   ```

### Building for Android

#### Option 1: Preview Build (APK - for testing)
```bash
eas build --platform android --profile preview
```
- Creates an APK file
- Can be installed directly on Android devices
- Good for testing before production

#### Option 2: Production Build (AAB - for Google Play Store)
```bash
eas build --platform android --profile production
```
- Creates an AAB (Android App Bundle) file
- Required for Google Play Store submission
- Smaller file size, optimized for Play Store

### Building for iOS

#### Option 1: Development Build (for testing on simulator)
```bash
eas build --platform ios --profile development
```
- Works on iOS Simulator
- Good for development/testing

#### Option 2: Preview Build (for TestFlight)
```bash
eas build --platform ios --profile preview
```
- Creates an IPA file
- Can be uploaded to TestFlight for beta testing

#### Option 3: Production Build (for App Store)
```bash
eas build --platform ios --profile production
```
- Creates an IPA file for App Store submission
- Requires Apple Developer account

### Building for Both Platforms
```bash
eas build --platform all --profile production
```

### After Building
1. **Download your build**:
   - Visit: https://expo.dev/accounts/resolute-plan/projects/resolute-plan/builds
   - Download the APK/AAB/IPA file

2. **Install on Android**:
   - Transfer APK to device
   - Enable "Install from Unknown Sources" in settings
   - Tap the APK to install

3. **Install on iOS**:
   - Use TestFlight for preview builds
   - Or use Xcode for development builds

---

## 🔔 Part 2: Setting Up Push Notifications

### What You Need for Notifications to Work

#### 1. **Android: Firebase Cloud Messaging (FCM)**

**Step 1: Create Firebase Project**
1. Go to https://console.firebase.google.com/
2. Click "Add project" or select existing project
3. Add Android app with package name: `com.resolutionstracker.app`

**Step 2: Download google-services.json**
1. In Firebase Console → Project Settings → Your apps
2. Download `google-services.json`
3. Place it in: `android/app/google-services.json`

**Step 3: Configure Android Build**
Update `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'
```

Update `android/build.gradle`:
```gradle
dependencies {
    classpath 'com.google.gms:google-services:4.4.0'
}
```

**Step 4: Get FCM Server Key**
1. Firebase Console → Project Settings → Cloud Messaging
2. Copy the "Server key" (legacy) or create a new API key
3. Save this for your backend

#### 2. **iOS: Apple Push Notification Service (APNs)**

**Step 1: Apple Developer Account**
- You need a paid Apple Developer account ($99/year)
- Enroll at: https://developer.apple.com/programs/

**Step 2: Create APNs Key**
1. Go to: https://developer.apple.com/account/resources/authkeys/list
2. Click "+" to create a new key
3. Enable "Apple Push Notifications service (APNs)"
4. Download the `.p8` key file (you can only download once!)
5. Note the Key ID

**Step 3: Configure in EAS**
```bash
eas credentials
```
- Select iOS → Push Notifications
- Upload your APNs key (.p8 file)
- Enter Key ID and Team ID

**Step 4: Update app.json**
The app.json already has notification configuration, but ensure:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.resolutionstracker.app"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/icon.png",
          "color": "#9163F2",
          "sounds": ["./assets/notification.wav"],
          "mode": "production"
        }
      ]
    ]
  }
}
```

#### 3. **Backend Configuration (Supabase)**

**For Android:**
1. In Supabase Dashboard → Settings → API
2. Add FCM Server Key to your environment variables
3. Or use Supabase's built-in push notification service

**For iOS:**
1. Add APNs key credentials to Supabase
2. Configure in Supabase Dashboard → Settings → Push Notifications

### Testing Notifications

#### 1. **Get Expo Push Token**
Your app already registers for push notifications in `AuthContext.tsx`. The token is stored in Supabase.

#### 2. **Send Test Notification**
You can use Expo's push notification tool:
```bash
npx expo-notifications
```

Or send via API:
```bash
curl -H "Content-Type: application/json" \
  -X POST https://exp.host/--/api/v2/push/send \
  -d '{
    "to": "ExponentPushToken[YOUR_TOKEN]",
    "title": "Test Notification",
    "body": "This is a test!"
  }'
```

### Important Notes

1. **Development vs Production**:
   - Development builds use Expo's push notification service
   - Production builds need FCM (Android) and APNs (iOS) configured

2. **Permissions**:
   - Android: Automatically requested on first notification
   - iOS: Must request permission in code (already implemented)

3. **Notification Sound**:
   - Ensure `./assets/notification.wav` exists
   - Or remove the sounds array if not needed

4. **Testing on Physical Devices**:
   - Push notifications don't work on simulators/emulators
   - Must test on real devices

### Quick Checklist

- [ ] Firebase project created for Android
- [ ] `google-services.json` added to `android/app/`
- [ ] FCM Server Key obtained
- [ ] Apple Developer account (for iOS)
- [ ] APNs key created and uploaded to EAS
- [ ] `app.json` notification config verified
- [ ] Backend configured with FCM/APNs credentials
- [ ] Test notification sent successfully

---

## 🚀 Quick Start Commands

```bash
# Build Android APK for testing
eas build --platform android --profile preview

# Build Android AAB for Play Store
eas build --platform android --profile production

# Build iOS for TestFlight
eas build --platform ios --profile preview

# Build iOS for App Store
eas build --platform ios --profile production

# Build both platforms
eas build --platform all --profile production

# Check build status
eas build:list

# View build details
eas build:view [BUILD_ID]
```

---

## 📝 Additional Resources

- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Expo Notifications: https://docs.expo.dev/push-notifications/overview/
- Firebase Setup: https://firebase.google.com/docs/cloud-messaging
- Apple Push Notifications: https://developer.apple.com/documentation/usernotifications
