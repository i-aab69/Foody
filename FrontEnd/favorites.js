document.addEventListener('DOMContentLoaded', () => {

    if (typeof getFavorites !== 'function' || typeof removeFavorite !== 'function') {
        console.error("storageManager.js stuff is missing for favorites!");
        alert("Error loading favorites functions. Try refreshing?");
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

    function displayFavorites() {
        if (!favoritesContainer || !noFavoritesMessage) {
            console.error("Can't find the favorites container or message box!");
            return;
        }

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
                const recipeInfo = recipeDisplayData[id];

                if (recipeInfo) {
                    const card = document.createElement('div');
                    card.className = 'recipe-card';
                    card.dataset.recipeId = id;

                    const imgDiv = document.createElement('div');
                    imgDiv.className = 'recipe-img';
                    const img = document.createElement('img');
                    img.src = recipeInfo.image || 'source/placeholder.png';
                    img.alt = recipeInfo.title;
                    imgDiv.appendChild(img);

                    const infoDiv = document.createElement('div');
                    infoDiv.className = 'recipe-info';
                    const titleH3 = document.createElement('h3');
                    titleH3.textContent = recipeInfo.title;

                    const favButton = document.createElement('button');
                    favButton.className = 'favorite-button is-favorite';
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-heart';
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
                    console.warn(`Couldn't find display info for favorited ID: ${id}. Removing it.`);
                    removeFavorite(id);
                }
            });
        }
    }

    if (favoritesContainer) {
        favoritesContainer.addEventListener('click', (event) => {
            const clickedFavButton = event.target.closest('.favorite-button');
            const clickedCard = event.target.closest('.recipe-card');

            if (clickedFavButton && clickedFavButton.dataset.recipeId) {
                event.stopPropagation();
                const idToRemove = clickedFavButton.dataset.recipeId;

                removeFavorite(idToRemove);

                const cardToRemove = clickedFavButton.closest('.recipe-card');
                if (cardToRemove) {
                    cardToRemove.remove();
                }

                const remainingCards = favoritesContainer.querySelectorAll('.recipe-card');
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

});