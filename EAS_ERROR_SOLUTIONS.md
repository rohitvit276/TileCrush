# Rock Crush - EAS Build Error Solutions

## Error: UUID appId / Request ID

The error you're seeing indicates an authentication or project configuration issue with EAS. Here are the solutions:

## Solution 1: Install and Set Up EAS CLI Properly

### Step 1: Install EAS CLI
```bash
npm install -g @expo/eas-cli@latest
```

### Step 2: Login to Expo
```bash
eas login
```
Enter your Expo account credentials (the same ones you used to create your Expo account).

### Step 3: Initialize Your Project
```bash
eas build:configure
```
This will:
- Create a proper project ID
- Set up build configurations
- Link your project to your Expo account

### Step 4: Try Building Again
```bash
eas build --platform android --profile production
```

## Solution 2: If You Don't Have EAS CLI Access

### Use Expo CLI Instead (Alternative Method)
```bash
# Install Expo CLI
npm install -g @expo/cli

# Login to Expo
expo login

# Start development server
expo start

# Build using Expo's web interface
expo build:android
```

## Solution 3: Create Project Through Expo Website

### If Command Line Issues Persist:
1. **Go to**: https://expo.dev/
2. **Login** with your account
3. **Create new project**: "Rock Crush"
4. **Upload your project files** through the web interface
5. **Trigger build** from the Expo dashboard

## Solution 4: Fix Project ID Issue

The error might be caused by an invalid project ID in your app.json. I've cleared it so EAS can generate a new one.

### Updated app.json:
```json
"extra": {
  "eas": {
    "projectId": ""
  }
}
```

When you run `eas build:configure`, it will generate a proper UUID.

## Solution 5: Complete Fresh Setup

If all else fails, here's a complete reset:

### Step 1: Clear EAS Configuration
```bash
rm -rf .expo
```

### Step 2: Reinstall EAS CLI
```bash
npm uninstall -g @expo/eas-cli
npm install -g @expo/eas-cli@latest
```

### Step 3: Re-authenticate
```bash
eas logout
eas login
```

### Step 4: Reconfigure Project
```bash
eas build:configure
```

### Step 5: Build
```bash
eas build --platform android --profile production
```

## Alternative: Use Expo Go for Testing

While troubleshooting, you can test your game:

### Step 1: Install Expo Go App
- Download "Expo Go" from Google Play Store or Apple App Store

### Step 2: Start Your Project
```bash
npx expo start
```

### Step 3: Scan QR Code
- Open Expo Go app on your phone
- Scan the QR code displayed in your terminal
- Your Rock Crush game will load on your phone

## What Each Error Means

### "UUID appId"
- Invalid or missing project ID
- Need to run `eas build:configure`
- Authentication issue with Expo account

### "Request ID: [long string]"
- EAS received your request but couldn't process it
- Usually means project configuration is incomplete
- Need to link project to your Expo account

## Expected Success Flow

When everything works correctly:

1. **Login**: `eas login` → "Logged in as [your-email]"
2. **Configure**: `eas build:configure` → Creates eas.json with proper settings
3. **Build**: `eas build --platform android` → Shows build progress
4. **Wait**: Build takes 10-20 minutes
5. **Download**: Get link to download your .aab file

## Common Issues and Quick Fixes

### "Not logged in"
```bash
eas login
```

### "Project not found"
```bash
eas build:configure
```

### "Invalid configuration"
Check that your app.json has:
- Proper bundle identifier
- Valid app name
- Correct permissions

### "Build failed"
- Check that all required files exist
- Verify app.json syntax is correct
- Ensure all dependencies are installed

## Need Help?

If you're still stuck, provide these details:
1. Your operating system (Windows/Mac/Linux)
2. Node.js version: `node --version`
3. The exact error message (full text)
4. Whether you can access expo.dev in your browser

**Your Rock Crush game is ready to build - we just need to get the tools configured properly!**