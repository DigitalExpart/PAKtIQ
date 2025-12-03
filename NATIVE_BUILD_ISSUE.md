# Known Issues

## Native Build Error - React Navigation

### Issue
When running the app on Android/iOS via Expo Go, the app crashes with:
```
TypeError: Cannot read property 'S' of undefined
```

### Details
- The error occurs when accessing `Stack.Screen` from `@react-navigation/stack`
- Happens even with the minimal possible React Navigation setup
- Appears to be a bundling/compatibility issue between:
  - Expo SDK 54
  - React Native 0.82.1
  - React Navigation (tested with both v6 and v7)

### Workaround
**The web version works perfectly.** To use the app:

```bash
npm start
```

Then press `w` to open in web browser, or navigate to `http://localhost:8081` in your browser.

### What Works
✅ Web version (localhost:8081)
✅ All navigation
✅ All components
✅ Full functionality

### What Doesn't Work
❌ Android via Expo Go
❌ iOS via Expo Go

### Attempted Fixes
1. ✅ Added `react-native-gesture-handler` import
2. ✅ Added `react-native-screens` import  
3. ✅ Cleared Metro bundler cache
4. ✅ Reinstalled dependencies
5. ✅ Downgraded React Navigation v7 → v6
6. ✅ Tested minimal React Navigation setup
7. ✅ Created Stack at module level
8. ✅ Removed all component imports

**None resolved the native build issue.**

### Likely Cause
Metro bundler or Expo SDK compatibility issue with React Navigation's module loading on native platforms.

### Potential Solutions (Not Yet Tested)
1. Downgrade Expo SDK to 53 or upgrade to 55
2. Use Expo's built-in navigation (expo-router)
3. Build standalone native apps instead of using Expo Go
4. Wait for Expo SDK 55 compatibility updates

### Current Status
The app is **fully functional on web**. The native build issue requires:
- Either an Expo SDK version change
- Or switching to expo-router instead of React Navigation
- Or building standalone native apps

For development and testing, use the web version which works perfectly.

