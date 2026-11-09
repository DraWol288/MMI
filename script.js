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
  // 1. Рендер на главной
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

  // 2. Рендер в меню Паймон
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

function initGame() {
  player = { x: 50, y: H - 100, w: 30, h: 30, vx: 0, vy: 0, onGround: false };
  platforms = [
    { x: 0, y: H - 40, w: 200, h: 40 },
    { x: 250, y: H - 110, w: 100, h: 20 },
    { x: 420, y: H - 180, w: 100, h: 20 },
    { x: 590, y: H - 250, w: 100, h: 20 },
    { x: 760, y: H - 200, w: 100, h: 20 },
    { x: 930, y: H - 280, w: 100, h: 20 },
    { x: 1100, y: H - 220, w: 120, h: 20 },
    { x: 1300, y: H - 150, w: 150, h: 20 }
  ];
  cake = { x: 1420, y: H - 210, w: 40, h: 40 };
  gameState = 'playing';
  cameraX = 0;
  keys = {};
}

document.addEventListener('keydown', (e) => {
  if (['Space','ArrowUp','KeyW'].includes(e.code)) {
    if (gameState === 'playing' && player && player.onGround) {
      e.preventDefault();
      player.vy = -11;
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
      player.vy = -11;
      player.onGround = false;
    }
  });
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState === 'playing' && player.onGround) {
      player.vy = -11;
      player.onGround = false;
    }
  }, { passive: false });
}

function updateGame() {
  if (gameState !== 'playing' || !player) return;
  
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
  
  // Падение за границу
  if (player.y > H) {
    const hint = document.getElementById('gameHint');
    if (hint) {
      hint.textContent = '💀 Упал! Начинаем заново...';
      hint.style.color = '#ff4444';
      setTimeout(() => {
        hint.textContent = '🎯 Доберись до торта!';
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
    gameState = 'won';
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnFirework(
        window.innerWidth * (0.2 + Math.random() * 0.6),
        window.innerHeight * (0.2 + Math.random() * 0.4),
        ['#ff0033','#ffcc00','#44ff00','#00ccff','#ff66cc']
      ), i * 200);
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
  ctx.fillText('🎂', cake.x + cake.w/2, cake.y + cake.h);
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
  ctx.fillText('🏃 Прыжок: Пробел / ↑ / Тап', 15, 25);
  if (gameState === 'won') {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ffee00';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎂 ПОБЕДА! 🎂', W/2, H/2 - 20);
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
    player.vy = -11;
    player.onGround = false;
    if (navigator.vibrate) navigator.vibrate(20);
  }
}

document.querySelectorAll('.mobile-btn').forEach(btn => {
  btn.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
});

function startGame() { initGame(); }

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
// Открытие фото персонажа на весь экран
function openCharFullscreen(name, elementName, elementClass, imgSrc, desc) {
  const fs = document.getElementById('giftFullscreen');
  const fsContent = fs.querySelector('.gift-fs-content');
  const fsImage = document.getElementById('giftFsImage');
  const fsPlaceholder = document.getElementById('giftFsPlaceholder');
  
  // Сбрасываем старые классы и ставим новый цвет
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

// Открытие информации об оружии/артефактах/навыках
function openCharInfo(charName, category, itemName, itemDesc, elementClass) {
  document.getElementById('charInfoTitle').textContent = charName;
  document.getElementById('charInfoSubtitle').textContent = category;
  document.getElementById('charInfoItemName').textContent = itemName;
  document.getElementById('charInfoItemDesc').textContent = itemDesc;
  
  const fs = document.getElementById('charInfoFullscreen');
  const fsContent = fs.querySelector('.gift-fs-content');
  
  // Сбрасываем старые классы и ставим новый цвет
  fsContent.className = 'gift-fs-content char-theme-' + elementClass;
  
  fs.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  playPaimonSound();
}

function closeCharInfo(event) {
  if (event) event.stopPropagation();
  document.getElementById('charInfoFullscreen').classList.remove('open');
  document.body.style.overflow = '';
}

// Закрытие по Escape для обоих окон
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const fs1 = document.getElementById('giftFullscreen');
    if (fs1 && fs1.classList.contains('open')) closeGiftFullscreen();
    
    const fs2 = document.getElementById('charInfoFullscreen');
    if (fs2 && fs2.classList.contains('open')) closeCharInfo();
  }
});
