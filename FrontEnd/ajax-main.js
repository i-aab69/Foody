// ajax-main.js - Main AJAX integration module

// Shared configuration
if (!window.FoodyConfig) {
    window.FoodyConfig = {
        BACKEND_URL: 'http://127.0.0.1:8000'
    };
}

// Main AJAX Coordinator
class AJAXMainCoordinator {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.isInitialized = false;
    }

    // Get current user (basic implementation - you might want to enhance this)
    getCurrentUser() {
        let user = localStorage.getItem('current_user');
        if (!user) {
            // Generate a simple guest user ID
            user = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('current_user', user);
        }
        return user;
    }

    // Initialize all AJAX modules
    async init() {
        if (this.isInitialized) return;

        try {
            console.log('Initializing AJAX functionality...');

            // Initialize managers if they exist
            if (window.ajaxFavoritesManager) {
                await window.ajaxFavoritesManager.initializeFavoriteButtons();
                console.log('✓ Favorites AJAX initialized');
            }

            if (window.ajaxSearchManager) {
                // No additional initialization needed for search
                console.log('✓ Search AJAX initialized');
            }

            if (window.ajaxPaginationManager) {
                // Check if we're on a page that should load initial recipes
                if (this.shouldLoadInitialRecipes()) {
                    await window.ajaxPaginationManager.loadInitialRecipes();
                }
                console.log('✓ Pagination AJAX initialized');
            }

            // Setup coordinated search functionality
            this.setupCoordinatedSearch();

            this.isInitialized = true;
            console.log('✓ All AJAX functionality initialized');

        } catch (error) {
            console.error('Error initializing AJAX functionality:', error);
        }
    }

    // Check if current page should load initial recipes
    shouldLoadInitialRecipes() {
        const currentPage = window.location.pathname;
        return currentPage.includes('search.html') || 
               currentPage.includes('home.html') || 
               currentPage.includes('list.html');
    }

    // Setup coordinated search that works across all managers
    setupCoordinatedSearch() {
        // Enhanced search functionality that coordinates between search and pagination
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.getElementById('recipe-search');
        const advancedSearchBtn = document.querySelector('.search-btn');

        if (searchInput && window.ajaxSearchManager && window.ajaxPaginationManager) {
            
            // Override the search manager's display function to work with pagination
            const originalSearch = window.ajaxSearchManager.searchRecipes;
            window.ajaxSearchManager.searchRecipes = async (query, ingredients, tags) => {
                // Reset pagination when new search is performed
                window.ajaxPaginationManager.resetPagination({
                    query: query || '',
                    ingredients: ingredients || '',
                    tags: tags || ''
                });

                // Perform the search
                const result = await originalSearch.call(window.ajaxSearchManager, query, ingredients, tags);
                
                // Update pagination state
                if (result && result.has_more !== undefined) {
                    window.ajaxPaginationManager.hasMoreItems = result.has_more;
                    window.ajaxPaginationManager.currentPage = result.page || 1;
                }

                return result;
            };

            console.log('✓ Coordinated search functionality setup');
        }

        // Setup advanced search coordination
        this.setupAdvancedSearchCoordination();
    }

    // Setup advanced search coordination with ingredient tags
    setupAdvancedSearchCoordination() {
        const advancedSearchBtn = document.querySelector('.search-btn');
        const ingredientTags = document.querySelector('.ingredient-tags');

        if (advancedSearchBtn) {
            advancedSearchBtn.addEventListener('click', () => {
                this.performCoordinatedSearch();
            });
        }

        // Watch for Enter key in search input
        const searchInput = document.getElementById('recipe-search');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performCoordinatedSearch();
                }
            });
        }
    }

    // Perform coordinated search across all systems
    async performCoordinatedSearch() {
        const searchInput = document.getElementById('recipe-search');
        const query = searchInput ? searchInput.value.trim() : '';

        // Get selected ingredients from tags
        const ingredientTags = Array.from(document.querySelectorAll('.ingredient-tags .pill-white'))
            .map(tag => tag.textContent.replace(/\s*×\s*$/, '').trim());

        // Get selected category/tags (if any filter buttons are active)
        const activeTags = Array.from(document.querySelectorAll('.filter-tag.active'))
            .map(tag => tag.textContent.trim());

        console.log('Performing coordinated search:', { query, ingredientTags, activeTags });

        if (window.ajaxSearchManager) {
            try {
                await window.ajaxSearchManager.performAdvancedSearch(
                    query,
                    ingredientTags.join(','),
                    activeTags.join(',')
                );
            } catch (error) {
                console.error('Error in coordinated search:', error);
            }
        }
    }

    // Enhanced error handling
    setupGlobalErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.message && event.reason.message.includes('fetch')) {
                console.error('Network error in AJAX operation:', event.reason);
                this.showGlobalNotification('Network error. Please check your connection.', 'error');
                event.preventDefault();
            }
        });
    }

    // Global notification system
    showGlobalNotification(message, type = 'info') {
        // Use the favorites manager's notification system if available
        if (window.ajaxFavoritesManager && window.ajaxFavoritesManager.showNotification) {
            window.ajaxFavoritesManager.showNotification(message, type);
        } else {
            // Fallback simple notification
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Refresh all data (useful for testing)
    async refreshAllData() {
        try {
            // Clear caches
            if (window.ajaxSearchManager) {
                window.ajaxSearchManager.clearCache();
            }

            // Reload favorites
            if (window.ajaxFavoritesManager) {
                await window.ajaxFavoritesManager.initializeFavoriteButtons();
            }

            // Reload initial recipes if on appropriate page
            if (window.ajaxPaginationManager && this.shouldLoadInitialRecipes()) {
                await window.ajaxPaginationManager.loadInitialRecipes();
            }

            this.showGlobalNotification('Data refreshed successfully!', 'success');
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.showGlobalNotification('Error refreshing data', 'error');
        }
    }

    // Utility function to check backend connection
    async checkBackendConnection() {
        try {
            const response = await fetch(`${window.FoodyConfig.BACKEND_URL}/recipes/`, {
                method: 'HEAD'
            });
            return response.ok;
        } catch (error) {
            console.error('Backend connection check failed:', error);
            return false;
        }
    }

    // Initialize and check backend connection
    async initWithConnectionCheck() {
        const isConnected = await this.checkBackendConnection();
        
        if (!isConnected) {
            this.showGlobalNotification('Cannot connect to server. Some features may not work.', 'error');
            console.warn('Backend connection failed. AJAX features may not work properly.');
        }

        await this.init();
    }
}

// Create and initialize the main coordinator
const ajaxMainCoordinator = new AJAXMainCoordinator();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other scripts are loaded
    setTimeout(() => {
        ajaxMainCoordinator.initWithConnectionCheck();
    }, 100);
});

// Export for debugging and manual operations
window.ajaxMainCoordinator = ajaxMainCoordinator;

// Global refresh function for testing
window.refreshAjaxData = () => ajaxMainCoordinator.refreshAllData(); 