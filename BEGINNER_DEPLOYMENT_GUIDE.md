# Rock Crush - Complete Beginner's Google Play Store Deployment Guide

## 🎯 What You'll Accomplish
By following this guide, you'll publish your Rock Crush game on Google Play Store where millions of people can download and play it. No programming experience needed!

## ⏱️ Time Required
- **Total time**: 2-4 hours
- **Google Play review**: 1-3 days after submission
- **Your game will be live**: Within 1 week

## 💰 Costs Involved
- **Google Play Console**: $25 (one-time fee, lifetime access)
- **Expo account**: Free
- **Everything else**: Free

---

## STEP 1: Set Up Your Google Play Console Account (20 minutes)

### What You Need
- Gmail account
- $25 payment (credit card or PayPal)
- Government-issued ID for verification

### Instructions
1. **Go to**: https://play.google.com/console/
2. **Click**: "Get started" 
3. **Sign in** with your Gmail account
4. **Pay the $25** registration fee
5. **Complete identity verification** (upload ID, answer questions)
6. **Wait for approval** (usually 1-2 hours, sometimes up to 24 hours)

**✅ Success Check**: You can access the Google Play Console dashboard

---

## STEP 2: Create Your Expo Account (5 minutes)

### Why You Need This
Expo is the service that will build your app into the format Google Play Store needs.

### Instructions
1. **Go to**: https://expo.dev/
2. **Click**: "Sign up"
3. **Use the same Gmail** you used for Google Play Console
4. **Verify your email** when prompted

**✅ Success Check**: You can log into expo.dev

---

## STEP 3: Install Required Software (15 minutes)

### You Need to Install 3 Things

#### A. Install Node.js
1. **Go to**: https://nodejs.org/
2. **Download**: The version marked "LTS" (Long Term Support)
3. **Run the installer** and click "Next" through all steps
4. **Restart your computer** after installation

#### B. Install Git
1. **Go to**: https://git-scm.com/download/
2. **Download for your operating system** (Windows/Mac/Linux)
3. **Run the installer** and use default settings

#### C. Install Expo CLI
1. **Open Command Prompt** (Windows) or **Terminal** (Mac/Linux)
   - Windows: Press `Windows key + R`, type `cmd`, press Enter
   - Mac: Press `Cmd + Space`, type "Terminal", press Enter
2. **Type this command** and press Enter:
   ```
   npm install -g @expo/eas-cli
   ```
3. **Wait for installation** (takes 2-5 minutes)

**✅ Success Check**: Type `eas --version` in command prompt - you should see a version number

---

## STEP 4: Download and Set Up Your Game Files (10 minutes)

### Option A: If You Have the Files Already
1. **Extract** your Rock Crush game files to a folder
2. **Remember the folder location** (e.g., `C:\Users\YourName\RockCrush\`)

### Option B: If You Need to Download from Replit
1. **Go to your Replit project**
2. **Click the three dots** menu
3. **Select "Download as zip"**
4. **Extract the zip file** to your computer
5. **Remember the folder location**

**✅ Success Check**: You have a folder with files like `App.js`, `package.json`, etc.

---

## STEP 5: Prepare Your Game for Deployment (15 minutes)

### Open Command Prompt in Your Game Folder
1. **Navigate to your game folder**:
   - Windows: Hold Shift + Right-click in the folder, select "Open PowerShell window here"
   - Mac: Right-click folder, select "New Terminal at Folder"

### Install Dependencies
2. **Type these commands** one at a time, pressing Enter after each:
   ```
   npm install
   ```
   (Wait for this to finish - takes 2-5 minutes)

   **❌ If you get a 404 error**: Your project has dependency issues. Follow these steps:
   - Rename the current package.json: `mv package.json package-old.json`
   - Use the simplified version: `mv package-simple.json package.json`
   - Try again: `npm install`
   - **Still having issues?** See `TROUBLESHOOTING_DEPLOYMENT.md` for complete solutions

### Login to Expo
3. **Type this command**:
   ```
   eas login
   ```
4. **Enter your Expo email and password** when prompted

**✅ Success Check**: You see "Logged in as [your-email]"

---

## STEP 6: Build Your App for Google Play Store (30 minutes)

### Start the Build Process
1. **Type this command**:
   ```
   eas build --platform android --profile production
   ```

2. **Answer the questions** that appear:
   - "Generate a new Android Keystore?" → **Type `Y`** and press Enter
   - "Would you like to automatically create an EAS project?" → **Type `Y`** and press Enter

### Wait for Your Build
3. **The build will take 10-20 minutes**
4. **You'll see a URL** like `https://expo.dev/accounts/[username]/projects/[project]/builds/[id]`
5. **Open this URL** in your web browser to track progress
6. **When finished**, you'll see a **Download** button

### Download Your App File
7. **Click "Download"** to get your `.aab` file
8. **Save it somewhere you'll remember** (like your Desktop)

**✅ Success Check**: You have a file ending in `.aab` (Android App Bundle)

---

## STEP 7: Create Your App Listing in Google Play Console (45 minutes)

### Create New App
1. **Go to**: https://play.google.com/console/
2. **Click**: "Create app"
3. **Fill out the form**:
   - App name: **Rock Crush**
   - Default language: **English (United States)**
   - App or game: **Game**
   - Free or paid: **Free**
4. **Check all the boxes** (declarations)
5. **Click**: "Create app"

### Set Up Your App Information

#### Main Store Listing
1. **Go to**: Main store listing (in left menu)
2. **Fill out**:
   - **App name**: Rock Crush
   - **Short description**: `Match colorful rocks in this addictive puzzle game! Crush 3+ rocks to score.`
   - **Full description**: Copy this text:
   ```
   🎮 ROCK CRUSH - The Ultimate Match-3 Puzzle Adventure!

   Crush colorful rocks in this addictive match-3 puzzle game! Swap adjacent rocks to create lines of 3 or more matching stones and watch them disappear in satisfying cascades.

   🌟 KEY FEATURES:
   • Classic match-3 gameplay with modern polish
   • 6 unique rock types with vibrant colors
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

   Perfect for puzzle lovers of all ages! Download Rock Crush now and start your addictive matching adventure.

   ✨ HIGHLIGHTS:
   • Free version with optional premium upgrade ($2.99/month)
   • Premium removes ads and unlocks unlimited hints
   • Offline gameplay - play anywhere
   • Family-friendly content
   • Professional graphics and sound
   • Smooth gameplay experience

   Join thousands of players crushing rocks and setting high scores!
   ```

#### Graphics Assets
3. **You need to create/upload**:
   - **App icon**: 512 x 512 pixels (use your game's icon)
   - **Feature graphic**: 1024 x 500 pixels (create a banner image)
   - **Screenshots**: At least 2 phone screenshots

**How to get screenshots**:
- Open your game in a web browser
- Take screenshots while playing
- Use your computer's screenshot tool
- Resize to be at least 320 pixels wide

#### Store Settings
4. **Category**: Puzzle
5. **Contact details**:
   - Your email address
   - Privacy policy: Upload the `PRIVACY_POLICY.md` content to a webpage or use Google's policy generator

**✅ Success Check**: Main store listing shows "Complete" with green checkmark

---

## STEP 8: Upload Your App (15 minutes)

### Go to Production Track
1. **Click**: "Production" in the left menu under "Release"
2. **Click**: "Create new release"

### Upload Your App Bundle
3. **Click**: "Upload" in the App bundles section
4. **Select your `.aab` file** that you downloaded earlier
5. **Wait for upload** (1-2 minutes)

### Add Release Notes
6. **In "Release notes"**, add:
   ```
   🎮 Rock Crush v1.0.0 - Initial Release

   Welcome to Rock Crush, the ultimate match-3 puzzle experience!

   ✨ What's New:
   • Launch version with full match-3 gameplay
   • 6 colorful rock types to match and crush
   • Dynamic audio feedback system
   • Smart hint system for challenging puzzles
   • Premium subscription option ($2.99/month)
   • Professional animations and effects
   • Local high score tracking

   Start your rock crushing adventure today!
   ```

**✅ Success Check**: Your app bundle appears in the release with a green checkmark

---

## STEP 9: Complete Required Information (30 minutes)

### Content Rating
1. **Go to**: Content rating (in left menu)
2. **Click**: "Start questionnaire"
3. **Answer the questions**:
   - Does your app contain violence? **No**
   - Does your app contain mature/suggestive content? **No**
   - Does your app show realistic violence? **No**
   - Continue answering **No** to all violence questions
   - Does your app contain ads? **Yes**
   - Does your app have in-app purchases? **Yes**
4. **Complete and get your rating**: Should be "Everyone"

### Target Audience
5. **Go to**: Target audience
6. **Select**: 
   - Target age group: **13 and older**
   - Do you want your app to appeal to children under 13? **No**

### Data Safety
7. **Go to**: Data safety
8. **Fill out**:
   - Does your app collect user data? **Yes**
   - What data do you collect? **Device identifiers** (for ads)
   - Do you share data? **Yes, with advertising partners**
   - Upload your privacy policy

**✅ Success Check**: All policy sections show "Complete" status

---

## STEP 10: Submit for Review (10 minutes)

### Final Review
1. **Go back to**: Production release
2. **Click**: "Review release"
3. **Check everything looks correct**
4. **Click**: "Start rollout to production"

### Confirmation
5. **You'll see**: "Your release is being reviewed"
6. **Google will email you** when review is complete (1-3 days)

**✅ Success Check**: Your app status shows "Under review"

---

## STEP 11: What Happens Next

### Review Process (1-3 Days)
- **Google reviews your app** for policy compliance
- **You'll get an email** with the result
- **Most apps are approved** on first submission

### If Approved ✅
- **Your app goes live** automatically
- **People can download it** from Google Play Store
- **You start earning** from premium subscriptions and ads

### If Rejected ❌
- **Google tells you what to fix**
- **Make the required changes**
- **Resubmit for review**

---

## 🎉 Congratulations!

You've successfully submitted your Rock Crush game to Google Play Store! Here's what you accomplished:

✅ **Created a Google Play Console account**  
✅ **Built your game into a publishable format**  
✅ **Created a professional app store listing**  
✅ **Submitted for review**  
✅ **Set up monetization** with ads and premium subscriptions  

### Your Next Steps
1. **Wait for Google's approval email** (1-3 days)
2. **Share your game** with friends and family
3. **Monitor your earnings** in Google Play Console
4. **Plan updates** and new features

### Support
If you get stuck:
- **Google Play Console Help**: https://support.google.com/googleplay/android-developer/
- **Expo Documentation**: https://docs.expo.dev/
- **Your app will be live at**: `https://play.google.com/store/apps/details?id=com.rockcrush.app`

**Welcome to the world of mobile app publishing!** 🎮