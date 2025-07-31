# Music Mood Mapper

A complete Android application for the Play Store that detects user mood through selfies and audio input, then recommends music from Spotify/YouTube based on the detected mood. The app includes comprehensive mood tracking and music history features.

## Features

### 🎭 Mood Detection
- **Photo Analysis**: Take selfies for AI-powered facial emotion detection
- **Voice Analysis**: Record audio samples for vocal mood analysis
- **Real-time Processing**: Instant mood detection with confidence scores
- **Multiple Moods**: Supports happy, sad, calm, excited, energetic, peaceful, and more

### 🎵 Music Recommendations
- **Mood-Based Playlists**: Curated music recommendations for each detected mood
- **Multiple Platforms**: Direct links to Spotify and YouTube for song playback
- **Genre Diversity**: Recommendations span multiple music genres and styles
- **Search Functionality**: Find specific songs, artists, or genres

### 📊 Mood History & Analytics
- **History Tracking**: Complete log of all mood detection sessions
- **Visual Charts**: Pie charts and trend analysis of mood patterns
- **Time Filters**: View mood history by week, month, or all time
- **Export Data**: Save mood history and settings for backup

### ⚙️ Settings & Customization
- **Notification Settings**: Configurable mood tracking reminders
- **Auto-save Options**: Automatically save mood photos to gallery
- **Quality Settings**: High-quality analysis mode for enhanced accuracy
- **Data Management**: Export and clear personal data options

## Tech Stack

### Frontend Framework
- **React Native**: Cross-platform mobile development
- **Expo**: Rapid development and deployment platform
- **React Navigation**: Navigation library for seamless screen transitions

### UI Components
- **React Native Paper**: Material Design 3 components
- **React Native Animatable**: Smooth animations and transitions
- **Expo Linear Gradient**: Beautiful gradient backgrounds
- **React Native Vector Icons**: Comprehensive icon library

### Device Features
- **Expo Camera**: Camera access for mood selfies
- **Expo AV**: Audio recording for voice mood analysis
- **Expo Media Library**: Photo and media management
- **Expo File System**: Local file storage and management

### Data & Analytics
- **AsyncStorage**: Local data persistence
- **React Native Chart Kit**: Charts and data visualization
- **React Native SVG**: Custom graphics and icons

## Installation & Development

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

### Setup
```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Scan QR code with Expo Go app to test on device
```

### Build for Production
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Submit to app stores
npx expo submit
```

## App Store Deployment

### Android (Google Play Store)
1. **Build APK/AAB**: Use `expo build:android` to generate production builds
2. **App Signing**: Configure app signing keys for Play Store
3. **Store Listing**: Create compelling store description and screenshots
4. **Permissions**: Camera, microphone, and storage permissions are required
5. **Testing**: Internal testing with Google Play Console before public release

### iOS (Apple App Store)
1. **Build IPA**: Use `expo build:ios` with valid Apple Developer account
2. **TestFlight**: Beta testing distribution through Apple TestFlight
3. **App Review**: Submit for Apple's app review process
4. **Privacy Policy**: Required for camera and microphone usage

## Privacy & Data Security

### Local Data Storage
- All mood detection data stored locally on device
- No personal data transmitted to external servers
- User controls data export and deletion

### Permissions
- **Camera**: Required for mood detection via selfies
- **Microphone**: Required for voice-based mood analysis
- **Storage**: Optional for saving mood photos to gallery

### Compliance
- GDPR compliant with user data control
- No tracking or analytics without explicit consent
- Transparent privacy policy included in app

## Architecture

### Screen Structure
- **HomeScreen**: Welcome dashboard with quick stats and actions
- **MoodDetectionScreen**: Camera and audio interfaces for mood detection
- **MusicRecommendationsScreen**: Browse and play mood-based music
- **MoodHistoryScreen**: Historical data with charts and analytics
- **SettingsScreen**: App configuration and data management

### Data Flow
1. **Detection**: User captures mood via photo or audio
2. **Processing**: AI analyzes input and determines mood with confidence
3. **Storage**: Mood data saved locally with timestamp
4. **Recommendations**: Music suggestions generated based on detected mood
5. **History**: All sessions tracked for pattern analysis

## Future Enhancements

### Planned Features
- Spotify API integration for personalized playlists
- YouTube Music API for enhanced recommendations
- Social sharing of mood insights
- Machine learning model improvements
- Wearable device integration

### Technical Improvements
- Offline mood detection capabilities
- Advanced emotion recognition algorithms
- Cloud backup and sync across devices
- Real-time collaborative playlists

## Support

For support, feature requests, or bug reports:
- Email: support@musicmoodmapper.com
- GitHub Issues: [Report bugs and suggest features]

## License

This project is designed for commercial distribution on mobile app stores. All rights reserved.