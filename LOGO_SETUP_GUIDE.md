# Logo Setup Guide for Resolute Plan App

## 📱 Required Icon Sizes

Your app needs different icon sizes for different platforms. Here's what you need:

### Main App Icon (`icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Usage**: iOS app icon, Android icon (fallback)

### Android Adaptive Icon (`adaptive-icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Usage**: Android home screen icon
- **Note**: Should be centered in a safe area (the outer 25% may be cropped)

### Splash Screen (`splash.png`)
- **Size**: 2048x2048 pixels (or 1242x2436 for iPhone)
- **Format**: PNG
- **Usage**: Loading screen when app starts
- **Background**: Should match your app's background color (#F4F4F6)

### Favicon (`favicon.png`)
- **Size**: 48x48 or 96x96 pixels
- **Format**: PNG or ICO
- **Usage**: Web browser tab icon

## 🎨 Using Your Logo

Your logo has been saved to:
```
assets/c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_a2694deb640f2063bc9bb230eaef3556_images_WhatsApp_Image_2025-12-06_at_13.07.10_0ca2871a-4edaf4d7-053b-4956-9162-f9149379e10d.png
```

### Option 1: Manual Setup (Recommended)

1. **Open your logo image** in an image editor (Photoshop, GIMP, or online tool like Canva)

2. **Create `icon.png`** (1024x1024):
   - Resize your logo to 1024x1024 pixels
   - Center it on a transparent or white background
   - Save as `assets/icon.png`

3. **Create `adaptive-icon.png`** (1024x1024):
   - Same as icon.png but ensure important content is in the center 512x512 area
   - Save as `assets/adaptive-icon.png`

4. **Create `splash.png`** (2048x2048):
   - Resize logo to fit nicely (about 800-1000px height)
   - Center on background color #F4F4F6
   - Save as `assets/splash.png`

5. **Create `favicon.png`** (96x96):
   - Resize logo to 96x96 pixels
   - Save as `assets/favicon.png`

### Option 2: Use Online Icon Generator

1. Go to https://www.appicon.co/ or https://www.makeappicon.com/
2. Upload your logo image
3. Download the generated icon set
4. Copy the files to your `assets/` folder:
   - `icon.png` (1024x1024)
   - `adaptive-icon.png` (1024x1024)
   - `splash.png` (use the largest size)
   - `favicon.png` (96x96)

### Option 3: Quick Copy (If Logo is Already Correct Size)

If your logo is already 1024x1024, you can quickly copy it:

```bash
# On Windows PowerShell:
Copy-Item "assets\c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_a2694deb640f2063bc9bb230eaef3556_images_WhatsApp_Image_2025-12-06_at_13.07.10_0ca2871a-4edaf4d7-053b-4956-9162-f9149379e10d.png" "assets\icon.png"
Copy-Item "assets\c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_a2694deb640f2063bc9bb230eaef3556_images_WhatsApp_Image_2025-12-06_at_13.07.10_0ca2871a-4edaf4d7-053b-4956-9162-f9149379e10d.png" "assets\adaptive-icon.png"
```

## ✅ Verification

After setting up your icons, verify they exist:

```bash
# Check if files exist
dir assets\icon.png
dir assets\adaptive-icon.png
dir assets\splash.png
dir assets\favicon.png
```

## 🔄 After Setup

1. **Clear Expo cache:**
   ```bash
   npm start -- --clear
   ```

2. **Rebuild your app** to see the new icons:
   ```bash
   eas build --platform android --profile preview
   ```

## 📝 Current Configuration

Your `app.json` is already configured to use:
- `./assets/icon.png` - Main icon
- `./assets/adaptive-icon.png` - Android adaptive icon
- `./assets/splash.png` - Splash screen
- `./assets/favicon.png` - Web favicon

Just make sure these files exist with the correct sizes!

## 🎯 Quick Checklist

- [ ] Create `icon.png` (1024x1024)
- [ ] Create `adaptive-icon.png` (1024x1024)
- [ ] Create `splash.png` (2048x2048)
- [ ] Create `favicon.png` (96x96)
- [ ] Verify files are in `assets/` folder
- [ ] Clear cache and rebuild

## 💡 Tips

1. **Keep it simple**: Icons should be recognizable even at small sizes
2. **Use transparency**: PNG with alpha channel works best
3. **Test on devices**: Icons may look different on actual devices
4. **Safe area**: For Android adaptive icons, keep important content in center 512x512px
5. **Background color**: Your splash screen uses #F4F4F6 - match this in your splash image
