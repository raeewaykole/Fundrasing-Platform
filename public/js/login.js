document.addEventListener('DOMContentLoaded', () => {
    // Check if we're already logged in
    if (isAuthenticated() && window.location.pathname.includes('login.html')) {
        window.location.href = '/dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                const response = await fetch('http://localhost:3000/api/auth/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Login failed');
                }
                
                const data = await response.json();
                
                // Store token using auth.js function
                storeToken(data.token);
                
                // Redirect to dashboard
                window.location.href = '/dashboard.html';
            } catch (error) {
                console.error('Login error:', error);
                alert(error.message || 'Login failed. Please check your credentials and try again.');
            }
        });
    }
}); 