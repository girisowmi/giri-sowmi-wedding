/* Giri ♥ Sowmi — invitation viewer + playlist
 *
 * ─────────────────────────────────────────────────────────────
 *  PASTE YOUR SPOTIFY PLAYLIST LINK HERE
 *  Open the playlist in Spotify → Share → Copy link, and put it
 *  between the quotes. Albums, artists and single tracks work too.
 *  Leave it empty and the section shows a friendly placeholder.
 * ─────────────────────────────────────────────────────────────
 */
var SPOTIFY_LINK = 'https://open.spotify.com/playlist/1DPRu7Z3HIg1Kn5veZ84nS';

(function () {
  'use strict';

  /* ——————————————— invitation lightbox ——————————————— */

  // titles and captions are looked up at render time so they follow the
  // language toggle rather than being frozen at load
  function t(key, fallback) {
    return (window.GSi18n && window.GSi18n.t(key)) || fallback;
  }

  var GALLERIES = {
    formal: {
      titleKey: 'galFormal',
      download: './GiriSowmiWeddingInvitation.pdf',
      dlKey: 'dlPdf',
      pages: [
        { src: './assets/invite/page-1.jpg', capKey: 'capEnvelope' },
        { src: './assets/invite/page-2.jpg', capKey: 'capCouple' },
        { src: './assets/invite/page-3.jpg', capKey: 'capInvite' },
        { src: './assets/invite/page-4.jpg', capKey: 'capTamil' },
        { src: './assets/invite/page-5.jpg', capKey: 'capRituals' }
      ]
    },
    casual: {
      titleKey: 'galCasual',
      download: './GiriSowmi-Wedding.png',
      dlKey: 'dlImg',
      pages: [ { src: './assets/invite/casual.jpg', capKey: 'capSaveDate' } ]
    }
  };

  var lb    = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbDl  = document.getElementById('lbDl');
  var prev  = document.getElementById('lbPrev');
  var next  = document.getElementById('lbNext');
  var close = document.getElementById('lbClose');

  var current = null, index = 0, lastFocus = null;

  function render() {
    var g = GALLERIES[current];
    var p = g.pages[index];
    var cap = t(p.capKey, '');
    lbImg.src = p.src;
    lbImg.alt = t(g.titleKey, '') + ' — ' + cap.replace(/&amp;/g, '&');
    lbCap.innerHTML = g.pages.length > 1
      ? cap + ' <span class="lb-count">' + (index + 1) + ' / ' + g.pages.length + '</span>'
      : cap;
    lbDl.href = g.download;
    lbDl.textContent = t('lbDownload', 'Download');
    var many = g.pages.length > 1;
    prev.hidden = next.hidden = !many;
  }

  function open(name, i) {
    current = name;
    index = i || 0;
    lastFocus = document.activeElement;
    render();
    lb.hidden = false;
    document.body.classList.add('lb-open');
    close.focus();
  }

  function shut() {
    lb.hidden = true;
    document.body.classList.remove('lb-open');
    lbImg.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  function step(d) {
    var n = GALLERIES[current].pages.length;
    index = (index + d + n) % n;
    render();
  }

  // re-render if the language changes while the viewer is open
  window.GSGallery = { refresh: function () { if (current && !lb.hidden) render(); } };

  document.querySelectorAll('[data-gallery]').forEach(function (el) {
    el.addEventListener('click', function () {
      open(el.dataset.gallery, parseInt(el.dataset.index, 10) || 0);
    });
  });

  close.addEventListener('click', shut);
  prev.addEventListener('click', function () { step(-1); });
  next.addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) shut(); });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') shut();
    else if (e.key === 'ArrowLeft')  step(-1);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'Tab') {
      // keep focus inside the dialog while it is open
      var f = [close, prev, next, lbDl].filter(function (b) { return !b.hidden; });
      var i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  // swipe between pages on touch
  var x0 = null;
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
    x0 = null;
  }, { passive: true });

  /* ——————————————— spotify ——————————————— */

  var player = document.getElementById('player');
  if (!player) return;

  // https://open.spotify.com/playlist/<id>?si=... → playlist / <id>
  function parseSpotify(link) {
    var m = String(link).match(/spotify\.com\/(?:intl-[a-z]+\/)?(playlist|album|track|artist|episode|show)\/([A-Za-z0-9]+)/);
    if (m) return { kind: m[1], id: m[2] };
    m = String(link).match(/^spotify:(playlist|album|track|artist|episode|show):([A-Za-z0-9]+)$/);
    return m ? { kind: m[1], id: m[2] } : null;
  }

  var parsed = SPOTIFY_LINK.trim() ? parseSpotify(SPOTIFY_LINK.trim()) : null;

  if (!parsed) {
    player.classList.add('is-empty');
    player.innerHTML =
      '<div class="player-empty">' +
      '<svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
      '<path d="M7.4 9.2c3-.9 6.6-.6 9.2.9M8 12.4c2.5-.7 5.4-.5 7.6.8M8.6 15.4c2-.5 4.3-.4 6 .7" ' +
      'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
      '<p>Our playlist is still being put together.</p>' +
      '</div>';
    return;
  }

  // a track embed is a single row; everything else is a scrollable list, so give
  // it real height (the container's CSS height drives it — see .player)
  if (parsed.kind === 'track') player.classList.add('one-track');

  var frame = document.createElement('iframe');
  frame.src = 'https://open.spotify.com/embed/' + parsed.kind + '/' + parsed.id + '?utm_source=generator&theme=0';
  frame.width = '100%';
  frame.height = '100%';
  frame.frameBorder = '0';
  frame.loading = 'lazy';
  frame.title = 'Giri and Sowmi wedding playlist on Spotify';
  frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  frame.style.borderRadius = '14px';
  player.appendChild(frame);
})();
