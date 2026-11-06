// Coach tools: a light login gate, "This week's session" (shared via Supabase),
// the home-page card, and the printable / save-as-PDF session document.
//
// The login only tidies the coach tools away: the credentials live in this
// file, so treat it as a convenience, not security.

(function () {
  const USER = 'Cranfield', PASS = 'Coaching';
  const KEY = 'cu-coach', LOCAL = 'cu-weekly-local';
  const cfg = window.CU_CONFIG || (typeof CU_CONFIG !== 'undefined' ? CU_CONFIG : {});
  const online = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------------------------------------------------------------- login
  const isCoach = () => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
  function logout() { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } }
  function loginModal(onDone) {
    const m = document.createElement('div');
    m.className = 'modal';
    m.innerHTML = `<form class="modal-box" autocomplete="off">
      <h3>Coach login</h3>
      <p class="muted">Logged-in coaches can publish a plan as <strong>This week's session</strong> on the home page.</p>
      <label>Username <input name="u" required></label>
      <label>Password <input name="p" type="password" required></label>
      <p class="err" hidden>That username or password isn't right.</p>
      <div class="modal-btns"><button type="button" class="btn ghost" data-x>Cancel</button><button class="btn">Log in</button></div>
    </form>`;
    document.body.appendChild(m);
    const f = m.querySelector('form');
    f.u.focus();
    m.querySelector('[data-x]').addEventListener('click', () => m.remove());
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (f.u.value.trim().toLowerCase() === USER.toLowerCase() && f.p.value === PASS) {
        try { localStorage.setItem(KEY, '1'); } catch (err) { /* ignore */ }
        m.remove(); onDone && onDone();
      } else f.querySelector('.err').hidden = false;
    });
  }

  // ---------------------------------------------------- shared storage
  const api = path => `${cfg.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`;
  // New-style keys (sb_publishable_...) go only in the apikey header; legacy anon keys (JWTs) also as a Bearer token.
  const headers = { apikey: cfg.SUPABASE_ANON_KEY, 'Content-Type': 'application/json',
    ...(String(cfg.SUPABASE_ANON_KEY).startsWith('eyJ') ? { Authorization: `Bearer ${cfg.SUPABASE_ANON_KEY}` } : {}) };
  let cache = null; // { data, updated_at } | 'none'

  async function fetchWeekly(force) {
    if (cache && !force) return cache === 'none' ? null : cache;
    if (!online) {
      let v = null; try { v = JSON.parse(localStorage.getItem(LOCAL)); } catch (e) { /* ignore */ }
      cache = v || 'none'; return v;
    }
    try {
      const r = await fetch(api('weekly_session?id=eq.1&select=data,updated_at'), { headers });
      const rows = r.ok ? await r.json() : [];
      cache = rows[0] || 'none';
    } catch (e) { cache = 'none'; }
    return cache === 'none' ? null : cache;
  }

  async function publish(data) {
    const row = { data, updated_at: new Date().toISOString() };
    if (!online) {
      try { localStorage.setItem(LOCAL, JSON.stringify(row)); } catch (e) { /* ignore */ }
      cache = row; return { ok: true, preview: true };
    }
    try {
      const r = await fetch(api('weekly_session'), {
        method: 'POST', headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify([{ id: 1, ...row }]),
      });
      if (!r.ok) return { ok: false, msg: `The database said no (${r.status}).` };
      cache = row; return { ok: true };
    } catch (e) { return { ok: false, msg: 'Couldn\'t reach the database. Check your connection.' }; }
  }

  // ---------------------------------------------------- formatting helpers
  const toMin = t => { const m = /^(\d{1,2}):(\d{2})$/.exec(t || ''); return m ? +m[1] * 60 + +m[2] : null; };
  const clock = m => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const niceDate = iso => { if (!iso) return ''; const d = new Date(iso + 'T12:00:00'); return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); };
  const ago = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); };

  // Expand a stored plan into rows with slot times.
  function rows(plan) {
    const L = window.DrillLib;
    let t = toMin(plan.start);
    return (plan.items || []).map(it => {
      const d = L.BY_ID[it.id]; const m = +it.mins || 0;
      const slot = t !== null && m ? `${clock(t)}–${clock(t + m)}` : (t !== null ? clock(t) : '');
      if (t !== null) t += m;
      return { d, m, slot };
    }).filter(r => r.d);
  }
  const total = plan => (plan.items || []).reduce((a, it) => a + (+it.mins || 0), 0);

  // The full, printable session document (used for PDFs and the this-week page).
  function doc(plan, opts = {}) {
    const L = window.DrillLib; const rs = rows(plan); const tot = total(plan);
    const start = toMin(plan.start);
    const when = [plan.date ? niceDate(plan.date) : '', plan.start ? `${plan.start}${tot && start !== null ? '–' + clock(start + tot) : ''}` : ''].filter(Boolean).join(' · ');
    const kit = [...new Set(rs.flatMap(r => r.d.equip || []))];
    return `<article class="sdoc">
  <header class="sdoc-head">
    <div class="sdoc-brand">CRANFIELD ULTIMATE · ${esc(opts.kicker || 'Session plan')}</div>
    <h1>${esc(plan.name || 'Session plan')}</h1>
    <div class="sdoc-meta">${when ? `<span>📅 ${esc(when)}</span>` : ''}${tot ? `<span>⏱ ${tot} min</span>` : ''}<span>🧩 ${rs.length} drill${rs.length === 1 ? '' : 's'}</span>${kit.length ? `<span>🧰 ${esc(kit.join(', '))}</span>` : ''}</div>
    ${plan.notes ? `<p class="sdoc-notes">${esc(plan.notes)}</p>` : ''}
  </header>
  <table class="sdoc-tt"><thead><tr><th>Time</th><th>Drill</th><th>Focus</th><th>Players</th></tr></thead><tbody>
    ${rs.map((r, i) => `<tr><td class="t">${esc(r.slot || (r.m ? r.m + ' min' : '–'))}${r.slot && r.m ? `<small>${r.m} min</small>` : ''}</td>
      <td><strong>${i + 1}. ${esc(r.d.title)}</strong></td><td>${esc(r.d.cat)}${r.d.tags && r.d.tags.length ? ' · ' + esc(r.d.tags.slice(0, 2).join(', ')) : ''}</td><td>${esc(r.d.players)}</td></tr>`).join('')}
  </tbody></table>
  ${rs.map((r, i) => {
    const d = r.d;
    const steps = (d.steps || []);
    return `<section class="sdoc-drill">
    <div class="sdoc-dh"><span class="n">${i + 1}</span><h2>${esc(d.title)}</h2><span class="sdoc-tag">${esc(r.slot || (r.m ? r.m + ' min' : ''))}</span></div>
    <p class="sdoc-sum">${esc(d.summary || '')}</p>
    <div class="sdoc-facts"><span>👤 ${esc(d.players)}</span>${d.level ? `<span>${esc(d.level)}${d.levelGuess ? '*' : ''}</span>` : ''}${(d.equip || []).length ? `<span>🧰 ${esc(d.equip.join(', '))}</span>` : ''}</div>
    ${d.setup ? `<p><strong>Setup.</strong> ${esc(d.setup)}</p>` : ''}
    ${d.rules ? `<ul class="sdoc-list">${d.rules.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    ${steps.length ? `<div class="sdoc-steps">${steps.map((s, j) => `<div class="sdoc-step">${s.dia ? L.diagram(s.dia, false) : ''}<p><strong>${steps.length > 1 ? 'Step ' + (j + 1) + '. ' : ''}</strong>${esc(s.text)}</p></div>`).join('')}</div>` : ''}
    ${d.rotation ? `<p><strong>Rotation.</strong> ${esc(d.rotation)}</p>` : ''}
    ${(d.tips || []).length ? `<p class="sdoc-cp"><strong>Coaching points</strong></p><ul class="sdoc-list">${d.tips.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    ${!d.steps && d.html ? `<p class="muted">Full details: see "${esc(d.title)}" in the online drill library.</p>` : ''}
  </section>`;
  }).join('')}
  <footer class="sdoc-foot">Key: <span class="k off"></span> offence <span class="k def"></span> defence <span class="k disc"></span> disc · solid line = run · dashed = throw · dotted = optional run<br>Cranfield Ultimate drill library · drills credited on their pages online.</footer>
</article>`;
  }

  // Print just the session document (the browser's "Save as PDF" makes the file).
  function printPlan(plan, kicker) {
    let host = document.getElementById('printdoc');
    if (!host) { host = document.createElement('div'); host.id = 'printdoc'; document.body.appendChild(host); }
    host.innerHTML = doc(plan, { kicker });
    document.body.classList.add('printing-doc');
    const done = () => { document.body.classList.remove('printing-doc'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    const title = document.title;
    document.title = `${plan.name || 'Session plan'}${plan.date ? ' ' + plan.date : ''}`; // becomes the PDF file name
    setTimeout(() => { window.print(); document.title = title; setTimeout(done, 500); }, 50);
  }

  // ---------------------------------------------------- home-page card
  function cardHtml(row) {
    const p = row.data; const rs = rows(p); const tot = total(p);
    const start = toMin(p.start);
    return `<section class="weekly">
  <div class="weekly-top"><span class="weekly-kicker">THIS WEEK'S SESSION</span>${p.date ? `<span class="weekly-date">${esc(niceDate(p.date))}${p.start ? ' · ' + esc(p.start) + (tot && start !== null ? '–' + clock(start + tot) : '') : ''}</span>` : ''}</div>
  <h2>${esc(p.name || 'Training')}</h2>
  ${p.notes ? `<p class="weekly-notes">${esc(p.notes)}</p>` : ''}
  <ol class="weekly-list">${rs.map(r => `<li><span class="wt">${esc(r.slot || (r.m ? r.m + ' min' : ''))}</span><a href="#drill-${r.d.id}">${esc(r.d.title)}</a><span class="wc">${esc(r.d.cat)}</span></li>`).join('')}</ol>
  <div class="weekly-btns"><a class="btn" href="#this-week">Open the full session →</a><button type="button" class="btn ghost" data-weekly-pdf>📄 Save as PDF</button>${tot ? `<span class="muted">${rs.length} drills · ${tot} min</span>` : ''}</div>
  <p class="weekly-upd">Updated ${esc(ago(row.updated_at))}${!online ? ' · preview on this device only' : ''}</p>
</section>`;
  }

  // Short "how to use this site" guide for coaches, shown on the home page.
  // Collapsed by default so it doesn't get in the way for players.
  // The login itself is deliberately not printed here: ask the committee.
  const GUIDE = `
    <details class="coach-guide noprint">
      <summary><span class="cg-icon">🧑‍🏫</span><span><strong>Coaches: how to use this site</strong><small>Plan a session, save it as a PDF, or publish it here</small></span></summary>
      <ol class="cg-steps">
        <li><span class="cg-num">1</span><div><h4>Build a session</h4>
          <p>Open the <a href="#session">Session Planner</a>. Add drills from the <a href="#drills">Drill Library</a> by ticking <em>+ Session</em>, or open <em>Start from a ready-made plan</em>. Type minutes against each drill and set a start time; the timetable fills in for you.</p>
          <p class="cg-tip">Name and save plans (e.g. “Tuesday beginners”) to reuse them. Saved plans stay on the device and browser you made them on.</p></div></li>
        <li><span class="cg-num">2</span><div><h4>Save it as a PDF</h4>
          <p>No login needed. In the planner press <em>📄 Save as PDF</em> and choose <em>Save as PDF</em> as the printer. Send the file to other coaches or print it for the pitch.</p>
          <p class="cg-tip">On iPhone: Print → Share → Save to Files.</p></div></li>
        <li><span class="cg-num">3</span><div><h4>Publish “This week's session”</h4>
          <p>In the planner, press <em>log in</em> and enter the coach login (ask the committee if you don't have it). Pick the session date and press <em>📣 Publish</em>. The plan appears at the top of this home page for everyone.</p>
          <p class="cg-tip">Publishing replaces last week's session, so save a PDF first if you want to keep it.</p></div></li>
      </ol>
    </details>`;

  async function mountHome(root) {
    root.insertAdjacentHTML('afterbegin', GUIDE);
    const slot = document.createElement('div');
    slot.className = 'weekly-slot';
    root.prepend(slot);
    const row = await fetchWeekly();
    if (!row || !root.contains(slot)) { slot.remove(); return; }
    slot.innerHTML = cardHtml(row);
    slot.querySelector('[data-weekly-pdf]').addEventListener('click', () => printPlan(row.data, "This week's session"));
  }

  async function weeklyPage(root) {
    root.innerHTML = '<p class="muted">Loading this week\'s session…</p>';
    const row = await fetchWeekly(true);
    if (!row) { root.innerHTML = '<p class="muted">No session has been published yet. Coaches can publish one from the <a href="#session">Session Planner</a>.</p>'; return; }
    root.innerHTML = `<p class="noprint sdoc-actions"><button type="button" class="btn" id="tw-pdf">📄 Save as PDF</button> <a href="#home">← Home</a> <span class="muted">Updated ${esc(ago(row.updated_at))}</span></p>` + doc(row.data, { kicker: "This week's session" });
    root.querySelector('#tw-pdf').addEventListener('click', () => printPlan(row.data, "This week's session"));
  }

  // ---------------------------------------------------- session-page panel
  function panel() {
    return `<div class="coachbar noprint">${isCoach()
      ? `<span>✅ Logged in as coach</span>
         <label>Session date <input type="date" id="cb-date"></label>
         <button type="button" class="btn publish" id="cb-publish">📣 Publish as This week's session</button>
         <button type="button" class="btn ghost" id="cb-logout">Log out</button>
         <span class="cb-msg" id="cb-msg"></span>`
      : `<span>Coaches: <button type="button" class="asbtn" id="cb-login">log in</button> to publish this plan as <strong>This week's session</strong> on the home page.</span>`}</div>`;
  }
  function wirePanel(root, getPlan, rerender) {
    const li = root.querySelector('#cb-login');
    if (li) li.addEventListener('click', () => loginModal(rerender));
    const lo = root.querySelector('#cb-logout');
    if (lo) lo.addEventListener('click', () => { logout(); rerender(); });
    const pb = root.querySelector('#cb-publish');
    if (pb) {
      const di = root.querySelector('#cb-date');
      const nextDay = () => { const d = new Date(); return d.toISOString().slice(0, 10); };
      di.value = nextDay();
      pb.addEventListener('click', async () => {
        const plan = getPlan();
        const msg = root.querySelector('#cb-msg');
        if (!plan.items.length) { msg.textContent = 'Add some drills first.'; return; }
        if (!window.confirm(`Publish "${plan.name}" as This week's session? It replaces whatever is on the home page now.`)) return;
        pb.disabled = true; msg.textContent = 'Publishing…';
        const res = await publish({ ...plan, date: di.value });
        pb.disabled = false;
        msg.innerHTML = res.ok ? (res.preview ? '✅ Saved on this device. Connect the online database to share it with the team.' : '✅ Published. It\'s on the home page now. <a href="#home">See it</a>')
          : '⚠️ ' + esc(res.msg);
      });
    }
  }

  window.Coach = { isCoach, loginModal, logout, fetchWeekly, publish, doc, printPlan, mountHome, weeklyPage, panel, wirePanel, online };
})();
