// Wait for the HTML document to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    console.log("Foody Website Script Loaded! (main.js - cleaned)");

    // --- Elements Selection (Keep elements needed for this page's logic) ---
    const categoryElements = document.querySelectorAll('.categories-titles .category');
    const recipeCardContainer = document.getElementById('recipe-cards-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const modalOverlay = document.getElementById('modal-overlay'); // Keep for recipe details modal
    const allModals = document.querySelectorAll('.modal'); // Keep for recipe details modal
    const allCloseButtons = document.querySelectorAll('.modal-close-button'); // Keep for recipe details modal
    const filterMessageElement = document.getElementById('filter-message');

    // Find all recipe cards within the container (if container exists)
    const allRecipeCards = recipeCardContainer ? recipeCardContainer.querySelectorAll('.recipe-card') : [];


    // --- Modal Helper Functions (Keep - needed for recipe details) ---
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal && modalOverlay) {
            modalOverlay.classList.remove('hidden');
            modal.classList.remove('hidden');
             console.log(`Modal opened via home.js: ${modalId}`);
        } else {
            console.error(`Modal with ID ${modalId} or overlay not found (called from home.js).`);
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
        allModals.forEach(modal => modal.classList.add('hidden'));
         console.log("Modal closed via home.js.");
    }

    // --- Core Feature Functions (Keep - specific to home.html content) ---

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
            card.style.display = shouldBeVisible ? '' : 'none';
            if (shouldBeVisible) visibleCount++;
        });

        // Show/hide recipe rows based on whether they contain visible cards
        // Note: Assumes recipe cards are wrapped in '.recipe-row' divs
        document.querySelectorAll('#recipe-cards-container .recipe-row').forEach(row => {
            const hasVisibleCard = Array.from(row.querySelectorAll('.recipe-card')).some(card => card.style.display !== 'none');
            row.style.display = hasVisibleCard ? '' : 'none';
        });


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
     * Shows detailed information for a specific recipe in a modal.
     * Uses the openModal function defined above.
     * @param {string} recipeId - The unique identifier for the recipe.
     */
    function showRecipeDetails(recipeId) {
        console.log(`Showing details for recipe: ${recipeId}`);
        // Find the card to potentially extract more info if needed later
        const card = document.querySelector(`.recipe-card[data-recipe-id="${recipeId}"]`);
        const title = card ? card.querySelector('h3')?.textContent : 'Recipe Details'; // Get title from card

        // Get elements within the recipe details modal
        const titleElement = document.getElementById('modal-recipe-title');
        const idElement = document.getElementById('modal-recipe-id');

        // Populate modal elements
        if (titleElement) titleElement.textContent = title;
        if (idElement) idElement.textContent = recipeId;

        // Open the specific modal for recipe details
        openModal('recipe-details-modal');
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
        if(loadMoreBtn) {
            loadMoreBtn.textContent = "No More Recipes";
            loadMoreBtn.disabled = true;
        }
    }

    // --- Event Listeners (Keep listeners relevant to home.html content) ---

    // Modals: Close buttons and overlay click (Keep for recipe details modal)
    allCloseButtons.forEach(button => button.addEventListener('click', closeModal));
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Category Filters
    categoryElements.forEach(category => {
        category.addEventListener('click', () => {
             const categoryName = category.dataset.categoryName;
             if(categoryName) {
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
                 showRecipeDetails(card.dataset.recipeId);
            } else if (card && !card.dataset.recipeId){
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