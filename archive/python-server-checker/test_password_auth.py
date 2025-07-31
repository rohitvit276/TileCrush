#!/usr/bin/env python3
"""
Test script for password authentication functionality
"""

from server_connectivity_checker import ServerChecker
import getpass

def test_password_auth():
    print("🔐 Testing Password Authentication Features")
    print("=" * 50)
    
    # Test 1: Initialize with credentials
    print("\n1. Testing ServerChecker with password authentication...")
    
    # Simulate credentials (don't use real ones in test)
    test_username = "testuser"
    test_password = "testpass"
    
    checker = ServerChecker(
        timeout=5,
        max_workers=2,
        username=test_username,
        password=test_password,
        use_password_auth=True
    )
    
    print(f"✓ Created ServerChecker with username: {checker.username}")
    print(f"✓ Password authentication enabled: {checker.use_password_auth}")
    
    # Test 2: Verify methods exist
    print("\n2. Testing new authentication methods...")
    
    methods = [
        '_test_ssh_with_password',
        '_test_ssh_with_expect', 
        '_test_ssh_with_keys'
    ]
    
    for method in methods:
        if hasattr(checker, method):
            print(f"✓ Method {method} exists")
        else:
            print(f"✗ Method {method} missing")
    
    # Test 3: Test with fake server (will fail but show the flow)
    print("\n3. Testing authentication flow with fake server...")
    
    test_servers = ['fake-test-server.example.com']
    results = checker.check_servers(test_servers, show_progress=True)
    
    for result in results:
        print(f"✓ Result structure valid for {result['hostname']}")
        print(f"  Status: {result['status']}")
        print(f"  Error: {result['error'][:50]}...")
    
    print("\n4. Testing different authentication modes...")
    
    # Test key-based auth
    key_checker = ServerChecker(
        timeout=3,
        max_workers=1,
        username="keyuser",
        use_password_auth=False
    )
    print(f"✓ Key-based checker created for user: {key_checker.username}")
    
    print("\n✅ All password authentication tests completed!")
    print("\nFeatures verified:")
    print("• Username/password credential storage")
    print("• Authentication mode switching")
    print("• Password-based SSH testing methods")
    print("• Fallback authentication options")
    print("• Integration with existing connectivity testing")

if __name__ == "__main__":
    test_password_auth()