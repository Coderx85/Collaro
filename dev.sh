#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# dev.sh — start all Collaro services locally for development
# Usage:  ./dev.sh              (normal mode)
#         ./dev.sh --build      (rebuild image-service before starting)
#         ./dev.sh --release    (run image-service in release mode)
#         ./dev.sh --help       (show usage)
#
# Stops all services on Ctrl+C.
# ──────────────────────────────────────────────────────────────────────────────

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
CORE_DIR="$ROOT_DIR/core"
IMAGE_SERVICE_DIR="$ROOT_DIR/image-service"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yaml"

MODE="debug"
BUILD=false

show_help() {
  sed -n '3,11p' "$0"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h) show_help ;;
    --build)   BUILD=true; shift ;;
    --release) MODE="release"; shift ;;
    *) echo "Unknown option: $1"; show_help ;;
  esac
done

# ── Prerequisites ────────────────────────────────────────────────────────────

command -v docker >/dev/null 2>&1 || { echo "ERROR: docker is required"; exit 1; }
command -v pnpm   >/dev/null 2>&1 || { echo "ERROR: pnpm (v9+) is required"; exit 1; }
command -v rustc  >/dev/null 2>&1 || { echo "ERROR: rustc 1.93+ is required"; exit 1; }
command -v cargo  >/dev/null 2>&1 || { echo "ERROR: cargo is required"; exit 1; }

# Verify the compose file exists
if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "ERROR: $COMPOSE_FILE not found"
  exit 1
fi

# ── Cleanup handler ──────────────────────────────────────────────────────────

cleanup() {
  echo ""
  echo "═══ Shutting down all services ═══"
  # Kill background processes (image-service, Next.js)
  if [[ -n "${IMAGE_SERVICE_PID:-}" ]]; then
    echo "→ Stopping image-service (PID $IMAGE_SERVICE_PID)"
    kill "$IMAGE_SERVICE_PID" 2>/dev/null || true
  fi
  if [[ -n "${NEXTJS_PID:-}" ]]; then
    echo "→ Stopping Next.js dev server (PID $NEXTJS_PID)"
    kill "$NEXTJS_PID" 2>/dev/null || true
  fi
  # Stop docker containers (keep volumes for faster restart)
  echo "→ Stopping Docker infrastructure..."
  docker compose -f "$COMPOSE_FILE" down 2>/dev/null || true
  echo "═══ All services stopped ═══"
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# ── Step 1: Docker infrastructure ────────────────────────────────────────────

echo "══════════════════════════════════════════════════════════════════════════"
echo " 1. Starting infrastructure (PostgreSQL + MinIO)"
echo "══════════════════════════════════════════════════════════════════════════"

docker compose -f "$COMPOSE_FILE" up --wait --wait-timeout 120 \
  collaro-db minio minio-init 2>&1 | sed 's/^/   [docker] /'

echo "   ✓ PostgreSQL ready"
echo "   ✓ MinIO ready (bucket 'collaro-images' created)"

# ── Step 2: Image service ────────────────────────────────────────────────────

echo ""
echo "══════════════════════════════════════════════════════════════════════════"
echo " 2. Starting image-service (Rust)"
echo "══════════════════════════════════════════════════════════════════════════"

export RUST_ENV="${RUST_ENV:-dev}"
export S3_ENDPOINT="${S3_ENDPOINT:-http://127.0.0.1:9000}"
export S3_ACCESS_KEY="${S3_ACCESS_KEY:-minioadmin}"
export S3_SECRET_KEY="${S3_SECRET_KEY:-minioadmin}"

cd "$IMAGE_SERVICE_DIR"

if [[ "$BUILD" == true ]]; then
  echo "   Building image-service ($MODE)..."
  if [[ "$MODE" == "release" ]]; then
    cargo build --release 2>&1 | sed 's/^/   [cargo] /'
  else
    cargo build 2>&1 | sed 's/^/   [cargo] /'
  fi
fi

echo "   Starting image-service ($MODE)..."
if [[ "$MODE" == "release" ]]; then
  cargo run --release &
else
  cargo run &
fi
IMAGE_SERVICE_PID=$!

# Wait for the health endpoint
echo "   Waiting for image-service to be ready..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:3001/health >/dev/null 2>&1; then
    echo "   ✓ image-service healthy on http://localhost:3001"
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "   ✗ image-service failed to start within 30 seconds"
    exit 1
  fi
  sleep 1
done

cd "$ROOT_DIR"

# ── Step 3: Next.js dev server ───────────────────────────────────────────────

echo ""
echo "══════════════════════════════════════════════════════════════════════════"
echo " 3. Starting Next.js dev server (core/)"
echo "══════════════════════════════════════════════════════════════════════════"

cd "$CORE_DIR"

if [[ ! -d node_modules ]]; then
  echo "   Installing dependencies..."
  pnpm install 2>&1 | sed 's/^/   [pnpm] /'
fi

echo "   Starting Next.js with Turbopack..."
IMAGE_SERVICE_URL=http://localhost:3001 pnpm dev &
NEXTJS_PID=$!

# Wait for the Next.js dev server
echo "   Waiting for Next.js..."
for i in $(seq 1 60); do
  if curl -sf http://localhost:3000 >/dev/null 2>&1; then
    echo "   ✓ Next.js ready on http://localhost:3000"
    break
  fi
  if [[ $i -eq 60 ]]; then
    echo "   ✗ Next.js failed to start within 60 seconds"
    exit 1
  fi
  sleep 1
done

cd "$ROOT_DIR"

# ── Ready ────────────────────────────────────────────────────────────────────

echo ""
echo "══════════════════════════════════════════════════════════════════════════"
echo " All services are running!"
echo ""
echo "   Frontend :  http://localhost:3000"
echo "   API      :  http://localhost:3001/health"
echo "   MinIO    :  http://localhost:9001  (minioadmin / minioadmin)"
echo "   Postgres :  localhost:5432"
echo ""
echo " Press Ctrl+C to stop all services."
echo "══════════════════════════════════════════════════════════════════════════"

# Wait for either background process to exit (the trap handles cleanup)
wait
