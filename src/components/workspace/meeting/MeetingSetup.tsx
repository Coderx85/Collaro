"use client";

import { useEffect, useState } from "react";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useSession } from "@/lib/auth-client";
import { motion } from "motion/react";
import { checkWorkspaceMeetingAcces } from "@/action";
import { usePathname } from "next/navigation";
import { useWorkspaceStore } from "@/store/workspace";
import Alert from "@/components/Alert";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TUserRole } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconLoader2,
  IconSettings,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons-react";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const { data: session, isPending: sessionLoading } = useSession();
  const pathname = usePathname();
  const meetingId = pathname.split("/").pop() || "";
  const { workspaceId } = useWorkspaceStore();

  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState<TUserRole>("member");
  const [isMicCamOff, setIsMicCamOff] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();

  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error(
      "useStreamCall must be used within a StreamCall component.",
    );
  }

  // Fetch user role and verify access
  useEffect(() => {
    const verifyAccess = async () => {
      if (!session?.user?.id || !workspaceId || !meetingId) {
        if (
          !sessionLoading &&
          (!session?.user?.id || !workspaceId || !meetingId)
        ) {
          setIsChecking(false);
        }
        return;
      }

      try {
        const result = await checkWorkspaceMeetingAcces(
          meetingId,
          workspaceId,
          session.user.id,
        );

        if (result.success) {
          setUserRole(result.data.role);
          setIsValid(true);
        } else {
          const errorMsg =
            result.error || "You don't have access to this meeting";

          setIsValid(false);
          setErrorMessage(errorMsg);
        }
      } catch (error) {
        console.error("Failed to verify meeting access:", error);
        setIsValid(false);
        setErrorMessage("An error occurred while verifying access");
      } finally {
        setIsChecking(false);
      }
    };

    verifyAccess();
  }, [session?.user?.id, workspaceId, meetingId, sessionLoading]);

  // Handle mic/cam toggle
  useEffect(() => {
    if (isMicCamOff) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamOff, call.camera, call.microphone]);

  const handleJoinMeeting = async () => {
    setIsJoining(true);
    try {
      await call.join({
        data: {
          custom: {
            role: userRole,
            name: session?.user?.name || "",
            email: session?.user?.email || "",
          },
        },
      });
      setIsSetupComplete(true);
    } catch (error) {
      console.error("Failed to join meeting:", error);
    } finally {
      setIsJoining(false);
    }
  };

  if (isChecking || sessionLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <IconLoader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">
            Verifying meeting access...
          </p>
        </div>
      </div>
    );
  }

  if (callTimeNotArrived) {
    return (
      <Alert
        title={`Your meeting is scheduled for ${callStartsAt.toLocaleString()}. Please come back then.`}
      />
    );
  }

  if (callHasEnded) {
    return (
      <Alert
        title="This meeting has already ended."
        iconUrl="/icons/call-ended.svg"
      />
    );
  }

  if (isValid === false) {
    return <Alert title={errorMessage} />;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-background via-background to-muted/20 p-4 font-sans text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="flex flex-col items-center justify-center overflow-hidden border-none">
          <CardContent className="p-8 bg-card/50 backdrop-blur-xl shadow-2xl">
            <div className="flex sm:flex-col lg:flex-row px-4 py-8 border border-red-500">
              {/* Left Column: Preview */}
              <div className="w-3/5">
                {/* <div className="overflow-hidden rounded-2xl border bg-black/40 shadow-inner"> */}
                <VideoPreview className="w-full object-cover" />
                {/* </div> */}
              </div>

              {/* Right Column: Info & Actions */}
              <div className="flex flex-col justify-center gap-8 w-2/5">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Ready to join?
                  </h1>
                  <p className="text-muted-foreground">
                    Check your audio and video settings before jumping in.
                  </p>
                </div>

                <div className="space-y-6">
                  {" "}
                  <div className="flex items-center justify-between rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      {isMicCamOff ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full">
                          <IconVideoOff size={20} />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <IconVideo size={20} />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">Camera & Mic</p>
                        <p className="text-xs text-muted-foreground">
                          {isMicCamOff ? "Turned off" : "Active"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isMicCamOff}
                      onCheckedChange={setIsMicCamOff}
                    />
                  </div>
                  <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-background/50 p-4 transition-colors hover:bg-muted/30">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <IconSettings size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        Device Configuration
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Change speaker, mic or camera
                      </p>
                    </div>
                    <DeviceSettings />
                  </div>
                  <div className="pt-4">
                    <Button
                      size="lg"
                      className="h-14 w-full rounded-2xl bg-primary text-lg font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                      onClick={handleJoinMeeting}
                      disabled={isJoining}
                    >
                      {isJoining ? (
                        <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : null}
                      {isJoining ? "Joining..." : "Join Meeting"}
                    </Button>
                    <p className="mt-4 text-center text-xs text-muted-foreground">
                      Joining as{" "}
                      <span className="font-medium text-foreground">
                        {session?.user?.name}
                      </span>{" "}
                      ({userRole})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MeetingSetup;
