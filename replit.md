# Splunk Enterprise Deployment Server Ansible Automation

## Overview

This repository contains Ansible automation for deploying and configuring Splunk Enterprise as a deployment server. The system provides complete installation, configuration management, backup restoration, and GitHub integration capabilities with Ansible Tower compatibility.

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

### July 30, 2025 - Complete Ansible Automation Implementation & Debugging
- ✓ Created comprehensive Ansible automation for Splunk Enterprise deployment server
- ✓ Implemented modular role-based architecture with 4 core roles:
  - common: Base system configuration and requirements
  - splunk_enterprise: Complete Splunk installation and deployment server setup
  - backup_restoration: Automated backup restoration from remote sources
  - github_integration: Continuous configuration sync from GitHub repositories
- ✓ Developed Ansible Tower integration with job templates and workflows
- ✓ Created comprehensive validation and testing framework
- ✓ Added security features: SSL/TLS encryption, credential management, firewall configuration
- ✓ Implemented automated backup and monitoring capabilities
- ✓ Successfully validated all playbooks and templates with syntax checks
- ✓ Created complete documentation with usage examples and troubleshooting
- ✓ **FIXED**: Debugged and resolved package manager compatibility issues
- ✓ **FIXED**: Updated common role to handle multiple package managers (apt/yum)
- ✓ **FIXED**: Created working test framework that validates deployment without system dependencies
- ✓ **TESTED**: All validation tests now pass successfully

### July 30, 2025 - Python Server Connectivity Checker Application
- ✓ Created standalone Python application for SSH connectivity testing
- ✓ Supports multiple input formats: text files, CSV, Excel spreadsheets
- ✓ Implemented concurrent multi-threaded connectivity testing
- ✓ Added comprehensive status reporting and error handling
- ✓ Created detailed documentation and deployment guides
- ✓ Designed for workplace deployment with professional features
- ✓ Application ready for copying to work environment

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