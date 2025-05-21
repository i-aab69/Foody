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

        favoritesContainer.innerHTML = '';
        noFavoritesMessage.style.display = 'none';

        if (favoriteRecipesData.length === 0) {
            noFavoritesMessage.style.display = 'block';
            if (!favoritesContainer.contains(noFavoritesMessage)) {
                favoritesContainer.appendChild(noFavoritesMessage);
            }
        } else {
            let i = 0 ; 
            favoriteRecipesData.forEach(Recipe =>{
                if(i == 3){
                    i = 0 ; 
                    const recipeRow = document.createElement('div') ; 
                    recipeRow.classList.add('recipe-row') ; 
                }

                //create a new recipe card
                const recipeRows = recipeCardContainer.querySelectorAll('.recipe-row') ;
                console.log(favoritesContainer.innerHTML);
                const curntRecipeRow = recipeRows[recipeRows.length - 1] ; 
                const recipeCard = document.createElement('div') ; 
                recipeCard.classList.add('recipe-card'); 
                recipeCard.dataset.recipeId = Recipe.name ; 
                recipeCard.dataset.category = JSON.stringify(Recipe.Tags) ;
                
                const recipeImg = document.createElement('div') ; 
                recipeImg.classList.add('recipe-img') ; 
                const img = document.createElement('img') ; 
                img.src = `source/${Recipe.Image}.png` ; 
                img.alt = Recipe.name ; 
                recipeImg.appendChild(img) ; 

                const recipeInfo = document.createElement('div') ; 
                recipeInfo.classList.add('recipe-info') ; 
                const recipeTitle = document.createElement('h3') ; 
                recipeTitle.textContent = Recipe.name ; 
                recipeInfo.appendChild(recipeTitle) ;
                const favButton = document.createElement('button') ; 
                favButton.classList.add('favorite-button') ; 
                favButton.setAttribute('aria-label', 'Add to favorites') ; 
                favButton.setAttribute('aria-pressed', 'true') ; 
                const favIcon = document.createElement('i') ; 
                favIcon.classList.add('far', 'fa-heart') ;

                favButton.appendChild(favIcon) ; 
                recipeInfo.appendChild(favButton) ; 

                recipeCard.appendChild(recipeImg);
                recipeCard.appendChild(recipeInfo) ;
                curntRecipeRow.appendChild(recipeCard) ;
                
                i++ ;
            })

        }
    }

    if (recipeCardContainer) {
        recipeCardContainer.addEventListener('click', (event) => {
            const clickedFavButton = event.target.closest('.favorite-button');
            const clickedCard = event.target.closest('.recipe-card');

            if (clickedFavButton && clickedCard && clickedCard.dataset.recipeId) {
                event.stopPropagation();
                const idToRemove = clickedCard.dataset.recipeId;

                removeFavorite(idToRemove);

                const cardToRemove = clickedFavButton.closest('.recipe-card');
                if (cardToRemove) {
                    cardToRemove.remove();
                }

                const remainingCards = recipeCardContainer.querySelectorAll('.recipe-card');
                if (remainingCards.length === 0 && noFavoritesMessage) {
                    noFavoritesMessage.style.display = 'block';
                    if (!favoritesContainer.contains(noFavoritesMessage)) {
                        favoritesContainer.appendChild(noFavoritesMessage);
                    }
                }
            }
            else if (clickedCard && clickedCard.dataset.recipeId) {
                const recipeId = clickedCard.dataset.recipeId;
                console.log(`Going to description page for: ${recipeId}`);
                window.location.href = `Discription_page.html?id=${recipeId}`;
            }
        });
    }

    displayFavorites();
    updateFavoriteIconsUI();
});