# 💍 Giri ♥ Sowmi — Wedding Website

A single-page wedding invitation site in purple and blue, after the couple's own
💙💜 monogram — lavender paper, deep indigo ink, coconut palms, drifting blooms,
flocks of birds and a violet *toran*.

**Events**

| Event | When | Where |
|---|---|---|
| Mugurthakkal · முகூர்த்தக்கால் | Sat 12 Sep 2026, 6.00 – 7.00 PM | Brindhavan Mahal, Palayapalayam, Erode |
| Reception | Sat 12 Sep 2026, 6.00 – 9.00 PM | Brindhavan Mahal, Palayapalayam, Erode |
| Muhurtham | Sun 13 Sep 2026, 9.00 – 10.00 AM | Shri Arulmigu Velayuthaswamy Temple, Thindal, Erode |
| Lunch · மதிய விருந்து | Sun 13 Sep 2026, 12.00 – 1.30 PM | Shri Arulmigu Velayuthaswamy Temple, Thindal |

## Features

- Live countdown (celebrations → muhurtham → "Happily married!")
- **Wedding-day crackers** 🎆 — a fireworks canvas that switches itself on for
  12–13 September 2026 (IST) and stays dormant every other day
- **View and download both invitations** — nothing is shown until a guest taps
  View, which opens a swipeable 5-page lightbox; both are downloadable
- **Spotify playlist** (♾️💙💜) — every track listed, click any one to play
- **Contact card** with tap-to-call and WhatsApp links
- **3 themes and 3 font pairings**, chosen by the guest and remembered
- Animated scenery: swaying coconut palms, flocks of birds, drifting blooms and petals
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

## Themes and fonts

A palette button sits in the bottom-right corner. Choices are kept in
`localStorage`, and a theme is applied inline in `<head>` before the first paint
so a returning guest never sees the default flash first.

| Theme | Look |
|---|---|
| `violet` | lavender paper, deep indigo ink, violet and cornflower (default) |
| `rose` | the printed card's cream, deep green and antique gold |
| `midnight` | dark indigo night, glowing lanterns, silhouetted palms |

| Font | Pairing |
|---|---|
| `classic` | Great Vibes + Cormorant Garamond (default) |
| `romantic` | Parisienne + Lora |
| `refined` | Pinyon Script + Marcellus |

You can also force either with a query string, which makes a specific look
shareable as a link: `?theme=midnight&font=refined`.

Every colour in `css/style.css` **and** in the inline SVGs comes from a
variable, so adding a theme means copying one `[data-theme="…"]` block and
changing the values — the palms, toran, florals, lanterns, petals and blooms all
follow. That is also why the palms and toran are inline SVG rather than files:
an `<img>` cannot see the page's variables. The petal and bloom shapes are data
URIs built in `js/main.js`, which `GSDecor.repaint()` regenerates on a theme
change.

All nine theme × font combinations were checked for text contrast.

## Editing

- **Copy/text & event details:** `index.html`
- **Colors & fonts:** CSS variables at the top of `css/style.css`
- **Countdown target times:** top of `js/main.js`
- **Crackers dates, colours, density:** top of `js/crackers.js`
- **Scenery:** `assets/palm.svg` (fronds animate from a `<style>` inside the SVG,
  since it is used via `<img>`), `assets/toran.svg`; birds and blooms are in
  `index.html` / `js/main.js`
- **Venue QR codes:** `assets/qr-*.svg` — regenerate with `segno`
- **Share-preview image:** regenerate from `assets/og.html` (1200×630) with any
  Chromium browser:
  `"…/Brave Browser" --headless=new --screenshot=assets/og.png --window-size=1200,630 assets/og.html`

## Ideas for later

- RSVP via a Google Form (link a button to it)
- Photo gallery / our-story timeline once you have pictures
- A custom domain (`girisowmi.in` → repo Settings → Pages → Custom domain)
