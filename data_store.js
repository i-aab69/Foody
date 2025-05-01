document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.add-recipe-form');
    const recipeName = document.getElementById('recipe-name');
    const recipeInstructions = document.getElementById('recipe-instructions');
    const tagInput = document.getElementById('tag_name');
    const imagePreview = document.getElementById('image-preview');
    
    // Check if we're in edit mode by looking for an ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    
    if (recipeId) {
        // We're in edit mode - load the recipe data
        loadRecipeData(recipeId);
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the number of ingredients
        const ingredientInputs = document.querySelectorAll('input[name="ingredient[]"]');
        const numIngredients = ingredientInputs.length;
        
        // Get the tag value
        const tagValue = tagInput.value;
        
        // Create a recipe object
        let id = recipeId || localStorage.getItem('id');
        
        const recipeData = {
            id: id,
            name: recipeName.value,
            instructions: recipeInstructions.value,
            tag: tagValue,
            ings: numIngredients
        };
        
        // If there's image data, add it to the recipe
        if (imagePreview.src !== '#' && imagePreview.style.display !== 'none') {
            recipeData.image = imagePreview.src;
        }
        
        // Save the recipe to localStorage
        localStorage.setItem(`recipe${id}`, JSON.stringify(recipeData));
        
        // Update the ID counter if we're not in edit mode
        if (!recipeId) {
            localStorage.setItem('id', parseInt(id) + 1);
        }
        
        // Update the all_res list
        updateRecipesList();
        
        // Redirect back to the recipe list page
        window.location.href = 'my_recipe.html';
    });
    
    // Button to add more ingredients
    document.getElementById('add-ingredient-btn').addEventListener('click', function() {
        addNewIngredient();
    });
    
    // Button to add more tags
    document.getElementById('add-tag-btn').addEventListener('click', function() {
        addNewTag();
    });
    
    // Handle file upload for recipe image
    document.getElementById('recipe-image').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Clear form function (for Add Another button)
    document.querySelector('.add-another-btn').addEventListener('click', function() {
        form.reset();
        imagePreview.style.display = 'none';
        imagePreview.src = '#';
        
        // Reset ingredients to just one
        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = `
            <div class="ingredient-item">
                <input type="text" name="ingredient[]" placeholder="e.g., 1 cup flour">
                <button type="button" class="remove-ingredient-btn"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Reset tags to just one
        const tagsList = document.getElementById('tags-list');
        tagsList.innerHTML = `
            <div class="tag-item">
                <input id="tag_name" type="text" name="tag[]" placeholder="e.g., Dessert, Quick, Vegan">
                <button type="button" class="remove-tag-btn"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Set up event listeners for remove buttons
        setupRemoveButtons();
    });
    
    // Cancel button redirects to recipe list
    document.querySelector('.cancel-btn').addEventListener('click', function() {
        window.location.href = 'my_recipe.html';
    });
    
    // Setup initial event listeners for remove buttons
    setupRemoveButtons();
});

// Function to add a new ingredient input
function addNewIngredient() {
    const ingredientsList = document.getElementById('ingredients-list');
    const newIngredient = document.createElement('div');
    newIngredient.className = 'ingredient-item';
    newIngredient.innerHTML = `
        <input type="text" name="ingredient[]" placeholder="e.g., 1 cup flour">
        <button type="button" class="remove-ingredient-btn"><i class="fas fa-times"></i></button>
    `;
    ingredientsList.appendChild(newIngredient);
    
    // Add event listener to remove button
    newIngredient.querySelector('.remove-ingredient-btn').addEventListener('click', function() {
        ingredientsList.removeChild(newIngredient);
    });
}

// Function to add a new tag input
function addNewTag() {
    const tagsList = document.getElementById('tags-list');
    const newTag = document.createElement('div');
    newTag.className = 'tag-item';
    newTag.innerHTML = `
        <input type="text" name="tag[]" placeholder="e.g., Dessert, Quick, Vegan">
        <button type="button" class="remove-tag-btn"><i class="fas fa-times"></i></button>
    `;
    tagsList.appendChild(newTag);
    
    // Add event listener to remove button
    newTag.querySelector('.remove-tag-btn').addEventListener('click', function() {
        tagsList.removeChild(newTag);
    });
}

// Set up event listeners for remove buttons
function setupRemoveButtons() {
    document.querySelectorAll('.remove-ingredient-btn').forEach(button => {
        button.addEventListener('click', function() {
            const ingredientItem = this.parentElement;
            ingredientItem.parentElement.removeChild(ingredientItem);
        });
    });
    
    document.querySelectorAll('.remove-tag-btn').forEach(button => {
        button.addEventListener('click', function() {
            const tagItem = this.parentElement;
            tagItem.parentElement.removeChild(tagItem);
        });
    });
}

// Function to load recipe data for editing
function loadRecipeData(recipeId) {
    // Update form title to show we're editing
    document.querySelector('h1').textContent = 'Edit Recipe';
    
    // Update save button text
    document.querySelector('.save-btn').textContent = 'Update Recipe';
    
    // Get recipe data from localStorage
    const recipeData = JSON.parse(localStorage.getItem(`recipe${recipeId}`));
    
    if (!recipeData) {
        alert('Recipe not found!');
        window.location.href = 'my_recipe.html';
        return;
    }
    
    // Fill in the form fields
    document.getElementById('recipe-name').value = recipeData.name;
    document.getElementById('recipe-instructions').value = recipeData.instructions || '';
    document.getElementById('tag_name').value = recipeData.tag || '';
    
    // Set up ingredients
    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = ''; // Clear existing ingredients
    
    // If we have saved ingredients in a proper array format
    if (recipeData.ingredients && Array.isArray(recipeData.ingredients)) {
        recipeData.ingredients.forEach(ingredient => {
            const newIngredient = document.createElement('div');
            newIngredient.className = 'ingredient-item';
            newIngredient.innerHTML = `
                <input type="text" name="ingredient[]" value="${ingredient}" placeholder="e.g., 1 cup flour">
                <button type="button" class="remove-ingredient-btn"><i class="fas fa-times"></i></button>
            `;
            ingredientsList.appendChild(newIngredient);
        });
    } else {
        // If no ingredients saved or not in array format, add empty inputs based on ings count
        const ingredientCount = recipeData.ings || 1;
        for (let i = 0; i < ingredientCount; i++) {
            const newIngredient = document.createElement('div');
            newIngredient.className = 'ingredient-item';
            newIngredient.innerHTML = `
                <input type="text" name="ingredient[]" placeholder="e.g., 1 cup flour">
                <button type="button" class="remove-ingredient-btn"><i class="fas fa-times"></i></button>
            `;
            ingredientsList.appendChild(newIngredient);
        }
    }
    
    // Set up image if it exists
    if (recipeData.image) {
        const imagePreview = document.getElementById('image-preview');
        imagePreview.src = recipeData.image;
        imagePreview.style.display = 'block';
    }
    
    // Set up event listeners for remove buttons
    setupRemoveButtons();
}

// Function to update the recipes list in localStorage
function updateRecipesList() {
    let all_s_recipe = [];

    for (let index = 0; index < localStorage.length; index++) {
        let key = localStorage.key(index);
        if (key.includes('recipe')) {
            let val = localStorage.getItem(key);
            all_s_recipe.push(val);
        }
    }

    let all_o_recipe = [];
    for (let index = 0; index < all_s_recipe.length; index++) {
        all_o_recipe.push(JSON.parse(all_s_recipe[index]));
    }
    
    all_o_recipe.sort((a, b) => a.id.localeCompare(b.id));
    localStorage.setItem('all_res', JSON.stringify(all_o_recipe));
}