import { Separator } from "@/components/ui/separator";
import { Building2, Users, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentMemberRole } from "@/action/member";
import { InviteMemberDialog } from "@/components/workspace/members/InviteMemberDialog";
import MembersTable from "@/components/workspace/meeting/charts/members-table";
import { getFullWorkspaceDetail } from "@/action";
import { checkWorkspaceAccess } from "@/lib/workspace-auth";
import { redirect } from "next/navigation";
import { TWorkspaceSlug } from "@/types";

export default async function OrgDetailsPage({
  params,
}: {
  params: Promise<{ slug: TWorkspaceSlug }>;
}) {
  const { slug } = await params;
  const stringSlug = String(slug);
  await checkWorkspaceAccess(stringSlug);

  const role = await getCurrentMemberRole(slug);
  const res = await getFullWorkspaceDetail(stringSlug);

  if (!role.success) {
    redirect(`/workspace/${slug}`);
  }

  if (!res.success) {
    redirect(`/workspace/${slug}`);
  }

  const activeOrg = res.data;
  const currentRole = role.data ?? "member";

  return (
    <div className="container space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between py-5">
        <h2 className="text-3xl flex items-center gap-2 font-bold tracking-tight">
          <Building2 className="h-8 w-8" />
          Organization Details
        </h2>
        <p className="text-muted-foreground">
          View and manage your organization settings.
        </p>
      </div>

      <Separator />

      {/* Organization Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={
                    activeOrg?.logoUrl ||
                    `https://gravatar.com/avatar/${activeOrg?.id}`
                  }
                  alt={activeOrg?.name || "Workspace"}
                />
                <AvatarFallback className="text-xl">
                  {activeOrg?.name?.charAt(0).toUpperCase() || "W"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{activeOrg?.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span className="text-muted-foreground">
                    /{activeOrg?.slug}
                  </span>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {currentRole === "owner" && (
                <InviteMemberDialog
                  workspaceId={String(activeOrg.id)}
                  workspaceSlug={stringSlug}
                />
              )}
              <Badge className="text-sm">
                <Shield className="h-3 w-3 mr-1" />
                {currentRole.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Users className="size-7 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-2xl font-bold">
                  {activeOrg.members.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Shield className="size-7 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Your Role</p>
                <p className="text-2xl font-bold capitalize">
                  {currentRole}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Building2 className="size-7 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold text-green-500">Active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <MembersTable members={activeOrg.members} />
    </div>
  );
}
