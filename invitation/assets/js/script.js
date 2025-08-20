document.addEventListener('DOMContentLoaded', function () {
    // Music button interaction
    const musicButton = document.querySelector('.music-button');
    if (musicButton) {
        musicButton.addEventListener('click', function (e) {
            this.style.transform = 'translateY(-5px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1)';
            }, 150);
        });
    }

    // Add sparkle effect on mouse move
    const musicBtnFloat = document.querySelector('.music-btn');
    if (musicBtnFloat) musicBtnFloat.setAttribute('data-tooltip', 'Nghe nhạc');

    const rsvpBtnFloat = document.querySelector('.rsvp-btn');
    if (rsvpBtnFloat) rsvpBtnFloat.setAttribute('data-tooltip', 'Gửi lời chúc');

    const translateBtn = document.querySelector('.translate-btn');
    if (translateBtn) translateBtn.setAttribute('data-tooltip', 'Dịch sang tiếng Anh');

    document.addEventListener('mousemove', function (e) {
        if (Math.random() > 0.95) {
            createSparkle(e.clientX, e.clientY);
        }
    });

    // Add CSS animation for sparkles
    if (!document.querySelector('#sparkle-styles')) {
        const style = document.createElement('style');
        style.id = 'sparkle-styles';
        style.textContent = `
            @keyframes sparkleAnimation {
                0% {
                    opacity: 1;
                    transform: scale(0) rotate(0deg);
                }
                50% {
                    opacity: 1;
                    transform: scale(1) rotate(180deg);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Load and display existing messages
    loadMessages();

    // RSVP Form handling
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitRSVP();
        });
    }

    // Initialize floating button functionality
    const musicBtn = document.querySelector('.music-btn');
    const translateButton = document.querySelector('.translate-btn');
    const rsvpBtn = document.querySelector('.rsvp-btn');
    const backBtn = document.querySelector('#backToTop');

    if (musicBtn) musicBtn.addEventListener('click', toggleMusic);
    if (translateButton) translateButton.addEventListener('click', translatePage);
    if (rsvpBtn) rsvpBtn.addEventListener('click', openRSVPModal);
    if (backBtn) backBtn.addEventListener('click', scrollToTop);

    // Add scroll event listener for back to top button
    window.addEventListener('scroll', function () {
        const backToTop = document.querySelector('#backToTop');
        if (window.scrollY > 300) {
            if (backToTop) backToTop.classList.add('show');
        } else {
            if (backToTop) backToTop.classList.remove('show');
        }
    });

    // Add event listener for Google Maps
    const mapWrapper = document.querySelector('.map-wrapper');
    if (mapWrapper) {
        mapWrapper.addEventListener('click', openInGoogleMaps);
    }

    // Initialize snow effect
    createSnowEffect();

    // Make openInGoogleMaps globally available
    window.openInGoogleMaps = openInGoogleMaps;
});

// Sparkle effect function (single definition)
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.background = '#5dade2'; // Updated to match blue theme
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1000';
    sparkle.style.animation = 'sparkleAnimation 1s ease-out forwards';

    document.body.appendChild(sparkle);

    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000);
}

// RSVP Modal functions
function openRSVPModal() {
    const modal = document.getElementById('rsvpModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRSVPModal() {
    const modal = document.getElementById('rsvpModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Click outside modal to close
document.addEventListener('click', function (e) {
    const modal = document.getElementById('rsvpModal');
    if (e.target === modal) {
        closeRSVPModal();
    }
});

// Messages handling
function saveMessage(name, message) {
    let messages = JSON.parse(localStorage.getItem('graduationMessages') || '[]');

    const newMessage = {
        id: Date.now(),
        name: name,
        message: message,
        timestamp: new Date().toLocaleString('vi-VN')
    };

    messages.unshift(newMessage);
    localStorage.setItem('graduationMessages', JSON.stringify(messages));

    displayMessages(messages);
    showMessagesSection();
}

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('graduationMessages') || '[]');
    if (messages.length > 0) {
        displayMessages(messages);
        showMessagesSection();
    }
}

function displayMessages(messages) {
    const messagesList = document.getElementById('messagesList');

    if (messages.length === 0) {
        messagesList.innerHTML = '<p style="text-align: center; color: #7f8c8d; font-style: italic;">Chưa có lời chúc nào. Hãy là người đầu tiên!</p>';
        return;
    }

    messagesList.innerHTML = messages.map(msg => {
        let attendanceIcon = '';
        let attendanceText = '';

        if (msg.attendance) {
            switch (msg.attendance) {
                case 'yes':
                    attendanceIcon = '✅';
                    attendanceText = 'Sẽ tham dự';
                    break;
                case 'maybe':
                    attendanceIcon = '❓';
                    attendanceText = 'Có thể tham dự';
                    break;
                case 'no':
                    attendanceIcon = '❌';
                    attendanceText = 'Không thể tham dự';
                    break;
            }
        }

        return `
        <div class="message-item">
            <div class="message-author">💝 ${escapeHtml(msg.name)} ${attendanceIcon ? `<span class="attendance-status">${attendanceIcon} ${attendanceText}</span>` : ''}</div>
            ${msg.message ? `<div class="message-text">"${escapeHtml(msg.message)}"</div>` : ''}
            <div class="message-time">${msg.timestamp || new Date(msg.timestamp).toLocaleString('vi-VN')}</div>
        </div>
    `;
    }).join('');
}

function showMessagesSection() {
    const messagesSection = document.getElementById('messagesSection');
    messagesSection.classList.add('show');
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #5dade2, #2980b9);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 5px 15px rgba(93, 173, 226, 0.4);
        z-index: 1001;
        font-family: 'Playfair Display', serif;
        font-weight: 600;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    showNotification('⬆️ Đã về đầu trang', 'info');
}

// Music toggle functionality
let isPlaying = false;
let audio = null;

function toggleMusic() {
    const musicButton = document.querySelector('.music-btn');

    if (!audio) {
        audio = document.getElementById('invitationMusic');
        if (!audio) {
            showNotification('❌ Không tìm thấy file nhạc', 'error');
            return;
        }
        audio.loop = true;
        audio.volume = 0.6;
    }

    if (!isPlaying) {
        audio.play().then(() => {
            musicButton.innerHTML = '🎵⏸️';
            musicButton.style.color = '#5dade2';
            isPlaying = true;
            showNotification('🎵 Nhạc đã được bật', 'success');
        }).catch((error) => {
            console.error('Error playing audio:', error);
            showNotification('❌ Không thể phát nhạc', 'error');
        });
    } else {
        audio.pause();
        musicButton.innerHTML = '🎵';
        musicButton.style.color = '#2c3e50';
        isPlaying = false;
        showNotification('🎵 Nhạc đã tắt', 'info');
    }
}

// Translation functionality
let isEnglish = false;

function translatePage() {
    const translateButton = document.querySelector('.translate-btn');

    if (!isEnglish) {
        translateToEnglish();
        translateButton.innerHTML = '🌐EN';
        translateButton.style.color = '#5dade2';
        translateButton.setAttribute('data-tooltip', 'Translate to Vietnamese');
        isEnglish = true;
        showNotification('🌐 Translated to English', 'success');
    } else {
        translateToVietnamese();
        translateButton.innerHTML = '🌐VI';
        translateButton.style.color = '#2c3e50';
        translateButton.setAttribute('data-tooltip', 'Dịch sang tiếng Anh');
        isEnglish = false;
        showNotification('🌐 Đã dịch sang Tiếng Việt', 'success');
    }
}

// Translate to English function
function translateToEnglish() {
    // Main invitation card
    const name = document.querySelector('.name');
    if (name) name.textContent = 'Danh Kieu Han';

    const title = document.querySelector('.title');
    if (title) title.textContent = 'Graduation Ceremony';

    const details = document.querySelectorAll('.details p');
    if (details.length >= 2) {
        details[0].innerHTML = '<strong>📅 Time:</strong> 1:30 PM, August 22, 2025';
        details[1].innerHTML = '<strong>📍 Location:</strong> Nam Can Tho University Hall';
    }

    const specialMessage = document.querySelector('.special-message');
    if (specialMessage) specialMessage.textContent = 'Your presence would be a great honor!';

    const musicButtonSpan = document.querySelector('.music-button span:last-child');
    if (musicButtonSpan) musicButtonSpan.textContent = 'Click to play music';

    // Academic section
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) sectionTitle.textContent = 'Academic Journey';

    // Timeline items
    const timelineTitles = document.querySelectorAll('.timeline-title');
    const timelineDescs = document.querySelectorAll('.timeline-description');

    if (timelineTitles.length >= 3) {
        timelineTitles[0].textContent = '🎓 Nam Can Tho University';
        timelineTitles[1].textContent = '💼 Internship & Projects';
        timelineTitles[2].textContent = '🌱 Foundation Years';
    }

    if (timelineDescs.length >= 3) {
        timelineDescs[0].textContent = 'Information Technology Major';
        timelineDescs[1].textContent = 'Internship at tech companies and personal projects';
        timelineDescs[2].textContent = 'Building fundamental knowledge and skills';
    }

    // Timeline highlights
    const timelineHighlights = document.querySelectorAll('.timeline-highlight');
    const highlightTexts = [
        '<strong>GPA:</strong> 3.3/4.0 | <strong>Grade:</strong> Excellent',
        '• Learning and developing web applications with PHP, C#<br>• Participating in graduation thesis<br>• Completing English certificate equivalent to VStep (Overall 7.5)',
        '• Completing foundation courses with high grades<br>• Joining Programming Club<br>• Learning IT specialized English'
    ];
    timelineHighlights.forEach((highlight, index) => {
        if (highlight && highlightTexts[index]) {
            highlight.innerHTML = highlightTexts[index];
        }
    });

    // Gallery section
    const galleryTitle = document.querySelector('.gallery-title');
    if (galleryTitle) galleryTitle.textContent = 'Memories Collection';

    // Photo captions
    const photoCaptions = document.querySelectorAll('.photo-description');
    const captionTexts = [
        'First days at university, full of excitement and eagerness to learn.',
        'A bit disappointed with the learning environment, but it\'s okay, I\'m fine =))).',
        'Year of ups and downs, pressure and first projects.',
        'Lucky to experience reality at FSoft Saigon and TMA Solutions, complete thesis and prepare for new journey.',
        'Present Kieu Han, a bit unstable and tired but still trying every day.',
        'Kieu Han will continue to pursue IT career, constantly learning and developing herself.',
        'Wonderful friends and unforgettable memories in 4 university years.',
        'Special moments, memorable achievements and valuable experiences.'
    ];
    photoCaptions.forEach((caption, index) => {
        if (caption && captionTexts[index]) {
            caption.textContent = captionTexts[index];
        }
    });

    const galleryNote = document.querySelector('.gallery-note');
    if (galleryNote) galleryNote.textContent = '🌟 4-year university memory collection - From freshman to bachelor!';

    // Save the date section
    const saveTitle = document.querySelector('.save-date-title');
    if (saveTitle) saveTitle.textContent = 'Event Information';

    const saveDateContents = document.querySelectorAll('.save-date-content');
    if (saveDateContents.length >= 2) {
        saveDateContents[0].textContent = 'Graduation ceremony marks the end of a learning journey and the beginning of new dreams.';
        saveDateContents[1].textContent = 'Your presence will make this day more meaningful!';
    }

    const dateHighlight = document.querySelector('.date-highlight');
    if (dateHighlight) dateHighlight.textContent = '🗓️ August 22, 2025 - 1:30 PM';

    // Location info
    const locationTitle = document.querySelector('.location-title');
    if (locationTitle) locationTitle.textContent = '📍 Event Location';

    const locationText = document.querySelector('.location-text');
    if (locationText) {
        locationText.innerHTML = `
            <strong>Nam Can Tho University Hall</strong><br>
            📮 Address: 168 Nguyen Van Cu Noi Dai, An Binh, Ninh Kieu, Can Tho, Vietnam<br>
            📞 Hotline: 0292.3.872.745<br>
            🌐 Website: <a href="https://ntu.edu.vn" target="_blank">ntu.edu.vn</a>
        `;
    }

    const directionsInfo = document.querySelector('.directions-info');
    if (directionsInfo) {
        directionsInfo.innerHTML = `
            <p>🚗 <strong>Directions:</strong></p>
            <ul>
                <li>From Can Tho center: Follow Nguyen Van Cu Noi Dai road</li>
                <li>The university is located at 168 Nguyen Van Cu Noi Dai, An Binh</li>
            </ul>
        `;
    }

    const mapClickHint = document.querySelector('.map-click-hint');
    if (mapClickHint) mapClickHint.textContent = '📍 Click to open Google Maps';

    const rsvpButtonSpans = document.querySelectorAll('.rsvp-button span');
    if (rsvpButtonSpans.length >= 2) rsvpButtonSpans[1].textContent = 'Will you attend?';

    // Messages section
    const messagesTitle = document.querySelector('.messages-title');
    if (messagesTitle) messagesTitle.textContent = 'Wishes from Friends';

    // RSVP Modal
    const modalTitle = document.querySelector('.modal-title');
    if (modalTitle) modalTitle.textContent = 'Will you attend?';

    const formLabels = document.querySelectorAll('.form-label');
    if (formLabels.length >= 2) {
        formLabels[0].textContent = 'Your Name:';
        formLabels[1].textContent = 'Your Wishes:';
    }

    const guestNameInput = document.getElementById('guestName');
    if (guestNameInput) guestNameInput.placeholder = 'Enter your name';

    const guestMessageInput = document.getElementById('guestMessage');
    if (guestMessageInput) guestMessageInput.placeholder = 'Leave good wishes for Kieu Han...';

    // Attendance options
    const optionLabel = document.querySelector('.option-label');
    if (optionLabel) optionLabel.textContent = 'Will you attend?';

    const attendLabels = document.querySelectorAll('.radio-option label');
    const attendTexts = [
        '🎉 Yes, I will attend!',
        '🤔 Maybe, plan B',
        '😢 Sorry, I can\'t attend!'
    ];
    attendLabels.forEach((label, index) => {
        if (label && attendTexts[index]) {
            label.textContent = attendTexts[index];
        }
    });

    // Modal buttons
    const modalButtons = document.querySelectorAll('.modal-buttons button');
    if (modalButtons.length >= 2) {
        modalButtons[0].textContent = 'Send Wishes';
        modalButtons[1].textContent = 'Close';
    }

    // Footer
    const footerCouples = document.querySelectorAll('#footerCouple');
    if (footerCouples.length >= 2) {
        footerCouples[0].textContent = 'Thank you!'; // First one (header)
        footerCouples[1].textContent = 'Kieu Han';   // Second one (in footer-text)
    }

    const footerMessageEn = document.getElementById('footerMessageEn');
    const footerMessageVn = document.getElementById('footerMessageVn');
    if (footerMessageEn && footerMessageVn) {
        footerMessageEn.style.display = 'block';
        footerMessageVn.style.display = 'none';
    }

    const footerShareText = document.getElementById('footerShareText');
    if (footerShareText) footerShareText.textContent = 'Share the joy';

    const footerCopyright = document.getElementById('footerCopyright');
    if (footerCopyright) {
        footerCopyright.innerHTML = 'Designed by Kieu Han with 💙 for my graduation celebration <br>Contact me: 0945255664';
    }
}

// Translate to Vietnamese function
function translateToVietnamese() {
    // Main invitation card
    const name = document.querySelector('.name');
    if (name) name.textContent = ' Danh Kiều Hân';

    const title = document.querySelector('.title');
    if (title) title.textContent = 'Lễ tốt nghiệp';

    const details = document.querySelectorAll('.details p');
    if (details.length >= 2) {
        details[0].innerHTML = '<strong>📅 Thời gian:</strong> 1h30, ngày 22/8/2025';
        details[1].innerHTML = '<strong>📍 Địa điểm:</strong> Hội trường Trường Đại học Nam Cần Thơ';
    }

    const specialMessage = document.querySelector('.special-message');
    if (specialMessage) specialMessage.textContent = 'Sự hiện diện của bạn là niềm vinh dự lớn lao!';

    const musicButtonSpan = document.querySelector('.music-button span:last-child');
    if (musicButtonSpan) musicButtonSpan.textContent = 'Click vào để để nghe nhạc';

    // Academic section
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) sectionTitle.textContent = 'Quá trình học tập';

    // Timeline items
    const timelineTitles = document.querySelectorAll('.timeline-title');
    const timelineDescs = document.querySelectorAll('.timeline-description');

    if (timelineTitles.length >= 3) {
        timelineTitles[0].textContent = '🎓 Đại học Nam Cần Thơ';
        timelineTitles[1].textContent = '💼 Thực tập & Dự án';
        timelineTitles[2].textContent = '🌱 Những năm đầu';
    }

    if (timelineDescs.length >= 3) {
        timelineDescs[0].textContent = 'Chuyên ngành Công nghệ Thông tin';
        timelineDescs[1].textContent = 'Thực tập tại công ty công nghệ và thực hiện các dự án cá nhân';
        timelineDescs[2].textContent = 'Xây dựng nền tảng kiến thức và kỹ năng';
    }

    // Timeline highlights
    const timelineHighlights = document.querySelectorAll('.timeline-highlight');
    const highlightTexts = [
        '<strong>GPA:</strong> 3.3/4.0 | <strong>Xếp loại:</strong> Giỏi',
        '• Học tập và phát triển ứng dụng web với các ngôn ngữ PHP, C#<br>• Tham gia thực hiện khoá luận tốt nghiệp<br>• Hoàn thành chứng chỉ tiếng Anh tương đương VStep (Overal 7.5)',
        '• Hoàn thành các môn cơ sở với khá cao<br>• Tham gia câu lạc bộ Lập trình<br>• Học tiếng Anh chuyên ngành IT'
    ];
    timelineHighlights.forEach((highlight, index) => {
        if (highlight && highlightTexts[index]) {
            highlight.innerHTML = highlightTexts[index];
        }
    });

    // Gallery section
    const galleryTitle = document.querySelector('.gallery-title');
    if (galleryTitle) galleryTitle.textContent = 'Bộ sưu tập kỷ niệm';

    // Photo captions
    const photoCaptions = document.querySelectorAll('.photo-description');
    const captionTexts = [
        'Những ngày đầu bước chân vào đại học, tràn đầy hứng khởi và khao khát học hỏi.',
        'Hơi vỡ mộng bởi môi trường học tập, nhưng không sao, I\'m fine =))).',
        'Năm của những ngày chênh vênh, áp lực và những dự án đầu tiên.',
        'May mắn được đi trải nghiệm thực tế tại FSoft Sài Gòn và TMA Solutions, hoàn thành luận văn và chuẩn bị cho hành trình mới.',
        'Kiều Hân của hiện tại, có chút chênh vênh và mỏi mệt nhưng vẫn cố gắng từng ngày.',
        'Kiều Hân vẫn sẽ cố gắng tiếp tục con đường IT, không ngừng học hỏi và phát triển bản thân.',
        'Những người bạn tuyệt vời và kỷ niệm không thể quên trong 4 năm đại học.',
        'Những khoảnh khắc đặc biệt, thành tựu đáng nhớ và trải nghiệm quý giá.'
    ];
    photoCaptions.forEach((caption, index) => {
        if (caption && captionTexts[index]) {
            caption.textContent = captionTexts[index];
        }
    });

    const galleryNote = document.querySelector('.gallery-note');
    if (galleryNote) galleryNote.textContent = '🌟 Bộ sưu tập kỷ niệm 4 năm đại học - Từ tân sinh viên đến cử nhân!';

    // Save the date section
    const saveTitle = document.querySelector('.save-date-title');
    if (saveTitle) saveTitle.textContent = 'Thông tin về buổi lễ';

    const saveDateContents = document.querySelectorAll('.save-date-content');
    if (saveDateContents.length >= 2) {
        saveDateContents[0].textContent = 'Lễ tốt nghiệp là khoảnh khắc đánh dấu sự kết thúc của một hành trình học tập và bắt đầu của những ước mơ mới.';
        saveDateContents[1].textContent = 'Sự hiện diện của bạn sẽ làm cho ngày này trở nên ý nghĩa hơn!';
    }

    const dateHighlight = document.querySelector('.date-highlight');
    if (dateHighlight) dateHighlight.textContent = '🗓️ 22 tháng 8, 2025 - 1:30 PM';

    // Location info
    const locationTitle = document.querySelector('.location-title');
    if (locationTitle) locationTitle.textContent = '📍 Địa điểm tổ chức';

    const locationText = document.querySelector('.location-text');
    if (locationText) {
        locationText.innerHTML = `
            <strong>Hội trường Trường Đại học Nam Cần Thơ</strong><br>
            📮 Địa chỉ: Số 168 Nguyễn Văn Cừ Nối Dài, An Bình, Ninh Kiều, Cần Thơ, Việt Nam<br>
            📞 Hotline: 0292.3.872.745<br>
            🌐 Website: <a href="https://ntu.edu.vn" target="_blank">ntu.edu.vn</a>
        `;
    }

    const directionsInfo = document.querySelector('.directions-info');
    if (directionsInfo) {
        directionsInfo.innerHTML = `
            <p>🚗 <strong>Hướng dẫn đi lại:</strong></p>
            <ul>
                <li>Từ trung tâm Cần Thơ: Đi theo đường Nguyễn Văn Cừ Nối Dài</li>
                <li>Trường nằm tại số 168 Nguyễn Văn Cừ Nối Dài, An Bình</li>
            </ul>
        `;
    }

    const mapClickHint = document.querySelector('.map-click-hint');
    if (mapClickHint) mapClickHint.textContent = '📍 Click để mở Google Maps';

    const rsvpButtonSpans = document.querySelectorAll('.rsvp-button span');
    if (rsvpButtonSpans.length >= 2) rsvpButtonSpans[1].textContent = 'Bạn sẽ đến dự chứ?';

    // Messages section
    const messagesTitle = document.querySelector('.messages-title');
    if (messagesTitle) messagesTitle.textContent = 'Lời chúc từ bạn bè';

    // RSVP Modal
    const modalTitle = document.querySelector('.modal-title');
    if (modalTitle) modalTitle.textContent = 'Bạn sẽ đến dự chứ?';

    const formLabels = document.querySelectorAll('.form-label');
    if (formLabels.length >= 2) {
        formLabels[0].textContent = 'Tên của bạn:';
        formLabels[1].textContent = 'Lời chúc của bạn:';
    }

    const guestNameInput = document.getElementById('guestName');
    if (guestNameInput) guestNameInput.placeholder = 'Nhập tên của bạn';

    const guestMessageInput = document.getElementById('guestMessage');
    if (guestMessageInput) guestMessageInput.placeholder = 'Hãy để lại lời chúc tốt đẹp cho Kiều Hân...';

    // Attendance options
    const optionLabel = document.querySelector('.option-label');
    if (optionLabel) optionLabel.textContent = 'Bạn sẽ đến dự chứ?';

    const attendLabels = document.querySelectorAll('.radio-option label');
    const attendTexts = [
        '🎉 Sẽ đến!',
        '🤔 Sẽ đến nhưng phương án 2',
        '😢 Mình bận mất rồi, không tham gia được!'
    ];
    attendLabels.forEach((label, index) => {
        if (label && attendTexts[index]) {
            label.textContent = attendTexts[index];
        }
    });

    // Modal buttons
    const modalButtons = document.querySelectorAll('.modal-buttons button');
    if (modalButtons.length >= 2) {
        modalButtons[0].textContent = 'Gửi lời chúc';
        modalButtons[1].textContent = 'Đóng';
    }

    // Footer
    const footerCouples = document.querySelectorAll('#footerCouple');
    if (footerCouples.length >= 2) {
        footerCouples[0].textContent = 'Cảm ơn bạn!'; // First one (header)
        footerCouples[1].textContent = 'Kiều Hân';    // Second one (in footer-text)
    }

    const footerMessageEn = document.getElementById('footerMessageEn');
    const footerMessageVn = document.getElementById('footerMessageVn');
    if (footerMessageEn && footerMessageVn) {
        footerMessageEn.style.display = 'none';
        footerMessageVn.style.display = 'block';
    }

    const footerShareText = document.getElementById('footerShareText');
    if (footerShareText) footerShareText.textContent = 'Chia sẻ niềm vui';

    const footerCopyright = document.getElementById('footerCopyright');
    if (footerCopyright) {
        footerCopyright.innerHTML = 'Thiết kế bởi Kiều Hân với 💙 cho lễ tốt nghiệp của mình <br>Liên hệ với tôi: 0945255664';
    }
}

// Scroll to home (invitation card) functionality
function scrollToHome() {
    const invitationCard = document.querySelector('.invitation-card');
    if (invitationCard) {
        invitationCard.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        showNotification('🏠 Đã về trang chủ', 'success');
    }
}

// Enhanced RSVP form submission
function submitRSVP() {
    const name = document.getElementById('guestName').value.trim();
    const message = document.getElementById('guestMessage').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked');

    if (!name) {
        showNotification('❌ Vui lòng nhập tên của bạn', 'error');
        return;
    }

    if (!attendance) {
        showNotification('❌ Vui lòng chọn tình trạng tham dự', 'error');
        return;
    }

    const rsvpData = {
        name: name,
        message: message,
        attendance: attendance.value,
        timestamp: new Date().toISOString()
    };

    let messages = JSON.parse(localStorage.getItem('graduationMessages') || '[]');
    messages.push(rsvpData);
    localStorage.setItem('graduationMessages', JSON.stringify(messages));

    let successMessage = '';
    switch (attendance.value) {
        case 'yes':
            successMessage = '🎉 Cảm ơn bạn đã xác nhận tham dự!';
            break;
        case 'maybe':
            successMessage = '🤔 Cảm ơn! Hy vọng bạn có thể tham dự được';
            break;
        case 'no':
            successMessage = '😢 Tiếc quá! Cảm ơn bạn đã phản hồi';
            break;
    }
    showNotification(successMessage, 'success');

    document.getElementById('guestName').value = '';
    document.getElementById('guestMessage').value = '';
    document.querySelectorAll('input[name="attendance"]').forEach(radio => radio.checked = false);
    closeRSVPModal();

    loadMessages();
}

// Snow Effect Function
function createSnowEffect() {
    const snowContainer = document.getElementById('snowContainer');
    if (!snowContainer) return;

    const snowflakes = ['❄', '❅', '❆', '✻', '✼', '❋'];

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        snowflake.style.left = Math.random() * 100 + '%';
        const duration = Math.random() * 5 + 3;
        snowflake.style.animationDuration = duration + 's';
        snowflake.style.animationDelay = Math.random() * 2 + 's';
        snowflake.style.opacity = Math.random() * 0.8 + 0.2;
        snowContainer.appendChild(snowflake);
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.parentNode.removeChild(snowflake);
            }
        }, (duration + 2) * 1000);
    }

    setInterval(createSnowflake, 300);

    for (let i = 0; i < 50; i++) {
        setTimeout(createSnowflake, Math.random() * 5000);
    }
}

// Function to open Google Maps with pre-pinned location
function openInGoogleMaps() {
    const address = "Trường Đại học Nam Cần Thơ, 168 Nguyễn Văn Cừ Nối Dài, An Bình, Ninh Kiều, Cần Thơ";
    const simpleUrl = `https://www.google.com/maps/place/${encodeURIComponent(address)}`;
    const detailedUrl = `https://www.google.com/maps/search/${encodeURIComponent(address)}/@10.034070690005616,105.75997897587886,17z`;

    try {
        showNotification('🗺️ Đang mở Google Maps...');
        const newWindow = window.open(detailedUrl, '_blank', 'noopener,noreferrer');
        if (!newWindow || newWindow.closed) {
            setTimeout(() => {
                window.open(simpleUrl, '_blank', 'noopener,noreferrer');
            }, 100);
        }
    } catch (error) {
        window.location.href = simpleUrl;
    }
}
