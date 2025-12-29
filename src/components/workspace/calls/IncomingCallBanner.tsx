"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { RingingCall } from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";

type Props = {
  meeting: any | null;
  workspaceSlug: string;
};

export default function IncomingCallBanner({ meeting, workspaceSlug }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEnding, setIsEnding] = useState(false);

  if (!meeting) return null;

  const joinMeeting = () => {
    router.push(`/meeting/${meeting.meetingId}`);
  };

  const dismissMeeting = async () => {
    setIsEnding(true);
    try {
      const res = await fetch("/api/meeting/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId: meeting.meetingId }),
      });

      const data = await res.json();
      if (!data || !data.success) {
        toast({ title: "Failed to dismiss meeting" });
        setIsEnding(false);
        return;
      }

      toast({ title: "Meeting dismissed" });
      router.refresh();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to dismiss meeting" });
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <div className="fixed left-1/2 top-6 z-40 w-full max-w-4xl -translate-x-1/2 transform px-4">
      <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-900/90 p-3 text-white shadow-lg ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          {/* presentational ringing list if call context exists; safe to render even if it returns null */}
          <div>
            <RingingCall includeSelf={false} totalMembersToShow={3} />
          </div>
          <div>
            <p className="text-sm text-sky-2">Incoming Meeting</p>
            <p className="text-base font-semibold">
              {meeting.description || "Instant Meeting"}
            </p>
            <p className="text-xs text-slate-400">
              Hosted by {meeting.hostedBy}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={joinMeeting}
            className="rounded bg-emerald-500 px-3 py-2 text-sm font-medium hover:bg-emerald-600"
          >
            Join
          </Button>
          <Button
            onClick={dismissMeeting}
            disabled={isEnding}
            className="rounded bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            {isEnding ? "Dismissing…" : "Dismiss"}
          </Button>
        </div>
      </div>
    </div>
  );
}
