use axum::extract::State;
use axum::Json;
use serde::Serialize;

use crate::state::AppState;

#[derive(Serialize)]
pub struct HealthResponse {
    status: &'static str,
    s3: bool,
    uptime_secs: u64,
}

pub async fn handler(State(state): State<AppState>) -> Json<HealthResponse> {
    let s3_ok = state.s3.health_check().await.is_ok();
    Json(HealthResponse {
        status: if s3_ok { "ok" } else { "degraded" },
        s3: s3_ok,
        uptime_secs: state.start_time.elapsed().as_secs(),
    })
}
