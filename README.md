
  # New Year Resolutions Tracker

  This is a code bundle for New Year Resolutions Tracker. The original project is available at https://www.figma.com/design/etuwhXvbdFs5S1X7vtwn4k/New-Year-Resolutions-Tracker.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Mobile App with Expo Go

  This app has been configured with **Expo** to run as a React Native mobile app. You can test it on your phone using **Expo Go** without needing to build native apps!

  ### Quick Start with Expo Go

  1. **Install Expo Go on your phone:**
     - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
     - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

  2. **Start the Expo development server:**
     ```bash
     npm start
     ```
     This will open Expo DevTools in your browser and show a QR code.

  3. **Connect your phone:**
     - **iOS**: Open the Camera app and scan the QR code
     - **Android**: Open the Expo Go app and scan the QR code
     - Make sure your phone and computer are on the same Wi-Fi network

  4. **The app will load on your phone!** 🎉

  ### Alternative: Use Expo CLI

  ```bash
  # Start for iOS
  npm run ios

  # Start for Android
  npm run android

  # Start for web
  npm run web
  ```

  ### Important Note

  ⚠️ **Component Conversion Required**: The current components use web React (div, className, etc.) and need to be converted to React Native components (View, Text, StyleSheet, etc.) to work properly in Expo Go. The navigation structure is set up, but the individual screen components need React Native equivalents.

  The app structure is ready, but you'll need to convert components from:
  - `div` → `View`
  - `className` → `style` with StyleSheet
  - Web-specific libraries → React Native equivalents

  For now, you can test the Expo setup, but the screens will need React Native component conversion to function properly.
  