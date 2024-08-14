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

document.addEventListener("DOMContentLoaded", function () {
    const userId = "현재 로그인한 사용자의 ID";  // 실제로는 현재 로그인한 사용자의 ID로 대체해야 함

    // 애완동물 정보 가져오기
    fetch(`/get-pet-info?userId=${userId}`)
        .then(response => response.json())
        .then(petInfo => {
            if (petInfo.length > 0) {
                const pet = petInfo[0];

                // 사진 표시
                const photoArea = document.querySelector('.photo-area');
                if (pet.photo) {
                    const imgElement = document.createElement('img');
                    imgElement.src = pet.photo;
                    imgElement.style.width = '100%';
                    imgElement.style.height = '100%';
                    imgElement.style.objectFit = 'cover';
                    imgElement.style.borderRadius = '50%';
                    photoArea.appendChild(imgElement);
                } else {
                    photoArea.innerHTML = `<div class="photo-placeholder">사진 없음</div>`;
                }

                // 이름 표시
                const nameInput = document.querySelector('.text-input');
                nameInput.value = pet.name;

                // 소개 표시
                const descriptionInput = document.querySelector('.description-input');
                descriptionInput.value = pet.introduction;
            } else {
                console.log("애완동물 정보가 없습니다.");
            }
        })
        .catch(error => {
            console.error("애완동물 정보를 가져오는 중 오류 발생:", error);
        });
});
