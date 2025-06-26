document.addEventListener('DOMContentLoaded', () => {

    if (typeof addFavorite !== 'function' || typeof removeFavorite !== 'function' || typeof isFavorite !== 'function') {
       console.error("storageManager.js functions missing for home.js!");
       alert("Error: Cannot manage favorites. Please refresh.");
       return;
   }

   console.log("Home page script loaded!");

   const categoryElements = document.querySelectorAll('.categories-titles .category');
   const recipeCardContainer = document.getElementById('recipe-cards-container');
   const loadMoreBtn = document.getElementById('load-more-btn');
   const filterMessageElement = document.getElementById('filter-message');
   const allRecipeCards = recipeCardContainer ? recipeCardContainer.querySelectorAll('.recipe-card') : [];

   function filterRecipesByCategory(categoryName) {
       console.log(`Filtering for: ${categoryName}`);
       let visibleCount = 0;

       categoryElements.forEach(element => {
           element.classList.toggle('active-category', element.dataset.categoryName === categoryName);
       });

       allRecipeCards.forEach(card => {
           if (card) {
               const cardCategory = card.dataset.category;
               const shouldShow = (categoryName === 'All' || Object.keys(cardCategory).length === 0 || cardCategory.includes(categoryName));
               card.style.display = shouldShow ? '' : 'none';
               if (shouldShow) {
                   visibleCount++;
               }
           }
       });

       if (recipeCardContainer) {
           recipeCardContainer.querySelectorAll('.recipe-row').forEach(row => {
               const hasVisibleCard = Array.from(row.querySelectorAll('.recipe-card')).some(card => card.style.display !== 'none');
               row.style.display = hasVisibleCard ? '' : 'none';
           });
       }

       if (filterMessageElement) {
           const showMessage = (visibleCount === 0 && categoryName !== 'All');
           filterMessageElement.style.display = showMessage ? 'block' : 'none';
           if (showMessage) {
                filterMessageElement.textContent = `No recipes found for "${categoryName}".`;
           }
       }
   }

   function toggleFavoriteUI(recipeId, favButton) {
       console.log(`Toggling fav status for: ${recipeId}`);
       const iconElement = favButton.querySelector('i');
       if (!iconElement) return;

       if (isFavorite(recipeId)) {
           removeFavorite(recipeId);
           favButton.classList.remove('is-favorite');
           iconElement.classList.remove('fas');
           iconElement.classList.add('far');
           favButton.setAttribute('aria-pressed', 'false');
           favButton.setAttribute('aria-label', 'Add to favorites');
       } else {
           addFavorite(recipeId);
           favButton.classList.add('is-favorite');
           iconElement.classList.remove('far');
           iconElement.classList.add('fas');
           favButton.setAttribute('aria-pressed', 'true');
           favButton.setAttribute('aria-label', 'Remove from favorites');
       }
   }

   function updateFavoriteIconsUI() {
       document.querySelectorAll('.favorite-button').forEach(button => {
           const card = button.closest('.recipe-card');
           const iconElement = button.querySelector('i');
           if (card && card.dataset.recipeId && iconElement) {
               const recipeId = card.dataset.recipeId;
               const favState = isFavorite(recipeId);

               button.classList.toggle('is-favorite', favState);
               iconElement.classList.toggle('fas', favState);
               iconElement.classList.toggle('far', !favState);
               button.setAttribute('aria-pressed', favState ? 'true' : 'false');
               button.setAttribute('aria-label', favState ? 'Remove from favorites' : 'Add to favorites');
           }
       });
   }


   function loadRecipes(){
        const allRecipes = getAllRecipes();
        let i = 0 ; 
        allRecipes.forEach(Recipe =>{
            
            if(i == 3){
                i = 0 ; 
                const recipeRow = document.createElement('div') ; 
                recipeRow.classList.add('recipe-row') ; 
            }

            //create a new recipe card
            const recipeRows = recipeCardContainer.querySelectorAll('.recipe-row') ; 
            const curntRecipeRow = recipeRows[recipeRows.length - 1] ; 
            const recipeCard = document.createElement('div') ; 
            recipeCard.classList.add('recipe-card'); 
            recipeCard.dataset.recipeId = Recipe.pk || Recipe.id || Recipe.name ; 
            recipeCard.dataset.category = JSON.stringify(Recipe.Tags) ;
            
            const recipeImg = document.createElement('div') ; 
            recipeImg.classList.add('recipe-img') ; 
            const img = document.createElement('img') ; 
            
            // Handle different image formats for dynamic recipes
            if (Recipe.img) {
                // Recipe has image data
                if (Recipe.img.startsWith('data:image/')) {
                    // Base64 encoded image
                    img.src = Recipe.img;
                } else if (Recipe.img.startsWith('source/')) {
                    // Already has correct path (from database)
                    img.src = Recipe.img;
                } else if (Recipe.img.includes('.png') || Recipe.img.includes('.jpg') || Recipe.img.includes('.jpeg')) {
                    // Has file extension, construct path
                    img.src = `source/${Recipe.img}`;
                } else {
                    // Try to construct path from image name
                    img.src = `source/${Recipe.img}.png`;
                }
            } else if (Recipe.Image) {
                // Fallback to Image field (for static recipes)
                img.src = `source/${Recipe.Image}.png`;
            } else {
                // No image available - use placeholder
                img.src = 'source/gray_image.png';
            }
            
            img.alt = Recipe.name ; 
            
            // Add error handling for images that fail to load
            img.onerror = function() {
                console.log(`Image failed to load for recipe: ${Recipe.name}, using placeholder`);
                this.src = 'source/gray_image.png';
                // Prevent infinite loop if gray_image.png also fails
                this.onerror = null;
            };
            
            recipeImg.appendChild(img) ; 

            const recipeInfo = document.createElement('div') ; 
            recipeInfo.classList.add('recipe-info') ; 
            const recipeTitle = document.createElement('h3') ; 
            recipeTitle.textContent = Recipe.name ; 
            recipeInfo.appendChild(recipeTitle) ;
            const favButton = document.createElement('button') ; 
            favButton.classList.add('favorite-button') ; 
            favButton.setAttribute('aria-label', 'Add to favorites') ; 
            favButton.setAttribute('aria-pressed', 'false') ; 
            const favIcon = document.createElement('i') ; 
            favIcon.classList.add('far', 'fa-heart') ;

            favButton.appendChild(favIcon) ; 
            recipeInfo.appendChild(favButton) ; 

            // Add recipe details toggle button
            const detailsToggle = document.createElement('div');
            detailsToggle.classList.add('recipe-details-toggle');
            const toggleBtn = document.createElement('button');
            toggleBtn.classList.add('details-toggle-btn');
            toggleBtn.setAttribute('aria-label', 'Show recipe details');
            toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> View Details';
            detailsToggle.appendChild(toggleBtn);

            // Add recipe details content
            const detailsContent = document.createElement('div');
            detailsContent.classList.add('recipe-details-content');
            detailsContent.style.display = 'none';

            // Recipe meta information
            const recipeMeta = document.createElement('div');
            recipeMeta.classList.add('recipe-meta');
            recipeMeta.innerHTML = `
                <span class="cooking-time"><i class="fas fa-clock"></i> ${Recipe.time || '30 mins'}</span>
                <span class="servings"><i class="fas fa-users"></i> ${Recipe.servings || '4 servings'}</span>
            `;

            // Ingredients preview
            const ingredientsPreview = document.createElement('div');
            ingredientsPreview.classList.add('ingredients-preview');
            const ingredientsTitle = document.createElement('h4');
            ingredientsTitle.innerHTML = '<i class="fas fa-list"></i> Key Ingredients:';
            ingredientsPreview.appendChild(ingredientsTitle);

            const ingredientsList = document.createElement('ul');
            if (Recipe.ingredients && Array.isArray(Recipe.ingredients)) {
                Recipe.ingredients.forEach(ingredient => {
                    const li = document.createElement('li');
                    li.textContent = ingredient;
                    ingredientsList.appendChild(li);
                });
            } else if (Recipe.ings && Array.isArray(Recipe.ings)) {
                Recipe.ings.forEach(ingredient => {
                    const li = document.createElement('li');
                    li.textContent = ingredient;
                    ingredientsList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'Ingredients not available';
                ingredientsList.appendChild(li);
            }
            ingredientsPreview.appendChild(ingredientsList);

            // Instructions preview
            const instructionsPreview = document.createElement('div');
            instructionsPreview.classList.add('instructions-preview');
            const instructionsTitle = document.createElement('h4');
            instructionsTitle.innerHTML = '<i class="fas fa-utensils"></i> Quick Instructions:';
            instructionsPreview.appendChild(instructionsTitle);

            const instructionsList = document.createElement('ol');
            if (Recipe.instructions) {
                let instructions = [];
                if (typeof Recipe.instructions === 'string') {
                    if (Recipe.instructions.includes('\n')) {
                        instructions = Recipe.instructions.split('\n')
                            .map(step => step.trim())
                            .filter(step => step.length > 0)
                            .slice(0, 5); // Show only first 5 steps
                    } else if (Recipe.instructions.includes('.')) {
                        instructions = Recipe.instructions.split('.')
                            .map(step => step.trim())
                            .filter(step => step.length > 0)
                            .slice(0, 5);
                    } else {
                        instructions = [Recipe.instructions];
                    }
                } else if (Array.isArray(Recipe.instructions)) {
                    instructions = Recipe.instructions.slice(0, 5);
                }

                instructions.forEach(step => {
                    const li = document.createElement('li');
                    li.textContent = step;
                    instructionsList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'Instructions not available';
                instructionsList.appendChild(li);
            }
            instructionsPreview.appendChild(instructionsList);

            // View full recipe button
            const viewFullRecipe = document.createElement('div');
            viewFullRecipe.classList.add('view-full-recipe');
            const viewFullBtn = document.createElement('a');
            viewFullBtn.href = `Discription_page.html?id=${Recipe.pk || Recipe.id}`;
            viewFullBtn.classList.add('view-full-btn');
            viewFullBtn.textContent = 'View Full Recipe';
            viewFullRecipe.appendChild(viewFullBtn);

            // Assemble details content
            detailsContent.appendChild(recipeMeta);
            detailsContent.appendChild(ingredientsPreview);
            detailsContent.appendChild(instructionsPreview);
            detailsContent.appendChild(viewFullRecipe);

            // Add toggle functionality
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const isExpanded = detailsContent.style.display !== 'none';
                detailsContent.style.display = isExpanded ? 'none' : 'block';
                toggleBtn.classList.toggle('expanded', !isExpanded);
                toggleBtn.innerHTML = isExpanded ? 
                    '<i class="fas fa-chevron-down"></i> View Details' : 
                    '<i class="fas fa-chevron-up"></i> Hide Details';
            });

            recipeCard.appendChild(recipeImg);
            recipeCard.appendChild(recipeInfo);
            recipeCard.appendChild(detailsToggle);
            recipeCard.appendChild(detailsContent);
            curntRecipeRow.appendChild(recipeCard) ;
            
            i++ ;
        })
   }

   loadRecipes() ; 

   categoryElements.forEach(category => {
       category.addEventListener('click', () => {
           const categoryName = category.dataset.categoryName;
           if (categoryName) {
               filterRecipesByCategory(categoryName);
           }
       });
   });

   if (recipeCardContainer) {
       recipeCardContainer.addEventListener('click', (event) => {
           const card = event.target.closest('.recipe-card');
           const favButton = event.target.closest('.favorite-button');
           const detailsToggleBtn = event.target.closest('.details-toggle-btn');

           if (favButton && card && card.dataset.recipeId) {
               event.stopPropagation();
               toggleFavoriteUI(card.dataset.recipeId, favButton);
           } else if (detailsToggleBtn) {
               event.stopPropagation();
               const detailsContent = card.querySelector('.recipe-details-content');
               const isExpanded = detailsContent.style.display !== 'none';
               detailsContent.style.display = isExpanded ? 'none' : 'block';
               detailsToggleBtn.classList.toggle('expanded', !isExpanded);
               detailsToggleBtn.innerHTML = isExpanded ? 
                   '<i class="fas fa-chevron-down"></i> View Details' : 
                   '<i class="fas fa-chevron-up"></i> Hide Details';
           } else if (card && card.dataset.recipeId) {
               const recipeId = card.dataset.recipeId;
               console.log(`Going to details page for: ${recipeId}`);
               window.location.href = `Discription_page.html?id=${recipeId}`;
           } else if (card && !card.dataset.recipeId) {
               console.warn("Clicked a card missing its recipe ID.");
           }
       });
   }

   updateFavoriteIconsUI();
   document.querySelector('.category[data-category-name="All"]')?.classList.add('active-category');

});