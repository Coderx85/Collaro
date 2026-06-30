pub mod client;
pub mod mock;

use std::sync::Arc;

use crate::config::{S3Config, S3Provider};
use client::S3Client;

pub fn create_s3_client(config: &S3Config) -> Arc<dyn S3Client> {
    match config.provider {
        S3Provider::MinIO => Arc::new(client::MinioClient::new(config)),
        S3Provider::R2 => Arc::new(client::R2Client::new(config)),
    }
}
