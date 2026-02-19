// Login Form Functionality
function initializeLoginForm() {
    const form = document.querySelector('form');
    const emailInput = document.querySelector('#email');
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const rememberCheckbox = document.querySelector('#remember');
    const googleBtn = document.querySelector('.social-btn.google');
    const facebookBtn = document.querySelector('.social-btn.facebook');

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const remember = rememberCheckbox.checked;

        // Validation
        if (!email || !username || !password) {
            alert('Please fill in all fields');
            console.log('Validation failed - missing fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email');
            console.log('Invalid email format');
            return;
        }

        // Log in data
        console.log('Login attempt:', {
            email: email,
            username: username,
            password: '***hidden***',
            remember: remember
        });

        // Store credentials if remember is checked
        if (remember) {
            localStorage.setItem('savedEmail', email);
            localStorage.setItem('savedUsername', username);
            console.log('Credentials saved to localStorage');
        }

        alert('Login successful!\n\nEmail: ' + email + '\nUsername: ' + username);
        console.log('User logged in successfully');
    });

    // Google login
    googleBtn.addEventListener('click', () => {
        console.log('Google login clicked');
        alert('Google login feature - coming soon!');
    });

    // Facebook login
    facebookBtn.addEventListener('click', () => {
        console.log('Facebook login clicked');
        alert('Facebook login feature - coming soon!');
    });

    // Load saved credentials if available
    const savedEmail = localStorage.getItem('savedEmail');
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedEmail && savedUsername) {
        emailInput.value = savedEmail;
        usernameInput.value = savedUsername;
        rememberCheckbox.checked = true;
        console.log('Loaded saved credentials from localStorage');
    }

    // Password visibility toggle
    const passwordGroup = passwordInput.parentElement;
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'password-toggle';
    toggleBtn.textContent = '👁️';
    toggleBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = '👁️';
        }
    });
    passwordGroup.appendChild(toggleBtn);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLoginForm);
