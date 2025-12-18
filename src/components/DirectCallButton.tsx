"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/lib/auth-client";
import { useWorkspaceStore } from "@/store/workspace";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import Loader from "./Loader";

interface DirectCallButtonProps {
  memberId: string;
  memberName: string;
}

const DirectCallButton = ({ memberId, memberName }: DirectCallButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCallStarting, setIsCallStarting] = useState(false);
  const router = useRouter();
  const client = useStreamVideoClient();
  const { data: session, isPending } = useSession();
  const { toast } = useToast();
  const { workspaceName } = useWorkspaceStore();

  const startDirectCall = async () => {
    if (!client || !session?.user) return;

    try {
      setIsCallStarting(true);

      // Create a unique meeting ID
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      // Completely restructured call creation to follow the exact API format
      await call.getOrCreate({
        notify: true,
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            description: `Direct call with @${memberName}`,
            callType: "direct",
          },
          members: [{ user_id: memberId, role: "call_member" }],
          team: workspaceName || "Workspace",
        },
      });

      // Navigate to the call page
      router.push(`/meeting/${call.id}`);

      toast({
        title: "Calling member...",
        description: `Connecting to ${memberName}`,
      });
    } catch (error) {
      toast({
        title: `Failed to start call with because: \n${error}`,
        variant: "destructive",
      });
    } finally {
      setIsCallStarting(false);
      setIsDialogOpen(false);
    }
  };

  if (isPending || !client || !session?.user) return <Loader />;

  return (
    <>
      <Button
        variant="outline"
        size={"sm"}
        className="rounded-full"
        onClick={() => setIsDialogOpen(true)}
        title={`Call ${memberName}`}
      >
        <PhoneCall className="h-4 w-4" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Call {memberName}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-6 py-4">
            <p>Start a direct video call with {memberName}?</p>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>

              <Button onClick={startDirectCall} disabled={isCallStarting}>
                {isCallStarting ? <Loader /> : "Start Call"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DirectCallButton;
