/* Giri ♥ Sowmi — countdown, reveals, petals, WhatsApp share */
(function () {
  'use strict';

  var T = {
    reception:    Date.parse('2026-09-12T18:00:00+05:30'),
    muhurtham:    Date.parse('2026-09-13T09:00:00+05:30'),
    muhurthamEnd: Date.parse('2026-09-13T10:00:00+05:30')
  };

  var $ = function (id) { return document.getElementById(id); };
  var elD = $('cdD'), elH = $('cdH'), elM = $('cdM'), elS = $('cdS');
  var elLabel = $('cdLabel'), elGrid = $('cdGrid'), elDone = $('cdDone');

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  // labels come from the dictionary so they follow the language toggle
  function say(key, fallback) {
    return (window.GSi18n && window.GSi18n.t(key)) || fallback;
  }

  function tick() {
    var now = Date.now(), target, label;

    if (now < T.reception) {
      target = T.reception; label = say('cdSoon', 'The celebrations begin in');
    } else if (now < T.muhurtham) {
      target = T.muhurtham; label = say('cdMuh', 'The muhurtham begins in');
    } else {
      elLabel.textContent = say('cdOver', 'With all your love and blessings —');
      elGrid.hidden = true;
      elDone.hidden = false;
      clearInterval(timer);
      return;
    }

    elLabel.textContent = label;
    var d = Math.max(0, target - now);
    elD.textContent = pad(Math.floor(d / 864e5));
    elH.textContent = pad(Math.floor(d / 36e5) % 24);
    elM.textContent = pad(Math.floor(d / 6e4) % 60);
    elS.textContent = pad(Math.floor(d / 1e3) % 60);
  }
  var timer = setInterval(tick, 1000);
  tick();
  // the language toggle calls this so the label switches immediately rather
  // than waiting for the next second to tick over
  window.GSCountdown = { refresh: tick };

  /* reveal sections as they scroll into view */
  var reveals = document.querySelectorAll('.reveal');
  function showAll() {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
    // Nobody should ever miss the venue because an animation didn't fire.
    setTimeout(showAll, 4000);
  } else {
    showAll();
  }

  /* gentle falling petals (skipped for reduced motion) */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var holder = document.querySelector('.petals');

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  function petalImage() {
    return "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' " +
           "viewBox='0 0 24 24'><path d='M12 2C17 7 18.5 13.5 12 22C5.5 13.5 7 7 12 2Z' fill='" +
           (cssVar('--petal') || '%23C9B6FF') + "' fill-opacity='0.9'/></svg>\")";
  }
  function bloomImage(petal, centre) {
    return "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' " +
           "viewBox='-50 -50 100 100'><g fill='" + petal + "'>" +
           "<ellipse cy='-26' rx='13' ry='22'/>" +
           "<ellipse cy='-26' rx='13' ry='22' transform='rotate(72)'/>" +
           "<ellipse cy='-26' rx='13' ry='22' transform='rotate(144)'/>" +
           "<ellipse cy='-26' rx='13' ry='22' transform='rotate(216)'/>" +
           "<ellipse cy='-26' rx='13' ry='22' transform='rotate(288)'/>" +
           "</g><circle r='11' fill='" + centre + "'/></svg>\")";
  }
  function enc(v) { return v.replace('#', '%23'); }
  function bloomPalette() {
    return [
      [enc(cssVar('--deco-2')  || '#C4B5FD'), enc(cssVar('--accent')   || '#7C3AED')],
      [enc(cssVar('--leaf')    || '#93C5FD'), enc(cssVar('--accent-3') || '#2563EB')],
      [enc(cssVar('--deco')    || '#DDD6FE'), enc(cssVar('--accent-2') || '#6366F1')],
      [enc(cssVar('--deco-mid')|| '#A5B4FC'), enc(cssVar('--ink-700')  || '#4C1D95')]
    ];
  }
  if (!reduceMotion && holder) {
    var count = window.innerWidth < 640 ? 8 : 13;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'petal';
      p.style.backgroundImage = petalImage();
      var x = Math.random() * 100;
      p.style.setProperty('--x0', x + 'vw');
      p.style.setProperty('--x1', (x + (Math.random() * 16 - 8)) + 'vw');
      p.style.setProperty('--t', (14 + Math.random() * 11) + 's');
      p.style.setProperty('--delay', (-Math.random() * 25) + 's');
      p.style.setProperty('--s', (11 + Math.random() * 11) + 'px');
      p.style.setProperty('--o', (0.4 + Math.random() * 0.4).toFixed(2));
      p.style.setProperty('--rot', (200 + Math.random() * 240) + 'deg');
      holder.appendChild(p);
    }
  }

  /* drifting blooms — larger and slower than the petals, five-petalled */
  var blooms = document.querySelector('.blooms');
  if (!reduceMotion && blooms) {
    var FLOWERS = bloomPalette();
    var nb = window.innerWidth < 640 ? 7 : 12;
    for (var b = 0; b < nb; b++) {
      var fc = FLOWERS[b % FLOWERS.length];
      var el = document.createElement('span');
      el.className = 'bloom';
      el.style.backgroundImage = bloomImage(fc[0], fc[1]);
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      var bx = Math.random() * 100;
      el.style.setProperty('--x0', bx + 'vw');
      el.style.setProperty('--x1', (bx + (Math.random() * 22 - 11)) + 'vw');
      el.style.setProperty('--t', (22 + Math.random() * 16) + 's');
      el.style.setProperty('--delay', (-Math.random() * 38) + 's');
      el.style.setProperty('--s', (16 + Math.random() * 20) + 'px');
      el.style.setProperty('--o', (0.3 + Math.random() * 0.35).toFixed(2));
      el.style.setProperty('--rot', (240 + Math.random() * 400) + 'deg');
      blooms.appendChild(el);
    }
  }

  /* the picker calls this after a theme change; the shapes are data URIs built
     from CSS variables, which do not re-resolve on their own */
  window.GSDecor = {
    repaint: function () {
      document.querySelectorAll('.petal').forEach(function (el) {
        el.style.backgroundImage = petalImage();
      });
      var pal = bloomPalette();
      document.querySelectorAll('.bloom').forEach(function (el, i) {
        var fc = pal[i % pal.length];
        el.style.backgroundImage = bloomImage(fc[0], fc[1]);
      });
    }
  };

  /* ——————————————— share ———————————————
   *
   * A plain wa.me link and nothing else. An earlier version intercepted the
   * click to attach the invitation image via navigator.share; when that path
   * bailed out it fell back to window.open from inside an async .catch, by
   * which point the user gesture had expired and the popup was blocked — so
   * the button silently did nothing. Not worth the attachment.
   */
  var INVITE_MESSAGE = [
    'After years of debugging life, we have finally decided to deploy Marriage v1.0!',
    '',
    'Giri & Sowmi cordially welcomes',
    '',
    '12 September – Reception',
    '13 September – Wedding',
    '',
    'Your presence is the only requirement.',
    'No login. No OTP. No subscription.',
    '',
    'Come for the blessings...',
    'Stay for the selfies...',
    'Leave only after the biryani!',
    '',
    'Venue: Brindhavan Mahal, Erode',
    '',
    "Don't miss this live event—there won't be a replay!",
    '',
    'See you there!'
  ].join('\n');
  // the link is appended below from location.href rather than written in here,
  // so it stays correct if the site ever moves

  var wa = $('waShare');
  if (wa) {
    var fullText = INVITE_MESSAGE + '\n\n' + location.href;
    wa.href = 'https://wa.me/?text=' + encodeURIComponent(fullText);
  }
})();
