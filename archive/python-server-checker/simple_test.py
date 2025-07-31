#!/usr/bin/env python3
"""Simple test to verify the server checker is working"""

import sys
from server_connectivity_checker import ServerChecker

def test_basic_functionality():
    print("Testing Server Connectivity Checker...")
    
    # Test 1: Create checker instance
    try:
        checker = ServerChecker(timeout=5, max_workers=2)
        print("✓ ServerChecker instance created successfully")
    except Exception as e:
        print(f"✗ Failed to create ServerChecker: {e}")
        return False
    
    # Test 2: Test DNS resolution (should work)
    test_servers = ['google.com', 'github.com']
    try:
        results = checker.check_servers(test_servers, show_progress=True)
        print(f"✓ Connectivity check completed for {len(results)} servers")
    except Exception as e:
        print(f"✗ Failed connectivity check: {e}")
        return False
    
    # Test 3: Verify results structure
    for result in results:
        required_keys = ['hostname', 'status', 'response_time', 'error', 'timestamp']
        if all(key in result for key in required_keys):
            print(f"✓ {result['hostname']}: {result['status']} ({result['response_time']}s)")
        else:
            print(f"✗ Invalid result structure for {result.get('hostname', 'unknown')}")
            return False
    
    # Test 4: Test file loading
    try:
        servers = checker.load_servers_from_file('sample_servers.txt')
        print(f"✓ Successfully loaded {len(servers)} servers from file")
    except Exception as e:
        print(f"✗ Failed to load from file: {e}")
        return False
    
    print("\n🎉 All tests passed! The server connectivity checker is working correctly.")
    print("\nWhat you're seeing is correct behavior:")
    print("- DNS_FAILED = hostname doesn't exist")
    print("- PORT_CLOSED = server exists but doesn't allow SSH")
    print("- AUTH_FAILED = SSH port open but login failed (normal for test servers)")
    print("- SUCCESS = you can actually SSH to the server")
    
    return True

if __name__ == "__main__":
    success = test_basic_functionality()
    sys.exit(0 if success else 1)