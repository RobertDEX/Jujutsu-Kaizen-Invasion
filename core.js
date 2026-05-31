/* ══════════════════════════════════════
   CORE.JS — Data, State, Logic
   ══════════════════════════════════════ */

// ── Default Techniques Data ─────────────────────────────────────────────────
const DEFAULT_TECHNIQUES = [
  // Innate Techniques
  { id: 't001', name: 'Limitless', category: 'Inherited', description: 'Manipulates space at an atomic level through three states: Infinity (passive barrier slowing anything to a halt), Blue (gravitational attraction), and Red (explosive repulsion). The secret fusion of both creates Hollow Purple, erasing everything in its path.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't002', name: 'Shrine (Cleave & Dismantle)', category: 'Innate', description: 'Two slashing techniques — Dismantle cuts targets from afar instantly; Cleave adjusts its power proportionally to the opponent\'s cursed energy and toughness. The ultimate expression is the domain Malevolent Shrine.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't003', name: 'Ten Shadows Technique', category: 'Inherited', description: 'Summons up to ten powerful shikigami using shadows as a medium, including Divine Dogs, Nue, and the fearsome Mahoraga. Destroyed shikigami transfer their power to surviving ones.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't004', name: 'Idle Transfiguration', category: 'Innate', description: 'Directly warps the shape of souls, reshaping the body accordingly. Touching a regular human is usually fatal, twisting them into drone-like Transfigured Humans. One of the most philosophically terrifying techniques in the series.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't005', name: 'Blood Manipulation', category: 'Inherited', description: 'Controls the user\'s own blood — its speed, pressure, and shape — to form blades, bullets, barriers, and more. Choso wields it at a terrifying level after 150 years of refinement.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't006', name: 'Cursed Spirit Manipulation', category: 'Innate', description: 'After defeating a cursed spirit, the user absorbs and stores it. Stored spirits can be deployed in battle or fused together via the Maximum Technique: Uzumaki.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't007', name: 'Straw Doll Technique', category: 'Inherited', description: 'Channels cursed energy through nails and a straw doll to attack targets from range or damage them via effigy. Extensions include Resonance and Hairpin.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't008', name: 'Cursed Speech', category: 'Inherited', description: 'Infuses spoken words with cursed energy, compelling targets to obey commands such as "explode," "stop," or "sleep." Stronger commands drain the user more heavily.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't009', name: 'Boogie Woogie', category: 'Innate', description: 'By clapping his hands, the user instantly swaps positions of two targets carrying cursed energy. Simple in concept but devastating in tactical application.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't010', name: 'Ratio Technique', category: 'Innate', description: 'Divides a target with ten lines and forces a guaranteed weak point at the 7:3 ratio. Can be applied to any part of the body. Extension: Collapse.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't011', name: 'Copy', category: 'Innate', description: 'Replicates another sorcerer\'s innate technique by having Rika consume part of their body. The copied technique becomes permanently accessible.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't012', name: 'Puppet Manipulation', category: 'Innate', description: 'Remotely controls cursed corpse puppets. The Heavenly Restriction of its user extends the range across all of Japan, enabling control of Ultimate Mechamaru.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't013', name: 'Immortality', category: 'Innate', description: 'Grants eternal life but does not stop the aging process. Without periodic evolution, the user will transcend humanity and become a threat to all of existence.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't014', name: 'Rot Technique', category: 'Innate', description: 'Manipulates the user\'s own highly corrosive blood. The extension technique Decay spreads a floral pattern on anyone exposed to their blood, rapidly decomposing the body.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't015', name: 'Tool Manipulation', category: 'Innate', description: 'Telepathically controls a broom, enabling flight and generation of powerful gusts of cursed energy wind. Extension: Wind Scythe.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't016', name: 'Construction', category: 'Innate', description: 'Creates objects from nothing using immense cursed energy. Mai\'s limit is one extra bullet per day; Yorozu can recreate almost any substance she recognizes.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't017', name: 'Black Bird Manipulation', category: 'Innate', description: 'Telepathically controls crows and sees whatever they see. Extension: Bird Strike — commands a crow to self-destruct, exceeding its cursed energy limit for a devastating hit.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't018', name: 'Disaster Tides', category: 'Innate', description: 'Summons and manipulates massive volumes of water. Can fill entire rooms and inhale it all back to consume targets. Overwhelmingly powerful within its own Domain.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't019', name: 'Disaster Flames', category: 'Innate', description: 'Manipulation of lava and fire based on volcanic disasters. Extension: Ember Insects — spawns explosive insects from the volcanic hole on the user\'s head.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't020', name: 'Disaster Plants', category: 'Innate', description: 'Conjures and manipulates cursed plants and wood. Absorbs the life force from actual plants since they naturally resist cursed energy.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't021', name: 'Ice Formation', category: 'Innate', description: 'Produces extreme cold from the body to generate and manipulate large amounts of ice at will. Extensions: Frost Calm and Icefall.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't022', name: 'Star Rage', category: 'Innate', description: 'Adds virtual mass to the user\'s body and shikigami, drastically increasing destructive power. Can also set mass to near-zero for instantaneous movement.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't023', name: 'Sky Manipulation', category: 'Innate', description: 'Turns empty space and sky into tangible surfaces that can be torn, folded, and weaponized. Distorts anything caught within without physically harming them. Extension: Thin Ice Breaker.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't024', name: 'Cursed Energy Discharge', category: 'Innate', description: 'Converts enormous cursed energy output into directed blasts fireble at will. Extension: Granite Blast — a concentrated, devastatingly powerful beam from the user\'s hair.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't025', name: 'Comedian', category: 'Innate', description: 'Manifests whatever the user genuinely thinks is funny into reality. Requires absolute confidence in one\'s comedic ability to remain active — losing that confidence deactivates it.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't026', name: 'Technique Extinguishment', category: 'Innate', description: 'Nullifies any and all curses — techniques, barriers, cursed objects, cursed spirits, and even incarnations. Extension: Jacob\'s Ladder, a pillar of light that extinguishes everything it touches.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't027', name: 'Deadly Sentencing', category: 'Innate', description: 'Places the user and target in a one-on-one courtroom trial via Domain Expansion. A guilty verdict from Judgeman can strip the opponent of their cursed technique entirely.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't028', name: 'Mythical Beast Amber', category: 'Innate', description: 'Transforms the body to manifest any electrical phenomena, converting cursed energy to electricity. Surpasses human physical limits — but can only be used once before the body collapses.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't029', name: 'Idle Death Gamble', category: 'Innate', description: 'A pachinko-themed technique primarily expressed through Domain Expansion. Hitting the jackpot condition grants near-infinite Reverse Cursed Technique energy, making the user effectively immortal for a period.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't030', name: 'Contractual Re-Creation', category: 'Innate', description: 'Manifests real, physical objects and services written on contracts or receipts. Extremely versatile depending on the documents available to the user.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't031', name: 'Solo Forbidden Area', category: 'Innate', description: 'Creates a zone that enhances a willing sorcerer\'s cursed energy capacity and output. Potency is boosted to 120% when elevated into a full ritual using incantations, hand signs, dance, and music.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't032', name: 'Photography Technique', category: 'Innate', description: 'Manipulates a photographed subject captured via phone camera — including changing their location. Highly draining and its full extent was never fully revealed.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't033', name: 'Doll Technique', category: 'Innate', description: 'Manipulates a target through a doll. Whatever is done to the doll is reflected on the target — the most common method being hanging them with a rope.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't034', name: 'Miracles', category: 'Innate', description: 'Stores small everyday miracles by erasing them from memory. Represented by lines under the eyes, they are released when the user\'s life is in danger, altering their luck to survive fatal blows.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't035', name: 'Wound Stasis', category: 'Innate', description: 'Stops wounds from worsening upon application. Cannot heal like Reverse Cursed Technique, but halts bleeding and dulls pain for injuries received before activation.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't036', name: 'Auspicious Beasts Summon', category: 'Innate', description: 'A séance technique activated by hiding the face. Allows summoning and use of four auspicious beast abilities: Kaichi, Reiki, Kirin, and Ryu.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't037', name: 'Inverse', category: 'Innate', description: 'While active, strong attacks become weaker and weak attacks become stronger. There is an upper and lower limit to how much damage the technique can affect.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't038', name: 'Séance Technique', category: 'Innate', description: 'Summons body or soul information of a deceased person using their corpse. Allows the user or a willing participant to shapeshift into that person, including their physical abilities.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't039', name: 'Cloning Technique', category: 'Innate', description: 'Creates up to five clones including the original caster. The user can swap their real body with any clone at any time to avoid danger.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't040', name: 'Brain Transplant', category: 'Innate', description: 'Transplants the user\'s brain into another person\'s body, gaining access to the host\'s memories, innate technique, and cursed energy. The basis of Kenjaku\'s millennia-spanning survival.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't041', name: 'Love Rendezvous', category: 'Innate', description: 'Assigns five stars in a Southern Cross pattern to targets. Stars must follow a fixed approach order — violating it causes attraction instead of avoidance, creating inescapable movement locks.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't042', name: 'Heart Catch', category: 'Innate', description: 'Creates a virtual floating hand that grabs targets at a distance, then throws or crushes them against obstacles at will.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't043', name: 'G Warstaff', category: 'Innate', description: 'Conjures a spear-type cursed tool with a drawing pen-tip. Cutting a target with it allows the user to see into their future.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't044', name: 'Antigravity System', category: 'Innate', description: 'Counteracts gravitational forces to varying degrees. Kenjaku retains access to this technique even without the original user\'s body.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't045', name: 'Prayer Song', category: 'Innate', description: 'Expels curses and augments physical abilities by dancing to a beat etched into the user\'s body. A ritual-based technique tied deeply to the user\'s cultural heritage.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't046', name: 'Sugar Manipulation', category: 'Innate', description: 'Amplifies blood sugar levels and converts excess sugar into physical forms such as pudding. Can also infuse others with the sugar. Causes hypoglycemia in the user upon activation.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't047', name: 'Self-Detonation', category: 'Innate', description: 'Detaches and detonates the user\'s own body parts as explosive bombs, creating large blasts. A brutal technique that sacrifices the user\'s own flesh as ammunition.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't048', name: 'Sound Amplification', category: 'Innate', description: 'Uses the body as a sound amplification device for an electric guitar, launching the melody as powerful waves of cursed energy.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't049', name: 'Blazing Courage', category: 'Innate', description: 'Coats a katana in scorching cursed flames, even imitating the blade\'s cutting ability to slice and burn simultaneously.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't050', name: 'Projection Sorcery', category: 'Inherited', description: 'Divides one second of time into 24 frames and moves exclusively within that structure. Anyone touched must also comply — failing to move within the 24-frame limit freezes them solid for a full second.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  // Extension Techniques
  { id: 't051', name: 'Resonance', category: 'Extension', description: 'Applies cursed energy via straw doll effigy using a severed piece of the target. Hammering a nail into the doll deals critical internal damage directly to the target.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't052', name: 'Hollow Technique: Purple', category: 'Extension', description: 'A secret technique merging the convergence and divergence of infinities to produce imaginary mass. The resulting blast destroys everything it collides with absolutely.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't053', name: 'Cursed Technique Lapse: Blue', category: 'Extension', description: 'Amplifies the Limitless to generate powerful gravitational attraction by bringing the concept of "natural negative numbers" into reality.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't054', name: 'Piercing Blood', category: 'Extension', description: 'Fires a beam of compressed blood at the speed of sound, launched from a Convergence blood orb after clapping the hands together. One of the fastest techniques in the series.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't055', name: 'Decay', category: 'Extension', description: 'Spreads a floral decomposition pattern on anyone exposed to the user\'s corrosive blood. The mark rapidly breaks down the target\'s body, leaving almost no time to react.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't056', name: 'Jacob\'s Ladder', category: 'Extension', description: 'Conjures a four-winged trumpet and a massive magic array in the sky. A pillar of divine light descends to extinguish any curse it touches, including special-grade cursed objects.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't057', name: 'Bird Strike', category: 'Extension', description: 'Commands a crow to commit suicide by exceeding its cursed energy limit. The crow hurls itself at the target for a devastating, sacrifice-powered blow.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't058', name: 'Soul Multiplicity', category: 'Extension', description: 'Merges two or more souls together, causing a rejection reaction due to the souls fighting the fusion. The resulting energy is weaponized in further extension techniques.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't059', name: 'Collapse', category: 'Extension', description: 'Expands the effective critical-hit zone of the Ratio Technique to cover a wide area, rather than a single forced weak point.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't060', name: 'Granite Blast', category: 'Extension', description: 'Releases a concentrated beam of cursed energy with incredible destructive power from the user\'s hair, focused to a singular devastating point.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  // Barrier Techniques
  { id: 't061', name: 'Simple Domain', category: 'Barrier', description: 'Developed during the Heian Era as the "domain for the weak." Expands a small personal domain that neutralizes an enemy\'s can\'t-miss attack by targeting their domain barrier.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't062', name: 'Falling Blossom Emotion', category: 'Barrier', description: 'A secret art of the Big Three Sorcerer Families. Rather than expanding a domain, it counterattacks with cursed energy the instant a domain\'s guaranteed-hit attack makes contact.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't063', name: 'Domain Amplification', category: 'Barrier', description: 'Envelops the user in a thin veil of their domain\'s energy, automatically nullifying any cursed technique it contacts. Cannot be used simultaneously with the user\'s innate technique.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
  { id: 't064', name: 'Hollow Wicker Basket', category: 'Barrier', description: 'Predecessor to Simple Domain. Erects a spherical wicker basket barrier around the caster that neutralizes an expanded domain\'s barrier to nullify its can\'t-miss attack.', status: 'unclaimed', owner: null, reservedBy: null, reserveExpiry: null },
];

// ── State ────────────────────────────────────────────────────────────────────
const STATE = {
  techniques: [],
  currentView: 'unclaimed',
  activeTechId: null,
  pendingAction: null,
};

// ── Storage ──────────────────────────────────────────────────────────────────
function saveState() {
  try {
    localStorage.setItem('jjk_techniques', JSON.stringify(STATE.techniques));
  } catch (e) { /* storage unavailable */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem('jjk_techniques');
    if (raw) {
      STATE.techniques = JSON.parse(raw);
    } else {
      STATE.techniques = JSON.parse(JSON.stringify(DEFAULT_TECHNIQUES));
    }
  } catch (e) {
    STATE.techniques = JSON.parse(JSON.stringify(DEFAULT_TECHNIQUES));
  }
}

// ── Reserve Timer Logic ───────────────────────────────────────────────────────
function checkExpiredReservations() {
  const now = Date.now();
  let changed = false;
  STATE.techniques.forEach(t => {
    if (t.status === 'reserved' && t.reserveExpiry && now > t.reserveExpiry) {
      t.status = 'unclaimed';
      t.reservedBy = null;
      t.reserveExpiry = null;
      changed = true;
      showNotification(`Reservation for "${t.name}" has expired.`, 'info');
    }
  });
  if (changed) { saveState(); renderAll(); }
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

// ── Filtering ────────────────────────────────────────────────────────────────
function getFiltered(view) {
  return STATE.techniques.filter(t => t.status === view);
}

// ── Rendering ────────────────────────────────────────────────────────────────
function renderAll() {
  updateCounts();
  renderSidebarList();
  renderMainGrid();
}

function updateCounts() {
  document.getElementById('count-unclaimed').textContent = getFiltered('unclaimed').length;
  document.getElementById('count-claimed').textContent   = getFiltered('claimed').length;
  document.getElementById('count-reserved').textContent  = getFiltered('reserved').length;
}

function getBadgeClass(category) {
  const map = { Innate: 'badge-innate', Inherited: 'badge-inherited', Extension: 'badge-extension', Barrier: 'badge-barrier' };
  return map[category] || 'badge-other';
}

function renderSidebarList() {
  const list = document.getElementById('sidebar-list');
  const items = getFiltered(STATE.currentView);
  list.innerHTML = '';
  items.forEach(t => {
    const div = document.createElement('div');
    div.className = 'sidebar-item';
    if (t.id === STATE.activeTechId) div.classList.add('active-item');
    div.innerHTML = `
      <div class="sidebar-item-dot dot-${t.status}"></div>
      <div class="sidebar-item-name">${t.name}</div>
      <div class="sidebar-item-meta">${t.status === 'claimed' ? `Owner: ${t.owner}` : t.status === 'reserved' ? `Reserved: ${t.reservedBy}` : t.category}</div>
    `;
    div.addEventListener('click', () => openDetail(t.id));
    list.appendChild(div);
  });
}

function renderMainGrid() {
  const grid = document.getElementById('technique-grid');
  const empty = document.getElementById('empty-state');
  const items = getFiltered(STATE.currentView);

  // Update header
  const titleEl = document.getElementById('main-title');
  const subtitleEl = document.getElementById('main-subtitle');
  const statNum = document.getElementById('stat-num');
  const statChip = document.getElementById('stat-chip');

  titleEl.className = 'main-title';
  statNum.style.color = '';

  if (STATE.currentView === 'unclaimed') {
    titleEl.textContent = 'Unclaimed Techniques';
    titleEl.classList.add('');
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

  items.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = `tech-card card-${t.status}`;
    card.style.animationDelay = `${i * 0.04}s`;
    card.dataset.id = t.id;

    let footerRight = '';
    if (t.status === 'claimed') {
      footerRight = `<span class="card-owner-tag">${t.owner}</span>`;
    } else if (t.status === 'reserved') {
      footerRight = `<span class="card-timer" data-expiry="${t.reserveExpiry}">⏳ ${formatTimeRemaining(t.reserveExpiry)}</span>`;
    }

    const statusLabel = { unclaimed: 'UNCLAIMED', claimed: 'CLAIMED', reserved: 'RESERVED' }[t.status];

    card.innerHTML = `
      <div class="card-top">
        <div class="card-name">${t.name}</div>
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
    card.addEventListener('click', (e) => {
      spawnRipple(e);
      openDetail(t.id);
    });
    grid.appendChild(card);
  });
}

// Live timer update for reserved cards
setInterval(() => {
  document.querySelectorAll('.card-timer[data-expiry]').forEach(el => {
    const exp = parseInt(el.dataset.expiry);
    el.textContent = `⏳ ${formatTimeRemaining(exp)}`;
  });
  // Also update detail modal if open
  const detailModal = document.getElementById('modal-detail');
  if (detailModal.classList.contains('open') && STATE.activeTechId) {
    const t = STATE.techniques.find(x => x.id === STATE.activeTechId);
    if (t && t.status === 'reserved') {
      const timerEl = document.getElementById('detail-reserve-timer');
      if (timerEl) timerEl.textContent = formatTimeRemaining(t.reserveExpiry);
    }
  }
}, 1000);

// ── Detail Modal ─────────────────────────────────────────────────────────────
function openDetail(id) {
  STATE.activeTechId = id;
  const t = STATE.techniques.find(x => x.id === id);
  if (!t) return;

  document.getElementById('detail-badge').textContent = t.category.toUpperCase();
  document.getElementById('detail-title').textContent = t.name;
  document.getElementById('detail-desc').textContent = t.description;

  const statusEl = document.getElementById('detail-status');
  const ownerEl  = document.getElementById('detail-owner');
  const reserveInfo = document.getElementById('detail-reserve-info');
  const actions = document.getElementById('detail-actions');

  statusEl.className = `detail-status status-${t.status}`;
  statusEl.textContent = t.status.toUpperCase();

  if (t.status === 'claimed') {
    ownerEl.textContent = `— ${t.owner}`;
    reserveInfo.style.display = 'none';
    actions.innerHTML = `
      <button class="btn-action-release" id="act-release">Release Technique</button>
      <button class="btn-action-delete" id="act-delete">🗑 Delete</button>
    `;
    document.getElementById('act-release').addEventListener('click', () => openReleaseModal(t.id));
    document.getElementById('act-delete').addEventListener('click', () => openDeleteModal(t.id));
  } else if (t.status === 'reserved') {
    ownerEl.textContent = '';
    reserveInfo.style.display = 'block';
    document.getElementById('detail-reserve-timer').textContent = formatTimeRemaining(t.reserveExpiry);
    document.getElementById('detail-reserve-by').textContent = t.reservedBy;
    actions.innerHTML = `
      <button class="btn-action-accept" id="act-accept">✓ Accept → Claim</button>
      <button class="btn-action-release" id="act-deny">✗ Deny Reservation</button>
      <button class="btn-action-delete" id="act-delete">🗑 Delete</button>
    `;
    document.getElementById('act-accept').addEventListener('click', () => openAcceptModal(t.id));
    document.getElementById('act-deny').addEventListener('click', () => openReleaseModal(t.id));
    document.getElementById('act-delete').addEventListener('click', () => openDeleteModal(t.id));
  } else {
    ownerEl.textContent = '';
    reserveInfo.style.display = 'none';
    actions.innerHTML = `
      <button class="btn-action-claim" id="act-claim">⚡ Claim Technique</button>
      <button class="btn-action-reserve" id="act-reserve">◇ Reserve</button>
    `;
    document.getElementById('act-claim').addEventListener('click', () => openClaimModal(t.id, 'claim'));
    document.getElementById('act-reserve').addEventListener('click', () => openClaimModal(t.id, 'reserve'));
  }

  // Highlight sidebar item
  renderSidebarList();
  openModal('modal-detail');
}

// ── Claim / Reserve Modal ─────────────────────────────────────────────────────
function openClaimModal(id, mode) {
  STATE.pendingAction = { id, mode };
  const t = STATE.techniques.find(x => x.id === id);
  const titleEl = document.getElementById('claim-modal-title');
  const descEl  = document.getElementById('claim-modal-desc');
  const labelEl = document.getElementById('claim-label');
  const durGroup = document.getElementById('reserve-duration-group');

  if (mode === 'claim') {
    titleEl.textContent = 'Claim Technique';
    descEl.textContent  = `You are claiming: "${t.name}"`;
    labelEl.textContent = 'Owner Name';
    durGroup.style.display = 'none';
  } else {
    titleEl.textContent = 'Reserve Technique';
    descEl.textContent  = `You are reserving: "${t.name}"`;
    labelEl.textContent = 'Your Name';
    durGroup.style.display = 'flex';
  }
  document.getElementById('claim-name-input').value = '';
  closeModal('modal-detail');
  openModal('modal-claim');
}

document.getElementById('btn-claim-confirm').addEventListener('click', () => {
  const name = document.getElementById('claim-name-input').value.trim();
  if (!name) { showNotification('Please enter a name.', 'error'); return; }
  const { id, mode } = STATE.pendingAction;
  const t = STATE.techniques.find(x => x.id === id);
  if (!t) return;

  if (mode === 'claim') {
    t.status = 'claimed';
    t.owner = name;
    t.reservedBy = null;
    t.reserveExpiry = null;
    showNotification(`"${t.name}" claimed by ${name}!`, 'success');
  } else {
    const mins = parseInt(document.getElementById('reserve-duration').value);
    t.status = 'reserved';
    t.reservedBy = name;
    t.reserveExpiry = Date.now() + mins * 60 * 1000;
    t.owner = null;
    showNotification(`"${t.name}" reserved by ${name} for ${formatDuration(mins)}.`, 'info');
  }
  saveState();
  closeModal('modal-claim');
  // Switch to new view
  STATE.currentView = t.status;
  setActiveNavBtn(STATE.currentView);
  renderAll();
});

function formatDuration(mins) {
  if (mins < 60) return `${mins} min`;
  if (mins < 1440) return `${mins/60}h`;
  return `${mins/1440}d`;
}

// ── Accept Modal ─────────────────────────────────────────────────────────────
function openAcceptModal(id) {
  STATE.pendingAction = { id, mode: 'accept' };
  const t = STATE.techniques.find(x => x.id === id);
  document.getElementById('accept-desc').textContent =
    `Accept the reservation by "${t.reservedBy}" and officially claim "${t.name}"?`;
  closeModal('modal-detail');
  openModal('modal-accept');
}

document.getElementById('btn-accept-confirm').addEventListener('click', () => {
  const { id } = STATE.pendingAction;
  const t = STATE.techniques.find(x => x.id === id);
  if (!t) return;
  t.owner = t.reservedBy;
  t.status = 'claimed';
  t.reservedBy = null;
  t.reserveExpiry = null;
  showNotification(`"${t.name}" is now claimed by ${t.owner}!`, 'success');
  saveState();
  closeModal('modal-accept');
  STATE.currentView = 'claimed';
  setActiveNavBtn('claimed');
  renderAll();
});

// ── Release Modal ─────────────────────────────────────────────────────────────
function openReleaseModal(id) {
  STATE.pendingAction = { id, mode: 'release' };
  const t = STATE.techniques.find(x => x.id === id);
  document.getElementById('release-desc').textContent =
    `Release "${t.name}" back to unclaimed? This cannot be undone.`;
  closeModal('modal-detail');
  openModal('modal-release');
}

document.getElementById('btn-release-confirm').addEventListener('click', () => {
  const { id } = STATE.pendingAction;
  const t = STATE.techniques.find(x => x.id === id);
  if (!t) return;
  const prevOwner = t.owner || t.reservedBy;
  t.status = 'unclaimed';
  t.owner = null;
  t.reservedBy = null;
  t.reserveExpiry = null;
  showNotification(`"${t.name}" released back to unclaimed.`, 'info');
  saveState();
  closeModal('modal-release');
  STATE.currentView = 'unclaimed';
  setActiveNavBtn('unclaimed');
  renderAll();
});

// ── Add Technique Modal ───────────────────────────────────────────────────────
document.getElementById('open-add-modal').addEventListener('click', () => openModal('modal-add'));

document.getElementById('btn-add-confirm').addEventListener('click', () => {
  const name  = document.getElementById('add-name').value.trim();
  const desc  = document.getElementById('add-desc').value.trim();
  const cat   = document.getElementById('add-category').value;
  const owner = document.getElementById('add-owner').value.trim();

  if (!name) { showNotification('Technique name is required.', 'error'); return; }
  if (!desc)  { showNotification('Description is required.', 'error'); return; }

  const newId = 'u' + Date.now();
  const newTech = {
    id: newId,
    name, description: desc, category: cat,
    status: owner ? 'claimed' : 'unclaimed',
    owner: owner || null,
    reservedBy: null, reserveExpiry: null,
  };
  STATE.techniques.push(newTech);
  saveState();
  closeModal('modal-add');
  document.getElementById('add-name').value = '';
  document.getElementById('add-desc').value = '';
  document.getElementById('add-owner').value = '';
  STATE.currentView = newTech.status;
  setActiveNavBtn(newTech.status);
  renderAll();
  showNotification(`"${name}" registered!`, 'success');
});

// ── Navigation ────────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    STATE.currentView = btn.dataset.view;
    STATE.activeTechId = null;
    setActiveNavBtn(STATE.currentView);
    renderAll();
  });
});

function setActiveNavBtn(view) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-view="${view}"]`).classList.add('active');
}

// ── Modal Helpers ─────────────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// ── Notification ──────────────────────────────────────────────────────────────
function showNotification(msg, type = 'success') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => {
    el.classList.add('notif-out');
    el.addEventListener('animationend', () => el.remove());
  }, 3000);
}

// ── Ripple ────────────────────────────────────────────────────────────────────
function spawnRipple(e) {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  const size = 60;
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - size/2}px;top:${e.clientY - size/2}px`;
  document.getElementById('ripple-overlay').appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

// ── Init ──────────────────────────────────────────────────────────────────────
loadState();
renderAll();
checkExpiredReservations();
setInterval(checkExpiredReservations, 10000);
