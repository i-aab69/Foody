document.addEventListener('DOMContentLoaded', () => {
    if (typeof getUserRole !== 'function') { console.error("SM not loaded before auth.js!"); return; }
    const userRole = getUserRole();

    const addLink = document.getElementById('nav-add-link');
    const listLink = document.getElementById('nav-list-link');
    const favLink = document.getElementById('nav-fav-link');
    const settingsLink = document.getElementById('nav-settings-link');
    const profileLink = document.getElementById('nav-profile-link');
    const homeLink = document.getElementById('nav-home-link');

    console.log(`Auth: Current user role = ${userRole}`);

    if (userRole === 'user') {
        console.log("Auth: Setting up User Navbar view");
        if (addLink) addLink.style.display = 'none';
        if (listLink) listLink.style.display = 'none';
        if (homeLink) homeLink.style.display = '';
        if (favLink) favLink.style.display = '';
        if (settingsLink) settingsLink.style.display = '';
        if (profileLink) {
            profileLink.style.display = '';
            profileLink.href = 'profile_page.html';
        }
    } else if (userRole === 'admin') {
        console.log("Auth: Setting up Admin Navbar view");
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
        console.log("Auth: No user role found. Hiding role-specific navbar links.");
        if (addLink) addLink.style.display = 'none';
        if (listLink) listLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
        if (settingsLink) settingsLink.style.display = 'none';
        if (favLink) favLink.style.display = 'none';
        if (homeLink) homeLink.style.display = 'none';
    }
});