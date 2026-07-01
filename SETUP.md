# Setup & Startup Guide

## Overview

This project contains three services:

| Service | Directory | Stack | Default Port |
|---------|-----------|-------|-------------|
| **collaro-app** (Next.js) | `core/` | Node 23, Next.js 16, pnpm | `3000` (dev) / `4000` (Docker) |
| **image-service** (Rust) | `image-service/` | Rust 1.93, Axum, AWS SDK S3 | `3001` |
| **collaro-db** (PostgreSQL) | — | PostgreSQL 16.2 | `5432` |
| **MinIO** (S3-compatible storage) | — | MinIO latest | `9000` (API) / `9001` (Console) |

---

## Prerequisites

- **Docker & Docker Compose** (v2.24+) — for running PostgreSQL, MinIO, and image-service
- **pnpm** (v9) — for the Next.js frontend
- **Node.js** 23+ — for the Next.js frontend
- **Rust** 1.93+ — only needed if building image-service outside Docker

---

## Quick Start (Full Stack with Docker)

This brings up **everything** — PostgreSQL, MinIO, image-service, and the Next.js app — in one command:

```bash
docker compose up --build
```

| Service | Internal URL | External URL |
|---------|-------------|-------------|
| collaro-app | `http://collaro-app:3000` | `http://localhost:4000` |
| image-service | `http://image-service:3001` | `http://localhost:3001` |
| PostgreSQL | `collaro-db:5432` | `localhost:5432` |
| MinIO API | `http://minio:9000` | `http://localhost:9000` |
| MinIO Console | — | `http://localhost:9001` |

The app is accessible at **http://localhost:4000**.

### Environment Files

- `core/.env.development` — used when running the Next.js app locally (not in Docker)
- `core/.env.production` — used when building/running the Next.js app inside Docker
- `image-service/config/default.toml` — default config for image-service (dev)
- `image-service/config/dev.toml` — optional dev overrides (loaded on top of defaults)

### Environment Variables

#### collaro-app (core/)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/postgres` | PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Public URL of the app |
| `BETTER_AUTH_SECRET` | — | Secret for better-auth (generate with `openssl rand -base64 32`) |
| `IMAGE_SERVICE_URL` | `http://localhost:3001` | Internal URL of the image-service |

#### image-service

| Variable | Default | Description |
|----------|---------|-------------|
| `S3_ENDPOINT` | `http://127.0.0.1:9000` | S3-compatible storage endpoint |
| `S3_ACCESS_KEY` | — | S3 access key |
| `S3_SECRET_KEY` | — | S3 secret key |
| `S3_BUCKET` | `collaro-images` | S3 bucket name |
| `S3_REGION` | `auto` | S3 region |
| `S3_PUBLIC_URL` | `http://127.0.0.1:9000/collaro-images` | Publicly accessible S3 base URL |
| `S3_PROVIDER` | `minio` | `minio` or `r2` (controls path-style vs virtual-hosted) |
| `API_KEY` | *(empty)* | Shared secret for X-API-Key auth. Empty = disabled (dev mode) |
| `RUST_ENV` | `dev` | Config profile — loads `config/{env}.toml` if it exists |

---

## Starting Services Individually

### 1. PostgreSQL (standalone)

```bash
docker compose up collaro-db -d
```

Wait for it:
```bash
docker compose exec collaro-db pg_isready -U postgres
```

### 2. MinIO + image-service + MinIO Init

```bash
docker compose up minio-init --wait
```

This starts:
- `minio` — S3-compatible object storage (port 9000 API, 9001 Console)
- `minio-init` — one-shot container that creates the `collaro-images` bucket

Then start the image-service:
```bash
docker compose up image-service --build -d
```

Verify it's healthy:
```bash
curl http://localhost:3001/health
# → {"status":"ok","s3":true}
```

### 3. Next.js Frontend (collaro-app)

#### Option A: Inside Docker (with all deps)

```bash
docker compose up collaro-app --build -d
```

#### Option B: Locally (hot reload with Turbopack)

First start the dependencies:
```bash
docker compose up collaro-db minio minio-init -d
```

Then start the dev server:
```bash
cd core
pnpm install
pnpm dev
```

The app runs at **http://localhost:3000** with hot reload.

---

## Per-Service Details

### collaro-app (Next.js)

**Scripts** (run from `core/`):

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack (port 3000) |
| `pnpm build` | Production build (standalone output) |
| `pnpm start` | Start production server |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | Biome lint |
| `pnpm format` | Biome format |
| `pnpm db generate` | Generate Drizzle migrations |
| `pnpm db migrate` | Apply Drizzle migrations |
| `pnpm db push` | Push schema to DB (dev) |
| `pnpm db seed` | Seed the database |
| `pnpm docker:dev` | Run `docker compose -f docker-compose.dev.yaml` |

**Image Upload Flow:**

1. Browser sends multipart POST to `/api/images/upload`
2. Next.js proxy forwards to `image-service:3001/upload`
3. Image-service processes 4 WebP variants (avatar 400px, thumb 150px, medium 800px, full 1920px)
4. Variants are stored in MinIO under `avatars/{uuid}/{variant}.webp`
5. Metadata returned to the browser; `authClient.updateUser({ image: proxyUrl })` saves the avatar URL in the DB

### image-service (Rust)

**Commands** (run from `image-service/`):

| Command | Description |
|---------|-------------|
| `cargo check` | Type-check without building (fast) |
| `cargo build` | Build debug binary |
| `cargo build --release` | Build release binary |
| `cargo test` | Run unit tests (21 tests) |
| `cargo clippy -- -D warnings` | Lint (must pass CI) |
| `cargo run` | Start the service (requires MinIO) |

**API Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check — returns `{"status":"ok","s3":true}` or 503 if S3 is down |
| `POST` | `/upload` | Upload an image (multipart `file` field) — returns JSON with variant URLs |
| `GET` | `/images/{id}?variant={name}` | Retrieve a processed variant image |
| `DELETE` | `/images/{id}` | Delete all 4 variant objects |
| `GET` | `/events` | SSE stream — receives `processing.complete` events after uploads |
| `GET` | `/metrics` | Prometheus metrics (`upload_bytes_total`, `upload_count_total`) |

**Configuration priority** (highest wins):

1. Environment variables (e.g. `S3_ENDPOINT`, `API_KEY`)
2. `config/{RUST_ENV}.toml` (e.g. `config/dev.toml`)
3. `config/default.toml`

### PostgreSQL

- Runs as the `collaro-db` service in Docker
- Data persisted in the `postgres-data` Docker volume
- Health checked via `pg_isready`
- Schema managed by Drizzle ORM (run `pnpm db push` or `pnpm db migrate` from `core/`)

### MinIO

- S3-compatible object storage for processed images
- Web console at `http://localhost:9001` (credentials: `minioadmin` / `minioadmin`)
- Bucket `collaro-images` auto-created by `minio-init`
- Data persisted in the `minio_data` Docker volume

---

## Kubernetes Deployment

Production deployment uses kustomize manifests in `k8s/`:

```bash
kubectl apply -k k8s/
```

This deploys:
- Namespace: `collaro`
- PostgreSQL (StatefulSet with PVC)
- image-service (Deployment + Service + ConfigMap)
- collaro-app (Deployment + Service + ConfigMap + HPA)
- Ingress, NetworkPolicy, ServiceAccount

Update image tags in `k8s/kustomization.yaml` before deploying:

```yaml
images:
  - name: coderx85/collaro
    newTag: v2.0.0
  - name: coderx85/collaro-image-service
    newTag: v0.1.0
```

---

## Development Workflow

1. Start infrastructure:
   ```bash
   docker compose up collaro-db minio minio-init -d
   ```

2. Start image-service (with file watching):
   ```bash
   cd image-service
   cargo watch -x run
   ```

3. Start Next.js dev server:
   ```bash
   cd core
   pnpm dev
   ```

4. Run Rust tests before committing:
   ```bash
   cd image-service
   cargo test && cargo clippy -- -D warnings
   ```

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| `collaro-app` crashes on startup | Database not ready | Wait for `collaro-db` healthcheck, or run `docker compose up collaro-db -d` first |
| Image upload returns 500 | MinIO not running or bucket missing | `curl http://localhost:9001` — if unreachable, restart minio + minio-init |
| `{"status":"error","s3":false}` from health | S3 credentials wrong or MinIO down | Check `S3_ENDPOINT` and credentials in compose or env |
| 401 on image endpoints | API_KEY mismatch | Ensure `X-API-Key` header matches `API_KEY` env var (or leave `API_KEY` empty for dev mode) |
| EXIF orientation not applied | Image has no EXIF data | Only JPEG/TIFF images carry orientation tags; PNG/WebP are used as-is |
| `authClient.updateUser()` returns 500 | `image` column missing in `users` table | Run `pnpm db push` to add the column |
| Image shows broken/404 | Wrong variant name in URL | Valid variants: `avatar`, `thumb`, `medium`, `full` |
