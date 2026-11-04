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
        `<li><a href="#${i.slug}" class="${i.sub ? 'sub' : ''}" data-slug="${i.slug}">${i.slug === 'home' ? 'Home' : (i.label || BY_SLUG[i.slug].title)}${i.isNew ? '<span class="new">NEW</span>' : ''}</a></li>`).join('')}
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

    $content.innerHTML = (slug === 'drills' ? DrillLib.list() : page.html) + pager(slug);
    if (slug === 'drills') DrillLib.wireList($content, render);
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

  function renderDrill(id) {
    const d = DrillLib.BY_ID[id];
    document.title = `${d.title} · Cranfield Ultimate`;
    $title.textContent = d.title;
    $crumb.textContent = 'Drill Library';
    $hero.style.backgroundImage = `url("${asset((GROUP_OF['drills'] && BY_SLUG['drills'].hero) || HERO_DEFAULT)}")`;
    $content.innerHTML = DrillLib.detail(id);
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
  const q = document.getElementById('q');
  const results = document.getElementById('results');
  const INDEX = ALL.map(p => ({
    slug: p.slug, title: p.title, group: (GROUP_OF[p.slug] || {}).title || '',
    text: (p.title + ' ' + p.html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').toLowerCase(),
  })).concat(DrillLib.index);

  q.addEventListener('input', () => {
    const term = q.value.trim().toLowerCase();
    if (term.length < 2) { results.style.display = 'none'; return; }
    const hits = INDEX
      .map(p => ({ p, score: (p.title.toLowerCase().includes(term) ? 10 : 0) + (p.text.split(term).length - 1) }))
      .filter(h => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
    results.innerHTML = hits.length
      ? hits.map(h => `<a href="#${h.p.slug}">${h.p.title}<small>${h.p.group}</small></a>`).join('')
      : '<a><small>No matches</small></a>';
    results.style.display = 'block';
  });
  results.addEventListener('click', () => { results.style.display = 'none'; q.value = ''; });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) results.style.display = 'none'; });

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
