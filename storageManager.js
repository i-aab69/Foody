const ROLE_KEY = 'userRole';
const FAVORITES_KEY = 'foodyFavorites';
const PROFILE_KEY = 'userProfileData';

function saveUserRole(role) {
    if (role === 'user' || role === 'admin') {
        localStorage.setItem(ROLE_KEY, role);
        console.log(`StorageManager: Saved userRole = ${role}`);
    } else {
        console.error(`StorageManager: Invalid role "${role}". Role not saved.`);
    }
}

function getUserRole() {
    return localStorage.getItem(ROLE_KEY);
}

function clearUserRole() {
    localStorage.removeItem(ROLE_KEY);
    console.log("StorageManager: Cleared userRole.");
}


function getFavorites() {
    try {
        const favsJson = localStorage.getItem(FAVORITES_KEY);
        return favsJson ? JSON.parse(favsJson) : [];
    } catch (e) {
        console.error("StorageManager: Couldn't parse favorites.", e);
        return [];
    }
}

function saveFavorites(favsArray) {
    if (!Array.isArray(favsArray)) {
        console.error("StorageManager: Didn't get an array to save favorites.");
        return;
    }
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favsArray));
    } catch (e) {
        console.error("StorageManager: Couldn't save favorites.", e);
    }
}

function addFavorite(id) {
    if (!id) return;
    let currentFavs = getFavorites();
    if (!currentFavs.includes(id)) {
        currentFavs.push(id);
        saveFavorites(currentFavs);
        console.log(`StorageManager: Added favorite ${id}`);
    }
}

function removeFavorite(id) {
    if (!id) return;
    let currentFavs = getFavorites();
    const originalLength = currentFavs.length;
    let updatedFavs = currentFavs.filter(favId => favId !== id);
    if (updatedFavs.length < originalLength) {
        saveFavorites(updatedFavs);
        console.log(`StorageManager: Removed favorite ${id}`);
    }
}

function isFavorite(id) {
    if (!id) return false;
    return getFavorites().includes(id);
}


function getUserProfile() {
    const defaultProfile = { username: "Guest", email: "", phone: "", about: "", picture: null };
    try {
        const profileJson = localStorage.getItem(PROFILE_KEY);
        const savedProfile = profileJson ? JSON.parse(profileJson) : {};
        return { ...defaultProfile, ...savedProfile };
    } catch (error) {
        console.error("StorageManager: Couldn't parse profile data.", error);
        return defaultProfile;
    }
}

function saveUserProfile(profileData) {
    if (typeof profileData !== 'object' || profileData === null) {
        console.error("StorageManager: Didn't get an object to save profile.");
        return;
    }
    try {
        const existingProfile = getUserProfile();
        const dataToSave = { ...existingProfile };

        if (profileData.username !== undefined) dataToSave.username = profileData.username;
        if (profileData.email !== undefined) dataToSave.email = profileData.email;
        if (profileData.phone !== undefined) dataToSave.phone = profileData.phone;
        if (profileData.about !== undefined) dataToSave.about = profileData.about;
        if (profileData.picture !== undefined) dataToSave.picture = profileData.picture;

        const profileJson = JSON.stringify(dataToSave);
        localStorage.setItem(PROFILE_KEY, profileJson);
        console.log("StorageManager: Saved profile data.", dataToSave);
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            alert("Couldn't save profile: Storage limit full. Maybe try a smaller picture?");
        }
        console.error("StorageManager: Couldn't save profile data.", error);
    }
}

function clearUserProfile() {
    localStorage.removeItem(PROFILE_KEY);
    console.log("StorageManager: Cleared profile data.");
}
