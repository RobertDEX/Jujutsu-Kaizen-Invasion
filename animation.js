/* ══════════════════════════════════════
   ANIMATION.JS — Ink Fire Canvas
   ══════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // ── Ink Fire Particle ─────────────────────────────────────────────
  // Each particle rises like flame but is drawn as a thick ink brushstroke
  // with a near-black outline fading to amber/red at the core.

  const FIRE_COLORS = [
    [10,   3,  0],   // near-black ink
    [30,   8,  0],   // deep ember
    [70,  20,  0],   // dark coal
    [130,  40,  0],  // low fire
    [190,  65,  0],  // mid fire
    [240, 100,  0],  // bright fire
    [255, 140, 20],  // hot tip
  ];

  class InkFlame {
    constructor(baseX) {
      this.baseX = baseX;
      this.reset(true);
    }

    reset(initial = false) {
      this.x        = this.baseX + (Math.random() - 0.5) * 40;
      this.y        = initial ? H - Math.random() * H * 0.4 : H + 10;
      this.vy       = -(Math.random() * 1.2 + 0.4);
      this.vx       = (Math.random() - 0.5) * 0.3;
      this.life     = 0;
      this.maxLife  = Math.random() * 180 + 80;
      this.size     = Math.random() * 18 + 6;
      this.wobble   = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.08 + 0.02;
      // Pick a color index — weight toward dark ink
      this.colorIdx = Math.floor(Math.pow(Math.random(), 1.6) * FIRE_COLORS.length);
    }

    update() {
      this.life++;
      this.wobble += this.wobbleSpeed;
      this.x  += this.vx + Math.sin(this.wobble) * 0.4;
      this.y  += this.vy;
      this.vy -= 0.005; // accelerate upward slightly
      this.size *= 0.993;
      if (this.life >= this.maxLife || this.y < -50 || this.size < 1) this.reset();
    }

    draw() {
      const progress = this.life / this.maxLife;
      let alpha;
      if (progress < 0.15)       alpha = progress / 0.15;
      else if (progress > 0.6)   alpha = 1 - (progress - 0.6) / 0.4;
      else                       alpha = 1;

      alpha *= 0.55;

      const [r, g, b] = FIRE_COLORS[this.colorIdx];

      // Outer ink halo — very dark, slightly blurred
      const outerR = this.size * 1.8;
      const halo = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, outerR);
      halo.addColorStop(0,   `rgba(${r},${g},${b},${alpha * 0.7})`);
      halo.addColorStop(0.4, `rgba(${Math.max(r-20,0)},${Math.max(g-5,0)},0,${alpha * 0.4})`);
      halo.addColorStop(1,   `rgba(0,0,0,0)`);

      ctx.beginPath();
      // Ink-flame teardrop shape
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(0.7, 1);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      grad.addColorStop(0,   `rgba(${r},${g},${b},${alpha})`);
      grad.addColorStop(0.5, `rgba(${Math.max(r-30,0)},${Math.max(g-8,0)},0,${alpha * 0.6})`);
      grad.addColorStop(1,   `rgba(0,0,0,0)`);
      ctx.beginPath();
      // Flame teardrop: pointed top, rounded bottom
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(
        this.size * 0.7, -this.size * 0.3,
        this.size * 0.7,  this.size * 0.5,
        0, this.size * 0.6
      );
      ctx.bezierCurveTo(
        -this.size * 0.7,  this.size * 0.5,
        -this.size * 0.7, -this.size * 0.3,
        0, -this.size
      );
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }
  }

  // ── Ink Drip ──────────────────────────────────────────────────────
  // Thick falling ink drops that splatter at the bottom edges
  class InkDrip {
    constructor() { this.reset(); }

    reset() {
      this.x        = Math.random() < 0.5 ? Math.random() * W * 0.15 : W - Math.random() * W * 0.15;
      this.y        = Math.random() * H * 0.3;
      this.vy       = Math.random() * 0.6 + 0.2;
      this.radius   = Math.random() * 3 + 1.5;
      this.life     = 0;
      this.maxLife  = Math.random() * 300 + 150;
      this.trail    = [];
    }

    update() {
      this.life++;
      this.vy += 0.015;
      this.y  += this.vy;
      this.trail.push({ x: this.x + (Math.random()-0.5)*1.5, y: this.y });
      if (this.trail.length > 20) this.trail.shift();
      if (this.life >= this.maxLife || this.y > H + 20) this.reset();
    }

    draw() {
      if (this.trail.length < 2) return;
      ctx.save();
      // Trail
      ctx.strokeStyle = `rgba(5,2,0,0.5)`;
      ctx.lineWidth = this.radius * 0.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.stroke();
      // Drop head
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fillStyle = `rgba(8,3,0,0.7)`;
      ctx.fill();
      ctx.restore();
    }
  }

  // ── Floating Ink Sigil ────────────────────────────────────────────
  class InkSigil {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x        = Math.random() * W;
      this.y        = initial ? Math.random() * H : H + 100;
      this.size     = Math.random() * 45 + 20;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.003;
      this.vy       = -(Math.random() * 0.15 + 0.04);
      this.life     = 0;
      this.maxLife  = Math.random() * 500 + 300;
      this.type     = Math.floor(Math.random() * 4);
      // Either dark ink or faint fire
      this.isFire   = Math.random() < 0.3;
    }

    update() {
      this.life++;
      this.y        += this.vy;
      this.rotation += this.rotSpeed;
      if (this.life >= this.maxLife || this.y < -120) this.reset();
    }

    get alpha() {
      const p = this.life / this.maxLife;
      if (p < 0.1) return p / 0.1 * 0.12;
      if (p > 0.8) return (1 - (p - 0.8) / 0.2) * 0.12;
      return 0.12;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.alpha;
      ctx.strokeStyle = this.isFire ? `rgba(180,60,0,1)` : `rgba(15,5,0,1)`;
      ctx.lineWidth   = 0.8;

      switch(this.type) {
        case 0: this.drawHex(); break;
        case 1: this.drawTriStar(); break;
        case 2: this.drawCircleRunes(); break;
        case 3: this.drawInkKanji(); break;
      }
      ctx.restore();
    }

    drawHex() {
      for (let pass = 0; pass < 2; pass++) {
        const r = this.size * (pass === 0 ? 1 : 0.55);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i/6)*Math.PI*2 - Math.PI/6;
          const x = Math.cos(a)*r, y = Math.sin(a)*r;
          i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      // Spokes
      for (let i = 0; i < 6; i++) {
        const a = (i/6)*Math.PI*2 - Math.PI/6;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a)*this.size*0.55, Math.sin(a)*this.size*0.55);
        ctx.lineTo(Math.cos(a)*this.size,      Math.sin(a)*this.size);
        ctx.stroke();
      }
    }

    drawTriStar() {
      [false, true].forEach(flip => {
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = (i/3)*Math.PI*2 + (flip ? Math.PI : -Math.PI/2);
          const x = Math.cos(a)*this.size, y = Math.sin(a)*this.size;
          i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.closePath();
        ctx.stroke();
      });
    }

    drawCircleRunes() {
      ctx.beginPath(); ctx.arc(0,0,this.size,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0,0,this.size*0.55,0,Math.PI*2); ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i/8)*Math.PI*2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a)*this.size*0.55, Math.sin(a)*this.size*0.55);
        ctx.lineTo(Math.cos(a)*this.size,      Math.sin(a)*this.size);
        ctx.stroke();
      }
    }

    drawInkKanji() {
      // Simple abstract kanji-like strokes
      const s = this.size * 0.7;
      ctx.lineWidth = 1.5;
      // Horizontal
      ctx.beginPath(); ctx.moveTo(-s, -s*0.3); ctx.lineTo(s, -s*0.3); ctx.stroke();
      // Vertical
      ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(0, s*0.5); ctx.stroke();
      // Bottom spread
      ctx.beginPath(); ctx.moveTo(-s*0.6, s*0.5); ctx.lineTo(s*0.6, s*0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s*0.6, s*0.5); ctx.lineTo(-s*0.8, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo( s*0.6, s*0.5); ctx.lineTo( s*0.8, s); ctx.stroke();
    }
  }

  // ── Ember Sparks ──────────────────────────────────────────────────
  class Ember {
    constructor() { this.reset(); }
    reset() {
      this.x      = Math.random() * W;
      this.y      = H + 5;
      this.vx     = (Math.random() - 0.5) * 1.5;
      this.vy     = -(Math.random() * 2.5 + 1);
      this.life   = 0;
      this.maxLife= Math.random() * 80 + 30;
      this.size   = Math.random() * 1.8 + 0.4;
      this.color  = Math.random() < 0.5
        ? [255, Math.floor(100+Math.random()*100), 0]
        : [20, 6, 0];
    }
    update() {
      this.life++;
      this.x += this.vx + (Math.random()-0.5)*0.3;
      this.y += this.vy;
      this.vy += 0.03;
      if (this.life >= this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const a = (1 - this.life/this.maxLife) * 0.8;
      const [r,g,b] = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fill();
    }
  }

  // ── Instantiate ───────────────────────────────────────────────────
  // Fire columns along the bottom edge
  const flames = [];
  const FLAME_COLS = 18;
  for (let i = 0; i < FLAME_COLS; i++) {
    const bx = (i / (FLAME_COLS-1)) * W;
    const count = Math.floor(Math.random() * 4 + 3);
    for (let j = 0; j < count; j++) flames.push(new InkFlame(bx));
  }
  // Scattered flames across the whole width
  for (let i = 0; i < 40; i++) {
    flames.push(new InkFlame(Math.random() * W));
  }

  const drips  = Array.from({length: 12}, () => new InkDrip());
  const sigils = Array.from({length: 14}, () => new InkSigil());
  const embers = Array.from({length: 60}, () => new Ember());

  // ── Render loop ───────────────────────────────────────────────────
  function tick() {
    ctx.clearRect(0, 0, W, H);

    // Deep ink vignette
    const vig = ctx.createRadialGradient(W/2, H, 0, W/2, H*0.5, Math.max(W,H));
    vig.addColorStop(0,   'rgba(20,5,0,0)');
    vig.addColorStop(0.5, 'rgba(5,1,0,0.2)');
    vig.addColorStop(1,   'rgba(0,0,0,0.6)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    sigils.forEach(s => { s.update(); s.draw(); });
    drips.forEach(d  => { d.update();  d.draw(); });
    flames.forEach(f => { f.update();  f.draw(); });
    embers.forEach(e => { e.update();  e.draw(); });

    // Bottom fire glow band
    const band = ctx.createLinearGradient(0, H*0.75, 0, H);
    band.addColorStop(0,   'rgba(40,10,0,0)');
    band.addColorStop(0.7, 'rgba(30,8,0,0.15)');
    band.addColorStop(1,   'rgba(60,15,0,0.35)');
    ctx.fillStyle = band;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(tick);
  }
  tick();

  // ── Entrance animation ────────────────────────────────────────────
  window.addEventListener('load', () => {
    const sidebar = document.getElementById('sidebar');
    const main    = document.getElementById('main-content');
    if (!sidebar || !main) return;

    sidebar.style.opacity   = '0';
    sidebar.style.transform = 'translateX(-20px)';
    sidebar.style.transition = 'opacity 0.7s ease, transform 0.7s ease';

    main.style.opacity   = '0';
    main.style.transition = 'opacity 0.9s ease 0.25s';

    requestAnimationFrame(() => requestAnimationFrame(() => {
      sidebar.style.opacity   = '1';
      sidebar.style.transform = 'translateX(0)';
      main.style.opacity      = '1';
    }));
  });

  // ── Nav button ripple ─────────────────────────────────────────────
  document.addEventListener('click', e => {
    const btn = e.target.closest('.nav-btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const rip  = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    rip.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(200,80,0,0.12);border-radius:50%;
      transform:scale(0);animation:navRip 0.5s ease-out forwards;
      pointer-events:none;
    `;
    btn.style.position = 'relative';
    btn.appendChild(rip);
    rip.addEventListener('animationend', () => rip.remove());
  });

  const ripStyle = document.createElement('style');
  ripStyle.textContent = `
    @keyframes navRip {
      from { transform:scale(0); opacity:1; }
      to   { transform:scale(2.5); opacity:0; }
    }
  `;
  document.head.appendChild(ripStyle);

  // ── Resize flames on window resize ───────────────────────────────
  window.addEventListener('resize', () => {
    flames.forEach(f => { f.baseX = Math.random() * W; });
  });

})();
