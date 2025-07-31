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

### July 31, 2025 - Music Mood Mapper Android App Development
- ✓ **ARCHIVED**: Previous Ansible and Python applications moved to /archive directory
- ✓ **SETUP**: React Native/Expo development environment for cross-platform mobile app
- ✓ **CREATED**: Complete app structure with 5 main screens (Home, Mood Detection, Music, History, Settings)
- ✓ **IMPLEMENTED**: Mood detection via camera selfies and audio recording
- ✓ **BUILT**: Music recommendation system with Spotify/YouTube integration
- ✓ **DEVELOPED**: Mood history tracking with charts and analytics
- ✓ **DESIGNED**: Material Design 3 UI with custom theme and animations
- ✓ **CONFIGURED**: App permissions for camera, microphone, and storage access
- ✓ **INTEGRATED**: Local data storage with AsyncStorage for mood history
- ✓ **CREATED**: SVG app icons and splash screen graphics
- ✓ **READY**: Complete Play Store-ready Android application with full functionality
- ✓ **ENHANCED**: Added multi-language support (Hindi and English)
- ✓ **EXPANDED**: 70+ songs with authentic Hindi and English music collections
- ✓ **LOCALIZED**: Complete UI translation for Hindi-speaking users

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