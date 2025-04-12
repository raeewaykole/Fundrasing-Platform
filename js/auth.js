// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('customCheck').checked;

    // In a real application, this would make an API call to authenticate
    // For now, we'll simulate a successful login
    if (email && password) {
        // Store user session
        localStorage.setItem('user', JSON.stringify({
            email,
            rememberMe
        }));

        // Redirect to dashboard
        window.location.href = 'index.html';
    } else {
        alert('Please fill in all fields');
    }
});

// Handle signup form submission
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('termsCheck').checked;

    // Validate form
    if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (!termsAccepted) {
        alert('Please accept the Terms and Conditions');
        return;
    }

    // In a real application, this would make an API call to register
    // For now, we'll simulate a successful registration
    const userData = {
        fullName,
        email,
        password // In a real app, this would be hashed
    };

    // Store user data (in a real app, this would be handled by the backend)
    localStorage.setItem('userData', JSON.stringify(userData));

    // Redirect to login page
    alert('Registration successful! Please login.');
    window.location.href = 'login.html';
});

// Check if user is already logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
}

// Initialize auth check
document.addEventListener('DOMContentLoaded', checkAuth); 