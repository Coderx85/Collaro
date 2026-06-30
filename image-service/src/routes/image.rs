use axum::extract::{Path, Query, State};
use axum::http::{header, HeaderMap};
use bytes::Bytes;
use serde::Deserialize;

use crate::errors::app_error::AppError;
use crate::pipeline::processor::Variant;
use crate::state::AppState;

#[derive(Deserialize)]
pub struct ImageQuery {
    variant: Option<String>,
}

pub async fn handler(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Query(query): Query<ImageQuery>,
) -> Result<(HeaderMap, Bytes), AppError> {
    if id.contains("..") || id.contains('/') {
        return Err(AppError::BadRequest("invalid image id".into()));
    }

    let variant = match query.variant.as_deref() {
        Some(v) => v.parse::<Variant>().map_err(|()| AppError::BadRequest("invalid variant".into()))?,
        None => Variant::Avatar,
    };

    let key = format!("avatars/{}/{}.webp", id, variant.suffix());

    match state.s3.get_object(&key).await {
        Ok((data, content_type)) => {
            let mut headers = HeaderMap::new();
            // SAFETY: content type comes from S3 or our pipeline; both always produce valid header values.
            headers.insert(
                header::CONTENT_TYPE,
                content_type.parse().expect("S3 content-type should be a valid header value"),
            );
            headers.insert(
                header::CACHE_CONTROL,
                "public, max-age=31536000"
                    .parse()
                    .expect("static cache-control value is valid"),
            );
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
