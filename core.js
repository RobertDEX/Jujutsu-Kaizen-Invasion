/* ══════════════════════════════════════
   CORE.JS — Firebase + Full Logic
   ══════════════════════════════════════ */

const firebaseConfig = {
  apiKey: "AIzaSyC_Kq7meyPrD-3wxddJ7pVpOpD632Y3sak",
  authDomain: "jjk-invasion.firebaseapp.com",
  projectId: "jjk-invasion",
  storageBucket: "jjk-invasion.firebasestorage.app",
  messagingSenderId: "155907111446",
  appId: "1:155907111446:web:33ef57d2c34ad692b65337",
  measurementId: "G-7PZEL4K9DY"
};

firebase.initializeApp(firebaseConfig);
const db   = firebase.firestore();
const COLL = 'techniques';

const ADMIN_PASSWORD = 'RSISS';
let IS_ADMIN = false;

const STATE = {
  techniques:    [],
  currentView:   'unclaimed',
  activeTechId:  null,
  pendingAction: null,
  searchQuery:   '',
  bulkMode:      false,
  bulkSelected:  new Set(),
};

/* ── Seed data ─────────────────────────────────────────────────── */
const DEFAULT_TECHNIQUES = [
  // ── Innate ──────────────────────────────────────────────────────
  { name:'Antigravity System',        category:'Innate',    description:'Counteracts gravitational forces to varying degrees. Kenjaku retains access to this technique even after leaving the original host body.' },
  { name:'Auspicious Beasts Summon',  category:'Innate',    description:'A séance technique activated by hiding the face. Summons four auspicious beast abilities: Kaichi, Reiki, Kirin, and Ryu.' },
  { name:'Black Bird Manipulation',   category:'Innate',    description:'Telepathically controls crows and sees whatever they see. Extension: Bird Strike — commands a crow to self-destruct for a devastating blow.' },
  { name:'Blazing Courage',           category:'Innate',    description:'Coats a katana in scorching cursed flames, imitating the blade\'s cutting ability to simultaneously slash and burn.' },
  { name:'Boogie Woogie',             category:'Innate',    description:'Swaps the positions of two targets carrying cursed energy by clapping. Simple in concept but devastating in tactical application.' },
  { name:'Brain Transplant',          category:'Innate',    description:'Transplants the user\'s brain into another body, gaining the host\'s memories, cursed energy, and innate technique. The basis of Kenjaku\'s millennia-long survival.' },
  { name:'Claw Fingers',              category:'Innate',    description:'Transforms the fingers of the left hand into razor-sharp claws with an unknown additional effect on impact.' },
  { name:'Cloning Technique',         category:'Innate',    description:'Creates up to five clones including the original caster. The user can swap their real body with any clone at any time to evade danger.' },
  { name:'Comedian',                  category:'Innate',    description:'Manifests whatever the user genuinely thinks is funny into reality. Requires absolute confidence in one\'s sense of humor to remain active — losing that belief deactivates it.' },
  { name:'Construction',              category:'Innate',    description:'Creates objects from nothing using immense cursed energy. Mai\'s limit is one extra bullet per day; Yorozu can recreate almost any substance she recognizes.' },
  { name:'Contractual Re-Creation',   category:'Innate',    description:'Manifests real physical objects and services written on contracts or receipts. Extremely versatile depending on the documents available.' },
  { name:'Copy',                      category:'Innate',    description:'Replicates another sorcerer\'s innate technique by having Rika consume a piece of their body. The copied technique becomes permanently accessible.' },
  { name:'Cursed Energy Discharge',   category:'Innate',    description:'Converts enormous cursed energy output into directed blasts fireable at will. Extension: Granite Blast — a concentrated, devastating beam from the user\'s hair.' },
  { name:'Cursed Spirit Manipulation',category:'Innate',    description:'Absorbs and stores defeated cursed spirits. Stored spirits can be deployed in battle or fused via Maximum Technique: Uzumaki.' },
  { name:'Deadly Sentencing',         category:'Innate',    description:'Places the user and a target in a one-on-one courtroom trial via Domain Expansion. A guilty verdict from Judgeman can strip the opponent of their cursed technique entirely.' },
  { name:'Disaster Flames',           category:'Innate',    description:'Manipulation of lava and volcanic fire. Extension: Ember Insects — spawns explosive insects from the volcanic hole on the user\'s head.' },
  { name:'Disaster Plants',           category:'Innate',    description:'Conjures and manipulates cursed plants and wood. Absorbs life force from actual plants since they naturally resist cursed energy.' },
  { name:'Disaster Tides',            category:'Innate',    description:'Summons and controls massive volumes of water, capable of filling entire rooms. Overwhelmingly powerful within the user\'s own Domain.' },
  { name:'Doll Technique',            category:'Innate',    description:'Manipulates a target through a voodoo-style doll. Whatever is done to the doll is mirrored on the victim — most commonly hanging.' },
  { name:'Fist Barrage',              category:'Innate',    description:'Produces several giant cursed energy fists that accompany physical strikes, dealing wide area damage.' },
  { name:'G Warstaff',                category:'Innate',    description:'Conjures a spear with a drawing pen-tip. Cutting a target allows the user to see a vision of their immediate future.' },
  { name:'Hair Airplane',             category:'Innate',    description:'Shapes hair into an airplane form for high-speed flight. Cursed energy concentrates in the head making headbutts devastating, but leaves the body vulnerable.' },
  { name:'Hair Helicopter',           category:'Innate',    description:'Shapes hair into a helicopter rotor for flight, with freely adjustable angle, length, and rotation speed.' },
  { name:'Heart Catch',               category:'Innate',    description:'Creates a virtual floating hand that grabs targets at a distance, then throws or crushes them at will.' },
  { name:'Ice Formation',             category:'Innate',    description:'Produces extreme cold from the body to generate and manipulate large amounts of ice. Extensions: Frost Calm and Icefall.' },
  { name:'Idle Death Gamble',         category:'Innate',    description:'A pachinko-themed technique expressed through Domain Expansion. Hitting the jackpot condition grants near-infinite Reverse Cursed Technique energy, making the user effectively immortal for a period.' },
  { name:'Idle Transfiguration',      category:'Innate',    description:'Directly warps the shape of souls, reshaping the body accordingly. Touching a regular human is usually fatal, twisting them into drone-like Transfigured Humans.' },
  { name:'Immortality',               category:'Innate',    description:'Grants eternal life but does not stop the aging process. Without periodic evolution, the user eventually transcends humanity and becomes a threat to all existence.' },
  { name:'Inverse',                   category:'Innate',    description:'While active, strong attacks become weak and weak attacks become strong — up to a certain ceiling in both directions.' },
  { name:'Love Rendezvous',           category:'Innate',    description:'Assigns five stars in a Southern Cross pattern to targets. Stars must follow a fixed approach order — violating it causes attraction instead of avoidance, creating inescapable movement locks.' },
  { name:'Miracles',                  category:'Innate',    description:'Stores small everyday lucky moments by erasing them from memory. Released when the user\'s life is in danger to dramatically alter their survival odds.' },
  { name:'Mythical Beast Amber',      category:'Innate',    description:'Transforms the body to manifest any electrical phenomenon, surpassing human physical limits. Can only be used once — the body collapses after the technique ends.' },
  { name:'Paralyzing Gaze',           category:'Innate',    description:'Immobilizes anyone the user looks at. If the target breaks through it, severe backlash is dealt to the user\'s own eyes.' },
  { name:'Photography Technique',     category:'Innate',    description:'Manipulates a subject captured by the user\'s phone camera, including changing their location. Extremely draining and its full extent was never fully revealed.' },
  { name:'Prayer Song',               category:'Innate',    description:'Expels curses and augments physical abilities by dancing to a beat etched into the user\'s body. A ritual-based technique tied to their cultural heritage.' },
  { name:'Puppet Manipulation',       category:'Innate',    description:'Remotely controls cursed corpse puppets. The Heavenly Restriction of its original user extends the range across all of Japan.' },
  { name:'Ratio Technique',           category:'Innate',    description:'Divides a target with ten lines and forces a guaranteed weak point at the 7:3 ratio. Can be applied to any part of the body. Extension: Collapse.' },
  { name:'Rot Technique',             category:'Innate',    description:'Manipulates highly corrosive blood. Extension: Decay — spreads a floral decomposition pattern on anyone exposed to the blood, rapidly breaking down the body.' },
  { name:'Scorpion Tail',             category:'Innate',    description:'Controls a scorpion tail-shaped mass of hair, stinging targets with its sharp tip.' },
  { name:'Séance Technique',          category:'Innate',    description:'Summons body or soul information of a deceased person. Allows the user or a participant to shapeshift into that person, including their physical abilities.' },
  { name:'Self-Detonation',           category:'Innate',    description:'Detaches and detonates the user\'s own body parts as explosive bombs, creating large blasts at the cost of personal flesh.' },
  { name:'Shrine',                    category:'Innate',    description:'Two slashing techniques — Dismantle cuts anything indiscriminately from afar; Cleave adjusts its power proportionally to the target\'s cursed energy and toughness.' },
  { name:'Sky Manipulation',          category:'Innate',    description:'Turns empty space and sky into tangible surfaces that can be torn, folded, and weaponized. Extension: Thin Ice Breaker.' },
  { name:'Solo Forbidden Area',       category:'Innate',    description:'Creates a zone that enhances a willing sorcerer\'s cursed energy capacity and output, boosted to 120% when elevated into a full ritual.' },
  { name:'Sound Amplification',       category:'Innate',    description:'Uses the body as an amplification device for an electric guitar, launching the melody as powerful waves of cursed energy.' },
  { name:'Star Rage',                 category:'Innate',    description:'Adds virtual mass to the user\'s body and shikigami, vastly increasing destructive power. Can also set mass to near-zero for instantaneous movement.' },
  { name:'Stone Hands',               category:'Innate',    description:'Creates gigantic stone hands from the earth to clasp and crush targets between their palms.' },
  { name:'Sugar Manipulation',        category:'Innate',    description:'Amplifies blood sugar and converts excess into physical forms like pudding. Can infuse others with it. Causes hypoglycemia in the user upon activation.' },
  { name:'Technique Extinguishment',  category:'Innate',    description:'Nullifies any and all curses — techniques, barriers, cursed objects, cursed spirits, and even incarnations. Extension: Jacob\'s Ladder.' },
  { name:'Tool Manipulation',         category:'Innate',    description:'Telepathically controls a broom for flight and cursed energy wind generation. Extension: Wind Scythe.' },
  { name:'Wound Stasis',              category:'Innate',    description:'Stops wounds from worsening upon application. Cannot heal, but halts bleeding and dulls pain for injuries sustained before activation.' },
  // ── Inherited ───────────────────────────────────────────────────
  { name:'Blood Manipulation',        category:'Inherited', description:'Controls the user\'s own blood — its speed, pressure, and shape — to form blades, bullets, and barriers. Choso wields it at a terrifying level after 150 years of refinement.' },
  { name:'Cursed Speech',             category:'Inherited', description:'Infuses spoken words with cursed energy, compelling targets to obey commands. Stronger commands drain the user more heavily.' },
  { name:'Limitless',                 category:'Inherited', description:'Manipulates space at an atomic level: Infinity (passive barrier), Blue (gravitational attraction), Red (explosive repulsion). Their fusion creates Hollow Purple, which erases everything it touches.' },
  { name:'Projection Sorcery',        category:'Inherited', description:'Divides one second into 24 frames and moves exclusively within that structure. Anyone touched must also comply — failing freezes them solid for a full second.' },
  { name:'Straw Doll Technique',      category:'Inherited', description:'Channels cursed energy through nails and a straw doll to attack targets via effigy. Extensions include Resonance and Hairpin.' },
  { name:'Ten Shadows Technique',     category:'Inherited', description:'Summons up to ten shikigami using shadows as a medium. Destroyed shikigami transfer their power to surviving ones. Includes Divine Dogs, Nue, Toad, and the fearsome Mahoraga.' },
  // ── Barrier ─────────────────────────────────────────────────────
  { name:'Domain Amplification',      category:'Barrier',   description:'Wraps the body in a thin veil of the user\'s domain, automatically nullifying any cursed technique it contacts. Cannot be used simultaneously with the innate technique.' },
  { name:'Domain Expansion',          category:'Barrier',   description:'Manifests the user\'s innate domain within a barrier, guaranteeing all techniques land inside it. The pinnacle of jujutsu sorcery.' },
  { name:'Falling Blossom Emotion',   category:'Barrier',   description:'A secret art of the Big Three Families. Rather than expanding a domain, it counterattacks with cursed energy the instant a domain\'s guaranteed-hit attack makes contact.' },
  { name:'Hollow Wicker Basket',      category:'Barrier',   description:'The predecessor to Simple Domain. A spherical wicker basket barrier that neutralizes an expanded domain\'s guaranteed-hit attack.' },
  { name:'Simple Domain',             category:'Barrier',   description:'Developed in the Heian Era as the "domain for the weak." Expands a small personal domain that neutralizes an enemy\'s can\'t-miss attack by targeting their barrier.' },
];

/* ── Seed ──────────────────────────────────────────────────────── */
async function seedIfEmpty() {
  const sentinel = db.collection('_meta').doc('seeded');
  const snap = await sentinel.get();
  if (snap.exists) return;
  const batch = db.batch();
  DEFAULT_TECHNIQUES.forEach(t => {
    batch.set(db.collection(COLL).doc(), {
      ...t, status:'unclaimed', owner:null, docLink:null,
      reservedBy:null, reserveExpiry:null, claimedAt:null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  });
  batch.set(sentinel, { at: firebase.firestore.FieldValue.serverTimestamp() });
  await batch.commit();
}

/* ── Expiry sweep on boot ──────────────────────────────────────── */
async function sweepExpiredOnBoot() {
  const now  = Date.now();
  const snap = await db.collection(COLL).where('status','==','reserved').get();
  if (snap.empty) return;
  const batch = db.batch();
  let n = 0;
  snap.docs.forEach(doc => {
    const exp = doc.data().reserveExpiry;
    if (exp && exp < now) { batch.update(doc.ref,{status:'unclaimed',reservedBy:null,reserveExpiry:null}); n++; }
  });
  if (n > 0) await batch.commit();
}

/* ── Realtime listener ─────────────────────────────────────────── */
function startListener() {
  db.collection(COLL).orderBy('createdAt').onSnapshot(snap => {
    STATE.techniques = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    checkExpiredReservations();
    renderAll();
  });
}

function checkExpiredReservations() {
  const now = Date.now();
  STATE.techniques.forEach(t => {
    if (t.status==='reserved' && t.reserveExpiry && t.reserveExpiry < now) {
      db.collection(COLL).doc(t.id).update({status:'unclaimed',reservedBy:null,reserveExpiry:null});
      showNotification('"' + t.name + '" reservation expired.','info');
    }
  });
}

/* ── Helpers ───────────────────────────────────────────────────── */
function formatTimer(exp) {
  const d = exp - Date.now();
  if (d<=0) return 'Expired';
  const days=Math.floor(d/86400000), hrs=Math.floor((d%86400000)/3600000),
        mins=Math.floor((d%3600000)/60000), secs=Math.floor((d%60000)/1000);
  if (days>0)  return days+'d '+hrs+'h '+mins+'m';
  if (hrs>0)   return hrs+'h '+mins+'m '+secs+'s';
  if (mins>0)  return mins+'m '+secs+'s';
  return secs+'s';
}

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
}

const CAT_ORDER = ['Innate','Inherited','Barrier','Other'];

function getBadge(cat) {
  return {Innate:'badge-innate',Inherited:'badge-inherited',Barrier:'badge-barrier'}[cat]||'badge-other';
}

function getFiltered(view) {
  let items = STATE.techniques.filter(t => t.status===view);
  if (STATE.searchQuery) {
    const q = STATE.searchQuery.toLowerCase();
    items = items.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.owner&&t.owner.toLowerCase().includes(q))
    );
  }
  return items;
}

function groupBy(items) {
  const g = {};
  CAT_ORDER.forEach(c => g[c]=[]);
  items.forEach(t => { const k=CAT_ORDER.includes(t.category)?t.category:'Other'; g[k].push(t); });
  Object.keys(g).forEach(k => g[k].sort((a,b)=>a.name.localeCompare(b.name)));
  return g;
}

/* ── Admin ─────────────────────────────────────────────────────── */
function setAdmin(val) {
  IS_ADMIN = val;
  document.getElementById('admin-badge').style.display        = val?'flex':'none';
  document.getElementById('sidebar-actions').style.display    = val?'flex':'none';
  document.getElementById('sidebar-login-area').style.display = val?'none':'flex';
  document.getElementById('btn-admin-tab').style.display      = val?'flex':'none';
  if (!val && STATE.currentView==='admin') { STATE.currentView='unclaimed'; setActiveNav('unclaimed'); }
  renderAll();
}

document.getElementById('btn-open-admin-login').addEventListener('click',()=>openModal('modal-admin-login'));

document.getElementById('btn-admin-login-confirm').addEventListener('click',()=>{
  const pw = document.getElementById('admin-password-input').value;
  const err = document.getElementById('admin-login-error');
  if (pw===ADMIN_PASSWORD) {
    err.style.display='none';
    document.getElementById('admin-password-input').value='';
    closeModal('modal-admin-login');
    setAdmin(true);
    showNotification('Admin mode activated.','success');
  } else { err.style.display='block'; }
});
document.getElementById('admin-password-input').addEventListener('keydown',e=>{ if(e.key==='Enter') document.getElementById('btn-admin-login-confirm').click(); });
document.getElementById('btn-admin-logout').addEventListener('click',()=>{ setAdmin(false); showNotification('Logged out.','info'); });

/* ── Render ────────────────────────────────────────────────────── */
function renderAll() {
  updateCounts();
  if (STATE.currentView==='admin') renderAdminPanel();
  else { renderSidebar(); renderGrid(); }
}

function updateCounts() {
  ['unclaimed','claimed','reserved'].forEach(s => {
    document.getElementById('count-'+s).textContent = STATE.techniques.filter(t=>t.status===s).length;
  });
}

function renderSidebar() {
  const list  = document.getElementById('sidebar-list');
  const items = getFiltered(STATE.currentView);
  const groups= groupBy(items);
  list.innerHTML = '';
  CAT_ORDER.forEach(cat => {
    const techs = groups[cat];
    if (!techs||!techs.length) return;
    const hdr = document.createElement('div');
    hdr.className = 'sidebar-category-header';
    hdr.textContent = cat.toUpperCase();
    list.appendChild(hdr);
    techs.forEach(t => {
      const div = document.createElement('div');
      div.className = 'sidebar-item' + (t.id===STATE.activeTechId?' active-item':'');
      div.innerHTML = `<div class="sidebar-item-dot dot-${t.status}"></div>
        <div class="sidebar-item-name">${t.name}</div>
        <div class="sidebar-item-meta">${t.status==='claimed'?'Owner: '+t.owner:t.status==='reserved'?'By: '+t.reservedBy:''}</div>`;
      div.addEventListener('click',()=>openDetail(t.id));
      list.appendChild(div);
    });
  });
}

function renderGrid() {
  const grid  = document.getElementById('technique-grid');
  const empty = document.getElementById('empty-state');
  const items = getFiltered(STATE.currentView);
  const groups= groupBy(items);
  const titleEl= document.getElementById('main-title');
  const subEl  = document.getElementById('main-subtitle');
  const statEl = document.getElementById('stat-num');

  titleEl.className='main-title';
  const map = {
    unclaimed:['Unclaimed Techniques','Techniques awaiting a sorcerer',    'var(--g5)',''],
    claimed:  ['Claimed Techniques',  'Techniques bound to their sorcerers','var(--r6)','title-claimed'],
    reserved: ['Reserved Techniques', 'Pending confirmation',               'var(--gold-bright)','title-reserved'],
  };
  const [title,sub,col,cls] = map[STATE.currentView];
  titleEl.textContent=title; subEl.textContent=sub; statEl.style.color=col;
  if (cls) titleEl.classList.add(cls);
  statEl.textContent = items.length;

  grid.innerHTML='';

  if (!items.length) { grid.style.display='none'; empty.style.display='flex'; return; }
  grid.style.display='grid'; empty.style.display='none';

  // Bulk select bar
  if (IS_ADMIN && STATE.bulkMode) {
    const bar = document.createElement('div');
    bar.className='bulk-bar'; bar.id='bulk-bar';
    bar.innerHTML = `
      <label class="bulk-select-all">
        <input type="checkbox" id="bulk-check-all"> Select All
      </label>
      <span class="bulk-count" id="bulk-count">${STATE.bulkSelected.size} selected</span>
      <div class="bulk-actions">
        <button class="bulk-btn bulk-btn-red" id="bulk-delete-btn">🗑 Delete Selected</button>
      </div>
    `;
    grid.appendChild(bar);

    document.getElementById('bulk-check-all').addEventListener('change', e => {
      items.forEach(t => { if(e.target.checked) STATE.bulkSelected.add(t.id); else STATE.bulkSelected.delete(t.id); });
      renderGrid();
    });
    document.getElementById('bulk-delete-btn').addEventListener('click', bulkDelete);
  }

  let idx=0;
  CAT_ORDER.forEach(cat => {
    const techs = groups[cat];
    if (!techs||!techs.length) return;

    const hdr = document.createElement('div');
    hdr.className='grid-section-header';
    hdr.innerHTML=`<span class="grid-section-title">${cat}</span><span class="grid-section-line"></span>`;
    grid.appendChild(hdr);

    techs.forEach(t => {
      const card = document.createElement('div');
      card.className=`tech-card card-${t.status}`;
      card.style.animationDelay=`${idx*0.028}s`;
      card.dataset.id=t.id; idx++;

      let footerRight = '';
      if (t.status==='claimed')  footerRight=`<span class="card-owner-tag">${t.owner}${t.claimedAt?'<span class="card-claimed-date">'+fmtDate(t.claimedAt)+'</span>':''}</span>`;
      if (t.status==='reserved') footerRight=`<span class="card-timer" data-expiry="${t.reserveExpiry}">⏳ ${formatTimer(t.reserveExpiry)}</span>`;

      const docBadge = t.docLink ? '<span class="card-doc-badge" title="Has OC Document">📄</span>' : '';
      const statusLabel = {unclaimed:'UNCLAIMED',claimed:'CLAIMED',reserved:'RESERVED'}[t.status];

      // Bulk checkbox
      const bulkBox = (IS_ADMIN && STATE.bulkMode)
        ? `<input type="checkbox" class="bulk-checkbox" data-id="${t.id}" ${STATE.bulkSelected.has(t.id)?'checked':''}>`
        : '';

      card.innerHTML=`
        ${bulkBox}
        <div class="card-top">
          <div class="card-name">${t.name}${docBadge}</div>
          <div class="card-badge ${getBadge(t.category)}">${t.category.toUpperCase()}</div>
        </div>
        <div class="card-desc">${t.description}</div>
        <div class="card-footer">
          <div class="card-status status-${t.status}"><span class="status-dot"></span><span>${statusLabel}</span></div>
          ${footerRight}
        </div>`;

      if (IS_ADMIN && STATE.bulkMode) {
        card.querySelector('.bulk-checkbox').addEventListener('change', e => {
          e.stopPropagation();
          if (e.target.checked) STATE.bulkSelected.add(t.id);
          else STATE.bulkSelected.delete(t.id);
          const countEl = document.getElementById('bulk-count');
          if (countEl) countEl.textContent = STATE.bulkSelected.size + ' selected';
        });
      }

      card.addEventListener('click', e => {
        if (e.target.type==='checkbox') return;
        spawnRipple(e);
        openDetail(t.id);
      });
      grid.appendChild(card);
    });
  });
}

/* ── Admin Panel ───────────────────────────────────────────────── */
function renderAdminPanel() {
  const grid  = document.getElementById('technique-grid');
  const empty = document.getElementById('empty-state');
  const titleEl = document.getElementById('main-title');

  titleEl.textContent='Admin Panel'; titleEl.className='main-title title-admin';
  document.getElementById('main-subtitle').textContent='Full control — manage all techniques';
  document.getElementById('stat-num').textContent=STATE.techniques.length;
  document.getElementById('stat-num').style.color='var(--gold-bright)';

  empty.style.display='none'; grid.style.display='grid'; grid.innerHTML='';

  // Bulk toolbar
  const toolbar = document.createElement('div');
  toolbar.className='admin-toolbar';
  toolbar.innerHTML=`
    <span class="admin-toolbar-label">BULK OPERATIONS</span>
    <div class="admin-toolbar-actions">
      <button class="bulk-btn bulk-btn-red" id="admin-bulk-delete">🗑 Delete Selected (${STATE.bulkSelected.size})</button>
      <button class="bulk-btn bulk-btn-clear" id="admin-bulk-clear">✕ Clear Selection</button>
    </div>
  `;
  grid.appendChild(toolbar);

  document.getElementById('admin-bulk-delete').addEventListener('click', bulkDelete);
  document.getElementById('admin-bulk-clear').addEventListener('click',()=>{ STATE.bulkSelected.clear(); renderAll(); });

  const all = [...STATE.techniques].sort((a,b)=>a.name.localeCompare(b.name));

  all.forEach((t,i) => {
    const card = document.createElement('div');
    card.className=`tech-card card-${t.status}`;
    card.style.animationDelay=`${i*0.015}s`;
    const checked = STATE.bulkSelected.has(t.id) ? 'checked' : '';
    const statusLabel={unclaimed:'UNCLAIMED',claimed:'CLAIMED',reserved:'RESERVED'}[t.status];
    let meta='';
    if(t.status==='claimed')  meta='Owner: '+t.owner+(t.claimedAt?' · '+fmtDate(t.claimedAt):'');
    if(t.status==='reserved') meta='Reserved: '+t.reservedBy+' · '+formatTimer(t.reserveExpiry);

    card.innerHTML=`
      <label class="admin-card-select" onclick="event.stopPropagation()">
        <input type="checkbox" class="bulk-checkbox" data-id="${t.id}" ${checked}>
        <span class="admin-check-label"></span>
      </label>
      <div class="card-top">
        <div class="card-name">${t.name}</div>
        <div class="card-badge ${getBadge(t.category)}">${t.category.toUpperCase()}</div>
      </div>
      <div class="card-desc">${t.description}</div>
      <div class="card-footer">
        <div class="card-status status-${t.status}"><span class="status-dot"></span><span>${statusLabel}</span></div>
        <span class="card-owner-tag">${meta}</span>
      </div>
      <div class="admin-card-actions">
        ${t.status==='reserved'?`<button class="admin-btn admin-btn-green" data-id="${t.id}" data-action="accept">✓ Accept</button>`:''}
        ${t.status!=='unclaimed'?`<button class="admin-btn admin-btn-gold" data-id="${t.id}" data-action="release">↩ Release</button>`:''}
        ${t.status==='unclaimed'?`<button class="admin-btn admin-btn-green" data-id="${t.id}" data-action="claim">⚡ Claim</button>`:''}
        <button class="admin-btn admin-btn-red" data-id="${t.id}" data-action="delete">🗑</button>
      </div>`;

    card.querySelector('.bulk-checkbox').addEventListener('change', e => {
      if (e.target.checked) STATE.bulkSelected.add(t.id);
      else STATE.bulkSelected.delete(t.id);
      const btn = document.getElementById('admin-bulk-delete');
      if (btn) btn.textContent = '🗑 Delete Selected (' + STATE.bulkSelected.size + ')';
    });

    card.querySelectorAll('.admin-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const {id,action} = btn.dataset;
        if(action==='delete')  openDeleteModal(id);
        if(action==='release') openReleaseModal(id);
        if(action==='accept')  openAcceptModal(id);
        if(action==='claim')   openClaimModal(id,'claim');
      });
    });
    grid.appendChild(card);
  });
}

/* ── Bulk operations ───────────────────────────────────────────── */
async function bulkDelete() {
  if (!STATE.bulkSelected.size) { showNotification('No techniques selected.','error'); return; }
  if (!confirm('Delete ' + STATE.bulkSelected.size + ' technique(s)? This cannot be undone.')) return;
  const batch = db.batch();
  STATE.bulkSelected.forEach(id => batch.delete(db.collection(COLL).doc(id)));
  await batch.commit();
  showNotification(STATE.bulkSelected.size + ' technique(s) deleted.','info');
  STATE.bulkSelected.clear();
}


/* ── Timer tick ────────────────────────────────────────────────── */
setInterval(()=>{
  const now = Date.now();
  document.querySelectorAll('.card-timer[data-expiry]').forEach(el=>{
    const exp = parseInt(el.dataset.expiry);
    if (exp<=now) {
      const card = el.closest('.tech-card');
      if (card) {
        const t = STATE.techniques.find(x=>x.id===card.dataset.id);
        if (t&&t.status==='reserved')
          db.collection(COLL).doc(t.id).update({status:'unclaimed',reservedBy:null,reserveExpiry:null});
      }
    } else { el.textContent='⏳ '+formatTimer(exp); }
  });
  if (document.getElementById('modal-detail').classList.contains('open')&&STATE.activeTechId) {
    const t = STATE.techniques.find(x=>x.id===STATE.activeTechId);
    if (t&&t.status==='reserved') {
      const el=document.getElementById('detail-reserve-timer');
      if (el) {
        if (t.reserveExpiry<=now) {
          db.collection(COLL).doc(t.id).update({status:'unclaimed',reservedBy:null,reserveExpiry:null});
          closeModal('modal-detail');
        } else { el.textContent=formatTimer(t.reserveExpiry); }
      }
    }
  }
},1000);

/* ── Detail Modal ──────────────────────────────────────────────── */
function openDetail(id) {
  STATE.activeTechId = id;
  const t = STATE.techniques.find(x=>x.id===id);
  if (!t) return;

  document.getElementById('detail-badge').textContent     = t.category.toUpperCase();
  document.getElementById('detail-title').textContent     = t.name;
  document.getElementById('detail-desc').textContent      = t.description;

  const docDiv = document.getElementById('detail-doc-link');
  const docA   = document.getElementById('detail-doc-anchor');
  if (t.docLink) { docA.href=t.docLink; docDiv.style.display='block'; }
  else docDiv.style.display='none';

  const statusEl = document.getElementById('detail-status');
  const ownerEl  = document.getElementById('detail-owner');
  const resInfo  = document.getElementById('detail-reserve-info');
  const actions  = document.getElementById('detail-actions');

  statusEl.className='detail-status status-'+t.status;
  statusEl.textContent=t.status.toUpperCase();

  if (t.status==='claimed') {
    ownerEl.innerHTML='— '+t.owner+(t.claimedAt?'<span class="detail-claimed-date">Claimed '+fmtDate(t.claimedAt)+'</span>':'');
    resInfo.style.display='none';
  } else if (t.status==='reserved') {
    ownerEl.textContent='';
    resInfo.style.display='block';
    document.getElementById('detail-reserve-timer').textContent=formatTimer(t.reserveExpiry);
    document.getElementById('detail-reserve-by').textContent=t.reservedBy;
  } else { ownerEl.textContent=''; resInfo.style.display='none'; }

  actions.innerHTML='';
  if (t.status==='unclaimed') {
    actions.appendChild(makeBtn('btn-action-reserve','◇ Reserve',()=>{closeModal('modal-detail');openClaimModal(id,'reserve');}));
    if (IS_ADMIN) {
      actions.appendChild(makeBtn('btn-action-claim','⚡ Claim',()=>{closeModal('modal-detail');openClaimModal(id,'claim');}));
      actions.appendChild(makeBtn('btn-action-delete','🗑 Delete',()=>{closeModal('modal-detail');openDeleteModal(id);}));
    }
  } else if (t.status==='reserved') {
    if (IS_ADMIN) {
      actions.appendChild(makeBtn('btn-action-accept','✓ Accept → Claim',()=>{closeModal('modal-detail');openAcceptModal(id);}));
      actions.appendChild(makeBtn('btn-action-release','✗ Deny',()=>{closeModal('modal-detail');openReleaseModal(id);}));
      actions.appendChild(makeBtn('btn-action-delete','🗑 Delete',()=>{closeModal('modal-detail');openDeleteModal(id);}));
    } else {
      const p=document.createElement('p');
      p.style.cssText='font-size:0.8rem;color:var(--tx3);font-style:italic;';
      p.textContent='Awaiting admin confirmation.';
      actions.appendChild(p);
    }
  } else if (t.status==='claimed' && IS_ADMIN) {
    actions.appendChild(makeBtn('btn-action-release','↩ Release',()=>{closeModal('modal-detail');openReleaseModal(id);}));
    actions.appendChild(makeBtn('btn-action-delete','🗑 Delete',()=>{closeModal('modal-detail');openDeleteModal(id);}));
  }

  renderSidebar();
  openModal('modal-detail');
}

function makeBtn(cls, label, fn) {
  const b=document.createElement('button');
  b.className=cls; b.textContent=label;
  b.addEventListener('click',fn);
  return b;
}

/* ── Claim / Reserve ───────────────────────────────────────────── */
function openClaimModal(id,mode) {
  STATE.pendingAction={id,mode};
  const t=STATE.techniques.find(x=>x.id===id);
  const res=mode==='reserve';
  document.getElementById('claim-modal-title').textContent = res?'Reserve Technique':'Claim Technique';
  document.getElementById('claim-modal-desc').textContent  = (res?'Reserving':'Claiming')+': "'+t.name+'"'+(res?' — reservation lasts 2 weeks.':'');
  document.getElementById('claim-label').textContent       = res?'Your Name':'Owner Name';
  document.getElementById('reserve-duration-group').style.display='none';
  document.getElementById('claim-doc-group').style.display = res?'none':'flex';
  document.getElementById('claim-name-input').value='';
  document.getElementById('claim-doc-input').value='';
  openModal('modal-claim');
}

document.getElementById('btn-claim-confirm').addEventListener('click', async()=>{
  const name=document.getElementById('claim-name-input').value.trim();
  if(!name){showNotification('Please enter a name.','error');return;}
  const {id,mode}=STATE.pendingAction;
  const t=STATE.techniques.find(x=>x.id===id);
  if (mode==='claim') {
    const docLink=document.getElementById('claim-doc-input').value.trim()||null;
    await db.collection(COLL).doc(id).update({status:'claimed',owner:name,docLink,reservedBy:null,reserveExpiry:null,claimedAt:Date.now()});
    showNotification('"'+t.name+'" claimed by '+name+'!','success');
  } else {
    await db.collection(COLL).doc(id).update({status:'reserved',reservedBy:name,reserveExpiry:Date.now()+14*24*60*60*1000,owner:null,docLink:null});
    showNotification('"'+t.name+'" reserved by '+name+' for 2 weeks.','info');
  }
  closeModal('modal-claim');
});

/* ── Accept ────────────────────────────────────────────────────── */
function openAcceptModal(id) {
  STATE.pendingAction={id};
  const t=STATE.techniques.find(x=>x.id===id);
  document.getElementById('accept-desc').textContent='Accepting "'+t.name+'" for '+t.reservedBy+'. Please provide their OC document link.';
  document.getElementById('accept-doc-input').value='';
  document.getElementById('accept-doc-error').style.display='none';
  openModal('modal-accept');
}
document.getElementById('btn-accept-confirm').addEventListener('click',async()=>{
  const doc=document.getElementById('accept-doc-input').value.trim();
  const err=document.getElementById('accept-doc-error');
  if(!doc){err.style.display='block';return;}
  err.style.display='none';
  const {id}=STATE.pendingAction;
  const t=STATE.techniques.find(x=>x.id===id);
  await db.collection(COLL).doc(id).update({status:'claimed',owner:t.reservedBy,docLink:doc,reservedBy:null,reserveExpiry:null,claimedAt:Date.now()});
  showNotification('"'+t.name+'" claimed by '+t.reservedBy+'!','success');
  closeModal('modal-accept');
});

/* ── Release ───────────────────────────────────────────────────── */
function openReleaseModal(id) {
  STATE.pendingAction={id};
  const t=STATE.techniques.find(x=>x.id===id);
  document.getElementById('release-desc').textContent='Release "'+t.name+'" back to unclaimed?';
  openModal('modal-release');
}
document.getElementById('btn-release-confirm').addEventListener('click',async()=>{
  const {id}=STATE.pendingAction;
  const t=STATE.techniques.find(x=>x.id===id);
  await db.collection(COLL).doc(id).update({status:'unclaimed',owner:null,docLink:null,reservedBy:null,reserveExpiry:null,claimedAt:null});
  showNotification('"'+t.name+'" released.','info');
  closeModal('modal-release');
});

/* ── Delete ────────────────────────────────────────────────────── */
function openDeleteModal(id) {
  STATE.pendingAction={id};
  const t=STATE.techniques.find(x=>x.id===id);
  document.getElementById('delete-desc').textContent='Delete "'+t.name+'" permanently?';
  openModal('modal-delete');
}
document.getElementById('btn-delete-confirm').addEventListener('click',async()=>{
  const {id}=STATE.pendingAction;
  const t=STATE.techniques.find(x=>x.id===id);
  await db.collection(COLL).doc(id).delete();
  showNotification('"'+t.name+'" deleted.','info');
  closeModal('modal-delete');
  STATE.activeTechId=null;
});

/* ── Add technique ─────────────────────────────────────────────── */
document.getElementById('open-add-modal').addEventListener('click',()=>openModal('modal-add'));
document.getElementById('btn-add-confirm').addEventListener('click',async()=>{
  const name   =document.getElementById('add-name').value.trim();
  const desc   =document.getElementById('add-desc').value.trim();
  const cat    =document.getElementById('add-category').value;
  const owner  =document.getElementById('add-owner').value.trim();
  const docLink=document.getElementById('add-doc-link').value.trim()||null;
  if(!name){showNotification('Name required.','error');return;}
  if(!desc){showNotification('Description required.','error');return;}
  await db.collection(COLL).add({
    name,description:desc,category:cat,
    status:owner?'claimed':'unclaimed',
    owner:owner||null,docLink,
    reservedBy:null,reserveExpiry:null,
    claimedAt:owner?Date.now():null,
    createdAt:firebase.firestore.FieldValue.serverTimestamp(),
  });
  ['add-name','add-desc','add-owner','add-doc-link'].forEach(id=>document.getElementById(id).value='');
  closeModal('modal-add');
  showNotification('"'+name+'" registered!','success');
});

/* ── Navigation ────────────────────────────────────────────────── */
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    STATE.currentView=btn.dataset.view;
    STATE.activeTechId=null;
    STATE.bulkSelected.clear();
    setActiveNav(STATE.currentView);
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-backdrop').classList.remove('open');
    renderAll();
  });
});

function setActiveNav(view) {
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const btn=document.querySelector('.nav-btn[data-view="'+view+'"]');
  if(btn) btn.classList.add('active');
}

/* ── Mobile sidebar ────────────────────────────────────────────── */
document.getElementById('mobile-nav-toggle').addEventListener('click',()=>{
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-backdrop').classList.toggle('open');
});
document.getElementById('sidebar-backdrop').addEventListener('click',()=>{
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('open');
});

/* ── Search ────────────────────────────────────────────────────── */
document.getElementById('sidebar-search-input').addEventListener('input',e=>{
  STATE.searchQuery=e.target.value.trim();
  renderAll();
});

/* ── Bulk mode toggle (admin) ──────────────────────────────────── */
document.getElementById('btn-bulk-mode').addEventListener('click',()=>{
  STATE.bulkMode=!STATE.bulkMode;
  STATE.bulkSelected.clear();
  document.getElementById('btn-bulk-mode').textContent=STATE.bulkMode?'✕ Exit Bulk':'☰ Bulk Select';
  renderAll();
});

/* ── Modal helpers ─────────────────────────────────────────────── */
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)closeModal(o.id);}));

/* ── Notifications ─────────────────────────────────────────────── */
function showNotification(msg,type='success') {
  const ex=document.querySelector('.notification');
  if(ex)ex.remove();
  const el=document.createElement('div');
  el.className='notification '+type; el.textContent=msg;
  document.body.appendChild(el);
  setTimeout(()=>{el.classList.add('notif-out');el.addEventListener('animationend',()=>el.remove());},3000);
}

/* ── Ripple ────────────────────────────────────────────────────── */
function spawnRipple(e) {
  const r=document.createElement('div'); r.className='ripple';
  const s=60;
  r.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-s/2}px;top:${e.clientY-s/2}px`;
  document.getElementById('ripple-overlay').appendChild(r);
  r.addEventListener('animationend',()=>r.remove());
}

/* ── Boot ──────────────────────────────────────────────────────── */
async function boot() {
  try {
    await seedIfEmpty();
    await sweepExpiredOnBoot();
    startListener();
    const ls=document.getElementById('loading-screen');
    ls.style.opacity='0';
    setTimeout(()=>{
      ls.style.display='none';
      document.getElementById('app-shell').style.display='flex';
    },700);
  } catch(err) {
    console.error('Boot error:',err);
    document.querySelector('.loading-text').textContent='CONNECTION FAILED — CHECK FIREBASE RULES';
  }
}
boot();
