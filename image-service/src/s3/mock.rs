use std::collections::HashMap;
use std::sync::Mutex;

use async_trait::async_trait;
use bytes::Bytes;

use super::client::S3Client;

pub struct MockS3Client {
    store: Mutex<HashMap<String, (Bytes, String)>>,
}

impl MockS3Client {
    pub fn new() -> Self {
        MockS3Client { store: Mutex::new(HashMap::new()) }
    }
}

#[async_trait]
impl S3Client for MockS3Client {
    async fn put_object(
        &self,
        key: &str,
        body: Bytes,
        content_type: &str,
    ) -> Result<String, anyhow::Error> {
        let url = format!("http://mock/{key}");
        self.store
            .lock()
            .unwrap()
            .insert(key.to_string(), (body, content_type.to_string()));
        Ok(url)
    }

    async fn get_object(&self, key: &str) -> Result<(Bytes, String), anyhow::Error> {
        self.store
            .lock()
            .unwrap()
            .get(key)
            .cloned()
            .ok_or_else(|| anyhow::anyhow!("key not found: {key}"))
    }

    async fn health_check(&self) -> Result<(), anyhow::Error> {
        Ok(())
    }
}
