use axum::extract::State;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Serialize;

use crate::state::AppState;

#[derive(Serialize)]
pub struct HealthResponse {
    status: &'static str,
    s3: bool,
    uptime_secs: u64,
}

pub async fn handler(State(state): State<AppState>) -> Response {
    let s3_ok = state.s3.health_check().await.is_ok();
    let body = HealthResponse {
        status: if s3_ok { "ok" } else { "degraded" },
        s3: s3_ok,
        uptime_secs: state.start_time.elapsed().as_secs(),
    };

    if s3_ok {
        (StatusCode::OK, Json(body)).into_response()
    } else {
        // Return 503 so k8s readiness probes mark the pod as not ready
        (StatusCode::SERVICE_UNAVAILABLE, Json(body)).into_response()
    }
}
