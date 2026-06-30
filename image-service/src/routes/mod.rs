pub mod upload;
pub mod image;
pub mod health;
pub mod sse;
pub mod delete;

use axum::extract::DefaultBodyLimit;
use axum::routing::{get, post};
use axum::Router;

use crate::metrics;
use crate::pipeline::processor::MAX_FILE_SIZE;
use crate::state::AppState;

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/upload", post(upload::handler))
        .route("/image/{id}", get(image::handler).delete(delete::handler))
        .route("/health", get(health::handler))
        .route("/events", get(sse::handler))
        .route("/metrics", get(metrics::handler))
        .layer(DefaultBodyLimit::max(MAX_FILE_SIZE as usize))
        .with_state(state)
}
