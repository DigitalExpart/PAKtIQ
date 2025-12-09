# Splash Screen Logo Update Instructions

## Current Status
✅ Splash screen configuration is ready in `app.json`
✅ Background color set to `#F4F4F6` (light gray)
✅ Android splash assets configured
✅ Capacitor splash screen configured

## To Update the Logo

### Option 1: Manual Copy (Recommended)

1. **Find your logo file in Downloads:**
   - File: `WhatsApp Image 2025-12-06 at 13.07.11_21aa4ad6` (with .png or .jpg extension)
   - Location: `C:\Users\user\Downloads\`

2. **Copy to assets folder:**
   ```bash
   # Copy from Downloads to assets folder
   copy "C:\Users\user\Downloads\WhatsApp Image 2025-12-06 at 13.07.11_21aa4ad6.*" "c:\Users\user\packq\New Year Resolutions Tracker\assets\splash.png"
   ```

3. **Update Android splash assets:**
   ```powershell
   # Copy to all Android drawable folders
   $logo = "c:\Users\user\packq\New Year Resolutions Tracker\assets\splash.png"
   $dests = @(
     "android\app\src\main\res\drawable-mdpi\splashscreen_logo.png",
     "android\app\src\main\res\drawable-hdpi\splashscreen_logo.png",
     "android\app\src\main\res\drawable-xhdpi\splashscreen_logo.png",
     "android\app\src\main\res\drawable-xxhdpi\splashscreen_logo.png",
     "android\app\src\main\res\drawable-xxxhdpi\splashscreen_logo.png"
   )
   foreach($dest in $dests) {
     $fullPath = Join-Path "c:\Users\user\packq\New Year Resolutions Tracker" $dest
     Copy-Item $logo $fullPath -Force
   }
   ```

### Option 2: Using PowerShell Script

Run this in PowerShell from your project root:

```powershell
# Find and copy the logo
$downloadPath = "$env:USERPROFILE\Downloads"
$logoFile = Get-ChildItem $downloadPath | Where-Object {
    $_.Name -like "*WhatsApp*Image*2025-12-06*13.07.11*21aa4ad6*"
} | Select-Object -First 1

if ($logoFile) {
    # Copy to splash.png
    Copy-Item $logoFile.FullName "assets\splash.png" -Force
    
    # Copy to Android folders
    $androidDirs = @("mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi")
    foreach($dir in $androidDirs) {
        $dest = "android\app\src\main\res\drawable-$dir\splashscreen_logo.png"
        Copy-Item "assets\splash.png" $dest -Force
    }
    
    Write-Host "Logo updated successfully!"
} else {
    Write-Host "Logo file not found. Please check the filename in Downloads folder."
}
```

## Configuration

The splash screen is configured in:

- **Expo:** `app.json` → `splash.image`
- **Android:** `android/app/src/main/res/drawable-*/splashscreen_logo.png`
- **iOS:** Will use the Expo splash image
- **Capacitor:** `capacitor.config.json` → `SplashScreen`

## Testing

After updating the logo:

1. **For Expo:**
   ```bash
   npx expo start --clear
   ```

2. **For Android (native):**
   ```bash
   npx expo run:android
   ```

3. **For iOS (native):**
   ```bash
   npx expo run:ios
   ```

## Current Configuration

- **Background Color:** `#F4F4F6` (light gray)
- **Resize Mode:** `contain` (logo will scale to fit while maintaining aspect ratio)
- **Logo File:** `./assets/splash.png`
- **App Name:** "Resolute Plan" (displayed on splash screen)

---

**Note:** If the file isn't found automatically, you can manually copy it to `assets/splash.png` and run the Android copy script above.
