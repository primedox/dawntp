document.addEventListener('DOMContentLoaded', function() {
    // Аватар по умолчанию
    const defaultAvatar = 'assets/stok.png';

    // Элемент для отображения аватара на странице авторизации
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarInput = document.getElementById('avatar');

    // Функция для получения URL аватара (убедитесь, что она определена!)
    function getAvatarURL() {
        return localStorage.getItem('avatarURL') || defaultAvatar;
    }

    // Установка аватара по умолчанию при загрузке страницы
    if (avatarPreview) {
        avatarPreview.src = getAvatarURL(); // Используем функцию
    }

    // Обработчик клика по аватару для загрузки нового
    if (avatarPreview && avatarInput) {
        avatarPreview.addEventListener('click', function() {
            avatarInput.click();
        });

        avatarInput.addEventListener('change', function() {
            if (avatarInput.files && avatarInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                }
                reader.readAsDataURL(avatarInput.files[0]);
            } else {
                avatarPreview.src = defaultAvatar;
            }
        });
    }

    // Авторизация (изменяем, чтобы сохранять локально URL аватара)
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            const nickname = document.getElementById('nickname').value;
            let avatarURL = avatarPreview.src; // Берем URL из preview

            localStorage.setItem('avatarURL', avatarURL);
            localStorage.setItem('nickname', nickname);
            window.location.href = 'main.html';
        });
    }

    // Приветствие на главной странице
    const welcomeNickname = document.getElementById('welcome-nickname');
    const profileAvatar = document.getElementById('profile-avatar'); // Элемент для отображения аватара

    if (welcomeNickname) {
        const nickname = localStorage.getItem('nickname');
        if (nickname) {
            welcomeNickname.textContent = nickname;
        } else {
            window.location.href = 'index.html';
        }
    }

    if (profileAvatar) {
        profileAvatar.src = getAvatarURL(); // Устанавливаем аватар
    }

    // Гамбургер-меню
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    // **Добавлена проверка существования hamburgerMenu**
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
    }


     // Обработчик для кружка поддержки
    const supportCircle = document.querySelector('.support-circle');
    if (supportCircle) {
        supportCircle.addEventListener('click', function() {
            document.querySelector('.support-overlay').style.display = 'flex';
        });
    }

     // Поддержка (обработка сообщений)
    const supportOverlay = document.querySelector('.support-overlay');
    const closeButton = document.querySelector('.close-button');
    const sendButton = document.querySelector('.support-input-area button');
    const chatHistory = document.querySelector('.chat-history');
    const messageInput = document.querySelector('.support-input-area input');

    if (supportOverlay && closeButton && sendButton && chatHistory && messageInput) {

        closeButton.addEventListener('click', function() {
            supportOverlay.style.display = 'none';
        });

        sendButton.addEventListener('click', function() {
            const messageText = messageInput.value;
            if (messageText.trim() !== '') {
                // Добавляем сообщение пользователя
                addMessage(chatHistory, messageText, 'user');
                messageInput.value = '';

                // Имитируем ответ бота (шаблонные ответы)
                setTimeout(() => {
                    const botResponse = getBotResponse(messageText);
                    addMessage(chatHistory, botResponse, 'bot');
                }, 500);
            }
        });

        // Шаблонные вопросы и ответы
        const botResponses = {
            "что такое primex?": "Primex - это ваш лучший выбор для развития бизнеса!",
            "как сделать заказ?": "Перейдите на страницу 'Заказ' и заполните форму.",
            "какие у вас цены?": "У нас самые выгодные цены на рынке!",
            "помощь": "Пожалуйста, сформулируйте ваш вопрос более конкретно."
        };

        function getBotResponse(message) {
            message = message.toLowerCase();
            if (botResponses[message]) {
                return botResponses[message];
            } else {
                return "Спасибо за ваш вопрос! Наш специалист свяжется с вами в ближайшее время.";
            }
        }
        // Функция добавления сообщения в чат
        function addMessage(chatHistory, message, sender) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', `${sender}-message`);
            messageElement.textContent = message;
            chatHistory.appendChild(messageElement);
            chatHistory.scrollTop = chatHistory.scrollHeight; // Прокручиваем вниз
        }
    }

    // Обработка формы заказа (как и раньше)
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nickname = document.getElementById('nickname').value;
            const phone = document.getElementById('phone').value;
            const otlaga = document.getElementById('otlaga').value;
            const telegram = document.getElementById('telegram').value;

            // Формируем тело запроса
            const formData = new FormData();
            formData.append('nickname', nickname);
            formData.append('phone', phone);
            formData.append('otlaga', otlaga);
            formData.append('telegram', telegram);

            // Отправка данных на FormSubmit
            fetch('https://formsubmit.co/ajax/ваш_email@example.com', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Успех:', data);
                alert('Заявка успешно отправлена!');
            })
            .catch((error) => {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при отправке заявки.');
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Плавающий аудиоплеер
    const floatingMusicPlayer = document.getElementById('floating-music-player');
    const recordImage = document.getElementById('record-image');
    const audioPlayer = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause-button');
    const playPauseIcon = playPauseButton.querySelector('i'); // Получаем иконку внутри кнопки

    let isDragging = false;
    let offsetX, offsetY;

    // Функция для переключения воспроизведения
    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        } else {
            audioPlayer.pause();
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        }
    }

    // Обработчик клика на кнопке Play/Pause
    playPauseButton.addEventListener('click', togglePlayPause);

    // Drag and Drop
    floatingMusicPlayer.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - floatingMusicPlayer.offsetLeft;
        offsetY = e.clientY - floatingMusicPlayer.offsetTop;
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        floatingMusicPlayer.style.left = x + 'px';
        floatingMusicPlayer.style.top = y + 'px';
    });
});
