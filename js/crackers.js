/* Giri ♥ Sowmi — wedding-day crackers 🎆
 *
 * Runs by itself across the two wedding days (12–13 Sep 2026, IST) and stays
 * completely dormant before and after, so the page is calm on every other day.
 * Add ?crackers=1 to the URL to preview it any time; ?crackers=0 to force it off.
 */
(function () {
  'use strict';

  var START = Date.parse('2026-09-12T00:00:00+05:30');
  var END   = Date.parse('2026-09-14T00:00:00+05:30');   // through the end of the 13th

  var params  = new URLSearchParams(location.search);
  var forced  = params.get('crackers');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isWeddingTime() {
    var now = Date.now();
    return now >= START && now < END;
  }

  if (forced === '0' || reduced) return;
  if (forced !== '1' && !isWeddingTime()) {
    // Not the day yet — check again if the page is left open across midnight.
    setInterval(function () {
      if (isWeddingTime()) location.reload();
    }, 60000);
    return;
  }

  var canvas = document.getElementById('crackers');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  document.body.classList.add('is-wedding-day');

  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // festive palette — marigold, kumkum red, temple gold, peacock green/blue
  var COLORS = ['#FFC94A', '#FF7A3D', '#E8464F', '#FF4FA3', '#6FD3FF', '#5BE0A8', '#C77DFF', '#FFF1B8'];

  var rockets = [];
  var sparks  = [];

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  function launch() {
    rockets.push({
      x: rand(W * 0.12, W * 0.88),
      y: H + 10,
      vx: rand(-0.5, 0.5),
      vy: rand(-11.5, -8.5),
      color: pick(COLORS),
      burstAt: rand(H * 0.10, H * 0.34)   // keep them up in the "sky"
    });
  }

  function burst(x, y, color) {
    var n = 34 + ((Math.random() * 20) | 0);
    // occasional two-tone shell, like a real aerial
    var second = Math.random() < 0.45 ? pick(COLORS) : null;
    for (var i = 0; i < n; i++) {
      var a = (Math.PI * 2 * i) / n + rand(-0.05, 0.05);
      var speed = rand(1.6, 5.4);
      sparks.push({
        x: x, y: y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: 1,
        decay: rand(0.013, 0.026),
        color: second && i % 2 ? second : color,
        size: rand(1, 2.1)
      });
    }
  }

  var lastLaunch = 0;
  var GAP = 1050;         // ms between rockets — leaves calm gaps to read in
  var running = true;

  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) { lastLaunch = 0; requestAnimationFrame(frame); }
  });

  function frame(t) {
    if (!running) return;

    // trails: fade the previous frame instead of clearing it outright
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    if (t - lastLaunch > GAP) {
      launch();
      if (Math.random() < 0.35) setTimeout(launch, 140);   // paired shells
      lastLaunch = t;
    }

    for (var i = rockets.length - 1; i >= 0; i--) {
      var r = rockets[i];
      r.x += r.vx; r.y += r.vy; r.vy += 0.12;

      ctx.beginPath();
      ctx.arc(r.x, r.y, 2.1, 0, Math.PI * 2);
      ctx.fillStyle = r.color;
      ctx.fill();

      if (r.y <= r.burstAt || r.vy >= 0) {
        burst(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    }

    for (var j = sparks.length - 1; j >= 0; j--) {
      var s = sparks[j];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.055;          // gravity
      s.vx *= 0.985;          // drag
      s.vy *= 0.985;
      s.life -= s.decay;

      if (s.life <= 0) { sparks.splice(j, 1); continue; }

      ctx.globalAlpha = Math.max(s.life, 0);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  // a burst wherever the page is tapped — irresistible on the day
  document.addEventListener('click', function (e) {
    if (e.target.closest('a, button')) return;
    burst(e.clientX, e.clientY, pick(COLORS));
  });
})();
