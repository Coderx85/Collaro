use axum::extract::{Path, State};
use tracing::warn;

use crate::errors::app_error::AppError;
use crate::pipeline::processor::Variant;
use crate::state::AppState;

pub async fn handler(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<(), AppError> {
    if id.contains("..") || id.contains('/') {
        return Err(AppError::BadRequest("invalid image id".into()));
    }

    let variants = [Variant::Avatar, Variant::Thumbnail, Variant::Medium, Variant::Full];
    let mut any_error = false;

    for variant in variants {
        let key = format!("avatars/{id}/{}.webp", variant.suffix());
        if let Err(e) = state.s3.delete_object(&key).await {
            warn!(error = %e, key = %key, "failed to delete variant");
            any_error = true;
        }
    }

    if any_error {
        Err(AppError::internal(anyhow::anyhow!("failed to delete one or more variants")))
    } else {
        Ok(())
    }
}
