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
               const shouldShow = (categoryName === 'All' || !cardCategory || cardCategory === categoryName);
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

   function loadMoreRecipes() {
       console.log("Pretending to load more recipes...");
       alert("Load More clicked! (This needs a backend to actually work)");
       if (loadMoreBtn) {
           loadMoreBtn.textContent = "No More Recipes";
           loadMoreBtn.disabled = true;
       }
   }

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

           if (favButton && card && card.dataset.recipeId) {
               event.stopPropagation();
               toggleFavoriteUI(card.dataset.recipeId, favButton);
           } else if (card && card.dataset.recipeId) {
               const recipeId = card.dataset.recipeId;
               console.log(`Going to details page for: ${recipeId}`);
               window.location.href = `Discription_page.html?id=${recipeId}`;
           } else if (card && !card.dataset.recipeId) {
               console.warn("Clicked a card missing its recipe ID.");
           }
       });
   }

   if (loadMoreBtn) {
       loadMoreBtn.addEventListener('click', loadMoreRecipes);
   }

   updateFavoriteIconsUI();
   document.querySelector('.category[data-category-name="All"]')?.classList.add('active-category');

});