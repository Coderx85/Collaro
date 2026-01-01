"use client";

import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInvitation } from "@/action/invitation.action";
import { IconUser, IconUserPlus, IconUserStar } from "@tabler/icons-react";

interface InviteMemberDialogProps {
  workspaceId: string;
  workspaceSlug: string;
}

type RoleType = "admin" | "member";

export function InviteMemberDialog({
  workspaceId,
  workspaceSlug,
}: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleType>("member");
  const [selectRole, setSelectRole] = useState<RoleType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createInvitation({
        workspaceId,
        workspaceSlug,
        email: email.trim(),
        role,
      });

      if (result.success) {
        toast.success(`Invitation sent to ${email}`);
        setEmail("");
        setRole("member");
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <IconUserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-accent">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-black dark:text-secondary">
              Invite Team Member
            </DialogTitle>
            <DialogDescription className="mt-2 dark:text-secondary">
              Send an invitation email to add a new member to your workspace.
              The invite link will expire in 7 days.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            <div className="grid gap-3">
              <Label htmlFor="email" className="dark:text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={`name@${workspaceSlug}.com`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Select
                required
                value={role}
                onValueChange={(value: string) => {
                  setRole(value as RoleType);
                  setSelectRole(value as RoleType);
                }}
                disabled={isLoading}
              >
                <SelectTrigger
                  className="w-full p-2 text-black/50 dark:text-secondary/75"
                  id="role"
                >
                  <SelectValue>
                    {selectRole ? selectRole : "Select a role"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="mt-2">
                  <SelectItem value="member" className="w-full">
                    <div className="flex items-center w-full">
                      <IconUser className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="font-medium">Member</span>
                        <span className="text-xs text-muted-foreground">
                          Can view and participate in meetings
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex gap-0.5 items-center">
                      <IconUserStar className="mr-2 h-4 w-4 items-center" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Admin</span>
                        <span className="text-xs text-muted-foreground">
                          Can manage members and settings
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="dark:text-secondary/75"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
