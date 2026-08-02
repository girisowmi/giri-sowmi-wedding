/* Giri ♥ Sowmi — English / Tamil
 *
 * Swaps every element carrying data-i18n (text) or data-i18n-html (markup).
 * The choice is remembered, and applied before first paint by the inline
 * script in <head>, so a Tamil-reading guest never sees English flash first.
 *
 * ── PROOFREAD ─────────────────────────────────────────────────────────────
 * The Tamil below was written to match the tone of the English, not translated
 * word for word. Please read it through before sharing the link widely.
 * ──────────────────────────────────────────────────────────────────────────
 */
var GS_STRINGS = {
  en: {
    tease:      'After years of debugging life, we have finally<br>decided to deploy <b>Marriage v1.0!</b>',
    announce:   "We're getting married",
    datepill:   '12<sup>TH</sup> &amp; 13<sup>TH</sup> September 2026 · Erode, Tamil Nadu',

    cdSoon:     'The celebrations begin in',
    cdMuh:      'The muhurtham begins in',
    cdOver:     'With all your love and blessings —',
    cdDone:     'Happily married! <span class="emoji">🎉</span>',
    cdDays:     'Days',
    cdHours:    'Hours',
    cdMinutes:  'Minutes',
    cdSeconds:  'Seconds',

    blessingsH: 'With the blessings of',
    parentsG:   'Mr. K.C. Appusamy<br>&amp; Mrs. A. Sivakami',
    parentsB:   'Mr. K. Raja<br>&amp; Mrs. R. Vijayalakshmi',
    presence:   'Your presence is the only requirement.',
    noLogin:    'No login. No OTP. No subscription.',
    stanza:     'Come for the blessings&hellip;<br>Stay for the selfies&hellip;<br>Leave only after the biryani!',

    datesH:     'Save the dates',
    recTitle:   'Reception',
    recDay:     'Saturday',
    recDate:    '12<sup>th</sup> September 2026',
    recTime:    '6.00 PM – 9.00 PM',
    recVenue:   'Brindhavan Mahal',
    recArea:    'Palayapalayam, Erode',
    muhTitle:   'Muhurtham',
    muhDay:     'Sunday',
    muhDate:    '13<sup>th</sup> September 2026',
    muhTime:    '9.00 AM – 10.00 AM',
    muhVenue:   'Shri Arulmigu Velayuthaswamy Temple',
    muhArea:    'Thindal, Erode',
    directions: 'Get directions',
    addCal:     'Add to calendar',
    ics:        'Apple / Outlook calendar (.ics)',

    inviteH:     'Our invitation',
    formalTitle: 'Formal invitation',
    casualTitle: 'Save-the-date card',
    casualSub:   "The card we've been sharing",
    view:        'View',
    dlPdf:       'Download PDF',
    dlImg:       'Download image',
    lbDownload:  'Download',

    musicH:      'Our playlist',
    musicSub:    'The songs that have been on repeat for the two of us. Pick any one and press play. <span class="emoji">🎶</span>',

    contactH:    'Need anything?',
    contactSub:  'Directions, timings, or anything at all — just call or message.',
    cRole:       'Groom',
    call:        'Call',

    compFrom:    'With best compliments from',
    relFriends:  'Relatives &amp; Friends',
    shareWa:     'Share on WhatsApp',
    fineprint:   '12 &amp; 13 September 2026 · Erode, Tamil Nadu',

    capEnvelope: 'Envelope',
    capCouple:   'மணமக்கள் · Giri &amp; Sowmi',
    capInvite:   'Wedding Invitation',
    capTamil:    'திருமண அழைப்பிதழ்',
    capRituals:  'என்னவன் என்னவள் · the rituals',
    capSaveDate: 'Save the date',
    galFormal:   'Formal invitation',
    galCasual:   'Save-the-date card'
  },

  ta: {
    tease:      'இரு உள்ளங்கள் &middot; ஒரே வாழ்க்கை<br><b>எங்கள் புதிய பயணம் தொடங்குகிறது!</b>',
    announce:   'நாங்கள் மணமுடிக்கிறோம்',
    datepill:   '12 &amp; 13 செப்டம்பர் 2026 · ஈரோடு, தமிழ்நாடு',

    cdSoon:     'விழா தொடங்க இன்னும்',
    cdMuh:      'முகூர்த்தம் தொடங்க இன்னும்',
    cdOver:     'உங்கள் அன்பும் ஆசியும் என்றும் நிறைந்திருக்கட்டும் —',
    cdDone:     'திருமணம் இனிதே நிறைவேறியது! <span class="emoji">🎉</span>',
    cdDays:     'நாட்கள்',
    cdHours:    'மணி',
    cdMinutes:  'நிமிடம்',
    cdSeconds:  'வினாடி',

    blessingsH: 'பெரியோர்களின் ஆசியுடன்',
    parentsG:   'திரு. K.C. அப்புச்சாமி<br>&amp; திருமதி. A. சிவகாமி',
    parentsB:   'திரு. K. ராஜா<br>&amp; திருமதி. R. விஜயலட்சுமி',
    presence:   'உங்கள் வருகையே எங்களுக்குப் போதும்.',
    noLogin:    'லாகின் இல்லை. OTP இல்லை. சந்தா இல்லை.',
    stanza:     'ஆசி வழங்க வாருங்கள்&hellip;<br>செல்ஃபி எடுக்கத் தங்குங்கள்&hellip;<br>பிரியாணி சாப்பிட்ட பிறகே கிளம்புங்கள்!',

    datesH:     'நாட்களைக் குறித்துக் கொள்ளுங்கள்',
    recTitle:   'வரவேற்பு',
    recDay:     'சனிக்கிழமை',
    recDate:    '12 செப்டம்பர் 2026',
    recTime:    'மாலை 6.00 – 9.00 மணி',
    recVenue:   'பிருந்தாவன் மஹால்',
    recArea:    'பழையபாளையம், ஈரோடு',
    muhTitle:   'முகூர்த்தம்',
    muhDay:     'ஞாயிற்றுக்கிழமை',
    muhDate:    '13 செப்டம்பர் 2026',
    muhTime:    'காலை 9.00 – 10.00 மணி',
    muhVenue:   'ஸ்ரீ அருள்மிகு வேலாயுதசுவாமி திருக்கோயில்',
    muhArea:    'திண்டல், ஈரோடு',
    directions: 'வழி காட்டு',
    addCal:     'காலெண்டரில் சேர்',
    ics:        'Apple / Outlook காலெண்டர் (.ics)',

    inviteH:     'எங்கள் அழைப்பிதழ்',
    formalTitle: 'முறையான அழைப்பிதழ்',
    casualTitle: 'நினைவூட்டல் அட்டை',
    casualSub:   'நாங்கள் பகிர்ந்து வரும் அட்டை',
    view:        'பார்க்க',
    dlPdf:       'PDF பதிவிறக்கம்',
    dlImg:       'படம் பதிவிறக்கம்',
    lbDownload:  'பதிவிறக்கம்',

    musicH:      'எங்கள் பாடல் பட்டியல்',
    musicSub:    'நாங்கள் திரும்பத் திரும்பக் கேட்கும் பாடல்கள். எதை வேண்டுமானாலும் தேர்ந்தெடுத்துக் கேளுங்கள். <span class="emoji">🎶</span>',

    contactH:    'ஏதேனும் உதவி வேண்டுமா?',
    contactSub:  'வழி, நேரம், வேறு எதுவாக இருந்தாலும் — அழையுங்கள் அல்லது செய்தி அனுப்புங்கள்.',
    cRole:       'மணமகன்',
    call:        'அழைக்க',

    compFrom:    'அன்புடன்',
    relFriends:  'உற்றார் உறவினர் &amp; நண்பர்கள்',
    shareWa:     'WhatsApp-ல் பகிர',
    fineprint:   '12 &amp; 13 செப்டம்பர் 2026 · ஈரோடு, தமிழ்நாடு',

    capEnvelope: 'உறை',
    capCouple:   'மணமக்கள் · கிரி &amp; சௌமி',
    capInvite:   'திருமண அழைப்பிதழ் (ஆங்கிலம்)',
    capTamil:    'திருமண அழைப்பிதழ்',
    capRituals:  'என்னவன் என்னவள் · சடங்குகள்',
    capSaveDate: 'நினைவூட்டல் அட்டை',
    galFormal:   'முறையான அழைப்பிதழ்',
    galCasual:   'நினைவூட்டல் அட்டை'
  }
};

(function () {
  'use strict';

  var KEY = 'gs-lang';
  var root = document.documentElement;
  var query = new URLSearchParams(location.search);

  function pick() {
    var q = query.get('lang');
    if (q === 'en' || q === 'ta') return q;
    var v;
    try { v = localStorage.getItem(KEY); } catch (e) {}
    return (v === 'en' || v === 'ta') ? v : 'en';
  }

  var lang = pick();

  function t(key) {
    return (GS_STRINGS[lang] && GS_STRINGS[lang][key]) || GS_STRINGS.en[key] || '';
  }
  window.GSi18n = { t: t, lang: function () { return lang; } };

  function apply(next) {
    lang = next;
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'ta' ? 'ta' : 'en');
    try { localStorage.setItem(KEY, lang); } catch (e) {}

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.dataset.i18n);
      if (!v) return;
      // Belt and braces: a string carrying markup or an entity has to be set as
      // HTML. Assigning it as text is what printed a literal "&amp;" and a
      // visible <span> on the page. Every string here is ours, not user input.
      if (/[<&]/.test(v)) el.innerHTML = v; else el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t(el.dataset.i18nHtml);
      if (v) el.innerHTML = v;
    });

    // the countdown rewrites its own label every second, and the lightbox
    // builds captions on open — both read from GSi18n, so nudge them
    if (window.GSCountdown && window.GSCountdown.refresh) window.GSCountdown.refresh();
    if (window.GSGallery && window.GSGallery.refresh) window.GSGallery.refresh();
    sync();
  }

  /* ——— the toggle ——— */
  var wrap = document.createElement('div');
  wrap.className = 'lang';
  wrap.innerHTML =
    '<button type="button" data-lang-id="en" lang="en">English</button>' +
    '<span class="lang-sep" aria-hidden="true"></span>' +
    '<button type="button" data-lang-id="ta" lang="ta">தமிழ்</button>';
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', 'Language / மொழி');
  document.body.appendChild(wrap);

  function sync() {
    wrap.querySelectorAll('[data-lang-id]').forEach(function (b) {
      var on = b.dataset.langId === lang;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }

  wrap.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang-id]');
    if (b && b.dataset.langId !== lang) apply(b.dataset.langId);
  });

  apply(lang);
})();
