"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { deleteWorkspace } from "@/action/workspace.actions";
import { useRouter } from "next/navigation";

interface DangerZoneProps {
  workspaceId: string;
  workspaceName: string;
}

export function DangerZone({ workspaceId, workspaceName }: DangerZoneProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const isConfirmValid = confirmName === workspaceName;

  async function handleDeleteWorkspace() {
    if (!isConfirmValid) {
      toast({
        title: "Invalid Confirmation",
        description: "Please type the workspace name correctly to confirm.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteWorkspace(workspaceId);

      if (result.success) {
        toast({
          title: "Workspace Deleted",
          description: "The workspace has been permanently deleted.",
        });
        setIsDialogOpen(false);
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete workspace.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/30 bg-red-500/5">
      <div>
        <h4 className="font-semibold">Delete Workspace</h4>
        <p className="text-sm text-muted-foreground">
          Permanently delete this workspace and all its data. This action cannot
          be undone.
        </p>
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isDeleting}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Workspace
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This will permanently delete the workspace &quot;
                <strong>{workspaceName}</strong>&quot; and remove all members,
                meetings, and recordings. This action cannot be undone.
              </p>
              <div className="space-y-2 pt-2">
                <Label htmlFor="confirm-name" className="text-foreground">
                  Type <strong>{workspaceName}</strong> to confirm:
                </Label>
                <Input
                  id="confirm-name"
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  placeholder="Enter workspace name"
                  className="border-red-500/50 focus:border-red-500"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmName("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWorkspace}
              disabled={!isConfirmValid || isDeleting}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Workspace"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
