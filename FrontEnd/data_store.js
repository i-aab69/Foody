import { get_rec, send_rec,get_ing } from "./API_Calls.js";

async function getAllRecipes() {
   
    const recipes = await get_rec()
    recipes.forEach((recipe, index) => {recipe.id = index+1})
    
    
    
    
    localStorage.setItem('all_res', JSON.stringify(recipes));
    
    return recipes;
}

async function getAllIngs() {
   
    const ings = await get_ing()
    
    
    localStorage.setItem('all_ings', JSON.stringify(ings));
    
    return ings;
}

document.addEventListener('DOMContentLoaded',async function () {
    const form = document.querySelector('.add-recipe-form');
    const recipeName = document.getElementById('recipe-name');
    const recipeInstructions = document.getElementById('recipe-instructions');
    const imagePreview = document.getElementById('image-preview');

    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (recipeId) {
        await loadRecipeData(recipeId);
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const ingredientInputs = document.querySelectorAll('input[name="ingredient[]"]');
        const tagInputs = document.querySelectorAll('input[name="tag[]"]');

        const ingredientValues = Array.from(ingredientInputs)
            .map(input => input.value.trim())
            .filter(v => v !== '');

        const tagValues = Array.from(tagInputs)
            .map(input => input.value.trim())
            .filter(v => v !== '');

        let id = recipeId 

        

        
        //the problem possible to be hehe
        const isUpdateMode = document.getElementById('Save').innerHTML === "Update Recipe";
        
        if (isUpdateMode) {
            // Update existing recipe
            await updateExistingRecipe(recipeId, recipeName, recipeInstructions, ingredientValues, tagValues, imagePreview);
        } else {
            // Create new recipe
            const recipeData = {
                name: recipeName.value,
                instructions: recipeInstructions.value,
                tags: tagValues,  // Changed from 'tag' to 'tags'
                ings: ingredientValues  // Backend expects 'ings' for ingredient names
            };
            
            // Changed from 'image' to 'img' to match backend
            if (imagePreview.src !== '#' && imagePreview.style.display !== 'none') {
                recipeData.img = imagePreview.src;
                console.log('Image added to recipe data:', recipeData.img.substring(0, 50) + '...');
            } else {
                console.log('No image selected');
            }
            
            console.log('Sending recipe data:', recipeData);
            const response = await send_rec(recipeData)
            if(response.status === 201){
                const response_body = await response.json()
                console.log(response_body)
                const id = response_body
                
                recipeData.id = id
                localStorage.setItem(`recipe${id}`, JSON.stringify(recipeData));

                if (!recipeId) {
                    localStorage.setItem('id', parseInt(id) + 1);
                }
                console.log("recipe added seccessfully")
                updateRecipesList();
                window.location.href = 'my_recipe.html';
            }
        }
        

      
    });

    // Handle update recipe when form is submitted
    if(document.getElementById('Save').innerHTML === "Update Recipe"){
        // The form submit handler will handle the update
        console.log('Update mode activated for recipe:', recipeId);
    }

    document.getElementById('add-ingredient-btn').addEventListener('click', addNewIngredient);
    document.getElementById('add-tag-btn').addEventListener('click', addNewTag);

    document.getElementById('recipe-image').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    document.querySelector('.add-another-btn').addEventListener('click', function () {
        form.reset();
        imagePreview.style.display = 'none';
        imagePreview.src = '#';

        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = `
            <div class="ingredient-item">
                <input type="text" name="ingredient[]" placeholder="e.g., 1 cup flour">
                <button type="button" class="remove-ingredient-btn"><i class="fas fa-times"></i></button>
            </div>
        `;

        const tagsList = document.getElementById('tags-list');
        tagsList.innerHTML = `
            <div class="tag-item">
                <input type="text" name="tag[]" placeholder="e.g., Dessert, Quick, Vegan">
                <button type="button" class="remove-tag-btn"><i class="fas fa-times"></i></button>
            </div>
        `;

        setupRemoveButtons();
    });

    document.querySelector('.cancel-btn').addEventListener('click', function () {
        window.location.href = 'my_recipe.html';
    });

    setupRemoveButtons();
});

function addNewIngredient() {
    const ingredientsList = document.getElementById('ingredients-list');
    const newIngredient = document.createElement('div');
    newIngredient.className = 'ingredient-item';
    newIngredient.innerHTML = `
        <input type="text" name="ingredient[]" placeholder="e.g., 1 cup flour">
        <button type="button" class="remove-ingredient-btn"><i class="fas fa-times"></i></button>
    `;
    ingredientsList.appendChild(newIngredient);
    newIngredient.querySelector('.remove-ingredient-btn').addEventListener('click', () => {
        ingredientsList.removeChild(newIngredient);
    });
}

function addNewTag() {
    const tagsList = document.getElementById('tags-list');
    const newTag = document.createElement('div');
    newTag.className = 'tag-item';
    newTag.innerHTML = `
        <input type="text" name="tag[]" placeholder="e.g., Dessert, Quick, Vegan">
        <button type="button" class="remove-tag-btn"><i class="fas fa-times"></i></button>
    `;
    tagsList.appendChild(newTag);
    newTag.querySelector('.remove-tag-btn').addEventListener('click', () => {
        tagsList.removeChild(newTag);
    });
}

function setupRemoveButtons() {
    document.querySelectorAll('.remove-ingredient-btn').forEach(button => {
        button.addEventListener('click', function () {
            this.parentElement.remove();
        });
    });

    document.querySelectorAll('.remove-tag-btn').forEach(button => {
        button.addEventListener('click', function () {
            this.parentElement.remove();
        });
    });
}

async function get_recipe(recipeId) {
    const all_res = await getAllRecipes();
    const recipeData = all_res.find((recipe) => {return recipe.pk == recipeId})
    return recipeData
}

async function loadRecipeData(recipeId) {
    document.querySelector('h1').textContent = 'Edit Recipe';
    document.querySelector('.save-btn').textContent = 'Update Recipe';
    console.log('Loading recipe ID:', recipeId)
   
    const recipeData = await get_recipe(recipeId)
    console.log('Recipe data loaded:', recipeData);

    if (!recipeData) {
        alert('Recipe not found!');
        window.location.href = 'my_recipe.html';
        return;
    }

    document.getElementById('recipe-name').value = recipeData.name;
    document.getElementById('recipe-instructions').value = recipeData.instructions || '';

    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';

    if (recipeData.ingredients && Array.isArray(recipeData.ingredients)) {
        const all_ings = await getAllIngs();
        const ings_names = all_ings.filter((ing) => {return recipeData.ingredients.includes(ing.pk)})
        ings_names.forEach(ingredient => {
            const newIngredient = document.createElement('div');
            newIngredient.className = 'ingredient-item';
            newIngredient.innerHTML = `
                <input type="text" name="ingredient[]" value="${ingredient.name}" placeholder="e.g., 1 cup flour">
                <button type="button" class="remove-ingredient-btn"><i class="fas fa-times"></i></button>
            `;
            ingredientsList.appendChild(newIngredient);
        });
    }

    const tagsList = document.getElementById('tags-list');
    tagsList.innerHTML = '';

    // Handle both 'tags' and 'tag' field names due to data structure inconsistency
    const recipeTags = recipeData.tags || recipeData.tag || [];
    console.log('Recipe tags (IDs):', recipeTags);
    
    if (recipeTags && Array.isArray(recipeTags)) {
        // Convert tag IDs to tag names before displaying
        try {
            const tagNames = await getTagNames(recipeTags);
            console.log('Recipe tag names:', tagNames);
            
            tagNames.forEach(tagName => {
                const newTag = document.createElement('div');
                newTag.className = 'tag-item';
                newTag.innerHTML = `
                    <input type="text" name="tag[]" value="${tagName}" placeholder="e.g., Dessert, Quick, Vegan">
                    <button type="button" class="remove-tag-btn"><i class="fas fa-times"></i></button>
                `;
                tagsList.appendChild(newTag);
            });
        } catch (error) {
            console.error('Error loading tag names:', error);
            // Fallback: display the IDs if tag name fetching fails
            recipeTags.forEach(tag => {
                const newTag = document.createElement('div');
                newTag.className = 'tag-item';
                newTag.innerHTML = `
                    <input type="text" name="tag[]" value="${tag}" placeholder="e.g., Dessert, Quick, Vegan">
                    <button type="button" class="remove-tag-btn"><i class="fas fa-times"></i></button>
                `;
                tagsList.appendChild(newTag);
            });
        }
    }

    // Load existing image
    if (recipeData.img) {
        const imagePreview = document.getElementById('image-preview');
        imagePreview.src = recipeData.img;
        imagePreview.style.display = 'block';
    }

    setupRemoveButtons();
    
}

// Update existing recipe function
async function updateExistingRecipe(recipeId, recipeName, recipeInstructions, ingredientValues, tagValues, imagePreview) {
    try {
        // Get original recipe data to compare changes
        const originalRecipe = await get_recipe(recipeId);
        if (!originalRecipe) {
            alert('Recipe not found!');
            return;
        }

        // Prepare update data - only include changed fields
        const updateData = {};
        
        // Check name change
        if (originalRecipe.name !== recipeName.value.trim()) {
            updateData.name = recipeName.value.trim();
        }
        
        // Check instructions change
        if (originalRecipe.instructions !== recipeInstructions.value.trim()) {
            updateData.instructions = recipeInstructions.value.trim();
        }
        
        // Check image change
        if (imagePreview.src !== '#' && imagePreview.style.display !== 'none') {
            // New image was selected
            if (originalRecipe.img !== imagePreview.src) {
                updateData.img = imagePreview.src;
            }
        }
        
        // Handle ingredients changes
        const originalIngNames = await getIngredientNames(originalRecipe.ingredients || []);
        const newIngNames = ingredientValues;
        
        console.log('Original ingredients:', originalIngNames);
        console.log('New ingredients:', newIngNames);
        
        if (JSON.stringify(originalIngNames.sort()) !== JSON.stringify(newIngNames.sort())) {
            // Ingredients changed - create change mapping for backend API
            const ingredientChanges = [];
            
            // Find ingredients to remove (in original but not in new)
            originalIngNames.forEach(oldName => {
                if (!newIngNames.includes(oldName)) {
                    ingredientChanges.push({
                        old_name: oldName,
                        new_name: null // null means remove
                    });
                }
            });
            
            // Find ingredients to add (in new but not in original)
            newIngNames.forEach(newName => {
                if (!originalIngNames.includes(newName)) {
                    ingredientChanges.push({
                        old_name: null, // null means add new
                        new_name: newName
                    });
                }
            });
            
            if (ingredientChanges.length > 0) {
                updateData.ingredients = ingredientChanges;
                console.log('Ingredient changes:', ingredientChanges);
            }
        }
        
        // Handle tags changes - check both possible field names
        const originalTagIds = originalRecipe.tags || originalRecipe.tag || [];
        const originalTagNames = await getTagNames(originalTagIds);
        console.log('Original tag IDs:', originalTagIds);
        console.log('Original tag names:', originalTagNames);
        console.log('New tag names:', tagValues);
        
        if (JSON.stringify(originalTagNames.sort()) !== JSON.stringify(tagValues.sort())) {
            // Tags changed - create change mapping for backend API
            const tagChanges = [];
            
            // Find tags to remove (in original but not in new)
            originalTagNames.forEach(oldTagName => {
                if (!tagValues.includes(oldTagName)) {
                    tagChanges.push({
                        old_name: oldTagName,
                        new_name: null // null means remove
                    });
                }
            });
            
            // Find tags to add (in new but not in original)
            tagValues.forEach(newTagName => {
                if (!originalTagNames.includes(newTagName)) {
                    tagChanges.push({
                        old_name: null, // null means add new
                        new_name: newTagName
                    });
                }
            });
            
            if (tagChanges.length > 0) {
                updateData.tags = tagChanges;
                console.log('Tag changes:', tagChanges);
            }
        }
        
        // Send update request if there are changes
        console.log('Final update data:', updateData);
        console.log('Number of changes detected:', Object.keys(updateData).length);
        
        if (Object.keys(updateData).length > 0) {
            console.log('Sending update data:', updateData);
            
            const response = await fetch(`http://127.0.0.1:8000/recipes/${recipeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updateData)
            });
            
            console.log('Response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
            }
            
            if (response.status === 200 || response.status === 204) {
                console.log('Recipe updated successfully');
                
                // Refresh recipe data in localStorage
                await refreshAllRecipes();
                
                alert('Recipe updated successfully!');
                window.location.href = 'my_recipe.html';
            } else {
                console.error('Update failed:', response.status);
                alert('Failed to update recipe. Please try again.');
            }
        } else {
            console.log('No changes detected');
            alert('No changes were made to the recipe.');
            window.location.href = 'my_recipe.html';
        }
        
    } catch (error) {
        console.error('Error updating recipe:', error);
        alert('An error occurred while updating the recipe.');
    }
}

// Helper function to get ingredient names from IDs
async function getIngredientNames(ingredientIds) {
    if (!ingredientIds || ingredientIds.length === 0) return [];
    
    try {
        const allIngs = await getAllIngs();
        const matchedIngs = allIngs.filter(ing => ingredientIds.includes(ing.pk));
        return matchedIngs.map(ing => ing.name);
    } catch (error) {
        console.error('Error getting ingredient names:', error);
        return [];
    }
}

// Helper function to get tag names from IDs
async function getTagNames(tagIds) {
    if (!tagIds || tagIds.length === 0) return [];
    
    try {
        const response = await fetch('http://127.0.0.1:8000/tag/');
        const allTags = await response.json();
        
        // Convert Django serialized format to simple object array
        const tags = [];
        for (let index = 0; index < allTags.length; index++) {
            allTags[index]["fields"].pk = allTags[index]["pk"];
            tags.push(allTags[index]["fields"]);
        }
        
        const matchedTags = tags.filter(tag => tagIds.includes(tag.pk));
        return matchedTags.map(tag => tag.name);
    } catch (error) {
        console.error('Error getting tag names:', error);
        return [];
    }
}

// Helper function to refresh all recipes in localStorage
async function refreshAllRecipes() {
    try {
        const response = await fetch('http://127.0.0.1:8000/recipes/');
        const recipesData = await response.json();
        
        // Convert Django serialized format to simple object array
        const recipes = [];
        for (let index = 0; index < recipesData.length; index++) {
            recipesData[index]["fields"].pk = recipesData[index]["pk"];
            recipes.push(recipesData[index]["fields"]);
        }
        
        // Update localStorage with fresh data
        localStorage.setItem('all_res', JSON.stringify(recipes));
        console.log('Recipes refreshed in localStorage');
    } catch (error) {
        console.error('Error refreshing recipes:', error);
    }
}

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

    // all_o_recipe.sort((a, b) => a.id.localeCompare(b.id));
    localStorage.setItem('all_res', JSON.stringify(all_o_recipe));
}
