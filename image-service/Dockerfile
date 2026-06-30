FROM rust:1.93-slim AS builder
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src/ src/
COPY config/ config/
RUN cargo build --release

FROM debian:trixie-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/image-service /usr/local/bin/image-service
COPY --from=builder /app/config/ /app/config/
WORKDIR /app
EXPOSE 3001
CMD ["image-service"]
