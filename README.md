# 💍 Giri ♥ Sowmi — Wedding Website

A single-page wedding invitation site, styled after the printed invite — cream & deep
green with antique-gold accents, blush florals, hanging lanterns, string lights and
falling petals, with Lord Murugan's *Vel* at its heart.

**Events**

| Event | When | Where |
|---|---|---|
| Mugurthakkal · முகூர்த்தக்கால் | Sat 12 Sep 2026, 6.00 – 7.00 PM | Brindhavan Mahal, Palayapalayam, Erode |
| Reception | Sat 12 Sep 2026, 6.00 – 9.00 PM | Brindhavan Mahal, Palayapalayam, Erode |
| Muhurtham | Sun 13 Sep 2026, 9.00 – 10.00 AM | Shri Arulmigu Velayuthaswamy Temple, Thindal, Erode |
| Lunch · மதிய விருந்து | Sun 13 Sep 2026, 12.00 – 1.30 PM | Shri Arulmigu Velayuthaswamy Temple, Thindal |

## Features

- Live countdown (celebrations → muhurtham → "Happily married!")
- **Lord Murugan** section — the Vel with peacock feathers, *வெற்றி வேல் • வீர வேல்*
- **Wedding-day crackers** 🎆 — a fireworks canvas that switches itself on for
  12–13 September 2026 (IST) and stays dormant every other day
- **Download the formal invitation** as `GiriSowmi.pdf` (6 pages, Tamil & English)
- Per-event **Get directions** (Google Maps) and **Add to calendar**
  (Google Calendar + downloadable `.ics` for Apple/Outlook)
- **Share on WhatsApp** button with a pre-filled invite message
- Open Graph tags + `assets/og.png` so shared links show a pretty preview card
- Fully responsive, respects `prefers-reduced-motion`, no build step

## Preview locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

To see the crackers on any day, add `?crackers=1` to the URL
(`?crackers=0` forces them off).

## The PDF invitation

`GiriSowmi.pdf` is generated from `invitation/invitation.html`:

```bash
./make-pdf.sh
```

Six A4-landscape pages — cover, English invitation, the Tamil *azhaippithal*,
the event schedule with venue QR codes, the family lists, and the ritual
explanations. Edit the HTML and re-run the script to regenerate.

> **Proofread before sharing.** The Tamil pages were transcribed from photographs
> of the printed card, so names and honorifics should be checked against the
> original — especially the family list on page 5.

## Deploy to GitHub Pages

One-time login, then a single script:

```bash
gh auth login
```

```bash
./deploy.sh
```

The script creates the public repo `giri-sowmi-wedding`, pushes this folder,
enables GitHub Pages, and prints the live URL
(`https://<your-username>.github.io/giri-sowmi-wedding/`).

> **The repo is public**, which free GitHub Pages requires. Anything committed
> here — including the phone numbers and family names inside `GiriSowmi.pdf` —
> is publicly readable and can be indexed by search engines. Remove the relatives
> page or the contact numbers from `invitation/invitation.html` and re-run
> `./make-pdf.sh` if you would rather not publish them.

## Editing

- **Copy/text & event details:** `index.html`
- **Colors & fonts:** CSS variables at the top of `css/style.css`
- **Countdown target times:** top of `js/main.js`
- **Crackers dates, colours, density:** top of `js/crackers.js`
- **The Vel artwork:** `assets/vel.svg` (shared by the site and the PDF cover)
- **Venue QR codes:** `assets/qr-*.svg` — regenerate with `segno`
- **Share-preview image:** regenerate from `assets/og.html` (1200×630) with any
  Chromium browser:
  `"…/Brave Browser" --headless=new --screenshot=assets/og.png --window-size=1200,630 assets/og.html`

## Ideas for later

- RSVP via a Google Form (link a button to it)
- Photo gallery / our-story timeline once you have pictures
- A custom domain (`girisowmi.in` → repo Settings → Pages → Custom domain)
