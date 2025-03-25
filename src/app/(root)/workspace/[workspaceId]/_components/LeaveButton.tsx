"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, LogOut, LogOutIcon, LucideLoader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const LeaveTeamButton = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLeave = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/workspace/leave", { method: "POST" });
      const data = await response.json();

      if (!response.ok || response.status !== 200) {
        throw new Error(data.message || "Failed to leave team");
      }

      toast.success(data.message);
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to leave team",
      );
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='destructive'
          className={cn(
            "justify-start rounded-md p-4 w-full",
            "transition-all duration-200 ease-in-out",
            "hover:bg-red-600/90 hover:scale-[0.98]",
            "active:scale-95",
          )}
          size='lg'
        >
          <span className='flex gap-2 items-center'>
            <LogOutIcon className='size-6' />
            Leave Team
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='size-6 text-destructive' />
            Leave Team
          </DialogTitle>
          <DialogDescription>
            You are about to leave this team.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='flex justify-end gap-4 sm:gap-0'>
          <Button
            variant='destructive'
            onClick={handleLeave}
            disabled={loading}
            className={cn(
              "transition-all duration-200 ease-in-out",
              loading && "bg-destructive/90 hover:bg-destructive/90",
            )}
          >
            {loading ? (
              <span className='flex gap-2 items-center'>
                <LucideLoader2 className='size-4 animate-spin' />
                Leaving...
              </span>
            ) : (
              <span className='flex gap-2 items-center'>
                <LogOut className='size-4' />
                Leave Team
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveTeamButton;
