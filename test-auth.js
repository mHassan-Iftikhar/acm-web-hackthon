#!/usr/bin/env node
/**
 * Firebase Authentication Test Script
 * 
 * This script tests the Firebase Auth integration between frontend and backend.
 * Run this after updating Firebase credentials in backend/.env
 */

const axios = require('axios');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function testBackendHealth() {
    console.log('\n🔍 Testing Backend Health...');
    try {
        const response = await axios.get(`${API_URL}/api/health`);
        console.log('✅ Backend is running');
        console.log('   Response:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Backend health check failed:', error.message);
        console.error('   Make sure backend is running: cd backend && npm run dev');
        return false;
    }
}

async function testAuthEndpoint() {
    console.log('\n🔍 Testing Auth Endpoint (without token)...');
    try {
        await axios.get(`${API_URL}/api/auth/me`);
        console.log('❌ Expected 401 error but got success - auth middleware may not be working');
        return false;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('✅ Auth middleware is working (401 Unauthorized as expected)');
            return true;
        }
        console.error('❌ Unexpected error:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('='.repeat(60));
    console.log('🚀 Firebase Authentication Integration Test');
    console.log('='.repeat(60));

    const healthOk = await testBackendHealth();
    if (!healthOk) {
        console.log('\n❌ Backend is not responding. Please start the backend server first.');
        process.exit(1);
    }

    const authOk = await testAuthEndpoint();

    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Summary');
    console.log('='.repeat(60));
    console.log(`Backend Health: ${healthOk ? '✅ Pass' : '❌ Fail'}`);
    console.log(`Auth Middleware: ${authOk ? '✅ Pass' : '❌ Fail'}`);

    console.log('\n📝 Next Steps:');
    console.log('1. Update Firebase credentials in backend/.env (see firebase_setup_guide.md)');
    console.log('2. Restart backend: cd backend && npm run dev');
    console.log('3. Check for "✅ Firebase Admin initialized" in backend logs');
    console.log('4. Test sign-up: http://localhost:3000/signup');
    console.log('5. Create a test user and verify in Firebase Console');

    console.log('\n' + '='.repeat(60));
}

runTests().catch(console.error);
