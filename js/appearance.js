/* Giri ♥ Sowmi — theme & font picker
 *
 * Sets data-theme / data-font on <html> and remembers the choice. Applied as
 * early as possible so a returning guest never sees the default flash first.
 */
(function () {
  'use strict';

  var THEMES = [
    { id: 'violet',   label: 'Violet',   swatch: ['#7C3AED', '#2563EB'] },
    { id: 'rose',     label: 'Rose',     swatch: ['#B7924E', '#E6BEC9'] },
    { id: 'midnight', label: 'Midnight', swatch: ['#201C46', '#A78BFA'] }
  ];
  var FONTS = [
    { id: 'classic',  label: 'Classic',  face: "'Great Vibes', cursive" },
    { id: 'romantic', label: 'Romantic', face: "'Parisienne', cursive" },
    { id: 'refined',  label: 'Refined',  face: "'Pinyon Script', cursive" }
  ];

  var KEY_T = 'gs-theme', KEY_F = 'gs-font';
  var root = document.documentElement;

  // a ?theme= / ?font= in the URL wins, so a specific look can be shared as a link
  var query = new URLSearchParams(location.search);

  function read(key, param, fallback, list) {
    var ok = function (v) { return list.some(function (x) { return x.id === v; }); };
    var q = query.get(param);
    if (ok(q)) return q;
    var v;
    try { v = localStorage.getItem(key); } catch (e) { /* private mode */ }
    return ok(v) ? v : fallback;
  }

  var theme = read(KEY_T, 'theme', 'violet', THEMES);
  var font  = read(KEY_F, 'font', 'classic', FONTS);

  function applyTheme(id) {
    theme = id;
    root.setAttribute('data-theme', id);
    try { localStorage.setItem(KEY_T, id); } catch (e) {}
    // keep the mobile browser chrome in step with the page
    var meta = document.querySelector('meta[name="theme-color"]');
    var col = getComputedStyle(root).getPropertyValue('--theme-meta').trim();
    if (meta && col) meta.setAttribute('content', col);
    // petals and blooms are painted from variables, so repaint them
    if (window.GSDecor && window.GSDecor.repaint) window.GSDecor.repaint();
    sync();
  }

  function applyFont(id) {
    font = id;
    root.setAttribute('data-font', id);
    try { localStorage.setItem(KEY_F, id); } catch (e) {}
    sync();
  }

  /* ——— the control ———
     built before the first applyTheme/applyFont call: sync() reads `wrap`, and
     calling it earlier threw on an undefined reference, killing the script
     before the button was ever appended. */
  var panelOpen = false;
  var wrap = document.createElement('div');
  wrap.className = 'appear';
  wrap.innerHTML =
    '<button class="appear-btn" type="button" aria-expanded="false" aria-controls="appearPanel" title="Theme &amp; font">' +
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
        '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-1.9-2-1.7-2-3.2a2 2 0 0 1 2-2h1.8A5.2 5.2 0 0 0 21 8.8C21 5.4 16.9 3 12 3Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<circle cx="8" cy="9" r="1.15" fill="currentColor"/><circle cx="12" cy="7.2" r="1.15" fill="currentColor"/><circle cx="7.2" cy="13.2" r="1.15" fill="currentColor"/>' +
      '</svg>' +
      '<span class="appear-label">Theme</span>' +
    '</button>' +
    '<div class="appear-panel" id="appearPanel" hidden>' +
      '<p class="appear-h">Theme</p>' +
      '<div class="appear-row" data-group="theme">' +
        THEMES.map(function (t) {
          return '<button type="button" class="sw" data-theme-id="' + t.id + '" title="' + t.label + '" aria-label="' + t.label + ' theme">' +
                 '<span class="sw-dot" style="background:linear-gradient(135deg,' + t.swatch[0] + ' 50%,' + t.swatch[1] + ' 50%)"></span>' +
                 '<span class="sw-name">' + t.label + '</span></button>';
        }).join('') +
      '</div>' +
      '<p class="appear-h">Font</p>' +
      '<div class="appear-row col" data-group="font">' +
        FONTS.map(function (f) {
          return '<button type="button" class="fo" data-font-id="' + f.id + '" aria-label="' + f.label + ' font">' +
                 '<span class="fo-sample" style="font-family:' + f.face + '">Giri &amp; Sowmi</span>' +
                 '<span class="fo-name">' + f.label + '</span></button>';
        }).join('') +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  var btn   = wrap.querySelector('.appear-btn');
  var panel = wrap.querySelector('.appear-panel');

  function sync() {
    if (!wrap) return;
    wrap.querySelectorAll('[data-theme-id]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.themeId === theme);
      b.setAttribute('aria-pressed', b.dataset.themeId === theme);
    });
    wrap.querySelectorAll('[data-font-id]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.fontId === font);
      b.setAttribute('aria-pressed', b.dataset.fontId === font);
    });
  }
  applyTheme(theme);
  applyFont(font);

  function toggle(open) {
    panelOpen = open;
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    wrap.classList.toggle('open', open);
  }

  btn.addEventListener('click', function () { toggle(!panelOpen); });
  panel.addEventListener('click', function (e) {
    var t = e.target.closest('[data-theme-id]');
    var f = e.target.closest('[data-font-id]');
    if (t) applyTheme(t.dataset.themeId);
    if (f) applyFont(f.dataset.fontId);
  });
  document.addEventListener('click', function (e) {
    if (panelOpen && !wrap.contains(e.target)) toggle(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panelOpen) { toggle(false); btn.focus(); }
  });
})();
