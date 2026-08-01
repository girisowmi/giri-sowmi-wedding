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

  function tick() {
    var now = Date.now(), target, label;

    if (now < T.reception) {
      target = T.reception; label = 'The celebrations begin in';
    } else if (now < T.muhurtham) {
      target = T.muhurtham; label = 'The muhurtham begins in';
    } else {
      elLabel.textContent = 'With all your love and blessings —';
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
  if (!reduceMotion && holder) {
    var count = window.innerWidth < 640 ? 8 : 13;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'petal';
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

  /* WhatsApp share — always points at wherever the site is hosted */
  var wa = $('waShare');
  if (wa) {
    var msg = "You're invited! 💍 Giri ♥ Sowmi are getting married — Reception: Sat 12 Sep 2026, Brindhavan Mahal, Erode · Muhurtham: Sun 13 Sep 2026, Velayuthaswamy Temple, Thindal. Details: " + location.href;
    wa.href = 'https://wa.me/?text=' + encodeURIComponent(msg);
  }
})();
