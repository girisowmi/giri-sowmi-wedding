#!/usr/bin/env bash
# Render invitation/invitation.html -> GiriSowmi.pdf (A4 landscape, 6 pages).
#
# Fonts and the QR images are fetched over the network / from disk, so the page
# is served over HTTP rather than opened as a file:// URL — Chromium blocks some
# subresource loads on file:// and the Tamil text would silently fall back to a
# default font.
set -euo pipefail
cd "$(dirname "$0")"

PORT=4788
OUT="GiriSowmi.pdf"

BROWSER=""
for candidate in \
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"; do
  [ -x "$candidate" ] && BROWSER="$candidate" && break
done
if [ -z "$BROWSER" ]; then
  echo "Need a Chromium-based browser (Brave, Chrome, Chromium or Edge) to render the PDF." >&2
  exit 1
fi

python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
sleep 2

"$BROWSER" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=20000 \
  --print-to-pdf="$OUT" \
  "http://localhost:$PORT/invitation/invitation.html" 2>&1 | grep -vi 'devtools\|bytes written' || true

if [ -f "$OUT" ]; then
  echo "==> $OUT written ($(du -h "$OUT" | cut -f1))"
else
  echo "PDF was not produced." >&2
  exit 1
fi
