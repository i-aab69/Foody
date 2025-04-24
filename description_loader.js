// Foody-main/description_loader.js (Updated to use storageManager.js)

document.addEventListener('DOMContentLoaded', () => {
    // Check if storageManager functions are available
    if (typeof isFavorite !== 'function' || typeof addFavorite !== 'function' || typeof removeFavorite !== 'function') {
       console.error("storageManager.js functions not loaded before description_loader.js!");
       alert("Error: Essential functions missing. Please contact support.");
       return; // Stop execution
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

    // Recipe Data (with added details)
    const recipeData = {
        "cookie01": { title: "Chewy Chocolate Chip Cookies", time: "30 mins", servings: "24 cookies", image: "source/chocolate-chip-cookies.png", description: "Classic chewy cookies packed with chocolate chips. Perfect for any occasion!", ingredients: ["1 cup (2 sticks) unsalted butter, softened", "3/4 cup granulated sugar", "3/4 cup packed brown sugar", "2 large eggs", "1 teaspoon vanilla extract", "2 1/4 cups all-purpose flour", "1 teaspoon baking soda", "1/2 teaspoon salt", "2 cups semi-sweet chocolate chips"], instructions: ["Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.", "Cream together butter and sugars until smooth.", "Beat in eggs one at a time, then stir in vanilla.", "Combine flour, baking soda, and salt; gradually beat into the creamed mixture.", "Stir in chocolate chips.", "Drop rounded tablespoons onto prepared baking sheets.", "Bake for 9 to 11 minutes or until golden brown.", "Cool on baking sheets for a few minutes before transferring to wire racks."] },
        "cake01": { title: "Tasty Chocolate Cake", time: "1 hour", servings: "12 servings", image: "source/chocolate-cake.png", description: "A rich and moist chocolate cake, perfect for birthdays or just because.", ingredients: ["2 cups all-purpose flour", "2 cups sugar", "3/4 cup unsweetened cocoa powder", "2 teaspoons baking soda", "1 teaspoon baking powder", "1 teaspoon salt", "1 cup buttermilk", "1/2 cup vegetable oil", "2 large eggs", "1 teaspoon vanilla extract", "1 cup boiling water"], instructions: ["Preheat oven to 350°F (175°C). Grease and flour two 9-inch round cake pans.", "In a large bowl, whisk together flour, sugar, cocoa, baking soda, baking powder, and salt.", "Add buttermilk, oil, eggs, and vanilla; beat on medium speed for 2 minutes.", "Carefully stir in boiling water (batter will be thin).", "Pour evenly into prepared pans.", "Bake for 30 to 35 minutes, or until a wooden skewer inserted into the center comes out clean.", "Cool in pans for 10 minutes before inverting onto wire racks to cool completely."] },
        "shakshuka01": { title: "Shakshuka", time: "25 mins", servings: "2-3 servings", image: "source/shakshuka.png", description: "A classic North African and Middle Eastern dish of eggs poached in a spicy tomato and pepper sauce. Perfect for breakfast or brunch.", ingredients: ["1 tbsp olive oil", "1 medium onion, chopped", "1 red bell pepper, seeded and chopped", "3 cloves garlic, minced", "1 tsp ground cumin", "1 tsp sweet paprika", "1/4 tsp cayenne pepper (or to taste)", "1 (28 ounce) can whole peeled tomatoes, crushed", "Salt and black pepper to taste", "5-6 large eggs", "Fresh cilantro or parsley, chopped (for garnish)"], instructions: ["Heat olive oil in a large oven-safe skillet or cast iron pan over medium heat. Add onion and bell pepper and cook until softened, about 5-7 minutes.", "Add garlic and spices (cumin, paprika, cayenne) and cook for another minute until fragrant.", "Pour in the crushed tomatoes and season with salt and pepper. Bring to a simmer and cook for 10 minutes, stirring occasionally, until the sauce thickens slightly.", "Use a spoon to make small wells in the sauce. Crack an egg directly into each well.", "Cover the skillet and cook for 5-8 minutes, or until the egg whites are set but the yolks are still runny (or cook longer to your preference).", "Garnish generously with fresh cilantro or parsley.", "Serve immediately with crusty bread for dipping."] },
        "rolls01": { title: "Easy Cinnamon Rolls From Scratch", image: "source/cinnamon-rolls.png", time: "1.5 hours", servings: "12 rolls", description: "Soft, fluffy homemade cinnamon rolls with a sweet cream cheese frosting. Easier than you think!", ingredients: ["Dough: 1 cup warm milk, 2 1/4 tsp active dry yeast, 1/2 cup granulated sugar, 1/3 cup melted butter, 1 tsp salt, 2 large eggs, 4 cups all-purpose flour", "Filling: 1 cup packed brown sugar, 2 1/2 tbsp ground cinnamon, 1/3 cup softened butter", "Frosting: 4 oz cream cheese (softened), 1/4 cup softened butter, 1 1/2 cups powdered sugar, 1/2 tsp vanilla extract, 1-2 tbsp milk"], instructions: ["Make Dough: Combine warm milk and yeast. Let sit 5 mins. Stir in sugar, melted butter, salt, eggs. Gradually add flour, mix until dough forms. Knead 5-7 mins until smooth. Let rise in oiled bowl for 1 hour or until doubled.", "Make Filling: Combine brown sugar and cinnamon. Roll dough into 15x9 inch rectangle. Spread softened butter over dough. Sprinkle cinnamon-sugar mixture evenly.", "Roll & Cut: Tightly roll dough starting from long edge. Cut into 12 slices. Place in greased 9x13 inch pan.", "Second Rise & Bake: Cover and let rise 30 mins. Preheat oven to 375°F (190°C). Bake 15-20 mins until golden brown.", "Make Frosting: Beat cream cheese and butter until smooth. Beat in powdered sugar, vanilla, and enough milk for desired consistency.", "Frost rolls while slightly warm."] },
        "pizza01": { title: "Homemade Pizza Recipe", image: "source/homemade-pizza.png", time: "45 mins (plus dough rise time)", servings: "1 large pizza", description: "Create your perfect pizza at home with your favorite toppings.", ingredients: ["1 batch pizza dough (store-bought or homemade)", "1/2 cup pizza sauce", "1 1/2 cups shredded mozzarella cheese", "Your favorite toppings (pepperoni, mushrooms, onions, peppers, etc.)", "Cornmeal or flour for dusting", "Olive oil (optional)"], instructions: ["Prepare Dough: If using homemade, prepare according to recipe. If store-bought, let it come to room temperature.", "Preheat Oven: Preheat oven to highest setting (usually 475-500°F or 245-260°C). Place pizza stone or baking sheet in oven while preheating.", "Shape Dough: Lightly dust surface with flour or cornmeal. Stretch or roll dough into desired shape (approx. 12-14 inches).", "Assemble Pizza: Carefully transfer dough to parchment paper or a cornmeal-dusted pizza peel. Brush dough lightly with olive oil (optional). Spread pizza sauce evenly, leaving a small border. Sprinkle with mozzarella cheese. Add desired toppings.", "Bake: Carefully slide pizza (with parchment, if using) onto preheated stone or baking sheet. Bake for 10-15 minutes, or until crust is golden brown and cheese is bubbly and melted.", "Rest & Serve: Let pizza rest for a few minutes before slicing and serving."] },
        "bread01": { title: "Simply Sandwich Bread", image: "source/sandwich-bread.png", time: "2.5 hours", servings: "1 loaf", description: "A basic, reliable recipe for soft white sandwich bread, perfect for toast and sandwiches.", ingredients: ["1 cup warm water (105-115°F)", "2 1/4 tsp active dry yeast (1 packet)", "2 tbsp granulated sugar", "1 1/2 tsp salt", "2 tbsp unsalted butter, melted", "3 - 3 1/2 cups all-purpose flour"], instructions: ["Proof Yeast: Combine warm water, yeast, and sugar in a large bowl (or stand mixer bowl). Let sit for 5-10 minutes until foamy.", "Mix Dough: Stir in salt and melted butter. Gradually add flour, starting with 3 cups, mixing until a shaggy dough forms.", "Knead: Turn dough onto a lightly floured surface. Knead for 8-10 minutes (or 5-7 mins with mixer dough hook) until smooth and elastic, adding more flour sparingly if too sticky.", "First Rise: Place dough in a lightly oiled bowl, turn to coat. Cover and let rise in a warm place for 1-1.5 hours, or until doubled in size.", "Shape Loaf: Gently punch down dough. Shape into a rectangle roughly 8x12 inches. Roll up tightly starting from short edge. Pinch seam to seal. Place seam-down in a greased 8.5x4.5 inch loaf pan.", "Second Rise: Cover and let rise for 30-60 minutes, or until nearly doubled.", "Bake: Preheat oven to 375°F (190°C). Bake loaf for 30-35 minutes, or until golden brown and internal temperature reaches 190-200°F (88-93°C).", "Cool: Immediately remove bread from pan and let cool completely on a wire rack before slicing."] },
        "fish01": { title: "Quick and Easy Baked Fish Fillet", image: "source/baked-fish.png", time: "20 mins", servings: "2 servings", description: "A simple and healthy way to prepare flaky white fish fillets.", ingredients: ["2 white fish fillets (cod, tilapia, haddock, etc.), about 6 oz each", "1 tbsp olive oil", "1 tbsp lemon juice", "1/2 tsp dried oregano or parsley", "Salt and black pepper to taste", "Lemon wedges for serving (optional)"], instructions: ["Preheat Oven: Preheat oven to 400°F (200°C).", "Prepare Fish: Pat fish fillets dry with paper towels. Place them in a single layer in a lightly greased baking dish or on a baking sheet lined with parchment paper.", "Season: Drizzle olive oil and lemon juice over the fish. Sprinkle with oregano (or parsley), salt, and pepper.", "Bake: Bake for 12-15 minutes, or until fish is opaque and flakes easily with a fork. Cooking time will vary depending on fillet thickness.", "Serve: Serve immediately, garnished with fresh lemon wedges if desired."] },
        "omelette01": { title: "Classic Omelette", image: "source/omelette.png", time: "10 mins", servings: "1 serving", description: "A quick and versatile breakfast staple.", ingredients: ["2 large eggs", "1 tbsp milk or water", "Salt and black pepper to taste", "1 tsp butter or oil", "Optional fillings: shredded cheese, chopped ham, cooked vegetables (mushrooms, onions, peppers)"], instructions: ["Whisk Eggs: In a small bowl, whisk together eggs, milk (or water), salt, and pepper until just combined (don't over-whisk).", "Heat Pan: Heat butter or oil in a small non-stick skillet (around 8 inches) over medium heat until melted and shimmering.", "Cook Eggs: Pour egg mixture into the hot pan. As the edges start to set, gently lift them with a spatula and tilt the pan to allow uncooked egg to flow underneath. Cook for 1-2 minutes until eggs are mostly set but still slightly moist on top.", "Add Fillings: Sprinkle desired fillings over one half of the omelette.", "Fold & Serve: Carefully fold the other half of the omelette over the fillings. Cook for another 30 seconds to 1 minute until cheese is melted (if using). Slide onto a plate and serve immediately."] },
         "redpasta01": { title: "Simple Red Sauce Pasta", image: "source/red_pasta.png", time: "25 mins", servings: "2-3 servings", description: "A quick and easy pasta dish with a classic tomato-based red sauce.", ingredients: ["8 oz pasta (spaghetti, penne, fusilli, etc.)", "1 tbsp olive oil", "2 cloves garlic, minced", "1 (28 ounce) can crushed tomatoes", "1/2 tsp dried oregano", "1/2 tsp dried basil", "Salt and black pepper to taste", "Pinch of sugar (optional, to balance acidity)", "Grated Parmesan cheese for serving (optional)"], instructions: ["Cook Pasta: Cook pasta according to package directions until al dente. Drain, reserving about 1/2 cup of pasta water.", "Start Sauce: While pasta cooks, heat olive oil in a large skillet or saucepan over medium heat. Add minced garlic and cook for about 30-60 seconds until fragrant (do not brown).", "Simmer Sauce: Pour in crushed tomatoes. Stir in oregano, basil, salt, pepper, and optional sugar. Bring to a simmer, then reduce heat to low and let it gently simmer for 10-15 minutes, stirring occasionally.", "Combine: Add the drained pasta to the sauce. Toss to coat evenly. If the sauce seems too thick, add a splash of the reserved pasta water until it reaches desired consistency.", "Serve: Serve hot, topped with grated Parmesan cheese if desired."] },
        "pancake01": { title: "Fluffy Pancakes", image: "source/placeholder.png", time: "20 mins", servings: "4 servings", description: "Classic fluffy pancakes, perfect for breakfast.", ingredients: ["1 1/2 cups Flour", "1 tbsp Sugar", "1 tsp Baking Powder", "1/2 tsp Salt", "1 1/4 cups Milk", "1 Egg", "3 tbsp Melted Butter"], instructions: ["Mix dry ingredients.", "Mix wet ingredients.", "Combine wet and dry, don't overmix.", "Cook on lightly oiled griddle.", "Flip when bubbly.", "Serve warm."] },
        "fries01": { title: "Crispy French Fries", image: "source/placeholder.png", time: "30 mins", servings: "2 servings", description: "Homemade crispy french fries.", ingredients: ["2 large Potatoes", "Vegetable Oil for frying", "Salt to taste"], instructions: ["Peel and cut potatoes into strips.", "Rinse and pat dry thoroughly.", "Heat oil in a deep pot or fryer to 350°F (175°C).", "Fry potatoes in batches for 5-7 minutes until golden brown.", "Drain on paper towels.", "Season with salt immediately."] },
         "adas01": { title: "Adas Soup (Lentil Soup)", image: "source/placeholder.png", time: "45 mins", servings: "4 servings", description: "A comforting and nutritious Middle Eastern lentil soup.", ingredients: ["1 cup Red Lentils (rinsed)", "1 Onion (chopped)", "2 Carrots (chopped)", "2 Celery Stalks (chopped)", "4 cups Vegetable Broth", "1 tsp Cumin", "Salt and Pepper to taste", "Lemon Juice (optional)"], instructions: ["Sauté onion, carrots, celery until soft.", "Add rinsed lentils, broth, cumin, salt, pepper.", "Bring to boil, then simmer covered for 25-30 mins until lentils are tender.", "Blend partially or fully for desired consistency (optional).", "Serve hot, garnish with lemon juice if desired."] },
    };

    // --- Functions ---

    function getRecipeIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function displayRecipeDetails(id) {
        const recipe = recipeData[id];
        if (loadingMessage) loadingMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';

        if (recipe) {
            if (pageTitle) pageTitle.textContent = `Foody - ${recipe.title}`;
            if (titleElement) titleElement.textContent = recipe.title;
            if (timeElement) timeElement.textContent = recipe.time || 'N/A';
            if (servingsElement) servingsElement.textContent = recipe.servings || 'N/A';
            if (imageElement) {
                imageElement.src = recipe.image || 'source/placeholder.png';
                imageElement.alt = recipe.title;
            }
            if (descriptionElement) descriptionElement.textContent = recipe.description || 'No description available.';

            if (ingredientsList) {
                ingredientsList.innerHTML = '';
                if (recipe.ingredients && recipe.ingredients.length > 0) {
                    recipe.ingredients.forEach(item => {
                        const li = document.createElement('li'); li.textContent = item; ingredientsList.appendChild(li);
                    });
                } else { ingredientsList.innerHTML = '<li>Ingredients not listed.</li>'; }
            }

            if (instructionsList) {
                instructionsList.innerHTML = '';
                if (recipe.instructions && recipe.instructions.length > 0) {
                    recipe.instructions.forEach(step => {
                        const li = document.createElement('li'); li.textContent = step; instructionsList.appendChild(li);
                    });
                } else { instructionsList.innerHTML = '<li>Instructions not listed.</li>'; }
            }

            if (favoriteButton) {
                favoriteButton.dataset.recipeId = id;
                updateFavoriteButtonStateUI(id); // Use new UI update function
            }
            if (loadedArea) loadedArea.style.display = 'block';

        } else {
            // Recipe not found
            if (errorMessage) {
                errorMessage.textContent = `Recipe with ID "${id}" not found.`;
                errorMessage.style.display = 'block';
            }
            if (loadedArea) loadedArea.style.display = 'none';
            if (pageTitle) pageTitle.textContent = `Foody - Recipe Not Found`;
        }
    }

    /** Updates the button UI based on favorite state from storageManager */
    function updateFavoriteButtonStateUI(id) {
         if (!favoriteButton) return;
         // --- Use storageManager ---
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

    /** Toggles favorite status using storageManager and updates UI */
    function toggleFavoriteUI(id) {
         if (!favoriteButton) return;
          // --- Use storageManager ---
         if (isFavorite(id)) {
             removeFavorite(id);
         } else {
             addFavorite(id);
         }
         updateFavoriteButtonStateUI(id); // Update button visuals immediately
    }

    // --- Initialization ---
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

    // Add event listener for the favorite button
    if (favoriteButton) {
        favoriteButton.addEventListener('click', () => {
            const id = favoriteButton.dataset.recipeId;
            if (id) {
                 toggleFavoriteUI(id); // Use new toggle function
            } else {
                console.error("Favorite button clicked, but no recipe ID found on it.");
            }
        });
    }
});