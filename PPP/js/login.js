document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // 기본 폼 제출 방지

        const userid = document.getElementById('login-userid').value;
        const password = document.getElementById('login-password').value;

        if (!userid || !password) {
            alert('아이디와 비밀번호를 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userid, password })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                alert('로그인 성공');
                window.location.href = 'main.html'; // 메인 페이지로 리다이렉트
            } else {
                alert('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    });
});
