use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;

use crate::pipeline::error::PipelineError;

/// Application-level error that converts into an HTTP response.
///
/// Maps to status codes:
/// - [`BadRequest`](AppError::BadRequest) → 400
/// - [`NotFound`](AppError::NotFound) → 404
/// - [`Internal`](AppError::Internal) → 500 (error is logged server-side, not leaked)
pub enum AppError {
    /// Invalid request (bad file, missing field, etc.).
    BadRequest(String),
    /// Requested image or resource does not exist.
    NotFound(String),
    /// Unrecoverable server error (logged server-side, generic message returned).
    Internal(anyhow::Error),
}

impl AppError {
    pub fn internal(e: impl Into<anyhow::Error>) -> Self {
        AppError::Internal(e.into())
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::BadRequest(m) => (StatusCode::BAD_REQUEST, m),
            AppError::NotFound(m) => (StatusCode::NOT_FOUND, m),
            AppError::Internal(e) => {
                tracing::error!(error = %e, "internal error");
                (StatusCode::INTERNAL_SERVER_ERROR, "internal server error".into())
            }
        };
        (status, Json(json!({ "error": message }))).into_response()
    }
}

impl From<PipelineError> for AppError {
    fn from(e: PipelineError) -> Self {
        AppError::BadRequest(e.to_string())
    }
}

impl From<anyhow::Error> for AppError {
    fn from(e: anyhow::Error) -> Self {
        AppError::Internal(e)
    }
}
