# Running the App on Your Phone

## Android Setup

### 1. Enable Developer Options
- Go to **Settings** → **About Phone**
- Tap **Build Number** 7 times
- You'll see "You are now a developer!"

### 2. Enable USB Debugging
- Go to **Settings** → **Developer Options**
- Enable **USB Debugging**
- Enable **Install via USB** (if available)

### 3. Connect Your Phone
- Connect your phone to your computer via USB
- On your phone, allow USB debugging when prompted
- Check connection:
  ```bash
  adb devices
  ```
  You should see your device listed

### 4. Run the App
```bash
npm run android
# or
npx react-native run-android
```

### 5. If Device Not Detected
- Try a different USB cable
- Try a different USB port
- On your phone: Revoke USB debugging authorizations, then reconnect
- Check if your phone manufacturer requires special drivers (Samsung, Huawei, etc.)

## iOS Setup

### 1. Connect iPhone/iPad
- Connect your device via USB
- Trust the computer on your device when prompted

### 2. Open Xcode
- Open `ios/StreaKLy1.xcworkspace` in Xcode
- Select your device from the device dropdown
- Click the Play button or press `Cmd + R`

### 3. Or Use Command Line
```bash
npm run ios
# or
npx react-native run-ios --device "Your Device Name"
```

## Troubleshooting

### App Crashes on Launch
1. Check Metro bundler is running:
   ```bash
   npm start
   ```

2. Check logs:
   ```bash
   # Android
   adb logcat | grep -i "react\|error"
   
   # iOS
   npx react-native log-ios
   ```

### Build Errors
1. Clean build:
   ```bash
   # Android
   cd android && ./gradlew clean
   
   # iOS
   cd ios && pod install && cd ..
   ```

2. Clear cache:
   ```bash
   npm start -- --reset-cache
   ```

### Network Issues (Can't Connect to Metro)
- Make sure your phone and computer are on the same WiFi network
- Or use USB connection with port forwarding:
  ```bash
  adb reverse tcp:8081 tcp:8081
  ```

## Quick Commands

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Check connected devices (Android)
adb devices

# View logs (Android)
adb logcat

# View logs (iOS)
npx react-native log-ios
```

