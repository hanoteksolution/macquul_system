#!/bin/sh
set -e

echo "Waiting for PostgreSQL at ${DB_HOST:-db}:${DB_PORT:-5432}..."
until python -c "
import os, socket
host = os.environ.get('DB_HOST', 'db')
port = int(os.environ.get('DB_PORT', '5432'))
s = socket.socket()
s.settimeout(2)
try:
    s.connect((host, port))
    raise SystemExit(0)
except OSError:
    raise SystemExit(1)
finally:
    s.close()
" 2>/dev/null; do
  sleep 2
done
echo "PostgreSQL is ready."

python manage.py migrate --noinput

exec "$@"
