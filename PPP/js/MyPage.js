document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-upload');
    const uploadedImage = document.getElementById('uploaded-image');
    const uploadBox = document.querySelector('.upload-box');
    const starContainer = document.getElementById('star-container');
    
    let ratings = [4, 3, 5]; // 예시 평점 (미리 정의된 평점)

    // 파일 선택 박스를 클릭하게 만드는 함수
    function triggerFileInput() {
        fileInput.click();
    }

    // 파일이 선택되었을 때 호출되는 함수
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;
                uploadedImage.style.display = 'block'; // 이미지가 표시되도록 설정
                uploadBox.style.backgroundImage = 'none'; // 기본 배경 이미지 제거
            };

            reader.readAsDataURL(file);
        }
    }

    // 평점을 업데이트하는 함수
    function updateRating() {
        // 평균 별점 계산
        const averageRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);

        // 별점 표시 업데이트
        const stars = starContainer.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < Math.floor(averageRating)) {
                star.style.color = '#f4c542'; // 완전히 채워진 별
            } else if (index < Math.ceil(averageRating)) {
                star.style.color = '#f4c542'; // 반쯤 채워진 별
            } else {
                star.style.color = '#ddd'; // 빈 별
            }
        });
    }

    // 파일 선택 시 이미지 업로드 처리
    fileInput.addEventListener('change', handleFileSelect);

    // 클릭 시 파일 선택 박스를 열도록 설정
    uploadBox.addEventListener('click', triggerFileInput);

    // 파일 선택 박스를 클릭했을 때, 업로드된 이미지가 있으면 보여주기
    fileInput.addEventListener('click', function() {
        if (uploadedImage.src) {
            uploadedImage.style.display = 'block';
        }
    });
    
    // 평점 업데이트 함수 호출
    updateRating();

    // 삭제 버튼 클릭 시 애완동물 아이템 제거
    document.querySelectorAll('.cancel-button').forEach(button => {
        button.addEventListener('click', function() {
            const petItem = this.closest('.pet-item');
            if (petItem) {
                petItem.remove(); // DOM에서 애완동물 아이템 제거
            }
        });
    });
});