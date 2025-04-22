document.addEventListener('DOMContentLoaded', () => {
    const favoritesContainer = document.getElementById('favorites-container');
    const noFavoritesMessage = document.getElementById('no-favorites-message');

    const recipeData = {
        "cookie01": { title: "Chewy Chocolate Chip Cookies", image: "source/chocolate-chip-cookies.png" },
        "cake01": { title: "Tasty Chocolate Cake", image: "source/chocolate-cake.png" },
        "rolls01": { title: "Easy Cinnamon Rolls From Scratch", image: "source/cinnamon-rolls.png" },
        "pizza01": { title: "Homemade Pizza Recipe", image: "source/homemade-pizza.png" },
        "bread01": { title: "Simply Sandwich Bread", image: "source/sandwich-bread.png" },
        "fish01": { title: "Quick and Easy Baked Fish Fillet", image: "source/baked-fish.png" },
        "pancake01": { title: "Pancake", image: "source/placeholder.png" },
        "fries01": { title: "French Fries", image: "source/placeholder.png" },
        "adas01": { title: "Adas Soup", image: "source/placeholder.png" },
        "shakshuka01": { title: "Shakshuka", image: "source/shakshuka.png" },
        "omelette01": { title: "Omelette", image: "source/omelette.png" },
        "redpasta01": { title: "Red Sauce Pasta", image: "source/red_pasta.png" },
    };

    function loadFavorites() {
        if (!favoritesContainer || !noFavoritesMessage) {
            console.error("Favorites container or message element not found!");
            return;
        }

        const favoriteIds = JSON.parse(localStorage.getItem('foodyFavorites') || '[]');
        favoritesContainer.innerHTML = '';
        noFavoritesMessage.style.display = 'none';

        if (favoriteIds.length === 0) {
            noFavoritesMessage.style.display = 'block';
            favoritesContainer.appendChild(noFavoritesMessage);
        } else {
            favoriteIds.forEach(id => {
                const recipe = recipeData[id];
                if (recipe) {
                    const card = document.createElement('div');
                    card.classList.add('recipe-card');
                    card.dataset.recipeId = id;

                    const imgDiv = document.createElement('div');
                    imgDiv.classList.add('recipe-img');
                    const img = document.createElement('img');
                    img.src = recipe.image || 'source/placeholder.png';
                    img.alt = recipe.title;
                    imgDiv.appendChild(img);

                    const infoDiv = document.createElement('div');
                    infoDiv.classList.add('recipe-info');
                    const titleH3 = document.createElement('h3');
                    titleH3.textContent = recipe.title;
                    const favButton = document.createElement('button');
                    favButton.classList.add('favorite-button', 'is-favorite');
                    favButton.textContent = '♥';
                    favButton.dataset.recipeId = id;

                    infoDiv.appendChild(titleH3);
                    infoDiv.appendChild(favButton);

                    card.appendChild(imgDiv);
                    card.appendChild(infoDiv);

                    favoritesContainer.appendChild(card);
                } else {
                    console.warn(`Recipe data not found for ID: ${id}`);
                }
            });
        }
    }

    function removeFavorite(idToRemove) {
        let favoriteIds = JSON.parse(localStorage.getItem('foodyFavorites') || '[]');
        const index = favoriteIds.indexOf(idToRemove);

        if (index > -1) {
            favoriteIds.splice(index, 1);
            localStorage.setItem('foodyFavorites', JSON.stringify(favoriteIds));
            return true;
        }
        return false;
    }

    if (favoritesContainer) {
        favoritesContainer.addEventListener('click', (event) => {
            const favButton = event.target.closest('.favorite-button');
            if (favButton && favButton.dataset.recipeId) {
                const idToRemove = favButton.dataset.recipeId;
                if (removeFavorite(idToRemove)) {
                    const cardToRemove = favButton.closest('.recipe-card');
                    if (cardToRemove) {
                        cardToRemove.remove();
                    }
                    const remainingCards = favoritesContainer.querySelectorAll('.recipe-card');
                    if (remainingCards.length === 0 && noFavoritesMessage) {
                        noFavoritesMessage.style.display = 'block';
                        favoritesContainer.appendChild(noFavoritesMessage);
                    }
                }
            } else if (event.target.closest('.recipe-card')) {
                const card = event.target.closest('.recipe-card');
                const recipeId = card.dataset.recipeId;
                if (recipeId) {
                    console.log(`Clicked card for recipe: ${recipeId}`);
                }
            }
        });
    }

    loadFavorites();
});