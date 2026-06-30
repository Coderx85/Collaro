use axum::body::Body;
use axum::http::{HeaderValue, Request};
use axum::response::Response;
use futures::future::BoxFuture;
use std::sync::atomic::{AtomicU64, Ordering};
use std::task::{Context, Poll};
use tower::{Layer, Service};
use tracing::Span;

static COUNTER: AtomicU64 = AtomicU64::new(0);

/// Middleware that ensures every request has an `X-Request-ID`.
///
/// - If the proxying Next.js backend already set one, it is reused.
/// - Otherwise a unique ID (`r{seq}`) is generated.
/// - The ID is injected into the active tracing span and returned in the
///   response header.
#[derive(Clone, Default)]
pub struct RequestIdLayer;

impl<S> Layer<S> for RequestIdLayer {
    type Service = RequestIdService<S>;

    fn layer(&self, inner: S) -> Self::Service {
        RequestIdService { inner }
    }
}

#[derive(Clone)]
pub struct RequestIdService<S> {
    inner: S,
}

impl<S> Service<Request<Body>> for RequestIdService<S>
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

    fn call(&mut self, mut req: Request<Body>) -> Self::Future {
        let request_id = req
            .headers()
            .get("X-Request-ID")
            .and_then(|v| v.to_str().ok().map(String::from))
            .unwrap_or_else(|| {
                let seq = COUNTER.fetch_add(1, Ordering::Relaxed);
                format!("r{seq}")
            });

        // Inject into the tracing span for structured logging
        let span = Span::current();
        span.record("request_id", &request_id);

        // SAFETY: request_id is either a reused header value (validated by proxy) or
        // a generated `r{N}` string, both of which are valid ASCII header values.
        let header_value = HeaderValue::from_str(&request_id)
            .expect("request IDs are valid ASCII header values");
        req.headers_mut().insert("X-Request-ID", header_value.clone());

        let fut = self.inner.call(req);

        Box::pin(async move {
            let mut resp = fut.await?;
            resp.headers_mut()
                .insert("X-Request-ID", header_value);
            Ok(resp)
        })
    }
}
