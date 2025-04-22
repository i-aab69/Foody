// Wait for the HTML document to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    console.log("Foody Website Script Loaded! (home.js)");

    // --- Elements Selection ---
    const categoryElements = document.querySelectorAll('.categories-titles .category');
    const recipeCardContainer = document.getElementById('recipe-cards-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const filterMessageElement = document.getElementById('filter-message');

    // Find all recipe cards within the container (if container exists)
    const allRecipeCards = recipeCardContainer ? recipeCardContainer.querySelectorAll('.recipe-card') : [];

    // --- Core Feature Functions ---

    /**
     * Filters recipes displayed on the page based on the selected category.
     * @param {string} categoryName - The name of the category to filter by.
     */
    function filterRecipesByCategory(categoryName) {
        console.log(`Filtering by category: ${categoryName}`);
        let visibleCount = 0;

        // Update active state visual for category titles
        categoryElements.forEach(el => {
            el.classList.toggle('active-category', el.dataset.categoryName === categoryName);
        });

        // Show/hide recipe cards based on category
        allRecipeCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const shouldBeVisible = (categoryName === 'All' || !cardCategory || cardCategory === categoryName);
            // Make sure card exists before trying to access style
            if (card) {
                card.style.display = shouldBeVisible ? '' : 'none';
                if (shouldBeVisible) visibleCount++;
            }
        });

        // Show/hide recipe rows based on whether they contain visible cards
        // Note: Assumes recipe cards are wrapped in '.recipe-row' divs
        if (recipeCardContainer) {
            recipeCardContainer.querySelectorAll('.recipe-row').forEach(row => {
                const hasVisibleCard = Array.from(row.querySelectorAll('.recipe-card')).some(card => card.style.display !== 'none');
                row.style.display = hasVisibleCard ? '' : 'none';
            });
        }

        // Display a message if no recipes match the filter
        if (filterMessageElement) {
            if (visibleCount === 0 && categoryName !== 'All') {
                filterMessageElement.textContent = `No recipes found for "${categoryName}".`;
                filterMessageElement.style.display = 'block';
            } else {
                filterMessageElement.style.display = 'none';
            }
        }
    }

    /**
     * Toggles the favorite status of a recipe using localStorage.
     * @param {string} recipeId - The unique identifier for the recipe.
     * @param {HTMLElement} heartIcon - The heart icon element being clicked.
     */
    function toggleFavorite(recipeId, heartIcon) {
        console.log(`Toggling favorite status for recipe: ${recipeId}`);
        // Get current favorites from localStorage, or initialize an empty array
        let favorites = JSON.parse(localStorage.getItem('foodyFavorites') || '[]');
        const index = favorites.indexOf(recipeId);

        if (index > -1) { // If already favorited, remove it
            favorites.splice(index, 1);
            heartIcon.classList.remove('is-favorite');
            heartIcon.textContent = '♡'; // Update icon to empty heart
            console.log(`${recipeId} removed from favorites.`);
        } else { // If not favorited, add it
            favorites.push(recipeId);
            heartIcon.classList.add('is-favorite');
            heartIcon.textContent = '♥'; // Update icon to filled heart
            console.log(`${recipeId} added to favorites.`);
        }
        // Save the updated favorites array back to localStorage
        localStorage.setItem('foodyFavorites', JSON.stringify(favorites));
    }

    /** Updates the visual state of all favorite icons on page load/update. */
    function updateFavoriteIcons() {
        let favorites = JSON.parse(localStorage.getItem('foodyFavorites') || '[]');
        document.querySelectorAll('.favorite-button').forEach(button => {
            const card = button.closest('.recipe-card');
            if (card && card.dataset.recipeId) {
                const recipeId = card.dataset.recipeId;
                const isFav = favorites.includes(recipeId);
                button.classList.toggle('is-favorite', isFav);
                button.textContent = isFav ? '♥' : '♡'; // Set correct heart icon
            }
        });
    }

    /** Loads more recipes onto the page. Simulates action. */
    function loadMoreRecipes() {
        console.log("Simulating Load more recipes...");
        alert("Simulating: Load more recipes.\n(Actual implementation requires a backend server)");
        // Disable button after simulated load
        if (loadMoreBtn) {
            loadMoreBtn.textContent = "No More Recipes";
            loadMoreBtn.disabled = true;
        }
    }

    // --- Event Listeners ---

    // Category Filters
    categoryElements.forEach(category => {
        category.addEventListener('click', () => {
            const categoryName = category.dataset.categoryName;
            if (categoryName) {
                filterRecipesByCategory(categoryName);
            }
        });
    });

    // Recipe Cards (using event delegation on the container)
    if (recipeCardContainer) {
        recipeCardContainer.addEventListener('click', (event) => {
            const card = event.target.closest('.recipe-card');
            const favButton = event.target.closest('.favorite-button');

            if (favButton && card && card.dataset.recipeId) { // Favorite button clicked
                event.stopPropagation(); // Prevent card click from firing too
                toggleFavorite(card.dataset.recipeId, favButton);
            } else if (card && card.dataset.recipeId) { // Card area clicked (but not favorite button)
                const recipeId = card.dataset.recipeId;
                console.log(`Navigating to details for recipe: ${recipeId}`);
                // Navigate to the description page with ID as a query parameter
                window.location.href = `Discription_page.html?id=${recipeId}`;
            } else if (card && !card.dataset.recipeId) {
                console.warn("Card clicked, but 'data-recipe-id' is missing.");
            }
        });
    }

    // Load More Button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreRecipes);
    }

    // --- Initial Setup ---
    updateFavoriteIcons(); // Update favorite icons based on localStorage on load
    // Set the 'All' category as active by default on load
    document.querySelector('.category[data-category-name="All"]')?.classList.add('active-category');

}); // End of DOMContentLoaded