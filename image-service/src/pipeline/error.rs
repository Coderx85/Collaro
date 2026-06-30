use thiserror::Error;

#[derive(Debug, Error)]
pub enum PipelineError {
    #[error("unsupported format")]
    UnsupportedFormat,
    #[error("file too large: {0} bytes (max {1})")]
    FileTooLarge(u64, u64),
    #[error("failed to decode image: {0}")]
    Decode(#[from] image::ImageError),
    #[error("failed to encode image: {0}")]
    Encode(String),
}
