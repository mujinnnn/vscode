document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById("animal-modal");
    const closeBtn = modal ? modal.querySelector(".close-btn") : null;
    let currentAnimal = null;

    const animalItems = document.querySelectorAll(".animal-item");

    animalItems.forEach((item) => {
        item.addEventListener("click", () => {
            const animalImage = item.querySelector('img').src;
            const animalName = item.querySelector('p').textContent.split('\n')[0];
            const animalDetails = item.querySelector('p').textContent;

            if (modal) {
                modal.querySelector('img').src = animalImage;
                modal.querySelector('h2').textContent = animalName;
                modal.querySelector('p').innerHTML = animalDetails.replace(/\n/g, '<br>');

                currentAnimal = {
                    imageSrc: animalImage,
                    name: animalName,
                    details: animalDetails.replace(/\n/g, '<br>')
                };

                updateFavoriteButton();

                modal.style.display = "block";
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    const favoriteModalBtn = document.getElementById("add-favorite");

    if (favoriteModalBtn) {
        favoriteModalBtn.addEventListener("click", () => {
            saveFavoriteAnimalToServer(currentAnimal);
            updateHeartIcon(currentAnimal.name);
        });
    }

    const favoriteBtns = document.querySelectorAll(".favorite-btn");

    favoriteBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.stopPropagation();

            const animalItem = btn.closest('.animal-item');
            const animalData = {
                imageSrc: animalItem.querySelector('img').src,
                name: animalItem.querySelector('p').textContent.split('\n')[0],
                details: animalItem.querySelector('p').textContent.replace(/\n/g, '<br>'),
            };

            saveFavoriteAnimalToServer(animalData);
            updateHeartIcon(animalData.name);
        });
    });

    function fetchFavoriteAnimalsFromServer() {
        return getUserId().then(userId => {
            if (!userId) {
                console.error("User ID is not available. Cannot fetch favorite animals.");
                return [];
            }

            return fetch(`http://localhost:5500/api/getWatchlist?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    return data.watchlist;
                } else {
                    console.error("Failed to fetch favorite animals:", data.message);
                    return [];
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return [];
            });
        });
    }

    function getUserId() {
        return fetch('http://localhost:5500/api/get-user-id', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.userId) {
                return data.userId;
            } else {
                console.error("User ID could not be retrieved.");
                return null;
            }
        })
        .catch(error => console.error('Error fetching user ID:', error));
    }

    function saveFavoriteAnimalToServer(animal) {
        return getUserId().then(userId => {
            if (!userId) {
                console.error("User ID is not available. Cannot save favorite animal.");
                return;
            }

            fetch('http://localhost:5500/api/saveWatchlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, petId: animal.name })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Favorite animal saved successfully:", animal.name);
                } else {
                    console.error("Failed to save favorite animal:", data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    function updateFavoriteButton() {
        fetchFavoriteAnimalsFromServer().then(favoriteAnimals => {
            if (favoriteAnimals.some(animal => animal.name === currentAnimal.name)) {
                favoriteModalBtn.textContent = "관심해제";
            } else {
                favoriteModalBtn.textContent = "관심등록";
            }
        });
    }

    function updateHeartIcon(animalName) {
        fetchFavoriteAnimalsFromServer().then(favoriteAnimals => {
            favoriteBtns.forEach(btn => {
                const btnAnimalName = btn.closest('.animal-item').querySelector('p').textContent.split('\n')[0];
                if (btnAnimalName === animalName) {
                    if (favoriteAnimals.some(animal => animal.name === animalName)) {
                        btn.classList.add('full');
                        btn.classList.remove('empty');
                    } else {
                        btn.classList.add('empty');
                        btn.classList.remove('full');
                    }
                }
            });
        });
    }

    const chatButton = document.getElementById('chat-btn');
    if (chatButton) {
        chatButton.addEventListener('click', function () {
            window.location.href = '../html/chatting.html';
        });
    }

    const logo = document.querySelector('header img');

    if (logo) {
        logo.addEventListener('click', () => {
            document.getElementById("search-input").value = '';

            animalItems.forEach(item => {
                item.style.display = "block";
            });
        });
    }

    const myinfobtn = document.getElementById('my-info-btn');
    if (myinfobtn) {
        myinfobtn.addEventListener("click", function () {
            window.location.href = '../html/MyPage.html';
        });
    }
});

