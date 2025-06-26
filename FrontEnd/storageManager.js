// storageManager.js - Handles localStorage operations for favorites

// Static recipe database for hardcoded recipes (same as in description_loader.js)
const staticRecipes = {
    'cookie01': {
        name: 'Chewy Chocolate Chip Cookies',
        time: '25 mins',
        servings: '24 cookies',
        description: 'Classic homemade chocolate chip cookies with a chewy texture and perfect balance of sweetness.',
        img: 'source/chocolate-chip-cookies.png',
        ingredients: [
            '2 1/4 cups all-purpose flour',
            '1 cup butter, softened',
            '3/4 cup granulated sugar',
            '3/4 cup brown sugar',
            '2 large eggs',
            '2 tsp vanilla extract',
            '1 tsp baking soda',
            '1/2 tsp salt',
            '2 cups chocolate chips'
        ],
        instructions: [
            'Preheat oven to 375°F (190°C)',
            'Cream butter and sugars until fluffy',
            'Beat in eggs and vanilla extract',
            'Mix in flour, baking soda, and salt',
            'Stir in chocolate chips',
            'Drop rounded spoonfuls onto ungreased baking sheets',
            'Bake for 9-11 minutes until golden brown',
            'Cool on baking sheets for 2 minutes',
            'Transfer to wire racks to cool completely'
        ],
        tags: ['Baking Recipes', 'Dessert', 'Quick']
    },
    'cake01': {
        name: 'Tasty Chocolate Cake',
        time: '45 mins',
        servings: '12 slices',
        description: 'Rich and moist chocolate cake perfect for any celebration or sweet craving.',
        img: 'source/chocolate-cake.png',
        ingredients: [
            '2 cups all-purpose flour',
            '2 cups sugar',
            '3/4 cup cocoa powder',
            '2 eggs',
            '1 cup milk',
            '1/2 cup vegetable oil',
            '2 tsp vanilla extract',
            '1 1/2 tsp baking soda',
            '1 tsp salt',
            '1 cup hot water'
        ],
        instructions: [
            'Preheat oven to 350°F (175°C)',
            'Mix dry ingredients in large bowl',
            'Add wet ingredients and mix well',
            'Stir in hot water (batter will be thin)',
            'Pour into greased 9x13 inch cake pan',
            'Bake for 30-35 minutes until toothpick comes out clean',
            'Cool completely before frosting',
            'Frost with your favorite chocolate frosting'
        ],
        tags: ['Baking Recipes', 'Dessert', 'Chocolate']
    },
    'rolls01': {
        name: 'Easy Cinnamon Rolls From Scratch',
        time: '2 hours',
        servings: '12 rolls',
        description: 'Soft and fluffy cinnamon rolls with a sweet cinnamon filling and creamy glaze.',
        img: 'source/cinnamon-rolls.png',
        ingredients: [
            '3 cups all-purpose flour',
            '1/4 cup sugar',
            '1 package active dry yeast',
            '1/2 cup warm milk',
            '1/4 cup butter, melted',
            '1 egg',
            '1/3 cup brown sugar',
            '2 tsp ground cinnamon',
            '1/4 cup butter, softened',
            '1 cup powdered sugar',
            '2 tbsp milk'
        ],
        instructions: [
            'Mix flour, sugar, and yeast in large bowl',
            'Add warm milk, melted butter, and egg',
            'Knead dough until smooth and elastic',
            'Let rise in warm place for 1 hour',
            'Roll out dough and spread with softened butter',
            'Sprinkle with brown sugar and cinnamon',
            'Roll up tightly and cut into 12 pieces',
            'Place in greased baking pan and let rise again',
            'Bake at 375°F for 20-25 minutes',
            'Mix powdered sugar and milk for glaze',
            'Drizzle glaze over warm rolls'
        ],
        tags: ['Baking Recipes', 'Breakfast', 'Sweet']
    },
    'pizza01': {
        name: 'Homemade Pizza Recipe',
        time: '1 hour',
        servings: '4 servings',
        description: 'Crispy crust pizza with your favorite toppings, made from scratch.',
        img: 'source/homemade-pizza.png',
        ingredients: [
            '3 cups all-purpose flour',
            '1 cup warm water',
            '2 1/4 tsp active dry yeast',
            '1 tbsp olive oil',
            '1 tsp salt',
            '1 cup pizza sauce',
            '2 cups shredded mozzarella cheese',
            'Your favorite toppings (pepperoni, mushrooms, etc.)',
            'Fresh basil leaves'
        ],
        instructions: [
            'Mix flour, water, yeast, olive oil, and salt',
            'Knead dough until smooth and elastic',
            'Let rise in warm place for 30 minutes',
            'Roll out dough to desired thickness',
            'Preheat oven to 450°F (230°C)',
            'Spread pizza sauce over dough',
            'Add cheese and your favorite toppings',
            'Bake for 15-20 minutes until crust is golden',
            'Let cool slightly before slicing',
            'Garnish with fresh basil if desired'
        ],
        tags: ['Main Course', 'Italian', 'Dinner']
    },
    'bread01': {
        name: 'Simply Sandwich Bread',
        time: '3 hours',
        servings: '1 loaf',
        description: 'Soft and fluffy homemade sandwich bread perfect for toasting or sandwiches.',
        img: 'source/sandwich-bread.png',
        ingredients: [
            '4 cups bread flour',
            '2 tsp active dry yeast',
            '1 1/2 cups warm water',
            '2 tbsp honey',
            '2 tbsp olive oil',
            '1 1/2 tsp salt',
            '1 tbsp butter for greasing'
        ],
        instructions: [
            'Mix flour, yeast, water, honey, olive oil, and salt',
            'Knead dough until smooth and elastic',
            'Let rise in warm place for 1 hour',
            'Punch down dough and shape into loaf',
            'Place in greased 9x5 inch loaf pan',
            'Let rise again for 30-45 minutes',
            'Preheat oven to 375°F (190°C)',
            'Bake for 30-35 minutes until golden brown',
            'Remove from pan and cool on wire rack',
            'Slice when completely cool'
        ],
        tags: ['Baking Recipes', 'Bread', 'Breakfast']
    },
    'fish01': {
        name: 'Quick and Easy Baked Fish Fillet',
        time: '20 mins',
        servings: '2 servings',
        description: 'Light and healthy baked fish with lemon and herbs, ready in minutes.',
        img: 'source/baked-fish.png',
        ingredients: [
            '2 fish fillets (cod or tilapia)',
            '2 tbsp olive oil',
            '1 lemon, sliced',
            '2 cloves garlic, minced',
            '1/4 cup breadcrumbs',
            '1 tbsp fresh parsley, chopped',
            'Salt and pepper to taste',
            '1 tbsp butter'
        ],
        instructions: [
            'Preheat oven to 400°F (200°C)',
            'Season fish fillets with salt and pepper',
            'Place fillets in greased baking dish',
            'Top with minced garlic and lemon slices',
            'Sprinkle with breadcrumbs and parsley',
            'Drizzle with olive oil and dot with butter',
            'Bake for 12-15 minutes until fish flakes easily',
            'Serve immediately with lemon wedges',
            'Garnish with fresh parsley if desired'
        ],
        tags: ['Main Course', 'Healthy', 'Quick']
    }
};

// Key for storing favorites in localStorage
const FAVORITES_KEY = 'foody_favorites';

// Get favorites from localStorage
function getFavorites() {
    const favoritesJson = localStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
}

// Save favorites to localStorage
function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Check if a recipe is in favorites
function isFavorite(recipeId) {
    const favorites = getFavorites();
    const currentUser = JSON.parse(localStorage.getItem("LoggedUser"));
    
    if (!currentUser) {
        return false;
    }
    
    return favorites.some(fav => 
        fav.recipeId === recipeId.toString() && 
        fav.UserName === currentUser.UserName
    );
}

// Add a recipe to favorites
function addFavorite(recipeId) { 
    const favorites = getFavorites();
    const currentUser = JSON.parse(localStorage.getItem("LoggedUser"));
    
    if (!currentUser) {
        console.error("No logged user found");
        return;
    }
    
    const recipeIdStr = recipeId.toString();
    const existingFavorite = favorites.find(fav => 
        fav.recipeId === recipeIdStr && 
        fav.UserName === currentUser.UserName
    );
    
    if (!existingFavorite) {
        favorites.push({
            "recipeId": recipeIdStr, 
            "UserName": currentUser.UserName 
        });
        saveFavorites(favorites);
        console.log(`Added recipe ${recipeIdStr} to favorites for user ${currentUser.UserName}`);
    }
}

// Remove a recipe from favorites
function removeFavorite(recipeId) {
    const favorites = getFavorites();
    const currentUser = JSON.parse(localStorage.getItem("LoggedUser"));
    
    if (!currentUser) {
        console.error("No logged user found");
        return;
    }
    
    const recipeIdStr = recipeId.toString();
    console.log(`Removing recipe: ${recipeIdStr} for user: ${currentUser.UserName}`);
    
    const index = favorites.findIndex(fav => 
        fav.recipeId === recipeIdStr && 
        fav.UserName === currentUser.UserName
    );
    
    if (index !== -1) {
        favorites.splice(index, 1);
        saveFavorites(favorites);
        console.log(`Successfully removed recipe ${recipeIdStr} from favorites`);
    } else {
        console.log(`Recipe ${recipeIdStr} not found in favorites for user ${currentUser.UserName}`);
    }
}

// Get all favorite recipes
function getAllFavoriteRecipes() {
    const favorites = getFavorites();
    const allRecipes = JSON.parse(localStorage.getItem('all_res')) || [];
    const currentUser = JSON.parse(localStorage.getItem("LoggedUser"));
    
    if (!currentUser) {
        console.error("No logged user found");
        return [];
    }

    const filteredRecipes = [];
    
    favorites.forEach(favorite => {
        if (favorite.UserName === currentUser.UserName) {
            // First check if it's a static recipe
            if (staticRecipes && staticRecipes[favorite.recipeId]) {
                console.log(`Found static recipe: ${favorite.recipeId}`);
                const staticRecipe = staticRecipes[favorite.recipeId];
                // Add the recipe ID to the static recipe data
                staticRecipe.recipeId = favorite.recipeId;
                filteredRecipes.push(staticRecipe);
            } else {
                // Check dynamic recipes from localStorage
                const dynamicRecipe = allRecipes.find(recipe => 
                    recipe.pk == favorite.recipeId || 
                    recipe.id == favorite.recipeId || 
                    recipe.name == favorite.recipeId
                );
                if (dynamicRecipe) {
                    console.log(`Found dynamic recipe: ${favorite.recipeId}`);
                    // Add the recipe ID to the dynamic recipe data
                    dynamicRecipe.recipeId = favorite.recipeId;
                    filteredRecipes.push(dynamicRecipe);
                } else {
                    console.log(`Recipe not found: ${favorite.recipeId}`);
                }
            }
        }
    });
    
    return filteredRecipes;
}

function getAllRecipes(){
    const allRecipes = JSON.parse(localStorage.getItem('all_res')) || [];
    return allRecipes ; 
}