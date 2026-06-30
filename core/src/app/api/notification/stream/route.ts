import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth-server";
import {
  serializeNotification,
  sortNotificationsByCreatedAt,
  type NotificationSnapshotPayload,
} from "@/lib/notification-utils";
import { UserStore } from "@/modules/user/user-store";
import type { TUserId } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();
const pollingIntervalMs = 5000;
const keepAliveIntervalMs = 15000;

const encodeEvent = (event: string, data: unknown): Uint8Array => {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
};

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      const emptyStream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encodeEvent("snapshot", { notifications: [] }));
          controller.close();
        },
      });

      return new Response(emptyStream, {
        headers: {
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "Content-Type": "text/event-stream; charset=utf-8",
        },
      });
    }

    const userStore = UserStore.getInstance();
    const userId = session.user.id as unknown as TUserId;
    const initialNotifications = await userStore.listNotifications(userId);

    let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null;
    let pollTimer: ReturnType<typeof setInterval> | undefined;
    let keepAliveTimer: ReturnType<typeof setInterval> | undefined;
    let closed = false;
    const initialPayload: NotificationSnapshotPayload = {
      notifications: sortNotificationsByCreatedAt(
        initialNotifications.map(serializeNotification),
      ),
    };
    let lastPayload = JSON.stringify(initialPayload);

    const closeStream = () => {
      if (closed) {
        return;
      }

      closed = true;

      if (pollTimer) {
        clearInterval(pollTimer);
      }

      if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
      }

      if (controllerRef) {
        controllerRef.close();
      }
    };

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controllerRef = controller;
        controller.enqueue(encodeEvent("snapshot", initialPayload));

        const pollNotifications = async () => {
          try {
            if (closed) {
              return;
            }

            const notifications = await userStore.listNotifications(userId);

            if (closed) {
              return;
            }

            const payload: NotificationSnapshotPayload = {
              notifications: sortNotificationsByCreatedAt(
                notifications.map(serializeNotification),
              ),
            };
            const payloadString = JSON.stringify(payload);

            if (payloadString !== lastPayload) {
              lastPayload = payloadString;
              controller.enqueue(encodeEvent("snapshot", payload));
            }
          } catch (error) {
            console.error("Failed to refresh notifications stream:", error);
          }
        };

        pollTimer = setInterval(() => {
          void pollNotifications();
        }, pollingIntervalMs);

        keepAliveTimer = setInterval(() => {
          if (closed) {
            return;
          }

          controller.enqueue(encoder.encode(": keep-alive\n\n"));
        }, keepAliveIntervalMs);

        request.signal.addEventListener("abort", closeStream, { once: true });
      },
      cancel() {
        closeStream();
      },
    });

    return new Response(stream, {
      headers: {
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Failed to open notification stream:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to open notification stream",
      },
      { status: 500 },
    );
  }
}