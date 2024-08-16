$(document).ready(function() {
    const SERVER_IP = 'localhost';
    const socket = io(`http://${SERVER_IP}:5500`);
    const room = 'chatroom1';
    const currentUser = prompt("사용자 이름을 입력하세요:");
    const bkgNum = 12345;
    const profileIconHTML = '<div class="profile-icon"></div>';

    let isChatDisabled = false;
    let userHasReview = false;

    socket.emit('joinRoom', { room, username: currentUser, bkgNum: bkgNum });

    socket.on('roomFull', function(data) {
        alert(data.message);
        window.location.href = "/other_page.html";
    });

    const $chatMessages = $('#chat-messages');
    const $chatInput = $('#chat-input');
    const $sendButton = $('#send-button');
    const $fileButton = $('#file-button');
    const $fileUploadInput = $('#file-upload');
    const $reportButton = $('#report-button');
    const $reportModal = $('#report-modal');
    const $profileModal = $('#profile-modal');
    const $closeModalButtons = $('.close-button');
    const $fileUploadModalInput = $('#file-upload-modal');
    const $fileUploadName = $('#file-upload-name');
    const $cancelButton = $('#cancel-button');
    const $checkboxes = $('.checkbox-group input[type="checkbox"]');
    const $otherReasonInput = $('#other-reason');
    const $etcCheckbox = $('#etc-checkbox');
    const $reviewInputContainer = $('#review-input-container');
    const $reviewInput = $('#review-input');
    const $submitReviewButton = $('#submit-review-button');
    let $starRating = $('.star-rating .star');
    let checkedCount = 0;
    let lastMessageDate = null;
    let userRating = 5;

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const weekDay = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][date.getDay()];
        return `${year}년 ${month}월 ${day}일 ${weekDay}`;
    };

    const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const period = hours >= 12 ? '오후' : '오전';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${period} ${hours}:${minutes}`;
    };

    const sendMessage = (message, isMe = true) => {
        if (message && !isChatDisabled) {
            const now = new Date();
            const messageDate = formatDate(now);

            if (lastMessageDate !== messageDate) {
                const dateSeparator = $('<div>').addClass('date-separator').text(messageDate);
                $chatMessages.append(dateSeparator);
                lastMessageDate = messageDate;
            }

            const messageElement = $('<div>').addClass('message').addClass(isMe ? 'me' : 'them');
            const messageContent = $('<div>').addClass('message-content');

            const username = $('<span>').addClass('username').text(isMe ? currentUser : '상대방');
            const messageText = $('<p>').text(message);
            const time = $('<span>').addClass('time').text(formatTime(now));

            messageContent.append(username, messageText, time);
            messageElement.append(isMe ? messageContent : $(profileIconHTML).on('click', function() {
                $profileModal.show();
            }).add(messageContent));

            $chatMessages.append(messageElement);
            $chatInput.val('');
            $chatMessages.scrollTop($chatMessages.prop('scrollHeight'));

            socket.emit('sendMessage', { room, message, sender: currentUser, profileIcon: profileIconHTML });
        }
    };

    const displayMessage = (message, sender, profileIcon, isMe = true) => {
        const now = new Date();
        const messageDate = formatDate(now);

        if (lastMessageDate !== messageDate) {
            const dateSeparator = $('<div>').addClass('date-separator').text(messageDate);
            $chatMessages.append(dateSeparator);
            lastMessageDate = messageDate;
        }

        const messageElement = $('<div>').addClass('message').addClass(isMe ? 'me' : 'them');
        const messageContent = $('<div>').addClass('message-content');

        const username = $('<span>').addClass('username').text(sender);
        const messageText = $('<p>').text(message);
        const time = $('<span>').addClass('time').text(formatTime(now));

        messageContent.append(username, messageText, time);
        messageElement.append(isMe ? messageContent : $(profileIcon).on('click', function() {
            $profileModal.show();
        }).add(messageContent));

        $chatMessages.append(messageElement);
        $chatMessages.scrollTop($chatMessages.prop('scrollHeight'));
    };

    const displayFile = (file, sender, profileIcon, isMe = true) => {
        const now = new Date();
        const messageDate = formatDate(now);

        if (lastMessageDate !== messageDate) {
            const dateSeparator = $('<div>').addClass('date-separator').text(messageDate);
            $chatMessages.append(dateSeparator);
            lastMessageDate = messageDate;
        }

        const messageElement = $('<div>').addClass('message').addClass(isMe ? 'me' : 'them');
        const messageContent = $('<div>').addClass('message-content');

        const username = $('<span>').addClass('username').text(sender);
        let fileLink;
        if (file.type.startsWith('image/')) {
            fileLink = $('<img>').attr('src', file.url).addClass('uploaded-image');
            fileLink.on('click', function() {
                openImageModal(file.url);
            });
        } else {
            fileLink = $('<a>').attr('href', file.url).attr('download', file.name).text(file.name).addClass('file-link');
        }

        const time = $('<span>').addClass('time').text(formatTime(now));

        messageContent.append(username, fileLink, time);
        messageElement.append(isMe ? messageContent : $(profileIcon).on('click', function() {
            $profileModal.show();
        }).add(messageContent));

        $chatMessages.append(messageElement);
        $chatMessages.scrollTop($chatMessages.prop('scrollHeight'));
    };

    const sendFile = (file, isMe = true) => {
        const now = new Date();
        const messageDate = formatDate(now);

        if (lastMessageDate !== messageDate) {
            const dateSeparator = $('<div>').addClass('date-separator').text(messageDate);
            $chatMessages.append(dateSeparator);
            lastMessageDate = messageDate;
        }

        const messageElement = $('<div>').addClass('message').addClass(isMe ? 'me' : 'them');
        const messageContent = $('<div>').addClass('message-content');

        const username = $('<span>').addClass('username').text(currentUser);

        const reader = new FileReader();
        reader.onload = function(e) {
            let fileLink;
            if (file.type.startsWith('image/')) {
                fileLink = $('<img>').attr('src', e.target.result).addClass('uploaded-image');
                fileLink.on('click', function() {
                    openImageModal(e.target.result);
                });
            } else {
                fileLink = $('<a>').attr('href', e.target.result).attr('download', file.name).text(file.name).addClass('file-link');
            }

            const time = $('<span>').addClass('time').text(formatTime(now));

            messageContent.append(username, fileLink, time);
            messageElement.append(isMe ? messageContent : $(profileIconHTML).add(messageContent));
            $chatMessages.append(messageElement);
            $chatMessages.scrollTop($chatMessages.prop('scrollHeight'));

            socket.emit('sendFile', { room, fileData: e.target.result, fileType: file.type, fileName: file.name, sender: currentUser, profileIcon: profileIconHTML });
        };
        reader.readAsDataURL(file);
    };

    socket.on('receiveMessage', function(data) {
        if (data.sender !== currentUser) {
            displayMessage(data.message, data.sender, data.profileIcon, false);
        }
    });

    socket.on('receiveFile', function(data) {
        displayFile({ type: data.fileType, url: data.fileData, name: data.fileName }, data.sender, data.profileIcon, data.sender === currentUser);
    });

    socket.on('userJoined', function(data) {
        const userJoinedElement = $('<div>').addClass('date-separator').addClass('joined-separator').text(`${data.username} 님이 입장하셨습니다.`);
        $chatMessages.append(userJoinedElement);
        $chatMessages.scrollTop($chatMessages.prop('scrollHeight'));
    });

socket.on('chatDisabled', function(data) {
    isChatDisabled = true;
    let message;
    
    if (data.isReporter) {
        message = `<div class="date-separator">신고한 상대와는 채팅이 불가합니다.</div>`;
    } else {
        message = `<div class="date-separator">상대방이 신고하여 채팅이 금지되었습니다.</div>`;
    }

    if ($('.date-separator').last().text() !== $(message).text()) {
        $chatMessages.append(message);
    }

    $chatMessages.append('<div class="alert-message">신고 상태로 인해 채팅이 불가능합니다.</div>');
    $chatMessages.scrollTop($chatMessages.prop('scrollHeight'));
    
    // 채팅 입력창과 버튼 비활성화
    $chatInput.prop('disabled', true);
    $sendButton.prop('disabled', true);
    $fileButton.prop('disabled', true);
});


    // 폼의 기본 제출 동작을 막기 위해 이벤트 핸들러 수정
    $('#submit-report-button').on('click', function(event) {
        event.preventDefault(); // 기본 동작 막기
        isChatDisabled = true;
        $reportModal.hide();
        socket.emit('reportUser', { room, reportedUser: '상대방', reporter: currentUser, bkgNum: bkgNum });

        // 신고 후 화면에 메시지 표시
        const alertMessage = $('<div>').addClass('alert-message').text('신고 되어 채팅이 불가상태입니다.');
        $chatMessages.append(alertMessage);
        $chatMessages.scrollTop($chatMessages.prop('scrollHeight'));
    });

    $sendButton.on('click', function() {
        const message = $chatInput.val().trim();
        sendMessage(message);
    });

    $chatInput.on('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            $sendButton.click();
        }
    });

    $fileButton.on('click', function() {
        $fileUploadInput.click();
    });

    $fileUploadInput.on('change', function() {
        const file = this.files[0];
        if (file) {
            sendFile(file);
        }
    });

    const handleCheckboxChange = function() {
        if ($(this).prop('checked')) {
            checkedCount++;
        } else {
            checkedCount--;
        }

        if (checkedCount > 2) {
            $(this).prop('checked', false);
            checkedCount--;
            alert('두 가지 항목만 선택 가능합니다.');
        }

        if ($(this).attr('id') === 'etc-checkbox') {
            $otherReasonInput.prop('disabled', !$(this).prop('checked'));
        }
    };

    const openImageModal = (src) => {
        const newWindow = window.open("", "_blank", "width=800,height=600");
        newWindow.document.write(
            `<!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <title>이미지 보기</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f0f0f0;
                    }
                    img {
                        max-width: 90%;
                        max-height: 90%;
                        object-fit: contain;
                    }
                    .buttons {
                        position: fixed;
                        bottom: 10px;
                        left: 50%;
                        transform: translateX(-50%);
                        display: flex;
                        gap: 10px;
                    }
                    .buttons button {
                        padding: 10px;
                        border: none;
                        background-color: #4CAF50;
                        color: white;
                        cursor: pointer;
                        border-radius: 5px;
                        width: 50px;
                    }
                    .buttons #save {
                        width: 80px;
                    }
                </style>
            </head>
            <body>
                <img id="modal-image" src="${src}" alt="이미지">
                <div class="buttons">
                    <button id="zoom-in">+</button>
                    <button id="zoom-out">-</button>
                    <button id="rotate">↻</button>
                    <button id="save">저장</button>
                </div>
                <script>
                    let currentScale = 1;
                    let currentRotate = 0;
                    const modalImage = document.getElementById('modal-image');

                    document.getElementById('zoom-in').addEventListener('click', function() {
                        currentScale += 0.1;
                        modalImage.style.transform = \`scale(\${currentScale}) rotate(\${currentRotate}deg)\`;
                    });

                    document.getElementById('zoom-out').addEventListener('click', function() {
                        if (currentScale > 0.1) {
                            currentScale -= 0.1;
                            modalImage.style.transform = \`scale(\${currentScale}) rotate(\${currentRotate}deg)\`;
                        }
                    });

                    document.getElementById('rotate').addEventListener('click', function() {
                        currentRotate += 90;
                        modalImage.style.transform = \`scale(\${currentScale}) rotate(\${currentRotate}deg)\`;
                    });

                    document.getElementById('save').addEventListener('click', function() {
                        const link = document.createElement('a');
                        link.href = modalImage.src;
                        link.download = 'image.png';
                        link.click();
                    });
                </script>
            </body>
            </html>`
        );
    };

    const applyStarRating = () => {
        $('.review-rating').each(function() {
            const rating = parseFloat($(this).data('rating'));
            $(this).empty(); 
            for (let i = 1; i <= 5; i++) {
                const star = $('<span>').addClass('star').text('★');
                if (i > rating) {
                    star.addClass('empty');
                } else {
                    star.addClass('filled');
                }
                $(this).append(star);
            }
        });

        $starRating.off('click').on('click', function() {
            userRating = $(this).index() + 1;
            $starRating.removeClass('filled').addClass('empty');
            $starRating.slice(0, userRating).addClass('filled');
        });
    };

    const addReview = (reviewText, rating, reviewer) => {
        const isCurrentUserReview = reviewer === currentUser;
        
        const newReview = 
            `<div class="review" data-reviewer="${reviewer}">
                <div class="review-header">
                    <div class="review-rating" data-rating="${rating}"></div>
                    <span class="reviewer-name">${reviewer}</span>
                    ${isCurrentUserReview ? '<button class="delete-review-button small-button">삭제</button>' : '<button class="report-review-button small-button">신고</button>'}
                </div>
                <div class="review-text">${reviewText}</div>
            </div>`;

        $('.reviews').append(newReview);
        applyStarRating();

        $('.delete-review-button').on('click', function() {
            if (confirm('정말 삭제하시겠습니까?')) {
                const reviewElement = $(this).closest('.review');
                const reviewer = reviewElement.data('reviewer');
                reviewElement.remove();
                socket.emit('deleteReview', { room, reviewer, bkgNum: bkgNum, rvId: null });
            }
        });

        $('.report-review-button').on('click', function() {
            const reviewElement = $(this).closest('.review');
            const reviewer = reviewElement.data('reviewer');
            openReviewReportModal(reviewer);
        });
    };

    socket.on('reviewSubmitted', function(data) {
        addReview(data.reviewText, data.rating, data.reviewer);
    });

    $reportButton.on('click', function() {
        $reportModal.show(); 
    });

    $closeModalButtons.on('click', function() {
        $(this).closest('.modal').hide();
    });

    $fileUploadModalInput.on('change', function() {
        const fileName = this.files[0] ? this.files[0].name : '선택된 파일 없음';
        $fileUploadName.text(fileName);
    });

    $cancelButton.on('click', function() {
        $reportModal.hide();
    });

    $checkboxes.on('change', handleCheckboxChange);

    $submitReviewButton.on('click', function() {
        const reviewText = $reviewInput.val().trim();
        if (reviewText) {
            addReview(reviewText, userRating, currentUser);
            $reviewInput.val('');
            $starRating.removeClass('filled').addClass('empty');
            $starRating.slice(0, 5).addClass('empty');
            $starRating.off('click').on('click', handleStarClick);
            socket.emit('submitReview', { room, reviewText, rating: userRating, reviewer: currentUser, bkgNum: bkgNum });
        }
    });

    $(document).on('click', '.profile-icon', function() { 
        $profileModal.show();
    });

    $('#exit-button').on('click', function() {
        const confirmExit = confirm("채팅방을 나가시겠습니까?");
        if (confirmExit) {
            $chatMessages.empty(); 
            socket.emit('leaveRoom', { room, username: currentUser });
            window.location.href = '../html/main.html'; // main.html로 이동
        }
    });

    applyStarRating();
    $chatMessages.scrollTop($chatMessages.prop('scrollHeight'));
});





