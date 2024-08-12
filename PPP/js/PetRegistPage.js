// 탭 전환 기능
function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tabcontent");
    var tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
        x[i].classList.remove("active");
    }
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    event.currentTarget.classList.add("active");
}

// 초기화면에서는 소개 탭이 열려 있도록 설정
document.getElementById("intro").style.display = "block";
document.getElementById("intro").classList.add("active");

// 사진 선택 시 파일 선택 창을 트리거
function triggerFileInput() {
    document.getElementById("photo").click(); // 파일 선택 창 열기
}

document.querySelector(".photo-placeholder").addEventListener("click", triggerFileInput);

// 파일 선택 시 이미지 표시 및 테두리 제거
document.getElementById("photo").addEventListener("change", function() {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var imgElement = document.getElementById("uploaded-image");
            imgElement.src = e.target.result;
            imgElement.style.display = "block"; // 이미지 표시
            document.querySelector(".photo-placeholder").style.display = "none"; // 텍스트 숨기기
            document.querySelector(".photo-upload").style.border = "none"; // 테두리 제거
        }
        reader.readAsDataURL(this.files[0]); // 파일을 읽어와서 이미지로 변환
    }
});

// 이미지 클릭 시 다시 파일 선택 창을 열 수 있도록 설정
document.getElementById("uploaded-image").addEventListener("click", triggerFileInput);
