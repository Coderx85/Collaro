use async_trait::async_trait;
use aws_sdk_s3::config::{BehaviorVersion, Credentials, Region};
use aws_sdk_s3::primitives::ByteStream;
use aws_sdk_s3::Client as S3Internal;
use bytes::Bytes;

use crate::config::S3Config;

#[async_trait]
pub trait S3Client: Send + Sync {
    async fn put_object(
        &self,
        key: &str,
        body: Bytes,
        content_type: &str,
    ) -> Result<String, anyhow::Error>;
    async fn get_object(&self, key: &str) -> Result<(Bytes, String), anyhow::Error>;
    async fn health_check(&self) -> Result<(), anyhow::Error>;
}

pub struct MinioClient {
    client: S3Internal,
    bucket: String,
    public_url: String,
}

impl MinioClient {
    pub fn new(config: &S3Config) -> Self {
        let creds = Credentials::new(
            config.access_key.clone().unwrap_or_default(),
            config.secret_key.clone().unwrap_or_default(),
            None,
            None,
            "minio",
        );
        let s3_config = aws_sdk_s3::Config::builder()
            .behavior_version(BehaviorVersion::latest())
            .endpoint_url(&config.endpoint)
            .region(Region::new(config.region.clone()))
            .credentials_provider(creds)
            .force_path_style(true)
            .build();
        let client = S3Internal::from_conf(s3_config);
        MinioClient { client, bucket: config.bucket.clone(), public_url: config.public_url.clone() }
    }
}

#[async_trait]
impl S3Client for MinioClient {
    async fn put_object(
        &self,
        key: &str,
        body: Bytes,
        content_type: &str,
    ) -> Result<String, anyhow::Error> {
        self.client
            .put_object()
            .bucket(&self.bucket)
            .key(key)
            .body(ByteStream::from(body))
            .content_type(content_type)
            .send()
            .await?;
        Ok(format!("{}/{}", self.public_url, key))
    }

    async fn get_object(&self, key: &str) -> Result<(Bytes, String), anyhow::Error> {
        let resp = self
            .client
            .get_object()
            .bucket(&self.bucket)
            .key(key)
            .send()
            .await?;
        let content_type = resp
            .content_type()
            .unwrap_or("application/octet-stream")
            .to_string();
        let data = resp.body.collect().await?.into_bytes();
        Ok((data, content_type))
    }

    async fn health_check(&self) -> Result<(), anyhow::Error> {
        self.client.head_bucket().bucket(&self.bucket).send().await?;
        Ok(())
    }
}

pub struct R2Client {
    client: S3Internal,
    bucket: String,
    public_url: String,
}

impl R2Client {
    pub fn new(config: &S3Config) -> Self {
        let creds = Credentials::new(
            config.access_key.clone().unwrap_or_default(),
            config.secret_key.clone().unwrap_or_default(),
            None,
            None,
            "r2",
        );
        let s3_config = aws_sdk_s3::Config::builder()
            .behavior_version(BehaviorVersion::latest())
            .endpoint_url(&config.endpoint)
            .region(Region::new(config.region.clone()))
            .credentials_provider(creds)
            .build();
        let client = S3Internal::from_conf(s3_config);
        R2Client { client, bucket: config.bucket.clone(), public_url: config.public_url.clone() }
    }
}

#[async_trait]
impl S3Client for R2Client {
    async fn put_object(
        &self,
        key: &str,
        body: Bytes,
        content_type: &str,
    ) -> Result<String, anyhow::Error> {
        self.client
            .put_object()
            .bucket(&self.bucket)
            .key(key)
            .body(ByteStream::from(body))
            .content_type(content_type)
            .send()
            .await?;
        Ok(format!("{}/{}", self.public_url, key))
    }

    async fn get_object(&self, key: &str) -> Result<(Bytes, String), anyhow::Error> {
        let resp = self
            .client
            .get_object()
            .bucket(&self.bucket)
            .key(key)
            .send()
            .await?;
        let content_type = resp
            .content_type()
            .unwrap_or("application/octet-stream")
            .to_string();
        let data = resp.body.collect().await?.into_bytes();
        Ok((data, content_type))
    }

    async fn health_check(&self) -> Result<(), anyhow::Error> {
        self.client.head_bucket().bucket(&self.bucket).send().await?;
        Ok(())
    }
}
