/* ===== SNOW ===== */
for (let i = 0; i < 30; i++) {
  const s = document.createElement('div');
  s.className = 'snow';
  s.textContent = ['❄','✦','✧','*'][Math.floor(Math.random()*4)];
  s.style.left = Math.random() * 100 + 'vw';
  s.style.animationDuration = (6 + Math.random() * 8) + 's';
  s.style.animationDelay = Math.random() * 5 + 's';
  s.style.fontSize = (10 + Math.random() * 12) + 'px';
  document.body.appendChild(s);
}

/* ===== AUDIO ===== */
let audioCtx = null;

function playPaimonSound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    [880, 1320].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.15, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.3);
    });
  } catch(e) { console.log('Audio error', e); }
}

/* ===== WISH SYSTEM ===== */
const wishRewards = [
  { icon: '🎁', stars: 5, text: 'Желаю тебе крутого лута в жизни!' },
  { icon: '💎', stars: 5, text: 'Легендарный год без багов!' },
  { icon: '🍀', stars: 5, text: '5★ Удачи на весь год!' },
  { icon: '🎇', stars: 4, text: 'Фейерверк эмоций и впечатлений!' },
  { icon: '🍊', stars: 3, text: 'Мандаринка счастья (съешь её!)' },
  { icon: '💰', stars: 4, text: 'Примогемы в кошельке!' },
  { icon: '🎮', stars: 4, text: 'Все игры — без лагов!' },
  { icon: '🚀', stars: 5, text: 'Прокачка уровня жизни +100!' },
  { icon: '🧧', stars: 4, text: 'Красный конверт с сюрпризом!' },
  { icon: '🎄', stars: 3, text: 'Ёлка, которая не падает!' },
  { icon: '🌟', stars: 5, text: '5★ Здоровья и счастья!' },
  { icon: '⚡', stars: 4, text: 'Электро-скорость в учёбе!' },
  { icon: '❄️', stars: 3, text: 'Крио-спокойствие и прохлада!' },
  { icon: '🔥', stars: 4, text: 'Пиро-энергия на весь год!' },
  { icon: '🌿', stars: 3, text: 'Дендро-рост и процветание!' }
];

let lastWishCount = 10;

function doWish(count = 10) {
  lastWishCount = count;
  const screen = document.getElementById('wishScreen');
  screen.classList.remove('hidden');
  screen.style.background = '#220008';
  screen.innerHTML = `<h2 class="wish-title" style="animation:none;">✦ Призываю ${count}... ✦</h2>`;
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => createMeteor(), i * (count === 10 ? 150 : 300));
  }
  
  setTimeout(() => showResults(count), count === 10 ? 1800 : 1000);
}

function createMeteor() {
  const m = document.createElement('div');
  m.className = 'meteor';
  const startX = Math.random() * window.innerWidth;
  const startY = -20;
  m.style.left = startX + 'px';
  m.style.top = startY + 'px';
  document.body.appendChild(m);
  
  const targetX = window.innerWidth / 2 + (Math.random() - 0.5) * 300;
  const targetY = window.innerHeight / 2;
  
  m.animate([
    { transform: `translate(0,0) scale(1)`, opacity: 1 },
    { transform: `translate(${targetX - startX}px, ${targetY - startY}px) scale(2)`, opacity: 0 }
  ], { duration: 800, easing: 'ease-in' }).onfinish = () => m.remove();
}

function showResults(count = 10) {
  document.getElementById('wishScreen').classList.add('hidden');
  document.getElementById('resultsScreen').classList.add('active');
  
  const grid = document.getElementById('cardsGrid');
  grid.innerHTML = '';
  
  if (count === 1) {
    grid.style.gridTemplateColumns = '1fr';
    grid.style.maxWidth = '400px';
  } else {
    grid.style.gridTemplateColumns = ''; 
    grid.style.maxWidth = '';
  }
  
  const chosen = [];
  for (let i = 0; i < count; i++) {
    const pool = wishRewards.filter(r => r.stars === (Math.random() < 0.3 ? 5 : (Math.random() < 0.5 ? 4 : 3)));
    chosen.push(pool[Math.floor(Math.random() * pool.length)] || wishRewards[0]);
  }
  
  chosen.forEach((reward, i) => {
    const card = document.createElement('div');
    card.className = 'card star' + reward.stars;
    card.style.animationDelay = (i * 0.1) + 's';
    const stars = '★'.repeat(reward.stars);
    card.innerHTML = `
      <div class="card-icon">${reward.icon}</div>
      <div class="card-stars">${stars}</div>
      <div class="card-text">${reward.text}</div>
    `;
    card.onclick = () => spawnFirework(window.innerWidth/2, window.innerHeight/2, ['#ff0033','#ffcc00','#ff6688']);
    grid.appendChild(card);
  });
}

function goToMain() {
  document.getElementById('resultsScreen').classList.remove('active');
  document.getElementById('wishScreen').classList.add('hidden');
  sessionStorage.setItem('wishDone', '1');
  playPaimonSound();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function doWishAgain() {
  document.getElementById('resultsScreen').classList.remove('active');
  doWish(lastWishCount);
}

function closeResults() { goToMain(); }

function reopenWish() {
  const screen = document.getElementById('wishScreen');
  screen.classList.remove('hidden');
  screen.style.background = '';
  screen.innerHTML = `
    <h1 class="wish-title">✦ МОЛИТВА ✦</h1>
    <p class="wish-subtitle">Привет, Матвей! 🎄<br>Настал момент новогодней молитвы.<br>Испытай удачу — выпадут подарки судьбы!</p>
    <div class="wish-actions">
      <button class="wish-btn wish-btn-1" onclick="doWish(1)">🌟 Помолиться ×1 🌟</button>
      <button class="wish-btn wish-btn-10" onclick="doWish(10)">💎 Помолиться ×10 💎</button>
    </div>
  `;
}

/* ===== PAIMON ===== */
function togglePaimon() {
  playPaimonSound();
  document.getElementById('paimonPanel').classList.toggle('open');
}

function openModal(id) {
  playPaimonSound();
  document.getElementById(id).classList.add('open');
  document.getElementById('paimonPanel').classList.remove('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

/* ===== ОТПРАВКА ФОРМЫ ЧЕРЕЗ FORMSPREE ===== */
const replyForm = document.getElementById('replyForm');
const replyBtn = document.getElementById('replyBtn');
const replySuccess = document.getElementById('replySuccess');
const replyError = document.getElementById('replyError');

if (replyForm) {
  replyForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    replyBtn.disabled = true;
    replyBtn.textContent = '📤 Отправляем...';
    replySuccess.classList.remove('show');
    replyError.classList.remove('show');
    
    const formData = new FormData(replyForm);
    
    try {
      const response = await fetch(replyForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        replySuccess.classList.add('show');
        replyForm.reset();
        spawnFirework(window.innerWidth / 2, window.innerHeight / 2, ['#44ff88', '#ffffff', '#ff3366']);
        setTimeout(() => replySuccess.classList.remove('show'), 5000);
      } else {
        replyError.classList.add('show');
        setTimeout(() => replyError.classList.remove('show'), 5000);
      }
    } catch (error) {
      replyError.classList.add('show');
      setTimeout(() => replyError.classList.remove('show'), 5000);
    } finally {
      replyBtn.disabled = false;
      replyBtn.textContent = '📤 Отправить';
    }
  });
}

/* ===== COMMISSIONS (ГЛАВНАЯ + ПАЙМОН) ===== */
const commissions = [
  { title: 'Съесть мандаринку', desc: 'Прогресс: 0/1', progress: 0, max: 1, icon: '🍊' },
  { title: 'Выспаться', desc: 'Прогресс: 0/8 часов', progress: 0, max: 8, icon: '😴' },
  { title: 'Поздравить друга', desc: 'Прогресс: 1/1 — выполнено!', progress: 1, max: 1, icon: '🎉' },
  { title: 'Посмотреть салют', desc: 'Прогресс: 0/1', progress: 0, max: 1, icon: '🎆' },
  { title: 'Загадать желание', desc: 'Прогресс: 0/1', progress: 0, max: 1, icon: '✨' },
  { title: 'Найти крутой лут в жизни', desc: 'Прогресс: 0/1', progress: 0, max: 1, icon: '💎' },
  { title: 'Быть легендарным', desc: 'Прогресс: 1/1 — выполнено!', progress: 1, max: 1, icon: '🏆' }
];

let congratsShown = false;

function checkAllCompleted() {
  const allDone = commissions.every(c => c.progress >= c.max);
  if (allDone && !congratsShown) {
    congratsShown = true;
    setTimeout(() => {
      const banner = document.getElementById('congratsBanner');
      if (banner) banner.classList.add('show');
      for (let i = 0; i < 8; i++) {
        setTimeout(() => spawnFirework(
          window.innerWidth * (0.15 + Math.random() * 0.7),
          window.innerHeight * (0.15 + Math.random() * 0.5),
          ['#ff0033','#ffcc00','#44ff88','#ff66cc','#ffffff']
        ), i * 250);
      }
      playPaimonSound();
    }, 400);
  }
}

function closeCongrats() {
  const banner = document.getElementById('congratsBanner');
  if (banner) banner.classList.remove('show');
}

function renderCommissions() {
  const list = document.getElementById('commissionsList');
  if (list) {
    list.innerHTML = '';
    commissions.forEach((c) => {
      const done = c.progress >= c.max;
      const div = document.createElement('div');
      div.className = 'commission' + (done ? ' completed' : '');
      div.innerHTML = `
        <div class="comm-check">${done ? '✓' : ''}</div>
        <div class="comm-info">
          <strong>${c.icon} ${c.title}</strong>
          <span>${done ? 'Выполнено!' : c.desc}</span>
          <div class="progress-bar"><div class="progress-fill" style="width:${(c.progress/c.max)*100}%"></div></div>
        </div>
      `;
      if (!done) {
        div.onclick = () => {
          c.progress = Math.min(c.progress + 1, c.max);
          renderCommissions();
          spawnFirework(window.innerWidth/2, window.innerHeight/2, ['#44ff00','#ffcc00','#ffffff']);
          checkAllCompleted();
        };
      }
      list.appendChild(div);
    });
  }

  const paimonList = document.getElementById('paimonTasksList');
  if (paimonList) {
    paimonList.innerHTML = '';
    let doneCount = 0;

    commissions.forEach((c) => {
      const done = c.progress >= c.max;
      if (done) doneCount++;

      const div = document.createElement('div');
      div.className = 'paimon-task' + (done ? ' done' : '');
      div.innerHTML = `
        <div class="paimon-task-checkbox">✓</div>
        <div class="paimon-task-content">
          <strong>${c.icon} ${c.title}</strong>
          <span>${done ? 'Задание выполнено!' : c.desc}</span>
        </div>
      `;

      if (!done) {
        div.onclick = () => {
          c.progress = Math.min(c.progress + 1, c.max);
          playPaimonSound();
          renderCommissions();
          spawnFirework(window.innerWidth/2, window.innerHeight/2, ['#44ff00','#ffcc00','#ffffff']);
          checkAllCompleted();
        };
      }
      paimonList.appendChild(div);
    });

    const total = commissions.length;
    const percent = Math.round((doneCount / total) * 100);
    
    const textEl = document.getElementById('taskProgressText');
    if (textEl) textEl.textContent = `${doneCount} / ${total}`;
    
    const fillEl = document.getElementById('taskProgressFill');
    if (fillEl) fillEl.style.width = percent + '%';
  }
}

/* ===== FIREWORKS ===== */
const fireCanvas = document.getElementById('fireworksCanvas');
const fireCtx = fireCanvas ? fireCanvas.getContext('2d') : null;
let particles = [];

function resizeFire() {
  if (!fireCanvas) return;
  fireCanvas.width = window.innerWidth;
  fireCanvas.height = window.innerHeight;
}
resizeFire();
window.addEventListener('resize', resizeFire);

function spawnFirework(x, y, colors) {
  for (let i = 0; i < 60; i++) {
    const angle = (Math.PI * 2 * i) / 60;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 2 + Math.random() * 3
    });
  }
}

function spawnSpecialFirework(type, x, y) {
  const configs = {
    pyro: { colors: ['#ff4400','#ff8800','#ffcc00','#ff2200'], count: 100, speed: 6 },
    hydro: { colors: ['#0088ff','#00ccff','#44ddff','#0066ff'], count: 80, speed: 5 },
    electro: { colors: ['#cc00ff','#dd44ff','#ee88ff','#ff00cc'], count: 90, speed: 7 },
    geo: { colors: ['#ffaa00','#ffcc00','#ffdd44','#cc8800'], count: 70, speed: 5 },
    cryo: { colors: ['#00ffcc','#44ffdd','#88ffee','#00ddaa'], count: 80, speed: 5.5 },
    dendro: { colors: ['#44ff00','#66ff44','#88ff66','#22aa00'], count: 85, speed: 5 },
    anemo: { colors: ['#00ffaa','#44ffcc','#88ffee','#00dd88'], count: 90, speed: 6.5 }
  };
  const cfg = configs[type];
  if (!cfg) return;
  for (let i = 0; i < cfg.count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * cfg.speed + 1;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
      size: 2 + Math.random() * 3
    });
  }
}

function animateFire() {
  if (!fireCtx) return;
  fireCtx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.life -= 0.012;
    fireCtx.globalAlpha = p.life;
    fireCtx.fillStyle = p.color;
    fireCtx.shadowBlur = 15;
    fireCtx.shadowColor = p.color;
    fireCtx.beginPath();
    fireCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fireCtx.fill();
  });
  fireCtx.globalAlpha = 1;
  fireCtx.shadowBlur = 0;
  requestAnimationFrame(animateFire);
}
animateFire();

const reactionCombos = {
  pyro: '🔥 Пиро-реакция: Огненный фейерверк!',
  hydro: '💧 Гидро-реакция: Волна счастья!',
  electro: '⚡ Электро-реакция: Искры удачи!',
  geo: '🪨 Гео-реакция: Кристальный салют!',
  cryo: '❄️ Крио-реакция: Снежное волшебство!',
  dendro: '🌿 Дендро-реакция: Цветение года!',
  anemo: '🌪️ Анемо-реакция: Вихрь перемен!'
};

function triggerElement(type) {
  playPaimonSound();
  document.body.className = 'theme-' + type;
  spawnSpecialFirework(type, window.innerWidth / 2, window.innerHeight / 2);
  spawnSpecialFirework(type, window.innerWidth * 0.25, window.innerHeight * 0.4);
  spawnSpecialFirework(type, window.innerWidth * 0.75, window.innerHeight * 0.5);
  const hint = document.getElementById('reactionHint');
  if (hint) hint.textContent = reactionCombos[type];
  document.querySelectorAll('.elem-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector('.elem-' + type);
  if (btn) btn.classList.add('active');
}

function resetTheme() {
  playPaimonSound();
  document.body.className = '';
  document.querySelectorAll('.elem-btn').forEach(b => b.classList.remove('active'));
  const hint = document.getElementById('reactionHint');
  if (hint) hint.textContent = '🔄 Тема возвращена к красной неоновой!';
  spawnFirework(window.innerWidth / 2, window.innerHeight / 2, ['#ff0033','#ff3366','#ff6688','#ff8899','#ffffff']);
  spawnFirework(window.innerWidth * 0.3, window.innerHeight * 0.3, ['#ff0033','#ff6688']);
  spawnFirework(window.innerWidth * 0.7, window.innerHeight * 0.3, ['#ff3366','#ff8899']);
  const btn = document.querySelector('.theme-reset-btn');
  if (btn) {
    btn.style.transform = 'rotate(360deg) scale(1.3)';
    setTimeout(() => { btn.style.transform = ''; }, 500);
  }
}

/* ===== PARCOUR ===== */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const W = canvas ? canvas.width : 800;
const H = canvas ? canvas.height : 400;

let player, platforms, cake, gameState, cameraX, keys;
let currentLevel = 1;
const maxLevel = 3;
const levelTargets = ['🎂', '🎁', '🏆'];
let isLevelTransitioning = false;

function initGame() {
  player = { x: 50, y: H - 100, w: 30, h: 30, vx: 0, vy: 0, onGround: false };
  
  if (currentLevel === 1) {
    platforms = [
      { x: 0, y: H - 40, w: 200, h: 40 },
      { x: 250, y: H - 100, w: 100, h: 20 },
      { x: 450, y: H - 160, w: 100, h: 20 },
      { x: 650, y: H - 220, w: 100, h: 20 },
      { x: 850, y: H - 160, w: 100, h: 20 },
      { x: 1050, y: H - 220, w: 100, h: 20 },
      { x: 1250, y: H - 150, w: 150, h: 20 }
    ];
    cake = { x: 1350, y: H - 190, w: 40, h: 40 };
  } 
  else if (currentLevel === 2) {
    platforms = [
      { x: 0, y: H - 40, w: 200, h: 40 },
      { x: 280, y: H - 120, w: 80, h: 20 },
      { x: 460, y: H - 80, w: 80, h: 20 },
      { x: 640, y: H - 160, w: 80, h: 20 },
      { x: 820, y: H - 240, w: 80, h: 20 },
      { x: 1000, y: H - 160, w: 80, h: 20 },
      { x: 1180, y: H - 240, w: 100, h: 20 },
      { x: 1380, y: H - 160, w: 100, h: 20 }
    ];
    cake = { x: 1480, y: H - 200, w: 40, h: 40 };
  } 
  else {
    platforms = [
      { x: 0, y: H - 40, w: 200, h: 40 },
      { x: 250, y: H - 110, w: 80, h: 20 },
      { x: 400, y: H - 190, w: 80, h: 20 },
      { x: 550, y: H - 270, w: 80, h: 20 },
      { x: 750, y: H - 190, w: 80, h: 20 },
      { x: 900, y: H - 110, w: 80, h: 20 },
      { x: 1100, y: H - 190, w: 80, h: 20 },
      { x: 1250, y: H - 270, w: 100, h: 20 },
      { x: 1450, y: H - 190, w: 100, h: 20 }
    ];
    cake = { x: 1550, y: H - 230, w: 40, h: 40 };
  }
  
  gameState = 'playing';
  cameraX = 0;
  keys = {};
  isLevelTransitioning = false; 
}

document.addEventListener('keydown', (e) => {
  if (['Space','ArrowUp','KeyW'].includes(e.code)) {
    if (gameState === 'playing' && player && player.onGround) {
      e.preventDefault();
      player.vy = -12;
      player.onGround = false;
    }
  }
  if (e.code === 'ArrowRight' || e.code === 'KeyD') { if(keys) keys.right = true; }
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') { if(keys) keys.left = true; }
});
document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowRight' || e.code === 'KeyD') { if(keys) keys.right = false; }
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') { if(keys) keys.left = false; }
});

if (canvas) {
  canvas.addEventListener('click', () => {
    if (gameState === 'playing' && player.onGround) {
      player.vy = -12;
      player.onGround = false;
    }
  });
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState === 'playing' && player.onGround) {
      player.vy = -12;
      player.onGround = false;
    }
  }, { passive: false });
}

function updateGame() {
  if (gameState !== 'playing' || !player) return;
  
  if (isLevelTransitioning) {
    player.vx = 0;
    player.vy = 0;
    return; 
  }
  
  if (keys.right) player.vx = Math.min(player.vx + 1.5, 5);
  else if (keys.left) player.vx = Math.max(player.vx - 1.5, -5);
  else player.vx *= 0.8;
  
  player.x += player.vx;
  player.vy += 0.6;
  player.y += player.vy;
  player.onGround = false;
  
  platforms.forEach(p => {
    if (player.x + player.w > p.x && player.x < p.x + p.w &&
        player.vy >= 0 && player.y + player.h >= p.y && player.y + player.h <= p.y + p.h + player.vy + 5) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  });
  
  if (player.y > H) {
    const hint = document.getElementById('gameHint');
    if (hint) {
      hint.textContent = '💀 Упал! Начинаем заново...';
      hint.style.color = '#ff4444';
      setTimeout(() => {
        hint.textContent = `🎯 Уровень ${currentLevel}: Доберись до ${levelTargets[currentLevel-1]}`;
        hint.style.color = '#ffddee';
      }, 2000);
    }
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    initGame();
    return;
  }

  const targetCam = Math.max(0, player.x - W / 3);
  cameraX += (targetCam - cameraX) * 0.1;
  
  if (player.x + player.w > cake.x && player.x < cake.x + cake.w &&
      player.y + player.h > cake.y && player.y < cake.y + cake.h) {
    
    isLevelTransitioning = true; 
    const hint = document.getElementById('gameHint');
    
    if (currentLevel < maxLevel) {
      currentLevel++;
      if (hint) hint.textContent = `🌟 Уровень ${currentLevel - 1} пройден! Следующий: ${levelTargets[currentLevel-1]}`;
      
      playPaimonSound();
      spawnFirework(window.innerWidth / 2, window.innerHeight / 2, ['#44ff00', '#ffcc00', '#fff']);
      
      setTimeout(() => {
        if (hint) hint.textContent = `🎯 Уровень ${currentLevel}: Доберись до ${levelTargets[currentLevel-1]}`;
        initGame();
      }, 1500);
      
    } else {
      gameState = 'won';
      if (hint) hint.textContent = '🏆 ВСЕ УРОВНИ ПРОЙДЕНЫ!';
      for (let i = 0; i < 8; i++) {
        setTimeout(() => spawnFirework(
          window.innerWidth * (0.2 + Math.random() * 0.6),
          window.innerHeight * (0.2 + Math.random() * 0.4),
          ['#ff0033','#ffcc00','#44ff00','#00ccff','#ff66cc']
        ), i * 200);
      }
    }
  }
}

function drawGame() {
  if (!ctx) return;
  ctx.fillStyle = '#44001a';
  ctx.fillRect(0, 0, W, H);
  
  for (let i = 0; i < 50; i++) {
    const sx = (i * 137 + cameraX * 0.2) % W;
    const sy = (i * 89) % (H - 100);
    ctx.fillStyle = `rgba(255, 200, 220, 0.7)`;
    ctx.fillRect(sx, sy, 2, 2);
  }
  
  ctx.save();
  ctx.translate(-cameraX, 0);
  
  platforms.forEach(p => {
    const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
    grad.addColorStop(0, '#ff6688');
    grad.addColorStop(1, '#cc0033');
    ctx.fillStyle = grad;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff0033';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(p.x, p.y, p.w, 3);
  });
  
  ctx.shadowBlur = 25;
  ctx.shadowColor = '#ffcc00';
  ctx.font = '40px serif';
  ctx.textAlign = 'center';
  ctx.fillText(levelTargets[currentLevel-1], cake.x + cake.w/2, cake.y + cake.h);
  ctx.shadowBlur = 0;
  
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#00ffaa';
  ctx.fillStyle = '#ff3366';
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillStyle = '#fff';
  ctx.fillRect(player.x + 6, player.y + 8, 6, 6);
  ctx.fillRect(player.x + 18, player.y + 8, 6, 6);
  ctx.shadowBlur = 0;
  ctx.restore();
  
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`🏃 Уровень ${currentLevel} из ${maxLevel}`, 15, 25);
  
  if (gameState === 'won') {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ffee00';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 ВСЕ УРОВНИ ПРОЙДЕНЫ! 🏆', W/2, H/2 - 20);
    ctx.fillStyle = '#ff8899';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('С Новым Годом, Матвей!', W/2, H/2 + 30);
  }
}

function gameLoop() {
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

/* ===== МОБИЛЬНЫЕ КНОПКИ УПРАВЛЕНИЯ ===== */
function startMove(direction) {
  if (!keys) keys = {};
  if (direction === 'left') keys.left = true;
  if (direction === 'right') keys.right = true;
  if (navigator.vibrate) navigator.vibrate(10);
}

function stopMove(direction) {
  if (!keys) return;
  if (direction === 'left') keys.left = false;
  if (direction === 'right') keys.right = false;
}

function mobileJump() {
  if (gameState === 'playing' && player && player.onGround) {
    player.vy = -12;
    player.onGround = false;
    if (navigator.vibrate) navigator.vibrate(20);
  }
}

document.querySelectorAll('.mobile-btn').forEach(btn => {
  btn.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
});

function startGame() { 
  currentLevel = 1; 
  initGame(); 
}

if (canvas) {
  initGame();
  gameLoop();
}

if (sessionStorage.getItem('wishDone') === '1') {
  const wishScreen = document.getElementById('wishScreen');
  if (wishScreen) wishScreen.classList.add('hidden');
}

/* ===== ПОЛНОЭКРАННЫЙ ПРОСМОТР ПОДАРКА ===== */
function openGiftFullscreen(card) {
  const img = card.querySelector('.gift-image img');
  const placeholder = card.querySelector('.gift-placeholder');
  const title = card.querySelector('.gift-info h4').textContent;
  const desc = card.querySelector('.gift-info p').textContent;
  
  const fsImage = document.getElementById('giftFsImage');
  const fsPlaceholder = document.getElementById('giftFsPlaceholder');
  
  if (img && img.src && img.style.display !== 'none' && img.complete && img.naturalWidth > 0) {
    fsImage.src = img.src;
    fsImage.style.display = 'block';
    fsPlaceholder.style.display = 'none';
  } else {
    fsImage.style.display = 'none';
    fsPlaceholder.textContent = placeholder.textContent || '🎁';
    fsPlaceholder.style.display = 'block';
  }
  
  document.getElementById('giftFsTitle').textContent = title;
  document.getElementById('giftFsDesc').textContent = desc;
  
  const fs = document.getElementById('giftFullscreen');
  fs.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  playPaimonSound();
  spawnFirework(window.innerWidth / 2, window.innerHeight / 2, ['#ff0033', '#ff6688', '#ffcc00']);
}

function closeGiftFullscreen(event) {
  if (event) event.stopPropagation();
  document.getElementById('giftFullscreen').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const fs = document.getElementById('giftFullscreen');
    if (fs && fs.classList.contains('open')) {
      closeGiftFullscreen();
    }
  }
});

/* ===== ЗАПУСК ===== */
renderCommissions();

/* ===== ГАЛЕРЕЯ ПЕРСОНАЖЕЙ ===== */
function openCharFullscreen(name, elementName, elementClass, imgSrc, desc) {
  const fs = document.getElementById('giftFullscreen');
  const fsContent = fs.querySelector('.gift-fs-content');
  const fsImage = document.getElementById('giftFsImage');
  const fsPlaceholder = document.getElementById('giftFsPlaceholder');
  
  fsContent.className = 'gift-fs-content char-theme-' + elementClass;
  
  if (imgSrc && imgSrc !== 'undefined') {
    fsImage.src = imgSrc;
    fsImage.style.display = 'block';
    fsPlaceholder.style.display = 'none';
  } else {
    fsImage.style.display = 'none';
    fsPlaceholder.textContent = '👤';
    fsPlaceholder.style.display = 'block';
  }
  
  document.getElementById('giftFsTitle').textContent = name + ' (' + elementName + ')';
  document.getElementById('giftFsDesc').textContent = desc;
  
  fs.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  playPaimonSound();
  spawnSpecialFirework(elementClass, window.innerWidth / 2, window.innerHeight / 2);
}

function openCharInfo(charName, category, itemName, itemDesc, elementClass) {
  const fs = document.getElementById('charInfoFullscreen');
  const fsContent = fs.querySelector('.gift-fs-content');
  
  fsContent.className = 'gift-fs-content char-theme-' + elementClass;
  
  let innerHTML = `
    <div class="gift-fs-info" style="padding-top: 40px; text-align: center;">
      <h3 id="charInfoTitle" style="color:#ffcc00; font-size: 1.2rem; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">${charName}</h3>
      <h2 id="charInfoSubtitle" style="font-size: 2.5rem; margin-bottom: 20px;">${category}</h2>
  `;

  if (category === 'Артефакты') {
    const charArtifacts = {
      'Никита': [
        { name: 'Цветок тишины', main: '+4780 HP', sub: '+15% к долгому молчанию' },
        { name: 'Перо гитары', main: '+311 Сила атаки', sub: '+20% к аккордам' },
        { name: 'Пески терпения', main: '+187 Мастерство', sub: '+30% к флегматичности' },
        { name: 'Кубок Роблокса', main: '+46% Бонус Гео', sub: '+10% к виртуальным прыжкам' },
        { name: 'Корона безразличия', main: '+62% Крит. урон', sub: '+50% к игнорированию суеты' }
      ],
      'Альберт': [
        { name: 'Цветок сцены', main: '+4780 HP', sub: '+20% к харизме' },
        { name: 'Перо микрофона', main: '+311 Сила атаки', sub: '+15% к громкости пения' },
        { name: 'Пески завода', main: '+187 Мастерство', sub: '+25% к энергии на выступлениях' },
        { name: 'Кубок оваций', main: '+46% Бонус Анемо', sub: '+10% к скорости передвижения' },
        { name: 'Корона заводилы', main: '+62% Крит. урон', sub: '+30% к урону от позитива' }
      ],
      'Саша': [
        { name: 'Цветок мудрости', main: '+4780 HP', sub: '+20% к знаниям' },
        { name: 'Перо Доты', main: '+311 Сила атаки', sub: '+15% к винрейту' },
        { name: 'Пески Сталзона', main: '+187 Мастерство', sub: '+20% к поиску хабара' },
        { name: 'Кубок шутника', main: '+46% Бонус Дендро', sub: '+25% к смеху с Стасом' },
        { name: 'Корона эрудита', main: '+62% Крит. урон', sub: '+30% к урону фактами' }
      ],
      'Дима': [
        { name: 'Цветок азарта', main: '+4780 HP', sub: '+20% к энергии' },
        { name: 'Перо кейс-батла', main: '+311 Сила атаки', sub: '+15% к шансу дропа скина' },
        { name: 'Пески спорта', main: '+187 Мастерство', sub: '+20% к выносливости' },
        { name: 'Кубок Роблокса', main: '+46% Бонус Пиро', sub: '+10% к скорости в игре' },
        { name: 'Корона кентика', main: '+62% Крит. урон', sub: '+50% к поддержке Матвея' }
      ],
      'Ульяна': [
        { name: 'Цветок спокойствия', main: '+4780 HP', sub: '+20% к дзену' },
        { name: 'Перо КС', main: '+311 Сила атаки', sub: '+15% к точности' },
        { name: 'Пески единоборств', main: '+187 Мастерство', sub: '+20% к силе удара' },
        { name: 'Кубок Геншина', main: '+46% Бонус Крио', sub: '+10% к шансу выбить 5★' },
        { name: 'Корона хладнокровия', main: '+62% Крит. урон', sub: '+30% к урону без эмоций' }
      ],
      'Матвей': [
        { name: 'Цветок сна', main: '+4780 HP', sub: '+20% к часам сна' },
        { name: 'Перо ноутбука', main: '+311 Сила атаки', sub: '+15% к скорости печати' },
        { name: 'Пески Геншина', main: '+187 Мастерство', sub: '+20% к фарму примогемов' },
        { name: 'Кубок аниме', main: '+46% Бонус Гидро', sub: '+10% к концентрации' },
        { name: 'Корона прокрастинации', main: '+62% Крит. урон', sub: '+50% к откладыванию дел' }
      ],
      'Стас': [
        { name: 'Цветок смеха', main: '+4780 HP', sub: '+20% к настроению' },
        { name: 'Перо товарища', main: '+311 Сила атаки', sub: '+15% к дуэту с Сашей' },
        { name: 'Пески Доты', main: '+187 Мастерство', sub: '+20% к контр-пику' },
        { name: 'Кубок мемов', main: '+46% Бонус Дендро', sub: '+10% к генерации шуток' },
        { name: 'Корона веселья', main: '+62% Крит. урон', sub: '+30% к урону смехом' }
      ],
      'Вася': [
        { name: 'Цветок стратегии', main: '+4780 HP', sub: '+20% к планам' },
        { name: 'Перо шахматиста', main: '+311 Сила атаки', sub: '+15% к точности ходов' },
        { name: 'Пески КС', main: '+187 Мастерство', sub: '+20% к тактике' },
        { name: 'Кубок капитана', main: '+46% Бонус Гео', sub: '+10% к командованию' },
        { name: 'Корона душнилы', main: '+62% Крит. урон', sub: '+50% к анализу ситуаций' }
      ],
      'Паша': [
        { name: 'Цветок космоса', main: '+4780 HP', sub: '+20% к мечтам' },
        { name: 'Перо танкиста', main: '+311 Сила атаки', sub: '+15% к броне' },
        { name: 'Пески ПК', main: '+187 Мастерство', sub: '+20% к сборке' },
        { name: 'Кубок розетки', main: '+46% Бонус Электро', sub: '+10% к силе тока' },
        { name: 'Корона лыжника', main: '+62% Крит. урон', sub: '+30% к скольжению' }
      ]
    };

    const list = charArtifacts[charName] || [];

    innerHTML += `
      <div class="artifact-modal-list">
        <div class="artifact-set-title" style="margin-bottom: 15px; font-weight: bold; color: #fff;">
          Набор: <span style="color: #ffcc00;">«${itemName}»</span>
        </div>
    `;
    
    list.forEach((art, index) => {
      innerHTML += `
        <div class="artifact-item-row">
          <div class="artifact-icon">${['🌸', '🪶', '⏳', '🏆', '👑'][index]}</div>
          <div class="artifact-details">
            <div class="artifact-name">${art.name} <span style="color:#ffcc00">★★★★★</span></div>
            <div class="artifact-main-stat">${art.main}</div>
            <div class="artifact-sub-stat">${art.sub}</div>
          </div>
        </div>
      `;
    });

    innerHTML += `</div>`;
  } 
  else {
    innerHTML += `
      <div style="background: rgba(0,0,0,0.5); border: 2px solid #ff6688; border-radius: 15px; padding: 25px; text-align: left;">
        <h4 style="color:#fff; font-size: 1.3rem; margin-bottom: 10px;">${itemName}</h4>
        <p style="color:#ffddee; font-size: 1.1rem; line-height: 1.6;">${itemDesc}</p>
      </div>
    `;
  }

  innerHTML += `</div>`;
  fsContent.innerHTML = `<button class="gift-fs-close" onclick="closeCharInfo(event)">✕</button>` + innerHTML;
  
  fs.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  playPaimonSound();
}

function closeCharInfo(event) {
  if (event) event.stopPropagation();
  document.getElementById('charInfoFullscreen').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const fs1 = document.getElementById('giftFullscreen');
    if (fs1 && fs1.classList.contains('open')) closeGiftFullscreen();
    
    const fs2 = document.getElementById('charInfoFullscreen');
    if (fs2 && fs2.classList.contains('open')) closeCharInfo();
  }
});

/* ===== ТАЙМЕР ДО НГ ===== */
function updateCountdown() {
  const now = new Date();
  const nextNG = new Date(now.getFullYear() + 1, 0, 1);
  const diff = nextNG - now;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / 1000 / 60) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  
  const el = document.getElementById('ngCountdown');
  if (el) {
    el.textContent = `${days} дн. ${hours} ч. ${mins} мин. ${secs} сек.`;
  }
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ===== СМОЛА ===== */
let currentResin = 160;
const maxResin = 160;

function updateResinUI() {
  const fill = document.getElementById('resinFill');
  const text = document.getElementById('resinText');
  if (fill && text) {
    fill.style.width = (currentResin / maxResin) * 100 + '%';
    text.textContent = `${Math.floor(currentResin)} / ${maxResin}`;
  }
}

function spendResin() {
  if (currentResin >= 40) {
    currentResin -= 40;
    updateResinUI();
    playPaimonSound();
    spawnFirework(window.innerWidth / 2, window.innerHeight / 2, ['#00ffcc', '#44ffdd', '#fff']);
    
    const rewards = [
      "Ты открыл блок с поздравлением! Желаю тебе крутого лута в новом году! 🎁",
      "Ты открыл блок с поздравлением! Пусть твои примогемы всегда уходят в 5★! 💎",
      "Ты открыл блок с поздравлением! Пусть новый год будет без лагов и багов! 🚀",
      "Ты открыл блок с поздравлением! 50/50 всегда в твою пользу! 🍀"
    ];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    showPopup('✨ Смола потрачена! ✨', randomReward, '#00ffcc');
    
  } else {
    showToast('Недостаточно смолы! 😔 Подожди немного...');
  }
}

setInterval(() => {
  if (currentResin < maxResin) {
    currentResin += 1;
    updateResinUI();
  }
}, 3000);

updateResinUI();

/* ===== АРТЕФАКТЫ ===== */
let artifactsEquipped = false;

function equipAllArtifacts() {
  const cards = document.querySelectorAll('.artifact-card');
  artifactsEquipped = !artifactsEquipped;
  
  cards.forEach((card, i) => {
    setTimeout(() => {
      if (artifactsEquipped) {
        card.classList.add('equipped');
        spawnFirework(
          window.innerWidth * (0.2 + Math.random() * 0.6),
          window.innerHeight * (0.2 + Math.random() * 0.4),
          ['#44ff88', '#ffcc00']
        );
      } else {
        card.classList.remove('equipped');
      }
    }, i * 150);
  });
  
  playPaimonSound();
  const btn = document.getElementById('equipAllBtn');
  if (btn) btn.textContent = artifactsEquipped ? '❌ Снять всё' : '✨ Надеть всё';
}

/* ===== ПИТИ ===== */
let pityCount = 10;
const maxPity = 10;

function addPity() {
  if (pityCount > 0) {
    pityCount--;
    const el = document.getElementById('pityCount');
    if (el) el.textContent = `${pityCount} круток`;
    
    playPaimonSound();
    spawnFirework(window.innerWidth - 100, window.innerHeight - 100, ['#ffcc00', '#ffaa00', '#fff']);
    
    if (pityCount === 0) {
      document.getElementById('pityCounter').classList.add('guaranteed');
      if (el) el.textContent = 'ГАРАНТ!';
      
      for(let i=0; i<10; i++) {
        setTimeout(() => {
          spawnFirework(
            window.innerWidth * (0.1 + Math.random() * 0.8),
            window.innerHeight * (0.1 + Math.random() * 0.6),
            ['#44ff88', '#ffcc00', '#fff', '#ff3366', '#00ccff']
          );
        }, i * 200);
      }
      
      setTimeout(() => {
        showPopup('🎉 ГАРАНТ! 🎉', 'Выпало новогоднее чудо! Желание обязательно сбудется! Исполнение займёт ровно 1 год.', '#ffcc00');
      }, 500);

      setTimeout(() => {
        pityCount = 10;
        document.getElementById('pityCounter').classList.remove('guaranteed');
        if (el) el.textContent = `${pityCount} круток`;
      }, 5000);
    }
  }
}

/* ===== ТОСТ (Уведомления) ===== */
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #881133, #4a0018);
    color: #fff;
    padding: 15px 30px;
    border-radius: 30px;
    border: 2px solid #ff6688;
    font-weight: bold;
    font-size: 1rem;
    box-shadow: 0 0 30px #ff0033;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.style.opacity = '1', 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ===== БАЗА ПЕРСОНАЖЕЙ И КАРТОЧКИ ===== */
const charactersData = {
  nikita: {
    name: 'Никита', rarity: '5★', element: 'Гео', elemClass: 'geo', photo: 'nikita.png',
    jokeElement: 'Флегматичность',
    weapon: 'Гитара «Тихий Аккорд»',
    passive: 'Пока молчит, восстанавливает 2% HP в секунду. Урон повышается на 30%, если молчание длится дольше 5 минут.',
    constellations: [
      'C1: «Медитация под аккорды»',
      'C2: «Долгая пауза»',
      'C3: «Взгляд в пустоту»',
      'C4: «Роблокс-марафон»',
      'C5: «Немой кивок согласия»',
      'C6: «Стена непонимания»'
    ]
  },
  albert: {
    name: 'Альберт', rarity: '5★', element: 'Анемо', elemClass: 'anemo', photo: 'albert.png',
    jokeElement: 'Заводной',
    weapon: 'Микрофон «Зов Сцены»',
    passive: 'При исполнении песни на мероприятии весь отряд получает +50% к скорости передвижения и не может уснуть.',
    constellations: [
      'C1: «Громкий привет»',
      'C2: «Первая строчка»',
      'C3: «Соло на гитаре»',
      'C4: «Овации зала»',
      'C5: «Срыв биса»',
      'C6: «Легенда фестиваля»'
    ]
  },
  sasha: {
    name: 'Саша', rarity: '4★', element: 'Дендро', elemClass: 'dendro', photo: 'sasha.png',
    jokeElement: 'Эрудиция',
    weapon: 'Книга Знаний «Дотапедия»',
    passive: 'Знает всё о «Сталзоне» и «Доте». С шансом 50% предсказывает следующий шаг противника (или союзника).',
    constellations: [
      'C1: «Умная шутка»',
      'C2: «Керри с нуля»',
      'C3: «Гайд по игре»',
      'C4: «Смех сквозь слёзы»',
      'C5: «Дуэт с Стасом»',
      'C6: «Мастер всех наук»'
    ]
  },
  dima: {
    name: 'Дима', rarity: '5★', element: 'Пиро', elemClass: 'pyro', photo: 'dima.png',
    jokeElement: 'Энергичность',
    weapon: 'Кейс «Золотая Лихорадка»',
    passive: 'Каждый потраченный рубль на кейс-батл повышает шанс на крит на 5%. В Роблоксе скорость атаки +20%.',
    constellations: [
      'C1: «Разминка перед каткой»',
      'C2: «Кейс-батл»',
      'C3: «Кентик Матвей»',
      'C4: «Спортивный азарт»',
      'C5: «Победа в Роблоксе»',
      'C6: «Огненный финиш»'
    ]
  },
  uliana: {
    name: 'Ульяна', rarity: '5★', element: 'Крио', elemClass: 'cryo', photo: 'uliana.png',
    jokeElement: 'Спокойствие',
    weapon: 'Боксёрские перчатки «Ледяной Хват»',
    passive: 'Спокойна в любой ситуации. В CS:GO (КС) точность стрельбы +40%, если никто не кричит в микрофон.',
    constellations: [
      'C1: «Холодная голова»',
      'C2: «Медитация в Геншине»',
      'C3: «Дзен-удар»',
      'C4: «Тихий выстрел»',
      'C5: «Единоборства»',
      'C6: «Абсолютный покой»'
    ]
  },
  matvey: {
    name: 'Матвей', rarity: '5★', element: 'Гидро', elemClass: 'hydro', photo: 'matvey.png',
    jokeElement: 'Прокрастинация',
    weapon: 'Ноутбук «Игровой Ультиматум»',
    passive: '+20% к скорости сдачи лабы в последнюю ночь. Сон восстанавливает 50% энергии, но еда дает лишь 10%.',
    constellations: [
      'C1: «Дедлайн не приговор»',
      'C2: «Кофеин в крови»',
      'C3: «Майнкрафт-строитель»',
      'C4: «Кентик Дима»',
      'C5: «Аниме-марафон»',
      'C6: «Легенда потоков»'
    ]
  },
  stas: {
    name: 'Стас', rarity: '4★', element: 'Дендро', elemClass: 'dendro', photo: 'stas.png',
    jokeElement: 'Знания',
    weapon: 'Дуэт-Пулемёт «Смехотерапия»',
    passive: 'Когда смеётся с Сашей, восстанавливает 30% энергии всей команде. Иммунитет к тильту в Доте.',
    constellations: [
      'C1: «Шутка за 300»',
      'C2: «Смех с Сашей»',
      'C3: «Дота-катка»',
      'C4: «Контр-пик»',
      'C5: «Сталзон»',
      'C6: «Хранитель мемов»'
    ]
  },
  vasya: {
    name: 'Вася', rarity: '4★', element: 'Гео', elemClass: 'geo', photo: 'vasya.png',
    jokeElement: 'Душнила',
    weapon: 'Шахматная доска «Аналитик»',
    passive: 'Может просчитать 10 шагов вперёд, но в КС всё равно умрёт от рандомной гранаты. Капитан команды.',
    constellations: [
      'C1: «Дебютный ход»',
      'C2: «Гамбит»',
      'C3: «Матовый удар»',
      'C4: «Тактический анализ»',
      'C5: «Капитан»',
      'C6: «Шах и мат»'
    ]
  },
  pasha: {
    name: 'Паша', rarity: '5★', element: 'Электро', elemClass: 'electro', photo: 'pasha.png',
    jokeElement: 'Скорость',
    weapon: 'Космический Компьютер «Звездолёт»',
    passive: 'Понимает, как собрать ПК с закрытыми глазами. В «Танках» перезарядка ускорена на 25%.',
    constellations: [
      'C1: «Искра в розетке»',
      'C2: «Разряд от шутки»',
      'C3: «Орбита»',
      'C4: «Сборка ПК»',
      'C5: «Лыжный след»',
      'C6: «Тесла»'
    ]
  }
};

let currentFullCharId = null;
let currentFullCharLevel = 1;

function openFullCharCard(id) {
  const data = charactersData[id];
  if (!data) return;
  
  currentFullCharId = id;
  currentFullCharLevel = Math.floor(Math.random() * 50) + 1;
  
  const fs = document.getElementById('giftFullscreen');
  const fsContent = fs.querySelector('.gift-fs-content');
  
  fsContent.className = 'gift-fs-content char-theme-' + data.elemClass;
  
  fsContent.innerHTML = `
    <button class="gift-fs-close" onclick="closeGiftFullscreen(event)">✕</button>
    <div class="full-char-card">
      <div class="full-char-header">
        <div class="full-char-name">${data.name}</div>
        <div class="full-char-rarity">${data.rarity}</div>
      </div>
      <div class="full-char-element elem-${data.elemClass}" style="color: #fff; background: rgba(0,0,0,0.4);">
        Элемент: ${data.jokeElement} (${data.element})
      </div>
      
      <div class="full-char-body">
        <div class="full-char-photo">
          <img src="${data.photo}" onerror="this.parentElement.innerText='👤'">
        </div>
        <div class="full-char-details">
          <p>🗡️ Оружие: <strong>${data.weapon}</strong></p>
          <p>✨ Пассивка: <strong>${data.passive}</strong></p>
          <p style="margin-top: 15px; color: #ffcc00;">🌌 Созвездия:</p>
          <ul class="constellation-list">
            ${data.constellations.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <div class="upgrade-section">
        <div class="upgrade-level" id="fullCharLevelText">Уровень: ${currentFullCharLevel} / 90</div>
        <button class="game-btn" id="fullCharUpgradeBtn" onclick="upgradeFullChar()">⬆️ Возвысить</button>
      </div>
    </div>
  `;
  
  fs.classList.add('open');
  document.body.style.overflow = 'hidden';
  playPaimonSound();
}

function upgradeFullChar() {
  if (currentFullCharLevel >= 90) return;
  
  const add = Math.floor(Math.random() * 10) + 1;
  currentFullCharLevel = Math.min(currentFullCharLevel + add, 90);
  
  const lvlEl = document.getElementById('fullCharLevelText');
  if (lvlEl) lvlEl.textContent = `Уровень: ${currentFullCharLevel} / 90`;
  
  const card = document.querySelector('.full-char-card');
  if (card) {
    card.classList.add('level-up-anim');
    setTimeout(() => card.classList.remove('level-up-anim'), 1000);
  }
  
  playPaimonSound();
  spawnFirework(window.innerWidth / 2, window.innerHeight / 2, ['#ffcc00', '#ffee00', '#fff']);
  
  if (currentFullCharLevel === 90) {
    document.getElementById('fullCharUpgradeBtn').textContent = '⭐ МАКСИМУМ ⭐';
    document.getElementById('fullCharUpgradeBtn').disabled = true;
  }
}

/* ===== ВСПЛЫВАЮЩИЕ ОКНА ===== */
function showPopup(title, desc, borderColor = '#ffcc00') {
  document.getElementById('popupTitle').textContent = title;
  document.getElementById('popupDesc').textContent = desc;
  const content = document.getElementById('popupContent');
  content.style.borderColor = borderColor;
  document.getElementById('popupOverlay').classList.add('open');
  playPaimonSound();
}

function closePopup() {
  document.getElementById('popupOverlay').classList.remove('open');
}

/* ===== СИСТЕМА ОТРЯДА ===== */
let teamMembers = ['nikita', 'albert', 'sasha', 'matvey']; // Текущий состав (ID из charactersData)

const resonances = [
  {
    name: "Нити защиты",
    elements: ['geo', 'geo'],
    desc: "Элементальное сопротивление +15%, физ. сопротивление +15%.",
    icon: "🛡️"
  },
  {
    name: "Пылающий огонь",
    elements: ['pyro', 'pyro'],
    desc: "Уменьшает длительность Крио эффекта на 40%. Увеличивает силу атаки на 25%.",
    icon: "🔥"
  },
  {
    name: "Успокаивающая вода",
    elements: ['hydro', 'hydro'],
    desc: "Уменьшает длительность Пиро эффекта на 40%. Увеличивает макс. HP на 25%.",
    icon: "💧"
  },
  {
    name: "Проворный ветер",
    elements: ['anemo', 'anemo'],
    desc: "Уменьшает потребление выносливости на 15%. Увеличивает скорость передвижения на 10%.",
    icon: "🌪️"
  },
  {
    name: "Высокое напряжение",
    elements: ['electro', 'electro'],
    desc: "Уменьшает длительность Гидро эффекта на 40%. Статусы... имеют 100% шанс оставить элементальную частицу Электро.",
    icon: "⚡"
  },
  {
    name: "Ползучая зелень",
    elements: ['dendro', 'dendro'],
    desc: "Увеличивает мастерство стихий на 50 ед. Реакции увеличивают мастерство всех членов отряда.",
    icon: "🌿"
  },
  {
    name: "Расколотый лёд",
    elements: ['cryo', 'cryo'],
    desc: "Уменьшает длительность Электро эффекта на 40%. Увеличивает шанс крит. попадания по замороженным врагам на 15%.",
    icon: "❄️"
  },
  {
    name: "Разнообразие стихий",
    elements: ['unique'],
    desc: "4 неодинаковых элемента. Элементальное сопротивление +15%, физ. сопротивление +15%.",
    icon: "🌈"
  }
];

function openTeamModal() {
  renderTeamSlots();
  renderAvailableChars();
  openModal('teamModal');
}

function renderTeamSlots() {
  const container = document.getElementById('teamSlots');
  if (!container) return;
  
  container.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const charId = teamMembers[i];
    const charData = charId ? charactersData[charId] : null;
    
    const slot = document.createElement('div');
    slot.className = 'team-slot ' + (charData ? 'filled' : 'empty');
    
    if (charData) {
      slot.onclick = () => removeFromTeam(i);
      slot.innerHTML = `
        <div class="team-slot-element elem-${charData.elemClass}">
          <img src="${charData.elemClass === 'pyro' ? 'Pyro.webp' : charData.elemClass === 'hydro' ? 'Hydro.webp' : charData.elemClass === 'electro' ? 'electro.webp' : charData.elemClass === 'geo' ? 'Geo.webp' : charData.elemClass === 'cryo' ? 'Cryo.webp' : charData.elemClass === 'dendro' ? 'dendro.png' : 'anemo.png'}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span>${charData.element[0]}</span>'">
        </div>
        <div class="team-slot-photo">
          <img src="${charData.photo}" onerror="this.innerText='👤'">
        </div>
        <div class="team-slot-info">
          <div class="team-slot-name">${charData.name}</div>
          <div class="team-slot-level">Ур. ${Math.floor(Math.random() * 40) + 50}</div>
        </div>
      `;
    } else {
      slot.innerHTML = `<div style="color: #555; font-size: 2rem; margin-bottom: 20px;">+</div>`;
    }
    container.appendChild(slot);
  }
}

function renderAvailableChars() {
  const container = document.getElementById('teamAvailableList');
  if (!container) return;
  
  container.innerHTML = '';
  for (const [id, data] of Object.entries(charactersData)) {
    const isSelected = teamMembers.includes(id);
    const item = document.createElement('div');
    item.className = 'team-available-item ' + (isSelected ? 'selected' : '');
    
    if (!isSelected) {
      item.onclick = () => addToTeam(id);
    }
    
    item.innerHTML = `
      <img src="${data.photo}" onerror="this.innerText='👤'">
      <div class="name">${data.name}</div>
    `;
    container.appendChild(item);
  }
}

function addToTeam(id) {
  if (teamMembers.length >= 4) {
    showToast('В отряде уже 4 персонажа! Уберите кого-нибудь.');
    return;
  }
  if (!teamMembers.includes(id)) {
    teamMembers.push(id);
    playPaimonSound();
    renderTeamSlots();
    renderAvailableChars();
    checkTeamResonances();
  }
}

function removeFromTeam(index) {
  teamMembers.splice(index, 1);
  playPaimonSound();
  renderTeamSlots();
  renderAvailableChars();
  checkTeamResonances();
}

function openTeamBonusModal() {
  const container = document.getElementById('teamBonusList');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Считаем стихии
  const elementCounts = {};
  teamMembers.forEach(id => {
    const el = charactersData[id].elemClass;
    elementCounts[el] = (elementCounts[el] || 0) + 1;
  });

  const uniqueElements = Object.keys(elementCounts).length;

  resonances.forEach(res => {
    let isActive = false;
    
    if (res.elements[0] === 'unique') {
      isActive = uniqueElements >= 4;
    } else {
      const el = res.elements[0];
      isActive = (elementCounts[el] || 0) >= 2;
    }

    const div = document.createElement('div');
    div.className = 'bonus-item ' + (isActive ? 'active' : 'inactive');
    
    // Иконки элементов
    let iconsHTML = '';
    if (res.elements[0] === 'unique') {
      iconsHTML = `<div class="bonus-icon" style="font-size:1.5rem">🌟</div>`;
    } else {
      const el = res.elements[0];
      iconsHTML = `
        <div class="bonus-icon">
          <div class="elem elem-${el}">
            <img src="${el === 'pyro' ? 'Pyro.webp' : el === 'hydro' ? 'Hydro.webp' : el === 'electro' ? 'electro.webp' : el === 'geo' ? 'Geo.webp' : el === 'cryo' ? 'Cryo.webp' : el === 'dendro' ? 'dendro.png' : 'anemo.png'}" onerror="this.style.display='none'">
          </div>
          <div class="elem elem-${el}">
            <img src="${el === 'pyro' ? 'Pyro.webp' : el === 'hydro' ? 'Hydro.webp' : el === 'electro' ? 'electro.webp' : el === 'geo' ? 'Geo.webp' : el === 'cryo' ? 'Cryo.webp' : el === 'dendro' ? 'dendro.png' : 'anemo.png'}" onerror="this.style.display='none'">
          </div>
        </div>
      `;
    }

    div.innerHTML = `
      ${iconsHTML}
      <div class="bonus-text">
        <h4>
          ${res.name}
          <span class="bonus-status ${isActive ? '' : 'off'}">${isActive ? 'Активно ✓' : 'Не активно'}</span>
        </h4>
        <p>${res.desc}</p>
      </div>
    `;
    container.appendChild(div);
  });

  // Открываем окно с бонусами, НЕ закрывая окно отряда
  playPaimonSound();
  document.getElementById('teamBonusModal').classList.add('open');
}
  openModal('teamBonusModal');
}

function checkTeamResonances() {
  // Можно добавить визуальное уведомление, если сменился резонанс
}
