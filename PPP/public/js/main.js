document.addEventListener('DOMContentLoaded', function () {
        function checkLoginStatus() {
            fetch('http://localhost:5500/api/check-login', { // 서버 주소와 API 경로가 정확한지 확인
            credentials: 'include' // 세션 쿠키를 포함하여 요청
        })
            
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    document.getElementById('username-display').textContent = data.username;
                    document.getElementById('username-display').style.display = 'block';
                    document.getElementById('login-link').style.display = 'none';
                    document.getElementById('logout-button').style.display = 'block';
                } else {
                    document.getElementById('username-display').style.display = 'none';
                    document.getElementById('logout-button').style.display = 'none';
                    document.getElementById('login-link').style.display = 'block';
                }
            })
            .catch(error => console.error('로그인 상태 확인 중 오류:', error));
        }
    
        checkLoginStatus(); // 페이지 로드 시 로그인 상태 확인인

    function loadPage(page) {
        fetch(page)
            .then(response => response.text())
            .then(data => {
                document.open();
                document.write(data);
                document.close();
                // 필요한 경우 추가 로직을 여기에 추가
            })
            .catch(error => console.error('페이지 로드 실패:', error));
    }
    

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('href');
            if (page === "#") return;
            loadPage(page);
        });
    });
});

