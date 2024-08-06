document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('file-upload');
    const uploadedImage = document.getElementById('uploaded-image');
    const infoTabs = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // 파일 선택 시 이미지 미리보기
    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadedImage.src = e.target.result;
                uploadedImage.style.display = 'block'; // 이미지를 표시
                fileInput.style.marginTop = `${uploadedImage.offsetHeight + 20}px`; // 이미지 높이 + 여백만큼 파일 선택 버튼을 내림
            };
            reader.readAsDataURL(file);
        } else {
            uploadedImage.style.display = 'none'; // 파일이 없을 때는 미리보기를 숨김
            fileInput.style.marginTop = '0'; // 파일 선택 버튼의 여백 초기화
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