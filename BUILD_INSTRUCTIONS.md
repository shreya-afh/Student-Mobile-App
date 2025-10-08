# Building AFH Student Android App

Your web app has been successfully converted to an Android project. Follow these instructions to build the APK.

## What's Ready
- ✅ Android project configured in `android/` folder
- ✅ App Name: AFH Student App
- ✅ Package: com.infosys.afh.student
- ✅ Permissions: Camera, Storage, Internet
- ✅ All web assets synced

## Option 1: Build Locally with Android Studio (Recommended)

### Prerequisites
1. Download and install [Android Studio](https://developer.android.com/studio)
2. Install Java JDK 17 or higher

### Steps
1. **Download the Android folder**
   - Download the entire `android/` folder from this Replit project

2. **Open in Android Studio**
   - Open Android Studio
   - Click "Open an Existing Project"
   - Select the `android` folder

3. **Build APK**
   - Wait for Gradle sync to complete
   - Click `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Install on Device**
   - Enable "Developer Options" and "USB Debugging" on your Android phone
   - Connect phone via USB
   - Click `Run` → `Run 'app'` in Android Studio

## Option 2: Build with Command Line

### Prerequisites
1. Install Java JDK 17+
2. Install Android SDK
3. Set ANDROID_HOME environment variable

### Steps
```bash
cd android
./gradlew assembleDebug
```

APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Option 3: Cloud Build Services

### GitHub Actions (Free)
1. Push your code to GitHub
2. Create `.github/workflows/android-build.yml`
3. Automated APK builds on every push

### EAS Build (Expo)
```bash
npm install -g eas-cli
eas build --platform android
```

## Updating the App

Whenever you make changes to the web app:

1. **Build the web app:**
   ```bash
   npm run build
   ```

2. **Sync to Android:**
   ```bash
   npx cap sync android
   ```

3. **Rebuild APK** using your chosen method above

## Troubleshooting

### "JAVA_HOME not set"
- Install JDK 17 and set JAVA_HOME environment variable

### "SDK location not found"
- Install Android SDK or Android Studio
- Set ANDROID_HOME environment variable

### "Build failed"
- Open project in Android Studio
- Let it download required SDK tools automatically
- Try building again

## Publishing to Play Store

1. **Create signed APK:**
   - Generate keystore
   - Build release APK with signature
   
2. **Create Play Console account**
   
3. **Upload APK**

For detailed publishing guide, see: https://developer.android.com/studio/publish

## Support
- Capacitor Docs: https://capacitorjs.com/docs
- Android Developer Guide: https://developer.android.com
