// 암송 게임 로직
(function() {
    // 플레이어 이름 관리
    let currentPlayerName = '';
    const PLAYER_NAME_KEY = 'amsong_player_name';
    
    // 11명의 플레이어 리스트
    const PLAYER_LIST = [
        '이충준', '이준석', '홍종철', '홍아론', '이원주', '채완준',
        '김헌용', '김민기', '구지현', '김성호', '오상훈'
    ];
    
    // 플레이어 선택 모달 요소
    const playerNameModal = document.getElementById('playerNameModal');
    const playerSelectionGrid = document.getElementById('playerSelectionGrid');
    
    // 구절별 단어 배열 (구문 단위로 묶음)
    const verseData = {
        '롬 14:7-8': [
            '우리 중에',
            '누구든지',
            '자기를 위하여',
            '사는 자가 없고',
            '자기를 위하여',
            '죽는 자도 없도다',
            '우리가 살아도',
            '주를 위하여 살고',
            '죽어도',
            '주를 위하여 죽나니',
            '그러므로',
            '사나 죽으나',
            '우리가 주의 것이로다'
        ],
        '골 2:6-7': [
            '그러므로 너희가',
            '그리스도 예수를',
            '주로 받았으니',
            '그 안에서 행하되',
            '그 안에 뿌리를 박으며',
            '세움을 받아',
            '교훈을 받은 대로',
            '믿음에 굳게 서서',
            '감사함을',
            '넘치게 하라'
        ],
        '마 7:12': [
            '그러므로',
            '무엇이든지',
            '남에게 대접을',
            '받고자 하는 대로',
            '너희도',
            '남을 대접하라',
            '이것이',
            '율법이요',
            '선지자니라'
        ],
        '마 22:37-39': [
            '예수께서 이르시되',
            '네 마음을 다하고',
            '목숨을 다하고',
            '뜻을 다하여',
            '주 너의 하나님을',
            '사랑하라 하셨으니',
            '이것이',
            '크고 첫째 되는',
            '계명이요',
            '둘째도 그와 같으니',
            '네 이웃을',
            '네 자신 같이',
            '사랑하라 하셨으니'
        ]
    };
    
    let currentVerse = '롬 14:7-8';
    let verseWords = verseData[currentVerse];
    
    let currentWordIndex = 0;
    let collectedWords = []; // 수집된 단어의 인덱스 배열 (중복 단어 처리 위함)
    let fallingWords = [];
    let basketPosition = 50; // 퍼센트
    let gameInterval;
    let moveInterval;
    let isGameActive = false;
    
    const gameContainer = document.getElementById('amsongGame');
    const gameArea = document.getElementById('gameArea');
    const basket = document.getElementById('basket');
    const collectedWordsList = document.getElementById('collectedWordsList');
    const gameProgress = document.getElementById('gameProgress');
    const gameTotal = document.getElementById('gameTotal');
    const gameComplete = document.getElementById('gameComplete');
    const gameTitle = document.getElementById('gameTitle');
    const wrongOverlay = document.getElementById('wrongOverlay');
    const gameTimer = document.getElementById('gameTimer');
    const gameScoreDisplay = document.getElementById('gameScore');
    const gameOver = document.getElementById('gameOver');
    
    let backgroundMusic = null;
    let collectSound = null; // 수집 효과음
    let wrongSound = null; // 틀렸을 때 효과음
    let itemAppearSound = null; // 아이템 등장 효과음
    let satanAppearSound = null; // 사탄 등장 효과음 (루핑)
    let satanCollisionSound = null; // 사탄 충돌 효과음
    let pacmanDirection = 'right'; // 팩맨 방향 (right, left)
    
    // 타이머 및 점수 시스템
    let gameScore = 1000; // 기본 점수
    let gameTime = 180; // 게임 시간 (초)
    let timerInterval = null;
    let startTime = null;
    
    // 특별 아이템 시스템
    let specialItem = null; // 현재 떨어지는 아이템
    let itemSpawned = false; // 100초에 아이템 생성 여부
    const itemImageSrc = 'images/special-item-jesus.png';
    
    // 사탄 적 시스템
    let satanEnemy = null; // 현재 떨어지는 사탄
    let satanSpawnCount = 0; // 사탄 생성 횟수 (최대 3회)
    const maxSatanSpawns = 3;
    const satanImageSrc = 'images/enemy-satan.png';
    
    // 캐릭터 이미지 URL (로컬 경로)
    const characterImages = {
        idle1: 'images/character-idle1.png',
        idle2: 'images/character-idle2.png',
        // 오른쪽 달리기
        runRight1: 'images/character-run-right1.png',
        runRight2: 'images/character-run-right2.png',
        runRight3: 'images/character-run-right3.png',
        // 왼쪽 달리기
        runLeft1: 'images/character-run-left1.png',
        runLeft2: 'images/character-run-left2.png',
        runLeft3: 'images/character-run-left3.png'
    };
    
    // 애니메이션 상태
    let isMoving = false;
    let idleAnimationInterval = null;
    let runAnimationInterval = null;
    let collectAnimationTimeout = null;
    
    // 게임 시작
    window.startGame = function(verseRef) {
        // 플레이어 선택 모달 표시
        const savedName = localStorage.getItem(PLAYER_NAME_KEY);
        
        // 모달 표시
        playerNameModal.classList.remove('hidden');
        
        // 플레이어 버튼 클릭 이벤트 설정
        const playerButtons = playerSelectionGrid.querySelectorAll('.player-btn');
        playerButtons.forEach(btn => {
            // 이전 선택 초기화
            btn.classList.remove('selected');
            
            // 저장된 이름이 있으면 해당 버튼 선택
            if (savedName && btn.dataset.player === savedName) {
                btn.classList.add('selected');
            }
            
            // 클릭 이벤트
            btn.onclick = function() {
                // 모든 버튼 선택 해제
                playerButtons.forEach(b => b.classList.remove('selected'));
                
                // 현재 버튼 선택
                this.classList.add('selected');
                
                // 플레이어 이름 저장
                currentPlayerName = this.dataset.player;
                localStorage.setItem(PLAYER_NAME_KEY, currentPlayerName);
                
                // 0.3초 후 모달 닫고 게임 시작
                setTimeout(() => {
                    playerNameModal.classList.add('hidden');
                    initializeGame(verseRef);
                }, 300);
            };
        });
    };
    
    function initializeGame(verseRef) {
        // 초기화
        currentVerse = verseRef || '롬 14:7-8';
        verseWords = verseData[currentVerse];
        currentWordIndex = 0;
        collectedWords = []; // 인덱스 배열로 초기화
        fallingWords = [];
        basketPosition = 50;
        isGameActive = true;
        gameScore = 1000;
        gameTime = 180;
        startTime = Date.now();
        itemSpawned = false; // 아이템 생성 플래그 초기화
        specialItem = null;
        satanEnemy = null; // 사탄 초기화
        satanSpawnCount = 0; // 사탄 카운트 초기화
        
        // UI 초기화
        gameContainer.classList.add('active');
        gameContainer.style.display = 'block';
        gameComplete.classList.remove('show');
        gameComplete.style.display = 'none'; // 강제로 숨김
        gameOver.classList.remove('show');
        gameOver.style.display = 'none'; // 게임 오버 화면도 숨김
        collectedWordsList.innerHTML = '';
        gameProgress.textContent = '0';
        gameTotal.textContent = verseWords.length;
        gameTitle.textContent = currentVerse + ' 암송게임';
        gameTimer.textContent = gameTime;
        gameScoreDisplay.textContent = gameScore;
        
        // 게임 영역의 떨어지는 단어 및 아이템 제거
        const existingWords = gameArea.querySelectorAll('.falling-word');
        existingWords.forEach(word => word.remove());
        const existingItems = gameArea.querySelectorAll('.special-item');
        existingItems.forEach(item => item.remove());
        const existingSatans = gameArea.querySelectorAll('.satan-enemy');
        existingSatans.forEach(satan => satan.remove());
        
        // 바구니 초기 위치 (캐릭터 이미지로 변경)
        basket.innerHTML = `<img src="${characterImages.idle1}" class="character-img" alt="character">`;
        basket.style.cursor = 'grab';
        pacmanDirection = 'right';
        isMoving = false;
        updateBasketPosition();
        
        // 기본 서있는 애니메이션 시작
        startIdleAnimation();
        
        // 배경 음악 재생
        if (!backgroundMusic) {
            backgroundMusic = new Audio('audio/game-background-new.mp3');
            backgroundMusic.loop = true;
            backgroundMusic.volume = 0.5;
        }
        backgroundMusic.play().catch(err => console.log('음악 재생 오류:', err));
        
        // 수집 효과음 초기화
        if (!collectSound) {
            collectSound = new Audio('audio/collect-sound.mp3');
            collectSound.volume = 0.7;
        }
        
        // 틀렸을 때 효과음 초기화
        if (!wrongSound) {
            wrongSound = new Audio('audio/wrong-sound.mp3');
            wrongSound.volume = 0.6;
        }
        
        // 아이템 등장 효과음 초기화
        if (!itemAppearSound) {
            itemAppearSound = new Audio('audio/item-appear.mp3');
            itemAppearSound.volume = 0.8;
        }
        
        // 사탄 효과음 초기화
        if (!satanAppearSound) {
            satanAppearSound = new Audio('audio/satan-appear.mp3');
            satanAppearSound.loop = true; // 루핑
            satanAppearSound.volume = 0.7;
        }
        if (!satanCollisionSound) {
            satanCollisionSound = new Audio('audio/satan-collision.mp3');
            satanCollisionSound.volume = 0.8;
        }
        
        // 타이머 시작
        startTimer();
        
        // 게임 루프 시작 (단어를 랜덤 간격으로 생성)
        spawnRandomWords();
    };
    
    // 게임 종료
    window.closeGame = function() {
        isGameActive = false;
        gameContainer.classList.remove('active');
        gameContainer.style.display = 'none';
        clearInterval(gameInterval);
        clearInterval(moveInterval);
        clearInterval(timerInterval);
        
        // 모든 애니메이션 정리
        stopAllAnimations();
        isMoving = false;
        
        // 배경 음악 정지
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
        
        // 사탄 효과음 정지
        if (satanAppearSound) {
            satanAppearSound.pause();
            satanAppearSound.currentTime = 0;
        }
        
        // 게임 완료 화면 및 게임 오버 화면 숨기기
        gameComplete.classList.remove('show');
        gameComplete.style.display = 'none';
        gameOver.classList.remove('show');
        gameOver.style.display = 'none';
        
        // 숨겼던 게임 요소들 다시 보이기
        gameArea.style.display = 'block';
        const gameHeader = document.querySelector('.game-header');
        const collectedWords = document.querySelector('.collected-words');
        const closeBtn = document.querySelector('.btn-close-game');
        if (gameHeader) gameHeader.style.display = 'block';
        if (collectedWords) collectedWords.style.display = 'block';
        if (closeBtn) closeBtn.style.display = 'block';
        
        // 모든 떨어지는 단어 제거
        fallingWords.forEach(wordObj => {
            if (wordObj.element && wordObj.element.parentNode) {
                wordObj.element.remove();
            }
        });
        fallingWords = [];
    };
    
    // 타이머 시작
    function startTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        timerInterval = setInterval(() => {
            if (!isGameActive) {
                clearInterval(timerInterval);
                return;
            }
            
            gameTime--;
            gameTimer.textContent = gameTime;
            
            // 100초 시점에 특별 아이템 생성
            if (gameTime === 100 && !itemSpawned) {
                spawnSpecialItem();
                itemSpawned = true;
            }
            
            // 사탄 생성 (150초, 90초, 30초)
            if (gameTime === 150 && satanSpawnCount === 0) {
                spawnSatan();
            } else if (gameTime === 90 && satanSpawnCount === 1) {
                spawnSatan();
            } else if (gameTime === 30 && satanSpawnCount === 2) {
                spawnSatan();
            }
            
            // 시간 종료
            if (gameTime <= 0) {
                clearInterval(timerInterval);
                endGame(false); // 시간 초과로 게임 종료
            }
        }, 1000);
    }
    
    // 게임 종료 (완료 또는 시간 초과 또는 게임 오버)
    async function endGame(completed, isGameOver = false) {
        isGameActive = false;
        clearInterval(timerInterval);
        
        // 배경 음악 정지
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
        
        // 사탄 효과음 정지
        if (satanAppearSound) {
            satanAppearSound.pause();
            satanAppearSound.currentTime = 0;
        }
        
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        
        // 게임 오버인 경우
        if (isGameOver) {
            gameOver.classList.add('show');
            gameOver.style.display = 'block';
            return;
        }
        
        // 최종 점수 및 시간 표시
        finalScore.textContent = gameScore;
        finalTime.textContent = elapsedTime;
        
        if (completed) {
            document.getElementById('gameCompleteMessage').textContent = '🎉 암송을 완벽하게 완성했습니다!';
        } else {
            document.getElementById('gameCompleteMessage').textContent = '⏰ 시간이 종료되었습니다!';
        }
        
        // 랭킹 저장 및 표시
        await saveRanking(playerName, currentVerse, gameScore);
        await displayRankings(currentVerse);
        
        gameComplete.classList.add('show');
        gameComplete.style.display = 'block';
    }
    
    // 랜덤하게 단어 생성
    function spawnRandomWords() {
        if (!isGameActive) return;
        
        // 랜덤하게 섞은 인덱스 배열 생성
        const shuffledIndices = [...Array(verseWords.length).keys()]
            .sort(() => Math.random() - 0.5);
        
        shuffledIndices.forEach((wordIndex, i) => {
            setTimeout(() => {
                if (!isGameActive) return;
                spawnWord(wordIndex);
            }, i * 1500); // 1.5초 간격으로 랜덤하게 생성 (몰리지 않도록)
        });
    }
    
    // 단어 생성
    function spawnWord(wordIndex) {
        if (!isGameActive) return;
        
        const word = verseWords[wordIndex];
        
        const wordElement = document.createElement('div');
        wordElement.className = 'falling-word';
        wordElement.textContent = word;
        wordElement.dataset.word = word;
        wordElement.dataset.index = wordIndex;
        
        // 현재 맞춰야 할 단어면 노란색으로 표시
        const currentTargetIndex = collectedWords.length;
        if (wordIndex === currentTargetIndex) {
            wordElement.classList.add('target-word');
        }
        
        // 랜덤 X 위치 (5% ~ 85%)
        const randomX = Math.random() * 80 + 5;
        wordElement.style.left = randomX + '%';
        wordElement.style.top = '0px';
        
        gameArea.appendChild(wordElement);
        
        const wordObj = {
            element: wordElement,
            word: word,
            index: wordIndex,
            y: 0,
            x: randomX
        };
        
        fallingWords.push(wordObj);
        
        // 떨어지는 애니메이션
        animateFall(wordObj);
    }
    
    // 떨어지는 애니메이션
    function animateFall(wordObj) {
        const fallInterval = setInterval(() => {
            if (!isGameActive || !wordObj.element.parentNode) {
                clearInterval(fallInterval);
                return;
            }
            
            wordObj.y += 1.2; // 속도 감소 (2 → 1.2, 느리게)
            wordObj.element.style.top = wordObj.y + 'px';
            
            // 바구니와 충돌 체크
            const gameAreaRect = gameArea.getBoundingClientRect();
            const wordRect = wordObj.element.getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();
            
            const wordCenterX = wordRect.left + wordRect.width / 2;
            const basketCenterX = basketRect.left + basketRect.width / 2;
            const distanceX = Math.abs(wordCenterX - basketCenterX);
            
            // 충돌 감지 (바구니 범위 내)
            if (wordRect.bottom >= basketRect.top && 
                wordRect.bottom <= basketRect.bottom + 20 &&
                distanceX < basketRect.width / 2 + 20) {
                
                // 순서대로 수집했는지 확인
                if (wordObj.index === collectedWords.length) {
                    collectWord(wordObj);
                    clearInterval(fallInterval);
                    fallingWords = fallingWords.filter(w => w !== wordObj);
                } else {
                    // 순서가 틀렸을 때: 점수 차감 및 효과
                    decreaseScore();
                    showWrongEffect();
                    // 틀린 단어는 제거하고 다시 떨어뜨림
                    wordObj.element.remove();
                    clearInterval(fallInterval);
                    fallingWords = fallingWords.filter(w => w !== wordObj);
                    
                    // 2초 후 다시 생성
                    setTimeout(() => {
                        if (isGameActive && !collectedWords.includes(wordObj.index) && 
                            wordObj.index >= collectedWords.length) {
                            spawnWord(wordObj.index);
                        }
                    }, 2000);
                }
            }
            
            // 화면 밖으로 나가면 다시 떨어뜨리기
            if (wordObj.y > gameAreaRect.height) {
                wordObj.element.remove();
                clearInterval(fallInterval);
                fallingWords = fallingWords.filter(w => w !== wordObj);
                
                // 아직 수집되지 않은 단어면 2초 후 다시 떨어뜨림
                if (isGameActive && !collectedWords.includes(wordObj.index) && 
                    wordObj.index >= collectedWords.length) {
                    setTimeout(() => {
                        if (isGameActive) {
                            spawnWord(wordObj.index);
                        }
                    }, 2000); // 2초 후 다시 생성
                }
            }
        }, 20);
    }
    
    // 틀렸을 때 효과
    function showWrongEffect() {
        // 효과음 재생
        if (wrongSound) {
            wrongSound.currentTime = 0;
            wrongSound.play().catch(err => console.log('틀림 효과음 재생 오류:', err));
        }
        
        // 빨간 화면 반짝임
        wrongOverlay.classList.add('flash');
        setTimeout(() => {
            wrongOverlay.classList.remove('flash');
        }, 500);
    }
    
    // 점수 차감 (-1점)
    function decreaseScore() {
        gameScore = Math.max(0, gameScore - 1); // 최소 0점
        gameScoreDisplay.textContent = gameScore;
        
        // 점수가 0이 되면 게임 오버
        if (gameScore === 0) {
            endGame(false, true); // 게임 오버로 종료
        }
    }
    
    // 단어 수집
    function collectWord(wordObj) {
        collectedWords.push(wordObj.index); // 인덱스를 저장 (중복 단어 처리)
        
        // 수집 효과음 재생
        if (collectSound) {
            collectSound.currentTime = 0;
            collectSound.play().catch(err => console.log('효과음 재생 오류:', err));
        }
        
        // 정답 수집 애니메이션 재생 (0.5초씩 2번 반복)
        playCollectAnimation();
        
        // 단어 제거
        wordObj.element.remove();
        
        // 수집된 단어 표시
        const collectedWordElement = document.createElement('div');
        collectedWordElement.className = 'collected-word';
        collectedWordElement.textContent = wordObj.word;
        collectedWordsList.appendChild(collectedWordElement);
        
        // 진행도 업데이트
        gameProgress.textContent = collectedWords.length;
        
        // 다음 타겟 단어를 노란색으로 강조
        updateTargetWordHighlight();
        
        // 게임 완료 체크
        if (collectedWords.length === verseWords.length) {
            setTimeout(() => {
                endGame(true); // 완료로 게임 종료
            }, 500);
        }
    }
    
    // 다음 타겟 단어 강조 업데이트
    function updateTargetWordHighlight() {
        const currentTargetIndex = collectedWords.length;
        
        // 모든 떨어지는 단어에서 기존 강조 제거
        fallingWords.forEach(wordObj => {
            if (wordObj.element && wordObj.element.parentNode) {
                wordObj.element.classList.remove('target-word');
                
                // 새로운 타겟이면 강조 추가
                if (wordObj.index === currentTargetIndex) {
                    wordObj.element.classList.add('target-word');
                }
            }
        });
    }
    
    // 바구니 이동
    window.moveBasket = function(direction) {
        if (moveInterval) {
            clearInterval(moveInterval);
        }
        
        pacmanDirection = direction;
        isMoving = true;
        
        // 달리기 애니메이션 시작 (방향에 따라 다른 이미지 사용)
        startRunAnimation();
        
        moveInterval = setInterval(() => {
            if (direction === 'left') {
                basketPosition = Math.max(0, basketPosition - 2);
            } else if (direction === 'right') {
                basketPosition = Math.min(100, basketPosition + 2);
            }
            updateBasketPosition();
        }, 20);
    };
    
    // 바구니 이동 중지
    window.stopBasket = function() {
        if (moveInterval) {
            clearInterval(moveInterval);
            moveInterval = null;
        }
        isMoving = false;
        
        // 기본 서있는 애니메이션으로 복귀
        const img = basket.querySelector('.character-img');
        if (img) {
            img.src = characterImages.idle1;
        }
        startIdleAnimation();
    };
    
    // 바구니 위치 업데이트
    function updateBasketPosition() {
        basket.style.left = basketPosition + '%';
        basket.style.transform = 'translateX(-50%)';
    }
    
    // 키보드 컨트롤
    document.addEventListener('keydown', (e) => {
        if (!isGameActive) return;
        
        if (e.key === 'ArrowLeft') {
            moveBasket('left');
        } else if (e.key === 'ArrowRight') {
            moveBasket('right');
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            stopBasket();
        }
        // ESC 키로 게임 종료
        if (e.key === 'Escape' && isGameActive) {
            closeGame();
        }
    });
    
    // 터치/마우스로 팩맨 직접 이동
    let isDragging = false;
    let lastTouchX = 0;
    
    // 마우스 이벤트
    basket.addEventListener('mousedown', (e) => {
        if (!isGameActive) return;
        isDragging = true;
        lastTouchX = e.clientX;
        basket.style.cursor = 'grabbing';
        
        // 달리기 애니메이션 시작
        isMoving = true;
        startRunAnimation();
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isGameActive || !isDragging) return;
        
        const gameAreaRect = gameArea.getBoundingClientRect();
        const relativeX = e.clientX - gameAreaRect.left;
        const newPosition = (relativeX / gameAreaRect.width) * 100;
        
        basketPosition = Math.max(0, Math.min(100, newPosition));
        
        // 방향 감지 및 애니메이션 업데이트
        if (e.clientX < lastTouchX - 5) {
            // 왼쪽으로 이동
            if (pacmanDirection !== 'left') {
                pacmanDirection = 'left';
                startRunAnimation(); // 왼쪽 달리기 애니메이션
            }
        } else if (e.clientX > lastTouchX + 5) {
            // 오른쪽으로 이동
            if (pacmanDirection !== 'right') {
                pacmanDirection = 'right';
                startRunAnimation(); // 오른쪽 달리기 애니메이션
            }
        }
        lastTouchX = e.clientX;
        
        updateBasketPosition();
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            basket.style.cursor = 'grab';
            
            // 기본 서있는 애니메이션으로 복귀
            isMoving = false;
            const img = basket.querySelector('.character-img');
            if (img) {
                img.src = characterImages.idle1;
            }
            startIdleAnimation();
        }
    });
    
    // 터치 이벤트 (모바일)
    basket.addEventListener('touchstart', (e) => {
        if (!isGameActive) return;
        isDragging = true;
        lastTouchX = e.touches[0].clientX;
        
        // 달리기 애니메이션 시작
        isMoving = true;
        startRunAnimation();
        
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
        if (!isGameActive || !isDragging) return;
        
        const touch = e.touches[0];
        const gameAreaRect = gameArea.getBoundingClientRect();
        const relativeX = touch.clientX - gameAreaRect.left;
        const newPosition = (relativeX / gameAreaRect.width) * 100;
        
        basketPosition = Math.max(0, Math.min(100, newPosition));
        
        // 방향 감지 및 애니메이션 업데이트
        if (touch.clientX < lastTouchX - 5) {
            // 왼쪽으로 이동
            if (pacmanDirection !== 'left') {
                pacmanDirection = 'left';
                startRunAnimation(); // 왼쪽 달리기 애니메이션
            }
        } else if (touch.clientX > lastTouchX + 5) {
            // 오른쪽으로 이동
            if (pacmanDirection !== 'right') {
                pacmanDirection = 'right';
                startRunAnimation(); // 오른쪽 달리기 애니메이션
            }
        }
        lastTouchX = touch.clientX;
        
        updateBasketPosition();
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            
            // 기본 서있는 애니메이션으로 복귀
            isMoving = false;
            const img = basket.querySelector('.character-img');
            if (img) {
                img.src = characterImages.idle1;
            }
            startIdleAnimation();
        }
    });
    
    // 게임 컨테이너 배경 클릭 시 닫기
    gameContainer.addEventListener('click', (e) => {
        if (e.target === gameContainer && isGameActive) {
            closeGame();
        }
    });
    
    // ============== 캐릭터 애니메이션 함수들 ==============
    
    // 기본 서있는 애니메이션 (idle1 <-> idle2 교차)
    function startIdleAnimation() {
        stopAllAnimations();
        let currentFrame = 0;
        const img = basket.querySelector('.character-img');
        if (!img) return;
        
        idleAnimationInterval = setInterval(() => {
            if (isMoving) return; // 이동 중이면 실행 안 함
            
            if (currentFrame === 0) {
                img.src = characterImages.idle1;
                currentFrame = 1;
            } else {
                img.src = characterImages.idle2;
                currentFrame = 0;
            }
        }, 500); // 0.5초마다 교체
    }
    
    // 달리기 애니메이션 (방향에 따라 다른 이미지 사용)
    function startRunAnimation() {
        stopAllAnimations();
        isMoving = true;
        let currentFrame = 0;
        const img = basket.querySelector('.character-img');
        if (!img) return;
        
        // 방향에 따라 다른 프레임 배열 사용
        let runFrames;
        if (pacmanDirection === 'left') {
            runFrames = [characterImages.runLeft1, characterImages.runLeft2, characterImages.runLeft3];
        } else {
            runFrames = [characterImages.runRight1, characterImages.runRight2, characterImages.runRight3];
        }
        
        runAnimationInterval = setInterval(() => {
            img.src = runFrames[currentFrame];
            currentFrame = (currentFrame + 1) % 3;
        }, 150); // 0.15초마다 프레임 변경 (빠른 달리기)
    }
    
    // 정답 수집 애니메이션 (idle2를 0.5초씩 2번 반복)
    function playCollectAnimation() {
        stopAllAnimations();
        const img = basket.querySelector('.character-img');
        if (!img) return;
        
        let repeatCount = 0;
        const originalSrc = img.src;
        
        // 0.5초마다 idle2 <-> idle1 교체, 총 2번 반복 (4번 전환)
        const animationInterval = setInterval(() => {
            if (repeatCount % 2 === 0) {
                img.src = characterImages.idle2; // 정답확인 이미지
            } else {
                img.src = characterImages.idle1; // 기본동작
            }
            
            repeatCount++;
            
            if (repeatCount >= 4) { // 2번 반복 완료 (idle2 2번 표시)
                clearInterval(animationInterval);
                img.src = characterImages.idle1; // 기본동작으로 복귀
                startIdleAnimation(); // 기본 애니메이션 재시작
            }
        }, 500);
    }
    
    // 모든 애니메이션 중지
    function stopAllAnimations() {
        if (idleAnimationInterval) {
            clearInterval(idleAnimationInterval);
            idleAnimationInterval = null;
        }
        if (runAnimationInterval) {
            clearInterval(runAnimationInterval);
            runAnimationInterval = null;
        }
        if (collectAnimationTimeout) {
            clearTimeout(collectAnimationTimeout);
            collectAnimationTimeout = null;
        }
    }
    
    // ============== 특별 아이템 시스템 ==============
    
    // 특별 아이템 생성 (100초 시점)
    function spawnSpecialItem() {
        if (!isGameActive || specialItem) return;
        
        // 아이템 등장 효과음 재생
        if (itemAppearSound) {
            itemAppearSound.currentTime = 0;
            itemAppearSound.play().catch(err => console.log('아이템 효과음 재생 오류:', err));
        }
        
        const itemElement = document.createElement('div');
        itemElement.className = 'special-item';
        itemElement.innerHTML = `<img src="${itemImageSrc}" alt="special-item">`;
        
        // 화면 중앙에서 생성
        itemElement.style.left = '50%';
        itemElement.style.top = '0px';
        
        gameArea.appendChild(itemElement);
        
        specialItem = {
            element: itemElement,
            y: 0,
            x: 50 // 중앙 (퍼센트)
        };
        
        // 떨어지는 애니메이션
        animateItemFall(specialItem);
    }
    
    // 아이템 떨어지는 애니메이션
    function animateItemFall(itemObj) {
        const fallInterval = setInterval(() => {
            if (!isGameActive || !itemObj.element.parentNode) {
                clearInterval(fallInterval);
                return;
            }
            
            itemObj.y += 1.0; // 단어보다 약간 느리게
            itemObj.element.style.top = itemObj.y + 'px';
            
            // 캐릭터와 충돌 체크
            const gameAreaRect = gameArea.getBoundingClientRect();
            const itemRect = itemObj.element.getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();
            
            const itemCenterX = itemRect.left + itemRect.width / 2;
            const basketCenterX = basketRect.left + basketRect.width / 2;
            const distanceX = Math.abs(itemCenterX - basketCenterX);
            
            // 충돌 감지
            if (itemRect.bottom >= basketRect.top && 
                itemRect.bottom <= basketRect.bottom + 30 &&
                distanceX < basketRect.width / 2 + 30) {
                
                // 아이템 수집!
                collectSpecialItem(itemObj);
                clearInterval(fallInterval);
            }
            
            // 화면 밖으로 나가면 제거 (재생성 없음)
            if (itemObj.y > gameAreaRect.height) {
                itemObj.element.remove();
                clearInterval(fallInterval);
                specialItem = null;
            }
        }, 20);
    }
    
    // 특별 아이템 수집 (시간과 점수 리셋)
    function collectSpecialItem(itemObj) {
        // 수집 효과음 재생
        if (collectSound) {
            collectSound.currentTime = 0;
            collectSound.play().catch(err => console.log('효과음 재생 오류:', err));
        }
        
        // 정답 수집 애니메이션
        playCollectAnimation();
        
        // 아이템 제거
        itemObj.element.remove();
        specialItem = null;
        
        // 시간과 점수 리셋
        gameTime = 180;
        gameScore = 1000;
        gameTimer.textContent = gameTime;
        gameScoreDisplay.textContent = gameScore;
        
        // 아이템 재생성 플래그 초기화 (다시 100초에 생성 가능)
        itemSpawned = false;
        
        console.log('✨ 특별 아이템 획득! 시간과 점수가 리셋되었습니다!');
    }
    
    // ============== 사탄 적 시스템 ==============
    
    // 사탄 생성 (랜덤하게 3번 등장)
    function spawnSatan() {
        if (!isGameActive || satanEnemy || satanSpawnCount >= maxSatanSpawns) return;
        
        satanSpawnCount++;
        
        // 사탄 등장 효과음 재생 (루핑)
        if (satanAppearSound) {
            satanAppearSound.currentTime = 0;
            satanAppearSound.play().catch(err => console.log('사탄 효과음 재생 오류:', err));
        }
        
        const satanElement = document.createElement('div');
        satanElement.className = 'satan-enemy';
        satanElement.innerHTML = `<img src="${satanImageSrc}" alt="satan">`;
        
        // 시작 X 위치 랜덤 (10% ~ 90%)
        const startX = Math.random() * 80 + 10;
        satanElement.style.left = startX + '%';
        satanElement.style.top = '0px';
        
        gameArea.appendChild(satanElement);
        
        satanEnemy = {
            element: satanElement,
            y: 0,
            x: startX,
            direction: 1, // 1=오른쪽, -1=왼쪽
            zigzagCount: 0 // 지그재그 횟수
        };
        
        // 지그재그로 떨어지는 애니메이션
        animateSatanFall(satanEnemy);
    }
    
    // 사탄 지그재그 떨어지는 애니메이션
    function animateSatanFall(satanObj) {
        const fallInterval = setInterval(() => {
            if (!isGameActive || !satanObj.element.parentNode) {
                clearInterval(fallInterval);
                if (satanAppearSound) {
                    satanAppearSound.pause();
                    satanAppearSound.currentTime = 0;
                }
                return;
            }
            
            // 아래로 떨어짐
            satanObj.y += 1.5;
            satanObj.element.style.top = satanObj.y + 'px';
            
            // 좌우 지그재그 이동
            satanObj.x += satanObj.direction * 0.8; // 부드럽게 좌우 이동
            
            // 화면 경계 체크 (10% ~ 90% 범위 내에서 반전)
            if (satanObj.x <= 10 || satanObj.x >= 90) {
                satanObj.direction *= -1; // 방향 반전
                satanObj.zigzagCount++;
            }
            
            satanObj.element.style.left = satanObj.x + '%';
            
            // 캐릭터와 충돌 체크
            const gameAreaRect = gameArea.getBoundingClientRect();
            const satanRect = satanObj.element.getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();
            
            const satanCenterX = satanRect.left + satanRect.width / 2;
            const basketCenterX = basketRect.left + basketRect.width / 2;
            const distanceX = Math.abs(satanCenterX - basketCenterX);
            
            // 충돌 감지 (더 넓은 범위)
            if (satanRect.bottom >= basketRect.top && 
                satanRect.top <= basketRect.bottom &&
                distanceX < (basketRect.width / 2 + satanRect.width / 2)) {
                
                // 사탄과 충돌!
                hitBySatan(satanObj);
                clearInterval(fallInterval);
            }
            
            // 화면 밖으로 나가면 제거
            if (satanObj.y > gameAreaRect.height) {
                satanObj.element.remove();
                clearInterval(fallInterval);
                satanEnemy = null;
                
                // 사탄 효과음 정지
                if (satanAppearSound) {
                    satanAppearSound.pause();
                    satanAppearSound.currentTime = 0;
                }
            }
        }, 20);
    }
    
    // 사탄과 충돌 시 처리
    function hitBySatan(satanObj) {
        // 충돌 효과음 재생
        if (satanCollisionSound) {
            satanCollisionSound.currentTime = 0;
            satanCollisionSound.play().catch(err => console.log('사탄 충돌 효과음 재생 오류:', err));
        }
        
        // 사탄 등장 효과음 정지
        if (satanAppearSound) {
            satanAppearSound.pause();
            satanAppearSound.currentTime = 0;
        }
        
        // 빨간 화면 반짝임 효과
        showWrongEffect();
        
        // 점수 차감 (500점)
        gameScore = Math.max(0, gameScore - 500);
        gameScoreDisplay.textContent = gameScore;
        
        // 점수가 0이 되면 게임 오버
        if (gameScore === 0) {
            setTimeout(() => {
                endGame(false, true); // 게임 오버로 종료
            }, 500);
        }
        
        // 사탄 제거
        satanObj.element.remove();
        satanEnemy = null;
        
        console.log('💀 사탄과 충돌! -500점');
    }
    
    // ============== 랭킹 시스템 ==============
    
    // 랭킹 저장 (누적 점수) - 비활성화됨
    async function saveRanking(name, verseRef, score) {
        // 데이터베이스 없이 작동하도록 비활성화
        console.log('랭킹 저장:', name, verseRef, score);
    }
    
    // 랭킹 표시 - 비활성화됨
    async function displayRankings(verseRef) {
        // 데이터베이스 없이 작동하도록 비활성화
        const rankingsList = document.getElementById('rankingsList');
        if (rankingsList) {
            rankingsList.innerHTML = '<p style="padding: 20px; opacity: 0.7;">랭킹 기능은 현재 사용할 수 없습니다</p>';
        }
    }
                document.getElementById('finalRank').style.display = 'block';
                document.getElementById('rankPosition').textContent = currentPlayerRank + 1;
            }
        } catch (error) {
            console.error('랭킹 표시 오류:', error);
            document.getElementById('rankingsList').innerHTML = '<p style="padding: 20px;">랭킹을 불러올 수 없습니다</p>';
        }
    }
    
})();
