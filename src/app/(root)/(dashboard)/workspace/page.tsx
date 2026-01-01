import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconBuildingSkyscraper } from "@tabler/icons-react";

const WorkspacePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const org = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return (
    <div className="mx-auto flex h-full flex-col py-15 items-center justify-center rounded-sm">
      {/* <WorkspaceForm /> */}
      <h1 className="text-xl font-bold">Your Workspace</h1>
      {/* {session?.session?.activeOrganizationId} */}
      <div className="mx-auto flex h-full flex-col py-15 items-center justify-center rounded-sm">
        <h1 className="text-3xl font-bold">Your Workspace</h1>
        <Link
          href="/workspace/new"
          className="mt-5 bg-accent hover:opacity-60 dark:text-accent dark:bg-white/75 py-3 px-2.5 rounded-xl"
        >
          Create Workspace
        </Link>
      </div>
      <div className="flex gap-5 mt-5">
        {org.length > 0 ? (
          org.map((org) => (
            <Card
              key={org.id}
              className="w-[300px] bg-primary text-primary-foreground"
            >
              <CardHeader className="pb-2">
                <CardTitle>{org.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{org.logo}</p>
                <Link href={`/workspace/${org.slug}`} key={org.id}>
                  <p className="text-sm text-muted-foreground">{org.slug}</p>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No Workspaces Found</EmptyTitle>
              <EmptyMedia>
                <IconBuildingSkyscraper />
              </EmptyMedia>
            </EmptyHeader>
            <EmptyDescription>
              You have not created any workspaces yet. Get started by creating a
              new workspace.
            </EmptyDescription>
          </Empty>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
