/* Giri ♥ Sowmi — the opening
 *
 * The invitation flies in, the wax seal cracks in two with a scatter of petals,
 * all four folds of the envelope swing open, and the card inside grows past the
 * screen to hand over to the page.
 *
 * Shown on a guest's first visit only. Whether it runs at all is decided by the
 * inline script in <head> (data-intro), so the page never flashes behind it and
 * a returning guest never sees it flash at them.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  if (root.getAttribute('data-intro') !== 'show') return;

  var intro = document.getElementById('intro');
  var env   = document.getElementById('env');
  var seal  = document.getElementById('envOpen');
  var burst = document.getElementById('introBurst');
  if (!intro || !env || !seal) return;

  /* the card echoes whichever date format the current language uses */
  var dateEl = document.getElementById('introDate');
  function localiseDate() {
    if (!dateEl || !window.GSi18n) return;
    var v = window.GSi18n.t('datepill');
    if (v) dateEl.innerHTML = v.replace(/<sup>[^<]*<\/sup>/g, '');
  }
  localiseDate();

  function cssVar(name, fallback) {
    var v = getComputedStyle(root).getPropertyValue(name).trim();
    return (v || fallback).replace('#', '%23');
  }

  function petal(fill) {
    return "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' " +
           "viewBox='-50 -50 100 100'><g fill='" + fill + "'>" +
           "<ellipse cy='-26' rx='13' ry='22'/>" +
           "<ellipse cy='-26' rx='13' ry='22' transform='rotate(72)'/>" +
           "<ellipse cy='-26' rx='13' ry='22' transform='rotate(144)'/>" +
           "<ellipse cy='-26' rx='13' ry='22' transform='rotate(216)'/>" +
           "<ellipse cy='-26' rx='13' ry='22' transform='rotate(288)'/></g></svg>\")";
  }
  function heart(fill) {
    return "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' " +
           "viewBox='0 0 26 26'><path fill='" + fill + "' d='M13 24 C5.3 17.6 1 13.6 1 9 " +
           "A5.9 5.9 0 0 1 13 6.5 A5.9 5.9 0 0 1 25 9 C25 13.6 20.7 17.6 13 24 Z'/></svg>\")";
  }

  /* petals flung from wherever the seal was sitting */
  function scatter() {
    if (!burst) return;
    var r = seal.getBoundingClientRect();
    var b = burst.getBoundingClientRect();
    var cx = r.left + r.width / 2 - b.left;
    var cy = r.top + r.height / 2 - b.top;

    var shapes = [
      petal(cssVar('--deco-2', '#C4B5FD')), petal(cssVar('--leaf', '#93C5FD')),
      petal(cssVar('--deco-mid', '#A78BFA')), heart('%233B82F6'), heart('%23A855F7')
    ];

    for (var i = 0; i < 22; i++) {
      var el = document.createElement('span');
      el.className = 'intro-bit';
      el.style.backgroundImage = shapes[(Math.random() * shapes.length) | 0];
      el.style.left = cx + 'px';
      el.style.top  = cy + 'px';

      var a = Math.random() * Math.PI * 2;
      var speed = 60 + Math.random() * 150;
      var size = 10 + Math.random() * 16;
      el.style.setProperty('--dx', (Math.cos(a) * speed).toFixed(1) + 'px');
      el.style.setProperty('--dy', (Math.sin(a) * speed * .7).toFixed(1) + 'px');
      el.style.setProperty('--fall', (90 + Math.random() * 130).toFixed(1) + 'px');
      el.style.setProperty('--sz', size.toFixed(1) + 'px');
      el.style.setProperty('--rot', ((Math.random() * 700) - 350).toFixed(0) + 'deg');
      el.style.setProperty('--dur', (1.1 + Math.random() * .7).toFixed(2) + 's');
      burst.appendChild(el);
      el.addEventListener('animationend', function () { this.remove(); });
    }
  }

  var running = false;
  var timers = [];
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }

  function open() {
    if (running) return;
    running = true;
    try { localStorage.setItem('gs-intro', 'seen'); } catch (e) {}

    env.classList.add('unseal');          // the seal cracks apart
    scatter();
    at(360,  function () { env.classList.add('unfold'); });   // folds swing open
    at(1500, function () { intro.classList.add('zoom'); });   // card grows into the page

    // release on the fade-out ending, with a timeout as the backstop so a
    // dropped animation event can never leave a guest staring at the overlay
    var done = false;
    function release() {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      root.setAttribute('data-intro', 'skip');
      intro.remove();
    }
    intro.addEventListener('animationend', function (e) {
      if (e.animationName === 'intro-fade-out') release();
    });
    at(3400, release);
  }

  seal.addEventListener('click', function (e) { e.stopPropagation(); open(); });
  env.addEventListener('click', open);
  intro.addEventListener('click', open);
  document.addEventListener('keydown', function (e) {
    if (!running && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
      e.preventDefault();
      open();
    }
  });

  seal.focus({ preventScroll: true });
  window.GSIntro = { open: open, localiseDate: localiseDate };
})();
