# Rock Crush - App Store Deployment Guide

## Overview
This guide walks you through publishing your Rock Crush match-3 game to the Apple App Store using Expo and EAS Build.

## Prerequisites

### 1. Apple Developer Account
- **Required**: Apple Developer Program membership ($99/year)
- **Sign up**: https://developer.apple.com/programs/
- **Important**: You need this to publish any app on the App Store

### 2. Development Tools
- **Expo CLI**: Already installed in this project
- **EAS CLI**: For building and submitting apps
- **Xcode**: Required for iOS development (Mac only)

### 3. App Store Connect Access
- Access to App Store Connect dashboard
- Ability to create new app listings

## Step-by-Step Deployment Process

### Phase 1: Project Preparation

#### 1.1 Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

#### 1.2 Login to Expo
```bash
eas login
```

#### 1.3 Configure EAS Build
```bash
eas build:configure
```

### Phase 2: App Configuration

#### 2.1 Update App Metadata
Edit `app.json` with production settings:
```json
{
  "expo": {
    "name": "Rock Crush",
    "slug": "rock-crush",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.svg",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.svg",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a2e"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourname.rockcrush",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.svg",
        "backgroundColor": "#1a1a2e"
      },
      "package": "com.yourname.rockcrush",
      "versionCode": 1
    }
  }
}
```

#### 2.2 Create App Store Listing
In App Store Connect:
1. **Create New App**
   - Name: "Rock Crush"
   - Bundle ID: `com.yourname.rockcrush`
   - SKU: `rock-crush-001`

2. **App Information**
   - Category: Games > Puzzle
   - Age Rating: 4+ (suitable for all ages)
   - Description: See marketing copy below

### Phase 3: Building for Production

#### 3.1 Create Production Build
```bash
# iOS build
eas build --platform ios --profile production

# Android build (for Google Play Store)
eas build --platform android --profile production
```

#### 3.2 Test Your Build
```bash
# Install on device for testing
eas build --platform ios --profile preview
```

### Phase 4: App Store Submission

#### 4.1 Submit to App Store
```bash
eas submit --platform ios
```

#### 4.2 App Store Connect Configuration
1. **Pricing**: Free or paid
2. **App Privacy**: Data collection details
3. **App Review Information**: Contact details
4. **Version Release**: Manual or automatic

### Phase 5: Marketing Assets

#### 5.1 Required Screenshots
- **iPhone 6.7"**: 1290 x 2796 pixels (3 screenshots minimum)
- **iPhone 6.5"**: 1242 x 2688 pixels
- **iPhone 5.5"**: 1242 x 2208 pixels
- **iPad Pro**: 2048 x 2732 pixels

#### 5.2 App Store Description
```
🎮 ROCK CRUSH - The Ultimate Match-3 Puzzle Adventure!

Crush colorful rocks in this addictive match-3 puzzle game! Swap adjacent rocks to create lines of 3 or more matching stones and watch them disappear in satisfying cascades.

🌟 KEY FEATURES:
• Classic match-3 gameplay with modern polish
• 5 unique rock types with vibrant colors
• Dynamic audio feedback for different match sizes
• Smart hint system when you're stuck
• Progressive difficulty with 30-move challenges
• Local high score tracking
• Professional animations and effects

🎯 HOW TO PLAY:
1. Tap any rock to select it
2. Tap an adjacent rock to swap positions
3. Create lines of 3+ matching rocks
4. Score points before your moves run out
5. Beat your high score!

🎵 IMMERSIVE AUDIO:
• Success sounds for 3-rock matches
• Clapping effects for 4+ rock combos
• Crowd cheering for epic 5+ matches
• Dramatic game over music

Perfect for puzzle lovers of all ages! Download Rock Crush now and start your addictive matching adventure.

No ads, no in-app purchases - just pure puzzle fun!
```

### Phase 6: App Review Process

#### 6.1 Review Guidelines Compliance
Your game complies with App Store guidelines:
- ✅ No inappropriate content
- ✅ No data collection
- ✅ No in-app purchases
- ✅ Suitable for all ages
- ✅ Original content and assets

#### 6.2 Expected Timeline
- **Review Process**: 1-7 days
- **First Submission**: Often takes longer
- **Rejection Handling**: Address feedback and resubmit

### Phase 7: Post-Launch

#### 7.1 App Store Optimization (ASO)
- Monitor download metrics
- Respond to user reviews
- Update keywords based on performance

#### 7.2 Updates and Maintenance
```bash
# For future updates
eas build --platform ios --profile production
eas submit --platform ios
```

## Troubleshooting

### Common Issues
1. **Bundle ID conflicts**: Choose unique identifier
2. **Asset size limits**: Optimize images
3. **Metadata rejection**: Follow App Store guidelines
4. **Build failures**: Check expo/react-native compatibility

### Support Resources
- **Expo Documentation**: https://docs.expo.dev/
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/

## Cost Breakdown

### Required Costs
- **Apple Developer Program**: $99/year
- **EAS Build** (if needed): Free tier available

### Optional Costs
- **App Store Optimization tools**: $10-50/month
- **Analytics services**: Free-$20/month
- **Marketing**: Variable

## Timeline Estimate

### First-Time Publisher
- **Setup & Preparation**: 2-3 days
- **Build & Test**: 1-2 days
- **App Store Connect Setup**: 1 day
- **Review Process**: 1-7 days
- **Total**: 5-13 days

### Experienced Publisher
- **Setup to Submission**: 1-2 days
- **Review Process**: 1-7 days
- **Total**: 2-9 days

## Success Checklist

- [ ] Apple Developer Account active
- [ ] EAS CLI installed and configured
- [ ] App metadata completed
- [ ] Icons and splash screens created
- [ ] Production build successful
- [ ] App Store Connect listing created
- [ ] Screenshots captured
- [ ] App description written
- [ ] App submitted for review
- [ ] Review guidelines compliance verified

## Next Steps

1. **Get Apple Developer Account** (if you don't have one)
2. **Install EAS CLI** and login
3. **Update app.json** with your bundle identifier
4. **Create production build**
5. **Submit to App Store**

Your Rock Crush game is ready for the App Store! The code is polished, the gameplay is solid, and the user experience is professional.