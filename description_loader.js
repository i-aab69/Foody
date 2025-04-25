document.addEventListener('DOMContentLoaded', () => {

    if (typeof isFavorite !== 'function' || typeof addFavorite !== 'function' || typeof removeFavorite !== 'function') {
       console.error("storageManager.js functions missing for description_loader.js!");
       alert("Error: Can't handle favorites properly. Try refreshing.");
       return;
    }

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
        "cookie01": { title: "Chewy Chocolate Chip Cookies", time: "30 mins", servings: "24 cookies", image: "source/chocolate-chip-cookies.png", description: "Classic chewy cookies packed with chocolate chips. Perfect for any occasion!", ingredients: ["1 cup (2 sticks) unsalted butter, softened", "3/4 cup granulated sugar", "3/4 cup packed brown sugar", "2 large eggs", "1 teaspoon vanilla extract", "2 1/4 cups all-purpose flour", "1 teaspoon baking soda", "1/2 teaspoon salt", "2 cups semi-sweet chocolate chips"], instructions: ["Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.", "Cream together butter and sugars until smooth.", "Beat in eggs one at a time, then stir in vanilla.", "Combine flour, baking soda, and salt; gradually beat into the creamed mixture.", "Stir in chocolate chips.", "Drop rounded tablespoons onto prepared baking sheets.", "Bake for 9 to 11 minutes or until golden brown.", "Cool on baking sheets for a few minutes before transferring to wire racks."] },
        "cake01": { title: "Tasty Chocolate Cake", time: "1 hour", servings: "12 servings", image: "source/chocolate-cake.png", description: "A rich and moist chocolate cake, perfect for birthdays or just because.", ingredients: ["2 cups all-purpose flour", "2 cups sugar", "3/4 cup unsweetened cocoa powder", "2 teaspoons baking soda", "1 teaspoon baking powder", "1 teaspoon salt", "1 cup buttermilk", "1/2 cup vegetable oil", "2 large eggs", "1 teaspoon vanilla extract", "1 cup boiling water"], instructions: ["Preheat oven to 350°F (175°C). Grease and flour two 9-inch round cake pans.", "In a large bowl, whisk together flour, sugar, cocoa, baking soda, baking powder, and salt.", "Add buttermilk, oil, eggs, and vanilla; beat on medium speed for 2 minutes.", "Carefully stir in boiling water (batter will be thin).", "Pour evenly into prepared pans.", "Bake for 30 to 35 minutes, or until a wooden skewer inserted into the center comes out clean.", "Cool in pans for 10 minutes before inverting onto wire racks to cool completely."] },
        "shakshuka01": { title: "Shakshuka", time: "25 mins", servings: "2-3 servings", image: "source/shakshuka.png", description: "A classic North African and Middle Eastern dish...", ingredients: ["1 tbsp olive oil", "1 medium onion", "1 red bell pepper", "3 cloves garlic", "1 tsp ground cumin", "1 tsp sweet paprika", "1/4 tsp cayenne pepper", "1 (28 ounce) can whole peeled tomatoes", "Salt and black pepper", "5-6 large eggs", "Fresh cilantro or parsley"], instructions: ["Heat olive oil...", "Add garlic...", "Pour in tomatoes...", "Make wells...", "Cover and cook...", "Garnish...", "Serve."] },
        "rolls01": { title: "Easy Cinnamon Rolls From Scratch", image: "source/cinnamon-rolls.png", time: "1.5 hours", servings: "12 rolls", description: "Soft, fluffy homemade cinnamon rolls...", ingredients: ["Dough: 1 cup warm milk...", "Filling: 1 cup packed brown sugar...", "Frosting: 4 oz cream cheese..."], instructions: ["Make Dough...", "Make Filling...", "Roll & Cut...", "Second Rise & Bake...", "Make Frosting...", "Frost rolls..."] },
        "pizza01": { title: "Homemade Pizza Recipe", image: "source/homemade-pizza.png", time: "45 mins+", servings: "1 large pizza", description: "Create your perfect pizza at home...", ingredients: ["pizza dough", "pizza sauce", "shredded mozzarella cheese", "Your favorite toppings...", "Cornmeal or flour", "Olive oil (optional)"], instructions: ["Prepare Dough...", "Preheat Oven...", "Shape Dough...", "Assemble Pizza...", "Bake...", "Rest & Serve."] },
        "bread01": { title: "Simply Sandwich Bread", image: "source/sandwich-bread.png", time: "2.5 hours", servings: "1 loaf", description: "A basic, reliable recipe...", ingredients: ["warm water", "active dry yeast", "granulated sugar", "salt", "unsalted butter, melted", "all-purpose flour"], instructions: ["Proof Yeast...", "Mix Dough...", "Knead...", "First Rise...", "Shape Loaf...", "Second Rise...", "Bake...", "Cool."] },
        "fish01": { title: "Quick and Easy Baked Fish Fillet", image: "source/baked-fish.png", time: "20 mins", servings: "2 servings", description: "A simple and healthy way...", ingredients: ["white fish fillets", "olive oil", "lemon juice", "dried oregano or parsley", "Salt and black pepper", "Lemon wedges"], instructions: ["Preheat Oven...", "Prepare Fish...", "Season...", "Bake...", "Serve."] },
        "omelette01": { title: "Classic Omelette", image: "source/omelette.png", time: "10 mins", servings: "1 serving", description: "A quick and versatile breakfast staple.", ingredients: ["large eggs", "milk or water", "Salt and black pepper", "butter or oil", "Optional fillings..."], instructions: ["Whisk Eggs...", "Heat Pan...", "Cook Eggs...", "Add Fillings...", "Fold & Serve."] },
        "redpasta01": { title: "Simple Red Sauce Pasta", image: "source/red_pasta.png", time: "25 mins", servings: "2-3 servings", description: "A quick and easy pasta dish...", ingredients: ["pasta", "olive oil", "garlic", "crushed tomatoes", "dried oregano", "dried basil", "Salt and black pepper", "sugar", "Parmesan cheese"], instructions: ["Cook Pasta...", "Start Sauce...", "Simmer Sauce...", "Combine...", "Serve."] },
        "pancake01": { title: "Fluffy Pancakes", image: "source/placeholder.png", time: "20 mins", servings: "4 servings", description: "Classic fluffy pancakes...", ingredients: ["Flour", "Sugar", "Baking Powder", "Salt", "Milk", "Egg", "Melted Butter"], instructions: ["Mix dry.", "Mix wet.", "Combine.", "Cook.", "Flip.", "Serve."] },
        "fries01": { title: "Crispy French Fries", image: "source/placeholder.png", time: "30 mins", servings: "2 servings", description: "Homemade crispy french fries.", ingredients: ["Potatoes", "Vegetable Oil", "Salt"], instructions: ["Cut potatoes.", "Rinse and dry.", "Heat oil.", "Fry.", "Drain.", "Salt."] },
        "adas01": { title: "Adas Soup (Lentil Soup)", image: "source/placeholder.png", time: "45 mins", servings: "4 servings", description: "A comforting lentil soup.", ingredients: ["Red Lentils", "Onion", "Carrots", "Celery", "Vegetable Broth", "Cumin", "Salt and Pepper", "Lemon Juice"], instructions: ["Sauté veg.", "Add lentils & broth.", "Simmer.", "Blend (optional).", "Serve."] },
    };

    function getRecipeIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function displayRecipeDetails(id) {
        const recipe = recipeData[id];

        if (loadingMessage) loadingMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';

        if (recipe && loadedArea) {
            if (pageTitle) pageTitle.textContent = `Foody - ${recipe.title}`;
            if (titleElement) titleElement.textContent = recipe.title;
            if (timeElement) timeElement.textContent = recipe.time || 'N/A';
            if (servingsElement) servingsElement.textContent = recipe.servings || 'N/A';

            if (imageElement) {
                imageElement.src = recipe.image || 'source/placeholder.png';
                imageElement.alt = recipe.title;
            }
            if (descriptionElement) {
                descriptionElement.textContent = recipe.description || 'No description available.';
            }

            if (ingredientsList) {
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
            }

            if (instructionsList) {
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
            }

            if (favoriteButton) {
                favoriteButton.dataset.recipeId = id;
                updateFavoriteButtonStateUI(id);
            }

            loadedArea.style.display = 'block';

        } else {
        
            if (errorMessage) {
                errorMessage.textContent = `Recipe with ID "${id}" not found.`;
                errorMessage.style.display = 'block';
            }
            if (loadedArea) loadedArea.style.display = 'none';
            if (pageTitle) pageTitle.textContent = `Foody - Recipe Not Found`;
        }
    }

    function updateFavoriteButtonStateUI(id) {
         if (!favoriteButton) return;
         const favState = isFavorite(id);
         const heartIcon = favoriteButton.querySelector('i');
         if (!heartIcon) return;

         favoriteButton.classList.toggle('is-favorite', favState);
         heartIcon.classList.toggle('fas', favState);
         heartIcon.classList.toggle('far', !favState);
         heartIcon.style.color = favState ? '#e74c3c' : '#666';
         favoriteButton.setAttribute('aria-label', favState ? 'Remove from favorites' : 'Add to favorites');
         favoriteButton.setAttribute('aria-pressed', favState ? 'true' : 'false');
    }

    function toggleFavoriteUI(id) {
         if (!favoriteButton) return;
         if (isFavorite(id)) {
             removeFavorite(id);
         } else {
             addFavorite(id);
         }
         updateFavoriteButtonStateUI(id);
    }

    const recipeId = getRecipeIdFromUrl();

    if (recipeId) {
        displayRecipeDetails(recipeId);
    } else {
     
        if (loadingMessage) loadingMessage.style.display = 'none';
        if (errorMessage) {
             errorMessage.textContent = "No recipe ID provided in the URL.";
             errorMessage.style.display = 'block';
        }
        if (loadedArea) loadedArea.style.display = 'none';
        if (pageTitle) pageTitle.textContent = `Foody - Invalid Recipe`;
    }

    
    if (favoriteButton) {
        favoriteButton.addEventListener('click', () => {
            const id = favoriteButton.dataset.recipeId;
            if (id) {
                 toggleFavoriteUI(id);
            } else {
                console.error("Favorite button is missing its recipe ID!");
            }
        });
    }
});


const globalRecipeData = recipeData;