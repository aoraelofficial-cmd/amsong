// 앱 메인 로직

let currentUser = { id: 'guest', name: '게스트', email: 'guest@relay.com' };
let currentChapterIndex = 0;
let userProgress = [];
let currentAudio = null;

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
    // 메인 앱으로 바로 시작
    document.getElementById('userName').textContent = currentUser.name;
    renderChapter();
});

// 페이지 전환 함수들 (사용 안 함)
/*
function showLanding() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('landingPage').classList.add('active');
    window.scrollTo(0, 0);
}

function showLogin() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('loginPage').classList.add('active');
    window.scrollTo(0, 0);
}

function showSignup() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('signupPage').classList.add('active');
    window.scrollTo(0, 0);
}
*/

function showMainApp() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('mainApp').classList.add('active');
    window.scrollTo(0, 0);
    
    // 사용자 이름 표시
    document.getElementById('userName').textContent = currentUser.name;
    
    // 초기 탭 로드
    loadCurrentChapter();
    loadProgressTab();
    loadRankingTab();
}

// 탭 전환
function showTab(tabName) {
    // 네비게이션 활성화
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
    
    // 탭 콘텐츠 표시
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // 랭킹 탭일 경우 데이터 새로고침
    if (tabName === 'ranking') {
        loadRankingTab();
    }
    
    // 진도 탭일 경우 데이터 새로고침
    if (tabName === 'progress') {
        loadProgressTab();
    }
}

// 특정 챕터로 이동
function goToChapter(chapterIndex) {
    currentChapterIndex = chapterIndex;
    renderChapter();
    
    // 훈련 탭으로 전환
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById('trainingTab').classList.add('active');
    
    // 네비게이션 활성화
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('.nav-item').classList.add('active');
}

// 이전 챕터
function previousChapter() {
    if (currentChapterIndex > 0) {
        currentChapterIndex--;
        renderChapter();
    }
}

// 다음 챕터
function nextChapter() {
    if (currentChapterIndex < TRAINING_DATA.length - 1) {
        currentChapterIndex++;
        renderChapter();
    }
}

// 메뉴 모달
function showMenu() {
    document.getElementById('menuModal').classList.add('show');
}

function closeMenu() {
    document.getElementById('menuModal').classList.remove('show');
}

// 로그아웃 (사용 안 함)
function logout() {
    // 로그아웃 기능 비활성화
    closeMenu();
}

// 회원가입/로그인 처리 (사용 안 함)
/*
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    
    if (!name || !email) {
        alert('이름과 이메일을 입력해주세요.');
        return;
    }
    
    console.log('회원가입 시도:', email, name);
    
    try {
        // 이메일 중복 확인
        const existingUser = await findUserByEmail(email);
        
        console.log('기존 사용자 확인:', existingUser);
        
        if (existingUser) {
            alert('이미 가입된 이메일입니다. 로그인해주세요.');
            // 로그인 페이지로 이동
            showLogin();
            return;
        }
        
        // 회원가입
        const newUser = await createUser(email, name);
        
        console.log('회원가입 성공:', newUser);
        
        alert('회원가입이 완료되었습니다!');
        
        // 자동 로그인
        currentUser = newUser;
        localStorage.setItem('currentUserId', newUser.id);
        
        // 폼 초기화
        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        
        // 메인 앱으로 이동
        showMainApp();
        
    } catch (error) {
        console.error('회원가입 오류:', error);
        alert('회원가입 중 오류가 발생했습니다.');
    }
});

// 로그인 처리
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    
    if (!email) {
        alert('이메일을 입력해주세요.');
        return;
    }
    
    console.log('로그인 시도:', email);
    
    try {
        const user = await findUserByEmail(email);
        
        console.log('찾은 사용자:', user);
        
        if (!user) {
            alert('등록되지 않은 이메일입니다.');
            return;
        }
        
        // 로그인 성공
        currentUser = user;
        localStorage.setItem('currentUserId', user.id);
        
        console.log('로그인 성공:', currentUser);
        
        // 폼 초기화
        document.getElementById('loginEmail').value = '';
        
        // 메인 앱으로 이동
        showMainApp();
        
    } catch (error) {
        console.error('로그인 오류:', error);
        alert('로그인 중 오류가 발생했습니다.');
    }
});
*/

// 현재 챕터 로드
async function loadCurrentChapter() {
    // 사용자 진도 가져오기
    userProgress = await getUserProgress(currentUser.id);
    
    // 완료된 챕터 확인
    const completedChapters = userProgress.filter(p => p.completed).map(p => p.chapter_date);
    
    // 다음 챕터 찾기 (기본 챕터: 8월 30일 = 인덱스 0)
    currentChapterIndex = 0;
    for (let i = 0; i < TRAINING_DATA.length; i++) {
        if (!completedChapters.includes(TRAINING_DATA[i].date)) {
            currentChapterIndex = i;
            break;
        }
    }
    
    // 모든 챕터 완료 확인
    if (completedChapters.length === TRAINING_DATA.length) {
        currentChapterIndex = TRAINING_DATA.length - 1;
    }
    
    renderChapter();
}

// 챕터 렌더링
function renderChapter() {
    const chapter = TRAINING_DATA[currentChapterIndex];
    
    // 챕터 정보 표시
    document.getElementById('chapterDate').textContent = chapter.date;
    document.getElementById('chapterNumber').textContent = currentChapterIndex + 1;
    
    // 네비게이션 버튼 상태 업데이트
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentChapterIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentChapterIndex === TRAINING_DATA.length - 1;
    }
    
    // 구절 카드 렌더링
    const versesContainer = document.getElementById('versesContainer');
    versesContainer.innerHTML = '';
    
    chapter.verses.forEach((verse, index) => {
        const card = document.createElement('div');
        card.className = 'verse-card';
        
        // 암기송 버튼이 있는 경우 추가
        const songButton = verse.song ? `
            <button class="song-btn" onclick="playSong(${index})" data-song-index="${index}" title="암기송">
                <i class="fas fa-music"></i>
            </button>
        ` : '';
        
        // hasGame이 true인 구절에 암송게임하기 버튼 추가
        const gameButton = verse.hasGame ? `
            <button class="game-btn" onclick="startGame('${verse.ref}')" title="암송 게임">
                <i class="fas fa-gamepad"></i> 암송게임하기
            </button>
        ` : '';
        
        card.innerHTML = `
            <div class="verse-reference">
                <h4>${verse.ref}</h4>
                <div class="verse-actions">
                    <button class="speaker-btn" onclick="playVerse(${index})" data-index="${index}">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    ${songButton}
                </div>
            </div>
            <p class="verse-text" id="verseText${index}">${verse.text}</p>
            ${gameButton}
        `;
        versesContainer.appendChild(card);
    });
    
    // 입력 필드 렌더링
    const inputsContainer = document.getElementById('inputsContainer');
    inputsContainer.innerHTML = '';
    
    chapter.verses.forEach((verse, index) => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <label>${verse.ref}</label>
            <div class="input-with-mic">
                <textarea id="input${index}" placeholder="암송한 말씀을 입력하세요..."></textarea>
                <button type="button" class="mic-btn" onclick="startVoiceInput(${index})" title="음성 입력">
                    <i class="fas fa-microphone"></i>
                </button>
            </div>
        `;
        inputsContainer.appendChild(inputGroup);
    });
    
    // 결과 메시지 숨기기
    const resultMsg = document.getElementById('resultMessage');
    resultMsg.classList.remove('show', 'success', 'error');
    
    // Relay Amsong 버튼 표시 여부 (3월 15일, 3월 22일, 3월 29일, 4월 12일(서초바글 MT), 4월 19일, 4월 26일, 5월 10일, 5월 17일, 5월 24일, 5월 31일)
    const relaySection = document.getElementById('relayAmsongSection');
    if (chapter.relayAmsong) {
        relaySection.style.display = 'block';
    } else {
        relaySection.style.display = 'none';
    }
    
    // Amsong Melody 버튼 표시 여부 (4월 12일(서초바글 MT), 4월 19일)
    const melodySection = document.getElementById('amsongMelodySection');
    if (chapter.date === '4월 12일(서초바글 MT)' || chapter.date === '4월 19일') {
        melodySection.style.display = 'block';
    } else {
        melodySection.style.display = 'none';
    }
    
    // YouTube 영상 표시 여부 (4월 19일, 4월 26일)
    const youtubeSection = document.getElementById('youtubeVideoSection');
    if (chapter.date === '4월 19일') {
        youtubeSection.style.display = 'block';
        // 4월 19일 영상
        youtubeSection.innerHTML = `
            <div class="video-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/h58F5M4zuEE?si=3ZgLq_PoOv_rBaxR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
        `;
    } else if (chapter.date === '4월 26일') {
        youtubeSection.style.display = 'block';
        // 4월 26일 영상
        youtubeSection.innerHTML = `
            <div class="video-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/bDMiT_ZkkdY?si=XExex_4xfynyCOVz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
        `;
    } else {
        youtubeSection.style.display = 'none';
    }
    
    // 페이지 맨 위로 스크롤
    const trainingTab = document.getElementById('trainingTab');
    if (trainingTab) {
        trainingTab.scrollTop = 0;
    }
}

// 음성 재생 (외부 오디오 파일 우선, 없으면 TTS 폴백)
function playVerse(index) {
    const chapter = TRAINING_DATA[currentChapterIndex];
    const verse = chapter.verses[index];
    const button = document.querySelector(`[data-index="${index}"]`);
    const verseText = document.getElementById(`verseText${index}`);
    
    // 이미 재생 중이면 정지
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        if (currentAudio.currentTime !== undefined) {
            currentAudio.currentTime = 0;
        }
        currentAudio.loop = false; // 반복 중지
        currentAudio = null;
        document.querySelectorAll('.speaker-btn').forEach(btn => {
            btn.classList.remove('playing');
            btn.innerHTML = '<i class="fas fa-volume-up"></i>';
        });
        
        // 음성 정지 완료
        return;
    }
    
    // 텍스트 표시
    verseText.classList.add('show');
    
    // 오디오 파일이 있으면 먼저 시도
    if (verse.audio) {
        currentAudio = new Audio(verse.audio);
        currentAudio.loop = true; // 반복 재생 설정
        
        // 버튼 상태 변경 (정지 아이콘)
        button.classList.add('playing');
        button.innerHTML = '<i class="fas fa-stop"></i>';
        
        // 에러 처리
        currentAudio.onerror = (e) => {
            console.error('오디오 파일 로드 실패:', e);
            button.classList.remove('playing');
            button.innerHTML = '<i class="fas fa-volume-up"></i>';
            alert('음성 파일을 찾을 수 없습니다.');
            currentAudio = null;
        };
        
        // 재생 시작
        currentAudio.play().catch(error => {
            console.error('오디오 재생 실패:', error);
            button.classList.remove('playing');
            button.innerHTML = '<i class="fas fa-volume-up"></i>';
            alert('음성 재생 중 오류가 발생했습니다.');
            currentAudio = null;
        });
    } else {
        // 오디오 파일이 없을 때
        alert('음성 파일이 아직 준비되지 않았습니다.');
        button.classList.remove('playing');
        button.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

// 암기송 재생 함수
let currentSong = null;
let relayAmsongAudio = null;

function playSong(index) {
    const chapter = TRAINING_DATA[currentChapterIndex];
    const verse = chapter.verses[index];
    const button = document.querySelector(`[data-song-index="${index}"]`);
    
    // 이미 재생 중이면 정지
    if (currentSong && !currentSong.paused) {
        currentSong.pause();
        currentSong.currentTime = 0;
        currentSong.loop = false;
        currentSong = null;
        document.querySelectorAll('.song-btn').forEach(btn => {
            btn.classList.remove('playing');
            btn.innerHTML = '<i class="fas fa-music"></i>';
        });
        return;
    }
    
    // 암기송 파일이 있는지 확인
    if (verse.song) {
        currentSong = new Audio(verse.song);
        currentSong.loop = true; // 반복 재생 설정
        
        // 버튼 상태 변경
        button.classList.add('playing');
        button.innerHTML = '<i class="fas fa-stop"></i>';
        
        // 에러 처리
        currentSong.onerror = (e) => {
            console.error('암기송 파일 로드 실패:', e);
            button.classList.remove('playing');
            button.innerHTML = '<i class="fas fa-music"></i>';
            alert('암기송 파일을 찾을 수 없습니다.');
            currentSong = null;
        };
        
        // 재생 시작
        currentSong.play().catch(error => {
            console.error('암기송 재생 실패:', error);
            button.classList.remove('playing');
            button.innerHTML = '<i class="fas fa-music"></i>';
            alert('암기송 재생 중 오류가 발생했습니다.');
            currentSong = null;
        });
    } else {
        alert('암기송이 준비되지 않았습니다.');
    }
}

// Relay Amsong 토글 (루프 재생)
function toggleRelayAmsong() {
    const button = document.querySelector('.btn-relay-amsong');
    
    // 이미 재생 중이면 정지
    if (relayAmsongAudio && !relayAmsongAudio.paused) {
        relayAmsongAudio.pause();
        relayAmsongAudio.currentTime = 0;
        relayAmsongAudio = null;
        button.classList.remove('playing');
        button.innerHTML = '<i class="fas fa-play-circle"></i> Relay Amsong';
        return;
    }
    
    // 새로 재생 (현재 챕터에 따라 파일 선택)
    const chapter = TRAINING_DATA[currentChapterIndex];
    const relayFile = chapter.relayAmsong || 'audio/Relay1-2.mp3';
    
    relayAmsongAudio = new Audio(relayFile);
    relayAmsongAudio.loop = true; // 루프 재생
    
    // 버튼 상태 변경
    button.classList.add('playing');
    button.innerHTML = '<i class="fas fa-stop-circle"></i> Relay Amsong (재생 중)';
    
    // 에러 처리
    relayAmsongAudio.onerror = (e) => {
        console.error('Relay Amsong 파일 로드 실패:', e);
        button.classList.remove('playing');
        button.innerHTML = '<i class="fas fa-play-circle"></i> Relay Amsong';
        alert('Relay Amsong 파일을 찾을 수 없습니다.');
        relayAmsongAudio = null;
    };
    
    // 재생 시작
    relayAmsongAudio.play().catch(error => {
        console.error('Relay Amsong 재생 실패:', error);
        button.classList.remove('playing');
        button.innerHTML = '<i class="fas fa-play-circle"></i> Relay Amsong';
        alert('Relay Amsong 재생 중 오류가 발생했습니다.');
        relayAmsongAudio = null;
    });
}

// Amsong Melody 토글 (루프 재생)
let amsongMelodyAudio = null;

function toggleAmsongMelody() {
    const button = document.querySelector('.btn-amsong-melody');
    
    // 이미 재생 중이면 정지
    if (amsongMelodyAudio && !amsongMelodyAudio.paused) {
        amsongMelodyAudio.pause();
        amsongMelodyAudio.currentTime = 0;
        amsongMelodyAudio = null;
        button.classList.remove('playing');
        button.innerHTML = '<i class="fas fa-music"></i> Amsong Melody';
        return;
    }
    
    // 새로 재생 (현재 챕터에 따라 파일 선택)
    const chapter = TRAINING_DATA[currentChapterIndex];
    let melodyFile = 'audio/melody0412.mp3'; // 기본값 (4월 12일)
    
    if (chapter.date === '4월 19일') {
        melodyFile = 'audio/melody0419.mp3';
    }
    
    amsongMelodyAudio = new Audio(melodyFile);
    amsongMelodyAudio.loop = true; // 루프 재생
    
    // 버튼 상태 변경
    button.classList.add('playing');
    button.innerHTML = '<i class="fas fa-stop"></i> Amsong Melody (재생 중)';
    
    // 에러 처리
    amsongMelodyAudio.onerror = (e) => {
        console.error('Amsong Melody 파일 로드 실패:', e);
        button.classList.remove('playing');
        button.innerHTML = '<i class="fas fa-music"></i> Amsong Melody';
        alert('Amsong Melody 파일을 찾을 수 없습니다.');
        amsongMelodyAudio = null;
    };
    
    // 재생 시작
    amsongMelodyAudio.play().catch(error => {
        console.error('Amsong Melody 재생 실패:', error);
        button.classList.remove('playing');
        button.innerHTML = '<i class="fas fa-music"></i> Amsong Melody';
        alert('Amsong Melody 재생 중 오류가 발생했습니다.');
        amsongMelodyAudio = null;
    });
}

// 암기 확인
async function checkMemorization() {
    const chapter = TRAINING_DATA[currentChapterIndex];
    const resultMsg = document.getElementById('resultMessage');
    
    let allCorrect = true;
    
    // 각 구절 확인
    for (let i = 0; i < chapter.verses.length; i++) {
        const input = document.getElementById(`input${i}`).value.trim();
        const correct = chapter.verses[i].text;
        
        // 띄어쓰기 제거하고 비교
        const inputClean = input.replace(/\s/g, '');
        const correctClean = correct.replace(/\s/g, '');
        
        if (inputClean !== correctClean) {
            allCorrect = false;
            break;
        }
    }
    
    if (allCorrect) {
        // 성공
        resultMsg.textContent = '🎉 아멘! 정확하게 암송하셨습니다!';
        resultMsg.className = 'result-message success show';
        
        // 아멘 음성 재생 (고품질 MP3)
        try {
            const amenAudio = new Audio('audio/amen.mp3');
            amenAudio.play().catch(err => {
                console.error('아멘 음성 재생 오류:', err);
            });
        } catch (error) {
            console.error('아멘 음성 파일 로드 오류:', error);
        }
        
        // 이미 완료한 챕터인지 확인
        const completedChapters = userProgress.filter(p => p.completed).map(p => p.chapter_date);
        const isAlreadyCompleted = completedChapters.includes(chapter.date);
        
        // 진도 저장 (처음 완료하는 경우만)
        if (!isAlreadyCompleted) {
            try {
                await completeChapter(currentUser.id, chapter.date);
                
                // 점수 업데이트
                const newScore = currentUser.total_score + 1;
                await updateUserScore(currentUser.id, newScore);
                currentUser.total_score = newScore;
                
                // 3초 후 다음 챕터로
                setTimeout(() => {
                    if (currentChapterIndex < TRAINING_DATA.length - 1) {
                        currentChapterIndex++;
                        loadCurrentChapter();
                    } else {
                        alert('축하합니다! 모든 챕터를 완료하셨습니다! 🎉');
                    }
                }, 3000);
                
            } catch (error) {
                console.error('진도 저장 오류:', error);
            }
        } else {
            // 이미 완료한 챕터를 다시 푼 경우
            setTimeout(() => {
                resultMsg.classList.remove('show');
            }, 3000);
        }
        
    } else {
        // 실패
        resultMsg.textContent = '❌ 다시 도전해보세요!';
        resultMsg.className = 'result-message error show';
        
        // 다시 도전 음성 재생 (고품질 MP3)
        try {
            const againAudio = new Audio('audio/again.mp3');
            againAudio.play().catch(err => {
                console.error('다시 도전 음성 재생 오류:', err);
            });
        } catch (error) {
            console.error('다시 도전 음성 파일 로드 오류:', error);
        }
        
        // 3초 후 메시지 숨기기
        setTimeout(() => {
            resultMsg.classList.remove('show');
        }, 3000);
    }
}

// 진도 탭 로드
async function loadProgressTab() {
    userProgress = await getUserProgress(currentUser.id);
    const completedChapters = userProgress.filter(p => p.completed).map(p => p.chapter_date);
    
    // 통계 표시
    document.getElementById('completedCount').textContent = completedChapters.length;
    const percent = Math.round((completedChapters.length / TRAINING_DATA.length) * 100);
    document.getElementById('progressPercent').textContent = percent;
    
    // 챕터 리스트
    const chapterList = document.getElementById('chapterList');
    chapterList.innerHTML = '';
    
    TRAINING_DATA.forEach((chapter, index) => {
        const isCompleted = completedChapters.includes(chapter.date);
        const isCurrent = index === currentChapterIndex && !isCompleted;
        const isLocked = index > currentChapterIndex && !isCompleted;
        
        const item = document.createElement('div');
        item.className = `chapter-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
        
        let statusIcon = '<i class="fas fa-circle"></i>';
        if (isCompleted) statusIcon = '<i class="fas fa-check-circle"></i>';
        if (isLocked) statusIcon = '<i class="fas fa-lock"></i>';
        
        item.innerHTML = `
            <div class="chapter-item-info">
                <h5>${chapter.date}</h5>
                <p>${chapter.verses.map(v => v.ref).join(', ')}</p>
            </div>
            <div class="chapter-status">
                ${statusIcon}
            </div>
        `;
        
        // 클릭 이벤트 추가 (잠긴 챕터가 아닌 경우)
        if (!isLocked) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                goToChapter(index);
            });
        }
        
        chapterList.appendChild(item);
    });
}

// 랭킹 탭 로드
async function loadRankingTab() {
    const rankings = await getTopRankings();
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';
    
    if (rankings.length === 0) {
        rankingList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">아직 랭킹 데이터가 없습니다.</p>';
        return;
    }
    
    rankings.forEach((user, index) => {
        const rank = index + 1;
        const isTop3 = rank <= 3;
        
        const item = document.createElement('div');
        item.className = `ranking-item ${isTop3 ? 'top-3' : ''}`;
        
        let medal = '';
        if (rank === 1) medal = '🥇';
        else if (rank === 2) medal = '🥈';
        else if (rank === 3) medal = '🥉';
        
        item.innerHTML = `
            <div class="rank-number">${rank}</div>
            <div class="rank-info">
                <p class="rank-name">${user.name}</p>
                <p class="rank-score">완료: ${user.total_score}개 챕터</p>
            </div>
            ${medal ? `<div class="rank-medal">${medal}</div>` : ''}
        `;
        
        rankingList.appendChild(item);
    });
}

// 앱 초기화
window.addEventListener('DOMContentLoaded', async () => {
    // 저장된 사용자 ID 확인
    const savedUserId = localStorage.getItem('currentUserId');
    
    if (savedUserId) {
        try {
            // 사용자 정보 가져오기
            const response = await fetch(`${API_BASE}/users/${savedUserId}`);
            if (response.ok) {
                currentUser = await response.json();
                showMainApp();
                return;
            }
        } catch (error) {
            console.error('자동 로그인 실패:', error);
        }
    }
    
    // 자동 로그인 실패 시 메인 앱을 게스트로 바로 표시
    showMainApp();
});

// 모달 배경 클릭 시 닫기
document.getElementById('menuModal').addEventListener('click', (e) => {
    if (e.target.id === 'menuModal') {
        closeMenu();
    }
});

// 음성 인식 초기화
let recognition = null;
let isRecognitionSupported = false;

// Web Speech API 지원 여부 확인
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    isRecognitionSupported = true;
    
    console.log('Web Speech API 지원됨');
} else {
    console.warn('Web Speech API를 지원하지 않는 브라우저입니다.');
}

// 음성 입력 시작
function startVoiceInput(index) {
    if (!isRecognitionSupported) {
        alert('이 브라우저는 음성 인식을 지원하지 않습니다.\nChrome 또는 Safari 브라우저를 사용해주세요.');
        return;
    }
    
    const textarea = document.getElementById(`input${index}`);
    const micBtn = textarea.parentElement.querySelector('.mic-btn');
    
    // 버튼 상태 변경 (녹음 중)
    micBtn.classList.add('recording');
    micBtn.innerHTML = '<i class="fas fa-stop"></i>';
    micBtn.disabled = true;
    
    // 음성 인식 시작
    recognition.start();
    
    console.log('음성 인식 시작...');
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('인식된 텍스트:', transcript);
        
        // textarea에 인식된 텍스트 추가
        if (textarea.value) {
            textarea.value += ' ' + transcript;
        } else {
            textarea.value = transcript;
        }
        
        // 버튼 상태 복원
        micBtn.classList.remove('recording');
        micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        micBtn.disabled = false;
    };
    
    recognition.onerror = (event) => {
        console.error('음성 인식 오류:', event.error);
        
        let errorMessage = '음성 인식 중 오류가 발생했습니다.';
        
        if (event.error === 'no-speech') {
            errorMessage = '음성이 감지되지 않았습니다. 다시 시도해주세요.';
        } else if (event.error === 'audio-capture') {
            errorMessage = '마이크에 접근할 수 없습니다. 권한을 확인해주세요.';
        } else if (event.error === 'not-allowed') {
            errorMessage = '마이크 사용 권한이 거부되었습니다.';
        } else if (event.error === 'network') {
            errorMessage = '네트워크 연결을 확인해주세요.';
        }
        
        alert(errorMessage);
        
        // 버튼 상태 복원
        micBtn.classList.remove('recording');
        micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        micBtn.disabled = false;
    };
    
    recognition.onend = () => {
        console.log('음성 인식 종료');
        
        // 버튼 상태 복원
        micBtn.classList.remove('recording');
        micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        micBtn.disabled = false;
    };
}
