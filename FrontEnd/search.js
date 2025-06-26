import { get_rec } from './API_Calls.js';
import { SearchAPI, SearchUI, FavoritesUI } from './ajax.js';

document.addEventListener('DOMContentLoaded', function () {
    const RECIPES_KEY = 'all_res';

    const toggleButton = document.getElementById('advanced-search-toggle');
    const advancedSearch = document.getElementById('advanced-search');

    toggleButton.addEventListener('click', function () {
        advancedSearch.classList.toggle('hidden');
    });

    const ingredientInput = document.getElementById('ingredient-search');
    const addButton = document.querySelector('.add-ingredient-btn');
    const ingredientTags = document.querySelector('.ingredient-tags');

    addButton.addEventListener('click', function () {
        addIngredient();
    });

    ingredientInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addIngredient();
        }
    });

    function addIngredient() {
        const ingredient = ingredientInput.value.trim();
        if (ingredient) {
            const tag = document.createElement('span');
            tag.className = 'pill pill-white';
            tag.innerHTML = `${ingredient} <i class="fas fa-times remove-tag"></i>`;
            ingredientTags.appendChild(tag);
            ingredientInput.value = '';

            const removeIcon = tag.querySelector('.remove-tag');
            removeIcon.addEventListener('click', function () {
                tag.remove();
                filterRecipesByIngredients();
            });

            filterRecipesByIngredients();
        }
    }

    document.querySelectorAll('.remove-tag').forEach(icon => {
        icon.addEventListener('click', function () {
            this.parentElement.remove();
            filterRecipesByIngredients();
        });
    });

    function getRecipes() {
        try {
            const recipesJson = localStorage.getItem(RECIPES_KEY);
            return recipesJson ? JSON.parse(recipesJson) : [];
        } catch (e) {
            console.error("Couldn't parse recipes from local storage.", e);
            return [];
        }
    }

    function displayRecipes(recipes) {
        const recipesContainer = document.getElementById('recipes-container');
        recipesContainer.innerHTML = '';

        document.getElementById('recipe-count').textContent = recipes.length;

        if (recipes.length === 0) {
            recipesContainer.innerHTML = '<p>No recipes found. Try different search terms.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            // Handle both backend format (recipe.pk or recipe.id) and sample format (recipe.id)
            const recipeId = recipe.pk || recipe.id;
            card.setAttribute('data-recipe-id', recipeId);

            const isFav = isFavorite(recipeId);
            const favIcon = isFav ? '♥' : '♡';
            const favColor = isFav ? '#e74c3c' : '#777';

            // Handle both backend format (recipe.name, recipe.img) and sample format (recipe.title, recipe.image)
            const recipeName = recipe.name || recipe.title || 'Untitled Recipe';
            const recipeImage = recipe.img || recipe.image || 'source/default-recipe.png';
            const description = recipe.desc || recipe.description || 'Click for details';

            card.innerHTML = `
                <img src="${recipeImage}" alt="${recipeName}" />
                <div class="recipe-info">
                    <h3>${recipeName}</h3>
                    <p>${recipe.ingredientCount ? `You have all ${recipe.ingredientCount} ingredients` : description}</p>
                </div>
                <button class="favorite-btn" style="color: ${favColor}">${favIcon}</button>
            `;

            recipesContainer.appendChild(card);
        });

        addRecipeCardEventListeners();
    }

    function addRecipeCardEventListeners() {
        // Use AJAX for favorites
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', async function (e) {
                e.stopPropagation(); 

                const card = this.closest('.recipe-card');
                const recipeId = card.getAttribute('data-recipe-id');

                // Use AJAX favorites functionality
                await FavoritesUI.toggle(recipeId, this);
            });
        });

        document.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', function (e) {
                if (!e.target.classList.contains('favorite-btn')) {
                    const recipeId = this.getAttribute('data-recipe-id');
                    window.location.href = `Discription_page.html?id=${recipeId}`;
                }
            });
        });
    }

    const recipeSearch = document.getElementById('recipe-search');
    const searchButton = document.querySelector('.search-btn');
    const refreshButton = document.getElementById('refresh-btn');

    // Enhanced search with AJAX
    searchButton.addEventListener('click', function () {
        performAjaxSearch();
    });

    recipeSearch.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performAjaxSearch();
        }
    });

    // Live search functionality
    recipeSearch.addEventListener('input', function (e) {
        const query = e.target.value.trim();
        
        if (query.length >= 2) {
            SearchAPI.liveSearch(query, (results) => {
                if (results.success) {
                    displayAjaxResults(results.recipes);
                    document.getElementById('recipe-count').textContent = results.count;
                } else {
                    console.error('Search error:', results.error);
                    // Fallback to local search
                    searchRecipes();
                }
            });
        } else if (query.length === 0) {
            // Show all recipes when search is cleared
            refreshRecipesFromBackend().then(recipes => {
                if (recipes.length > 0) {
                    displayRecipes(recipes);
                } else {
                    displayRecipes(getRecipes());
                }
            });
        }
    });

    async function performAjaxSearch() {
        const query = recipeSearch.value.trim();
        const ingredientTags = document.querySelectorAll('.ingredient-tags .pill-white');
        const ingredients = Array.from(ingredientTags)
            .map(tag => tag.textContent.trim().replace(' ✕', '').replace('×', ''))
            .join(',');

        try {
            const results = await SearchAPI.searchRecipes(query, ingredients);
            if (results.success) {
                displayAjaxResults(results.recipes);
                document.getElementById('recipe-count').textContent = results.count;
            } else {
                throw new Error(results.error);
            }
        } catch (error) {
            console.error('AJAX search failed, using fallback:', error);
            // Fallback to original search
            if (ingredients) {
                filterRecipesByIngredients();
            } else {
                searchRecipes();
            }
        }
    }

    function displayAjaxResults(recipes) {
        const recipesContainer = document.getElementById('recipes-container');
        recipesContainer.innerHTML = '';

        if (recipes.length === 0) {
            recipesContainer.innerHTML = '<p>No recipes found. Try different search terms.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const recipeCard = createAjaxRecipeCard(recipe);
            recipesContainer.appendChild(recipeCard);
        });

        // Initialize AJAX favorite buttons
        initializeAjaxFavoriteButtons(recipesContainer);
    }

    function createAjaxRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.setAttribute('data-recipe-id', recipe.pk);

        card.innerHTML = `
            <img src="${recipe.img || 'source/default-recipe.png'}" alt="${recipe.name}" />
            <div class="recipe-info">
                <h3>${recipe.name}</h3>
                <p>${recipe.desc || 'Click for details'}</p>
                ${recipe.ingredients ? `<small>Ingredients: ${recipe.ingredients.join(', ')}</small>` : ''}
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
    }

    function initializeAjaxFavoriteButtons(container) {
        container.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const recipeId = e.target.closest('.recipe-card').getAttribute('data-recipe-id');
                await FavoritesUI.toggle(recipeId, e.target);
            });
        });
    }

    refreshButton.addEventListener('click', async function () {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        const refreshedRecipes = await refreshRecipesFromBackend();
        if (refreshedRecipes.length > 0) {
            displayRecipes(refreshedRecipes);
            // Clear search to show all recipes
            recipeSearch.value = '';
        }
        this.innerHTML = '<i class="fas fa-sync-alt"></i>';
    });

    // Fallback search functions (kept for compatibility)
    function searchRecipes() {
        const searchTerm = recipeSearch.value.toLowerCase().trim();
        const recipes = getRecipes();

        if (searchTerm === '') {
            displayRecipes(recipes);
            return;
        }

        const filteredRecipes = recipes.filter(recipe => {
            // Handle both backend format (recipe.name) and sample format (recipe.title)
            const recipeName = recipe.name || recipe.title || '';
            return recipeName.toLowerCase().includes(searchTerm);
        });

        displayRecipes(filteredRecipes);
    }

    function filterRecipesByIngredients() {
        const ingredientTags = document.querySelectorAll('.ingredient-tags .pill-white');
        const selectedIngredients = Array.from(ingredientTags).map(
            tag => tag.textContent.trim().replace(' ✕', '').replace('×', '')
        );

        if (selectedIngredients.length === 0) {
            searchRecipes();
            return;
        }

        // Try AJAX search first
        performAjaxSearch().catch(() => {
            // Fallback to local filtering
            const recipes = getRecipes();
            const filteredRecipes = recipes.filter(recipe => {
                // Handle both backend format and sample format
                let ingredients = recipe.ingredients || [];
                
                // If ingredients is not an array, it might be a string or need processing
                if (!Array.isArray(ingredients)) {
                    ingredients = [];
                }

                if (ingredients.length === 0) return false;

                return selectedIngredients.every(ingredient =>
                    ingredients.some(ri => {
                        // Handle both string ingredients and object ingredients
                        const ingredientName = (typeof ri === 'string') ? ri : (ri.name || '');
                        return ingredientName.toLowerCase().includes(ingredient.toLowerCase());
                    })
                );
            });

            displayRecipes(filteredRecipes);
        });
    }

    async function refreshRecipesFromBackend() {
        try {
            console.log('Refreshing recipes from backend...');
            const backendRecipes = await get_rec();
            if (backendRecipes && backendRecipes.length > 0) {
                // Add id field for frontend compatibility
                backendRecipes.forEach((recipe, index) => {
                    recipe.id = recipe.pk || (index + 1);
                });
                localStorage.setItem(RECIPES_KEY, JSON.stringify(backendRecipes));
                console.log(`Refreshed ${backendRecipes.length} recipes from backend`);
                return backendRecipes;
            }
        } catch (error) {
            console.log('Could not refresh from backend:', error);
        }
        return [];
    }

    async function initPage() {
        // Always try to refresh from backend first
        let recipes = await refreshRecipesFromBackend();
        
        // If backend refresh failed, use cached data
        if (recipes.length === 0) {
            recipes = getRecipes();
        }

        if (recipes.length === 0) {
            const sampleRecipes = [
                {
                    pk: 1,
                    id: 1,
                    name: 'Shakshuka',
                    img: 'source/shakshuka.png',
                    ingredients: ['egg', 'tomato', 'pepper', 'onion', 'garlic', 'cumin', 'paprika'],
                    ingredientCount: 7,
                    desc: 'A delicious Middle Eastern breakfast dish with eggs poached in a spicy tomato sauce.',
                    instructions: 'Heat oil in a pan, add onions and garlic...'
                },
                {
                    pk: 2,
                    id: 2,
                    name: 'Omelette',
                    img: 'source/omelette.png',
                    ingredients: ['egg', 'butter', 'salt'],
                    ingredientCount: 3,
                    desc: 'A classic French omelette made with eggs and butter.',
                    instructions: 'Beat eggs, heat butter in pan...'
                },
                {
                    pk: 3,
                    id: 3,
                    name: 'Red sauce pasta',
                    img: 'source/red_pasta.png',
                    ingredients: ['pasta', 'tomato', 'onion', 'garlic', 'basil', 'olive oil', 'parmesan'],
                    ingredientCount: 7,
                    desc: 'A simple and delicious pasta with homemade tomato sauce.',
                    instructions: 'Boil pasta, make sauce with tomatoes...'
                }
            ];

            try {
                localStorage.setItem(RECIPES_KEY, JSON.stringify(sampleRecipes));
                displayRecipes(sampleRecipes);
            } catch (e) {
                console.error("Couldn't save sample recipes to local storage.", e);
            }
        } else {
            displayRecipes(recipes);
        }

        // Update favorites count
        FavoritesUI.updateFavoritesCount();
    }

    initPage();
});