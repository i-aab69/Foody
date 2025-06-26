// ajax-search.js - AJAX functionality for search and filtering

// Shared configuration
if (!window.FoodyConfig) {
    window.FoodyConfig = {
        BACKEND_URL: 'http://127.0.0.1:8000'
    };
}

// AJAX Search Manager
class AJAXSearchManager {
    constructor() {
        this.searchCache = new Map();
        this.debounceTimeout = null;
        this.currentAbortController = null;
    }

    // Debounced search function
    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Search recipes via AJAX
    async searchRecipes(query = '', ingredients = '', tags = '') {
        // Create cache key
        const cacheKey = `${query}_${ingredients}_${tags}`;
        
        // Check cache first
        if (this.searchCache.has(cacheKey)) {
            return this.searchCache.get(cacheKey);
        }

        // Cancel previous request if still pending
        if (this.currentAbortController) {
            this.currentAbortController.abort();
        }

        // Create new abort controller for this request
        this.currentAbortController = new AbortController();

        try {
            // Build query parameters
            const params = new URLSearchParams();
            if (query.trim()) params.append('q', query.trim());
            if (ingredients.trim()) params.append('ingredients', ingredients.trim());
            if (tags.trim()) params.append('tags', tags.trim());

            const response = await fetch(`${window.FoodyConfig.BACKEND_URL}/recipes/search/?${params.toString()}`, {
                signal: this.currentAbortController.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Cache the result
            this.searchCache.set(cacheKey, result);
            
            return result;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Search request was cancelled');
                return null;
            }
            console.error('Error searching recipes:', error);
            throw error;
        } finally {
            this.currentAbortController = null;
        }
    }

    // Display search results
    displaySearchResults(results, containerId = 'recipes-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Search results container not found');
            return;
        }

        // Show loading state initially
        container.innerHTML = '<div class="loading">Searching...</div>';

        if (!results || !results.recipes) {
            container.innerHTML = '<p>No recipes found. Try different search terms.</p>';
            return;
        }

        const recipes = results.recipes;
        
        // Update recipe count if element exists
        const countElement = document.getElementById('recipe-count');
        if (countElement) {
            countElement.textContent = recipes.length;
        }

        if (recipes.length === 0) {
            container.innerHTML = '<p>No recipes found. Try different search terms.</p>';
            return;
        }

        // Clear container
        container.innerHTML = '';

        // Create recipe cards
        recipes.forEach(recipe => {
            const card = this.createRecipeCard(recipe);
            container.appendChild(card);
        });

        // Initialize favorite buttons for new cards
        if (window.ajaxFavoritesManager) {
            window.ajaxFavoritesManager.initializeFavoriteButtons();
        }
    }

    // Create recipe card element
    createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.setAttribute('data-recipe-id', recipe.pk);

        // Handle image path
        let imageSrc = recipe.img || 'source/gray_image.png';
        if (imageSrc && !imageSrc.startsWith('source/') && !imageSrc.startsWith('data:')) {
            imageSrc = `source/${imageSrc}`;
        }

        card.innerHTML = `
            <img src="${imageSrc}" alt="${recipe.name}" onerror="this.src='source/gray_image.png';" />
            <div class="recipe-info">
                <h3>${recipe.name}</h3>
                <p>${recipe.desc || 'Click for details'}</p>
                ${this.createTagsHTML(recipe.tags)}
            </div>
            <button class="favorite-btn" style="color: #777">♡</button>
        `;

        // Add click handler for recipe details
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                window.location.href = `Discription_page.html?id=${recipe.pk}`;
            }
        });

        return card;
    }

    // Create tags HTML
    createTagsHTML(tags) {
        if (!tags || tags.length === 0) return '';
        
        const tagsHTML = tags.slice(0, 3).map(tag => 
            `<span class="recipe-tag">${tag}</span>`
        ).join(' ');
        
        return `<div class="recipe-tags">${tagsHTML}</div>`;
    }

    // Live search functionality
    setupLiveSearch(searchInputId, containerId) {
        const searchInput = document.getElementById(searchInputId);
        if (!searchInput) return;

        const debouncedSearch = this.debounce(async (query) => {
            if (query.length < 2 && query.length > 0) {
                return; // Don't search for very short queries
            }

            try {
                this.showSearchLoading(containerId);
                const results = await this.searchRecipes(query);
                if (results) {
                    this.displaySearchResults(results, containerId);
                }
            } catch (error) {
                console.error('Live search error:', error);
                this.showSearchError(containerId);
            }
        }, window.FoodyConfig?.SEARCH_DEBOUNCE || 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }

    // Filter by ingredients
    async filterByIngredients(ingredients) {
        try {
            this.showSearchLoading();
            const results = await this.searchRecipes('', ingredients.join(','));
            this.displaySearchResults(results);
            return results;
        } catch (error) {
            console.error('Error filtering by ingredients:', error);
            this.showSearchError();
        }
    }

    // Filter by tags
    async filterByTags(tags) {
        try {
            this.showSearchLoading();
            const results = await this.searchRecipes('', '', tags.join(','));
            this.displaySearchResults(results);
            return results;
        } catch (error) {
            console.error('Error filtering by tags:', error);
            this.showSearchError();
        }
    }

    // Combined search with multiple filters
    async performAdvancedSearch(query, ingredients, tags) {
        try {
            this.showSearchLoading();
            const ingredientsStr = Array.isArray(ingredients) ? ingredients.join(',') : ingredients;
            const tagsStr = Array.isArray(tags) ? tags.join(',') : tags;
            
            const results = await this.searchRecipes(query, ingredientsStr, tagsStr);
            this.displaySearchResults(results);
            return results;
        } catch (error) {
            console.error('Error performing advanced search:', error);
            this.showSearchError();
        }
    }

    // Show loading state
    showSearchLoading(containerId = 'recipes-container') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="search-loading">
                    <div class="spinner"></div>
                    <p>Searching recipes...</p>
                </div>
            `;
        }
    }

    // Show error state
    showSearchError(containerId = 'recipes-container') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="search-error">
                    <p>Error loading recipes. Please try again.</p>
                    <button onclick="location.reload()">Refresh Page</button>
                </div>
            `;
        }
    }

    // Clear search cache
    clearCache() {
        this.searchCache.clear();
    }

    // Get search suggestions (you can implement this based on your needs)
    async getSearchSuggestions(query) {
        // This could call a dedicated suggestions endpoint
        // For now, return empty array
        return [];
    }

    // Initialize search functionality
    init() {
        // Add CSS for loading and error states
        this.addSearchStyles();

        // Setup live search if search input exists
        const searchInput = document.getElementById('recipe-search');
        if (searchInput) {
            this.setupLiveSearch('recipe-search', 'recipes-container');
        }

        // Setup ingredient filter functionality
        this.setupIngredientFilter();

        // Setup tag filter functionality  
        this.setupTagFilter();
    }

    // Add necessary CSS styles
    addSearchStyles() {
        if (document.querySelector('style[data-ajax-search-styles]')) return;

        const style = document.createElement('style');
        style.setAttribute('data-ajax-search-styles', 'true');
        style.textContent = `
            .search-loading, .search-error {
                text-align: center;
                padding: 40px 20px;
                color: #666;
            }
            
            .spinner {
                border: 3px solid #f3f3f3;
                border-top: 3px solid #ff6b35;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .recipe-tags {
                margin-top: 8px;
            }
            
            .recipe-tag {
                background: #ff6b35;
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.8em;
                margin-right: 4px;
            }
            
            .search-error button {
                background: #ff6b35;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    // Setup ingredient filter
    setupIngredientFilter() {
        const ingredientContainer = document.querySelector('.ingredient-tags');
        if (!ingredientContainer) return;

        // Watch for changes in ingredient tags
        const observer = new MutationObserver(() => {
            const ingredients = Array.from(document.querySelectorAll('.ingredient-tags .pill-white'))
                .map(tag => tag.textContent.replace(/\s*×\s*$/, '').trim());
            
            if (ingredients.length > 0) {
                this.filterByIngredients(ingredients);
            }
        });

        observer.observe(ingredientContainer, { childList: true });
    }

    // Setup tag filter  
    setupTagFilter() {
        const tagButtons = document.querySelectorAll('.filter-tag');
        tagButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tag = button.textContent.trim();
                this.filterByTags([tag]);
            });
        });
    }
}

// Initialize AJAX Search Manager
const ajaxSearchManager = new AJAXSearchManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ajaxSearchManager.init();
});

// Export for use in other modules
window.ajaxSearchManager = ajaxSearchManager; 