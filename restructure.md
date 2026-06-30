# Collaro Monorepo — Restructure Progress

## Current Structure (actual state)

```
collaro-image-service/
├── .entire/                            # (empty, for later)
├── .github/
├── .husky/                             # git hooks
├── .opencode/
├── .vscode/
├── core/                               # Next.js app
│   ├── .dockerignore
│   ├── .gitignore
│   ├── .husky/
│   ├── biome.json
│   ├── components.json
│   ├── dev/
│   │   ├── compose.yaml
│   │   └── observability/
│   ├── docker-compose.dev.yaml
│   ├── Dockerfile
│   ├── drizzle.config.ts
│   ├── next.config.ts
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── postcss.config.mjs
│   ├── public/
│   ├── src/                            # Next.js application source
│   └── tsconfig.json
├── docker-compose.yaml                 # Root orchestration (app + db)
├── docs/
├── image-service/                      # Rust image service ✅ moved in
│   ├── Cargo.toml
│   ├── Cargo.lock
│   ├── config/
│   │   └── default.toml
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── Plan.md
│   └── src/
│       ├── main.rs
│       ├── lib.rs
│       ├── state.rs
│       ├── config/
│       ├── errors/
│       ├── pipeline/
│       ├── routes/
│       └── s3/
└── k8s/                                # Kubernetes manifests
    ├── configmap.yaml
    ├── deployment.yaml
    ├── hpa.yaml
    ├── ingress.yaml
    ├── kustomization.yaml
    ├── namespace.yaml
    ├── networkpolicy.yaml
    ├── postgres.yaml
    ├── secret.yaml
    ├── service.yaml
    └── serviceaccount.yaml
```

## Next Steps

### Phase 2 — Integration

| # | Task | Status |
|---|------|--------|
| 2.1 | Add MinIO + image-service to root `docker-compose.yaml` | ⬜ |
| 2.2 | Add image-service to `docker-compose.dev.yaml` in `core/dev/` | ⬜ |
| 2.3 | Add k8s manifests for image-service (deployment, service, configmap) | ⬜ |
| 2.4 | Update `k8s/kustomization.yaml` to include image-service | ⬜ |
| 2.5 | Update `.github/workflows/publish.yaml` to build/publish image-service | ⬜ |
| 2.6 | Create `core/src/app/api/images/upload/route.ts` (Next.js proxy) | ⬜ |
| 2.7 | Create `core/src/app/api/images/[id]/route.ts` (Next.js proxy) | ⬜ |
| 2.8 | Build frontend components (upload UI, avatar display, admin mgmt) | ⬜ |

### Phase 3 — Rust Features

| # | Task | Status |
|---|------|--------|
| 3.1 | Complete SSE events (emit on upload) | ⬜ |
| 3.2 | Add `DELETE /image/{id}` route + `S3Client::delete_object()` | ⬜ |
| 3.3 | Add image variants (Thumbnail, Medium, Full) | ⬜ |
| 3.4 | Add Rust unit tests (pipeline, S3 mock, routes) | ⬜ |

### Phase 4 — Plumbing

| # | Task | Status |
|---|------|--------|
| 4.1 | Clean up unused root files from `collaro/` origin | ⬜ |
| 4.2 | Remove `image-service/Plan.md` (superseded by this file) | ⬜ |
| 4.3 | Remove `image-service/docker-compose.yml` (merged into root) | ⬜ |
