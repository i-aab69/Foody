document.addEventListener('DOMContentLoaded', function () {
    // Get the container and buttons
    const container = document.getElementById('main');
    const goToSignupBtn = document.getElementById('go-to-signup');
    const goToLoginBtn = document.getElementById('go-to-login');
    
    // Add event listeners for switching panels
    goToSignupBtn.addEventListener('click', function() {
      container.classList.add('right-panel-active');
    });
    
    goToLoginBtn.addEventListener('click', function() {
      container.classList.remove('right-panel-active');
    });
    
    // Initialize role toggle for both forms
    initRoleToggle(document.querySelector('.login-container'));
    initRoleToggle(document.querySelector('.signup-container'));
    
    // Initialize form validation
    initLoginForm();
    initSignupForm();
    
    // Role toggle initialization function
    function initRoleToggle(container) {
      const userRole = container.querySelector('.role.user');
      const adminRole = container.querySelector('.role.admin');
      
      userRole.addEventListener('click', function () {
        userRole.classList.add('active');
        adminRole.classList.remove('active');
      });
      
      adminRole.addEventListener('click', function () {
        adminRole.classList.add('active');
        userRole.classList.remove('active');
      });
    }
    
    // Login form initialization
    function initLoginForm() {
      const loginForm = document.getElementById('login-form');
      const usernameInput = loginForm.querySelector('input.username');
      const passwordInput = loginForm.querySelector('input.password');
      const loginBtn = loginForm.querySelector('.login-btn-form');
      
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
          console.log('Login attempt successful');
          console.log('Username:', usernameInput.value);
          // In a real application, you would handle authentication here
          loginForm.reset();
        }
      });
    }
    
    // Signup form initialization
    function initSignupForm() {
      const signupForm = document.getElementById('signup-form');
      const usernameInput = signupForm.querySelector('input.username');
      const passwordInput = signupForm.querySelector('input.password');
      const confirmPasswordInput = signupForm.querySelector('input.confirm-password');
      const emailInput = signupForm.querySelector('input.email');
      const signupBtn = signupForm.querySelector('.signup-btn');
      
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
          console.log('Form submitted successfully');
          signupForm.reset();
          // Switch to login after successful signup
          container.classList.remove('right-panel-active');
        }
      });
    }
  });
