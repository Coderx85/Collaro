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
import { auth } from "@/lib/auth-config";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/dal";
import { getMember } from "@/action/member.action";
import { InviteMemberDialog } from "@/components/workspace/members/InviteMemberDialog";
import { TOrganizationMember } from "@/types";
import MembersTable from "@/components/workspace/meeting/charts/members-table";

export default async function OrgDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const activeOrg = await auth.api.getFullOrganization({
    query: {
      organizationSlug: slug,
    },
    headers: await headers(),
  });

  if (!activeOrg) {
    throw new Error("Organization not found");
  }

  const orgMember = await getMember(slug, user.id);

  if (!orgMember || !orgMember.success || !orgMember?.data) {
    throw new Error("Organization member not found");
  }

  const role = orgMember.data as TOrganizationMember;

  const workspace = { ...activeOrg, member: orgMember };

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
                    activeOrg?.logo ||
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
              {orgMember?.data?.role === "owner" && (
                <InviteMemberDialog
                  workspaceId={activeOrg.id}
                  workspaceSlug={slug}
                />
              )}
              <Badge className="text-sm">
                <Shield className="h-3 w-3 mr-1" />
                {orgMember?.data?.role}
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
                  {activeOrg?.members.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Shield className="size-7 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Your Role</p>
                <p className="text-2xl font-bold capitalize">
                  {orgMember?.data?.role}
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

      <MembersTable workspaceSlug={slug} />
    </div>
  );
}
