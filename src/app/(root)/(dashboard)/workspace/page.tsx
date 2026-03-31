import { headers } from "next/headers";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import {
  IconArrowRight,
  IconBuildingSkyscraper,
  IconPlus,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const WorkspacePage = async () => {
  let workspaceLoadError = false;
  let workspaces: Awaited<ReturnType<typeof auth.api.listOrganizations>> = [];

  try {
    workspaces = await auth.api.listOrganizations({
      headers: await headers(),
    });
  } catch (error) {
    workspaceLoadError = true;
    console.error("Failed to load workspaces", error);
  }

  const workspaceCount = workspaces.length;

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden px-6 pb-12 pt-6 md:px-10 md:pt-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-6rem] h-96 w-96 rounded-full bg-primary/8 blur-[160px]" />
        <div className="absolute bottom-[-6rem] left-0 h-96 w-96 rounded-full bg-secondary/8 blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl flex-1 space-y-8">
        <section className="relative overflow-hidden rounded-2xl border p-6 md:p-8">
          <div className="relative grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                {workspaceCount} {workspaceCount === 1 ? "workspace" : "workspaces"}
              </span>
              <h1
                className={`${displayFont.className} text-3xl font-semibold tracking-tight text-foreground md:text-4xl`}
              >
                Workspaces
              </h1>
              <p className="max-w-md text-sm text-muted-foreground">
                Your hub for teams, projects, and collaboration.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl border border-border/50 bg-background/60 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconUsers className="size-4" />
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">
                  Real-time sync
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Stay aligned across projects.
                </p>
              </div>
              <div className="flex-1 rounded-xl border border-border/50 bg-background/60 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <IconSparkles className="size-4" />
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">
                  Instant setup
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Invite collaborators in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="space-y-5">
          {workspaceLoadError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              We could not load your workspaces right now. Please try again in a
              moment.
            </div>
          ) : null}

          <div className="flex items-center justify-end">
            <Button asChild className="group rounded-full px-5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">
              <Link href="/workspace/new">
                New workspace
                <IconPlus className="ml-2 size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-90" />
              </Link>
            </Button>
          </div>

          {workspaceCount > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {workspaces.map((workspace) => (
                <Link href={`/workspace/${workspace.slug}`} key={workspace.id}>
                  <Card className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]">
                    <div className="relative flex h-full flex-col justify-between gap-5 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/15">
                            <IconBuildingSkyscraper className="size-5" />
                          </div>
                          <div>
                            <h3
                              className={`${displayFont.className} text-base font-semibold text-foreground`}
                            >
                              {workspace.name}
                            </h3>
                            <p className="text-[11px] text-muted-foreground">
                              /{workspace.slug}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="h-1 w-1 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/40 pt-4">
                        <p className="text-xs text-muted-foreground">
                          Open workspace
                        </p>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-[background-color,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-primary group-hover:text-primary-foreground">
                          <IconArrowRight className="size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}

              <Link href="/workspace/new">
                <Card className="group relative flex h-full min-h-[180px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/60 bg-muted/20 transition-[transform,border-color,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-primary/50 hover:bg-muted/30 active:scale-[0.98]">
                  <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105">
                      <IconPlus className="size-5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-90" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        New workspace
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Create a team space
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 px-8 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <IconBuildingSkyscraper className="size-6" />
              </div>
              <h3
                className={`${displayFont.className} mt-4 text-lg font-semibold text-foreground`}
              >
                Create your first workspace
              </h3>
              <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted-foreground">
                Set up a dedicated space for your team to collaborate.
              </p>
              <Button asChild className="mt-5 rounded-full px-5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">
                <Link href="/workspace/new">
                  Get started
                  <IconArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-5 rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className={`${displayFont.className} text-base font-semibold text-foreground`}>
              Join an existing workspace
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Been invited? Enter the workspace slug to request access.
            </p>
          </div>
          <Button asChild variant="secondary" className="group shrink-0 rounded-full px-5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">
            <Link href="/workspace/join">
              Request to join
              <IconArrowRight className="ml-2 size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default WorkspacePage;
