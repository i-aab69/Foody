// Foody-main/sing_up.js (Human-Readable Version)

// Wait until the webpage's content is fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', function () {

    // First, make sure the functions we need from storageManager.js are loaded and ready.
    // If not, show an error and stop, because we can't save essential data.
    if (typeof saveUserRole !== 'function' || typeof saveUserProfile !== 'function') {
        console.error("Whoops! storageManager.js functions aren't loaded before sing_up.js!");
        alert("Critical Error: Cannot save user data. Please refresh or contact support.");
        return; // Stop right here if things aren't loaded properly
    }

    // --- Get HTML Elements ---
    // Find the main container that switches between login and signup views
    const mainContainer = document.getElementById('main');
    // Find the buttons that trigger the switch
    const goToSignupButton = document.getElementById('go-to-signup');
    const goToLoginButton = document.getElementById('go-to-login');

    // Find the specific sections for login and signup
    const loginSection = document.querySelector('.login-container');
    const signupSection = document.querySelector('.signup-container');

    // --- Setup Event Listeners for View Switching ---

    // If the "Go to Signup" button exists, add a click listener
    if (goToSignupButton) {
        goToSignupButton.addEventListener('click', () => {
            // When clicked, add the 'right-panel-active' class to slide the signup panel into view
            if (mainContainer) mainContainer.classList.add('right-panel-active');
        });
    }

    // If the "Go to Login" button exists, add a click listener
    if (goToLoginButton) {
        goToLoginButton.addEventListener('click', () => {
            // When clicked, remove the 'right-panel-active' class to slide the login panel back
            if (mainContainer) mainContainer.classList.remove('right-panel-active');
        });
    }

    // --- Initialize Form Components ---

    // Set up the User/Admin role toggles for both login and signup sections
    if (loginSection) setupRoleToggle(loginSection);
    if (signupSection) setupRoleToggle(signupSection);

    // Set up the validation and submission logic for both forms
    if (loginSection) setupLoginForm(loginSection);
    if (signupSection) setupSignupForm(signupSection);

    /**
     * Sets up the clickable User/Admin role selection within a given form section.
     * @param {HTMLElement} formSection - The container element (.login-container or .signup-container).
     */
    function setupRoleToggle(formSection) {
        if (!formSection) return; // Safety check

        const userRoleButton = formSection.querySelector('.role.user');
        const adminRoleButton = formSection.querySelector('.role.admin');

        // Make sure both buttons were found
        if (userRoleButton && adminRoleButton) {
            // When User is clicked, make it active and deactivate Admin
            userRoleButton.addEventListener('click', () => {
                userRoleButton.classList.add('active');
                adminRoleButton.classList.remove('active');
            });

            // When Admin is clicked, make it active and deactivate User
            adminRoleButton.addEventListener('click', () => {
                adminRoleButton.classList.add('active');
                userRoleButton.classList.remove('active');
            });
        }
    }

    /**
     * Sets up validation and submission logic for the Login form.
     * @param {HTMLElement} formSection - The .login-container element.
     */
    function setupLoginForm(formSection) {
        const loginFormElement = document.getElementById('login-form');
        if (!loginFormElement) return; // Safety check

        // Get the input fields and the login button
        const usernameInput = loginFormElement.querySelector('input.username');
        const passwordInput = loginFormElement.querySelector('input.password'); // Still needed for validation
        const loginButton = loginFormElement.querySelector('.login-btn-form');

        // Make sure we found all necessary elements
        if (!usernameInput || !passwordInput || !loginButton) return;

        // Add listener for when the login button is clicked
        loginButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the form from submitting traditionally
            let isFormValid = true; // Assume the form is valid initially

            const enteredUsername = usernameInput.value.trim();
            const enteredPassword = passwordInput.value.trim(); // We need the value for validation, BUT WE DON'T SAVE IT!

            // --- Simple Validation ---
            if (enteredUsername === '') {
                alert('Username is required');
                isFormValid = false;
            }
            if (enteredPassword === '') {
                alert('Password is required');
                isFormValid = false;
            }

            // --- If Validation Passes ---
            if (isFormValid) {
                // Figure out which role (User/Admin) is currently selected
                const activeRoleElement = formSection.querySelector('.role.active');
                const selectedRole = activeRoleElement ? (activeRoleElement.classList.contains('admin') ? 'admin' : 'user') : 'user'; // Default to 'user' if somehow none selected

                // Save the selected role and the entered username using our storageManager
                saveUserRole(selectedRole);
                saveUserProfile({ username: enteredUsername }); // Only save username on login

                console.log(`Login passed. Role: ${selectedRole}, User: ${enteredUsername}. Redirecting...`);

                // Redirect to the appropriate page based on the role
                if (selectedRole === 'admin') {
                    window.location.href = 'my_recipe.html'; // Admin goes to list page
                } else {
                    window.location.href = 'home.html'; // User goes to home page
                }
            }
        });
    }

    /**
     * Sets up validation and submission logic for the Signup form.
     * @param {HTMLElement} formSection - The .signup-container element.
     */
    function setupSignupForm(formSection) {
        const signupFormElement = document.getElementById('signup-form');
        if (!signupFormElement) return; // Safety check

        // Get the input fields and the signup button
        const usernameInput = signupFormElement.querySelector('input.username');
        const passwordInput = signupFormElement.querySelector('input.password');
        const confirmPasswordInput = signupFormElement.querySelector('input.confirm-password');
        const emailInput = signupFormElement.querySelector('input.email');
        const signupButton = signupFormElement.querySelector('.signup-btn');

        // Make sure we found all necessary elements
        if (!usernameInput || !passwordInput || !confirmPasswordInput || !emailInput || !signupButton) return;

        // Add listener for when the signup button is clicked
        signupButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the form from submitting traditionally
            let isFormValid = true; // Assume valid initially

            // Get trimmed values from inputs
            const enteredUsername = usernameInput.value.trim();
            const enteredPassword = passwordInput.value.trim(); // Again, needed for validation, NOT SAVED!
            const enteredConfirmPassword = confirmPasswordInput.value.trim();
            const enteredEmail = emailInput.value.trim();

            // --- Simple Validation ---
            if (enteredUsername === '') { alert('Username is required'); isFormValid = false; }
            if (enteredPassword === '') { alert('Password is required'); isFormValid = false; }
            if (enteredConfirmPassword === '') { alert('Confirm Password is required'); isFormValid = false; }
            if (enteredPassword !== enteredConfirmPassword) { alert('Passwords do not match'); isFormValid = false; }
            if (enteredEmail === '') { alert('Email is required'); isFormValid = false; }
            // Basic check if email looks like an email (contains @ and .)
            else if (!/\S+@\S+\.\S+/.test(enteredEmail)) { alert('Please enter a valid email address'); isFormValid = false; }

            // --- If Validation Passes ---
            if (isFormValid) {
                // Figure out which role (User/Admin) is selected
                const activeRoleElement = formSection.querySelector('.role.active');
                const selectedRole = activeRoleElement ? (activeRoleElement.classList.contains('admin') ? 'admin' : 'user') : 'user'; // Default to 'user'

                // Save the selected role
                saveUserRole(selectedRole);
                // Save the username and email, initializing other profile fields as empty
                saveUserProfile({
                    username: enteredUsername,
                    email: enteredEmail,
                    phone: "",
                    about: "",
                    picture: null
                });

                console.log(`Signup passed. Role: ${selectedRole}, User: ${enteredUsername}, Email: ${enteredEmail}. Redirecting...`);

                // Redirect to the appropriate page
                if (selectedRole === 'admin') {
                    window.location.href = 'my_recipe.html'; // Admin goes to list page
                } else {
                    window.location.href = 'home.html'; // User goes to home page
                }
            }
        });
    }

}); // End of DOMContentLoaded listener
