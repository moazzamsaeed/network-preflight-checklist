#!/usr/bin/env bash
# Publish dist/ to the gh-pages branch of the repo's `origin` remote.
# GitHub Pages must be configured to serve from the `gh-pages` branch.
set -euo pipefail

ROOT=$(git rev-parse --show-toplevel)
REMOTE=$(git -C "$ROOT" config --get remote.origin.url)
DIST="$ROOT/dist"

if [[ ! -d "$DIST" ]]; then
  echo "error: $DIST does not exist; run \`npm run build\` first" >&2
  exit 1
fi

touch "$DIST/.nojekyll"

# Stand up an isolated git tree inside dist/ and force-push it as gh-pages.
rm -rf "$DIST/.git"
git -C "$DIST" init -q -b gh-pages
git -C "$DIST" add -A
git -C "$DIST" -c user.name=deploy -c user.email=deploy@local \
  commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git -C "$DIST" push -f "$REMOTE" gh-pages

rm -rf "$DIST/.git"
echo "Published. Site: https://moazzamsaeed.github.io/network-preflight-checklist/"
