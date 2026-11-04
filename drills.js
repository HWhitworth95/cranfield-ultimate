// Drill library: filterable card list (players / category / skills / text)
// plus a detail view per drill. Combines the club's own drills (CLUB_DRILLS,
// generated from the old site) with reworded Flik free drills (FLIK_DRILLS).
// Exposes window.DrillLib = { list, detail, routes, index }.

(function () {
  'use strict';

  const DRILLS = [
    ...CLUB_DRILLS,
    ...FLIK_DRILLS.map(d => ({ ...d, source: 'flik' })),
    ...ULTI_DRILLS.map(d => ({ ...d, source: 'ultiplays' })),
  ];
  // Fit every diagram of a drill to the union of its action (players, cones,
  // arrow ends) with padding, so all steps share one tight, consistent frame.
  function fitViews(d) {
    if (!d.steps) return;
    const dias = d.steps.map(st => st.dia).filter(Boolean);
    if (!dias.length || dias.some(x => x.pitch)) return; // full mini-pitch drawings keep their frame
    const xs = [], ys = [];
    const add = (x, y) => { xs.push(x); ys.push(y); };
    dias.forEach(x => {
      ['o', 'd'].forEach(k => (x[k] || []).forEach(([, px, py]) => add(px, py)));
      (x.cones || []).forEach(([cx, cy]) => add(cx, cy));
      [].concat(x.ez ?? []).forEach(y => ys.push(y - 2));
      ['run', 'drun', 'throw'].forEach(k => (x[k] || []).forEach(([x1, y1, x2, y2]) => { add(x1, y1); add(x2, y2); }));
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
  let state = load() || { q: '', players: 0, cat: '', tags: [] };

  function load() { try { return JSON.parse(localStorage.getItem('cu-drill-filter')); } catch (e) { return null; } }
  function save() { try { localStorage.setItem('cu-drill-filter', JSON.stringify(state)); } catch (e) { /* ignore */ } }

  function matches(d) {
    if (state.players && minPlayers(d) > state.players) return false;
    if (state.cat && d.cat !== state.cat) return false;
    if (state.tags.length && !state.tags.every(t => d.tags.includes(t))) return false;
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
    (dia.run || []).forEach(c => parts.push(`<path d="${curve(c)}" class="run" marker-end="url(#ar)"/>`));
    (dia.drun || []).forEach(c => parts.push(`<path d="${curve(c)}" class="drun" marker-end="url(#ad)"/>`));
    (dia.throw || []).forEach(c => parts.push(`<path d="${curve(c)}" class="thr" marker-end="url(#at)"/>`));
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
        <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#17345c"/></marker>
        <marker id="ad" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#c99300"/></marker>
        <marker id="at" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#e0602b"/></marker>
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

  const SRC = { flik: 'Flik', ultiplays: 'Ultiplays' };
  const badge = d => `<span class="pl" title="Players">👤 ${esc(d.players)}</span>`;
  const chips = (tags, active = []) => tags.map(t => `<span class="chip${active.includes(t) ? ' on' : ''}">${esc(t)}</span>`).join('');

  // ---------- Library view ----------
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
  <div class="row"><span class="lbl">Category</span>${['', ...CATS].map(c =>
    `<button type="button" class="fchip${state.cat === c ? ' on' : ''}" data-cat="${esc(c)}">${c || 'All'}</button>`).join('')}</div>
  <details class="row skills"${state.tags.length ? ' open' : ''}><summary><span class="lbl">Skills</span>${state.tags.length ? ` <em>${state.tags.length} selected</em>` : ''}</summary>
    ${TAGS.map(t => `<button type="button" class="fchip${state.tags.includes(t) ? ' on' : ''}" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}</details>
</div>
<p class="count">Showing <strong>${shown.length}</strong> of ${DRILLS.length}</p>
<div class="dlist">
${shown.map(d => `
  <a class="dcard" href="#drill-${d.id}">
    <div class="dtext">
      <div class="dmeta">${badge(d)}<span class="cat">${esc(d.cat)}</span>${SRC[d.source] ? `<span class="src">via ${SRC[d.source]}</span>` : ''}</div>
      <h3>${esc(d.title)}</h3>
      <p>${esc(d.summary)}</p>
      <div class="chips">${chips(d.tags, state.tags)}</div>
    </div>
    <div class="dthumb">${thumb(d)}</div>
  </a>`).join('') || '<p class="muted">No drills match those filters.</p>'}
</div>`;
  }

  function wireList(root, rerender) {
    const upd = () => { save(); rerender(); };
    const q = root.querySelector('#df-q');
    q.addEventListener('input', () => {
      state.q = q.value; save();
      // Re-render only the list so the search box keeps focus.
      const tmp = document.createElement('div'); tmp.innerHTML = list();
      root.querySelector('.dlist').replaceWith(tmp.querySelector('.dlist'));
      root.querySelector('.count').replaceWith(tmp.querySelector('.count'));
    });
    root.querySelector('#df-p').addEventListener('change', e => { state.players = +e.target.value; upd(); });
    root.querySelector('#df-reset').addEventListener('click', () => { state = { q: '', players: 0, cat: '', tags: [] }; upd(); });
    root.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => { state.cat = b.dataset.cat; upd(); }));
    root.querySelectorAll('[data-tag]').forEach(b => b.addEventListener('click', () => {
      const t = b.dataset.tag;
      state.tags = state.tags.includes(t) ? state.tags.filter(x => x !== t) : [...state.tags, t];
      upd();
    }));
  }

  // ---------- Detail view ----------
  function detail(id) {
    const d = BY_ID[id];
    const meta = `<div class="dmeta big">${badge(d)}<span class="cat">${esc(d.cat)}</span></div>
      <p class="lede">${esc(d.summary)}</p><div class="chips">${chips(d.tags)}</div>`;
    let body;
    if (d.source === 'flik' || d.source === 'ultiplays') {
      body = `
<h2>Setup</h2><p>${esc(d.setup)}</p>
${d.rotation ? `<p class="muted"><strong>Rotation:</strong> ${esc(d.rotation)}</p>` : ''}
${d.rules ? `<h2>Rules</h2><ul>${d.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
<h2>${d.steps.length > 1 ? 'Steps' : 'How it runs'}</h2>
<div class="dsteps">${d.steps.map((s, i) => `
  <div class="dstep">${s.dia ? diagram(s.dia) : ''}<div class="body">${d.steps.length > 1 ? `<h4>Step ${i + 1}</h4>` : ''}<p>${esc(s.text)}</p></div></div>`).join('')}
</div>
<p class="legend dkey"><span class="k off"></span>Offence <span class="k def"></span>Defence <span class="k run"></span>Run <span class="k thr"></span>Throw <span class="k disc"></span>Disc</p>
<h2>Coaching points</h2><ul>${(d.tips || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul>
<p class="credit">${d.source === 'flik'
  ? `Adapted from <a href="${d.url}" target="_blank" rel="noopener">"${esc(d.title.replace(/ \(.*\)$/, ''))}" by ${esc(d.credit)} on Flik</a>`
  : `Adapted from <a href="${d.url}" target="_blank" rel="noopener">the Ultiplays playbook</a>`}, rewritten and redrawn for Cranfield Ultimate. The original has an animated version.</p>`;
    } else {
      body = d.html;
    }
    const i = DRILLS.indexOf(d);
    const nav = (x, lbl) => x ? `<a href="#drill-${x.id}"><small>${lbl}</small>${esc(x.title)}</a>` : '<span></span>';
    return `<p><a href="#drills" class="back">← All drills</a></p>${meta}${body}
      <nav class="pager">${nav(DRILLS[i - 1], '← Previous drill')}${nav(DRILLS[i + 1], 'Next drill →')}</nav>`;
  }

  window.DrillLib = {
    list, detail, wireList, BY_ID, LEGACY,
    setCategory(cat) { state = { q: '', players: 0, cat, tags: [] }; save(); },
    // For site search.
    index: DRILLS.map(d => ({ slug: 'drill-' + d.id, title: d.title, group: 'Drill · ' + d.cat,
      text: (d.title + ' ' + d.summary + ' ' + d.tags.join(' ') + ' ' + (d.html || '') + ' ' + (d.setup || '')).replace(/<[^>]+>/g, ' ').toLowerCase() })),
  };
})();
