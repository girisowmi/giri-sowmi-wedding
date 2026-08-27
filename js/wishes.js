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
