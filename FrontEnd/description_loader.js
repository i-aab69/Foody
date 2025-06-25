document.addEventListener('DOMContentLoaded', () => {
    
    const titleElement = document.getElementById('recipe-title-placeholder');
    const timeElement = document.getElementById('recipe-time-placeholder');
    const servingsElement = document.getElementById('recipe-servings-placeholder');
    const imageElement = document.getElementById('recipe-image-placeholder');
    const descriptionElement = document.getElementById('recipe-description-placeholder');
    const ingredientsList = document.getElementById('ingredients-list-placeholder');
    const instructionsList = document.getElementById('instructions-list-placeholder');
    const tagsContainer = document.getElementById('tags-container-placeholder');
    const favoriteButton = document.getElementById('favorite-button-placeholder');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const loadedArea = document.getElementById('recipe-loaded-area');
    const pageTitle = document.querySelector('title');

    // Show "No Image" text in the center when no valid image is available
    function showNoImageText(imageElement, imageContainer) {
        imageElement.style.display = 'none';
        imageElement.src = '';
        imageElement.alt = '';
        
        // Remove any existing "No Image" text first
        const existingNoImageText = imageContainer?.querySelector('.no-image-text');
        if (existingNoImageText) {
            existingNoImageText.remove();
        }
        
        // Keep the image container visible and add "No Image" text
        if (imageContainer) {
            imageContainer.style.display = 'flex';
            imageContainer.style.position = 'relative';
            
            // Add "No Image" text in the center
            const noImageText = document.createElement('div');
            noImageText.className = 'no-image-text';
            noImageText.textContent = 'No Image';
            noImageText.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.1);
                color: #666;
                padding: 20px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                border: 2px dashed #ccc;
                pointer-events: none;
                z-index: 10;
                text-align: center;
                width: 120px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            imageContainer.appendChild(noImageText);
        }
    }

    // Fetch ingredient names by IDs and display them
    async function fetchAndDisplayIngredients(ingredientIds, ingredientsList) {
        try {
            // Fetch all ingredients from the backend
            const response = await fetch('http://127.0.0.1:8000/ings/');
            const allIngredients = await response.json();
            
            // Convert Django serialized format to simple object array
            const ingredients = [];
            for (let index = 0; index < allIngredients.length; index++) {
                allIngredients[index]["fields"].pk = allIngredients[index]["pk"];
                ingredients.push(allIngredients[index]["fields"]);
            }
            
            // Find ingredient names that match the IDs in the recipe
            const matchedIngredients = ingredients.filter(ing => 
                ingredientIds.includes(ing.pk)
            );
            
            // Display the ingredient names
            if (matchedIngredients.length > 0) {
                matchedIngredients.forEach(ingredient => {
                    const li = document.createElement('li');
                    li.textContent = ingredient.name;
                    ingredientsList.appendChild(li);
                });
            } else {
                ingredientsList.innerHTML = '<li>Ingredients not found.</li>';
            }
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            ingredientsList.innerHTML = '<li>Error loading ingredients.</li>';
        }
    }

    // Fetch tag names by IDs and display them
    async function fetchAndDisplayTags(tagIds, tagsContainer) {
        try {
            // Fetch all tags from the backend
            const response = await fetch('http://127.0.0.1:8000/tag/');
            const allTags = await response.json();
            
            // Convert Django serialized format to simple object array
            const tags = [];
            for (let index = 0; index < allTags.length; index++) {
                allTags[index]["fields"].pk = allTags[index]["pk"];
                tags.push(allTags[index]["fields"]);
            }
            
            // Find tag names that match the IDs in the recipe
            const matchedTags = tags.filter(tag => 
                tagIds.includes(tag.pk)
            );
            
            // Display the tag names as pills
            if (matchedTags.length > 0) {
                matchedTags.forEach(tag => {
                    const tagPill = document.createElement('span');
                    tagPill.className = 'tag-pill';
                    tagPill.textContent = tag.name;
                    tagsContainer.appendChild(tagPill);
                });
            } else {
                const noTagsMessage = document.createElement('span');
                noTagsMessage.className = 'no-tags-message';
                noTagsMessage.textContent = 'No tags assigned.';
                tagsContainer.appendChild(noTagsMessage);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
            const errorMessage = document.createElement('span');
            errorMessage.className = 'no-tags-message';
            errorMessage.textContent = 'Error loading tags.';
            tagsContainer.appendChild(errorMessage);
        }
    }

    // Get the recipe ID from the URL
    function getRecipeIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    // Get a specific recipe from localStorage
    function getRecipeById(id) {
        // Get all recipes and find by database primary key (pk)
        const allRecipes = JSON.parse(localStorage.getItem('all_res')) || [];
        return allRecipes.find(recipe => recipe.id === parseInt(id) || recipe.pk === parseInt(id));
    }

    // Fetch a specific recipe from the API (for fresh data)
    async function fetchRecipeFromAPI(id) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/recipes/${id}`);
            if (!response.ok) {
                throw new Error(`Recipe not found: ${response.status}`);
            }
            
            const recipeData = await response.json();
            
            // Convert Django serialized format to simple object
            if (recipeData && recipeData.length > 0) {
                const recipe = recipeData[0];
                recipe.fields.pk = recipe.pk;
                return recipe.fields;
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching recipe from API:', error);
            return null;
        }
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

    // Update favorite button UI
    function updateFavoriteButtonUI(id) {
        if (favoriteButton && setupFavoritesIfAvailable()) {
            const isCurrentlyFavorite = isFavorite(id);
            const icon = favoriteButton.querySelector('i');
            
            if (isCurrentlyFavorite) {
                icon.className = 'fas fa-heart'; // filled heart
                favoriteButton.setAttribute('aria-pressed', 'true');
                favoriteButton.classList.add('favorited');
            } else {
                icon.className = 'far fa-heart'; // empty heart
                favoriteButton.setAttribute('aria-pressed', 'false');
                favoriteButton.classList.remove('favorited');
            }
        }
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
                const imageContainer = imageElement.parentElement;
                
                // Ensure the image container can handle overlays
                if (imageContainer) {
                    imageContainer.style.position = 'relative';
                    imageContainer.style.display = 'inline-block';
                }
                
                // Remove any existing "No Image" text
                const existingNoImageText = imageContainer?.querySelector('.no-image-text');
                if (existingNoImageText) {
                    existingNoImageText.remove();
                }
                
                // Debug: Log image data
                console.log('Recipe image data:', recipe.img ? recipe.img.substring(0, 50) + '...' : 'No image');
                console.log('Full recipe data:', recipe);
                
                // Check if recipe has a valid image
                const hasValidImage = recipe.img && 
                                    recipe.img.trim() !== '' && 
                                    recipe.img !== 'null' && 
                                    recipe.img !== 'undefined' &&
                                    (!recipe.img.startsWith('data:image/') || recipe.img.length > 50); // Valid base64 should be longer
                                    
                console.log('Has valid image:', hasValidImage);
                
                if (hasValidImage) {
                    // Recipe has a valid image
                    imageElement.src = recipe.img;
                    imageElement.alt = recipe.name;
                    imageElement.style.display = 'block';
                    
                    // Make sure the image container is visible and properly positioned
                    if (imageContainer) {
                        imageContainer.style.display = 'flex';
                        imageContainer.style.position = 'relative';
                        
                        // Remove any existing "No Image" text
                        const existingNoImageText = imageContainer.querySelector('.no-image-text');
                        if (existingNoImageText) {
                            existingNoImageText.remove();
                        }
                    }
                    
                    // Add error handler in case the image fails to load
                    imageElement.onerror = function() {
                        // Image failed to load, show "No Image" text
                        showNoImageText(imageElement, imageContainer);
                    };
                    
                    // Clear any previous error handler when image loads successfully
                    imageElement.onload = function() {
                        const noImageText = imageContainer?.querySelector('.no-image-text');
                        if (noImageText) {
                            noImageText.remove();
                        }
                    };
                } else {
                    // No image available - show "No Image" text
                    showNoImageText(imageElement, imageContainer);
                }
            }

            // Set recipe description
            if (descriptionElement) {
                descriptionElement.textContent = recipe.description || recipe.instructions || 'No description available.';
            }

            // Parse and display tags
            if (tagsContainer) {
                tagsContainer.innerHTML = '';
                
                // Handle different formats of tags
                if (recipe.tags && Array.isArray(recipe.tags)) {
                    // If tags contains IDs, fetch tag names
                    fetchAndDisplayTags(recipe.tags, tagsContainer);
                } else {
                    const noTagsMessage = document.createElement('span');
                    noTagsMessage.className = 'no-tags-message';
                    noTagsMessage.textContent = 'No tags assigned.';
                    tagsContainer.appendChild(noTagsMessage);
                }
            }

            // Parse and display ingredients
            if (ingredientsList) {
                ingredientsList.innerHTML = '';
                
                // Handle different formats of ingredients
                if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                    // If ingredients contains IDs, fetch ingredient names
                    fetchAndDisplayIngredients(recipe.ingredients, ingredientsList);
                } else if (recipe.ings && recipe.ings > 0) {
                    // If only count is available, show generic placeholders
                    const placeholderIngredients = [];
                    for (let i = 0; i < recipe.ings; i++) {
                        placeholderIngredients.push(`Ingredient ${i+1}`);
                    }
                    placeholderIngredients.forEach(item => {
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
                
                // Only set up favorites if the system is available
                if (setupFavoritesIfAvailable()) {
                    updateFavoriteButtonUI(id);
                    
                    // Add click event listener for favorite button
                    favoriteButton.addEventListener('click', function() {
                        toggleFavorite(id);
                    });
                } else {
                    // If favorites system not available, just show empty heart
                    const icon = favoriteButton.querySelector('i');
                    if (icon) icon.className = 'far fa-heart';
                }
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
        // Check if we should force refresh from API
        const params = new URLSearchParams(window.location.search);
        const forceRefresh = params.get('refresh') === 'true';
        
        // First try to get from localStorage (unless forcing refresh)
        let recipe = forceRefresh ? null : getRecipeById(recipeId);
        
        if (recipe && !forceRefresh) {
            displayRecipeDetails(recipe, recipeId);
        } else {
            // If not found in localStorage or forcing refresh, try fetching from API
            const reason = forceRefresh ? 'forcing refresh' : 'not found in localStorage';
            console.log(`Recipe ${reason}, fetching from API...`);
            
            fetchRecipeFromAPI(recipeId).then(apiRecipe => {
                if (apiRecipe) {
                    displayRecipeDetails(apiRecipe, recipeId);
                } else {
                    if (loadingMessage) loadingMessage.style.display = 'none';
                    if (errorMessage) {
                        errorMessage.textContent = `Recipe with ID "${recipeId}" not found.`;
                        errorMessage.style.display = 'block';
                    }
                    if (loadedArea) loadedArea.style.display = 'none';
                }
            }).catch(error => {
                console.error('Error fetching recipe:', error);
                if (loadingMessage) loadingMessage.style.display = 'none';
                if (errorMessage) {
                    errorMessage.textContent = `Error loading recipe with ID "${recipeId}".`;
                    errorMessage.style.display = 'block';
                }
                if (loadedArea) loadedArea.style.display = 'none';
            });
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