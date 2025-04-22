document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('recipe-title-placeholder');
    const timeElement = document.getElementById('recipe-time-placeholder');
    const servingsElement = document.getElementById('recipe-servings-placeholder');
    const imageElement = document.getElementById('recipe-image-placeholder');
    const descriptionElement = document.getElementById('recipe-description-placeholder');
    const ingredientsList = document.getElementById('ingredients-list-placeholder');
    const instructionsList = document.getElementById('instructions-list-placeholder');
    const favoriteButton = document.getElementById('favorite-button-placeholder');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const loadedArea = document.getElementById('recipe-loaded-area');
    const pageTitle = document.querySelector('title');

    const recipeData = {
        "cookie01": {
            title: "Chewy Chocolate Chip Cookies",
            time: "30 mins",
            servings: "24 cookies",
            image: "source/chocolate-chip-cookies.png",
            description: "Classic chewy cookies packed with chocolate chips. Perfect for any occasion!",
            ingredients: [
                "1 cup (2 sticks) unsalted butter, softened",
                "3/4 cup granulated sugar",
                "3/4 cup packed brown sugar",
                "2 large eggs",
                "1 teaspoon vanilla extract",
                "2 1/4 cups all-purpose flour",
                "1 teaspoon baking soda",
                "1/2 teaspoon salt",
                "2 cups semi-sweet chocolate chips"
            ],
            instructions: [
                "Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.",
                "Cream together butter and sugars until smooth.",
                "Beat in eggs one at a time, then stir in vanilla.",
                "Combine flour, baking soda, and salt; gradually beat into the creamed mixture.",
                "Stir in chocolate chips.",
                "Drop rounded tablespoons onto prepared baking sheets.",
                "Bake for 9 to 11 minutes or until golden brown.",
                "Cool on baking sheets for a few minutes before transferring to wire racks."
            ]
        },
        "cake01": {
            title: "Tasty Chocolate Cake",
            time: "1 hour",
            servings: "12 servings",
            image: "source/chocolate-cake.png",
            description: "A rich and moist chocolate cake, perfect for birthdays or just because.",
            ingredients: [
                "2 cups all-purpose flour",
                "2 cups sugar",
                "3/4 cup unsweetened cocoa powder",
                "2 teaspoons baking soda",
                "1 teaspoon baking powder",
                "1 teaspoon salt",
                "1 cup buttermilk",
                "1/2 cup vegetable oil",
                "2 large eggs",
                "1 teaspoon vanilla extract",
                "1 cup boiling water"
            ],
            instructions: [
                "Preheat oven to 350°F (175°C). Grease and flour two 9-inch round cake pans.",
                "In a large bowl, whisk together flour, sugar, cocoa, baking soda, baking powder, and salt.",
                "Add buttermilk, oil, eggs, and vanilla; beat on medium speed for 2 minutes.",
                "Carefully stir in boiling water (batter will be thin).",
                "Pour evenly into prepared pans.",
                "Bake for 30 to 35 minutes, or until a wooden skewer inserted into the center comes out clean.",
                "Cool in pans for 10 minutes before inverting onto wire racks to cool completely."
            ]
        },
        "shakshuka01": {
            title: "Shakshuka",
            time: "25 mins",
            servings: "2-3 servings",
            image: "source/shakshuka.png",
            description: "A classic North African and Middle Eastern dish of eggs poached in a spicy tomato and pepper sauce. Perfect for breakfast or brunch.",
            ingredients: [
                "1 tbsp olive oil",
                "1 medium onion, chopped",
                "1 red bell pepper, seeded and chopped",
                "3 cloves garlic, minced",
                "1 tsp ground cumin",
                "1 tsp sweet paprika",
                "1/4 tsp cayenne pepper (or to taste)",
                "1 (28 ounce) can whole peeled tomatoes, crushed",
                "Salt and black pepper to taste",
                "5-6 large eggs",
                "Fresh cilantro or parsley, chopped (for garnish)"
            ],
            instructions: [
                "Heat olive oil in a large oven-safe skillet or cast iron pan over medium heat. Add onion and bell pepper and cook until softened, about 5-7 minutes.",
                "Add garlic and spices (cumin, paprika, cayenne) and cook for another minute until fragrant.",
                "Pour in the crushed tomatoes and season with salt and pepper. Bring to a simmer and cook for 10 minutes, stirring occasionally, until the sauce thickens slightly.",
                "Use a spoon to make small wells in the sauce. Crack an egg directly into each well.",
                "Cover the skillet and cook for 5-8 minutes, or until the egg whites are set but the yolks are still runny (or cook longer to your preference).",
                "Garnish generously with fresh cilantro or parsley.",
                "Serve immediately with crusty bread for dipping."
            ]
        },
        "rolls01": { title: "Easy Cinnamon Rolls From Scratch", image: "source/cinnamon-rolls.png", time: "1.5 hours", servings: "12 rolls", description: "Placeholder...", ingredients: ["Ingredient 1", "Ingredient 2"], instructions: ["Step 1", "Step 2"] },
        "pizza01": { title: "Homemade Pizza Recipe", image: "source/homemade-pizza.png", time: "45 mins", servings: "4 servings", description: "Placeholder...", ingredients: ["Ingredient 1", "Ingredient 2"], instructions: ["Step 1", "Step 2"] },
        "bread01": { title: "Simply Sandwich Bread", image: "source/sandwich-bread.png", time: "2 hours", servings: "1 loaf", description: "Placeholder...", ingredients: ["Ingredient 1", "Ingredient 2"], instructions: ["Step 1", "Step 2"] },
        "fish01": { title: "Quick and Easy Baked Fish Fillet", image: "source/baked-fish.png", time: "20 mins", servings: "2 servings", description: "Placeholder...", ingredients: ["Ingredient 1", "Ingredient 2"], instructions: ["Step 1", "Step 2"] },
        "omelette01": { title: "Omelette", image: "source/omelette.png", time: "10 mins", servings: "1 serving", description: "Placeholder...", ingredients: ["Ingredient 1", "Ingredient 2"], instructions: ["Step 1", "Step 2"] },
        "redpasta01": { title: "Red Sauce Pasta", image: "source/red_pasta.png", time: "30 mins", servings: "4 servings", description: "Placeholder...", ingredients: ["Ingredient 1", "Ingredient 2"], instructions: ["Step 1", "Step 2"] },
    };

    function getRecipeIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function displayRecipeDetails(id) {
        const recipe = recipeData[id];
        loadingMessage.style.display = 'none';

        if (recipe) {
            pageTitle.textContent = `Foody - ${recipe.title}`;
            titleElement.textContent = recipe.title;
            timeElement.textContent = recipe.time || 'N/A';
            servingsElement.textContent = recipe.servings || 'N/A';
            imageElement.src = recipe.image || 'source/placeholder.png';
            imageElement.alt = recipe.title;
            descriptionElement.textContent = recipe.description || 'No description available.';

            ingredientsList.innerHTML = '';
            if (recipe.ingredients && recipe.ingredients.length > 0) {
                recipe.ingredients.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    ingredientsList.appendChild(li);
                });
            } else {
                ingredientsList.innerHTML = '<li>Ingredients not listed.</li>';
            }

            instructionsList.innerHTML = '';
            if (recipe.instructions && recipe.instructions.length > 0) {
                recipe.instructions.forEach(step => {
                    const li = document.createElement('li');
                    li.textContent = step;
                    instructionsList.appendChild(li);
                });
            } else {
                instructionsList.innerHTML = '<li>Instructions not listed.</li>';
            }

            favoriteButton.dataset.recipeId = id;
            updateFavoriteButtonState(id);
            loadedArea.style.display = 'block';
        } else {
            errorMessage.style.display = 'block';
        }
    }

    function updateFavoriteButtonState(id) {
        let favorites = JSON.parse(localStorage.getItem('foodyFavorites') || '[]');
        const isFav = favorites.includes(id);
        const heartIcon = favoriteButton.querySelector('i');

        if (isFav) {
            favoriteButton.classList.add('is-favorite');
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
            heartIcon.style.color = '#e74c3c';
        } else {
            favoriteButton.classList.remove('is-favorite');
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
            heartIcon.style.color = '#666';
        }
    }

    function toggleFavorite(id) {
        let favorites = JSON.parse(localStorage.getItem('foodyFavorites') || '[]');
        const index = favorites.indexOf(id);

        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(id);
        }
        localStorage.setItem('foodyFavorites', JSON.stringify(favorites));
        updateFavoriteButtonState(id);
    }

    const recipeId = getRecipeIdFromUrl();

    if (recipeId) {
        displayRecipeDetails(recipeId);
    } else {
        loadingMessage.style.display = 'none';
        errorMessage.textContent = "No recipe ID provided in the URL.";
        errorMessage.style.display = 'block';
    }

    if (favoriteButton) {
        favoriteButton.addEventListener('click', () => {
            const id = favoriteButton.dataset.recipeId;
            if (id) {
                toggleFavorite(id);
            }
        });
    }
});