# Rock Crush - Google Play Store Deployment Guide

## Overview
This guide walks you through publishing your Rock Crush match-3 game to the Google Play Store using Expo and EAS Build.

## Prerequisites

### 1. Google Play Console Account
- **Required**: Google Play Console developer account ($25 one-time fee)
- **Sign up**: https://play.google.com/console/
- **Payment**: One-time $25 registration fee

### 2. Development Tools
- **Expo CLI**: Already installed in this project
- **EAS CLI**: For building and submitting apps
- **Android Studio**: Optional but recommended for testing

### 3. Google Play Console Access
- Access to Google Play Console dashboard
- Ability to create new app listings

## Step-by-Step Deployment Process

### Phase 1: Project Preparation

#### 1.1 Install EAS CLI (if not already installed)
```bash
npm install -g @expo/eas-cli
```

#### 1.2 Login to Expo
```bash
eas login
```

#### 1.3 Configure EAS Build for Android
```bash
eas build:configure
```

### Phase 2: App Configuration

#### 2.1 Update App Metadata
Your `app.json` is already configured with Android settings:
```json
{
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.svg",
      "backgroundColor": "#1a1a2e"
    },
    "package": "com.rockcrush.app",
    "permissions": [
      "VIBRATE",
      "INTERNET",
      "ACCESS_NETWORK_STATE"
    ],
    "versionCode": 1
  }
}
```

#### 2.2 Create Google Play Console Listing
In Google Play Console:
1. **Create New App**
   - App name: "Rock Crush"
   - Default language: English (United States)
   - App or game: Game
   - Free or paid: Free

2. **App Category**
   - Category: Puzzle
   - Tags: Match-3, Puzzle, Casual

### Phase 3: Building for Production

#### 3.1 Create Android Production Build
```bash
# Android AAB (recommended for Play Store)
eas build --platform android --profile production

# Alternative: APK build
eas build --platform android --profile production --local
```

#### 3.2 Test Your Build
```bash
# Preview build for testing
eas build --platform android --profile preview
```

### Phase 4: Google Play Console Setup

#### 4.1 App Dashboard Configuration

**Main Store Listing:**
- **App name**: Rock Crush
- **Short description** (80 characters):
  ```
  Match colorful rocks in this addictive puzzle game! Crush 3+ rocks to score.
  ```

- **Full description** (4,000 characters):
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

  ✨ HIGHLIGHTS:
  • Free version with optional premium upgrade
  • Premium removes ads and unlocks unlimited hints
  • Offline gameplay - play anywhere
  • Family-friendly content
  • Professional graphics and sound
  • Smooth 60fps gameplay
  • Small download size

  Join thousands of players crushing rocks and setting high scores! Download now and see how many rocks you can crush!
  ```

#### 4.2 Graphics and Assets

**App Icon:**
- **High-res icon**: 512 x 512 pixels (already created as icon.svg)
- **Feature graphic**: 1024 x 500 pixels

**Screenshots (Required):**
- **Phone**: At least 2 screenshots
- **7-inch tablet**: At least 1 screenshot (optional)
- **10-inch tablet**: At least 1 screenshot (optional)

**Screenshot Specifications:**
- **Format**: PNG or JPEG
- **Min dimensions**: 320px
- **Max dimensions**: 3840px
- **Aspect ratio**: Between 1:2 and 2:1

#### 4.3 Store Listing Content

**Categorization:**
- **Application type**: Game
- **Category**: Puzzle
- **Content rating**: Everyone

**Contact details:**
- **Website**: Your website or GitHub repo
- **Email**: Your contact email
- **Phone**: Optional
- **Privacy policy**: Required - Use the comprehensive `PRIVACY_POLICY.md` file included in your project

### Phase 5: App Release Management

#### 5.1 Upload App Bundle
1. Go to **Production** track in Play Console
2. Click **Create new release**
3. Upload your AAB file from EAS Build
4. Complete release notes:
   ```
   🎮 Rock Crush v1.0.0 - Initial Release

   Welcome to Rock Crush, the ultimate match-3 puzzle experience!

   ✨ What's New:
   • Launch version with full match-3 gameplay
   • 5 colorful rock types to match and crush
   • Dynamic audio feedback system
   • Smart hint system for challenging puzzles
   • Professional animations and effects
   • Local high score tracking

   🎯 Features:
   • Classic match-3 puzzle mechanics
   • 30-move challenge system
   • Free with ads or premium subscription
   • Offline gameplay
   • Family-friendly content

   Start your rock crushing adventure today!
   ```

#### 5.2 Content Rating
Complete the content rating questionnaire:
- **Interactive elements**: None
- **User-generated content**: None
- **Data sharing**: Limited (analytics only)
- **Ads**: Yes (free version shows ads)
- **In-app purchases**: Yes (premium subscription)
- **Final rating**: Everyone

#### 5.3 Target Audience
- **Target age group**: 13+
- **Appeal to children**: No
- **Family policy**: Not family-designed

### Phase 6: Privacy and Data Safety

#### 6.1 Data Safety Section
Configure data safety for your monetized game:
- **Data collection**: App activity, Device identifiers (for ads)
- **Data sharing**: Shared with advertising partners (free users only)
- **Security practices**: Data encrypted in transit
- **Privacy policy**: Upload your `PRIVACY_POLICY.md` file

#### 6.2 Privacy Policy Template
```
Privacy Policy for Rock Crush

Effective date: [Current Date]

1. INFORMATION COLLECTION
Rock Crush does not collect any personal information from users.

2. DATA STORAGE
- High scores are stored locally on your device only
- No user data is transmitted to external servers
- No analytics or tracking data is collected

3. PERMISSIONS
The app may request the following permissions:
- VIBRATE: For haptic feedback during gameplay
- INTERNET: For future update checks (optional)
- ACCESS_NETWORK_STATE: For connectivity status

4. THIRD-PARTY SERVICES
Rock Crush does not use any third-party analytics, advertising, or data collection services.

5. CHILDREN'S PRIVACY
This app does not knowingly collect information from children under 13.

6. CONTACT
For questions about this privacy policy, contact: [Your Email]

7. CHANGES
This policy may be updated. Users will be notified of significant changes.
```

### Phase 7: Release Process

#### 7.1 Submit for Review
```bash
# Using EAS Submit
eas submit --platform android
```

#### 7.2 Manual Upload Alternative
1. Download AAB from EAS Build dashboard
2. Upload to Play Console manually
3. Complete all required sections
4. Submit for review

#### 7.3 Review Timeline
- **Standard review**: 1-3 days
- **First-time developer**: May take longer
- **Policy violations**: Will require fixes

### Phase 8: Post-Launch Optimization

#### 8.1 Store Listing Optimization (ASO)
**Primary Keywords:**
- match 3
- puzzle game
- rock crush
- gem match
- tile matching

**Secondary Keywords:**
- casual game
- brain game
- offline puzzle
- family game
- color matching

#### 8.2 User Feedback Management
1. **Monitor reviews** daily
2. **Respond to feedback** professionally
3. **Track ratings** and improve accordingly
4. **Plan updates** based on user requests

#### 8.3 Performance Tracking
- **Installs**: Monitor download numbers
- **Ratings**: Track average rating
- **Reviews**: Read and respond to feedback
- **Crashes**: Monitor stability reports

## Cost Breakdown

### Required Costs
- **Google Play Console**: $25 one-time registration fee
- **EAS Build**: Free tier available

### Optional Costs
- **App Store Optimization tools**: $10-50/month
- **Analytics services**: Free-$20/month
- **Marketing**: Variable

## Timeline Estimate

### First-Time Publisher
- **Setup & Preparation**: 1-2 days
- **Build & Test**: 1 day
- **Play Console Setup**: 1-2 days
- **Review Process**: 1-3 days
- **Total**: 4-8 days

### Experienced Publisher
- **Setup to Submission**: 1 day
- **Review Process**: 1-3 days
- **Total**: 2-4 days

## Screenshots Guide

### Screenshot 1: Main Gameplay
- Show colorful rock grid with active gameplay
- Include score and moves counter
- Highlight a match in progress

### Screenshot 2: Special Features
- Display hint system with golden highlights
- Show 4+ rock match with effects
- Include help text or tutorials

### Screenshot 3: Game Variety
- Show different rock combinations
- Display scoring system
- Highlight special matches

### Screenshot 4: Game Over
- Show game over screen with final score
- Display restart functionality
- Highlight high score achievement

### Screenshot 5: Menu/Features
- Show start screen with game title
- Display instructions or help
- Highlight key features

## Feature Graphic Design (1024 x 500px)

**Content suggestions:**
- Rock Crush logo prominently displayed
- Colorful rocks arranged attractively
- "Match 3 Puzzle Adventure" tagline
- 5-star rating graphics
- "Free Download" call-to-action

## Success Checklist

- [ ] Google Play Console account created ($25 paid)
- [ ] EAS CLI installed and configured
- [ ] Android production build successful
- [ ] App listing completed with description
- [ ] Screenshots captured and uploaded
- [ ] Feature graphic created
- [ ] Privacy policy published
- [ ] Content rating completed
- [ ] Data safety section filled
- [ ] App bundle uploaded
- [ ] Release notes written
- [ ] App submitted for review

## Troubleshooting

### Common Issues
1. **Package name conflicts**: Use unique identifier
2. **Missing permissions**: Check Android manifest
3. **Icon size issues**: Ensure 512x512 high-res icon
4. **Build failures**: Check Expo/React Native compatibility

### Support Resources
- **Google Play Console Help**: https://support.google.com/googleplay/android-developer/
- **Expo Documentation**: https://docs.expo.dev/
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/

## Marketing Tips

### Launch Strategy
1. **Soft launch**: Release in select countries first
2. **Social media**: Share gameplay videos
3. **App Store Optimization**: Use relevant keywords
4. **User acquisition**: Encourage initial reviews

### Long-term Success
1. **Regular updates**: Add new features based on feedback
2. **Community building**: Engage with users
3. **Performance monitoring**: Track metrics and optimize
4. **Cross-promotion**: Consider other platforms

Your Rock Crush game is perfectly suited for Google Play Store with its polished gameplay, professional design, and family-friendly content. The no-ads, no-IAP model will appeal to users looking for pure puzzle entertainment!