"use client";

import { useCallStateHooks } from "@stream-io/video-react-sdk";
import CustomParticipantView from "./CustomParticipantView";
import { useWorkspaceStore } from "@/store/workspace";

const CustomGridLayout = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  // Get workspace slug from store
  const { workspaceSlug } = useWorkspaceStore();

  // Calculate grid layout based on participant count
  const getGridLayout = (count: number) => {
    if (count === 1) {
      return {
        cols: "grid-cols-1",
        rows: "grid-rows-1",
        maxWidth: "max-w-[1200px]",
        aspectRatio: "aspect-video",
      };
    }
    if (count === 2) {
      return {
        cols: "grid-cols-1 md:grid-cols-2",
        rows: "md:grid-rows-1",
        maxWidth: "max-w-[1600px]",
        aspectRatio: "aspect-video",
      };
    }
    if (count <= 4) {
      return {
        cols: "grid-cols-2",
        rows: "grid-rows-2",
        maxWidth: "max-w-[1400px]",
        aspectRatio: "aspect-video",
      };
    }
    if (count <= 6) {
      return {
        cols: "grid-cols-2 lg:grid-cols-3",
        rows: "grid-rows-2",
        maxWidth: "max-w-[1600px]",
        aspectRatio: "aspect-video",
      };
    }
    if (count <= 9) {
      return {
        cols: "grid-cols-2 md:grid-cols-3",
        rows: "grid-rows-3",
        maxWidth: "max-w-[1800px]",
        aspectRatio: "aspect-video",
      };
    }
    return {
      cols: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      rows: "grid-rows-4",
      maxWidth: "max-w-full",
      aspectRatio: "aspect-video",
    };
  };

  const layout = getGridLayout(participants.length);

  // Only render if we have workspace slug
  if (!workspaceSlug) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
            <span className="text-3xl">👥</span>
          </div>
          <p className="text-slate-400">Waiting for participants to join...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full p-3 md:p-4 lg:p-6 bg-slate-950">
      <div
        className={`grid ${layout.cols} ${layout.rows} gap-3 md:gap-4 w-full h-full ${layout.maxWidth}`}
      >
        {participants.map((participant) => (
          <div
            key={participant.sessionId}
            className="min-h-0 min-w-0 flex items-center justify-center"
          >
            <CustomParticipantView
              participant={participant}
              workspaceSlug={workspaceSlug}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomGridLayout;
