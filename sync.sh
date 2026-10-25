#!/bin/sh
# ينسخ ملفات docs/ (المصدر) إلى جذر المستودع
set -e
cd "$(dirname "$0")"
for f in index.html app.css app.js sw.js manifest.json privacy.html; do cp "docs/$f" "$f"; done
rm -rf icons && cp -r docs/icons icons
echo "synced"
