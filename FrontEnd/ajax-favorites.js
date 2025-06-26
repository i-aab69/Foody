// ajax-favorites.js - AJAX functionality for favorites

// Shared configuration
if (!window.FoodyConfig) {
    window.FoodyConfig = {
        BACKEND_URL: 'http://127.0.0.1:8000'
    };
}

// AJAX Favorites Manager
class AJAXFavoritesManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
    }

    // Get current user (you might want to implement proper authentication)
    getCurrentUser() {
        return localStorage.getItem('current_user') || 'guest_user';
    }

    // Add recipe to favorites via AJAX
    async addToFavorites(recipeId) {
        try {
            const response = await fetch(`${window.FoodyConfig.BACKEND_URL}/favorites/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name: this.currentUser,
                    recipe_id: parseInt(recipeId)
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                console.log('Added to favorites:', result);
                this.updateFavoriteButton(recipeId, true);
                this.showNotification('Added to favorites!', 'success');
                return true;
            } else {
                console.error('Error adding to favorites:', result);
                this.showNotification('Failed to add to favorites', 'error');
                return false;
            }
        } catch (error) {
            console.error('Network error adding to favorites:', error);
            this.showNotification('Network error. Please try again.', 'error');
            return false;
        }
    }

    // Remove recipe from favorites via AJAX
    async removeFromFavorites(recipeId) {
        try {
            const response = await fetch(`${window.FoodyConfig.BACKEND_URL}/favorites/remove/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name: this.currentUser,
                    recipe_id: parseInt(recipeId)
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                console.log('Removed from favorites:', result);
                this.updateFavoriteButton(recipeId, false);
                this.showNotification('Removed from favorites!', 'success');
                return true;
            } else {
                console.error('Error removing from favorites:', result);
                this.showNotification('Failed to remove from favorites', 'error');
                return false;
            }
        } catch (error) {
            console.error('Network error removing from favorites:', error);
            this.showNotification('Network error. Please try again.', 'error');
            return false;
        }
    }

    // Get user's favorites via AJAX
    async getUserFavorites() {
        try {
            const response = await fetch(`${window.FoodyConfig.BACKEND_URL}/favorites/?user_name=${this.currentUser}`);
            
            if (response.ok) {
                const result = await response.json();
                return result.favorites || [];
            } else {
                console.error('Error fetching favorites');
                return [];
            }
        } catch (error) {
            console.error('Network error fetching favorites:', error);
            return [];
        }
    }

    // Update favorite button UI
    updateFavoriteButton(recipeId, isFavorited) {
        const buttons = document.querySelectorAll(`[data-recipe-id="${recipeId}"] .favorite-button, [data-recipe-id="${recipeId}"] .favorite-btn`);
        
        buttons.forEach(button => {
            const icon = button.querySelector('i');
            
            if (isFavorited) {
                button.classList.add('is-favorite');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
                button.style.color = '#e74c3c';
                button.textContent = button.textContent.includes('♡') ? '♥' : button.textContent;
            } else {
                button.classList.remove('is-favorite');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
                button.style.color = '#777';
                button.textContent = button.textContent.includes('♥') ? '♡' : button.textContent;
            }
        });
    }

    // Check if recipe is favorited
    async isRecipeFavorited(recipeId) {
        const favorites = await this.getUserFavorites();
        return favorites.some(fav => fav.recipe_id == recipeId);
    }

    // Initialize favorites for recipe cards
    async initializeFavoriteButtons() {
        const favorites = await this.getUserFavorites();
        const favoriteIds = favorites.map(fav => fav.recipe_id);
        
        favoriteIds.forEach(recipeId => {
            this.updateFavoriteButton(recipeId, true);
        });
    }

    // Toggle favorite status
    async toggleFavorite(recipeId) {
        const isFavorited = await this.isRecipeFavorited(recipeId);
        
        if (isFavorited) {
            return await this.removeFromFavorites(recipeId);
        } else {
            return await this.addToFavorites(recipeId);
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        
        // Set background color based on type
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        if (!document.querySelector('style[data-notification-styles]')) {
            style.setAttribute('data-notification-styles', 'true');
            document.head.appendChild(style);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after configured duration
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, window.FoodyConfig?.NOTIFICATION_DURATION || 3000);
    }

    // Add event listeners for favorite buttons
    addEventListeners() {
        document.addEventListener('click', async (event) => {
            const favoriteButton = event.target.closest('.favorite-button, .favorite-btn');
            
            if (favoriteButton) {
                event.preventDefault();
                event.stopPropagation();
                
                const recipeCard = favoriteButton.closest('[data-recipe-id]');
                if (recipeCard) {
                    const recipeId = recipeCard.getAttribute('data-recipe-id');
                    
                    // Disable button temporarily
                    favoriteButton.style.opacity = '0.5';
                    favoriteButton.disabled = true;
                    
                    await this.toggleFavorite(recipeId);
                    
                    // Re-enable button
                    favoriteButton.style.opacity = '1';
                    favoriteButton.disabled = false;
                }
            }
        });
    }
}

// Initialize AJAX Favorites Manager
const ajaxFavoritesManager = new AJAXFavoritesManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ajaxFavoritesManager.addEventListeners();
    ajaxFavoritesManager.initializeFavoriteButtons();
});

// Export for use in other modules
window.ajaxFavoritesManager = ajaxFavoritesManager; 