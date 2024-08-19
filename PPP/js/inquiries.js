document.addEventListener('DOMContentLoaded', function () {
    loadInquiries('service');
    loadInquiries('review');
    loadInquiries('account');
    loadInquiries('report');

    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = new FormData(this);
            formData.append('userId', 1);

            try {
                const response = await fetch('http://localhost:5500/api/inquiries', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });

                const result = await response.json();
                if (result.success) {
                    alert('문의가 성공적으로 등록되었습니다.');
                    location.reload();
                } else {
                    alert('문의 등록 중 오류가 발생했습니다: ' + result.message);
                }
            } catch (error) {
                console.error('폼 제출 오류:', error);
                alert('문의 등록 중 오류가 발생했습니다.');
            }
        });
    }

    const commentForm = document.getElementById('commentForm');
    if (commentForm) {  // 요소가 존재하는지 확인
        commentForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const inquiryId = document.getElementById('inquiryId').value;
            const commentText = document.getElementById('commentText').value;

            fetch('http://localhost:5500/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inquiryId, text: commentText })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    loadInquiryDetails(inquiryId); // 댓글 작성 후 새로고침
                    document.getElementById('commentText').value = ''; // 댓글 입력창 초기화
                } else {
                    alert('댓글 작성 중 오류가 발생했습니다.');
                }
            })
            .catch(error => {
                console.error('댓글 작성 중 오류 발생:', error);
                alert('댓글 작성 중 오류가 발생했습니다.');
            });
        });
    }

    const tabs = document.querySelectorAll('.terms-tab');
    const contentItems = document.querySelectorAll('.terms-content-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(tab => tab.classList.remove('active'));
            contentItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            const contentId = this.getAttribute('data-content');
            document.getElementById(contentId).classList.add('active');
        });
    });
});

function loadInquiries(type) {
    let inquiryType = '';
    switch(type) {
        case 'service':
            inquiryType = '서비스 문의';
            break;
        case 'review':
            inquiryType = '리뷰 및 평점 문의';
            break;
        case 'account':
            inquiryType = '계정 관련 문의';
            break;
        case 'report':
            inquiryType = '신고 문의';
            break;
        default:
            console.error('Unknown inquiry type:', type);
            return;
    }

    fetch(`http://localhost:5500/api/inquiries?type=${encodeURIComponent(inquiryType)}`)
        .then(response => response.json())
        .then(data => {
            const inquiryContainer = document.querySelector(`#${type} .inquiry-container`);
            if (inquiryContainer && data.length > 0) {
                data.forEach(inquiry => {
                    const inquiryItem = document.createElement('div');
                    inquiryItem.classList.add('inquiry-item');
                    inquiryItem.setAttribute('data-id', inquiry.INQ_ID);

                    const inquiryHeader = document.createElement('div');
                    inquiryHeader.classList.add('inquiry-header');

                    const inquiryUsername = document.createElement('span');
                    inquiryUsername.classList.add('inquiry-username');
                    inquiryUsername.textContent = inquiry.U_NAME;  // U_NAME 사용

                    const inquiryDate = document.createElement('span');
                    inquiryDate.classList.add('inquiry-date');
                    const date = new Date(inquiry.INQ_DATE);
                    const formattedDate = date.toLocaleDateString();
                    inquiryDate.textContent = formattedDate;

                    inquiryHeader.appendChild(inquiryUsername);
                    inquiryHeader.appendChild(inquiryDate);

                    const inquiryTitle = document.createElement('div');
                    inquiryTitle.classList.add('inquiry-title');
                    inquiryTitle.textContent = inquiry.INQ_TITLE;

                    const inquiryStatusBox = document.createElement('div');
                    inquiryStatusBox.classList.add('inquiry-status-box');

                    const inquiryStatus = document.createElement('span');
                    inquiryStatus.classList.add('inquiry-status');
                    inquiryStatus.textContent = inquiry.INQ_STATUS;

                    inquiryStatusBox.appendChild(inquiryStatus);

                    inquiryItem.appendChild(inquiryHeader);
                    inquiryItem.appendChild(inquiryTitle);
                    inquiryItem.appendChild(inquiryStatusBox);

                    inquiryContainer.appendChild(inquiryItem);

                    // 문의 클릭 이벤트
                    inquiryItem.addEventListener('click', () => {
                        loadInquiryDetails(inquiry.INQ_ID);
                    });
                });
            } else if (!inquiryContainer) {
                console.error(`Cannot find container for type ${type}`);
            }
        })
        .catch(error => {
            console.error('문의사항 불러오기 중 오류 발생:', error);
        });
}


function loadInquiryDetails(inquiryId) {
    fetch(`http://localhost:5500/api/inquiries/${inquiryId}`)
        .then(response => response.json())
        .then(data => {
            if (data.inquiry) {
                const titleElement = document.getElementById('inquiry-title');
                const contentElement = document.getElementById('inquiry-content');
                const dateElement = document.getElementById('inquiry-date');

                // 요소가 존재할 경우에만 값을 설정
                if (titleElement) {
                    titleElement.textContent = data.inquiry.INQ_TITLE;
                }
                if (contentElement) {
                    contentElement.textContent = data.inquiry.INQ_TEXT;
                }
                if (dateElement) {
                    dateElement.textContent = new Date(data.inquiry.INQ_DATE).toLocaleString();
                }

                const commentsContainer = document.getElementById('comments-container');
                if (commentsContainer) {
                    commentsContainer.innerHTML = '';
                    data.comments.forEach(comment => {
                        const commentItem = document.createElement('div');
                        commentItem.classList.add('comment-item');
                        commentItem.innerHTML = `
                            <p>${comment.CMT_TEXT}</p>
                            <p><small>${new Date(comment.CMT_DATE).toLocaleString()}</small></p>
                        `;
                        commentsContainer.appendChild(commentItem);
                    });
                }

                const inquiryDetails = document.getElementById('inquiry-details');
                if (inquiryDetails) {
                    inquiryDetails.style.display = 'block';
                }

                const inquiryIdInput = document.getElementById('inquiryId');
                if (inquiryIdInput) {
                    inquiryIdInput.value = inquiryId;
                }
            }
        })
        .catch(error => {
            console.error('문의 상세 내용 로드 중 오류 발생:', error);
        });
}


function showInquiryList() {
    const inquiryList = document.querySelector('.terms-content');
    inquiryList.style.display = 'block'; // 목록을 표시

    const inquiryDetails = document.getElementById('inquiry-details');
    inquiryDetails.style.display = 'none'; // 상세 정보를 숨김
}

function showForm(type) {
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.style.display = 'block';
        const inputType = inquiryForm.querySelector('input[name="type"]');
        if (inputType) {
            inputType.value = type;
        }
    }
}