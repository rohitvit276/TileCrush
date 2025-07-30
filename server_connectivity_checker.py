#!/usr/bin/env python3
"""
Server Connectivity Checker
A simple tool to check SSH connectivity to a list of servers.

Supports input from:
- Excel files (.xlsx, .xls)
- Text files (.txt)
- CSV files (.csv)

Author: Auto-generated for workplace use
"""

import argparse
import csv
import getpass
import os
import socket
import subprocess
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path

try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False


class ServerChecker:
    def __init__(self, timeout=10, max_workers=20):
        self.timeout = timeout
        self.max_workers = max_workers
        self.results = []
        self.lock = threading.Lock()
        
    def check_ssh_connectivity(self, hostname):
        """Check if SSH connection can be established to a server."""
        start_time = time.time()
        result = {
            'hostname': hostname,
            'status': 'Unknown',
            'response_time': 0,
            'error': '',
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        try:
            # First check if hostname resolves
            try:
                socket.gethostbyname(hostname)
            except socket.gaierror as e:
                result['status'] = 'DNS_FAILED'
                result['error'] = f"DNS resolution failed: {str(e)}"
                result['response_time'] = round(time.time() - start_time, 2)
                return result
            
            # Check SSH port connectivity
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(self.timeout)
            
            ssh_result = sock.connect_ex((hostname, 22))
            if ssh_result == 0:
                # Port is open, now try SSH authentication
                try:
                    # Use ssh with ConnectTimeout and BatchMode for non-interactive check
                    cmd = [
                        'ssh', 
                        '-o', 'ConnectTimeout=5',
                        '-o', 'BatchMode=yes',
                        '-o', 'StrictHostKeyChecking=no',
                        '-o', 'UserKnownHostsFile=/dev/null',
                        '-o', 'LogLevel=ERROR',
                        hostname, 
                        'exit'
                    ]
                    
                    ssh_process = subprocess.run(
                        cmd, 
                        capture_output=True, 
                        text=True, 
                        timeout=self.timeout
                    )
                    
                    if ssh_process.returncode == 0:
                        result['status'] = 'SUCCESS'
                    elif ssh_process.returncode == 255:
                        result['status'] = 'AUTH_FAILED'
                        result['error'] = 'SSH authentication failed or connection refused'
                    else:
                        result['status'] = 'SSH_FAILED'
                        result['error'] = f"SSH failed with return code {ssh_process.returncode}"
                        
                except subprocess.TimeoutExpired:
                    result['status'] = 'TIMEOUT'
                    result['error'] = f'SSH connection timed out after {self.timeout} seconds'
                except Exception as e:
                    result['status'] = 'SSH_ERROR'
                    result['error'] = f'SSH error: {str(e)}'
            else:
                result['status'] = 'PORT_CLOSED'
                result['error'] = 'SSH port 22 is not accessible'
                
            sock.close()
            
        except socket.timeout:
            result['status'] = 'TIMEOUT'
            result['error'] = f'Connection timed out after {self.timeout} seconds'
        except Exception as e:
            result['status'] = 'ERROR'
            result['error'] = f'Unexpected error: {str(e)}'
        
        result['response_time'] = round(time.time() - start_time, 2)
        return result
    
    def load_servers_from_file(self, file_path):
        """Load server list from various file formats."""
        file_path = Path(file_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        servers = []
        file_ext = file_path.suffix.lower()
        
        try:
            if file_ext in ['.xlsx', '.xls'] and PANDAS_AVAILABLE:
                # Read Excel file
                df = pd.read_excel(file_path)
                # Try to find hostname column (case insensitive)
                hostname_cols = [col for col in df.columns if 'host' in col.lower() or 'server' in col.lower() or 'fqdn' in col.lower()]
                if hostname_cols:
                    servers = df[hostname_cols[0]].dropna().tolist()
                else:
                    # Use first column if no obvious hostname column
                    servers = df.iloc[:, 0].dropna().tolist()
                    
            elif file_ext == '.csv':
                # Read CSV file
                with open(file_path, 'r', newline='', encoding='utf-8') as csvfile:
                    # Try to detect if it has headers
                    sample = csvfile.read(1024)
                    csvfile.seek(0)
                    sniffer = csv.Sniffer()
                    has_header = sniffer.has_header(sample)
                    
                    reader = csv.reader(csvfile)
                    if has_header:
                        next(reader)  # Skip header
                    
                    for row in reader:
                        if row and row[0].strip():  # Take first column, skip empty rows
                            servers.append(row[0].strip())
                            
            elif file_ext == '.txt':
                # Read text file (one hostname per line)
                with open(file_path, 'r', encoding='utf-8') as f:
                    servers = [line.strip() for line in f if line.strip()]
            else:
                raise ValueError(f"Unsupported file format: {file_ext}. Supported formats: .txt, .csv, .xlsx, .xls")
                
        except Exception as e:
            raise Exception(f"Error reading file {file_path}: {str(e)}")
        
        # Clean and validate server names
        cleaned_servers = []
        for server in servers:
            server = str(server).strip()
            if server and not server.startswith('#'):  # Skip comments and empty lines
                cleaned_servers.append(server)
        
        if not cleaned_servers:
            raise ValueError("No valid server names found in the file")
            
        return cleaned_servers
    
    def check_servers(self, servers, show_progress=True):
        """Check connectivity to multiple servers concurrently."""
        if show_progress:
            print(f"Checking connectivity to {len(servers)} servers...")
            print(f"Timeout: {self.timeout} seconds, Max concurrent connections: {self.max_workers}")
            print("-" * 80)
        
        self.results = []
        completed = 0
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit all tasks
            future_to_server = {executor.submit(self.check_ssh_connectivity, server): server for server in servers}
            
            # Process completed tasks
            for future in as_completed(future_to_server):
                result = future.result()
                
                with self.lock:
                    self.results.append(result)
                    completed += 1
                    
                if show_progress:
                    status_symbol = {
                        'SUCCESS': '✓',
                        'AUTH_FAILED': '⚠',
                        'DNS_FAILED': '✗',
                        'PORT_CLOSED': '✗',
                        'TIMEOUT': '⏱',
                        'SSH_FAILED': '✗',
                        'SSH_ERROR': '✗',
                        'ERROR': '✗'
                    }.get(result['status'], '?')
                    
                    print(f"{status_symbol} [{completed:3d}/{len(servers)}] {result['hostname']:<30} "
                          f"{result['status']:<12} ({result['response_time']:.2f}s)")
        
        return self.results
    
    def generate_report(self, output_file=None):
        """Generate a detailed report of the connectivity check results."""
        if not self.results:
            print("No results to report.")
            return
        
        # Sort results by status and hostname
        sorted_results = sorted(self.results, key=lambda x: (x['status'], x['hostname']))
        
        # Count by status
        status_counts = {}
        for result in self.results:
            status_counts[result['status']] = status_counts.get(result['status'], 0) + 1
        
        # Generate report content
        report_lines = []
        report_lines.append("SERVER CONNECTIVITY REPORT")
        report_lines.append("=" * 50)
        report_lines.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report_lines.append(f"Total servers checked: {len(self.results)}")
        report_lines.append("")
        
        # Summary by status
        report_lines.append("SUMMARY:")
        for status, count in sorted(status_counts.items()):
            percentage = (count / len(self.results)) * 100
            report_lines.append(f"  {status:<12}: {count:3d} ({percentage:5.1f}%)")
        report_lines.append("")
        
        # Detailed results
        report_lines.append("DETAILED RESULTS:")
        report_lines.append("-" * 80)
        report_lines.append(f"{'Hostname':<30} {'Status':<12} {'Time(s)':<8} {'Error'}")
        report_lines.append("-" * 80)
        
        for result in sorted_results:
            error_msg = result['error'][:40] + "..." if len(result['error']) > 40 else result['error']
            report_lines.append(f"{result['hostname']:<30} {result['status']:<12} "
                              f"{result['response_time']:<8.2f} {error_msg}")
        
        report_content = "\n".join(report_lines)
        
        # Output to file or console
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(report_content)
            print(f"\nDetailed report saved to: {output_file}")
        else:
            print("\n" + report_content)


def main():
    parser = argparse.ArgumentParser(
        description="Check SSH connectivity to servers from a list",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python server_connectivity_checker.py servers.txt
  python server_connectivity_checker.py servers.xlsx --timeout 15 --workers 10
  python server_connectivity_checker.py servers.csv --output report.txt
  
Supported file formats:
  - .txt (one hostname per line)
  - .csv (hostname in first column)
  - .xlsx/.xls (Excel files - requires pandas: pip install pandas openpyxl)
        """
    )
    
    parser.add_argument('input_file', help='File containing server list (txt/csv/xlsx/xls)')
    parser.add_argument('--timeout', '-t', type=int, default=10, help='Connection timeout in seconds (default: 10)')
    parser.add_argument('--workers', '-w', type=int, default=20, help='Maximum concurrent connections (default: 20)')
    parser.add_argument('--output', '-o', help='Output file for detailed report (optional)')
    parser.add_argument('--quiet', '-q', action='store_true', help='Quiet mode - minimal output')
    
    args = parser.parse_args()
    
    # Validate arguments
    if args.timeout < 1 or args.timeout > 300:
        print("Error: Timeout must be between 1 and 300 seconds")
        return 1
        
    if args.workers < 1 or args.workers > 100:
        print("Error: Workers must be between 1 and 100")
        return 1
    
    # Check if pandas is needed but not available
    input_path = Path(args.input_file)
    if input_path.suffix.lower() in ['.xlsx', '.xls'] and not PANDAS_AVAILABLE:
        print("Error: Excel file support requires pandas and openpyxl.")
        print("Install with: pip install pandas openpyxl")
        return 1
    
    try:
        # Initialize checker
        checker = ServerChecker(timeout=args.timeout, max_workers=args.workers)
        
        # Load servers
        if not args.quiet:
            print(f"Loading server list from: {args.input_file}")
        servers = checker.load_servers_from_file(args.input_file)
        
        if not args.quiet:
            print(f"Loaded {len(servers)} servers")
            print(f"Current user: {getpass.getuser()}")
            print()
        
        # Check connectivity
        results = checker.check_servers(servers, show_progress=not args.quiet)
        
        # Generate report
        if not args.quiet:
            print("\n" + "=" * 80)
        checker.generate_report(args.output)
        
        # Return appropriate exit code
        failed_count = sum(1 for r in results if r['status'] not in ['SUCCESS', 'AUTH_FAILED'])
        return 1 if failed_count > 0 else 0
        
    except KeyboardInterrupt:
        print("\nOperation cancelled by user")
        return 1
    except Exception as e:
        print(f"Error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())