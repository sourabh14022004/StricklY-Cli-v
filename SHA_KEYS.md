# SHA Keys for Firebase/Google Sign-In

## 🔑 Your SHA Keys (Debug Keystore)

### SHA-1 Fingerprint:
```
5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

### SHA-256 Fingerprint:
```
FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
```

## 📋 How to Add SHA Keys to Firebase Console

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **strickly**

### Step 2: Navigate to Project Settings
1. Click the **⚙️ Settings** icon (gear icon) next to "Project Overview"
2. Select **Project settings**

### Step 3: Add SHA Keys to Android App
1. Scroll down to **Your apps** section
2. Find your **Android app** (package name: `com.streakly.app`)
3. Click on the app or expand it
4. In the **SHA certificate fingerprints** section, click **Add fingerprint**
5. Add both SHA-1 and SHA-256:
   - **SHA-1**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
   - **SHA-256**: `FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C`

### Step 4: Download Updated google-services.json
1. After adding the SHA keys, download the updated `google-services.json`
2. Replace the existing file at: `android/app/google-services.json`

## 🔄 How to Get SHA Keys Again (if needed)

### For Debug Keystore (Current):
```bash
cd android/app
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### For Release Keystore (when you create one):
```bash
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

### Using Gradle (Alternative method):
```bash
cd android
./gradlew signingReport
```
This will show SHA-1 and SHA-256 for all build variants.

## ⚠️ Important Notes

1. **Debug vs Release**: The SHA keys above are for the **debug keystore** (development/testing)
2. **Production**: When you create a release keystore for production, you'll need to:
   - Generate new SHA keys from your release keystore
   - Add those SHA keys to Firebase Console as well
3. **Multiple Environments**: You can add multiple SHA keys to Firebase (one for debug, one for release)
4. **Google Sign-In**: SHA keys are required for Google Sign-In to work on Android

## 🧪 Testing

After adding SHA keys to Firebase:
1. Download the updated `google-services.json`
2. Place it in `android/app/google-services.json`
3. Rebuild your Android app
4. Test Google Sign-In

## 📝 Current Keystore Info

- **Location**: `android/app/debug.keystore`
- **Alias**: `androiddebugkey`
- **Store Password**: `android`
- **Key Password**: `android`
- **Package Name**: `com.streakly.app`

---

**Note**: These SHA keys are for development. For production, create a release keystore and add its SHA keys to Firebase as well.

