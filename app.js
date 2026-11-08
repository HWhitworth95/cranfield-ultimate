// Cranfield Ultimate site: hash router, navigation, search, lightbox and
// per-browser workout ticks. Page content lives in content.js / fitness.js.

(function () {
  'use strict';

  // ---------- Page registry ----------
  const ALL = [...SITE_PAGES, ...FITNESS_PAGES];
  const BY_SLUG = Object.fromEntries(ALL.map(p => [p.slug, p]));

  // Flattened nav order drives prev/next links.
  const ORDER = NAV.flatMap(g => g.items.map(i => i.slug)).filter(s => BY_SLUG[s]);

  // Group lookup for breadcrumbs / hero images.
  const GROUP_OF = {};
  NAV.forEach(g => g.items.forEach(i => { GROUP_OF[i.slug] = g; }));

  // ---------- Navigation ----------
  const menu = document.getElementById('menu');
  const openGroups = loadJSON('cu-open-groups', null);

  menu.innerHTML = NAV.map((g, gi) => `
    <div class="grp" data-g="${gi}">
      <button type="button"><span>${g.title}</span><span class="chev">▾</span></button>
      <ul>${g.items.filter(i => BY_SLUG[i.slug]).map(i =>
        `<li><a href="#${i.slug}" class="${i.sub ? 'sub' : ''}" data-slug="${i.slug}">${i.slug === 'home' ? 'Home' : (i.label || BY_SLUG[i.slug].title)}</a></li>`).join('')}${g.items.some(i => i.slug === 'drills') ? '<li><a href="#session" class="sub" data-slug="session">Session Planner</a></li><li><a href="#this-week" class="sub" data-slug="this-week">This Week\'s Session</a></li>' : ''}
      </ul>
    </div>`).join('');

  menu.querySelectorAll('.grp').forEach(el => {
    const gi = el.dataset.g;
    if (openGroups && openGroups[gi] === false) el.classList.add('closed');
    el.querySelector('button').addEventListener('click', () => {
      el.classList.toggle('closed');
      const state = {};
      menu.querySelectorAll('.grp').forEach(x => { state[x.dataset.g] = !x.classList.contains('closed'); });
      saveJSON('cu-open-groups', state);
    });
  });

  document.getElementById('burger').addEventListener('click', () => document.body.classList.toggle('nav-open'));

  // ---------- Rendering ----------
  const $title = document.getElementById('title');
  const $crumb = document.getElementById('crumb');
  const $hero = document.getElementById('hero');
  const $content = document.getElementById('content');

  function render() {
    let slug = location.hash.replace(/^#/, '') || 'home';

    // Drill library routes: #drills, #drill-<id>, and old #drills-<category> pages.
    if (DrillLib.LEGACY[slug]) {
      DrillLib.setCategory(DrillLib.LEGACY[slug]);
      location.replace('#drills');
      return;
    }
    if (slug.startsWith('session=')) { DrillLib.loadShared(location.hash.slice(9)); location.replace('#session'); return; }
    if (slug === 'session') return renderSession();
    if (slug === 'this-week') {
      document.title = "This week's session · Cranfield Ultimate";
      $title.textContent = "This Week's Session"; $crumb.textContent = 'Training';
      $hero.style.backgroundImage = `url("${asset(BY_SLUG['drills'].hero || HERO_DEFAULT)}")`;
      Coach.weeklyPage($content).then(() => wireZoom($content));
      if (lastSlug !== slug) window.scrollTo(0, 0); lastSlug = slug; return;
    }
    if (slug.startsWith('collection-')) {
      const c = DrillLib.collection(slug.slice(11));
      if (c) {
        document.title = c.title + ' · Cranfield Ultimate';
        $title.textContent = c.title; $crumb.textContent = 'Drill Library · Start here';
        $hero.style.backgroundImage = `url("${asset(BY_SLUG['drills'].hero || HERO_DEFAULT)}")`;
        $content.innerHTML = c.html; DrillLib.wireCollection($content);
        if (lastSlug !== slug) window.scrollTo(0, 0); lastSlug = slug; return;
      }
    }
    const drillId = slug.startsWith('drill-') ? slug.slice(6) : null;
    if (drillId && DrillLib.BY_ID[drillId]) return renderDrill(drillId);

    if (!BY_SLUG[slug]) slug = 'home';
    const page = BY_SLUG[slug];
    const group = GROUP_OF[slug];

    document.title = page.slug === 'home' ? 'Cranfield Ultimate' : `${page.title} · Cranfield Ultimate`;
    $title.textContent = page.title;
    $crumb.textContent = group && page.slug !== 'home' ? group.title : 'Cranfield University Ultimate';
    const heroImg = page.hero || (group && group.hero) || HERO_DEFAULT;
    $hero.style.backgroundImage = heroImg ? `url("${asset(heroImg)}")` : '';

    $content.innerHTML = (slug === 'drills' ? DrillLib.list() : page.html + DrillLib.forPage(slug)) + pager(slug);
    $content.querySelectorAll('[data-drilltag]').forEach(a => a.addEventListener('click', () => DrillLib.setTag(a.dataset.drilltag)));
    if (slug === 'drills') DrillLib.wireList($content, render);
    if (slug === 'home' && window.Coach) Coach.mountHome($content);
    // Diagrams inside written pages: <div class="pdia" data-key="..."> → PAGE_DIAS entry.
    $content.querySelectorAll('.pdia[data-key]').forEach(el => {
      const p = typeof PAGE_DIAS !== 'undefined' && PAGE_DIAS[el.dataset.key]; if (!p) return;
      el.innerHTML = `<figure class="pdfig">${DrillLib.pageDiagram(p.dia)}<figcaption>${p.cap}</figcaption></figure>`;
    });
    wireVideos($content);
    wireTicks($content);
    wireZoom($content);
    wireJumps($content);

    menu.querySelectorAll('a.on').forEach(a => a.classList.remove('on'));
    const link = menu.querySelector(`a[data-slug="${slug}"]`);
    if (link) {
      link.classList.add('on');
      link.closest('.grp').classList.remove('closed');
    }
    document.body.classList.remove('nav-open');
    if (lastSlug !== slug) window.scrollTo(0, 0);
    lastSlug = slug;
  }
  let lastSlug = null;

  function renderSession() {
    document.title = 'Session Plan · Cranfield Ultimate';
    $title.textContent = 'Session Plan';
    $crumb.textContent = 'Drill Library';
    $hero.style.backgroundImage = `url("${asset(BY_SLUG['drills'].hero || HERO_DEFAULT)}")`;
    $content.innerHTML = DrillLib.session();
    DrillLib.wireSession($content, renderSession);
    wireZoom($content);
    if (lastSlug !== 'session') window.scrollTo(0, 0);
    lastSlug = 'session';
  }

  function renderDrill(id) {
    const d = DrillLib.BY_ID[id];
    document.title = `${d.title} · Cranfield Ultimate`;
    $title.textContent = d.title;
    $crumb.textContent = 'Drill Library';
    $hero.style.backgroundImage = `url("${asset((GROUP_OF['drills'] && BY_SLUG['drills'].hero) || HERO_DEFAULT)}")`;
    $content.innerHTML = DrillLib.detail(id);
    DrillLib.wirePicks($content);
    wireVideos($content);
    wireZoom($content);
    menu.querySelectorAll('a.on').forEach(a => a.classList.remove('on'));
    const link = menu.querySelector('a[data-slug="drills"]');
    if (link) { link.classList.add('on'); link.closest('.grp').classList.remove('closed'); }
    document.body.classList.remove('nav-open');
    window.scrollTo(0, 0);
    lastSlug = 'drill-' + id;
  }

  function pager(slug) {
    const i = ORDER.indexOf(slug);
    if (i < 0) return '';
    const prev = ORDER[i - 1], next = ORDER[i + 1];
    const a = (s, dir) => s ? `<a href="#${s}"><small>${dir}</small>${BY_SLUG[s].title}</a>` : '<span></span>';
    return `<nav class="pager">${a(prev, '← Previous')}${a(next, 'Next →')}</nav>`;
  }

  // ---------- Videos ----------
  // Claude-hosted pages can't embed other sites, so show a link card there;
  // anywhere else (e.g. if the site is self-hosted) embed the player.
  const CAN_EMBED = !/claudeusercontent\.com$|claude\.ai$/.test(location.hostname);

  function wireVideos(root) {
    // Google Drive videos (publicly shared): embed the Drive player where allowed.
    root.querySelectorAll('[data-drive]').forEach(el => {
      const id = el.dataset.drive;
      const label = el.dataset.label || 'Video';
      if (CAN_EMBED) {
        el.innerHTML = `<iframe src="https://drive.google.com/file/d/${id}/preview" title="${label}" allow="autoplay" allowfullscreen loading="lazy"></iframe>`;
      } else {
        el.innerHTML = `<a class="vcard" href="https://drive.google.com/file/d/${id}/view" target="_blank" rel="noopener">
          <span class="play">▶</span><span><strong>${label}</strong><small>Opens in Google Drive</small></span></a>`;
      }
    });
    root.querySelectorAll('[data-yt]').forEach(el => {
      const id = el.dataset.yt;
      const label = el.dataset.label || 'Watch on YouTube';
      if (CAN_EMBED) {
        el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${label}" allowfullscreen loading="lazy"></iframe>`;
      } else {
        el.innerHTML = `<a class="vcard" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">
          <span class="play">▶</span><span><strong>${label}</strong><small>Opens on YouTube</small></span></a>`;
      }
    });
  }

  // ---------- Ticks (saved per browser) ----------
  function wireTicks(root) {
    const ticks = loadJSON('cu-ticks', {});
    root.querySelectorAll('input[data-tick]').forEach(cb => {
      cb.checked = !!ticks[cb.dataset.tick];
      cb.addEventListener('change', () => {
        const t = loadJSON('cu-ticks', {});
        t[cb.dataset.tick] = cb.checked;
        saveJSON('cu-ticks', t);
      });
    });
    root.querySelectorAll('[data-reset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const list = root.querySelector(`[data-track="${btn.dataset.reset}"]`);
        const t = loadJSON('cu-ticks', {});
        list.querySelectorAll('input[data-tick]').forEach(cb => { cb.checked = false; delete t[cb.dataset.tick]; });
        saveJSON('cu-ticks', t);
      });
    });
  }

  // ---------- "On this page" jump buttons ----------
  // Hash routing is used for pages, so in-page jumps scroll by heading text.
  function wireJumps(root) {
    root.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = [...root.querySelectorAll('h2, h3')].find(h => h.textContent.trim() === btn.dataset.goto);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ---------- Lightbox ----------
  const lb = document.getElementById('lb');
  lb.addEventListener('click', () => lb.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
  function wireZoom(root) {
    root.querySelectorAll('figure img, .step img').forEach(img => {
      img.addEventListener('click', () => { lb.querySelector('img').src = img.src; lb.classList.add('open'); });
    });
  }

  // ---------- Search ----------
  // Written pages are indexed section by section (split at <h2>/<h3>), so a hit can name
  // the section and jump straight to it. Drills are indexed whole.
  const q = document.getElementById('q');
  const results = document.getElementById('results');
  const strip = html => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
  // Diagram captions live in PAGE_DIAS, not in the page HTML: swap the placeholders for their captions.
  const withCaptions = html => html.replace(/<div class="pdia" data-key="([^"]+)"><\/div>/g,
    (m, k) => (typeof PAGE_DIAS !== 'undefined' && PAGE_DIAS[k]) ? ' ' + PAGE_DIAS[k].cap + ' ' : ' ');

  const INDEX = [];
  ALL.forEach(p => {
    const group = (GROUP_OF[p.slug] || {}).title || '';
    // Split before every h2/h3; the first chunk (before any heading) is the page intro.
    withCaptions(p.html).split(/(?=<h[23][^>]*>)/).forEach(chunk => {
      const m = chunk.match(/^<h[23][^>]*>([\s\S]*?)<\/h[23]>/);
      const heading = m ? strip(m[1]) : '';
      const raw = strip(chunk);
      if (!raw) return;
      INDEX.push({ slug: p.slug, title: p.title, heading, group, raw, text: (p.title + ' ' + raw).toLowerCase() });
    });
  });
  DrillLib.index.forEach(d => INDEX.push({ ...d, heading: '', raw: d.raw || d.text }));

  const esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  // A short snippet around the first match, with every search word highlighted.
  function snippet(raw, words) {
    const low = raw.toLowerCase();
    let at = -1; for (const w of words) { const i = low.indexOf(w); if (i >= 0 && (at < 0 || i < at)) at = i; }
    if (at < 0) return '';
    const from = Math.max(0, at - 40), to = Math.min(raw.length, at + 90);
    let txt = esc((from ? '…' : '') + raw.slice(from, to) + (to < raw.length ? '…' : ''));
    words.forEach(w => { txt = txt.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>'); });
    return txt;
  }

  let hits = [], sel = -1;
  function search() {
    const term = q.value.trim().toLowerCase();
    if (term.length < 2) { results.style.display = 'none'; return; }
    const words = term.split(/\s+/).filter(w => w.length > 1);
    const scored = [];
    INDEX.forEach(e => {
      if (!words.every(w => e.text.includes(w))) return;           // every word must appear
      const t = e.title.toLowerCase(), h = e.heading.toLowerCase();
      const multi = words.length > 1;
      // The exact phrase counts most; a word only earns a title/heading bonus when it starts a word there
      // (so "back" in "last back" doesn't favour "Backhand").
      let score = (e.text.split(term).length - 1) * (multi ? 4 : 1);
      if (t.includes(term)) score += 12; if (h.includes(term)) score += 8;
      words.forEach(w => {
        const startsWord = new RegExp('(^|[^a-z])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z]|$)');
        score += (e.text.split(w).length - 1) * 0.3 + (startsWord.test(t) ? 4 : 0) + (startsWord.test(h) ? 3 : 0);
      });
      scored.push({ e, score });
    });
    scored.sort((a, b) => b.score - a.score);
    // At most two sections from any one page, so one long page can't fill the list.
    const perPage = {}; hits = [];
    for (const s of scored) {
      perPage[s.e.slug] = (perPage[s.e.slug] || 0) + 1;
      if (perPage[s.e.slug] <= 2) hits.push(s.e);
      if (hits.length >= 12) break;
    }
    sel = -1;
    results.innerHTML = hits.length
      ? hits.map((e, i) => `<a href="#${e.slug}" data-i="${i}">${esc(e.title)}${e.heading ? ` <span class="sec">› ${esc(e.heading)}</span>` : ''}`
          + `<small>${esc(e.group)}</small><span class="snip">${snippet(e.raw, words)}</span></a>`).join('')
      : '<a><small>No matches</small></a>';
    results.style.display = 'block';
  }
  q.addEventListener('input', search);
  q.addEventListener('focus', () => { if (q.value.trim().length >= 2) search(); });

  // Arrow keys move through the results; Enter opens the selected (or first) one.
  q.addEventListener('keydown', e => {
    const links = [...results.querySelectorAll('a[data-i]')];
    if (!links.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links.forEach((a, i) => a.classList.toggle('sel', i === sel));
      links[sel].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault(); open(hits[Math.max(sel, 0)]);
    } else if (e.key === 'Escape') { results.style.display = 'none'; q.blur(); }
  });
  results.addEventListener('click', e => {
    const a = e.target.closest('a[data-i]'); if (!a) return;
    e.preventDefault(); open(hits[+a.dataset.i]);
  });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) results.style.display = 'none'; });

  // Go to the result, then scroll to its section and briefly highlight the search words.
  function open(hit) {
    if (!hit) return;
    const words = q.value.trim().toLowerCase().split(/\s+/).filter(w => w.length > 1);
    results.style.display = 'none'; q.value = ''; q.blur();
    if (location.hash !== '#' + hit.slug) location.hash = hit.slug; else render();
    setTimeout(() => jumpTo(hit.heading, words), 60);
  }
  function jumpTo(heading, words) {
    let section = $content;
    if (heading) {
      const h = [...$content.querySelectorAll('h2, h3')].find(x => x.textContent.replace(/\s+/g, ' ').trim() === heading);
      if (h) { h.scrollIntoView({ behavior: 'smooth', block: 'start' }); section = h; }
    }
    // Highlight matches in the heading's section (up to the next heading) or in the whole page.
    const nodes = [];
    for (let el = heading ? section : $content.firstElementChild; el; el = el.nextElementSibling) {
      if (heading && el !== section && /^H[23]$/.test(el.tagName)) break;
      nodes.push(el);
    }
    const re = new RegExp('(' + words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
    const marks = [];
    nodes.forEach(n => {
      const walker = document.createTreeWalker(n, NodeFilter.SHOW_TEXT, {
        acceptNode: t => t.parentElement.closest('svg, script, style, mark') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
      const texts = []; while (walker.nextNode()) texts.push(walker.currentNode);
      texts.forEach(t => {
        if (!re.test(t.nodeValue)) return; re.lastIndex = 0;
        const span = document.createElement('span');
        span.innerHTML = esc(t.nodeValue).replace(re, '<mark class="hit">$1</mark>');
        marks.push(...span.querySelectorAll('mark'));
        t.replaceWith(...span.childNodes);
      });
    });
    if (!heading && marks[0]) marks[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Fade the highlights out after a few seconds, leaving the text as it was.
    setTimeout(() => marks.forEach(m => m.classList.add('fade')), 2500);
    setTimeout(() => marks.forEach(m => m.replaceWith(document.createTextNode(m.textContent))), 4000);
  }

  // ---------- Helpers ----------
  function loadJSON(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }

  window.addEventListener('hashchange', render);
  render();
})();
