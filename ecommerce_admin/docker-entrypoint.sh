#!/bin/sh
set -e
cd /app

MARKER="node_modules/.deps-installed"
NEED_INSTALL=0

if [ ! -d "node_modules/next" ]; then
  NEED_INSTALL=1
fi
if [ ! -f "$MARKER" ]; then
  NEED_INSTALL=1
fi
if [ -f "package-lock.json" ] && [ "package-lock.json" -nt "$MARKER" ]; then
  NEED_INSTALL=1
fi

if [ "$NEED_INSTALL" -eq 1 ]; then
  echo "[admin] Installing npm dependencies..."
  npm ci
  touch "$MARKER"
fi

exec "$@"
