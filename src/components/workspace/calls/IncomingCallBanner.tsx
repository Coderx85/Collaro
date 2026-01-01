"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { RingingCall } from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";
import MeetingModal from "@/components/workspace/meeting/MeetingModal";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  meeting: any | null;
  workspaceSlug: string;
};

export default function IncomingCallBanner({ meeting, workspaceSlug }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEnding, setIsEnding] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  if (!meeting) return null;

  const joinMeeting = () => {
    router.push(`/meeting/${meeting.meetingId}`);
  };

  const dismissMeeting = async () => {
    setIsEnding(true);
    try {
      // Call the server endpoint that updates the participant response for the current user
      const res = await fetch(
        `/api/meeting/${meeting.meetingId}/participants/respond`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "declined",
            reason: "Dismissed by invitee",
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({ title: err?.error || "Failed to dismiss meeting" });
        setIsEnding(false);
        return;
      }

      const data = await res.json();
      if (!data || !data.success) {
        toast({ title: data?.error || "Failed to dismiss meeting" });
        setIsEnding(false);
        return;
      }

      toast({ title: "You declined the invite" });
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
            onClick={() => setShowConfirm(true)}
            disabled={isEnding}
            className="rounded bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            {isEnding ? "Dismissing…" : "Dismiss"}
          </Button>
        </div>
      </div>

      <MeetingModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Decline Meeting?"
        buttonText={isEnding ? "Declining…" : "Confirm Decline"}
        handleClick={async () => {
          setIsEnding(true);
          try {
            const res = await fetch(
              `/api/meeting/${meeting.meetingId}/participants/respond`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  status: "declined",
                  reason: declineReason || "Dismissed by invitee",
                }),
              }
            );

            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              toast({ title: err?.error || "Failed to decline meeting" });
              setIsEnding(false);
              return;
            }

            const data = await res.json();
            if (!data || !data.success) {
              toast({ title: data?.error || "Failed to decline meeting" });
              setIsEnding(false);
              return;
            }

            toast({ title: "You declined the invite" });
            setShowConfirm(false);
            router.refresh();
          } catch (err) {
            console.error(err);
            toast({ title: "Failed to decline meeting" });
          } finally {
            setIsEnding(false);
          }
        }}
      >
        <p className="text-sm text-sky-2">
          Are you sure you want to decline this meeting?
        </p>
        <div className="mt-3">
          <Textarea
            placeholder="Optional reason (e.g. can't attend)"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            className="text-black/75 dark:text-white rounded-lg p-2"
          />
          <div className="flex justify-end mt-3">
            <Button
              variant="ghost"
              onClick={() => setShowConfirm(false)}
              className="mr-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      </MeetingModal>
    </div>
  );
}
