import { get_ing } from "./API_Calls.js";



document.addEventListener('DOMContentLoaded',async () => {
   
    const imageInput = document.getElementById('recipe-image');
    const imagePreview = document.getElementById('image-preview');
    const imageLabel = document.querySelector('.image-label');
    const imageLabelSpan = imageLabel ? imageLabel.querySelector('span') : null;
    const imageLabelIcon = imageLabel ? imageLabel.querySelector('.fa-camera') : null;

    const ingredientsList = document.getElementById('ingredients-list');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');

    const tagsList = document.getElementById('tags-list');
    const addTagBtn = document.getElementById('add-tag-btn');

    if (imageInput && imagePreview && imageLabel) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    if (imageLabelSpan) imageLabelSpan.style.display = 'none';
                    if (imageLabelIcon) imageLabelIcon.style.display = 'none';
                }
                reader.readAsDataURL(file);
            } else {
                imagePreview.src = '#';
                imagePreview.style.display = 'none';
                if (imageLabelSpan) imageLabelSpan.style.display = 'block';
                if (imageLabelIcon) imageLabelIcon.style.display = 'block';
            }
        });
    } else {
        console.warn("Image preview elements not fully found on the page.");
    }

    if (ingredientsList && addIngredientBtn) {
        addIngredientBtn.addEventListener('click', function() {
            const newItem = document.createElement('div');
            newItem.classList.add('ingredient-item');
            newItem.innerHTML = `
                <input type="text" name="ingredient[]" placeholder="e.g., 1 cup flour">
                <button type="button" class="remove-ingredient-btn"><i class="fas fa-times"></i></button>
            `;
            ingredientsList.appendChild(newItem);
        });

        ingredientsList.addEventListener('click', function(e) {
            const removeButton = e.target.closest('.remove-ingredient-btn');
            if (removeButton) {
                removeButton.closest('.ingredient-item').remove();
            }
        });
    } else {
        console.warn("Ingredient list elements not fully found on the page.");
    }

    if (tagsList && addTagBtn) {
        addTagBtn.addEventListener('click', function() {
            const newItem = document.createElement('div');
            newItem.classList.add('tag-item');
            newItem.innerHTML = `
                <input type="text" name="tag[]" placeholder="e.g., Dessert, Quick, Vegan">
                <button type="button" class="remove-tag-btn"><i class="fas fa-times"></i></button>
            `;
            tagsList.appendChild(newItem);
        });

        tagsList.addEventListener('click', function(e) {
            const removeButton = e.target.closest('.remove-tag-btn');
            if (removeButton) {
                removeButton.closest('.tag-item').remove();
            }
        });
    } else {
        console.warn("Tag list elements not fully found on the page.");
    }

    const addRecipeForm = document.querySelector('.add-recipe-form');
    if (addRecipeForm) {
        addRecipeForm.addEventListener('submit', function(event) {
            console.log("Form submitted!");
        });
    }
});