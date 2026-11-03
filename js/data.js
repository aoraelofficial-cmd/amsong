<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#16130f">
<title>Amsong Log V3</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#16130f;
  --bg-grad:#1c1812;
  --surface:#211c15;
  --surface-2:#2a241b;
  --line:#3a3226;
  --text:#ece5d8;
  --muted:#b3a78f;
  --gold:#d4a455;
  --gold-soft:rgba(212,164,85,.14);
  --gold-line:rgba(212,164,85,.38);
  --err:#c96f5e;
  --sans:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif;
  --serif:"Gowun Batang",Batang,serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{
  font-family:var(--sans);
  background:radial-gradient(120% 60% at 50% 0%, var(--bg-grad) 0%, var(--bg) 58%) fixed, var(--bg);
  color:var(--text);
  min-height:100dvh;
}
.wrap{max-width:480px;margin:0 auto;padding:0 18px calc(28px + env(safe-area-inset-bottom))}

/* ── 헤더 ── */
header{
  display:flex;align-items:center;justify-content:space-between;
  padding:20px 2px 14px;
}
.brand{display:flex;align-items:baseline;gap:8px}
.brand .logo{font-family:var(--serif);font-weight:700;font-size:19px;letter-spacing:.01em;color:var(--text)}
.brand .v{font-size:11px;color:var(--gold);border:1px solid var(--gold-line);border-radius:999px;padding:1px 7px}
.user{font-size:12.5px;color:var(--muted)}
.user b{color:var(--text);font-weight:600;margin-left:4px}

/* ── 게임하기 ── */
.game-row{display:flex;justify-content:flex-end;margin-bottom:6px}
.game-btn{
  font-family:var(--sans);font-size:12.5px;color:var(--muted);
  background:none;border:1px solid var(--line);border-radius:999px;
  padding:7px 14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;
  transition:color .15s,border-color .15s;
}
.game-btn:hover{color:var(--gold);border-color:var(--gold-line)}

/* ── 챕터 헤드(시그니처) ── */
.chapter-head{padding:26px 2px 8px;text-align:center}
.dots{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:18px}
.dot-arrow{
  width:44px;height:44px;border-radius:50%;border:1px solid var(--line);
  background:var(--surface);color:var(--text);font-size:17px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:border-color .15s,color .15s;
}
.dot-arrow:hover{color:var(--gold);border-color:var(--gold-line)}
.dot-arrow:disabled{opacity:.3;cursor:default}
.dot-list{display:flex;gap:9px}
.dot{width:8px;height:8px;border-radius:50%;background:var(--line);transition:background .2s,transform .2s}
.dot.on{background:var(--gold);transform:scale(1.25)}
.date{
  font-family:var(--serif);font-weight:700;font-size:42px;line-height:1.15;
  display:inline-block;position:relative;padding:0 6px 10px;
}
.date::after{
  content:"";position:absolute;left:12%;right:12%;bottom:2px;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
}
.chapter-no{margin-top:10px;font-size:12.5px;color:var(--muted);letter-spacing:.04em}

/* ── 구절 카드 ── */
.verses{display:flex;flex-direction:column;gap:14px;margin-top:24px}
.verse-card{
  background:linear-gradient(180deg,var(--surface-2),var(--surface));
  border:1px solid var(--line);border-left:2px solid var(--gold-line);
  border-radius:14px;padding:20px 18px 16px;
}
.verse-ref{
  font-size:12px;color:var(--gold);letter-spacing:.12em;font-weight:600;
  text-transform:uppercase;margin-bottom:10px;
}
.verse-text{
  font-family:var(--serif);font-size:19px;line-height:1.78;word-break:keep-all;
  color:var(--text);margin-bottom:16px;
}
.play-btn{
  font-family:var(--sans);font-size:13.5px;font-weight:600;
  display:inline-flex;align-items:center;gap:8px;
  background:var(--gold-soft);color:#e5bb6d;
  border:1px solid var(--gold-line);border-radius:999px;
  padding:10px 18px;cursor:pointer;min-height:44px;
  transition:background .15s;
}
.play-btn:hover{background:rgba(212,164,85,.22)}
.play-btn.playing{background:var(--gold);color:#1c1812;border-color:var(--gold)}
.play-btn .ic{width:11px;height:11px;flex:0 0 auto}
.ic-play{width:0;height:0;border-left:10px solid currentColor;border-top:6px solid transparent;border-bottom:6px solid transparent}
.ic-stop{width:10px;height:10px;background:currentColor;border-radius:1.5px}
.audio-err{display:none;margin-top:10px;font-size:12.5px;color:var(--err)}

/* ── 릴레이 암송 ── */
.relay-card{
  margin-top:16px;border-radius:14px;padding:20px 18px;
  background:linear-gradient(135deg,rgba(212,164,85,.16),rgba(212,164,85,.05));
  border:1px solid var(--gold-line);text-align:center;
}
.relay-title{font-size:12px;color:var(--gold);letter-spacing:.14em;font-weight:600;margin-bottom:12px}
.relay-btn{
  width:100%;min-height:52px;border-radius:12px;border:none;cursor:pointer;
  font-family:var(--sans);font-size:15.5px;font-weight:700;
  display:flex;align-items:center;justify-content:center;gap:10px;
  background:var(--gold);color:#1c1812;transition:filter .15s;
}
.relay-btn:hover{filter:brightness(1.08)}
.relay-btn.playing{background:#b8863c;color:#fff}
.relay-err{display:none;margin-top:10px;font-size:12.5px;color:var(--err);text-align:center}

/* ── 푸터 ── */
.foot{margin-top:30px;text-align:center;font-size:11.5px;color:#6b6252;letter-spacing:.06em}

:focus-visible{outline:2px solid var(--gold);outline-offset:2px;border-radius:6px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
</head>
<body>
<div class="wrap">

  <header>
    <div class="brand"><span class="logo">Amsong Log</span><span class="v">V3</span></div>
    <div class="user">안녕하세요,<b id="userName">게스트</b>님</div>
  </header>

  <div class="game-row">
    <button class="game-btn" id="gameBtn" type="button">▦ 게임하기</button>
  </div>

  <section class="chapter-head" aria-label="챕터 선택">
    <div class="dots">
      <button class="dot-arrow" id="prevBtn" type="button" aria-label="이전 챕터">‹</button>
      <div class="dot-list" id="dotList"></div>
      <button class="dot-arrow" id="nextBtn" type="button" aria-label="다음 챕터">›</button>
    </div>
    <h1 class="date" id="chapterDate"></h1>
    <p class="chapter-no">챕터 <span id="chapterNumber"></span></p>
  </section>

  <section class="verses" id="versesContainer" aria-label="암송 구절"></section>

  <section class="relay-card" aria-label="릴레이 암송">
    <p class="relay-title">RELAY AMSONG</p>
    <button class="relay-btn" id="relayBtn" type="button">
      <span class="ic ic-play" id="relayIc"></span><span id="relayLabel">릴레이 암송 듣기</span>
    </button>
    <p class="relay-err" id="relayErr">릴레이 암송 오디오 파일을 찾을 수 없습니다 — 서버 audio/ 폴더의 파일명을 확인해 주세요.</p>
  </section>

  <p class="foot">2026 하반기 제자훈련 암송</p>

</div>

<script>
/* ═══════════════════════════════════════════════════════
   2026년 하반기 암송장 제자훈련 데이터
   매주 업데이트할 때는 이 배열만 수정하면 됩니다.
   (새 주차를 맨 위에 추가)
   ═══════════════════════════════════════════════════════ */
const TRAINING_DATA = [
    {
        date: '11월 8일',
        relayAmsong: 'audio/relayamsong1108.mp3',
        verses: [
            { ref: '창 2:18', text: '여호와 하나님이 이르시되 사람이 혼자 사는 것이 좋지 아니하니 내가 그를 위하여 돕는 배필을 지으리라 하시니라', audio: 'audio/chang2.mp3' },
            { ref: '엡 5:21', text: '그리스도를 경외함으로 피차 복종하라', audio: 'audio/ep5.mp3' }
        ]
    },
    {
        date: '11월 1일',
        relayAmsong: 'audio/relayamsong1101.mp3',
        verses: [
            { ref: '요 4:24', text: '하나님은 영이시니 예배하는 자가 영과 진리로 예배할지니라', audio: 'audio/yo4.mp3' },
            { ref: '롬 12:1', text: '그러므로 형제들아 내가 하나님의 모든 자비하심으로 너희를 권하노니 너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라 이는 너희가 드릴 영적 예배니라', audio: 'audio/rom12.mp3' }
        ]
    },
    {
        date: '10월 25일',
        relayAmsong: 'audio/relayamsong1025.mp3',
        verses: [
            { ref: '창 1:28', text: '하나님이 그들에게 복을 주시며 하나님이 그들에게 이르시되 생육하고 번성하여 땅에 충만하라, 땅을 정복하라, 바다의 물고기와 하늘의 새와 땅에 움직이는 모든 생물을 다스리라 하시니라', audio: 'audio/chang1.mp3' },
            { ref: '마 5:16', text: '이같이 너희 빛이 사람 앞에 비치게 하여 그들로 너희 착한 행실을 보고 하늘에 계신 너희 아버지께 영광을 돌리게 하라', audio: 'audio/ma5.mp3' }
        ]
    }
];
/* ═══════════════ 데이터 끝 — 아래는 로직 ═══════════════ */

(function(){
  'use strict';
  var currentChapterIndex = 0;
  var audio = new Audio();
  var playingBtn = null;   // 재생 중인 버튼(토글용)
  var playingKind = null;  // 'verse' | 'relay'
  var relayPlayingFrom = null;

  var $ = function(id){ return document.getElementById(id); };

  /* ── UI: 사용자 ── */
  try { $('userName').textContent = '게스트'; } catch(e){}

  /* ── UI: 게임 ── */
  $('gameBtn').addEventListener('click', function(){ location.href = 'game.html'; });

  /* ── 챕터 렌더 ── */
  function renderDots(){
    var box = $('dotList'); box.innerHTML = '';
    TRAINING_DATA.forEach(function(_, i){
      var d = document.createElement('span');
      d.className = 'dot' + (i === currentChapterIndex ? ' on' : '');
      box.appendChild(d);
    });
  }

  function renderChapter(){
    var ch = TRAINING_DATA[currentChapterIndex];
    $('chapterDate').textContent = ch.date;
    $('chapterNumber').textContent = (currentChapterIndex + 1) + ' / ' + TRAINING_DATA.length;
    $('prevBtn').disabled = (currentChapterIndex === 0);
    $('nextBtn').disabled = (currentChapterIndex === TRAINING_DATA.length - 1);
    renderDots();
    stopAll();

    var box = $('versesContainer'); box.innerHTML = '';
    ch.verses.forEach(function(v, vi){
      var card = document.createElement('article');
      card.className = 'verse-card';
      var ref = document.createElement('p'); ref.className = 'verse-ref'; ref.textContent = v.ref;
      var txt = document.createElement('p'); txt.className = 'verse-text'; txt.textContent = v.text;
      var btn = document.createElement('button');
      btn.className = 'play-btn'; btn.type = 'button';
      btn.setAttribute('aria-pressed','false');
      btn.innerHTML = '<span class="ic ic-play"></span><span>구절 듣기</span>';
      var err = document.createElement('p'); err.className = 'audio-err';
      err.textContent = '오디오 파일을 찾을 수 없습니다(' + v.audio + ') — 파일명을 확인해 주세요.';
      btn.addEventListener('click', function(){ togglePlay(btn, v.audio, 'verse', err); });
      card.appendChild(ref); card.appendChild(txt); card.appendChild(btn); card.appendChild(err);
      box.appendChild(card);
    });
  }

  /* ── 재생 제어: 한 번에 하나만 ── */
  function setBtnState(btn, playing, label){
    btn.classList.toggle('playing', playing);
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    var ic = btn.querySelector('.ic');
    if (playingKind === 'relay' && btn.id === 'relayBtn') ic = $('relayIc');
    if (ic) ic.className = 'ic ' + (playing ? 'ic-stop' : 'ic-play');
    var lbl = btn.querySelector('span:not(.ic)');
    if (lbl && label) lbl.textContent = label;
  }

  function stopAll(){
    audio.pause();
    if (playingBtn){
      var wasRelay = (playingKind === 'relay');
      setBtnState(playingBtn, false, wasRelay ? '릴레이 암송 듣기' : '구절 듣기');
      if (wasRelay) $('relayErr').style.display = 'none';
      else { var e = playingBtn.parentElement.querySelector('.audio-err'); if (e) e.style.display = 'none'; }
      playingBtn = null; playingKind = null;
    }
  }

  function togglePlay(btn, src, kind, errEl){
    if (playingBtn === btn && !audio.paused){ stopAll(); return; }
    stopAll();
    audio.src = src;
    playingBtn = btn; playingKind = kind;
    setBtnState(btn, true, kind === 'relay' ? '정지' : '정지');
    if (errEl) errEl.style.display = 'none';
    audio.play().catch(function(){
      stopAll();
      if (errEl) errEl.style.display = 'block';
    });
  }

  audio.addEventListener('ended', function(){
    if (playingBtn) setBtnState(playingBtn, false, playingKind === 'relay' ? '릴레이 암송 듣기' : '구절 듣기');
    playingBtn = null; playingKind = null;
  });
  audio.addEventListener('error', function(){
    if (playingKind === 'relay') $('relayErr').style.display = 'block';
    else if (playingBtn){ var e = playingBtn.parentElement.querySelector('.audio-err'); if (e) e.style.display = 'block'; }
    stopAll();
  });

  /* ── 릴레이 암송 ── */
  $('relayBtn').addEventListener('click', function(){
    togglePlay($('relayBtn'), TRAINING_DATA[currentChapterIndex].relayAmsong, 'relay', $('relayErr'));
  });

  /* ── 챕터 이동 ── */
  $('prevBtn').addEventListener('click', function(){
    if (currentChapterIndex > 0){ currentChapterIndex--; renderChapter(); }
  });
  $('nextBtn').addEventListener('click', function(){
    if (currentChapterIndex < TRAINING_DATA.length - 1){ currentChapterIndex++; renderChapter(); }
  });

  /* ── 시작: 최신 주차 ── */
  window.addEventListener('DOMContentLoaded', renderChapter);
})();
</script>
</body>
</html>
