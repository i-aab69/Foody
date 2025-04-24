// Foody-main/home.js (Updated to use storageManager.js)

document.addEventListener('DOMContentLoaded', () => {
    // Check if storageManager functions are available
     if (typeof addFavorite !== 'function' || typeof removeFavorite !== 'function' || typeof isFavorite !== 'function') {
        console.error("storageManager.js functions not loaded before home.js!");
        alert("Error: Essential functions missing. Please contact support.");
        return; // Stop execution
    }

    console.log("Foody Website Script Loaded! (home.js)");

    // --- Elements Selection ---
    const categoryElements = document.querySelectorAll('.categories-titles .category');
    const recipeCardContainer = document.getElementById('recipe-cards-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const filterMessageElement = document.getElementById('filter-message');
    const allRecipeCards = recipeCardContainer ? recipeCardContainer.querySelectorAll('.recipe-card') : [];

    // --- Core Feature Functions ---

    function filterRecipesByCategory(categoryName) {
        console.log(`Filtering by category: ${categoryName}`);
        let visibleCount = 0;
        categoryElements.forEach(el => {
            el.classList.toggle('active-category', el.dataset.categoryName === categoryName);
        });
        allRecipeCards.forEach(card => {
            if (card) { // Ensure card exists
                const cardCategory = card.dataset.category;
                const shouldBeVisible = (categoryName === 'All' || !cardCategory || cardCategory === categoryName);
                card.style.display = shouldBeVisible ? '' : 'none';
                if (shouldBeVisible) visibleCount++;
            }
        });
        if (recipeCardContainer) {
            recipeCardContainer.querySelectorAll('.recipe-row').forEach(row => {
                const hasVisibleCard = Array.from(row.querySelectorAll('.recipe-card')).some(card => card.style.display !== 'none');
                row.style.display = hasVisibleCard ? '' : 'none';
            });
        }
        if (filterMessageElement) {
            filterMessageElement.style.display = (visibleCount === 0 && categoryName !== 'All') ? 'block' : 'none';
            if (visibleCount === 0 && categoryName !== 'All') {
                 filterMessageElement.textContent = `No recipes found for "${categoryName}".`;
            }
        }
    }

    /**
     * Toggles the favorite status using storageManager and updates UI.
     * @param {string} recipeId - The unique identifier for the recipe.
     * @param {HTMLElement} favButton - The favorite button element being clicked.
     */
    function toggleFavoriteUI(recipeId, favButton) {
        console.log(`Toggling favorite UI for recipe: ${recipeId}`);
        const iconElement = favButton.querySelector('i');
        if (!iconElement) return;

        // --- Use storageManager to check/add/remove ---
        if (isFavorite(recipeId)) { // Check current state
            removeFavorite(recipeId); // Remove using storageManager
            // Update UI for non-favorite
            favButton.classList.remove('is-favorite');
            iconElement.classList.remove('fas');
            iconElement.classList.add('far');
            favButton.setAttribute('aria-pressed', 'false');
            favButton.setAttribute('aria-label', 'Add to favorites');
        } else {
            addFavorite(recipeId); // Add using storageManager
            // Update UI for favorite
            favButton.classList.add('is-favorite'); // Add class for animation/styling
            iconElement.classList.remove('far');
            iconElement.classList.add('fas');
            favButton.setAttribute('aria-pressed', 'true');
            favButton.setAttribute('aria-label', 'Remove from favorites');
        }
    }

    /** Updates the visual state of all favorite icons on page load using storageManager. */
    function updateFavoriteIconsUI() {
        document.querySelectorAll('.favorite-button').forEach(button => {
            const card = button.closest('.recipe-card');
            const iconElement = button.querySelector('i');
            if (card && card.dataset.recipeId && iconElement) {
                const recipeId = card.dataset.recipeId;
                // --- Use storageManager to check ---
                const favState = isFavorite(recipeId);

                button.classList.toggle('is-favorite', favState);
                iconElement.classList.toggle('fas', favState);
                iconElement.classList.toggle('far', !favState);
                button.setAttribute('aria-pressed', favState ? 'true' : 'false');
                button.setAttribute('aria-label', favState ? 'Remove from favorites' : 'Add to favorites');
            }
        });
    }

    function loadMoreRecipes() {
        console.log("Simulating Load more recipes...");
        alert("Simulating: Load more recipes.\n(Actual implementation requires a backend server)");
        if (loadMoreBtn) {
            loadMoreBtn.textContent = "No More Recipes";
            loadMoreBtn.disabled = true;
        }
    }

    // --- Event Listeners ---

    categoryElements.forEach(category => {
        category.addEventListener('click', () => {
            const categoryName = category.dataset.categoryName;
            if (categoryName) filterRecipesByCategory(categoryName);
        });
    });

    if (recipeCardContainer) {
        recipeCardContainer.addEventListener('click', (event) => {
            const card = event.target.closest('.recipe-card');
            const favButton = event.target.closest('.favorite-button');

            if (favButton && card && card.dataset.recipeId) {
                event.stopPropagation();
                // --- Use new toggle function ---
                toggleFavoriteUI(card.dataset.recipeId, favButton);
            } else if (card && card.dataset.recipeId) {
                const recipeId = card.dataset.recipeId;
                console.log(`Navigating to details for recipe: ${recipeId}`);
                window.location.href = `Discription_page.html?id=${recipeId}`;
            } else if (card && !card.dataset.recipeId) {
                console.warn("Card clicked, but 'data-recipe-id' is missing.");
            }
        });
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreRecipes);
    }

    // --- Initial Setup ---
    updateFavoriteIconsUI(); // Use new update function
    document.querySelector('.category[data-category-name="All"]')?.classList.add('active-category');

}); // End of DOMContentLoaded