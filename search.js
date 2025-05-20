document.addEventListener('DOMContentLoaded', function () {
    const RECIPES_KEY = 'foodyRecipes';

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
            card.setAttribute('data-recipe-id', recipe.id);

            const isFav = isFavorite(recipe.id);
            const favIcon = isFav ? '♥' : '♡';
            const favColor = isFav ? '#e74c3c' : '#777';

            card.innerHTML = `
                <img src="${recipe.image || 'source/default-recipe.png'}" alt="${recipe.title}" />
                <div class="recipe-info">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.ingredientCount ? `You have all ${recipe.ingredientCount} ingredients` : 'Click for details'}</p>
                </div>
                <button class="favorite-btn" style="color: ${favColor}">${favIcon}</button>
            `;

            recipesContainer.appendChild(card);
        });

        addRecipeCardEventListeners();
    }

    function addRecipeCardEventListeners() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation(); 

                const card = this.closest('.recipe-card');
                const recipeId = card.getAttribute('data-recipe-id');

                if (this.textContent === '♡') {
                    addFavorite(recipeId);
                    this.textContent = '♥';
                    this.style.color = '#e74c3c';
                } else {
                    removeFavorite(recipeId);
                    this.textContent = '♡';
                    this.style.color = '#777';
                }
            });
        });

        document.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', function () {
                const recipeId = this.getAttribute('data-recipe-id');
                window.location.href = `Discription_page.html?id=${recipeId}`;
            });
        });
    }

    const recipeSearch = document.getElementById('recipe-search');
    const searchButton = document.querySelector('.search-btn');

    searchButton.addEventListener('click', function () {
        searchRecipes();
    });

    recipeSearch.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchRecipes();
        }
    });

    function searchRecipes() {
        const searchTerm = recipeSearch.value.toLowerCase().trim();
        const recipes = getRecipes();

        if (searchTerm === '') {
            displayRecipes(recipes);
            return;
        }

        const filteredRecipes = recipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchTerm)
        );

        displayRecipes(filteredRecipes);
    }

    function filterRecipesByIngredients() {
        const ingredientTags = document.querySelectorAll('.ingredient-tags .pill-white');
        const selectedIngredients = Array.from(ingredientTags).map(
            tag => tag.textContent.trim().replace(' ✕', '')
        );

        if (selectedIngredients.length === 0) {
            searchRecipes();
            return;
        }

        const recipes = getRecipes();
        const filteredRecipes = recipes.filter(recipe => {
            if (!recipe.ingredients) return false;

            return selectedIngredients.every(ingredient =>
                recipe.ingredients.some(ri =>
                    ri.toLowerCase().includes(ingredient.toLowerCase())
                )
            );
        });

        displayRecipes(filteredRecipes);
    }


    function initPage() {
        const recipes = getRecipes();

        if (recipes.length === 0) {
            const sampleRecipes = [
                {
                    id: 'shakshuka01',
                    title: 'Shakshuka',
                    image: 'source/shakshuka.png',
                    ingredients: ['egg', 'tomato', 'pepper', 'onion', 'garlic', 'cumin', 'paprika'],
                    ingredientCount: 7,
                    description: 'A delicious Middle Eastern breakfast dish with eggs poached in a spicy tomato sauce.'
                },
                {
                    id: 'omelette01',
                    title: 'Omelette',
                    image: 'source/omelette.png',
                    ingredients: ['egg', 'butter', 'salt'],
                    ingredientCount: 3,
                    description: 'A classic French omelette made with eggs and butter.'
                },
                {
                    id: 'redpasta01',
                    title: 'Red sauce pasta',
                    image: 'source/red_pasta.png',
                    ingredients: ['pasta', 'tomato', 'onion', 'garlic', 'basil', 'olive oil', 'parmesan'],
                    ingredientCount: 7,
                    description: 'A simple and delicious pasta with homemade tomato sauce.'
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
    }

    initPage();
});