#!/bin/bash

# Music Mood Mapper - Play Store Build Commands
# Run these commands to build and deploy to Google Play Store

echo "🎵 Music Mood Mapper - Play Store Deployment"
echo "============================================="

# Step 1: Install EAS CLI if not already installed
echo "📦 Installing EAS CLI..."
npm install -g eas-cli

# Step 2: Login to Expo account
echo "🔐 Please login to your Expo account:"
eas login

# Step 3: Configure EAS build
echo "⚙️ Configuring EAS build..."
eas build:configure

# Step 4: Build for Play Store (AAB format)
echo "🏗️ Building Android App Bundle for Play Store..."
eas build --platform android --profile production

# Alternative: Build APK for testing
echo "📱 To build APK for testing instead, run:"
echo "eas build --platform android --profile preview"

echo ""
echo "✅ Next Steps:"
echo "1. Download the AAB file from Expo dashboard"
echo "2. Create Google Play Console account ($25)"
echo "3. Upload AAB to Play Console"
echo "4. Complete store listing with screenshots"
echo "5. Submit for review"
echo ""
echo "📚 See PLAY_STORE_DEPLOYMENT_GUIDE.md for detailed instructions"