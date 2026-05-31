/* ══════════════════════════════════════
   CORE.JS — Firebase Firestore + Logic
   ══════════════════════════════════════ */

// ── Firebase Config ───────────────────────────────────────────────────────────
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
const db = firebase.firestore();
const COLL = 'techniques';

// ── Admin ─────────────────────────────────────────────────────────────────────
// Change this password to whatever you want
const ADMIN_PASSWORD = 'invasion2025';
let IS_ADMIN = false;

// ── State ─────────────────────────────────────────────────────────────────────
const STATE = {
  techniques: [],       // live mirror of Firestore
  currentView: 'unclaimed',
  activeTechId: null,
  pendingAction: null,
  searchQuery: '',
};

// ── Default seed data ─────────────────────────────────────────────────────────
const DEFAULT_TECHNIQUES = [
  // Barrier
  { name: 'Domain Amplification',       category: 'Barrier',   description: 'Envelops the user in a thin veil of their domain\'s energy, automatically nullifying any cursed technique it contacts. Cannot be used simultaneously with the user\'s innate technique.' },
  { name: 'Falling Blossom Emotion',    category: 'Barrier',   description: 'A secret art of the Big Three Sorcerer Families. Rather than expanding a domain, it counterattacks with cursed energy the instant a domain\'s guaranteed-hit attack makes contact.' },
  { name: 'Hollow Wicker Basket',       category: 'Barrier',   description: 'Predecessor to Simple Domain. Erects a spherical wicker basket barrier that neutralizes an expanded domain\'s barrier to nullify its can\'t-miss attack.' },
  { name: 'Simple Domain',              category: 'Barrier',   description: 'Developed during the Heian Era as the "domain for the weak." Expands a small personal domain that neutralizes an enemy\'s can\'t-miss attack by targeting their domain barrier.' },
  // Extension
  { name: 'Bird Strike',                category: 'Extension', description: 'Commands a crow to self-destruct by exceeding its cursed energy limit. The crow hurls itself at the target for a devastating, sacrifice-powered blow.' },
  { name: 'Collapse',                   category: 'Extension', description: 'Expands the effective critical-hit zone of the Ratio Technique to cover a wide area, rather than a single forced weak point.' },
  { name: 'Cursed Technique Lapse: Blue', category: 'Extension', description: 'Amplifies the Limitless to generate powerful gravitational attraction by bringing the concept of "natural negative numbers" into reality.' },
  { name: 'Decay',                      category: 'Extension', description: 'Spreads a floral decomposition pattern on anyone exposed to the user\'s corrosive blood. The mark rapidly breaks down the target\'s body.' },
  { name: 'Granite Blast',              category: 'Extension', description: 'Releases a concentrated beam of cursed energy with incredible destructive power from the user\'s hair, focused to a singular devastating point.' },
  { name: 'Hollow Technique: Purple',   category: 'Extension', description: 'A secret technique merging the convergence and divergence of infinities to produce imaginary mass. The resulting blast destroys everything it collides with absolutely.' },
  { name: "Jacob's Ladder",             category: 'Extension', description: 'Conjures a four-winged trumpet and a massive magic array in the sky. A pillar of divine light descends to extinguish any curse it touches, including special-grade cursed objects.' },
  { name: 'Piercing Blood',             category: 'Extension', description: 'Fires a beam of compressed blood at the speed of sound, launched from a Convergence blood orb. One of the fastest techniques in the series.' },
  { name: 'Soul Multiplicity',          category: 'Extension', description: 'Merges two or more souls together, causing a rejection reaction. The resulting energy is weaponized in further extension techniques.' },
  // Inherited
  { name: 'Blood Manipulation',         category: 'Inherited', description: 'Controls the user\'s own blood — its speed, pressure, and shape — to form blades, bullets, barriers, and more. Choso wields it at a terrifying level after 150 years of refinement.' },
  { name: 'Cursed Speech',              category: 'Inherited', description: 'Infuses spoken words with cursed energy, compelling targets to obey commands such as "explode," "stop," or "sleep." Stronger commands drain the user more heavily.' },
  { name: 'Limitless',                  category: 'Inherited', description: 'Manipulates space at an atomic level through three states: Infinity (passive barrier), Blue (gravitational attraction), and Red (explosive repulsion). The fusion of both creates Hollow Purple.' },
  { name: 'Projection Sorcery',         category: 'Inherited', description: 'Divides one second of time into 24 frames and moves exclusively within that structure. Anyone touched must also comply — failing freezes them solid for a full second.' },
  { name: 'Straw Doll Technique',       category: 'Inherited', description: 'Channels cursed energy through nails and a straw doll to attack targets from range or damage them via effigy. Extensions include Resonance and Hairpin.' },
  { name: 'Ten Shadows Technique',      category: 'Inherited', description: 'Summons up to ten powerful shikigami using shadows as a medium, including Divine Dogs, Nue, and the fearsome Mahoraga. Destroyed shikigami transfer their power to surviving ones.' },
  // Innate
  { name: 'Antigravity System',         category: 'Innate',    description: 'Counteracts gravitational forces to varying degrees. Kenjaku retains access to this technique even without the original user\'s body.' },
  { name: 'Auspicious Beasts Summon',   category: 'Innate',    description: 'A séance technique activated by hiding the face. Allows summoning and use of four auspicious beast abilities: Kaichi, Reiki, Kirin, and Ryu.' },
  { name: 'Black Bird Manipulation',    category: 'Innate',    description: 'Telepathically controls crows and sees whatever they see. Extension: Bird Strike — commands a crow to self-destruct for a devastating hit.' },
  { name: 'Blazing Courage',            category: 'Innate',    description: 'Coats a katana in scorching cursed flames, even imitating the blade\'s cutting ability to slice and burn simultaneously.' },
  { name: 'Boogie Woogie',              category: 'Innate',    description: 'By clapping his hands, the user instantly swaps positions of two targets carrying cursed energy. Simple in concept but devastating in tactical application.' },
  { name: 'Brain Transplant',           category: 'Innate',    description: 'Transplants the user\'s brain into another person\'s body, gaining access to the host\'s memories, innate technique, and cursed energy.' },
  { name: 'Cloning Technique',          category: 'Innate',    description: 'Creates up to five clones including the original caster. The user can swap their real body with any clone at any time to avoid danger.' },
  { name: 'Comedian',                   category: 'Innate',    description: 'Manifests whatever the user genuinely thinks is funny into reality. Requires absolute confidence in one\'s comedic ability to remain active.' },
  { name: 'Construction',               category: 'Innate',    description: 'Creates objects from nothing using immense cursed energy. Mai\'s limit is one extra bullet per day; Yorozu can recreate almost any substance she recognizes.' },
  { name: 'Contractual Re-Creation',    category: 'Innate',    description: 'Manifests real, physical objects and services written on contracts or receipts. Extremely versatile depending on the documents available to the user.' },
  { name: 'Copy',                       category: 'Innate',    description: 'Replicates another sorcerer\'s innate technique by having Rika consume part of their body. The copied technique becomes permanently accessible.' },
  { name: 'Cursed Energy Discharge',    category: 'Innate',    description: 'Converts enormous cursed energy output into directed blasts fireable at will. Extension: Granite Blast — a concentrated devastatingly powerful beam from the user\'s hair.' },
  { name: 'Cursed Spirit Manipulation', category: 'Innate',    description: 'After defeating a cursed spirit, the user absorbs and stores it. Stored spirits can be deployed in battle or fused together via Maximum Technique: Uzumaki.' },
  { name: 'Deadly Sentencing',          category: 'Innate',    description: 'Places the user and target in a one-on-one courtroom trial via Domain Expansion. A guilty verdict from Judgeman can strip the opponent of their cursed technique entirely.' },
  { name: 'Disaster Flames',            category: 'Innate',    description: 'Manipulation of lava and fire based on volcanic disasters. Extension: Ember Insects — spawns explosive insects from the volcanic hole on the user\'s head.' },
  { name: 'Disaster Plants',            category: 'Innate',    description: 'Conjures and manipulates cursed plants and wood. Absorbs the life force from actual plants since they naturally resist cursed energy.' },
  { name: 'Disaster Tides',             category: 'Innate',    description: 'Summons and manipulates massive volumes of water. Can fill entire rooms and inhale it all back to consume targets. Overwhelmingly powerful within its own Domain.' },
  { name: 'Doll Technique',             category: 'Innate',    description: 'Manipulates a target through a doll. Whatever is done to the doll is reflected on the target — the most common method being hanging them with a rope.' },
  { name: 'G Warstaff',                 category: 'Innate',    description: 'Conjures a spear-type cursed tool with a drawing pen-tip. Cutting a target with it allows the user to see into their future.' },
  { name: 'Heart Catch',                category: 'Innate',    description: 'Creates a virtual floating hand that grabs targets at a distance, then throws or crushes them against obstacles at will.' },
  { name: 'Ice Formation',              category: 'Innate',    description: 'Produces extreme cold from the body to generate and manipulate large amounts of ice at will. Extensions: Frost Calm and Icefall.' },
  { name: 'Idle Death Gamble',          category: 'Innate',    description: 'A pachinko-themed technique primarily expressed through Domain Expansion. Hitting the jackpot grants near-infinite Reverse Cursed Technique energy, making the user effectively immortal.' },
  { name: 'Idle Transfiguration',       category: 'Innate',    description: 'Directly warps the shape of souls, reshaping the body accordingly. Touching a regular human is usually fatal, twisting them into drone-like Transfigured Humans.' },
  { name: 'Immortality',                category: 'Innate',    description: 'Grants eternal life but does not stop the aging process. Without periodic evolution, the user will transcend humanity and become a threat to all of existence.' },
  { name: 'Inverse',                    category: 'Innate',    description: 'While active, strong attacks become weaker and weak attacks become stronger. There is an upper and lower limit to how much damage the technique can affect.' },
  { name: 'Love Rendezvous',            category: 'Innate',    description: 'Assigns five stars in a Southern Cross pattern to targets. Stars must follow a fixed approach order — violating it causes attraction instead of avoidance.' },
  { name: 'Miracles',                   category: 'Innate',    description: 'Stores small everyday miracles by erasing them from memory. Released when the user\'s life is in danger, altering their luck to survive fatal blows.' },
  { name: 'Mythical Beast Amber',       category: 'Innate',    description: 'Transforms the body to manifest any electrical phenomena. Surpasses human physical limits — but can only be used once before the body collapses.' },
  { name: 'Photography Technique',      category: 'Innate',    description: 'Manipulates a photographed subject captured via phone camera — including changing their location. Highly draining and its full extent was never fully revealed.' },
  { name: 'Prayer Song',                category: 'Innate',    description: 'Expels curses and augments physical abilities by dancing to a beat etched into the user\'s body. A ritual-based technique tied deeply to the user\'s cultural heritage.' },
  { name: 'Puppet Manipulation',        category: 'Innate',    description: 'Remotely controls cursed corpse puppets. The Heavenly Restriction of its user extends the range across all of Japan, enabling control of Ultimate Mechamaru.' },
  { name: 'Ratio Technique',            category: 'Innate',    description: 'Divides a target with ten lines and forces a guaranteed weak point at the 7:3 ratio. Can be applied to any part of the body. Extension: Collapse.' },
  { name: 'Rot Technique',              category: 'Innate',    description: 'Manipulates the user\'s own highly corrosive blood. The extension technique Decay spreads a floral pattern on anyone exposed to their blood, rapidly decomposing the body.' },
  { name: 'Séance Technique',           category: 'Innate',    description: 'Summons body or soul information of a deceased person using their corpse. Allows the user or a willing participant to shapeshift into that person.' },
  { name: 'Self-Detonation',            category: 'Innate',    description: 'Detaches and detonates the user\'s own body parts as explosive bombs, creating large blasts.' },
  { name: 'Shrine',                     category: 'Innate',    description: 'Two slashing techniques — Dismantle cuts targets from afar instantly; Cleave adjusts its power proportionally to the opponent\'s cursed energy and toughness.' },
  { name: 'Sky Manipulation',           category: 'Innate',    description: 'Turns empty space and sky into tangible surfaces that can be torn, folded, and weaponized. Extension: Thin Ice Breaker.' },
  { name: 'Solo Forbidden Area',        category: 'Innate',    description: 'Creates a zone that enhances a willing sorcerer\'s cursed energy capacity and output. Potency is boosted to 120% when elevated into a full ritual.' },
  { name: 'Sound Amplification',        category: 'Innate',    description: 'Uses the body as a sound amplification device for an electric guitar, launching the melody as powerful waves of cursed energy.' },
  { name: 'Star Rage',                  category: 'Innate',    description: 'Adds virtual mass to the user\'s body and shikigami, drastically increasing destructive power. Can also set mass to near-zero for instantaneous movement.' },
  { name: 'Sugar Manipulation',         category: 'Innate',    description: 'Amplifies blood sugar levels and converts excess sugar into physical forms such as pudding. Causes hypoglycemia in the user upon activation.' },
  { name: 'Technique Extinguishment',   category: 'Innate',    description: 'Nullifies any and all curses — techniques, barriers, cursed objects, cursed spirits, and even incarnations. Extension: Jacob\'s Ladder.' },
  { name: 'Tool Manipulation',          category: 'Innate',    description: 'Telepathically controls a broom, enabling flight and generation of powerful gusts of cursed energy wind. Extension: Wind Scythe.' },
  { name: 'Wound Stasis',               category: 'Innate',    description: 'Stops wounds from worsening upon application. Cannot heal, but halts bleeding and dulls pain for injuries received before activation.' },
];

// ── Seed Firestore on first run ───────────────────────────────────────────────
async function seedIfEmpty() {
  const snap = await db.collection(COLL).limit(1).get();
  if (!snap.empty) return;
  const batch = db.batch();
  DEFAULT_TECHNIQUES.forEach(t => {
    const ref = db.collection(COLL).doc();
    batch.set(ref, {
      name: t.name,
      category: t.category,
      description: t.description,
      status: 'unclaimed',
      owner: null,
      docLink: null,
      reservedBy: null,
      reserveExpiry: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();
}

// ── Real-time listener ────────────────────────────────────────────────────────
function startListener() {
  db.collection(COLL).orderBy('createdAt').onSnapshot(snap => {
    STATE.techniques = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    checkExpiredReservations();
    renderAll();
  });
}

// ── Reserve expiry ────────────────────────────────────────────────────────────

// Runs on every Firestore snapshot — catches expiries while the page is open
function checkExpiredReservations() {
  const now = Date.now();
  STATE.techniques.forEach(t => {
    if (t.status === 'reserved' && t.reserveExpiry && t.reserveExpiry < now) {
      db.collection(COLL).doc(t.id).update({
        status: 'unclaimed', reservedBy: null, reserveExpiry: null
      });
      showNotification('Reservation for "' + t.name + '" expired.', 'info');
    }
  });
}

// Queries Firestore directly on boot — catches anything that expired while
// the site had zero visitors open. Runs once, before the live listener starts.
async function sweepExpiredOnBoot() {
  const now = Date.now();
  const snap = await db.collection(COLL).where('status', '==', 'reserved').get();
  if (snap.empty) return;
  const batch = db.batch();
  let count = 0;
  snap.docs.forEach(doc => {
    const expiry = doc.data().reserveExpiry;
    if (expiry && expiry < now) {
      batch.update(doc.ref, { status: 'unclaimed', reservedBy: null, reserveExpiry: null });
      count++;
    }
  });
  if (count > 0) {
    await batch.commit();
    console.log('Swept ' + count + ' expired reservation(s) on boot.');
  }
}

function formatTimeRemaining(expiry) {
  const diff = expiry - Date.now();
  if (diff <= 0) return 'Expired';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDuration(mins) {
  if (mins < 60) return `${mins} min`;
  if (mins < 1440) return `${mins / 60}h`;
  return `${mins / 1440}d`;
}

// ── Category order & helpers ──────────────────────────────────────────────────
const CATEGORY_ORDER = ['Innate', 'Inherited', 'Extension', 'Barrier', 'Other'];

function getBadgeClass(cat) {
  const map = { Innate: 'badge-innate', Inherited: 'badge-inherited', Extension: 'badge-extension', Barrier: 'badge-barrier' };
  return map[cat] || 'badge-other';
}

function getFiltered(view) {
  let items = STATE.techniques.filter(t => t.status === view);
  if (STATE.searchQuery) {
    const q = STATE.searchQuery.toLowerCase();
    items = items.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.owner && t.owner.toLowerCase().includes(q))
    );
  }
  return items;
}

function groupByCategory(items) {
  const groups = {};
  CATEGORY_ORDER.forEach(c => { groups[c] = []; });
  items.forEach(t => {
    const key = CATEGORY_ORDER.includes(t.category) ? t.category : 'Other';
    groups[key].push(t);
  });
  // Sort each group alphabetically
  Object.keys(groups).forEach(k => groups[k].sort((a, b) => a.name.localeCompare(b.name)));
  return groups;
}

// ── Admin ─────────────────────────────────────────────────────────────────────
function setAdminMode(val) {
  IS_ADMIN = val;
  document.getElementById('admin-badge').style.display        = val ? 'flex' : 'none';
  document.getElementById('sidebar-actions').style.display    = val ? 'flex' : 'none';
  document.getElementById('sidebar-login-area').style.display = val ? 'none' : 'flex';
  document.getElementById('btn-admin-tab').style.display      = val ? 'flex' : 'none';
  if (!val && STATE.currentView === 'admin') {
    STATE.currentView = 'unclaimed';
    setActiveNavBtn('unclaimed');
  }
  renderAll();
}

document.getElementById('btn-open-admin-login').addEventListener('click', () => openModal('modal-admin-login'));

document.getElementById('btn-admin-login-confirm').addEventListener('click', () => {
  const pw = document.getElementById('admin-password-input').value;
  const errEl = document.getElementById('admin-login-error');
  if (pw === ADMIN_PASSWORD) {
    errEl.style.display = 'none';
    document.getElementById('admin-password-input').value = '';
    closeModal('modal-admin-login');
    setAdminMode(true);
    showNotification('Admin mode activated.', 'success');
  } else {
    errEl.style.display = 'block';
  }
});

document.getElementById('admin-password-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('btn-admin-login-confirm').click();
});

document.getElementById('btn-admin-logout').addEventListener('click', () => {
  setAdminMode(false);
  showNotification('Logged out of admin mode.', 'info');
});

// ── Rendering ─────────────────────────────────────────────────────────────────
function renderAll() {
  updateCounts();
  if (STATE.currentView === 'admin') {
    renderAdminPanel();
  } else {
    renderSidebarList();
    renderMainGrid();
  }
}

function updateCounts() {
  document.getElementById('count-unclaimed').textContent = STATE.techniques.filter(t => t.status === 'unclaimed').length;
  document.getElementById('count-claimed').textContent   = STATE.techniques.filter(t => t.status === 'claimed').length;
  document.getElementById('count-reserved').textContent  = STATE.techniques.filter(t => t.status === 'reserved').length;
}

function renderSidebarList() {
  if (STATE.currentView === 'admin') return;
  const list = document.getElementById('sidebar-list');
  const items = getFiltered(STATE.currentView);
  const groups = groupByCategory(items);
  list.innerHTML = '';

  CATEGORY_ORDER.forEach(cat => {
    const techs = groups[cat];
    if (!techs || techs.length === 0) return;

    const header = document.createElement('div');
    header.className = 'sidebar-category-header';
    header.textContent = cat.toUpperCase();
    list.appendChild(header);

    techs.forEach(t => {
      const div = document.createElement('div');
      div.className = 'sidebar-item';
      if (t.id === STATE.activeTechId) div.classList.add('active-item');
      div.innerHTML = `
        <div class="sidebar-item-dot dot-${t.status}"></div>
        <div class="sidebar-item-name">${t.name}</div>
        <div class="sidebar-item-meta">${t.status === 'claimed' ? `Owner: ${t.owner}` : t.status === 'reserved' ? `By: ${t.reservedBy}` : ''}</div>
      `;
      div.addEventListener('click', () => openDetail(t.id));
      list.appendChild(div);
    });
  });
}

function renderMainGrid() {
  if (STATE.currentView === 'admin') return;
  const grid   = document.getElementById('technique-grid');
  const empty  = document.getElementById('empty-state');
  const items  = getFiltered(STATE.currentView);
  const groups = groupByCategory(items);

  const titleEl    = document.getElementById('main-title');
  const subtitleEl = document.getElementById('main-subtitle');
  const statNum    = document.getElementById('stat-num');

  titleEl.className = 'main-title';
  if (STATE.currentView === 'unclaimed') {
    titleEl.textContent = 'Unclaimed Techniques';
    subtitleEl.textContent = 'Techniques awaiting a sorcerer';
    statNum.style.color = 'var(--green)';
  } else if (STATE.currentView === 'claimed') {
    titleEl.textContent = 'Claimed Techniques';
    titleEl.classList.add('title-claimed');
    subtitleEl.textContent = 'Techniques bound to their sorcerers';
    statNum.style.color = 'var(--red-bright)';
  } else {
    titleEl.textContent = 'Reserved Techniques';
    titleEl.classList.add('title-reserved');
    subtitleEl.textContent = 'Pending confirmation — time is running out';
    statNum.style.color = 'var(--gold)';
  }
  statNum.textContent = items.length;

  grid.innerHTML = '';

  if (items.length === 0) {
    grid.style.display = 'none';
    empty.style.display = 'flex';
    return;
  }
  grid.style.display = 'grid';
  empty.style.display = 'none';

  let cardIndex = 0;
  CATEGORY_ORDER.forEach(cat => {
    const techs = groups[cat];
    if (!techs || techs.length === 0) return;

    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'grid-section-header';
    sectionHeader.innerHTML = `<span class="grid-section-title">${cat}</span><span class="grid-section-line"></span>`;
    grid.appendChild(sectionHeader);

    techs.forEach(t => {
      const card = document.createElement('div');
      card.className = `tech-card card-${t.status}`;
      card.style.animationDelay = `${cardIndex * 0.03}s`;
      card.dataset.id = t.id;
      cardIndex++;

      let footerRight = '';
      if (t.status === 'claimed')  footerRight = `<span class="card-owner-tag">${t.owner}</span>`;
      if (t.status === 'reserved') footerRight = `<span class="card-timer" data-expiry="${t.reserveExpiry}">⏳ ${formatTimeRemaining(t.reserveExpiry)}</span>`;

      const docBadge = t.docLink ? `<span class="card-doc-badge" title="Has OC Document">📄</span>` : '';
      const statusLabel = { unclaimed: 'UNCLAIMED', claimed: 'CLAIMED', reserved: 'RESERVED' }[t.status];

      card.innerHTML = `
        <div class="card-top">
          <div class="card-name">${t.name} ${docBadge}</div>
          <div class="card-badge ${getBadgeClass(t.category)}">${t.category.toUpperCase()}</div>
        </div>
        <div class="card-desc">${t.description}</div>
        <div class="card-footer">
          <div class="card-status status-${t.status}">
            <span class="status-dot"></span>
            <span>${statusLabel}</span>
          </div>
          ${footerRight}
        </div>
      `;
      card.addEventListener('click', e => { spawnRipple(e); openDetail(t.id); });
      grid.appendChild(card);
    });
  });
}

// ── Admin Panel ───────────────────────────────────────────────────────────────
function renderAdminPanel() {
  const grid  = document.getElementById('technique-grid');
  const empty = document.getElementById('empty-state');
  document.getElementById('main-title').textContent = 'Admin Panel';
  document.getElementById('main-title').className = 'main-title title-admin';
  document.getElementById('main-subtitle').textContent = 'Full control over all techniques';
  document.getElementById('stat-num').textContent = STATE.techniques.length;
  document.getElementById('stat-num').style.color = 'var(--gold)';

  empty.style.display = 'none';
  grid.style.display  = 'grid';
  grid.innerHTML = '';

  const all = [...STATE.techniques].sort((a, b) => a.name.localeCompare(b.name));
  all.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = `tech-card card-${t.status}`;
    card.style.animationDelay = `${i * 0.02}s`;

    const statusLabel = { unclaimed: 'UNCLAIMED', claimed: 'CLAIMED', reserved: 'RESERVED' }[t.status];
    let metaLine = '';
    if (t.status === 'claimed')  metaLine = `Owner: ${t.owner}`;
    if (t.status === 'reserved') metaLine = `Reserved: ${t.reservedBy} · ${formatTimeRemaining(t.reserveExpiry)}`;

    card.innerHTML = `
      <div class="card-top">
        <div class="card-name">${t.name}</div>
        <div class="card-badge ${getBadgeClass(t.category)}">${t.category.toUpperCase()}</div>
      </div>
      <div class="card-desc">${t.description}</div>
      <div class="card-footer">
        <div class="card-status status-${t.status}"><span class="status-dot"></span><span>${statusLabel}</span></div>
        <span class="card-owner-tag">${metaLine}</span>
      </div>
      <div class="admin-card-actions">
        ${t.status === 'reserved' ? `<button class="admin-btn admin-btn-green" data-id="${t.id}" data-action="accept">✓ Accept</button>` : ''}
        ${t.status !== 'unclaimed' ? `<button class="admin-btn admin-btn-gold" data-id="${t.id}" data-action="release">↩ Release</button>` : ''}
        ${t.status === 'unclaimed' ? `<button class="admin-btn admin-btn-green" data-id="${t.id}" data-action="claim">⚡ Claim</button>` : ''}
        <button class="admin-btn admin-btn-red" data-id="${t.id}" data-action="delete">🗑 Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.admin-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id     = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === 'delete')  openDeleteModal(id);
      if (action === 'release') openReleaseModal(id);
      if (action === 'accept')  openAcceptModal(id);
      if (action === 'claim')   openClaimModal(id, 'claim');
    });
  });
}

// ── Live reserve timer ticks ──────────────────────────────────────────────────
setInterval(() => {
  const now = Date.now();

  // Update all visible countdown timers
  document.querySelectorAll('.card-timer[data-expiry]').forEach(el => {
    const expiry = parseInt(el.dataset.expiry);
    if (expiry <= now) {
      // Timer just hit zero — write back to Firestore immediately
      const card = el.closest('.tech-card');
      if (card) {
        const id = card.dataset.id;
        const t = STATE.techniques.find(x => x.id === id);
        if (t && t.status === 'reserved') {
          db.collection(COLL).doc(id).update({
            status: 'unclaimed', reservedBy: null, reserveExpiry: null
          });
        }
      }
    } else {
      el.textContent = '⏳ ' + formatTimeRemaining(expiry);
    }
  });

  // Update timer in the detail modal if open on a reserved tech
  if (document.getElementById('modal-detail').classList.contains('open') && STATE.activeTechId) {
    const t = STATE.techniques.find(x => x.id === STATE.activeTechId);
    if (t && t.status === 'reserved') {
      const el = document.getElementById('detail-reserve-timer');
      if (el) {
        if (t.reserveExpiry <= now) {
          db.collection(COLL).doc(t.id).update({
            status: 'unclaimed', reservedBy: null, reserveExpiry: null
          });
          document.getElementById('modal-detail').classList.remove('open');
        } else {
          el.textContent = formatTimeRemaining(t.reserveExpiry);
        }
      }
    }
  }
}, 1000);

// ── Detail Modal ──────────────────────────────────────────────────────────────
function openDetail(id) {
  STATE.activeTechId = id;
  const t = STATE.techniques.find(x => x.id === id);
  if (!t) return;

  document.getElementById('detail-badge').textContent = t.category.toUpperCase();
  document.getElementById('detail-title').textContent = t.name;
  document.getElementById('detail-desc').textContent  = t.description;

  // OC doc link
  const docDiv    = document.getElementById('detail-doc-link');
  const docAnchor = document.getElementById('detail-doc-anchor');
  if (t.docLink) {
    docAnchor.href = t.docLink;
    docDiv.style.display = 'block';
  } else {
    docDiv.style.display = 'none';
  }

  const statusEl      = document.getElementById('detail-status');
  const ownerEl       = document.getElementById('detail-owner');
  const reserveInfo   = document.getElementById('detail-reserve-info');
  const actionsDiv    = document.getElementById('detail-actions');

  statusEl.className  = `detail-status status-${t.status}`;
  statusEl.textContent = t.status.toUpperCase();
  ownerEl.textContent = t.status === 'claimed' ? `— ${t.owner}` : '';

  if (t.status === 'reserved') {
    reserveInfo.style.display = 'block';
    document.getElementById('detail-reserve-timer').textContent = formatTimeRemaining(t.reserveExpiry);
    document.getElementById('detail-reserve-by').textContent    = t.reservedBy;
  } else {
    reserveInfo.style.display = 'none';
  }

  // Build action buttons based on role
  actionsDiv.innerHTML = '';

  if (t.status === 'unclaimed') {
    // Everyone can reserve
    const btnReserve = makeActionBtn('btn-action-reserve', '◇ Reserve', () => { closeModal('modal-detail'); openClaimModal(t.id, 'reserve'); });
    actionsDiv.appendChild(btnReserve);
    // Admins can also directly claim or delete
    if (IS_ADMIN) {
      actionsDiv.appendChild(makeActionBtn('btn-action-claim',   '⚡ Claim',   () => { closeModal('modal-detail'); openClaimModal(t.id, 'claim'); }));
      actionsDiv.appendChild(makeActionBtn('btn-action-delete',  '🗑 Delete',  () => { closeModal('modal-detail'); openDeleteModal(t.id); }));
    }
  } else if (t.status === 'reserved') {
    if (IS_ADMIN) {
      actionsDiv.appendChild(makeActionBtn('btn-action-accept',  '✓ Accept → Claim', () => { closeModal('modal-detail'); openAcceptModal(t.id); }));
      actionsDiv.appendChild(makeActionBtn('btn-action-release', '✗ Deny',           () => { closeModal('modal-detail'); openReleaseModal(t.id); }));
      actionsDiv.appendChild(makeActionBtn('btn-action-delete',  '🗑 Delete',        () => { closeModal('modal-detail'); openDeleteModal(t.id); }));
    } else {
      const info = document.createElement('p');
      info.style.cssText = 'font-size:0.8rem;color:var(--text-muted);font-style:italic;';
      info.textContent = 'Awaiting admin confirmation.';
      actionsDiv.appendChild(info);
    }
  } else if (t.status === 'claimed') {
    if (IS_ADMIN) {
      actionsDiv.appendChild(makeActionBtn('btn-action-release', '↩ Release',  () => { closeModal('modal-detail'); openReleaseModal(t.id); }));
      actionsDiv.appendChild(makeActionBtn('btn-action-delete',  '🗑 Delete',  () => { closeModal('modal-detail'); openDeleteModal(t.id); }));
    }
  }

  renderSidebarList();
  openModal('modal-detail');
}

function makeActionBtn(className, label, handler) {
  const btn = document.createElement('button');
  btn.className = className;
  btn.textContent = label;
  btn.addEventListener('click', handler);
  return btn;
}

// ── Claim / Reserve ───────────────────────────────────────────────────────────
function openClaimModal(id, mode) {
  STATE.pendingAction = { id, mode };
  const t = STATE.techniques.find(x => x.id === id);
  const isDur = mode === 'reserve';

  document.getElementById('claim-modal-title').textContent   = isDur ? 'Reserve Technique' : 'Claim Technique';
  document.getElementById('claim-modal-desc').textContent    = `${isDur ? 'Reserving' : 'Claiming'}: "${t.name}"`;
  document.getElementById('claim-label').textContent         = isDur ? 'Your Name' : 'Owner Name';
  document.getElementById('reserve-duration-group').style.display = isDur ? 'flex' : 'none';
  document.getElementById('claim-doc-group').style.display   = isDur ? 'none' : 'flex';
  document.getElementById('claim-name-input').value = '';
  document.getElementById('claim-doc-input').value  = '';
  openModal('modal-claim');
}

document.getElementById('btn-claim-confirm').addEventListener('click', async () => {
  const name = document.getElementById('claim-name-input').value.trim();
  if (!name) { showNotification('Please enter a name.', 'error'); return; }
  const { id, mode } = STATE.pendingAction;
  const t = STATE.techniques.find(x => x.id === id);

  if (mode === 'claim') {
    const docLink = document.getElementById('claim-doc-input').value.trim() || null;
    await db.collection(COLL).doc(id).update({ status: 'claimed', owner: name, docLink, reservedBy: null, reserveExpiry: null });
    showNotification(`"${t.name}" claimed by ${name}!`, 'success');
  } else {
    const mins = parseInt(document.getElementById('reserve-duration').value);
    await db.collection(COLL).doc(id).update({
      status: 'reserved', reservedBy: name,
      reserveExpiry: Date.now() + mins * 60000,
      owner: null, docLink: null,
    });
    showNotification(`"${t.name}" reserved by ${name} for ${formatDuration(mins)}.`, 'info');
  }
  closeModal('modal-claim');
});

// ── Accept ────────────────────────────────────────────────────────────────────
function openAcceptModal(id) {
  STATE.pendingAction = { id };
  const t = STATE.techniques.find(x => x.id === id);
  document.getElementById('accept-desc').textContent = `Accepting "${t.name}" for ${t.reservedBy}. Please provide their OC document link below.`;
  document.getElementById('accept-doc-input').value = '';
  document.getElementById('accept-doc-error').style.display = 'none';
  openModal('modal-accept');
}

document.getElementById('btn-accept-confirm').addEventListener('click', async () => {
  const docLink = document.getElementById('accept-doc-input').value.trim();
  const errEl   = document.getElementById('accept-doc-error');
  if (!docLink) { errEl.style.display = 'block'; return; }
  errEl.style.display = 'none';
  const { id } = STATE.pendingAction;
  const t = STATE.techniques.find(x => x.id === id);
  await db.collection(COLL).doc(id).update({ status: 'claimed', owner: t.reservedBy, docLink, reservedBy: null, reserveExpiry: null });
  showNotification(`"${t.name}" is now claimed by ${t.reservedBy}!`, 'success');
  closeModal('modal-accept');
});

// ── Release ───────────────────────────────────────────────────────────────────
function openReleaseModal(id) {
  STATE.pendingAction = { id };
  const t = STATE.techniques.find(x => x.id === id);
  document.getElementById('release-desc').textContent = `Release "${t.name}" back to unclaimed?`;
  openModal('modal-release');
}

document.getElementById('btn-release-confirm').addEventListener('click', async () => {
  const { id } = STATE.pendingAction;
  const t = STATE.techniques.find(x => x.id === id);
  await db.collection(COLL).doc(id).update({ status: 'unclaimed', owner: null, docLink: null, reservedBy: null, reserveExpiry: null });
  showNotification(`"${t.name}" released.`, 'info');
  closeModal('modal-release');
});

// ── Delete ────────────────────────────────────────────────────────────────────
function openDeleteModal(id) {
  STATE.pendingAction = { id };
  const t = STATE.techniques.find(x => x.id === id);
  document.getElementById('delete-desc').textContent = `Delete "${t.name}" permanently?`;
  openModal('modal-delete');
}

document.getElementById('btn-delete-confirm').addEventListener('click', async () => {
  const { id } = STATE.pendingAction;
  const t = STATE.techniques.find(x => x.id === id);
  await db.collection(COLL).doc(id).delete();
  showNotification(`"${t.name}" deleted.`, 'info');
  closeModal('modal-delete');
  STATE.activeTechId = null;
});

// ── Add Technique ─────────────────────────────────────────────────────────────
document.getElementById('open-add-modal').addEventListener('click', () => openModal('modal-add'));

document.getElementById('btn-add-confirm').addEventListener('click', async () => {
  const name    = document.getElementById('add-name').value.trim();
  const desc    = document.getElementById('add-desc').value.trim();
  const cat     = document.getElementById('add-category').value;
  const owner   = document.getElementById('add-owner').value.trim();
  const docLink = document.getElementById('add-doc-link').value.trim() || null;

  if (!name) { showNotification('Technique name is required.', 'error'); return; }
  if (!desc) { showNotification('Description is required.', 'error'); return; }

  await db.collection(COLL).add({
    name, description: desc, category: cat,
    status: owner ? 'claimed' : 'unclaimed',
    owner: owner || null, docLink,
    reservedBy: null, reserveExpiry: null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  ['add-name','add-desc','add-owner','add-doc-link'].forEach(id => document.getElementById(id).value = '');
  closeModal('modal-add');
  showNotification(`"${name}" registered!`, 'success');
});

// ── Navigation ────────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    STATE.currentView  = btn.dataset.view;
    STATE.activeTechId = null;
    setActiveNavBtn(STATE.currentView);
    if (STATE.currentView === 'admin') {
      renderAdminPanel();
    } else {
      renderAll();
    }
  });
});

function setActiveNavBtn(view) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.nav-btn[data-view="${view}"]`);
  if (btn) btn.classList.add('active');
}

// ── Search ────────────────────────────────────────────────────────────────────
document.getElementById('sidebar-search-input').addEventListener('input', e => {
  STATE.searchQuery = e.target.value.trim();
  renderAll();
});

// ── Modal helpers ─────────────────────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); });
});

// ── Notifications ─────────────────────────────────────────────────────────────
function showNotification(msg, type = 'success') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.classList.add('notif-out'); el.addEventListener('animationend', () => el.remove()); }, 3000);
}

// ── Ripple ────────────────────────────────────────────────────────────────────
function spawnRipple(e) {
  const r = document.createElement('div');
  r.className = 'ripple';
  const s = 60;
  r.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - s/2}px;top:${e.clientY - s/2}px`;
  document.getElementById('ripple-overlay').appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

// ── Boot ──────────────────────────────────────────────────────────────────────
async function boot() {
  try {
    await seedIfEmpty();
    await sweepExpiredOnBoot();
    startListener();
    document.getElementById('loading-screen').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('loading-screen').style.display = 'none';
      document.getElementById('app-shell').style.display = 'flex';
    }, 600);
  } catch (err) {
    console.error('Firebase boot error:', err);
    document.querySelector('.loading-text').textContent = 'CONNECTION FAILED — CHECK FIREBASE RULES';
  }
}

boot();
