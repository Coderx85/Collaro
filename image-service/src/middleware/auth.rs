use axum::body::Body;
use axum::http::{Request, StatusCode};
use axum::response::Response;
use futures::future::BoxFuture;
use std::task::{Context, Poll};
use tower::{Layer, Service};

use crate::config::AppConfig;

/// Middleware that validates an `X-API-Key` header against a shared secret.
///
/// Skipped when `api_key` is empty (dev mode).
#[derive(Clone)]
pub struct AuthMiddleware {
    api_key: String,
}

impl AuthMiddleware {
    pub fn new(config: &AppConfig) -> Self {
        AuthMiddleware { api_key: config.server.api_key.clone() }
    }
}

impl<S> Layer<S> for AuthMiddleware {
    type Service = AuthService<S>;

    fn layer(&self, inner: S) -> Self::Service {
        AuthService { inner, api_key: self.api_key.clone() }
    }
}

#[derive(Clone)]
pub struct AuthService<S> {
    inner: S,
    api_key: String,
}

impl<S> Service<Request<Body>> for AuthService<S>
where
    S: Service<Request<Body>, Response = Response> + Send + 'static,
    S::Future: Send + 'static,
{
    type Response = Response;
    type Error = S::Error;
    type Future = BoxFuture<'static, Result<Self::Response, Self::Error>>;

    fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.inner.poll_ready(cx)
    }

    fn call(&mut self, req: Request<Body>) -> Self::Future {
        // If no api_key is configured, allow all requests (dev mode)
        if self.api_key.is_empty() {
            return Box::pin(self.inner.call(req));
        }

        let path = req.uri().path().to_string();

        // Bypass auth for health and SSE endpoints (needed by k8s probes and EventSource)
        if path == "/health" || path == "/events" {
            return Box::pin(self.inner.call(req));
        }

        let valid = req
            .headers()
            .get("X-API-Key")
            .and_then(|v| v.to_str().ok())
            .is_some_and(|v| v == self.api_key);

        if valid {
            Box::pin(self.inner.call(req))
        } else {
            let resp = Response::builder()
                .status(StatusCode::UNAUTHORIZED)
                .header("content-type", "application/json")
                .body(Body::from(
                    serde_json::json!({ "error": "missing or invalid API key" }).to_string(),
                ))
                .expect("static response builder should not fail");
            Box::pin(async { Ok(resp) })
        }
    }
}
