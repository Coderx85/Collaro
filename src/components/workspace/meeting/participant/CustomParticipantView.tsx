"use client";

import { useState } from "react";
import {
  type StreamVideoParticipant,
  ParticipantView as DefaultParticipantView,
} from "@stream-io/video-react-sdk";
import { useParticipantRole } from "@/hooks/useParticipantRole";
import ParticipantBadge from "./ParticipantBadge";
import AudioLevelIndicator from "./AudioLevelIndicator";
import ParticipantAvatar from "./ParticipantAvatar";
import ParticipantStats from "./ParticipantStats";
import { cn } from "@/lib/utils";
import { IconPin, IconPinnedOff, IconVideoOff } from "@tabler/icons-react";

interface CustomParticipantViewProps {
  participant: StreamVideoParticipant;
  workspaceSlug: string;
  className?: string;
}

const CustomParticipantView = ({
  participant,
  workspaceSlug,
  className,
}: CustomParticipantViewProps) => {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { role, name, isLoading } = useParticipantRole(
    participant,
    workspaceSlug
  );

  // Get participant states from Stream SDK
  const isSpeaking = participant.isSpeaking || false;
  const isAudioMuted = !participant.publishedTracks.includes("audio" as any);
  const isVideoMuted = !participant.publishedTracks.includes("video" as any);
  const audioLevel = participant.audioLevel || 0;

  // Mock connection stats (in production, get from Stream SDK)
  const connectionStats = {
    quality: "good" as const,
    bitrate: 1200000,
    latency: 45,
    packetLoss: 0.5,
  };

  const handlePinToggle = () => {
    setIsPinned(!isPinned);
    // Add your pin logic here (e.g., move to top of grid, enlarge, etc.)
  };

  return (
    <ParticipantStats
      connectionQuality={connectionStats.quality}
      // bitrate={connectionStats.bitrate}
      // latency={connectionStats.latency}
      // packetLoss={connectionStats.packetLoss}
    >
      <div
        className={cn(
          "group relative rounded-xl overflow-hidden bg-linear-to-br from-slate-900 to-slate-800 border transition-all duration-300 ease-out",
          "hover:shadow-2xl hover:shadow-slate-900/50",
          isSpeaking
            ? "border-2 border-emerald-500 shadow-lg shadow-emerald-500/30 scale-[1.02]"
            : "border-slate-700 hover:border-slate-600",
          isPinned &&
            "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 shadow-xl shadow-blue-500/20",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Video Content */}
        <div className="relative aspect-video w-full">
          {isVideoMuted ? (
            // Show custom avatar when camera is off
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-slate-800 via-slate-900 to-slate-800">
              <ParticipantAvatar name={name} size="md" />
            </div>
          ) : (
            // Show actual video using Stream's default rendering
            <div className="absolute inset-0">
              <DefaultParticipantView
                participant={participant}
                ParticipantViewUI={null}
                VideoPlaceholder={() => (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    <ParticipantAvatar name={name} size="md" />
                  </div>
                )}
              />
            </div>
          )}

          {/* Speaking animation overlay */}
          {isSpeaking && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
              <div className="absolute inset-0 border-2 border-emerald-500/50 rounded-xl animate-pulse" />
            </div>
          )}

          {/* Hover overlay for controls */}
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300",
              isHovered && "opacity-100"
            )}
          />

          {/* Camera Off Indicator */}
          {isVideoMuted && (
            <div className="absolute top-3 right-3 p-1.5 rounded-full bg-red-500/20 border border-red-500/50 backdrop-blur-sm transition-all duration-200 hover:bg-red-500/30 hover:scale-110">
              <IconVideoOff className="w-4 h-4 text-red-400" />
            </div>
          )}
        </div>

        {/* Bottom Overlay - Name Badge & Controls */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t transition-all duration-300",
            isHovered
              ? "from-black/90 via-black/70 to-transparent"
              : "from-black/80 via-black/60 to-transparent"
          )}
        >
          <div className="flex items-end justify-between gap-2">
            {/* Left: Name Badge & Audio Indicator */}
            <div className="flex items-center gap-2">
              <ParticipantBadge role={role} name={name} />
              <AudioLevelIndicator
                audioLevel={audioLevel}
                isMuted={isAudioMuted}
                isSpeaking={isSpeaking}
              />
            </div>

            {/* Right: Pin Button - Show on hover or when pinned */}
            <div
              className={cn(
                "transition-all duration-200",
                isHovered || isPinned
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              )}
            >
              <button
                type="button"
                onClick={handlePinToggle}
                className={cn(
                  "p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 transform hover:scale-110 active:scale-95",
                  isPinned
                    ? "bg-blue-500/30 border border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/20"
                    : "bg-slate-800/40 border border-slate-600/50 text-slate-400 hover:bg-slate-700/60 hover:text-slate-200 hover:border-slate-500"
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

        {/* Muted Indicator (Large Overlay) - Only show when not hovered */}
        {isAudioMuted && !isHovered && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300">
            <div className="p-3 rounded-full bg-red-500/20 border-2 border-red-500/50 backdrop-blur-sm">
              <div className="w-12 h-12 flex items-center justify-center text-red-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                >
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="absolute top-2 left-2 transition-opacity duration-200">
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/50 backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs text-blue-400">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </ParticipantStats>
  );
};

export default CustomParticipantView;
