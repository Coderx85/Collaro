import { Separator } from "@/components/ui/separator";
import { Settings, Shield, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth-config";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/dal";
import { getMember } from "@/action/member.action";
import { redirect } from "next/navigation";
import { OrgSettingsForm } from "./_components/org-settings-form";
import { DangerZone } from "./_components/danger-zone";

type OrgMemberRole = "owner" | "admin" | "member";

export default async function OrgSettingsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const activeOrg = await auth.api.getFullOrganization({
    query: {
      organizationSlug: slug,
    },
    headers: await headers(),
  });

  if (!activeOrg) {
    redirect(`/workspace/${slug}`);
  }

  const orgMember = await getMember(slug, user.id);

  if (!orgMember || !orgMember.data) {
    redirect(`/workspace/${slug}`);
  }

  const userRole = orgMember.data.role as OrgMemberRole;

  // Only allow owner and admin to access this page
  if (userRole === "member") {
    redirect(`/workspace/${slug}/org-details`);
  }

  const canDelete = userRole === "owner";
  const canUpdate = userRole === "owner" || userRole === "admin";

  return (
    <div className="space-y-8 p-2 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl flex items-center gap-2 font-bold tracking-tight">
            <Settings className="h-8 w-8" />
            Organization Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your organization settings and preferences.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium capitalize">{userRole}</span>
        </div>
      </div>

      <Separator />

      {/* Settings Form */}
      {canUpdate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Basic Settings</CardTitle>
            <CardDescription>
              Update your workspace name and details. Changes will be reflected
              across the entire organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrgSettingsForm
              workspaceId={activeOrg.id}
              initialName={activeOrg.name}
              initialSlug={activeOrg.slug}
            />
          </CardContent>
        </Card>
      )}

      {/* Danger Zone - Only for Owner */}
      {canDelete && (
        <Card className="border-red-500/50">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              These actions are irreversible. Please proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DangerZone
              workspaceId={activeOrg.id}
              workspaceName={activeOrg.name}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
