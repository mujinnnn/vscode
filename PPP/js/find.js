document.addEventListener('DOMContentLoaded', function () {
    const findIdForm = document.getElementById('find-id-form');
    const findPasswordForm = document.getElementById('find-password-form');

    findIdForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // 기본 폼 제출 방지

        const username = document.getElementById('find-id-username').value;
        const email = document.getElementById('find-id-email').value;

        if (!username || !email) {
            alert('이름과 이메일을 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:3000/api/find-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                alert(`아이디 찾기 성공: ${data.userId}`);
            } else {
                alert('아이디 찾기 실패: 해당 이름과 이메일에 대한 아이디를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('아이디 찾기 오류:', error);
            alert('아이디 찾기 중 오류가 발생했습니다.');
        }
    });

    findPasswordForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // 기본 폼 제출 방지

        const userid = document.getElementById('find-password-userid').value;
        const email = document.getElementById('find-password-email').value;

        if (!userid || !email) {
            alert('아이디와 이메일을 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:3000/api/find-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userid, email })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                alert('비밀번호가 이메일로 전송되었습니다.');
            } else {
                alert('비밀번호 찾기 실패: 해당 아이디와 이메일에 대한 비밀번호를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('비밀번호 찾기 오류:', error);
            alert('비밀번호 찾기 중 오류가 발생했습니다.');
        }
    });
});
