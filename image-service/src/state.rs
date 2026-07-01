use std::sync::Arc;
use std::time::Instant;

use serde::Serialize;
use tokio::sync::broadcast;

use crate::config::AppConfig;
use crate::s3::client::S3Client;

#[derive(Clone, Serialize)]
pub struct SseEvent {
    pub event_type: String,
    pub payload: serde_json::Value,
}

#[derive(Clone)]
pub struct AppState {
    pub s3: Arc<dyn S3Client>,
    pub config: AppConfig,
    pub start_time: Instant,
    pub sse_tx: broadcast::Sender<SseEvent>,
}
