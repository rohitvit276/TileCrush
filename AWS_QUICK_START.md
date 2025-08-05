# Rock Crush - AWS Quick Start Guide

## Why AWS for Rock Crush?
Your npm registry blocks EAS CLI, making standard Expo builds impossible. AWS provides enterprise-grade alternatives that bypass these restrictions.

## Fastest Method: AWS Amplify

### Step 1: Set Up AWS Account
1. **Go to**: https://aws.amazon.com/
2. **Create free account** (12 months free tier)
3. **Verify email and phone**

### Step 2: Install AWS Amplify CLI
```bash
# Try npm first
npm install -g @aws-amplify/cli

# If blocked, use yarn alternative
npm install -g yarn
yarn global add @aws-amplify/cli

# If both fail, use AWS CloudShell (web-based terminal)
```

### Step 3: Configure Amplify
```bash
# In your Rock Crush project directory
amplify init

# Follow prompts:
# - Project name: RockCrush
# - Environment: production
# - Editor: Visual Studio Code
# - AWS profile: default
```

### Step 4: Add Hosting
```bash
amplify add hosting

# Choose:
# - Amazon CloudFront and S3
# - Hosting bucket name: rock-crush-hosting
```

### Step 5: Deploy
```bash
# Build and deploy to AWS
amplify publish
```

**Result**: Your Rock Crush game will be live at a CloudFront URL in 5-10 minutes.

## Alternative: AWS Console (No CLI Required)

### For Web Deployment
1. **AWS Console → S3**
2. **Create bucket**: `rock-crush-web-app`
3. **Upload files**: Your entire project
4. **Enable static hosting**
5. **Set index.html** as index document

### For Mobile Build
1. **AWS Console → CodeBuild**
2. **Create project**: Link to your GitHub repo
3. **Use this buildspec.yml**:
```yaml
version: 0.2
phases:
  pre_build:
    commands:
      - npm install -g expo-cli
  build:
    commands:
      - expo build:android --type app-bundle
artifacts:
  files:
    - '*.aab'
```

## Cost Breakdown

### Free Tier (First Year)
- **S3**: 5GB storage free
- **CloudFront**: 50GB transfer free
- **Amplify**: 1000 build minutes free
- **CodeBuild**: 100 build minutes free

### After Free Tier
- **Small app hosting**: $1-3/month
- **Medium traffic**: $5-15/month
- **High traffic**: $20-50/month

## Benefits Over Standard Deployment

### Technical Advantages
- **Bypasses npm registry blocks**
- **Global CDN**: Faster loading worldwide
- **Auto-scaling**: Handles traffic spikes
- **SSL certificates**: Automatic HTTPS
- **Professional URLs**: Custom domains available

### Business Advantages
- **Enterprise hosting**: Suitable for commercial apps
- **Monitoring**: AWS CloudWatch analytics
- **Backup**: Automatic versioning
- **Security**: AWS-grade infrastructure
- **Support**: AWS technical support available

## Mobile App Building via AWS

### CodeBuild for APK/AAB
1. **Connect GitHub** to AWS CodeBuild
2. **Configure build environment**:
   - Ubuntu Standard 7.0
   - Node.js 18
3. **Use mobile buildspec**:
```yaml
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 18
  pre_build:
    commands:
      - npm install -g expo-cli
  build:
    commands:
      - expo build:android --type app-bundle
  post_build:
    commands:
      - aws s3 cp *.aab s3://your-build-bucket/
```

### Expected Timeline
- **Setup**: 30 minutes
- **First build**: 15-20 minutes
- **Subsequent builds**: 10-15 minutes
- **Total to Google Play**: Same day

## Domain Configuration (Optional)

### Custom Domain Setup
1. **Route 53**: Purchase domain ($12/year)
2. **Certificate Manager**: Free SSL certificate
3. **CloudFront**: Connect domain to your app
4. **Result**: `rockcrush.com` instead of AWS URLs

## Monitoring Your App

### Built-in Analytics
- **CloudWatch**: Server performance
- **S3 analytics**: Download statistics
- **CloudFront**: Global usage patterns
- **Cost explorer**: Spending tracking

## Security Features

### Automatic Protection
- **DDoS protection**: AWS Shield
- **SSL/TLS**: Encrypted connections
- **Access control**: IAM permissions
- **Backup**: S3 versioning

## Getting Started Checklist

- [ ] Create AWS free account
- [ ] Install Amplify CLI or use AWS Console
- [ ] Upload Rock Crush project files
- [ ] Configure hosting settings
- [ ] Deploy and test
- [ ] (Optional) Set up custom domain
- [ ] (Optional) Configure mobile builds

## Success Indicators

### When Everything Works
- ✅ **Web app loads** at CloudFront URL
- ✅ **Game functions** properly online
- ✅ **Audio plays** correctly
- ✅ **Monetization works** (ads/subscriptions)
- ✅ **Mobile builds** generate AAB files
- ✅ **Global access** from any location

Your Rock Crush game will have professional hosting that scales globally and bypasses all local network restrictions!