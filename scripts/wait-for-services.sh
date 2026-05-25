#!/bin/sh
# Waits until published ports respond (Unix/macOS/Linux).
TIMEOUT="${1:-180}"
deadline=$(( $(date +%s) + TIMEOUT ))

check_port() {
  docker port "$1" 2>/dev/null | grep -q ":$2"
}

wait_url() {
  name=$1
  url=$2
  echo "[wait] $name $url ..."
  while [ "$(date +%s)" -lt "$deadline" ]; do
    code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url" 2>/dev/null || echo "000")
    if [ "$code" != "000" ] && [ "$code" -lt 500 ]; then
      echo "[wait] $name ready (HTTP $code)"
      return 0
    fi
    sleep 3
  done
  echo "[wait] FAIL: $name did not respond in time"
  return 1
}

echo "[wait] Checking Docker port bindings..."
failed=0
CLIENT_PORT="${CLIENT_HOST_PORT:-3002}"
ADMIN_PORT="${ADMIN_HOST_PORT:-3010}"
API_PORT="${API_HOST_PORT:-8020}"
check_port macquul_system-client-1 "$CLIENT_PORT" || { echo "[wait] FAIL: client port $CLIENT_PORT"; failed=1; }
check_port macquul_system-admin-1 "$ADMIN_PORT" || { echo "[wait] FAIL: admin port $ADMIN_PORT"; failed=1; }
check_port macquul_system-backend-1 "$API_PORT" || { echo "[wait] FAIL: api port $API_PORT"; failed=1; }

if [ "$failed" -eq 1 ]; then
  echo "Run: make down && make up"
  exit 1
fi

wait_url "Store" "http://127.0.0.1:${CLIENT_PORT}/" || exit 1
wait_url "Admin" "http://127.0.0.1:${ADMIN_PORT}/" || exit 1
wait_url "API" "http://127.0.0.1:${API_PORT}/admin/" || exit 1

echo ""
echo "All services are reachable."
exit 0
