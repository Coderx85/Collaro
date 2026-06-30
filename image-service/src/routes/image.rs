use axum::extract::{Path, State};
use axum::http::{header, HeaderMap};
use bytes::Bytes;

use crate::errors::app_error::AppError;
use crate::state::AppState;

pub async fn handler(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<(HeaderMap, Bytes), AppError> {
    if id.contains("..") || id.contains('/') {
        return Err(AppError::BadRequest("invalid image id".into()));
    }

    let key = format!("avatars/{id}.webp");

    match state.s3.get_object(&key).await {
        Ok((data, content_type)) => {
            let mut headers = HeaderMap::new();
            headers.insert(header::CONTENT_TYPE, content_type.parse().unwrap());
            headers.insert(header::CACHE_CONTROL, "public, max-age=31536000".parse().unwrap());
            Ok((headers, data))
        }
        Err(e) => {
            let msg = e.to_string();
            if msg.contains("NoSuchKey") || msg.contains("not found") {
                Err(AppError::NotFound("image not found".into()))
            } else {
                Err(AppError::Internal(e))
            }
        }
    }
}
