# Rock Crush - Google Play Store Deployment via AWS

## Overview
Use AWS CodeBuild to generate your AAB file for Google Play Store submission, bypassing local npm registry issues.

## Method: AWS CodeBuild for Play Store AAB Generation

### Step 1: Prepare Your Repository
Push your Rock Crush project to GitHub with these files:
- `App.js` (your main game)
- `app.json` (configured for Android)
- `eas.json` (build configuration)
- `package.json` (dependencies)
- `src/` folder (complete game code)
- `assets/` folder (icons, images)
- `buildspec.yml` (AWS build instructions - see below)

### Step 2: Create AWS CodeBuild Project

#### Login to AWS Console
1. Go to https://console.aws.amazon.com/
2. Search for "CodeBuild"
3. Click "Create build project"

#### Configure Project Settings
```
Project name: rock-crush-playstore-build
Description: Build AAB file for Google Play Store
```

#### Source Configuration
```
Source provider: GitHub
Repository: Connect to your GitHub account
Repository URL: Your Rock Crush repository
Source version: main (or master)
```

#### Environment Configuration
```
Environment image: Managed image
Operating system: Ubuntu
Runtime: Standard
Image: aws/codebuild/standard:7.0
Environment type: Linux
Privileged: Yes (required for Docker)
Service role: Create new service role
```

#### Build Specification
Create `buildspec.yml` in your project root:

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - echo Installing system dependencies...
      - apt-get update
      - apt-get install -y openjdk-17-jdk
      - export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
      
  pre_build:
    commands:
      - echo Installing Expo CLI...
      - npm install -g @expo/cli
      - echo Setting up Android SDK...
      - wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
      - unzip commandlinetools-linux-9477386_latest.zip
      - mkdir -p android-sdk/cmdline-tools/latest
      - mv cmdline-tools/* android-sdk/cmdline-tools/latest/
      - export ANDROID_HOME=$PWD/android-sdk
      - export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
      - export PATH=$PATH:$ANDROID_HOME/platform-tools
      - yes | sdkmanager --licenses
      - sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
      
  build:
    commands:
      - echo Starting build process...
      - echo Installing project dependencies...
      - npm install
      - echo Building production AAB for Play Store...
      - npx eas build --platform android --profile production --non-interactive
      - echo Build completed successfully
      
  post_build:
    commands:
      - echo Uploading AAB to S3...
      - aws s3 cp *.aab s3://rock-crush-builds/ || echo "AAB file not found in current directory"
      - find . -name "*.aab" -exec aws s3 cp {} s3://rock-crush-builds/ \;

artifacts:
  files:
    - '**/*.aab'
  name: rock-crush-$(date +%Y-%m-%d)
```

### Step 3: Set Up S3 Bucket for AAB Storage

#### Create S3 Bucket
1. Go to S3 in AWS Console
2. Create bucket: `rock-crush-builds`
3. Keep default settings
4. Create bucket

#### Set Bucket Permissions
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "codebuild.amazonaws.com"
            },
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::rock-crush-builds/*"
        }
    ]
}
```

### Step 4: Configure Environment Variables

In CodeBuild project settings, add:
```
EXPO_TOKEN=your_expo_token
ANDROID_KEYSTORE_PASSWORD=your_keystore_password
ANDROID_KEY_PASSWORD=your_key_password
```

Get your Expo token:
```bash
npx expo login
npx expo whoami --auth
```

### Step 5: Alternative Buildspec (If EAS Issues Persist)

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
      
  pre_build:
    commands:
      - npm install -g @expo/cli
      
  build:
    commands:
      - echo Building web version first...
      - npx expo export --platform web
      - echo Converting to Android build...
      - npx expo run:android --variant release
      
  post_build:
    commands:
      - find . -name "*.aab" -o -name "*.apk" | head -5
      - aws s3 sync . s3://rock-crush-builds/ --exclude "*" --include "*.aab" --include "*.apk"

artifacts:
  files:
    - '**/*.aab'
    - '**/*.apk'
```

### Step 6: Trigger Build

#### Manual Build
1. Go to your CodeBuild project
2. Click "Start build"
3. Wait 15-30 minutes
4. Download AAB from S3 bucket

#### Automatic Build (Optional)
Set up webhook to trigger builds on GitHub push:
1. In CodeBuild project settings
2. Enable webhook for GitHub
3. Choose "PUSH" events
4. Builds trigger automatically on code changes

### Step 7: Download and Submit to Play Store

#### Download AAB File
1. Go to S3 bucket `rock-crush-builds`
2. Download the latest `.aab` file
3. Verify file size (should be 15-50MB)

#### Submit to Google Play Console
1. Login to Google Play Console
2. Create new app "Rock Crush"
3. Upload AAB file
4. Complete store listing:
   - App description (use prepared content)
   - Screenshots (take from web version)
   - Privacy policy (already created)
   - Content rating
5. Submit for review

## Cost Breakdown

### AWS Costs
- **CodeBuild**: $0.005 per build minute
- **S3 storage**: $0.023 per GB per month
- **Data transfer**: First GB free

### Example Monthly Cost
- **10 builds/month**: ~$2-3
- **Storage**: ~$0.50
- **Total**: Under $5/month

## Benefits of AWS Method

### Technical Advantages
- **Bypasses npm registry blocks**
- **Consistent build environment**
- **Automated AAB generation**
- **Version control integration**
- **Build artifact storage**

### Process Advantages
- **No local setup required**
- **Repeatable builds**
- **CI/CD ready**
- **Team collaboration**
- **Build history tracking**

## Troubleshooting

### Common Build Failures

#### EAS Authentication Issues
```yaml
# Add to pre_build phase
- echo "machine expo.dev login expo password $EXPO_TOKEN" > ~/.netrc
```

#### Android SDK Issues
```yaml
# Add to install phase
- export ANDROID_COMPILE_SDK=33
- export ANDROID_BUILD_TOOLS=33.0.0
```

#### Memory Issues
```yaml
# Add to build phase
- export NODE_OPTIONS="--max-old-space-size=8192"
```

### Build Verification
```bash
# Check AAB file integrity
aapt2 dump badging your-app.aab

# Verify signing
jarsigner -verify -verbose your-app.aab
```

## Expected Timeline

### Setup Phase
- **AWS account setup**: 15 minutes
- **CodeBuild configuration**: 30 minutes
- **First successful build**: 45 minutes

### Production Phase
- **Each build**: 15-25 minutes
- **Play Store upload**: 10 minutes
- **Review process**: 1-3 days

## Success Indicators

When everything works correctly:
- ✅ CodeBuild completes successfully
- ✅ AAB file appears in S3 bucket
- ✅ File size is reasonable (15-50MB)
- ✅ Google Play Console accepts upload
- ✅ App passes initial validation

Your Rock Crush game will be successfully submitted to Google Play Store using professional AWS infrastructure!