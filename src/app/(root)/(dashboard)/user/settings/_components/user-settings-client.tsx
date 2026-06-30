"use client";

import { type ComponentProps, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Save,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { IMemberDTO, IUserDTO, IWorkspaceDTO, TUserRole, TFullUserWorkspaceDetail as TUserWorkspace } from "@/types";
import z from "zod";
import { UpdateUserSchema } from "@/db/schema/type";
import { useForm } from "@tanstack/react-form";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { IconAlertTriangle, IconAt, IconBubbleTea2, IconCheck, IconLoader2, IconMail, IconUser } from "@tabler/icons-react";
import { UpdateUserForm } from "@/components/form/update-user-form";
import { Empty, EmptyHeader } from "@/components/ui/empty";
import { toast } from "sonner";
import { deleteWorkspaceAction, leaveOrganizationAction } from "@/action";

type Params = {
  workspaces: readonly TUserWorkspace[];
}

type TBadge = NonNullable<ComponentProps<typeof Badge>["variant"]>;

const roleBadgeVariant: Record<TUserRole, TBadge> = {
  owner: "destructive",
  admin: "default",
  member: "outline",
} 

export function UserSettingsClient({ workspaces }: Params) {
  const router = useRouter();

  const [selectedOrg, setSelectedOrg] = useState<TUserWorkspace | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

  const [isSaving, startSavingTransition] = useTransition();
  const [isOrgActionPending, startOrgActionTransition] = useTransition();

  // const handleSaveProfile = () => {
  //   if (name.trim().length < 2) {
  //     toast.error("Name must be at least 2 characters.");
  //     return;
  //   }

  //   if (userName.trim().length < 2) {
  //     toast.error("Username must be at least 2 characters.");
  //     return;
  //   }

  //   startSavingTransition(async () => {
  //     const result = await updateCurrentUserProfile({
  //       name: name.trim(),
  //       userName: userName.trim(),
  //     });

  //     if (!result.success) {
  //       toast.error(result.error || "Failed to update profile.");
  //       return;
  //     }

  //     toast.success("Profile updated successfully.");
  //     router.refresh();
  //   });
  // };

  const openOrgActionDialog = (organization: TUserWorkspace) => {
    setSelectedOrg(organization);
    setIsActionDialogOpen(true);
  };

  const handleOrganizationAction = () => {
    if (!selectedOrg) {
      return;
    }

    startOrgActionTransition(async () => {
      const result =
        selectedOrg.userDetail.role === "owner"
          ? await deleteWorkspaceAction(selectedOrg.id)
          : await leaveOrganizationAction(selectedOrg.id);

      if (!result.success) {
        toast.error(result.error || "Action failed.");
        return;
      }

      const successText =
        selectedOrg.userDetail.role === "owner"
          ? `Organization ${selectedOrg.name} deleted.`
          : `You left ${selectedOrg.name}.`;

      toast.success(successText);
      setIsActionDialogOpen(false);
      setSelectedOrg(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building2 className="size-5" />
            Manage Your Organizations.
          </CardTitle>
          <CardDescription>
            Review your organizations, see your role, and manage membership.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workspaces.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <IconBubbleTea2 className="size-6" />
                  <h2 className="text-lg font-semibold">No organizations yet</h2>
                  <p className="text-sm text-muted-foreground">
                    You haven't joined or created any organizations. Start by creating a new organization or ask your administrator for an invite.
                  </p>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {workspaces.map((workspace) => {
                const isOwner = workspace.userDetail.role === "owner";

                return (
                  <div
                    key={String(workspace.id)}
                    className="rounded-xl border border-border/60 bg-background/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold">{workspace.name}</h3>
                        <p className="text-xs text-muted-foreground">/{workspace.slug}</p>
                      </div>
                      <Badge variant={roleBadgeVariant[workspace.userDetail.role]}>
                        {workspace.userDetail.role}
                      </Badge>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        variant={isOwner ? "destructive" : "outline"}
                        onClick={() => openOrgActionDialog(workspace)}
                        disabled={isOrgActionPending}
                      >
                        {isOwner ? (
                          <>
                            <Trash2 className="size-4" />
                            Delete Organization
                          </>
                        ) : (
                          "Leave Organization"
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <IconAlertTriangle className="size-5 text-destructive" />
              {selectedOrg?.userDetail.role === "owner" ? "Delete organization?" : "Leave organization?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedOrg?.userDetail.role === "owner"
                ? `This will permanently delete ${selectedOrg?.name} and all related data. This action cannot be undone.`
                : `You will lose access to ${selectedOrg?.name}. You can only rejoin if invited again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isOrgActionPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleOrganizationAction();
              }}
              disabled={isOrgActionPending}
              className={selectedOrg?.userDetail.role === "owner" ? "bg-destructive text-white hover:bg-destructive/90" : ""}
            >
              {isOrgActionPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Processing...
                </>
              ) : selectedOrg?.userDetail.role === "owner" ? (
                "Delete"
              ) : (
                "Leave"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
