use std::sync::atomic::{AtomicU64, Ordering};

use axum::response::{IntoResponse, Response};

// ---------------------------------------------------------------------------
// Counters
// ---------------------------------------------------------------------------

static UPLOAD_SIZE_TOTAL: AtomicU64 = AtomicU64::new(0);
static UPLOAD_COUNT: AtomicU64 = AtomicU64::new(0);

// ---------------------------------------------------------------------------
// Recording
// ---------------------------------------------------------------------------

/// Record an upload with its size in bytes.
pub fn record_upload(size_bytes: u64) {
    UPLOAD_COUNT.fetch_add(1, Ordering::Relaxed);
    UPLOAD_SIZE_TOTAL.fetch_add(size_bytes, Ordering::Relaxed);
}

// ---------------------------------------------------------------------------
// Prometheus exposition
// ---------------------------------------------------------------------------

pub async fn handler() -> Response {
    let upload_count = UPLOAD_COUNT.load(Ordering::Relaxed);
    let upload_bytes = UPLOAD_SIZE_TOTAL.load(Ordering::Relaxed);

    let body = format!(
        "\
# HELP upload_bytes_total Total bytes uploaded.
# TYPE upload_bytes_total counter
upload_bytes_total {upload_bytes}

# HELP upload_count_total Total number of uploads.
# TYPE upload_count_total counter
upload_count_total {upload_count}
"
    );

    ([("content-type", "text/plain; version=0.0.4")], body).into_response()
}
