document.addEventListener('DOMContentLoaded', () => {
    if (typeof getFavorites !== 'function' || typeof removeFavorite !== 'function') {
        console.error("storageManager.js functions not loaded before favorites.js!");
        alert("Error: Essential functions missing. Please contact support.");
        return;
    }

    const favoritesContainer = document.getElementById('favorites-container');
    const noFavoritesMessage = document.getElementById('no-favorites-message');

    const recipeDisplayData = {
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

    function loadFavoritesUI() {
        if (!favoritesContainer || !noFavoritesMessage) return;

        const favoriteIds = getFavorites();

        favoritesContainer.innerHTML = '';
        noFavoritesMessage.style.display = 'none';

        if (favoriteIds.length === 0) {
            noFavoritesMessage.style.display = 'block';
            if (!favoritesContainer.contains(noFavoritesMessage)) {
                favoritesContainer.appendChild(noFavoritesMessage);
            }
        } else {
            favoriteIds.forEach(id => {
                const recipe = recipeDisplayData[id];
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
                    const icon = document.createElement('i');
                    icon.classList.add('fas', 'fa-heart');
                    favButton.appendChild(icon);
                    favButton.dataset.recipeId = id;
                    favButton.setAttribute('aria-label', 'Remove from favorites');
                    favButton.setAttribute('aria-pressed', 'true');

                    infoDiv.appendChild(titleH3);
                    infoDiv.appendChild(favButton);

                    card.appendChild(imgDiv);
                    card.appendChild(infoDiv);

                    favoritesContainer.appendChild(card);
                } else {
                    console.warn(`Display data not found for favorited ID: ${id}. Removing orphan.`);
                    removeFavorite(id);
                }
            });
        }
    }

    if (favoritesContainer) {
        favoritesContainer.addEventListener('click', (event) => {
            const favButton = event.target.closest('.favorite-button');
            const card = event.target.closest('.recipe-card');

            if (favButton && favButton.dataset.recipeId) {
                event.stopPropagation();
                const idToRemove = favButton.dataset.recipeId;
                removeFavorite(idToRemove);

                const cardToRemove = favButton.closest('.recipe-card');
                if (cardToRemove) cardToRemove.remove();

                const remainingCards = favoritesContainer.querySelectorAll('.recipe-card');
                if (remainingCards.length === 0 && noFavoritesMessage) {
                    noFavoritesMessage.style.display = 'block';
                    if (!favoritesContainer.contains(noFavoritesMessage)) {
                        favoritesContainer.appendChild(noFavoritesMessage);
                    }
                }
            } else if (card && card.dataset.recipeId) {
                const recipeId = card.dataset.recipeId;
                console.log(`Navigating to details for recipe: ${recipeId}`);
                window.location.href = `Discription_page.html?id=${recipeId}`;
            }
        });
    }

    loadFavoritesUI();
});