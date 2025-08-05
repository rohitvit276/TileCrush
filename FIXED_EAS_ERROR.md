# Rock Crush - EAS Build Error Fix

## Problem Fixed
The error you encountered:
```
eas.json is not valid.
- "build.production.android.versionCode" is not allowed
- "build.production.ios.buildNumber" is not allowed
```

## What Caused This
In newer versions of EAS CLI, version management has been moved from `eas.json` to `app.json`. The old configuration was using deprecated fields.

## What We Fixed

### 1. Updated eas.json
**Removed deprecated fields:**
- `build.production.android.versionCode`
- `build.production.ios.buildNumber`

**Kept only:**
- `autoIncrement: true` (lets EAS manage versions automatically)

### 2. Updated app.json
**Moved version info to the correct location:**
- Android: `versionCode: 1` (already in correct place)
- iOS: Added `buildNumber: "1"` to the ios section

## Your Fixed Configuration

### eas.json (Production Section)
```json
"production": {
  "autoIncrement": true
}
```

### app.json (Version Management)
```json
"android": {
  "versionCode": 1,
  "package": "com.rockcrush.app"
},
"ios": {
  "buildNumber": "1",
  "bundleIdentifier": "com.rockcrush.app"
}
```

## Try Building Again

Now you can run the build command again:
```bash
eas build --platform android --profile production
```

## What autoIncrement Does
- **Automatically increases version numbers** with each build
- **Prevents version conflicts** when uploading to app stores
- **Simplifies version management** - you don't need to manually update numbers

## Expected Result
- ✅ Build command should work without errors
- ✅ EAS will generate a new version number automatically
- ✅ Your Rock Crush game will build successfully

## If You Still Get Errors
Check that:
1. You're logged into EAS: `eas login`
2. Your project is initialized: `eas build:configure` (if needed)
3. You have the latest EAS CLI: `npm install -g @expo/eas-cli@latest`

Your Rock Crush game is now ready for deployment!