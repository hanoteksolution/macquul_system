#!/bin/sh
set -e
cd /app

MARKER="node_modules/.deps-installed"
NEED_INSTALL=0

if [ ! -d "node_modules/framer-motion" ]; then
  NEED_INSTALL=1
fi
if [ ! -f "$MARKER" ]; then
  NEED_INSTALL=1
fi
if [ -f "package-lock.json" ] && [ "package-lock.json" -nt "$MARKER" ]; then
  NEED_INSTALL=1
fi

if [ "$NEED_INSTALL" -eq 1 ]; then
  echo "[client] Installing npm dependencies..."
  npm ci
  touch "$MARKER"
fi

# Production `next build` artifacts break `next dev` (missing dev page chunks → blank/500).
case "$*" in
  *dev*)
    if [ -d ".next" ]; then
      echo "[client] Clearing .next for a clean dev compile..."
      rm -rf .next
    fi
    ;;
esac

exec "$@"
