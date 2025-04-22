document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('main');
    const goToSignupBtn = document.getElementById('go-to-signup');
    const goToLoginBtn = document.getElementById('go-to-login');

    if (goToSignupBtn) {
        goToSignupBtn.addEventListener('click', function() {
            if (container) container.classList.add('right-panel-active');
        });
    }

    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', function() {
            if (container) container.classList.remove('right-panel-active');
        });
    }

    const loginContainer = document.querySelector('.login-container');
    const signupContainer = document.querySelector('.signup-container');

    if (loginContainer) initRoleToggle(loginContainer);
    if (signupContainer) initRoleToggle(signupContainer);

    initLoginForm();
    initSignupForm();

    function initRoleToggle(formContainer) {
        if (!formContainer) return;
        const userRole = formContainer.querySelector('.role.user');
        const adminRole = formContainer.querySelector('.role.admin');

        if (userRole && adminRole) {
            userRole.addEventListener('click', function () {
                userRole.classList.add('active');
                adminRole.classList.remove('active');
            });

            adminRole.addEventListener('click', function () {
                adminRole.classList.add('active');
                userRole.classList.remove('active');
            });
        }
    }

    function initLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;

        const usernameInput = loginForm.querySelector('input.username');
        const passwordInput = loginForm.querySelector('input.password');
        const loginBtn = loginForm.querySelector('.login-btn-form');

        if (!usernameInput || !passwordInput || !loginBtn) return;

        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            let isValid = true;

            if (usernameInput.value.trim() === '') {
                alert('Username is required');
                isValid = false;
            }

            if (passwordInput.value.trim() === '') {
                alert('Password is required');
                isValid = false;
            }

            if (isValid) {
                console.log('Login validation passed. Redirecting...');
                window.location.href = 'home.html';
            }
        });
    }

    function initSignupForm() {
        const signupForm = document.getElementById('signup-form');
        if (!signupForm) return;

        const usernameInput = signupForm.querySelector('input.username');
        const passwordInput = signupForm.querySelector('input.password');
        const confirmPasswordInput = signupForm.querySelector('input.confirm-password');
        const emailInput = signupForm.querySelector('input.email');
        const signupBtn = signupForm.querySelector('.signup-btn');

        if (!usernameInput || !passwordInput || !confirmPasswordInput || !emailInput || !signupBtn) return;

        signupBtn.addEventListener('click', function (e) {
            e.preventDefault();
            let isValid = true;

            if (usernameInput.value.trim() === '') {
                alert('Username is required');
                isValid = false;
            }

            if (passwordInput.value.trim() === '') {
                alert('Password is required');
                isValid = false;
            }

            if (confirmPasswordInput.value.trim() === '') {
                alert('Confirm Password is required');
                isValid = false;
            }

            if (passwordInput.value !== confirmPasswordInput.value) {
                alert('Passwords do not match');
                isValid = false;
            }

            if (emailInput.value.trim() === '') {
                alert('Email is required');
                isValid = false;
            }

            if (isValid) {
                console.log('Signup validation passed. Redirecting...');
                window.location.href = 'home.html';
            }
        });
    }
});