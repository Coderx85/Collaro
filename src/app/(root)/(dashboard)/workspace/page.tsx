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
            <Link href={`/workspace/${org.slug}`} key={org.id}>
              <Card className="w-[300px] group cursor-pointer bg-sidebar glassmorphism dark:glassmorphism2 border border-border hover:shadow-md hover:bg-accent/30 transform transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold transition-all duration-300 transform group-hover:scale-105 text-foreground">
                    {org.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {org.logo && (
                    <p className="text-sm text-muted-foreground transition-all duration-300 group-hover:text-primary">
                      {org.logo}
                    </p>
                  )}
                  <p className="text-sm font-medium text-muted-foreground transition-all duration-300 group-hover:text-primary/80">
                    {org.slug}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Empty className="group transform transition-all duration-300 hover:scale-105">
            <EmptyHeader>
              <EmptyMedia className="text-muted-foreground group-hover:text-primary transition-all duration-300">
                <IconBuildingSkyscraper className="size-12" />
              </EmptyMedia>
              <EmptyTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-all duration-300">
                No Workspaces Found
              </EmptyTitle>
            </EmptyHeader>
            <EmptyDescription className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-all duration-300">
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
