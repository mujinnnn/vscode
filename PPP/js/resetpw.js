document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    const resetPasswordForm = document.getElementById('reset-password-form');
    console.log('Reset password form:', resetPasswordForm); // 폼이 제대로 선택되었는지 확인

    resetPasswordForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        console.log('Form submitted'); // 폼 제출 이벤트가 발생하는지 확인

        const token = document.getElementById('reset-password-token').value;
        const newPassword = document.getElementById('reset-password-new-password').value;
        const confirmPassword = document.getElementById('reset-password-confirm-password').value;
        const email = new URLSearchParams(window.location.search).get('email');
        console.log('Token:', token, 'New Password:', newPassword, 'Email:', email); // 입력 값 확인

        if (newPassword !== confirmPassword) {
            alert('새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        try {
            console.log('Attempting to send fetch request'); // fetch 호출 전 확인
            const response = await fetch('http://localhost:5500/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, newPassword, email })
            });

            console.log('Response received:', response.status); // 서버 응답 상태 확인

            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data); // 서버로부터 받은 데이터 확인

                if (data.success) {
                    alert('비밀번호가 성공적으로 재설정되었습니다.');
                    console.log('Redirecting to login page');
                    window.location.href = '../html/login.html?email=' + encodeURIComponent(email);
                } else {
                    alert('비밀번호 재설정 실패: ' + data.message);
                }
            } else {
                console.log('Server responded with an error:', response.status);
                alert('서버 응답이 정상적이지 않습니다.');
            }
        } catch (error) {
            console.error('비밀번호 재설정 오류:', error);
            alert('비밀번호 재설정 중 오류가 발생했습니다.');
        }
    });
});





