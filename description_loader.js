document.addEventListener('DOMContentLoaded', () => {
    
    const titleElement = document.getElementById('recipe-title-placeholder');
    const timeElement = document.getElementById('recipe-time-placeholder');
    const servingsElement = document.getElementById('recipe-servings-placeholder');
    const imageElement = document.getElementById('recipe-image-placeholder');
    const descriptionElement = document.getElementById('recipe-description-placeholder');
    const ingredientsList = document.getElementById('ingredients-list-placeholder');
    const instructionsList = document.getElementById('instructions-list-placeholder');
    const favoriteButton = document.getElementById('favorite-button-placeholder');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const loadedArea = document.getElementById('recipe-loaded-area');
    const pageTitle = document.querySelector('title');

    // Get the recipe ID from the URL
    function getRecipeIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    // Get a specific recipe from localStorage
    function getRecipeById(id) {
        // First try to get it directly
        const recipeJSON = localStorage.getItem(`recipe${id}`);
        if (recipeJSON) {
            return JSON.parse(recipeJSON);
        }
        
        // If not found directly, try to find it in the all_res array
        const allRecipes = JSON.parse(localStorage.getItem('all_res')) || [];
        return allRecipes.find(recipe => recipe.id === id || recipe.id === parseInt(id));
    }

    // Handle favorites functionality if storageManager.js is loaded
    function setupFavoritesIfAvailable() {
        if (typeof isFavorite === 'function' && 
            typeof addFavorite === 'function' && 
            typeof removeFavorite === 'function') {
            
            return true;
        }
        return false;
    }

   

    // Toggle favorite status
    function toggleFavorite(id) {
        if (setupFavoritesIfAvailable()) {
            if (isFavorite(id)) {
                removeFavorite(id);
            } else {
                addFavorite(id);
            }
            updateFavoriteButtonUI(id);
        }
    }

    // Display recipe details on the page
    function displayRecipeDetails(recipe, id) {
        if (loadingMessage) loadingMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';

        if (recipe && loadedArea) {
            // Update page title and recipe name
            if (pageTitle) pageTitle.textContent = `Foody - ${recipe.name}`;
            if (titleElement) titleElement.textContent = recipe.name;
            
            // Set cooking time and servings (using defaults if not provided)
            if (timeElement) timeElement.textContent = recipe.time || '30 mins';
            if (servingsElement) servingsElement.textContent = recipe.servings || '2 servings';

            // Set recipe image if available
            if (imageElement) {
                imageElement.src = recipe.image || 'source/placeholder.png';
                imageElement.alt = recipe.name;
            }

            // Set recipe description
            if (descriptionElement) {
                descriptionElement.textContent = recipe.description || recipe.instructions || 'No description available.';
            }

            // Parse and display ingredients
            if (ingredientsList) {
                ingredientsList.innerHTML = '';
                
                // Handle different formats of ingredients
                let ingredients = [];
                
                if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                    ingredients = recipe.ingredients;
                } else if (recipe.ings && recipe.ings > 0) {
                    // If only count is available, show generic placeholders
                    for (let i = 0; i < recipe.ings; i++) {
                        ingredients.push(`Ingredient ${i+1}`);
                    }
                }
                
                if (ingredients.length > 0) {
                    ingredients.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        ingredientsList.appendChild(li);
                    });
                } else {
                    ingredientsList.innerHTML = '<li>Ingredients not listed.</li>';
                }
            }

            // Parse and display instructions
            if (instructionsList) {
                instructionsList.innerHTML = '';
                
                if (recipe.instructions) {
                    // If instructions is a string, split by newlines or periods
                    let instructions = [];
                    
                    if (typeof recipe.instructions === 'string') {
                        if (recipe.instructions.includes('\n')) {
                            instructions = recipe.instructions.split('\n')
                                .map(step => step.trim())
                                .filter(step => step.length > 0);
                        } else if (recipe.instructions.includes('.')) {
                            instructions = recipe.instructions.split('.')
                                .map(step => step.trim())
                                .filter(step => step.length > 0);
                        } else {
                            instructions = [recipe.instructions];
                        }
                    } else if (Array.isArray(recipe.instructions)) {
                        instructions = recipe.instructions;
                    }
                    
                    instructions.forEach(step => {
                        const li = document.createElement('li');
                        li.textContent = step;
                        instructionsList.appendChild(li);
                    });
                } else {
                    instructionsList.innerHTML = '<li>Instructions not provided.</li>';
                }
            }

            // Set up favorite button
            if (favoriteButton) {
                favoriteButton.dataset.recipeId = id;
                updateFavoriteButtonUI(id);
                
                // Add click event listener for favorite button
                favoriteButton.addEventListener('click', function() {
                    toggleFavorite(id);
                });
            }

            // Show the recipe content
            loadedArea.style.display = 'block';
        } else {
            // Display error if recipe not found
            if (errorMessage) {
                errorMessage.textContent = `Recipe with ID "${id}" not found.`;
                errorMessage.style.display = 'block';
            }
            if (loadedArea) loadedArea.style.display = 'none';
            if (pageTitle) pageTitle.textContent = 'Foody - Recipe Not Found';
        }
    }

    // Get and display the recipe
    const recipeId = getRecipeIdFromUrl();
    if (recipeId) {
        const recipe = getRecipeById(recipeId);
        if (recipe) {
            displayRecipeDetails(recipe, recipeId);
        } else {
            if (loadingMessage) loadingMessage.style.display = 'none';
            if (errorMessage) {
                errorMessage.textContent = `Recipe with ID "${recipeId}" not found.`;
                errorMessage.style.display = 'block';
            }
            if (loadedArea) loadedArea.style.display = 'none';
        }
    } else {
        if (loadingMessage) loadingMessage.style.display = 'none';
        if (errorMessage) {
            errorMessage.textContent = 'No recipe ID provided in the URL.';
            errorMessage.style.display = 'block';
        }
        if (loadedArea) loadedArea.style.display = 'none';
    }
});