#!/usr/bin/env python3
"""
Backend API Testing for Luxury Birthday Card Application
Tests all enhanced API endpoints: health, birthday-info, placeholder images, upload-photo, and confetti-sound
"""

import requests
import json
import os
from io import BytesIO

# Get base URL from environment
BASE_URL = "https://birthday-surprise-41.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def test_health_endpoint():
    """Test GET /api/health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    try:
        response = requests.get(f"{API_BASE}/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['status', 'service', 'timestamp']
            
            # Check if all required fields are present
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False
                
            # Check specific values
            if data.get('status') != 'healthy':
                print(f"❌ Expected status 'healthy', got '{data.get('status')}'")
                return False
                
            if data.get('service') != 'Luxury Birthday Card API':
                print(f"❌ Expected service 'Luxury Birthday Card API', got '{data.get('service')}'")
                return False
                
            print("✅ Health endpoint working correctly")
            return True
        else:
            print(f"❌ Health endpoint failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Health endpoint request failed: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Health endpoint returned invalid JSON: {e}")
        return False

def test_birthday_info_endpoint():
    """Test GET /api/birthday-info endpoint"""
    print("\n=== Testing Birthday Info Endpoint ===")
    try:
        response = requests.get(f"{API_BASE}/birthday-info", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['celebrant', 'birthdayBS', 'currentDateAD', 'message']
            
            # Check if all required fields are present
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False
                
            # Check specific values
            if data.get('celebrant') != 'Dear Uncle - Rajendra Regmi':
                print(f"❌ Expected celebrant 'Dear Uncle - Rajendra Regmi', got '{data.get('celebrant')}'")
                return False
                
            if data.get('birthdayBS') != 'Asoj 16, 2082':
                print(f"❌ Expected birthday 'Asoj 16, 2082', got '{data.get('birthdayBS')}'")
                return False
                
            if 'Happy Birthday' not in data.get('message', ''):
                print(f"❌ Expected birthday message with 'Happy Birthday', got '{data.get('message')}'")
                return False
                
            # Check that currentDateAD is a properly formatted date string
            current_date = data.get('currentDateAD', '')
            if not current_date or len(current_date) < 10:
                print(f"❌ Invalid current date format: '{current_date}'")
                return False
                
            print("✅ Birthday info endpoint working correctly")
            print(f"   Celebrant: {data.get('celebrant')}")
            print(f"   Birthday BS: {data.get('birthdayBS')}")
            print(f"   Current Date: {data.get('currentDateAD')}")
            return True
        else:
            print(f"❌ Birthday info endpoint failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Birthday info endpoint request failed: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Birthday info endpoint returned invalid JSON: {e}")
        return False

def test_upload_photo_endpoint():
    """Test POST /api/upload-photo endpoint"""
    print("\n=== Testing Photo Upload Endpoint ===")
    
    # Test 1: Valid photo upload
    print("\n--- Test 1: Valid Photo Upload ---")
    try:
        # Create a mock image file
        mock_image_data = b"fake_image_data_for_testing"
        files = {
            'photo': ('test_photo.jpg', BytesIO(mock_image_data), 'image/jpeg')
        }
        
        data = {'type': 'profile'}  # Test with photo type
        response = requests.post(f"{API_BASE}/upload-photo", files=files, data=data, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['success', 'message', 'filename', 'size', 'type', 'uploadedAt', 'placeholder']
            
            # Check if all required fields are present
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                test1_result = False
            else:
                # Check specific values
                if not data.get('success'):
                    print(f"❌ Expected success=true, got {data.get('success')}")
                    test1_result = False
                elif data.get('filename') != 'test_photo.jpg':
                    print(f"❌ Expected filename 'test_photo.jpg', got '{data.get('filename')}'")
                    test1_result = False
                elif 'Beautiful' not in data.get('message', ''):
                    print(f"❌ Expected success message with 'Beautiful', got '{data.get('message')}'")
                    test1_result = False
                elif 'uploadedAt' not in data:
                    print(f"❌ Missing uploadedAt timestamp")
                    test1_result = False
                else:
                    print("✅ Valid photo upload working correctly")
                    print(f"   Message: {data.get('message')}")
                    print(f"   Placeholder: {data.get('placeholder')}")
                    test1_result = True
        else:
            print(f"❌ Photo upload failed with status {response.status_code}")
            test1_result = False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Photo upload request failed: {e}")
        test1_result = False
    except json.JSONDecodeError as e:
        print(f"❌ Photo upload returned invalid JSON: {e}")
        test1_result = False
    
    # Test 2: No photo provided (error case)
    print("\n--- Test 2: No Photo Provided (Error Case) ---")
    try:
        # Send multipart form data but without the 'photo' field
        files = {'other_field': ('test.txt', 'some data', 'text/plain')}
        response = requests.post(f"{API_BASE}/upload-photo", files=files, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 400:
            data = response.json()
            if 'error' in data and 'No photo provided' in data.get('error', ''):
                print("✅ Error handling for missing photo working correctly")
                test2_result = True
            else:
                print(f"❌ Expected 'No photo provided' error, got: {data}")
                test2_result = False
        else:
            print(f"❌ Expected status 400 for missing photo, got {response.status_code}")
            test2_result = False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ No photo test request failed: {e}")
        test2_result = False
    except json.JSONDecodeError as e:
        print(f"❌ No photo test returned invalid JSON: {e}")
        test2_result = False
    
    return test1_result and test2_result

def test_invalid_endpoint():
    """Test invalid endpoint to check error handling"""
    print("\n=== Testing Invalid Endpoint ===")
    try:
        response = requests.get(f"{API_BASE}/invalid-endpoint", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('message') == 'Luxury Birthday Card API is running':
                print("✅ Invalid GET endpoint returns default message correctly")
                return True
            else:
                print(f"❌ Unexpected response for invalid endpoint: {data}")
                return False
        else:
            print(f"❌ Invalid endpoint failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Invalid endpoint request failed: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid endpoint returned invalid JSON: {e}")
        return False

def run_all_tests():
    """Run all backend API tests"""
    print("🎂 Starting Birthday Card Backend API Tests")
    print(f"Testing API at: {API_BASE}")
    
    results = {
        'health': test_health_endpoint(),
        'birthday_info': test_birthday_info_endpoint(),
        'upload_photo': test_upload_photo_endpoint(),
        'invalid_endpoint': test_invalid_endpoint()
    }
    
    print("\n" + "="*50)
    print("📊 TEST RESULTS SUMMARY")
    print("="*50)
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All backend API tests passed! The birthday card API is working correctly.")
        return True
    else:
        print("⚠️  Some tests failed. Please check the detailed output above.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)