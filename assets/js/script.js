document.getElementById('year').textContent = new Date().getFullYear();

// mobile nav toggle
const toggle = document.getElementById('burgerToggle');
const navLinks = document.getElementById('navLinks');
toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// menu tabs
const tabs = document.querySelectorAll('.menu-tab');
const panels = document.querySelectorAll('.menu-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });
});

// lightbox
function openLightbox(src) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
});

// header shrink on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 20 ? '0 10px 30px -15px rgba(0,0,0,.6)' : 'none';
});

// ---------- whack-a-burger mini game ----------
(function () {
  const GAME_DURATION = 30; // seconds
  const board = document.getElementById('gameBoard');
  const hint = document.getElementById('gameHint');
  const scoreEl = document.getElementById('gameScore');
  const timeEl = document.getElementById('gameTime');
  const startBtn = document.getElementById('gameStartBtn');
  const resultBox = document.getElementById('gameResult');
  const resultTitle = document.getElementById('gameResultTitle');
  const resultScore = document.getElementById('gameResultScore');
  const resultMsg = document.getElementById('gameResultMsg');
  const playAgainBtn = document.getElementById('gamePlayAgainBtn');

  let running = false;
  let score = 0;
  let timeLeft = GAME_DURATION;
  let countdownId = null;
  let spawnTimeoutId = null;
  let startedAt = 0;

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resultMessage(finalScore) {
    if (finalScore >= 20) return '🏆 أسطورة تشالنج برجر! ما حدا لحقك';
    if (finalScore >= 12) return '🔥 يد سريعة، ما شاء الله عليك!';
    if (finalScore >= 6) return '😄 مو باس، جرب كمان مرة تكسرها';
    return '🐢 وربي بطيء شوي، جرب مرة ثانية!';
  }

  function spawnMole() {
    if (!running) return;

    const size = board.clientWidth < 500 ? 54 : 66;
    const pad = size / 2 + 10;
    const x = randomBetween(pad, board.clientWidth - pad);
    const y = randomBetween(pad, board.clientHeight - pad);

    const mole = document.createElement('button');
    mole.className = 'mole';
    mole.style.left = x + 'px';
    mole.style.top = y + 'px';
    mole.innerHTML = '<img src="assets/logo.jpg" alt="اضرب الشعار">';

    let hit = false;
    const elapsed = (Date.now() - startedAt) / 1000;
    const visibleTime = Math.max(500, 950 - elapsed * 12);

    const removeTimer = setTimeout(() => {
      if (mole.isConnected) mole.remove();
    }, visibleTime);

    mole.addEventListener('click', () => {
      if (hit || !running) return;
      hit = true;
      clearTimeout(removeTimer);
      score++;
      scoreEl.textContent = score;
      mole.classList.add('hit');
      setTimeout(() => mole.remove(), 250);
    });

    board.appendChild(mole);

    const elapsedNow = (Date.now() - startedAt) / 1000;
    const delay = randomBetween(Math.max(280, 750 - elapsedNow * 12), Math.max(450, 1000 - elapsedNow * 10));
    spawnTimeoutId = setTimeout(spawnMole, delay);
  }

  function startGame() {
    if (running) return;
    running = true;
    score = 0;
    timeLeft = GAME_DURATION;
    startedAt = Date.now();
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    hint.style.display = 'none';
    startBtn.disabled = true;
    startBtn.textContent = 'اللعب جارٍ... 🎯';
    resultBox.classList.remove('open');

    spawnMole();
    countdownId = setInterval(() => {
      timeLeft--;
      timeEl.textContent = Math.max(timeLeft, 0);
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    running = false;
    clearInterval(countdownId);
    clearTimeout(spawnTimeoutId);
    board.querySelectorAll('.mole').forEach(m => m.remove());
    hint.style.display = 'block';
    hint.textContent = 'اضغط "ابدأ التحدي" وجهّز إصبعك 👆';
    startBtn.disabled = false;
    startBtn.textContent = 'ابدأ التحدي 🔥';

    resultTitle.textContent = score >= 12 ? '🏆 برافو عليك!' : '⏱️ خلص الوقت!';
    resultScore.textContent = score + ' نقطة';
    resultMsg.textContent = resultMessage(score);
    resultBox.classList.add('open');
  }

  startBtn.addEventListener('click', startGame);
  playAgainBtn.addEventListener('click', () => {
    resultBox.classList.remove('open');
    startGame();
  });
  resultBox.addEventListener('click', (e) => {
    if (e.target.id === 'gameResult') resultBox.classList.remove('open');
  });
})();
