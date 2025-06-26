import { FavoritesUI } from './ajax.js';

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

   // Enhanced favorite toggle with AJAX
   async function toggleFavoriteUI(recipeId, favButton) {
       console.log(`Toggling fav status for: ${recipeId}`);
       const iconElement = favButton.querySelector('i');
       if (!iconElement) return;

       // Store original state for rollback on error
       const originalClasses = Array.from(iconElement.classList);
       const wasPressed = favButton.getAttribute('aria-pressed') === 'true';

       // Show loading state
       iconElement.className = 'fas fa-spinner fa-spin';
       favButton.disabled = true;

       try {
           // Use AJAX favorites functionality
           const isCurrentlyFavorite = isFavorite(recipeId);
           
           if (isCurrentlyFavorite) {
               await FavoritesUI.toggle(recipeId, favButton);
               removeFavorite(recipeId); // Update localStorage for compatibility
               favButton.classList.remove('is-favorite');
               iconElement.classList.remove('fas');
               iconElement.classList.add('far');
               favButton.setAttribute('aria-pressed', 'false');
               favButton.setAttribute('aria-label', 'Add to favorites');
           } else {
               await FavoritesUI.toggle(recipeId, favButton);
               addFavorite(recipeId); // Update localStorage for compatibility
               favButton.classList.add('is-favorite');
               iconElement.classList.remove('far');
               iconElement.classList.add('fas');
               favButton.setAttribute('aria-pressed', 'true');
               favButton.setAttribute('aria-label', 'Remove from favorites');
           }

           // Update favorites count display
           FavoritesUI.updateFavoritesCount();

       } catch (error) {
           console.error('Error toggling favorite:', error);
           
           // Rollback to original state
           iconElement.className = originalClasses.join(' ');
           favButton.setAttribute('aria-pressed', wasPressed ? 'true' : 'false');
           
           alert('Error updating favorites. Please try again.');
       } finally {
           favButton.disabled = false;
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
                recipeCardContainer.appendChild(recipeRow);
            }

            //create a new recipe card
            const recipeRows = recipeCardContainer.querySelectorAll('.recipe-row') ; 
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
            favButton.setAttribute('aria-pressed', 'false') ; 
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
       recipeCardContainer.addEventListener('click', async (event) => {
           const card = event.target.closest('.recipe-card');
           const favButton = event.target.closest('.favorite-button');

           if (favButton && card && card.dataset.recipeId) {
               event.stopPropagation();
               await toggleFavoriteUI(card.dataset.recipeId, favButton);
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
   
   // Update favorites count on page load
   FavoritesUI.updateFavoritesCount();
   
   document.querySelector('.category[data-category-name="All"]')?.classList.add('active-category');

});