"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import type {
  INotification,
  NotificationProps,
  WorkspaceNotificationProps,
} from "@/types";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/action/notifications.actions";
import { FaBell } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { getUserNotificationsAction } from "@/action/notification/general-notification.actions";

type CombinedNotification = NotificationProps | WorkspaceNotificationProps;

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const params = useParams();
  const workspaceSlug = params?.slug as string;
  const client = useStreamVideoClient();
  const { toast } = useToast();
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch workspace notifications
  const fetchWorkspaceNotifications = useCallback(async () => {
    if (!user || !workspaceSlug) return;

    try {
      setIsLoading(true);
      // Note: This is a simplified fetch; in real implementation,
      // we'd need to get the workspace ID first
      const response = await getUserNotificationsAction(user.id);

      if (!response.success) {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch notifications",
          variant: "destructive",
        });
        return;
      }

      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, workspaceSlug]);

  // Handle scheduled meeting notifications from Stream
  // const handleMeetingEvent = useCallback((event: any) => {
  //   console.log("Meeting event received:", event);

  //   // Only handle scheduled meetings, not instant ones
  //   if (event.call?.custom?.scheduled === true && event.created_at) {
  //     // Add a temporary notification for the scheduled meeting
  //     const newNotification: NotificationProps = {
  //       id: Date.now(),
  //       title: "Meeting Scheduled",
  //       message:
  //         event.call.custom.description || "A new meeting has been scheduled",
  //       meetingId: event.call.id,
  //       scheduledFor: event.call.starts_at,
  //       isRead: false,
  //       type: "meeting",
  //       createdAt: new Date().toISOString(),
  //     };

  //     setNotifications((prev) => [newNotification, ...prev]);
  //   }
  // }, []);

  // Fetch notifications and subscribe to SSE on component mount and when user changes
  // useEffect(() => {
  //   if (user && open) {
  //     fetchWorkspaceNotifications();
  //     const unsubscribe = subscribeToRealTimeNotifications();
  //     return () => {
  //       if (unsubscribe) unsubscribe();
  //     };
  //   }
  // }, [
  //   user,
  //   open,
  //   fetchWorkspaceNotifications,
  //   subscribeToRealTimeNotifications,
  // ]);

  // Set up Stream event listeners
  // useEffect(() => {
  //   if (!client || !user) return;

  //   // Register event handlers for call and meeting notifications
  //   const callCreatedUnsubscribe = client.on("call.created", handleCallEvent);
  //   const callUpdatedUnsubscribe = client.on(
  //     "call.updated",
  //     handleMeetingEvent,
  //   );
  //   const callRingUnsubscribe = client.on("call.ring", handleCallEvent);

  //   // Cleanup function to unregister event handlers
  //   return () => {
  //     callCreatedUnsubscribe();
  //     callUpdatedUnsubscribe();
  //     callRingUnsubscribe();
  //   };
  // }, [client, user, handleCallEvent, handleMeetingEvent]);

  // Cleanup SSE connection on unmount
  // useEffect(() => {
  //   return () => {
  //     if (eventSourceRef.current) {
  //       eventSourceRef.current.close();
  //       eventSourceRef.current = null;
  //     }
  //   };
  // }, []);

  const handleMarkAsRead = async (notification: INotification) => {
    try {
      await markNotificationAsRead(notification.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = async (notification: INotification) => {
    await handleMarkAsRead(notification);

    // Handle navigation based on notification type
    if ("meetingId" in notification && notification.meetingId) {
      // Meeting notification
      router.push(`/meeting/${notification.meetingId}`);
      setOpen(false);
    } else if ("actionUrl" in notification && notification.actionUrl) {
      // Workspace notification with action URL
      // router.push(notification.);
      setOpen(false);
    }
  };;

  const unreadCount = notifications.filter((n) => !n.read).length;

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
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={fetchWorkspaceNotifications}
              disabled={isLoading}
            >
              {isLoading ? "Refreshing..." : "Refresh"}
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
              {notifications.map((notification: INotification) => {
                const isRead =
                  "isRead" in notification
                    ? notification.isRead
                    : notification.read === true;

                return (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isRead
                        ? "bg-background hover:bg-secondary/50"
                        : "bg-secondary/30 hover:bg-secondary/50"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">
                        {notification.message}
                      </h4>
                      {!isRead && (
                        <Badge variant="outline" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>

                    {
                      notification.type === "meeting_invite"
                      // && notification.scheduledFor && (
                      //   <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      //     <span>
                      //       {format(
                      //         new Date(notification.scheduledFor),
                      //         "MMM d, yyyy h:mm a",
                      //       )}
                      //     </span>
                      //   </div>
                      // )
                    }

                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
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
};;;;;;;;;;;

export default NotificationBell;
