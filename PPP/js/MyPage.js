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