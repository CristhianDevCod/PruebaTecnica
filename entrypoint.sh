#!/usr/bin/env sh
set -euo pipefail

# entrypoint.sh (sin usar "yarn" en runtime)
# Espera a la DB, ejecuta prisma migrate deploy desde node_modules y arranca next

get_host_port() {
  url="${DATABASE_URL:-}"
  if [ -z "$url" ]; then
    echo "DATABASE_URL no está definida" >&2
    return 1
  fi
  host=$(echo "$url" | sed -E 's#^.*@([^:/]+).*#\1#')
  port=$(echo "$url" | sed -E 's#.*:([0-9]+)/.*#\1#' || true)
  if [ -z "$port" ]; then port=5432; fi
  echo "$host" "$port"
}

wait_for_db() {
  echo "Esperando a la base de datos (DATABASE_URL=${DATABASE_URL:-}) ..."
  tries=0
  max_tries=${DB_WAIT_MAX_TRIES:-60}
  sleep_interval=${DB_WAIT_SLEEP:-1}
  while true; do
    set +e
    hostport=$(get_host_port) || exit 1
    host=$(echo $hostport | awk '{print $1}')
    port=$(echo $hostport | awk '{print $2}')
    nc -z "$host" "$port"
    rc=$?
    set -e
    if [ "$rc" -eq 0 ]; then
      echo "Base de datos escuchando en $host:$port"
      break
    fi
    tries=$((tries+1))
    if [ "$tries" -ge "$max_tries" ]; then
      echo "La base de datos no respondió después de $tries intentos." >&2
      exit 1
    fi
    sleep $sleep_interval
  done
}

wait_for_db

# Ejecutar solo migrate deploy (no generate) desde node_modules si existe prisma
PRISMA_BIN="./node_modules/.bin/prisma"
if [ -x "$PRISMA_BIN" ]; then
  if [ "${RUN_PRISMA_MIGRATE:-1}" != "0" ]; then
    echo "Aplicando migraciones (prisma migrate deploy)..."
    "$PRISMA_BIN" migrate deploy || {
      echo "prisma migrate deploy devolvió error (continuando)." >&2
    }
  else
    echo "RUN_PRISMA_MIGRATE=0 => omitiendo migrate deploy."
  fi
else
  echo "No se encontró prisma en node_modules; omitiendo migrate."
fi

# Lanzar Next.js directamente desde node_modules para evitar usar yarn en runtime.
NEXT_BIN="./node_modules/.bin/next"
if [ -x "$NEXT_BIN" ]; then
  echo "Iniciando Next.js (next start -p 3000)..."
  exec "$NEXT_BIN" start -p 3000
fi

# Fallback: si no existe next binary, ejecutar lo que venga en CMD
echo "No se encontró next en node_modules; ejecutando comando CMD..."
exec "$@"
