"use client";

import type { INotificationDTO } from "@/modules/notification";
import {
  normalizeNotifications,
  type NotificationSnapshotPayload,
  type NotificationTransportDTO,
} from "@/lib/notification-utils";

type NotificationFetchResponse = {
  success?: boolean;
  data?: NotificationTransportDTO[];
  error?: string;
};

class NotificationService {
  async listNotifications(): Promise<INotificationDTO[]> {
    const response = await fetch("/api/notification", {
      cache: "no-store",
    });

    const payload = (await response.json()) as NotificationFetchResponse;

    if (!response.ok || !payload.success) {
      throw new Error(payload.error || "Failed to fetch notifications.");
    }

    return normalizeNotifications(payload.data ?? []);
  }

  connectStream({
    onSnapshot,
    onError,
  }: {
    onSnapshot: (notifications: INotificationDTO[]) => void;
    onError?: (error: unknown) => void;
  }): EventSource {
    const eventSource = new EventSource("/api/notification/stream");

    eventSource.addEventListener("snapshot", (event) => {
      try {
        const messageEvent = event as MessageEvent<string>;
        const payload = JSON.parse(messageEvent.data) as NotificationSnapshotPayload;

        onSnapshot(normalizeNotifications(payload.notifications ?? []));
      } catch (error) {
        console.error("Failed to parse notification snapshot:", error);
        onError?.(error);
      }
    });

    eventSource.onerror = (event) => {
      onError?.(event);
    };

    return eventSource;
  }
}

export const notificationService = new NotificationService();