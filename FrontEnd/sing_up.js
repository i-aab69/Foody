document.addEventListener('DOMContentLoaded', function () {

    if (typeof saveUserRole !== 'function' || typeof saveUserProfile !== 'function') {
        console.error("Whoops! storageManager.js functions aren't loaded before sing_up.js!");
        alert("Critical Error: Cannot save user data. Please refresh or contact support.");
        return;
    }

    const mainContainer = document.getElementById('main');
    const goToSignupButton = document.getElementById('go-to-signup');
    const goToLoginButton = document.getElementById('go-to-login');

    const loginSection = document.querySelector('.login-container');
    const signupSection = document.querySelector('.signup-container');

    if (goToSignupButton) {
        goToSignupButton.addEventListener('click', () => {
            if (mainContainer) mainContainer.classList.add('right-panel-active');
        });
    }

    if (goToLoginButton) {
        goToLoginButton.addEventListener('click', () => {
            if (mainContainer) mainContainer.classList.remove('right-panel-active');
        });
    }

    if (loginSection) setupRoleToggle(loginSection);
    if (signupSection) setupRoleToggle(signupSection);

    if (loginSection) setupLoginForm(loginSection);
    if (signupSection) setupSignupForm(signupSection);

    function setupRoleToggle(formSection) {
        if (!formSection) return;

        const userRoleButton = formSection.querySelector('.role.user');
        const adminRoleButton = formSection.querySelector('.role.admin');

        if (userRoleButton && adminRoleButton) {
            userRoleButton.addEventListener('click', () => {
                userRoleButton.classList.add('active');
                adminRoleButton.classList.remove('active');
            });

            adminRoleButton.addEventListener('click', () => {
                adminRoleButton.classList.add('active');
                userRoleButton.classList.remove('active');
            });
        }
    }

    function setupLoginForm(formSection) {
        const loginFormElement = document.getElementById('login-form');
        if (!loginFormElement) return;

        const usernameInput = loginFormElement.querySelector('input.username');
        const passwordInput = loginFormElement.querySelector('input.password');
        const loginButton = loginFormElement.querySelector('.login-btn-form');

        if (!usernameInput || !passwordInput || !loginButton) return;

        loginButton.addEventListener('click', (event) => {
            event.preventDefault();
            let isFormValid = true;

            const enteredUsername = usernameInput.value.trim();
            const enteredPassword = passwordInput.value.trim();

            if (enteredUsername === '') {
                alert('Username is required');
                isFormValid = false;
            }
            if (enteredPassword === '') {
                alert('Password is required');
                isFormValid = false;
            }

            if (isFormValid) {
                const activeRoleElement = formSection.querySelector('.role.active');
                const selectedRole = activeRoleElement ? (activeRoleElement.classList.contains('admin') ? 'admin' : 'user') : 'user';

                saveUserRole(selectedRole);
                saveSignUpProfile({
                    username: usernameInput.value,
                    email: emailInput.value,
                    phone: '', 
                    about: '', 
                    picture: 'source/placeholder_profile.png'
                });
                console.log(`Login passed. Role: ${selectedRole}, User: ${enteredUsername}. Redirecting...`);

                if (selectedRole === 'admin') {
                    window.location.href = 'my_recipe.html';
                } else {
                    window.location.href = 'home.html';
                }
            }
        });
    }

    function setupSignupForm(formSection) {
        const signupFormElement = document.getElementById('signup-form');
        if (!signupFormElement) return;

        const usernameInput = signupFormElement.querySelector('input.username');
        const passwordInput = signupFormElement.querySelector('input.password');
        const confirmPasswordInput = signupFormElement.querySelector('input.confirm-password');
        const emailInput = signupFormElement.querySelector('input.email');
        const signupButton = signupFormElement.querySelector('.signup-btn');

        if (!usernameInput || !passwordInput || !confirmPasswordInput || !emailInput || !signupButton) return;

        signupButton.addEventListener('click', (event) => {
            event.preventDefault();
            let isFormValid = true;

            const enteredUsername = usernameInput.value.trim();
            const enteredPassword = passwordInput.value.trim();
            const enteredConfirmPassword = confirmPasswordInput.value.trim();
            const enteredEmail = emailInput.value.trim();

            if (enteredUsername === '') { alert('Username is required'); isFormValid = false; }
            if (enteredPassword === '') { alert('Password is required'); isFormValid = false; }
            if (enteredConfirmPassword === '') { alert('Confirm Password is required'); isFormValid = false; }
            if (enteredPassword !== enteredConfirmPassword) { alert('Passwords do not match'); isFormValid = false; }
            if (enteredEmail === '') { alert('Email is required'); isFormValid = false; }
            else if (!/\S+@\S+\.\S+/.test(enteredEmail)) { alert('Please enter a valid email address'); isFormValid = false; }

            if (isFormValid) {
                const activeRoleElement = formSection.querySelector('.role.active');
                const selectedRole = activeRoleElement ? (activeRoleElement.classList.contains('admin') ? 'admin' : 'user') : 'user';

                saveUserRole(selectedRole);
                saveSignUpProfile({
                username: usernameInput.value,
                email: emailInput.value,
                phone: phoneInput.value || '',
                about: aboutInput.value || '',
                picture: 'source/profile.png'
            });

                console.log(`Signup passed. Role: ${selectedRole}, User: ${enteredUsername}, Email: ${enteredEmail}. Redirecting...`);

                if (selectedRole === 'admin') {
                    window.location.href = 'my_recipe.html';
                } else {
                    window.location.href = 'home.html';
                }
            }
        });
    }
});
