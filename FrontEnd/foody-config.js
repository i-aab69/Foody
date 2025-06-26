// foody-config.js - Configuration for Foody AJAX modules

// Global configuration object
window.FoodyConfig = {
    // Backend API URL
    BACKEND_URL: 'http://127.0.0.1:8000',
    
    // Debug mode - set to false in production
    DEBUG: true,
    
    // Pagination settings
    ITEMS_PER_PAGE: 6,
    
    // Search debounce time (ms)
    SEARCH_DEBOUNCE: 300,
    
    // Notification display time (ms)
    NOTIFICATION_DURATION: 3000,
    
    // API endpoints
    ENDPOINTS: {
        RECIPES: '/recipes/',
        SEARCH: '/recipes/search/',
        FAVORITES: '/favorites/',
        FAVORITES_REMOVE: '/favorites/remove/',
        INGREDIENTS: '/ings/',
        TAGS: '/tag/'
    }
};

// Debug logging function
window.FoodyConfig.log = function(message, type = 'info') {
    if (this.DEBUG) {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`[${timestamp}] ${prefix} Foody: ${message}`);
    }
};

// Helper function to build API URLs
window.FoodyConfig.getApiUrl = function(endpoint) {
    return this.BACKEND_URL + this.ENDPOINTS[endpoint];
};

// Initialize message
if (window.FoodyConfig.DEBUG) {
    console.log('🚀 Foody configuration loaded');
    console.log('Backend URL:', window.FoodyConfig.BACKEND_URL);
} 