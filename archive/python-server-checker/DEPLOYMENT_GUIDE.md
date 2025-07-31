# Server Connectivity Checker - Deployment Guide

## Files to Copy to Your Work Environment

### Core Files (Required)
1. **`server_connectivity_checker.py`** - Main application
2. **`README_ServerChecker.md`** - Complete usage documentation

### Sample Files (Optional)
3. **`sample_servers.txt`** - Example text file format
4. **`sample_servers.csv`** - Example CSV file format
5. **`test_servers.txt`** - Basic test file for validation

## Quick Deployment Steps

### 1. Copy Files
Copy the `server_connectivity_checker.py` file to your work environment.

### 2. Verify Python Installation
```bash
python3 --version
# Should show Python 3.6 or higher
```

### 3. Test Basic Functionality
```bash
# Create a simple test file
echo "localhost" > test.txt

# Run the checker
python3 server_connectivity_checker.py test.txt
```

### 4. Optional: Install Excel Support
If you need Excel file support:
```bash
pip install pandas openpyxl xlrd
```

## Creating Your Server List

### Option 1: Text File
Create a file `my_servers.txt`:
```
server1.company.com
server2.company.com
web01.internal.local
db01.internal.local
```

### Option 2: CSV File
Create a file `my_servers.csv`:
```csv
hostname,environment,purpose
server1.company.com,prod,web
server2.company.com,prod,web
staging01.company.com,staging,app
```

### Option 3: Excel File
Use any Excel spreadsheet with hostnames in the first column or a column containing "host", "server", or "fqdn" in the name.

## Running the Checker

### Basic Check
```bash
python3 server_connectivity_checker.py my_servers.txt
```

### With Custom Settings
```bash
python3 server_connectivity_checker.py my_servers.txt --timeout 15 --workers 10 --output report.txt
```

### Automated/Script Usage
```bash
python3 server_connectivity_checker.py my_servers.txt --quiet
echo "Exit code: $?"
```

## Integration Examples

### Daily Monitoring Script
```bash
#!/bin/bash
# daily_server_check.sh

DATE=$(date +%Y%m%d)
REPORT_FILE="/var/log/server_connectivity_$DATE.txt"

python3 server_connectivity_checker.py /path/to/servers.txt --output "$REPORT_FILE"

if [ $? -eq 0 ]; then
    echo "All servers accessible - report saved to $REPORT_FILE"
else
    echo "Some servers failed - check report: $REPORT_FILE"
    # Send alert email or notification here
fi
```

### Cron Job Setup
```bash
# Add to crontab with: crontab -e
# Check servers daily at 6 AM
0 6 * * * /usr/bin/python3 /path/to/server_connectivity_checker.py /path/to/servers.txt --quiet --output /var/log/connectivity_$(date +\%Y\%m\%d).txt
```

## Security Considerations

### SSH Key Authentication
Ensure your SSH keys are properly configured:
```bash
# Check if SSH agent is running
ssh-add -l

# Add your key if needed
ssh-add ~/.ssh/id_rsa
```

### Network Access
- Ensure your workstation can reach target servers on port 22
- Check firewall rules if connections fail
- VPN may be required for internal servers

### Permissions
- Run as a user with appropriate SSH access
- Ensure the script has read access to input files
- Ensure write access to output directory for reports

## Troubleshooting

### Common Issues

1. **"Permission denied" errors**
   - Check SSH key configuration
   - Verify user access to target servers

2. **"Connection timeout" errors**
   - Increase timeout: `--timeout 30`
   - Check network connectivity
   - Verify servers are running

3. **"DNS resolution failed" errors**
   - Check hostname spelling
   - Verify DNS configuration
   - Try IP addresses instead of hostnames

4. **Excel file errors**
   - Install pandas: `pip install pandas openpyxl`
   - Check file format (.xlsx vs .xls)

### Performance Tuning

- **Large server lists**: Reduce workers (`--workers 5`)
- **Slow networks**: Increase timeout (`--timeout 30`)
- **Fast networks**: Increase workers (`--workers 50`)

## Expected Output

### Successful Run
```
✓ [  1/10] server1.company.com           SUCCESS      (1.23s)
✓ [  2/10] server2.company.com           SUCCESS      (0.89s)
⚠ [  3/10] server3.company.com           AUTH_FAILED  (2.45s)
```

### Summary Report
```
SUMMARY:
  SUCCESS     :   8 ( 80.0%)
  AUTH_FAILED :   2 ( 20.0%)
  DNS_FAILED  :   0 (  0.0%)
```

This indicates 8 servers are fully accessible, 2 have authentication issues (but SSH port is open), and none have DNS problems.

## Support

For issues or questions about the tool:
1. Check the README_ServerChecker.md file
2. Review error messages in the detailed output
3. Test with a known working server first
4. Verify SSH connectivity manually: `ssh username@servername`