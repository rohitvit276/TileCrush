# Music Mood Mapper Android Application

## Overview

This repository contains a complete Android application for the Play Store that detects user mood through selfies and audio, then recommends music from Spotify/YouTube based on the detected mood. The app includes comprehensive mood tracking and music history features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Infrastructure as Code Approach
- **Technology**: Ansible automation framework
- **Target Systems**: RHEL/CentOS 7+ and Ubuntu 18.04+
- **Orchestration**: Ansible Tower compatibility for enterprise deployments
- **Version Control**: GitHub integration for configuration management

### Deployment Strategy
- **Configuration Management**: Ansible playbooks and roles
- **Backup & Recovery**: Remote backup restoration capabilities  
- **Server Management**: Deployment server with serverclass management
- **Licensing**: Valid Splunk Enterprise license required

## Recent Changes

### August 1, 2025 - Rock Crush Complete Production Package
- ✓ **GAME DEVELOPMENT**: Complete Candy Crush-style match-3 game with 6 unique rock types
- ✓ **GAMEPLAY MECHANICS**: Grid-based physics, swipe-to-swap controls, cascading matches
- ✓ **AUDIO SYSTEM**: Dynamic feedback - success sounds, clapping for 4+ matches, cheering for 5+ matches
- ✓ **HINT SYSTEM**: Intelligent hints with golden highlighting when one move remains
- ✓ **UI/UX**: Professional dark theme, animations, game over screen, restart functionality
- ✓ **MONETIZATION**: Premium subscription ($2.99/month) with ad-free experience and unlimited hints
- ✓ **AD SYSTEM**: Non-intrusive end-of-game ads only (improved from persistent banners)
- ✓ **PURCHASE INTEGRATION**: Complete in-app purchase system with receipt validation
- ✓ **DEPLOYMENT READY**: EAS build configuration, automated deployment scripts
- ✓ **LEGAL COMPLIANCE**: Comprehensive privacy policy meeting Google Play Store requirements
- ✓ **STORE ASSETS**: Complete deployment guides, app descriptions, and asset requirements
- ✓ **READY FOR LAUNCH**: Production-ready game package for immediate Google Play Store submission

### August 5, 2025 - AWS Play Store Deployment Solution
- ✓ **PLAY STORE DEPLOYMENT**: Created AWS CodeBuild solution for Google Play Store AAB generation
- ✓ **BUILD INFRASTRUCTURE**: Complete buildspec.yml configuration for Android AAB builds via AWS
- ✓ **REGISTRY BYPASS**: AWS CodeBuild circumvents npm registry blocks affecting EAS CLI
- ✓ **AUTOMATED PIPELINE**: GitHub integration with automatic builds and S3 artifact storage
- ✓ **COST EFFECTIVE**: Under $5/month for regular builds with detailed cost breakdown
- ✓ **PROFESSIONAL CI/CD**: Enterprise-grade build environment for app store submission
- ✓ **STORE READY**: Generated AAB files directly compatible with Google Play Console upload

### July 30, 2025 - Python Server Connectivity Checker Application
- ✓ Created standalone Python application for SSH connectivity testing
- ✓ Supports multiple input formats: text files, CSV, Excel spreadsheets
- ✓ Implemented concurrent multi-threaded connectivity testing
- ✓ Added comprehensive status reporting and error handling
- ✓ Created detailed documentation and deployment guides
- ✓ Designed for workplace deployment with professional features
- ✓ Application ready for copying to work environment
- ✓ **ENHANCED**: Added username/password authentication support
- ✓ **ENHANCED**: Implemented interactive credential prompting
- ✓ **ENHANCED**: Added sshpass and expect integration for password auth
- ✓ **ENHANCED**: Created comprehensive authentication options and documentation

## Key Components

### Ansible Automation
- **Playbooks**: Main orchestration files for deployment workflows
- **Roles**: Modular components for specific Splunk configurations
- **Inventory**: Target system definitions and groupings
- **Variables**: Environment-specific configurations and secrets

### Splunk Enterprise Components
- **Deployment Server**: Central configuration distribution point
- **Serverclass Management**: Organized client groupings and app deployment
- **Configuration Apps**: Splunk applications and configurations
- **Index Management**: Data storage and retention policies

### Integration Points
- **GitHub Repository**: Configuration version control and collaboration
- **Ansible Tower**: Enterprise automation platform integration
- **Backup Systems**: Remote backup source integration
- **License Server**: Splunk license management

## Data Flow

### Deployment Workflow
1. **Preparation**: Ansible gathers system facts and validates prerequisites
2. **Installation**: Splunk Enterprise software deployment to target systems
3. **Configuration**: Base Splunk settings and deployment server setup
4. **Restoration**: Backup data restoration from remote sources (if applicable)
5. **Integration**: GitHub configuration sync and serverclass setup
6. **Validation**: Health checks and deployment verification

### Configuration Management
1. **Version Control**: GitHub stores configuration templates and apps
2. **Distribution**: Deployment server pushes configurations to clients
3. **Monitoring**: Ansible validates deployment status and health
4. **Updates**: Automated configuration updates through playbook execution

## External Dependencies

### Required Software
- **Ansible**: Version 2.9+ for automation execution
- **Python**: Version 3.6+ runtime environment
- **Splunk Enterprise**: Licensed software package
- **Git**: Version control client for GitHub integration

### Infrastructure Requirements
- **Target Systems**: Linux-based servers (RHEL/CentOS/Ubuntu)
- **Network Access**: Connectivity between Ansible controller and targets
- **GitHub Access**: Repository access for configuration management
- **Backup Storage**: Remote backup source accessibility

### Optional Components
- **Ansible Tower**: Enterprise automation platform
- **License Server**: Centralized Splunk license management
- **Monitoring Systems**: Infrastructure and application monitoring

## Deployment Strategy

### Environment Setup
- **Development**: Local Ansible execution for testing and validation
- **Staging**: Pre-production environment for deployment testing
- **Production**: Enterprise deployment using Ansible Tower

### Execution Methods
- **Manual Deployment**: Direct ansible-playbook command execution
- **Automated Deployment**: Ansible Tower job templates and workflows
- **Scheduled Operations**: Recurring maintenance and update tasks

### Error Handling
- **Validation Checks**: Prerequisites and system compatibility verification
- **Rollback Procedures**: Configuration restoration and service recovery
- **Logging**: Comprehensive execution logging for troubleshooting
- **Notifications**: Deployment status and error reporting

### Security Considerations
- **Credential Management**: Ansible Vault for sensitive data encryption
- **Access Control**: Role-based permissions for deployment operations
- **Network Security**: Secure communication channels between systems
- **Audit Trail**: Complete deployment activity logging