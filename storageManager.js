// Foody-main/storageManager.js

// --- Constants ---
const ROLE_KEY = 'userRole';
const FAVORITES_KEY = 'foodyFavorites';
const PROFILE_KEY = 'userProfileData'; // Key for profile data

// --- User Role Management ---
/** Saves the user's role ('user' or 'admin'). */
function saveUserRole(role) { if (role === 'user' || role === 'admin') { localStorage.setItem(ROLE_KEY, role); console.log(`StorageManager: Saved userRole = ${role}`); } else { console.error(`StorageManager: Invalid role "${role}". Role not saved.`); } }
/** Retrieves the user's role ('user' or 'admin' or null). */
function getUserRole() { return localStorage.getItem(ROLE_KEY); }
/** Clears the user's role. */
function clearUserRole() { localStorage.removeItem(ROLE_KEY); console.log("StorageManager: Cleared userRole."); }

// --- Favorites Management ---
/** Retrieves the array of favorite recipe IDs. */
function getFavorites() { try { const f = localStorage.getItem(FAVORITES_KEY); return f ? JSON.parse(f) : []; } catch (e) { console.error("SM: Err parsing favs", e); return []; } }
/** Saves the array of favorite recipe IDs. */
function saveFavorites(arr) { if (!Array.isArray(arr)) { console.error("SM: Invalid type for saveFavorites"); return; } try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr)); } catch (e) { console.error("SM: Err saving favs", e); } }
/** Adds a recipe ID to favorites. */
function addFavorite(id) { if (!id) return; let f = getFavorites(); if (!f.includes(id)) { f.push(id); saveFavorites(f); console.log(`SM: Added fav ${id}`); } }
/** Removes a recipe ID from favorites. */
function removeFavorite(id) { if (!id) return; let f = getFavorites(); const l = f.length; f = f.filter(i => i !== id); if (f.length < l) { saveFavorites(f); console.log(`SM: Removed fav ${id}`); } }
/** Checks if a recipe ID is a favorite. */
function isFavorite(id) { if (!id) return false; return getFavorites().includes(id); }


// --- User Profile Management ---

/**
 * Retrieves the user profile data object { username, email, phone, about, picture }
 * @returns {object} Profile data object with defaults if not found.
 */
function getUserProfile() {
    const defaultProfile = { username: "Guest", email: "", phone: "", about: "", picture: null };
    try {
        const profileJson = localStorage.getItem(PROFILE_KEY);
        const savedProfile = profileJson ? JSON.parse(profileJson) : {};
        return { ...defaultProfile, ...savedProfile };
    } catch (error) {
        console.error("StorageManager: Error parsing profile data.", error);
        return defaultProfile;
    }
}

/**
 * Saves the user profile data object.
 * @param {object} profileData - Profile data object { username?, email?, phone?, about?, picture? }. Undefined fields are ignored.
 */
function saveUserProfile(profileData) {
    if (typeof profileData !== 'object' || profileData === null) {
        console.error("StorageManager: Invalid data passed to saveUserProfile.");
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
        console.log("StorageManager: Saved user profile data.", dataToSave);
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            alert("Could not save profile: Storage limit exceeded. Try a smaller image.");
        }
        console.error("StorageManager: Error saving profile data.", error);
    }
}

/**
 * Clears the user's profile data from localStorage.
 */
function clearUserProfile() {
    localStorage.removeItem(PROFILE_KEY);
    console.log("StorageManager: Cleared user profile data.");
}