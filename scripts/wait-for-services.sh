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
check_port macquul_system-client-1 3002 || { echo "[wait] FAIL: client port 3002"; failed=1; }
check_port macquul_system-admin-1 3003 || { echo "[wait] FAIL: admin port 3003"; failed=1; }
check_port macquul_system-backend-1 8001 || { echo "[wait] FAIL: api port 8001"; failed=1; }

if [ "$failed" -eq 1 ]; then
  echo "Run: make down && make up"
  exit 1
fi

wait_url "Store" "http://127.0.0.1:3002/" || exit 1
wait_url "Admin" "http://127.0.0.1:3003/" || exit 1
wait_url "API" "http://127.0.0.1:8001/admin/" || exit 1

echo ""
echo "All services are reachable."
exit 0
