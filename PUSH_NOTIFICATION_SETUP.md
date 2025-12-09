# Push Notification Setup Guide

## Overview

The app now supports push notifications that display on users' phones with sound and app icon. This guide explains how to complete the setup.

## What's Already Done

✅ Push notification service created  
✅ Device registration on login  
✅ Notification handler for foreground/background  
✅ App icon and sound configuration  
✅ Navigation on notification tap  
✅ Real-time notification listening  

## Required Setup Steps

### Step 1: Run Database Migration

Run this SQL in Supabase to add push_token column:

```sql
-- File: supabase/migrations/009_add_push_token.sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS push_token TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_push_token ON public.profiles(push_token) WHERE push_token IS NOT NULL;
```

### Step 2: Get Expo Project ID

1. Go to https://expo.dev
2. Sign in to your Expo account
3. Create a project or select existing one
4. Go to Project Settings
5. Copy the **Project ID** (looks like: `abc123def-4567-8901-2345-6789abcdef01`)

### Step 3: Configure Project ID

Add to your `app.json`:

```json
{
  "expo": {
    "extra": {
      "expoProjectId": "your-project-id-here",
      "supabaseUrl": "...",
      "supabaseAnonKey": "..."
    }
  }
}
```

Or create a `.env` file:

```
EXPO_PUBLIC_PROJECT_ID=your-project-id-here
```

### Step 4: Build and Test

1. **For Development (Expo Go)**:
   ```bash
   npm start
   ```
   - Push notifications work in Expo Go, but with limitations
   - Best for testing the flow

2. **For Production (Standalone App)**:
   ```bash
   # Build for Android
   eas build --platform android

   # Build for iOS
   eas build --platform ios
   ```
   - Push notifications work fully in standalone builds
   - Requires EAS (Expo Application Services) account

## How It Works

### 1. Device Registration
- When user logs in, device automatically registers for push notifications
- Push token is saved to user's profile in database
- Token is used to send notifications to that specific device

### 2. Notification Creation
- When a notification is created in database (via cron jobs or app actions)
- The app listens for new notifications in real-time
- When detected, sends push notification to user's device

### 3. Push Notification Display
- **Title**: Notification title
- **Body**: Notification message
- **Sound**: Default notification sound
- **Icon**: App icon (configured in app.json)
- **Badge**: Unread notification count
- **Data**: Includes notification type, pakt_id, etc. for navigation

### 4. User Interaction
- **Tap notification**: Navigates to relevant screen
  - Pakt notifications → Pakt detail screen
  - Pakt created → Dashboard
  - Others → Notifications feed
- **Foreground**: Shows in-app notification banner
- **Background**: Shows in notification tray

## Notification Types That Send Push

✅ Pakt created (with congratulations message)  
✅ Password changed  
✅ Milestone achieved  
✅ Milestone missed  
✅ Milestone upcoming  
✅ Pakt completed  
✅ Daily motivation  
✅ Reminder notifications  

## Testing Push Notifications

### Method 1: Manual Test
```typescript
import { PushNotificationService } from '../src/services/push-notification.service';

// Send test notification
await PushNotificationService.sendLocalNotification(
  'Test Notification',
  'This is a test push notification!',
  { type: 'test' }
);
```

### Method 2: Create Database Notification
```sql
-- This will trigger push notification
INSERT INTO notifications (user_id, type, title, message)
VALUES (
  'your-user-id',
  'pakt_created',
  'Test Notification',
  'This is a test!'
);
```

## Troubleshooting

### Notifications Not Appearing

1. **Check permissions**:
   - User must grant notification permissions
   - Check in device Settings → Apps → Your App → Notifications

2. **Check push token**:
   ```sql
   SELECT id, push_token FROM profiles WHERE id = 'user-id';
   ```
   - Should have a token (starts with `ExponentPushToken[...]`)

3. **Check Expo project ID**:
   - Must be set correctly in app.json or .env
   - Must match your Expo project

4. **Check device**:
   - Must be physical device (not simulator/emulator)
   - For iOS: Must be in standalone build (not Expo Go)

### Sound Not Playing

- Check device volume
- Check notification sound settings in device Settings
- Verify `sound: 'default'` in push notification config

### Icon Not Showing

- Ensure `icon` is set in app.json
- For Android: Ensure adaptive icon is configured
- Icon file must exist at `./assets/icon.png`

## Production Considerations

1. **Expo Push Notification Service**:
   - Free tier: 1 million notifications/month
   - Upgrade if you need more

2. **Error Handling**:
   - Push notifications are sent asynchronously
   - Failures don't break notification creation
   - Check logs for push notification errors

3. **Rate Limiting**:
   - Expo has rate limits
   - Batch notifications if sending many at once

4. **Testing**:
   - Test on physical devices
   - Test in both foreground and background
   - Test notification tap navigation

## Next Steps

1. ✅ Run migration `009_add_push_token.sql`
2. ✅ Get Expo Project ID
3. ✅ Add to app.json or .env
4. ✅ Test on physical device
5. ✅ Build standalone app for production

## Support

For issues:
- Expo Push Notifications: https://docs.expo.dev/push-notifications/overview/
- Expo Project Setup: https://docs.expo.dev/accounts/overview/
