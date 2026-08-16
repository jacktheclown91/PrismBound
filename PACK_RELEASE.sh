#!/bin/sh
# Ensure the pinned release toolchain (Terser + Roadroller) is present for the
# optimized Roadroller pipeline. If Node/npm are unavailable the packer prints a
# clear warning and still emits a legal (larger) Zopfli baseline build.
cd "$(dirname "$0")" || exit 1
if [ ! -f tools/node_modules/roadroller/cli.mjs ] && command -v npm >/dev/null 2>&1; then
  echo "Installing pinned release tools in tools/ ..."
  ( cd tools && { npm ci --silent 2>/dev/null || npm install --silent; } )
fi
python3 tools/pack_release.py
