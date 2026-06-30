# Image Service — Complete

All 10 units implemented and compiling. `cargo check` passes.

## Project structure

```
image-service/
├── Cargo.toml              # 17 dependencies
├── Dockerfile              # Multi-stage Rust build
├── docker-compose.yml      # MinIO + image-service
├── .dockerignore
├── config/
│   └── default.toml        # Server + S3 config
└── src/
    ├── main.rs             # #[tokio::main] entrypoint
    ├── lib.rs              # Module root
    ├── state.rs            # AppState (S3 client, config, SSE tx)
    ├── config/
    │   ├── mod.rs          # AppConfig, S3Config, ServerConfig, S3Provider
    │   └── loader.rs       # Layered config (file + env)
    ├── s3/
    │   ├── mod.rs          # create_s3_client factory
    │   ├── client.rs       # S3Client trait, MinioClient, R2Client
    │   └── mock.rs         # MockS3Client for tests
    ├── pipeline/
    │   ├── mod.rs
    │   ├── processor.rs    # validate_and_process → center crop → WebP
    │   └── error.rs        # PipelineError
    ├── routes/
    │   ├── mod.rs          # create_router (all routes)
    │   ├── upload.rs       # POST /upload
    │   ├── image.rs        # GET /image/{id}
    │   ├── health.rs       # GET /health
    │   └── sse.rs          # GET /events (SSE skeleton)
    └── errors/
        ├── mod.rs
        └── app_error.rs    # AppError with IntoResponse
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST   | /upload | Upload image → crop to avatar → WebP → S3 |
| GET    | /image/{id} | Serve avatar from S3 |
| GET    | /health | Health check (S3 connectivity, uptime) |
| GET    | /events | SSE event stream (skeleton) |
