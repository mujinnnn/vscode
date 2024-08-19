document.addEventListener('DOMContentLoaded', () => {
    loadPets();
});

// 로그인 상태 관리 (예: true 또는 false로 설정)
let isLoggedIn = false; // 기본적으로 비회원 상태로 설정

// 모달 창 제어 요소
const modal = document.getElementById("animal-modal");
const closeBtn = modal ? modal.querySelector(".close-btn") : null;
let currentAnimal = null; // 현재 모달에 표시된 동물 정보 저장

// 동물 프로필 클릭 시 모달 창 열기
const animalItems = document.querySelectorAll(".animal-item");

animalItems.forEach((item) => {
    item.addEventListener("click", () => {
        if (!isLoggedIn && window.location.pathname.endsWith('main.html')) {
            alert("비회원 상태에서는 동물 사진을 클릭할 수 없습니다. 로그인 후 다시 시도해 주세요.");
            return;
        }

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

// 채팅 버튼 클릭 시 채팅 페이지로 이동
const chatButton = document.getElementById('chat-btn');
if (chatButton) {
    chatButton.addEventListener('click', function () {
        if (!isLoggedIn && window.location.pathname.endsWith('main.html')) {
            alert("비회원 상태에서는 채팅 페이지로 이동할 수 없습니다. 로그인 후 다시 시도해 주세요.");
            return;
        }
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
    console.log('Fetching pets from /api/pet-info'); // 추가된 로그

    fetch('http://localhost:5500/api/pet-info')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const petListContainer = document.querySelector('#animal-list');
            petListContainer.innerHTML = ''; // 기존 목록 초기화

            if (data.length === 0) {
                petListContainer.innerHTML = '<p>등록된 펫이 없습니다.</p>';
            } else {
                data.forEach(pet => {
                    const petItem = document.createElement('div');
                    petItem.className = 'animal-item';

                    petItem.innerHTML = `
                        <img src="../public/uploads/${pet.photo}" alt="${pet.name}">
                        <p>${pet.name}<br>${pet.introduction}</p>
                    `;
                    petListContainer.appendChild(petItem);

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
}

// 내 정보 페이지로 이동
const myInfoButton = document.getElementById('my-info-btn');
if (myInfoButton) {
    myInfoButton.addEventListener('click', () => {
        if (!isLoggedIn && window.location.pathname.endsWith('main.html')) {
            alert("비회원 상태에서는 내 정보 페이지로 이동할 수 없습니다. 로그인 후 다시 시도해 주세요.");
            return;
        }
    });
}

// 등록 버튼 클릭 시 동작
const registerButton = document.getElementById('register-btn');
if (registerButton) {
    registerButton.addEventListener('click', (event) => {
        if (!isLoggedIn && window.location.pathname.endsWith('main.html')) {
            alert("비회원 상태에서는 동물 등록 페이지로 이동할 수 없습니다. 로그인 후 다시 시도해 주세요.");
            event.preventDefault(); // 페이지 이동 방지
        } else {
            // 등록 페이지로 이동 (비회원 상태에서는 경고 메시지만 표시하고 이동하지 않음)
            window.location.href = '../html/register.html'; // 동물 등록 페이지로 이동
        }
    });
}
