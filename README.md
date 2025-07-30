# Splunk Enterprise Deployment Server Ansible Automation

This Ansible project automates the deployment and configuration of Splunk Enterprise as a deployment server with backup restoration and GitHub integration capabilities.

## Overview

This automation provides:
- Complete Splunk Enterprise installation and configuration
- Deployment server setup with serverclass management
- Backup restoration from remote sources
- GitHub integration for configuration management
- Ansible Tower compatibility
- Comprehensive error handling and validation

## Prerequisites

- Ansible 2.9 or higher
- Python 3.6 or higher
- Target systems running RHEL/CentOS 7+ or Ubuntu 18.04+
- Ansible Tower (optional but recommended)
- GitHub repository for configuration management
- Valid Splunk Enterprise license

## Directory Structure

```
├── inventory/                  # Environment-specific inventories
│   ├── group_vars/            # Global and group variables
│   │   ├── all.yml           # Variables for all hosts
│   │   └── splunk_deployment_servers.yml
│   ├── host_vars/            # Host-specific variables
│   │   └── splunk-ds-prod.yml
│   ├── production            # Production inventory
│   └── staging              # Staging inventory
├── playbooks/                # Specialized playbooks
│   ├── deploy_splunk_ds.yml  # Full deployment server setup
│   ├── restore_backup.yml    # Backup restoration only
│   └── update_from_github.yml # GitHub config sync only
├── roles/                    # Ansible roles for modular deployment
│   ├── backup_restoration/   # Backup and restore functionality
│   ├── common/              # Base system configuration
│   ├── github_integration/  # GitHub repository integration
│   └── splunk_enterprise/   # Splunk Enterprise installation
├── scripts/                 # Utility scripts
│   └── validate_deployment.sh # Post-deployment validation
├── ansible.cfg             # Ansible configuration
├── site.yml               # Main orchestration playbook
└── tower_job_templates.yml # Ansible Tower integration
```

## Features

### Core Functionality
- **Complete Splunk Enterprise Installation**: Automated download, installation, and initial configuration
- **Deployment Server Configuration**: Full setup with serverclass management and app distribution
- **Backup Restoration**: Automated restoration from remote backup sources
- **GitHub Integration**: Continuous configuration synchronization from version control
- **Ansible Tower Compatibility**: Pre-configured job templates and workflows

### Security & Operations
- **Secure Configuration**: SSL/TLS encryption, secure credential management
- **System Optimization**: Performance tuning, resource limits, and kernel parameters
- **Comprehensive Logging**: Detailed execution logs and validation reports
- **Health Checks**: Automated validation of deployment status and functionality

### Enterprise Features
- **Multi-Environment Support**: Production, staging, and development configurations
- **Role-Based Deployment**: Modular architecture for flexible deployments
- **Automated Backups**: Scheduled backup creation with retention policies
- **Notification Integration**: Email alerts for deployment status

## Quick Start

### Basic Deployment

1. **Configure Inventory**:
   ```bash
   # Edit inventory/production
   [splunk_deployment_servers]
   splunk-ds-01 ansible_host=10.0.1.100 ansible_user=ansible
   ```

2. **Set Variables**:
   ```bash
   # Edit inventory/group_vars/all.yml
   splunk_admin_password: "your_secure_password"
   splunk_deployment_server_pass4symmkey: "your_deployment_key"
   github_token: "your_github_token"
   github_repo_url: "https://github.com/yourorg/splunk-configs.git"
   backup_source_url: "https://backup.company.com/splunk-backup.tar.gz"
   ```

3. **Run Deployment**:
   ```bash
   ansible-playbook site.yml -i inventory/production
   ```

### Ansible Tower Deployment

1. **Import Project**: Use the provided `tower_job_templates.yml`
2. **Configure Credentials**: Set up SSH keys and vault passwords
3. **Run Workflow**: Execute the "Complete Splunk Deployment Workflow"

## Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `splunk_admin_password` | Splunk admin user password | `SecurePass123!` |
| `splunk_deployment_server_pass4symmkey` | Deployment server encryption key | `DeploymentKey123` |
| `github_token` | GitHub personal access token | `ghp_xxxxxxxxxxxx` |
| `github_repo_url` | GitHub repository for configurations | `https://github.com/org/configs.git` |
| `backup_source_url` | Remote backup source URL | `https://backup.com/file.tar.gz` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `splunk_version` | `9.1.0` | Splunk Enterprise version |
| `backup_enabled` | `true` | Enable backup functionality |
| `github_sync_enabled` | `true` | Enable GitHub synchronization |
| `splunk_ssl_enabled` | `true` | Enable SSL/TLS encryption |

## Usage Examples

### Deploy to Production
```bash
ansible-playbook site.yml -i inventory/production \
  --extra-vars "splunk_admin_password=SecurePass123"
```

### Restore from Backup Only
```bash
ansible-playbook playbooks/restore_backup.yml -i inventory/production \
  --extra-vars "backup_source_url=https://backup.company.com/latest.tar.gz"
```

### Update from GitHub
```bash
ansible-playbook playbooks/update_from_github.yml -i inventory/production
```

### Syntax Validation
```bash
ansible-playbook --syntax-check site.yml
ansible-playbook test_syntax.yml  # Test all configurations
```

## Validation

The automation includes comprehensive validation:

1. **Pre-deployment Checks**: System requirements and prerequisites
2. **Configuration Validation**: Template rendering and variable verification
3. **Service Health Checks**: Splunk service status and API accessibility
4. **Post-deployment Validation**: Complete system functionality verification

Run the validation script:
```bash
sudo ./scripts/validate_deployment.sh
```

## Ansible Tower Integration

### Job Templates

1. **Deploy Splunk Deployment Server**: Complete end-to-end deployment
2. **Restore Splunk from Backup**: Backup restoration workflow
3. **Update from GitHub**: Configuration synchronization
4. **Validate Splunk Deployment**: Health and status validation

### Workflows

1. **Complete Splunk Deployment Workflow**: Deploy → Validate → Notify
2. **Configuration Update Workflow**: Update → Validate → Notify

### Notifications

- Email alerts for deployment success/failure
- Integration with monitoring systems
- Slack/Teams webhook support (configurable)

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure Ansible user has sudo access
2. **Network Connectivity**: Verify access to download URLs and GitHub
3. **Resource Constraints**: Check system meets minimum requirements (2GB RAM, 2 CPU cores)
4. **Backup Access**: Verify backup source URL accessibility

### Debug Mode
```bash
ansible-playbook site.yml -i inventory/production -vvv
```

### Log Locations
- Ansible logs: `./ansible.log`
- Deployment logs: `/var/log/ansible-splunk-deployment.log`
- Validation logs: `/var/log/splunk-validation.log`

## Security Considerations

1. **Credential Management**: Use Ansible Vault for sensitive variables
2. **Network Security**: Configure firewall rules for Splunk ports
3. **SSL/TLS**: Enable encryption for all communications
4. **Access Control**: Implement role-based access in Ansible Tower
5. **Audit Trail**: Comprehensive logging of all deployment activities

## Contributing

1. **Role Development**: Follow Ansible best practices for role structure
2. **Testing**: Validate all changes with syntax checks and test playbooks
3. **Documentation**: Update README and role documentation
4. **Version Control**: Use meaningful commit messages and version tags

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Ansible and Splunk logs
3. Validate system requirements
4. Contact the infrastructure team

## License

This automation is designed for enterprise use and follows company security and compliance requirements.

