use config::{Config, File};
use config::ConfigError;
use std::collections::HashMap;

use super::AppConfig;

pub fn load() -> Result<AppConfig, ConfigError> {
    let env = std::env::var("RUST_ENV").unwrap_or_else(|_| "dev".into());

    let mut env_overrides: HashMap<String, String> = HashMap::new();

    for (key, value) in std::env::vars() {
        match key.as_str() {
            "S3_ENDPOINT" | "s3_endpoint" | "S3__ENDPOINT" | "s3__endpoint" => {
                env_overrides.insert("s3.endpoint".to_string(), value);
            }
            "S3_ACCESS_KEY" | "s3_access_key" | "S3__ACCESS_KEY" | "s3__access_key" => {
                env_overrides.insert("s3.access_key".to_string(), value);
            }
            "S3_SECRET_KEY" | "s3_secret_key" | "S3__SECRET_KEY" | "s3__secret_key" => {
                env_overrides.insert("s3.secret_key".to_string(), value);
            }
            "S3_BUCKET" | "s3_bucket" | "S3__BUCKET" | "s3__bucket" => {
                env_overrides.insert("s3.bucket".to_string(), value);
            }
            "S3_REGION" | "s3_region" | "S3__REGION" | "s3__region" => {
                env_overrides.insert("s3.region".to_string(), value);
            }
            "S3_PUBLIC_URL" | "s3_public_url" | "S3__PUBLIC_URL" | "s3__public_url" => {
                env_overrides.insert("s3.public_url".to_string(), value);
            }
            "S3_PROVIDER" | "s3_provider" | "S3__PROVIDER" | "s3__provider" => {
                env_overrides.insert("s3.provider".to_string(), value);
            }
            _ => {}
        }
    }

    let mut builder = Config::builder()
        .add_source(File::with_name("config/default"))
        .add_source(File::with_name(&format!("config/{env}")).required(false));

    for (key, value) in env_overrides {
        builder = builder.set_override(key.as_str(), value)?;
    }

    let c = builder.build()?;

    let app_config: AppConfig = c.try_deserialize()?;
    Ok(app_config)
}
