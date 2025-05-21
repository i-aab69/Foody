// Wait for the HTML document to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    console.log("Foody Website Script Loaded!");

    // --- Elements Selection ---
    // Select the links themselves now
    const navLinks = document.querySelectorAll('.navigation_bar .nav-link');
    const categoryElements = document.querySelectorAll('.categories-titles .category');
    const recipeCardContainer = document.getElementById('recipe-cards-container');
    const allRecipeCards = recipeCardContainer.querySelectorAll('.recipe-card');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const allModals = document.querySelectorAll('.modal');
    const allCloseButtons = document.querySelectorAll('.modal-close-button');
    const filterMessageElement = document.getElementById('filter-message');

    // --- Modal Helper Functions ---

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modalOverlay.classList.remove('hidden');
            modal.classList.remove('hidden');
        } else {
            console.error(`Modal with ID ${modalId} not found.`);
        }
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        allModals.forEach(modal => modal.classList.add('hidden'));
    }

    // --- Core Feature Functions ---

    /**
     * Handles clicks on navigation links. Opens modals or simulates actions.
     * Relies on data-target-modal or data-target-action attributes on the <a> tags.
     * @param {Event} event - The click event object.
     */
    function handleNavClick(event) {
        const clickedLink = event.target.closest('.nav-link'); // Find the parent <a> tag
        if (!clickedLink) return;

        const targetModal = clickedLink.dataset.targetModal;
        const targetAction = clickedLink.dataset.targetAction;

        // Check if the link is intended to open a modal
        if (targetModal) {
             event.preventDefault(); // Prevent the default '#' link behavior
             openModal(targetModal);
        }
        // Check if the link has a specific action
        else if (targetAction === 'search') {
             event.preventDefault(); // Prevent the default '#' link behavior
             console.log(`Simulating action: ${targetAction}`);
             alert(`Simulating action: Open Search interface`);
        }
        // If it's just href="#" with no data attributes, let the browser handle it (which does nothing)
        // or you could add specific logic here if needed for other links.
        else if (clickedLink.getAttribute('href') === '#') {
            // Optionally prevent default for all '#' links if they shouldn't jump to top
             event.preventDefault();
             console.log("Placeholder navigation link clicked:", clickedLink);
             // You could add alerts here for Favorites, Recipes, Home etc. if desired
             // alert("Simulating navigation to [Page Name]");
        }
    }

    /**
     * Filters recipes displayed on the page based on the selected category.
     * @param {string} categoryName - The name of the category to filter by.
     */
    function filterRecipesByCategory(categoryName) {
        console.log(`Filtering by category: ${categoryName}`);
        let visibleCount = 0;

        categoryElements.forEach(el => {
            el.classList.toggle('active-category', el.dataset.categoryName === categoryName);
        });

        allRecipeCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const shouldBeVisible = (categoryName === 'All' || !cardCategory || cardCategory === categoryName);
            card.style.display = shouldBeVisible ? '' : 'none';
            if (shouldBeVisible) visibleCount++;
        });

        document.querySelectorAll('#recipe-cards-container .recipe-row').forEach(row => {
            const hasVisibleCard = Array.from(row.querySelectorAll('.recipe-card')).some(card => card.style.display !== 'none');
            row.style.display = hasVisibleCard ? '' : 'none';
        });

        if (visibleCount === 0 && categoryName !== 'All') {
            filterMessageElement.textContent = `No recipes found for "${categoryName}".`;
            filterMessageElement.style.display = 'block';
        } else {
            filterMessageElement.style.display = 'none';
        }
    }

    /**
     * Shows detailed information for a specific recipe in a modal.
     * @param {string} recipeId - The unique identifier for the recipe.
     */
    function showRecipeDetails(recipeId) {
        console.log(`Showing details for recipe: ${recipeId}`);
        const card = document.querySelector(`.recipe-card[data-recipe-id="${recipeId}"]`);
        const title = card ? card.querySelector('h3')?.textContent : 'Recipe Details';

        const titleElement = document.getElementById('modal-recipe-title');
        const idElement = document.getElementById('modal-recipe-id');

        if (titleElement) titleElement.textContent = title;
        if (idElement) idElement.textContent = recipeId;

        openModal('recipe-details-modal');
    }

    /**
     * Toggles the favorite status of a recipe using localStorage.
     * @param {string} recipeId - The unique identifier for the recipe.
     * @param {HTMLElement} heartIcon - The heart icon element being clicked.
     */
    function toggleFavorite(recipeId, heartIcon) {
        console.log(`Toggling favorite status for recipe: ${recipeId}`);
        let favorites = JSON.parse(localStorage.getItem('foodyFavorites') || '[]');
        const index = favorites.indexOf(recipeId);

        if (index > -1) { // Remove
            favorites.splice(index, 1);
            heartIcon.classList.remove('is-favorite');
            heartIcon.textContent = '♡';
            console.log(`${recipeId} removed from favorites.`);
        } else { // Add
            favorites.push(recipeId);
            heartIcon.classList.add('is-favorite');
            heartIcon.textContent = '♥';
            console.log(`${recipeId} added to favorites.`);
        }
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
                button.textContent = isFav ? '♥' : '♡';
            }
        });
    }

    /** Loads more recipes onto the page. Simulates action. */
    function loadMoreRecipes() {
        console.log("Simulating Load more recipes...");
        alert("Simulating: Load more recipes.\n(Actual implementation requires a backend server)");
        if(loadMoreBtn) {
            loadMoreBtn.textContent = "No More Recipes";
            loadMoreBtn.disabled = true;
        }
    }

    // --- Event Listeners ---

    // Modals: Close buttons and overlay click
    allCloseButtons.forEach(button => button.addEventListener('click', closeModal));
    modalOverlay.addEventListener('click', closeModal);

    // Navigation Links
    navLinks.forEach(link => link.addEventListener('click', handleNavClick));

    // Category Filters
    categoryElements.forEach(category => {
        category.addEventListener('click', () => {
             const categoryName = category.dataset.categoryName;
             if(categoryName) {
                 filterRecipesByCategory(categoryName);
             }
        });
    });

    // Recipe Cards (using event delegation)
    recipeCardContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.recipe-card');
        const favButton = event.target.closest('.favorite-button');

        if (favButton && card && card.dataset.recipeId) { // Favorite button clicked
             event.stopPropagation();
             toggleFavorite(card.dataset.recipeId, favButton);
        } else if (card && card.dataset.recipeId) { // Card area clicked
             showRecipeDetails(card.dataset.recipeId);
        } else if (card && !card.dataset.recipeId){
             console.warn("Card clicked, but 'data-recipe-id' is missing.");
        }
    });

    // Load More Button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreRecipes);
    }

    // --- Initial Setup ---
    updateFavoriteIcons();
    document.querySelector('.category[data-category-name="All"]')?.classList.add('active-category');

}); // End of DOMContentLoaded