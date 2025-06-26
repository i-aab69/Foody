// ajax.js - AJAX functionality for dynamic user interactions
const BASE_URL = 'http://127.0.0.1:8000';

/**
 * AJAX Favorites Management
 */
export const FavoritesAPI = {
    // Add recipe to favorites
    async add(recipeId) {
        const user = JSON.parse(localStorage.getItem("LoggedUser"));
        if (!user) {
            throw new Error('User not logged in');
        }

        try {
            const response = await fetch(`${BASE_URL}/favorites/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name: user.UserName,
                    recipe_id: parseInt(recipeId)
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log('Recipe added to favorites:', data);
                return { success: true, data };
            } else {
                throw new Error(data.error || 'Failed to add favorite');
            }
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    },

    // Remove recipe from favorites
    async remove(recipeId) {
        const user = JSON.parse(localStorage.getItem("LoggedUser"));
        if (!user) {
            throw new Error('User not logged in');
        }

        try {
            const response = await fetch(`${BASE_URL}/favorites/remove/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name: user.UserName,
                    recipe_id: parseInt(recipeId)
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log('Recipe removed from favorites:', data);
                return { success: true, data };
            } else {
                throw new Error(data.error || 'Failed to remove favorite');
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            throw error;
        }
    },

    // Get user's favorites
    async getUserFavorites() {
        const user = JSON.parse(localStorage.getItem("LoggedUser"));
        if (!user) {
            throw new Error('User not logged in');
        }

        try {
            const response = await fetch(`${BASE_URL}/favorites/?user_name=${encodeURIComponent(user.UserName)}`);
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, favorites: data.favorites };
            } else {
                throw new Error(data.error || 'Failed to get favorites');
            }
        } catch (error) {
            console.error('Error getting favorites:', error);
            throw error;
        }
    }
};

/**
 * AJAX Search Functionality
 */
export const SearchAPI = {
    // Search recipes with optional filters
    async searchRecipes(query = '', ingredients = '') {
        try {
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (ingredients) params.append('ingredients', ingredients);

            const response = await fetch(`${BASE_URL}/recipes/search/?${params.toString()}`);
            const data = await response.json();
            
            if (response.ok) {
                console.log(`Found ${data.count} recipes`);
                return { success: true, ...data };
            } else {
                throw new Error(data.error || 'Search failed');
            }
        } catch (error) {
            console.error('Error searching recipes:', error);
            throw error;
        }
    },

    // Live search with debounce
    debounceTimer: null,
    async liveSearch(query, callback, delay = 300) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(async () => {
            try {
                const results = await this.searchRecipes(query);
                callback(results);
            } catch (error) {
                callback({ success: false, error: error.message });
            }
        }, delay);
    }
};

/**
 * AJAX Recipe Management
 */
export const RecipeAPI = {
    // Delete recipe
    async delete(recipeId) {
        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipeId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log('Recipe deleted:', data);
                return { success: true, data };
            } else {
                throw new Error(data.error || 'Failed to delete recipe');
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
            throw error;
        }
    }
};

/**
 * Enhanced Favorites UI Management with AJAX
 */
export const FavoritesUI = {
    // Toggle favorite with AJAX
    async toggle(recipeId, buttonElement) {
        const isCurrentlyFavorite = buttonElement.textContent === '♥';
        
        // Show loading state
        const originalContent = buttonElement.innerHTML;
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        buttonElement.disabled = true;

        try {
            if (isCurrentlyFavorite) {
                await FavoritesAPI.remove(recipeId);
                this.updateButton(buttonElement, false);
            } else {
                await FavoritesAPI.add(recipeId);
                this.updateButton(buttonElement, true);
            }
        } catch (error) {
            // Restore original state on error
            buttonElement.innerHTML = originalContent;
            alert('Error updating favorites: ' + error.message);
        } finally {
            buttonElement.disabled = false;
        }
    },

    // Update button appearance
    updateButton(buttonElement, isFavorite) {
        if (isFavorite) {
            buttonElement.textContent = '♥';
            buttonElement.style.color = '#e74c3c';
            buttonElement.setAttribute('aria-label', 'Remove from favorites');
        } else {
            buttonElement.textContent = '♡';
            buttonElement.style.color = '#777';
            buttonElement.setAttribute('aria-label', 'Add to favorites');
        }
    },

    // Load and display user favorites count
    async updateFavoritesCount() {
        try {
            const result = await FavoritesAPI.getUserFavorites();
            const count = result.favorites.length;
            
            // Update any favorites count elements
            document.querySelectorAll('.favorites-count').forEach(el => {
                el.textContent = count;
            });
            
            return count;
        } catch (error) {
            console.error('Error updating favorites count:', error);
            return 0;
        }
    }
};

/**
 * Enhanced Search UI with AJAX
 */
export const SearchUI = {
    // Initialize search with AJAX
    initializeSearch(searchInputId, resultsContainerId) {
        const searchInput = document.getElementById(searchInputId);
        const resultsContainer = document.getElementById(resultsContainerId);
        
        if (!searchInput || !resultsContainer) {
            console.warn('Search elements not found');
            return;
        }

        // Live search on input
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                SearchAPI.liveSearch(query, (results) => {
                    if (results.success) {
                        this.displayResults(results.recipes, resultsContainer);
                        this.updateResultsCount(results.count);
                    } else {
                        console.error('Search error:', results.error);
                    }
                });
            } else if (query.length === 0) {
                // Clear results or show all recipes
                this.clearResults(resultsContainer);
            }
        });
    },

    // Display search results
    displayResults(recipes, container) {
        container.innerHTML = '';
        
        if (recipes.length === 0) {
            container.innerHTML = '<p class="no-results">No recipes found. Try different search terms.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const recipeCard = this.createRecipeCard(recipe);
            container.appendChild(recipeCard);
        });

        // Initialize favorite buttons for new results
        this.initializeFavoriteButtons(container);
    },

    // Create recipe card element
    createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.setAttribute('data-recipe-id', recipe.pk);

        card.innerHTML = `
            <img src="${recipe.img || 'source/default-recipe.png'}" alt="${recipe.name}" />
            <div class="recipe-info">
                <h3>${recipe.name}</h3>
                <p>${recipe.desc || 'Click for details'}</p>
            </div>
            <button class="favorite-btn" style="color: #777">♡</button>
        `;

        // Add click handler for recipe details
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('favorite-btn')) {
                window.location.href = `Discription_page.html?id=${recipe.pk}`;
            }
        });

        return card;
    },

    // Initialize favorite buttons in container
    initializeFavoriteButtons(container) {
        container.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const recipeId = e.target.closest('.recipe-card').getAttribute('data-recipe-id');
                await FavoritesUI.toggle(recipeId, e.target);
            });
        });
    },

    // Update results count display
    updateResultsCount(count) {
        const countElement = document.getElementById('recipe-count');
        if (countElement) {
            countElement.textContent = count;
        }
    },

    // Clear search results
    clearResults(container) {
        container.innerHTML = '<p>Start typing to search for recipes...</p>';
    }
}; 