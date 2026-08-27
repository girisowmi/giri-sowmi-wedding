/* Giri ♥ Sowmi — wishes form → Google Sheet
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  PASTE YOUR APPS SCRIPT WEB APP URL HERE
 *  It looks like:
 *    https://script.google.com/macros/s/AKfycb...../exec
 *  Setup steps are in the README under "Wishes". Until this is filled in the
 *  form tells guests to send their wishes on WhatsApp instead, rather than
 *  silently swallowing them.
 * ─────────────────────────────────────────────────────────────────────────
 */
var WISHES_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyFV0Fx_NhTlYKztHnSKeEcRxsg-cBdyGoZmRAYSeoFSNIY5d5g4Rc0hKlvdlM_fzqG/exec';

/* where guests are sent if the form cannot reach the sheet */
var WISHES_FALLBACK_WA = 'https://wa.me/919677948151';

(function () {
  'use strict';

  var form = document.getElementById('wishForm');
  if (!form) return;

  var note = document.getElementById('wfNote');
  var send = document.getElementById('wfSend');
  var name = document.getElementById('wfName');
  var wish = document.getElementById('wfWish');

  function t(key, fallback) {
    return (window.GSi18n && window.GSi18n.t(key)) || fallback;
  }

  function say(kind, key, fallback) {
    note.className = 'wf-note is-' + kind;
    note.innerHTML = t(key, fallback);
  }

  function waLink(text) {
    return '<a href="' + WISHES_FALLBACK_WA + '?text=' + encodeURIComponent(text) +
           '" target="_blank" rel="noopener">' + t('wfWhatsApp', 'send it on WhatsApp') + '</a>';
  }

  /* the corner controls step aside while the form has focus — on a phone the
     keyboard lifts the send button into the same strip they occupy */
  var root = document.documentElement;
  form.addEventListener('focusin',  function () { root.setAttribute('data-typing', '1'); });
  form.addEventListener('input', function () {
    if (note.classList.contains('is-good')) { note.textContent = ''; note.className = 'wf-note'; }
  });
  form.addEventListener('focusout', function () {
    // a blur that moves to another field inside the form should not flicker them
    setTimeout(function () {
      if (!form.contains(document.activeElement)) root.removeAttribute('data-typing');
    }, 60);
  });

  /* ——————————————— the "joining" dropdown ———————————————
   * A native <select> renders its open list with the operating system's own
   * styling, and <option> cannot be styled by CSS in any browser — so the one
   * part of this form that never matched the site was the list itself.
   * The native select stays in the DOM as the source of truth, so the value
   * that gets posted is still the browser's own; this draws a listbox over it.
   */
  var nativeSel = document.getElementById('wfJoin');
  if (nativeSel) (function () {
    var wrap = document.createElement('div');
    wrap.className = 'dd';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dd-btn wf-input';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    var list = document.createElement('ul');
    list.className = 'dd-list';
    list.setAttribute('role', 'listbox');
    list.hidden = true;

    nativeSel.parentNode.insertBefore(wrap, nativeSel);
    wrap.appendChild(nativeSel);
    wrap.appendChild(btn);
    wrap.appendChild(list);
    nativeSel.classList.add('dd-native');
    nativeSel.setAttribute('tabindex', '-1');
    nativeSel.setAttribute('aria-hidden', 'true');

    var open = false, idx = 0;

    function label() { return nativeSel.options[nativeSel.selectedIndex].textContent; }
    function syncBtn() { btn.textContent = label(); }

    /* rebuilt every time it opens, so it always carries the current language
       rather than needing to be kept in step with the translation pass */
    function build() {
      list.innerHTML = '';
      [].forEach.call(nativeSel.options, function (o, i) {
        var li = document.createElement('li');
        li.className = 'dd-opt' + (i === nativeSel.selectedIndex ? ' on' : '');
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(i === nativeSel.selectedIndex));
        li.textContent = o.textContent;
        li.addEventListener('click', function () { choose(i); });
        list.appendChild(li);
      });
    }

    function mark(i) {
      var opts = list.querySelectorAll('.dd-opt');
      if (!opts.length) return;
      idx = Math.max(0, Math.min(i, opts.length - 1));
      opts.forEach(function (el, n) { el.classList.toggle('cursor', n === idx); });
      opts[idx].scrollIntoView({ block: 'nearest' });
    }

    function show() {
      build();
      list.hidden = false;
      open = true;
      wrap.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      mark(nativeSel.selectedIndex);
    }
    function hide() {
      list.hidden = true;
      open = false;
      wrap.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function choose(i) {
      nativeSel.selectedIndex = i;
      nativeSel.dispatchEvent(new Event('change', { bubbles: true }));
      syncBtn();
      hide();
      btn.focus();
    }

    btn.addEventListener('click', function () { open ? hide() : show(); });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!open) return show();
        mark(idx + (e.key === 'ArrowUp' ? -1 : 1));
      } else if (e.key === 'Escape') { hide(); }
    });

    list.addEventListener('keydown', function (e) { e.preventDefault(); });

    document.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'ArrowDown')      { e.preventDefault(); mark(idx + 1); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); mark(idx - 1); }
      else if (e.key === 'Home')      { e.preventDefault(); mark(0); }
      else if (e.key === 'End')       { e.preventDefault(); mark(nativeSel.options.length - 1); }
      else if (e.key === 'Enter')     { e.preventDefault(); choose(idx); }
      else if (e.key === 'Escape')    { e.preventDefault(); hide(); btn.focus(); }
      else if (e.key === 'Tab')       { hide(); }
    });

    document.addEventListener('click', function (e) { if (open && !wrap.contains(e.target)) hide(); });

    // the language toggle rewrites the option labels, so the button caption
    // has to follow; the list itself is rebuilt on open so it needs nothing
    new MutationObserver(syncBtn).observe(nativeSel, {
      subtree: true, childList: true, characterData: true
    });

    syncBtn();
    form.addEventListener('reset', function () { setTimeout(syncBtn, 0); });
  })();

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var n = name.value.trim();
    var w = wish.value.trim();

    if (!n)  { say('bad', 'wfNeedName', 'Please add your name.'); name.focus(); return; }
    if (!w)  { say('bad', 'wfNeedWish', 'Please write a line for us.'); wish.focus(); return; }

    if (!WISHES_ENDPOINT) {
      note.className = 'wf-note is-bad';
      note.innerHTML = t('wfNoEndpoint', 'The form is not connected yet — please ') +
                       waLink(n + ': ' + w) + '.';
      return;
    }

    var body = new URLSearchParams({
      name: n,
      wish: w,
      joining: document.getElementById('wfJoin').value,
      trap: document.getElementById('wfTrap').value,
      lang: (window.GSi18n && window.GSi18n.lang()) || 'en'
    });

    send.disabled = true;
    form.classList.add('is-sending');
    say('busy', 'wfSending', 'Sending&hellip;');

    /* Apps Script redirects /exec to a googleusercontent.com host, and that
     * redirect strips the CORS headers, so the response can never be read from
     * a browser. no-cors posts the row successfully but hands back an opaque
     * response — a resolved promise means the request left; a rejection means
     * it genuinely did not. URLSearchParams keeps it a simple request, so
     * there is no preflight to be blocked either. */
    fetch(WISHES_ENDPOINT, { method: 'POST', mode: 'no-cors', body: body })
      .then(function () {
        form.classList.remove('is-sending');
        send.disabled = false;
        // relabel via the data key, not textContent, so switching language
        // afterwards keeps the new wording instead of reverting
        send.dataset.i18n = 'wfSendAnother';
        send.textContent = t('wfSendAnother', 'Send another');
        say('good', 'wfThanks', 'Thank you &mdash; that means the world to us.');
        form.reset();
      })
      .catch(function () {
        send.disabled = false;
        form.classList.remove('is-sending');
        note.innerHTML = t('wfFailed', "That didn't go through. Please ") +
                         waLink(n + ': ' + w) + '.';
        note.className = 'wf-note is-bad';
      });
  });
})();
