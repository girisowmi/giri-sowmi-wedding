/* Giri ♥ Sowmi — tap anywhere for a little burst of flowers and hearts
 *
 * Deliberately does nothing on links, buttons, the Spotify frame or the theme
 * picker, so it never fires while a guest is trying to actually use the page.
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var layer = document.createElement('div');
  layer.className = 'burst-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).replace('#', '%23');
  }

  function flower(petal, centre) {
    return "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' " +
           "viewBox='-50 -50 100 100'><g fill='" + petal + "'>" +
           "<ellipse cy='-26' rx='13' ry='22'/>" +
           "<ellipse cy='-26' rx='13' ry='22' transform='rotate(72)'/>" +
           "<ellipse cy='-26' rx='13' ry='22' transform='rotate(144)'/>" +
           "<ellipse cy='-26' rx='13' ry='22' transform='rotate(216)'/>" +
           "<ellipse cy='-26' rx='13' ry='22' transform='rotate(288)'/>" +
           "</g><circle r='11' fill='" + centre + "'/></svg>\")";
  }

  function heart(fill) {
    return "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' " +
           "viewBox='0 0 26 26'><path fill='" + fill + "' " +
           "d='M13 24 C5.3 17.6 1 13.6 1 9 A5.9 5.9 0 0 1 13 6.5 A5.9 5.9 0 0 1 25 9 C25 13.6 20.7 17.6 13 24 Z'/></svg>\")";
  }

  function shapes() {
    var deco = cssVar('--deco-2', '#C4B5FD'), leaf = cssVar('--leaf', '#93C5FD');
    var pale = cssVar('--deco', '#DDD6FE'),   acc  = cssVar('--accent', '#7C3AED');
    var acc2 = cssVar('--accent-2', '#6366F1'), acc3 = cssVar('--accent-3', '#2563EB');
    return [
      flower(deco, acc), flower(leaf, acc3), flower(pale, acc2),
      heart('%233B82F6'), heart('%23A855F7')   // the couple's blue and purple
    ];
  }

  var last = 0;

  function burst(x, y) {
    var now = Date.now();
    if (now - last < 140) return;      // no machine-gunning it
    last = now;

    var pool = shapes();
    var n = 9 + ((Math.random() * 4) | 0);

    for (var i = 0; i < n; i++) {
      var el = document.createElement('span');
      el.className = 'burst-bit';
      el.style.backgroundImage = pool[(Math.random() * pool.length) | 0];

      // fan the pieces upward and outward, then let gravity take them
      var angle = (-Math.PI / 2) + (Math.random() - 0.5) * 2.1;
      var speed = 46 + Math.random() * 92;
      var size  = 12 + Math.random() * 16;

      el.style.left = x + 'px';
      el.style.top  = y + 'px';
      el.style.setProperty('--dx', (Math.cos(angle) * speed).toFixed(1) + 'px');
      el.style.setProperty('--dy', (Math.sin(angle) * speed).toFixed(1) + 'px');
      el.style.setProperty('--fall', (70 + Math.random() * 90).toFixed(1) + 'px');
      el.style.setProperty('--sz', size.toFixed(1) + 'px');
      el.style.setProperty('--rot', ((Math.random() * 620) - 310).toFixed(0) + 'deg');
      el.style.setProperty('--dur', (0.95 + Math.random() * 0.55).toFixed(2) + 's');

      layer.appendChild(el);
      // clean up on the animation's own event rather than a guessed timeout
      el.addEventListener('animationend', function () { this.remove(); });
    }
  }

  var SKIP = 'a,button,input,select,textarea,iframe,label,summary,.appear,.lb,[data-gallery]';

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest(SKIP)) return;
    if (window.getSelection && String(window.getSelection())) return;  // mid text-selection
    burst(e.clientX, e.clientY);
  });
})();
