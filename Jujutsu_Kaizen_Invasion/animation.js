/* ══════════════════════════════════════
   ANIMATION.JS — Background & Effects
   ══════════════════════════════════════ */

// ── Background Canvas — Cursed Energy Particles ───────────────────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], sigils = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // ── Particle class ──────────────────────────────────────────────────────────
  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 2 + 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      this.opacity = 0;
      // Green or red, mostly green
      this.isRed = Math.random() < 0.12;
      this.color = this.isRed
        ? `rgba(204,34,34,`
        : (Math.random() < 0.15 ? `rgba(200,168,75,` : `rgba(45,184,62,`);
    }

    update() {
      this.life++;
      this.x += this.speedX;
      this.y += this.speedY;
      // Fade in/out
      if (this.life < 40) {
        this.opacity = this.life / 40;
      } else if (this.life > this.maxLife - 40) {
        this.opacity = (this.maxLife - this.life) / 40;
      } else {
        this.opacity = 1;
      }
      if (this.life >= this.maxLife || this.y < -10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.opacity * 0.7})`;
      ctx.fill();

      // Glow for larger particles
      if (this.size > 1.2) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
        grad.addColorStop(0, `${this.color}${this.opacity * 0.3})`);
        grad.addColorStop(1, `${this.color}0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }
  }

  // ── Sigil class — floating hexagonal seals ──────────────────────────────────
  class Sigil {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 80;
      this.size = Math.random() * 30 + 15;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.004;
      this.speedY = -(Math.random() * 0.2 + 0.05);
      this.speedX = (Math.random() - 0.5) * 0.05;
      this.life = 0;
      this.maxLife = Math.random() * 600 + 400;
      this.opacity = 0;
      this.type = Math.floor(Math.random() * 3); // 0=hex, 1=triangle, 2=circle-star
      this.isRed = Math.random() < 0.1;
      this.color = this.isRed ? '204,34,34' : '45,184,62';
    }

    update() {
      this.life++;
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;
      if (this.life < 80)       this.opacity = this.life / 80;
      else if (this.life > this.maxLife - 80) this.opacity = (this.maxLife - this.life) / 80;
      else                       this.opacity = 1;
      if (this.life >= this.maxLife || this.y < -100) this.reset();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity * 0.12;
      ctx.strokeStyle = `rgb(${this.color})`;
      ctx.lineWidth = 0.8;

      if (this.type === 0) {
        // Hexagon
        drawHex(ctx, 0, 0, this.size);
        drawHex(ctx, 0, 0, this.size * 0.6);
      } else if (this.type === 1) {
        // Double triangle (Star of David-ish)
        drawTriangle(ctx, 0, 0, this.size, false);
        drawTriangle(ctx, 0, 0, this.size, true);
      } else {
        // Circle with inner lines
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        // 6 spokes
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * this.size * 0.5, Math.sin(a) * this.size * 0.5);
          ctx.lineTo(Math.cos(a) * this.size, Math.sin(a) * this.size);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  }

  function drawHex(ctx, cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  function drawTriangle(ctx, cx, cy, r, flipped) {
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + (flipped ? Math.PI : 0);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // ── Energy veins — faint flowing lines ─────────────────────────────────────
  class Vein {
    constructor() { this.reset(); }
    reset() {
      this.points = [];
      const startX = Math.random() * W;
      const startY = Math.random() * H;
      let x = startX, y = startY;
      const len = Math.floor(Math.random() * 8 + 5);
      for (let i = 0; i < len; i++) {
        x += (Math.random() - 0.5) * 80;
        y += (Math.random() - 0.5) * 80;
        this.points.push({ x, y });
      }
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
      this.opacity = 0;
      this.isRed = Math.random() < 0.08;
    }

    update() {
      this.life++;
      if (this.life < 30)       this.opacity = this.life / 30;
      else if (this.life > this.maxLife - 30) this.opacity = (this.maxLife - this.life) / 30;
      else                      this.opacity = 1;
      if (this.life >= this.maxLife) this.reset();
    }

    draw() {
      if (this.points.length < 2) return;
      ctx.save();
      ctx.globalAlpha = this.opacity * 0.06;
      ctx.strokeStyle = this.isRed ? 'rgba(204,34,34,1)' : 'rgba(45,184,62,1)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        const mx = (this.points[i-1].x + this.points[i].x) / 2;
        const my = (this.points[i-1].y + this.points[i].y) / 2;
        ctx.quadraticCurveTo(this.points[i-1].x, this.points[i-1].y, mx, my);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  // ── Init particles ──────────────────────────────────────────────────────────
  const PARTICLE_COUNT = 120;
  const SIGIL_COUNT = 18;
  const VEIN_COUNT = 12;
  const veins = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  for (let i = 0; i < SIGIL_COUNT; i++)   sigils.push(new Sigil());
  for (let i = 0; i < VEIN_COUNT; i++)    veins.push(new Vein());

  // ── Render loop ─────────────────────────────────────────────────────────────
  function tick() {
    ctx.clearRect(0, 0, W, H);

    // Subtle radial vignette
    const vignette = ctx.createRadialGradient(W/2, H/2, H * 0.2, W/2, H/2, H * 0.9);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,5,0,0.5)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    veins.forEach(v => { v.update(); v.draw(); });
    sigils.forEach(s => { s.update(); s.draw(); });
    particles.forEach(p => { p.update(); p.draw(); });

    requestAnimationFrame(tick);
  }

  tick();
})();

// ── Card hover energy shimmer ────────────────────────────────────────────────
document.addEventListener('mousemove', (e) => {
  const card = e.target.closest('.tech-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top)  / rect.height) * 100;
  card.style.setProperty('--mx', `${x}%`);
  card.style.setProperty('--my', `${y}%`);
});

// ── Sidebar entrance animation ───────────────────────────────────────────────
(function () {
  const sidebar = document.getElementById('sidebar');
  sidebar.style.opacity = '0';
  sidebar.style.transform = 'translateX(-20px)';
  sidebar.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      sidebar.style.opacity = '1';
      sidebar.style.transform = 'translateX(0)';
    });
  });

  const mainContent = document.getElementById('main-content');
  mainContent.style.opacity = '0';
  mainContent.style.transition = 'opacity 0.8s ease 0.2s';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      mainContent.style.opacity = '1';
    });
  });
})();

// ── Nav button ripple on click ───────────────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top  - size/2}px;
      background:rgba(45,184,62,0.15);
      border-radius:50%;
      transform:scale(0);
      animation:navRipple 0.5s ease-out forwards;
      pointer-events:none;
    `;
    btn.style.position = 'relative';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Inject nav ripple keyframe
const styleTag = document.createElement('style');
styleTag.textContent = `
@keyframes navRipple {
  from { transform: scale(0); opacity: 1; }
  to   { transform: scale(2.5); opacity: 0; }
}
`;
document.head.appendChild(styleTag);

// ── Title swap animation ─────────────────────────────────────────────────────
const origSetActiveNavBtn = window.setActiveNavBtn;
// Pulse the main title on view change
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const title = document.getElementById('main-title');
    title.style.transition = 'none';
    title.style.opacity = '0';
    title.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      title.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      title.style.opacity = '1';
      title.style.transform = 'translateY(0)';
    }, 80);
  });
});

// ── Stat number count-up animation ───────────────────────────────────────────
const statNumEl = document.getElementById('stat-num');
let statAnimFrame = null;

function animateStatNum(target) {
  if (statAnimFrame) cancelAnimationFrame(statAnimFrame);
  const start = parseInt(statNumEl.textContent) || 0;
  const diff = target - start;
  if (diff === 0) return;
  const duration = 400;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    statNumEl.textContent = Math.round(start + diff * ease);
    if (progress < 1) statAnimFrame = requestAnimationFrame(step);
  }
  statAnimFrame = requestAnimationFrame(step);
}

// Patch renderMainGrid to use animated count
const _originalRenderMainGrid = window.renderMainGrid;
// Observe stat-num changes via MutationObserver
const statObserver = new MutationObserver(mutations => {
  mutations.forEach(m => {
    const newVal = parseInt(statNumEl.textContent);
    if (!isNaN(newVal)) animateStatNum(newVal);
  });
});
// We'll trigger animation on DOM update - hook via custom event
document.addEventListener('jjk:statUpdate', (e) => {
  animateStatNum(e.detail.count);
});
