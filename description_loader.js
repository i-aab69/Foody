document.addEventListener('DOMContentLoaded', () => {

    if (typeof isFavorite !== 'function' || typeof addFavorite !== 'function' || typeof removeFavorite !== 'function') {
       console.error("storageManager.js functions missing for description_loader.js!");
       alert("Error: Can't handle favorites properly. Try refreshing.");
       return;
    }

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
    
    // New elements for saving functionality
    const recipeImageInput = document.getElementById('recipe-image');
    const saveButton = document.getElementById('save-button') || document.createElement('button');
    const ingredientsInput = document.getElementById('ingredients-input') || document.createElement('textarea');

    function getRecipeIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function getRecipesFromLocalStorage() {
        // Get recipes from local storage (assuming they're stored in 'all_res')
        const recipes = JSON.parse(localStorage.getItem('all_res')) || [];
        
        // Convert array to object with IDs as keys for easier lookup
        const recipeData = {};
        recipes.forEach(recipe => {
            if (recipe && recipe.id) {
                recipeData[recipe.id] = recipe;
            }
        });
        
        return recipeData;
    }

    function saveRecipesToLocalStorage(recipesObject) {
        // Convert back to array
        const recipesArray = Object.values(recipesObject);
        localStorage.setItem('all_res', JSON.stringify(recipesArray));
    }

    function displayRecipeDetails(id) {
        const recipeData = getRecipesFromLocalStorage();
        const recipe = recipeData[id];

        if (loadingMessage) loadingMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';

        if (recipe && loadedArea) {
            if (pageTitle) pageTitle.textContent = `Foody - ${recipe.title}`;
            if (titleElement) titleElement.textContent = recipe.title;
            if (timeElement) timeElement.textContent = recipe.time || 'N/A';
            if (servingsElement) servingsElement.textContent = recipe.servings || 'N/A';

            if (imageElement) {
                imageElement.src = recipe.image || 'source/placeholder.png';
                imageElement.alt = recipe.title;
            }
            if (descriptionElement) {
                descriptionElement.textContent = recipe.description || 'No description available.';
            }

            if (ingredientsList) {
                ingredientsList.innerHTML = ''; 
                if (recipe.ingredients && recipe.ingredients.length > 0) {
                    recipe.ingredients.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        ingredientsList.appendChild(li);
                    });
                } else {
                    ingredientsList.innerHTML = '<li>Ingredients not listed.</li>';
                }
            }

            if (instructionsList) {
                instructionsList.innerHTML = ''; 
                if (recipe.instructions && recipe.instructions.length > 0) {
                    recipe.instructions.forEach(step => {
                        const li = document.createElement('li');
                        li.textContent = step;
                        instructionsList.appendChild(li);
                    });
                } else {
                    instructionsList.innerHTML = '<li>Instructions not listed.</li>';
                }
            }

            if (favoriteButton) {
                favoriteButton.dataset.recipeId = id;
                updateFavoriteButtonStateUI(id);
            }

            loadedArea.style.display = 'block';

        } else {
            if (errorMessage) {
                errorMessage.textContent = `Recipe with ID "${id}" not found.`;
                errorMessage.style.display = 'block';
            }
            if (loadedArea) loadedArea.style.display = 'none';
            if (pageTitle) pageTitle.textContent = `Foody - Recipe Not Found`;
        }
    }

    function updateFavoriteButtonStateUI(id) {
         if (!favoriteButton) return;
         const favState = isFavorite(id);
         const heartIcon = favoriteButton.querySelector('i');
         if (!heartIcon) return;

         favoriteButton.classList.toggle('is-favorite', favState);
         heartIcon.classList.toggle('fas', favState);
         heartIcon.classList.toggle('far', !favState);
         heartIcon.style.color = favState ? '#e74c3c' : '#666';
         favoriteButton.setAttribute('aria-label', favState ? 'Remove from favorites' : 'Add to favorites');
         favoriteButton.setAttribute('aria-pressed', favState ? 'true' : 'false');
    }

    function toggleFavoriteUI(id) {
         if (!favoriteButton) return;
         if (isFavorite(id)) {
             removeFavorite(id);
         } else {
             addFavorite(id);
         }
         updateFavoriteButtonStateUI(id);
    }
    
    // New function to handle image uploads
    function handleImageUpload(file, recipeId) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result); // Base64 encoded image
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }
    
    // New function to save recipe changes including image and ingredients
    async function saveRecipeChanges(recipeId) {
        try {
            const recipes = getRecipesFromLocalStorage();
            const recipe = recipes[recipeId];
            
            if (!recipe) {
                throw new Error(`Recipe with ID ${recipeId} not found`);
            }
            
            // Handle image upload if a file is selected
            if (recipeImageInput && recipeImageInput.files && recipeImageInput.files[0]) {
                const imageData = await handleImageUpload(recipeImageInput.files[0], recipeId);
                if (imageData) {
                    recipe.image = imageData;
                }
            }
            
            // Handle ingredients update if ingredients input exists
            if (ingredientsInput && ingredientsInput.value) {
                // Split by new line and filter out empty strings
                const ingredientsArray = ingredientsInput.value
                    .split('\n')
                    .map(item => item.trim())
                    .filter(item => item !== '');
                
                recipe.ingredients = ingredientsArray;
            }
            
            // Save updated recipe back to localStorage
            saveRecipesToLocalStorage(recipes);
            
            // Refresh display to show updated data
            displayRecipeDetails(recipeId);
            
            alert("Recipe saved successfully!");
        } catch (error) {
            console.error("Error saving recipe:", error);
            alert("Failed to save recipe. " + error.message);
        }
    }

    // For debugging - print all available recipes to console
    function printAvailableRecipes() {
        const recipes = JSON.parse(localStorage.getItem('all_res')) || [];
        console.log('Available recipes in local storage:', recipes);
        return recipes;
    }

    // Print available recipes to console for debugging
    const availableRecipes = printAvailableRecipes();
    console.log(`Found ${availableRecipes.length} recipes in local storage`);

    const recipeId = getRecipeIdFromUrl();

    if (recipeId) {
        displayRecipeDetails(recipeId);
        
        // Setup save button event listeners if it exists
        if (document.getElementById('save-button')) {
            document.getElementById('save-button').addEventListener('click', (e) => {
                e.preventDefault();
                saveRecipeChanges(recipeId);
            });
        }
    } else {
        if (loadingMessage) loadingMessage.style.display = 'none';
        if (errorMessage) {
             errorMessage.textContent = "No recipe ID provided in the URL.";
             errorMessage.style.display = 'block';
        }
        if (loadedArea) loadedArea.style.display = 'none';
        if (pageTitle) pageTitle.textContent = `Foody - Invalid Recipe`;
    }

    if (favoriteButton) {
        favoriteButton.addEventListener('click', () => {
            const id = favoriteButton.dataset.recipeId;
            if (id) {
                 toggleFavoriteUI(id);
            } else {
                console.error("Favorite button is missing its recipe ID!");
            }
        });
    }
});
