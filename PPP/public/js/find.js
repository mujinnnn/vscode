document.addEventListener('DOMContentLoaded', function () {
    // 아이디 찾기 폼 처리
    document.getElementById('find-id-form').addEventListener('submit', async function (e) {
        e.preventDefault(); // 기본 폼 제출 방지
        const username = document.getElementById('find-id-username').value;
        const email = document.getElementById('find-id-email').value;

        if (!username || !email) {
            alert('이름과 이메일을 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5500/api/find-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert(`아이디 찾기 성공: ${data.userId}`);
                } else {
                    alert('아이디 찾기 실패: 해당 이름과 이메일에 대한 아이디를 찾을 수 없습니다.');
                }
            } else {
                alert('서버 응답이 정상적이지 않습니다.');
            }
        } catch (error) {
            console.error('아이디 찾기 오류:', error);
            alert('아이디 찾기 중 오류가 발생했습니다.');
        }
    });

    // 비밀번호 찾기 폼 처리
    document.getElementById('find-password-form').addEventListener('submit', async function (e) {
        e.preventDefault(); // 기본 폼 제출 방지

        const userid = document.getElementById('find-password-userid').value;
        const email = document.getElementById('find-password-email').value;

        if (!userid || !email) {
            alert('아이디와 이메일을 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5500/api/request-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userid, email })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('인증번호가 이메일로 전송되었습니다.');
                    console.log('Redirecting to resetpw.html'); // 리디렉션 직전 로그 추가
                    window.location.href = '../html/resetpw.html?email=' + encodeURIComponent(email);
                } else {
                    alert('비밀번호 찾기 실패: 해당 아이디와 이메일에 대한 정보를 찾을 수 없습니다.');
                }
            } else {
                alert('서버 응답이 정상적이지 않습니다.');
            }
        } catch (error) {
            console.error('비밀번호 찾기 오류:', error);
            alert('비밀번호 찾기 중 오류가 발생했습니다.');
        }
    });
});



