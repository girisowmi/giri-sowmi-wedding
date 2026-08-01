# 💍 Giri ♥ Sowmi — Wedding Website

A single-page wedding invitation site, styled after the printed invite — cream & deep
green with antique-gold accents, blush florals, hanging lanterns, string lights and
falling petals.

**Events**

| Event | When | Where |
|---|---|---|
| Reception | Sat 12 Sep 2026, 6.00 – 9.00 PM | Brindhavan Mahal, Palayapalayam, Erode |
| Muhurtham | Sun 13 Sep 2026, 9.00 – 10.00 AM | Shri Arulmigu Velayuthaswamy Temple, Thindal, Erode |

## Features

- Live countdown (celebrations → muhurtham → "Happily married!")
- Per-event **Get directions** (Google Maps) and **Add to calendar**
  (Google Calendar + downloadable `.ics` for Apple/Outlook)
- **Share on WhatsApp** button with a pre-filled invite message
- Open Graph tags + `assets/og.png` so shared links show a pretty preview card
- Tamil touches: ௐ and அறம் • பொருள் • இன்பம்
- Fully responsive, respects `prefers-reduced-motion`, no build step — plain HTML/CSS/JS

## Preview locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Deploy to GitHub Pages

One-time setup, then a single script:

```bash
brew install gh     # if not installed
gh auth login       # opens the browser, log in to your personal GitHub
./deploy.sh
```

The script creates the public repo `giri-sowmi-wedding`, pushes this folder,
enables GitHub Pages, and prints the live URL
(`https://<your-username>.github.io/giri-sowmi-wedding/`).

## Editing

- **Copy/text & event details:** `index.html`
- **Colors & fonts:** CSS variables at the top of `css/style.css`
- **Countdown target times:** top of `js/main.js`
- **Share-preview image:** regenerate from `assets/og.html` (1200×630) with any
  Chromium browser:
  `"…/Brave Browser" --headless=new --screenshot=assets/og.png --window-size=1200,630 assets/og.html`

## Ideas for later

- RSVP via a Google Form (link a button to it)
- Photo gallery / our-story timeline once you have pictures
- A custom domain (`girisowmi.in` → repo Settings → Pages → Custom domain)
