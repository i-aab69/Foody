// ajax-pagination.js - AJAX functionality for pagination and loading more items

// Shared configuration
if (!window.FoodyConfig) {
    window.FoodyConfig = {
        BACKEND_URL: 'http://127.0.0.1:8000'
    };
}

// AJAX Pagination Manager
class AJAXPaginationManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = window.FoodyConfig?.ITEMS_PER_PAGE || 6; // Show 6 recipes per page initially
        this.totalItems = 0;
        this.isLoading = false;
        this.hasMoreItems = true;
        this.currentFilters = {
            query: '',
            ingredients: '',
            tags: ''
        };
    }

    // Load more recipes
    async loadMoreRecipes() {
        if (this.isLoading || !this.hasMoreItems) {
            return;
        }

        this.isLoading = true;
        this.showLoadMoreButton(false);

        try {
            // Build query parameters with pagination
            const params = new URLSearchParams();
            params.append('page', this.currentPage + 1);
            params.append('limit', this.itemsPerPage);
            
            if (this.currentFilters.query) {
                params.append('q', this.currentFilters.query);
            }
            if (this.currentFilters.ingredients) {
                params.append('ingredients', this.currentFilters.ingredients);
            }
            if (this.currentFilters.tags) {
                params.append('tags', this.currentFilters.tags);
            }

            const response = await fetch(`${window.FoodyConfig.BACKEND_URL}/recipes/search/?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.recipes && result.recipes.length > 0) {
                this.appendRecipes(result.recipes);
                this.currentPage++;
                
                // Check if there are more items
                this.hasMoreItems = result.recipes.length === this.itemsPerPage;
            } else {
                this.hasMoreItems = false;
            }

            this.updateLoadMoreButton();
            
        } catch (error) {
            console.error('Error loading more recipes:', error);
            this.showLoadMoreError();
        } finally {
            this.isLoading = false;
        }
    }

    // Append new recipes to the container
    appendRecipes(recipes) {
        const container = document.getElementById('recipes-container');
        if (!container) {
            console.error('Recipes container not found');
            return;
        }

        recipes.forEach(recipe => {
            const card = this.createRecipeCard(recipe);
            container.appendChild(card);
        });

        // Initialize favorite buttons for new cards
        if (window.ajaxFavoritesManager) {
            window.ajaxFavoritesManager.initializeFavoriteButtons();
        }

        // Update total count
        this.updateRecipeCount();
    }

    // Create recipe card element
    createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card fade-in';
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

    // Reset pagination for new search
    resetPagination(filters = {}) {
        this.currentPage = 1;
        this.hasMoreItems = true;
        this.currentFilters = { ...filters };
        this.updateLoadMoreButton();
    }

    // Update recipe count display
    updateRecipeCount() {
        const container = document.getElementById('recipes-container');
        const countElement = document.getElementById('recipe-count');
        
        if (container && countElement) {
            const recipeCards = container.querySelectorAll('.recipe-card');
            countElement.textContent = recipeCards.length;
        }
    }

    // Show/hide load more button
    showLoadMoreButton(show = true) {
        const button = document.getElementById('load-more-btn');
        if (button) {
            button.style.display = show ? 'block' : 'none';
        }
    }

    // Update load more button state
    updateLoadMoreButton() {
        const button = document.getElementById('load-more-btn');
        if (!button) return;

        if (this.hasMoreItems) {
            button.textContent = 'Load More Recipes';
            button.disabled = false;
            button.style.display = 'block';
        } else {
            button.textContent = 'No More Recipes';
            button.disabled = true;
            // Hide button after showing "No more" message briefly
            setTimeout(() => {
                button.style.display = 'none';
            }, 2000);
        }
    }

    // Show load more error
    showLoadMoreError() {
        const button = document.getElementById('load-more-btn');
        if (button) {
            button.textContent = 'Error Loading More - Click to Retry';
            button.disabled = false;
        }
    }

    // Infinite scroll functionality
    setupInfiniteScroll() {
        let isNearBottom = false;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Trigger when user is 200px from bottom
            const triggerHeight = documentHeight - windowHeight - 200;
            
            if (scrollTop >= triggerHeight && !isNearBottom && !this.isLoading && this.hasMoreItems) {
                isNearBottom = true;
                this.loadMoreRecipes().then(() => {
                    // Reset the flag after a brief delay
                    setTimeout(() => {
                        isNearBottom = false;
                    }, 1000);
                });
            }
        });
    }

    // Initialize pagination functionality
    init() {
        // Add necessary CSS
        this.addPaginationStyles();

        // Create and append load more button if it doesn't exist
        this.createLoadMoreButton();

        // Setup infinite scroll (optional)
        // this.setupInfiniteScroll();

        // Setup load more button click handler
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreRecipes();
            });
        }
    }

    // Create load more button
    createLoadMoreButton() {
        if (document.getElementById('load-more-btn')) return;

        const container = document.getElementById('recipes-container');
        if (!container) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'load-more-container';
        buttonContainer.innerHTML = `
            <button id="load-more-btn" class="load-more-btn">
                Load More Recipes
            </button>
        `;

        // Insert after the recipes container
        container.parentNode.insertBefore(buttonContainer, container.nextSibling);
    }

    // Add necessary CSS styles
    addPaginationStyles() {
        if (document.querySelector('style[data-ajax-pagination-styles]')) return;

        const style = document.createElement('style');
        style.setAttribute('data-ajax-pagination-styles', 'true');
        style.textContent = `
            .load-more-container {
                text-align: center;
                margin: 30px 0;
            }
            
            .load-more-btn {
                background: #ff6b35;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 200px;
            }
            
            .load-more-btn:hover:not(:disabled) {
                background: #e55a2e;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
            }
            
            .load-more-btn:disabled {
                background: #ccc;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            
            .recipe-card.fade-in {
                animation: fadeInUp 0.5s ease-out;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
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
        `;
        document.head.appendChild(style);
    }

    // Load initial set of recipes
    async loadInitialRecipes() {
        try {
            const response = await fetch(`${window.FoodyConfig.BACKEND_URL}/recipes/search/?limit=${this.itemsPerPage}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.recipes && result.recipes.length > 0) {
                const container = document.getElementById('recipes-container');
                if (container) {
                    container.innerHTML = '';
                    this.appendRecipes(result.recipes);
                    this.hasMoreItems = result.recipes.length === this.itemsPerPage;
                    this.updateLoadMoreButton();
                }
            }
            
        } catch (error) {
            console.error('Error loading initial recipes:', error);
        }
    }
}

// Initialize AJAX Pagination Manager
const ajaxPaginationManager = new AJAXPaginationManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ajaxPaginationManager.init();
});

// Export for use in other modules
window.ajaxPaginationManager = ajaxPaginationManager; 