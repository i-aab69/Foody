// storageManager.js - Handles localStorage operations for favorites

// Key for storing favorites in localStorage
const FAVORITES_KEY = 'foody_favorites';

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
    let isFav = false ; 
    favorites.forEach(fav =>{
        if(fav.recipeId == recipeId.toString()){
            isFav = true ; 
        }})
    return isFav;
}

// Add a recipe to favorites
function addFavorite(recipeId) { 
    const favorites = getFavorites();
    if (!favorites.includes(recipeId.toString())) {
        const user = JSON.parse(localStorage.getItem("LoggedUser")) ; 
        favorites.push({"recipeId" : recipeId.toString() , "UserName" : user.UserName });
        saveFavorites(favorites);
    }
}

// Remove a recipe from favorites
function removeFavorite(recipeId) {
    const favorites = getFavorites();
    const index = favorites.findIndex(fav => fav.recipeId == recipeId.toString());
    if (index !== -1) {
        favorites.splice(index, 1);
        saveFavorites(favorites);
    }
}

// Get all favorite recipes
function getAllFavoriteRecipes() {
    const favorites = getFavorites();
    const allRecipes = JSON.parse(localStorage.getItem('all_res')) || [];

    const filerdRecipes = allRecipes.filter(recipe => 
        favorites.some(favorite => favorite.recipeId == recipe.name && favorite.UserName == JSON.parse(localStorage.getItem("LoggedUser")).UserName)
    );
    return filerdRecipes;
}

function getAllRecipes(){
    const allRecipes = JSON.parse(localStorage.getItem('all_res')) || [];
    return allRecipes ; 
}