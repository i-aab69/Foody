// storageManager.js - Complete implementation with profile management

// Constants for localStorage keys
const FAVORITES_KEY = 'foody_favorites';
const USER_PROFILE_KEY = 'user_profile';
const LOGGED_USER_KEY = 'LoggedUser';

// --- User Authentication Functions ---

// Get the currently logged in user
function getLoggedInUser() {
    const userJson = localStorage.getItem(LOGGED_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

// Get user role (Admin or User)
function getUserRole() {
    const user = getLoggedInUser();
    return user ? user.Role || 'User' : null;
}

// Clear user role (logout)
function clearUserRole() {
    localStorage.removeItem(LOGGED_USER_KEY);
}

// --- User Profile Functions ---

// Get user profile from localStorage
function getUserProfile() {
    const user = getLoggedInUser();
    if (!user) return null;
    
    // Try to get existing profile data
    const profileJson = localStorage.getItem(USER_PROFILE_KEY);
    let profiles = profileJson ? JSON.parse(profileJson) : {};
    
    // Find the profile for this username
    const username = user.UserName;
    
    // If no profile exists for this user, create default profile
    if (!profiles[username]) {
        profiles[username] = {
            username: username,
            email: '',
            phone: '',
            about: '',
            picture: 'source/placeholder_profile.png'
        };
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profiles));
    }
    
    return profiles[username];
}

// Save user profile to localStorage
function saveUserProfile(updatedData) {
    const user = getLoggedInUser();
    if (!user) return false;
    
    const username = user.UserName;
    const profileJson = localStorage.getItem(USER_PROFILE_KEY);
    let profiles = profileJson ? JSON.parse(profileJson) : {};
    
    // Get existing profile or create a new one
    let profile = profiles[username] || {
        username: username,
        email: '',
        phone: '',
        about: '',
        picture: 'source/placeholder_profile.png'
    };
    
    // Update with new data
    profile = { ...profile, ...updatedData };
    
    // Save back to localStorage
    profiles[username] = profile;
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profiles));
    
    return true;
}

// Clear user profile (for logout or account deletion)
function clearUserProfile() {
    const user = getLoggedInUser();
    if (!user) return;
    
    const username = user.UserName;
    const profileJson = localStorage.getItem(USER_PROFILE_KEY);
    if (!profileJson) return;
    
    let profiles = JSON.parse(profileJson);
    if (profiles[username]) {
        delete profiles[username];
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profiles));
    }
}
function saveSignUpProfile({ username, email, phone = '', about = '', picture = 'source/placeholder_profile.png' }) {
    const profileJson = localStorage.getItem(USER_PROFILE_KEY);
    let profiles = profileJson ? JSON.parse(profileJson) : {};

    profiles[username] = {
        username,
        email,
        phone,
        about,
        picture 
    };

    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profiles));
}
// --- Favorites Functions ---

// Get favorites from localStorage
function getFavorites() {
    const favoritesJson = localStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
}

// Save favorites to localStorage
function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Check if a recipe is in favorites
function isFavorite(recipeId) {
    const favorites = getFavorites();
    let isFav = false;
    favorites.forEach(fav => {
        if (fav.recipeId == recipeId.toString()) {
            isFav = true;
        }
    });
    return isFav;
}

// Add a recipe to favorites
function addFavorite(recipeId) {
    const favorites = getFavorites();
    const user = getLoggedInUser();
    if (!user) return;
    
    // Check if already exists
    const existingIndex = favorites.findIndex(fav => 
        fav.recipeId === recipeId.toString() && fav.UserName === user.UserName
    );
    
    if (existingIndex === -1) {
        favorites.push({
            "recipeId": recipeId.toString(),
            "UserName": user.UserName
        });
        saveFavorites(favorites);
    }
}

// Remove a recipe from favorites
function removeFavorite(recipeId) {
    const favorites = getFavorites();
    const user = getLoggedInUser();
    if (!user) return;
    
    const index = favorites.findIndex(fav => 
        fav.recipeId === recipeId.toString() && fav.UserName === user.UserName
    );
    
    if (index !== -1) {
        favorites.splice(index, 1);
        saveFavorites(favorites);
    }
}

// Get all favorite recipes for the current user
function getAllFavoriteRecipes() {
    const favorites = getFavorites();
    const user = getLoggedInUser();
    const allRecipes = JSON.parse(localStorage.getItem('all_res')) || [];
    
    if (!user) return [];
    
    // Get favorites for this user
    const userFavoriteIds = favorites
        .filter(fav => fav.UserName === user.UserName)
        .map(fav => fav.recipeId);
    
    // Return recipes that match the favorite IDs
    return allRecipes.filter(recipe => 
        userFavoriteIds.includes(recipe.id.toString())
    );
}

// Get all recipes
function getAllRecipes() {
    const allRecipes = JSON.parse(localStorage.getItem('all_res')) || [];
    return allRecipes;
}