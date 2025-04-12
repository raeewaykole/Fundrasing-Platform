document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token is not expired
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp * 1000 > Date.now()) {
                // Token is valid, redirect to appropriate page
                if (window.location.pathname === '/login.html' || window.location.pathname === '/signup.html') {
                    window.location.href = '/donors.html';
                }
            } else {
                // Token expired
                localStorage.removeItem('token');
            }
        } catch (error) {
            // Invalid token
            localStorage.removeItem('token');
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/donors.html';
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during login');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const name = document.getElementById('fullName').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate password match
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password, name })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/donors.html';
                } else {
                    alert(data.message || 'Sign up failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during sign up');
            }
        });
    }
}); 