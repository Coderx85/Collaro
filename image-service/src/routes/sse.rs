use axum::extract::State;
use axum::response::sse::{Event, KeepAlive, Sse};
use futures::stream::Stream;
use tokio_stream::wrappers::BroadcastStream;
use tokio_stream::wrappers::errors::BroadcastStreamRecvError;
use tokio_stream::StreamExt;

use crate::state::AppState;

pub async fn handler(
    State(state): State<AppState>,
) -> Sse<impl Stream<Item = Result<Event, anyhow::Error>>> {
    let rx = state.sse_tx.subscribe();
    let stream = BroadcastStream::new(rx).map(|result| match result {
        Ok(evt) => Ok(Event::default()
            .event(evt.event_type)
            .json_data(evt.payload)?),
        Err(BroadcastStreamRecvError::Lagged(n)) => {
            tracing::warn!("SSE client lagged by {n} events");
            Err(anyhow::anyhow!("lagged"))
        }
    });
    Sse::new(stream).keep_alive(KeepAlive::default())
}
