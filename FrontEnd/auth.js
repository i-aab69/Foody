const loggedUser = JSON.parse(localStorage.getItem("LoggedUser"));
const role = loggedUser.Role; 


const addLink = document.getElementById('nav-add-link');
const listLink = document.getElementById('nav-list-link');
const favLink = document.getElementById('nav-fav-link');
const settingsLink = document.getElementById('nav-settings-link');
const profileLink = document.getElementById('nav-profile-link');
const homeLink = document.getElementById('nav-home-link');

console.log(`Auth script running. Role = ${role}`);

if (role === 'User') {
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

} else if (role === 'Admin') {
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
