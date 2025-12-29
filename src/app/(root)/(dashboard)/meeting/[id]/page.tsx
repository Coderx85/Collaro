"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";

import { useGetCallById } from "@/hooks/useGetCallById";
import Alert from "@/components/Alert";
import { MeetingRoom, MeetingSetup } from "@/components/workspace/meeting";

const MeetingPage = () => {
  const { id } = useParams();
  const { data: session, isPending } = useSession();
  const { call, isCallLoading } = useGetCallById(id!);
  console.log("Call Details:", call);
  console.log("Call isLoading:", isCallLoading);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (isPending || isCallLoading) return <Loader />;

  if (!call)
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );

  // get more info about custom call type:  https://getstream.io/video/docs/react/guides/configuring-call-types/
  const notAllowed =
    call.type === "invited" &&
    (!session?.user ||
      !call.state.members.find((m) => m.user.id === session.user.id));

  if (notAllowed)
    return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
