document.addEventListener('DOMContentLoaded', () => {
    loadPets(); 
});

// 관심목록에 추가될 동물 데이터를 관리할 배열
let favoriteAnimals = JSON.parse(localStorage.getItem('favoriteAnimals')) || [];

// 모달 창 제어 요소
const modal = document.getElementById("animal-modal");
const closeBtn = modal ? modal.querySelector(".close-btn") : null;
let currentAnimal = null; // 현재 모달에 표시된 동물 정보 저장

// 동물 프로필 클릭 시 모달 창 열기
const animalItems = document.querySelectorAll(".animal-item");

animalItems.forEach((item) => {
    item.addEventListener("click", () => {
        const animalImage = item.querySelector('img').src;
        const animalName = item.querySelector('p').textContent.split('\n')[0];
        const animalDetails = item.querySelector('p').textContent;

        // 모달 창 내부의 이미지와 텍스트 업데이트
        if (modal) {
            modal.querySelector('img').src = animalImage;
            modal.querySelector('h2').textContent = animalName;
            modal.querySelector('.modal-body').innerHTML = animalDetails.replace(/\n/g, '<br>');

            // 현재 동물 정보 저장
            currentAnimal = {
                imageSrc: animalImage,
                name: animalName,
                details: animalDetails.replace(/\n/g, '<br>')
            };

            // 버튼 상태 업데이트
            updateFavoriteButton();

            // 모달 창 표시
            modal.style.display = "block";
        }
    });
});

// 모달 창 닫기 버튼
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



// 검색 기능 구현
const searchBtn = document.getElementById("search-btn");

if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        const searchInput = document.getElementById("search-input").value.toLowerCase();
        const filteredAnimals = Array.from(animalItems).filter(item => {
            const animalCity = item.querySelector('p').textContent.toLowerCase();
            return animalCity.includes(searchInput);
        });

        animalItems.forEach(item => {
            item.style.display = "none"; // 모두 숨기기
        });

        filteredAnimals.forEach(item => {
            item.style.display = "block"; // 검색 결과만 보이기
        });
    });
}



// 채팅 버튼 클릭 시 채팅 페이지로 이동
const chatButton = document.getElementById('chat-btn');
if (chatButton) {
    chatButton.addEventListener('click', function () {
        window.location.href = '../html/chatting.html'; // 수정된 경로
    });
}

// 로고 클릭 시 메인 화면으로 돌아가기
const logo = document.querySelector('header img');

if (logo) {
    logo.addEventListener('click', () => {
        // 검색 입력 초기화
        document.getElementById("search-input").value = '';

        // 모든 동물 항목을 다시 표시
        animalItems.forEach(item => {
            item.style.display = "block";
        });
    });
}


function loadPets() {
    fetch('http://localhost:5500/api/pet-info')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const petListContainer = document.querySelector('#animal-list');
            petListContainer.innerHTML = ''; 

            if (data.length === 0) {
                petListContainer.innerHTML = '<p>등록된 펫이 없습니다.</p>';
            } else {
                data.forEach(pet => {
                    const petItem = document.createElement('div');
                    petItem.className = 'animal-item';
                    petItem.innerHTML = `
                        <img src="../public/uploads/${pet.photo}" alt="${pet.name}">
                        <p>${pet.name}<br>${pet.introduction}</p>
                        <button class="favorite-btn">&#9825;</button> <!-- 하트 버튼 추가 -->
                    `;
                    petListContainer.appendChild(petItem);

                    // 하트 버튼 클릭 이벤트
                    const favoriteBtn = petItem.querySelector('.favorite-btn');
                    favoriteBtn.addEventListener('click', function() {
                        if (favoriteBtn.classList.contains('full')) {
                            favoriteBtn.classList.remove('full');
                            favoriteBtn.innerHTML = '&#9825;';
                        } else {
                            favoriteBtn.classList.add('full');
                            favoriteBtn.innerHTML = '&#9829;';
                        }
                    });

                    petItem.addEventListener('click', function() {
                        showPetDetails(pet);
                    });
                });
            }
        })
        .catch(error => console.error('Error fetching pets:', error));
}

function showPetDetails(animal) {
    currentAnimal = animal;

    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = `
        <img src="../public/uploads/${animal.photo}" alt="${animal.name}">
        <h2>${animal.name}</h2>
        <p>${animal.introduction}</p>
    `;

    // 모달 창 표시
    modal.style.display = "block";

    // 관심 버튼 상태 업데이트
    updateFavoriteButton();
}


// 내 정보 버튼 클릭 시 내 정보로 이동
const myinfobtn = document.getElementById('my-info-btn');
if (myinfobtn) {
    myinfobtn.addEventListener('click', function () {
        window.location.href = '../html/Mypage.html'; // 수정된 경로
    });
}
