"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import type { NotificationProps } from "@/types";
import { FaBell } from "react-icons/fa";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const client = useStreamVideoClient();

  // Handle incoming call notifications from Stream
  const handleCallEvent = useCallback((event: any) => {
    console.log("Call event received:", event);

    // This means someone is calling the current user
    if (event.call?.custom?.callType === "direct" && event.created_at) {
      // Add a temporary notification for the call
      const newNotification = {
        id: Date.now(), // Temporary ID
        title: `Incoming Call`,
        message: event.call.custom.description || "Someone is calling you",
        meetingId: event.call.id,
        isRead: false,
        type: "direct_call",
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
    }
  }, []);

  // Handle scheduled meeting notifications from Stream
  const handleMeetingEvent = useCallback((event: any) => {
    console.log("Meeting event received:", event);

    // Only handle scheduled meetings, not instant ones
    if (event.call?.custom?.scheduled === true && event.created_at) {
      // Add a temporary notification for the scheduled meeting
      const newNotification = {
        id: Date.now(), // Temporary ID
        title: "Meeting Scheduled",
        message:
          event.call.custom.description || "A new meeting has been scheduled",
        meetingId: event.call.id,
        scheduledFor: event.call.starts_at,
        isRead: false,
        type: "meeting",
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
    }
  }, []);

  useEffect(() => {
    if (user) {
      // fetchNotifications();
    }
  }, [user]);

  // Set up Stream event listeners
  useEffect(() => {
    if (!client || !user) return;

    // Register event handlers for call and meeting notifications
    const callCreatedUnsubscribe = client.on("call.created", handleCallEvent);
    const callUpdatedUnsubscribe = client.on(
      "call.updated",
      handleMeetingEvent,
    );
    const callRingUnsubscribe = client.on("call.ring", handleCallEvent);

    // Cleanup function to unregister event handlers
    return () => {
      callCreatedUnsubscribe();
      callUpdatedUnsubscribe();
      callRingUnsubscribe();
    };
  }, [client, user, handleCallEvent, handleMeetingEvent]);

  const markAsRead = async (id: number) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, isRead: true }),
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error}`);
    }
  };

  const handleNotificationClick = (notification: NotificationProps) => {
    markAsRead(notification.id);

    if (notification.meetingId) {
      router.push(`/meeting/${notification.meetingId}`);
      setOpen(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="relative rounded-full"
          size={"icon"}
          aria-label="Notifications"
        >
          <FaBell />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex items-center justify-center rounded-full p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs">
              Refresh
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-center py-4 text-sm text-muted-foreground">
            No notifications
          </p>
        ) : (
          <ScrollArea className="h-[300px] pr-3">
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg cursor-pointer ${
                    notification.isRead
                      ? "bg-background hover:bg-secondary/50"
                      : "bg-secondary/30 hover:bg-secondary/50"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <Badge variant="outline" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>

                  {notification.scheduledFor && (
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <span>
                        {format(
                          new Date(notification.scheduledFor),
                          "MMM d, yyyy h:mm a",
                        )}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
