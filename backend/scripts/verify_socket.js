import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
    auth: {
        token: 'test-token' // This will fail auth in a real scenario unless mocked or valid
    }
});

socket.on('connect', () => {
    console.log('Connected to server via Socket.io');
    socket.disconnect();
});

socket.on('connect_error', (err) => {
    console.log('Connection error:', err.message);
    // Expected behavior if token is invalid, but confirms server is reachable
    if (err.message.includes('Authentication error') || err.message.includes('No authorization token provided')) {
        console.log('Test Passed: Server reachable and Auth middleware active');
    } else {
        console.log('Test Failed: Unexpected error', err.message);
    }
    process.exit(0); // Exit gracefully
});
