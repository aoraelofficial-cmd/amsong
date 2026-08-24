// 랜딩페이지 배경음악 관리
(function() {
    let isPlaying = false;
    
    // 배경음악
    const music = document.getElementById('landingMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const musicText = document.getElementById('musicText');
    
    // UI 업데이트
    function updateMusicUI() {
        if (isPlaying) {
            musicToggle.classList.add('playing');
            musicIcon.className = 'fas fa-volume-up';
            musicText.textContent = '음악 재생 중';
        } else {
            musicToggle.classList.remove('playing');
            musicIcon.className = 'fas fa-volume-mute';
            musicText.textContent = '음악 재생';
        }
    }
    
    // 음악 재생
    function playMusic() {
        if (music) {
            music.volume = 0.3; // 볼륨 30%
            const playPromise = music.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('음악 재생 성공');
                    isPlaying = true;
                    updateMusicUI();
                }).catch(err => {
                    console.log('음악 재생 실패:', err);
                    isPlaying = false;
                    updateMusicUI();
                });
            }
        }
    }
    
    // 음악 일시정지
    function pauseMusic() {
        if (music) {
            music.pause();
            isPlaying = false;
            updateMusicUI();
        }
    }
    
    // 음악 토글 (전역 함수)
    window.toggleMusic = function() {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    };
    
    // 페이지 로드 시 자동 실행
    window.addEventListener('DOMContentLoaded', function() {
        // UI 초기화
        updateMusicUI();
    });
})();
