#!/usr/bin/env bash
# One-shot deploy: creates the GitHub repo, pushes, and enables GitHub Pages.
# Prerequisites: `brew install gh` and `gh auth login` (one-time, opens the browser).
set -euo pipefail
cd "$(dirname "$0")"

REPO="giri-sowmi-wedding"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI not found. Install it first:  brew install gh" >&2
  exit 1
fi
if ! gh auth status >/dev/null 2>&1; then
  echo "Not logged in to GitHub. Run:  gh auth login" >&2
  exit 1
fi

OWNER="$(gh api user --jq .login)"
echo "==> Deploying as GitHub user: $OWNER"

# Point the Open Graph tags at the real Pages URL (WhatsApp preview needs absolute URLs)
if grep -q "GITHUB_USERNAME" index.html; then
  sed -i '' "s/GITHUB_USERNAME/$OWNER/g" index.html
  git add index.html
  git commit -m "Point Open Graph URLs at $OWNER.github.io" \
             -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
fi

# Create the repo (idempotent-ish: skips creation if it already exists) and push
if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "==> Repo $OWNER/$REPO already exists; pushing"
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO.git"
  git push -u origin main
else
  gh repo create "$REPO" --public --source=. --remote=origin --push \
    --description "💍 Giri ♥ Sowmi — wedding website · 12 & 13 September 2026, Erode"
fi

# Enable GitHub Pages from the main branch root. A JSON body is used because
# the nested source object is awkward to express with -f key=value.
if echo '{"source":{"branch":"main","path":"/"}}' \
     | gh api -X POST "repos/$OWNER/$REPO/pages" --input - >/dev/null 2>&1; then
  echo "==> GitHub Pages enabled"
else
  echo "==> Pages already enabled, or enable it under Settings → Pages → main / (root)"
fi

gh api -X PATCH "repos/$OWNER/$REPO" \
  -f homepage="https://$OWNER.github.io/$REPO/" >/dev/null 2>&1 || true

URL="https://$OWNER.github.io/$REPO/"
echo ""
echo "==> Waiting for the first Pages build..."
for _ in $(seq 1 30); do
  if [ "$(curl -s -o /dev/null -w '%{http_code}' "$URL")" = "200" ]; then
    echo ""
    echo "🎉 Live now: $URL"
    exit 0
  fi
  sleep 10
done

echo ""
echo "🎉 Pushed! The first Pages build can take a few minutes. It will appear at:"
echo "   $URL"
