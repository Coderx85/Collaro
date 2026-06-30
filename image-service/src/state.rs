use std::sync::Arc;
use std::time::Instant;

use serde::Serialize;
use tokio::sync::broadcast;

use crate::config::AppConfig;
use crate::s3::client::S3Client;

/// An event dispatched to all SSE (`GET /events`) subscribers after
/// an upload completes.
#[derive(Clone, Serialize)]
pub struct SseEvent {
    /// Event type used as the SSE `event:` field (e.g. `"processing.complete"`).
    pub event_type: String,
    /// Arbitrary JSON payload sent as the SSE `data:` field.
    pub payload: serde_json::Value,
}

/// Shared application state injected into every Axum handler.
#[derive(Clone)]
pub struct AppState {
    /// S3-compatible object storage client (MinIO or R2).
    pub s3: Arc<dyn S3Client>,
    /// Loaded application configuration.
    pub config: AppConfig,
    /// Timestamp when the service started (used for uptime reporting).
    pub start_time: Instant,
    /// Channel sender used to broadcast SSE events to all connected clients.
    pub sse_tx: broadcast::Sender<SseEvent>,
}
