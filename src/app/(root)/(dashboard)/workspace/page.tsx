import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
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
import { JoinWorkspaceForm } from "./_components/join-workspace-form";
import { Separator } from "@/components/ui/separator";

const WorkspacePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const org = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return (
    <div className="relative p-6 md:p-10 space-y-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-6 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-secondary/25 blur-3xl" />
      </div>

      {/* Header Section */}
      <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-sm glassmorphism dark:glassmorphism2">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Workspace Hub
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Your Workspaces
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your workspaces or join an existing one
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 px-5 py-4 text-sm text-muted-foreground shadow-sm">
            Stay in sync with your team across projects, meetings, and rooms.
          </div>
        </div>
      </div>

      <Separator />

      {/* Create Workspace Section */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Your Workspaces
          </h2>
          <p className="text-sm text-muted-foreground">
            Workspaces you have created or are a member of
          </p>
        </div>

        {org.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {org.map((org) => (
              <Link href={`/workspace/${org.slug}`} key={org.id}>
                <Card className="group h-full w-full cursor-pointer border border-border/70 bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground transition-transform duration-300 group-hover:scale-[1.02]">
                      {org.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {org.logo && (
                      <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-primary">
                        {org.logo}
                      </p>
                    )}
                    <div className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors duration-300 group-hover:border-primary/40 group-hover:text-primary">
                      {org.slug}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Create New Workspace Card */}
            <Link href="/workspace/new">
              <Card className="group flex min-h-[210px] h-full w-full cursor-pointer items-center justify-center border-2 border-dashed border-border bg-card/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5">
                <CardContent className="text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105">
                      <IconBuildingSkyscraper className="size-7" />
                    </div>
                    <p className="font-semibold text-foreground">
                      Create New Workspace
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Start a new workspace
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/70 p-8 text-center shadow-sm">
            <Empty className="w-full">
              <EmptyHeader>
                <EmptyMedia className="text-muted-foreground">
                  <IconBuildingSkyscraper className="size-12" />
                </EmptyMedia>
                <EmptyTitle className="text-lg font-semibold text-foreground">
                  No Workspaces Yet
                </EmptyTitle>
              </EmptyHeader>
              <EmptyDescription className="text-sm text-muted-foreground">
                You haven't created any workspaces yet
              </EmptyDescription>
            </Empty>

            <div className="mt-6 flex justify-center">
              <Link
                href="/workspace/new"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                Create First Workspace
              </Link>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Join Workspace Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Join a Workspace
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Request to join an existing workspace
          </p>
        </div>

        <div className="max-w-2xl rounded-2xl border border-border bg-card/80 p-6 shadow-sm">
          <JoinWorkspaceForm />
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
