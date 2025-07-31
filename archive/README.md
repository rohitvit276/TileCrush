# Archived Projects

This directory contains previously developed applications that can be restored when needed.

## Ansible Automation (archive/ansible-automation/)

Complete Splunk Enterprise deployment server automation toolkit with:
- Ansible playbooks for Splunk deployment
- Modular role-based architecture (common, splunk_enterprise, backup_restoration, github_integration)
- Inventory management and configuration templates
- Ansible Tower integration
- Automated validation and testing framework

### Key Files:
- `site.yml` - Main deployment playbook
- `playbooks/` - Specific deployment workflows
- `roles/` - Modular Ansible roles
- `inventory/` - Target system definitions
- `test_deployment.yml` - Validation framework

## Python Server Connectivity Checker (archive/python-server-checker/)

Enterprise-ready SSH connectivity testing tool with:
- Multi-format input support (TXT, CSV, Excel)
- Username/password and SSH key authentication
- Multi-threaded concurrent testing
- Comprehensive reporting and logging
- Interactive credential prompting

### Key Files:
- `server_connectivity_checker.py` - Main application
- `PASSWORD_AUTH_GUIDE.md` - Authentication documentation
- `ENHANCED_FEATURES_SUMMARY.md` - Complete feature overview
- `sample_servers.*` - Example input files

## Restoration Instructions

To restore any archived project:

```bash
# Restore Ansible automation
cp -r archive/ansible-automation/* .

# Restore Python server checker
cp -r archive/python-server-checker/* .

# Or restore specific files as needed
cp archive/ansible-automation/site.yml .
cp archive/python-server-checker/server_connectivity_checker.py .
```

Both projects are fully functional and production-ready for workplace deployment.