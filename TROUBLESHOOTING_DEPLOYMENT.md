# Rock Crush - Deployment Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "npm install" gives 404 error

#### Problem
When you run `npm install`, you get error messages like:
- "404 Not Found" 
- "Package not found"
- "Unable to resolve dependency"

#### Solutions (Try in order)

#### Solution A: Use the Simplified Package File
1. **Rename current package.json**:
   ```
   mv package.json package-old.json
   ```

2. **Rename the simplified version**:
   ```
   mv package-simple.json package.json
   ```

3. **Try installing again**:
   ```
   npm install
   ```

#### Solution B: Clear NPM Cache and Reinstall
1. **Delete node_modules folder** (if it exists):
   ```
   rm -rf node_modules
   ```

2. **Clear npm cache**:
   ```
   npm cache clean --force
   ```

3. **Install dependencies**:
   ```
   npm install
   ```

#### Solution C: Use Yarn instead of NPM
1. **Install Yarn** (if not installed):
   ```
   npm install -g yarn
   ```

2. **Install dependencies with Yarn**:
   ```
   yarn install
   ```

#### Solution D: Create Fresh Expo Project
If all else fails, start with a fresh Expo project:

1. **Install Expo CLI globally**:
   ```
   npm install -g @expo/cli
   ```

2. **Create new project**:
   ```
   expo init RockCrush --template blank
   ```

3. **Copy your game files** (`App.js`, `src/` folder, `assets/` folder) to the new project

4. **Install game-specific dependencies**:
   ```
   expo install expo-av expo-haptics expo-ads-admob expo-in-app-purchases @react-native-async-storage/async-storage react-native-animatable
   ```

---

### Issue 2: "command not found: eas"

#### Problem
When you type `eas --version` or `eas login`, you get "command not found"

#### Solution
1. **Install EAS CLI globally**:
   ```
   npm install -g @expo/eas-cli
   ```

2. **If that fails, try with sudo** (Mac/Linux):
   ```
   sudo npm install -g @expo/eas-cli
   ```

3. **Restart your terminal** and try again

---

### Issue 3: "expo: command not found"

#### Problem
When you type `expo start`, you get "command not found"

#### Solution
1. **Install Expo CLI globally**:
   ```
   npm install -g @expo/cli
   ```

2. **Alternative: Use npx** (doesn't require global install):
   ```
   npx expo start
   ```

---

### Issue 4: Build fails with "Keystore" error

#### Problem
During `eas build`, you get keystore-related errors

#### Solution
1. **Let EAS generate a new keystore**:
   ```
   eas build --platform android --clear-cache
   ```

2. **When prompted**, answer "Y" to generate a new keystore

---

### Issue 5: "Project not configured" error

#### Problem
EAS says your project isn't configured

#### Solution
1. **Initialize EAS in your project**:
   ```
   eas build:configure
   ```

2. **Follow the prompts** to set up your project

---

### Issue 6: Node.js version incompatibility

#### Problem
Getting errors about Node.js version or npm version

#### Solution
1. **Check your Node.js version**:
   ```
   node --version
   ```

2. **If version is below 16.x**, update Node.js:
   - Go to https://nodejs.org/
   - Download and install the LTS version
   - Restart your terminal

---

### Issue 7: Permission denied errors (Mac/Linux)

#### Problem
Getting "permission denied" or "EACCES" errors

#### Solution
1. **Use sudo for global installs**:
   ```
   sudo npm install -g @expo/cli
   sudo npm install -g @expo/eas-cli
   ```

2. **Or fix npm permissions** (recommended):
   ```
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

---

## Alternative Deployment Method (If All Else Fails)

### Use Expo Go for Testing
1. **Install Expo Go app** on your phone (from App Store/Play Store)
2. **Start your project**:
   ```
   npx expo start
   ```
3. **Scan QR code** with Expo Go to test your game
4. **Build later** when dependencies are resolved

### Use Expo Web Build
1. **Start web version**:
   ```
   npx expo start --web
   ```
2. **Test in browser** first
3. **Build for mobile** once everything works

---

## Quick Recovery Commands

If you get completely stuck, run these commands in order:

```bash
# 1. Clean everything
rm -rf node_modules
rm package-lock.json
npm cache clean --force

# 2. Use the simplified package.json
mv package.json package-backup.json
mv package-simple.json package.json

# 3. Fresh install
npm install

# 4. Test that it works
npx expo start --web
```

---

## Getting Help

### Where to Find Help
1. **Expo Documentation**: https://docs.expo.dev/
2. **Google Play Console Help**: https://support.google.com/googleplay/android-developer/
3. **Stack Overflow**: Search your specific error message
4. **Reddit**: r/reactnative, r/expo

### What Information to Include When Asking for Help
- Your operating system (Windows/Mac/Linux)
- Node.js version (`node --version`)
- NPM version (`npm --version`)
- The exact error message
- What command you were running when the error occurred

---

## Success Indicators

You know everything is working when:
- [ ] `node --version` shows 16.x or higher
- [ ] `npm --version` shows 8.x or higher
- [ ] `npx expo --version` shows version number
- [ ] `eas --version` shows version number
- [ ] `npm install` completes without errors
- [ ] `npx expo start --web` opens your game in browser

**Once these all work, you can continue with the deployment guide!**