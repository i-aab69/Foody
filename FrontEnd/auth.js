document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});
const loggedUser = JSON.parse(localStorage.getItem("LoggedUser"));
const role = loggedUser.Role; 
console.log(loggedUser)


const addLink = document.getElementById('nav-add-link');
const listLink = document.getElementById('nav-list-link');
const favLink = document.getElementById('nav-fav-link');
const settingsLink = document.getElementById('nav-settings-link');
const profileLink = document.getElementById('nav-profile-link');
const homeLink = document.getElementById('nav-home-link');

console.log(`Auth script running. Role = ${role}`);

if (role === false) {
    console.log("Setting up User view...");

    if (addLink) addLink.style.display = 'none';
    if (listLink) listLink.style.display = 'none';

    if (homeLink) homeLink.style.display = '';
    if (favLink) favLink.style.display = '';
    if (settingsLink) settingsLink.style.display = '';
    if (profileLink) {
        profileLink.style.display = '';
        profileLink.href = 'profile_page.html';
    }

} else if (role === true) {
    console.log("Setting up Admin view...");

    if (homeLink) homeLink.style.display = 'none';
    if (favLink) favLink.style.display = 'none';
    if (settingsLink) settingsLink.style.display = 'none';

    if (profileLink) {
        profileLink.style.display = '';
        profileLink.href = 'profile_page.html';
    }

    if (addLink) addLink.style.display = '';
    if (listLink) listLink.style.display = '';

} else {
    console.log("No role found. Hiding stuff.");

    if (addLink) addLink.style.display = 'none';
    if (listLink) listLink.style.display = 'none';
    if (profileLink) profileLink.style.display = 'none';
    if (settingsLink) settingsLink.style.display = 'none';
    if (favLink) favLink.style.display = 'none';
    if (homeLink) homeLink.style.display = 'none';
}
// auth.js - Authentication management for Foody



// Check if user is authenticated and handle page redirects
function checkAuthentication() {
    const currentPage = window.location.pathname.split('/').pop();
    const isLoginPage = currentPage === 'sing_up.html' || currentPage === 'login.html' || currentPage === 'index.html';
    const user = localStorage.getItem('LoggedUser');
    
    // If not logged in and trying to access a protected page
    if (!user && !isLoginPage) {
        // Redirect to login except for public pages
        if (currentPage !== 'index.html' && currentPage !== '') {
            alert('Please login to continue');
            window.location.href = 'sing_up.html';
            return;
        }
    }
    
    // If logged in but trying to access login/signup page
    if (user && isLoginPage) {
        // Redirect to home page
        window.location.href = 'home_page1.html';
        return;
    }
    
    // Initialize UI based on auth status
    if (user) {
        initializeAuthenticatedUI();
    }
}

// Initialize UI elements based on logged in status
function initializeAuthenticatedUI() {
    const user = JSON.parse(localStorage.getItem('LoggedUser'));
    if (!user) return;
    
    // Handle profile-specific UI elements if on profile page
    const profileUsername = document.getElementById('profile-username-display');
    if (profileUsername) {
        // Profile page specific UI updates will be handled by profile_page.js
    }
    
    // Additional UI updates based on role could go here
}

// User logout function
function logout() {
    localStorage.removeItem('LoggedUser');
    window.location.href = 'sing_up.html';
}