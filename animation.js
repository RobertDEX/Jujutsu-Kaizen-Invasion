/* ══════════════════════════════════════
   ANIMATION.JS — Red Ink Fire Background
   ══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Red fire color stops — dark ink outline bleeding into deep crimson
  const FIRE_COLORS = [
    [4,  0,  0],    // near-black ink
    [18, 2,  2],    // deep void red
    [45, 5,  5],    // dark ember
    [90, 10, 10],   // coal red
    [150,18, 18],   // low fire
    [200,28, 28],   // mid fire
    [230,50, 30],   // bright fire
    [255,80, 20],   // hot tip
  ];

  class InkFlame {
    constructor(baseX) {
      this.baseX = baseX;
      this.reset(true);
    }
    reset(initial = false) {
      this.x         = this.baseX + (Math.random() - 0.5) * 50;
      this.y         = initial ? H * 0.6 + Math.random() * H * 0.4 : H + 10;
      this.vy        = -(Math.random() * 1.4 + 0.3);
      this.vx        = (Math.random() - 0.5) * 0.3;
      this.life      = 0;
      this.maxLife   = Math.random() * 200 + 80;
      this.size      = Math.random() * 22 + 6;
      this.wobble    = Math.random() * Math.PI * 2;
      this.wobbleSpd = Math.random() * 0.07 + 0.02;
      // Bias toward dark ink colors (low index)
      this.colIdx    = Math.floor(Math.pow(Math.random(), 1.5) * FIRE_COLORS.length);
    }
    update() {
      this.life++;
      this.wobble += this.wobbleSpd;
      this.x  += this.vx + Math.sin(this.wobble) * 0.45;
      this.y  += this.vy;
      this.vy -= 0.006;
      this.size *= 0.992;
      if (this.life >= this.maxLife || this.y < -60 || this.size < 1) this.reset();
    }
    draw() {
      const p = this.life / this.maxLife;
      let a = p < 0.15 ? p / 0.15 : p > 0.65 ? 1 - (p - 0.65) / 0.35 : 1;
      a *= 0.45;
      const [r, g, b] = FIRE_COLORS[this.colIdx];

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(0.65, 1);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      grad.addColorStop(0,   `rgba(${r},${g},${b},${a})`);
      grad.addColorStop(0.5, `rgba(${Math.max(r-20,0)},0,0,${a * 0.55})`);
      grad.addColorStop(1,   'rgba(0,0,0,0)');

      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo( this.size*0.7, -this.size*0.3,  this.size*0.7,  this.size*0.45, 0,  this.size*0.55);
      ctx.bezierCurveTo(-this.size*0.7,  this.size*0.45, -this.size*0.7, -this.size*0.3, 0, -this.size);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }
  }

  class Ember {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = H + 5;
      this.vx   = (Math.random() - 0.5) * 1.8;
      this.vy   = -(Math.random() * 3 + 0.8);
      this.life = 0;
      this.max  = Math.random() * 90 + 30;
      this.sz   = Math.random() * 2 + 0.3;
      this.red  = Math.random() < 0.6;
    }
    update() {
      this.life++;
      this.x += this.vx + (Math.random()-0.5)*0.4;
      this.y += this.vy;
      this.vy += 0.04;
      if (this.life >= this.max || this.y < -10) this.reset();
    }
    draw() {
      const a = (1 - this.life/this.max) * 0.75;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.sz, 0, Math.PI*2);
      ctx.fillStyle = this.red
        ? `rgba(220,30,10,${a})`
        : `rgba(8,2,2,${a * 0.8})`;
      ctx.fill();
    }
  }

  // Floating ink sigils
  class Sigil {
    constructor() { this.reset(true); }
    reset(initial=false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 80;
      this.sz   = Math.random() * 40 + 18;
      this.rot  = Math.random() * Math.PI * 2;
      this.rspd = (Math.random()-0.5)*0.003;
      this.vy   = -(Math.random()*0.18+0.04);
      this.life = 0; this.max = Math.random()*600+300;
      this.type = Math.floor(Math.random()*3);
      this.red  = Math.random() < 0.35;
    }
    get alpha() {
      const p = this.life/this.max;
      if (p<0.1) return p/0.1*0.1;
      if (p>0.8) return (1-(p-0.8)/0.2)*0.1;
      return 0.1;
    }
    update() {
      this.life++; this.y += this.vy; this.rot += this.rspd;
      if (this.life>=this.max || this.y<-100) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;
      ctx.strokeStyle = this.red ? 'rgba(180,20,20,1)' : 'rgba(12,3,3,1)';
      ctx.lineWidth = 0.9;
      if (this.type===0) this.drawHex();
      else if (this.type===1) this.drawTriStar();
      else this.drawCircle();
      ctx.restore();
    }
    drawHex() {
      [1, 0.55].forEach(scale => {
        ctx.beginPath();
        for (let i=0;i<6;i++) {
          const a=(i/6)*Math.PI*2-Math.PI/6;
          i===0?ctx.moveTo(Math.cos(a)*this.sz*scale,Math.sin(a)*this.sz*scale)
               :ctx.lineTo(Math.cos(a)*this.sz*scale,Math.sin(a)*this.sz*scale);
        }
        ctx.closePath(); ctx.stroke();
      });
    }
    drawTriStar() {
      [false,true].forEach(flip=>{
        ctx.beginPath();
        for(let i=0;i<3;i++){
          const a=(i/3)*Math.PI*2+(flip?Math.PI:-Math.PI/2);
          i===0?ctx.moveTo(Math.cos(a)*this.sz,Math.sin(a)*this.sz)
               :ctx.lineTo(Math.cos(a)*this.sz,Math.sin(a)*this.sz);
        }
        ctx.closePath(); ctx.stroke();
      });
    }
    drawCircle() {
      ctx.beginPath(); ctx.arc(0,0,this.sz,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0,0,this.sz*0.5,0,Math.PI*2); ctx.stroke();
      for(let i=0;i<6;i++){
        const a=(i/6)*Math.PI*2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a)*this.sz*0.5,Math.sin(a)*this.sz*0.5);
        ctx.lineTo(Math.cos(a)*this.sz,Math.sin(a)*this.sz);
        ctx.stroke();
      }
    }
  }

  // Init
  const flames = [];
  const COLS = 22;
  for (let i=0;i<COLS;i++) {
    const bx = (i/(COLS-1))*W;
    for (let j=0;j<5;j++) flames.push(new InkFlame(bx));
  }
  for (let i=0;i<30;i++) flames.push(new InkFlame(Math.random()*W));

  const embers = Array.from({length:80}, ()=>new Ember());
  const sigils = Array.from({length:16}, ()=>new Sigil());

  function tick() {
    ctx.clearRect(0,0,W,H);

    // Dark vignette from edges
    const v = ctx.createRadialGradient(W/2,H,0,W/2,H*0.45,Math.max(W,H)*0.9);
    v.addColorStop(0,'rgba(15,2,2,0)');
    v.addColorStop(0.6,'rgba(5,0,0,0.15)');
    v.addColorStop(1,'rgba(0,0,0,0.65)');
    ctx.fillStyle=v; ctx.fillRect(0,0,W,H);

    sigils.forEach(s=>{s.update();s.draw();});
    flames.forEach(f=>{f.update();f.draw();});
    embers.forEach(e=>{e.update();e.draw();});

    // Red glow band at bottom
    const band = ctx.createLinearGradient(0,H*0.7,0,H);
    band.addColorStop(0,'rgba(60,5,5,0)');
    band.addColorStop(0.7,'rgba(40,4,4,0.12)');
    band.addColorStop(1,'rgba(80,8,8,0.3)');
    ctx.fillStyle=band; ctx.fillRect(0,0,W,H);

    requestAnimationFrame(tick);
  }
  tick();

  // Entrance
  window.addEventListener('load',()=>{
    const sb = document.getElementById('sidebar');
    const mc = document.getElementById('main-content');
    if(!sb||!mc) return;
    sb.style.cssText += 'opacity:0;transform:translateX(-18px);transition:opacity 0.65s ease,transform 0.65s ease;';
    mc.style.cssText += 'opacity:0;transition:opacity 0.85s ease 0.2s;';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      sb.style.opacity='1'; sb.style.transform='translateX(0)'; mc.style.opacity='1';
    }));
  });

  // Nav ripple
  document.addEventListener('click', e=>{
    const btn = e.target.closest('.nav-btn');
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const rip = document.createElement('span');
    const size = Math.max(rect.width,rect.height);
    rip.style.cssText=`position:absolute;width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;background:rgba(180,20,20,0.12);border-radius:50%;transform:scale(0);animation:navRip 0.5s ease-out forwards;pointer-events:none;`;
    btn.style.position='relative'; btn.appendChild(rip);
    rip.addEventListener('animationend',()=>rip.remove());
  });

  const st=document.createElement('style');
  st.textContent='@keyframes navRip{from{transform:scale(0);opacity:1}to{transform:scale(2.5);opacity:0}}';
  document.head.appendChild(st);

  window.addEventListener('resize',()=>{
    flames.forEach(f=>{ f.baseX=Math.random()*W; });
  });
})();
