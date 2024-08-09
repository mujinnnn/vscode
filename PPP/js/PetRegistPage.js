document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('file-upload');
    const uploadedImage = document.getElementById('uploaded-image');
    const uploadBox = document.getElementById('upload-box');
    const infoTabs = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const submitButton = document.querySelector('.submit-button');

    // "사진 등록하기" 버튼 클릭 시 파일 선택 대화상자 열기
    uploadBox.addEventListener('click', function () {
        fileInput.click();
    });

    // 등록된 이미지 클릭 시 파일 선택 대화상자 열기
    uploadedImage.addEventListener('click', function () {
        fileInput.click();
    });

    // 파일 선택 시 이미지 미리보기
    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadedImage.src = e.target.result;
                uploadedImage.classList.add('show'); // 이미지를 표시하고 클래스 추가
                uploadBox.style.border = 'none'; // 이미지가 있을 때 박스의 테두리 숨기기
            };
            reader.readAsDataURL(file);
        } else {
            uploadedImage.src = '';
            uploadedImage.classList.remove('show'); // 이미지가 없을 때는 클래스 제거
            uploadBox.style.border = ''; // 박스의 테두리 복원
        }
    });

    // 탭 버튼 클릭 시 해당 탭 패널 활성화
    infoTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            
            // 모든 탭 버튼과 패널 비활성화
            infoTabs.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // 클릭한 탭 버튼 활성화
            this.classList.add('active');
            
            // 해당 탭 패널 활성화
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 등록 버튼 클릭 시 정보 저장
    submitButton.addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const type = document.getElementById('type').value;
        const gender = document.getElementById('gender').value;
        const breed = document.getElementById('breed').value;
        const age = document.getElementById('age').value;
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const intro = document.querySelector('#intro textarea').value;

        // 이미지 데이터 URL 저장
        const imageSrc = uploadedImage.src;

        // 정보 객체 생성
        const petInfo = {
            name,
            type,
            gender,
            breed,
            age,
            height,
            weight,
            intro,
            imageSrc
        };

        // 로컬 스토리지에 저장
        let pets = JSON.parse(localStorage.getItem('pets')) || [];
        pets.push(petInfo);
        localStorage.setItem('pets', JSON.stringify(pets));

        // 정보 입력 후 초기화
        document.querySelector('form').reset();
        uploadedImage.classList.remove('show'); // 등록 후 이미지 숨기기
        uploadBox.style.border = ''; // 박스의 테두리 복원
        alert('애완동물이 등록되었습니다!');
    });
});
