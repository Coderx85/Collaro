use config::{Config, Environment, File};
use config::ConfigError;

use super::AppConfig;

pub fn load() -> Result<AppConfig, ConfigError> {
    let env = std::env::var("RUST_ENV").unwrap_or_else(|_| "dev".into());

    let c = Config::builder()
        .add_source(File::with_name("config/default"))
        .add_source(File::with_name(&format!("config/{env}")).required(false))
        .add_source(
            Environment::with_prefix("s3")
                .prefix_separator("_")
                .keep_prefix(true),
        )
        .build()?;

    c.try_deserialize()
}
