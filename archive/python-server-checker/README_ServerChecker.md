# Server Connectivity Checker

A Python tool to check SSH connectivity to multiple servers from various input formats.

## Features

- **Multiple Input Formats**: Text files, CSV, Excel (.xlsx/.xls)
- **Concurrent Checking**: Multi-threaded connectivity testing
- **Detailed Reporting**: Comprehensive status and timing information
- **Flexible Output**: Console display and optional file reports
- **Error Handling**: Clear error messages and status codes
- **SSH Authentication**: Tests actual SSH login capability

## Installation

### Basic Installation (Text/CSV support only)
No additional packages needed - uses Python standard library only.

### Full Installation (with Excel support)
```bash
pip install pandas openpyxl xlrd
```

## Usage

### Command Line Options
```bash
python server_connectivity_checker.py [options] input_file

Options:
  -h, --help            Show help message
  -t, --timeout SECONDS Connection timeout (default: 10)
  -w, --workers NUMBER  Max concurrent connections (default: 20)
  -o, --output FILE     Save detailed report to file
  -q, --quiet          Quiet mode - minimal output
```

### Examples

#### Basic Usage
```bash
# Check servers from text file
python server_connectivity_checker.py servers.txt

# Check with custom timeout and worker count
python server_connectivity_checker.py servers.xlsx --timeout 15 --workers 10

# Generate report file
python server_connectivity_checker.py servers.csv --output connectivity_report.txt

# Quiet mode for scripts
python server_connectivity_checker.py servers.txt --quiet
```

## Input File Formats

### 1. Text File (.txt)
One hostname per line, comments start with #:
```
# Production servers
server1.example.com
server2.example.com
db01.company.local
```

### 2. CSV File (.csv)
Hostname in first column (with or without headers):
```csv
hostname,environment,purpose
server1.example.com,production,web
server2.example.com,production,web
db01.company.local,production,database
```

### 3. Excel File (.xlsx/.xls)
- Looks for columns containing "host", "server", or "fqdn"
- Falls back to first column if no obvious hostname column found
- Requires: `pip install pandas openpyxl`

## Status Codes

| Status | Description |
|--------|-------------|
| SUCCESS | SSH connection and authentication successful |
| AUTH_FAILED | SSH port open but authentication failed |
| DNS_FAILED | Hostname cannot be resolved |
| PORT_CLOSED | SSH port 22 is not accessible |
| TIMEOUT | Connection timed out |
| SSH_FAILED | SSH connection failed |
| SSH_ERROR | Unexpected SSH error |
| ERROR | General connection error |

## Output Example

```
Checking connectivity to 8 servers...
Timeout: 10 seconds, Max concurrent connections: 20
--------------------------------------------------------------------------------
✓ [  1/  8] server1.example.com           SUCCESS      (1.23s)
⚠ [  2/  8] server2.example.com           AUTH_FAILED  (2.45s)
✗ [  3/  8] badserver.example.com         DNS_FAILED   (0.12s)
✓ [  4/  8] web01.company.local           SUCCESS      (0.89s)

SERVER CONNECTIVITY REPORT
==================================================
Generated: 2025-07-30 10:50:23
Total servers checked: 8

SUMMARY:
  AUTH_FAILED : 2 ( 25.0%)
  DNS_FAILED  : 1 ( 12.5%)
  SUCCESS     : 5 ( 62.5%)

DETAILED RESULTS:
--------------------------------------------------------------------------------
Hostname                       Status       Time(s)  Error
--------------------------------------------------------------------------------
server1.example.com            SUCCESS      1.23     
server2.example.com            AUTH_FAILED  2.45     SSH authentication failed or connection refused
badserver.example.com          DNS_FAILED   0.12     DNS resolution failed: [Errno -2] Name or service not known
```

## Exit Codes

- `0`: All servers are reachable (SUCCESS or AUTH_FAILED status)
- `1`: One or more servers failed connectivity check or script error

## Requirements

### System Requirements
- Python 3.6 or higher
- SSH client (`ssh` command available in PATH)
- Network connectivity to target servers

### Authentication
The tool uses your current user's SSH configuration:
- SSH keys from `~/.ssh/`
- SSH config from `~/.ssh/config`
- Known hosts from `~/.ssh/known_hosts`

### Security Notes
- Uses `StrictHostKeyChecking=no` for automated checking
- Redirects SSH logs to prevent output clutter
- Does not store or transmit credentials

## Troubleshooting

### Common Issues

1. **Excel files not working**
   - Install pandas: `pip install pandas openpyxl`

2. **SSH timeouts**
   - Increase timeout: `--timeout 30`
   - Check network connectivity
   - Verify SSH service is running on port 22

3. **Permission denied**
   - Ensure SSH keys are properly configured
   - Check if your user has access to target servers
   - Verify SSH agent is running with loaded keys

4. **Too many concurrent connections**
   - Reduce workers: `--workers 5`
   - Some firewalls/load balancers limit concurrent connections

### Performance Tips

- Use appropriate worker count (default 20 works for most cases)
- Adjust timeout based on network conditions
- Use quiet mode (`--quiet`) for automated scripts
- Generate reports to files for large server lists

## Integration

### Use in Scripts
```bash
#!/bin/bash
# Check servers and exit with appropriate code
python server_connectivity_checker.py servers.txt --quiet
if [ $? -eq 0 ]; then
    echo "All servers accessible"
else
    echo "Some servers failed connectivity check"
    exit 1
fi
```

### Cron Job Example
```bash
# Daily server connectivity check at 6 AM
0 6 * * * /usr/bin/python3 /path/to/server_connectivity_checker.py /path/to/servers.txt --output /var/log/connectivity_report_$(date +\%Y\%m\%d).txt
```