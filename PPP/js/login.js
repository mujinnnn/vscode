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
            window.location.href = '../html/main1.html'; // 여기 경로를 확인하세요.
        } else {
            alert('로그인 실패: ' + data.message);
        }
    })
    .catch(error => console.error('로그인 요청 중 오류:', error));

    fetch('http://localhost:5500/api/check-login', {
    method: 'GET',
    credentials: 'include',  // 세션 쿠키가 포함되도록 설정
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    if (data.loggedIn) {
        // 로그인된 상태
        console.log('로그인 상태 확인됨:', data.username);
    } else {
        // 로그인되지 않은 상태
        console.log('로그인 상태 아님');
    }
})
.catch(error => console.error('로그인 상태 확인 중 오류:', error));

});
