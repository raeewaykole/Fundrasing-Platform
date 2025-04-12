// Helper function to generate a valid JWT token for testing
function generateTestToken() {
    // This is a sample token - in a real app, we'd get this from the server
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTcxNDYwMDAwMCwiZXhwIjoxNzM0NjAwMDAwfQ.A5IaZ9eGbh3y-9E3U1D-OYMDyy1C7J8vphHa8JEcAlA";
}

// Store token in localStorage
function storeToken(token) {
    localStorage.setItem('token', token);
}

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Check if user is authenticated
function isAuthenticated() {
    return getToken() !== null;
}

// Remove token from localStorage
function removeToken() {
    localStorage.removeItem('token');
}

// Check if token is present, otherwise redirect to login
function checkAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
    }
}

// Logout user
function logout() {
    removeToken();
    window.location.href = '/login.html';
}

// Login as test user (for development only)
function loginAsTestUser() {
    storeToken(generateTestToken());
    window.location.href = '/dashboard.html';
} 