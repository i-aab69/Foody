document.addEventListener('DOMContentLoaded', () => {

    if (typeof getFavorites !== 'function' || typeof removeFavorite !== 'function') {
        console.error("storageManager.js stuff is missing for favorites!");
        alert("Error loading favorites functions. Try refreshing?");
        return;
    }

    const favoritesContainer = document.getElementById('favorites-container');
    const noFavoritesMessage = document.getElementById('no-favorites-message');
    const recipeCardContainer = document.getElementById('recipe-cards-container');

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

    function displayFavorites() {
        if (!favoritesContainer || !noFavoritesMessage) {
            console.error("Can't find the favorites container or message box!");
            return;
        }

        const favoriteRecipesData = getAllFavoriteRecipes();
        console.log('Favorite recipes data:', favoriteRecipesData);

        // Clear both containers
        favoritesContainer.innerHTML = '';
        recipeCardContainer.innerHTML = '';
        noFavoritesMessage.style.display = 'none';

        if (favoriteRecipesData.length === 0) {
            noFavoritesMessage.style.display = 'block';
            favoritesContainer.appendChild(noFavoritesMessage);
        } else {
            // Clear existing content
            recipeCardContainer.innerHTML = '';
            
            let i = 0 ; 
            let currentRow = null;
            
            favoriteRecipesData.forEach(Recipe =>{
                if(i == 0 || i % 3 == 0){
                    currentRow = document.createElement('div') ; 
                    currentRow.classList.add('recipe-row') ; 
                    recipeCardContainer.appendChild(currentRow);
                }

                //create a new recipe card
                const recipeCard = document.createElement('div') ; 
                recipeCard.classList.add('recipe-card'); 
                
                // Use the recipe ID that's now included in the recipe data
                const recipeId = Recipe.recipeId || Recipe.pk || Recipe.id || Recipe.name;
                recipeCard.dataset.recipeId = recipeId;
                recipeCard.dataset.category = JSON.stringify(Recipe.tags || Recipe.Tags || []);
                
                const recipeImg = document.createElement('div') ; 
                recipeImg.classList.add('recipe-img') ; 
                const img = document.createElement('img') ; 
                
                // Handle different image formats for both static and dynamic recipes
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
                
                // Add error handling for images that fail to load
                img.onerror = function() {
                    console.log(`Image failed to load for recipe: ${Recipe.name}, using placeholder`);
                    this.src = 'source/gray_image.png';
                    this.onerror = null;
                };
                
                img.alt = Recipe.name ; 
                recipeImg.appendChild(img) ; 

                const recipeInfo = document.createElement('div') ; 
                recipeInfo.classList.add('recipe-info') ; 
                const recipeTitle = document.createElement('h3') ; 
                recipeTitle.textContent = Recipe.name ; 
                recipeInfo.appendChild(recipeTitle) ;
                const favButton = document.createElement('button') ; 
                favButton.classList.add('favorite-button', 'is-favorite') ; 
                favButton.setAttribute('aria-label', 'Remove from favorites') ; 
                favButton.setAttribute('aria-pressed', 'true') ; 
                const favIcon = document.createElement('i') ; 
                favIcon.classList.add('fas', 'fa-heart') ;

                favButton.appendChild(favIcon) ; 
                recipeInfo.appendChild(favButton) ; 

                recipeCard.appendChild(recipeImg);
                recipeCard.appendChild(recipeInfo) ;
                currentRow.appendChild(recipeCard) ;
                
                i++ ;
            })

        }
    }

    // Use event delegation on the document to handle dynamically created elements
    document.addEventListener('click', (event) => {
        const clickedFavButton = event.target.closest('.favorite-button');
        const clickedCard = event.target.closest('.recipe-card');

        if (clickedFavButton && clickedCard && clickedCard.dataset.recipeId) {
            event.stopPropagation();
            const idToRemove = clickedCard.dataset.recipeId;

            console.log(`Removing recipe from favorites: ${idToRemove}`);
            
            // Add visual feedback
            clickedFavButton.style.opacity = '0.5';
            clickedFavButton.disabled = true;
            
            removeFavorite(idToRemove);

            // Small delay to ensure localStorage is updated
            setTimeout(() => {
                // Refresh the entire favorites display
                displayFavorites();
            }, 100);
        }
        else if (clickedCard && clickedCard.dataset.recipeId) {
            const recipeId = clickedCard.dataset.recipeId;
            console.log(`Going to description page for: ${recipeId}`);
            window.location.href = `Discription_page.html?id=${recipeId}`;
        }
    });

    displayFavorites();
    updateFavoriteIconsUI();
});