"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import {
  IconCalendar,
  IconClock,
  IconCopy,
  IconHourglass,
  IconInfoCircle,
  IconUser,
  IconUsers,
  IconVideo,
  IconX,
  IconCheck,
  IconCrown,
  IconPlayerPlay,
  IconShield,
  IconVideoOff,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IParticipantDTO, TeamMeetingDTO, TParticipantStatus, meetingStatus } from "@/modules/meeting";

interface MeetingDetailsProps {
  meeting: TeamMeetingDTO;
  participants: IParticipantDTO[];
  workspaceSlug: string;
  displayFont: string;
}

const statusConfig: Record<meetingStatus, { label: string; dot: string; badge: string; icon: React.ReactNode }> = {
  scheduled: {
    label: "Scheduled",
    dot: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: <IconHourglass className="size-3.5" />,
  },
  active: {
    label: "In Progress",
    dot: "bg-emerald-500 animate-pulse",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: <IconCheck className="size-3.5" />,
  },
  completed: {
    label: "Completed",
    dot: "bg-slate-500",
    badge: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    icon: <IconVideoOff className="size-3.5" />,
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-500",
    badge: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: <IconX className="size-3.5" />,
  },
};

const participantStatusConfig: Record<TParticipantStatus, { label: string; dot: string }> = {
  joined: { label: "Joined", dot: "bg-emerald-500" },
  invited: { label: "Invited", dot: "bg-amber-500" },
  left: { label: "Left", dot: "bg-slate-500" },
  declined: { label: "Declined", dot: "bg-red-500" },
};

const roleIcons: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  owner: {
    icon: <IconCrown className="size-3.5" />,
    label: "Owner",
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  admin: {
    icon: <IconShield className="size-3.5" />,
    label: "Admin",
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  member: {
    icon: <IconUser className="size-3.5" />,
    label: "Member",
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/20",
  },
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const formatDateTime = (date: Date): { date: string; time: string } => {
  const d = new Date(date);
  return {
    date: d.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };
};

export function MeetingDetails({ meeting, participants, workspaceSlug, displayFont }: MeetingDetailsProps) {
  const router = useRouter();
  const client = useStreamVideoClient();
  const [copied, setCopied] = useState(false);

  const status = statusConfig[meeting.status];
  const meetingDate = formatDateTime(meeting.startTime);
  const endDate = meeting.endTime ? formatDateTime(meeting.endTime) : null;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${String(meeting.id)}`;

  const handleJoinMeeting = async () => {
    if (!client) {
      toast.error("Video service not available");
      return;
    }

    try {
      const call = client.call("default", String(meeting.id));
      await call.join({ create: true });
      router.push(`/meeting/${meeting.id}`);
    } catch {
      toast.error("Failed to join meeting");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    toast.success("Meeting link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const canJoin = meeting.status === "active" || meeting.status === "scheduled";

  return (
    <div className="relative min-h-dvh overflow-hidden px-6 py-8 md:px-10 md:pt-10">
      {/* Atmospheric Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-primary/6 blur-[180px]" />
        <div className="absolute bottom-[-8rem] left-0 h-96 w-96 rounded-full bg-secondary/6 blur-[160px]" />
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-accent/4 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/30 p-6 backdrop-blur-sm md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3" />

          <div className="relative space-y-5">
            {/* Top Row: Status + Actions */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${status.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                  <span className="rounded-full bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {String(meeting.workspaceId)}
                  </span>
                </div>

                <h1 className={`${displayFont} text-2xl font-bold tracking-tight text-foreground md:text-4xl`}>
                  {meeting.title}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {canJoin && (
                  <Button
                    onClick={handleJoinMeeting}
                    className="group rounded-full px-5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                  >
                    <IconPlayerPlay className="mr-1.5 size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110" />
                    {meeting.status === "scheduled" ? "Start" : "Join"}
                  </Button>
                )}
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="icon"
                  className="rounded-full transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                >
                  {copied ? <IconCheck className="size-4 text-emerald-500" /> : <IconCopy className="size-4" />}
                </Button>
              </div>
            </div>

            {/* Description */}
            {meeting.description && (
              <div className="rounded-xl border border-border/30 bg-background/40 p-4">
                <div className="flex items-start gap-3">
                  <IconInfoCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{meeting.description}</p>
                </div>
              </div>
            )}

            {/* Time Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconCalendar className="size-4 text-primary" />
                <span className="font-medium text-foreground">{meetingDate.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconClock className="size-4 text-primary" />
                <span className="font-medium text-foreground">{meetingDate.time}</span>
                {endDate && (
                  <>
                    <span className="text-muted-foreground/50">—</span>
                    <span className="font-medium text-foreground">{endDate.time}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-[1fr_20rem]">
          {/* Participants Panel */}
          <section className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border/30 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconUsers className="size-4" />
                </div>
                <div>
                  <h2 className={`${displayFont} text-sm font-semibold text-foreground`}>Participants</h2>
                  <p className="text-[11px] text-muted-foreground">
                    {participants.length} {participants.length === 1 ? "member" : "members"}
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-border/20">
              {participants.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground">
                    <IconUsers className="size-5" />
                  </div>
                  <p className={`${displayFont} mt-3 text-sm font-medium text-foreground`}>No participants yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Invite team members to join this meeting</p>
                </div>
              ) : (
                participants.map((participant, index) => {
                  const role = roleIcons[participant.role] || roleIcons.member;
                  const pStatus = participantStatusConfig[participant.status];
                  const initials = getInitials(participant.name);

                  return (
                    <div
                      key={`${participant.memberId}-${index}`}
                      className="group flex items-center gap-3 px-6 py-3.5 transition-colors duration-150 hover:bg-muted/20"
                    >
                      {/* Avatar */}
                      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-semibold text-foreground ring-1 ring-border/30">
                        {initials}
                        <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${pStatus.dot}`} />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-foreground">{participant.name}</p>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${role.bg} ${role.color}`}>
                            {role.icon}
                            {role.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground/70">{pStatus.label}</p>
                      </div>

                      {/* Host indicator */}
                      {String(participant.memberId) === String(meeting.createdBy) && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          Host
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Side Panel: Meeting Info */}
          <aside className="space-y-4">
            {/* Meeting ID Card */}
            <div className="rounded-2xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Meeting ID</p>
              <p className={`${displayFont} mt-1.5 truncate text-sm font-mono font-semibold text-foreground`}>
                {String(meeting.id)}
              </p>
            </div>

            {/* Created At */}
            <div className="rounded-2xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Created</p>
              <p className="mt-1.5 text-sm font-medium text-foreground">
                {formatDateTime(meeting.createdAt).date}
              </p>
              <p className="text-xs text-muted-foreground">{formatDateTime(meeting.createdAt).time}</p>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Actions</p>
              <div className="mt-3 space-y-2">
                <Button
                  onClick={() => router.push(`/workspace/${workspaceSlug}`)}
                  variant="outline"
                  className="w-full justify-start rounded-lg text-sm"
                >
                  <IconVideo className="mr-2 size-4" />
                  Back to workspace
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
