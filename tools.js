/* ══════════════════════════════════════
   TOOLS.JS — Cursed Tools Registry
   ══════════════════════════════════════ */

const firebaseConfig = {
  apiKey: "AIzaSyC_Kq7meyPrD-3wxddJ7pVpOpD632Y3sak",
  authDomain: "jjk-invasion.firebaseapp.com",
  projectId: "jjk-invasion",
  messagingSenderId: "155907111446",
  appId: "1:155907111446:web:33ef57d2c34ad692b65337",
};

firebase.initializeApp(firebaseConfig);
const db   = firebase.firestore();
const COLL = 'tools';

const ADMIN_PASSWORD = 'RSISS';
let IS_ADMIN = false;

const STATE = {
  tools:         [],
  currentView:   'unclaimed',
  activeTechId:  null,
  pendingAction: null,
  searchQuery:   '',
  bulkMode:      false,
  bulkSelected:  new Set(),
};

/* ── Seed data ────────────────────────────────────────────────── */
const DEFAULT_TOOLS = [
  { name:'Playful Cloud',              grade:'Special Grade', description:'A triple-jointed nunchaku of special grade. Its cursed energy output is so immense it overwhelms the wielder\'s body unless they match it in strength.' },
  { name:'Inverted Spear of Heaven',   grade:'Special Grade', description:'A spear that nullifies any cursed technique it comes into contact with, including its own. One of the most dangerous special grade tools in existence.' },
  { name:'Split Soul Katana',          grade:'Special Grade', description:'A blade capable of cutting the soul directly. Bypasses physical defenses entirely and severs the spiritual form of its target.' },
  { name:'Black Rope',                 grade:'Special Grade', description:'Cursed rope that binds the soul as well as the body. Once wrapped, even Reverse Cursed Technique cannot easily free the target.' },
  { name:'Festering Life Sword',       grade:'Grade 1',       description:'A blade wreathed in decaying cursed energy. Wounds inflicted by it resist healing and spread a rot-like effect through the target\'s cursed energy.' },
  { name:'Slaughter Demon',            grade:'Grade 1',       description:'A katana that absorbs the cursed energy of those it cuts. The more blood it drinks, the more dangerous it becomes in successive strikes.' },
  { name:'Amenonuhoko',                grade:'Special Grade', description:'A divine spear of immense destructive capability. Said to be the primordial weapon used to stir the sea of chaos — its cursed energy bends reality on contact.' },
  { name:'Sword of Extermination',     grade:'Grade 1',       description:'Purified cursed energy compressed into a blade form. Extremely effective against cursed spirits; ordinary sorcerers struggle to wield it without backlash.' },
  { name:'Dragon-Bone',                grade:'Grade 2',       description:'A reinforced cursed tool staff imbued with the remnant energy of a powerful cursed spirit. Strikes carry a concussive spiritual force beyond their physical weight.' },
  { name:'Reishogi',                   grade:'Grade 2',       description:'A cursed shogi piece-shaped tool that redirects incoming cursed technique attacks. The user must correctly read the flow of energy to activate the deflection.' },
];

/* ── Grade helper ─────────────────────────────────────────────── */
function gradeClass(grade) {
  if (grade==='Special Grade') return 'grade-spec';
  if (grade==='Grade 1')       return 'grade-1';
  if (grade==='Grade 2')       return 'grade-2';
  return 'grade-3';
}

/* ── Seed ─────────────────────────────────────────────────────── */
async function seedIfEmpty() {
  const sentinel = db.collection('_meta').doc('tools_seeded');
  const snap = await sentinel.get();
  if (snap.exists) return;
  const batch = db.batch();
  DEFAULT_TOOLS.forEach(t => {
    batch.set(db.collection(COLL).doc(), {
      ...t, status:'unclaimed', owner:null, docLink:null,
      reservedBy:null, reserveExpiry:null, claimedAt:null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  });
  batch.set(sentinel, { at: firebase.firestore.FieldValue.serverTimestamp() });
  await batch.commit();
}

/* ── Expiry sweep on boot ─────────────────────────────────────── */
async function sweepExpired() {
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

function checkExpired() {
  const now = Date.now();
  STATE.tools.forEach(t => {
    if (t.status==='reserved' && t.reserveExpiry && t.reserveExpiry < now) {
      db.collection(COLL).doc(t.id).update({status:'unclaimed',reservedBy:null,reserveExpiry:null});
      showNotification('"'+t.name+'" reservation expired.','info');
    }
  });
}

/* ── Listener ─────────────────────────────────────────────────── */
function startListener() {
  db.collection(COLL).orderBy('createdAt').onSnapshot(snap => {
    STATE.tools = snap.docs.map(d => ({id:d.id,...d.data()}));
    checkExpired();
    renderAll();
  });
}

/* ── Helpers ──────────────────────────────────────────────────── */
function formatTimer(exp) {
  const d = exp - Date.now();
  if (d <= 0) return 'Expired';
  const days=Math.floor(d/86400000), hrs=Math.floor((d%86400000)/3600000),
        mins=Math.floor((d%3600000)/60000), secs=Math.floor((d%60000)/1000);
  if (days>0) return days+'d '+hrs+'h '+mins+'m';
  if (hrs>0)  return hrs+'h '+mins+'m '+secs+'s';
  if (mins>0) return mins+'m '+secs+'s';
  return secs+'s';
}

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
}

function getFiltered(view) {
  let items = STATE.tools.filter(t => t.status===view);
  if (STATE.searchQuery) {
    const q = STATE.searchQuery.toLowerCase();
    items = items.filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.owner && t.owner.toLowerCase().includes(q)) ||
      t.grade.toLowerCase().includes(q)
    );
  }
  return items.sort((a,b) => a.name.localeCompare(b.name));
}

/* ── Admin ────────────────────────────────────────────────────── */
function setAdmin(val) {
  IS_ADMIN = val;
  document.getElementById('admin-badge').style.display        = val?'flex':'none';
  document.getElementById('sidebar-actions').style.display    = val?'flex':'none';
  document.getElementById('sidebar-login-area').style.display = val?'none':'flex';
  document.getElementById('btn-admin-tab').style.display      = val?'flex':'none';
  if (!val && STATE.currentView==='admin') { STATE.currentView='unclaimed'; setActiveNav('unclaimed'); }
  renderAll();
}

document.getElementById('btn-open-admin-login').addEventListener('click', ()=>openModal('modal-admin-login'));

document.getElementById('btn-admin-login-confirm').addEventListener('click', ()=>{
  const pw  = document.getElementById('admin-password-input').value;
  const err = document.getElementById('admin-login-error');
  if (pw===ADMIN_PASSWORD) {
    err.style.display='none';
    document.getElementById('admin-password-input').value='';
    closeModal('modal-admin-login');
    setAdmin(true);
    showNotification('Admin mode activated.','success');
  } else { err.style.display='block'; }
});

document.getElementById('admin-password-input').addEventListener('keydown', e=>{
  if (e.key==='Enter') document.getElementById('btn-admin-login-confirm').click();
});

document.getElementById('btn-admin-logout').addEventListener('click', ()=>{
  setAdmin(false);
  showNotification('Logged out.','info');
});

/* ── Render ───────────────────────────────────────────────────── */
function renderAll() {
  updateCounts();
  if (STATE.currentView==='admin') renderAdminPanel();
  else { renderSidebar(); renderGrid(); }
}

function updateCounts() {
  ['unclaimed','claimed','reserved'].forEach(s => {
    document.getElementById('count-'+s).textContent = STATE.tools.filter(t=>t.status===s).length;
  });
}

function renderSidebar() {
  const list  = document.getElementById('sidebar-list');
  const items = getFiltered(STATE.currentView);
  list.innerHTML = '';
  items.forEach(t => {
    const div = document.createElement('div');
    div.className = 'sidebar-item'+(t.id===STATE.activeTechId?' active-item':'');
    div.innerHTML = `<div class="sidebar-item-dot dot-${t.status}"></div>
      <div class="sidebar-item-name">${t.name}</div>
      <div class="sidebar-item-meta">${t.grade}${t.status==='claimed'?' · '+t.owner:t.status==='reserved'?' · '+t.reservedBy:''}</div>`;
    div.addEventListener('click', ()=>openDetail(t.id));
    list.appendChild(div);
  });
}

function renderGrid() {
  const grid  = document.getElementById('technique-grid');
  const empty = document.getElementById('empty-state');
  const items = getFiltered(STATE.currentView);

  const titleEl = document.getElementById('main-title');
  const subEl   = document.getElementById('main-subtitle');
  const statEl  = document.getElementById('stat-num');

  titleEl.className = 'main-title';
  const map = {
    unclaimed: ['Unclaimed Tools',  'Tools awaiting a wielder',      'var(--r5)'],
    claimed:   ['Claimed Tools',    'Tools bound to their wielders',  'var(--g5)'],
    reserved:  ['Reserved Tools',   'Pending confirmation',           'var(--gold-bright)'],
  };
  const [title,sub,col] = map[STATE.currentView];
  titleEl.textContent=title; subEl.textContent=sub; statEl.style.color=col;
  statEl.textContent = items.length;

  grid.innerHTML = '';
  if (!items.length) { grid.style.display='none'; empty.style.display='flex'; return; }
  grid.style.display='grid'; empty.style.display='none';

  // Bulk bar
  if (IS_ADMIN && STATE.bulkMode) {
    const bar = document.createElement('div');
    bar.className = 'bulk-bar';
    bar.innerHTML = `
      <label class="bulk-select-all"><input type="checkbox" id="bulk-check-all"> Select All</label>
      <span class="bulk-count" id="bulk-count">${STATE.bulkSelected.size} selected</span>
      <div class="admin-toolbar-actions">
        <button class="bulk-btn bulk-btn-red" id="bulk-delete-btn">🗑 Delete Selected</button>
      </div>`;
    grid.appendChild(bar);
    document.getElementById('bulk-check-all').addEventListener('change', e=>{
      items.forEach(t=>{ if(e.target.checked) STATE.bulkSelected.add(t.id); else STATE.bulkSelected.delete(t.id); });
      renderGrid();
    });
    document.getElementById('bulk-delete-btn').addEventListener('click', bulkDelete);
  }

  items.forEach((t,i) => {
    const card = document.createElement('div');
    card.className = `tech-card card-${t.status}`;
    card.style.animationDelay = `${i*0.03}s`;
    card.dataset.id = t.id;

    let footerRight = '';
    if (t.status==='claimed')  footerRight = `<span class="card-owner-tag">${t.owner}${t.claimedAt?'<span class="card-claimed-date">'+fmtDate(t.claimedAt)+'</span>':''}</span>`;
    if (t.status==='reserved') footerRight = `<span class="card-timer" data-expiry="${t.reserveExpiry}">⏳ ${formatTimer(t.reserveExpiry)}</span>`;

    const bulkBox = (IS_ADMIN && STATE.bulkMode)
      ? `<input type="checkbox" class="bulk-checkbox" data-id="${t.id}" ${STATE.bulkSelected.has(t.id)?'checked':''}>`
      : '';

    const statusLabel = {unclaimed:'UNCLAIMED',claimed:'CLAIMED',reserved:'RESERVED'}[t.status];

    card.innerHTML = `
      ${bulkBox}
      <div class="card-top">
        <div class="card-name">${t.name}</div>
        <span class="grade-badge ${gradeClass(t.grade)}">${t.grade.toUpperCase()}</span>
      </div>
      <div class="card-desc">${t.description}</div>
      <div class="card-footer">
        <div class="card-status status-${t.status}"><span class="status-dot"></span><span>${statusLabel}</span></div>
        ${footerRight}
      </div>`;

    if (IS_ADMIN && STATE.bulkMode) {
      card.querySelector('.bulk-checkbox').addEventListener('change', e=>{
        e.stopPropagation();
        if (e.target.checked) STATE.bulkSelected.add(t.id); else STATE.bulkSelected.delete(t.id);
        const countEl = document.getElementById('bulk-count');
        if (countEl) countEl.textContent = STATE.bulkSelected.size+' selected';
      });
    }
    card.addEventListener('click', e=>{ if(e.target.type==='checkbox') return; spawnRipple(e); openDetail(t.id); });
    grid.appendChild(card);
  });
}

/* ── Admin panel ──────────────────────────────────────────────── */
function renderAdminPanel() {
  const grid  = document.getElementById('technique-grid');
  const empty = document.getElementById('empty-state');
  document.getElementById('main-title').textContent = 'Admin Panel';
  document.getElementById('main-title').className   = 'main-title title-admin';
  document.getElementById('main-subtitle').textContent = 'Manage all cursed tools';
  document.getElementById('stat-num').textContent   = STATE.tools.length;
  document.getElementById('stat-num').style.color   = 'var(--gold-bright)';
  empty.style.display='none'; grid.style.display='grid'; grid.innerHTML='';

  const toolbar = document.createElement('div');
  toolbar.className = 'admin-toolbar';
  toolbar.innerHTML = `
    <span class="admin-toolbar-label">BULK OPERATIONS</span>
    <div class="admin-toolbar-actions">
      <button class="bulk-btn bulk-btn-red" id="admin-bulk-delete">🗑 Delete Selected (${STATE.bulkSelected.size})</button>
      <button class="bulk-btn bulk-btn-clear" id="admin-bulk-clear">✕ Clear</button>
    </div>`;
  grid.appendChild(toolbar);
  document.getElementById('admin-bulk-delete').addEventListener('click', bulkDelete);
  document.getElementById('admin-bulk-clear').addEventListener('click', ()=>{ STATE.bulkSelected.clear(); renderAll(); });

  [...STATE.tools].sort((a,b)=>a.name.localeCompare(b.name)).forEach((t,i) => {
    const card = document.createElement('div');
    card.className = `tech-card card-${t.status}`;
    card.style.animationDelay = `${i*0.015}s`;
    const checked = STATE.bulkSelected.has(t.id) ? 'checked' : '';
    const statusLabel = {unclaimed:'UNCLAIMED',claimed:'CLAIMED',reserved:'RESERVED'}[t.status];
    let meta = '';
    if (t.status==='claimed')  meta = t.owner+(t.claimedAt?' · '+fmtDate(t.claimedAt):'');
    if (t.status==='reserved') meta = t.reservedBy+' · '+formatTimer(t.reserveExpiry);

    card.innerHTML = `
      <label class="admin-card-select" onclick="event.stopPropagation()">
        <input type="checkbox" class="bulk-checkbox" data-id="${t.id}" ${checked}>
      </label>
      <div class="card-top">
        <div class="card-name">${t.name}</div>
        <span class="grade-badge ${gradeClass(t.grade)}">${t.grade.toUpperCase()}</span>
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

    card.querySelector('.bulk-checkbox').addEventListener('change', e=>{
      if (e.target.checked) STATE.bulkSelected.add(t.id); else STATE.bulkSelected.delete(t.id);
      const btn = document.getElementById('admin-bulk-delete');
      if (btn) btn.textContent = '🗑 Delete Selected ('+STATE.bulkSelected.size+')';
    });
    card.querySelectorAll('.admin-btn').forEach(btn=>{
      btn.addEventListener('click', e=>{
        e.stopPropagation();
        const {id,action} = btn.dataset;
        if (action==='delete')  openDeleteModal(id);
        if (action==='release') openReleaseModal(id);
        if (action==='accept')  openAcceptModal(id);
        if (action==='claim')   openClaimModal(id,'claim');
      });
    });
    grid.appendChild(card);
  });
}

/* ── Bulk delete ──────────────────────────────────────────────── */
async function bulkDelete() {
  if (!STATE.bulkSelected.size) { showNotification('No tools selected.','error'); return; }
  if (!confirm('Delete '+STATE.bulkSelected.size+' tool(s)? This cannot be undone.')) return;
  const batch = db.batch();
  STATE.bulkSelected.forEach(id => batch.delete(db.collection(COLL).doc(id)));
  await batch.commit();
  showNotification(STATE.bulkSelected.size+' tool(s) deleted.','info');
  STATE.bulkSelected.clear();
}

/* ── Timer tick ───────────────────────────────────────────────── */
setInterval(()=>{
  const now = Date.now();
  document.querySelectorAll('.card-timer[data-expiry]').forEach(el=>{
    const exp = parseInt(el.dataset.expiry);
    if (exp<=now) {
      const card = el.closest('.tech-card');
      if (card) {
        const t = STATE.tools.find(x=>x.id===card.dataset.id);
        if (t && t.status==='reserved')
          db.collection(COLL).doc(t.id).update({status:'unclaimed',reservedBy:null,reserveExpiry:null});
      }
    } else { el.textContent = '⏳ '+formatTimer(exp); }
  });
  if (document.getElementById('modal-detail').classList.contains('open') && STATE.activeTechId) {
    const t = STATE.tools.find(x=>x.id===STATE.activeTechId);
    if (t && t.status==='reserved') {
      const el = document.getElementById('detail-reserve-timer');
      if (el) {
        if (t.reserveExpiry<=now) {
          db.collection(COLL).doc(t.id).update({status:'unclaimed',reservedBy:null,reserveExpiry:null});
          closeModal('modal-detail');
        } else { el.textContent = formatTimer(t.reserveExpiry); }
      }
    }
  }
},1000);

/* ── Detail modal ─────────────────────────────────────────────── */
function openDetail(id) {
  STATE.activeTechId = id;
  const t = STATE.tools.find(x=>x.id===id);
  if (!t) return;

  document.getElementById('detail-badge').textContent = t.grade;
  document.getElementById('detail-title').textContent = t.name;
  document.getElementById('detail-desc').textContent  = t.description;

  const docDiv = document.getElementById('detail-doc-link');
  const docA   = document.getElementById('detail-doc-anchor');
  if (t.docLink) { docA.href=t.docLink; docDiv.style.display='block'; }
  else { docDiv.style.display='none'; }

  const statusEl = document.getElementById('detail-status');
  const ownerEl  = document.getElementById('detail-owner');
  const resInfo  = document.getElementById('detail-reserve-info');
  const actions  = document.getElementById('detail-actions');

  statusEl.className  = 'detail-status status-'+t.status;
  statusEl.textContent = t.status.toUpperCase();

  if (t.status==='claimed') {
    ownerEl.innerHTML = '— '+t.owner+(t.claimedAt?'<span class="detail-claimed-date">Claimed '+fmtDate(t.claimedAt)+'</span>':'');
    resInfo.style.display = 'none';
  } else if (t.status==='reserved') {
    ownerEl.textContent = '';
    resInfo.style.display = 'block';
    document.getElementById('detail-reserve-timer').textContent = formatTimer(t.reserveExpiry);
    document.getElementById('detail-reserve-by').textContent    = t.reservedBy;
  } else { ownerEl.textContent=''; resInfo.style.display='none'; }

  actions.innerHTML = '';
  if (t.status==='unclaimed') {
    actions.appendChild(makeBtn('btn-action-reserve','◇ Reserve',()=>{ closeModal('modal-detail'); openClaimModal(id,'reserve'); }));
    if (IS_ADMIN) {
      actions.appendChild(makeBtn('btn-action-claim','⚡ Claim',()=>{ closeModal('modal-detail'); openClaimModal(id,'claim'); }));
      actions.appendChild(makeBtn('btn-action-delete','🗑 Delete',()=>{ closeModal('modal-detail'); openDeleteModal(id); }));
    }
  } else if (t.status==='reserved') {
    if (IS_ADMIN) {
      actions.appendChild(makeBtn('btn-action-accept','✓ Accept → Claim',()=>{ closeModal('modal-detail'); openAcceptModal(id); }));
      actions.appendChild(makeBtn('btn-action-release','✗ Deny',()=>{ closeModal('modal-detail'); openReleaseModal(id); }));
      actions.appendChild(makeBtn('btn-action-delete','🗑 Delete',()=>{ closeModal('modal-detail'); openDeleteModal(id); }));
    } else {
      const p = document.createElement('p');
      p.style.cssText = 'font-size:0.8rem;color:var(--tx3);font-style:italic;';
      p.textContent = 'Awaiting admin confirmation.';
      actions.appendChild(p);
    }
  } else if (t.status==='claimed' && IS_ADMIN) {
    actions.appendChild(makeBtn('btn-action-release','↩ Release',()=>{ closeModal('modal-detail'); openReleaseModal(id); }));
    actions.appendChild(makeBtn('btn-action-delete','🗑 Delete',()=>{ closeModal('modal-detail'); openDeleteModal(id); }));
  }

  renderSidebar();
  openModal('modal-detail');
}

function makeBtn(cls,label,fn) {
  const b = document.createElement('button');
  b.className=cls; b.textContent=label;
  b.addEventListener('click',fn);
  return b;
}

/* ── Claim / Reserve ──────────────────────────────────────────── */
function openClaimModal(id,mode) {
  STATE.pendingAction = {id,mode};
  const t = STATE.tools.find(x=>x.id===id);
  const res = mode==='reserve';
  document.getElementById('claim-modal-title').textContent = res?'Reserve Tool':'Claim Tool';
  document.getElementById('claim-modal-desc').textContent  = (res?'Reserving':'Claiming')+': "'+t.name+'"'+(res?' — reservation lasts 2 weeks.':'');
  document.getElementById('claim-label').textContent       = res?'Your Name':'Owner Name';
  document.getElementById('reserve-duration-group').style.display = 'none';
  document.getElementById('claim-doc-group').style.display = res?'none':'flex';
  document.getElementById('claim-name-input').value = '';
  document.getElementById('claim-doc-input').value  = '';
  openModal('modal-claim');
}

document.getElementById('btn-claim-confirm').addEventListener('click', async()=>{
  const name = document.getElementById('claim-name-input').value.trim();
  if (!name) { showNotification('Please enter a name.','error'); return; }
  const {id,mode} = STATE.pendingAction;
  const t = STATE.tools.find(x=>x.id===id);
  if (mode==='claim') {
    const docLink = document.getElementById('claim-doc-input').value.trim()||null;
    await db.collection(COLL).doc(id).update({status:'claimed',owner:name,docLink,reservedBy:null,reserveExpiry:null,claimedAt:Date.now()});
    showNotification('"'+t.name+'" claimed by '+name+'!','success');
  } else {
    await db.collection(COLL).doc(id).update({status:'reserved',reservedBy:name,reserveExpiry:Date.now()+14*24*60*60*1000,owner:null,docLink:null});
    showNotification('"'+t.name+'" reserved by '+name+' for 2 weeks.','info');
  }
  closeModal('modal-claim');
});

/* ── Accept ───────────────────────────────────────────────────── */
function openAcceptModal(id) {
  STATE.pendingAction = {id};
  const t = STATE.tools.find(x=>x.id===id);
  document.getElementById('accept-desc').textContent = 'Accepting "'+t.name+'" for '+t.reservedBy+'. Provide their OC document link.';
  document.getElementById('accept-doc-input').value  = '';
  document.getElementById('accept-doc-error').style.display = 'none';
  openModal('modal-accept');
}

document.getElementById('btn-accept-confirm').addEventListener('click', async()=>{
  const doc = document.getElementById('accept-doc-input').value.trim();
  const err = document.getElementById('accept-doc-error');
  if (!doc) { err.style.display='block'; return; }
  err.style.display = 'none';
  const {id} = STATE.pendingAction;
  const t = STATE.tools.find(x=>x.id===id);
  await db.collection(COLL).doc(id).update({status:'claimed',owner:t.reservedBy,docLink:doc,reservedBy:null,reserveExpiry:null,claimedAt:Date.now()});
  showNotification('"'+t.name+'" claimed by '+t.reservedBy+'!','success');
  closeModal('modal-accept');
});

/* ── Release ──────────────────────────────────────────────────── */
function openReleaseModal(id) {
  STATE.pendingAction = {id};
  const t = STATE.tools.find(x=>x.id===id);
  document.getElementById('release-desc').textContent = 'Release "'+t.name+'" back to unclaimed?';
  openModal('modal-release');
}

document.getElementById('btn-release-confirm').addEventListener('click', async()=>{
  const {id} = STATE.pendingAction;
  const t = STATE.tools.find(x=>x.id===id);
  await db.collection(COLL).doc(id).update({status:'unclaimed',owner:null,docLink:null,reservedBy:null,reserveExpiry:null,claimedAt:null});
  showNotification('"'+t.name+'" released.','info');
  closeModal('modal-release');
});

/* ── Delete ───────────────────────────────────────────────────── */
function openDeleteModal(id) {
  STATE.pendingAction = {id};
  const t = STATE.tools.find(x=>x.id===id);
  document.getElementById('delete-desc').textContent = 'Delete "'+t.name+'" permanently?';
  openModal('modal-delete');
}

document.getElementById('btn-delete-confirm').addEventListener('click', async()=>{
  const {id} = STATE.pendingAction;
  const t = STATE.tools.find(x=>x.id===id);
  await db.collection(COLL).doc(id).delete();
  showNotification('"'+t.name+'" deleted.','info');
  closeModal('modal-delete');
  STATE.activeTechId = null;
});

/* ── Add tool ─────────────────────────────────────────────────── */
document.getElementById('open-add-modal').addEventListener('click', ()=>openModal('modal-add'));

document.getElementById('btn-add-confirm').addEventListener('click', async()=>{
  const name    = document.getElementById('add-name').value.trim();
  const desc    = document.getElementById('add-desc').value.trim();
  const grade   = document.getElementById('add-grade').value;
  const owner   = document.getElementById('add-owner').value.trim();
  const docLink = document.getElementById('add-doc-link').value.trim()||null;
  if (!name) { showNotification('Name required.','error'); return; }
  if (!desc) { showNotification('Description required.','error'); return; }
  await db.collection(COLL).add({
    name, description:desc, grade,
    status: owner?'claimed':'unclaimed',
    owner: owner||null, docLink,
    reservedBy:null, reserveExpiry:null,
    claimedAt: owner?Date.now():null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  ['add-name','add-desc','add-owner','add-doc-link'].forEach(id=>document.getElementById(id).value='');
  closeModal('modal-add');
  showNotification('"'+name+'" registered!','success');
});

/* ── Navigation ───────────────────────────────────────────────── */
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    STATE.currentView  = btn.dataset.view;
    STATE.activeTechId = null;
    STATE.bulkSelected.clear();
    setActiveNav(STATE.currentView);
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-backdrop').classList.remove('open');
    renderAll();
  });
});

function setActiveNav(view) {
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const btn = document.querySelector('.nav-btn[data-view="'+view+'"]');
  if (btn) btn.classList.add('active');
}

/* ── Mobile sidebar ───────────────────────────────────────────── */
document.getElementById('mobile-nav-toggle').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-backdrop').classList.toggle('open');
});
document.getElementById('sidebar-backdrop').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('open');
});

/* ── Search ───────────────────────────────────────────────────── */
document.getElementById('sidebar-search-input').addEventListener('input', e=>{
  STATE.searchQuery = e.target.value.trim();
  renderAll();
});

/* ── Bulk mode toggle ─────────────────────────────────────────── */
document.getElementById('btn-bulk-mode').addEventListener('click', ()=>{
  STATE.bulkMode = !STATE.bulkMode;
  STATE.bulkSelected.clear();
  document.getElementById('btn-bulk-mode').textContent = STATE.bulkMode?'✕ Exit Bulk':'☰ Bulk Delete';
  renderAll();
});

/* ── Modal helpers ────────────────────────────────────────────── */
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',e=>{ if(e.target===o) closeModal(o.id); }));

/* ── Notifications ────────────────────────────────────────────── */
function showNotification(msg,type='success') {
  const ex = document.querySelector('.notification');
  if (ex) ex.remove();
  const el = document.createElement('div');
  el.className = 'notification '+type;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=>{ el.classList.add('notif-out'); el.addEventListener('animationend',()=>el.remove()); },3200);
}

/* ── Ripple ───────────────────────────────────────────────────── */
function spawnRipple(e) {
  const r = document.createElement('div');
  r.className = 'ripple';
  const s = 60;
  r.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX-s/2}px;top:${e.clientY-s/2}px;border-color:rgba(220,40,40,0.4);`;
  document.getElementById('ripple-overlay').appendChild(r);
  r.addEventListener('animationend',()=>r.remove());
}

/* ── Boot ─────────────────────────────────────────────────────── */
async function boot() {
  try {
    await seedIfEmpty();
    await sweepExpired();
    startListener();
    const ls = document.getElementById('loading-screen');
    ls.style.opacity = '0';
    setTimeout(()=>{ ls.style.display='none'; document.getElementById('app-shell').style.display='flex'; },700);
  } catch(e) {
    console.error('Boot error:',e);
    document.querySelector('.loading-text').textContent = 'CONNECTION FAILED — CHECK FIREBASE RULES';
  }
}
boot();
