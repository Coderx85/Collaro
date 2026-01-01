"use client";
import { useState } from "react";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CustomParticipantViewUI,
  CustomVideoPlaceholder,
  CustomParticipantViewUISpotlight,
  CustomParticipantViewUIBar,
} from "./participant/CustomParticipantView";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "@/components/Loader";
import EndCallButton from "@/components/workspace/calls/EndCallButton";
import { cn } from "@/lib/utils";
import { IconLayoutListFilled, IconUsers } from "@tabler/icons-react";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        // Use PaginatedGridLayout with custom UI components
        return (
          <PaginatedGridLayout
            VideoPlaceholder={CustomVideoPlaceholder}
            ParticipantViewUI={CustomParticipantViewUI}
          />
        );
      case "speaker-right":
        // Use SpeakerLayout with separate UI for spotlight and bar
        return (
          <SpeakerLayout
            participantsBarPosition="left"
            VideoPlaceholder={CustomVideoPlaceholder}
            ParticipantViewUISpotlight={CustomParticipantViewUISpotlight}
            ParticipantViewUIBar={CustomParticipantViewUIBar}
          />
        );
      default:
        // speaker-left
        return (
          <SpeakerLayout
            participantsBarPosition="right"
            VideoPlaceholder={CustomVideoPlaceholder}
            ParticipantViewUISpotlight={CustomParticipantViewUISpotlight}
            ParticipantViewUIBar={CustomParticipantViewUIBar}
          />
        );
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex h-full size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn("h-full hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      {/* video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls onLeave={() => router.push(`/`)} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <IconLayoutListFilled size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <IconUsers size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
