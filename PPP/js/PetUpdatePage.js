document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('file-upload');
    const uploadedImage = document.getElementById('uploaded-image');
    const photoUploadBox = document.getElementById('photo-upload');
    const infoTabs = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // 사진 등록하기 박스를 클릭하면 파일 선택 창 열기
    photoUploadBox.addEventListener('click', function () {
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
                // 이미지가 있을 때 박스의 테두리 숨기기
                photoUploadBox.querySelector('.upload-box').style.border = 'none'; 
            };
            reader.readAsDataURL(file);
        } else {
            uploadedImage.src = '';
            uploadedImage.classList.remove('show'); // 이미지가 없을 때는 클래스 제거
            // 박스의 테두리 복원
            photoUploadBox.querySelector('.upload-box').style.border = ''; 
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
});
