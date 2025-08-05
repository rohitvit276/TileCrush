# Rock Crush - Alternative Build Methods

## Problem: EAS CLI Installation Failed
The npm registry couldn't find `@expo/eas-cli`. This happens due to network issues or registry problems.

## Solution 1: Use Standard Expo CLI (Recommended)

### Install Expo CLI
```bash
npm install -g expo-cli
```

### Build Your App
```bash
# Login to Expo
expo login

# Build for Android
expo build:android -t app-bundle
```

This creates an AAB file ready for Google Play Store.

## Solution 2: Use npx (No Installation Required)

```bash
# Use EAS without installing globally
npx @expo/eas-cli@latest login

# Configure project
npx @expo/eas-cli@latest build:configure

# Build your app
npx @expo/eas-cli@latest build --platform android --profile production
```

## Solution 3: Alternative NPM Registry

```bash
# Try using a different registry
npm install -g @expo/eas-cli --registry https://registry.yarnpkg.com

# Or use Yarn instead
npm install -g yarn
yarn global add @expo/eas-cli
```

## Solution 4: Use Expo Web Dashboard

### Upload Method
1. **Go to**: https://expo.dev/
2. **Create account** and login
3. **Create new project**: "Rock Crush"
4. **Upload your project** as ZIP file
5. **Configure build** through web interface
6. **Download AAB** when build completes

### Required Files to Upload
- `App.js`
- `app.json`
- `eas.json`
- `package.json` (use the simplified version)
- `src/` folder (complete)
- `assets/` folder (complete)

## Solution 5: Local Android Build (Advanced)

### Install Android Studio
1. **Download**: https://developer.android.com/studio
2. **Install Android SDK**
3. **Set up environment variables**

### Build Locally
```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Generate Android project
npx react-native init RockCrushLocal

# Copy your game files
cp -r src/ RockCrushLocal/
cp App.js RockCrushLocal/
cp assets/ RockCrushLocal/

# Build AAB
cd RockCrushLocal/android
./gradlew bundleRelease
```

## Recommended Approach for You

### Use Standard Expo CLI
This is the most reliable method when EAS CLI has issues:

```bash
# 1. Install Expo CLI (more stable than EAS CLI)
npm install -g expo-cli

# 2. Login to your Expo account
expo login

# 3. Initialize if needed
expo init --template blank --name RockCrush

# 4. Copy your game files to the new project
# Then build:
expo build:android -t app-bundle
```

### What This Produces
- **AAB file**: Ready for Google Play Store
- **Signed automatically**: Expo handles code signing
- **Production ready**: Same result as EAS CLI
- **More reliable**: Expo CLI is older and more stable

## Quick Test Method

### Test Your Game First
```bash
# Start development server
npx expo start --web

# Test in browser
# Verify all features work
# Then proceed with building
```

## File Preparation Checklist

Before building with any method:
- [ ] `app.json` configured correctly
- [ ] All assets in `assets/` folder
- [ ] Game code in `src/` folder
- [ ] `App.js` is your main component
- [ ] Privacy policy ready for store listing

## Expected Build Time
- **Expo CLI**: 15-25 minutes
- **Web dashboard**: 20-30 minutes
- **Local build**: 45-60 minutes (first time)

## Next Steps After Build
1. **Download AAB file**
2. **Test on Android device** (optional)
3. **Upload to Google Play Console**
4. **Complete store listing**
5. **Submit for review**

Your Rock Crush game will build successfully with any of these methods!