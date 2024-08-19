    

function logout() {
    fetch('/api/logout', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                window.location.href = 'login.html';  // 로그아웃 후 로그인 페이지로 리디렉션
            } else {
                console.error('로그아웃 실패');
            }
        })
        .catch(error => console.error('로그아웃 실패:', error));
}


function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.open();
            document.write(data);
            document.close();
            updateActiveTab(page); // 페이지 로드 후 active 클래스 업데이트
            checkLoginStatus(); // 페이지 로드 후 로그인 상태 확인
        })
        .catch(error => console.error('페이지 로드 실패:', error));
}


function updateActiveTab(page) {
    // 모든 네비게이션 링크에서 'active' 클래스 제거
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // 모든 이용약관 탭에서 'active' 클래스 제거
    document.querySelectorAll('.terms-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // 각 페이지에 맞는 네비게이션 링크에 'active' 클래스 추가
    switch (page) {
        case 'about.html':
            document.getElementById('about-link').classList.add('active');
            break;
        case 'terms.html':
            document.getElementById('terms-link').classList.add('active');
            break;
        case 'inquiries.html':
            document.getElementById('inquiries-link').classList.add('active');
            break;
        case 'register.html':
            document.getElementById('register-link').classList.add('active');
            break;
        case 'login.html':
            document.getElementById('login-link').classList.add('active');
            break;
        default:
            break;
    }

    // 이용약관 세부 탭에 맞는 'active' 클래스 추가
    const termsTabs = {
        'terms-protector.html': 'protector',
        'terms-temporary.html': 'temporary-protector',
        'terms-additional.html': 'additional-policies'
    };

    if (termsTabs[page]) {
        document.querySelector(`.terms-tab[data-content="${termsTabs[page]}"]`).classList.add('active');
    }
}