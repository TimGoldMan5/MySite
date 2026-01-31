document.addEventListener('DOMContentLoaded', () => {

    // === 1. МАТРИЦА (ФОН) ===
    const canvas = document.getElementById('matrixCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let columns, drops;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = Math.floor(canvas.width / 20);
            drops = Array(columns).fill(0).map(() => Math.random() * -100);
        };

        window.addEventListener('resize', resize);
        resize();

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff41';
            ctx.font = '15px monospace';

            for (let i = 0; i < drops.length; i++) {
                const rectHeight = Math.random() * 20 + 5;
                ctx.fillRect(i * 20, drops[i] * 20, 16, rectHeight);
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }
        setInterval(drawMatrix, 40);
    }

    // === 2. ПЛЕЕР ===
    const audio = document.getElementById('main-audio');
    const tracks = document.querySelectorAll('.track-item');
    const playBtn = document.getElementById('play-pause');
    const stopBtn = document.getElementById('stop-btn');
    const trackNameDisplay = document.getElementById('track-name');
    const currentCoverImg = document.getElementById('current-cover');
    const coverWrapper = document.getElementById('cover-wrapper');
    const bars = document.querySelectorAll('.bar');
    const timerDisplay = document.querySelector('.timer');
    const volumeSlider = document.getElementById('volume');

    // Если мы на странице с плеером
    if (audio && tracks.length > 0) {

        tracks.forEach(track => {
            track.addEventListener('click', function () {
                tracks.forEach(t => t.classList.remove('playing'));
                this.classList.add('playing');

                const src = this.getAttribute('data-src');
                const title = this.getAttribute('data-title');
                const artist = this.getAttribute('data-artist'); // Добавили получение автора
                const img = this.getAttribute('data-img');

                audio.src = src;
                if (trackNameDisplay) trackNameDisplay.innerText = title;
                if (document.getElementById('track-artist')) {
                    document.getElementById('track-artist').innerText = artist; // Выводим автора
                }
                if (currentCoverImg) currentCoverImg.src = img;

                audio.play();
                if (playBtn) playBtn.innerText = "⏸";
                coverWrapper?.classList.add('rotating');
            });
        });
        // Кнопка Play/Pause
        playBtn?.addEventListener('click', () => {
            if (!audio.src) return;
            if (audio.paused) {
                audio.play();
                playBtn.innerText = "⏸";
                coverWrapper?.classList.add('rotating');
            } else {
                audio.pause();
                playBtn.innerText = "▶";
                coverWrapper?.classList.remove('rotating');
            }
        });

        // Кнопка Stop
        stopBtn?.addEventListener('click', () => {
            audio.pause();
            audio.currentTime = 0;
            if (playBtn) playBtn.innerText = "▶";
            coverWrapper?.classList.remove('rotating');
            bars.forEach(b => b.style.height = "20%");
        });

        // Громкость
        volumeSlider?.addEventListener('input', (e) => {
            audio.volume = e.target.value;
        });

        // Визуализатор и таймер
        audio.addEventListener('timeupdate', () => {
            if (!audio.paused) {
                // Столбики
                bars.forEach(bar => {
                    bar.style.height = Math.floor(Math.random() * 80 + 20) + "%";
                });
                // Время
                if (timerDisplay) {
                    const mins = Math.floor(audio.currentTime / 60);
                    const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
                    timerDisplay.innerText = `${mins}:${secs}`;
                }
            }
        });

        // Остановка анимаций при паузе
        audio.addEventListener('pause', () => {
            bars.forEach(b => b.style.height = "20%");
        });

        audio.addEventListener('ended', () => {
            if (playBtn) playBtn.innerText = "▶";
            coverWrapper?.classList.remove('rotating');
        });
    }
});

// Функция открытия картинки
function openModal(src, title) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');

    modalImg.src = src;
    modalTitle.innerText = "VIEWER: " + title;
    modal.style.display = 'flex';
}

// Функция закрытия
function closeModal() {
    document.getElementById('image-modal').style.display = 'none';
}

// Закрытие по ESC
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeModal();
});