#!/bin/bash

# Rock Crush - Android Deployment Script
# This script automates the Google Play Store deployment process

echo "🎮 Rock Crush - Android Deployment"
echo "=================================="

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g @expo/eas-cli
fi

# Check if user is logged in
echo "📋 Checking Expo authentication..."
if ! eas whoami &> /dev/null; then
    echo "🔐 Please login to Expo:"
    eas login
fi

# Show current project status
echo ""
echo "📱 Current app configuration:"
echo "Name: Rock Crush"
echo "Package: com.rockcrush.app"
echo "Version: 1.0.0"
echo ""

# Ask user what they want to do
echo "What would you like to do?"
echo "1) Build for production (Google Play Store)"
echo "2) Build preview version for testing"
echo "3) Submit to Google Play Store"
echo "4) Check build status"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🏗️  Building production APK/AAB for Google Play Store..."
        echo "This will create an optimized build for store submission."
        eas build --platform android --profile production
        echo ""
        echo "✅ Production build complete!"
        echo "📋 Next steps:"
        echo "   1. Download the AAB file from EAS dashboard"
        echo "   2. Upload to Google Play Console"
        echo "   3. Complete store listing information"
        echo "   4. Submit for review"
        ;;
    2)
        echo "🔄 Building preview version for testing..."
        eas build --platform android --profile preview
        echo ""
        echo "✅ Preview build complete!"
        echo "📋 You can install this on devices for testing."
        ;;
    3)
        echo "🚀 Submitting to Google Play Store..."
        echo "⚠️  Make sure you have:"
        echo "   - Google Play Console account ($25)"
        echo "   - Service account JSON file"
        echo "   - Completed store listing"
        echo ""
        read -p "Continue with submission? (y/N): " confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            eas submit --platform android
        else
            echo "Submission cancelled."
        fi
        ;;
    4)
        echo "📊 Checking build status..."
        eas build:list --platform android --limit 5
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎯 Helpful links:"
echo "   - Google Play Console: https://play.google.com/console/"
echo "   - EAS Build Dashboard: https://expo.dev/"
echo "   - Deployment Guide: ./GOOGLE_PLAY_DEPLOYMENT_GUIDE.md"
echo ""
echo "✨ Good luck with your Rock Crush launch!"