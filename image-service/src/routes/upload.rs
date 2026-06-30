use axum::extract::{Multipart, State};
use axum::Json;
use bytes::Bytes;
use serde::Serialize;
use uuid::Uuid;

use crate::errors::app_error::AppError;
use crate::pipeline::processor;
use crate::state::AppState;

#[derive(Serialize)]
pub struct UploadResponse {
    pub url: String,
    pub key: String,
}

pub async fn handler(
    State(state): State<AppState>,
    mut multipart: Multipart,
) -> Result<Json<UploadResponse>, AppError> {
    let field = multipart
        .next_field()
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?
        .ok_or_else(|| AppError::BadRequest("no file uploaded".into()))?;

    let data: Bytes = field.bytes().await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    let processed = processor::validate_and_process(&data)?;

    let key = format!("avatars/{}.webp", Uuid::new_v4());
    let url = state
        .s3
        .put_object(&key, processed.bytes.into(), processed.content_type)
        .await?;

    Ok(Json(UploadResponse { url, key }))
}
