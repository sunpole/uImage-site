#!/usr/bin/env bash
set -euo pipefail

OWNER="sunpole"
REPO="uImage-site"

gh auth status

if [ ! -d .git ]; then
  git init -b main
  git add .
  git commit -m "Launch public uImage patch notes site"
fi

if ! gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  gh repo create "$OWNER/$REPO" \
    --public \
    --description "Public uImage website and short bilingual patch notes" \
    --disable-issues \
    --disable-wiki
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/$OWNER/$REPO.git"
fi

git push -u origin main

gh api --method POST "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 || \
  gh api --method PUT "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null

gh workflow run pages.yml --repo "$OWNER/$REPO"
echo "Published repository: https://github.com/$OWNER/$REPO"
echo "Pages URL: https://$OWNER.github.io/$REPO/"
