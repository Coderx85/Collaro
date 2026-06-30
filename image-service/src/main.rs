#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "image_service=info,tower_http=info".into()),
        )
        .with_target(false)
        .init();

    let cfg = image_service::config::loader::load()?;
    let s3 = image_service::s3::create_s3_client(&cfg.s3);

    let (sse_tx, _) = tokio::sync::broadcast::channel(1024);

    let state = image_service::state::AppState {
        s3,
        config: cfg.clone(),
        start_time: std::time::Instant::now(),
        sse_tx,
    };

    let app = image_service::routes::create_router(state)
        .layer(image_service::middleware::request_id::RequestIdLayer)
        .layer(image_service::middleware::auth::AuthMiddleware::new(&cfg));

    let addr = format!("{}:{}", cfg.server.host, cfg.server.port);
    tracing::info!("listening on {addr} (s3={})", cfg.s3.endpoint);

    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
