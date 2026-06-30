pub mod loader;

use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum S3Provider {
    MinIO,
    R2,
}

#[derive(Debug, Clone, Deserialize)]
pub struct S3Config {
    pub provider: S3Provider,
    pub endpoint: String,
    pub region: String,
    pub bucket: String,
    pub public_url: String,
    #[serde(default)]
    pub access_key: Option<String>,
    #[serde(default)]
    pub secret_key: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
    #[serde(default)]
    pub api_key: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub s3: S3Config,
}
