"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useRouter, useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  markNotificationAsReadAction,
} from "@/action/notification";
import { FaBell } from "react-icons/fa";
import { CheckCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { INotificationDTO } from "@/modules/notification";
import { notificationService } from "@/lib/notification-service";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<INotificationDTO[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [markingNotificationId, setMarkingNotificationId] = useState<string | null>(null);
  const notificationStreamRef = useRef<EventSource | null>(null);
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id;
  const router = useRouter();
  const params = useParams();
  const workspaceSlug = params?.slug as string;

  const closeNotificationStream = useCallback(() => {
    notificationStreamRef.current?.close();
    notificationStreamRef.current = null;
  }, []);

  const fetchWorkspaceNotifications = useCallback(async () => {
    if (!userId || !workspaceSlug) return;

    try {
      setIsLoading(true);
      const notifications = await notificationService.listNotifications();

      setNotifications(notifications);
      closeNotificationStream();
      notificationStreamRef.current = notificationService.connectStream({
        onSnapshot: setNotifications,
        onError: (error) => {
          console.error("Notification stream error:", error);
        },
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to fetch notifications.");
    } finally {
      setIsLoading(false);
    }
  }, [closeNotificationStream, userId, workspaceSlug]);

  useEffect(() => {
    void fetchWorkspaceNotifications();

    return () => {
      closeNotificationStream();
    };
  }, [closeNotificationStream, fetchWorkspaceNotifications]);

  const handleMarkAsRead = async (notification: INotificationDTO) => {
    try {
      setMarkingNotificationId(String(notification.id));
      await markNotificationAsReadAction(notification.id);
      setNotifications((currentNotifications) =>
        currentNotifications.map((currentNotification) =>
          currentNotification.id === notification.id
            ? { ...currentNotification, read: true }
            : currentNotification,
        ),
      );
    } catch (error) {
      toast.error("Failed to mark notification as read");
    } finally {
      setMarkingNotificationId(null);
    }
  };

  const handleMarkAsReadClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
    notification: INotificationDTO,
  ) => {
    event.stopPropagation();

    if (notification.read) {
      return;
    }

    await handleMarkAsRead(notification);
  };

  const handleNotificationClick = async (notification: INotificationDTO) => {
    await handleMarkAsRead(notification);

    // Handle navigation based on notification type
    if ("meetingId" in notification && notification.meetingId) {
      // Meeting notification
      router.push(`/meeting/${notification.meetingId}`);
      setOpen(false);
    } else if ("actionUrl" in notification && notification.actionUrl) {
      setOpen(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadCountLabel = unreadCount > 10 ? "10+" : String(unreadCount);

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="relative rounded-full active:scale-95 transition-transform"
          size={"icon"}
          aria-label="Notifications"
        >
          <FaBell />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold leading-none shadow-sm"
            >
              {unreadCountLabel}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 overflow-hidden p-0" align="end" sideOffset={12}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h3 className="font-medium">Notifications</h3>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                : "Everything is caught up"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={fetchWorkspaceNotifications}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {notifications.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No notifications
          </p>
        ) : (
          <ScrollArea className="h-[320px]">
            <div className="space-y-2 p-3">
              {notifications.map((notification: INotificationDTO) => {
                const isRead = notification.read === true;

                return (
                  <div
                    key={String(notification.id)}
                    className={`group rounded-xl border p-3 transition-all ${
                      isRead
                        ? "bg-background hover:border-border hover:bg-secondary/40"
                        : "border-primary/15 bg-primary/5 hover:border-primary/30 hover:bg-primary/10"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium">
                          {notification.message}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {isRead ? "Read" : "Unread"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isRead && (
                          <Badge variant="outline" className="text-xs">
                            New
                          </Badge>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="shrink-0 rounded-full opacity-70 transition-transform hover:opacity-100 active:scale-95"
                          aria-label={`Mark notification as read: ${notification.message}`}
                          onClick={(event) => handleMarkAsReadClick(event, notification)}
                          disabled={isRead || markingNotificationId === String(notification.id)}
                        >
                          {markingNotificationId === String(notification.id) ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <CheckCheck className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5">
                        {notification.type.replaceAll("_", " ")}
                      </span>
                      <span>
                        {format(notification.createdAt, "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
