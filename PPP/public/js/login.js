document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const userid = document.getElementById('login-userid').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:5500/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userid, password }),
        credentials: 'include' // 세션 쿠키를 포함하여 요청
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('로그인 성공');
            window.location.href = '../html/main.html'; // 메인 페이지로 리디렉션
        } else {
            alert('로그인 실패: ' + data.message);
        }
    })
    .catch(error => console.error('로그인 요청 중 오류:', error));
    
});



