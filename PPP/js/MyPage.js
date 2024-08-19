// 프로필 사진 업로드 기능
document.querySelector(".photo-upload").addEventListener("click", function () {
    document.getElementById("photo").click();
});

document.getElementById("photo").addEventListener("change", function () {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var imgElement = document.getElementById("uploaded-image");
            imgElement.src = e.target.result;
            imgElement.style.display = "block"; // 이미지 표시
            document.querySelector(".photo-placeholder").style.display = "none"; // 텍스트 숨기기
            
            // photo-upload의 테두리를 제거
            document.querySelector(".photo-upload").style.border = "none";
        }
        reader.readAsDataURL(this.files[0]);
    }
});

// 페이지 로드 시 펫 정보 불러오기
document.addEventListener("DOMContentLoaded", function() {
    loadPetInfo();
});

// 펫 정보 불러오기 함수
function loadPetInfo() {
    fetch('http://localhost:5500/api/pet-info')
        .then(response => response.json())
        .then(data => {
            const petInfoContainer = document.querySelector('.pet-info-container');
            const additionalSection = document.querySelector('.additional-section');
            petInfoContainer.innerHTML = '';

            if (data.length === 0) {
                petInfoContainer.classList.add('empty'); // 펫 정보가 없을 때
                additionalSection.style.marginTop = '20px'; // 추가 버튼을 맨 위로 이동
            } else {
                petInfoContainer.classList.remove('empty'); // 펫 정보가 있을 때
                additionalSection.style.marginTop = '0'; // 추가 버튼을 아래로 이동

                data.forEach(pet => {
                    const petInfoElement = document.createElement('div');
                    petInfoElement.classList.add('pet-info');

                    petInfoElement.innerHTML = `
                        <div class="pet-photo">
                            <img src="/PPP/public/uploads/${pet.photo}" alt="${pet.name}"> <!-- 경로 수정 -->
                        </div>
                        <div class="pet-details">
                            <div class="pet-name">${pet.name}</div>
                            <div class="pet-intro">${pet.introduction}</div>
                        </div>
                        <button class="pet-delete-btn" onclick="deletePet(${pet.id})">삭제</button>
                    `;

                    // 요소를 맨 위에 추가
                    petInfoContainer.insertBefore(petInfoElement, petInfoContainer.firstChild);
                });
            }
        })
        .catch(error => {
            console.error('Error loading pet info:', error);
        });
}

// 펫 삭제 함수
function deletePet(petId) {
    if (!confirm('정말로 이 동물을 삭제하시겠습니까?')) return;

    fetch(`http://localhost:5500/api/pet/${petId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            loadPetInfo(); // 목록 갱신
        } else {
            alert('삭제 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('Error deleting pet:', error);
    });
}

// 회원 탈퇴 기능
document.querySelector(".withdrawalBtn").addEventListener("click", function () {
    confirmWithdrawal();
});

function confirmWithdrawal() {
    if (confirm("정말로 탈퇴하시겠습니까?")) {
        fetch('http://localhost:5500/api/withdrawal', {  // 서버 URL이 올바른지 확인
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: 1  // U_NUM이 1인 사용자만 삭제
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href = 'main.html';  // 메인 페이지로 리디렉션
            } else {
                alert("탈퇴 처리에 실패했습니다. 다시 시도해주세요.");
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

