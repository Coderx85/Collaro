use axum::extract::{Multipart, State};
use axum::Json;
use bytes::Bytes;
use serde::Serialize;
use serde_json::json;
use uuid::Uuid;

use crate::errors::app_error::AppError;
use crate::metrics;
use crate::pipeline::processor::{self, Variant};
use crate::state::{AppState, SseEvent};

#[derive(Serialize)]
pub struct UploadResponse {
    pub url: String,
    pub key: String,
    pub variants: Vec<VariantInfo>,
}

#[derive(Serialize)]
pub struct VariantInfo {
    pub variant: &'static str,
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

    metrics::record_upload(data.len() as u64);

    let image_id = Uuid::new_v4();
    let mut variants = Vec::with_capacity(4);

    for variant in [Variant::Avatar, Variant::Thumbnail, Variant::Medium, Variant::Full] {
        let processed = processor::process_variant(&data, variant)?;
        let key = format!("avatars/{}/{}.webp", image_id, variant.suffix());
        let url = state
            .s3
            .put_object(&key, processed.bytes.into(), processed.content_type)
            .await?;

        variants.push(VariantInfo {
            variant: variant.suffix(),
            url,
            key,
        });
    }

    // Extract the avatar variant URL for the response top-level fields.
    let avatar = variants.iter().find(|v| v.variant == "avatar");

    let (avatar_url, avatar_key) = match avatar {
        Some(a) => (a.url.clone(), a.key.clone()),
        None => (String::new(), String::new()),
    };

    let _ = state.sse_tx.send(SseEvent {
        event_type: "processing.complete".into(),
        payload: json!({ "url": avatar_url, "key": avatar_key, "variants": variants }),
    });

    Ok(Json(UploadResponse {
        url: avatar_url,
        key: avatar_key,
        variants,
    }))
}
