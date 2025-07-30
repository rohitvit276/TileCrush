#!/bin/bash

# Splunk Deployment Validation Script
# This script validates the Splunk Enterprise deployment server installation

set -euo pipefail

# Configuration
SPLUNK_HOME="/opt/splunk"
SPLUNK_USER="splunk"
SPLUNK_WEB_PORT="8000"
SPLUNK_MGMT_PORT="8089"
LOG_FILE="/var/log/splunk-validation.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Print colored output
print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "PASS")
            echo -e "${GREEN}[PASS]${NC} $message"
            ;;
        "FAIL")
            echo -e "${RED}[FAIL]${NC} $message"
            ;;
        "WARN")
            echo -e "${YELLOW}[WARN]${NC} $message"
            ;;
        "INFO")
            echo -e "[INFO] $message"
            ;;
    esac
    
    log "[$status] $message"
}

# Check if running as root
check_privileges() {
    if [[ $EUID -ne 0 ]]; then
        print_status "FAIL" "This script must be run as root"
        exit 1
    fi
    print_status "PASS" "Running with appropriate privileges"
}

# Validate system requirements
validate_system_requirements() {
    print_status "INFO" "Validating system requirements..."
    
    # Check memory
    local memory_mb=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    if [[ $memory_mb -ge 2048 ]]; then
        print_status "PASS" "Memory requirement met: ${memory_mb}MB available"
    else
        print_status "FAIL" "Insufficient memory: ${memory_mb}MB (minimum 2048MB required)"
        return 1
    fi
    
    # Check CPU cores
    local cpu_cores=$(nproc)
    if [[ $cpu_cores -ge 2 ]]; then
        print_status "PASS" "CPU requirement met: ${cpu_cores} cores available"
    else
        print_status "FAIL" "Insufficient CPU cores: ${cpu_cores} (minimum 2 required)"
        return 1
    fi
    
    # Check disk space
    local disk_space=$(df -BG "$SPLUNK_HOME" | awk 'NR==2 {print $4}' | sed 's/G//')
    if [[ $disk_space -ge 10 ]]; then
        print_status "PASS" "Disk space requirement met: ${disk_space}GB available"
    else
        print_status "WARN" "Low disk space: ${disk_space}GB available (recommended: 50GB+)"
    fi
}

# Check Splunk installation
validate_splunk_installation() {
    print_status "INFO" "Validating Splunk installation..."
    
    # Check if Splunk directory exists
    if [[ -d "$SPLUNK_HOME" ]]; then
        print_status "PASS" "Splunk home directory exists: $SPLUNK_HOME"
    else
        print_status "FAIL" "Splunk home directory not found: $SPLUNK_HOME"
        return 1
    fi
    
    # Check if Splunk binary exists
    if [[ -x "$SPLUNK_HOME/bin/splunk" ]]; then
        print_status "PASS" "Splunk binary is executable"
    else
        print_status "FAIL" "Splunk binary not found or not executable"
        return 1
    fi
    
    # Check Splunk user
    if id "$SPLUNK_USER" &>/dev/null; then
        print_status "PASS" "Splunk user exists: $SPLUNK_USER"
    else
        print_status "FAIL" "Splunk user not found: $SPLUNK_USER"
        return 1
    fi
    
    # Check file ownership
    local owner=$(stat -c '%U' "$SPLUNK_HOME")
    if [[ "$owner" == "$SPLUNK_USER" ]]; then
        print_status "PASS" "Splunk home ownership is correct"
    else
        print_status "FAIL" "Incorrect ownership: $owner (expected: $SPLUNK_USER)"
        return 1
    fi
}

# Check Splunk service status
validate_splunk_service() {
    print_status "INFO" "Validating Splunk service..."
    
    # Check systemd service
    if systemctl is-active --quiet splunk; then
        print_status "PASS" "Splunk service is running"
    else
        print_status "FAIL" "Splunk service is not running"
        return 1
    fi
    
    # Check if service is enabled
    if systemctl is-enabled --quiet splunk; then
        print_status "PASS" "Splunk service is enabled for startup"
    else
        print_status "WARN" "Splunk service is not enabled for automatic startup"
    fi
    
    # Check Splunk processes
    local splunk_processes=$(pgrep -f "splunkd" | wc -l)
    if [[ $splunk_processes -gt 0 ]]; then
        print_status "PASS" "Splunk processes are running ($splunk_processes processes)"
    else
        print_status "FAIL" "No Splunk processes found"
        return 1
    fi
}

# Check network connectivity
validate_network() {
    print_status "INFO" "Validating network configuration..."
    
    # Check if ports are listening
    local web_port_listening=$(netstat -tln | grep ":$SPLUNK_WEB_PORT " | wc -l)
    if [[ $web_port_listening -gt 0 ]]; then
        print_status "PASS" "Splunk web interface port $SPLUNK_WEB_PORT is listening"
    else
        print_status "FAIL" "Splunk web interface port $SPLUNK_WEB_PORT is not listening"
    fi
    
    local mgmt_port_listening=$(netstat -tln | grep ":$SPLUNK_MGMT_PORT " | wc -l)
    if [[ $mgmt_port_listening -gt 0 ]]; then
        print_status "PASS" "Splunk management port $SPLUNK_MGMT_PORT is listening"
    else
        print_status "FAIL" "Splunk management port $SPLUNK_MGMT_PORT is not listening"
    fi
}

# Validate Splunk configuration
validate_splunk_configuration() {
    print_status "INFO" "Validating Splunk configuration..."
    
    # Check if admin user can authenticate
    local auth_check
    if auth_check=$(sudo -u "$SPLUNK_USER" "$SPLUNK_HOME/bin/splunk" list user admin 2>/dev/null); then
        print_status "PASS" "Admin user authentication successful"
    else
        print_status "FAIL" "Admin user authentication failed"
        return 1
    fi
    
    # Check deployment server configuration
    if [[ -f "$SPLUNK_HOME/etc/system/local/serverclass.conf" ]]; then
        print_status "PASS" "Deployment server configuration found"
    else
        print_status "WARN" "Deployment server configuration not found"
    fi
    
    # Check server.conf
    if [[ -f "$SPLUNK_HOME/etc/system/local/server.conf" ]]; then
        print_status "PASS" "Server configuration found"
        
        # Check if deployment server is enabled
        if grep -q "^\[deploymentServer\]" "$SPLUNK_HOME/etc/system/local/server.conf"; then
            print_status "PASS" "Deployment server stanza found in server.conf"
        else
            print_status "WARN" "Deployment server stanza not found in server.conf"
        fi
    else
        print_status "WARN" "Server configuration not found"
    fi
}

# Check deployment apps
validate_deployment_apps() {
    print_status "INFO" "Validating deployment apps..."
    
    local deployment_apps_dir="$SPLUNK_HOME/etc/deployment-apps"
    if [[ -d "$deployment_apps_dir" ]]; then
        print_status "PASS" "Deployment apps directory exists"
        
        local app_count=$(find "$deployment_apps_dir" -mindepth 1 -maxdepth 1 -type d | wc -l)
        if [[ $app_count -gt 0 ]]; then
            print_status "PASS" "Found $app_count deployment apps"
            
            # List the apps
            find "$deployment_apps_dir" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | while read -r app; do
                print_status "INFO" "  - $app"
            done
        else
            print_status "WARN" "No deployment apps found"
        fi
    else
        print_status "WARN" "Deployment apps directory not found"
    fi
}

# Check API endpoints
validate_api_endpoints() {
    print_status "INFO" "Validating API endpoints..."
    
    # Test server info endpoint
    local server_info_response
    if server_info_response=$(curl -s -k -u "admin:${SPLUNK_ADMIN_PASSWORD:-changeme}" \
        "https://localhost:$SPLUNK_MGMT_PORT/services/server/info" 2>/dev/null); then
        if [[ $server_info_response == *"<entry>"* ]]; then
            print_status "PASS" "Server info API endpoint is accessible"
        else
            print_status "FAIL" "Server info API endpoint returned unexpected response"
        fi
    else
        print_status "FAIL" "Unable to access server info API endpoint"
    fi
    
    # Test deployment server endpoint
    local deployment_response
    if deployment_response=$(curl -s -k -u "admin:${SPLUNK_ADMIN_PASSWORD:-changeme}" \
        "https://localhost:$SPLUNK_MGMT_PORT/services/deployment/server" 2>/dev/null); then
        if [[ $deployment_response == *"<entry>"* ]]; then
            print_status "PASS" "Deployment server API endpoint is accessible"
        else
            print_status "WARN" "Deployment server API endpoint may not be properly configured"
        fi
    else
        print_status "WARN" "Unable to access deployment server API endpoint"
    fi
}

# Check backup configuration
validate_backup_configuration() {
    print_status "INFO" "Validating backup configuration..."
    
    local backup_location="/opt/splunk/backups"
    if [[ -d "$backup_location" ]]; then
        print_status "PASS" "Backup directory exists: $backup_location"
        
        # Check backup script
        if [[ -x "$backup_location/backup_splunk.sh" ]]; then
            print_status "PASS" "Backup script is executable"
        else
            print_status "WARN" "Backup script not found or not executable"
        fi
    else
        print_status "WARN" "Backup directory not found: $backup_location"
    fi
}

# Check GitHub integration
validate_github_integration() {
    print_status "INFO" "Validating GitHub integration..."
    
    local github_dir="$SPLUNK_HOME/etc/github"
    if [[ -d "$github_dir" ]]; then
        print_status "PASS" "GitHub integration directory exists"
        
        # Check if repository is cloned
        if [[ -d "$github_dir/config-repo/.git" ]]; then
            print_status "PASS" "GitHub repository is cloned"
        else
            print_status "WARN" "GitHub repository not found"
        fi
        
        # Check sync script
        if [[ -x "$SPLUNK_HOME/bin/github_sync.sh" ]]; then
            print_status "PASS" "GitHub sync script is executable"
        else
            print_status "WARN" "GitHub sync script not found"
        fi
        
        # Check cron job
        if crontab -u "$SPLUNK_USER" -l 2>/dev/null | grep -q "github_sync.sh"; then
            print_status "PASS" "GitHub sync cron job is configured"
        else
            print_status "WARN" "GitHub sync cron job not found"
        fi
    else
        print_status "INFO" "GitHub integration not configured"
    fi
}

# Generate validation report
generate_report() {
    local report_file="/tmp/splunk_validation_report_$(date +%Y%m%d_%H%M%S).txt"
    
    cat > "$report_file" << EOF
Splunk Enterprise Deployment Server Validation Report
Generated: $(date)
Host: $(hostname)
IP Address: $(hostname -I | awk '{print $1}')

=== System Information ===
OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)
Kernel: $(uname -r)
Memory: $(free -h | awk 'NR==2{printf "%s", $2}')
CPU Cores: $(nproc)
Disk Space (Splunk): $(df -h "$SPLUNK_HOME" | awk 'NR==2 {print $4}')

=== Splunk Information ===
Splunk Home: $SPLUNK_HOME
Splunk User: $SPLUNK_USER
Web Port: $SPLUNK_WEB_PORT
Management Port: $SPLUNK_MGMT_PORT

=== Service Status ===
Service Active: $(systemctl is-active splunk)
Service Enabled: $(systemctl is-enabled splunk)
Process Count: $(pgrep -f "splunkd" | wc -l)

=== Network Status ===
Web Port Listening: $(netstat -tln | grep ":$SPLUNK_WEB_PORT " | wc -l > 0 && echo "Yes" || echo "No")
Management Port Listening: $(netstat -tln | grep ":$SPLUNK_MGMT_PORT " | wc -l > 0 && echo "Yes" || echo "No")

=== Configuration Files ===
server.conf: $(test -f "$SPLUNK_HOME/etc/system/local/server.conf" && echo "Present" || echo "Missing")
serverclass.conf: $(test -f "$SPLUNK_HOME/etc/system/local/serverclass.conf" && echo "Present" || echo "Missing")
web.conf: $(test -f "$SPLUNK_HOME/etc/system/local/web.conf" && echo "Present" || echo "Missing")

=== Deployment Apps ===
Apps Directory: $(test -d "$SPLUNK_HOME/etc/deployment-apps" && echo "Present" || echo "Missing")
App Count: $(find "$SPLUNK_HOME/etc/deployment-apps" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l)

=== Validation Log ===
$(tail -20 "$LOG_FILE" 2>/dev/null || echo "Log file not found")

EOF

    print_status "INFO" "Validation report generated: $report_file"
}

# Main execution
main() {
    print_status "INFO" "Starting Splunk Enterprise Deployment Server validation..."
    print_status "INFO" "Validation started at: $(date)"
    
    local exit_code=0
    
    # Run validation checks
    check_privileges || exit_code=1
    validate_system_requirements || exit_code=1
    validate_splunk_installation || exit_code=1
    validate_splunk_service || exit_code=1
    validate_network || exit_code=1
    validate_splunk_configuration || exit_code=1
    validate_deployment_apps
    validate_api_endpoints
    validate_backup_configuration
    validate_github_integration
    
    # Generate report
    generate_report
    
    print_status "INFO" "Validation completed at: $(date)"
    
    if [[ $exit_code -eq 0 ]]; then
        print_status "PASS" "Overall validation: SUCCESSFUL"
        echo
        echo "Splunk Enterprise Deployment Server is properly configured and operational."
        echo "Web Interface: https://$(hostname -I | awk '{print $1}'):$SPLUNK_WEB_PORT"
        echo "Management API: https://$(hostname -I | awk '{print $1}'):$SPLUNK_MGMT_PORT"
    else
        print_status "FAIL" "Overall validation: FAILED"
        echo
        echo "One or more critical validation checks failed."
        echo "Please review the output above and address any issues."
    fi
    
    exit $exit_code
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo "Validate Splunk Enterprise Deployment Server installation"
        echo
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --version, -v  Show script version"
        echo
        echo "Environment Variables:"
        echo "  SPLUNK_ADMIN_PASSWORD  Splunk admin password for API tests"
        echo
        exit 0
        ;;
    --version|-v)
        echo "Splunk Validation Script v1.0.0"
        exit 0
        ;;
    "")
        main
        ;;
    *)
        echo "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac
