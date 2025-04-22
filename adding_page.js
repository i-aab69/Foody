// Wait for the HTML document to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Elements Selection for Add Recipe Page ---
    const imageInput = document.getElementById('recipe-image');
    const imagePreview = document.getElementById('image-preview');
    const imageLabel = document.querySelector('.image-label'); // Get the label element
    const imageLabelSpan = imageLabel ? imageLabel.querySelector('span') : null; // Find span inside label
    const imageLabelIcon = imageLabel ? imageLabel.querySelector('.fa-camera') : null; // Find icon inside label

    const ingredientsList = document.getElementById('ingredients-list');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');

    const tagsList = document.getElementById('tags-list');
    const addTagBtn = document.getElementById('add-tag-btn');

    // --- Image Preview Functionality ---
    if (imageInput && imagePreview && imageLabel) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    if (imageLabelSpan) imageLabelSpan.style.display = 'none'; // Hide text
                    if (imageLabelIcon) imageLabelIcon.style.display = 'none'; // Hide icon
                }
                reader.readAsDataURL(file);
            } else {
                // Reset if no file is selected or selection is cancelled
                imagePreview.src = '#';
                imagePreview.style.display = 'none';
                 if (imageLabelSpan) imageLabelSpan.style.display = 'block'; // Show text
                 if (imageLabelIcon) imageLabelIcon.style.display = 'block'; // Show icon
            }
        });
    } else {
        console.warn("Image preview elements not fully found on the page.");
    }


    // --- Add/Remove Ingredient Functionality ---
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

        // Use event delegation for removing ingredients
        ingredientsList.addEventListener('click', function(e) {
            // Find the closest remove button to the clicked element
            const removeButton = e.target.closest('.remove-ingredient-btn');
            if (removeButton) {
                // Find the parent ingredient item and remove it
                removeButton.closest('.ingredient-item').remove();
            }
        });
    } else {
         console.warn("Ingredient list elements not fully found on the page.");
    }


    // --- Add/Remove Tag Functionality ---
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

        // Use event delegation for removing tags
        tagsList.addEventListener('click', function(e) {
             // Find the closest remove button to the clicked element
            const removeButton = e.target.closest('.remove-tag-btn');
            if (removeButton) {
                 // Find the parent tag item and remove it
                removeButton.closest('.tag-item').remove();
            }
        });
     } else {
         console.warn("Tag list elements not fully found on the page.");
     }

     // --- Form Submission (Optional Example) ---
     // You might want to add form validation or AJAX submission logic here
     const addRecipeForm = document.querySelector('.add-recipe-form');
     if (addRecipeForm) {
        addRecipeForm.addEventListener('submit', function(event) {
            // Prevent default form submission if you want to handle it via JS (e.g., AJAX)
            // event.preventDefault();
            console.log("Form submitted!");
            // Add your form validation or submission logic here
        });
     }

}); // End of DOMContentLoaded