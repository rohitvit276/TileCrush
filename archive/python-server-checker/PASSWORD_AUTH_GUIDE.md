# Password Authentication Guide

## Updated Server Connectivity Checker

The server connectivity checker now supports username/password authentication in addition to SSH key-based authentication.

## New Authentication Options

### 1. Interactive Mode (Recommended)
Prompts for both username and password:
```bash
python3 server_connectivity_checker.py servers.txt --interactive
```

### 2. Specify Username, Prompt for Password
```bash
python3 server_connectivity_checker.py servers.txt --username admin --password-auth
```

### 3. Password Auth Only (Will prompt for username too)
```bash
python3 server_connectivity_checker.py servers.txt --password-auth
```

### 4. Key-Based Authentication (Default)
Uses your existing SSH keys:
```bash
python3 server_connectivity_checker.py servers.txt
python3 server_connectivity_checker.py servers.txt --username admin
```

## Requirements for Password Authentication

### Option 1: sshpass (Recommended)
```bash
# Ubuntu/Debian
sudo apt-get install sshpass

# RHEL/CentOS
sudo yum install sshpass

# macOS
brew install hudochenkov/sshpass/sshpass
```

### Option 2: expect (Fallback)
```bash
# Ubuntu/Debian
sudo apt-get install expect

# RHEL/CentOS
sudo yum install expect

# macOS
brew install expect
```

## Security Notes

- **Passwords are not stored** - only used temporarily for authentication
- Passwords are entered securely using `getpass` (hidden input)
- Each server connection is independent
- SSH host key checking is disabled for automated testing

## Example Usage Scenarios

### Scenario 1: Test All Servers with Same Admin Account
```bash
python3 server_connectivity_checker.py company_servers.txt --interactive
# Enter: admin
# Enter: your_password
```

### Scenario 2: Test Specific User Account
```bash
python3 server_connectivity_checker.py servers.txt --username service_account --password-auth
# Enter password for service_account
```

### Scenario 3: Mixed Environment (Use Keys for Some, Password for Others)
Run twice with different authentication methods:
```bash
# First check with SSH keys
python3 server_connectivity_checker.py servers.txt --output key_results.txt

# Then check with password auth for servers that failed
python3 server_connectivity_checker.py failed_servers.txt --interactive --output password_results.txt
```

## Status Codes with Password Auth

| Status | Meaning |
|--------|---------|
| SUCCESS | Username/password worked, successfully logged in |
| AUTH_FAILED | Wrong username/password or account issues |
| PORT_CLOSED | Server doesn't allow SSH connections |
| DNS_FAILED | Hostname doesn't exist |
| SSH_ERROR | Missing sshpass/expect tools |

## Sample Output with Password Authentication

```
Interactive mode: Please provide SSH credentials
Username: admin
Password: [hidden]
Using password authentication for user: admin

Loading server list from: servers.txt
Loaded 5 servers
Testing SSH access for user: admin

Checking connectivity to 5 servers...
Timeout: 10 seconds, Max concurrent connections: 20
--------------------------------------------------------------------------------
✓ [1/5] web01.company.com     SUCCESS      (2.1s)
✓ [2/5] web02.company.com     SUCCESS      (1.8s)
⚠ [3/5] old-server.company.com AUTH_FAILED  (3.2s)
✗ [4/5] bad-server.company.com DNS_FAILED   (0.1s)
✓ [5/5] db01.company.com      SUCCESS      (2.5s)

SUMMARY:
  SUCCESS     : 3 (60.0%)
  AUTH_FAILED : 1 (20.0%)
  DNS_FAILED  : 1 (20.0%)
```

## Troubleshooting

### "sshpass command not found"
Install sshpass or expect as shown above.

### "Invalid username or password"
- Verify credentials are correct
- Check if account is locked/disabled
- Ensure password hasn't expired

### "SSH authentication failed"
- Server may not allow password authentication
- Try with SSH keys instead
- Check server SSH configuration

### Still getting AUTH_FAILED with correct credentials
- Server may require SSH keys only
- Account may have restrictions
- Check server logs for detailed error messages

## Best Practices

1. **Use SSH keys when possible** - More secure than passwords
2. **Test interactively first** - Verify credentials work before automation
3. **Use service accounts** - Dedicated accounts for automated testing
4. **Limit concurrent connections** - Use `--workers 5` for sensitive environments
5. **Generate reports** - Use `--output` to document results

## Integration with Workplace Scripts

```bash
#!/bin/bash
# Daily server access audit with password auth

echo "Daily server connectivity check - $(date)"

# Test with service account
python3 server_connectivity_checker.py \
    production_servers.txt \
    --username monitoring_user \
    --password-auth \
    --output "access_report_$(date +%Y%m%d).txt" \
    --quiet

if [ $? -eq 0 ]; then
    echo "All servers accessible"
else
    echo "Some servers failed - check report"
    # Send alert email
fi
```