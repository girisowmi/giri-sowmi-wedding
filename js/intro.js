/* Giri ♥ Sowmi — the opening envelope
 *
 * Shown on a guest's first visit only. Whether it appears at all is decided by
 * the inline script in <head> (data-intro), so the page never flashes behind it
 * and a returning guest never sees it flash at them.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  if (root.getAttribute('data-intro') !== 'show') return;

  var intro = document.getElementById('intro');
  var env   = document.getElementById('env');
  var seal  = document.getElementById('envOpen');
  if (!intro || !env) return;

  // the card inside the envelope echoes whichever date format the language uses
  var dateEl = document.getElementById('introDate');
  function localiseDate() {
    if (!dateEl || !window.GSi18n) return;
    var v = window.GSi18n.t('datepill');
    if (v) dateEl.innerHTML = v.replace(/<sup>[^<]*<\/sup>/g, '');
  }
  localiseDate();

  var opened = false;

  function open() {
    if (opened) return;
    opened = true;

    env.classList.add('open');
    intro.classList.add('is-open');
    try { localStorage.setItem('gs-intro', 'seen'); } catch (e) {}

    // hand the page back once the overlay has finished fading, rather than
    // guessing: if the animation never fires, the timeout still releases it
    var done = false;
    function release() {
      if (done) return;
      done = true;
      root.setAttribute('data-intro', 'skip');
      intro.remove();
    }
    intro.addEventListener('animationend', function (e) {
      if (e.animationName === 'intro-out') release();
    });
    setTimeout(release, 2600);
  }

  seal.addEventListener('click', function (e) { e.stopPropagation(); open(); });
  env.addEventListener('click', open);
  intro.addEventListener('click', open);
  document.addEventListener('keydown', function (e) {
    if (!opened && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
      e.preventDefault();
      open();
    }
  });

  seal.focus({ preventScroll: true });
  window.GSIntro = { open: open, localiseDate: localiseDate };
})();
