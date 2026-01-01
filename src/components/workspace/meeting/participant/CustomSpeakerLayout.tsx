"use client";

import { useCallStateHooks, ParticipantView } from "@stream-io/video-react-sdk";
import {
  CustomParticipantViewUISpotlight,
  CustomParticipantViewUIBar,
  CustomVideoPlaceholder,
} from "./CustomParticipantView";
import { useState, useEffect } from "react";
import { useWorkspaceStore } from "@/store/workspace";

interface CustomSpeakerLayoutProps {
  participantsBarPosition?: "left" | "right";
}

const CustomSpeakerLayout = ({
  participantsBarPosition = "right",
}: CustomSpeakerLayoutProps) => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const [dominantSpeaker, setDominantSpeaker] = useState(participants[0]);

  // Get workspace slug from store
  const { workspaceSlug } = useWorkspaceStore();

  // Update dominant speaker based on who's speaking
  useEffect(() => {
    const speaker = participants.find((p) => p.isSpeaking);
    if (speaker) {
      setDominantSpeaker(speaker);
    }
  }, [participants]);

  // If no dominant speaker yet, use first participant
  const mainParticipant = dominantSpeaker || participants[0];
  const otherParticipants = participants.filter(
    (p) => p.sessionId !== mainParticipant?.sessionId
  );

  if (!mainParticipant) {
    return (
      <div className="flex items-center justify-center w-full h-full text-white">
        <p>No participants in the call</p>
      </div>
    );
  }

  // Only render if we have workspace slug
  if (!workspaceSlug) {
    return (
      <div className="flex items-center justify-center w-full h-full text-white">
        <p>Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full gap-4 p-4">
      {/* Participants sidebar (left) */}
      {participantsBarPosition === "left" && otherParticipants.length > 0 && (
        <div className="flex flex-col gap-3 overflow-y-auto w-[280px] pr-2">
          {otherParticipants.map((participant) => (
            <div
              key={participant.sessionId}
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setDominantSpeaker(participant)}
            >
              <ParticipantView
                participant={participant}
                ParticipantViewUI={CustomParticipantViewUIBar}
                VideoPlaceholder={CustomVideoPlaceholder}
                className="w-full aspect-video"
              />
            </div>
          ))}
        </div>
      )}

      {/* Main speaker view */}
      <div className="flex-1 flex items-center justify-center">
        <ParticipantView
          participant={mainParticipant}
          ParticipantViewUI={CustomParticipantViewUISpotlight}
          VideoPlaceholder={CustomVideoPlaceholder}
          className="w-full h-full max-w-[1200px]"
        />
      </div>

      {/* Participants sidebar (right) */}
      {participantsBarPosition === "right" && otherParticipants.length > 0 && (
        <div className="flex flex-col gap-3 overflow-y-auto w-[280px] pl-2">
          {otherParticipants.map((participant) => (
            <div
              key={participant.sessionId}
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setDominantSpeaker(participant)}
            >
              <ParticipantView
                participant={participant}
                ParticipantViewUI={CustomParticipantViewUIBar}
                VideoPlaceholder={CustomVideoPlaceholder}
                className="w-full aspect-video"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSpeakerLayout;
