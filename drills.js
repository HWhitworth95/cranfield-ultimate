// Drill library: filterable card list (players / category / skills / text)
// plus a detail view per drill. Combines the club's own drills (CLUB_DRILLS,
// generated from the old site) with reworded Flik free drills (FLIK_DRILLS).
// Exposes window.DrillLib = { list, detail, routes, index }.

(function () {
  'use strict';

  const DRILLS = [
    // Club drills, with structured rewrites (drills_club_v2.js) merged over the old page text.
    ...CLUB_DRILLS.map(d => CLUB_V2[d.id] ? { ...d, ...CLUB_V2[d.id], html: undefined, thumb: null } : d),
    ...FLIK_DRILLS.map(d => ({ ...d, source: 'flik' })),
    ...ULTI_DRILLS.map(d => ({ ...d, source: 'ultiplays' })),
    ...SOCIAL_DRILLS.map(d => ({ ...d, source: 'discin' })),
    ...EXTRA_DRILLS.map(d => ({ ...d, source: 'web' })),
    ...LIB_DRILLS.map(d => ({ ...d, source: 'web' })),
    ...REDDIT_DRILLS.map(d => ({ ...d, source: 'web' })),
    ...SOURCED_DRILLS.map(d => ({ ...d, source: 'web' })),
    ...PLAYSPEDIA_DRILLS.map(d => ({ ...d, source: 'playspedia' })),
    // Written for the club from openly shared coaching material (no credit line).
    ...OPEN_DRILLS.map(d => ({ ...d, source: 'open' })),
  ];

  // Levels: only where a source states one. Everything else shows "Not graded"
  // rather than us guessing. Add to this map as coaches grade drills.
  const LEVEL_SRC = {
    '100-throws': ['Beginner', 'Club "Basic Introduction Drills" page'], 'super-70s': ['Beginner', 'Club "Basic Introduction Drills" page'],
    'pivot-drill': ['Beginner', 'Club "Basic Introduction Drills" page'], 'break-force': ['Beginner', 'Club "Basic Introduction Drills" page'],
    'pivot-n-fake': ['Beginner', 'Club "Basic Introduction Drills" page'],
    'downfield-lateral-cut': ['Beginner', 'Flik: used in "Beginner Essentials"'],
    'sideline-escape': ['Intermediate', 'Flik: written for intermediate players'],
  };
  const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
  DRILLS.forEach(d => {
    if (LEVEL_SRC[d.id]) [d.level, d.levelSrc] = LEVEL_SRC[d.id];
    else if (d.level) d.levelSrc = d.levelSrc || (d.credits && d.credits[0][0].split(',')[0]) || 'Source';
    else {
      const k = Object.keys(SUGGESTED_LEVELS).find(k => SUGGESTED_LEVELS[k].includes(d.id));
      if (k) { d.level = { B: 'Beginner', I: 'Intermediate', A: 'Advanced' }[k]; d.levelSrc = 'Suggested level (not from the source)'; d.levelGuess = true; }
    }
  });

  // Equipment: read from the drill's own text and diagrams (nothing assumed).
  const EQUIP = [['Cones', /\bcones?\b/i], ['Flags', /\bflags?\b/i], ['Bibs', /\bbibs?\b|\bpinnies\b/i],
    ['Mats', /\bmats?\b/i], ['Ladder', /\bladder\b/i], ['Whistle', /\bwhistle\b/i]];
  DRILLS.forEach(d => {
    const txt = [d.setup, d.summary, d.html, ...(d.rules || []), ...(d.steps || []).map(s => s.text), ...(d.progressions || [])].join(' ').replace(/<[^>]+>/g, ' ');
    const eq = [];
    if (/\bdiscs?\b|throw|frisbee|catch|pass/i.test(txt)) eq.push('Discs');
    EQUIP.forEach(([n, re]) => { if (re.test(txt) || (n === 'Cones' && (d.steps || []).some(s => s.dia && (s.dia.cones || []).length && !/flag/i.test(txt)))) eq.push(n); });
    d.equip = eq;
  });
  const KIT = EQUIP.map(([n]) => n).filter(n => DRILLS.some(d => d.equip.includes(n)));
  // Fit every diagram of a drill to the union of its action (players, cones,
  // arrow ends) with padding, so all steps share one tight, consistent frame.
  // A marker or defender drawn right on top of an attacker hides both labels.
  // Push any defender that overlaps an offence circle out until the two just
  // touch, and move the start of any defender run that began at the old spot.
  function separateDefenders(dia) {
    const MIN = 2.5; // centre-to-centre distance at which two circles touch (m)
    (dia.d || []).forEach(def => {
      const [, dx, dy] = def;
      let near = null, best = MIN;
      (dia.o || []).forEach(([, ox, oy]) => { const dd = Math.hypot(dx - ox, dy - oy); if (dd < best) { best = dd; near = [ox, oy]; } });
      if (!near) return;
      let vx = dx - near[0], vy = dy - near[1];
      if (Math.hypot(vx, vy) < 0.01) { vx = 0; vy = -1; } // exactly on top: lift the defender
      const k = MIN / Math.hypot(vx, vy);
      const nx = near[0] + vx * k, ny = near[1] + vy * k;
      (dia.drun || []).forEach(c => { if (Math.hypot(c[0] - dx, c[1] - dy) < 1.6) { c[0] = nx; c[1] = ny; } });
      def[1] = nx; def[2] = ny;
    });
  }

  function fitViews(d) {
    if (!d.steps) return;
    const dias = d.steps.map(st => st.dia).filter(Boolean);
    dias.forEach(separateDefenders);
    if (!dias.length || dias.some(x => x.pitch)) return; // full mini-pitch drawings keep their frame
    const xs = [], ys = [];
    const add = (x, y) => { xs.push(x); ys.push(y); };
    dias.forEach(x => {
      ['o', 'd'].forEach(k => (x[k] || []).forEach(([, px, py]) => add(px, py)));
      (x.cones || []).forEach(([cx, cy]) => add(cx, cy));
      [].concat(x.ez ?? []).forEach(y => ys.push(y - 2));
      ['run', 'drun', 'throw', 'opt'].forEach(k => (x[k] || []).forEach(([x1, y1, x2, y2]) => { add(x1, y1); add(x2, y2); }));
      // Notes are centred text (1.5 m font): keep their whole width in frame.
      (x.note || []).forEach(([t, nx, ny]) => { const half = String(t).length * 0.42 + 0.3; add(nx - half, ny - 1.4); add(nx + half, ny + 0.6); });
    });
    const pad = 3.5;
    let x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
    if (dias.some(x => x.side === 'left')) x0 = Math.min(x0, -1);
    if (dias.some(x => x.side === 'right')) x1 = Math.max(x1, 38);
    // Keep a pleasant aspect (between 4:5 portrait and 3:2 landscape).
    let w = x1 - x0, h = y1 - y0;
    if (w / h > 1.5) { const nh = w / 1.5; y0 -= (nh - h) / 2; y1 += (nh - h) / 2; h = nh; }
    if (w / h < 0.8) { const nw = h * 0.8; const grow = nw - w;
      // grow away from a sideline if there is one
      if (dias.some(x => x.side === 'left')) x1 += grow; else if (dias.some(x => x.side === 'right')) x0 -= grow; else { x0 -= grow / 2; x1 += grow / 2; } }
    dias.forEach(x => { x.view = [x0, y0, x1, y1]; });
  }
  DRILLS.forEach(fitViews);

  // Browse order: by category, keeping each source's own order within it.
  const CAT_ORDER = ['Fundamentals', 'Throwing', 'Cutting', 'Handling', 'Team play', 'Endzone', 'Defence', 'Agility', 'Games'];
  DRILLS.sort((a, b) => CAT_ORDER.indexOf(a.cat) - CAT_ORDER.indexOf(b.cat));
  const BY_ID = Object.fromEntries(DRILLS.map(d => [d.id, d]));
  const CATS = ['Fundamentals', 'Throwing', 'Cutting', 'Handling', 'Team play', 'Endzone', 'Defence', 'Agility', 'Games'];
  const TAGS = [...new Set(DRILLS.flatMap(d => d.tags))].sort();
  const minPlayers = d => parseInt(String(d.players).match(/\d+/)[0], 10);

  // Old drill-page URLs land on the library with that category selected.
  const LEGACY = {
    'drills-intro': 'Fundamentals', 'drills-throwing': 'Throwing', 'drills-endzone': 'Endzone',
    'drills-defence': 'Defence', 'drills-agility': 'Agility',
  };

  // ---------- Filter state (remembered per browser) ----------
  let state = Object.assign({ q: '', players: 0, cat: '', tags: [], level: '', have: null, timed: false }, load() || {});

  function load() { try { return JSON.parse(localStorage.getItem('cu-drill-filter')); } catch (e) { return null; } }
  function save() { try { localStorage.setItem('cu-drill-filter', JSON.stringify(state)); } catch (e) { /* ignore */ } }

  function matches(d) {
    if (state.players && minPlayers(d) > state.players) return false;
    if (state.cat && d.cat !== state.cat) return false;
    if (state.level && (d.level || 'Not graded') !== state.level) return false;
    if (state.tags.length && !state.tags.every(t => d.tags.includes(t))) return false;
    // "What have you got?": hide drills that need kit you haven't ticked (discs are assumed).
    if (state.have && d.equip.some(e => e !== 'Discs' && !state.have.includes(e))) return false;
    if (state.timed && !d.time) return false;
    if (state.q) {
      const hay = (d.title + ' ' + d.summary + ' ' + d.tags.join(' ') + ' ' + (d.credit || '')).toLowerCase();
      if (!hay.includes(state.q.toLowerCase())) return false;
    }
    return true;
  }

  // ---------- Diagram renderer (SVG, pitch units in metres) ----------
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function curve([x1, y1, x2, y2, bend = 0]) {
    // Quadratic curve; bend offsets the control point perpendicular to the line.
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    const cx = mx + (-dy / len) * bend, cy = my + (dx / len) * bend;
    return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
  }

  function diagram(dia, small) {
    const [x0, y0, x1, y1] = dia.view;
    const w = x1 - x0, h = y1 - y0;
    const r = 1.35; // player radius (m)
    const parts = [];
    parts.push(`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#e9f3ea"/>`);
    // light 5 m grid
    for (let x = Math.ceil(x0 / 5) * 5; x <= x1; x += 5) parts.push(`<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" class="g"/>`);
    for (let y = Math.ceil(y0 / 5) * 5; y <= y1; y += 5) parts.push(`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" class="g"/>`);
    if (dia.side === 'left') parts.push(`<rect x="${x0}" y="${y0}" width="${Math.max(0, -x0)}" height="${h}" fill="#dbe6db"/><line x1="0" y1="${y0}" x2="0" y2="${y1}" class="side"/>`);
    if (dia.side === 'right') parts.push(`<rect x="37" y="${y0}" width="${Math.max(0, x1 - 37)}" height="${h}" fill="#dbe6db"/><line x1="37" y1="${y0}" x2="37" y2="${y1}" class="side"/>`);
    if (dia.pitch) {
      const [px0, py0, px1, py1] = dia.pitch;
      parts.push(`<rect x="${px0}" y="${py0}" width="${px1 - px0}" height="${py1 - py0}" fill="none" class="side"/>`);
      (dia.ezs || []).forEach(y => parts.push(`<line x1="${px0}" y1="${y}" x2="${px1}" y2="${y}" class="ez"/>`));
    }
    // Endzone line(s): the endzone is the area above the line.
    [].concat(dia.ez ?? []).forEach(y => parts.push(`<rect x="${x0}" y="${y0}" width="${w}" height="${Math.max(0, y - y0)}" fill="#dcebdd"/><line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" class="ez"/>`));
    (dia.cones || []).forEach(([x, y]) => parts.push(`<path d="M${x},${y - 0.9} L${x + 0.8},${y + 0.6} L${x - 0.8},${y + 0.6} Z" fill="#f08a24"/>`));
    // A run that starts away from every player continues a move from the
    // previous step: mark where that player came from with a faint outline.
    {
      const at = [...(dia.o || []), ...(dia.d || [])].map(([, x, y]) => [x, y]);
      const moves = [['run', 'ghost'], ['drun', 'ghost dg']];
      const ends = [...moves.map(([k]) => k), 'throw'].flatMap(k => (dia[k] || []).map(c => [c[2], c[3]]));
      moves.forEach(([k, cls]) => (dia[k] || []).forEach(([x, y]) => {
        if (![...at, ...ends].some(([px, py]) => Math.hypot(px - x, py - y) < 3)) parts.push(`<circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>`);
      }));
    }
    (dia.run || []).forEach(c => parts.push(`<path d="${curve(c)}" class="run" marker-end="url(#ar)"/>`));
    (dia.drun || []).forEach(c => parts.push(`<path d="${curve(c)}" class="drun" marker-end="url(#ad)"/>`));
    (dia.throw || []).forEach(c => parts.push(`<path d="${curve(c)}" class="thr" marker-end="url(#at)"/>`));
    // Optional movement (dotted): a run a player may or may not make.
    (dia.opt || []).forEach(c => parts.push(`<path d="${curve(c)}" class="opt" marker-end="url(#ao)"/>`));
    (dia.d || []).forEach(([l, x, y]) => parts.push(
      `<circle cx="${x}" cy="${y}" r="${r}" class="def"/>` + (small ? '' : `<text x="${x}" y="${y + 0.5}" class="dl">${esc(l)}</text>`)));
    let discDrawn = false; // only the first matching player holds the disc
    (dia.o || []).forEach(([l, x, y]) => {
      parts.push(`<circle cx="${x}" cy="${y}" r="${r}" class="off"/>` + (small ? '' : `<text x="${x}" y="${y + 0.5}" class="ol">${esc(l)}</text>`));
      if (!discDrawn && dia.disc !== undefined && dia.disc === l) {
        parts.push(`<circle cx="${x + 1.1}" cy="${y - 1.1}" r="0.65" class="disc"/>`);
        discDrawn = true;
      }
    });
    (dia.note || []).forEach(([t, x, y]) => parts.push(`<text x="${x}" y="${y}" class="nt">${esc(t)}</text>`));
    return `<svg class="dia" viewBox="${x0} ${y0} ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Drill diagram">
      <defs>
        <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1f5fbf"/></marker>
        <marker id="ad" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#c62828"/></marker>
        <marker id="at" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#3a3a3a"/></marker>
        <marker id="ao" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6b7a8c"/></marker>
      </defs>${parts.join('')}</svg>`;
  }

  // Thumbnail for drills without a picture: a simple category pictogram.
  const CAT_ICON = {
    Fundamentals: { view: [0, 0, 30, 24], o: [['A', 8, 12], ['B', 22, 12]], disc: 'A', throw: [[8, 12, 22, 12, -3]] },
    Agility: { view: [0, 0, 30, 24], cones: [[6, 18], [12, 8], [18, 18], [24, 8]], o: [['A', 4, 20]], run: [[4, 20, 12, 9, 2], [12, 9, 18, 17, 2], [18, 17, 25, 8, 2]] },
    default: { view: [0, 0, 30, 24], o: [['A', 10, 18], ['B', 20, 10]], d: [['', 18, 13]], disc: 'A', run: [[20, 10, 24, 18, -2]], throw: [[10, 18, 24, 17, -2]] },
  };

  function thumb(d) {
    if (d.thumb) return `<img src="${d.thumb}" alt="" loading="lazy">`;
    if (d.steps) {
      // Use the busiest step (most movement) as the card picture.
      const busy = s => ((s.dia.run || []).length + (s.dia.throw || []).length + (s.dia.drun || []).length);
      const best = d.steps.filter(s => s.dia).sort((a, b) => busy(b) - busy(a))[0];
      if (best) return diagram(best.dia, true);
    }
    return diagram(CAT_ICON[d.cat] || CAT_ICON.default, true);
  }

  const SRC = { flik: 'Flik', ultiplays: 'Ultiplays', discin: 'Disc In', football: 'Football', playspedia: 'Playspedia' };

  // Playspedia animations (they can't be embedded, so these are links).
  // [title, play id, creator]
  const P = (t, id, by) => ({ t, url: 'https://playspedia.com/play/' + id, by });
  const ANIM = {
    // concept pages
    'vert-stack': [P('Strike progression', 23996, 'DavidNguyen'), P('Around progression', 23995, 'DavidNguyen'),
      P('Vertical stack clearing', 23971, 'Wumbologist'), P('Centre / fore-side dump set', 23997, 'DavidNguyen')],
    'handler-movement': [P('Break-side reset system', 24159, 'DavidNguyen'), P('Around progression', 23995, 'DavidNguyen')],
    'defence': [P('What is a force?', 16335, 'PDGAreject'), P('Person defence: straight up', 21667, 'sarahallred'), P('Person defence: force deep', 21668, 'sarahallred')],
    'switching': [P('Bracketing', 3019, 'tommybradycarpenter')],
    'outdoor-zones': [P('Junk defence on a vert stack', 12151, 'abdnultimate')],
    'beating-zones': [P('Zone offence: crash and swing', 27365, 'Playspedia'), P('Zone offence: disc in the middle', 25981, 'AlanYi')],
    'endzone-outdoors': [P('Endzone flood', 24054, 'prairiesurge'), P('Hex endzone (iso)', 24868, 'Wumbologist')],
    'endzone-indoors': [P('Indoor endzone vs person defence (4v4)', 23183, 'JoelT'), P('Indoor endzone vs zone (4v4)', 23184, 'JoelT')],
    'indoors': [P('5v5 open-side horizontal flow', 25935, 'drcurtis'), P('Weave (indoor)', 25755, 'vasterasultimate')],
    'iso': [P('Weave (indoor)', 25755, 'vasterasultimate'), P('5v5 open-side horizontal flow', 25935, 'drcurtis')],
    'offence': [P('Flood (disguised side stack)', 6953, 'davidfriedman'), P('Side stack pull play', 13111, 'ispeterscooper')],
    // drills
    'drill-bracket-back-of-stack': [P('Bracketing', 3019, 'tommybradycarpenter')],
    'drill-junk-zone-roles': [P('Junk defence on a vert stack', 12151, 'abdnultimate')],
    'drill-zone-popper-options': [P('Zone offence: crash and swing', 27365, 'Playspedia'), P('Zone offence: disc in the middle', 25981, 'AlanYi')],
    'drill-zone-flood-weak-side': [P('Zone offence: disc in the middle', 25981, 'AlanYi')],
    'drill-flood-side-stack': [P('Endzone flood', 24054, 'prairiesurge'), P('Flood (disguised side stack)', 6953, 'davidfriedman')],
    'drill-the-play-reset-strike': [P('Strike progression', 23996, 'DavidNguyen')],
  };
  function animBox(key) {
    const a = ANIM[key]; if (!a) return '';
    return `<aside class="anims"><h3>▶ Watch it animated</h3><ul>${a.map(x =>
      `<li><a href="${x.url}" target="_blank" rel="noopener">${esc(x.t)}</a> <span class="muted">by ${esc(x.by)} on Playspedia</span></li>`).join('')}</ul>
      <p class="muted">Step-by-step animations from Playspedia's community playbooks. They open on Playspedia.</p></aside>`;
  }
  const badge = d => `<span class="pl" title="Players">👤 ${esc(d.players)}</span>`;
  const lvl = d => d.level ? `<span class="lvl lvl-${d.level.toLowerCase()}${d.levelGuess ? ' guess' : ''}" title="${esc(d.levelGuess ? d.levelSrc : 'Level from: ' + d.levelSrc)}">${esc(d.level)}${d.levelGuess ? '*' : ''}</span>` : '';
  const facts = d => `${d.time ? `<span class="fact" title="Time (as given by the source)">⏱ ${esc(d.time)}</span>` : ''}${d.equip.length ? `<span class="fact" title="Equipment">🧰 ${esc(d.equip.join(', '))}</span>` : ''}`;

  // ---------- Session builder: several named plans, each with drill timings ----------
  // Stored per browser as { current: name, plans: { name: { ids: [...], mins: {id: n}, start: 'HH:MM', notes: '' } } }.
  // Older single-list data ('cu-session') is migrated into a plan called "My session".
  const SKEY = 'cu-sessions';
  let store = (() => {
    try {
      const s = JSON.parse(localStorage.getItem(SKEY));
      if (s && s.plans && Object.keys(s.plans).length) return s;
      const old = JSON.parse(localStorage.getItem('cu-session')) || [];
      return { current: 'My session', plans: { 'My session': { ids: old, mins: {}, start: '', notes: '' } } };
    } catch (e) { return { current: 'My session', plans: { 'My session': { ids: [], mins: {}, start: '', notes: '' } } }; }
  })();
  const plan = () => store.plans[store.current] || (store.plans[store.current] = { ids: [], mins: {}, start: '', notes: '' });
  const savePicks = () => { try { localStorage.setItem(SKEY, JSON.stringify(store)); } catch (e) { /* ignore */ } };
  const inPlan = id => plan().ids.includes(id);

  // Share links: #session=<ids>&m=<minutes>&n=<name>&t=<start>. Opening one adds/replaces that named plan.
  function loadShared(q) {
    const p = new URLSearchParams('ids=' + q); // the first segment is the comma-separated drill ids
    const ids = (p.get('ids') || '').split(',').filter(id => BY_ID[id]);
    const mins = {}; (p.get('m') || '').split(',').forEach((m, i) => { if (ids[i] && +m) mins[ids[i]] = +m; });
    const name = (p.get('n') || 'Shared session').slice(0, 60);
    store.plans[name] = { ids, mins, start: p.get('t') || '', notes: p.get('x') || '' };
    store.current = name; savePicks();
  }
  const pickBtn = d => `<button type="button" class="pick${inPlan(d.id) ? ' on' : ''}" data-pick="${d.id}" title="Add to “${esc(store.current)}”">${inPlan(d.id) ? '✓ In session' : '+ Session'}</button>`;
  function sessionBar() {
    const n = plan().ids.length;
    return `<div class="sessbar${n ? '' : ' empty'}"><span>🗒 <strong>${esc(store.current)}</strong>: ${n} drill${n === 1 ? '' : 's'}</span>
      ${n ? '<a class="btn-link" href="#session">View, time &amp; print →</a>' : '<span><em>Tick “+ Session” on drills, or </em><a class="btn-link" href="#session">start from a ready-made plan →</a></span>'}</div>`;
  }
  function wirePicks(root) {
    root.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const id = b.dataset.pick, p = plan();
      p.ids = inPlan(id) ? p.ids.filter(x => x !== id) : [...p.ids, id];
      savePicks();
      b.classList.toggle('on', inPlan(id)); b.textContent = inPlan(id) ? '✓ In session' : '+ Session';
      const bar = root.querySelector('.sessbar'); if (bar) bar.outerHTML = sessionBar();
    }));
  }

  // Clock helpers for the running schedule.
  const toMin = t => { const m = /^(\d{1,2}):(\d{2})$/.exec(t || ''); return m ? +m[1] * 60 + +m[2] : null; };
  const clock = m => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  function shareLink() {
    const p = plan(), ids = p.ids.filter(id => BY_ID[id]);
    const q = new URLSearchParams({ m: ids.map(id => p.mins[id] || 0).join(','), n: store.current });
    if (p.start) q.set('t', p.start);
    if (p.notes) q.set('x', p.notes.slice(0, 300));
    return location.href.split('#')[0] + '#session=' + ids.join(',') + '&' + q.toString();
  }

  // The current plan in the shape used for PDFs and publishing.
  function planData() {
    const p = plan();
    return { name: store.current, start: p.start || '', notes: p.notes || '', items: p.ids.filter(id => BY_ID[id]).map(id => ({ id, mins: +p.mins[id] || 0 })) };
  }

  function session() {
    const p = plan();
    const list = p.ids.map(id => BY_ID[id]).filter(Boolean);
    const total = list.reduce((a, d) => a + (+p.mins[d.id] || 0), 0);
    let t = toMin(p.start);
    const names = Object.keys(store.plans);
    return `<div class="sesstop noprint">
  <label>Plan <select id="ss-plan">${names.map(n => `<option${n === store.current ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
  <button type="button" class="btn ghost" id="ss-new">+ New plan</button>
  <button type="button" class="btn ghost" id="ss-rename">Rename</button>
  <button type="button" class="btn ghost" id="ss-dup">Duplicate</button>
  <button type="button" class="btn ghost danger" id="ss-del">Delete plan</button>
</div>
<details class="templates noprint"${list.length ? '' : ' open'}><summary>Start from a ready-made plan</summary>
  <p class="muted">Each template only uses drills from the library. Timings are left blank so you can set them for your group; loading one makes a new plan and leaves your others alone.</p>
  <div class="forgrid">${TEMPLATES.map(t => `<button type="button" class="tplcard" data-tpl="${t.id}"><strong>${esc(t.name)}</strong><span>${esc(t.length)} · ${t.ids.filter(id => BY_ID[id]).length} drills</span><small>${t.ids.filter(id => BY_ID[id]).map(id => esc(BY_ID[id].title)).join(' → ')}</small></button>`).join('')}</div>
</details>
<h2 class="sessname">${esc(store.current)}</h2>
<div class="sessmeta">
  <label>Start time <input type="time" id="ss-start" value="${esc(p.start || '')}"></label>
  <span class="sesstotal">Total: <strong>${total} min</strong>${toMin(p.start) !== null && total ? ` (finishes ${clock(toMin(p.start) + total)})` : ''}</span>
</div>
<label class="sessnotes noprint">Notes <textarea id="ss-notes" rows="2" placeholder="Pitch, kit, focus for the session…">${esc(p.notes || '')}</textarea></label>
${p.notes ? `<p class="sessnotes-print">${esc(p.notes)}</p>` : ''}
${window.Coach ? Coach.panel() : ''}
<div class="sesstools noprint"><button type="button" class="btn" id="ss-print">📄 Save as PDF</button>
  <button type="button" class="btn" id="ss-copy">🔗 Copy share link</button>
  <button type="button" class="btn ghost" id="ss-clear">Clear drills</button>
  <input type="text" readonly id="ss-link" value="${esc(shareLink())}"></div>
${list.length ? '' : '<p class="muted">No drills in this plan yet. Go to the <a href="#drills">Drill Library</a> and tap “+ Session” on the ones you want; they go into whichever plan is selected here.</p>'}
<ol class="sesslist">${list.map((d, i) => {
      const m = +p.mins[d.id] || 0;
      const slot = t !== null && m ? `${clock(t)}–${clock(t + m)}` : '';
      if (t !== null) t += m;
      return `
  <li><div class="sesshead"><h3><a href="#drill-${d.id}">${esc(d.title)}</a></h3>
    <span class="sessctl"><span class="slot">${slot}</span>
      <label class="mins"><input type="number" min="0" max="180" step="5" data-min="${d.id}" value="${m || ''}" placeholder="–"> min</label>
      <span class="noprint"><button type="button" data-mv="${i},-1" ${i ? '' : 'disabled'} title="Move up">↑</button><button type="button" data-mv="${i},1" ${i < list.length - 1 ? '' : 'disabled'} title="Move down">↓</button><button type="button" data-rm="${d.id}" title="Remove">✕</button></span></span></div>
    <div class="dmeta">${badge(d)}${lvl(d)}<span class="cat">${esc(d.cat)}</span>${facts(d)}</div>
    <p>${esc(d.summary)}</p>${d.setup ? `<p class="muted"><strong>Setup:</strong> ${esc(d.setup)}</p>` : ''}
    <div class="sessdia">${(d.steps || []).filter(s => s.dia).slice(0, 2).map(s => diagram(s.dia, false)).join('')}</div></li>`;
    }).join('')}
</ol>`;
  }

  function wireSession(root, rerender) {
    const p = plan();
    const ask = (msg, def) => { const v = (window.prompt(msg, def) || '').trim().slice(0, 60); return v; };
    root.querySelector('#ss-plan').addEventListener('change', e => { store.current = e.target.value; savePicks(); rerender(); });
    root.querySelector('#ss-new').addEventListener('click', () => {
      const n = ask('Name for the new plan (e.g. "Tuesday beginners")', '');
      if (!n) return;
      if (!store.plans[n]) store.plans[n] = { ids: [], mins: {}, start: '', notes: '' };
      store.current = n; savePicks(); rerender();
    });
    root.querySelector('#ss-rename').addEventListener('click', () => {
      const n = ask('Rename this plan', store.current);
      if (!n || n === store.current || store.plans[n]) return;
      store.plans[n] = p; delete store.plans[store.current]; store.current = n; savePicks(); rerender();
    });
    root.querySelector('#ss-dup').addEventListener('click', () => {
      let n = store.current + ' (copy)'; while (store.plans[n]) n += ' ';
      store.plans[n] = JSON.parse(JSON.stringify(p)); store.current = n; savePicks(); rerender();
    });
    root.querySelector('#ss-del').addEventListener('click', () => {
      if (!window.confirm(`Delete the plan “${store.current}”?`)) return;
      delete store.plans[store.current];
      store.current = Object.keys(store.plans)[0] || 'My session'; plan(); savePicks(); rerender();
    });
    root.querySelector('#ss-start').addEventListener('change', e => { p.start = e.target.value; savePicks(); rerender(); });
    root.querySelector('#ss-notes').addEventListener('change', e => { p.notes = e.target.value; savePicks(); rerender(); });
    root.querySelectorAll('[data-min]').forEach(inp => inp.addEventListener('change', () => {
      const v = Math.max(0, Math.min(180, parseInt(inp.value, 10) || 0));
      if (v) p.mins[inp.dataset.min] = v; else delete p.mins[inp.dataset.min];
      savePicks(); rerender();
    }));
    root.querySelectorAll('[data-tpl]').forEach(b => b.addEventListener('click', () => {
      const t = TEMPLATES.find(x => x.id === b.dataset.tpl);
      newPlanFrom(`${t.name} (${t.length})`, t.ids); rerender();
    }));
    // The PDF uses a clean, dedicated document layout (see coach.js); the browser's
    // print dialog offers "Save as PDF".
    root.querySelector('#ss-print').addEventListener('click', () => window.Coach ? Coach.printPlan(planData()) : window.print());
    if (window.Coach) Coach.wirePanel(root, planData, rerender);
    const link = root.querySelector('#ss-link');
    root.querySelector('#ss-copy').addEventListener('click', () => {
      link.select();
      (navigator.clipboard ? navigator.clipboard.writeText(link.value) : Promise.reject()).catch(() => document.execCommand('copy'));
      root.querySelector('#ss-copy').textContent = '✓ Link copied';
    });
    root.querySelector('#ss-clear').addEventListener('click', () => { p.ids = []; p.mins = {}; savePicks(); rerender(); });
    root.querySelectorAll('[data-mv]').forEach(b => b.addEventListener('click', () => {
      const [i, dir] = b.dataset.mv.split(',').map(Number);
      [p.ids[i], p.ids[i + dir]] = [p.ids[i + dir], p.ids[i]]; savePicks(); rerender();
    }));
    root.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => {
      p.ids = p.ids.filter(x => x !== b.dataset.rm); delete p.mins[b.dataset.rm]; savePicks(); rerender();
    }));
  }

  // ---------- Related drills: share the most tags (same category breaks ties) ----------
  function related(d) {
    const score = x => x.tags.filter(t => d.tags.includes(t)).length * 2 + (x.cat === d.cat ? 1 : 0);
    const best = DRILLS.filter(x => x.id !== d.id).map(x => [score(x), x]).filter(([n]) => n >= 3)
      .sort((a, b) => b[0] - a[0]).slice(0, 4).map(([, x]) => x);
    if (!best.length) return '';
    return `<aside class="forthis related"><h2>Related drills</h2><div class="forgrid">${best.map(x =>
      `<a href="#drill-${x.id}"><strong>${esc(x.title)}</strong><span>👤 ${esc(x.players)} · ${esc(x.cat)}</span></a>`).join('')}</div></aside>`;
  }

  // ---------- Collections ("Start here") ----------
  function collection(id) {
    const c = COLLECTIONS.find(x => x.id === id);
    if (!c) return null;
    const ds = c.ids.map(i => BY_ID[i]).filter(Boolean);
    return { title: c.title, html: `<p class="lede">${esc(c.blurb)}</p>
<p class="noprint"><button type="button" class="btn-link asbtn" id="col-plan" data-col="${c.id}">🗒 Make a session plan from these drills</button> · <a href="#drills">All drills</a></p>
<div class="dlist">${ds.map(x => `
  <a class="dcard" href="#drill-${x.id}"><div class="dtext"><div class="dmeta">${badge(x)}${lvl(x)}<span class="cat">${esc(x.cat)}</span></div>
    <h3>${esc(x.title)}</h3><p>${esc(x.summary)}</p><div class="dfoot">${facts(x)}${pickBtn(x)}</div></div><div class="dthumb">${thumb(x)}</div></a>`).join('')}</div>` };
  }
  function wireCollection(root) {
    wirePicks(root);
    const b = root.querySelector('#col-plan');
    if (b) b.addEventListener('click', () => {
      const c = COLLECTIONS.find(x => x.id === b.dataset.col);
      newPlanFrom(c.title, c.ids);
      location.hash = '#session';
    });
  }

  // Create (or overwrite) a named plan from a list of drill ids.
  function newPlanFrom(name, ids) {
    let n = name; let k = 2;
    while (store.plans[n] && store.plans[n].ids.length) n = `${name} (${k++})`;
    store.plans[n] = { ids: ids.filter(id => BY_ID[id]), mins: {}, start: '', notes: '' };
    store.current = n; savePicks();
  }

  // ---------- "Drills for this" box on tactics pages ----------
  const FOR_PAGE = {
    'vert-stack': { tags: ['Vert stack'], ids: ['the-play-reset-strike', 'reverse-zipper', 'bracket-back-of-stack'] },
    'ho-stack': { tags: ['Ho stack'] },
    'handler-movement': { tags: ['Handler resets', 'Give and go'] },
    'endzone-outdoors': { tags: ['Endzone'] },
    'endzone-indoors': { tags: ['Endzone'], ids: ['freeze-game'] },
    'iso': { tags: ['Side stack'], ids: ['flood-side-stack'] },
    'indoors': { ids: ['overheads-progression', 'freeze-game', 'flood-side-stack'] },
    'beating-zones': { tags: ['Zone offence', 'Overheads'] },
    'outdoor-zones': { tags: ['Zone defence', 'Zone offence'] },
    'house-zone': { tags: ['Zone defence'] },
    'clamp-flood': { tags: ['Zone defence'], ids: ['flood-side-stack', 'zone-flood-weak-side'] },
    'defence': { tags: ['Team defence', 'Bracketing'] },
    'switching': { tags: ['Team defence', 'Bracketing'] },
    'boxing-out': { tags: ['Boxing out'] },
    'overheads': { tags: ['Overheads'] },
    'throwing': { tags: ['Breaking the mark', 'Wind'] },
    'backhand': { tags: ['Throwing'], max: 6 },
    'forehand': { tags: ['Throwing'], max: 6 },
    'offence': { tags: ['Flow offence', 'Hex', 'Fast break'] },
    'cutting-basics': { ids: ['shadow-continuation', 'all-in-one-receiving', 'attack-the-under'], tags: ['Cutting'], max: 8 },
    'catching': { ids: ['catching-box', 'reading-the-disc', 'all-in-one-receiving'], tags: ['Catching'], max: 8 },
    'side-stack': { tags: ['Side stack'] },
    'person-defence': { ids: ['danger-zone-boxes'], tags: ['Marking', 'Match defence'], max: 10 },
    'help-defence': { tags: ['Team defence', 'Switching', 'Bracketing'] },
  };
  // Diagram for a written page: same defender spacing and auto-framing as drills.
  function pageDiagram(dia) {
    const copy = JSON.parse(JSON.stringify(dia));
    fitViews({ steps: [{ dia: copy }] });
    return diagram(copy);
  }

  function forPage(slug) {
    const f = FOR_PAGE[slug]; if (!f) return animBox(slug);
    const seen = new Set(); const out = [];
    (f.ids || []).forEach(id => { if (BY_ID[id] && !seen.has(id)) { seen.add(id); out.push(BY_ID[id]); } });
    DRILLS.forEach(d => { if (!seen.has(d.id) && (f.tags || []).some(t => d.tags.includes(t))) { seen.add(d.id); out.push(d); } });
    if (!out.length) return animBox(slug);
    const max = f.max || 8;
    const tag = (f.tags || [])[0];
    return `<aside class="forthis"><h2>Drills for this</h2><div class="forgrid">${out.slice(0, max).map(d =>
      `<a href="#drill-${d.id}"><strong>${esc(d.title)}</strong><span>👤 ${esc(d.players)} · ${esc(d.cat)}</span></a>`).join('')}</div>
      ${tag ? `<p><a class="btn-link" href="#drills" data-drilltag="${esc(tag)}">See all ${out.length > max ? out.length + ' ' : ''}"${esc(tag)}" drills →</a></p>` : ''}</aside>${animBox(slug)}`;
  }
  const chips = (tags, active = []) => tags.map(t => `<span class="chip${active.includes(t) ? ' on' : ''}">${esc(t)}</span>`).join('');

  // ---------- Library view ----------
  // The library is split into pages of PER_PAGE drills. `page` lives in memory
  // (not saved), so it survives opening a drill and coming back, and is reset
  // to 1 whenever a filter changes.
  const PER_PAGE = 20;
  let page = 1;

  // First / Previous / Page x of y / Next / Last controls.
  function pager(pages) {
    if (pages <= 1) return '';
    const btn = (to, label, aria, off) =>
      `<button type="button" class="pg" data-page="${to}" aria-label="${aria}"${off ? ' disabled' : ''}>${label}</button>`;
    return `<nav class="dpager" aria-label="Drill pages">
      ${btn(1, '« First', 'First page', page === 1)}${btn(page - 1, '‹ Prev', 'Previous page', page === 1)}
      <span class="pg-now">Page <strong>${page}</strong> of ${pages}</span>
      ${btn(page + 1, 'Next ›', 'Next page', page === pages)}${btn(pages, 'Last »', 'Last page', page === pages)}
    </nav>`;
  }

  // Count line, the current page of drill cards and the pager, in one block so
  // the search box can swap it without re-rendering the filters.
  function results(shown) {
    const pages = Math.max(1, Math.ceil(shown.length / PER_PAGE));
    page = Math.min(Math.max(1, page), pages);
    const from = (page - 1) * PER_PAGE;
    const slice = shown.slice(from, from + PER_PAGE);
    const range = shown.length > PER_PAGE ? ` · drills ${from + 1}–${from + slice.length}` : '';
    return `<div class="dresults">
<p class="count">Showing <strong>${shown.length}</strong> of ${DRILLS.length}${range}</p>
<div class="dlist">
${slice.map(d => `
  <a class="dcard" href="#drill-${d.id}">
    <div class="dtext">
      <div class="dmeta">${badge(d)}${lvl(d)}<span class="cat">${esc(d.cat)}</span>${SRC[d.source] ? `<span class="src">via ${SRC[d.source]}</span>` : ''}</div>
      <h3>${esc(d.title)}</h3>
      <p>${esc(d.summary)}</p>
      <div class="chips">${chips(d.tags, state.tags)}</div>
      <div class="dfoot">${facts(d)}${pickBtn(d)}</div>
    </div>
    <div class="dthumb">${thumb(d)}</div>
  </a>`).join('') || '<p class="muted">No drills match those filters.</p>'}
</div>
${pager(pages)}
</div>`;
  }

  function list() {
    const shown = DRILLS.filter(matches);
    const playerOpts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 14]
      .map(n => `<option value="${n}"${state.players === n ? ' selected' : ''}>${n ? n + ' players' : 'Any number'}</option>`).join('');
    return `
<p class="lede">${DRILLS.length} drills for throwing, cutting, team play, defence and footwork. Filter by how many people you've got and what you want to work on.</p>
<div class="dfilter">
  <input type="search" id="df-q" placeholder="Search drills…" value="${esc(state.q)}">
  <label>Players <select id="df-p">${playerOpts}</select></label>
  <button type="button" class="reset" id="df-reset">Reset</button>
  <div class="row"><span class="lbl">Level</span>${['', ...LEVELS, 'Not graded'].filter(l => !l || DRILLS.some(d => (d.level || 'Not graded') === l)).map(l =>
    `<button type="button" class="fchip${state.level === l ? ' on' : ''}" data-level="${esc(l)}">${l || 'Any'} <small>${l ? DRILLS.filter(d => (d.level || 'Not graded') === l).length : ''}</small></button>`).join('')}<span class="lvlnote">* suggested level, not from the drill's source</span></div>
  <div class="row"><span class="lbl">Category</span>${['', ...CATS].map(c =>
    `<button type="button" class="fchip${state.cat === c ? ' on' : ''}" data-cat="${esc(c)}">${c || 'All'}</button>`).join('')}</div>
  <div class="row"><span class="lbl">Kit I have</span>${KIT.map(k =>
    `<button type="button" class="fchip${!state.have || state.have.includes(k) ? ' on' : ''}" data-have="${k}">${k}</button>`).join('')}<span class="lvlnote">untick what you haven't got: discs are assumed</span></div>
  <div class="row"><span class="lbl">Time</span><button type="button" class="fchip${state.timed ? ' on' : ''}" id="df-timed">Only drills with a set time <small>${DRILLS.filter(d => d.time).length}</small></button></div>
  <details class="row skills"${state.tags.length ? ' open' : ''}><summary><span class="lbl">Skills</span>${state.tags.length ? ` <em>${state.tags.length} selected</em>` : ''}</summary>
    ${TAGS.map(t => `<button type="button" class="fchip${state.tags.includes(t) ? ' on' : ''}" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}</details>
</div>
<div class="starthere"><h2>Start here</h2><div class="colgrid">${COLLECTIONS.map(c =>
  `<a class="colcard" href="#collection-${c.id}"><strong>${esc(c.title)}</strong><span>${c.ids.filter(id => BY_ID[id]).length} drills</span></a>`).join('')}
  <a class="colcard tpl" href="#session"><strong>🗒 Ready-made session plans</strong><span>${TEMPLATES.length} templates</span></a></div></div>
${sessionBar()}
${results(shown)}`;
  }

  function wireList(root, rerender) {
    // Any filter change goes back to page 1.
    const upd = () => { page = 1; save(); rerender(); };

    // Pager buttons: change page, redraw just the results, scroll to their top.
    const wirePager = () => root.querySelectorAll('.dpager [data-page]').forEach(b => b.addEventListener('click', () => {
      page = +b.dataset.page;
      swapResults();
      root.querySelector('.dresults').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    // Re-render only the results block (so the search box keeps focus).
    const swapResults = () => {
      const tmp = document.createElement('div'); tmp.innerHTML = results(DRILLS.filter(matches));
      root.querySelector('.dresults').replaceWith(tmp.firstElementChild);
      wirePicks(root.querySelector('.dresults'));
      wirePager();
    };

    const q = root.querySelector('#df-q');
    q.addEventListener('input', () => { state.q = q.value; page = 1; save(); swapResults(); });
    wirePager();
    root.querySelector('#df-p').addEventListener('change', e => { state.players = +e.target.value; upd(); });
    root.querySelector('#df-reset').addEventListener('click', () => { state = { q: '', players: 0, cat: '', tags: [], level: '', have: null, timed: false }; upd(); });
    root.querySelectorAll('[data-have]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.have, cur = state.have || KIT.slice();
      state.have = cur.includes(k) ? cur.filter(x => x !== k) : [...cur, k];
      if (state.have.length === KIT.length) state.have = null;
      upd();
    }));
    root.querySelector('#df-timed').addEventListener('click', () => { state.timed = !state.timed; upd(); });
    root.querySelectorAll('[data-level]').forEach(b => b.addEventListener('click', () => { state.level = b.dataset.level; upd(); }));
    wirePicks(root);
    root.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => { state.cat = b.dataset.cat; upd(); }));
    root.querySelectorAll('[data-tag]').forEach(b => b.addEventListener('click', () => {
      const t = b.dataset.tag;
      state.tags = state.tags.includes(t) ? state.tags.filter(x => x !== t) : [...state.tags, t];
      upd();
    }));
  }

  // Attribution line under a structured drill, by where it came from.
  function creditLine(d) {
    const also = (d.alsoFrom || []).length ? `<p class="credit">Variants also from ${d.alsoFrom.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`).join(' and ')}.</p>` : '';
    return creditCore(d) + also;
  }
  function creditCore(d) {
    const link = (url, text) => `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
    switch (d.source) {
      case 'flik':
        return `<p class="credit">Adapted from ${link(d.url, `"${esc(d.title.replace(/ \(.*\)$/, ''))}" by ${esc(d.credit)} on Flik`)}, rewritten and redrawn for Cranfield Ultimate. The original has an animated version.</p>`;
      case 'ultiplays':
        return `<p class="credit">Adapted from ${link(d.url, 'the Ultiplays playbook')}, rewritten and redrawn for Cranfield Ultimate. The original has an animated version.</p>`;
      case 'discin':
        return `<p class="credit">Based on ${link(d.url, 'a video by Disc In (@ultimatefrisbee_training) on Instagram')}, written up and drawn for Cranfield Ultimate. Watch the original to see it in action.</p>`;
      case 'web':
        return `<p class="credit">Adapted from ${(d.credits || []).map(([t, u]) => link(u, esc(t))).join(' and ')}, rewritten and drawn for Cranfield Ultimate.</p>`;
      case 'playspedia':
        return `<p class="credit">Adapted from ${link(d.url, `"${esc(d.title.split(':')[0])}" by ${esc(d.credit)} on Playspedia`)}, reworded and redrawn for Cranfield Ultimate. The original has a step-by-step animation.</p>`;
      case 'football':
        return '<p class="credit">A standard American football defensive-back / combine drill, adapted for ultimate.</p>';
      default:
        // Club drills: credit any outside source the write-up drew on.
        return (d.credits || []).length
          ? `<p class="credit">Written up with help from ${d.credits.map(([t, u]) => link(u, esc(t))).join(' and ')}.</p>` : '';
    }
  }

  // ---------- Detail view ----------
  function detail(id) {
    const d = BY_ID[id];
    const meta = `<div class="dmeta big">${badge(d)}${lvl(d)}<span class="cat">${esc(d.cat)}</span>${facts(d)}${pickBtn(d)}</div>
      <p class="lede">${esc(d.summary)}</p><div class="chips">${chips(d.tags)}</div>`;
    let body;
    if (d.steps) {
      body = `
${d.srcnote ? `<p class="srcnote">ℹ️ ${esc(d.srcnote)}</p>` : ''}
${(d.videos || []).map(v => v.yt ? `<div class="video" data-yt="${esc(v.yt)}"></div>` : `<div class="video" data-drive="${esc(v.drive)}"></div>`).join('')}
<h2>Setup</h2><p>${esc(d.setup)}</p>
${d.rotation ? `<p class="muted"><strong>Rotation:</strong> ${esc(d.rotation)}</p>` : ''}
${d.rules ? `<h2>Rules</h2><ul>${d.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
${d.steps.length ? `<h2>${d.steps.length > 1 ? 'Steps' : 'How it runs'}</h2>` : ''}
<div class="dsteps">${d.steps.map((s, i) => `
  <div class="dstep">${s.dia ? diagram(s.dia) : ''}<div class="body">${d.steps.length > 1 ? `<h4>Step ${i + 1}</h4>` : ''}<p>${esc(s.text)}</p></div></div>`).join('')}
</div>
${d.steps.length ? '' : '<!--'}<p class="legend dkey"><span class="k off"></span>Offence <span class="k def"></span>Defence <span class="k disc"></span>Disc <span class="k run"></span>Run <span class="k thr"></span>Throw <span class="k opt"></span>Optional run <span class="k cone"></span>Cone <span class="k ghost"></span>Where a player moved from</p>${d.steps.length ? '' : '-->'}
${d.progressions ? `<h2>Progressions</h2><ul>${d.progressions.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
${(d.tips || []).length ? `<h2>Coaching points</h2><ul>${d.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
${d.source === 'playspedia' ? `<p><a class="btn-link" href="${d.url}" target="_blank" rel="noopener">▶ Watch the animation on Playspedia</a></p>` : ''}
${related(d)}
${animBox('drill-' + d.id)}
${creditLine(d)}`;
    } else {
      body = d.html;
    }
    const i = DRILLS.indexOf(d);
    const nav = (x, lbl) => x ? `<a href="#drill-${x.id}"><small>${lbl}</small>${esc(x.title)}</a>` : '<span></span>';
    return `<p><a href="#drills" class="back">← All drills</a></p>${meta}${body}
      <nav class="pager">${nav(DRILLS[i - 1], '← Previous drill')}${nav(DRILLS[i + 1], 'Next drill →')}</nav>`;
  }

  window.DrillLib = {
    list, detail, wireList, BY_ID, LEGACY, session, wireSession, wirePicks, loadShared, forPage, collection, wireCollection, diagram, pageDiagram, planData,
    setTag(tag) { state = { q: '', players: 0, cat: '', tags: [tag], level: '' }; page = 1; save(); },
    setCategory(cat) { state = { q: '', players: 0, cat, tags: [], level: '' }; page = 1; save(); },
    // For site search.
    index: DRILLS.map(d => ({ slug: 'drill-' + d.id, title: d.title, group: 'Drill · ' + d.cat,
      text: (d.title + ' ' + d.summary + ' ' + d.tags.join(' ') + ' ' + (d.html || '') + ' ' + (d.setup || '')).replace(/<[^>]+>/g, ' ').toLowerCase() })),
  };
})();
