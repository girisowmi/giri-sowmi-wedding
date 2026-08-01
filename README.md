# 💍 Giri ♥ Sowmi — Wedding Website

A single-page wedding invitation site, styled after the printed invite — cream & deep
green with antique-gold accents, blush florals, hanging lanterns, string lights and
falling petals, a marigold *toran*, and Bala Murugan at its heart.

**Events**

| Event | When | Where |
|---|---|---|
| Mugurthakkal · முகூர்த்தக்கால் | Sat 12 Sep 2026, 6.00 – 7.00 PM | Brindhavan Mahal, Palayapalayam, Erode |
| Reception | Sat 12 Sep 2026, 6.00 – 9.00 PM | Brindhavan Mahal, Palayapalayam, Erode |
| Muhurtham | Sun 13 Sep 2026, 9.00 – 10.00 AM | Shri Arulmigu Velayuthaswamy Temple, Thindal, Erode |
| Lunch · மதிய விருந்து | Sun 13 Sep 2026, 12.00 – 1.30 PM | Shri Arulmigu Velayuthaswamy Temple, Thindal |

## Features

- Live countdown (celebrations → muhurtham → "Happily married!")
- **Lord Murugan** section — Bala Murugan with the Vel, *வெற்றி வேல் • வீர வேல்*
- **Wedding-day crackers** 🎆 — a fireworks canvas that switches itself on for
  12–13 September 2026 (IST) and stays dormant every other day
- **View and download both invitations** — the formal card opens in a swipeable
  5-page lightbox; both are downloadable
- **Spotify playlist** embed for the songs of the day
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

## The invitations

Both of the couple's own files are served straight from the repo:

| File | Used for |
|---|---|
| `GiriSowmiWeddingInvitation.pdf` | the formal card — download button |
| `GiriSowmi-Wedding.png` | the save-the-date card — download button |
| `assets/invite/page-1…5.jpg` | web-sized pages for the in-page viewer |
| `assets/invite/casual.jpg` | web-sized save-the-date for the viewer |

The viewer images are compressed copies so the page stays fast; the download
buttons always hand over the full-quality originals. If you replace either
original, regenerate the viewer copies:

```bash
pdfimages -j GiriSowmiWeddingInvitation.pdf /tmp/pg && python3 -c "
from PIL import Image
for i in range(5):
    im = Image.open(f'/tmp/pg-{i:03d}.jpg').convert('RGB')
    im.save(f'assets/invite/page-{i+1}.jpg','JPEG',quality=84,optimize=True,progressive=True)"
```

## The playlist

Open your playlist in Spotify → **Share → Copy link**, then paste it into
`SPOTIFY_LINK` at the top of `js/invitation.js`:

```js
var SPOTIFY_LINK = 'https://open.spotify.com/playlist/xxxxxxxxxxxxxxxxxxxxxx';
```

Albums, single tracks and artists work too. Until it is set, the section shows
a placeholder. Note that Spotify's embed plays **full songs only for listeners
signed in to Spotify** — everyone else hears a 30-second preview of each track.
That is Spotify's rule for embeds and cannot be worked around.

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
