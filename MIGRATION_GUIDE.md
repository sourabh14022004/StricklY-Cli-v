# Expo to Bare React Native Migration Guide

## Project: StreaKLy1

This project has been migrated from Expo to bare React Native.

## Changes Made

### 1. Dependencies Updated
- Removed Expo-specific packages:
  - `expo`, `expo-auth-session`, `expo-linear-gradient`, `expo-status-bar`, `expo-web-browser`
- Added bare React Native equivalents:
  - `react-native-linear-gradient` (replaces `expo-linear-gradient`)
  - `@react-native-google-signin/google-signin` (replaces `expo-auth-session`)
  - `react-native-vector-icons` (replaces `@expo/vector-icons`)
  - React Native `StatusBar` (replaces `expo-status-bar`)

### 2. Code Updates
- Updated `App.tsx` to use React Native `StatusBar` instead of `expo-status-bar`
- Updated `AuthContext.tsx` to use `@react-native-google-signin/google-signin`
- Replaced all `expo-linear-gradient` imports with `react-native-linear-gradient`
- Replaced all `@expo/vector-icons` imports with `react-native-vector-icons`
- Updated entry point from `index.ts` (Expo) to `index.ts` (React Native AppRegistry)

### 3. Configuration Files
- Updated `tsconfig.json` to use React Native TypeScript config
- Updated `package.json` with bare React Native dependencies
- Updated `app.json` for React Native

## Next Steps

### 1. Install Dependencies
```bash
cd ~/Desktop/StreaKLy1
npm install
```

### 2. iOS Setup
```bash
cd ios
pod install
cd ..
```

### 3. Android Setup
The Android configuration should work automatically with autolinking. However, you may need to:

1. Update `android/app/build.gradle` if needed for specific native modules
2. For `react-native-vector-icons`, add to `android/app/build.gradle`:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### 4. Google Sign-In Configuration

#### iOS
1. Add your Google Sign-In configuration to `ios/StreaKLy1/Info.plist`:
   - Add URL scheme for Google Sign-In
   - Configure GoogleService-Info.plist if using Firebase

2. Update `ios/StreaKLy1/AppDelegate.mm` or `AppDelegate.swift` to handle Google Sign-In URL callbacks

#### Android
1. Add SHA-1 fingerprint to Firebase Console
2. Update `android/app/build.gradle` if needed
3. Ensure `google-services.json` is in `android/app/` directory

### 5. Vector Icons Setup

#### iOS
The Podfile should automatically link react-native-vector-icons. After `pod install`, verify fonts are included.

#### Android
Add to `android/app/build.gradle`:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### 6. Linear Gradient Setup

#### iOS
Run `pod install` - it should auto-link.

#### Android
Should auto-link via React Native's autolinking.

### 7. Firebase Configuration
Ensure your Firebase configuration files are in place:
- iOS: `ios/StreaKLy1/GoogleService-Info.plist`
- Android: `android/app/google-services.json`

### 8. Run the App

#### iOS
```bash
npm run ios
# or
npx react-native run-ios
```

#### Android
```bash
npm run android
# or
npx react-native run-android
```

## Important Notes

1. **Google Sign-In**: The implementation now uses `@react-native-google-signin/google-signin` instead of Expo's auth session. Make sure to configure it properly for both iOS and Android.

2. **Vector Icons**: Make sure fonts are properly linked. For Android, you may need to manually add the fonts.gradle file.

3. **Linear Gradient**: The component API is slightly different. Verify all gradient components work correctly.

4. **StatusBar**: Now using React Native's built-in StatusBar component instead of Expo's.

5. **Assets**: All assets from the Expo project have been copied to the `assets/` directory.

## Troubleshooting

- If you encounter module resolution issues, try:
  ```bash
  npm start -- --reset-cache
  ```

- For iOS, if pods fail to install:
  ```bash
  cd ios
  pod deintegrate
  pod install
  ```

- For Android, clean and rebuild:
  ```bash
  cd android
  ./gradlew clean
  cd ..
  ```

## Files Modified
- `App.tsx` - Removed Expo dependencies
- `src/contexts/AuthContext.tsx` - Updated Google Sign-In implementation
- All files using `LinearGradient` - Updated imports
- All files using `Ionicons` - Updated imports
- `package.json` - Updated dependencies
- `tsconfig.json` - Updated TypeScript config
- `index.ts` - Updated entry point
