"use client";

import { useState } from "react";
import {
  Avatar,
  useParticipantViewContext,
  type VideoPlaceholderProps,
} from "@stream-io/video-react-sdk";
import { useParticipantRole } from "@/hooks/useParticipantRole";
import ParticipantBadge from "./ParticipantBadge";
import ParticipantAvatar from "./ParticipantAvatar";
import { cn } from "@/lib/utils";
import {
  IconPin,
  IconPinnedOff,
  IconMicrophoneOff,
  IconVideoOff,
} from "@tabler/icons-react";
import { useWorkspaceStore } from "@/store/workspace";
import { useSession } from "@/lib/auth-client";

/**
 * Custom VideoPlaceholder - shown when participant's video is off
 * Follows Stream SDK pattern with style prop for absolute positioning
 */
export const CustomVideoPlaceholder = ({ style }: VideoPlaceholderProps) => {
  const { participant } = useParticipantViewContext();
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div
      className="flex items-center justify-center w-full h-full bg-linear-to-br from-slate-800 via-slate-900 to-slate-800"
      style={style}
    >
      <ParticipantAvatar
        name={session.user.name}
        imageUrl={session.user.image || session.user.name}
        size="lg"
      />
      {/* <Avatar name={name} imageSrc={`https://multiavatar.com/${name}`} /> */}
    </div>
  );
};

/**
 * Custom ParticipantViewUI - overlay shown on top of video
 * Uses useParticipantViewContext to access participant data
 * Works with PaginatedGridLayout's ParticipantViewUI prop
 */
export const CustomParticipantViewUI = () => {
  const { participant } = useParticipantViewContext();
  const { workspaceSlug } = useWorkspaceStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const { role, name, isLoading } = useParticipantRole(
    participant,
    workspaceSlug || ""
  );

  const handlePinToggle = () => {
    setIsPinned((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col justify-between pointer-events-none transition-all duration-300",
        // isSpeaking && "ring-2 ring-emerald-500 ring-inset",
        isPinned && "ring-2 ring-blue-500 ring-inset"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top bar - indicators */}
      <div className="flex items-start justify-between p-2 pointer-events-auto">
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/50 backdrop-blur-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs text-blue-400">Loading...</span>
          </div>
        )}
      </div>

      {/* Bottom bar - name, role, controls */}
      <div
        className={cn(
          "p-2 bg-linear-to-t from-black/80 via-black/50 to-transparent transition-all duration-300 pointer-events-auto"
          // isHovered && "from-black/90 via-black/60"
        )}
      >
        <div className="flex items-end justify-between gap-2">
          {/* Left: Name Badge & Audio Indicator */}
          <div className="flex items-center gap-2">
            <ParticipantBadge role={role} name={name} />
          </div>

          {/* Right: Pin Button */}
          <div
            className={cn(
              "transition-all duration-200",
              isHovered || isPinned
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            )}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePinToggle();
              }}
              className={cn(
                "p-1.5 rounded-full backdrop-blur-sm transition-all duration-200",
                isPinned
                  ? "bg-primary/75 border-primary/50 text-white"
                  : "bg-accent border border-accent/50 text-white hover:bg-accent/75 hover:text-white"
              )}
              title={isPinned ? "Unpin" : "Pin participant"}
            >
              {isPinned ? (
                <IconPinnedOff className="w-4 h-4" />
              ) : (
                <IconPin className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Speaker Layout UI Components
 * SpeakerLayout has separate props for spotlight and bar views
 */

// For the main spotlight participant
export const CustomParticipantViewUISpotlight = () => {
  return <CustomParticipantViewUI />;
};

// For participants in the sidebar bar
export const CustomParticipantViewUIBar = () => {
  const { participant } = useParticipantViewContext();
  const { workspaceSlug } = useWorkspaceStore();

  const { role, name } = useParticipantRole(participant, workspaceSlug || "");

  const isSpeaking = participant.isSpeaking || false;
  const hasAudio = participant.publishedTracks.includes("audio" as any);

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col justify-end pointer-events-none transition-all duration-300",
        isSpeaking && "ring-2 ring-emerald-500 ring-inset"
      )}
    >
      {/* Muted indicator for bar */}
      {!hasAudio && (
        <div className="absolute top-2 right-2 p-1 rounded-full bg-red-500/20 border border-red-500/50 backdrop-blur-sm">
          <IconMicrophoneOff className="w-3 h-3 text-red-400" />
        </div>
      )}

      {/* Bottom bar - compact name badge */}
      <div className="p-1.5 bg-linear-to-t from-black/80 to-transparent">
        <ParticipantBadge role={role} name={name} />
      </div>
    </div>
  );
};

// Default export for backward compatibility
export default CustomParticipantViewUI;
