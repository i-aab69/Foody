

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.add-recipe-form');
    const recipeName = document.getElementById('recipe-name');
    const recipeInstructions = document.getElementById('recipe-instructions');
    const imagePreview = document.getElementById('image-preview');

    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (recipeId) {
        loadRecipeData(recipeId);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const ingredientInputs = document.querySelectorAll('input[name="ingredient[]"]');
        const tagInputs = document.querySelectorAll('input[name="tag[]"]');

        const ingredientValues = Array.from(ingredientInputs)
            .map(input => input.value.trim())
            .filter(v => v !== '');

        const tagValues = Array.from(tagInputs)
            .map(input => input.value.trim())
            .filter(v => v !== '');

        let id = recipeId || localStorage.getItem('id');

        const recipeData = {
            id: id,
            name: recipeName.value,
            instructions: recipeInstructions.value,
            tag: tagValues,
            ings: ingredientValues.length,
            ingredients: ingredientValues
        };

        if (imagePreview.src !== '#' && imagePreview.style.display !== 'none') {
            recipeData.image = imagePreview.src;
        }

        localStorage.setItem(`recipe${id}`, JSON.stringify(recipeData));

        if (!recipeId) {
            localStorage.setItem('id', parseInt(id) + 1);
        }

        updateRecipesList();
        window.location.href = 'my_recipe.html';
    });

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

// function addNewIngredient() {
//     const ingredientsList = document.getElementById('ingredients-list');
//     const newIngredient = document.createElement('div');
//     newIngredient.className = 'ingredient-item';
//     newIngredient.innerHTML = `
//         <input type="text" name="ingredient[]" placeholder="e.g., 1 cup flour">
//         <button type="button" class="remove-ingredient-btn"><i class="fas fa-times"></i></button>
//     `;
//     ingredientsList.appendChild(newIngredient);
//     newIngredient.querySelector('.remove-ingredient-btn').addEventListener('click', () => {
//         ingredientsList.removeChild(newIngredient);
//     });
// }

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

function loadRecipeData(recipeId) {
    document.querySelector('h1').textContent = 'Edit Recipe';
    document.querySelector('.save-btn').textContent = 'Update Recipe';

    const recipeData = JSON.parse(localStorage.getItem(`recipe${recipeId}`));

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
        recipeData.ingredients.forEach(ingredient => {
            const newIngredient = document.createElement('div');
            newIngredient.className = 'ingredient-item';
            newIngredient.innerHTML = `
                <input type="text" name="ingredient[]" value="${ingredient}" placeholder="e.g., 1 cup flour">
                <button type="button" class="remove-ingredient-btn"><i class="fas fa-times"></i></button>
            `;
            ingredientsList.appendChild(newIngredient);
        });
    }

    const tagsList = document.getElementById('tags-list');
    tagsList.innerHTML = '';

    if (recipeData.tag && Array.isArray(recipeData.tag)) {
        recipeData.tag.forEach(tag => {
            const newTag = document.createElement('div');
            newTag.className = 'tag-item';
            newTag.innerHTML = `
                <input type="text" name="tag[]" value="${tag}" placeholder="e.g., Dessert, Quick, Vegan">
                <button type="button" class="remove-tag-btn"><i class="fas fa-times"></i></button>
            `;
            tagsList.appendChild(newTag);
        });
    }

    if (recipeData.image) {
        const imagePreview = document.getElementById('image-preview');
        imagePreview.src = recipeData.image;
        imagePreview.style.display = 'block';
    }

    setupRemoveButtons();
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

    all_o_recipe.sort((a, b) => a.id.localeCompare(b.id));
    localStorage.setItem('all_res', JSON.stringify(all_o_recipe));
}
