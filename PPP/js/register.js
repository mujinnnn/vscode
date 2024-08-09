document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    const checkButton = document.querySelector('.btn-check-userid');

    checkButton.addEventListener('click', async function () {
        const userId = document.getElementById('register-userid').value;
        if (!userId) {
            alert('ID를 입력하세요.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:3000/api/validate-userid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userid: userId })
            });

            const data = await response.json();
            if (data.exists) {
                alert('사용중인 ID입니다.');
            } else {
                alert('사용 가능한 ID입니다.');
            }
        } catch (error) {
            console.error('중복 확인 오류:', error);
        }
    });

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // 기본 폼 제출 방지

        const userId = document.getElementById('register-userid').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const username = document.getElementById('register-username').value;
        const phoneNumber = document.getElementById('register-phonenumber').value;
        const emailLocal = document.getElementById('register-email-local').value;
        const emailDomain = document.getElementById('register-email-domain').value;
        const birthdate = document.getElementById('register-birthdate').value;
        const address = document.getElementById('register-address').value;
        const email = `${emailLocal}@${emailDomain}`;

        if (!userId || !password || !confirmPassword || !username || !phoneNumber || !email || !birthdate || !address) {
            alert('모든 정보를 입력해 주세요.');
            return;
        }

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userid: userId, password, phoneNumber, email, username, birthdate, address })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                alert('회원가입이 성공적으로 완료되었습니다.');
                window.location.href = 'login.html'; // 로그인 페이지로 리다이렉트
            } else {
                alert('회원가입 실패: 서버 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        }
    });
});
