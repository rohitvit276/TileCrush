# Rock Crush - AWS Deployment Guide

## Overview
Deploy your Rock Crush game to AWS for global distribution, bypassing npm registry issues and providing enterprise-grade hosting.

## AWS Deployment Methods

### Method 1: AWS Amplify (Recommended for Mobile Apps)

#### Step 1: Prerequisites
- AWS Account (free tier available)
- Your Rock Crush project files
- Git repository (GitHub/GitLab)

#### Step 2: Set Up AWS Amplify
```bash
# Install AWS Amplify CLI
npm install -g @aws-amplify/cli

# If npm issues persist, use yarn:
npm install -g yarn
yarn global add @aws-amplify/cli
```

#### Step 3: Configure Amplify
```bash
# Initialize Amplify in your project
amplify init

# Add hosting
amplify add hosting

# Choose options:
# - Select plugin module: Hosting with Amplify Console
# - Type: Manual deployment
```

#### Step 4: Deploy Your App
```bash
# Build and deploy
amplify publish
```

### Method 2: AWS CodeBuild + S3 (Alternative)

#### Step 1: Create S3 Bucket
1. **Login to AWS Console**
2. **Go to S3**
3. **Create bucket**: `rock-crush-app-[random-number]`
4. **Enable static website hosting**
5. **Set index document**: `index.html`

#### Step 2: Create Build Specification
Create `buildspec.yml` in your project root:

```yaml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Installing dependencies...
      - npm install -g @expo/cli
  build:
    commands:
      - echo Building for web...
      - npx expo export --platform web
  post_build:
    commands:
      - echo Build completed on `date`

artifacts:
  files:
    - '**/*'
  base-directory: dist
```

#### Step 3: Set Up CodeBuild
1. **Go to AWS CodeBuild**
2. **Create build project**
3. **Source**: Your Git repository
4. **Environment**: Ubuntu Standard 7.0
5. **Buildspec**: Use buildspec.yml
6. **Artifacts**: S3 bucket you created

#### Step 4: Deploy
1. **Start build** in CodeBuild
2. **Files automatically upload** to S3
3. **Access your app** via S3 website URL

### Method 3: Docker + AWS ECS (Advanced)

#### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx expo export --platform web

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Step 2: Build and Push to ECR
```bash
# Create ECR repository
aws ecr create-repository --repository-name rock-crush

# Build Docker image
docker build -t rock-crush .

# Tag and push to ECR
docker tag rock-crush:latest [account-id].dkr.ecr.[region].amazonaws.com/rock-crush:latest
docker push [account-id].dkr.ecr.[region].amazonaws.com/rock-crush:latest
```

#### Step 3: Deploy to ECS
1. **Create ECS cluster**
2. **Create task definition** using your ECR image
3. **Create service** with desired capacity
4. **Configure load balancer** (optional)

## Mobile App Building with AWS

### AWS Device Farm for Testing
```bash
# Upload your APK to Device Farm
aws devicefarm create-upload --project-arn [project-arn] --name "rock-crush.apk" --type ANDROID_APP
```

### Alternative Build with AWS CodeBuild

#### Create Mobile Build Specification
```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
      android: 30
  pre_build:
    commands:
      - echo Installing Expo CLI...
      - npm install -g expo-cli
      - echo Setting up Android SDK...
      - export ANDROID_HOME=/usr/lib/android-sdk
  build:
    commands:
      - echo Building APK...
      - expo build:android --type apk
      - echo Build completed
  post_build:
    commands:
      - echo Uploading to S3...

artifacts:
  files:
    - '*.apk'
```

## AWS Services Overview

### Cost Estimation (Monthly)
- **Amplify**: $1-5 for small apps
- **S3 + CloudFront**: $1-3 for static hosting
- **ECS**: $10-30 for container hosting
- **CodeBuild**: $0.005 per build minute

### Benefits of AWS Deployment
- **Global CDN**: Fast loading worldwide
- **SSL/HTTPS**: Automatic certificates
- **Scalability**: Handle traffic spikes
- **Monitoring**: CloudWatch integration
- **CI/CD**: Automated deployments

## Production Configuration

### Environment Variables
Set these in AWS Console:
```bash
NODE_ENV=production
EXPO_USE_METRICS=false
EXPO_USE_FAST_RESOLVER=true
```

### Domain Configuration
1. **Purchase domain** in Route 53
2. **Create certificate** in ACM
3. **Configure DNS** to point to your deployment

## Monitoring and Analytics

### CloudWatch Setup
```bash
# Install CloudWatch agent
aws logs create-log-group --log-group-name "/aws/amplify/rock-crush"
```

### Performance Monitoring
- **CloudWatch**: Server metrics
- **X-Ray**: Request tracing
- **AWS Analytics**: User behavior

## Security Configuration

### IAM Policies
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::rock-crush-app/*"
    }
  ]
}
```

### Security Headers
Configure CloudFront with security headers:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options

## Troubleshooting

### Common Issues
1. **Build failures**: Check buildspec.yml syntax
2. **Permission errors**: Verify IAM roles
3. **Domain issues**: Check Route 53 configuration

### Debug Commands
```bash
# Check Amplify status
amplify status

# View logs
aws logs describe-log-groups

# Test deployment
curl -I https://your-domain.com
```

## Next Steps After AWS Deployment

### For Mobile App Distribution
1. **Build APK/AAB** using AWS CodeBuild
2. **Test on Device Farm**
3. **Upload to Google Play Store**
4. **Configure app signing**

### For Web App
1. **Configure custom domain**
2. **Set up monitoring**
3. **Enable caching**
4. **Configure analytics**

## Why Choose AWS for Rock Crush

### Advantages
- **Bypasses npm registry issues**
- **Professional hosting infrastructure**
- **Built-in CI/CD pipelines**
- **Global content delivery**
- **Enterprise-grade security**
- **Detailed analytics and monitoring**

### Best Use Cases
- **Corporate networks** with npm restrictions
- **Global audience** requiring fast loading
- **Professional deployment** for app store submission
- **Scalable hosting** for viral growth

Your Rock Crush game will have professional-grade hosting with AWS, ensuring fast loading times and reliable availability worldwide!